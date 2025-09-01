<template>
  <div class="w-full mx-auto p-8 space-y-6 overflow-y-auto">
    <!-- 聯絡迷因長標題與說明 -->
    <div
      class="mb-4 px-4 py-70 flex flex-col items-center gap-4 lg:px-16 xl:px-32"
    >
      <h1 class="mb-4 text-center">聯絡迷因長</h1>
      <div class="text-center text-surface-600 max-w-4xl">
        <p class="text-lg">
          如果有什麼建議或問題，歡迎填寫表單跟本站迷因長聯繫。<br />
          如果有圖片侵犯到你的權利，也歡迎使用檢舉功能。
        </p>
      </div>
      <Button
        label="立即填寫"
        icon="pi pi-arrow-down"
        size="large"
        severity="primary"
        rounded
        variant="outlined"
        @click="scrollToSection('contact')"
        class="mb-4"
      >
      </Button>
    </div>

    <!-- 聯絡表單 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32"
      id="contact"
    >
      <div class="w-full max-w-2xl">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 姓名欄位 -->
          <div class="space-y-2">
            <label
              for="fullName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              姓名
            </label>
            <InputText
              id="fullName"
              v-model="form.fullName"
              class="w-full"
              :class="{ 'p-invalid': errors.fullName }"
              placeholder="請輸入您的姓名"
            />
            <small v-if="errors.fullName" class="p-error">{{
              errors.fullName
            }}</small>
          </div>

          <!-- 電子郵件欄位 -->
          <div class="space-y-2">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              電子信箱
            </label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              placeholder="請輸入電子信箱"
            />
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>

          <!-- 主題選擇 -->
          <div class="space-y-2">
            <label
              for="topic"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              選擇主題
            </label>
            <Dropdown
              id="topic"
              v-model="form.topic"
              :options="topicOptions"
              option-label="label"
              option-value="value"
              placeholder="請選擇一個主題..."
              class="w-full"
              :class="{ 'p-invalid': errors.topic }"
            />
            <small v-if="errors.topic" class="p-error">{{
              errors.topic
            }}</small>
          </div>

          <!-- 單選按鈕組 -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
            >
              您屬於哪一類型？
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div
                  v-for="(option, index) in firstColumnOptions"
                  :key="index"
                  class="flex items-center"
                >
                  <RadioButton
                    :id="`option-${index}`"
                    v-model="form.userType"
                    :value="option.value"
                    :input-id="`option-${index}`"
                  />
                  <label
                    :for="`option-${index}`"
                    class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ option.label }}
                  </label>
                </div>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(option, index) in secondColumnOptions"
                  :key="index"
                  class="flex items-center"
                >
                  <RadioButton
                    :id="`option-${index + 3}`"
                    v-model="form.userType"
                    :value="option.value"
                    :input-id="`option-${index + 3}`"
                  />
                  <label
                    :for="`option-${index + 3}`"
                    class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ option.label }}
                  </label>
                </div>
              </div>
            </div>
            <small v-if="errors.userType" class="p-error">{{
              errors.userType
            }}</small>
          </div>

          <!-- 訊息欄位 -->
          <div class="space-y-2">
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              訊息內容
            </label>
            <Textarea
              id="message"
              v-model="form.message"
              rows="6"
              class="w-full"
              :class="{ 'p-invalid': errors.message }"
              placeholder="請輸入您的訊息內容..."
            />
            <small v-if="errors.message" class="p-error">{{
              errors.message
            }}</small>
          </div>

          <!-- reCAPTCHA 提示 -->
          <div
            class="bg-primary-50 border border-primary-200 text-primary-500! dark:bg-primary-900 dark:border-primary-800 dark:text-primary-300! rounded-md p-4"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-primary-400"
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
              <div
                class="ml-3 text-sm text-primary-500! dark:text-primary-200!"
              >
                為了防止垃圾訊息，我們使用 Google reCAPTCHA
                進行驗證。提交表單時會自動執行驗證。
                <br />
                <span class="text-xs text-primary-400! dark:text-primary-300!">
                  如果遇到驗證問題，請檢查網路連線或聯絡管理員。
                </span>
              </div>
            </div>
          </div>

          <!-- 條款同意 -->
          <div class="flex items-center space-x-2">
            <Checkbox
              id="terms"
              v-model="form.acceptTerms"
              :binary="true"
              :class="{ 'p-invalid': errors.acceptTerms }"
            />
            <label for="terms" class="text-sm text-gray-700 dark:text-gray-300">
              我同意<a
                href="/privacy"
                class="text-primary-500! dark:text-primary-400! underline"
                >隱私權政策</a
              >
            </label>
          </div>
          <small v-if="errors.acceptTerms" class="p-error">{{
            errors.acceptTerms
          }}</small>

          <!-- 提交按鈕 -->
          <div class="flex justify-center">
            <Button
              type="submit"
              label="提交"
              class="w-48 h-12"
              :loading="submitting"
              :disabled="submitting"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import emailService from '@/services/emailService'

