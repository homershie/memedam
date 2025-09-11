<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <div class="max-w-2xl mx-auto text-center space-y-8 py-16">
      <!-- 錯誤圖示 -->
      <div class="w-fit h-fit mx-auto flex items-center justify-center">
        <i class="ri-close-circle-fill text-6xl text-primary-500"></i>
      </div>

      <!-- 錯誤標題 -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-primary-600">贊助處理失敗</h1>
        <p class="text-lg text-surface-600">
          很抱歉，處理您的贊助時發生了問題。請不用擔心，這不會影響您的付款。
        </p>
      </div>

      <!-- 錯誤詳情 -->
      <div class="bg-surface-50 dark:bg-surface-900 rounded-lg p-6 space-y-4">
        <h3
          class="text-xl font-semibold text-primary-700 dark:text-primary-300"
        >
          錯誤詳情
        </h3>
        <div class="text-left space-y-2">
          <div class="flex justify-between">
            <span class="text-surface-600 dark:text-surface-400"
              >錯誤訊息：</span
            >
            <span class="text-primary-600 font-medium">{{ errorMessage }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-600 dark:text-surface-400"
              >發生時間：</span
            >
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <!-- 常見問題 -->
      <div class="bg-surface-50 dark:bg-surface-900 rounded-lg p-6 space-y-4">
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
              Q: 為什麼會顯示連線超時錯誤？
            </h4>
            <p class="text-surface-600 text-sm">
              有可能您在Ko-fi的贊助是在5分鐘以前執行，所以迷因典的系統會找不到贊助資料，請和迷因長聯繫。
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
          <div class="space-y-2">
            <h4 class="font-medium text-surface-700 dark:text-surface-300">
              Q: 贊助牆沒有顯示我的贊助怎麼辦？
            </h4>
            <p class="text-surface-600 text-sm">
              您可以提供錯誤訊息、電子信箱和發生時間，並使用以下管道聯繫迷因長處理。
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
            <i class="pi pi-envelope text-primary-600"></i>
            <span
              >聯絡頁面：<router-link to="/contact" class="text-primary-600"
                >https://www.memedam.com/contact</router-link
              ></span
            >
          </div>
        </div>
      </div>

      <!-- 安慰訊息 -->
      <div class="p-6">
        <h6 class="gradient-text mb-2">別擔心，這只是暫時的問題！</h6>
        <p class="gradient-text">
          迷因長會繼續努力維護平台，確保每個贊助者都能得到應有的回饋。
          感謝您的耐心和理解！
        </p>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          label="回到首頁"
          severity="secondary"
          icon="pi pi-home"
          @click="goToHome"
          class="flex-1 sm:flex-none"
        />
        <Button
          label="前往聯絡頁面"
          icon="pi pi-arrow-right"
          severity="secondary"
          @click="goToContact"
          class="flex-1 sm:flex-none"
        />
        <Button
          label="前往贊助頁面"
          icon="pi pi-arrow-right"
          severity="secondary"
          @click="retryDonation"
          class="flex-1 sm:flex-none"
        />
        <Button
          v-if="!userStore.isLoggedIn && !isLoginWindowOpen"
          label="開啟登入視窗"
          icon="pi pi-external-link"
          @click="goToLogin"
          class="flex-1 sm:flex-none"
        />
        <Button
          v-if="redirectPath"
          :label="getBackButtonLabel()"
          icon="pi pi-refresh"
          severity="success"
          @click="goBackToOriginal"
          class="flex-1 sm:flex-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const errorMessage = ref('處理贊助時發生錯誤')
const redirectPath = ref(null)
const isLoginWindowOpen = ref(false)

// 登入視窗相關變數
let loginWindow = null
let loginStatusChecker = null
let userStatusChecker = null

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
const goToContact = () => {
  router.push('/contact')
}

// 回到首頁
const goToHome = () => {
  router.push('/')
}

// 獲取返回按鈕的標籤
const getBackButtonLabel = () => {
  if (!redirectPath.value) {
    return '返回贊助驗證'
  }

  // 根據重定向路徑判斷按鈕標籤
  if (redirectPath.value.includes('/sponsor/success')) {
    return '返回贊助成功頁面'
  } else if (redirectPath.value.includes('/sponsor/thanks')) {
    return '返回贊助驗證頁面'
  } else if (redirectPath.value.includes('/sponsor/')) {
    return '返回贊助頁面'
  } else {
    return '返回原頁面'
  }
}

// 返回贊助驗證頁面
const goBackToOriginal = () => {
  // 如果有重定向路徑，使用重定向路徑
  if (redirectPath.value) {
    router.push(redirectPath.value)
  } else {
    // 檢查錯誤訊息，判斷用戶的意圖
    if (errorMessage.value.includes('需要登入')) {
      // 如果是因為未登入被重定向，跳轉到贊助頁面
      router.push('/donate')
    } else if (errorMessage.value.includes('尚未進行任何贊助')) {
      // 如果是因為沒有贊助記錄，跳轉到贊助頁面
      router.push('/donate')
    } else {
      // 其他情況，跳轉到贊助驗證頁面
      router.push('/sponsor/thanks')
    }
  }
}

// 前往登入頁面
const goToLogin = () => {
  // 計算視窗位置，讓小視窗在螢幕中央
  const width = 500
  const height = 600
  const left = (screen.width - width) / 2
  const top = (screen.height - height) / 2

  // 標記登入視窗已開啟
  isLoginWindowOpen.value = true

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
      isLoginWindowOpen.value = false

      // 小視窗關閉後，檢查用戶是否已登入
      if (userStore.isLoggedIn) {
        // 如果已登入，重新嘗試訪問原頁面
        handleLoginSuccess()
      }
    }
  }, 1000)

  // 額外檢查：定期檢查用戶狀態變化
  userStatusChecker = setInterval(() => {
    if (isLoginWindowOpen.value && userStore.isLoggedIn) {
      console.log('定期檢查發現用戶已登入')
      handleLoginSuccess()
    }
  }, 2000)
}

