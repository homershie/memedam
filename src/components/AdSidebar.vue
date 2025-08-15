<template>
  <div class="sidebar-ad-wrapper">
    <ins
      class="adsbygoogle"
      style="display: inline-block; width: 200px; height: 800px"
      data-ad-client="ca-pub-9007041139144014"
      data-ad-slot="6500385548"
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
.sidebar-ad-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem 0;
}
</style>
