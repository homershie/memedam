<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    modal
    :header="`綁定 ${providerName} 帳號`"
    :style="{ width: '500px' }"
    :closable="false"
    class="oauth-binding-dialog"
  >
    <div class="space-y-4">
      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          正在初始化綁定流程...
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          請稍候，正在準備 {{ providerName }} 授權頁面
        </p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="text-center py-8">
        <i class="pi pi-exclamation-triangle text-4xl text-danger-500 mb-4"></i>
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          綁定初始化失敗
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {{ error }}
        </p>
      </div>

      <!-- 成功狀態 -->
      <div v-else-if="authWindow" class="text-center py-8">
        <i class="pi pi-check-circle text-4xl text-success-500 mb-4"></i>
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          授權視窗已開啟
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          請在新視窗中完成 {{ providerName }} 帳戶授權
        </p>
        <div
          class="mt-4 p-4 bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-700 rounded-lg"
        >
          <div class="flex items-start space-x-2">
            <i class="pi pi-info-circle text-info-500 mt-0.5"></i>
            <div class="text-left">
              <p class="text-sm font-medium text-info-800 dark:text-info-200">
                操作提示
              </p>
              <ul
                class="text-sm text-info-700 dark:text-info-300 mt-1 space-y-1"
              >
                <li>• 在新視窗中登入您的 {{ providerName }} 帳戶</li>
                <li>• 授權應用程式存取您的帳戶資訊</li>
                <li>• 完成後視窗將自動關閉</li>
                <li>• 如果視窗沒有自動關閉，請手動關閉</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 初始狀態 -->
      <div v-else class="text-center py-8">
        <i :class="providerIcon" class="text-4xl text-primary-500 mb-4"></i>
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          綁定 {{ providerName }} 帳號
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          點擊下方按鈕開始綁定流程
        </p>
      </div>

      <!-- 回調參數顯示 -->
      <div
        v-if="callbackData"
        class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-left"
      >
        <h4 class="text-sm font-medium mb-2">回調參數</h4>
        <div class="text-xs space-y-1">
          <div><strong>state:</strong> {{ callbackData.state || '—' }}</div>
          <div><strong>code:</strong> {{ callbackData.code || '—' }}</div>
          <div><strong>success:</strong> {{ callbackData.success || '—' }}</div>
          <div><strong>error:</strong> {{ callbackData.error || '—' }}</div>
          <div><strong>message:</strong> {{ callbackData.message || '—' }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <Button
          v-if="!loading && !authWindow"
          label="取消"
          severity="secondary"
          @click="closeDialog"
          class="btn-secondary"
        />
        <Button
          v-if="!loading && !authWindow && !error"
          label="開始綁定"
          icon="pi pi-link"
          @click="startBinding"
          class="btn-primary"
        />
        <Button
          v-if="error"
          label="重試"
          icon="pi pi-refresh"
          @click="startBinding"
          class="btn-primary"
        />
        <Button
          v-if="authWindow"
          label="完成"
          icon="pi pi-check"
          @click="closeDialog"
          class="btn-primary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'

// 組件名稱
defineOptions({
  name: 'OAuthBindingDialog',
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
  providerName: {
    type: String,
    required: true,
  },
  providerIcon: {
    type: String,
    required: true,
  },
})

// Emits
const emit = defineEmits(['update:visible', 'binding-success', 'binding-error'])

// 響應式資料
const loading = ref(false)
const error = ref('')
const authWindow = ref(null)
const checkClosedInterval = ref(null)
const callbackUrlCheckInterval = ref(null)
const fallbackTimeout = ref(null)
const callbackData = ref(null)
const receivedCallback = ref(false)
const receivedError = ref('')
let messageListener = null

// 全域 toast 服務
const toast = useToast()

// 處理 visible 屬性更新
const updateVisible = (newValue) => {
  emit('update:visible', newValue)
}

// 監聽 visible 變化
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      // 對話框開啟時重置狀態
      resetState()
    } else {
      // 對話框關閉時清理資源
      cleanup()
    }
  },
)

// 重置狀態
const resetState = () => {
  loading.value = false
  error.value = ''
  authWindow.value = null
  callbackData.value = null
  if (checkClosedInterval.value) {
    clearInterval(checkClosedInterval.value)
    checkClosedInterval.value = null
  }
  if (callbackUrlCheckInterval.value) {
    clearInterval(callbackUrlCheckInterval.value)
    callbackUrlCheckInterval.value = null
  }
  if (fallbackTimeout.value) {
    clearTimeout(fallbackTimeout.value)
    fallbackTimeout.value = null
  }
  if (messageListener) {
    window.removeEventListener('message', messageListener)
    messageListener = null
  }
}

