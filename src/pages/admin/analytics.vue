<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminAnalytics'
})

// Route meta for admin protection
definePageMeta({
  layout: 'admin',
  admin: true,
  title: '數據分析'
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const analyticsData = ref({})
const loading = ref(false)

const loadAnalytics = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的分析服務
    // const response = await analyticsService.getDashboard()
    // analyticsData.value = response.data
    
    // 暫時模擬數據
    analyticsData.value = {
      totalMemes: 1234,
      totalUsers: 5678,
      totalViews: 98765,
      totalLikes: 4321
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入分析數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})
</script>

<template>
  <div class="admin-analytics">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        數據分析
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ analyticsData.totalMemes }}</div>
            <div class="text-gray-600 dark:text-gray-400">總迷因數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ analyticsData.totalUsers }}</div>
            <div class="text-gray-600 dark:text-gray-400">總用戶數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ analyticsData.totalViews }}</div>
            <div class="text-gray-600 dark:text-gray-400">總瀏覽數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ analyticsData.totalLikes }}</div>
            <div class="text-gray-600 dark:text-gray-400">總點讚數</div>
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>推薦系統效能分析</template>
      <template #content>
        <div class="text-center py-8">
          <i class="pi pi-chart-line text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">圖表組件將在後續實作中加入</p>
        </div>
      </template>
    </Card>
  </div>
</template>