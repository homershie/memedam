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
        忘記密碼
      </h1>

      <!-- 說明文字 -->
      <p
        class="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center leading-relaxed"
      >
        請輸入您的電子信箱，我們將發送密碼重設連結給您。
      </p>

      <!-- 表單 -->
      <form @submit.prevent="onSubmit" class="space-y-6 mb-8">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >電子信箱*</label
          >
          <InputText
            v-model="formData.email"
            type="email"
            name="email"
            autocomplete="email"
            class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
            placeholder="請輸入您的電子信箱"
          />
          <small class="text-red-500 text-xs" v-if="errors.email">{{
            errors.email
          }}</small>
        </div>

        <Button
          type="submit"
          class="w-full h-12 text-base font-medium"
          severity="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          發送重設連結
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
              重設連結已發送
            </h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>
                我們已將密碼重設連結發送到您的電子信箱。請檢查您的收件匣並點擊連結來重設密碼。
              </p>
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
defineOptions({ name: 'ForgotPasswordPage' })

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import userService from '@/services/userService'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

// 響應式數據
const isSubmitting = ref(false)
const isSuccess = ref(false)

const formData = reactive({
  email: '',
})

const errors = reactive({
  email: '',
})

// 驗證函數
const validateForm = () => {
  errors.email = ''

  if (!formData.email.trim()) {
    errors.email = '電子信箱必填'
  } else if (
    !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(
      formData.email,
    )
  ) {
    errors.email = '請輸入有效的電子信箱'
  }

  return !errors.email
}

// 提交表單
const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await userService.forgotPassword(formData.email)

    isSuccess.value = true
    toast.add({
      severity: 'success',
      summary: '重設連結已發送',
      detail: '請檢查您的電子信箱',
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
  title: '忘記密碼'
  admin: false
  layout: 'full'
</route>
