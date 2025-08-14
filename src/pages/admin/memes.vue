<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineOptions({
  name: 'AdminMemes',
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import memeService from '@/services/memeService'
import TextMemeCard from '@/components/TextMemeCard.vue'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const memes = ref([])
const selectedMemes = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 對話框
const memeDialog = ref(false)
const deleteMemeDialog = ref(false)
const deleteMemesDialog = ref(false)

// 表單資料
const meme = ref({})
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
  { label: '公開', value: 'public' },
  { label: '草稿', value: 'draft' },
  { label: '隱藏', value: 'hidden' },
  { label: '封鎖', value: 'banned' },
  { label: '已刪除', value: 'deleted' },
]

const filterTypes = [
  { label: '全部', value: '' },
  { label: '文字', value: 'text' },
  { label: '圖片', value: 'image' },
  { label: '影片', value: 'video' },
  { label: '音訊', value: 'audio' },
]

// 表單選單（不含「全部」）
const formStatuses = [
  { label: '公開', value: 'public' },
  { label: '草稿', value: 'draft' },
  { label: '隱藏', value: 'hidden' },
  { label: '封鎖', value: 'banned' },
  { label: '已刪除', value: 'deleted' },
]

const formTypes = [
  { label: '文字', value: 'text' },
  { label: '圖片', value: 'image' },
  { label: '影片', value: 'video' },
  { label: '音訊', value: 'audio' },
]

// 載入真實數據
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: 'createdAt',
      order: 'desc',
    }

    // 添加篩選條件（只有非空值且不是"全部"才添加）
    if (filters.value.status.value && filters.value.status.value !== '') {
      params.status = filters.value.status.value
    }
    if (filters.value.type.value && filters.value.type.value !== '') {
      params.type = filters.value.type.value
    }
    if (
      filters.value.global.value &&
      filters.value.global.value.trim() !== ''
    ) {
      params.search = filters.value.global.value.trim()
    }

    // 若為「全部」條件（無類型、無狀態、無搜尋），強制走傳統查詢以避免進階搜尋邏輯干擾
    const isAll =
      (!filters.value.type.value || filters.value.type.value === '') &&
      (!filters.value.status.value || filters.value.status.value === '') &&
      (!filters.value.global.value || filters.value.global.value.trim() === '')
    if (isAll) params.useAdvancedSearch = false

    const response = await memeService.getAll(params)

    // 處理後端API響應格式
    if (response.data && response.data.memes) {
      memes.value = response.data.memes
      totalRecords.value = response.data.pagination?.total || 0
    } else if (Array.isArray(response.data)) {
      // 如果直接返回陣列（向後相容）
      memes.value = response.data
      totalRecords.value = response.data.length
    } else {
      memes.value = []
      totalRecords.value = 0
    }

    // 清除選擇
    selectedMemes.value = []
  } catch (error) {
    console.error('載入迷因數據失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入迷因數據失敗',
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
  memes.value = [
    {
      _id: 'M-1001',
      id: 'M-1001',
      title: '有趣的迷因',
      type: 'image',
      content: '這是一個很有趣的迷因',
      image_url: 'https://via.placeholder.com/300x200',
      status: 'public',
      author: { username: 'user1', display_name: '用戶一' },
      views: 1240,
      like_count: 86,
      comment_count: 12,
      hot_score: 95.3,
      tags_cache: ['搞笑', '動物'],
      nsfw: false,
      pinned: false,
      is_featured: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      _id: 'M-1002',
      id: 'M-1002',
      title: '經典迷因',
      type: 'text',
      content: '經典的迷因內容',
      status: 'public',
      author: { username: 'user2', display_name: '用戶二' },
      views: 856,
      like_count: 45,
      comment_count: 8,
      hot_score: 72.8,
      tags_cache: ['經典', '梗圖'],
      nsfw: false,
      pinned: false,
      is_featured: false,
      createdAt: '2024-01-14T15:45:00Z',
    },
    {
      _id: 'M-1003',
      id: 'M-1003',
      title: '草稿迷因',
      type: 'image',
      content: '還在編輯中的迷因',
      image_url: null,
      status: 'draft',
      author: { username: 'user3', display_name: '用戶三' },
      views: 0,
      like_count: 0,
      comment_count: 0,
      hot_score: 0,
      tags_cache: [],
      nsfw: false,
      pinned: false,
      is_featured: false,
      createdAt: '2024-01-13T09:20:00Z',
    },
    {
      _id: 'M-1004',
      id: 'M-1004',
      title: '隱藏迷因',
      type: 'video',
      content: '被隱藏的迷因',
      video_url: 'https://example.com/video.mp4',
      status: 'hidden',
      author: { username: 'user4', display_name: '用戶四' },
      views: 320,
      like_count: 23,
      comment_count: 5,
      hot_score: 45.1,
      tags_cache: ['影片'],
      nsfw: false,
      pinned: false,
      is_featured: false,
      createdAt: '2024-01-12T14:10:00Z',
    },
    {
      _id: 'M-1005',
      id: 'M-1005',
      title: '熱門迷因',
      type: 'image',
      content: '非常受歡迎的迷因',
      image_url: 'https://via.placeholder.com/300x200',
      status: 'public',
      author: { username: 'user5', display_name: '用戶五' },
      views: 2156,
      like_count: 156,
      comment_count: 28,
      hot_score: 128.7,
      tags_cache: ['熱門', '搞笑'],
      nsfw: false,
      pinned: true,
      is_featured: true,
      createdAt: '2024-01-11T11:00:00Z',
    },
  ]
  totalRecords.value = memes.value.length
  // 清除選擇
  selectedMemes.value = []
}

onMounted(async () => {
  await loadData()
})

function openNew() {
  meme.value = {
    status: 'draft',
    type: 'text',
    nsfw: false,
    pinned: false,
    is_featured: false,
  }
  submitted.value = false
  memeDialog.value = true
}

function hideDialog() {
  memeDialog.value = false
  submitted.value = false
}

async function saveMeme() {
  submitted.value = true
  const current = meme.value
  if (!current?.title?.trim()) return

  try {
    if (current._id) {
      // 更新現有迷因
      await memeService.update(current._id, current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '迷因已更新',
        life: 3000,
      })
    } else {
      // 建立新迷因
      await memeService.create(current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '迷因已建立',
        life: 3000,
      })
    }

    memeDialog.value = false
    meme.value = {}
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('儲存迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '儲存迷因失敗',
      life: 3000,
    })
  }
}

