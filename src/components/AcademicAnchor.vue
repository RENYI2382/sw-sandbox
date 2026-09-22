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

    <!-- ===== 文献卡片 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 md:px-8">
      <div v-reveal class="panel overflow-hidden">
        <div class="grid gap-6 p-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-8">
          <div>
            <p class="eyebrow">Selected Reference</p>
            <h2 class="mt-3 font-serif text-xl font-semibold leading-snug text-slate-900 md:text-2xl">
              {{ data.reference.title }}
            </h2>
            <p class="mt-2 text-sm text-slate-500">{{ data.reference.titleZh }}</p>
            <p class="mt-4 font-serif text-[15px] text-slate-800">{{ data.reference.author }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="e in data.reference.editions" :key="e.label" class="chip">
                {{ e.label }} {{ e.value }}
              </span>
            </div>
          </div>

          <div class="rounded-panel border border-line bg-[#fbfcfd] p-5">
            <p class="eyebrow">学术定位</p>
            <p class="mt-2 font-serif text-[15px] leading-[1.8] text-brand-800">{{ data.reference.position }}</p>
            <p class="mt-4 border-t border-line pt-4 text-[13px] leading-[1.9] text-slate-500">
              {{ data.reference.abstract }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 核心观点 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.coreIdeas.title }}</h2>
        <span class="eyebrow hidden md:block">Key Arguments</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.coreIdeas.intro }}</p>

      <div class="mt-6 grid gap-3 md:grid-cols-3">
        <div v-for="(s, si) in data.coreIdeas.stressors" :key="s.index" v-reveal="si * 70" class="panel p-5">
          <div class="flex items-center justify-between">
            <span class="font-mono text-[11px] text-slate-400">{{ s.index }}</span>
            <span class="font-mono text-[10px] text-slate-300">{{ s.en }}</span>
          </div>
          <h3 class="mt-3 font-serif text-[17px] font-semibold text-slate-900">{{ s.name }}</h3>
          <p class="mt-2 text-sm leading-[1.9] text-slate-600">{{ s.text }}</p>
        </div>
      </div>

      <div v-reveal="120" class="panel mt-4 p-6">
        <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p class="eyebrow">{{ data.coreIdeas.goal.title }}</p>
            <p class="mt-3 border-l-2 border-brand-300 pl-4 font-serif text-[17px] leading-[1.8] text-brand-800">
              {{ data.coreIdeas.goal.text }}
            </p>
          </div>
          <div>
            <p class="eyebrow">作用机理</p>
            <p class="mt-3 text-sm leading-[1.9] text-slate-600">{{ data.coreIdeas.goal.principle }}</p>
            <div class="mt-4 border-t border-line pt-4">
              <p class="eyebrow">{{ data.coreIdeas.assessment3d.title }}</p>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="a in data.coreIdeas.assessment3d.items" :key="a" class="chip chip-brand">{{ a }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 干预方法论 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.method.title }}</h2>
        <span class="eyebrow hidden md:block">Methodology</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.method.intro }}</p>

      <div v-reveal="80" class="panel mt-6 overflow-hidden">
        <div class="flex flex-wrap gap-1 border-b border-line bg-[#fbfcfd] p-3" role="tablist" aria-label="干预阶段切换">
          <button
            v-for="st in data.method.stages"
            :key="st.id"
            type="button"
            role="tab"
            :aria-selected="activeStageId === st.id"
            class="rounded-chip px-3 py-1.5 text-[13px] transition-colors duration-200"
            :class="
              activeStageId === st.id
                ? 'bg-brand-50 font-medium text-brand-800'
                : 'text-slate-500 hover:bg-white hover:text-brand-800'
            "
            @click="activeStageId = st.id"
          >
            <span class="mr-1.5 font-mono text-[11px] opacity-60">{{ st.index }}</span>{{ st.name }}
          </button>
        </div>

        <div :key="activeStage.id" class="module-swap grid gap-8 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-8">
          <div>
            <p class="eyebrow">{{ activeStage.en }}</p>
            <h3 class="mt-2 font-serif text-2xl font-semibold text-slate-900">{{ activeStage.name }}</h3>
            <p class="mt-4 text-[15px] leading-[1.9] text-slate-600">{{ activeStage.goal }}</p>

            <div class="mt-5 rounded-panel border border-line bg-[#fbfcfd] p-4">
              <p class="eyebrow">阶段产出</p>
              <p class="mt-2 text-sm leading-[1.9] text-slate-600">{{ activeStage.output }}</p>
            </div>

            <div class="mt-4 rounded-panel border border-dashed border-line-strong p-4">
              <p class="eyebrow">社工角色</p>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="r in activeStage.roles" :key="r" class="chip chip-brand">{{ r }}</span>
              </div>
            </div>
          </div>

          <div>
            <p class="eyebrow">工作内容</p>
            <ul class="mt-3 space-y-3">
              <li v-for="(a, ai) in activeStage.actions" :key="ai" class="flex gap-3 text-sm leading-[1.9] text-slate-600">
                <span
                  class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[10px] text-slate-500"
                  >{{ ai + 1 }}</span
                >
                <span>{{ a }}</span>
              </li>
            </ul>

            <div class="mt-6 border-t border-line pt-5">
              <p class="eyebrow">{{ data.method.roleFlow.title }}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <template v-for="(r, ri) in data.method.roleFlow.flow" :key="r">
                  <span class="chip">{{ r }}</span>
                  <span v-if="ri < data.method.roleFlow.flow.length - 1" class="text-slate-300" aria-hidden="true">→</span>
                </template>
              </div>
              <p class="mt-3 text-[13px] leading-[1.9] text-slate-500">{{ data.method.roleFlow.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 价值与局限 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div class="grid gap-4 md:grid-cols-2">
        <div v-reveal class="panel p-6">
          <p class="eyebrow">Value</p>
          <h2 class="mt-2 font-serif text-xl font-semibold text-slate-900">{{ data.value.title }}</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="(p, pi) in data.value.points" :key="pi" class="flex gap-2.5 text-sm leading-[1.9] text-slate-600">
              <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand-700" aria-hidden="true"></span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>

        <div v-reveal="80" class="panel bg-[#fcfcfd] p-6">
          <p class="eyebrow">Limitations</p>
          <h2 class="mt-2 font-serif text-xl font-semibold text-slate-900">{{ data.limitations.title }}</h2>
          <ul class="mt-4 space-y-3">
            <li
              v-for="(p, pi) in data.limitations.points"
              :key="pi"
              class="flex gap-2.5 text-sm leading-[1.9] text-slate-600"
            >
              <span class="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden="true"></span>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ===== 延伸 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="panel p-6 md:p-8">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="font-serif text-xl font-semibold text-slate-900">{{ data.extension.title }}</h2>
          <span class="eyebrow hidden md:block">Extension</span>
        </div>

        <ol class="mt-5 grid gap-3 md:grid-cols-2">
          <li
            v-for="(s, si) in data.extension.steps"
            :key="si"
            class="flex gap-3 rounded-panel border border-line p-4 text-sm leading-[1.9] text-slate-600"
          >
            <span
              class="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[10px] text-slate-500"
              >{{ si + 1 }}</span
            >
            <span>{{ s }}</span>
          </li>
        </ol>

        <div class="mt-6 border-t border-line pt-5">
          <p class="eyebrow">{{ data.extension.roles.title }}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="r in data.extension.roles.items" :key="r" class="chip chip-brand">{{ r }}</span>
          </div>
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

          <div class="mt-6 border-t border-line pt-4">
            <p class="eyebrow">下一模块</p>
            <p class="mt-2 text-sm leading-[1.9] text-slate-500">{{ data.closing.nextModuleTeaser }}</p>
            <button type="button" class="btn btn-primary mt-4" @click="$emit('jump', 4)">进入模块 05</button>
          </div>
        </div>
      </div>

      <ReferenceList moduleName="academic" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import academicData from '@/data/academic.json'
import ReferenceList from './ReferenceList.vue'

defineEmits(['jump'])

const data = ref(academicData)
const activeStageId = ref(data.value.method.stages[0].id)

const activeStage = computed(
  () => data.value.method.stages.find((s) => s.id === activeStageId.value) || data.value.method.stages[0]
)
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
