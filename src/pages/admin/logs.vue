<template>
  <div>
    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card">
        <div class="flex items-center justify-center gap-4">
          <div>
            <div class="text-2xl font-bold text-blue-500">
              {{ statistics.total || 0 }}
            </div>
            <div class="text-surface-500">總日誌數</div>
          </div>
          <i class="pi pi-file text-3xl text-blue-500"></i>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-center gap-4">
          <div>
            <div class="text-2xl font-bold text-red-500">
              {{ statistics.levels?.error || 0 }}
            </div>
            <div class="text-surface-500">錯誤</div>
          </div>
          <i class="pi pi-exclamation-circle text-3xl text-red-500"></i>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-center gap-4">
          <div>
            <div class="text-2xl font-bold text-warn-500">
              {{ statistics.levels?.warn || 0 }}
            </div>
            <div class="text-surface-500">警告</div>
          </div>
          <i class="pi pi-exclamation-triangle text-3xl text-warn-500"></i>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-center gap-4">
          <div>
            <div class="text-2xl font-bold text-green-500">
              {{ statistics.levels?.info || 0 }}
            </div>
            <div class="text-surface-500">資訊</div>
          </div>
          <i class="pi pi-info-circle text-3xl text-green-500"></i>
        </div>
      </div>
    </div>

    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <div class="flex gap-2">
            <Button
              label="匯出 CSV"
              icon="pi pi-download"
              severity="secondary"
              @click="exportCSV"
              :loading="exporting"
            />
            <Button
              label="清理舊日誌"
              icon="pi pi-trash"
              severity="primary"
              @click="showCleanupDialog = true"
            />
            <Button
              :label="realTimeEnabled ? '停止即時' : '開始即時'"
              :icon="realTimeEnabled ? 'pi pi-pause' : 'pi pi-play'"
              :severity="realTimeEnabled ? 'primary' : 'success'"
              @click="toggleRealTime"
              :loading="realTimeEnabled && !eventSource"
            />
          </div>
        </template>
        <template #end>
          <div class="flex gap-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="searchQuery"
                placeholder="搜尋日誌..."
                @input="debouncedSearch"
              />
            </IconField>
          </div>
        </template>
      </Toolbar>

      <!-- 進階篩選區域 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Dropdown
          v-model="selectedLevel"
          :options="levels"
          optionLabel="label"
          optionValue="value"
          placeholder="依等級篩選"
          showClear
          @change="loadLogs"
        />
        <Dropdown
          v-model="selectedContext"
          :options="contextOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="依來源篩選"
          showClear
          @change="loadLogs"
        />
        <Dropdown
          v-model="selectedTimeRange"
          :options="timeRangeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="選擇時間範圍"
          showClear
          @change="onTimeRangeChange"
        />
        <div class="flex gap-2">
          <Calendar
            v-model="startDate"
            placeholder="開始時間"
            showTime
            dateFormat="yy/mm/dd"
            @date-select="loadLogs"
          />
          <Calendar
            v-model="endDate"
            placeholder="結束時間"
            showTime
            dateFormat="yy/mm/dd"
            @date-select="loadLogs"
          />
        </div>
      </div>

      <DataTable
        ref="dt"
        :value="logs"
        v-model:selection="selectedLogs"
        dataKey="id"
        :loading="loading"
        paginator
        :rows="pageSize"
        :totalRecords="totalRecords"
        :lazy="true"
        @page="onPageChange"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50, 100]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 筆，共 {totalRecords} 筆"
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h4 class="m-0">系統日誌</h4>
            <div class="flex gap-2">
              <Button
                icon="pi pi-refresh"
                @click="loadLogs"
                :loading="loading"
                severity="secondary"
                size="small"
              />
              <span
                v-if="realTimeEnabled"
                class="flex items-center gap-2 text-green-500"
              >
                <i class="pi pi-circle-fill animate-pulse"></i>
                即時更新中
              </span>
            </div>
          </div>
        </template>
        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <Column field="id" header="ID" sortable style="min-width: 8rem" />
        <Column field="level" header="等級" sortable style="min-width: 6rem">
          <template #body="{ data }">
            <Tag
              :value="getLevelLabel(data.level)"
              :severity="levelSeverity(data.level)"
            />
          </template>
        </Column>
        <Column field="message" header="訊息" style="min-width: 25rem">
          <template #body="{ data }">
            <div class="max-w-md overflow-hidden">
              <div class="truncate" :title="data.message">
                {{ data.message }}
              </div>
            </div>
          </template>
        </Column>
        <Column field="context" header="來源" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :value="data.context" severity="secondary" />
          </template>
        </Column>
        <Column
          field="createdAt"
          header="時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            {{ formatDateTime(data.createdAt) }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 清理日誌對話框 -->
    <Dialog
      v-model:visible="showCleanupDialog"
      header="清理舊日誌"
      :style="{ width: '30vw' }"
      modal
    >
      <div class="space-y-4">
        <p>請選擇要保留的天數，超過此天數的日誌將被清理：</p>
        <div class="field">
          <label for="daysToKeep">保留天數:</label>
          <InputNumber
            id="daysToKeep"
            v-model="daysToKeep"
            :min="1"
            :max="30"
            showButtons
            class="w-full mt-2"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            @click="showCleanupDialog = false"
          />
          <Button
            label="確認清理"
            severity="danger"
            @click="confirmCleanup"
            :loading="cleaning"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
