<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineOptions({
  name: 'AdminTags',
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import tagService from '@/services/tagService'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const tags = ref([])
const selectedTags = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 對話框
const tagDialog = ref(false)
const deleteTagDialog = ref(false)
const deleteTagsDialog = ref(false)
const mergeDialog = ref(false)

// 表單資料
const tag = ref({})
const submitted = ref(false)

// 篩選器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const statuses = [
  { label: '啟用', value: 'active' },
  { label: '封存', value: 'archived' },
]

// 載入真實數據
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
    }

    // 添加篩選條件
    if (filters.value.status.value) {
      params.status = filters.value.status.value
    }

    if (filters.value.global.value) {
      params.search = filters.value.global.value
    }

    const tagsResponse = await tagService.getAll(params)

    const rawTags =
      (tagsResponse.data && tagsResponse.data.tags) ||
      (Array.isArray(tagsResponse.data) ? tagsResponse.data : [])

    // 將後端回傳欄位正規化為前端需要的鍵值
    tags.value = rawTags.map((t) => ({
      id: t.id || t._id,
      _id: t._id || t.id,
      name: t.name || '',
      slug: t.slug || '',
      status: t.status || 'active',
      usageCount: t.usageCount || 0,
      aliases: Array.isArray(t.aliases) ? t.aliases : [],
      createdAt: t.createdAt || t.updatedAt || new Date().toISOString(),
    }))

    totalRecords.value =
      (tagsResponse.data && tagsResponse.data.pagination?.total) ||
      tags.value.length

    // 無分類載入
  } catch (error) {
    console.error('載入標籤數據失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入標籤數據失敗',
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
  tags.value = [
    {
      id: 'T-1006',
      name: '搞笑',
      slug: 'funny',

      status: 'active',
      usageCount: 124,
      aliases: ['好笑', '逗趣'],
      createdAt: '2024-01-11T08:12:00Z',
    },
    {
      id: 'T-1005',
      name: '動物',
      slug: 'animals',

      status: 'active',
      usageCount: 86,
      aliases: [],
      createdAt: '2024-01-12T09:40:00Z',
    },
    {
      id: 'T-1004',
      name: '政治',
      slug: 'politics',

      status: 'archived',
      usageCount: 42,
      aliases: ['政事'],
      createdAt: '2024-01-10T15:22:00Z',
    },
    {
      id: 'T-1003',
      name: '經典',
      slug: 'classic',

      status: 'active',
      usageCount: 210,
      aliases: ['名場面'],
      createdAt: '2024-01-09T11:00:00Z',
    },
    {
      id: 'T-1002',
      name: '潮流',
      slug: 'trendy',

      status: 'active',
      usageCount: 168,
      aliases: [],
      createdAt: '2024-01-09T10:30:00Z',
    },
    {
      id: 'T-1001',
      name: '梗圖',
      slug: 'meme',

      status: 'active',
      usageCount: 132,
      aliases: ['迷因'],
      createdAt: '2024-01-08T21:05:00Z',
    },
  ]
  totalRecords.value = tags.value.length
}

onMounted(async () => {
  await loadData()
})

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

function openNew() {
  tag.value = { status: 'active' }
  submitted.value = false
  tagDialog.value = true
}

function hideDialog() {
  tagDialog.value = false
  submitted.value = false
}

async function saveTag() {
  submitted.value = true
  const current = tag.value
  if (!current?.name?.trim()) return

  try {
    // 建立缺省值
    if (!current.slug?.trim()) current.slug = slugify(current.name)

    if (current.id) {
      // 更新現有標籤
      current.aliases = parseAliases(current.aliases)
      await tagService.update(current.id, current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '標籤已更新',
        life: 3000,
      })
    } else {
      // 建立新標籤
      current.aliases = parseAliases(current.aliases)
      await tagService.create(current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '標籤已建立',
        life: 3000,
      })
    }

    tagDialog.value = false
    tag.value = {}
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('儲存標籤失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '儲存標籤失敗',
      life: 3000,
    })
  }
}

function editTag(row) {
  // 將 aliases 轉為逗號字串以便編輯
  tag.value = { ...row, aliases: (row.aliases || []).join(', ') }
  tagDialog.value = true
}

function confirmDeleteTag(row) {
  tag.value = row
  deleteTagDialog.value = true
}

async function deleteTag() {
  try {
    await tagService.remove(tag.value.id)
    deleteTagDialog.value = false
    tag.value = {}
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '標籤已刪除',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('刪除標籤失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '刪除標籤失敗',
      life: 3000,
    })
  }
}

function confirmDeleteSelected() {
  deleteTagsDialog.value = true
}

