/**
 * 模块 05 拓展 · 生态系统三维推演（零依赖）
 * 数据来源：src/data/sandbox.json —— caseBackground.subjects / timeline / profile
 * 实现方式：自研极简透视投影（DOM 节点 + SVG 连线/同心环），不引入 Three.js，
 *          仅在拖拽、惯性、自动旋转时按需 requestAnimationFrame，空闲时零渲染开销。
 */
import caseData from '../data/sandbox.json'
import './sandbox3d.css'

/* ------------------------------------------------------------------ 数据 */

const bg = (caseData && caseData.caseBackground) || {}
const SUBJECTS = Array.isArray(bg.subjects) ? bg.subjects : []
const TIMELINE = Array.isArray(bg.timeline) ? bg.timeline : []
const PROFILE = Array.isArray(bg.profile) ? bg.profile : []
const CASE_INFO = (caseData && caseData.caseInfo) || {}

/** 四个层级对应的同心环（由内至外：微观 → 宏观），半径以最外环为 1 */
const LAYERS = [
  { key: '微观', label: '微观系统', en: 'MICROSYSTEM', radius: 0.36 },
  { key: '中观', label: '中观系统', en: 'MESOSYSTEM', radius: 0.63 },
  { key: '外系统', label: '外系统', en: 'EXOSYSTEM', radius: 0.86 },
  { key: '宏系统', label: '宏观系统', en: 'MACROSYSTEM', radius: 1 },
]
const LAYER_BY_KEY = new Map(LAYERS.map((l) => [l.key, l]))
const LAYER_ORDER = new Map(LAYERS.map((l, i) => [l.key, i]))

/** 事件描述中的关键词 → 主体节点的补充关联（关键词取自案例材料用语） */
const HINTS = [
  { words: ['家属', '家庭', '女儿', '告别式'], test: (n) => /女儿/.test(n.name) },
  { words: ['案主'], test: (n) => n.isCenter },
  { words: ['医生'], test: (n) => /医生/.test(n.name) },
  { words: ['护士', '护理'], test: (n) => /护理团队|护士长/.test(n.name) },
  { words: ['社工'], test: (n) => /医务社工/.test(n.name) },
  { words: ['志愿者', '音乐', '触觉', '非语言', '四道人生'], test: (n) => /志愿者/.test(n.name) },
  { words: ['机构', '协作', '计划', '团队'], test: (n) => /协作团队/.test(n.name) },
  { words: ['政策', '制度', '规范', '药政', '分级诊疗', '转诊'], test: (n) => /政策与制度/.test(n.name) },
]

/* -------------------------------------------------------------- 场景数据 */

const NODES = buildNodes()

function buildNodes() {
  const list = SUBJECTS.map((s, i) => {
    const level = String(s.level || '').trim()
    const primary = level.split('/')[0].trim()
    return {
      id: `n${i}`,
      name: String(s.name || ''),
      level,
      levelEn: String(s.levelEn || ''),
      note: String(s.note || ''),
      primary,
      isCenter: /许姨/.test(String(s.name || '')),
      x: 0,
      z: 0,
      baseX: 0,
      baseZ: 0,
      el: null,
      halfW: 44,
      halfH: 20,
    }
  })

  const rings = new Map()
  list.forEach((n) => {
    if (n.isCenter || !LAYER_BY_KEY.has(n.primary)) return
    if (!rings.has(n.primary)) rings.set(n.primary, [])
    rings.get(n.primary).push(n)
  })

  rings.forEach((group, key) => {
    const layer = LAYER_BY_KEY.get(key)
    const offset = LAYER_ORDER.get(key) * 0.42
    group.forEach((n, i) => {
      const a = -Math.PI / 2 + offset + (i * Math.PI * 2) / group.length
      n.baseX = Math.cos(a) * layer.radius
      n.baseZ = Math.sin(a) * layer.radius
      n.x = n.baseX
      n.z = n.baseZ
    })
  })

  // 兜底：层级缺失的主体放入最外环，避免节点丢失
  list
    .filter((n) => !n.isCenter && !LAYER_BY_KEY.has(n.primary))
    .forEach((n, i) => {
      const a = -Math.PI / 2 + i * 0.9
      n.x = Math.cos(a)
      n.z = Math.sin(a)
    })

  return list
}

