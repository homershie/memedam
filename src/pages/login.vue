<template>
  <div
    class="min-h-screen px-4 pt-6 flex justify-center min-w-full md:min-w-5xl md:px-0"
  >
    <!-- 主要內容區域 -->
    <div class="w-full max-w-md">
      <!-- 導航標籤 -->
      <div class="flex justify-center mb-8 gap-8">
        <button
          class="relative px-4 py-2 text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white"
          :class="{
            'text-gray-900 dark:text-white font-bold': activeTab === 'register',
            'text-gray-600 dark:text-gray-400': activeTab !== 'register',
          }"
          @click="handleTabChange('register')"
        >
          註冊
          <div
            v-if="activeTab === 'register'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
          ></div>
        </button>
        <button
          class="relative px-4 py-2 text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white"
          :class="{
            'text-gray-900 dark:text-white font-bold': activeTab === 'login',
            'text-gray-600 dark:text-gray-400': activeTab !== 'login',
          }"
          @click="handleTabChange('login')"
        >
          登入
          <div
            v-if="activeTab === 'login'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
          ></div>
        </button>
      </div>

      <!-- 標題 -->
      <h1
        class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4"
      >
        {{ activeTab === 'register' ? '註冊' : '登入' }}
      </h1>

      <!-- 條款說明 -->
      <p
        class="text-sm text-gray-600 dark:text-gray-400 mb-8 text-center leading-relaxed"
        v-if="activeTab === 'register'"
      >
        如果註冊，即表示你同意
        <a
          href="#"
          class="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >服務條款</a
        >和
        <a
          href="#"
          class="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >隱私政策</a
        >，包括
        <a
          href="#"
          class="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >Cookie 使用政策</a
        >。
      </p>

      <!-- 表單 -->
      <form
        @submit.prevent="onSubmit"
        class="space-y-6 mb-8"
        :data-form-type="activeTab"
        data-testid="login-form"
        autocomplete="on"
      >
        <!-- 註冊時的使用者名稱欄位 -->
        <div v-if="activeTab === 'register'" class="space-y-2">
          <label
            for="username"
            class="block text-sm font-medium text-gray-900 dark:text-white"
          >
            使用者名稱*
          </label>
          <InputText
            id="username"
            v-model="formData.username"
            name="username"
            type="text"
            autocomplete="username"
            data-testid="username-input"
            fluid
            :class="{
              'border-primary-500 focus:ring-primary-500': errors.username,
            }"
            placeholder="請輸入使用者名稱"
            required
            aria-describedby="username-error"
            aria-invalid="false"
          />
          <small
            id="username-error"
            class="text-primary-500 text-xs"
            v-if="errors.username"
            role="alert"
          >
            {{ errors.username }}
          </small>
        </div>

        <!-- 電子信箱/帳號欄位 -->
        <div class="space-y-2">
          <label
            :for="activeTab === 'register' ? 'email' : 'login'"
            class="block text-sm font-medium text-gray-900 dark:text-white"
          >
            {{
              activeTab === 'register' ? '電子信箱*' : '使用者名稱或電子信箱*'
            }}
          </label>
          <InputText
            :id="activeTab === 'register' ? 'email' : 'login'"
            v-model="formData.email"
            :name="activeTab === 'register' ? 'email' : 'login'"
            :type="activeTab === 'register' ? 'email' : 'text'"
            :autocomplete="activeTab === 'register' ? 'email' : 'username'"
            :data-testid="
              activeTab === 'register' ? 'email-input' : 'login-input'
            "
            fluid
            :class="{
              'border-primary-500 focus:ring-primary-500': errors.email,
            }"
            :placeholder="
              activeTab === 'register'
                ? '請輸入電子信箱'
                : '請輸入使用者名稱或電子信箱'
            "
            required
            :aria-describedby="
              activeTab === 'register' ? 'email-error' : 'login-error'
            "
            :aria-invalid="!!errors.email"
          />
          <small
            :id="activeTab === 'register' ? 'email-error' : 'login-error'"
            class="text-primary-500 text-xs"
            v-if="errors.email"
            role="alert"
          >
            {{ errors.email }}
          </small>
        </div>

        <!-- 密碼欄位 -->
        <div class="space-y-2">
          <label
            for="password"
            class="block text-sm font-medium text-gray-900 dark:text-white"
          >
            密碼*
          </label>
          <Password
            id="password"
            v-model="formData.password"
            name="password"
            :autocomplete="
              activeTab === 'register' ? 'new-password' : 'current-password'
            "
            data-testid="password-input"
            class="w-full"
            :class="{ 'p-invalid': errors.password }"
            placeholder="請輸入密碼"
            :feedback="false"
            toggleMask
            fluid
            required
            aria-describedby="password-error"
            :aria-invalid="!!errors.password"
          />
          <small
            id="password-error"
            class="text-primary-500 text-xs"
            v-if="errors.password"
            role="alert"
          >
            {{ errors.password }}
          </small>
        </div>

        <!-- 確認密碼欄位（僅註冊時顯示） -->
        <div class="space-y-2" v-if="activeTab === 'register'">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-900 dark:text-white"
          >
            確認密碼*
          </label>
          <Password
            id="confirmPassword"
            v-model="formData.confirmPassword"
            name="confirmPassword"
            autocomplete="new-password"
            data-testid="confirm-password-input"
            class="w-full"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="請再次輸入密碼"
            :feedback="false"
            toggleMask
            fluid
            required
            aria-describedby="confirm-password-error"
            :aria-invalid="!!errors.confirmPassword"
          />
          <small
            id="confirm-password-error"
            class="text-primary-500 text-xs"
            v-if="errors.confirmPassword"
            role="alert"
          >
            {{ errors.confirmPassword }}
          </small>
        </div>

        <Button
          type="submit"
          class="w-full h-12 text-base font-medium"
          severity="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          data-testid="submit-button"
          :aria-label="activeTab === 'register' ? '註冊帳號' : '登入帳號'"
        >
          {{ activeTab === 'register' ? '註冊' : '登入' }}
        </Button>
      </form>

      <!-- 忘記密碼連結（僅在登入時顯示） -->
      <div v-if="activeTab === 'login'" class="text-center mt-4">
        <router-link
          to="/forgot-password"
          class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          忘記密碼？
        </router-link>
      </div>

      <!-- 社交媒體登入 -->
      <div class="mt-8">
        <div class="flex justify-center gap-4">
          <button
            @click="handleSocialLogin('google')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="使用 Google 登入"
          >
            <i
              class="pi pi-google text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('facebook')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="使用 Facebook 登入"
          >
            <i
              class="pi pi-facebook text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('twitter')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="使用 Twitter 登入"
          >
            <i
              class="pi pi-twitter text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('discord')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label="使用 Discord 登入"
          >
            <i
              class="pi pi-discord text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
        </div>

        <!-- 社群登入載入提示 -->
        <div v-if="socialLoginLoading" class="text-center mt-4">
          <small class="text-gray-600 dark:text-gray-400">
            正在開啟授權視窗，請稍候...
          </small>
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
// 組件名稱修正為多字

