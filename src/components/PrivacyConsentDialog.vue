<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :dismissableMask="false"
    class="privacy-consent-dialog"
    :style="{ width: '90vw', maxWidth: '600px' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <i class="pi pi-shield text-2xl text-primary-600"></i>
        <h2 class="text-xl font-bold">隱私權與 Cookie 政策</h2>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 主要說明 -->
      <div class="text-gray-700 dark:text-gray-300">
        <p class="mb-3">
          歡迎來到迷因典 MemeDam！我們重視您的隱私權，並致力於保護您的個人資料。
        </p>
        <p class="mb-3">
          我們使用 Cookie
          和類似技術來改善您的使用體驗、提供個人化內容，以及分析網站流量。
        </p>
        <p>
          註冊即表示您同意我們的
          <router-link
            to="/terms"
            class="text-primary-600 hover:text-primary-700 underline font-medium"
            @click="handleLinkClick"
          >
            服務條款
          </router-link>
          和
          <router-link
            to="/privacy"
            class="text-primary-600 hover:text-primary-700 underline font-medium"
            @click="handleLinkClick"
          >
            隱私政策 </router-link
          >， 並同意我們依政策收集與使用資料。
        </p>
      </div>

      <!-- Cookie 類型說明 -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">
          我們使用的 Cookie 類型：
        </h3>
        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-green-500 mt-0.5"></i>
            <span
              ><strong>必要 Cookie：</strong>維持網站基本功能，如登入狀態</span
            >
          </div>
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-green-500 mt-0.5"></i>
            <span><strong>功能 Cookie：</strong>記住您的偏好設定</span>
          </div>
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-green-500 mt-0.5"></i>
            <span><strong>分析 Cookie：</strong>匿名統計，幫助改善服務</span>
          </div>
        </div>
      </div>

      <!-- 選擇按鈕 -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          label="接受全部"
          icon="pi pi-check"
          class="flex-1"
          @click="acceptAll"
        />
        <Button
          label="僅接受必要 Cookie"
          icon="pi pi-cog"
          severity="secondary"
          class="flex-1"
          @click="acceptNecessary"
        />
        <Button
          label="自訂設定"
          icon="pi pi-sliders-h"
          severity="outline"
          class="flex-1"
          @click="showCustomSettings"
        />
      </div>

      <!-- 額外說明 -->
      <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>
          您可以隨時在
          <router-link
            to="/privacy"
            class="underline hover:text-gray-700 dark:hover:text-gray-300"
            @click="handleLinkClick"
          >
            隱私政策
          </router-link>
          中了解更多詳情，或在瀏覽器設定中管理 Cookie。
        </p>
      </div>
    </div>
  </Dialog>

  <!-- 自訂設定對話框 -->
  <Dialog
    v-model:visible="customSettingsVisible"
    modal
    header="Cookie 偏好設定"
    :style="{ width: '90vw', maxWidth: '500px' }"
  >
    <div class="space-y-4">
      <!-- 必要 Cookie -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-200">
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
        <p class="text-xs text-gray-500">
          這些 Cookie 對於網站正常運作是必要的，無法停用。
        </p>
      </div>

      <!-- 功能 Cookie -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-200">
              功能 Cookie
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              記住您的偏好設定
            </p>
          </div>
          <InputSwitch v-model="cookiePreferences.functional" />
        </div>
        <p class="text-xs text-gray-500">
          這些 Cookie 記住您的語言偏好、主題設定等，提供更好的使用體驗。
        </p>
      </div>

      <!-- 分析 Cookie -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-200">
              分析 Cookie
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              匿名統計，改善服務
            </p>
          </div>
          <InputSwitch v-model="cookiePreferences.analytics" />
        </div>
        <p class="text-xs text-gray-500">
          這些 Cookie
          幫助我們了解網站使用情況，改善服務品質。所有數據都是匿名的。
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button
          label="取消"
          severity="secondary"
          text
          @click="customSettingsVisible = false"
        />
        <Button label="儲存設定" @click="saveCustomSettings" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 定義組件名稱
defineOptions({
  name: 'PrivacyConsentDialog',
})

const router = useRouter()

// 響應式數據
const visible = ref(false)
const customSettingsVisible = ref(false)
const cookiePreferences = ref({
  functional: true,
  analytics: true,
})

// 檢查是否已經同意過
const hasConsented = () => {
  return localStorage.getItem('privacy-consent') !== null
}

// 檢查是否需要顯示（首次訪問或未同意）
const shouldShow = () => {
  return !hasConsented()
}

// 接受全部 Cookie
const acceptAll = () => {
  const consent = {
    necessary: true,
    functional: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem('privacy-consent', JSON.stringify(consent))
  visible.value = false
  emit('consent-given', consent)
}

// 僅接受必要 Cookie
const acceptNecessary = () => {
  const consent = {
    necessary: true,
    functional: false,
    analytics: false,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem('privacy-consent', JSON.stringify(consent))
  visible.value = false
  emit('consent-given', consent)
}

// 顯示自訂設定
const showCustomSettings = () => {
  customSettingsVisible.value = true
}

// 儲存自訂設定
const saveCustomSettings = () => {
  const consent = {
    necessary: true,
    functional: cookiePreferences.value.functional,
    analytics: cookiePreferences.value.analytics,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem('privacy-consent', JSON.stringify(consent))
  customSettingsVisible.value = false
  visible.value = false
  emit('consent-given', consent)
}

// 處理連結點擊（在新視窗開啟）
const handleLinkClick = (event) => {
  event.preventDefault()
  const href = event.target.getAttribute('href')
  if (href) {
    window.open(href, '_blank')
  }
}

// 顯示對話框
const show = () => {
  if (shouldShow()) {
    visible.value = true
  }
}

// 獲取當前同意設定
const getConsent = () => {
  const consent = localStorage.getItem('privacy-consent')
  return consent ? JSON.parse(consent) : null
}

// 更新同意設定
const updateConsent = (newConsent) => {
  localStorage.setItem('privacy-consent', JSON.stringify(newConsent))
}

// 清除同意設定（用於測試或重新同意）
const clearConsent = () => {
  localStorage.removeItem('privacy-consent')
}

// 定義事件
const emit = defineEmits(['consent-given'])

// 暴露方法給父組件
defineExpose({
  show,
  getConsent,
  updateConsent,
  clearConsent,
})

// 組件掛載時檢查是否需要顯示
onMounted(() => {
  if (shouldShow()) {
    // 延遲顯示，確保頁面已完全載入
    setTimeout(() => {
      visible.value = true
    }, 1000)
  }
})
</script>

<style scoped>
.privacy-consent-dialog :deep(.p-dialog-header) {
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.privacy-consent-dialog :deep(.p-dialog-content) {
  padding-top: 1rem;
}

.privacy-consent-dialog :deep(.p-dialog-footer) {
  border-top: 1px solid var(--surface-border);
  padding-top: 1rem;
}
</style>