const CENTER_NODE = NODES.find((n) => n.isCenter) || NODES[0] || null

/* -------------------------------------------------------------- 运行状态 */

const REDUCED = typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const view = {
  yaw: -0.62,
  pitch: 0.72,
  zoom: 1,
  dist: 3.6,
  minPitch: 0.18,
  maxPitch: 1.24,
  minZoom: 0.78,
  maxZoom: 1.2,
}

const state = {
  step: -1,
  activeLayers: new Set(),
  activeNodes: new Set(),
  selected: CENTER_NODE ? CENTER_NODE.id : null,
  playing: false,
  autoRotate: false,
  spin: 0,
  dragging: false,
  moved: 0,
}

const size = { w: 0, h: 0 }

/* -------------------------------------------------------------------- DOM */

const stage = document.getElementById('stage')
const svg = document.getElementById('stageSvg')
const ringGroup = document.getElementById('ringGroup')
const linkGroup = document.getElementById('linkGroup')
const ringLabelLayer = document.getElementById('ringLabelLayer')
const nodeLayer = document.getElementById('nodeLayer')
const layerBadge = document.getElementById('layerBadge')
const legend = document.getElementById('legend')
const detailBody = document.getElementById('detailBody')
const tlSteps = document.getElementById('tlSteps')
const tlEvent = document.getElementById('tlEvent')
const tlHighlight = document.getElementById('tlHighlight')
const btnAuto = document.getElementById('btnAuto')
const btnZoomIn = document.getElementById('btnZoomIn')
const btnZoomOut = document.getElementById('btnZoomOut')
const btnResetView = document.getElementById('btnResetView')
const btnPrev = document.getElementById('btnPrev')
const btnNext = document.getElementById('btnNext')
const btnPlay = document.getElementById('btnPlay')
const btnResetTl = document.getElementById('btnResetTl')

const SVG_NS = 'http://www.w3.org/2000/svg'
const RING_SEGMENTS = 60
const PAD = 18

/* --------------------------------------------------------------- 场景构建 */

const ringPaths = LAYERS.map((layer) => {
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('class', 'ring-line')
  path.setAttribute('fill', 'none')
  path.dataset.key = layer.key
  ringGroup.appendChild(path)
  return path
})

const ringLabels = LAYERS.map((layer) => {
  const el = document.createElement('span')
  el.className = 'ring-label'
  el.textContent = `${LAYER_ORDER.get(layer.key) + 1} ${layer.label}`
  ringLabelLayer.appendChild(el)
  return el
})

NODES.forEach((n) => {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = 'n3d' + (n.isCenter ? ' n3d--center' : '')
  el.dataset.id = n.id
  el.setAttribute('aria-label', `${n.name}，所属系统：${n.level}`)
  el.setAttribute('aria-pressed', 'false')

  const nameEl = document.createElement('span')
  nameEl.className = 'n3d__name'
  nameEl.textContent = n.name

  const levelEl = document.createElement('span')
  levelEl.className = 'n3d__level'
  levelEl.textContent = n.level

  el.appendChild(nameEl)
  el.appendChild(levelEl)

  el.addEventListener('click', () => {
    if (state.moved > 6) return
    selectNode(n.id)
  })

  nodeLayer.appendChild(el)
  n.el = el
})

const linkLines = NODES.map(() => {
  const line = document.createElementNS(SVG_NS, 'line')
  line.setAttribute('class', 'link-line')
  linkGroup.appendChild(line)
  return line
})

/* ------------------------------------------------------------------ 交互 */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

let rafId = 0

function schedule() {
  if (!rafId) rafId = requestAnimationFrame(tick)
}

function tick() {
  rafId = 0
  let again = false

  if (state.autoRotate && !state.dragging) {
    view.yaw += 0.0052
    again = true
  }

  if (Math.abs(state.spin) > 0.0008) {
    view.yaw += state.spin
    state.spin *= 0.93
    again = true
  } else {
    state.spin = 0
  }

  render()
  if (again) schedule()
}

