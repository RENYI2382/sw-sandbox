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
      </div>
    </section>

    <!-- ===== 包容性 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 md:px-8">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.inclusion.title }}</h2>
        <span class="eyebrow hidden md:block">Inclusiveness</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.inclusion.intro }}</p>

      <div class="mt-6 space-y-3">
        <div v-for="(l, li) in data.inclusion.layers" :key="l.id" v-reveal="li * 70" class="panel overflow-hidden">
          <button
            type="button"
            class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            :aria-expanded="openLayer === l.id"
            @click="toggleLayer(l.id)"
          >
            <div class="min-w-0">
              <p class="flex flex-wrap items-baseline gap-x-3">
                <span class="font-mono text-[11px] text-slate-400">{{ l.en }}</span>
                <span class="font-serif text-[16px] font-semibold text-slate-900">{{ l.level }}</span>
              </p>
              <p class="mt-1 text-[13px] text-slate-500">{{ l.focus }}</p>
            </div>
            <div class="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              <span v-for="t in l.theories" :key="t" class="chip chip-brand">{{ t }}</span>
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4 text-slate-400 transition-transform duration-300"
                :class="openLayer === l.id ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </button>

          <div class="grid" :style="expandStyle(l.id)">
            <div class="overflow-hidden">
              <p class="border-t border-line px-5 py-4 text-sm leading-[1.9] text-slate-600">{{ l.detail }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 短板 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.limitations.title }}</h2>
        <span class="eyebrow hidden md:block">Limitations</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.limitations.intro }}</p>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <div v-for="(it, li) in data.limitations.items" :key="it.index" v-reveal="li * 60" class="panel p-5">
          <div class="flex items-center gap-3">
            <span class="font-mono text-[11px] text-slate-400">{{ it.index }}</span>
            <span class="h-px flex-1 bg-line" aria-hidden="true"></span>
          </div>
          <h3 class="mt-3 font-serif text-[16px] font-semibold text-slate-900">{{ it.title }}</h3>
          <p class="mt-2 text-sm leading-[1.9] text-slate-600">{{ it.text }}</p>
        </div>
      </div>
    </section>

    <!-- ===== 前沿 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.frontier.title }}</h2>
        <span class="eyebrow hidden md:block">Frontier</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.frontier.intro }}</p>

      <div class="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div class="space-y-3">
          <div v-for="(it, li) in data.frontier.items" :key="it.index" v-reveal="li * 70" class="panel p-5">
            <div class="flex items-center gap-3">
              <span class="font-mono text-[11px] text-slate-400">{{ it.index }}</span>
              <span class="h-px flex-1 bg-line" aria-hidden="true"></span>
            </div>
            <h3 class="mt-3 font-serif text-[16px] font-semibold text-slate-900">{{ it.title }}</h3>
            <p class="mt-2 text-sm leading-[1.9] text-slate-600">{{ it.text }}</p>
          </div>
        </div>

        <div v-reveal="100" class="panel p-5 md:p-6">
          <p class="eyebrow">{{ data.frontier.outlook.title }}</p>
          <ol class="mt-4 space-y-4">
            <li v-for="(o, oi) in data.frontier.outlook.items" :key="oi" class="flex gap-3">
              <span
                class="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[10px] text-slate-500"
                >{{ oi + 1 }}</span
              >
              <span class="text-sm leading-[1.9] text-slate-600">{{ o }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ===== 中外比较 ===== -->
    <section class="mx-auto w-full max-w-[72rem] px-6 pt-12 md:px-8 md:pt-16">
      <div v-reveal class="flex items-baseline justify-between gap-4">
        <h2 class="font-serif text-xl font-semibold text-slate-900 md:text-2xl">{{ data.comparison.title }}</h2>
        <span class="eyebrow hidden md:block">Comparative</span>
      </div>
      <p v-reveal="60" class="mt-3 max-w-3xl text-sm leading-[1.9] text-slate-500">{{ data.comparison.intro }}</p>

      <div v-reveal="80" class="panel mt-6 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr class="bg-[#fbfcfd]">
                <th
                  v-for="c in data.comparison.columns"
                  :key="c"
                  scope="col"
                  class="border-b border-line px-5 py-3 text-left font-serif text-[13px] font-semibold text-slate-900"
                >
                  {{ c }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ri) in data.comparison.rows" :key="ri" class="align-top">
                <th scope="row" class="border-b border-line px-5 py-3.5 text-left font-medium text-slate-800">
                  {{ row[0] }}
                </th>
                <td class="border-b border-line px-5 py-3.5 leading-[1.85] text-slate-600">{{ row[1] }}</td>
                <td class="border-b border-line px-5 py-3.5 leading-[1.85] text-slate-600">{{ row[2] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-reveal="120" class="mt-3 text-xs leading-[1.9] text-slate-400">{{ data.comparison.note }}</p>
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
            <button type="button" class="btn btn-primary mt-4" @click="$emit('jump', 3)">进入模块 04</button>
          </div>
        </div>
      </div>

      <ReferenceList moduleName="global" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import globalData from '@/data/global.json'
import ReferenceList from './ReferenceList.vue'

defineEmits(['jump'])

const data = ref(globalData)
const openLayer = ref(data.value.inclusion.layers[0].id)

function toggleLayer(id) {
  openLayer.value = openLayer.value === id ? null : id
}

// 展开 / 收起：0.4s 过渡，落在 0.3–0.6s 区间
function expandStyle(id) {
  const open = openLayer.value === id
  return {
    gridTemplateRows: open ? '1fr' : '0fr',
    opacity: open ? 1 : 0,
    transition: 'grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
  }
}
</script>
