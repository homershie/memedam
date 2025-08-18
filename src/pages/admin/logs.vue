<script setup>
defineOptions({
  name: 'AdminLogs',
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()
const dt = ref()
const logs = ref([])
const loading = ref(false)
const selectedLogs = ref([])

const levels = [
  { label: '資訊', value: 'info' },
  { label: '警告', value: 'warn' },
  { label: '錯誤', value: 'error' },
]

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  level: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const loadLogs = () => {
  loading.value = true
  try {
    logs.value = [
      {
        id: 'L-1005',
        level: 'error',
        message: 'Failed to fetch resource /api/memes',
        context: 'memeService.getAll',
        createdAt: '2024-01-15T11:02:10Z',
      },
      {
        id: 'L-1004',
        level: 'warn',
        message: 'Slow response from /api/analytics',
        context: 'analyticsService.getSummary',
        createdAt: '2024-01-15T10:59:37Z',
      },
      {
        id: 'L-1003',
        level: 'info',
        message: 'User admin logged in',
        context: 'auth',
        createdAt: '2024-01-15T10:55:00Z',
      },
    ]
  } catch (error) {
    console.error('載入日誌失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入日誌失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const exportCSV = () => dt.value?.exportCSV()

onMounted(() => {
  loadLogs()
})

const levelSeverity = (level) => {
  switch (level) {
    case 'info':
      return 'info'
    case 'warn':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="匯出"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV"
          />
        </template>
        <template #end>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="搜尋日誌..."
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="logs"
        v-model:selection="selectedLogs"
        dataKey="id"
        :loading="loading"
        paginator
        :rows="10"
        :filters="filters"
      >
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h4 class="m-0">系統日誌</h4>
            <Dropdown
              v-model="filters.level.value"
              :options="levels"
              optionLabel="label"
              optionValue="value"
              placeholder="依等級篩選"
            />
          </div>
        </template>
        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <Column field="id" header="ID" sortable style="min-width: 8rem" />
        <Column field="level" header="等級" sortable>
          <template #body="{ data }">
            <Tag :value="data.level" :severity="levelSeverity(data.level)" />
          </template>
        </Column>
        <Column field="message" header="訊息" style="min-width: 20rem" />
        <Column field="context" header="來源" style="min-width: 12rem" />
        <Column field="createdAt" header="時間" sortable>
          <template #body="{ data }">{{
            new Date(data.createdAt).toLocaleString('zh-TW')
          }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '系統日誌'
  admin: true
</route>
