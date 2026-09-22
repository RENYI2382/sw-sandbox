<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-white/85 backdrop-blur-[6px]">
    <div class="mx-auto w-full max-w-[88rem] px-4 md:px-8">
      <div class="flex flex-wrap items-center gap-x-4 py-2 lg:h-14 lg:flex-nowrap lg:py-0">
        <!-- 品牌区 -->
        <div class="mr-auto flex min-w-0 items-center gap-3 lg:mr-0">
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-chip bg-brand-700 font-serif text-sm font-semibold text-white"
            aria-hidden="true"
            >社</span
          >
          <div class="min-w-0 leading-tight">
            <div class="truncate font-serif text-[15px] font-semibold text-slate-900">
              社会工作理论 · 生态系统理论
            </div>
            <div class="truncate text-[11px] text-slate-400">深圳大学 · 课程汇报</div>
          </div>
        </div>

        <!-- 模块导航 -->
        <nav
          class="order-last -mx-4 flex w-full items-center gap-1 overflow-x-auto px-4 pb-1 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0"
          aria-label="模块导航"
        >
          <button
            v-for="m in modules"
            :key="m.id"
            type="button"
            :disabled="!m.available"
            :title="m.available ? m.name : `${m.name}（开发中）`"
            class="flex shrink-0 items-center rounded-chip px-3 py-1.5 text-[13px] transition-colors duration-200"
            :class="navClass(m)"
            @click="m.available && $emit('jumpModule', m.idx - 1)"
          >
            <span class="mr-1.5 font-mono text-[11px] opacity-60">{{ String(m.idx).padStart(2, '0') }}</span>
            {{ m.short }}
            <span v-if="!m.available" class="ml-1.5 h-1 w-1 rounded-full bg-slate-300" aria-hidden="true"></span>
          </button>
        </nav>

        <!-- 视图与背景控制 -->
        <div class="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            class="icon-btn"
            :class="{ 'is-active': viewMode === 'focus' }"
            title="专注视图（窄栏阅读）"
            aria-label="专注视图"
            @click="$emit('setView', 'focus')"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6">
              <rect x="7" y="4" width="10" height="16" rx="1.5" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="{ 'is-active': viewMode === 'compact' }"
            title="紧凑视图（宽栏）"
            aria-label="紧凑视图"
            @click="$emit('setView', 'compact')"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6">
              <rect x="3" y="4" width="18" height="7" rx="1.5" />
              <rect x="3" y="13" width="18" height="7" rx="1.5" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="{ 'is-active': bgEnabled }"
            :title="bgEnabled ? '隐藏背景纹理' : '显示背景纹理'"
            aria-label="背景纹理开关"
            @click="$emit('toggleBg')"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 阅读进度 -->
    <div class="absolute inset-x-0 bottom-0 h-[2px] bg-transparent" aria-hidden="true">
      <div
        class="h-full bg-brand-700 transition-[width] duration-150 ease-out"
        :style="{ width: `${Math.round(scrollProgress * 100)}%` }"
      ></div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  currentModule: { type: String, default: 'genesis' },
  scrollProgress: { type: Number, default: 0 },
  viewMode: { type: String, default: 'focus' },
  bgEnabled: { type: Boolean, default: true },
})

defineEmits(['setView', 'toggleBg', 'jumpModule'])

const modules = [
  { id: 'genesis', short: '理论溯源', name: '理论溯源与进化时间线', idx: 1, available: true },
  { id: 'corelogic', short: '底层逻辑', name: '底层逻辑与力学拆解', idx: 2, available: true },
  { id: 'global', short: '全球视野', name: '全球视野与本土对话', idx: 3, available: true },
  { id: 'academic', short: '文献研读', name: '经典文献深度解读', idx: 4, available: true },
  { id: 'sandbox', short: '沙盘推演', name: '实践应用沙盘推演', idx: 5, available: true },
]

function navClass(m) {
  if (!m.available) return 'cursor-not-allowed text-slate-300'
  if (props.currentModule === m.id) return 'bg-brand-50 font-medium text-brand-800'
  return 'text-slate-500 hover:bg-slate-50 hover:text-brand-800'
}
</script>
