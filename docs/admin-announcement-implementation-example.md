# 公告管理頁面實作範例

## 📋 概述

本文件提供公告管理頁面的完整實作範例，包含公告的 CRUD 操作、狀態管理、批量操作等功能。

## 🏗️ 頁面結構

### 檔案位置

```
src/pages/admin/announcements.vue
```

### 功能模組

- 公告列表顯示
- 公告創建/編輯表單
- 公告狀態管理
- 批量操作
- 搜尋和篩選

## 💻 完整實作範例

````vue
<template>
  <div class="card">
    <!-- 工具列 -->
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
          label="批量下架"
          icon="pi pi-times"
          severity="warning"
          class="mr-2"
          @click="batchUnpublish"
          :disabled="!selectedAnnouncements || !selectedAnnouncements.length"
        />
        <Button
          label="批量刪除"
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
          @click="exportData"
        />
      </template>
    </Toolbar>

    <!-- 公告列表 -->
    <DataTable
      ref="dt"
      v-model:selection="selectedAnnouncements"
      :value="announcements"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="顯示第 {first} 到 {last} 條，共 {totalRecords} 條公告"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">公告管理</h4>
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

      <!-- 選擇欄 -->
      <Column
        selectionMode="multiple"
        style="width: 3rem"
        :exportable="false"
      />

      <!-- 標題欄 -->
      <Column field="title" header="標題" sortable style="min-width: 16rem">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ slotProps.data.title }}</span>
            <Tag
              v-if="slotProps.data.is_pinned"
              value="置頂"
              severity="warning"
            />
          </div>
        </template>
      </Column>

      <!-- 類型欄 -->
      <Column field="type" header="類型" sortable style="min-width: 10rem">
        <template #body="slotProps">
          <Tag
            :value="getTypeLabel(slotProps.data.type)"
            :severity="getTypeSeverity(slotProps.data.type)"
          />
        </template>
      </Column>

      <!-- 狀態欄 -->
      <Column field="status" header="狀態" sortable style="min-width: 10rem">
        <template #body="slotProps">
          <Tag
            :value="getStatusLabel(slotProps.data.status)"
            :severity="getStatusSeverity(slotProps.data.status)"
          />
        </template>
      </Column>

      <!-- 優先級欄 -->
      <Column
        field="priority"
        header="優先級"
        sortable
        style="min-width: 10rem"
      >
        <template #body="slotProps">
          <Tag
            :value="getPriorityLabel(slotProps.data.priority)"
            :severity="getPrioritySeverity(slotProps.data.priority)"
          />
        </template>
      </Column>

      <!-- 發布時間欄 -->
      <Column
        field="published_at"
        header="發布時間"
        sortable
        style="min-width: 12rem"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.published_at) }}
        </template>
      </Column>

      <!-- 操作欄 -->
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <div class="flex gap-2">
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
              @click="publishAnnouncement(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'published'"
              icon="pi pi-times"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="unpublishAnnouncement(slotProps.data)"
            />
            <Button
              v-if="!slotProps.data.is_pinned"
              icon="pi pi-thumbtack"
              outlined
              rounded
              severity="info"
              class="mr-2"
              @click="pinAnnouncement(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.is_pinned"
              icon="pi pi-thumbtack"
              outlined
              rounded
              severity="secondary"
              class="mr-2"
              @click="unpinAnnouncement(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteAnnouncement(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- 公告編輯對話框 -->
    <Dialog
      v-model:visible="announcementDialog"
      :style="{ width: '600px' }"
      header="公告詳情"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <!-- 標題 -->
        <div>
          <label for="title" class="block font-bold mb-3">標題 *</label>
          <InputText
            id="title"
            v-model.trim="announcement.title"
            required="true"
            autofocus
            :invalid="submitted && !announcement.title"
            class="w-full"
          />
          <small v-if="submitted && !announcement.title" class="text-red-500">
            標題為必填項目
          </small>
        </div>

        <!-- 內容 -->
        <div>
          <label for="content" class="block font-bold mb-3">內容 *</label>
          <Textarea
            id="content"
            v-model="announcement.content"
            required="true"
            rows="6"
            class="w-full"
            :invalid="submitted && !announcement.content"
          />
          <small v-if="submitted && !announcement.content" class="text-red-500">
            內容為必填項目
          </small>
        </div>

        <!-- 類型 -->
        <div>
          <label for="type" class="block font-bold mb-3">類型</label>
          <Dropdown
            id="type"
            v-model="announcement.type"
            :options="announcementTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇公告類型"
            class="w-full"
          />
        </div>

        <!-- 優先級 -->
        <div>
          <label for="priority" class="block font-bold mb-3">優先級</label>
          <Dropdown
            id="priority"
            v-model="announcement.priority"
            :options="announcementPriorities"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇優先級"
            class="w-full"
          />
        </div>

        <!-- 狀態 -->
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Dropdown
            id="status"
            v-model="announcement.status"
            :options="announcementStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            class="w-full"
          />
        </div>

        <!-- 置頂選項 -->
        <div class="flex items-center gap-2">
          <Checkbox
            id="is_pinned"
            v-model="announcement.is_pinned"
            :binary="true"
          />
          <label for="is_pinned" class="font-bold">置頂公告</label>
        </div>

        <!-- 發布時間 -->
        <div v-if="announcement.status === 'published'">
          <label for="published_at" class="block font-bold mb-3"
            >發布時間</label
          >
          <Calendar
            id="published_at"
            v-model="announcement.published_at"
            showTime
            showIcon
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveAnnouncement" />
      </template>
    </Dialog>

    <!-- 刪除確認對話框 -->
    <Dialog
      v-model:visible="deleteAnnouncementDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="announcement">
          確定要刪除公告 <b>{{ announcement.title }}</b> 嗎？
        </span>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementDialog = false"
        />
        <Button label="確定" icon="pi pi-check" @click="deleteAnnouncement" />
      </template>
    </Dialog>

    <!-- 批量刪除確認對話框 -->
    <Dialog
      v-model:visible="deleteAnnouncementsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span
          >確定要刪除選中的 {{ selectedAnnouncements.length }} 個公告嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementsDialog = false"
        />
        <Button
          label="確定"
          icon="pi pi-check"
          @click="deleteSelectedAnnouncements"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import announcementService from '@/services/announcementService'

