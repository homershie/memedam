<script setup>
import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

// Define component name to fix linter error
defineOptions({
  name: 'AdminDashboard'
})

// 組件引入
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue'
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue'
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue'
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue'
import StatsWidget from '@/components/dashboard/StatsWidget.vue'

// Store
const adminStore = useAdminStore()

// 計算屬性
const isLoading = computed(() => adminStore.dashboardLoading)
const statsData = computed(() => adminStore.statsCards)

// 載入數據
onMounted(async () => {
  try {
    await adminStore.loadDashboardData()
  } catch (error) {
    console.error('載入儀表板數據失敗:', error)
  }
})
</script>

<template>
  <div class="admin-page-header">
    <h1 class="admin-page-title">管理儀表板</h1>
    <p class="admin-page-description">迷因典管理系統概覽</p>
  </div>

  <!-- Loading skeleton -->
  <div v-if="isLoading" class="grid grid-cols-12 gap-6">
    <div 
      v-for="i in 4" 
      :key="i" 
      class="col-span-12 lg:col-span-6 xl:col-span-3"
    >
      <div class="admin-content-card">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="loading-skeleton h-4 w-24 mb-2"></div>
            <div class="loading-skeleton h-8 w-16"></div>
          </div>
          <div class="loading-skeleton w-12 h-12 rounded-lg"></div>
        </div>
        <div class="loading-skeleton h-4 w-20"></div>
      </div>
    </div>
  </div>

  <!-- Dashboard content -->
  <div v-else class="grid grid-cols-12 gap-6">
    <!-- Stats Cards -->
    <StatsWidget :stats="statsData" />

    <!-- Main content widgets -->
    <div class="col-span-12 xl:col-span-6">
      <div class="space-y-6">
        <RecentSalesWidget />
        <BestSellingWidget />
      </div>
    </div>
    
    <div class="col-span-12 xl:col-span-6">
      <div class="space-y-6">
        <RevenueStreamWidget />
        <NotificationsWidget />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="col-span-12">
      <div class="admin-content-card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快速操作
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link 
            to="/admin/memes" 
            class="admin-quick-action-card"
          >
            <i class="pi pi-image text-2xl text-blue-500 mb-2"></i>
            <span class="text-sm font-medium">迷因管理</span>
            <span class="text-xs text-gray-500">
              {{ adminStore.pendingMemes.length }} 待審核
            </span>
          </router-link>
          
          <router-link 
            to="/admin/users" 
            class="admin-quick-action-card"
          >
            <i class="pi pi-users text-2xl text-green-500 mb-2"></i>
            <span class="text-sm font-medium">用戶管理</span>
            <span class="text-xs text-gray-500">
              {{ adminStore.bannedUsers.length }} 已封鎖
            </span>
          </router-link>
          
          <router-link 
            to="/admin/reports" 
            class="admin-quick-action-card"
          >
            <i class="pi pi-flag text-2xl text-orange-500 mb-2"></i>
            <span class="text-sm font-medium">檢舉處理</span>
            <span class="text-xs text-gray-500">
              {{ adminStore.urgentReports.length }} 緊急
            </span>
          </router-link>
          
          <router-link 
            to="/admin/analytics" 
            class="admin-quick-action-card"
          >
            <i class="pi pi-chart-line text-2xl text-purple-500 mb-2"></i>
            <span class="text-sm font-medium">數據分析</span>
            <span class="text-xs text-gray-500">查看詳細報告</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="col-span-12">
      <div class="admin-content-card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          最近活動
        </h3>
        <div class="space-y-3">
          <div 
            v-for="i in 5" 
            :key="i"
            class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-white text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                用戶 user{{ i }} 提交了新的迷因
              </p>
              <p class="text-xs text-gray-500">
                {{ i }} 分鐘前
              </p>
            </div>
            <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              查看
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-quick-action-card {
  @apply flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer text-center;
}

.admin-quick-action-card:hover {
  @apply transform -translate-y-1 shadow-md;
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: '管理儀表板'
  admin: true
</route>
