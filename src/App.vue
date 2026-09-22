<template>
  <div class="relative min-h-screen">
    <BackgroundLayer v-if="bgEnabled" />

    <GlobalHud
      :current-module="currentModule"
      :scroll-progress="scrollProgress"
      :view-mode="viewMode"
      :bg-enabled="bgEnabled"
      @set-view="viewMode = $event"
      @toggle-bg="bgEnabled = !bgEnabled"
      @jump-module="handleJumpModule"
    />

    <main :data-view="viewMode" class="relative z-10 pb-4 pt-[108px] md:pt-[64px]">
      <GenesisTimeline v-show="currentModule === 'genesis'" />
      <CoreLogic v-show="currentModule === 'corelogic'" @jump="handleJumpModule" />
      <GlobalPerspective v-show="currentModule === 'global'" @jump="handleJumpModule" />
      <AcademicAnchor v-show="currentModule === 'academic'" @jump="handleJumpModule" />
      <RealWorldSandbox v-show="currentModule === 'sandbox'" @jump="handleJumpModule" />
    </main>

    <!-- 课程封面 -->
    <Transition name="fade">
      <div
        v-if="showIntro"
        class="fixed inset-0 z-50 flex items-center justify-center bg-page px-6"
      >
        <div class="w-full max-w-xl text-center">
          <p class="eyebrow">深圳大学 · 社会工作理论课程汇报</p>
          <h1 class="mt-5 font-serif text-3xl font-semibold leading-snug text-slate-900 md:text-4xl">
            生态系统理论
            <span class="mt-2 block text-xl font-normal text-slate-500 md:text-2xl">
              在社会工作领域的发展脉络及展望
            </span>
          </h1>
          <div class="mx-auto mt-7 h-px w-16 bg-slate-200" aria-hidden="true"></div>
          <p class="mt-7 text-sm leading-[1.9] text-slate-500">
            按“溯源 — 解构 — 评述 — 研读 — 实操”五步递进：理论演进时间线、三大核心假设、全球视野与本土对话、
            经典文献深度解读，以及医务社工介入老年癌痛管理的沙盘推演。
          </p>
          <button type="button" class="btn btn-primary mt-8" @click="dismissIntro">进入课程</button>
          <p class="mt-4 text-xs text-slate-400">按 Esc 键可跳过</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BackgroundLayer from './components/BackgroundLayer.vue'
import GlobalHud from './components/GlobalHud.vue'
import GenesisTimeline from './components/GenesisTimeline.vue'
import CoreLogic from './components/CoreLogic.vue'
import GlobalPerspective from './components/GlobalPerspective.vue'
import AcademicAnchor from './components/AcademicAnchor.vue'
import RealWorldSandbox from './components/RealWorldSandbox.vue'

const INTRO_STORAGE_KEY = 'sw-intro-seen'
const MODULE_ORDER = ['genesis', 'corelogic', 'global', 'academic', 'sandbox']

const showIntro = ref(true)
const currentModule = ref('genesis')
const scrollProgress = ref(0)
const viewMode = ref('focus')
const bgEnabled = ref(true)

function dismissIntro() {
  showIntro.value = false
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch (e) {
    /* 隐私模式下 localStorage 不可用，忽略即可 */
  }
}

function handleJumpModule(idx) {
  const id = MODULE_ORDER[idx]
  if (id) {
    currentModule.value = id
    try {
      window.history.replaceState(null, '', `#${id}`)
    } catch (e) {
      /* 忽略 */
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 支持 #模块id 深链：直达该模块并跳过封面
function applyHash() {
  const id = decodeURIComponent((window.location.hash || '').replace(/^#/, ''))
  if (MODULE_ORDER.includes(id)) {
    currentModule.value = id
    showIntro.value = false
    return true
  }
  return false
}

function onScroll() {
  const total = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0
}

function onKeydown(e) {
  if (e.key === 'Escape' && showIntro.value) dismissIntro()
}

function onHashChange() {
  applyHash()
}

onMounted(() => {
  const deepLinked = applyHash()
  try {
    if (!deepLinked && window.localStorage.getItem(INTRO_STORAGE_KEY) === '1') showIntro.value = false
  } catch (e) {
    /* 忽略 */
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('hashchange', onHashChange)
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('hashchange', onHashChange)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