// 響應式數據
const toast = useToast()
const dt = ref()
const announcements = ref([])
const selectedAnnouncements = ref([])
const announcementDialog = ref(false)
const deleteAnnouncementDialog = ref(false)
const deleteAnnouncementsDialog = ref(false)
const announcement = ref({})
const submitted = ref(false)

// 篩選器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
})

// 選項配置
const announcementStatuses = ref([
  { label: '草稿', value: 'draft' },
  { label: '已發布', value: 'published' },
  { label: '已下架', value: 'archived' },
])

const announcementPriorities = ref([
  { label: '一般', value: 'normal' },
  { label: '重要', value: 'important' },
  { label: '緊急', value: 'urgent' },
])

const announcementTypes = ref([
  { label: '一般公告', value: 'general' },
  { label: '系統維護', value: 'maintenance' },
  { label: '功能更新', value: 'update' },
  { label: '活動通知', value: 'event' },
])

// 生命週期
onMounted(() => {
  loadAnnouncements()
})

// 載入公告數據
const loadAnnouncements = async () => {
  try {
    const response = await announcementService.getAll()
    announcements.value = response.data.announcements || []
  } catch (error) {
    console.error('載入公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入公告失敗',
      life: 3000,
    })
  }
}

// 開啟新增對話框
const openNew = () => {
  announcement.value = {
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    status: 'draft',
    is_pinned: false,
    published_at: null,
  }
  submitted.value = false
  announcementDialog.value = true
}

// 隱藏對話框
const hideDialog = () => {
  announcementDialog.value = false
  submitted.value = false
}

// 儲存公告
const saveAnnouncement = async () => {
  submitted.value = true

  if (announcement.value.title?.trim() && announcement.value.content?.trim()) {
    try {
      if (announcement.value.id) {
        // 更新公告
        await announcementService.update(
          announcement.value.id,
          announcement.value,
        )
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '公告更新成功',
          life: 3000,
        })
      } else {
        // 新增公告
        await announcementService.create(announcement.value)
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '公告創建成功',
          life: 3000,
        })
      }

      announcementDialog.value = false
      announcement.value = {}
      await loadAnnouncements()
    } catch (error) {
      console.error('儲存公告失敗:', error)
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '儲存公告失敗',
        life: 3000,
      })
    }
  }
}

// 編輯公告
const editAnnouncement = (announcementData) => {
  announcement.value = { ...announcementData }
  announcementDialog.value = true
}

// 確認刪除公告
const confirmDeleteAnnouncement = (announcementData) => {
  announcement.value = announcementData
  deleteAnnouncementDialog.value = true
}