defineOptions({ name: 'LoginPage' })

import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import { onMounted } from 'vue'

const router = useRouter()
const user = useUserStore()
const toast = useToast()

// 響應式數據 - 將預設頁面改為登入
const activeTab = ref('login')
const isSubmitting = ref(false)
const socialLoginLoading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 驗證函數
const validateForm = () => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (activeTab.value === 'register') {
    // 使用者名稱驗證
    if (!formData.username.trim()) {
      errors.username = '使用者名稱必填'
    } else if (formData.username.length < 8) {
      errors.username = '使用者名稱至少8個字元'
    } else if (formData.username.length > 20) {
      errors.username = '使用者名稱最多20個字元'
    } else if (!/^[a-z0-9._-]+$/.test(formData.username)) {
      errors.username =
        '使用者名稱只能包含小寫英文字母、數字、點號(.)、底線(_)和連字號(-)'
    }
  }

  // 電子信箱/帳號驗證
  if (!formData.email.trim()) {
    errors.email =
      activeTab.value === 'register'
        ? '電子信箱必填'
        : '請輸入使用者名稱或電子信箱'
  } else if (
    activeTab.value === 'register' &&
    !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(
      formData.email,
    )
  ) {
    errors.email = '請輸入有效的電子信箱'
  }

  // 密碼驗證
  if (!formData.password) {
    errors.password = '密碼必填'
  } else if (formData.password.length < 8) {
    errors.password = '密碼至少8個字元'
  } else if (formData.password.length > 20) {
    errors.password = '密碼最多20個字元'
  }

  // 註冊時確認密碼
  if (activeTab.value === 'register') {
    if (!formData.confirmPassword) {
      errors.confirmPassword = '請再次輸入密碼'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '兩次密碼輸入不一致'
    }
  }

  return (
    !errors.username &&
    !errors.email &&
    !errors.password &&
    (activeTab.value !== 'register' || !errors.confirmPassword)
  )
}

