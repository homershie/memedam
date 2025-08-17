<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminReports',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import reportService from '@/services/reportService'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const reports = ref([])
const selectedReports = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 對話框
const reportDialog = ref(false)
const deleteReportDialog = ref(false)
const deleteReportsDialog = ref(false)
const batchProcessDialog = ref(false)

// 表單資料
const report = ref({})
const batchProcessData = ref({
  status: 'processed',
  action: 'none',
  admin_comment: '',
})
const submitted = ref(false)

// 篩選器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: '', matchMode: FilterMatchMode.EQUALS },
  type: { value: '', matchMode: FilterMatchMode.EQUALS },
})

// 篩選選單（含「全部」）
const filterStatuses = [
  { label: '全部', value: '' },
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已駁回', value: 'rejected' },
]

const filterTypes = [
  { label: '全部', value: '' },
  { label: '迷因', value: 'meme' },
  { label: '評論', value: 'comment' },
  { label: '用戶', value: 'user' },
]

// 表單選單（不含「全部」）
const formStatuses = [
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已駁回', value: 'rejected' },
]

const formTypes = [
  { label: '迷因', value: 'meme' },
  { label: '評論', value: 'comment' },
  { label: '用戶', value: 'user' },
]

// const reasons = ref(['不當內容', '仇恨言論', '垃圾訊息', '版權問題', '其他'])

// 處理方式選項
const actionOptions = ref([
  { label: '無動作', value: 'none' },
  { label: '刪除內容', value: 'remove_content' },
  { label: '軟隱藏', value: 'soft_hide' },
  { label: '年齡限制', value: 'age_gate' },
  { label: '標記為成人內容', value: 'mark_nsfw' },
  { label: '鎖定留言', value: 'lock_comments' },
  { label: '記違規點數', value: 'issue_strike' },
  { label: '警告作者', value: 'warn_author' },
])

