<template>
  <div class="space-y-6">
    <!-- 標題 -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Cookie 與隱私設定
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        管理您的 Cookie 偏好和隱私設定
      </p>
    </div>

    <!-- 當前設定狀態 -->
    <Card>
      <template #content>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            當前設定
          </h3>
          <div class="grid gap-4">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">
                  必要 Cookie
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  維持網站基本功能
                </p>
              </div>
              <div class="flex items-center">
                <i class="pi pi-lock text-gray-400 mr-2"></i>
                <span class="text-sm text-gray-500">始終啟用</span>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">
                  功能 Cookie
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  記住您的偏好設定
                </p>
              </div>
              <div class="flex items-center">
                <Tag
                  :value="currentConsent?.functional ? '已啟用' : '已停用'"
                  :severity="
                    currentConsent?.functional ? 'success' : 'secondary'
                  "
                />
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-800 dark:text-gray-200">
                  分析 Cookie
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  匿名統計，改善服務
                </p>
              </div>
              <div class="flex items-center">
                <Tag
                  :value="currentConsent?.analytics ? '已啟用' : '已停用'"
                  :severity="
                    currentConsent?.analytics ? 'success' : 'secondary'
                  "
                />
              </div>
            </div>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <p>最後更新：{{ formatDate(currentConsent?.timestamp) }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- 設定選項 -->
    <Card>
      <template #content>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            調整設定
          </h3>

          <div class="space-y-4">
            <!-- 功能 Cookie -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200">
                    功能 Cookie
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    記住您的偏好設定
                  </p>
                </div>
                <InputSwitch
                  v-model="cookiePreferences.functional"
                  :disabled="!currentConsent"
                />
              </div>
              <p class="text-xs text-gray-500">
                這些 Cookie 記住您的語言偏好、主題設定等，提供更好的使用體驗。
              </p>
            </div>

            <!-- 分析 Cookie -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200">
                    分析 Cookie
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    匿名統計，改善服務
                  </p>
                </div>
                <InputSwitch
                  v-model="cookiePreferences.analytics"
                  :disabled="!currentConsent"
                />
              </div>
              <p class="text-xs text-gray-500">
                這些 Cookie
                幫助我們了解網站使用情況，改善服務品質。所有數據都是匿名的。
              </p>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              label="儲存設定"
              icon="pi pi-save"
              :disabled="!currentConsent || !hasChanges"
              @click="saveSettings"
            />
            <Button
              label="重置為預設"
              icon="pi pi-refresh"
              severity="secondary"
              :disabled="!currentConsent"
              @click="resetToDefault"
            />
            <Button
              label="重新同意"
              icon="pi pi-shield"
              severity="outline"
              @click="showConsentDialog"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 快速設定 -->
    <Card>
      <template #content>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            快速設定
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              label="接受全部"
              icon="pi pi-check"
              class="w-full"
              @click="acceptAll"
            />
            <Button
              label="僅必要"
              icon="pi pi-cog"
              severity="secondary"
              class="w-full"
              @click="acceptNecessary"
            />
            <Button
              label="停用分析"
              icon="pi pi-ban"
              severity="outline"
              class="w-full"
              @click="disableAnalytics"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 說明 -->
    <Card>
      <template #content>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            關於 Cookie
          </h3>

          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Cookie
              是小型文字檔案，儲存在您的裝置上，幫助我們提供更好的服務體驗。
            </p>
            <p>您可以隨時在此頁面調整設定，或透過瀏覽器設定管理 Cookie。</p>
            <p>
              了解更多詳情，請查看我們的
              <router-link
                to="/privacy"
                class="text-primary-600 hover:text-primary-700 underline"
                target="_blank"
              >
                隱私政策 </router-link
              >。
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

// 定義組件名稱
defineOptions({
  name: 'CookieManager',
})

const toast = useToast()

// 響應式數據
const currentConsent = ref(null)
const cookiePreferences = ref({
  functional: true,
  analytics: true,
})

// 檢查是否有變更
const hasChanges = computed(() => {
  if (!currentConsent.value) return false
  return (
    cookiePreferences.value.functional !== currentConsent.value.functional ||
    cookiePreferences.value.analytics !== currentConsent.value.analytics
  )
})

// 載入當前設定
const loadCurrentConsent = () => {
  const consent = localStorage.getItem('privacy-consent')
  if (consent) {
    currentConsent.value = JSON.parse(consent)
    cookiePreferences.value = {
      functional: currentConsent.value.functional,
      analytics: currentConsent.value.analytics,
    }
  }
}

// 儲存設定
const saveSettings = () => {
  const consent = {
    necessary: true,
    functional: cookiePreferences.value.functional,
    analytics: cookiePreferences.value.analytics,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem('privacy-consent', JSON.stringify(consent))
  currentConsent.value = consent

  toast.add({
    severity: 'success',
    summary: '設定已儲存',
    detail: '您的 Cookie 偏好設定已成功更新',
    life: 3000,
  })

  emit('settings-updated', consent)
}

// 重置為預設
const resetToDefault = () => {
  cookiePreferences.value = {
    functional: true,
    analytics: true,
  }
}

// 接受全部
const acceptAll = () => {
  cookiePreferences.value = {
    functional: true,
    analytics: true,
  }
  saveSettings()
}

// 僅接受必要
const acceptNecessary = () => {
  cookiePreferences.value = {
    functional: false,
    analytics: false,
  }
  saveSettings()
}

// 停用分析
const disableAnalytics = () => {
  cookiePreferences.value.analytics = false
  saveSettings()
}

// 顯示同意對話框
const showConsentDialog = () => {
  // 清除當前設定，觸發重新同意
  localStorage.removeItem('privacy-consent')
  currentConsent.value = null

  toast.add({
    severity: 'info',
    summary: '重新同意',
    detail: '請重新同意隱私政策以繼續使用',
    life: 3000,
  })

  // 觸發父組件顯示同意對話框
  emit('show-consent-dialog')
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '未設定'
  return new Date(timestamp).toLocaleString('zh-TW')
}

// 定義事件
const emit = defineEmits(['settings-updated', 'show-consent-dialog'])

// 組件掛載時載入設定
onMounted(() => {
  loadCurrentConsent()
})
</script>