// 處理登入成功後的邏輯
const handleLoginSuccess = () => {
  if (loginWindow && !loginWindow.closed) {
    // 用戶已登入，自動關閉登入小視窗
    loginWindow.close()
    loginWindow = null
    isLoginWindowOpen.value = false

    // 清理登入狀態檢查器
    if (loginStatusChecker) {
      clearInterval(loginStatusChecker)
      loginStatusChecker = null
    }
  }

  // 登入成功後，嘗試返回原頁面或重新整理
  if (redirectPath.value) {
    // 延遲一下讓用戶狀態完全更新
    setTimeout(() => {
      router.push(redirectPath.value)
    }, 1000)
  } else {
    // 重新整理頁面以重新檢查贊助狀態
    window.location.reload()
  }
}

// 載入錯誤訊息
const loadErrorMessage = () => {
  const message = route.query.message
  if (message) {
    errorMessage.value = decodeURIComponent(message)
  }

  const redirect = route.query.redirect
  if (redirect) {
    redirectPath.value = decodeURIComponent(redirect)
  }
}

// 監聽登入狀態變化
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
      console.log('Storage 變化檢測到:', state)

      if (state?.token && state.token.length > 0) {
        console.log('檢測到登入狀態變化，處理登入成功邏輯')
        // 同步登入狀態到 userStore（避免必須整頁重整）
        try {
          userStore.login(state)
        } catch (syncErr) {
          console.error('同步 userStore 失敗:', syncErr)
        }
        // 檢測到登入狀態變化，處理登入成功邏輯
        handleLoginSuccess()
      }
    } catch (error) {
      console.error('解析 storage 狀態失敗:', error)
    }
  }
}

// 清理函數
const cleanup = () => {
  if (loginStatusChecker) {
    clearInterval(loginStatusChecker)
    loginStatusChecker = null
  }
  if (userStatusChecker) {
    clearInterval(userStatusChecker)
    userStatusChecker = null
  }
  if (loginWindow && !loginWindow.closed) {
    loginWindow.close()
    loginWindow = null
  }
  isLoginWindowOpen.value = false
}

onMounted(() => {
  // 添加 storage 事件監聽器
  window.addEventListener('storage', onStorageChange)

  loadErrorMessage()
})

onUnmounted(() => {
  // 移除 storage 事件監聽器
  window.removeEventListener('storage', onStorageChange)

  // 清理登入視窗相關資源
  cleanup()
})
</script>

<script>
export default {
  name: 'SponsorErrorPage',
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(45deg, #ff3399, #a259f7, #33ff33);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
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

<route lang="yaml">
meta:
  title: '贊助處理失敗'
  description: '很抱歉，處理您的贊助時發生了問題。請不用擔心，這不會影響您的付款。'
  layout: 'full'
  login: ''
  admin: false
</route>
