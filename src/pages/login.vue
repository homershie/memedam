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

    <!-- Username 選擇對話框 -->
    <Dialog
      v-model:visible="showUsernameSelection"
      modal
      :closable="false"
      class="w-full max-w-md mx-4"
      header="選擇您的使用者名稱"
    >
      <div class="space-y-6">
        <!-- 提示文字 -->
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
          為了完成註冊，請選擇一個使用者名稱
        </p>
        
        <!-- 建議的 username 列表 -->
        <div v-if="usernameSuggestions.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            建議的使用者名稱：
          </h4>
          <div class="space-y-2">
            <button
              v-for="suggestion in usernameSuggestions"
              :key="suggestion"
              @click="selectSuggestedUsername(suggestion)"
              class="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              :class="{ 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': selectedUsername === suggestion }"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
        
        <!-- 自定義 username 輸入 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            或自定義使用者名稱：
          </label>
          <div class="relative">
            <InputText
              v-model="customUsername"
              @input="debouncedCheckUsername"
              placeholder="輸入您想要的使用者名稱"
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{
                'border-red-500 focus:ring-red-500': usernameError,
                'border-green-500 focus:ring-green-500': customUsername && !usernameError && !usernameChecking,
                'pr-10': usernameChecking
              }"
            />
            
            <!-- 檢查狀態圖標 -->
            <div v-if="usernameChecking" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i class="pi pi-spin pi-spinner text-gray-400"></i>
            </div>
            <div v-else-if="customUsername && !usernameError" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i class="pi pi-check text-green-500"></i>
            </div>
            <div v-else-if="usernameError" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i class="pi pi-times text-red-500"></i>
            </div>
          </div>
          
          <!-- 錯誤訊息 -->
          <small v-if="usernameError" class="text-red-500 text-xs">
            {{ usernameError }}
          </small>
          
          <!-- 使用者名稱規則提示 -->
          <small class="text-gray-500 dark:text-gray-400 text-xs">
            8-20個字元，只能包含英文字母和數字
          </small>
        </div>
        
        <!-- 操作按鈕 -->
        <div class="flex gap-3 pt-4">
          <Button
            @click="cancelUsernameSelection"
            class="flex-1"
            severity="secondary"
            outlined
            :disabled="isConfirmingUsername"
          >
            取消
          </Button>
          <Button
            @click="confirmUsernameSelection"
            class="flex-1"
            severity="primary"
            :loading="isConfirmingUsername"
            :disabled="!isUsernameValid || isConfirmingUsername"
          >
            確認
          </Button>
        </div>
      </div>
    </Dialog>

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

import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import { debounce } from 'lodash'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import { handleOAuthLogin, handleStoredOAuthSuccess } from '@/utils/oauthUtils'
import { onMounted } from 'vue'

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

// Username 選擇相關
const showUsernameSelection = ref(false)
const usernameSuggestions = ref([])
const customUsername = ref('')
const selectedUsername = ref('')
const usernameError = ref('')
const usernameChecking = ref(false)
const isConfirmingUsername = ref(false)
const pendingOAuthData = ref(null) // 暫存OAuth回調數據

// Username API 函數（修正版本）
const previewUsernameSuggestions = async (provider, profile) => {
  try {
    const { data } = await userService.previewUsernameSuggestions(provider, profile)
    return data.suggestions || []
  } catch (error) {
    console.error('預覽username建議失敗:', error)
    return []
  }
}

const checkUsernameAvailability = async (username) => {
  if (!username) return null
  
  usernameChecking.value = true
  
  try {
    const { data } = await userService.checkUsernameAvailability(username)
    return data
  } catch (error) {
    console.error('檢查username可用性失敗:', error)
    return { available: false, message: '檢查失敗，請稍後再試' }
  } finally {
    usernameChecking.value = false
  }
}

// Username 驗證和處理
const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return '使用者名稱不能為空'
  }
  if (username.length < 8) {
    return '使用者名稱至少8個字元'
  }
  if (username.length > 20) {
    return '使用者名稱最多20個字元'
  }
  if (!/^[A-Za-z0-9]+$/.test(username)) {
    return '使用者名稱只能包含英文字母和數字'
  }
  return ''
}

const debouncedCheckUsername = debounce(async () => {
  if (!customUsername.value) {
    usernameError.value = ''
    return
  }

  // 先進行基本驗證
  const validationError = validateUsername(customUsername.value)
  if (validationError) {
    usernameError.value = validationError
    return
  }

  // 檢查可用性
  const result = await checkUsernameAvailability(customUsername.value)
  if (result) {
    if (!result.available) {
      usernameError.value = result.message || '此使用者名稱已被使用'
    } else {
      usernameError.value = ''
    }
  }
}, 500)

const selectSuggestedUsername = (username) => {
  selectedUsername.value = username
  customUsername.value = username
  usernameError.value = ''
  usernameChecking.value = false
}

const confirmUsernameSelection = async () => {
  const finalUsername = customUsername.value || selectedUsername.value
  
  if (!finalUsername) {
    usernameError.value = '請選擇一個使用者名稱'
    return
  }

  isConfirmingUsername.value = true

  // 最終驗證
  const validationError = validateUsername(finalUsername)
  if (validationError) {
    usernameError.value = validationError
    isConfirmingUsername.value = false
    return
  }

  try {
    // 最終檢查可用性
    const result = await checkUsernameAvailability(finalUsername)
    if (!result || !result.available) {
      usernameError.value = result?.message || '此使用者名稱已被使用'
      isConfirmingUsername.value = false
      return
    }

    // 完成OAuth註冊流程
    if (pendingOAuthData.value) {
      await completeSocialRegistration(finalUsername)
    }
  } catch (error) {
    console.error('確認使用者名稱失敗:', error)
    usernameError.value = '操作失敗，請稍後再試'
  } finally {
    isConfirmingUsername.value = false
  }
}

