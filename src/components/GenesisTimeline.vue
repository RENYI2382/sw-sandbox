<template>
  <div class="w-full">
    <!-- ===== 开篇 ===== -->
    <section class="mx-auto w-full px-6 pb-14 pt-8 md:px-8 md:pb-24 md:pt-14">
      <div class="mx-auto" :style="{ maxWidth: 'var(--content-max)' }">
        <p v-reveal class="eyebrow">模块 01 · 理论溯源与进化时间线</p>

        <h1 v-reveal="80" class="mt-4 font-serif text-[32px] font-semibold leading-[1.3] text-slate-900 md:text-5xl">
          从 <span class="text-brand-700">{{ yearStart }}</span>
          <span class="mx-1 text-slate-300">—</span>
          <span class="text-brand-700">{{ yearEnd }}</span>
          <span class="mt-3 block text-lg font-normal text-slate-500 md:text-2xl">
            生态系统理论的八十年范式跃迁
          </span>
        </h1>

        <p v-reveal="160" class="mt-6 text-[15px] leading-[1.9] text-slate-600 md:text-base">
          {{ data.description }}
        </p>

        <div v-reveal="240" class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button type="button" class="btn btn-primary" @click="scrollToTimeline">开始浏览时间线</button>
          <span class="flex items-center gap-3 text-xs text-slate-400">
            <span class="h-px w-8 bg-slate-300" aria-hidden="true"></span>
            共 {{ data.timelineAxis.milestoneCount }} 个关键里程碑 · 向下滚动依次展开
          </span>
        </div>

        <div v-reveal="300" class="mt-10 flex items-center gap-2" aria-hidden="true">
          <span
            v-for="n in data.timelineAxis.milestoneCount"
            :key="n"
            class="h-1 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <span
              class="block h-full rounded-full bg-brand-700 transition-[width] duration-500 ease-out"
              :style="{ width: timelineProgress >= n / data.timelineAxis.milestoneCount ? '100%' : '0%' }"
            ></span>
          </span>
        </div>
      </div>
    </section>

    <!-- ===== 时间线 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 md:px-8">
      <div ref="timelineSection" class="relative">
        <!-- 轴线 -->
        <div class="absolute bottom-0 left-0 top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" aria-hidden="true"></div>
        <div
          class="absolute left-0 top-0 w-px bg-brand-700 transition-[height] duration-200 ease-out md:left-1/2 md:-translate-x-1/2"
          :style="{ height: `${Math.round(timelineProgress * 100)}%` }"
          aria-hidden="true"
        ></div>

        <article
          v-for="(node, idx) in data.nodes"
          :key="node.id"
          :ref="(el) => setNodeRef(el, idx)"
          class="relative mb-6 md:mb-12"
          :class="idx % 2 === 0 ? 'md:pr-[54%]' : 'md:pl-[54%]'"
        >
          <!-- 节点标记 -->
          <div class="absolute left-0 top-5 z-10 -translate-x-1/2 md:left-1/2" aria-hidden="true">
            <span
              class="grid h-8 w-8 place-items-center rounded-full border bg-white font-mono text-[11px] font-semibold transition-colors duration-300"
              :class="activeNodeIdx >= idx ? 'border-brand-700 text-brand-700' : 'border-line-strong text-slate-400'"
            >
              {{ String(idx + 1).padStart(2, '0') }}
            </span>
          </div>
          <div
            v-if="idx % 2 === 0"
            class="absolute left-1/2 top-5 ml-7 hidden h-8 items-center font-mono text-xs text-slate-400 md:flex"
            aria-hidden="true"
          >
            {{ node.year }}
          </div>
          <div
            v-else
            class="absolute right-1/2 top-5 mr-7 hidden h-8 items-center font-mono text-xs text-slate-400 md:flex"
            aria-hidden="true"
          >
            {{ node.year }}
          </div>

          <div v-reveal="idx * 60" class="ml-10 md:ml-0">
            <div
              class="panel panel-interactive cursor-pointer p-5 md:p-6"
              role="button"
              tabindex="0"
              :aria-expanded="expandedNodeId === node.id"
              @click="toggleExpand(node.id)"
              @keydown.enter.prevent="toggleExpand(node.id)"
              @keydown.space.prevent="toggleExpand(node.id)"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="chip chip-brand">{{ significanceLabel(node.significance) }}</span>
                <span class="font-mono text-[11px] text-slate-400">{{ node.eraLabel }}</span>
              </div>

              <h3 class="mt-4 font-serif text-xl font-semibold leading-snug text-slate-900 md:text-[26px]">
                {{ node.title }}
              </h3>

              <p class="mt-2 text-[13px] text-slate-500">
                <span class="font-serif">{{ node.author }}</span>
                <span class="mx-1.5 text-slate-300" aria-hidden="true">·</span>
                <span class="font-mono">{{ node.publication }}</span>
              </p>

              <div class="mt-5 space-y-4">
                <div>
                  <p class="eyebrow">核心贡献</p>
                  <p class="mt-2 text-[15px] leading-[1.9] text-slate-700">{{ node.coreContribution }}</p>
                </div>
                <div>
                  <p class="eyebrow">范式转变</p>
                  <p class="mt-2 border-l-2 border-brand-200 pl-4 text-sm leading-[1.9] text-slate-600">
                    {{ node.paradigmShift }}
                  </p>
                </div>
              </div>

              <!-- 展开明细 -->
              <div class="grid" :style="expandStyle(node.id)">
                <div class="overflow-hidden">
                  <div class="mt-5 space-y-5 border-t border-line pt-5">
                    <div>
                      <p class="eyebrow">关键概念</p>
                      <div class="mt-2 flex flex-wrap gap-1.5">
                        <span v-for="kc in node.keyConcepts" :key="kc" class="chip">{{ kc }}</span>
                      </div>
                    </div>

                    <div>
                      <p class="eyebrow">关键词</p>
                      <div class="mt-2 flex flex-wrap gap-1.5">
                        <span v-for="kw in node.keywords" :key="kw" class="chip">#{{ kw }}</span>
                      </div>
                    </div>

                    <div>
                      <p class="eyebrow">原始引述</p>
                      <div class="mt-2 space-y-2">
                        <blockquote
                          v-for="(q, qi) in node.quotes"
                          :key="qi"
                          class="border-l-2 border-slate-200 pl-4 text-sm italic leading-[1.9] text-slate-600"
                        >
                          {{ q }}
                        </blockquote>
                      </div>
                    </div>

                    <div>
                      <div class="flex items-center justify-between">
                        <p class="eyebrow">学术影响力</p>
                        <span class="font-mono text-xs text-slate-400">{{ node.impactScore }} / 100</span>
                      </div>
                      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          class="h-full rounded-full bg-brand-700 transition-[width] duration-[600ms] ease-out"
                          :style="{ width: expandedNodeId === node.id ? `${node.impactScore}%` : '0%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span class="text-xs text-slate-400">{{ expandedNodeId === node.id ? '收起详情' : '展开详情' }}</span>
                <svg
                  viewBox="0 0 24 24"
                  class="h-4 w-4 text-slate-400 transition-transform duration-300"
                  :class="expandedNodeId === node.id ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== 尾声 ===== -->
    <section class="mx-auto w-full px-6 pb-24 pt-10 md:px-8 md:pb-32 md:pt-14">
      <div class="mx-auto" :style="{ maxWidth: 'var(--content-max)' }">
        <div v-reveal class="panel p-6 md:p-8">
          <p class="eyebrow">尾声 · {{ data.epilogue.year }}</p>
          <h3 class="mt-3 font-serif text-2xl font-semibold text-slate-900">{{ data.epilogue.title }}</h3>
          <p class="mt-4 text-[15px] leading-[1.9] text-slate-600">{{ data.epilogue.summary }}</p>
          <div class="mt-6 border-t border-line pt-4">
            <p class="eyebrow">下一模块</p>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ data.epilogue.nextModuleTeaser }}</p>
          </div>
        </div>
      </div>

      <ReferenceList moduleName="genesis" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import timelineData from '@/data/timeline.json'