// 載入真實數據
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: 'createdAt',
      order: 'desc',
      groupBy: 'target', // 預設群組化查詢
    }

    // 添加篩選條件
    if (filters.value.status.value && filters.value.status.value !== '') {
      params.status = filters.value.status.value
    }
    if (filters.value.type.value && filters.value.type.value !== '') {
      params.target_type = filters.value.type.value
    }
    if (
      filters.value.global.value &&
      filters.value.global.value.trim() !== ''
    ) {
      params.search = filters.value.global.value.trim()
    }

    const response = await reportService.getAll(params)
    console.log('管理員檢舉 API 回應:', response)

    // 處理後端API響應格式
    if (response.data?.data?.reports) {
      // 處理群組化的檢舉數據
      const groupedReports = response.data.data.reports
      const flattenedReports = []

      for (const group of groupedReports) {
        // 每個群組包含多個檢舉記錄
        for (const report of group.reports) {
          // 添加群組資訊到每個檢舉記錄
          const flattenedReport = {
            ...report,
            type: group._id.target_type, // 設置 type 欄位用於顯示
            target_type: group._id.target_type,
            target_id: group._id.target_id,
            total_reports: group.total_reports,
            reasons: group.reasons,
            latest_report: group.latest_report,
            statuses: group.statuses,
            // 使用群組的最新檢舉時間作為顯示時間
            created_at: group.latest_report,
            // 添加目標資訊（稍後會填充）
            target_info: {},
          }
          flattenedReports.push(flattenedReport)
        }
      }

      // 為每個檢舉添加目標資訊
      const reportsWithTargetInfo = await Promise.all(
        flattenedReports.map(async (report) => {
          let targetInfo = {}
          let reporterInfo = { username: '未知', email: '' }

          try {
            // 獲取檢舉者資訊
            try {
              const reporterResponse = await fetch(
                `/api/users/${report.reporter_id}`,
              )
              console.log(
                '檢舉者 API 回應:',
                reporterResponse.status,
                report.reporter_id,
              )
              if (reporterResponse.ok) {
                const reporterData = await reporterResponse.json()
                console.log('檢舉者數據:', reporterData)
                if (reporterData.success && reporterData.user) {
                  reporterInfo = {
                    username: reporterData.user.username || '未知用戶',
                    email: reporterData.user.email || '',
                  }
                }
              }
            } catch (error) {
              console.error('獲取檢舉者資訊失敗:', error)
            }

            // 獲取目標資訊
            switch (report.target_type) {
              case 'meme': {
                const memeResponse = await fetch(
                  `/api/memes/${report.target_id}`,
                )
                console.log(
                  '迷因 API 回應:',
                  memeResponse.status,
                  report.target_id,
                )
                if (memeResponse.ok) {
                  const memeData = await memeResponse.json()
                  console.log('迷因數據:', memeData)
                  // 檢查是否直接返回迷因數據或包在 data 欄位中
                  const meme = memeData.data || memeData
                  if (meme && meme.title) {
                    targetInfo = {
                      title: meme.title || '無標題',
                      content: meme.content || '',
                    }
                  }
                }
                break
              }
              case 'comment': {
                const commentResponse = await fetch(
                  `/api/comments/${report.target_id}`,
                )
                if (commentResponse.ok) {
                  const commentData = await commentResponse.json()
                  if (commentData.success && commentData.data) {
                    targetInfo = {
                      title:
                        commentData.data.content?.substring(0, 50) + '...' ||
                        '無內容',
                      content: commentData.data.content || '',
                    }
                  }
                }
                break
              }
              case 'user': {
                const userResponse = await fetch(
                  `/api/users/${report.target_id}`,
                )
                if (userResponse.ok) {
                  const userData = await userResponse.json()
                  if (userData.success && userData.data) {
                    targetInfo = {
                      title: `用戶: ${userData.data.username || '未知用戶'}`,
                      content: userData.data.email || '',
                    }
                  }
                }
                break
              }
            }
          } catch (error) {
            console.error('獲取目標資訊失敗:', error)
            targetInfo = {
              title: '無法獲取資訊',
              content: '',
            }
          }

          return {
            ...report,
            target_info: targetInfo,
            target_title: targetInfo.title || '無標題',
            // 格式化檢舉原因
            reason: getReasonLabel(report.reason),
            // 格式化檢舉者資訊
            reporter: reporterInfo,
          }
        }),
      )

      reports.value = reportsWithTargetInfo
      totalRecords.value = response.data.data.pagination?.total || 0
    } else if (response.data?.reports) {
      // 向後相容格式
      reports.value = response.data.reports
      totalRecords.value = response.data.pagination?.total || 0
    } else if (Array.isArray(response.data)) {
      // 如果直接返回陣列（向後相容）
      reports.value = response.data
      totalRecords.value = response.data.length
    } else {
      reports.value = []
      totalRecords.value = 0
    }

    // 清除選擇
    selectedReports.value = []
  } catch (error) {
    console.error('載入檢舉數據失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入檢舉數據失敗',
      life: 3000,
    })
    // 載入假資料作為備用
    loadFallbackData()
  } finally {
    loading.value = false
  }
}

// 備用假資料
const loadFallbackData = () => {
  reports.value = [
    {
      _id: 1,
      id: 1,
      type: 'meme',
      target_id: 123,
      target_title: '有趣的迷因',
      reason: '不當內容',
      status: 'pending',
      reporter: { username: 'user1', email: 'user1@example.com' },
      created_at: '2024-01-15T10:30:00Z',
      processed_at: null,
      admin_comment: null,
    },
    {
      _id: 2,
      id: 2,
      type: 'comment',
      target_id: 456,
      target_title: '這很有趣',
      reason: '仇恨言論',
      status: 'processed',
      reporter: { username: 'user2', email: 'user2@example.com' },
      created_at: '2024-01-14T15:20:00Z',
      processed_at: '2024-01-15T09:00:00Z',
      admin_comment: '已處理，內容已移除',
    },
    {
      _id: 3,
      id: 3,
      type: 'meme',
      target_id: 789,
      target_title: '創意迷因',
      reason: '垃圾訊息',
      status: 'rejected',
      reporter: { username: 'user3', email: 'user3@example.com' },
      created_at: '2024-01-13T12:45:00Z',
      processed_at: '2024-01-14T14:30:00Z',
      admin_comment: '檢舉理由不充分',
    },
    {
      _id: 4,
      id: 4,
      type: 'user',
      target_id: 101,
      target_title: 'spam_user',
      reason: '垃圾訊息',
      status: 'pending',
      reporter: { username: 'user4', email: 'user4@example.com' },
      created_at: '2024-01-15T08:15:00Z',
      processed_at: null,
      admin_comment: null,
    },
  ]
  totalRecords.value = reports.value.length
  selectedReports.value = []
}

