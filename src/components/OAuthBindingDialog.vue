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
  if (checkClosedInterval.value) {
    clearInterval(checkClosedInterval.value)
    checkClosedInterval.value = null
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
}

// 開始綁定流程
const startBinding = async () => {
  loading.value = true
  error.value = ''

  try {
    // 調用認證端點獲取授權 URL
    const response = await userService.initBindAuth(props.provider)

    if (response.data && response.data.authUrl) {
      // 使用 window.open 開啟授權視窗
      authWindow.value = window.open(
        response.data.authUrl,
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

          // 授權視窗已關閉，通知父組件重新載入資料
          emit('binding-success')

          toast.add({
            severity: 'success',
            summary: '綁定完成',
            detail: `${props.providerName} 帳號綁定流程已完成，請檢查綁定狀態`,
            life: 3000,
          })

          closeDialog()
        }
      }, 1000)

      toast.add({
        severity: 'info',
        summary: '授權視窗已開啟',
        detail: `請在新視窗中完成 ${props.providerName} 帳戶授權`,
        life: 5000,
      })
    } else {
      throw new Error('初始化綁定流程失敗：未獲取到授權 URL')
    }
  } catch (err) {
    console.error('初始化社群綁定失敗:', err)
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      '綁定失敗，請稍後再試'

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
</script>

<style scoped lang="scss">
.oauth-binding-dialog {
  :deep(.p-dialog-content) {
    padding: 1.5rem;
  }
}
</style>
