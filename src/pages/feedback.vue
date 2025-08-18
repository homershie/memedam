<template>
  <div class="container mx-auto p-4 space-y-12">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">提供意見</h1>
      <p class="text-gray-600 mt-2">您的意見對我們很重要，請告訴我們您的想法</p>
      <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
        <p class="text-sm text-blue-700">
          <strong>隱私聲明：</strong
          >您提供的意見僅用於改善服務，不會對外公開。我們重視您的隱私權。
        </p>
      </div>
    </div>

    <!-- 意見表單 -->
    <div class="max-w-2xl mx-auto">
      <form @submit.prevent="submitFeedback" class="space-y-6">
        <!-- 分類 -->
        <div>
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            意見分類 <span class="text-red-500">*</span>
          </label>
          <select
            id="category"
            v-model="form.category"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.category }"
          >
            <option value="">請選擇分類</option>
            <option value="suggestion">建議</option>
            <option value="bug">錯誤回報</option>
            <option value="content">內容問題</option>
            <option value="feature">功能請求</option>
            <option value="other">其他</option>
          </select>
          <p v-if="errors.category" class="text-red-500 text-sm mt-1">
            {{ errors.category }}
          </p>
        </div>

        <!-- 標題 -->
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            意見標題 <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            minlength="5"
            maxlength="200"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.title }"
            placeholder="請簡述您的意見標題 (5-200字)"
          />
          <div class="flex justify-between items-center mt-1">
            <p v-if="errors.title" class="text-red-500 text-sm">
              {{ errors.title }}
            </p>
            <p class="text-gray-500 text-sm">{{ form.title.length }}/200</p>
          </div>
        </div>

        <!-- 訊息內容 -->
        <div>
          <label
            for="message"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            訊息內容 <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            minlength="10"
            maxlength="2000"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            :class="{ 'border-red-500': errors.message }"
            placeholder="請詳細描述您的意見或建議... (至少10字)"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p v-if="errors.message" class="text-red-500 text-sm">
              {{ errors.message }}
            </p>
            <p class="text-gray-500 text-sm">{{ form.message.length }}/2000</p>
          </div>
        </div>

        <!-- reCAPTCHA 提示 -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                為了防止垃圾訊息，我們使用 Google reCAPTCHA
                進行驗證。提交表單時會自動執行驗證。
              </p>
            </div>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div
          v-if="errors.general"
          class="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errors.general }}</p>
            </div>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              提交中...
            </span>
            <span v-else>提交意見</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 成功訊息 -->
    <div v-if="showSuccess" class="max-w-2xl mx-auto">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">提交成功！</h3>
            <p class="text-sm text-green-700 mt-1">
              感謝您的意見回饋，我們會認真考慮您的建議。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import feedbackService from '../services/feedbackService.js'

export default {
  name: 'FeedbackPage',
  setup() {
    const form = reactive({
      title: '',
      message: '',
      category: '',
    })

    const errors = reactive({})
    const isSubmitting = ref(false)
    const showSuccess = ref(false)

    const validateForm = () => {
      errors.category = ''
      errors.title = ''
      errors.message = ''

      if (!form.category) {
        errors.category = '請選擇分類'
      }

      if (!form.title.trim()) {
        errors.title = '請輸入標題'
      } else if (form.title.length < 5) {
        errors.title = '標題至少需要 5 個字元'
      } else if (form.title.length > 200) {
        errors.title = '標題不能超過 200 個字元'
      }

      if (!form.message.trim()) {
        errors.message = '請輸入訊息內容'
      } else if (form.message.length < 10) {
        errors.message = '訊息內容至少需要 10 個字元'
      } else if (form.message.length > 2000) {
        errors.message = '訊息內容不能超過 2000 個字元'
      }

      return !Object.values(errors).some((error) => error)
    }

    const submitFeedback = async () => {
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true
      errors.general = ''

      try {
        // 執行 reCAPTCHA 驗證
        const recaptchaToken = await feedbackService.executeRecaptcha()

        // 提交表單
        const response = await feedbackService.submitFeedback({
          ...form,
          recaptchaToken,
        })

        // 顯示成功訊息
        showSuccess.value = true

        // 重置表單
        Object.keys(form).forEach((key) => {
          form[key] = ''
        })

        // 3秒後隱藏成功訊息
        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
      } catch (error) {
        console.error('提交意見失敗:', error)
        if (error.message.includes('請先登入')) {
          errors.general = '請先登入才能提交意見'
        } else {
          errors.general =
            error.message || '提交失敗，請稍後再試。如有問題請聯絡客服。'
        }
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      isSubmitting,
      showSuccess,
      submitFeedback,
    }
  },
}
</script>

<route lang="yaml">
meta:
  title: '提供意見'
  login: true
  admin: false
</route>