defineOptions({
  name: 'AdminLogs',
})

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { debounce } from 'lodash'
import logsService from '../../services/logsService.js'

const toast = useToast()
const dt = ref()

// 資料狀態
const logs = ref([])
const statistics = ref({})
const contexts = ref([])
const loading = ref(false)
const exporting = ref(false)
const cleaning = ref(false)
const selectedLogs = ref([])

// 分頁狀態
const currentPage = ref(1)
const pageSize = ref(25)
const totalRecords = ref(0)

// 篩選狀態
const searchQuery = ref('')
const selectedLevel = ref(null)
const selectedContext = ref(null)
const selectedTimeRange = ref(null)
const startDate = ref(null)
const endDate = ref(null)

// 即時更新
const realTimeEnabled = ref(false)
const eventSource = ref(null)

// 對話框狀態
const showCleanupDialog = ref(false)
const daysToKeep = ref(7)

// 選項資料
const levels = [
  { label: '資訊', value: 'info' },
  { label: '警告', value: 'warn' },
  { label: '錯誤', value: 'error' },
]

const timeRangeOptions = computed(() => logsService.getTimeRangeOptions())

const contextOptions = computed(() =>
  contexts.value.map((context) => ({ label: context, value: context })),
)

// 防抖搜尋
const debouncedSearch = debounce(() => {
  currentPage.value = 1
  loadLogs()
}, 500)

// 載入日誌
const loadLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      level: selectedLevel.value,
      context: selectedContext.value,
      search: searchQuery.value,
      startDate: startDate.value?.toISOString(),
      endDate: endDate.value?.toISOString(),
    }

    const response = await logsService.getLogs(params)
    logs.value = response.data.logs
    totalRecords.value = response.data.pagination.total
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

// 載入統計資料
const loadStatistics = async () => {
  try {
    const response = await logsService.getStatistics()
    statistics.value = response.data
  } catch (error) {
    console.error('載入統計失敗:', error)
  }
}

// 載入來源列表
const loadContexts = async () => {
  try {
    const contextList = await logsService.getContexts()
    contexts.value = contextList || []
  } catch (error) {
    console.error('載入來源失敗:', error)
    contexts.value = []
  }
}

// 分頁變更
const onPageChange = (event) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
  loadLogs()
}

// 時間範圍變更
const onTimeRangeChange = () => {
  if (selectedTimeRange.value) {
    const range = timeRangeOptions.value.find(
      (option) => option.value === selectedTimeRange.value,
    )
    if (range) {
      startDate.value = range.startDate
      endDate.value = range.endDate
      loadLogs()
    }
  } else {
    startDate.value = null
    endDate.value = null
    loadLogs()
  }
}

// 匯出 CSV
const exportCSV = async () => {
  exporting.value = true
  try {
    const params = {
      level: selectedLevel.value,
      context: selectedContext.value,
      startDate: startDate.value?.toISOString(),
      endDate: endDate.value?.toISOString(),
    }

    const blob = await logsService.exportLogs(params)
    logsService.downloadCSV(blob)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '日誌匯出完成',
      life: 3000,
    })
  } catch (error) {
    console.error('匯出失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '匯出日誌失敗',
      life: 3000,
    })
  } finally {
    exporting.value = false
  }
}

// 切換即時更新
const toggleRealTime = async () => {
  if (realTimeEnabled.value) {
    stopRealTime()
  } else {
    await startRealTime()
  }
}

// 開始即時更新
const startRealTime = async () => {
  if (eventSource.value) return

  try {
    eventSource.value = await logsService.createLogStream({
      level: selectedLevel.value,
      onMessage: (logData) => {
        // 將新日誌插入到列表頂部
        logs.value.unshift(logData)

        // 保持列表大小
        if (logs.value.length > pageSize.value) {
          logs.value = logs.value.slice(0, pageSize.value)
        }

        // 更新統計
        loadStatistics()
      },
      onError: (error) => {
        console.error('即時日誌串流錯誤:', error)
        toast.add({
          severity: 'error',
          summary: '錯誤',
          detail: '即時日誌連線中斷',
          life: 3000,
        })
        stopRealTime()
      },
    })

    realTimeEnabled.value = true
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已開啟即時日誌更新',
      life: 3000,
    })
  } catch (error) {
    console.error('啟動即時更新失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法啟動即時更新',
      life: 3000,
    })
  }
}

// 停止即時更新
const stopRealTime = () => {
  if (eventSource.value) {
    eventSource.value.close()
    eventSource.value = null
  }
  realTimeEnabled.value = false
}

// 確認清理
const confirmCleanup = async () => {
  cleaning.value = true
  try {
    const response = await logsService.cleanupLogs(daysToKeep.value)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: response.message,
      life: 3000,
    })

    showCleanupDialog.value = false
    loadLogs()
    loadStatistics()
  } catch (error) {
    console.error('清理失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '清理日誌失敗',
      life: 3000,
    })
  } finally {
    cleaning.value = false
  }
}

// 工具函數
const levelSeverity = (level) => logsService.getLevelSeverity(level)
const getLevelLabel = (level) => logsService.formatLevel(level)
const formatDateTime = (dateString) => logsService.formatDateTime(dateString)

// 生命週期
onMounted(async () => {
  await Promise.all([loadLogs(), loadStatistics(), loadContexts()])
})

onUnmounted(() => {
  stopRealTime()
})
</script>

<route lang="yaml">
meta:
  layout: admin
  title: '系統日誌'
  admin: true
</route>
