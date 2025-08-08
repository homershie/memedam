<template>
  <div
    class="min-h-screen px-4 pt-6 flex justify-center min-w-full md:min-w-5xl md:px-0"
  >
    <!-- 主要內容區域 -->
    <div class="w-full max-w-md">
      <!-- 標題 -->
      <h1
        class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4"
      >
        註冊成功！
      </h1>

      <!-- 成功訊息 -->
      <div class="text-center mb-8">
        <!-- 成功圖示 -->
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4"
        >
          <i
            class="pi pi-check text-green-600 dark:text-green-400 text-2xl"
          ></i>
        </div>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          歡迎加入 MemeDam！
        </h2>

        <p class="text-gray-600 dark:text-gray-400">
          您的帳號
          <strong class="text-gray-900 dark:text-white">{{
            userData?.username
          }}</strong>
          已成功創建。
        </p>
      </div>

      <!-- Email 驗證狀態 -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="pi pi-info-circle text-blue-500 text-xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
              請驗證您的 Email
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                我們已向 <strong>{{ userData?.email }}</strong> 發送驗證信。
              </p>
              <p class="mt-1">請檢查您的信箱並點擊驗證連結來完成註冊。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="space-y-3 mb-6">
        <Button
          @click="resendVerificationEmail"
          :loading="isResending"
          :disabled="isResending"
          severity="secondary"
          class="w-full"
        >
          {{ isResending ? '發送中...' : '重新發送驗證信' }}
        </Button>

        <Button @click="goToLogin" severity="primary" class="w-full">
          前往登入
        </Button>
      </div>

      <!-- 注意事項 -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          注意事項：
        </h4>
        <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• 驗證信可能會被歸類到垃圾郵件資料夾</li>
          <li>• 驗證連結將在 24 小時後失效</li>
          <li>• 如果沒有收到驗證信，請檢查垃圾郵件資料夾</li>
          <li>• 驗證完成後即可正常使用所有功能</li>
        </ul>
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
defineOptions({ name: 'RegistrationSuccessPage' })

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import verificationService from '@/services/verificationService'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// 響應式數據
const isResending = ref(false)
const userData = ref(null)

// 重新發送驗證郵件
const resendVerificationEmail = async () => {
  if (!userData.value?.email) {
    toast.add({
      severity: 'error',
      summary: '發送失敗',
      detail: '無法獲取電子信箱地址',
      life: 3000,
    })
    return
  }

  isResending.value = true
  try {
    await verificationService.resendVerificationEmail(userData.value.email)
    toast.add({
      severity: 'success',
      summary: '發送成功',
      detail: '驗證郵件已重新發送',
      life: 3000,
    })
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: '發送失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    isResending.value = false
  }
}

// 前往登入頁面
const goToLogin = () => {
  router.push('/login')
}

// 從路由參數獲取用戶資料
onMounted(() => {
  const user = route.query.user
  if (user) {
    try {
      userData.value = JSON.parse(decodeURIComponent(user))
    } catch (error) {
      console.error('解析用戶資料失敗:', error)
      // 如果解析失敗，導向登入頁面
      router.push('/login')
    }
  } else {
    // 如果沒有用戶資料，導向登入頁面
    router.push('/login')
  }
})
</script>

<route lang="yaml">
meta:
  title: '註冊成功'
  admin: false
  layout: 'full'
</route>