// 刪除公告
const deleteAnnouncement = async () => {
  try {
    await announcementService.remove(announcement.value.id)
    deleteAnnouncementDialog.value = false
    announcement.value = {}
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告刪除成功',
      life: 3000,
    })
  } catch (error) {
    console.error('刪除公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '刪除公告失敗',
      life: 3000,
    })
  }
}

// 確認批量刪除
const confirmDeleteSelected = () => {
  deleteAnnouncementsDialog.value = true
}

// 批量刪除
const deleteSelectedAnnouncements = async () => {
  try {
    const ids = selectedAnnouncements.value.map((item) => item.id)
    await announcementService.batchDelete(ids)
    deleteAnnouncementsDialog.value = false
    selectedAnnouncements.value = null
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '批量刪除成功',
      life: 3000,
    })
  } catch (error) {
    console.error('批量刪除失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '批量刪除失敗',
      life: 3000,
    })
  }
}

// 發布公告
const publishAnnouncement = async (announcementData) => {
  try {
    await announcementService.publish(announcementData.id)
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告發布成功',
      life: 3000,
    })
  } catch (error) {
    console.error('發布公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '發布公告失敗',
      life: 3000,
    })
  }
}

// 下架公告
const unpublishAnnouncement = async (announcementData) => {
  try {
    await announcementService.unpublish(announcementData.id)
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告下架成功',
      life: 3000,
    })
  } catch (error) {
    console.error('下架公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '下架公告失敗',
      life: 3000,
    })
  }
}

// 置頂公告
const pinAnnouncement = async (announcementData) => {
  try {
    await announcementService.pin(announcementData.id)
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告置頂成功',
      life: 3000,
    })
  } catch (error) {
    console.error('置頂公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '置頂公告失敗',
      life: 3000,
    })
  }
}

// 取消置頂
const unpinAnnouncement = async (announcementData) => {
  try {
    await announcementService.unpin(announcementData.id)
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '取消置頂成功',
      life: 3000,
    })
  } catch (error) {
    console.error('取消置頂失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '取消置頂失敗',
      life: 3000,
    })
  }
}

// 批量發布
const batchPublish = async () => {
  try {
    const ids = selectedAnnouncements.value.map((item) => item.id)
    await announcementService.batchUpdate(ids, { status: 'published' })
    selectedAnnouncements.value = null
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '批量發布成功',
      life: 3000,
    })
  } catch (error) {
    console.error('批量發布失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '批量發布失敗',
      life: 3000,
    })
  }
}

// 批量下架
const batchUnpublish = async () => {
  try {
    const ids = selectedAnnouncements.value.map((item) => item.id)
    await announcementService.batchUpdate(ids, { status: 'archived' })
    selectedAnnouncements.value = null
    await loadAnnouncements()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '批量下架成功',
      life: 3000,
    })
  } catch (error) {
    console.error('批量下架失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '批量下架失敗',
      life: 3000,
    })
  }
}

// 匯出數據
const exportData = () => {
  dt.value.exportCSV()
}

// 工具函數
const getStatusLabel = (status) => {
  const statusMap = {
    draft: '草稿',
    published: '已發布',
    archived: '已下架',
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    draft: 'secondary',
    published: 'success',
    archived: 'warning',
  }
  return severityMap[status] || 'info'
}

const getTypeLabel = (type) => {
  const typeMap = {
    general: '一般公告',
    maintenance: '系統維護',
    update: '功能更新',
    event: '活動通知',
  }
  return typeMap[type] || type
}

const getTypeSeverity = (type) => {
  const severityMap = {
    general: 'info',
    maintenance: 'warning',
    update: 'success',
    event: 'primary',
  }
  return severityMap[type] || 'info'
}

const getPriorityLabel = (priority) => {
  const priorityMap = {
    normal: '一般',
    important: '重要',
    urgent: '緊急',
  }
  return priorityMap[priority] || priority
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    normal: 'info',
    important: 'warning',
    urgent: 'danger',
  }
  return severityMap[priority] || 'info'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-TW')
}
</script>

<style scoped>
.card {
  padding: 2rem;
}

.pi {
  font-size: 1rem;
}
</style>