onMounted(async () => {
  await loadData()
})

function openNew() {
  report.value = {
    status: 'pending',
    type: 'meme',
  }
  submitted.value = false
  reportDialog.value = true
}

function hideDialog() {
  reportDialog.value = false
  submitted.value = false
}

async function saveReport() {
  submitted.value = true
  const current = report.value

  if (!current?.type || !current?.reason?.trim()) return

  try {
    if (current._id) {
      // 更新現有檢舉 - 使用 resolve 端點
      const resolveData = {
        status: current.status || 'pending',
        action: current.action || 'none',
        admin_comment: current.admin_comment || '',
      }

      await reportService.resolve(current._id, resolveData)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '檢舉已更新',
        life: 3000,
      })
    } else {
      // 建立新檢舉
      const createData = {
        target_type: current.type || current.target_type,
        target_id: current.target_id,
        reason: current.reason,
        description: current.description,
      }

      await reportService.create(createData)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '檢舉已建立',
        life: 3000,
      })
    }

    reportDialog.value = false
    report.value = {}
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('儲存檢舉失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '儲存檢舉失敗',
      life: 3000,
    })
  }
}

function editReport(row) {
  // 確保檢舉者資訊正確處理
  const reportData = { ...row }

  // 處理檢舉者資訊，避免 [object Object]
  if (reportData.reporter && typeof reportData.reporter === 'object') {
    reportData.reporter = reportData.reporter.username || '未知'
  }

  // 處理目標資訊
  if (reportData.target_info && typeof reportData.target_info === 'object') {
    reportData.target_title =
      reportData.target_info.title || reportData.target_title || '無標題'
  }

  // 只保留可以編輯的欄位
  const editableData = {
    _id: reportData._id,
    status: reportData.status,
    action: reportData.action || 'none',
    admin_comment: reportData.admin_comment || '',
    // 只讀欄位（用於顯示）
    type: reportData.type,
    target_id: reportData.target_id,
    target_title: reportData.target_title,
    reason: reportData.reason,
    description: reportData.description,
    reporter: reportData.reporter,
  }

  report.value = editableData
  reportDialog.value = true
}

function confirmDeleteReport(row) {
  report.value = row
  deleteReportDialog.value = true
}

async function deleteReport() {
  try {
    await reportService.remove(report.value._id)
    deleteReportDialog.value = false
    report.value = {}
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '檢舉已刪除',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('刪除檢舉失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '刪除檢舉失敗',
      life: 3000,
    })
  }
}

function confirmDeleteSelected() {
  deleteReportsDialog.value = true
}

async function deleteSelectedReports() {
  try {
    const ids = selectedReports.value.map((r) => r._id)
    // 後端未提供批次刪除端點，逐一刪除
    await Promise.all(ids.map((id) => reportService.remove(id)))
    selectedReports.value = []
    deleteReportsDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已刪除選取檢舉',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('批量刪除失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '批量刪除失敗',
      life: 3000,
    })
  }
}

async function batchProcessReports() {
  if (!selectedReports.value || selectedReports.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '警告',
      detail: '請先選擇要處理的檢舉',
      life: 3000,
    })
    return
  }

  batchProcessDialog.value = true
}

