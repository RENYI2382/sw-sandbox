<template>
  <div class="w-full">
    <!-- ===== 开篇 ===== -->
    <section class="mx-auto w-full px-6 pb-12 pt-8 md:px-8 md:pb-16 md:pt-14">
      <div class="mx-auto" :style="{ maxWidth: 'var(--content-max)' }">
        <p v-reveal class="eyebrow">{{ data.eyebrow }}</p>

        <h1 v-reveal="80" class="mt-4 font-serif text-[32px] font-semibold leading-[1.3] text-slate-900 md:text-5xl">
          {{ data.title }}
          <span class="mt-3 block text-lg font-normal text-slate-500 md:text-2xl">{{ data.headline2 }}</span>
        </h1>

        <p v-reveal="160" class="mt-6 text-[15px] leading-[1.9] text-slate-600 md:text-base">
          {{ data.lead }}
        </p>

        <div v-reveal="240" class="mt-8 grid gap-2 sm:grid-cols-3">
          <button
            v-for="a in data.assumptions"
            :key="a.id"
            type="button"
            class="panel panel-interactive px-4 py-3 text-left"
            :class="activeId === a.id ? 'border-brand-300' : ''"
            @click="select(a.id)"
          >
            <span class="font-mono text-[11px] text-slate-400">{{ a.index }}</span>
            <span class="mt-1 block font-serif text-[15px] font-semibold leading-snug text-slate-800">
              {{ a.name }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== 归因范式对比 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 md:px-8">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.contrast.title }}</h2>
        <span class="eyebrow hidden md:block">Paradigm Contrast</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">
        {{ data.contrast.intro }}
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div
          v-for="(c, ci) in data.contrast.items"
          :key="c.id"
          v-reveal="ci * 80"
          class="panel p-6"
          :class="c.tone === 'excluded' ? 'bg-[#fcfcfd]' : ''"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span class="chip" :class="c.tone === 'accepted' ? 'chip-brand' : ''">{{ c.tag }}</span>
            <span class="font-mono text-[11px] text-slate-400">{{ c.id === 'medical' ? 'REPLACED' : 'ADOPTED' }}</span>
          </div>

          <h3
            class="mt-4 font-serif text-lg font-semibold"
            :class="c.tone === 'excluded' ? 'text-slate-400' : 'text-slate-900'"
          >
            {{ c.label }}
          </h3>

          <p class="mt-2 font-mono text-[12px] leading-relaxed text-slate-500">{{ c.chain }}</p>

          <ul class="mt-4 space-y-2">
            <li
              v-for="(p, pi) in c.points"
              :key="pi"
              class="flex gap-2.5 text-sm leading-[1.9]"
              :class="c.tone === 'excluded' ? 'text-slate-400' : 'text-slate-600'"
            >
              <span
                class="mt-[10px] h-1 w-1 shrink-0 rounded-full"
                :class="c.tone === 'excluded' ? 'bg-slate-300' : 'bg-brand-700'"
                aria-hidden="true"
              ></span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ===== 假设详情 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-10 md:px-8 md:pt-14">
      <div v-reveal class="panel overflow-hidden">
        <!-- 切换 -->
        <div class="flex flex-wrap gap-1 border-b border-line bg-[#fbfcfd] p-3" role="tablist" aria-label="核心假设切换">
          <button
            v-for="a in data.assumptions"
            :key="a.id"
            type="button"
            role="tab"
            :aria-selected="activeId === a.id"
            class="rounded-chip px-3 py-1.5 text-[13px] transition-colors duration-200"
            :class="
              activeId === a.id
                ? 'bg-brand-50 font-medium text-brand-800'
                : 'text-slate-500 hover:bg-white hover:text-brand-800'
            "
            @click="select(a.id)"
          >
            <span class="mr-1.5 font-mono text-[11px] opacity-60">{{ a.index }}</span>{{ a.name }}
          </button>
        </div>

        <div :key="active.id" class="module-swap grid gap-8 p-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:p-8">
          <!-- 左：示意图 + 边界 -->
          <div>
            <div class="rounded-panel border border-line bg-[#fbfcfd] p-4">
              <p class="eyebrow">力学示意</p>
              <svg viewBox="0 0 300 180" class="mt-3 w-full" role="img" :aria-label="`${active.name}力学示意`">
                <defs>
                  <marker id="cl-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0 0 L8 4 L0 8 z" fill="#22456d" />
                  </marker>
                  <marker id="cl-arrow-muted" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0 0 L8 4 L0 8 z" fill="#cbd5e1" />
                  </marker>
                </defs>

                <!-- 01 非线性因果 -->
                <g v-if="active.diagram === 'nonlinear'">
                  <text x="4" y="12" font-size="9.5" fill="#94a3b8">传统医学模式 · 单因单果</text>
                  <rect x="4" y="22" width="82" height="26" rx="6" fill="#ffffff" stroke="#e5e8ed" />
                  <text x="45" y="39" font-size="10" fill="#94a3b8" text-anchor="middle">个体病理</text>
                  <line x1="90" y1="35" x2="122" y2="35" stroke="#cbd5e1" stroke-width="1.2" marker-end="url(#cl-arrow-muted)" />
                  <rect x="126" y="22" width="82" height="26" rx="6" fill="#ffffff" stroke="#e5e8ed" stroke-dasharray="3 3" />
                  <text x="167" y="39" font-size="10" fill="#94a3b8" text-anchor="middle">个体治疗</text>
                  <path d="M214 28 L224 42 M224 28 L214 42" stroke="#b3452f" stroke-width="1.6" stroke-linecap="round" />

                  <line x1="4" y1="66" x2="296" y2="66" stroke="#e5e8ed" stroke-width="1" />

                  <text x="4" y="86" font-size="9.5" fill="#94a3b8">生态系统理论 · 多因汇聚</text>
                  <rect x="4" y="94" width="66" height="24" rx="6" fill="#f8fbfe" stroke="#bcd2ea" />
                  <text x="37" y="110" font-size="9.5" fill="#475569" text-anchor="middle">生理因素</text>
                  <rect x="100" y="94" width="66" height="24" rx="6" fill="#f8fbfe" stroke="#bcd2ea" />
                  <text x="133" y="110" font-size="9.5" fill="#475569" text-anchor="middle">关系因素</text>
                  <rect x="196" y="94" width="66" height="24" rx="6" fill="#f8fbfe" stroke="#bcd2ea" />
                  <text x="229" y="110" font-size="9.5" fill="#475569" text-anchor="middle">制度因素</text>
                  <path d="M37 118 L131 136 M133 118 L133 136 M229 118 L135 136" stroke="#bcd2ea" stroke-width="1" fill="none" />
                  <rect x="91" y="136" width="80" height="26" rx="6" fill="#eff5fb" stroke="#22456d" />
                  <text x="131" y="153" font-size="10" fill="#22456d" text-anchor="middle">系统失衡</text>
                  <line x1="173" y1="149" x2="189" y2="149" stroke="#22456d" stroke-width="1.2" marker-end="url(#cl-arrow)" />
                  <rect x="193" y="136" width="94" height="26" rx="6" fill="#ffffff" stroke="#22456d" />
                  <text x="240" y="153" font-size="10" fill="#22456d" text-anchor="middle">多层级干预</text>
                  <text x="4" y="176" font-size="8.5" fill="#94a3b8">归因由“个体缺陷”转向“系统失衡”</text>
                </g>

                <!-- 02 互惠互动 -->
                <g v-else-if="active.diagram === 'mutual'">
                  <text x="150" y="14" font-size="9.5" fill="#94a3b8" text-anchor="middle">互惠互动 · 双向交换</text>
                  <rect x="22" y="62" width="90" height="46" rx="7" fill="#eff5fb" stroke="#22456d" />
                  <text x="67" y="82" font-size="13" fill="#22456d" text-anchor="middle">人</text>
                  <text x="67" y="98" font-size="8.5" fill="#5c8dc1" text-anchor="middle">能力 · 自尊 · 应对</text>
                  <rect x="188" y="62" width="90" height="46" rx="7" fill="#ffffff" stroke="#94a3b8" />
                  <text x="233" y="82" font-size="13" fill="#334155" text-anchor="middle">环境</text>
                  <text x="233" y="98" font-size="8.5" fill="#94a3b8" text-anchor="middle">家庭 · 网络 · 制度</text>
                  <path d="M114 72 C142 46 164 46 188 72" fill="none" stroke="#22456d" stroke-width="1.4" marker-end="url(#cl-arrow)" />
                  <path d="M188 100 C160 126 138 126 114 100" fill="none" stroke="#22456d" stroke-width="1.4" marker-end="url(#cl-arrow)" />
                  <text x="151" y="82" font-size="8.5" fill="#94a3b8" text-anchor="middle">资源 · 信息 · 情感</text>
                  <text x="151" y="94" font-size="9.5" fill="#22456d" text-anchor="middle">适配度 fit</text>
                  <text x="150" y="150" font-size="9.5" fill="#475569" text-anchor="middle">适应是双向的：环境塑造人，人也改造环境</text>
                  <rect x="80" y="160" width="140" height="18" rx="6" fill="#fbfcfd" stroke="#e5e8ed" />
                  <text x="150" y="173" font-size="8.5" fill="#64748b" text-anchor="middle">核心评估指标：人与环境的适配度</text>
                </g>

                <!-- 03 压力与资源失配 -->
                <g v-else>
                  <text x="150" y="14" font-size="9.5" fill="#94a3b8" text-anchor="middle">压力 — 资源天平</text>
                  <text x="150" y="30" font-size="8.5" fill="#94a3b8" text-anchor="middle">资源调动效果受社会外部条件约束</text>
                  <line x1="46" y1="116" x2="254" y2="96" stroke="#22456d" stroke-width="2.2" stroke-linecap="round" />
                  <path d="M150 106 L141 132 L159 132 Z" fill="#cbd5e1" />
                  <line x1="46" y1="116" x2="46" y2="134" stroke="#94a3b8" stroke-width="1" />
                  <rect x="8" y="134" width="78" height="32" rx="6" fill="#fbf3f1" stroke="#c98b7f" />
                  <text x="47" y="148" font-size="10" fill="#8a4436" text-anchor="middle">环境要求</text>
                  <text x="47" y="160" font-size="7.5" fill="#b3452f" text-anchor="middle">转变·冲突·压迫</text>
                  <line x1="254" y1="96" x2="254" y2="122" stroke="#94a3b8" stroke-width="1" />
                  <rect x="216" y="122" width="78" height="32" rx="6" fill="#f1f7f4" stroke="#79a795" />
                  <text x="255" y="136" font-size="10" fill="#2f6f5a" text-anchor="middle">可用资源</text>
                  <text x="255" y="148" font-size="7.5" fill="#2f6f5a" text-anchor="middle">个人 + 社会网络</text>
                  <text x="150" y="176" font-size="9" fill="#475569" text-anchor="middle">环境要求 &gt; 可用资源 → 危机显性化</text>
                </g>
              </svg>
            </div>

            <div class="mt-4 rounded-panel border border-dashed border-line-strong p-4">
              <p class="eyebrow">解释边界</p>
              <p class="mt-2 text-[13px] leading-[1.9] text-slate-500">{{ active.boundary }}</p>
            </div>
          </div>

          <!-- 右：命题与拆解 -->
          <div>
            <p class="eyebrow">{{ active.nameEn }}</p>
            <h3 class="mt-2 font-serif text-2xl font-semibold leading-snug text-slate-900">{{ active.name }}</h3>

            <p class="mt-4 border-l-2 border-brand-300 pl-4 font-serif text-[17px] leading-[1.8] text-brand-800">
              {{ active.tagline }}
            </p>

            <p class="mt-5 text-[15px] leading-[1.9] text-slate-600">{{ active.statement }}</p>

            <div class="mt-6 border-t border-line pt-5">
              <p class="eyebrow">机制拆解</p>
              <dl class="mt-3 space-y-3">
                <div v-for="m in active.mechanism" :key="m.title" class="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt class="shrink-0 font-serif text-[14px] font-semibold text-slate-800 sm:w-28">{{ m.title }}</dt>
                  <dd class="text-sm leading-[1.9] text-slate-600">{{ m.text }}</dd>
                </div>
              </dl>
            </div>

            <div class="mt-6 border-t border-line pt-5">
              <p class="eyebrow">实务含义</p>
              <ul class="mt-3 space-y-2">
                <li v-for="(p, i) in active.practice" :key="i" class="flex gap-2.5 text-sm leading-[1.9] text-slate-600">
                  <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand-700" aria-hidden="true"></span>
                  <span>{{ p }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 小结 ===== -->
    <section class="mx-auto w-full px-6 pb-24 pt-10 md:px-8 md:pb-32 md:pt-14">
      <div class="mx-auto" :style="{ maxWidth: 'var(--content-max)' }">
        <div v-reveal class="panel p-6 md:p-8">
          <p class="eyebrow">{{ data.closing.title }}</p>

          <ol class="mt-5 space-y-4">
            <li v-for="(c, i) in data.closing.chain" :key="i" class="flex gap-4">
              <span
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[11px] text-slate-500"
                >{{ i + 1 }}</span
              >
              <div>
                <p class="font-serif text-[15px] font-semibold text-slate-900">{{ c.step }}</p>
                <p class="mt-1 text-sm leading-[1.9] text-slate-600">{{ c.text }}</p>
              </div>
            </li>
          </ol>

          <p class="mt-6 border-t border-line pt-4 text-sm leading-[1.9] text-slate-500">{{ data.closing.note }}</p>

          <div class="mt-6 border-t border-line pt-4">
            <p class="eyebrow">下一模块</p>
            <p class="mt-2 text-sm leading-[1.9] text-slate-500">{{ data.closing.nextModuleTeaser }}</p>
            <button type="button" class="btn btn-primary mt-4" @click="$emit('jump', 2)">进入模块 03</button>
          </div>
        </div>
      </div>

      <ReferenceList moduleName="corelogic" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import corelogicData from '@/data/corelogic.json'
import ReferenceList from './ReferenceList.vue'

defineEmits(['jump'])

const data = ref(corelogicData)
const activeId = ref(data.value.assumptions[0].id)

const active = computed(
  () => data.value.assumptions.find((a) => a.id === activeId.value) || data.value.assumptions[0]
)

function select(id) {
  activeId.value = id
}
</script>

<style scoped>
.module-swap {
  animation: module-swap-in 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes module-swap-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .module-swap {
    animation: none;
  }
}
</style>
