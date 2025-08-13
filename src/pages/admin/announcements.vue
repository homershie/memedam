<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminAnnouncements'
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

onMounted(() => {
  loadAnnouncements()
})

const toast = useToast()
const dt = ref()
const announcements = ref([])
const announcementDialog = ref(false)
const deleteAnnouncementDialog = ref(false)
const deleteAnnouncementsDialog = ref(false)
const announcement = ref({})
const selectedAnnouncements = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  priority: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const submitted = ref(false)
const loading = ref(false)

const statuses = ref([
  { label: '草稿', value: 'draft' },
  { label: '已發布', value: 'published' },
  { label: '已下架', value: 'archived' },
])

const priorities = ref([
  { label: '一般', value: 'normal' },
  { label: '重要', value: 'important' },
  { label: '緊急', value: 'urgent' },
])

const types = ref([
  { label: '一般公告', value: 'general' },
  { label: '系統維護', value: 'maintenance' },
  { label: '功能更新', value: 'update' },
  { label: '活動通知', value: 'event' },
])

const loadAnnouncements = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的公告服務
    // const response = await announcementService.getAll()
    // announcements.value = response.data.announcements
    
    // 暫時模擬數據
    announcements.value = [
      { 
        id: 1, 
        title: '系統維護通知', 
        content: '系統將於今晚 2:00-4:00 進行維護，期間可能無法正常使用服務。',
        type: 'maintenance',
        priority: 'important',
        status: 'published',
        is_pinned: true,
        author: 'admin',
        created_at: '2024-01-15T10:30:00Z',
        published_at: '2024-01-15T10:30:00Z',
        view_count: 1234
      },
      { 
        id: 2, 
        title: '新功能上線', 
        content: '我們新增了標籤搜尋功能，讓您更容易找到喜歡的迷因！',
        type: 'update',
        priority: 'normal',
        status: 'published',
        is_pinned: false,
        author: 'admin',
        created_at: '2024-01-14T15:20:00Z',
        published_at: '2024-01-14T16:00:00Z',
        view_count: 890
      },
      { 
        id: 3, 
        title: '春節活動', 
        content: '春節期間將舉辦特別活動，敬請期待！',
        type: 'event',
        priority: 'urgent',
        status: 'draft',
        is_pinned: false,
        author: 'admin',
        created_at: '2024-01-13T12:45:00Z',
        published_at: null,
        view_count: 0
      },
      { 
        id: 4, 
        title: '使用條款更新', 
        content: '我們更新了使用條款，請用戶詳閱。',
        type: 'general',
        priority: 'normal',
        status: 'archived',
        is_pinned: false,
        author: 'admin',
        created_at: '2024-01-10T09:15:00Z',
        published_at: '2024-01-10T09:15:00Z',
        view_count: 567
      },
    ]
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入公告數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function openNew() {
  announcement.value = {
    status: 'draft',
    priority: 'normal',
    type: 'general',
    is_pinned: false
  }
  submitted.value = false
  announcementDialog.value = true
}

function hideDialog() {
  announcementDialog.value = false
  submitted.value = false
}

function saveAnnouncement() {
  submitted.value = true

  if (announcement?.value.title?.trim() && announcement?.value.content?.trim()) {
    if (announcement.value.id) {
      announcements.value[findIndexById(announcement.value.id)] = announcement.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '公告已更新',
        life: 3000,
      })
    } else {
      announcement.value.id = createId()
      announcement.value.created_at = new Date().toISOString()
      announcement.value.author = 'admin'
      announcement.value.view_count = 0
      if (announcement.value.status === 'published') {
        announcement.value.published_at = new Date().toISOString()
      }
      announcements.value.push(announcement.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '公告已建立',
        life: 3000,
      })
    }

    announcementDialog.value = false
    announcement.value = {}
  }
}

function editAnnouncement(announcementItem) {
  announcement.value = { ...announcementItem }
  announcementDialog.value = true
}

function confirmDeleteAnnouncement(announcementItem) {
  announcement.value = announcementItem
  deleteAnnouncementDialog.value = true
}

function deleteAnnouncement() {
  announcements.value = announcements.value.filter((val) => val.id !== announcement.value.id)
  deleteAnnouncementDialog.value = false
  announcement.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '公告已刪除',
    life: 3000,
  })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < announcements.value.length; i++) {
    if (announcements.value[i].id === id) {
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
  deleteAnnouncementsDialog.value = true
}

function deleteSelectedAnnouncements() {
  announcements.value = announcements.value.filter((val) => !selectedAnnouncements.value.includes(val))
  deleteAnnouncementsDialog.value = false
  selectedAnnouncements.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '選取的公告已刪除',
    life: 3000,
  })
}

function getStatusLabel(status) {
  switch (status) {
    case 'published':
      return 'success'
    case 'draft':
      return 'warning'
    case 'archived':
      return 'secondary'
    default:
      return null
  }
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 'urgent':
      return 'danger'
    case 'important':
      return 'warning'
    case 'normal':
      return 'info'
    default:
      return null
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'maintenance':
      return 'danger'
    case 'update':
      return 'info'
    case 'event':
      return 'success'
    case 'general':
      return 'secondary'
    default:
      return null
  }
}

