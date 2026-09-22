<!--
  背景层（原 BackgroundPixi 重构）
  原实现为 Pixi.js 粒子星云 + 透视网格 + 噪点叠加，属于夸张炫目特效，已整体移除。
  现改为纯 CSS 的静态纸面底 + 极淡网格，仅用于提供层次感，不参与动画循环，
  同时保留「背景纹理开关」交互能力（由 App.vue 的 bgEnabled 控制挂载）。
-->
<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <div
      class="absolute inset-0"
      style="background: linear-gradient(180deg, #fbfcfd 0%, var(--page-bg) 30%, var(--page-bg) 100%);"
    ></div>
    <div class="bg-grid absolute inset-0"></div>
    <div
      class="absolute inset-x-0 top-0 h-56"
      style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));"
    ></div>
  </div>
</template>

<script setup>
// 静态背景层，无脚本逻辑
</script>