async function deleteSelectedTags() {
  try {
    const ids = selectedTags.value.map((t) => t.id)
    await tagService.batchDelete(ids)
    selectedTags.value = []
    deleteTagsDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已刪除選取標籤',
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
    await tagService.toggleStatus(row.id)
    row.status = row.status === 'active' ? 'archived' : 'active'
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

async function exportCSV() {
  try {
    const response = await tagService.exportTags({
      page: currentPage.value,
      limit: pageSize.value,
    })

    // 創建下載連結
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tags-${new Date().toISOString().split('T')[0]}.csv`
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

// 合併：保留第一個為主，其餘轉入 aliases
function openMerge() {
  if (!selectedTags.value || selectedTags.value.length < 2) {
    toast.add({
      severity: 'warn',
      summary: '提示',
      detail: '請選擇至少兩個標籤進行合併',
      life: 2500,
    })
    return
  }
  mergeDialog.value = true
}

async function mergeSelectedTags() {
  const list = selectedTags.value || []
  if (list.length < 2) return

  try {
    const primary = list[0]
    const secondaryIds = list.slice(1).map((t) => t.id)

    await tagService.mergeTags(primary.id, secondaryIds)
    selectedTags.value = []
    mergeDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '標籤已合併',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('合併標籤失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.message || '合併標籤失敗',
      life: 3000,
    })
  }
}

// 工具
function slugify(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function parseAliases(val) {
  if (Array.isArray(val)) return val
  if (typeof val !== 'string') return []
  return val
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

//
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
            :disabled="!selectedTags?.length"
            @click="confirmDeleteSelected"
          />
          <Button
            label="合併"
            icon="pi pi-compress"
            severity="secondary"
            :disabled="!selectedTags || selectedTags.length < 2"
            @click="openMerge"
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
              placeholder="搜尋標籤..."
              @input="onFilterChange"
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="tags"
        v-model:selection="selectedTags"
        dataKey="id"
        :loading="loading"
        lazy
        paginator
        :totalRecords="totalRecords"
        :rows="pageSize"
        :first="(currentPage - 1) * pageSize"
        :filters="filters"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個標籤"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        @page="onPageChange"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">標籤管理</h4>
            <div class="flex gap-2">
              <Dropdown
                v-model="filters.status.value"
                :options="statuses"
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
        <Column field="name" header="名稱" sortable style="min-width: 14rem" />
        <Column field="slug" header="Slug" sortable style="min-width: 12rem" />

        <Column
          field="usageCount"
          header="使用次數"
          sortable
          style="min-width: 8rem"
        />
        <Column field="aliases" header="別名" style="min-width: 10rem">
          <template #body="{ data }">{{
            (data.aliases || []).length
          }}</template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag
              :value="data.status === 'active' ? '啟用' : '封存'"
              :severity="data.status === 'active' ? 'success' : 'secondary'"
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
              @click="editTag(data)"
            />
            <Button
              icon="pi pi-tags"
              outlined
              rounded
              class="mr-2"
              severity="warning"
              @click="toggleStatus(data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="secondary"
              @click="confirmDeleteTag(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 新增/編輯 -->
    <Dialog
      v-model:visible="tagDialog"
      :style="{ width: '560px' }"
      header="標籤"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">名稱</label>
          <InputText
            id="name"
            v-model.trim="tag.name"
            required
            autofocus
            :invalid="submitted && !tag.name"
            fluid
          />
          <small v-if="submitted && !tag.name" class="text-red-500"
            >名稱為必填項目。</small
          >
        </div>
        <div>
          <label for="slug" class="block font-bold mb-3">Slug</label>
          <InputText
            id="slug"
            v-model.trim="tag.slug"
            placeholder="未填將自動從名稱產生"
            fluid
          />
        </div>

        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Dropdown
            id="status"
            v-model="tag.status"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          />
        </div>
        <div>
          <label for="aliases" class="block font-bold mb-3"
            >別名（以逗號分隔）</label
          >
          <Textarea id="aliases" v-model.trim="tag.aliases" rows="2" fluid />
        </div>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveTag" />
      </template>
    </Dialog>

    <!-- 單筆刪除確認 -->
    <Dialog
      v-model:visible="deleteTagDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="tag"
          >您確定要刪除標籤 <b>{{ tag.name }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteTagDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteTag" />
      </template>
    </Dialog>

    <!-- 多筆刪除確認 -->
    <Dialog
      v-model:visible="deleteTagsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的標籤嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteTagsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedTags"
        />
      </template>
    </Dialog>

    <!-- 合併標籤 -->
    <Dialog
      v-model:visible="mergeDialog"
      :style="{ width: '520px' }"
      header="合併標籤"
      :modal="true"
    >
      <div class="space-y-3">
        <p class="text-gray-600">
          將把後選取的標籤合併到第一個選取的標籤，別名與使用次數會整併。
        </p>
        <div class="bg-gray-50 p-3 rounded text-sm">
          <div class="font-medium mb-2">將合併以下標籤：</div>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="t in selectedTags" :key="t.id" :value="t.name" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          @click="mergeDialog = false"
        />
        <Button
          label="合併"
          icon="pi pi-check"
          severity="warning"
          @click="mergeSelectedTags"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '標籤管理'
  admin: true
</route>