## 🔧 整合到首頁 ### 首頁公告顯示組件 ```vue
<template>
  <div class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-32">
    <h2 class="text-center">公告欄</h2>
    <div class="text-center subtitle mb-8">
      最新消息與站務公告將在此處更新，請留意更新情況。
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>

    <!-- 公告列表 -->
    <div v-else class="grid lg:grid-cols-3 gap-4 w-full">
      <Card
        v-for="announcement in announcements"
        :key="announcement.id"
        class="w-full cursor-pointer hover:shadow-lg transition-shadow"
        @click="viewAnnouncement(announcement)"
      >
        <template #header>
          <div class="h-60 flex items-center justify-center relative">
            <img
              :src="
                announcement.image_url ||
                'https://picsum.photos/300/200/?random=10'
              "
              class="w-full h-full object-cover rounded-t-lg"
              :alt="announcement.title"
            />
            <!-- 置頂標籤 -->
            <Tag
              v-if="announcement.is_pinned"
              value="置頂"
              severity="warning"
              class="absolute top-2 right-2"
            />
          </div>
        </template>

        <template #content>
          <div class="mb-2 flex justify-between items-center">
            <h4 class="mb-1">{{ announcement.title }}</h4>
            <Tag
              :value="getTypeLabel(announcement.type)"
              :severity="getTypeSeverity(announcement.type)"
            />
          </div>
          <p class="mb-2 text-gray-600">
            {{ truncateContent(announcement.content, 100) }}
          </p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ formatDate(announcement.published_at) }}</span>
            <Tag
              :value="getPriorityLabel(announcement.priority)"
              :severity="getPrioritySeverity(announcement.priority)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- 無公告時顯示 -->
    <div
      v-if="!loading && announcements.length === 0"
      class="text-center text-gray-500"
    >
      目前沒有公告
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import announcementService from '@/services/announcementService'

const router = useRouter()
const announcements = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadAnnouncements()
})

const loadAnnouncements = async () => {
  try {
    loading.value = true
    const response = await announcementService.getPublished({ limit: 6 })
    announcements.value = response.data.announcements || []
  } catch (error) {
    console.error('載入公告失敗:', error)
  } finally {
    loading.value = false
  }
}

const viewAnnouncement = (announcement) => {
  router.push(`/announcements/${announcement.id}`)
}

const truncateContent = (content, maxLength) => {
  if (!content) return ''
  return content.length > maxLength
    ? content.substring(0, maxLength) + '...'
    : content
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-TW')
}

const getTypeLabel = (type) => {
  const typeMap = {
    general: '一般公告',
    maintenance: '系統維護',
    update: '功能更新',
    event: '活動通知',
  }
  return typeMap[type] || type
}

const getTypeSeverity = (type) => {
  const severityMap = {
    general: 'info',
    maintenance: 'warning',
    update: 'success',
    event: 'primary',
  }
  return severityMap[type] || 'info'
}

const getPriorityLabel = (priority) => {
  const priorityMap = {
    normal: '一般',
    important: '重要',
    urgent: '緊急',
  }
  return priorityMap[priority] || priority
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    normal: 'info',
    important: 'warning',
    urgent: 'danger',
  }
  return severityMap[priority] || 'info'
}
</script>
````

## 📊 數據結構

### 公告物件結構

```javascript
{
  id: string,
  title: string,           // 標題
  content: string,         // 內容
  type: string,           // 類型: general, maintenance, update, event
  priority: string,       // 優先級: normal, important, urgent
  status: string,         // 狀態: draft, published, archived
  is_pinned: boolean,     // 是否置頂
  image_url: string,      // 封面圖片
  published_at: string,   // 發布時間
  created_at: string,     // 創建時間
  updated_at: string,     // 更新時間
  created_by: string,     // 創建者ID
  view_count: number      // 瀏覽次數
}
```

## 🎯 功能特色

### 1. 完整的 CRUD 操作

- 創建新公告
- 編輯現有公告
- 刪除公告
- 批量操作

### 2. 狀態管理

- 草稿狀態
- 發布狀態
- 下架狀態
- 置頂功能

### 3. 分類和優先級

- 公告類型分類
- 優先級設定
- 標籤顯示

### 4. 搜尋和篩選

- 全域搜尋
- 狀態篩選
- 類型篩選

### 5. 響應式設計

- 桌面版和行動版適配
- 觸控友好的操作

### 6. 用戶體驗

- 載入狀態顯示
- 操作確認對話框
- 成功/錯誤提示
- 即時更新

## 🔗 相關檔案

- `src/pages/admin/announcements.vue` - 公告管理頁面
- `src/services/announcementService.js` - 公告服務
- `src/components/AnnouncementCard.vue` - 公告卡片組件
- `src/pages/announcements/[id].vue` - 公告詳情頁面

---

**注意**: 本實作範例提供了完整的公告管理功能，實際使用時請根據專案需求進行調整。
