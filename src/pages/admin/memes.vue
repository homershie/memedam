<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineOptions({
  name: 'AdminMemes',
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const memes = ref([])
const selectedMemes = ref([])

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
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const statuses = [
  { label: '公開', value: 'public' },
  { label: '草稿', value: 'draft' },
  { label: '隱藏', value: 'hidden' },
  { label: '封鎖', value: 'banned' },
  { label: '已刪除', value: 'deleted' },
]

const types = [
  { label: '文字', value: 'text' },
  { label: '圖片', value: 'image' },
  { label: '影片', value: 'video' },
  { label: '音訊', value: 'audio' },
]

// 載入假資料
const loadData = async () => {
  loading.value = true
  try {
    memes.value = [
      {
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
        hot_score: 95,
        tags_cache: ['搞笑', '動物'],
        nsfw: false,
        pinned: false,
        is_featured: true,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 'M-1002',
        title: '經典迷因',
        type: 'text',
        content: '經典的迷因內容',
        status: 'public',
        author: { username: 'user2', display_name: '用戶二' },
        views: 856,
        like_count: 45,
        comment_count: 8,
        hot_score: 72,
        tags_cache: ['經典', '梗圖'],
        nsfw: false,
        pinned: false,
        is_featured: false,
        createdAt: '2024-01-14T15:45:00Z',
      },
      {
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
        hot_score: 45,
        tags_cache: ['影片'],
        nsfw: false,
        pinned: false,
        is_featured: false,
        createdAt: '2024-01-12T14:10:00Z',
      },
      {
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
        hot_score: 128,
        tags_cache: ['熱門', '搞笑'],
        nsfw: false,
        pinned: true,
        is_featured: true,
        createdAt: '2024-01-11T11:00:00Z',
      },
    ]
  } finally {
    loading.value = false
  }
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

function saveMeme() {
  submitted.value = true
  const current = meme.value
  if (!current?.title?.trim()) return

  if (current.id) {
    memes.value[findIndexById(current.id)] = { ...current }
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '迷因已更新',
      life: 3000,
    })
  } else {
    current.id = createId()
    current.createdAt = new Date().toISOString()
    current.views = 0
    current.like_count = 0
    current.comment_count = 0
    current.hot_score = 0
    memes.value.push({ ...current })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '迷因已建立',
      life: 3000,
    })
  }

  memeDialog.value = false
  meme.value = {}
}

function editMeme(row) {
  meme.value = { ...row }
  memeDialog.value = true
}

function confirmDeleteMeme(row) {
  meme.value = row
  deleteMemeDialog.value = true
}

function deleteMeme() {
  memes.value = memes.value.filter((m) => m.id !== meme.value.id)
  deleteMemeDialog.value = false
  meme.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '迷因已刪除',
    life: 3000,
  })
}

function confirmDeleteSelected() {
  deleteMemesDialog.value = true
}

function deleteSelectedMemes() {
  memes.value = memes.value.filter((m) => !selectedMemes.value?.includes(m))
  selectedMemes.value = []
  deleteMemesDialog.value = false
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '已刪除選取迷因',
    life: 3000,
  })
}

function toggleStatus(row) {
  const statusMap = {
    public: 'hidden',
    hidden: 'draft',
    draft: 'public',
    banned: 'public',
    deleted: 'public',
  }
  row.status = statusMap[row.status] || 'public'
}

function togglePinned(row) {
  row.pinned = !row.pinned
}

function exportCSV() {
  dt.value?.exportCSV()
}

// 工具
function findIndexById(id) {
  return memes.value.findIndex((m) => m.id === id)
}

function createId() {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 6; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  return `M-${id}`
}

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
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="memes"
        v-model:selection="selectedMemes"
        dataKey="id"
        :loading="loading"
        paginator
        :rows="10"
        :filters="filters"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個迷因"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">迷因管理</h4>
            <div class="flex gap-2">
              <Dropdown
                v-model="filters.type.value"
                :options="types"
                optionLabel="label"
                optionValue="value"
                placeholder="按類型篩選"
              />
              <Dropdown
                v-model="filters.status.value"
                :options="statuses"
                optionLabel="label"
                optionValue="value"
                placeholder="按狀態篩選"
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
              class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
            >
              <i class="pi pi-file-text text-gray-400"></i>
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
        />
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
              icon="pi pi-power-off"
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
              :severity="data.pinned ? 'danger' : 'secondary'"
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
            :options="types"
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
            :options="statuses"
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