const toast = useToast()

// 表單資料
const form = reactive({
  fullName: '',
  email: '',
  topic: null,
  userType: '',
  message: '',
  acceptTerms: false,
})

// 錯誤訊息
const errors = reactive({
  fullName: '',
  email: '',
  topic: '',
  userType: '',
  message: '',
  acceptTerms: '',
})

// 提交狀態
const submitting = ref(false)

// 主題選項
const topicOptions = ref([
  { label: '一般問題', value: '一般問題' },
  { label: '帳戶相關', value: '帳戶相關' },
  { label: '付款與訂閱', value: '付款與訂閱' },
  { label: '內容授權', value: '內容授權' },
  { label: '廣告合作', value: '廣告合作' },
  { label: '媒體採訪', value: '媒體採訪' },
  { label: '活動合作', value: '活動合作' },
  { label: '投訴申訴', value: '投訴申訴' },
  { label: '其他', value: '其他' },
])

// 第一欄選項
const firstColumnOptions = ref([
  { label: '一般用戶', value: '一般用戶' },
  { label: '內容創作者', value: '內容創作者' },
  { label: '企業用戶', value: '企業用戶' },
])

// 第二欄選項
const secondColumnOptions = ref([
  { label: '學生', value: '學生' },
  { label: '媒體工作者', value: '媒體工作者' },
  { label: '其他', value: '其他' },
])

// 驗證表單
const validateForm = () => {
  let isValid = true

  // 清除所有錯誤
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // 驗證姓名
  if (!form.fullName.trim()) {
    errors.fullName = '請輸入姓名'
    isValid = false
  }

  // 驗證電子郵件
  if (!form.email.trim()) {
    errors.email = '請輸入電子郵件'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '請輸入有效的電子郵件格式'
    isValid = false
  }

  // 驗證主題
  if (!form.topic) {
    errors.topic = '請選擇一個主題'
    isValid = false
  }

  // 驗證用戶類型
  if (!form.userType) {
    errors.userType = '請選擇一個選項'
    isValid = false
  }

  // 驗證訊息
  if (!form.message.trim()) {
    errors.message = '請輸入訊息內容'
    isValid = false
  } else if (form.message.trim().length < 10) {
    errors.message = '訊息內容至少需要10個字元'
    isValid = false
  }

  // 驗證條款同意
  if (!form.acceptTerms) {
    errors.acceptTerms = '請同意條款'
    isValid = false
  }

  return isValid
}

// 提交表單
const submitForm = async () => {
  console.log('🚀 開始提交聯絡表單...')
  console.log('📝 表單數據:', form)

  if (!validateForm()) {
    console.log('❌ 表單驗證失敗')
    toast.add({
      severity: 'error',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000,
    })
    return
  }

  console.log('✅ 表單驗證通過')
  submitting.value = true

  try {
    // 調用 API 來提交表單資料
    const response = await emailService.sendContactForm({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      topic: form.topic,
      userType: form.userType,
      message: form.message.trim(),
    })

    console.log('✅ 後端回應:', response)

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: '提交成功',
        detail: response.data.message || '您的訊息已成功送出，我們會盡快回覆您',
        life: 5000,
      })

      // 重置表單
      Object.keys(form).forEach((key) => {
        if (key === 'acceptTerms') {
          form[key] = false
        } else {
          form[key] = ''
        }
      })
    } else {
      throw new Error(response.data.message || '提交失敗')
    }
  } catch (error) {
    console.error('❌ 提交表單失敗:', error)

    let errorMessage = '無法提交表單，請稍後再試'

    // 根據錯誤類型提供不同的錯誤訊息
    if (error.message.includes('設定未完成')) {
      errorMessage = '系統設定問題，請聯絡管理員'
    } else if (error.message.includes('網路連線')) {
      errorMessage = '網路連線問題，請檢查網路後重新嘗試'
    } else if (error.message.includes('reCAPTCHA 驗證失敗')) {
      errorMessage = '驗證失敗，請重新嘗試'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.add({
      severity: 'error',
      summary: '提交失敗',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    submitting.value = false
  }
}

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<script>
export default {
  name: 'ContactPage',
}
</script>

<route lang="yaml">
meta:
  title: '聯絡迷因長'
  description: '有任何合作、授權、錯誤回報或建議，歡迎透過聯絡表單與迷因長取得聯繫。'
  login: ''
  admin: false
</route>