stage.addEventListener('pointerdown', (e) => {
  if (e.button !== undefined && e.button !== 0) return
  state.dragging = true
  state.moved = 0
  state.spin = 0
  drag.x = e.clientX
  drag.y = e.clientY
  drag.lastDx = 0
  stage.classList.add('is-dragging')
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
})

const drag = { x: 0, y: 0, lastDx: 0 }

function onPointerMove(e) {
  if (!state.dragging) return
  const dx = e.clientX - drag.x
  const dy = e.clientY - drag.y
  drag.x = e.clientX
  drag.y = e.clientY
  state.moved += Math.abs(dx) + Math.abs(dy)
  view.yaw += dx * 0.008
  view.pitch = clamp(view.pitch + dy * 0.006, view.minPitch, view.maxPitch)
  drag.lastDx = dx
  schedule()
}

function onPointerUp() {
  state.dragging = false
  stage.classList.remove('is-dragging')
  state.spin = clamp(drag.lastDx * 0.006, -0.06, 0.06)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  if (Math.abs(state.spin) > 0.0008 && !REDUCED) schedule()
}

stage.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    setZoom(view.zoom * Math.exp(-e.deltaY * 0.0012))
  },
  { passive: false },
)

stage.addEventListener('keydown', (e) => {
  const stepAngle = 0.09
  if (e.key === 'ArrowLeft') view.yaw -= stepAngle
  else if (e.key === 'ArrowRight') view.yaw += stepAngle
  else if (e.key === 'ArrowUp') view.pitch = clamp(view.pitch - 0.05, view.minPitch, view.maxPitch)
  else if (e.key === 'ArrowDown') view.pitch = clamp(view.pitch + 0.05, view.minPitch, view.maxPitch)
  else if (e.key === '+' || e.key === '=') setZoom(view.zoom * 1.08)
  else if (e.key === '-' || e.key === '_') setZoom(view.zoom / 1.08)
  else if (e.key === '0') resetView()
  else return
  e.preventDefault()
  render()
})

function setZoom(z) {
  view.zoom = clamp(z, view.minZoom, view.maxZoom)
  render()
}

function resetView() {
  view.yaw = -0.62
  view.pitch = 0.72
  view.zoom = 1
  state.spin = 0
  render()
}

btnZoomIn.addEventListener('click', () => setZoom(view.zoom * 1.1))
btnZoomOut.addEventListener('click', () => setZoom(view.zoom / 1.1))
btnResetView.addEventListener('click', resetView)

btnAuto.addEventListener('click', () => {
  state.autoRotate = !state.autoRotate
  btnAuto.classList.toggle('is-active', state.autoRotate)
  btnAuto.setAttribute('aria-pressed', state.autoRotate ? 'true' : 'false')
  if (state.autoRotate) schedule()
})

/* ------------------------------------------------------------------ 渲染 */

function measureNodes() {
  NODES.forEach((n) => {
    if (!n.el) return
    n.halfW = (n.el.offsetWidth || 88) / 2
    n.halfH = (n.el.offsetHeight || 40) / 2
  })
}

function resize() {
  const rect = stage.getBoundingClientRect()
  size.w = Math.max(160, Math.round(rect.width))
  size.h = Math.max(160, Math.round(rect.height))
  svg.setAttribute('viewBox', `0 0 ${size.w} ${size.h}`)
  svg.setAttribute('width', String(size.w))
  svg.setAttribute('height', String(size.h))
  measureNodes()
  relayout()
  render()
}

/** 依据当前视角计算一个投影函数（s0 为「世界半径 1 对应多少像素」） */
function makeProjector(s0, v = view) {
  const cx = size.w / 2
  const cy = size.h / 2
  const cp = Math.cos(v.pitch)
  const sp = Math.sin(v.pitch)
  const cyw = Math.cos(v.yaw)
  const syw = Math.sin(v.yaw)

  return (x, y, z) => {
    const x1 = x * cyw + z * syw
    const z1 = -x * syw + z * cyw
    const y1 = y * cp + z1 * sp
    const z2 = -y * sp + z1 * cp
    const depth = v.dist + z2
    const rel = v.dist / depth
    return {
      x: cx + x1 * rel * s0,
      y: cy - y1 * rel * s0,
      rel,
      depth,
    }
  }
}

