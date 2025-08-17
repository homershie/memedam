<script setup>
defineOptions({
  name: 'AdminReportStats',
})

import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import reportService from '@/services/reportService'

const toast = useToast()

const loading = ref(false)
const _error = ref(null)
const startDate = ref(null)
const endDate = ref(null)

const summary = ref({
  total: 0,
  pending: 0,
  processed: 0,
  rejected: 0,
})

const recentReports = ref([])

const reportTrends = ref({ labels: [], datasets: [] })
const typeDistribution = ref({ labels: [], datasets: [] })
const statusDistribution = ref({ labels: [], datasets: [] })

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true },
  },
}))

const filters = ref({
  global: { value: null },
  status: { value: null },
  type: { value: null },
})

const sortField = ref('createdAt')
const sortOrder = ref(-1)

const statuses = [
  { label: '全部', value: null },
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已拒絕', value: 'rejected' },
]

const types = [
  { label: '全部', value: null },
  { label: '不當內容', value: 'inappropriate' },
  { label: '仇恨言論', value: 'hate_speech' },
  { label: '垃圾訊息', value: 'spam' },
  { label: '版權問題', value: 'copyright' },
  { label: '其他', value: 'other' },
]

const refreshData = async () => {
  loading.value = true
  try {
    // 準備 API 參數
    const params = {}
    if (startDate.value && endDate.value) {
      params.startDate = startDate.value.toISOString().split('T')[0]
      params.endDate = endDate.value.toISOString().split('T')[0]
    }

    // 調用後端 API
    const response = await reportService.getDetailedStats(params)

    if (response.data.success) {
      const data = response.data.data

      // 更新摘要統計
      summary.value = data.summary

      // 更新近期檢舉列表
      recentReports.value = data.recentReports.map((report) => ({
        id: report._id,
        type: getReasonLabel(report.reason),
        status: getStatusLabel(report.status),
        statusValue: report.status, // 保留原始值用於 Tag 組件
        reason: report.description || getReasonLabel(report.reason),
        reporter: report.reporter_id?.username || '未知用戶',
        target: `${report.target_type}: ${report.target_info?.title || '未知內容'}`,
        createdAt: report.createdAt,
        processedAt: report.processed_at,
      }))

      // 更新趨勢圖表
      if (data.trendData && data.trendData.length > 0) {
        reportTrends.value = {
          labels: data.trendData.map((item) => {
            const date = new Date(item.date)
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
          }),
          datasets: [
            {
              label: '檢舉數',
              data: data.trendData.map((item) => item.count),
              fill: true,
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66,165,245,0.2)',
              tension: 0.4,
            },
          ],
        }
      }

      // 更新類型分佈
      if (data.typeDistribution && data.typeDistribution.length > 0) {
        typeDistribution.value = {
          labels: data.typeDistribution.map((item) => item.label),
          datasets: [
            {
              data: data.typeDistribution.map((item) => item.count),
              backgroundColor: [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#AB47BC',
                '#EF5350',
              ],
            },
          ],
        }
      }

      // 更新狀態分佈
      if (data.statusDistribution && data.statusDistribution.length > 0) {
        statusDistribution.value = {
          labels: data.statusDistribution.map((item) => item.label),
          datasets: [
            {
              data: data.statusDistribution.map((item) => item.count),
              backgroundColor: ['#FFA726', '#66BB6A', '#EF5350'],
            },
          ],
        }
      }
    } else {
      throw new Error(response.data.error || '載入統計失敗')
    }
  } catch (error) {
    console.error('載入統計失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.message || '載入統計失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 輔助函數：獲取檢舉原因標籤
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

// 輔助函數：獲取檢舉狀態標籤
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待處理',
    processed: '已處理',
    rejected: '已駁回',
  }
  return statusMap[status] || status
}

onMounted(() => {
  // 設定預設日期範圍為最近7天
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  endDate.value = end
  startDate.value = start

  refreshData()
})

// 監聽日期變更，自動重新載入資料
const _watchDateRange = () => {
  if (startDate.value && endDate.value) {
    refreshData()
  }
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'pending':
      return 'warn'
    case 'processed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const clearDateRange = () => {
  startDate.value = null
  endDate.value = null
  refreshData()
}

// 處理排序
const onSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
}

// 篩選後的檢舉列表
const filteredReports = computed(() => {
  let filtered = recentReports.value

  // 全域搜尋
  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase()
    filtered = filtered.filter((report) => {
      return (
        report.id.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm) ||
        report.status.toLowerCase().includes(searchTerm) ||
        report.reason.toLowerCase().includes(searchTerm) ||
        report.reporter.toLowerCase().includes(searchTerm) ||
        report.target.toLowerCase().includes(searchTerm)
      )
    })
  }

  // 狀態篩選
  if (filters.value.status.value) {
    filtered = filtered.filter(
      (report) => report.statusValue === filters.value.status.value,
    )
  }

  // 類型篩選
  if (filters.value.type.value) {
    filtered = filtered.filter((report) => {
      return getReasonLabel(filters.value.type.value) === report.type
    })
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]

    // 處理日期排序
    if (sortField.value === 'createdAt' || sortField.value === 'processedAt') {
      aValue = new Date(aValue || 0)
      bValue = new Date(bValue || 0)
    }

    // 處理字串排序
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortOrder.value === 1 ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 1 ? 1 : -1
    return 0
  })

  return filtered
})
</script>

