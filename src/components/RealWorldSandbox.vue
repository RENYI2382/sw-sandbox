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

        <p v-reveal="160" class="mt-6 text-[15px] leading-[1.9] text-slate-600 md:text-base">{{ data.lead }}</p>
      </div>
    </section>

    <!-- ===== 案例信息 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 md:px-8">
      <div v-reveal class="panel p-6 md:p-8">
        <p class="eyebrow">Case Study</p>
        <h2 class="mt-3 font-serif text-lg font-semibold leading-snug text-slate-900 md:text-xl">
          《{{ data.caseInfo.title }}》
        </h2>

        <dl class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="eyebrow">研究年份</dt>
            <dd class="mt-1 font-mono text-[13px] text-slate-600">{{ data.caseInfo.year }}</dd>
          </div>
          <div>
            <dt class="eyebrow">研究方法</dt>
            <dd class="mt-1 text-[13px] text-slate-600">{{ data.caseInfo.method }}</dd>
          </div>
          <div>
            <dt class="eyebrow">服务对象</dt>
            <dd class="mt-1 text-[13px] text-slate-600">{{ data.caseInfo.subject }}</dd>
          </div>
          <div>
            <dt class="eyebrow">实践场域</dt>
            <dd class="mt-1 text-[13px] text-slate-600">{{ data.caseInfo.setting }}</dd>
          </div>
        </dl>

        <p class="mt-5 border-l-2 border-brand-300 pl-4 text-sm leading-[1.9] text-slate-600">
          {{ data.caseInfo.coreIssue }}
        </p>
      </div>
    </section>

    <!-- ===== 案例背景材料 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.caseBackground.title }}</h2>
        <span class="eyebrow hidden md:block">{{ data.caseBackground.eyebrow }}</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.caseBackground.lead }}</p>

      <div v-reveal="80" class="panel mt-6 p-6 md:p-8">
        <p class="eyebrow">{{ data.caseBackground.profileTitle }}</p>
        <dl class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="p in data.caseBackground.profile" :key="p.label">
            <dt class="eyebrow">{{ p.label }}</dt>
            <dd class="mt-1 text-[13px] leading-[1.9] text-slate-600">{{ p.value }}</dd>
          </div>
        </dl>

        <div class="mt-6 border-t border-line pt-5">
          <p class="eyebrow">{{ data.caseBackground.narrativeTitle }}</p>
          <div class="mt-3 space-y-4">
            <p
              v-for="(t, ti) in data.caseBackground.narrative"
              :key="ti"
              class="text-sm leading-[1.9] text-slate-600"
            >
              {{ t }}
            </p>
          </div>
        </div>
      </div>

      <div v-reveal class="panel mt-6 p-6 md:p-8">
        <p class="eyebrow">Timeline</p>
        <h3 class="mt-2 font-serif text-lg font-semibold text-slate-900">{{ data.caseBackground.timelineTitle }}</h3>
        <p class="mt-2 text-[13px] leading-[1.9] text-slate-500">{{ data.caseBackground.timelineLead }}</p>

        <ol class="mt-5 border-t border-line">
          <li
            v-for="(t, ti) in data.caseBackground.timeline"
            :key="ti"
            class="grid grid-cols-[74px_minmax(0,1fr)] gap-3 border-b border-line py-4 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-5"
          >
            <div>
              <span class="block font-mono text-[11px] text-slate-500">{{ t.time }}</span>
              <span class="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-brand-700">{{
                t.stage
              }}</span>
            </div>
            <div class="min-w-0">
              <p class="eyebrow">{{ t.system }}</p>
              <p class="mt-1 text-sm leading-[1.9] text-slate-600">{{ t.event }}</p>
            </div>
          </li>
        </ol>

        <p class="mt-4 text-[12px] leading-[1.9] text-slate-400">{{ data.caseBackground.sourceNote }}</p>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div
          v-for="(t, ti) in data.caseBackground.tensions"
          :key="t.id"
          v-reveal="ti * 60"
          class="panel p-6"
        >
          <p class="eyebrow">{{ t.layer }}</p>
          <h3 class="mt-2 font-serif text-base font-semibold leading-snug text-slate-900">{{ t.title }}</h3>
          <p class="mt-3 text-sm leading-[1.9] text-slate-600">{{ t.text }}</p>
        </div>
      </div>

      <div v-reveal class="panel mt-6 p-6 md:p-8">
        <p class="eyebrow">Stakeholders</p>
        <h3 class="mt-2 font-serif text-lg font-semibold text-slate-900">{{ data.caseBackground.subjectsTitle }}</h3>
        <p class="mt-2 text-[13px] leading-[1.9] text-slate-500">{{ data.caseBackground.subjectsLead }}</p>

        <ul class="mt-4 border-t border-line">
          <li
            v-for="(s, si) in data.caseBackground.subjects"
            :key="si"
            class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-3"
          >
            <span class="chip chip-brand shrink-0">{{ s.level }}</span>
            <span class="text-sm font-medium text-slate-900">{{ s.name }}</span>
            <span class="w-full text-[13px] leading-[1.9] text-slate-600 sm:w-auto sm:flex-1">{{ s.note }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 生态诊断沙盘 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">生态图与系统诊断</h2>
        <span class="eyebrow hidden md:block">Ecomap</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">
        点击任一节点查看其诊断信息。节点颜色随干预推演动态变化，用以显示该层级的失衡状态。
      </p>

      <div v-reveal="80" class="panel mt-6 p-4 md:p-6">
        <div class="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <svg viewBox="0 0 340 250" class="w-full" role="img" aria-label="案例生态系统分层图">
              <g stroke="#e5e8ed" stroke-width="1" stroke-dasharray="3 3">
                <line v-for="(l, li) in links" :key="li" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
              </g>

              <g
                v-for="n in nodeList"
                :key="n.id"
                class="cursor-pointer"
                role="button"
                tabindex="0"
                :aria-label="`${n.level} ${n.name}`"
                @click="selectedId = n.id"
                @keydown.enter.prevent="selectedId = n.id"
              >
                <text :x="4" :y="n.y - 6" font-size="8" fill="#94a3b8">{{ n.levelEn }}</text>
                <rect
                  :x="n.x"
                  :y="n.y"
                  :width="n.w"
                  :height="n.h"
                  rx="7"
                  :fill="styleOf(n.id).fill"
                  :stroke="styleOf(n.id).stroke"
                  :stroke-width="selectedId === n.id ? 2 : 1.2"
                  :stroke-dasharray="styleOf(n.id).dash"
                />
                <circle :cx="n.x + 15" :cy="n.y + n.h / 2" r="3.5" :fill="styleOf(n.id).dot" />
                <text :x="n.x + 27" :y="n.y + n.h / 2 + 3.5" font-size="10" :fill="styleOf(n.id).text">
                  {{ n.name }}
                </text>
              </g>
            </svg>

            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
              <span v-for="l in data.legend" :key="l.state" class="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span
                  class="h-2.5 w-2.5 shrink-0 rounded-full border"
                  :style="{ background: STATE_STYLES[l.state].fill, borderColor: STATE_STYLES[l.state].stroke }"
                ></span>
                {{ l.label }}
              </span>
            </div>
          </div>

          <!-- 节点详情 -->
          <div class="rounded-panel border border-line bg-[#fbfcfd] p-5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="eyebrow">{{ selected.levelEn }} · {{ selected.level }}</span>
              <span
                class="chip"
                :style="{
                  borderColor: STATE_STYLES[stateOf(selected.id)].stroke,
                  color: STATE_STYLES[stateOf(selected.id)].text,
                  background: STATE_STYLES[stateOf(selected.id)].fill,
                }"
                >{{ STATE_STYLES[stateOf(selected.id)].label }}</span
              >
            </div>

            <h3 class="mt-3 font-serif text-lg font-semibold leading-snug text-slate-900">{{ selected.name }}</h3>

            <dl class="mt-4 space-y-4">
              <div>
                <dt class="eyebrow">现状诊断</dt>
                <dd class="mt-1 text-sm leading-[1.9] text-slate-600">{{ selected.diagnosis }}</dd>
              </div>
              <div>
                <dt class="eyebrow">堵点</dt>
                <dd class="mt-1 text-sm leading-[1.9] text-slate-600">{{ selected.blockage }}</dd>
              </div>
              <div>
                <dt class="eyebrow">可用资源 / 优势</dt>
                <dd class="mt-1 text-sm leading-[1.9] text-slate-600">{{ selected.resource }}</dd>
              </div>
              <div class="border-t border-line pt-4">
                <dt class="eyebrow">干预要点</dt>
                <dd class="mt-1 text-sm leading-[1.9] text-slate-600">{{ selected.intervention }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 干预推演 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">干预推演</h2>
        <span class="eyebrow hidden md:block">Intervention Walkthrough</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">
        按 Pardeck 七步干预模式推进推演，观察生态图状态的变化。干预顺序本身即理论的体现，可逐步点击体验。
      </p>

      <div v-reveal="80" class="panel mt-6 overflow-hidden">
        <div class="flex flex-wrap gap-1 border-b border-line bg-[#fbfcfd] p-3" role="tablist" aria-label="干预步骤切换">
          <button
            v-for="(s, si) in data.steps"
            :key="s.id"
            type="button"
            role="tab"
            :aria-selected="currentStep === si"
            class="rounded-chip px-3 py-1.5 text-[13px] transition-colors duration-200"
            :class="
              currentStep === si
                ? 'bg-brand-50 font-medium text-brand-800'
                : 'text-slate-500 hover:bg-white hover:text-brand-800'
            "
            @click="currentStep = si"
          >
            <span class="mr-1.5 font-mono text-[11px] opacity-60">{{ si + 1 }}</span>{{ s.label }}
          </button>
        </div>

        <div :key="step.id" class="module-swap p-5 md:p-8">
          <p class="eyebrow">{{ step.pardeck }} · 社工角色：{{ step.role }}</p>
          <h3 class="mt-3 font-serif text-xl font-semibold leading-snug text-slate-900 md:text-2xl">
            {{ step.title }}
          </h3>
          <p class="mt-4 text-[15px] leading-[1.9] text-slate-600">{{ step.detail }}</p>

          <p class="mt-5 rounded-panel border border-dashed border-line-strong bg-[#fbfcfd] p-4 text-[13px] leading-[1.9] text-slate-500">
            {{ step.note }}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <button type="button" class="btn" :disabled="currentStep === 0" @click="currentStep -= 1">上一步</button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="currentStep === data.steps.length - 1"
              @click="currentStep += 1"
            >
              下一步
            </button>
            <button type="button" class="btn" @click="currentStep = 0">重置推演</button>
            <span class="font-mono text-[11px] text-slate-400"
              >STEP {{ currentStep + 1 }} / {{ data.steps.length }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 讨论导引 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">
          {{ data.caseBackground.promptsTitle }}
        </h2>
        <span class="eyebrow hidden md:block">Analysis Guide</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">
        {{ data.caseBackground.promptsLead }}
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div v-for="(p, pi) in data.caseBackground.prompts" :key="p.id" v-reveal="pi * 70" class="panel p-6">
          <p class="eyebrow">{{ p.step }}</p>
          <h3 class="mt-2 font-serif text-base font-semibold leading-snug text-slate-900">{{ p.title }}</h3>
          <p class="mt-3 text-sm leading-[1.9] text-slate-600">{{ p.text }}</p>
        </div>
      </div>
    </section>

    <!-- ===== 讨论题 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">课堂讨论题</h2>
        <span class="eyebrow hidden md:block">Discussion</span>
      </div>

      <div class="mt-6 space-y-4">
        <div v-for="(q, qi) in data.discussion" :key="q.id" v-reveal="qi * 70" class="panel overflow-hidden">
          <div class="p-5 md:p-6">
            <div class="flex items-start gap-3">
              <span
                class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[10px] text-slate-500"
                >Q{{ qi + 1 }}</span
              >
              <p class="font-serif text-[16px] font-semibold leading-[1.8] text-slate-900">{{ q.question }}</p>
            </div>

            <button
              type="button"
              class="btn mt-4"
              :aria-expanded="openAnswer === q.id"
              @click="openAnswer = openAnswer === q.id ? null : q.id"
            >
              {{ openAnswer === q.id ? '收起参考答案' : '查看参考答案' }}
            </button>

            <div class="grid" :style="answerStyle(q.id)">
              <div class="overflow-hidden">
                <div class="mt-4 border-t border-line pt-4">
                  <p class="eyebrow">参考答案要点</p>
                  <p class="mt-2 text-sm leading-[1.9] text-slate-600">{{ q.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 反思 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.reflection.title }}</h2>
        <span class="eyebrow hidden md:block">Reflection</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.reflection.intro }}</p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div v-reveal class="panel p-6">
          <p class="eyebrow">Fragility</p>
          <h3 class="mt-2 font-serif text-lg font-semibold text-slate-900">{{ data.reflection.fragility.title }}</h3>
          <ul class="mt-4 space-y-3">
            <li
              v-for="(p, pi) in data.reflection.fragility.points"
              :key="pi"
              class="flex gap-2.5 text-sm leading-[1.9] text-slate-600"
            >
              <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden="true"></span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>

        <div v-reveal="80" class="panel p-6">
          <p class="eyebrow">Institutionalization</p>
          <h3 class="mt-2 font-serif text-lg font-semibold text-slate-900">
            {{ data.reflection.institutionalization.title }}
          </h3>
          <ul class="mt-4 space-y-3">
            <li
              v-for="(p, pi) in data.reflection.institutionalization.points"
              :key="pi"
              class="flex gap-2.5 text-sm leading-[1.9] text-slate-600"
            >
              <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand-700" aria-hidden="true"></span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ===== 小结 ===== -->
    <section class="mx-auto w-full px-6 pb-24 pt-12 md:px-8 md:pb-32 md:pt-16">
      <div class="mx-auto" :style="{ maxWidth: 'var(--content-max)' }">
        <div v-reveal class="panel p-6 md:p-8">
          <p class="eyebrow">{{ data.closing.title }}</p>
          <ul class="mt-5 space-y-3">
            <li v-for="(p, pi) in data.closing.points" :key="pi" class="flex gap-2.5 text-sm leading-[1.9] text-slate-600">
              <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand-700" aria-hidden="true"></span>
              <span>{{ p }}</span>
            </li>
          </ul>

          <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <button type="button" class="btn btn-primary" @click="$emit('jump', 0)">回到模块 01 · 理论溯源</button>
            <span class="text-xs text-slate-400">推演结束，可回到时间线复习理论演进脉络。</span>
          </div>
        </div>
      </div>

      <ReferenceList moduleName="sandbox" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import sandboxData from '@/data/sandbox.json'
