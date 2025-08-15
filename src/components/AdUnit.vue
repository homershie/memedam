<template>
  <!-- 建議用容器先保留高度，避免 CLS -->
  <div :style="wrapperStyle">
    <ins
      class="adsbygoogle"
      :style="insStyle"
      data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="responsive"
      :data-ad-layout-key="adLayoutKey"
      :data-adtest="adTest"
    >
    </ins>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, nextTick, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Props 說明：
 * - adSlot：AdSense 後台產生的 slot id（必填）
 * - adFormat：'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid' 等
 * - responsive：'true' | 'false'
 * - width / height：預留高度（避免 CLS）
 * - lazy：是否使用 IntersectionObserver 進入視窗才 push
 * - adLayoutKey：原生 in-article/in-feed 可能會用到
 * - adTest：開發測試用 'on'，上線請移除或設空字串
 */
const props = defineProps({
  adSlot: { type: String, required: true },
  adFormat: { type: String, default: 'auto' },
  responsive: { type: String, default: 'true' },
  width: { type: [Number, String], default: '100%' },
  height: { type: [Number, String], default: 280 }, // 手機預留高度
  lazy: { type: Boolean, default: true },
  adLayoutKey: { type: String, default: '' },
  adTest: { type: String, default: '' },
})

const route = useRoute()
let observer = null
const hasPushed = ref(false)

const wrapperStyle = computed(() => ({
  width:
    typeof props.width === 'number' ? `${props.width}px` : `${props.width}`,
  minHeight:
    typeof props.height === 'number' ? `${props.height}px` : `${props.height}`,
  display: 'block',
}))

// 如果你要固定尺寸廣告，可改這裡 style 為 width/height 固定盒
const insStyle = computed(() => {
  // 自適應用 display:block；in-article/in-feed 也可用 'display:block'
  return 'display:block'
})

function pushAds() {
  if (hasPushed.value) return
  if (!window.adsbygoogle) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    hasPushed.value = true
  } catch {
    // 靜默，避免控制台噴錯（AdSense 尚未 ready 時）
  }
}

function setupLazyPush(el) {
  if (!props.lazy || !('IntersectionObserver' in window)) {
    pushAds()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        pushAds()
        observer && observer.disconnect()
        observer = null
      }
    },
    { rootMargin: '200px' },
  )
  observer.observe(el)
}

onMounted(async () => {
  await nextTick()
  const el =
    document.querySelectorAll('.adsbygoogle')[
      document.querySelectorAll('.adsbygoogle').length - 1
    ]
  if (el) setupLazyPush(el)
})

onBeforeUnmount(() => {
  observer && observer.disconnect()
  observer = null
})

// SPA 切頁：當 route 變動，重新 render 並 push 一次（避免只有首屏有廣告）
watch(
  () => route.fullPath,
  async () => {
    hasPushed.value = false
    await nextTick()
    const el =
      document.querySelectorAll('.adsbygoogle')[
        document.querySelectorAll('.adsbygoogle').length - 1
      ]
    if (el) {
      // 重新建立 <ins> 內容（AdSense 通常認某個 ins 只能 push 一次）
      el.innerHTML = ''
      // 再 push（可搭配 lazy）
      setupLazyPush(el)
    }
  },
)
</script>
