<script setup>
defineOptions({
  name: 'AdminReportStats',
})

import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const loading = ref(false)
const dateRange = ref(null)

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

const statuses = [
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已拒絕', value: 'rejected' },
]

const types = [
  { label: '垃圾訊息', value: 'spam' },
  { label: '不當內容', value: 'abuse' },
  { label: '侵犯版權', value: 'copyright' },
  { label: '其他', value: 'other' },
]

const refreshData = () => {
  loading.value = true
  try {
    // 模擬摘要
    summary.value = {
      total: 342,
      pending: 28,
      processed: 280,
      rejected: 34,
    }

    // 模擬近期報告列表
    recentReports.value = [
      {
        id: 'R-1001',
        type: 'spam',
        status: 'pending',
        reason: '重複張貼與廣告內容',
        reporter: 'user1@example.com',
        target: 'meme #1234',
        createdAt: '2024-01-15T10:30:00Z',
        processedAt: null,
      },
      {
        id: 'R-1000',
        type: 'abuse',
        status: 'processed',
        reason: '侮辱性言論',
        reporter: 'user2@example.com',
        target: 'comment #4321',
        createdAt: '2024-01-14T09:20:00Z',
        processedAt: '2024-01-14T12:00:00Z',
      },
      {
        id: 'R-0999',
        type: 'copyright',
        status: 'rejected',
        reason: '疑似盜用圖片',
        reporter: 'user3@example.com',
        target: 'meme #5678',
        createdAt: '2024-01-13T16:05:00Z',
        processedAt: '2024-01-13T18:40:00Z',
      },
    ]

    // 模擬折線圖（每日檢舉數）
    reportTrends.value = {
      labels: ['01/09', '01/10', '01/11', '01/12', '01/13', '01/14', '01/15'],
      datasets: [
        {
          label: '檢舉數',
          data: [22, 31, 18, 27, 35, 29, 38],
          fill: true,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.2)',
          tension: 0.4,
        },
      ],
    }

    // 模擬類型分佈
    typeDistribution.value = {
      labels: ['垃圾訊息', '不當內容', '侵犯版權', '其他'],
      datasets: [
        {
          data: [120, 98, 56, 68],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
        },
      ],
    }

    // 模擬狀態分佈
    statusDistribution.value = {
      labels: ['待處理', '已處理', '已拒絕'],
      datasets: [
        {
          data: [28, 280, 34],
          backgroundColor: ['#FFA726', '#66BB6A', '#EF5350'],
        },
      ],
    }
  } catch (error) {
    console.error('載入統計失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入統計失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshData()
})

const getStatusSeverity = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'processed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="flex flex-wrap items-end gap-4 mb-6">
        <div class="flex-1 min-w-[16rem]">
          <label class="block font-bold mb-2">日期範圍</label>
          <Calendar
            v-model="dateRange"
            selectionMode="range"
            :manualInput="false"
            showIcon
            iconDisplay="input"
            class="w-full"
          />
        </div>
        <Button
          label="重新整理"
          icon="pi pi-refresh"
          severity="secondary"
          @click="refreshData"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <template #title>總檢舉數</template>
          <template #content>
            <div class="text-2xl font-semibold">{{ summary.total }}</div>
          </template>
        </Card>
        <Card>
          <template #title>待處理</template>
          <template #content>
            <div class="text-2xl font-semibold text-orange-500">
              {{ summary.pending }}
            </div>
          </template>
        </Card>
        <Card>
          <template #title>已處理</template>
          <template #content>
            <div class="text-2xl font-semibold text-green-600">
              {{ summary.processed }}
            </div>
          </template>
        </Card>
        <Card>
          <template #title>已拒絕</template>
          <template #content>
            <div class="text-2xl font-semibold text-red-500">
              {{ summary.rejected }}
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card class="lg:col-span-2" :pt="{ body: { class: 'h-[320px]' } }">
          <template #title>每日檢舉趨勢</template>
          <template #content>
            <div class="h-[280px]">
              <Chart type="line" :data="reportTrends" :options="chartOptions" />
            </div>
          </template>
        </Card>
        <Card :pt="{ body: { class: 'h-[320px]' } }">
          <template #title>檢舉類型分佈</template>
          <template #content>
            <div class="h-[280px]">
              <Chart
                type="doughnut"
                :data="typeDistribution"
                :options="chartOptions"
              />
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card :pt="{ body: { class: 'h-[320px]' } }">
          <template #title>狀態分佈</template>
          <template #content>
            <div class="h-[280px]">
              <Chart
                type="doughnut"
                :data="statusDistribution"
                :options="chartOptions"
              />
            </div>
          </template>
        </Card>
        <Card class="lg:col-span-2">
          <template #title>近期檢舉</template>
          <template #content>
            <DataTable
              :value="recentReports"
              :loading="loading"
              dataKey="id"
              paginator
              :rows="5"
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
                    :severity="getStatusSeverity(data.status)"
                  />
                </template>
              </Column>
              <Column
                field="reason"
                header="原因"
                style="min-width: 16rem"
              ></Column>
              <Column field="reporter" header="檢舉者"></Column>
              <Column field="target" header="對象"></Column>
              <Column field="createdAt" header="建立時間">
                <template #body="{ data }">{{
                  new Date(data.createdAt).toLocaleString('zh-TW')
                }}</template>
              </Column>
              <Column field="processedAt" header="處理時間">
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
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '檢舉統計'
  admin: true
</route>