async function confirmBatchProcess() {
  if (!selectedReports.value || selectedReports.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '警告',
      detail: '請先選擇要處理的檢舉',
      life: 3000,
    })
    return
  }

  try {
    const reportIds = selectedReports.value.map((report) => report._id)
    await reportService.batchResolve({
      ids: reportIds,
      status: batchProcessData.value.status,
      action: batchProcessData.value.action,
      admin_comment:
        batchProcessData.value.admin_comment ||
        `批量${batchProcessData.value.status === 'processed' ? '處理' : '駁回'}`,
    })

    selectedReports.value = []
    const actionText =
      batchProcessData.value.status === 'processed' ? '處理' : '駁回'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `已批量${actionText}檢舉`,
      life: 3000,
    })

    // 重新載入數據
    await loadData()
  } catch (error) {
    console.error('批量處理失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '批量處理失敗',
      life: 3000,
    })
  } finally {
    batchProcessDialog.value = false
    batchProcessData.value = {
      status: 'processed',
      action: 'none',
      admin_comment: '',
    }
  }
}

async function exportCSV() {
  try {
    const response = await reportService.exportReports({
      page: currentPage.value,
      limit: pageSize.value,
    })

    // 創建下載連結
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reports-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '數據已匯出',
      life: 3000,
    })
  } catch (error) {
    console.error('匯出失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '匯出失敗',
      life: 3000,
    })
  }
}

// 工具函數
function getStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'warn'
    case 'processed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return null
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'meme':
      return 'info'
    case 'comment':
      return 'secondary'
    case 'user':
      return 'warning'
    default:
      return null
  }
}

function getReasonLabel(reason) {
  const reasonMap = {
    inappropriate: '不當內容',
    hate_speech: '仇恨言論',
    spam: '垃圾訊息',
    copyright: '版權問題',
    other: '其他',
  }
  return reasonMap[reason] || reason
}

// 分頁事件處理
function onPageChange(event) {
  pageSize.value = event.rows
  currentPage.value = event.page + 1
  loadData()
}

