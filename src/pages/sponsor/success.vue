<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <div class="max-w-2xl mx-auto text-center space-y-8 py-4">
      <!-- 成功圖示 -->
      <div class="w-fit h-fit mx-auto flex items-center justify-center">
        <i class="ri-checkbox-circle-fill text-6xl text-green-500"></i>
      </div>

      <!-- 成功標題 -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-green-600">贊助成功！</h1>
        <p class="text-lg text-surface-600">
          感謝您的贊助，您的支持是迷因長繼續努力的動力！
        </p>
      </div>

      <!-- 贊助詳情 -->
      <div
        v-if="sponsorInfo"
        class="bg-surface-50 dark:bg-surface-900 rounded-lg p-6 space-y-4"
      >
        <h3 class="text-xl font-semibold">贊助詳情</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >交易編號：</span
              >
              <span class="font-mono text-sm">{{
                sponsorInfo.kofiTransactionId || sponsorInfo.transactionId
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >贊助金額：</span
              >
              <span class="font-bold text-primary-600">{{
                formatCurrency(
                  sponsorInfo.amount_original || sponsorInfo.amount,
                  sponsorInfo.currency_original || sponsorInfo.currency,
                )
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >支付方式：</span
              >
              <span>{{ getPaymentMethodName(sponsorInfo.paymentMethod) }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >您的信箱：</span
              >
              <span>{{ sponsorInfo.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >贊助時間：</span
              >
              <span>{{ formatDate(sponsorInfo.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400"
                >贊助狀態：</span
              >
              <span class="text-green-600 font-semibold">成功</span>
            </div>
          </div>
        </div>

        <!-- 贊助留言 -->
        <div
          v-if="sponsorInfo.message"
          class="mt-4 p-4 bg-white dark:bg-surface-800 rounded-lg border-l-4 border-primary-500"
        >
          <p class="text-sm text-surface-600! dark:text-surface-400! mb-2">
            您的留言：
          </p>
          <p class="italic">"{{ sponsorInfo.message }}"</p>
        </div>
      </div>

      <!-- 贊助者權益說明 -->
      <div class="bg-surface-50 dark:bg-surface-900 rounded-lg p-6 space-y-4">
        <h3
          class="text-xl font-semibold text-primary-700 dark:text-primary-300"
        >
          您已獲得以下權益:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="flex items-center space-x-3">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>顯示在首頁贊助名單</span>
          </div>
          <div
            v-if="shouldShowMessage(sponsorInfo)"
            class="flex items-center space-x-3"
          >
            <i class="pi pi-check-circle text-green-600"></i>
            <span>在首頁展示您的留言</span>
          </div>
          <div
            v-if="shouldShowBadge(sponsorInfo)"
            class="flex items-center space-x-3"
          >
            <i class="pi pi-check-circle text-green-600"></i>
            <span>乾爹/乾媽徽章</span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>迷因長的感謝</span>
          </div>
        </div>
      </div>

      <!-- 感謝訊息 -->
      <div class="mt-8 relative">
        <GlowBorder
          :color="['#33FF33', '#a259f7', '#ff3399']"
          :border-radius="10"
        />
        <div
          class="relative p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg"
        >
          <h6 class="gradient-text mb-2">再次感謝您的支持！</h6>
          <p class="gradient-text">
            您的每一份贊助都讓迷因典變得更好，讓迷因長有更多動力繼續創作和維護這個平台。
            期待在迷因典與您再次相遇！
          </p>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          label="回到首頁"
          icon="pi pi-home"
          severity="secondary"
          @click="goToHome"
          class="flex-1 sm:flex-none"
        />
        <Button
          label="繼續瀏覽迷因"
          icon="pi pi-images"
          @click="goToMemes"
          class="flex-1 sm:flex-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import GlowBorder from '@/components/ui/glow-border/GlowBorder.vue'
import {
  validateSponsorTransaction,
  SPONSOR_VALIDATION_STATUS,
  logSponsorPageAccess,
} from '@/utils/sponsorValidation'
import {
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  shouldShowMessage,
  shouldShowBadge,
  getErrorHandlingSuggestion,
} from '@/utils/sponsorErrorHandler'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const sponsorInfo = ref(null)

// 使用從錯誤處理工具導入的函數

// 導航到首頁
const goToHome = () => {
  router.push('/')
}

// 導航到迷因頁面
const goToMemes = () => {
  router.push('/memes')
}

// 使用從錯誤處理工具導入的函數

// 載入贊助資訊
const loadSponsorInfo = async () => {
  const transactionId = route.query.transaction_id
  if (!transactionId) {
    // 記錄錯誤頁面訪問
    await logSponsorPageAccess('error', null, '缺少交易ID')

    // 導向錯誤頁面
    const errorMessage = encodeURIComponent('缺少交易資訊，無法載入贊助詳情')
    router.push(`/sponsor/error?message=${errorMessage}`)
    return
  }

  try {
    // 記錄成功頁面訪問
    await logSponsorPageAccess('success', transactionId, '用戶訪問贊助成功頁面')

    // 使用驗證工具載入贊助資訊
    const validation = await validateSponsorTransaction(transactionId)

    if (validation.status === SPONSOR_VALIDATION_STATUS.VALID) {
      sponsorInfo.value = validation.data

      // 顯示成功訊息
      toast.add({
        severity: 'success',
        summary: '贊助驗證成功',
        detail: '感謝您的贊助！',
        life: 3000,
      })
    } else if (validation.status === SPONSOR_VALIDATION_STATUS.PENDING) {
      // 處理待處理狀態
      sponsorInfo.value = validation.data
      toast.add({
        severity: 'warn',
        summary: '贊助處理中',
        detail: '您的贊助正在處理中，請稍後再查看',
        life: 5000,
      })
    } else {
      throw new Error(validation.message || '無法載入贊助資訊')
    }
  } catch (error) {
    console.error('載入贊助資訊失敗:', error)

    // 取得錯誤處理建議
    const suggestion = getErrorHandlingSuggestion({})

    // 記錄錯誤頁面訪問
    await logSponsorPageAccess('error', transactionId, error.message)

    // 導向錯誤頁面，並傳遞錯誤訊息
    const errorMessage = encodeURIComponent(error.message || suggestion)
    router.push(`/sponsor/error?message=${errorMessage}`)
  }
}

onMounted(() => {
  loadSponsorInfo()
})
</script>

<script>
export default {
  name: 'SponsorSuccessPage',
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(45deg, #ff3399, #a259f7, #33ff33);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

<route lang="yaml">
meta:
  title: '贊助成功'
  description: '感謝您的贊助，您的支持是迷因典持續發展的動力！'
  layout: 'full'
  login: ''
  admin: false
</route>