// 提交表單
const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    if (activeTab.value === 'register') {
      // 註冊邏輯
      await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      // 註冊成功後轉到註冊完成頁面
      const userData = {
        username: formData.username,
        email: formData.email,
      }

      router.push({
        path: '/registration-success',
        query: {
          user: encodeURIComponent(JSON.stringify(userData)),
        },
      })
    } else {
      // 登入邏輯
      const { data } = await userService.login({
        login: formData.email, // 支援帳號或信箱
        password: formData.password,
      })

      console.log('登入API回傳:', data)
      user.login({
        ...data.user,
        token: data.token,
        userId: data.userId || data.user?._id, // 兩種都支援
      })

      toast.add({
        severity: 'success',
        summary: '登入成功',
        detail: '歡迎回來！',
        life: 3000,
      })

      router.push('/')
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

// 社群登入處理（修改為原視窗跳轉）
const handleSocialLogin = async (provider) => {
  if (socialLoginLoading.value) return

  socialLoginLoading.value = true

  try {
    console.log(`開始 ${provider} 社群登入`)

    // 直接跳轉到後端 OAuth 路由，不使用彈窗
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const oauthUrl = `${baseUrl}/api/users/auth/${provider}`

    // 使用原視窗跳轉
    window.location.href = oauthUrl
  } catch (error) {
    console.error(`${provider} 登入失敗:`, error)

    // 顯示錯誤訊息
    toast.add({
      severity: 'error',
      summary: '社群登入失敗',
      detail: error.message || `${provider} 登入過程中發生錯誤`,
      life: 5000,
    })

    socialLoginLoading.value = false
  }
}

// 頁面載入時的初始化
onMounted(() => {
  // 頁面載入時可以進行一些初始化操作
  console.log('登入頁面已載入')

  // 改善密碼管理工具的相容性
  setupPasswordManagerCompatibility()
})

// 改善密碼管理工具相容性的函數
const setupPasswordManagerCompatibility = () => {
  // 監聽表單變化，更新 aria 屬性
  watch(
    () => errors,
    (newErrors) => {
      // 更新所有輸入欄位的 aria-invalid 屬性
      const inputs = document.querySelectorAll('input, .p-password-input')
      inputs.forEach((input) => {
        const fieldName = input.name || input.id
        if (fieldName && newErrors[fieldName]) {
          input.setAttribute('aria-invalid', 'true')
        } else {
          input.setAttribute('aria-invalid', 'false')
        }
      })
    },
    { deep: true },
  )

  // 監聽表單提交，提供更好的密碼管理工具支援
  const form = document.querySelector('form[data-testid="login-form"]')
  if (form) {
    form.addEventListener('submit', () => {
      // 確保所有必填欄位都有值
      const requiredInputs = form.querySelectorAll('[required]')
      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          input.setAttribute('aria-invalid', 'true')
        }
      })
    })
  }
}

// 重置表單
const _resetForm = () => {
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''

  // 清除錯誤
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // 重置 aria 屬性
  const inputs = document.querySelectorAll('input, .p-password-input')
  inputs.forEach((input) => {
    input.setAttribute('aria-invalid', 'false')
  })
}

// 切換表單類型時的處理
const handleTabChange = (newTab) => {
  activeTab.value = newTab

  // 切換表單時重置錯誤狀態
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // 更新表單的 data-form-type 屬性
  const form = document.querySelector('form[data-testid="login-form"]')
  if (form) {
    form.setAttribute('data-form-type', newTab)
  }

  // 重置 aria 屬性
  const inputs = document.querySelectorAll('input, .p-password-input')
  inputs.forEach((input) => {
    input.setAttribute('aria-invalid', 'false')
  })
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
  title: '登入'
  admin: false
  layout: 'full'
</route>
