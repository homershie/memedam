<template>
  <div class="inline-ad-wrapper">
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-9007041139144014"
      data-ad-slot="1439630557"
      data-ad-format="auto"
      data-full-width-responsive="true"
    >
    </ins>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
let observer = null
const hasPushed = ref(false)

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
  if (!('IntersectionObserver' in window)) {
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
    { rootMargin: '100px' },
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

// SPA 切頁：當 route 變動，重新 render 並 push 一次
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
      el.innerHTML = ''
      setupLazyPush(el)
    }
  },
)
</script>

<style scoped>
.inline-ad-wrapper {
  margin: 1rem 0;
  text-align: center;
}
</style>