// 篩選器變更處理
function onFilterChange() {
  currentPage.value = 1
  loadData()
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="新增檢舉"
            icon="pi pi-plus"
            severity="primary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="批量處理"
            icon="pi pi-check"
            severity="success"
            class="mr-2"
            @click="batchProcessReports()"
            :disabled="!selectedReports || !selectedReports.length"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedReports || !selectedReports.length"
          />
        </template>

        <template #end>
          <Button
            label="匯出"
            icon="pi pi-upload"
            severity="secondary"
            class="mr-2"
            @click="exportCSV"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="搜尋檢舉..."
              @input="onFilterChange"
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="reports"
        v-model:selection="selectedReports"
        dataKey="_id"
        :loading="loading"
        lazy
        paginator
        :totalRecords="totalRecords"
        :rows="pageSize"
        :first="(currentPage - 1) * pageSize"
        :filters="filters"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個檢舉"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        @page="onPageChange"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">檢舉管理</h4>
            <div class="flex gap-2">
              <Dropdown
                v-model="filters.type.value"
                :options="filterTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="按類型篩選"
                @change="onFilterChange"
              />
              <Dropdown
                v-model="filters.status.value"
                :options="filterStatuses"
                optionLabel="label"
                optionValue="value"
                placeholder="按狀態篩選"
                @change="onFilterChange"
              />
            </div>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column field="type" header="類型" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.type === 'meme'
                  ? '迷因'
                  : slotProps.data.type === 'comment'
                    ? '評論'
                    : '用戶'
              "
              :severity="getTypeLabel(slotProps.data.type)"
            />
          </template>
        </Column>
        <Column
          field="target_id"
          header="目標ID"
          sortable
          style="min-width: 8rem"
        ></Column>
        <Column
          field="target_title"
          header="目標內容"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="reason"
          header="檢舉原因"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="description"
          header="詳細描述"
          sortable
          style="min-width: 16rem"
        >
          <template #body="slotProps">
            <div class="max-w-xs">
              <span v-if="slotProps.data.description" class="text-sm">
                {{
                  slotProps.data.description.length > 50
                    ? slotProps.data.description.substring(0, 50) + '...'
                    : slotProps.data.description
                }}
              </span>
              <span v-else class="text-gray-500 text-sm">無描述</span>
            </div>
          </template>
        </Column>
        <Column
          field="reporter"
          header="檢舉者"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.reporter?.username || '未知' }}
          </template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.status === 'pending'
                  ? '待處理'
                  : slotProps.data.status === 'processed'
                    ? '已處理'
                    : '已駁回'
              "
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column
          field="created_at"
          header="檢舉時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{
              new Date(slotProps.data.created_at).toLocaleDateString('zh-TW')
            }}
          </template>
        </Column>
        <Column
          field="processed_at"
          header="處理時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{
              slotProps.data.processed_at
                ? new Date(slotProps.data.processed_at).toLocaleDateString(
                    'zh-TW',
                  )
                : '-'
            }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editReport(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="secondary"
              @click="confirmDeleteReport(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 新增/編輯對話框 -->
    <Dialog
      v-model:visible="reportDialog"
      :style="{ width: '500px' }"
      header="檢舉詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="type" class="block font-bold mb-3">檢舉類型</label>
          <Dropdown
            id="type"
            v-model="report.type"
            :options="formTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇類型"
            fluid
          ></Dropdown>
        </div>
        <div>
          <label for="target_id" class="block font-bold mb-3">目標ID</label>
          <InputText
            id="target_id"
            v-model="report.target_id"
            class="w-full"
            placeholder="目標ID (MongoDB ObjectId)"
            readonly
          />
        </div>
        <div>
          <label for="target_title" class="block font-bold mb-3"
            >目標內容</label
          >
          <InputText
            id="target_title"
            v-model="report.target_title"
            class="w-full"
            readonly
          />
        </div>
        <div>
          <label for="reason" class="block font-bold mb-3">檢舉原因</label>
          <InputText
            id="reason"
            v-model="report.reason"
            class="w-full"
            readonly
          />
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">詳細描述</label>
          <Textarea
            id="description"
            v-model="report.description"
            rows="3"
            class="w-full"
            placeholder="檢舉的詳細描述"
          />
        </div>
        <div>
          <label for="reporter" class="block font-bold mb-3">檢舉者</label>
          <InputText
            id="reporter"
            v-model="report.reporter"
            class="w-full"
            readonly
          />
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Dropdown
            id="status"
            v-model="report.status"
            :options="formStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          ></Dropdown>
        </div>
        <div>
          <label for="action" class="block font-bold mb-3">處理方式</label>
          <Dropdown
            id="action"
            v-model="report.action"
            :options="actionOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇處理方式"
            class="w-full"
          />
        </div>
        <div>
          <label for="admin_comment" class="block font-bold mb-3"
            >管理員備註</label
          >
          <Textarea
            id="admin_comment"
            v-model="report.admin_comment"
            rows="3"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveReport" />
      </template>
    </Dialog>

    <!-- 單筆刪除確認 -->
    <Dialog
      v-model:visible="deleteReportDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="report"
          >您確定要刪除檢舉 ID <b>{{ report.id }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteReportDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteReport" />
      </template>
    </Dialog>

    <!-- 多筆刪除確認 -->
    <Dialog
      v-model:visible="deleteReportsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的檢舉嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteReportsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedReports"
        />
      </template>
    </Dialog>

    <!-- 批量處理對話框 -->
    <Dialog
      v-model:visible="batchProcessDialog"
      :style="{ width: '500px' }"
      header="批量處理檢舉"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="batchStatus" class="block font-bold mb-3">處理狀態</label>
          <Dropdown
            id="batchStatus"
            v-model="batchProcessData.status"
            :options="formStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇處理狀態"
            fluid
          ></Dropdown>
        </div>
        <div>
          <label for="batchAction" class="block font-bold mb-3">處理方式</label>
          <Dropdown
            id="batchAction"
            v-model="batchProcessData.action"
            :options="actionOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇處理方式"
            class="w-full"
          />
        </div>
        <div>
          <label for="batchAdminComment" class="block font-bold mb-3"
            >管理員備註</label
          >
          <Textarea
            id="batchAdminComment"
            v-model="batchProcessData.admin_comment"
            rows="3"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          @click="batchProcessDialog = false"
        />
        <Button label="確認" icon="pi pi-check" @click="confirmBatchProcess" />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '檢舉管理'
  admin: true
</route>
