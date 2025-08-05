<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 頁面標題 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h1 class="text-5xl font-bold text-center">請站長喝飲料</h1>
      <div class="text-center text-gray-600 max-w-4xl">
        <p class="text-lg mb-4">
          迷因是一種幽默和社會文化的表現形式，它為我們的生活帶來歡樂，同時也反映了現實生活中的各種議題。透過圖片、影片或文字的傳播，迷因能夠傳遞正能量，讓大家在忙碌的生活中找到一絲樂趣。
        </p>
        <p class="text-lg">
          迷因是一種幽默和社會文化的表現形式，它為我們的生活帶來歡樂，同時也反映了現實生活中的各種議題。透過圖片、影片或文字的傳播，迷因能夠傳遞正能量，讓大家在忙碌的生活中找到一絲樂趣。
        </p>
      </div>
    </div>

    <!-- 站長喜歡喝什麼 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h2 class="text-4xl font-bold text-center">站長喜歡喝什麼</h2>
      <div class="text-center text-gray-600 max-w-2xl">
        <p class="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>

    <!-- 產品比較 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h2 class="text-4xl font-bold text-center mb-8">產品比較</h2>

      <div class="grid lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <!-- 產品 1 -->
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-cube text-2xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">產品名稱</h3>
            <p class="text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>

          <div class="space-y-4 mb-6">
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">價格</span>
              <span class="text-lg font-bold text-primary-600">200</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">顯示在首頁贊助名單</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">首頁是否有留言</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="font-medium">乾爹/乾媽徽章</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
          </div>

          <Button
            label="請一杯"
            class="w-full p-button-primary h-12"
            @click="handleDonate(200)"
          />
        </div>

        <!-- 產品 2 -->
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-cube text-2xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">產品名稱</h3>
            <p class="text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>

          <div class="space-y-4 mb-6">
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">價格</span>
              <span class="text-lg font-bold text-primary-600">100</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">顯示在首頁贊助名單</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">首頁是否有留言</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="font-medium">乾爹/乾媽徽章</span>
              <i class="pi pi-times text-red-500 text-lg"></i>
            </div>
          </div>

          <Button
            label="請一杯"
            class="w-full p-button-primary h-12"
            @click="handleDonate(100)"
          />
        </div>

        <!-- 產品 3 -->
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-cube text-2xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">產品名稱</h3>
            <p class="text-gray-600">Lorem ipsum dolor sit amet</p>
          </div>

          <div class="space-y-4 mb-6">
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">價格</span>
              <span class="text-lg font-bold text-primary-600">50</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">顯示在首頁贊助名單</span>
              <i class="pi pi-check text-green-500 text-lg"></i>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="font-medium">首頁是否有留言</span>
              <i class="pi pi-times text-red-500 text-lg"></i>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="font-medium">乾爹/乾媽徽章</span>
              <i class="pi pi-times text-red-500 text-lg"></i>
            </div>
          </div>

          <Button
            label="請一杯"
            class="w-full p-button-primary h-12"
            @click="handleDonate(50)"
          />
        </div>
      </div>
    </div>

    <!-- 贊助說明 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h2 class="text-3xl font-bold text-center">為什麼要贊助站長？</h2>
      <div class="grid lg:grid-cols-2 gap-8 w-full max-w-4xl">
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-heart text-2xl text-primary-600"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">支持平台發展</h3>
          <p class="text-gray-600">
            您的贊助將用於伺服器維護、功能開發和平台優化，讓迷因典能夠持續為大家提供更好的服務。
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-star text-2xl text-primary-600"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">獲得特殊權益</h3>
          <p class="text-gray-600">
            贊助者可以獲得特殊徽章、首頁展示權益等回饋，讓您在迷因社群中脫穎而出。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

const toast = useToast()

// 處理贊助功能
const handleDonate = (amount) => {
  // 這裡可以整合金流系統
  toast.add({
    severity: 'info',
    summary: '贊助功能',
    detail: `感謝您的贊助！金額：${amount} 元。此功能正在開發中，敬請期待。`,
    life: 3000,
  })
}
</script>

<script>
export default {
  name: 'DonatePage',
}
</script>

<route lang="yaml">
meta:
  title: '請站長喝飲料'
  login: ''
  admin: false
</route>
