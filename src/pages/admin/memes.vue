<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminMemes',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

onMounted(() => {
  // 使用模擬資料，避免 API 錯誤
  memes.value = [
    {
      id: '1',
      title: '有趣的迷因',
      description: '這是一個很有趣的迷因',
      imageUrl: 'https://via.placeholder.com/300x200',
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      author: { username: 'user1' },
    },
    {
      id: '2',
      title: '經典迷因',
      description: '經典的迷因內容',
      imageUrl: 'https://via.placeholder.com/300x200',
      status: 'published',
      createdAt: '2024-01-14T15:45:00Z',
      author: { username: 'user2' },
    },
    {
      id: '3',
      title: '草稿迷因',
      description: '還在編輯中的迷因',
      imageUrl: null,
      status: 'draft',
      createdAt: '2024-01-13T09:20:00Z',
      author: { username: 'user3' },
    },
    {
      id: '4',
      title: '隱藏迷因',
      description: '被隱藏的迷因',
      imageUrl: 'https://via.placeholder.com/300x200',
      status: 'hidden',
      createdAt: '2024-01-12T14:10:00Z',
      author: { username: 'user4' },
    },
    {
      id: '5',
      title: '熱門迷因',
      description: '非常受歡迎的迷因',
      imageUrl: 'https://via.placeholder.com/300x200',
      status: 'published',
      createdAt: '2024-01-11T11:00:00Z',
      author: { username: 'user5' },
    },
  ]

  // 當後端 API 準備好時，可以使用以下程式碼：
  // memeService.getAll().then((response) => {
  //   // 確保 response.data 是陣列，如果不是則提取 memes 陣列
  //   if (Array.isArray(response.data)) {
  //     memes.value = response.data
  //   } else if (response.data && Array.isArray(response.data.memes)) {
  //     memes.value = response.data.memes
  //   } else {
  //     memes.value = []
  //   }
  // }).catch((error) => {
  //   console.error('載入 memes 失敗:', error)
  //   memes.value = []
  // })
})

const toast = useToast()
const dt = ref()
const memes = ref([])
const memeDialog = ref(false)
const deleteMemeDialog = ref(false)
const deleteMemesDialog = ref(false)
const meme = ref({})
const selectedMemes = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false)
const statuses = ref([
  { label: '已發布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已隱藏', value: 'hidden' },
])

function openNew() {
  meme.value = {}
  submitted.value = false
  memeDialog.value = true
}

function hideDialog() {
  memeDialog.value = false
  submitted.value = false
}

function saveMeme() {
  submitted.value = true

  if (meme?.value.title?.trim()) {
    if (meme.value.id) {
      meme.value.status = meme.value.status.value
        ? meme.value.status.value
        : meme.value.status
      memes.value[findIndexById(meme.value.id)] = meme.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: 'Meme 已更新',
        life: 3000,
      })
    } else {
      meme.value.id = createId()
      meme.value.status = meme.value.status
        ? meme.value.status.value
        : 'published'
      memes.value.push(meme.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: 'Meme 已建立',
        life: 3000,
      })
    }

    memeDialog.value = false
    meme.value = {}
  }
}

function editMeme(memeItem) {
  meme.value = { ...memeItem }
  memeDialog.value = true
}

function confirmDeleteMeme(memeItem) {
  meme.value = memeItem
  deleteMemeDialog.value = true
}

function deleteMeme() {
  memes.value = memes.value.filter((val) => val.id !== meme.value.id)
  deleteMemeDialog.value = false
  meme.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: 'Meme 已刪除',
    life: 3000,
  })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < memes.value.length; i++) {
    if (memes.value[i].id === id) {
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
  deleteMemesDialog.value = true
}

function deleteSelectedMemes() {
  memes.value = memes.value.filter((val) => !selectedMemes.value.includes(val))
  deleteMemesDialog.value = false
  selectedMemes.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: 'Memes 已刪除',
    life: 3000,
  })
}

function getStatusLabel(status) {
  switch (status) {
    case 'published':
      return 'success'

    case 'draft':
      return 'warn'

    case 'hidden':
      return 'danger'

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
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedMemes || !selectedMemes.length"
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
        v-model:selection="selectedMemes"
        :value="memes"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個 memes"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理 Memes</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋..."
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
          style="min-width: 8rem"
        ></Column>
        <Column
          field="title"
          header="標題"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column header="圖片">
          <template #body="slotProps">
            <img
              v-if="slotProps.data.imageUrl"
              :src="slotProps.data.imageUrl"
              :alt="slotProps.data.title"
              class="rounded"
              style="width: 64px; height: 64px; object-fit: cover"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center"
            >
              <i class="pi pi-image text-gray-400"></i>
            </div>
          </template>
        </Column>
        <Column
          field="createdAt"
          header="建立時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column field="author" header="作者" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ slotProps.data.author?.username || '未知' }}
          </template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.status"
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editMeme(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteMeme(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="memeDialog"
      :style="{ width: '450px' }"
      header="Meme 詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <img
          v-if="meme.imageUrl"
          :src="meme.imageUrl"
          :alt="meme.title"
          class="block m-auto pb-4 max-w-full h-auto"
          style="max-height: 200px"
        />
        <div>
          <label for="title" class="block font-bold mb-3">標題</label>
          <InputText
            id="title"
            v-model.trim="meme.title"
            required="true"
            autofocus
            :invalid="submitted && !meme.title"
            fluid
          />
          <small v-if="submitted && !meme.title" class="text-red-500"
            >標題為必填項目。</small
          >
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">描述</label>
          <Textarea
            id="description"
            v-model="meme.description"
            rows="3"
            cols="20"
            fluid
          />
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Select
            id="status"
            v-model="meme.status"
            :options="statuses"
            optionLabel="label"
            placeholder="選擇狀態"
            fluid
          ></Select>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveMeme" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteMemeDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="meme"
          >您確定要刪除 <b>{{ meme.title }}</b> 嗎？</span
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

    <Dialog
      v-model:visible="deleteMemesDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的 memes 嗎？</span>
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
