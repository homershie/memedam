<template>
  <div
    class="min-h-screen px-4 pt-6 flex justify-center min-w-full md:min-w-5xl md:px-0"
  >
    <!-- 主要內容區域 -->
    <div class="w-full max-w-md">
      <!-- 返回按鈕 -->
      <div class="mb-6">
        <button
          @click="router.push('/login')"
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          返回登入
        </button>
      </div>

      <!-- 標題 -->
      <h1
        class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4"
      >
        重設密碼
      </h1>

      <!-- 說明文字 -->
      <p
        class="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center leading-relaxed"
      >
        請輸入您的新密碼。
      </p>

      <!-- 表單 -->
      <form @submit.prevent="onSubmit" class="space-y-6 mb-8">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >新密碼*</label
          >
          <Password
            v-model="formData.newPassword"
            name="newPassword"
            autocomplete="new-password"
            class="w-full"
            :class="{ 'p-invalid': errors.newPassword }"
            placeholder="請輸入新密碼"
            :feedback="false"
            toggleMask
          />
          <small class="text-red-500 text-xs" v-if="errors.newPassword">{{
            errors.newPassword
          }}</small>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >確認新密碼*</label
          >
          <Password
            v-model="formData.confirmPassword"
            name="confirmPassword"
            autocomplete="new-password"
            class="w-full"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="請再次輸入新密碼"
            :feedback="false"
            toggleMask
          />
          <small class="text-red-500 text-xs" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</small>
        </div>

        <Button
          type="submit"
          class="w-full h-12 text-base font-medium"
          severity="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          重設密碼
        </Button>
      </form>

      <!-- 成功訊息 -->
      <div
        v-if="isSuccess"
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="pi pi-check-circle text-green-400 text-xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
              密碼重設成功
            </h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>您的密碼已成功重設。請使用新密碼登入。</p>
            </div>
          </div>
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
defineOptions({ name: 'ResetPasswordPage' })

import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Password from 'primevue/password'
import userService from '@/services/userService'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// 響應式數據
const isSubmitting = ref(false)
const isSuccess = ref(false)
const token = ref('')

const formData = reactive({
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive({
  newPassword: '',
  confirmPassword: '',
})

// 從 URL 參數獲取 token
onMounted(() => {
  const tokenParam = route.query.token
  if (!tokenParam) {
    toast.add({
      severity: 'error',
      summary: '無效的連結',
      detail: '重設密碼連結無效',
      life: 3000,
    })
    router.push('/login')
    return
  }
  token.value = tokenParam
})

// 驗證函數
const validateForm = () => {
  errors.newPassword = ''
  errors.confirmPassword = ''

  if (!formData.newPassword) {
    errors.newPassword = '新密碼必填'
  } else if (formData.newPassword.length < 8) {
    errors.newPassword = '密碼至少8個字元'
  } else if (formData.newPassword.length > 20) {
    errors.newPassword = '密碼最多20個字元'
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = '請再次輸入密碼'
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = '兩次密碼輸入不一致'
  }

  return !errors.newPassword && !errors.confirmPassword
}

// 提交表單
const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await userService.resetPassword(token.value, formData.newPassword)

    isSuccess.value = true
    toast.add({
      severity: 'success',
      summary: '密碼重設成功',
      detail: '請使用新密碼登入',
      life: 3000,
    })

    // 3秒後跳轉到登入頁面
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: '重設失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
/* 輸入框樣式 */
:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}
</style>

<route lang="yaml">
meta:
  title: '重設密碼'
  description: '設定新密碼以完成重設流程，請妥善保存您的帳號資訊。'
  admin: false
  layout: 'full'
</route>
