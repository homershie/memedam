<template>
  <div class="admin-tools">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4"
    >
      <!-- 數據維護工具 -->
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">數據維護工具</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
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
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">用戶管理工具</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Button
              @click="sendDeletionReminders"
              :loading="loading.sendDeletionReminders"
              severity="secondary"
              class="w-full"
            >
              發送刪除提醒
            </Button>
            <Button
              @click="getUnverifiedUsersStats"
              :loading="loading.getUnverifiedUsersStats"
              severity="secondary"
              class="w-full"
            >
              獲取未驗證用戶統計
            </Button>
            <Button
              @click="deleteUnverifiedUsers"
              :loading="loading.deleteUnverifiedUsers"
              severity="primary"
              class="w-full"
            >
              刪除未驗證用戶
            </Button>
          </div>
        </template>
      </Card>
      <!-- 通知管理工具 -->
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">通知管理工具</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Button
              @click="sendHotContentNotifications"
              :loading="loading.sendHotContentNotifications"
              severity="secondary"
              class="w-full"
            >
              發送熱門內容通知
            </Button>
            <Button
              @click="sendWeeklySummaryNotifications"
              :loading="loading.sendWeeklySummaryNotifications"
              severity="secondary"
              class="w-full"
            >
              發送週報摘要通知
            </Button>
            <InputText v-model="cleanupDays" type="number" placeholder="天數" />
            <Button
              @click="cleanupOldNotifications"
              :loading="loading.cleanupOldNotifications"
              severity="primary"
            >
              清理舊通知
            </Button>
          </div>
        </template>
      </Card>
      <!-- 統計資訊 -->
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">系統統計</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Button
              @click="getCountStatistics"
              :loading="loading.getCountStatistics"
              severity="secondary"
              class="w-full"
            >
              獲取計數統計
            </Button>
            <Button
              @click="getHotScoreStatistics"
              :loading="loading.getHotScoreStatistics"
              severity="secondary"
              class="w-full"
            >
              獲取熱門分數統計
            </Button>
            <Button
              @click="getRecommendationSystemStatus"
              :loading="loading.getRecommendationSystemStatus"
              severity="secondary"
              class="w-full"
            >
              獲取推薦系統狀態
            </Button>
            <Button
              @click="getMaintenanceStatus"
              :loading="loading.getMaintenanceStatus"
              severity="secondary"
              class="w-full"
            >
              獲取維護狀態
            </Button>
            <Button
              @click="getContentBasedStatistics"
              :loading="loading.getContentBasedStatistics"
              severity="secondary"
              class="w-full"
            >
              獲取內容基礎統計
            </Button>
            <Button
              @click="getCollaborativeFilteringStatistics"
              :loading="loading.getCollaborativeFilteringStatistics"
              severity="secondary"
              class="w-full"
            >
              獲取協同過濾統計
            </Button>
          </div>
        </template>
      </Card>
      <!-- 系統監控 -->
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">系統監控</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Button
              @click="getSystemPerformanceStats"
              :loading="loading.getSystemPerformanceStats"
              severity="secondary"
              class="w-full"
            >
              獲取系統性能統計
            </Button>
            <Button
              @click="getDatabaseStats"
              :loading="loading.getDatabaseStats"
              severity="secondary"
              class="w-full"
            >
              獲取資料庫統計
            </Button>
            <Button
              @click="cleanupExpiredCache"
              :loading="loading.cleanupExpiredCache"
              severity="warn"
              class="w-full"
            >
              清理過期快取
            </Button>
            <Button
              @click="rebuildIndexes"
              :loading="loading.rebuildIndexes"
              severity="primary"
              class="w-full"
            >
              重建資料庫索引
            </Button>
          </div>
        </template>
      </Card>
      <!-- 測試工具 -->
      <Card
        class="mb-6 border border-gray-200 shadow-none dark:border-gray-700"
      >
        <template #title>
          <h3 class="text-center mb-4">測試工具</h3>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Button
              @click="createTestReports"
              :loading="loading.createTestReports"
              severity="primary"
              class="w-full"
            >
              創建測試報告
            </Button>
          </div>
        </template>
      </Card>
    </div>

    <!-- 系統配置工具 -->
    <Card class="mb-6 border border-gray-200 shadow-none dark:border-gray-700">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          系統配置工具
        </h3>
      </template>
      <template #content>
        <div class="space-y-6">
          <!-- 推薦系統配置 -->
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h4 class="font-medium mb-3">推薦系統配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1"
                  >內容基礎權重</label
                >
                <InputText
                  v-model="configData.recommendation.contentBasedWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1"
                  >協同過濾權重</label
                >
                <InputText
                  v-model="configData.recommendation.collaborativeWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1"
                  >更新間隔(小時)</label
                >
                <InputText
                  v-model="configData.recommendation.updateInterval"
                  type="number"
                  min="1"
                />
              </div>
            </div>
            <Button
              @click="updateRecommendationConfig"
              :loading="loading.updateRecommendationConfig"
              severity="primary"
            >
              更新推薦系統配置
            </Button>
          </div>

          <!-- 內容基礎配置 -->
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h4 class="font-medium mb-3">內容基礎推薦配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1">相似度閾值</label>
                <InputText
                  v-model="configData.contentBased.similarityThreshold"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">最大推薦數</label>
                <InputText
                  v-model="configData.contentBased.maxRecommendations"
                  type="number"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1"
                  >更新間隔(小時)</label
                >
                <InputText
                  v-model="configData.contentBased.updateInterval"
                  type="number"
                  min="1"
                />
              </div>
            </div>
            <Button
              @click="updateContentBasedConfig"
              :loading="loading.updateContentBasedConfig"
              severity="primary"
            >
              更新內容基礎配置
            </Button>
          </div>

          <!-- 協同過濾配置 -->
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h4 class="font-medium mb-3">協同過濾配置</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1"
                  >最小共同項目</label
                >
                <InputText
                  v-model="configData.collaborativeFiltering.minCommonItems"
                  type="number"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">最大鄰居數</label>
                <InputText
                  v-model="configData.collaborativeFiltering.maxNeighbors"
                  type="number"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1"
                  >更新間隔(小時)</label
                >
                <InputText
                  v-model="configData.collaborativeFiltering.updateInterval"
                  type="number"
                  min="1"
                />
              </div>
            </div>
            <Button
              @click="updateCollaborativeFilteringConfig"
              :loading="loading.updateCollaborativeFilteringConfig"
              severity="primary"
            >
              更新協同過濾配置
            </Button>
          </div>
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