function editMeme(row) {
  meme.value = { ...row }
  memeDialog.value = true
}

function confirmDeleteMeme(row) {
  meme.value = row
  deleteMemeDialog.value = true
}

async function deleteMeme() {
  try {
    await memeService.remove(meme.value._id)
    deleteMemeDialog.value = false
    meme.value = {}
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '迷因已刪除',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('刪除迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '刪除迷因失敗',
      life: 3000,
    })
  }
}

function confirmDeleteSelected() {
  deleteMemesDialog.value = true
}

async function deleteSelectedMemes() {
  try {
    const ids = selectedMemes.value.map((m) => m._id)
    // 後端未提供批次刪除端點，逐一刪除
    await Promise.all(ids.map((id) => memeService.remove(id)))
    selectedMemes.value = []
    deleteMemesDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已刪除選取迷因',
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

async function toggleStatus(row) {
  try {
    const statusMap = {
      public: 'hidden',
      hidden: 'draft',
      draft: 'public',
      banned: 'public',
      deleted: 'public',
    }
    const newStatus = statusMap[row.status] || 'public'

    // 使用標準更新端點
    await memeService.update(row._id, { status: newStatus })
    row.status = newStatus

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '狀態已更新',
      life: 3000,
    })
  } catch (error) {
    console.error('切換狀態失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '切換狀態失敗',
      life: 3000,
    })
  }
}

