<!-- content -->
<template>
  <div class="relative top-0 left-0 min-h-screen h-auto w-full">
    <!-- Logo 區域 -->
    <div
      class="m-0 py-3 w-full h-20 fixed top-0 left-0 flex z-50 bg-surface-0 dark:bg-surface-900 box-border border-b border-surface-200 dark:border-surface-700 items-center justify-center lg:justify-start"
    >
      <router-link to="/" class="logo-link ms-3 lg:ms-20">
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-light_ne9fhd.png"
          alt="MemeDam"
          class="h-12 w-auto"
          v-if="isDark"
        />
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-dark_saeqez.png"
          alt="MemeDam"
          class="h-12 w-auto"
          v-else
        />
      </router-link>
    </div>
    <!-- slot for page content -->
    <router-view
      class="relative w-full h-[calc(100vh-80px)] top-20 left-0 overflow-y-auto"
    />
  </div>
</template>

<style scoped lang="scss">
/* Logo 在深色模式下的顏色轉換 */
.logo-link svg {
  transition: filter 0.3s ease;
}

/* 深色模式下將 Logo 反轉為白色 */
.dark .logo-link svg {
  filter: invert(1);
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 深淺色模式判斷
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

// 監聽主題類別變化
onMounted(() => {
  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true })
})

// 組件卸載時清理監聽器
onUnmounted(() => {
  if (themeObserver) themeObserver.disconnect()
})
</script>

<script>
export default {
  name: 'FullLayout',
}
</script>
