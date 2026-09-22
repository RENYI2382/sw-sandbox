/**
 * 滚动渐入（scroll reveal）指令
 *
 * 用法：
 *   <div v-reveal>          // 无延迟
 *   <div v-reveal="120">    // 延迟 120ms（用于同屏元素的依次出现）
 *
 * 动画时长由 CSS 变量 --reveal-duration 控制（0.5s，位于 0.3–0.6s 区间内），
 * 元素进入视口后添加 .is-visible 并立即取消监听，避免重复触发与滚动抖动。
 */

let observer = null

function ensureObserver() {
  if (observer) return observer
  if (typeof IntersectionObserver === 'undefined') return null

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  )
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')

    const delay = Number(binding.value) || 0
    if (delay > 0) el.style.transitionDelay = `${delay}ms`

    const io = ensureObserver()
    if (!io) {
      // 环境不支持 IntersectionObserver 时直接呈现，保证内容可见
      el.classList.add('is-visible')
      return
    }
    io.observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}

export default vReveal
