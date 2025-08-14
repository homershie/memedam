<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineOptions({
  name: 'AdminTags',
})

import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const tags = ref([])
const categories = ref([])
const selectedTags = ref([])

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
  categoryId: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const statuses = [
  { label: '啟用', value: 'active' },
  { label: '封存', value: 'archived' },
]

// 載入假資料
const loadData = async () => {
  loading.value = true
  try {
    categories.value = [
      { id: 'cat-general', name: '一般', slug: 'general' },
      { id: 'cat-topic', name: '主題', slug: 'topic' },
      { id: 'cat-style', name: '風格', slug: 'style' },
    ]

    tags.value = [
      {
        id: 'T-1006',
        name: '搞笑',
        slug: 'funny',
        categoryId: 'cat-style',
        color: '#42A5F5',
        status: 'active',
        usageCount: 124,
        aliases: ['好笑', '逗趣'],
        description: '與幽默相關的內容',
        createdAt: '2024-01-11T08:12:00Z',
      },
      {
        id: 'T-1005',
        name: '動物',
        slug: 'animals',
        categoryId: 'cat-topic',
        color: '#66BB6A',
        status: 'active',
        usageCount: 86,
        aliases: [],
        description: '與動物相關',
        createdAt: '2024-01-12T09:40:00Z',
      },
      {
        id: 'T-1004',
        name: '政治',
        slug: 'politics',
        categoryId: 'cat-topic',
        color: '#EF5350',
        status: 'archived',
        usageCount: 42,
        aliases: ['政事'],
        description: '',
        createdAt: '2024-01-10T15:22:00Z',
      },
      {
        id: 'T-1003',
        name: '經典',
        slug: 'classic',
        categoryId: 'cat-general',
        color: '#AB47BC',
        status: 'active',
        usageCount: 210,
        aliases: ['名場面'],
        description: '歷久不衰的梗',
        createdAt: '2024-01-09T11:00:00Z',
      },
      {
        id: 'T-1002',
        name: '潮流',
        slug: 'trendy',
        categoryId: 'cat-style',
        color: '#FFA726',
        status: 'active',
        usageCount: 168,
        aliases: [],
        description: '',
        createdAt: '2024-01-09T10:30:00Z',
      },
      {
        id: 'T-1001',
        name: '梗圖',
        slug: 'meme',
        categoryId: 'cat-general',
        color: '#78909C',
        status: 'active',
        usageCount: 132,
        aliases: ['迷因'],
        description: '迷因相關',
        createdAt: '2024-01-08T21:05:00Z',
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
  tag.value = { status: 'active' }
  submitted.value = false
  tagDialog.value = true
}

function hideDialog() {
  tagDialog.value = false
  submitted.value = false
}

function saveTag() {
  submitted.value = true
  const current = tag.value
  if (!current?.name?.trim()) return

  // 建立缺省值
  if (!current.slug?.trim()) current.slug = slugify(current.name)
  if (!current.color?.trim()) current.color = '#999999'

  if (current.id) {
    tags.value[findIndexById(current.id)] = { ...current }
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '標籤已更新',
      life: 3000,
    })
  } else {
    current.id = createId()
    current.createdAt = new Date().toISOString()
    current.aliases = parseAliases(current.aliases)
    tags.value.push({ ...current })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '標籤已建立',
      life: 3000,
    })
  }

  tagDialog.value = false
  tag.value = {}
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

function deleteTag() {
  tags.value = tags.value.filter((t) => t.id !== tag.value.id)
  deleteTagDialog.value = false
  tag.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '標籤已刪除',
    life: 3000,
  })
}

function confirmDeleteSelected() {
  deleteTagsDialog.value = true
}

function deleteSelectedTags() {
  tags.value = tags.value.filter((t) => !selectedTags.value?.includes(t))
  selectedTags.value = []
  deleteTagsDialog.value = false
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '已刪除選取標籤',
    life: 3000,
  })
}

function toggleStatus(row) {
  row.status = row.status === 'active' ? 'archived' : 'active'
}

function exportCSV() {
  dt.value?.exportCSV()
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

function mergeSelectedTags() {
  const list = selectedTags.value || []
  if (list.length < 2) return
  const primary = list[0]
  const rest = list.slice(1)

  // 合併 aliases 與 usageCount
  const aliasSet = new Set([
    ...(primary.aliases || []),
    ...rest.flatMap((t) => t.aliases || []),
    ...rest.map((t) => t.name),
  ])
  primary.aliases = Array.from(aliasSet)
  primary.usageCount =
    (primary.usageCount || 0) +
    rest.reduce((sum, t) => sum + (t.usageCount || 0), 0)

  // 移除被合併者
  const idsToRemove = new Set(rest.map((t) => t.id))
  tags.value = tags.value.filter((t) => !idsToRemove.has(t.id))
  selectedTags.value = []
  mergeDialog.value = false
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '標籤已合併',
    life: 3000,
  })
}

// 工具
function findIndexById(id) {
  return tags.value.findIndex((t) => t.id === id)
}

function createId() {
  let id = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 6; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  return id
}

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

function categoryNameById(id) {
  return categories.value.find((c) => c.id === id)?.name || '-'
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
        paginator
        :rows="10"
        :filters="filters"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個標籤"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">標籤管理</h4>
            <div class="flex gap-2">
              <Dropdown
                v-model="filters.categoryId.value"
                :options="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="按分類篩選"
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
        <Column field="name" header="名稱" sortable style="min-width: 14rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span
                class="inline-block w-3 h-3 rounded"
                :style="{ backgroundColor: data.color || '#999' }"
              ></span>
              <span class="font-medium">{{ data.name }}</span>
            </div>
          </template>
        </Column>
        <Column field="slug" header="Slug" sortable style="min-width: 12rem" />
        <Column
          field="categoryId"
          header="分類"
          sortable
          style="min-width: 10rem"
        >
          <template #body="{ data }">{{
            categoryNameById(data.categoryId)
          }}</template>
        </Column>
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
              icon="pi pi-power-off"
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
          <label for="category" class="block font-bold mb-3">分類</label>
          <Dropdown
            id="category"
            v-model="tag.categoryId"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇分類"
            fluid
          />
        </div>
        <div>
          <label for="color" class="block font-bold mb-3">顏色（HEX）</label>
          <InputText
            id="color"
            v-model.trim="tag.color"
            placeholder="#888888"
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
        <div>
          <label for="desc" class="block font-bold mb-3">描述</label>
          <Textarea id="desc" v-model.trim="tag.description" rows="3" fluid />
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