<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminTools',
})

import { ref, reactive } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
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
  getMaintenanceStatus: false,
  createTestReports: false,
  getContentBasedStatistics: false,
  getCollaborativeFilteringStatistics: false,
  updateRecommendationConfig: false,
  updateContentBasedConfig: false,
  updateCollaborativeFilteringConfig: false,
  getSystemPerformanceStats: false,
  getDatabaseStats: false,
  cleanupExpiredCache: false,
  rebuildIndexes: false,
})

// 結果記錄
const results = ref([])

// 配置數據
const configData = reactive({
  recommendation: {
    contentBasedWeight: 0.6,
    collaborativeWeight: 0.4,
    updateInterval: 24,
  },
  contentBased: {
    similarityThreshold: 0.3,
    maxRecommendations: 10,
    updateInterval: 12,
  },
  collaborativeFiltering: {
    minCommonItems: 3,
    maxNeighbors: 20,
    updateInterval: 6,
  },
})

// 清理天數
const cleanupDays = ref(30)

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
    const response = await adminService.cleanupOldNotifications(
      cleanupDays.value,
    )
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

// 新增功能
const getMaintenanceStatus = async () => {
  loading.getMaintenanceStatus = true
  try {
    const response = await adminService.getMaintenanceStatus()
    addResult('獲取維護狀態', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '維護狀態已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取維護狀態',
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
    loading.getMaintenanceStatus = false
  }
}

const createTestReports = async () => {
  loading.createTestReports = true
  try {
    const response = await adminService.createTestReports()
    addResult('創建測試報告', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '測試報告已創建',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '創建測試報告',
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
    loading.createTestReports = false
  }
}

const getContentBasedStatistics = async () => {
  loading.getContentBasedStatistics = true
  try {
    const response = await adminService.getContentBasedStatistics()
    addResult('獲取內容基礎統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '內容基礎統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取內容基礎統計',
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
    loading.getContentBasedStatistics = false
  }
}

const getCollaborativeFilteringStatistics = async () => {
  loading.getCollaborativeFilteringStatistics = true
  try {
    const response = await adminService.getCollaborativeFilteringStatistics()
    addResult('獲取協同過濾統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '協同過濾統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取協同過濾統計',
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
    loading.getCollaborativeFilteringStatistics = false
  }
}

const updateRecommendationConfig = async () => {
  loading.updateRecommendationConfig = true
  try {
    const response = await adminService.updateRecommendationSystemConfig(
      configData.recommendation,
    )
    addResult('更新推薦系統配置', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '推薦系統配置已更新',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '更新推薦系統配置',
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
    loading.updateRecommendationConfig = false
  }
}

const updateContentBasedConfig = async () => {
  loading.updateContentBasedConfig = true
  try {
    const response = await adminService.updateContentBasedConfig(
      configData.contentBased,
    )
    addResult('更新內容基礎配置', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '內容基礎配置已更新',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '更新內容基礎配置',
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
    loading.updateContentBasedConfig = false
  }
}

const updateCollaborativeFilteringConfig = async () => {
  loading.updateCollaborativeFilteringConfig = true
  try {
    const response = await adminService.updateCollaborativeFilteringConfig(
      configData.collaborativeFiltering,
    )
    addResult('更新協同過濾配置', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '協同過濾配置已更新',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '更新協同過濾配置',
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
    loading.updateCollaborativeFilteringConfig = false
  }
}

// 系統監控功能
const getSystemPerformanceStats = async () => {
  loading.getSystemPerformanceStats = true
  try {
    const response = await adminService.getSystemPerformanceStats()
    addResult('獲取系統性能統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '系統性能統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取系統性能統計',
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
    loading.getSystemPerformanceStats = false
  }
}

const getDatabaseStats = async () => {
  loading.getDatabaseStats = true
  try {
    const response = await adminService.getDatabaseStats()
    addResult('獲取資料庫統計', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '資料庫統計已獲取',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '獲取資料庫統計',
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
    loading.getDatabaseStats = false
  }
}

const cleanupExpiredCache = async () => {
  loading.cleanupExpiredCache = true
  try {
    const response = await adminService.cleanupExpiredCache()
    addResult('清理過期快取', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '過期快取已清理',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '清理過期快取',
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
    loading.cleanupExpiredCache = false
  }
}

const rebuildIndexes = async () => {
  loading.rebuildIndexes = true
  try {
    const response = await adminService.rebuildIndexes()
    addResult('重建資料庫索引', true, '操作完成', response.data)
    toast.add({
      severity: 'success',
      summary: '操作成功',
      detail: '資料庫索引已重建',
      life: 3000,
    })
  } catch (error) {
    addResult(
      '重建資料庫索引',
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
    loading.rebuildIndexes = false
  }
}
</script>

<style scoped>
.admin-tools {
  max-width: 100%;
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: '管理工具'
  admin: true
</route>
