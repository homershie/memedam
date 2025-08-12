<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    modal
    header="OAuth 調試工具"
    :style="{ width: '700px' }"
    :closable="false"
    class="oauth-debug-dialog"
  >
    <div class="space-y-4">
      <!-- 配置檢查結果 -->
      <div
        v-if="configResult"
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
      >
        <h3 class="text-lg font-medium mb-3">OAuth 配置檢查</h3>
        <div class="space-y-2 text-sm">
          <div><strong>當前 Provider:</strong> {{ provider }}</div>
          <div>
            <strong>API URL:</strong>
            {{ configResult.config.config.apiUrl || '未設定' }}
          </div>
          <div>
            <strong>前端 URL:</strong>
            {{ configResult.config.config.frontendUrl }}
          </div>
          <div>
            <strong>環境:</strong>
            <span
              :class="
                configResult.config.config.isLocalhost
                  ? 'text-green-600'
                  : 'text-orange-600'
              "
            >
              {{
                configResult.config.config.isLocalhost
                  ? 'localhost'
                  : '生產環境'
              }}
            </span>
          </div>
          <div>
            <strong>重定向 URI 狀態:</strong>
            <span
              :class="
                configResult.redirectCheck.isAuthorized
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{ configResult.redirectCheck.isAuthorized ? '有效' : '無效' }}
            </span>
          </div>
        </div>

        <!-- 問題列表 -->
        <div v-if="configResult.config.issues.length > 0" class="mt-4">
          <h4 class="font-medium mb-2">發現的問題:</h4>
          <div class="space-y-2">
            <div
              v-for="issue in configResult.config.issues"
              :key="issue.message"
              :class="
                issue.type === 'error' ? 'text-red-600' : 'text-orange-600'
              "
              class="text-sm p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded"
            >
              <div class="font-medium">{{ issue.message }}</div>
              <div class="text-xs mt-1">{{ issue.solution }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 重定向 URI 列表 -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-medium mb-3">需要的重定向 URI</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
          請在 Google API Console 中添加以下重定向 URI：
        </p>
        <div class="space-y-1">
          <div
            v-for="uri in redirectUris"
            :key="uri"
            class="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border"
          >
            {{ uri }}
          </div>
        </div>
      </div>

      <!-- 測試按鈕 -->
      <div class="space-y-3">
        <Button
          label="測試 API 端點"
          icon="pi pi-search"
          @click="testApiEndpoint"
          :loading="testing"
          class="btn-primary"
        />

        <Button
          label="測試直接 Google OAuth"
          icon="pi pi-external-link"
          @click="testDirectGoogleOAuth"
          class="btn-secondary"
        />
      </div>

      <!-- 結果顯示 -->
      <div
        v-if="debugResult"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
      >
        <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
          API 響應結果:
        </h4>
        <pre
          class="text-xs text-blue-700 dark:text-blue-300 overflow-auto max-h-40"
          >{{ JSON.stringify(debugResult, null, 2) }}</pre
        >
      </div>

      <!-- 錯誤信息 -->
      <div
        v-if="debugError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4"
      >
        <h4 class="font-medium text-red-800 dark:text-red-200 mb-2">
          {{ debugError.diagnosis?.title || '錯誤信息' }}:
        </h4>
        <div class="text-sm text-red-700 dark:text-red-300 mb-3">
          {{ debugError.diagnosis?.description || debugError.message }}
        </div>

        <!-- 解決方案 -->
        <div v-if="debugError.diagnosis?.solutions" class="mb-3">
          <h5 class="font-medium text-red-800 dark:text-red-200 mb-2">
            解決方案:
          </h5>
          <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li
              v-for="solution in debugError.diagnosis.solutions"
              :key="solution"
              class="flex items-start"
            >
              <span class="mr-2">•</span>
              <span>{{ solution }}</span>
            </li>
          </ul>
        </div>

        <!-- 詳細錯誤信息 -->
        <details class="text-xs">
          <summary class="cursor-pointer text-red-600 dark:text-red-400 mb-2">
            查看詳細錯誤信息
          </summary>
          <pre class="text-red-700 dark:text-red-300 overflow-auto max-h-40">{{
            JSON.stringify(debugError, null, 2)
          }}</pre>
        </details>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <Button
          label="關閉"
          severity="secondary"
          @click="closeDialog"
          class="btn-secondary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import userService from '@/services/userService'
import {
  testOAuthConfig,
  diagnoseOAuthError,
  getRequiredRedirectUris,
} from '@/utils/oauthConfigChecker'

// 組件名稱
defineOptions({
  name: 'OAuthDebugDialog',
})

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    required: true,
  },
})

