<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <div class="max-w-2xl mx-auto text-center space-y-8 py-16">
      <!-- 錯誤圖示 -->
      <div
        class="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
      >
        <i class="pi pi-exclamation-triangle text-4xl text-red-600"></i>
      </div>

      <!-- 錯誤標題 -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-red-600">贊助處理失敗</h1>
        <p class="text-lg text-surface-600">
          很抱歉，處理您的贊助時發生了問題。請不用擔心，這不會影響您的付款。
        </p>
      </div>

      <!-- 錯誤詳情 -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 space-y-4">
        <h3 class="text-xl font-semibold text-red-700 dark:text-red-300">
          錯誤詳情
        </h3>
        <div class="text-left space-y-2">
          <div class="flex justify-between">
            <span class="text-surface-600">錯誤訊息：</span>
            <span class="text-red-600 font-medium">{{ errorMessage }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-600">發生時間：</span>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <!-- 常見問題 -->
      <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6 space-y-4">
        <h3 class="text-xl font-semibold">常見問題</h3>
        <div class="space-y-4 text-left">
          <div class="space-y-2">
            <h4 class="font-medium text-surface-700 dark:text-surface-300">
              Q: 我的付款是否成功？
            </h4>
            <p class="text-surface-600 text-sm">
              如果您的銀行帳戶或信用卡已扣款，付款通常是成功的。這個錯誤可能是系統處理問題，不會影響您的付款。
            </p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-surface-700 dark:text-surface-300">
              Q: 我需要重新付款嗎？
            </h4>
            <p class="text-surface-600 text-sm">
              不需要重新付款。如果您的付款已成功，我們會自動處理並記錄您的贊助。
            </p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-surface-700 dark:text-surface-300">
              Q: 如何確認我的贊助狀態？
            </h4>
            <p class="text-surface-600 text-sm">
              您可以稍後重新訪問贊助頁面，或聯繫我們的客服團隊確認贊助狀態。
            </p>
          </div>
        </div>
      </div>

      <!-- 聯繫方式 -->
      <div
        class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 space-y-4"
      >
        <h3
          class="text-xl font-semibold text-primary-700 dark:text-primary-300"
        >
          需要協助？
        </h3>
        <p class="text-surface-600">如果您對贊助有任何疑問，歡迎聯繫我們：</p>
        <div class="space-y-2 text-left">
          <div class="flex items-center space-x-3">
            <i class="pi pi-envelope text-primary-600"></i>
            <span>Email: support@memedam.com</span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="pi pi-comments text-primary-600"></i>
            <span>Discord: 迷因典社群</span>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          label="重新嘗試贊助"
          icon="pi pi-refresh"
          severity="warning"
          @click="retryDonation"
          class="flex-1 sm:flex-none"
        />
        <Button
          label="回到贊助頁面"
          icon="pi pi-arrow-left"
          severity="secondary"
          @click="goToDonate"
          class="flex-1 sm:flex-none"
        />
        <Button
          label="回到首頁"
          icon="pi pi-home"
          @click="goToHome"
          class="flex-1 sm:flex-none"
        />
      </div>

      <!-- 安慰訊息 -->
      <div
        class="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg"
      >
        <p
          class="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2"
        >
          別擔心，這只是暫時的問題！
        </p>
        <p class="text-surface-600">
          迷因長會繼續努力維護平台，確保每個贊助者都能得到應有的回饋。
          感謝您的耐心和理解！
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()

const errorMessage = ref('處理贊助時發生錯誤')

// 格式化日期
const formatDate = (date) => {
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 重新嘗試贊助
const retryDonation = () => {
  router.push('/donate')
}

// 回到贊助頁面
const goToDonate = () => {
  router.push('/donate')
}

// 回到首頁
const goToHome = () => {
  router.push('/')
}

// 載入錯誤訊息
const loadErrorMessage = () => {
  const message = route.query.message
  if (message) {
    errorMessage.value = decodeURIComponent(message)
  }
}

onMounted(() => {
  loadErrorMessage()
})
</script>

<script>
export default {
  name: 'SponsorErrorPage',
}
</script>

<route lang="yaml">
meta:
  title: '贊助處理失敗'
  description: '很抱歉，處理您的贊助時發生了問題。請不用擔心，這不會影響您的付款。'
  login: ''
  admin: false
</route>