import ReferenceList from './ReferenceList.vue'

const data = ref(timelineData)

const timelineSection = ref(null)
const nodeRefs = ref([])
const expandedNodeId = ref(null)
const activeNodeIdx = ref(-1)
const timelineProgress = ref(0)

const yearStart = computed(() => (data.value.anchor.split('—')[0] || '').trim())
const yearEnd = computed(() => (data.value.anchor.split('—')[1] || '').trim())

function setNodeRef(el, idx) {
  if (el) nodeRefs.value[idx] = el
}

function significanceLabel(s) {
  return (
    {
      foundational: '奠基',
      'turning-point': '转折',
      cornerstone: '基石',
      culmination: '成熟',
    }[s] || '演进'
  )
}

function toggleExpand(id) {
  expandedNodeId.value = expandedNodeId.value === id ? null : id
}

// 展开 / 收起：0.4s 过渡，落在 0.3–0.6s 区间
function expandStyle(id) {
  const open = expandedNodeId.value === id
  return {
    gridTemplateRows: open ? '1fr' : '0fr',
    opacity: open ? 1 : 0,
    transition: 'grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
  }
}

function scrollToTimeline() {
  const el = timelineSection.value
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function update() {
  const el = timelineSection.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const anchor = window.innerHeight * 0.62
  const passed = Math.min(Math.max(anchor - rect.top, 0), rect.height)
  timelineProgress.value = rect.height > 0 ? passed / rect.height : 0

  let current = -1
  nodeRefs.value.forEach((nodeEl, i) => {
    if (!nodeEl) return
    if (nodeEl.getBoundingClientRect().top <= anchor) current = i
  })
  activeNodeIdx.value = current
}

let raf = null
function onScroll() {
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>