import ReferenceList from './ReferenceList.vue'

defineEmits(['jump'])

const STATE_STYLES = {
  blocked: { fill: '#fbf3f1', stroke: '#c98b7f', dot: '#b3452f', text: '#8a4436', dash: '0', label: '堵点' },
  assessed: { fill: '#f8fbfe', stroke: '#bcd2ea', dot: '#8fb3d9', text: '#3f5f80', dash: '0', label: '已评估' },
  target: { fill: '#eff5fb', stroke: '#22456d', dot: '#22456d', text: '#22456d', dash: '0', label: '改变目标' },
  progress: { fill: '#f5f9fe', stroke: '#5c8dc1', dot: '#3a6ea5', text: '#2a5688', dash: '0', label: '改善中' },
  resolved: { fill: '#f1f7f4', stroke: '#79a795', dot: '#2f6f5a', text: '#2f6f5a', dash: '0', label: '已改善' },
  constraint: { fill: '#fbf3f1', stroke: '#c98b7f', dot: '#b3452f', text: '#8a4436', dash: '4 3', label: '制度性约束' },
}

const data = ref(sandboxData)
const nodeList = ref(data.value.nodes)
const selectedId = ref(data.value.nodes[0].id)
const currentStep = ref(0)
const openAnswer = ref(null)

const step = computed(() => data.value.steps[currentStep.value])

const selected = computed(() => nodeList.value.find((n) => n.id === selectedId.value) || nodeList.value[0])

// 累积状态：第 0 步至当前步的 changes 依次叠加
const stateMap = computed(() => {
  const acc = {}
  nodeList.value.forEach((n) => {
    acc[n.id] = n.state
  })
  for (let i = 0; i <= currentStep.value; i += 1) {
    Object.assign(acc, data.value.steps[i].changes)
  }
  return acc
})

const links = computed(() =>
  data.value.links.map((l) => {
    const from = nodeList.value.find((n) => n.id === l.from)
    const to = nodeList.value.find((n) => n.id === l.to)
    return {
      x1: from.x + from.w / 2,
      y1: from.y + from.h,
      x2: to.x + to.w / 2,
      y2: to.y,
    }
  })
)

function stateOf(id) {
  return stateMap.value[id] || 'blocked'
}

function styleOf(id) {
  return STATE_STYLES[stateOf(id)] || STATE_STYLES.blocked
}

function answerStyle(id) {
  const open = openAnswer.value === id
  return {
    gridTemplateRows: open ? '1fr' : '0fr',
    opacity: open ? 1 : 0,
    transition: 'grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
  }
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
