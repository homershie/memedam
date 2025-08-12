<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminTools',
})

import { ref, reactive } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import adminService from '@/services/adminService'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// 載入狀態
const loading = reactive({
  checkAllCounts: false,
  checkAllUserCounts: false,
  runFullCheck: false,
  batchUpdateHotScores: false,
  updateAllRecommendationSystems: false,
  batchUpdateUserPreferences: false,
  sendDeletionReminders: false,
  deleteUnverifiedUsers: false,
  getUnverifiedUsersStats: false,
  sendHotContentNotifications: false,
  sendWeeklySummaryNotifications: false,
  cleanupOldNotifications: false,
  getCountStatistics: false,
  getHotScoreStatistics: false,
  getRecommendationSystemStatus: false,
})

// 結果記錄
const results = ref([])

// 添加結果
const addResult = (action, success, message, data = null) => {
  results.value.unshift({
    action,
    success,
    message,
    data,
    timestamp: new Date().toLocaleString(),
  })
}

// 數據維護工具
const checkAllCounts = async () => {
  loading.checkAllCounts = true
  try {
    const response = await adminService.checkAllCounts()
    addResult('檢查並修正所有計數', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '所有計數檢查完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '檢查並修正所有計數',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.checkAllCounts = false
  }
}

const checkAllUserCounts = async () => {
  loading.checkAllUserCounts = true
  try {
    const response = await adminService.checkAllUserCounts()
    addResult('檢查並修正用戶計數', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '用戶計數檢查完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '檢查並修正用戶計數',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.checkAllUserCounts = false
  }
}

const runFullCheck = async () => {
  loading.runFullCheck = true
  try {
    const response = await adminService.runFullCheck()
    addResult('執行完整數據檢查', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '完整數據檢查完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '執行完整數據檢查',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.runFullCheck = false
  }
}

const batchUpdateHotScores = async () => {
  loading.batchUpdateHotScores = true
  try {
    const response = await adminService.batchUpdateHotScores()
    addResult('批次更新熱門分數', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '熱門分數更新完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '批次更新熱門分數',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.batchUpdateHotScores = false
  }
}

const updateAllRecommendationSystems = async () => {
  loading.updateAllRecommendationSystems = true
  try {
    const response = await adminService.updateAllRecommendationSystems()
    addResult('更新所有推薦系統', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '推薦系統更新完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '更新所有推薦系統',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.updateAllRecommendationSystems = false
  }
}

const batchUpdateUserPreferences = async () => {
  loading.batchUpdateUserPreferences = true
  try {
    const response = await adminService.batchUpdateUserPreferences()
    addResult('批次更新用戶偏好', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '用戶偏好更新完成',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '批次更新用戶偏好',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.batchUpdateUserPreferences = false
  }
}

// 用戶管理工具
const sendDeletionReminders = async () => {
  loading.sendDeletionReminders = true
  try {
    const response = await adminService.sendDeletionReminders()
    addResult('發送刪除提醒', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '刪除提醒已發送',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '發送刪除提醒',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.sendDeletionReminders = false
  }
}

const deleteUnverifiedUsers = async () => {
  loading.deleteUnverifiedUsers = true
  try {
    const response = await adminService.deleteUnverifiedUsers()
    addResult('刪除未驗證用戶', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '未驗證用戶已刪除',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '刪除未驗證用戶',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.deleteUnverifiedUsers = false
  }
}

const getUnverifiedUsersStats = async () => {
  loading.getUnverifiedUsersStats = true
  try {
    const response = await adminService.getUnverifiedUsersStats()
    addResult('獲取未驗證用戶統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '統計資訊已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取未驗證用戶統計',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.getUnverifiedUsersStats = false
  }
}

// 通知管理工具
const sendHotContentNotifications = async () => {
  loading.sendHotContentNotifications = true
  try {
    const response = await adminService.sendHotContentNotifications()
    addResult('發送熱門內容通知', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '熱門內容通知已發送',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '發送熱門內容通知',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.sendHotContentNotifications = false
  }
}

const sendWeeklySummaryNotifications = async () => {
  loading.sendWeeklySummaryNotifications = true
  try {
    const response = await adminService.sendWeeklySummaryNotifications()
    addResult('發送週報摘要通知', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '週報摘要通知已發送',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '發送週報摘要通知',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.sendWeeklySummaryNotifications = false
  }
}

const cleanupOldNotifications = async () => {
  loading.cleanupOldNotifications = true
  try {
    const response = await adminService.cleanupOldNotifications()
    addResult('清理舊通知', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '舊通知已清理',
      life: 3000,
    })
  } catch (error) {
    addResult('清理舊通知', false, error?.response?.data?.message || '操作失敗')
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.cleanupOldNotifications = false
  }
}

// 統計資訊
const getCountStatistics = async () => {
  loading.getCountStatistics = true
  try {
    const response = await adminService.getCountStatistics()
    addResult('獲取計數統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '計數統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取計數統計',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.getCountStatistics = false
  }
}

const getHotScoreStatistics = async () => {
  loading.getHotScoreStatistics = true
  try {
    const response = await adminService.getHotScoreStatistics()
    addResult('獲取熱門分數統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '熱門分數統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取熱門分數統計',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.getHotScoreStatistics = false
  }
}

const getRecommendationSystemStatus = async () => {
  loading.getRecommendationSystemStatus = true
  try {
    const response = await adminService.getRecommendationSystemStatus()
    addResult('獲取推薦系統狀態', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '推薦系統狀態已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取推薦系統狀態',
      false,
      error?.response?.data?.message || '操作失敗',
    )
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    loading.getRecommendationSystemStatus = false
  }
}
</script>

<template>
  <div class="admin-tools">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      管理員工具
    </h1>

    <!-- 數據維護工具 -->
    <Card class="mb-6">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          數據維護工具
        </h3>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            @click="checkAllCounts"
            :loading="loading.checkAllCounts"
            severity="secondary"
            class="w-full"
          >
            檢查並修正所有計數
          </Button>
          <Button
            @click="checkAllUserCounts"
            :loading="loading.checkAllUserCounts"
            severity="secondary"
            class="w-full"
          >
            檢查並修正用戶計數
          </Button>
          <Button
            @click="runFullCheck"
            :loading="loading.runFullCheck"
            severity="secondary"
            class="w-full"
          >
            執行完整數據檢查
          </Button>
          <Button
            @click="batchUpdateHotScores"
            :loading="loading.batchUpdateHotScores"
            severity="secondary"
            class="w-full"
          >
            批次更新熱門分數
          </Button>
          <Button
            @click="updateAllRecommendationSystems"
            :loading="loading.updateAllRecommendationSystems"
            severity="secondary"
            class="w-full"
          >
            更新所有推薦系統
          </Button>
          <Button
            @click="batchUpdateUserPreferences"
            :loading="loading.batchUpdateUserPreferences"
            severity="secondary"
            class="w-full"
          >
            批次更新用戶偏好
          </Button>
        </div>
      </template>
    </Card>

    <!-- 用戶管理工具 -->
    <Card class="mb-6">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          用戶管理工具
        </h3>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            @click="sendDeletionReminders"
            :loading="loading.sendDeletionReminders"
            severity="warning"
            class="w-full"
          >
            發送刪除提醒
          </Button>
          <Button
            @click="deleteUnverifiedUsers"
            :loading="loading.deleteUnverifiedUsers"
            severity="danger"
            class="w-full"
          >
            刪除未驗證用戶
          </Button>
          <Button
            @click="getUnverifiedUsersStats"
            :loading="loading.getUnverifiedUsersStats"
            severity="info"
            class="w-full"
          >
            獲取未驗證用戶統計
          </Button>
        </div>
      </template>
    </Card>

    <!-- 通知管理工具 -->
    <Card class="mb-6">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          通知管理工具
        </h3>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            @click="sendHotContentNotifications"
            :loading="loading.sendHotContentNotifications"
            severity="success"
            class="w-full"
          >
            發送熱門內容通知
          </Button>
          <Button
            @click="sendWeeklySummaryNotifications"
            :loading="loading.sendWeeklySummaryNotifications"
            severity="success"
            class="w-full"
          >
            發送週報摘要通知
          </Button>
          <Button
            @click="cleanupOldNotifications"
            :loading="loading.cleanupOldNotifications"
            severity="warning"
            class="w-full"
          >
            清理舊通知
          </Button>
        </div>
      </template>
    </Card>

    <!-- 統計資訊 -->
    <Card class="mb-6">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          系統統計
        </h3>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            @click="getCountStatistics"
            :loading="loading.getCountStatistics"
            severity="info"
            class="w-full"
          >
            獲取計數統計
          </Button>
          <Button
            @click="getHotScoreStatistics"
            :loading="loading.getHotScoreStatistics"
            severity="info"
            class="w-full"
          >
            獲取熱門分數統計
          </Button>
          <Button
            @click="getRecommendationSystemStatus"
            :loading="loading.getRecommendationSystemStatus"
            severity="info"
            class="w-full"
          >
            獲取推薦系統狀態
          </Button>
        </div>
      </template>
    </Card>

    <!-- 結果顯示 -->
    <Card v-if="results.length > 0">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          執行結果
        </h3>
      </template>
      <template #content>
        <div class="space-y-4">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="p-4 border rounded-lg"
            :class="{
              'border-green-200 bg-green-50 dark:bg-green-900/20':
                result.success,
              'border-red-200 bg-red-50 dark:bg-red-900/20': !result.success,
            }"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4
                  class="font-medium"
                  :class="{
                    'text-green-800 dark:text-green-200': result.success,
                    'text-red-800 dark:text-red-200': !result.success,
                  }"
                >
                  {{ result.action }}
                </h4>
                <p
                  class="text-sm mt-1"
                  :class="{
                    'text-green-700 dark:text-green-300': result.success,
                    'text-red-700 dark:text-red-300': !result.success,
                  }"
                >
                  {{ result.message }}
                </p>
              </div>
              <div class="flex items-center">
                <i
                  v-if="result.success"
                  class="pi pi-check-circle text-green-500 text-xl"
                ></i>
                <i
                  v-else
                  class="pi pi-exclamation-triangle text-red-500 text-xl"
                ></i>
              </div>
            </div>
            <div
              v-if="result.data"
              class="mt-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.admin-tools {
  max-width: 100%;
}

/* 自定義 PrimeVue Card 樣式 */
:deep(.p-card) {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

:deep(.p-card .p-card-title) {
  color: #111827;
  font-weight: 600;
}

:deep(.p-card .p-card-content) {
  padding: 1.5rem;
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: '管理工具'
  admin: true
</route>