// 清理資源
const cleanup = () => {
  if (checkClosedInterval.value) {
    clearInterval(checkClosedInterval.value)
    checkClosedInterval.value = null
  }
  if (authWindow.value && !authWindow.value.closed) {
    authWindow.value.close()
  }
  if (callbackUrlCheckInterval.value) {
    clearInterval(callbackUrlCheckInterval.value)
    callbackUrlCheckInterval.value = null
  }
  if (messageListener) {
    window.removeEventListener('message', messageListener)
    messageListener = null
  }
}

// 開始綁定流程
const startBinding = async () => {
  loading.value = true
  error.value = ''

  try {
    // 調用認證端點獲取授權 URL
    const response = await userService.initBindAuth(props.provider)

    // 調試信息
    console.log('OAuth 綁定響應:', response.data)
    console.log('授權 URL:', response.data?.authUrl)

    if (response.data && response.data.authUrl) {
      // 檢查授權 URL 是否正確
      const authUrl = response.data.authUrl

      // 如果是後端初始化端點，直接使用
      if (authUrl.startsWith('/api/')) {
        console.log('使用後端初始化端點:', authUrl)
      }
      // 如果是直接的 Google OAuth URL，也允許使用
      else if (
        authUrl.startsWith('https://accounts.google.com') ||
        authUrl.includes('google.com/oauth') ||
        authUrl.includes('googleapis.com')
      ) {
        console.log('使用直接的 Google OAuth URL:', authUrl)
      }
      // 其他格式的 URL
      else {
        console.warn('警告：授權 URL 格式不預期:', authUrl)
        error.value = '後端返回的授權 URL 格式不正確，請聯繫管理員'
        return
      }

      // 構建完整的 URL
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const fullAuthUrl = authUrl.startsWith('http')
        ? authUrl
        : `${baseUrl}${authUrl}`

      console.log('開啟授權視窗:', fullAuthUrl)

      // 添加認證 token 到 URL（優先從 Pinia store 獲取）
      const userStore = useUserStore()
      const token =
        userStore.token ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token')
      const finalUrl = token
        ? `${fullAuthUrl}${fullAuthUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
        : fullAuthUrl

      console.log('最終授權 URL:', finalUrl)
      console.log('Token 來源:', {
        fromStore: !!userStore.token,
        fromLocalStorage: !!localStorage.getItem('token'),
        fromSessionStorage: !!sessionStorage.getItem('token'),
        tokenLength: token ? token.length : 0,
      })

      // 使用 window.open 開啟授權視窗
      authWindow.value = window.open(
        finalUrl,
        'oauth_auth',
        'width=500,height=600,scrollbars=yes,resizable=yes',
      )

      if (!authWindow.value) {
        throw new Error('無法開啟授權視窗，請檢查彈出視窗是否被阻擋')
      }

      // 監聽授權視窗的關閉事件
      checkClosedInterval.value = setInterval(() => {
        if (authWindow.value && authWindow.value.closed) {
          clearInterval(checkClosedInterval.value)
          checkClosedInterval.value = null
          if (fallbackTimeout.value) {
            clearTimeout(fallbackTimeout.value)
            fallbackTimeout.value = null
          }

          if (receivedCallback.value && !receivedError.value) {
            // 有收到成功回調
            emit('binding-success')
            toast.add({
              severity: 'success',
              summary: '綁定完成',
              detail: `${props.providerName} 帳號綁定流程已完成，請檢查綁定狀態`,
              life: 3000,
            })
          } else {
            // 未收到回調或回調為錯誤，視為失敗/取消
            const friendly = mapBindErrorMessage(
              props.provider,
              receivedError.value || '授權視窗已關閉，綁定未完成。',
            )
            emit('binding-error', friendly)
            toast.add({
              severity: 'error',
              summary: '綁定失敗',
              detail: friendly,
              life: 6000,
            })
          }

          closeDialog()
        }
      }, 500)

      // 監聽小窗 postMessage 回傳
      messageListener = (event) => {
        if (event.origin !== window.location.origin) return
        const { type, data } = event.data || {}
        if (type === 'oauth_callback') {
          callbackData.value = {
            state: data?.state || null,
            code: data?.code || null,
            error: data?.error || null,
            message: data?.message || null,
            success: data?.success || null,
          }
          receivedCallback.value = true
          receivedError.value = callbackData.value.error || ''
          if (fallbackTimeout.value) {
            clearTimeout(fallbackTimeout.value)
            fallbackTimeout.value = null
          }
          // 依回調內容提示
          const hasError =
            !!callbackData.value.error || callbackData.value.success === 'false'
          const friendly = hasError
            ? mapBindErrorMessage(
                props.provider,
                callbackData.value.error || callbackData.value.message,
              )
            : '授權完成'
          toast.add({
            severity: hasError ? 'error' : 'success',
            summary: hasError ? '綁定失敗' : '收到回調參數',
            detail: friendly,
            life: hasError ? 6000 : 3000,
          })
          if (authWindow.value && !authWindow.value.closed)
            authWindow.value.close()
        }
      }
      window.addEventListener('message', messageListener)

      // 同源回調頁時，直接讀取小窗 URL 查詢參數
      callbackUrlCheckInterval.value = setInterval(() => {
        if (!authWindow.value || authWindow.value.closed) return
        let href
        try {
          href = authWindow.value.location.href
        } catch {
          // 跨網域期間不可讀
          return
        }
        if (href && href.startsWith(window.location.origin)) {
          try {
            const url = new URL(href)
            const sp = url.searchParams
            const data = {
              state: sp.get('state'),
              code: sp.get('code'),
              error: sp.get('error'),
              message: sp.get('message'),
              success: sp.get('success'),
            }
            callbackData.value = data
            receivedCallback.value = true
            receivedError.value = data.error || ''
            if (fallbackTimeout.value) {
              clearTimeout(fallbackTimeout.value)
              fallbackTimeout.value = null
            }
            const hasError = !!data.error || data.success === 'false'
            const friendly = hasError
              ? mapBindErrorMessage(props.provider, data.error || data.message)
              : '授權完成'
            toast.add({
              severity: hasError ? 'error' : 'success',
              summary: hasError ? '綁定失敗' : '收到回調參數',
              detail: friendly,
              life: hasError ? 6000 : 3000,
            })
          } catch {
            // 解析失敗時忽略，繼續等待下一次輪詢
          }
          clearInterval(callbackUrlCheckInterval.value)
          callbackUrlCheckInterval.value = null
          if (authWindow.value && !authWindow.value.closed)
            authWindow.value.close()
        }
      }, 500)

      // 後備關閉計時器：若未在期限內收到回調，主視窗顯示錯誤並關閉小窗
      fallbackTimeout.value = setTimeout(() => {
        if (authWindow.value && !authWindow.value.closed) {
          try {
            authWindow.value.close()
          } catch {
            /* no-op */
          }
        }
        const friendly = mapBindErrorMessage(
          props.provider,
          receivedError.value || '未收到授權回調，可能綁定失敗。',
        )
        error.value = friendly
        emit('binding-error', friendly)
        toast.add({
          severity: 'error',
          summary: '綁定失敗',
          detail: friendly,
          life: 6000,
        })
        closeDialog()
      }, 3000)

      toast.add({
        severity: 'info',
        summary: '授權視窗已開啟',
        detail: `請在新視窗中完成 ${props.providerName} 帳戶授權`,
        life: 5000,
      })
    } else {
      console.error('後端響應中沒有 authUrl:', response.data)
      throw new Error('初始化綁定流程失敗：未獲取到授權 URL')
    }
  } catch (err) {
    console.error('初始化社群綁定失敗:', err)
    console.error('錯誤詳情:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: err.config?.url,
    })

    const status = err.response?.status
    const raw =
      err.response?.data?.message || err.response?.data?.error || err.message
    error.value = mapBindErrorMessage(props.provider, raw, status)

    emit('binding-error', error.value)
  } finally {
    loading.value = false
  }
}

// 關閉對話框
const closeDialog = () => {
  cleanup()
  emit('update:visible', false)
}

// 組件卸載時清理資源
onUnmounted(() => {
  cleanup()
})

// 綁定錯誤訊息格式化（與 settings 一致的規則）
const mapBindErrorMessage = (provider, err, status) => {
  const providerNameMap = {
    google: 'Google',
    facebook: 'Facebook',
    discord: 'Discord',
    twitter: 'Twitter',
  }
  const name = providerNameMap[provider] || '社群'
  const text = typeof err === 'string' ? err : err?.message || ''

  if (status === 409 || /已被其他用戶綁定|already bound/i.test(text)) {
    return `此 ${name} 帳號已被其他用戶綁定。請改用其他 ${name} 帳號，或先至原帳號解除綁定後再重試。`
  }
  if (
    status === 400 ||
    /invalid state|state.*mismatch|bad request/i.test(text)
  ) {
    return '授權流程已過期或驗證碼不正確，請重新發起綁定。'
  }
  if (status === 401 || /unauthorized|未授權/i.test(text)) {
    return '授權未通過或尚未登入，請先登入後再重試。'
  }
  if (status === 403 || /forbidden|權限不足/i.test(text)) {
    return '您沒有執行此綁定操作的權限。'
  }
  if (status === 429 || /too many requests|rate limit/i.test(text)) {
    return '操作過於頻繁，請稍後再試。'
  }
  if (status === 500 || /server error|internal/i.test(text)) {
    return '伺服器發生錯誤，請稍後再試。'
  }
  if (/permission|scope|未授權存取/i.test(text)) {
    return `未取得必要授權範圍，請在 ${name} 授權頁面允許必要的權限後再試。`
  }

  return text || '綁定失敗，請稍後再試'
}
</script>

<style scoped lang="scss">
.oauth-binding-dialog {
  :deep(.p-dialog-content) {
    padding: 1.5rem;
  }
}
</style>