<template>
  <div>
    <div class="card" v-if="!loading">
      <div class="flex flex-wrap items-end gap-4 mb-6">
        <div class="flex-1 min-w-[12rem]">
          <label class="block font-bold mb-2">開始日期</label>
          <Calendar
            v-model="startDate"
            :manualInput="false"
            showIcon
            iconDisplay="input"
            class="w-full"
            placeholder="選擇開始日期"
          />
        </div>
        <div class="flex-1 min-w-[12rem]">
          <label class="block font-bold mb-2">結束日期</label>
          <Calendar
            v-model="endDate"
            :manualInput="false"
            showIcon
            iconDisplay="input"
            class="w-full"
            placeholder="選擇結束日期"
            :minDate="startDate"
          />
        </div>
        <Button
          label="清除日期"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="clearDateRange"
        />
        <Button
          label="重新整理"
          icon="pi pi-refresh"
          severity="secondary"
          :loading="loading"
          @click="refreshData"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-2 text-purple-500">
              <i class="pi pi-list"></i>
              <span>總檢舉數</span>
            </div>
          </template>
          <template #content>
            <div class="text-2xl font-semibold">{{ summary.total }}</div>
          </template>
        </Card>
        <Card>
          <template #title>
            <div class="flex items-center gap-2 text-warn-500">
              <i class="pi pi-clock"></i>
              <span>待處理</span>
            </div>
          </template>
          <template #content>
            <div class="text-2xl font-semibold">
              {{ summary.pending }}
            </div>
          </template>
        </Card>
        <Card>
          <template #title>
            <div class="flex items-center gap-2 text-success-500">
              <i class="pi pi-check-circle"></i>
              <span>已處理</span>
            </div>
          </template>
          <template #content>
            <div class="text-2xl font-semibold">
              {{ summary.processed }}
            </div>
          </template>
        </Card>
        <Card>
          <template #title>
            <div class="flex items-center gap-2 text-primary-500">
              <i class="pi pi-times-circle"></i>
              <span>已拒絕</span>
            </div>
          </template>
          <template #content>
            <div class="text-2xl font-semibold">
              {{ summary.rejected }}
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <Card :pt="{ body: { class: 'h-[320px]' } }">
          <template #title>每日檢舉趨勢</template>
          <template #content>
            <div>
              <Chart
                type="line"
                :data="reportTrends"
                :options="chartOptions"
                class="w-full min-h-64"
              />
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <template #title>檢舉類型分佈</template>
          <template #content>
            <div>
              <Chart
                type="doughnut"
                :data="typeDistribution"
                :options="chartOptions"
                class="w-full min-h-80"
              />
            </div>
          </template>
        </Card>
        <Card>
          <template #title>狀態分佈</template>
          <template #content>
            <div>
              <Chart
                type="doughnut"
                :data="statusDistribution"
                :options="chartOptions"
                class="w-full min-h-80"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mb-6">
      <Card>
        <template #title>近期檢舉</template>
        <template #content>
          <DataTable
            :value="filteredReports"
            :loading="loading"
            dataKey="id"
            paginator
            :rows="5"
            @sort="onSort"
            :sortField="sortField"
            :sortOrder="sortOrder"
          >
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="搜尋..."
                  />
                </IconField>
                <div class="flex gap-2">
                  <Dropdown
                    v-model="filters.status.value"
                    :options="statuses"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="按狀態篩選"
                  />
                  <Dropdown
                    v-model="filters.type.value"
                    :options="types"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="按類型篩選"
                  />
                </div>
              </div>
            </template>
            <Column
              field="id"
              header="ID"
              style="min-width: 8rem"
              sortable
            ></Column>
            <Column field="type" header="類型" sortable></Column>
            <Column field="status" header="狀態" sortable>
              <template #body="{ data }">
                <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.statusValue)"
                />
              </template>
            </Column>
            <Column
              field="reason"
              header="原因"
              style="min-width: 10rem"
            ></Column>
            <Column field="reporter" header="檢舉者"></Column>
            <Column field="target" header="對象"></Column>
            <Column field="createdAt" sortable header="建立時間">
              <template #body="{ data }">{{
                new Date(data.createdAt).toLocaleString('zh-TW')
              }}</template>
            </Column>
            <Column field="processedAt" sortable header="處理時間">
              <template #body="{ data }">{{
                data.processedAt
                  ? new Date(data.processedAt).toLocaleString('zh-TW')
                  : '-'
              }}</template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">載入統計資料中...</p>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '檢舉統計'
  admin: true
</route>
