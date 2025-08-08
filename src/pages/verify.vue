<template>
  <div
    class="min-h-screen px-4 pt-6 flex justify-center min-w-full md:min-w-5xl md:px-0"
  >
    <!-- 主要內容區域 -->
    <div class="w-full max-w-md">
      <!-- 載入狀態 -->
      <div v-if="isVerifying" class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4"
        >
          <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400 text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          正在驗證...
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          正在驗證您的電子信箱，請稍候...
        </p>
      </div>

      <!-- 成功狀態 -->
      <div v-else-if="verificationStatus === 'success'" class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4"
        >
          <i class="pi pi-check text-green-600 dark:text-green-400 text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          驗證成功！
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          您的電子信箱已成功驗證，現在可以使用所有功能了。
        </p>
        <div class="space-y-3">
          <Button @click="goToHome" severity="primary" class="w-full">
            前往首頁
          </Button>
          <Button @click="goToLogin" severity="secondary" class="w-full">
            前往登入
          </Button>
        </div>
      </div>

      <!-- 失敗狀態 -->
      <div v-else-if="verificationStatus === 'error'" class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4"
        >
          <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          驗證失敗
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ errorMessage }}
        </p>
        <div class="space-y-3">
          <Button @click="retryVerification" severity="warning" class="w-full">
            重新嘗試
          </Button>
          <Button @click="goToLogin" severity="secondary" class="w-full">
            前往登入
          </Button>
        </div>
      </div>

      <!-- 無效連結狀態 -->
      <div v-else-if="verificationStatus === 'invalid'" class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4"
        >
          <i class="pi pi-exclamation-circle text-yellow-600 dark:text-yellow-400 text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          無效的驗證連結
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          此驗證連結已失效或無效，請重新發送驗證信。
        </p>
        <div class="space-y-3">
          <Button @click="goToLogin" severity="primary" class="w-full">
            前往登入
          </Button>
        </div>
      </div>
    </div>

    <!-- 版權聲明 -->
    <div
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
    >
      © 2025 迷因典 MemeDam
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'VerifyPage' })

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import verificationService from '@/services/verificationService'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// 響應式數據
const isVerifying = ref(true)
const verificationStatus = ref('') // 'success', 'error', 'invalid'
const errorMessage = ref('')

// 驗證電子信箱
const verifyEmail = async (token) => {
  try {
    await verificationService.verifyEmail(token)
    verificationStatus.value = 'success'
    
    toast.add({
      severity: 'success',
      summary: '驗證成功',
      detail: '您的電子信箱已成功驗證',
      life: 3000,
    })
  } catch (error) {
    console.error('郵件驗證失敗:', error)
    
    const errorMsg = error.response?.data?.message || 
                    error.response?.data?.error || 
                    '驗證失敗，請稍後再試'
    
    errorMessage.value = errorMsg
    
    // 根據錯誤類型設定狀態
    if (error.response?.status === 400 || error.response?.status === 404) {
      verificationStatus.value = 'invalid'
    } else {
      verificationStatus.value = 'error'
    }
    
    toast.add({
      severity: 'error',
      summary: '驗證失敗',
      detail: errorMsg,
      life: 3000,
    })
  } finally {
    isVerifying.value = false
  }
}

// 重新嘗試驗證
const retryVerification = () => {
  const token = route.query.token
  if (token) {
    isVerifying.value = true
    verificationStatus.value = ''
    errorMessage.value = ''
    verifyEmail(token)
  } else {
    goToLogin()
  }
}

// 前往首頁
const goToHome = () => {
  router.push('/')
}

// 前往登入頁面
const goToLogin = () => {
  router.push('/login')
}

// 初始化
onMounted(() => {
  const token = route.query.token
  
  if (!token) {
    verificationStatus.value = 'invalid'
    isVerifying.value = false
    errorMessage.value = '缺少驗證令牌'
    return
  }
  
  // 開始驗證
  verifyEmail(token)
})
</script>

<route lang="yaml">
meta:
  title: '電子信箱驗證'
  admin: false
  layout: 'full'
</route>
