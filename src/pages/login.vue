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
          @click="activeTab = 'register'"
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
          @click="activeTab = 'login'"
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
      <form @submit.prevent="onSubmit" class="space-y-6 mb-8">
        <div v-if="activeTab === 'register'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >使用者名稱*</label
          >
          <InputText
            v-model="formData.username"
            name="username"
            autocomplete="username"
            class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-500 focus:ring-red-500': errors.username }"
            placeholder="請輸入使用者名稱"
          />
          <small class="text-red-500 text-xs" v-if="errors.username">{{
            errors.username
          }}</small>
        </div>

        <div class="space-y-2">
          <label
            class="block text-sm font-medium text-gray-900 dark:text-white"
            >{{
              activeTab === 'register' ? '電子信箱*' : '使用者名稱或電子信箱*'
            }}</label
          >
          <InputText
            v-model="formData.email"
            :type="activeTab === 'register' ? 'email' : 'text'"
            name="email"
            :autocomplete="activeTab === 'register' ? 'email' : 'username'"
            class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
            :placeholder="
              activeTab === 'register'
                ? '請輸入電子信箱'
                : '請輸入使用者名稱或電子信箱'
            "
          />
          <small class="text-red-500 text-xs" v-if="errors.email">{{
            errors.email
          }}</small>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >密碼*</label
          >
          <Password
            v-model="formData.password"
            name="password"
            :autocomplete="
              activeTab === 'register' ? 'new-password' : 'current-password'
            "
            class="w-full"
            :class="{ 'p-invalid': errors.password }"
            placeholder="請輸入密碼"
            :feedback="false"
            toggleMask
          />
          <small class="text-red-500 text-xs" v-if="errors.password">{{
            errors.password
          }}</small>
        </div>

        <!-- 新增確認密碼欄位（僅註冊時顯示） -->
        <div class="space-y-2" v-if="activeTab === 'register'">
          <label class="block text-sm font-medium text-gray-900 dark:text-white"
            >確認密碼*</label
          >
          <Password
            v-model="formData.confirmPassword"
            name="confirmPassword"
            autocomplete="new-password"
            class="w-full"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="請再次輸入密碼"
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
          >
            <i
              class="pi pi-google text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('facebook')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i
              class="pi pi-facebook text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('twitter')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i
              class="pi pi-twitter text-xl text-gray-700 dark:text-gray-300"
            ></i>
          </button>
          <button
            @click="handleSocialLogin('discord')"
            :disabled="socialLoginLoading"
            class="w-12 h-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import { handleOAuthLogin } from '@/utils/oauthUtils'

const router = useRouter()
const user = useUserStore()
const toast = useToast()

// 響應式數據
const activeTab = ref('register')
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
    } else if (!/^[A-Za-z0-9]+$/.test(formData.username)) {
      errors.username = '使用者名稱只能包含英文字母和數字'
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

// 社群登入處理（重定向方式）
const handleSocialLogin = async (provider) => {
  if (socialLoginLoading.value) return

  socialLoginLoading.value = true

  try {
    console.log(`開始 ${provider} 社群登入（重定向方式）`)
    
    // 使用重定向方式進行 OAuth，頁面會直接跳轉
    await handleOAuthLogin(provider, router, toast)
    
    // 注意：這行不會執行，因為頁面已經重定向了
    console.log(`${provider} 社群登入重定向完成`)
  } catch (error) {
    console.error(`${provider} 登入失敗:`, error)
    
    // 顯示錯誤訊息給用戶（只有在重定向失敗時才會執行）
    toast.add({
      severity: 'error',
      summary: '社群登入失敗',
      detail: error.message || `${provider} 登入過程中發生錯誤`,
      life: 5000,
    })
  } finally {
    socialLoginLoading.value = false
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
  title: '登入'
  admin: false
  layout: 'full'
</route>