const cancelUsernameSelection = () => {
  showUsernameSelection.value = false
  customUsername.value = ''
  selectedUsername.value = ''
  usernameError.value = ''
  usernameChecking.value = false
  pendingOAuthData.value = null
  socialLoginLoading.value = false
}

const isUsernameValid = computed(() => {
  return !usernameError.value && (customUsername.value || selectedUsername.value) && !usernameChecking.value
})

// 完成社群註冊流程（修正版本）
const completeSocialRegistration = async (username) => {
  try {
    if (!pendingOAuthData.value) {
      throw new Error('缺少OAuth數據')
    }

    // 調用後端API完成註冊
    const { data } = await userService.completeSocialRegistration({
      ...pendingOAuthData.value,
      username,
    })
    
    // 登入用戶
    user.login({
      ...data.user,
      token: data.token,
      userId: data.userId || data.user?._id,
    })

    showUsernameSelection.value = false
    pendingOAuthData.value = null
    socialLoginLoading.value = false
    
    toast.add({
      severity: 'success',
      summary: '註冊成功',
      detail: '歡迎加入迷因典！',
      life: 3000,
    })

    router.push('/')
  } catch (error) {
    console.error('完成社群註冊失敗:', error)
    toast.add({
      severity: 'error',
      summary: '註冊失敗',
      detail: error?.response?.data?.message || error.message || '請稍後再試',
      life: 3000,
    })
  }
}

// 處理OAuth回調結果
const handleOAuthCallback = async (oauthResult) => {
  try {
    console.log('處理OAuth回調結果:', oauthResult)
    
    if (oauthResult.needsUsername) {
      // 需要選擇username，顯示選擇對話框
      pendingOAuthData.value = oauthResult
      
      // 獲取username建議
      const suggestions = await previewUsernameSuggestions(
        oauthResult.provider,
        oauthResult.profile
      )
      
      usernameSuggestions.value = suggestions
      showUsernameSelection.value = true
      socialLoginLoading.value = false
    } else {
      // 用戶已存在，直接登入
      user.login({
        ...oauthResult.user,
        token: oauthResult.token,
        userId: oauthResult.userId || oauthResult.user?._id,
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
    console.error('處理OAuth回調失敗:', error)
    socialLoginLoading.value = false
    toast.add({
      severity: 'error',
      summary: '登入失敗',
      detail: error.message || '請稍後再試',
      life: 3000,
    })
  }
}

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

// 社群登入處理（優化後的版本）
const handleSocialLogin = async (provider) => {
  if (socialLoginLoading.value) return

  socialLoginLoading.value = true

  try {
    console.log(`開始 ${provider} 社群登入`)
    
    // 使用彈窗方式進行OAuth
    const result = await handleOAuthLogin(provider, router, toast, true)
    
    if (result.success) {
      if (result.needsUsername) {
        // 需要選擇username，顯示選擇對話框
        console.log('需要選擇username，顯示選擇對話框')
        
        pendingOAuthData.value = result.data
        
        // 獲取username建議
        const suggestions = await previewUsernameSuggestions(
          result.data.provider || provider,
          result.data.profile
        )
        
        usernameSuggestions.value = suggestions
        showUsernameSelection.value = true
        // 保持socialLoginLoading為true，直到用戶完成選擇
      } else {
        // 用戶已存在，直接登入
        console.log('用戶已存在，直接登入')
        
        user.login({
          ...result.data.user,
          token: result.data.token,
          userId: result.data.userId || result.data.user?._id,
        })

        toast.add({
          severity: 'success',
          summary: '登入成功',
          detail: '歡迎回來！',
          life: 3000,
        })

        socialLoginLoading.value = false
        router.push('/')
      }
    }
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

// 處理來自OAuth回調頁面的數據（通過URL參數或localStorage）
const checkForOAuthCallback = () => {
  try {
    // 檢查URL參數中是否有OAuth回調數據
    const urlParams = new URLSearchParams(window.location.search)
    const oauthData = urlParams.get('oauth_data')
    
    if (oauthData) {
      const parsedData = JSON.parse(decodeURIComponent(oauthData))
      handleOAuthCallback(parsedData)
      
      // 清理URL參數
      const url = new URL(window.location)
      url.searchParams.delete('oauth_data')
      window.history.replaceState({}, document.title, url.toString())
      return
    }
    
    // 檢查localStorage中是否有OAuth回調數據
    const storedData = localStorage.getItem('oauth_callback_data')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      localStorage.removeItem('oauth_callback_data')
      handleOAuthCallback(parsedData)
    }
  } catch (error) {
    console.error('檢查OAuth回調數據失敗:', error)
  }
}

// 頁面載入時檢查OAuth回調
onMounted(async () => {
  // 先檢查是否有存儲的OAuth成功數據
  const hasStoredSuccess = await handleStoredOAuthSuccess(user, toast, router)
  if (hasStoredSuccess) {
    return // 如果處理了存儲的成功數據，就不需要再檢查其他
  }
  
  // 檢查OAuth回調數據
  checkForOAuthCallback()
})
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
