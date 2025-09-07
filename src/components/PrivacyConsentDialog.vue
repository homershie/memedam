<template>
  <Drawer
    v-model:visible="visible"
    position="bottom"
    :dismissable="false"
    class="privacy-consent-drawer"
    :style="{ height: 'auto', maxHeight: '80vh' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <i class="pi pi-shield text-2xl text-primary-600"></i>
        <h6>隱私權與 Cookie 政策</h6>
      </div>
    </template>

    <div class="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
      <!-- 主要說明 -->
      <div class="text-gray-700 dark:text-gray-300 flex-1 lg:flex-6/12">
        <small>
          歡迎來到迷因典 MemeDam！我們重視您的隱私權，並致力於保護您的個人資料。
          我們使用 Cookie
          和類似技術來改善您的使用體驗、提供個人化內容，以及分析網站流量。使用本網站即表示您同意我們的
          <router-link
            to="/terms"
            class="text-primary-600 hover:text-primary-700 underline font-medium"
            @click="handleLinkClick"
            >服務條款</router-link
          >
          和
          <router-link
            to="/privacy"
            class="text-primary-600 hover:text-primary-700 underline font-medium"
            @click="handleLinkClick"
            >隱私政策</router-link
          >，並允許使用 Cookie 以提升體驗、分析流量及個人化內容。
        </small>
      </div>

      <!-- 空白區域 -->
      <div class="flex-1/12 xl:flex-2/12 2xl:flex-3/12 hidden lg:block"></div>

      <!-- 選擇按鈕 -->
      <div
        class="flex flex-1 flex-col md:flex-row lg:flex-5/12 xl:flex-4/12 2xl:flex-3/12 gap-3"
      >
        <Button
          label="接受全部"
          icon="pi pi-check"
          class="flex-1"
          severity="contrast"
          @click="acceptAll"
        />
        <Button
          label="僅限必要"
          icon="pi pi-cog"
          severity="secondary"
          class="flex-1"
          @click="acceptNecessary"
        />
        <a
          href="#"
          class="flex justify-center items-center gap-2 text-surface-600 dark:text-surface-300 hover:text-surface-900! dark:hover:text-surface-100!"
          @click.prevent="showCustomSettings"
        >
          <i class="pi pi-sliders-h"></i>
          <span>自訂設定</span>
        </a>
      </div>
    </div>
  </Drawer>

  <!-- 自訂設定對話框 -->
  <Dialog
    v-model:visible="customSettingsVisible"
    modal
    header="Cookie 偏好設定"
    :style="{ width: '90vw', maxWidth: '500px' }"
  >
    <div class="space-y-4">
      <!-- 必要 Cookie -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-start mb-2 gap-6">
          <div>
            <h5>必要 Cookie</h5>
            <small class="text-sm text-gray-600 dark:text-gray-400">
              維持網站基本功能
            </small>
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
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-start mb-2 gap-6">
          <div>
            <h5>功能 Cookie</h5>
            <small class="text-sm text-gray-600 dark:text-gray-400">
              記住您的偏好設定
            </small>
          </div>
          <InputSwitch v-model="cookiePreferences.functional" />
        </div>
        <p class="text-xs text-gray-500">
          這些 Cookie 記住您的語言偏好、主題設定等，提供更好的使用體驗。
        </p>
      </div>

      <!-- 分析 Cookie -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div class="flex items-center justify-start mb-2 gap-6">
          <div>
            <h5>分析 Cookie</h5>
            <small class="text-sm text-gray-600 dark:text-gray-400">
              匿名統計，改善服務
            </small>
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
          class="w-24"
        />
        <Button label="儲存設定" @click="saveCustomSettings" class="w-24" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import privacyConsentService from '@/services/privacyConsentService'

// 定義組件名稱
defineOptions({
  name: 'PrivacyConsentDialog',
})

