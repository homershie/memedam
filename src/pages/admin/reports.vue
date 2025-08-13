<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminReports',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

onMounted(() => {
  loadReports()
})

const toast = useToast()
const dt = ref()
const reports = ref([])
const reportDialog = ref(false)
const deleteReportDialog = ref(false)
const deleteReportsDialog = ref(false)
const report = ref({})
const selectedReports = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const submitted = ref(false)
const loading = ref(false)

const statuses = ref([
  { label: '待處理', value: 'pending' },
  { label: '已處理', value: 'processed' },
  { label: '已駁回', value: 'rejected' },
])

const types = ref([
  { label: '迷因', value: 'meme' },
  { label: '評論', value: 'comment' },
  { label: '用戶', value: 'user' },
])

const reasons = ref(['不當內容', '仇恨言論', '垃圾訊息', '版權問題', '其他'])

const loadReports = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的檢舉服務
    // const response = await reportService.getAll()
    // reports.value = response.data.reports

    // 暫時模擬數據
    reports.value = [
      {
        id: 1,
        type: 'meme',
        target_id: 123,
        target_title: '有趣的迷因',
        reason: '不當內容',
        status: 'pending',
        reporter: 'user1',
        reporter_email: 'user1@example.com',
        created_at: '2024-01-15T10:30:00Z',
        processed_at: null,
        admin_comment: null,
      },
      {
        id: 2,
        type: 'comment',
        target_id: 456,
        target_title: '這很有趣',
        reason: '仇恨言論',
        status: 'processed',
        reporter: 'user2',
        reporter_email: 'user2@example.com',
        created_at: '2024-01-14T15:20:00Z',
        processed_at: '2024-01-15T09:00:00Z',
        admin_comment: '已處理，內容已移除',
      },
      {
        id: 3,
        type: 'meme',
        target_id: 789,
        target_title: '創意迷因',
        reason: '垃圾訊息',
        status: 'rejected',
        reporter: 'user3',
        reporter_email: 'user3@example.com',
        created_at: '2024-01-13T12:45:00Z',
        processed_at: '2024-01-14T14:30:00Z',
        admin_comment: '檢舉理由不充分',
      },
      {
        id: 4,
        type: 'user',
        target_id: 101,
        target_title: 'spam_user',
        reason: '垃圾訊息',
        status: 'pending',
        reporter: 'user4',
        reporter_email: 'user4@example.com',
        created_at: '2024-01-15T08:15:00Z',
        processed_at: null,
        admin_comment: null,
      },
    ]
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入檢舉數據失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

function openNew() {
  report.value = {}
  submitted.value = false
  reportDialog.value = true
}

function hideDialog() {
  reportDialog.value = false
  submitted.value = false
}

function saveReport() {
  submitted.value = true

  if (report?.value.type && report?.value.reason?.trim()) {
    if (report.value.id) {
      reports.value[findIndexById(report.value.id)] = report.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '檢舉已更新',
        life: 3000,
      })
    } else {
      report.value.id = createId()
      report.value.created_at = new Date().toISOString()
      reports.value.push(report.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '檢舉已建立',
        life: 3000,
      })
    }

    reportDialog.value = false
    report.value = {}
  }
}

function editReport(reportItem) {
  report.value = { ...reportItem }
  reportDialog.value = true
}

function confirmDeleteReport(reportItem) {
  report.value = reportItem
  deleteReportDialog.value = true
}

function deleteReport() {
  reports.value = reports.value.filter((val) => val.id !== report.value.id)
  deleteReportDialog.value = false
  report.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '檢舉已刪除',
    life: 3000,
  })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < reports.value.length; i++) {
    if (reports.value[i].id === id) {
      index = i
      break
    }
  }
  return index
}

function createId() {
  let id = ''
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

function exportCSV() {
  dt.value.exportCSV()
}

function confirmDeleteSelected() {
  deleteReportsDialog.value = true
}

function deleteSelectedReports() {
  reports.value = reports.value.filter(
    (val) => !selectedReports.value.includes(val),
  )
  deleteReportsDialog.value = false
  selectedReports.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '選取的檢舉已刪除',
    life: 3000,
  })
}

function getStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'warning'
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

function processReport(reportId, action, comment) {
  const reportIndex = findIndexById(reportId)
  if (reportIndex !== -1) {
    reports.value[reportIndex].status = action
    reports.value[reportIndex].processed_at = new Date().toISOString()
    reports.value[reportIndex].admin_comment = comment

    const actionText =
      action === 'processed' ? '處理' : action === 'rejected' ? '駁回' : '處理'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `檢舉已${actionText}`,
      life: 3000,
    })
  }
}

function batchProcessReports(action) {
  if (!selectedReports.value || selectedReports.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '警告',
      detail: '請先選擇要處理的檢舉',
      life: 3000,
    })
    return
  }

  selectedReports.value.forEach((report) => {
    processReport(
      report.id,
      action,
      `批量${action === 'processed' ? '處理' : '駁回'}`,
    )
  })

  selectedReports.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `已批量${action === 'processed' ? '處理' : '駁回'} ${selectedReports.value.length} 個檢舉`,
    life: 3000,
  })
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
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="批量處理"
            icon="pi pi-check"
            severity="success"
            class="mr-2"
            @click="batchProcessReports('processed')"
            :disabled="!selectedReports || !selectedReports.length"
          />
          <Button
            label="批量駁回"
            icon="pi pi-times"
            severity="warning"
            class="mr-2"
            @click="batchProcessReports('rejected')"
            :disabled="!selectedReports || !selectedReports.length"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedReports || !selectedReports.length"
          />
        </template>

        <template #end>
          <Button
            label="匯出"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedReports"
        :value="reports"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個檢舉"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理檢舉</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋檢舉..."
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="id"
          header="ID"
          sortable
          style="min-width: 4rem"
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
          field="reporter"
          header="檢舉者"
          sortable
          style="min-width: 10rem"
        ></Column>
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
              v-if="slotProps.data.status === 'pending'"
              icon="pi pi-check"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="processReport(slotProps.data.id, 'processed', '已處理')"
            />
            <Button
              v-if="slotProps.data.status === 'pending'"
              icon="pi pi-times"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="processReport(slotProps.data.id, 'rejected', '已駁回')"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteReport(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="reportDialog"
      :style="{ width: '500px' }"
      header="檢舉詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="type" class="block font-bold mb-3">檢舉類型</label>
          <Select
            id="type"
            v-model="report.type"
            :options="types"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇類型"
            fluid
          ></Select>
        </div>
        <div>
          <label for="target_id" class="block font-bold mb-3">目標ID</label>
          <InputNumber
            id="target_id"
            v-model="report.target_id"
            class="w-full"
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
          />
        </div>
        <div>
          <label for="reason" class="block font-bold mb-3">檢舉原因</label>
          <Dropdown
            id="reason"
            v-model="report.reason"
            :options="reasons"
            placeholder="選擇原因"
            class="w-full"
          />
        </div>
        <div>
          <label for="reporter" class="block font-bold mb-3">檢舉者</label>
          <InputText id="reporter" v-model="report.reporter" class="w-full" />
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Select
            id="status"
            v-model="report.status"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          ></Select>
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '檢舉管理'
  admin: true
</route>
