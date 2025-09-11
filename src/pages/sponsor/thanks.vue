<template>
  <div class="min-h-screen w-full p-4">
    <div class="max-w-md w-full mx-auto pt-10">
      <!-- 主要卡片 -->
      <Card
        class="shadow-xl border-0 bg-surface-50 dark:bg-surface-900 backdrop-blur-sm"
      >
        <template #content>
          <div class="text-center space-y-6">
            <!-- 圖示 -->
            <div class="flex justify-center">
              <div class="relative">
                <div class="w-16 h-16 flex items-center justify-center">
                  <i
                    class="ri-search-line text-white text-4xl animate-search"
                  ></i>
                </div>
              </div>
            </div>

            <!-- 標題 -->
            <div class="space-y-2">
              <h2 class="text-primary-500!">{{ titleMessage }}</h2>
              <p class="text-surface-600 dark:text-surface-300">
                {{ subtitleMessage }}
              </p>
            </div>

            <!-- 進度指示器 -->
            <div class="space-y-3">
              <ProgressBar
                :value="
                  Math.min(
                    progressValue,
                    hasTimedOut || isRedirecting ? 100 : 95,
                  )
                "
                class="w-full h-2"
                :showValue="false"
              />
              <div
                class="flex justify-between text-sm text-surface-500 dark:text-surface-400"
              >
                <span>{{ progressLabel }}</span>
                <span>{{ elapsedTime }}s</span>
              </div>
            </div>

            <!-- 狀態訊息 -->
            <div
              class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4"
            >
              <div class="flex items-center space-x-3">
                <i
                  class="pi pi-spinner text-primary-500"
                  :class="{ 'pi-spin': progressValue < 100 }"
                ></i>
                <span
                  class="text-primary-700 dark:text-primary-300 font-medium"
                >
                  {{ statusMessage }}
                </span>
              </div>
            </div>

            <!-- 提示訊息 -->
            <div
              class="text-sm text-surface-500 dark:text-surface-400 space-y-1"
            >
              <p>• 通常需要 1-3 秒完成處理</p>
              <p>• 如果超過 30 秒，請重新整理頁面</p>
              <p>• 處理完成後將自動跳轉到成功頁面</p>
            </div>

            <!-- 手動操作按鈕 -->
            <div
              class="pt-4 border-t border-surface-200 dark:border-surface-700"
            >
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
      <div class="space-y-3 mt-4 text-center">
        <p class="text-primary-500!">*{{ errorMessage }}</p>
        <div v-if="!userStore.isLoggedIn" class="flex justify-center">
          <Button
            label="開啟登入視窗"
            icon="pi pi-external-link"
            class="p-button-sm"
            @click="goToLogin"
          />
        </div>
        <!-- 新增：超時 CTA -->
        <div v-if="hasTimedOut" class="flex gap-2 justify-center">
          <Button
            label="再等30秒"
            icon="pi pi-clock"
            class="p-button-sm"
            @click="waitMore"
          />
          <Button
            label="前往錯誤協助頁"
            icon="pi pi-exclamation-triangle"
            severity="secondary"
            class="p-button-sm"
            @click="goToError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// 定義組件選項
defineOptions({
  name: 'SponsorThanks',
})
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
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
const hasTimedOut = ref(false) // 新增：超時狀態
const wasOffline = ref(false) // 新增：離線狀態追蹤
const isRedirecting = ref(false) // 新增：正在跳轉狀態

// 計算屬性
const titleMessage = computed(() => {
  if (hasTimedOut.value) {
    return '連線超時'
  } else if (isRedirecting.value) {
    return '贊助確認成功！正在跳轉...'
  } else {
    return '正在確認您的贊助...'
  }
})

const subtitleMessage = computed(() => {
  if (hasTimedOut.value) {
    return '連線超時，請重新整理頁面或聯繫客服'
  } else if (isRedirecting.value) {
    return '贊助確認成功！正在跳轉...'
  } else {
    return '請稍候，我們正在處理您的贊助資訊'
  }
})

// 進度標籤（左側「處理中」）
const progressLabel = computed(() => {
  if (hasTimedOut.value) return '已超時'
  if (isRedirecting.value) return '已確認，準備跳轉'
  if (!userStore.isLoggedIn) return '等待登入'
  if (wasOffline.value) return '離線中'
  return '處理中'
})

// 計時器
let progressTimer = null
let elapsedTimer = null
let pollTimer = null
let loginWindow = null
let loginStatusChecker = null

// 進度動畫
const startProgressAnimation = () => {
  // 重新啟動前先清除舊的進度計時器
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }

  const duration = 30000 // 30秒
  const interval = 100 // 每100ms更新一次
  const increment = (100 / duration) * interval

  progressTimer = setInterval(() => {
    if (progressValue.value < 100) {
      progressValue.value += increment
      // 未成功/未超時時將動畫上限限制在 95%
      const cap = hasTimedOut.value || isRedirecting.value ? 100 : 95
      if (progressValue.value > cap) {
        progressValue.value = cap
      }
    }
  }, interval)
}