/** 节点在屏幕上的可见缩放（与 render 保持一致，用于估算卡片实际尺寸） */
function visualScale(rel) {
  return clamp(rel, 0.7, 1.3)
}

/** 计算「全部元素不越出场景框」的基准比例 */
function fitScale() {
  const unit = makeProjector(1)
  let s0 = Math.min(size.w, size.h) * 0.42
  const limitX = size.w / 2 - PAD
  const limitY = size.h / 2 - PAD

  NODES.forEach((n) => {
    const p = unit(n.x, 0, n.z)
    const boxW = n.halfW * visualScale(p.rel)
    const boxH = n.halfH * visualScale(p.rel)
    // 节点不越界
    const ox = Math.abs(p.x - size.w / 2)
    const oy = Math.abs(p.y - size.h / 2)
    if (ox > 1 && boxW < limitX) s0 = Math.min(s0, (limitX - boxW) / ox)
    if (oy > 1 && boxH < limitY) s0 = Math.min(s0, (limitY - boxH) / oy)
  })

  LAYERS.forEach((layer) => {
    const p = unit(-layer.radius, 0, 0)
    const ox = Math.abs(p.x - size.w / 2)
    if (ox > 1) s0 = Math.min(s0, Math.max(0, (limitX - 30) / ox))
  })

  return Math.max(12, s0)
}

/**
 * 屏幕空间互斥松弛：在默认视角下消解节点卡片互相遮挡。
 * 以层级径向位置为锚点，反复把重叠的卡片推开，再把屏幕位移反解回世界坐标。
 */
const LAYOUT_VIEW = { yaw: -0.62, pitch: 0.72, dist: 3.6 }

function relaxLayout(s0) {
  if (!size.w || !size.h || NODES.length < 2) return
  const cx = size.w / 2
  const cy = size.h / 2
  const project = makeProjector(s0, LAYOUT_VIEW)
  const cyw = Math.cos(LAYOUT_VIEW.yaw)
  const syw = Math.sin(LAYOUT_VIEW.yaw)
  const sp = Math.sin(LAYOUT_VIEW.pitch)

  const items = NODES.map((n) => {
    const p = project(n.baseX, 0, n.baseZ)
    const k = visualScale(p.rel)
    return {
      n,
      ax: p.x,
      ay: p.y,
      px: p.x,
      py: p.y,
      hw: n.halfW * k,
      hh: n.halfH * k,
      A: p.rel * s0,
    }
  })

  const GAP = 5
  for (let iter = 0; iter < 90; iter += 1) {
    let clashes = 0
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i]
        const b = items[j]
        const needX = a.hw + b.hw + GAP
        const needY = a.hh + b.hh + GAP
        const dx = b.px - a.px
        const dy = b.py - a.py
        const ovX = needX - Math.abs(dx)
        const ovY = needY - Math.abs(dy)
        if (ovX <= 0 || ovY <= 0) continue
        clashes += 1
        const wa = a.n.isCenter ? 0 : (b.n.isCenter ? 1 : 0.5)
        const wb = b.n.isCenter ? 0 : (a.n.isCenter ? 1 : 0.5)
        if (ovX <= ovY) {
          const push = (dx >= 0 ? 1 : -1) * ovX
          a.px -= push * wa
          b.px += push * wb
        } else {
          const push = (dy >= 0 ? 1 : -1) * ovY
          a.py -= push * wa
          b.py += push * wb
        }
      }
    }
    items.forEach((it) => {
      const pull = it.n.isCenter ? 1 : 0.05
      it.px += (it.ax - it.px) * pull
      it.py += (it.ay - it.py) * pull
      const minX = PAD + it.hw
      const maxX = size.w - PAD - it.hw
      const minY = PAD + it.hh
      const maxY = size.h - PAD - it.hh
      it.px = clamp(it.px, Math.min(minX, maxX), Math.max(minX, maxX))
      it.py = clamp(it.py, Math.min(minY, maxY), Math.max(minY, maxY))
    })
    if (!clashes) break
  }

  items.forEach((it) => {
    if (it.n.isCenter) return
    const ddx = it.px - it.ax
    const ddy = it.py - it.ay
    if (Math.abs(ddx) < 0.5 && Math.abs(ddy) < 0.5) {
      it.n.x = it.n.baseX
      it.n.z = it.n.baseZ
      return
    }
    const A = it.A || 1
    const B = A * sp
    const ux = ddx / A
    const uy = ddy / B
    // 投影矩阵 [[cyw, syw], [syw, -cyw]] 为对合矩阵，可直接反解世界位移
    it.n.x = it.n.baseX + (cyw * ux + syw * uy)
    it.n.z = it.n.baseZ + (syw * ux - cyw * uy)
  })
}