// Emits
const emit = defineEmits(['update:visible'])

// 響應式資料
const testing = ref(false)
const debugResult = ref(null)
const debugError = ref(null)
const configResult = ref(null)
const redirectUris = ref([])

// 全域 toast 服務
const toast = useToast()

// API URL
const apiUrl = import.meta.env.VITE_API_URL || '未設定'

// 處理 visible 屬性更新
const updateVisible = (newValue) => {
  emit('update:visible', newValue)
  if (newValue) {
    // 對話框開啟時自動執行配置檢查
    runConfigCheck()
  }
}

// 執行配置檢查
const runConfigCheck = async () => {
  try {
    const result = await testOAuthConfig()
    configResult.value = result
    redirectUris.value = getRequiredRedirectUris()

    console.log('OAuth 配置檢查完成:', result)
  } catch (error) {
    console.error('配置檢查失敗:', error)
  }
}

// 測試 API 端點
const testApiEndpoint = async () => {
  testing.value = true
  debugResult.value = null
  debugError.value = null

  try {
    console.log('測試 API 端點:', `/api/users/bind-auth/${props.provider}`)

    const response = await userService.initBindAuth(props.provider)
    debugResult.value = response.data

    console.log('API 響應:', response.data)

    if (response.data?.authUrl) {
      // 檢查授權 URL 格式
      const authUrl = response.data.authUrl
      if (!authUrl.startsWith('https://accounts.google.com')) {
        toast.add({
          severity: 'warning',
          summary: '授權 URL 格式異常',
          detail: '授權 URL 不是 Google OAuth 格式',
          life: 5000,
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'API 測試成功',
          detail: `獲取到授權 URL: ${authUrl.substring(0, 50)}...`,
          life: 3000,
        })
      }
    } else {
      toast.add({
        severity: 'warning',
        summary: 'API 響應異常',
        detail: '響應中沒有 authUrl 欄位',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('API 測試失敗:', error)

    // 診斷 OAuth 錯誤
    const diagnosis = diagnoseOAuthError(error.response?.data || error)
    debugError.value = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
      diagnosis: diagnosis,
    }

    toast.add({
      severity: 'error',
      summary: 'API 測試失敗',
      detail: diagnosis.title,
      life: 5000,
    })
  } finally {
    testing.value = false
  }
}

// 測試直接 Google OAuth
const testDirectGoogleOAuth = () => {
  // 直接開啟 Google OAuth 頁面進行測試
  const testUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?client_id=test&redirect_uri=test&response_type=code&scope=openid%20email%20profile'

  const testWindow = window.open(
    testUrl,
    'oauth_test',
    'width=500,height=600,scrollbars=yes,resizable=yes',
  )

  if (testWindow) {
    toast.add({
      severity: 'info',
      summary: '測試視窗已開啟',
      detail: '正在測試 Google OAuth 頁面載入',
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: '測試失敗',
      detail: '無法開啟測試視窗，請檢查彈出視窗設定',
      life: 3000,
    })
  }
}

// 關閉對話框
const closeDialog = () => {
  debugResult.value = null
  debugError.value = null
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.oauth-debug-dialog {
  :deep(.p-dialog-content) {
    padding: 1.5rem;
  }
}
</style>