// 開始輪詢
const startPolling = () => {
  if (isPolling.value) return

  isPolling.value = true
  isRedirecting.value = false
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
        errorMessage.value = '請先登入後，重新整理本頁以確認贊助狀態'
        stopPolling()
        return
      }

      // 調用API獲取最近成功贊助
      const response = await sponsorService.getLatestSuccessSponsor()
      console.log('輪詢結果:', response)

      if (response.data.success && response.data.data) {
        const sponsor = response.data.data
        console.log('找到贊助:', sponsor)

        // 檢查贊助是否在最近5分鐘內創建
        const sponsorTime = new Date(sponsor.createdAt)
        const now = new Date()
        const timeDiff = now - sponsorTime
        console.log('時間差 (毫秒):', timeDiff, '5分鐘限制:', 5 * 60 * 1000)

        if (timeDiff <= 5 * 60 * 1000) {
          // 5分鐘內
          console.log('符合時間條件，準備跳轉')
          // 找到最近的贊助，跳轉到成功頁面
          isRedirecting.value = true
          statusMessage.value = '贊助確認成功！正在跳轉...'
          progressValue.value = 100

          setTimeout(() => {
            console.log(
              '執行跳轉到:',
              `/sponsor/success?transaction_id=${sponsor.transaction_id}`,
            )
            router.replace(
              `/sponsor/success?transaction_id=${sponsor.transaction_id}`,
            )
          }, 1000)

          stopPolling()
          return
        } else {
          console.log('時間超出限制，不跳轉')
        }
      } else {
        console.log('沒有找到贊助資料')
      }

      // 如果還沒找到，繼續輪詢
      if (pollCount < maxPolls) {
        pollTimer = setTimeout(poll, 2000) // 每2秒輪詢一次
      } else {
        // 超時處理
        errorMessage.value = '處理時間過長，請重新整理頁面或聯繫客服'
        statusMessage.value = '處理超時'
        hasTimedOut.value = true // 新增：顯示 CTA
        isRedirecting.value = false
        try {
          await sponsorService.logPageAccess({
            pageType: 'thanks_timeout',
            message: '輪詢超時（30s）',
          })
        } catch (error) {
          console.error('記錄日誌失敗:', error)
        }
        stopPolling()
      }
    } catch (error) {
      console.error('輪詢贊助狀態失敗:', error)

      const status = error?.response?.status
      if (status === 401) {
        errorMessage.value = '登入已過期，請重新登入後再試'
        statusMessage.value = '需要重新登入'
        isPolling.value = false
        hasTimedOut.value = false
        await sponsorService
          .logPageAccess({ pageType: 'thanks_auth_expired' })
          .catch(() => {})
        return
      }
      if (status === 404) {
        // 尚未匹配到紀錄，維持輪詢不視為致命錯誤
        errorMessage.value = '尚未找到您的贊助紀錄（可能仍在處理或帳號不一致）'
        await sponsorService
          .logPageAccess({ pageType: 'thanks_404' })
          .catch(() => {})
        // 不 return，讓後面的 maxPolls 控制
      } else if (status === 429) {
        errorMessage.value = '系統繁忙，將延後重試'
        await sponsorService
          .logPageAccess({ pageType: 'thanks_429' })
          .catch(() => {})
        // 退避：本輪改為 3~5 秒後再試
        if (pollCount < maxPolls) {
          pollTimer = setTimeout(poll, 4000)
          return
        }
      } else if (status >= 500) {
        errorMessage.value = '系統忙碌，將自動重試'
      }

      if (pollCount < maxPolls) {
        // 繼續輪詢，可能是暫時性錯誤
        pollTimer = setTimeout(poll, 2000)
      } else {
        // 超時處理
        errorMessage.value = '處理時間過長，請重新整理頁面或聯繫客服'
        statusMessage.value = '處理超時'
        hasTimedOut.value = true // 新增：顯示 CTA
        isRedirecting.value = false
        try {
          await sponsorService.logPageAccess({
            pageType: 'thanks_timeout',
            message: '輪詢超時（30s）',
          })
        } catch (error) {
          console.error('記錄日誌失敗:', error)
        }
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

// 前往登入頁面
const goToLogin = () => {
  // 計算視窗位置，讓小視窗在螢幕中央
  const width = 500
  const height = 600
  const left = (screen.width - width) / 2
  const top = (screen.height - height) / 2

  // 開啟登入小視窗
  loginWindow = window.open(
    '/login',
    'loginWindow',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no`,
  )

  // 監聽小視窗關閉事件，檢查登入狀態
  loginStatusChecker = setInterval(() => {
    if (loginWindow && loginWindow.closed) {
      clearInterval(loginStatusChecker)
      loginStatusChecker = null
      loginWindow = null
      // 小視窗關閉後，檢查用戶是否已登入
      if (userStore.isLoggedIn) {
        // 如果已登入，重新開始輪詢
        errorMessage.value = ''
        startPolling()
      }
    }
  }, 1000)
}

// 新增：前往錯誤協助頁
const goToError = () => {
  const msg = '處理時間過長，請稍後再試或聯繫客服'
  router.replace(`/sponsor/error?message=${encodeURIComponent(msg)}`)
}

// 新增：離線/上線偵測
const handleOffline = () => {
  wasOffline.value = true
  statusMessage.value = '網路離線，請檢查您的連線'
  errorMessage.value = '偵測到離線狀態'
  isPolling.value = false
  sponsorService.logPageAccess({ pageType: 'thanks_offline' }).catch(() => {})
}

const handleOnline = () => {
  statusMessage.value = '已恢復連線，正在繼續檢查...'
  errorMessage.value = ''
  if (wasOffline.value) {
    wasOffline.value = false
    startPolling()
  }
}

// 新增：再等30秒功能
const waitMore = () => {
  hasTimedOut.value = false
  isRedirecting.value = false
  errorMessage.value = ''
  statusMessage.value = '正在重新嘗試...'
  progressValue.value = 0
  startProgressAnimation()
  startPolling()
}

// 計時器
const startTimer = () => {
  // 重新啟動前先清除舊的 elapsed 計時器
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
  elapsedTimer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

// 清理計時器
const cleanup = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
  if (loginStatusChecker) {
    clearInterval(loginStatusChecker)
    loginStatusChecker = null
  }
  if (loginWindow && !loginWindow.closed) {
    loginWindow.close()
    loginWindow = null
  }
  stopPolling()
}

// 處理登入成功後的邏輯
const handleLoginSuccess = () => {
  if (loginWindow && !loginWindow.closed) {
    // 用戶已登入，自動關閉登入小視窗
    loginWindow.close()
    loginWindow = null

    // 清理登入狀態檢查器
    if (loginStatusChecker) {
      clearInterval(loginStatusChecker)
      loginStatusChecker = null
    }

    // 清除錯誤訊息並開始輪詢
    errorMessage.value = ''
    startPolling()
  }
}

// 監聽登入狀態變化（方式一：直接監聽 computed ref）
watch(userStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    handleLoginSuccess()
  }
})

// 監聽 storage 事件同步本地儲存
const onStorageChange = (e) => {
  if (e.key === 'user') {
    try {
      const state = JSON.parse(e.newValue || '{}')
      if (state?.token && state.token.length > 0) {
        // 檢測到登入狀態變化，處理登入成功邏輯
        handleLoginSuccess()
      }
    } catch (error) {
      console.error('解析 storage 狀態失敗:', error)
    }
  }
}

// 組件掛載
onMounted(() => {
  // 添加 storage 事件監聽器
  window.addEventListener('storage', onStorageChange)

  // 新增：添加離線/上線事件監聽器
  window.addEventListener('offline', handleOffline)
  window.addEventListener('online', handleOnline)

  // 新增：記錄到達 thanks 頁面
  sponsorService
    .logPageAccess({ pageType: 'thanks', message: '用戶抵達贊助確認頁' })
    .catch((error) => {
      console.error('記錄頁面訪問日誌失敗:', error)
    })

  // 無論是否登入，都開始進度動畫和計時
  startProgressAnimation()
  startTimer()

  // 檢查用戶登入狀態
  if (!userStore.isLoggedIn) {
    errorMessage.value = '請先登入後，重新整理本頁以確認贊助狀態'
    // 即使沒有登入，也要啟動超時處理
    setTimeout(() => {
      if (!userStore.isLoggedIn) {
        errorMessage.value = '登入超時，請重新整理頁面或聯繫客服'
        statusMessage.value = '處理超時'
        hasTimedOut.value = true // 新增：顯示 CTA
        try {
          sponsorService
            .logPageAccess({
              pageType: 'thanks_timeout',
              message: '登入超時（30s）',
            })
            .catch(() => {})
        } catch (error) {
          console.error('記錄日誌失敗:', error)
        }
      }
    }, 30000) // 30秒後顯示超時訊息
    return
  }

  // 延遲1秒後開始輪詢，給用戶一些視覺反饋
  setTimeout(() => {
    startPolling()
  }, 1000)
})

// 組件卸載
onUnmounted(() => {
  // 移除 storage 事件監聽器
  window.removeEventListener('storage', onStorageChange)

  // 新增：移除離線/上線事件監聽器
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('online', handleOnline)

  cleanup()
})
</script>

<style scoped>
/* 搜尋動畫 */
.animate-search {
  animation: search 2s linear infinite;
}

@keyframes search {
  0% {
    transform: translate(10%, -12%);
  }
  30% {
    transform: translate(-10%, 12%);
  }
  50% {
    transform: translate(-10%, -12%);
  }
  80% {
    transform: translate(10%, 12%);
  }
  100% {
    transform: translate(10%, -12%);
  }
}
</style>

<route lang="yaml">
meta:
  title: '贊助確認中'
  description: '正在確認您的贊助，請稍候...'
  layout: 'full'
  login: ''
  admin: false
</route>