// 響應式數據
const visible = ref(false)
const customSettingsVisible = ref(false)
const cookiePreferences = ref({
  functional: true,
  analytics: true,
})

// 檢查是否已經同意過（考慮後端資料）
const hasConsented = async () => {
  try {
    // 先檢查本地資料
    const localConsent = localStorage.getItem('privacy-consent')
    if (localConsent) {
      return true
    }

    // 如果本地沒有，檢查後端資料
    const response = await privacyConsentService.getCurrentConsent()
    const backendConsent = response.data?.consent

    if (backendConsent) {
      // 後端有資料但本地沒有，同步到本地
      localStorage.setItem('privacy-consent', JSON.stringify(backendConsent))
      return true
    }

    return false
  } catch {
    // 檢查失敗時，使用本地資料
    return localStorage.getItem('privacy-consent') !== null
  }
}

// 檢查是否需要顯示（首次訪問或未同意）
const shouldShow = async () => {
  return !(await hasConsented())
}

// 接受全部 Cookie
const acceptAll = async () => {
  const consent = {
    necessary: true,
    functional: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  }

  try {
    // 同步到後端
    await privacyConsentService.createConsent({
      necessary: consent.necessary,
      functional: consent.functional,
      analytics: consent.analytics,
      consentVersion: '1.0',
      consentSource: 'initial',
    })
  } catch (error) {
    console.error('隱私設定同步失敗:', error)
    // 即使後端同步失敗，也要儲存到本地
  }

  localStorage.setItem('privacy-consent', JSON.stringify(consent))
  visible.value = false
  emit('consent-given', consent)
}

// 僅接受必要 Cookie
const acceptNecessary = async () => {
  const consent = {
    necessary: true,
    functional: false,
    analytics: false,
    timestamp: new Date().toISOString(),
  }

  try {
    // 同步到後端
    await privacyConsentService.createConsent({
      necessary: consent.necessary,
      functional: consent.functional,
      analytics: consent.analytics,
      consentVersion: '1.0',
      consentSource: 'initial',
    })
  } catch (error) {
    console.error('隱私設定同步失敗:', error)
    // 即使後端同步失敗，也要儲存到本地
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
const saveCustomSettings = async () => {
  const consent = {
    necessary: true,
    functional: cookiePreferences.value.functional,
    analytics: cookiePreferences.value.analytics,
    timestamp: new Date().toISOString(),
  }

  try {
    // 同步到後端
    await privacyConsentService.createConsent({
      necessary: consent.necessary,
      functional: consent.functional,
      analytics: consent.analytics,
      consentVersion: '1.0',
      consentSource: 'initial',
    })
  } catch (error) {
    console.error('隱私設定同步失敗:', error)
    // 即使後端同步失敗，也要儲存到本地
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
onMounted(async () => {
  if (await shouldShow()) {
    // 延遲顯示，確保頁面已完全載入
    setTimeout(() => {
      visible.value = true
    }, 1000)
  }
})
</script>

<style scoped>
/* 強力移除遮罩背景 - 使用多種方法確保覆蓋 */
.privacy-consent-drawer :deep(.p-drawer-mask) {
  background-color: transparent !important;
  background: transparent !important;
  backdrop-filter: none !important;
  pointer-events: none !important;
}

/* 如果上面的方法不行，嘗試更強力的覆蓋 */
.privacy-consent-drawer :deep(.p-drawer-mask[style*='background']) {
  background-color: transparent !important;
  background: transparent !important;
  pointer-events: none !important;
}

/* 使用全域樣式作為備用方案 */
</style>

<style>
/* 全域樣式確保覆蓋 */
.privacy-consent-drawer .p-drawer-mask {
  background-color: transparent !important;
  background: transparent !important;
  pointer-events: none !important;
}

/* 更強力的全域覆蓋 */
.p-drawer-mask {
  background-color: transparent !important;
  background: transparent !important;
  pointer-events: none !important;
}
</style>
