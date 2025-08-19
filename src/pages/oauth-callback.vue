<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div class="text-center max-w-md mx-auto px-4">
      <div v-if="isProcessing" class="space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">{{ processingMessage }}</p>
      </div>

      <div v-else-if="needsUsernameSelection" class="space-y-6">
        <div class="text-blue-500 text-6xl mb-4">
          <i class="pi pi-user-plus"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          選擇您的使用者名稱
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
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
              :class="{
                'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20':
                  selectedUsername === suggestion,
              }"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- 自定義 username 輸入 -->
        <div class="space-y-2">
          <label
            class="block text-sm font-medium text-gray-900 dark:text-white"
          >
            或自定義使用者名稱：
          </label>
          <div class="relative">
            <input
              v-model="customUsername"
              @input="debouncedCheckUsername"
              type="text"
              placeholder="輸入您想要的使用者名稱"
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{
                'border-red-500 focus:ring-red-500': usernameError,
                'border-green-500 focus:ring-green-500':
                  customUsername && !usernameError && !usernameChecking,
                'pr-10': usernameChecking,
              }"
            />

            <!-- 檢查狀態圖標 -->
            <div
              v-if="usernameChecking"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <i class="pi pi-spin pi-spinner text-gray-400"></i>
            </div>
            <div
              v-else-if="customUsername && !usernameError"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <i class="pi pi-check text-green-500"></i>
            </div>
            <div
              v-else-if="usernameError"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
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
          <button
            @click="cancelUsernameSelection"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :disabled="isConfirmingUsername"
          >
            取消
          </button>
          <button
            @click="confirmUsernameSelection"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isUsernameValid || isConfirmingUsername"
          >
            <i
              v-if="isConfirmingUsername"
              class="pi pi-spin pi-spinner mr-2"
            ></i>
            確認
          </button>
        </div>
      </div>

      <div v-else-if="isSuccess" class="space-y-4">
        <div class="text-green-500 text-6xl mb-4">
          <i class="pi pi-check-circle"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ successMessage }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">{{ successDetail }}</p>
      </div>

      <div v-else class="space-y-4">
        <div class="text-red-500 text-6xl mb-4">
          <i class="pi pi-times-circle"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          授權失敗
        </h2>
        <p class="text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
        <button
          @click="backToLogin"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          返回登入頁面
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'

defineOptions({ name: 'OAuthCallbackPage' })

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const toast = useToast()

const isProcessing = ref(true)
const isSuccess = ref(false)
const needsUsernameSelection = ref(false)
const errorMessage = ref('')
const processingMessage = ref('正在處理授權...')
const successMessage = ref('授權成功')
const successDetail = ref('正在跳轉到首頁...')

// Username 選擇相關
const usernameSuggestions = ref([])
const customUsername = ref('')
const selectedUsername = ref('')
const usernameError = ref('')
const usernameChecking = ref(false)
const isConfirmingUsername = ref(false)
const oauthData = ref(null) // 暫存OAuth回調數據

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

const isUsernameValid = computed(() => {
  return (
    !usernameError.value &&
    (customUsername.value || selectedUsername.value) &&
    !usernameChecking.value
  )
})

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
    if (oauthData.value) {
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
  router.push('/login')
}

// 完成社群註冊流程
const completeSocialRegistration = async (username) => {
  try {
    if (!oauthData.value) {
      throw new Error('缺少OAuth數據')
    }

    // 調用後端API完成註冊
    const { data } = await userService.completeSocialRegistration({
      ...oauthData.value,
      username,
    })

    // 登入用戶
    user.login({
      ...data.user,
      token: data.token,
      userId: data.userId || data.user?._id,
      role: data.role, // 確保 role 資訊正確傳遞
    })

    needsUsernameSelection.value = false
    isSuccess.value = true
    successMessage.value = '註冊成功'
    successDetail.value = '歡迎加入迷因典！正在跳轉到首頁...'

    toast.add({
      severity: 'success',
      summary: '註冊成功',
      detail: '歡迎加入迷因典！',
      life: 3000,
    })

    setTimeout(() => {
      router.push('/')
    }, 2000)
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

// 返回登入頁面
const backToLogin = () => {
  router.push('/login')
}

// 處理OAuth回調數據
const processOAuthCallback = async () => {
  console.log('OAuth 回調頁面載入，查詢參數:', route.query)

  const token = route.query.token
  const error = route.query.error
  const userData = route.query.user
    ? JSON.parse(decodeURIComponent(route.query.user))
    : null
  const needsUsername = route.query.needsUsername === 'true'
  const provider = route.query.provider
  const profile = route.query.profile
    ? JSON.parse(decodeURIComponent(route.query.profile))
    : null

  if (error) {
    console.log('檢測到授權錯誤:', error)
    handleError(error)
    return
  }

  if (!token) {
    console.log('未檢測到 token')
    handleError('未收到有效的授權資訊')
    return
  }

  console.log('檢測到授權成功，token:', token.substring(0, 20) + '...')
  console.log('需要選擇username:', needsUsername)

  isProcessing.value = false

  if (needsUsername) {
    // 需要選擇username，顯示選擇介面
    processingMessage.value = '正在準備username選擇...'

    // 存儲OAuth數據
    oauthData.value = {
      token,
      needsUsername: true,
      provider,
      profile,
      userData: userData || {},
    }

    try {
      // 獲取username建議
      const { data } = await userService.previewUsernameSuggestions(
        provider,
        profile,
      )
      usernameSuggestions.value = data.suggestions || []
    } catch (error) {
      console.error('獲取username建議失敗:', error)
      usernameSuggestions.value = []
    }

    // 顯示username選擇介面
    needsUsernameSelection.value = true
  } else {
    // 用戶已存在，直接完成登入
    try {
      user.login({
        ...userData,
        token: token,
        userId: userData?.id || userData?._id,
        role: userData?.role, // 確保 role 資訊正確傳遞
      })

      isSuccess.value = true
      successMessage.value = '登入成功'
      successDetail.value = '歡迎回來！正在跳轉到首頁...'

      toast.add({
        severity: 'success',
        summary: '登入成功',
        detail: '歡迎回來！',
        life: 3000,
      })

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      console.error('登入失敗:', error)
      handleError('登入過程中發生錯誤')
    }
  }
}

// 處理錯誤
const handleError = (error) => {
  isProcessing.value = false
  errorMessage.value = error

  toast.add({
    severity: 'error',
    summary: '授權失敗',
    detail: error,
    life: 5000,
  })
}

onMounted(() => {
  processOAuthCallback()
})
</script>

<route lang="yaml">
meta:
  title: 'OAuth 授權處理'
  admin: false
  layout: 'full'
</route>