function publishAnnouncement(announcementId) {
  const announcementIndex = findIndexById(announcementId)
  if (announcementIndex !== -1) {
    announcements.value[announcementIndex].status = 'published'
    announcements.value[announcementIndex].published_at = new Date().toISOString()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已發布',
      life: 3000,
    })
  }
}

function unpublishAnnouncement(announcementId) {
  const announcementIndex = findIndexById(announcementId)
  if (announcementIndex !== -1) {
    announcements.value[announcementIndex].status = 'archived'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已下架',
      life: 3000,
    })
  }
}

function togglePinAnnouncement(announcementId) {
  const announcementIndex = findIndexById(announcementId)
  if (announcementIndex !== -1) {
    announcements.value[announcementIndex].is_pinned = !announcements.value[announcementIndex].is_pinned
    const action = announcements.value[announcementIndex].is_pinned ? '置頂' : '取消置頂'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `公告已${action}`,
      life: 3000,
    })
  }
}

function batchPublish() {
  if (!selectedAnnouncements.value || selectedAnnouncements.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '警告',
      detail: '請先選擇要發布的公告',
      life: 3000,
    })
    return
  }

  selectedAnnouncements.value.forEach(announcement => {
    publishAnnouncement(announcement.id)
  })
  
  selectedAnnouncements.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `已批量發布 ${selectedAnnouncements.value.length} 個公告`,
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
            label="新增公告"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="批量發布"
            icon="pi pi-check"
            severity="success"
            class="mr-2"
            @click="batchPublish"
            :disabled="!selectedAnnouncements || !selectedAnnouncements.length"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedAnnouncements || !selectedAnnouncements.length"
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
        v-model:selection="selectedAnnouncements"
        :value="announcements"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個公告"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理公告</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋公告..."
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
        <Column
          field="title"
          header="標題"
          sortable
          style="min-width: 16rem"
        >
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.data.title }}</span>
              <i v-if="slotProps.data.is_pinned" class="pi pi-thumbtack text-orange-500"></i>
            </div>
          </template>
        </Column>
        <Column
          field="type"
          header="類型"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.type === 'maintenance' ? '系統維護' : 
                      slotProps.data.type === 'update' ? '功能更新' : 
                      slotProps.data.type === 'event' ? '活動通知' : '一般公告'"
              :severity="getTypeLabel(slotProps.data.type)"
            />
          </template>
        </Column>
        <Column
          field="priority"
          header="優先級"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.priority === 'urgent' ? '緊急' : 
                      slotProps.data.priority === 'important' ? '重要' : '一般'"
              :severity="getPriorityLabel(slotProps.data.priority)"
            />
          </template>
        </Column>
        <Column
          field="status"
          header="狀態"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status === 'published' ? '已發布' : 
                      slotProps.data.status === 'draft' ? '草稿' : '已下架'"
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column
          field="view_count"
          header="瀏覽數"
          sortable
          style="min-width: 8rem"
        ></Column>
        <Column
          field="created_at"
          header="建立時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.created_at).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column
          field="published_at"
          header="發布時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.published_at ? new Date(slotProps.data.published_at).toLocaleDateString('zh-TW') : '-' }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editAnnouncement(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'draft'"
              icon="pi pi-check"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="publishAnnouncement(slotProps.data.id)"
            />
            <Button
              v-if="slotProps.data.status === 'published'"
              icon="pi pi-times"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="unpublishAnnouncement(slotProps.data.id)"
            />
            <Button
              :icon="slotProps.data.is_pinned ? 'pi pi-thumbtack' : 'pi pi-thumbtack'"
              outlined
              rounded
              :severity="slotProps.data.is_pinned ? 'warning' : 'secondary'"
              class="mr-2"
              @click="togglePinAnnouncement(slotProps.data.id)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteAnnouncement(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="announcementDialog"
      :style="{ width: '600px' }"
      header="公告詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="title" class="block font-bold mb-3">標題</label>
          <InputText
            id="title"
            v-model.trim="announcement.title"
            required="true"
            autofocus
            :invalid="submitted && !announcement.title"
            fluid
          />
          <small v-if="submitted && !announcement.title" class="text-red-500"
            >標題為必填項目。</small
          >
        </div>
        <div>
          <label for="content" class="block font-bold mb-3">內容</label>
          <Textarea
            id="content"
            v-model="announcement.content"
            rows="6"
            required="true"
            :invalid="submitted && !announcement.content"
            fluid
          />
          <small v-if="submitted && !announcement.content" class="text-red-500"
            >內容為必填項目。</small
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="type" class="block font-bold mb-3">類型</label>
            <Select
              id="type"
              v-model="announcement.type"
              :options="types"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇類型"
              fluid
            ></Select>
          </div>
          <div>
            <label for="priority" class="block font-bold mb-3">優先級</label>
            <Select
              id="priority"
              v-model="announcement.priority"
              :options="priorities"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇優先級"
              fluid
            ></Select>
          </div>
          <div>
            <label for="status" class="block font-bold mb-3">狀態</label>
            <Select
              id="status"
              v-model="announcement.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇狀態"
              fluid
            ></Select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <InputSwitch v-model="announcement.is_pinned" />
          <label class="text-sm">置頂公告</label>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveAnnouncement" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteAnnouncementDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="announcement"
          >您確定要刪除公告 <b>{{ announcement.title }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteAnnouncement" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteAnnouncementsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的公告嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedAnnouncements"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '公告管理'
  admin: true
</route>
