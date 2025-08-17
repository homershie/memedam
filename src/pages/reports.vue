<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">檢舉紀錄</h1>
      <p class="text-gray-600 dark:text-gray-400">查看您的檢舉歷史和處理狀態</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card class="text-center">
        <template #content>
          <div v-if="loading" class="flex justify-center">
            <ProgressSpinner size="small" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.total }}
            </div>
            <div class="text-sm text-gray-600">總檢舉數</div>
          </div>
        </template>
      </Card>
      <Card class="text-center">
        <template #content>
          <div v-if="loading" class="flex justify-center">
            <ProgressSpinner size="small" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold text-orange-600">
              {{ stats.pending }}
            </div>
            <div class="text-sm text-gray-600">待處理</div>
          </div>
        </template>
      </Card>
      <Card class="text-center">
        <template #content>
          <div v-if="loading" class="flex justify-center">
            <ProgressSpinner size="small" />
          </div>
          <div v-else>
            <div class="text-2xl font-bold text-green-600">
              {{ stats.processed }}
            </div>
            <div class="text-sm text-gray-600">已處理</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 篩選器 -->
    <Card>
      <template #content>
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">狀態：</label>
            <Dropdown
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="全部狀態"
              class="w-32"
              @change="loadReports"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">排序：</label>
            <Dropdown
              v-model="filters.sort"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="排序方式"
              class="w-40"
              @change="loadReports"
            />
          </div>
          <Button
            label="重新整理"
            icon="pi pi-refresh"
            text
            @click="loadReports"
          />
        </div>
      </template>
    </Card>

    <!-- 檢舉列表 -->
    <Card>
      <template #content>
        <!-- 載入中狀態 -->
        <div v-if="loading" class="flex justify-center py-8">
          <ProgressSpinner />
        </div>

        <!-- 檢舉列表 -->
        <div v-else-if="reports.length > 0" class="space-y-4">
          <div
            v-for="report in reports"
            :key="report._id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3">
                <Tag
                  :value="getReasonLabel(report.reason)"
                  :severity="getReasonSeverity(report.reason)"
                />
                <Tag
                  :value="getStatusLabel(report.status)"
                  :severity="getStatusSeverity(report.status)"
                />
              </div>
              <span class="text-sm text-gray-500">
                {{ formatDate(report.createdAt) }}
              </span>
            </div>

            <!-- 檢舉目標資訊 -->
            <div class="mb-3">
              <h4 class="font-medium mb-1">檢舉目標</h4>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>類型：</strong
                  >{{ getTargetTypeLabel(report.target_type) }}
                </p>
                <p v-if="report.target_info?.title">
                  <strong>標題：</strong>{{ report.target_info.title }}
                </p>
                <p v-if="report.target_info?.author">
                  <strong>作者：</strong>{{ report.target_info.author }}
                </p>
              </div>
            </div>

            <!-- 檢舉描述 -->
            <div v-if="report.description" class="mb-3">
              <h4 class="font-medium mb-1">檢舉描述</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ report.description }}
              </p>
            </div>

            <!-- 處理結果 -->
            <div v-if="report.status !== 'pending'" class="mb-3">
              <h4 class="font-medium mb-1">處理結果</h4>
              <div class="text-sm">
                <p v-if="report.action">
                  <strong>處理方式：</strong>{{ getActionLabel(report.action) }}
                </p>
                <p v-if="report.admin_comment">
                  <strong>管理員備註：</strong>{{ report.admin_comment }}
                </p>
                <p v-if="report.processed_at">
                  <strong>處理時間：</strong
                  >{{ formatDate(report.processed_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 無檢舉記錄 -->
        <div v-else class="text-center py-8 text-gray-500">
          <i class="pi pi-flag text-4xl mb-4"></i>
          <p>目前沒有檢舉記錄</p>
        </div>
      </template>
    </Card>

    <!-- 分頁 -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center">
      <Paginator
        v-model:first="pagination.first"
        :rows="pagination.limit"
        :totalRecords="pagination.total"
        @page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import reportService from '@/services/reportService'

// 定義組件名稱
defineOptions({
  name: 'ReportsPage',
})

// 響應式數據
const toast = useToast()
const userStore = useUserStore()
const loading = ref(false)
const reports = ref([])
const stats = ref({
  total: 0,
  pending: 0,
  processed: 0,
})

const filters = ref({
  status: null,
  sort: 'createdAt',
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  first: 0,
})

// 選項配置
const statusOptions = ref([
  { label: '全部狀態', value: null },
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已駁回', value: 'rejected' },
])

const sortOptions = ref([
  { label: '最新檢舉', value: 'createdAt' },
  { label: '最舊檢舉', value: 'createdAt_asc' },
  { label: '狀態排序', value: 'status' },
])

// 生命週期
onMounted(() => {
  // 使用 nextTick 確保 DOM 已更新
  nextTick(() => {
    if (!userStore.isLoggedIn) {
      toast.add({
        severity: 'warn',
        summary: '提示',
        detail: '請先登入以查看檢舉紀錄',
        life: 3000,
      })
      return
    }

    loadReports()
  })
})

// 載入檢舉數據
const loadReports = async () => {
  if (!userStore.isLoggedIn) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請先登入',
      life: 3000,
    })
    return
  }

  loading.value = true
  try {
    console.log('開始載入檢舉數據...')
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: filters.value.sort,
      order: filters.value.sort === 'createdAt_asc' ? 'asc' : 'desc',
    }

    if (filters.value.status) {
      params.status = filters.value.status
    }

    console.log('檢舉查詢參數:', params)
    const response = await reportService.getMyReports(params)
    console.log('檢舉數據 API 回應:', response)

    if (response.data?.data) {
      console.log('檢舉列表:', response.data.data.reports)
      console.log('分頁資訊:', response.data.data.pagination)

      reports.value = response.data.data.reports || []
      pagination.value = {
        page: response.data.data.pagination?.page || 1,
        limit: response.data.data.pagination?.limit || 10,
        total: response.data.data.pagination?.total || 0,
        totalPages: response.data.data.pagination?.pages || 0,
        first:
          (response.data.data.pagination?.page - 1) *
          (response.data.data.pagination?.limit || 10),
      }

      console.log('更新後的檢舉列表:', reports.value)
      console.log('更新後的分頁資訊:', pagination.value)

      // 載入統計數據
      await loadStats()
    }
  } catch (error) {
    console.error('載入檢舉數據失敗:', error)

    // 檢查是否是認證錯誤
    if (error.response?.status === 401) {
      toast.add({
        severity: 'error',
        summary: '認證錯誤',
        detail: '登入已過期，請重新登入',
        life: 3000,
      })
      // 可以重定向到登入頁面
      // router.push('/login')
    } else {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '載入檢舉數據失敗',
        life: 3000,
      })
    }
  } finally {
    loading.value = false
  }
}