/** 先按原始层级布局求解基准比例，再松弛消重，迭代若干轮使两者自洽 */
function relayout() {
  for (let round = 0; round < 3; round += 1) {
    relaxLayout(fitScale())
  }
}

function render() {
  if (!size.w || !size.h) return
  const s0 = fitScale() * view.zoom
  const project = makeProjector(s0)
  const cx = size.w / 2
  const cy = size.h / 2
  const hasStep = state.step >= 0

  // 同心环
  LAYERS.forEach((layer, i) => {
    const pts = []
    for (let k = 0; k <= RING_SEGMENTS; k += 1) {
      const a = (k / RING_SEGMENTS) * Math.PI * 2
      const p = project(Math.cos(a) * layer.radius, 0, Math.sin(a) * layer.radius)
      pts.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    }
    const path = ringPaths[i]
    path.setAttribute('d', `M${pts.join('L')}Z`)
    path.classList.toggle('is-active', state.activeLayers.has(layer.key))

    const lp = project(-layer.radius, 0, 0)
    const label = ringLabels[i]
    label.style.transform = `translate(${lp.x.toFixed(1)}px, ${lp.y.toFixed(1)}px) translate(-100%, -50%)`
    label.style.opacity = String(clamp(lp.rel * 0.9, 0.55, 1))
    label.classList.toggle('is-active', state.activeLayers.has(layer.key))
  })

  // 中心 → 各主体的关联连线
  const center = CENTER_NODE ? project(CENTER_NODE.x, 0, CENTER_NODE.z) : { x: cx, y: cy, rel: 1, depth: view.dist }
  NODES.forEach((n, i) => {
    const p = project(n.x, 0, n.z)
    const line = linkLines[i]
    line.setAttribute('x1', center.x.toFixed(1))
    line.setAttribute('y1', center.y.toFixed(1))
    line.setAttribute('x2', p.x.toFixed(1))
    line.setAttribute('y2', p.y.toFixed(1))
    line.classList.toggle('is-active', hasStep && state.activeNodes.has(n.id))
  })

  // 主体节点
  NODES.forEach((n) => {
    if (!n.el) return
    const p = project(n.x, 0, n.z)
    const scale = clamp(p.rel, 0.7, 1.3)
    n.el.style.transform = `translate(-50%, -50%) translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) scale(${scale.toFixed(3)})`
    n.el.style.zIndex = String(Math.round(900 - p.depth * 100))
    const dim = hasStep && !state.activeNodes.has(n.id)
    n.el.style.opacity = String(clamp(p.rel * 0.92, 0.6, 1) * (dim ? 0.42 : 1))
    n.el.classList.toggle('is-active', hasStep && state.activeNodes.has(n.id))
    const picked = state.selected === n.id
    n.el.classList.toggle('is-picked', picked)
    n.el.setAttribute('aria-pressed', picked ? 'true' : 'false')
  })
}

/* ---------------------------------------------------------------- 主体详情 */

function selectNode(id) {
  state.selected = id
  renderDetail()
  render()
}

