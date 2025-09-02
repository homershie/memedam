<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <div class="max-w-2xl mx-auto text-center space-y-8 py-16">
      <!-- 成功圖示 -->
      <div
        class="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
      >
        <i class="pi pi-check-circle text-4xl text-green-600"></i>
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
        class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6 space-y-4"
      >
        <h3 class="text-xl font-semibold">贊助詳情</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-surface-600">交易編號：</span>
              <span class="font-mono text-sm">{{
                sponsorInfo.transaction_id
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600">贊助金額：</span>
              <span class="font-bold text-primary-600"
                >NT$ {{ sponsorInfo.amount }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600">支付方式：</span>
              <span>{{
                getPaymentMethodName(sponsorInfo.payment_method)
              }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-surface-600">贊助時間：</span>
              <span>{{ formatDate(sponsorInfo.createdAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600">贊助狀態：</span>
              <span class="text-green-600 font-semibold">成功</span>
            </div>
          </div>
        </div>

        <!-- 贊助留言 -->
        <div
          v-if="sponsorInfo.message"
          class="mt-4 p-4 bg-white dark:bg-surface-700 rounded-lg border-l-4 border-primary-500"
        >
          <p class="text-sm text-surface-600 mb-2">您的留言：</p>
          <p class="italic">"{{ sponsorInfo.message }}"</p>
        </div>
      </div>

      <!-- 贊助者權益說明 -->
      <div
        class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 space-y-4"
      >
        <h3
          class="text-xl font-semibold text-primary-700 dark:text-primary-300"
        >
          🎉 您已獲得以下權益
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div class="flex items-center space-x-3">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>顯示在首頁贊助名單</span>
          </div>
          <div
            v-if="sponsorInfo?.amount >= 60"
            class="flex items-center space-x-3"
          >
            <i class="pi pi-check-circle text-green-600"></i>
            <span>首頁留言展示</span>
          </div>
          <div
            v-if="sponsorInfo?.amount >= 150"
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

      <!-- 感謝訊息 -->
      <div
        class="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg"
      >
        <p
          class="text-lg font-medium text-primary-700 dark:text-primary-300 mb-2"
        >
          再次感謝您的支持！
        </p>
        <p class="text-surface-600">
          您的每一份贊助都讓迷因典變得更好，讓迷因長有更多動力繼續創作和維護這個平台。
          期待在迷因典與您再次相遇！
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import {
  validateSponsorTransaction,
  SPONSOR_VALIDATION_STATUS,
} from '@/utils/sponsorValidation'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const sponsorInfo = ref(null)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 取得支付方式名稱
const getPaymentMethodName = (method) => {
  const methods = {
    buy_me_a_coffee: 'Buy Me a Coffee',
    credit_card: '信用卡',
    paypal: 'PayPal',
    linepay: 'LINE Pay',
  }
  return methods[method] || method
}

// 導航到首頁
const goToHome = () => {
  router.push('/')
}

// 導航到迷因頁面
const goToMemes = () => {
  router.push('/memes')
}

// 載入贊助資訊
const loadSponsorInfo = async () => {
  const transactionId = route.query.transaction_id
  if (!transactionId) {
    toast.add({
      severity: 'warn',
      summary: '缺少交易資訊',
      detail: '無法載入贊助詳情',
      life: 3000,
    })
    return
  }

  try {
    // 使用驗證工具載入贊助資訊
    const validation = await validateSponsorTransaction(transactionId)

    if (validation.status === SPONSOR_VALIDATION_STATUS.VALID) {
      sponsorInfo.value = validation.data
    } else {
      throw new Error(validation.message || '無法載入贊助資訊')
    }
  } catch (error) {
    console.error('載入贊助資訊失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入贊助詳情',
      life: 3000,
    })
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

<route lang="yaml">
meta:
  title: '贊助成功'
  description: '感謝您的贊助，您的支持是迷因典持續發展的動力！'
  login: ''
  admin: false
</route>
