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
  if (window.opener) {
    // 發送消息給主視窗
    window.opener.postMessage(data, window.location.origin)
  }
}

onMounted(() => {
  const token = route.query.token
  const error = route.query.error

  if (error) {
    isProcessing.value = false
    errorMessage.value = error
    // 通知主視窗授權失敗
    notifyParentWindow({ type: 'oauth_error', error })
    // 延遲關閉視窗
    setTimeout(closeWindow, 3000)
  } else if (token) {
    isProcessing.value = false
    isSuccess.value = true
    // 通知主視窗授權成功
    notifyParentWindow({ type: 'oauth_success', token })
    // 延遲關閉視窗
    setTimeout(closeWindow, 2000)
  } else {
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
