<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div class="text-center">
      <div v-if="isProcessing" class="space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">{{ processingMessage }}</p>
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
          @click="closeWindow"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          關閉視窗
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'OAuthCallbackPage' })

const route = useRoute()
const router = useRouter()
const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')
const processingMessage = ref('正在處理授權...')
const successMessage = ref('授權成功')
const successDetail = ref('正在關閉視窗...')

// 關閉視窗
const closeWindow = () => {
  window.close()
}

// 通知主視窗（保持原有邏輯）
const notifyParentWindow = (data) => {
  console.log('準備通知主視窗:', data)
  
  if (window.opener && !window.opener.closed) {
    try {
      const possibleOrigins = [
        '*',
        window.location.origin,
        'http://localhost:5173',
        'http://localhost:3000',
        'https://localhost:5173'
      ]
      
      possibleOrigins.forEach(origin => {
        console.log(`嘗試發送消息到: ${origin}`)
        window.opener.postMessage(data, origin)
      })
      
      console.log('消息發送完成')
    } catch (error) {
      console.error('發送消息失敗:', error)
    }
  } else {
    console.warn('無法找到主視窗或主視窗已關閉')
  }
}

// 處理OAuth回調數據
const processOAuthCallback = async () => {
  console.log('OAuth 回調頁面載入，查詢參數:', route.query)
  
  const token = route.query.token
  const error = route.query.error
  const userData = route.query.user ? JSON.parse(decodeURIComponent(route.query.user)) : null
  const needsUsername = route.query.needsUsername === 'true'
  const provider = route.query.provider
  const profile = route.query.profile ? JSON.parse(decodeURIComponent(route.query.profile)) : null

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
  isSuccess.value = true

  if (needsUsername) {
    // 需要選擇username，準備重定向到登入頁面
    processingMessage.value = '正在準備username選擇...'
    successMessage.value = '授權成功'
    successDetail.value = '正在跳轉到username選擇頁面...'

    const oauthData = {
      token,
      needsUsername: true,
      provider,
      profile,
      userData: userData || {}
    }

    // 如果有主視窗，通知它處理username選擇
    if (window.opener && !window.opener.closed) {
      notifyParentWindow({ 
        type: 'oauth_needs_username', 
        data: oauthData 
      })
      setTimeout(closeWindow, 2000)
    } else {
      // 沒有主視窗，存儲數據並重定向
      localStorage.setItem('oauth_callback_data', JSON.stringify(oauthData))
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
  } else {
    // 用戶已存在，直接完成登入
    const loginData = {
      token,
      user: userData,
      userId: userData?.id || userData?._id
    }

    if (window.opener && !window.opener.closed) {
      notifyParentWindow({ 
        type: 'oauth_success', 
        data: loginData 
      })
      setTimeout(closeWindow, 2000)
    } else {
      // 沒有主視窗，存儲數據並重定向到首頁
      localStorage.setItem('oauth_success_data', JSON.stringify(loginData))
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }
  }
}

// 處理錯誤
const handleError = (error) => {
  isProcessing.value = false
  errorMessage.value = error
  notifyParentWindow({ type: 'oauth_error', error })
  setTimeout(closeWindow, 3000)
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