function renderDetail() {
  const node = NODES.find((n) => n.id === state.selected)
  detailBody.textContent = ''
  if (!node) return

  const head = document.createElement('div')
  head.className = 'detail3__head'

  const name = document.createElement('h3')
  name.className = 'detail3__name'
  name.textContent = node.name
  head.appendChild(name)

  const chips = document.createElement('div')
  chips.className = 'detail3__chips'
  chips.appendChild(makeChip(node.level, true))
  if (node.levelEn && node.levelEn !== node.level) chips.appendChild(makeChip(node.levelEn))
  if (state.step >= 0) {
    chips.appendChild(
      makeChip(state.activeNodes.has(node.id) ? '本阶段高亮' : '本阶段未介入', state.activeNodes.has(node.id)),
    )
  }
  head.appendChild(chips)
  detailBody.appendChild(head)

  const label = document.createElement('p')
  label.className = 'detail3__label'
  label.textContent = node.isCenter ? '案主定位' : '角色定位'
  detailBody.appendChild(label)

  const note = document.createElement('p')
  note.className = 'detail3__note'
  note.textContent = node.note
  detailBody.appendChild(note)

  if (node.isCenter) {
    const wanted = ['案主', '疾病状况', '家庭结构']
    const rows = PROFILE.filter((p) => wanted.includes(String(p.label || '')))
    if (rows.length) {
      const kv = document.createElement('dl')
      kv.className = 'detail3__kv'
      rows.forEach((p) => {
        const dt = document.createElement('dt')
        dt.textContent = String(p.label || '')
        const dd = document.createElement('dd')
        dd.textContent = String(p.value || '')
        kv.appendChild(dt)
        kv.appendChild(dd)
      })
      detailBody.appendChild(kv)
    }
    if (CASE_INFO.setting) {
      const src = document.createElement('p')
      src.className = 'detail3__src'
      src.textContent = `服务情境：${CASE_INFO.setting}`
      detailBody.appendChild(src)
    }
  }
}

function makeChip(text, brand = false) {
  const el = document.createElement('span')
  el.className = 'chip3' + (brand ? ' chip3--brand' : '')
  el.textContent = text
  return el
}

/* ------------------------------------------------------------------ 时间线 */

TIMELINE.forEach((ev, i) => {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'tl-dot'
  btn.dataset.index = String(i)
  btn.title = `${ev.time} · ${ev.stage}`
  btn.setAttribute('aria-label', `第 ${i + 1} 阶段：${ev.time} ${ev.stage}`)

  const num = document.createElement('span')
  num.className = 'tl-dot__i'
  num.textContent = String(i + 1)
  const time = document.createElement('span')
  time.className = 'tl-dot__t'
  time.textContent = String(ev.time || '').replace(/^2025\./, '')

  btn.appendChild(num)
  btn.appendChild(time)
  btn.addEventListener('click', () => setStep(i))
  tlSteps.appendChild(btn)
})

function layersFromSystem(systemText) {
  const sys = String(systemText || '')
  const set = new Set()
  if (/全系统/.test(sys)) {
    LAYERS.forEach((l) => set.add(l.key))
    return set
  }
  LAYERS.forEach((l) => {
    if (sys.includes(l.key)) set.add(l.key)
  })
  return set
}

function highlightFor(ev) {
  const layers = layersFromSystem(ev.system)
  const nodes = new Set()
  const text = String(ev.event || '')
  NODES.forEach((n) => {
    if (layers.has(n.primary)) {
      nodes.add(n.id)
      return
    }
    const hinted = HINTS.some((h) => h.words.some((w) => text.includes(w)) && h.test(n))
    if (hinted) nodes.add(n.id)
  })
  return { layers, nodes }
}

function setStep(i) {
  if (i < 0 || i >= TIMELINE.length) return
  state.step = i
  const ev = TIMELINE[i]
  const hl = highlightFor(ev)
  state.activeLayers = hl.layers
  state.activeNodes = hl.nodes

  ;[...tlSteps.children].forEach((el, idx) => {
    el.classList.toggle('is-active', idx === i)
    el.classList.toggle('is-done', idx < i)
  })

  const layersText = LAYERS.filter((l) => hl.layers.has(l.key)).map((l) => l.label)
  layerBadge.textContent = layersText.length ? layersText.join(' / ') : '全部层级'
  layerBadge.classList.toggle('chip--brand', layersText.length > 0)

  renderEvent(ev)
  renderHighlight(hl)
  renderDetail()
  render()
}

function clearStep() {
  state.step = -1
  state.activeLayers = new Set()
  state.activeNodes = new Set()
  ;[...tlSteps.children].forEach((el) => el.classList.remove('is-active', 'is-done'))
  layerBadge.textContent = '全部层级'

  tlEvent.textContent = ''
  const hint = document.createElement('p')
  hint.className = 'tl-event__hint'
  hint.textContent = `案例共 ${TIMELINE.length} 个阶段。点击「下一步」逐步推进，或点击「播放」自动演进；推进时高亮当前介入的系统层级与主体。`
  tlEvent.appendChild(hint)
  tlHighlight.textContent = ''
  renderDetail()
  render()
}