async function togglePinned(row) {
  try {
    const nextPinned = !row.pinned
    await memeService.update(row._id, { pinned: nextPinned })
    row.pinned = nextPinned

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: row.pinned ? '已置頂' : '已取消置頂',
      life: 3000,
    })
  } catch (error) {
    console.error('切換置頂狀態失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '切換置頂狀態失敗',
      life: 3000,
    })
  }
}

async function exportCSV() {
  try {
    const response = await memeService.exportMemes({
      page: currentPage.value,
      limit: pageSize.value,
    })

    // 創建下載連結
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `memes-${new Date().toISOString().split('T')[0]}.csv`
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
    case 'public':
      return 'success'
    case 'draft':
      return 'warn'
    case 'hidden':
      return 'secondary'
    case 'banned':
      return 'danger'
    case 'deleted':
      return 'danger'
    default:
      return null
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'text':
      return 'info'
    case 'image':
      return 'success'
    case 'video':
      return 'warning'
    case 'audio':
      return 'secondary'
    default:
      return null
  }
}

// 格式化熱度分數
function formatHotScore(score) {
  if (score === null || score === undefined) return '0.0'
  return Number(score).toFixed(1)
}

// 分頁事件處理
function onPageChange(event) {
  // PrimeVue 傳回的 event: { first, rows, page }
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
            label="新增"
            icon="pi pi-plus"
            severity="primary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="secondary"
            class="mr-2"
            :disabled="!selectedMemes?.length"
            @click="confirmDeleteSelected"
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
              placeholder="搜尋迷因..."
              @input="onFilterChange"
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="memes"
        v-model:selection="selectedMemes"
        dataKey="_id"
        :loading="loading"
        lazy
        paginator
        :totalRecords="totalRecords"
        :rows="pageSize"
        :first="(currentPage - 1) * pageSize"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個迷因"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        @page="onPageChange"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">迷因管理</h4>
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
        />
        <Column field="title" header="標題" sortable style="min-width: 16rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ data.title }}</span>
              <Tag
                v-if="data.nsfw"
                value="NSFW"
                severity="danger"
                class="text-xs"
              />
              <Tag
                v-if="data.pinned"
                value="置頂"
                severity="warning"
                class="text-xs"
              />
              <Tag
                v-if="data.is_featured"
                value="推薦"
                severity="success"
                class="text-xs"
              />
            </div>
          </template>
        </Column>
        <Column field="type" header="類型" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag
              :value="
                data.type === 'text'
                  ? '文字'
                  : data.type === 'image'
                    ? '圖片'
                    : data.type === 'video'
                      ? '影片'
                      : '音訊'
              "
              :severity="getTypeLabel(data.type)"
            />
          </template>
        </Column>
        <Column header="預覽" style="min-width: 8rem">
          <template #body="{ data }">
            <img
              v-if="data.image_url"
              :src="data.image_url"
              :alt="data.title"
              class="rounded"
              style="width: 64px; height: 64px; object-fit: cover"
            />
            <div
              v-else-if="data.type === 'text'"
              class="w-16 h-16 overflow-hidden"
            >
              <TextMemeCard
                :title="data.title || (data.content || '').slice(0, 20)"
                size="small"
                :hoverEffect="false"
                variant="pastel"
                :adminPreview="true"
              />
            </div>
            <div
              v-else-if="data.type === 'video'"
              class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
            >
              <i class="pi pi-video text-gray-400"></i>
            </div>
            <div
              v-else-if="data.type === 'audio'"
              class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
            >
              <i class="pi pi-volume-up text-gray-400"></i>
            </div>
            <div
              v-else
              class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center"
            >
              <i class="pi pi-image text-gray-400"></i>
            </div>
          </template>
        </Column>
        <Column
          field="author.username"
          header="作者"
          sortable
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            {{ data.author?.display_name || data.author?.username || '未知' }}
          </template>
        </Column>
        <Column field="views" header="瀏覽" sortable style="min-width: 6rem" />
        <Column
          field="like_count"
          header="讚數"
          sortable
          style="min-width: 6rem"
        />
        <Column
          field="hot_score"
          header="熱度"
          sortable
          style="min-width: 6rem"
        >
          <template #body="{ data }">{{
            formatHotScore(data.hot_score)
          }}</template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag
              :value="
                data.status === 'public'
                  ? '公開'
                  : data.status === 'draft'
                    ? '草稿'
                    : data.status === 'hidden'
                      ? '隱藏'
                      : data.status === 'banned'
                        ? '封鎖'
                        : '已刪除'
              "
              :severity="getStatusLabel(data.status)"
            />
          </template>
        </Column>
        <Column
          field="createdAt"
          header="建立時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="{ data }">{{
            new Date(data.createdAt).toLocaleDateString('zh-TW')
          }}</template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="editMeme(data)"
            />
            <Button
              icon="pi pi-tag"
              outlined
              rounded
              class="mr-2"
              severity="warning"
              @click="toggleStatus(data)"
            />
            <Button
              icon="pi pi-star"
              outlined
              rounded
              class="mr-2"
              :severity="data.pinned ? 'warn' : 'secondary'"
              @click="togglePinned(data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="secondary"
              @click="confirmDeleteMeme(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 新增/編輯 -->
    <Dialog
      v-model:visible="memeDialog"
      :style="{ width: '600px' }"
      header="迷因"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="title" class="block font-bold mb-3">標題</label>
          <InputText
            id="title"
            v-model.trim="meme.title"
            required
            autofocus
            :invalid="submitted && !meme.title"
            fluid
          />
          <small v-if="submitted && !meme.title" class="text-red-500"
            >標題為必填項目。</small
          >
        </div>
        <div>
          <label for="type" class="block font-bold mb-3">類型</label>
          <Dropdown
            id="type"
            v-model="meme.type"
            :options="formTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇類型"
            fluid
          />
        </div>
        <div>
          <label for="content" class="block font-bold mb-3">內容</label>
          <Textarea id="content" v-model.trim="meme.content" rows="3" fluid />
        </div>
        <div v-if="meme.type === 'image'">
          <label for="image_url" class="block font-bold mb-3">圖片連結</label>
          <InputText
            id="image_url"
            v-model.trim="meme.image_url"
            placeholder="https://example.com/image.jpg"
            fluid
          />
        </div>
        <div v-if="meme.type === 'video'">
          <label for="video_url" class="block font-bold mb-3">影片連結</label>
          <InputText
            id="video_url"
            v-model.trim="meme.video_url"
            placeholder="https://example.com/video.mp4"
            fluid
          />
        </div>
        <div v-if="meme.type === 'audio'">
          <label for="audio_url" class="block font-bold mb-3">音訊連結</label>
          <InputText
            id="audio_url"
            v-model.trim="meme.audio_url"
            placeholder="https://example.com/audio.mp3"
            fluid
          />
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Dropdown
            id="status"
            v-model="meme.status"
            :options="formStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          />
        </div>
        <div class="flex gap-4">
          <div class="flex items-center">
            <Checkbox id="nsfw" v-model="meme.nsfw" :binary="true" />
            <label for="nsfw" class="ml-2">NSFW</label>
          </div>
          <div class="flex items-center">
            <Checkbox id="pinned" v-model="meme.pinned" :binary="true" />
            <label for="pinned" class="ml-2">置頂</label>
          </div>
          <div class="flex items-center">
            <Checkbox
              id="is_featured"
              v-model="meme.is_featured"
              :binary="true"
            />
            <label for="is_featured" class="ml-2">推薦</label>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveMeme" />
      </template>
    </Dialog>

    <!-- 單筆刪除確認 -->
    <Dialog
      v-model:visible="deleteMemeDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="meme"
          >您確定要刪除迷因 <b>{{ meme.title }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteMemeDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteMeme" />
      </template>
    </Dialog>

    <!-- 多筆刪除確認 -->
    <Dialog
      v-model:visible="deleteMemesDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的迷因嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteMemesDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedMemes"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '迷因管理'
  admin: true
</route>
