<template>
  <div
    v-if="filteredRefs.length > 0"
    v-reveal
    class="mx-auto mt-6"
    :style="{ maxWidth: 'var(--content-max)' }"
  >
    <div class="panel p-6 md:p-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class="h-4 w-1 rounded-sm bg-brand-700" aria-hidden="true"></span>
        <p class="eyebrow">参考文献 · References</p>
        <span class="chip ml-auto">共 {{ filteredRefs.length }} 条</span>
      </div>

      <p class="mt-3 text-xs leading-[1.8] text-slate-400">
        按发表年份排序，与正文中的 (作者, 年份) 标注一一对应。
      </p>

      <ol class="mt-5 space-y-4">
        <li v-for="(ref, i) in filteredRefs" :key="ref.id" class="flex gap-3">
          <span class="mt-[3px] shrink-0 font-mono text-xs text-slate-400">[{{ i + 1 }}]</span>
          <p class="text-sm leading-[1.85] text-slate-600">
            <span class="font-semibold text-slate-800">{{ ref.authors }}</span>
            <span class="text-slate-500"> ({{ ref.year }}). </span>
            <span class="italic text-slate-700">{{ ref.title }}</span>
            <span class="text-slate-400">. </span>
            <span class="text-slate-500">{{ ref.source }}</span>
            <span v-if="ref.titleZh" class="text-slate-400">（{{ ref.titleZh }}）</span>
            <span class="chip ml-2 px-1.5 py-0.5 text-[10px]" :class="{ 'chip-brand': ref.type === 'journal' }">
              {{ ref.type === 'journal' ? 'JOURNAL' : 'BOOK' }}
            </span>
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import references from '@/data/references.json'

const props = defineProps({
  moduleName: {
    type: String,
    required: true,
  },
})

// 按当前模块 ID 过滤需要展示的文献
const filteredRefs = computed(() =>
  references.filter((ref) => (ref.moduleRefs || []).includes(props.moduleName))
)
</script>