function renderEvent(ev) {
  tlEvent.textContent = ''

  const meta = document.createElement('div')
  meta.className = 'tl-event__meta'
  const time = document.createElement('span')
  time.className = 'tl-event__time'
  time.textContent = `${state.step + 1} / ${TIMELINE.length} · ${ev.time}`
  const stageChip = makeChip(ev.stage, true)
  const sysChip = makeChip(ev.system)
  meta.appendChild(time)
  meta.appendChild(stageChip)
  meta.appendChild(sysChip)
  tlEvent.appendChild(meta)

  const text = document.createElement('p')
  text.className = 'tl-event__text'
  text.textContent = ev.event
  tlEvent.appendChild(text)
}

function renderHighlight(hl) {
  tlHighlight.textContent = ''
  const active = NODES.filter((n) => hl.nodes.has(n.id))
  if (!active.length) return

  const label = document.createElement('p')
  label.className = 'tl-highlight__label'
  label.textContent = '本阶段涉及主体'
  tlHighlight.appendChild(label)

  const wrap = document.createElement('div')
  wrap.className = 'tl-highlight__chips'
  active.forEach((n) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'chip3 chip3--link'
    btn.textContent = n.name
    btn.addEventListener('click', () => selectNode(n.id))
    wrap.appendChild(btn)
  })
  tlHighlight.appendChild(wrap)
}

function stepTo(i) {
  if (i < 0) {
    clearStep()
    return
  }
  setStep(Math.min(i, TIMELINE.length - 1))
}

btnNext.addEventListener('click', () => {
  stepTo(state.step + 1)
})

btnPrev.addEventListener('click', () => {
  if (state.step <= 0) {
    clearStep()
    return
  }
  stepTo(state.step - 1)
})

btnResetTl.addEventListener('click', () => {
  stopPlay()
  clearStep()
})

let playTimer = 0

function startPlay() {
  if (state.playing) return
  state.playing = true
  btnPlay.textContent = '暂停'
  btnPlay.setAttribute('aria-pressed', 'true')
  stepTo(state.step + 1)
  playTimer = window.setInterval(() => {
    if (state.step >= TIMELINE.length - 1) {
      stopPlay()
      return
    }
    stepTo(state.step + 1)
  }, 3400)
}

function stopPlay() {
  if (!state.playing) return
  state.playing = false
  btnPlay.textContent = '播放'
  btnPlay.setAttribute('aria-pressed', 'false')
  window.clearInterval(playTimer)
  playTimer = 0
}

btnPlay.addEventListener('click', () => {
  if (state.playing) stopPlay()
  else startPlay()
})

/* -------------------------------------------------------------- 图例与初始化 */

LAYERS.forEach((layer) => {
  const item = document.createElement('span')
  item.className = 'legend3__item'
  const dot = document.createElement('span')
  dot.className = `legend3__dot legend3__dot--${LAYER_ORDER.get(layer.key) + 1}`
  dot.style.width = `${6 + LAYER_ORDER.get(layer.key) * 3}px`
  dot.style.height = `${6 + LAYER_ORDER.get(layer.key) * 3}px`
  const text = document.createElement('span')
  text.textContent = `${layer.label} · ${layer.en.toLowerCase()}`
  item.appendChild(dot)
  item.appendChild(text)
  legend.appendChild(item)
})

const centerItem = document.createElement('span')
centerItem.className = 'legend3__item legend3__item--center'
centerItem.textContent = '中心：案主许姨（干预焦点）'
legend.appendChild(centerItem)

if (typeof ResizeObserver === 'function') {
  new ResizeObserver(() => resize()).observe(stage)
}
window.addEventListener('resize', resize)

if (typeof document.fonts !== 'undefined' && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureNodes()
    relayout()
    render()
  })
}

window.addEventListener('hashchange', () => {
  /* 独立入口，无路由依赖：保持当前状态 */
})

resize()
clearStep()
renderDetail()
render()
