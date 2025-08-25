<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div class="max-w-md mx-auto text-center space-y-8 p-6">
      <!-- 404 圖示 -->
      <div class="text-8xl mb-6">🤔</div>

      <!-- 主要標題 -->
      <div class="space-y-4">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          頁面不存在
        </h2>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          抱歉，您訪問的頁面不存在或已被移動。
          <br />
          可能是網址輸入錯誤，或該頁面已被刪除。
        </p>
      </div>

      <!-- 建議操作 -->
      <div class="space-y-4">
        <div class="space-x-3">
          <Button
            label="返回首頁"
            icon="pi pi-home"
            @click="router.push('/')"
            class="p-button-primary"
            size="large"
          />
          <Button
            label="返回上一頁"
            icon="pi pi-arrow-left"
            @click="handleGoBack"
            class="p-button-secondary"
            size="large"
          />
        </div>

        <!-- 搜尋建議 -->
        <div class="pt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            或者試試以下選項：
          </p>
          <div class="space-y-2">
            <Button
              label="瀏覽所有迷因"
              icon="pi pi-images"
              @click="router.push('/memes/all')"
              class="p-button-outlined w-full"
              text
            />
            <Button
              label="熱門迷因"
              icon="pi pi-star"
              @click="router.push('/memes/hot')"
              class="p-button-outlined w-full"
              text
            />
            <Button
              label="最新迷因"
              icon="pi pi-clock"
              @click="router.push('/memes/new')"
              class="p-button-outlined w-full"
              text
            />
          </div>
        </div>
      </div>

      <!-- 回報問題 -->
      <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-2">
          如果您認為這是網站錯誤，請
          <button
            @click="reportIssue"
            class="text-primary-600 hover:text-primary-700 underline"
          >
            回報問題
          </button>
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          錯誤代碼：404 | 頁面：{{ currentPath }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { setPageMeta } from '@/utils/seoUtils'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const currentPath = ref('')

// 處理返回上一頁
const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// 回報問題
const reportIssue = () => {
  // 這裡可以整合回報系統或發送到分析工具
  toast.add({
    severity: 'info',
    summary: '感謝回報',
    detail: '我們已收到您的回報，將盡快處理此問題',
    life: 3000,
  })

  // 記錄到 console 供開發者參考
  console.warn('404 Error reported:', {
    path: currentPath.value,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  })
}

// 設定頁面 SEO
const setup404SEO = () => {
  setPageMeta({
    title: '404 - 頁面不存在',
    description: '抱歉，您訪問的頁面不存在。返回首頁或瀏覽其他內容。',
    canonical: `${window.location.origin}/404`,
    robots: 'noindex, nofollow',
    openGraph: {
      title: '404 - 頁面不存在 | 迷因典 MemeDam',
      description: '抱歉，您訪問的頁面不存在。返回首頁或瀏覽其他內容。',
      url: `${window.location.origin}/404`,
      image: `${window.location.origin}/favicon/apple-touch-icon.png`,
    },
  })
}

onMounted(() => {
  currentPath.value = route.fullPath
  setup404SEO()
})
</script>

<route lang="yaml">
meta:
  title: '404 - 頁面不存在'
  layout: 'full'
</route>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.p-button {
  transition: all 0.3s ease;
}

.p-button:hover {
  transform: translateY(-1px);
}
</style>
