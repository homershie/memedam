<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 聯絡站長標題與說明 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h1 class="text-5xl font-bold text-center">聯絡站長</h1>
      <div class="text-center text-gray-600 max-w-2xl">
        <p class="text-base mb-2">
          如果有什麼建議或問題，歡迎填寫表單跟本站站長聯繫
        </p>
        <p class="text-base">如果有圖片侵犯到你的權利，也歡迎使用檢舉功能。</p>
      </div>
    </div>

    <!-- 聯絡表單 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <div class="w-full max-w-2xl">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 姓名欄位 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <InputText
                id="firstName"
                v-model="form.firstName"
                class="w-full"
                :class="{ 'p-invalid': errors.firstName }"
                placeholder="請輸入名字"
              />
              <small v-if="errors.firstName" class="p-error">{{
                errors.firstName
              }}</small>
            </div>
            <div class="space-y-2">
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <InputText
                id="lastName"
                v-model="form.lastName"
                class="w-full"
                :class="{ 'p-invalid': errors.lastName }"
                placeholder="請輸入姓氏"
              />
              <small v-if="errors.lastName" class="p-error">{{
                errors.lastName
              }}</small>
            </div>
          </div>

          <!-- 電子郵件欄位 -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              placeholder="請輸入電子郵件"
            />
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>

          <!-- 電話號碼欄位 -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <InputText
              id="phone"
              v-model="form.phone"
              class="w-full"
              :class="{ 'p-invalid': errors.phone }"
              placeholder="請輸入電話號碼"
            />
            <small v-if="errors.phone" class="p-error">{{
              errors.phone
            }}</small>
          </div>

          <!-- 主題選擇 -->
          <div class="space-y-2">
            <label for="topic" class="block text-sm font-medium text-gray-700">
              Choose a topic
            </label>
            <Dropdown
              id="topic"
              v-model="form.topic"
              :options="topicOptions"
              option-label="label"
              option-value="value"
              placeholder="Select one..."
              class="w-full"
              :class="{ 'p-invalid': errors.topic }"
            />
            <small v-if="errors.topic" class="p-error">{{
              errors.topic
            }}</small>
          </div>

          <!-- 單選按鈕組 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Which best describes you?
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
                    class="ml-2 text-sm text-gray-700"
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
                    class="ml-2 text-sm text-gray-700"
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
              class="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <Textarea
              id="message"
              v-model="form.message"
              rows="6"
              class="w-full"
              :class="{ 'p-invalid': errors.message }"
              placeholder="Type your message..."
            />
            <small v-if="errors.message" class="p-error">{{
              errors.message
            }}</small>
          </div>

          <!-- 條款同意 -->
          <div class="flex items-center space-x-2">
            <Checkbox
              id="terms"
              v-model="form.acceptTerms"
              :binary="true"
              :class="{ 'p-invalid': errors.acceptTerms }"
            />
            <label for="terms" class="text-sm text-gray-700">
              I accept the Terms
            </label>
          </div>
          <small v-if="errors.acceptTerms" class="p-error">{{
            errors.acceptTerms
          }}</small>

          <!-- 提交按鈕 -->
          <div class="flex justify-center">
            <Button
              type="submit"
              label="Submit"
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

const toast = useToast()

// 表單資料
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: null,
  userType: '',
  message: '',
  acceptTerms: false,
})

// 錯誤訊息
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: '',
  userType: '',
  message: '',
  acceptTerms: '',
})

// 提交狀態
const submitting = ref(false)

// 主題選項
const topicOptions = ref([
  { label: '一般問題', value: 'general' },
  { label: '技術支援', value: 'technical' },
  { label: '內容檢舉', value: 'report' },
  { label: '合作提案', value: 'partnership' },
  { label: '其他', value: 'other' },
])

// 第一欄選項
const firstColumnOptions = ref([
  { label: 'First choice', value: 'first' },
  { label: 'Third choice', value: 'third' },
  { label: 'Fifth choice', value: 'fifth' },
])

// 第二欄選項
const secondColumnOptions = ref([
  { label: 'Second choice', value: 'second' },
  { label: 'Fourth choice', value: 'fourth' },
  { label: 'Other', value: 'other' },
])

// 驗證表單
const validateForm = () => {
  let isValid = true

  // 清除所有錯誤
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // 驗證名字
  if (!form.firstName.trim()) {
    errors.firstName = '請輸入名字'
    isValid = false
  }

  // 驗證姓氏
  if (!form.lastName.trim()) {
    errors.lastName = '請輸入姓氏'
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

  // 驗證電話號碼
  if (!form.phone.trim()) {
    errors.phone = '請輸入電話號碼'
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
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000,
    })
    return
  }

  submitting.value = true

  try {
    // 這裡可以調用 API 來提交表單資料
    // const response = await contactService.submit(form)

    // 模擬 API 調用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '提交成功',
      detail: '您的訊息已成功送出，我們會盡快回覆您',
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
  } catch (error) {
    console.error('提交表單失敗:', error)
    toast.add({
      severity: 'error',
      summary: '提交失敗',
      detail: '無法提交表單，請稍後再試',
      life: 3000,
    })
  } finally {
    submitting.value = false
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
  title: '聯絡站長'
  login: ''
  admin: false
</route>
