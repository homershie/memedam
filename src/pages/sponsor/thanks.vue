<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- 主要卡片 -->
      <Card
        class="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
      >
        <template #content>
          <div class="text-center space-y-6">
            <!-- 圖示 -->
            <div class="flex justify-center">
              <div class="relative">
                <div
                  class="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse"
                >
                  <i class="pi pi-check text-white text-3xl"></i>
                </div>
                <div
                  class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce"
                >
                  <i class="pi pi-star-fill text-white text-sm"></i>
                </div>
              </div>
            </div>

            <!-- 標題 -->
            <div class="space-y-2">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                正在確認您的贊助...
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                請稍候，我們正在處理您的贊助資訊
              </p>
            </div>

            <!-- 進度指示器 -->
            <div class="space-y-3">
              <ProgressBar
                :value="progressValue"
                class="w-full h-2"
                :showValue="false"
              />
              <div
                class="flex justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span>處理中</span>
                <span>{{ elapsedTime }}s</span>
              </div>
            </div>

            <!-- 狀態訊息 -->
            <div
              class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div class="flex items-center space-x-3">
                <i class="pi pi-spin pi-spinner text-blue-500"></i>
                <span class="text-blue-700 dark:text-blue-300 font-medium">
                  {{ statusMessage }}
                </span>
              </div>
            </div>

            <!-- 提示訊息 -->
            <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>• 通常需要 1-3 秒完成處理</p>
              <p>• 如果超過 30 秒，請重新整理頁面</p>
              <p>• 處理完成後將自動跳轉到成功頁面</p>
            </div>

            <!-- 手動操作按鈕 -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                label="重新整理"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-sm"
                @click="refreshPage"
                :disabled="isPolling"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 錯誤提示 -->
      <Message
        v-if="errorMessage"
        severity="error"
        :closable="false"
        class="mt-4"
      >
        {{ errorMessage }}
      </Message>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, definePageMeta } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// 定義組件選項
defineOptions({
  name: 'SponsorThanks',
})
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import Message from 'primevue/message'
import sponsorService from '@/services/sponsorService'

// 路由和狀態管理
const router = useRouter()
const userStore = useUserStore()

// 響應式數據
const progressValue = ref(0)
const elapsedTime = ref(0)
const statusMessage = ref('正在檢查您的贊助狀態...')
const errorMessage = ref('')
const isPolling = ref(false)

// 計時器
let timer = null
let pollTimer = null

// 進度動畫
const startProgressAnimation = () => {
  const duration = 30000 // 30秒
  const interval = 100 // 每100ms更新一次
  const increment = (100 / duration) * interval

  timer = setInterval(() => {
    if (progressValue.value < 95) {
      progressValue.value += increment
    }
  }, interval)
}

// 開始輪詢
const startPolling = () => {
  if (isPolling.value) return

  isPolling.value = true
  let pollCount = 0
  const maxPolls = 15 // 最多輪詢15次 (30秒)

  const poll = async () => {
    try {
      pollCount++

      // 更新狀態訊息
      if (pollCount <= 5) {
        statusMessage.value = '正在檢查您的贊助狀態...'
      } else if (pollCount <= 10) {
        statusMessage.value = '正在驗證交易資訊...'
      } else {
        statusMessage.value = '正在處理最後步驟...'
      }

      // 檢查用戶是否已登入
      if (!userStore.isLoggedIn) {
        errorMessage.value = '請先登入以確認贊助狀態'
        stopPolling()
        return
      }

      // 調用API獲取最近成功贊助
      const response = await sponsorService.getLatestSuccessSponsor()

      if (response.success && response.data) {
        const sponsor = response.data

        // 檢查贊助是否在最近5分鐘內創建
        const sponsorTime = new Date(sponsor.createdAt)
        const now = new Date()
        const timeDiff = now - sponsorTime

        if (timeDiff <= 5 * 60 * 1000) {
          // 5分鐘內
          // 找到最近的贊助，跳轉到成功頁面
          statusMessage.value = '贊助確認成功！正在跳轉...'
          progressValue.value = 100

          setTimeout(() => {
            router.replace(
              `/sponsor/success?transaction_id=${sponsor.transaction_id}`,
            )
          }, 1000)

          stopPolling()
          return
        }
      }

      // 如果還沒找到，繼續輪詢
      if (pollCount < maxPolls) {
        pollTimer = setTimeout(poll, 2000) // 每2秒輪詢一次
      } else {
        // 超時處理
        errorMessage.value = '處理時間過長，請重新整理頁面或聯繫客服'
        statusMessage.value = '處理超時'
        stopPolling()
      }
    } catch (error) {
      console.error('輪詢贊助狀態失敗:', error)

      if (pollCount < maxPolls) {
        // 繼續輪詢，可能是暫時性錯誤
        pollTimer = setTimeout(poll, 2000)
      } else {
        errorMessage.value = '無法確認贊助狀態，請重新整理頁面'
        statusMessage.value = '處理失敗'
        stopPolling()
      }
    }
  }

  // 開始第一次輪詢
  poll()
}

// 停止輪詢
const stopPolling = () => {
  isPolling.value = false
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

// 重新整理頁面
const refreshPage = () => {
  window.location.reload()
}

// 計時器
const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

// 清理計時器
const cleanup = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  stopPolling()
}

// 組件掛載
onMounted(() => {
  // 檢查用戶登入狀態
  if (!userStore.isLoggedIn) {
    errorMessage.value = '請先登入以確認贊助狀態'
    return
  }

  // 開始進度動畫和計時
  startProgressAnimation()
  startTimer()

  // 延遲1秒後開始輪詢，給用戶一些視覺反饋
  setTimeout(() => {
    startPolling()
  }, 1000)
})

// 組件卸載
onUnmounted(() => {
  cleanup()
})

// 頁面元數據
definePageMeta({
  title: '贊助確認中',
  description: '正在確認您的贊助，請稍候...',
  layout: 'full',
})
</script>

<style scoped>
/* 自定義動畫 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* 背景漸變動畫 */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
