<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div class="text-center">
      <div v-if="isProcessing" class="space-y-4">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">正在處理授權...</p>
      </div>

      <div v-else-if="isSuccess" class="space-y-4">
        <div class="text-green-500 text-6xl mb-4">
          <i class="pi pi-check-circle"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          授權成功
        </h2>
        <p class="text-gray-600 dark:text-gray-400">正在關閉視窗...</p>
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
import { useRoute } from 'vue-router'

defineOptions({ name: 'OAuthCallbackPage' })

const route = useRoute()
const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

// 關閉視窗
const closeWindow = () => {
  window.close()
}

// 通知主視窗
const notifyParentWindow = (data) => {
  console.log('準備通知主視窗:', data)
  
  if (window.opener && !window.opener.closed) {
    try {
      // 嘗試不同的目標域名
      const possibleOrigins = [
        '*', // 允許任何域名（開發階段）
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

onMounted(() => {
  console.log('OAuth 回調頁面載入，查詢參數:', route.query)
  
  const token = route.query.token
  const error = route.query.error

  if (error) {
    console.log('檢測到授權錯誤:', error)
    isProcessing.value = false
    errorMessage.value = error
    // 通知主視窗授權失敗
    notifyParentWindow({ type: 'oauth_error', error })
    // 延遲關閉視窗
    setTimeout(closeWindow, 3000)
  } else if (token) {
    console.log('檢測到授權成功，token:', token.substring(0, 20) + '...')
    isProcessing.value = false
    isSuccess.value = true
    // 通知主視窗授權成功
    notifyParentWindow({ type: 'oauth_success', token })
    // 延遲關閉視窗
    setTimeout(closeWindow, 2000)
  } else {
    console.log('未檢測到 token 或 error')
    isProcessing.value = false
    errorMessage.value = '未收到有效的授權資訊'
    // 通知主視窗授權失敗
    notifyParentWindow({ type: 'oauth_error', error: '未收到有效的授權資訊' })
    // 延遲關閉視窗
    setTimeout(closeWindow, 3000)
  }
})
</script>

<route lang="yaml">
meta:
  title: 'OAuth 授權處理'
  admin: false
  layout: 'full'
</route>