// 載入統計數據
const loadStats = async () => {
  try {
    console.log('開始載入統計數據...')
    const response = await reportService.getUserStats()
    console.log('統計數據 API 回應:', response)
    console.log('response.data:', response.data)
    console.log('response.data.data:', response.data?.data)

    if (response.data?.data) {
      const newStats = {
        total: response.data.data.total || 0,
        pending: response.data.data.pending || 0,
        processed: response.data.data.processed || 0,
      }
      console.log('更新統計數據:', newStats)
      stats.value = newStats
    } else {
      console.log('API 回應結構不符合預期:', response.data)
    }
  } catch (error) {
    console.error('載入統計數據失敗:', error)
    // 如果統計 API 失敗，使用當前頁面資料計算
    calculateStatsFromCurrentPage()
  }
}

// 從當前頁面資料計算統計數據（備用方案）
const calculateStatsFromCurrentPage = () => {
  const total = reports.value.length
  const pending = reports.value.filter((r) => r.status === 'pending').length
  const processed = reports.value.filter((r) => r.status === 'processed').length

  stats.value = { total, pending, processed }
}

// 分頁變更
const onPageChange = (event) => {
  pagination.value.page = Math.floor(event.first / pagination.value.limit) + 1
  pagination.value.first = event.first
  loadReports()
}

// 工具函數
const getReasonLabel = (reason) => {
  const reasonMap = {
    inappropriate: '不當內容',
    hate_speech: '仇恨言論',
    spam: '垃圾訊息',
    copyright: '版權問題',
    other: '其他',
  }
  return reasonMap[reason] || reason
}

const getReasonSeverity = (reason) => {
  const severityMap = {
    inappropriate: 'warning',
    hate_speech: 'danger',
    spam: 'info',
    copyright: 'warning',
    other: 'secondary',
  }
  return severityMap[reason] || 'info'
}

const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待處理',
    processed: '已處理',
    rejected: '已駁回',
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    pending: 'warning',
    processed: 'success',
    rejected: 'danger',
  }
  return severityMap[status] || 'info'
}

const getTargetTypeLabel = (type) => {
  const typeMap = {
    meme: '迷因',
    comment: '留言',
    user: '用戶',
  }
  return typeMap[type] || type
}

const getActionLabel = (action) => {
  const actionMap = {
    none: '無動作',
    remove_content: '刪除內容',
    soft_hide: '軟隱藏',
    age_gate: '年齡限制',
    mark_nsfw: '標記為成人內容',
    lock_comments: '鎖定留言',
    issue_strike: '記違規點數',
    warn_author: '警告作者',
  }
  return actionMap[action] || action
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-TW')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>

<route lang="yaml">
meta:
  title: '檢舉紀錄'
  login: ''
  admin: false
</route>
