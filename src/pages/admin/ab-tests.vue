<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminABTests'
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, computed } from 'vue'

onMounted(() => {
  loadABTests()
})

const toast = useToast()
const dt = ref()
const abTests = ref([])
const abTestDialog = ref(false)
const deleteABTestDialog = ref(false)
const deleteABTestsDialog = ref(false)
const abTest = ref({})
const selectedABTests = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const submitted = ref(false)
const loading = ref(false)

const statuses = ref([
  { label: '草稿', value: 'draft' },
  { label: '進行中', value: 'running' },
  { label: '已完成', value: 'completed' },
  { label: '已暫停', value: 'paused' },
])

const types = ref([
  { label: '推薦演算法', value: 'recommendation' },
  { label: 'UI 設計', value: 'ui' },
  { label: '功能測試', value: 'feature' },
  { label: '內容策略', value: 'content' },
])

const loadABTests = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的 A/B 測試服務
    // const response = await analyticsService.getAbTests()
    // abTests.value = response.data.tests
    
    // 暫時模擬數據
    abTests.value = [
      { 
        id: 1, 
        name: '推薦演算法 A/B 測試', 
        description: '測試協同過濾 vs 內容基礎推薦的效果',
        type: 'recommendation',
        status: 'running',
        variant_a: '協同過濾',
        variant_b: '內容基礎',
        traffic_split: 50,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-01-31T23:59:59Z',
        created_at: '2023-12-25T10:30:00Z',
        metrics: {
          variant_a: {
            ctr: 0.025,
            engagement_rate: 0.052,
            conversion_rate: 0.018,
            sample_size: 5000
          },
          variant_b: {
            ctr: 0.021,
            engagement_rate: 0.048,
            conversion_rate: 0.015,
            sample_size: 5000
          }
        }
      },
      { 
        id: 2, 
        name: 'UI 設計測試', 
        description: '測試新的卡片設計對用戶互動的影響',
        type: 'ui',
        status: 'completed',
        variant_a: '舊版設計',
        variant_b: '新版設計',
        traffic_split: 30,
        start_date: '2023-12-01T00:00:00Z',
        end_date: '2023-12-31T23:59:59Z',
        created_at: '2023-11-25T15:20:00Z',
        metrics: {
          variant_a: {
            ctr: 0.019,
            engagement_rate: 0.042,
            conversion_rate: 0.012,
            sample_size: 3500
          },
          variant_b: {
            ctr: 0.023,
            engagement_rate: 0.049,
            conversion_rate: 0.016,
            sample_size: 3500
          }
        }
      },
      { 
        id: 3, 
        name: '功能測試', 
        description: '測試新功能對用戶留存率的影響',
        type: 'feature',
        status: 'draft',
        variant_a: '無新功能',
        variant_b: '有新功能',
        traffic_split: 20,
        start_date: null,
        end_date: null,
        created_at: '2024-01-15T12:45:00Z',
        metrics: {
          variant_a: {
            ctr: 0,
            engagement_rate: 0,
            conversion_rate: 0,
            sample_size: 0
          },
          variant_b: {
            ctr: 0,
            engagement_rate: 0,
            conversion_rate: 0,
            sample_size: 0
          }
        }
      },
    ]
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入 A/B 測試數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function openNew() {
  abTest.value = {
    status: 'draft',
    type: 'recommendation',
    traffic_split: 50
  }
  submitted.value = false
  abTestDialog.value = true
}

function hideDialog() {
  abTestDialog.value = false
  submitted.value = false
}

function saveABTest() {
  submitted.value = true

  if (abTest?.value.name?.trim() && abTest?.value.description?.trim()) {
    if (abTest.value.id) {
      abTests.value[findIndexById(abTest.value.id)] = abTest.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: 'A/B 測試已更新',
        life: 3000,
      })
    } else {
      abTest.value.id = createId()
      abTest.value.created_at = new Date().toISOString()
      abTest.value.metrics = {
        variant_a: { ctr: 0, engagement_rate: 0, conversion_rate: 0, sample_size: 0 },
        variant_b: { ctr: 0, engagement_rate: 0, conversion_rate: 0, sample_size: 0 }
      }
      abTests.value.push(abTest.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: 'A/B 測試已建立',
        life: 3000,
      })
    }

    abTestDialog.value = false
    abTest.value = {}
  }
}

function editABTest(abTestItem) {
  abTest.value = { ...abTestItem }
  abTestDialog.value = true
}

function confirmDeleteABTest(abTestItem) {
  abTest.value = abTestItem
  deleteABTestDialog.value = true
}

function deleteABTest() {
  abTests.value = abTests.value.filter((val) => val.id !== abTest.value.id)
  deleteABTestDialog.value = false
  abTest.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: 'A/B 測試已刪除',
    life: 3000,
  })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < abTests.value.length; i++) {
    if (abTests.value[i].id === id) {
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
  deleteABTestsDialog.value = true
}

function deleteSelectedABTests() {
  abTests.value = abTests.value.filter((val) => !selectedABTests.value.includes(val))
  deleteABTestsDialog.value = false
  selectedABTests.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '選取的 A/B 測試已刪除',
    life: 3000,
  })
}

function getStatusLabel(status) {
  switch (status) {
    case 'running':
      return 'success'
    case 'completed':
      return 'info'
    case 'draft':
      return 'warning'
    case 'paused':
      return 'secondary'
    default:
      return null
  }
}

function getTypeLabel(type) {
  switch (type) {
    case 'recommendation':
      return 'info'
    case 'ui':
      return 'success'
    case 'feature':
      return 'warning'
    case 'content':
      return 'secondary'
    default:
      return null
  }
}

function startABTest(abTestId) {
  const abTestIndex = findIndexById(abTestId)
  if (abTestIndex !== -1) {
    abTests.value[abTestIndex].status = 'running'
    abTests.value[abTestIndex].start_date = new Date().toISOString()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: 'A/B 測試已開始',
      life: 3000,
    })
  }
}

function pauseABTest(abTestId) {
  const abTestIndex = findIndexById(abTestId)
  if (abTestIndex !== -1) {
    abTests.value[abTestIndex].status = 'paused'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: 'A/B 測試已暫停',
      life: 3000,
    })
  }
}

function completeABTest(abTestId) {
  const abTestIndex = findIndexById(abTestId)
  if (abTestIndex !== -1) {
    abTests.value[abTestIndex].status = 'completed'
    abTests.value[abTestIndex].end_date = new Date().toISOString()
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: 'A/B 測試已完成',
      life: 3000,
    })
  }
}

// 計算統計顯著性
function calculateSignificance(variantA, variantB) {
  const p1 = variantA.conversion_rate
  const p2 = variantB.conversion_rate
  const n1 = variantA.sample_size
  const n2 = variantB.sample_size
  
  if (n1 === 0 || n2 === 0) return 0
  
  const pooled = (p1 * n1 + p2 * n2) / (n1 + n2)
  const se = Math.sqrt(pooled * (1 - pooled) * (1/n1 + 1/n2))
  const z = Math.abs(p1 - p2) / se
  
  // 簡化的 p-value 計算
  return z > 1.96 ? 0.05 : z > 1.645 ? 0.1 : 1
}

// 計算提升幅度
function calculateImprovement(variantA, variantB) {
  if (variantA.conversion_rate === 0) return 0
  return ((variantB.conversion_rate - variantA.conversion_rate) / variantA.conversion_rate) * 100
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="新增測試"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedABTests || !selectedABTests.length"
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
        v-model:selection="selectedABTests"
        :value="abTests"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個測試"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理 A/B 測試</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋測試..."
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
          field="name"
          header="測試名稱"
          sortable
          style="min-width: 20rem"
        ></Column>
        <Column
          field="type"
          header="類型"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.type === 'recommendation' ? '推薦演算法' : 
                      slotProps.data.type === 'ui' ? 'UI 設計' : 
                      slotProps.data.type === 'feature' ? '功能測試' : '內容策略'"
              :severity="getTypeLabel(slotProps.data.type)"
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
              :value="slotProps.data.status === 'running' ? '進行中' : 
                      slotProps.data.status === 'completed' ? '已完成' : 
                      slotProps.data.status === 'draft' ? '草稿' : '已暫停'"
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column
          field="traffic_split"
          header="流量分配"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.traffic_split }}% / {{ 100 - slotProps.data.traffic_split }}%
          </template>
        </Column>
        <Column
          field="start_date"
          header="開始時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.start_date ? new Date(slotProps.data.start_date).toLocaleDateString('zh-TW') : '-' }}
          </template>
        </Column>
        <Column
          field="end_date"
          header="結束時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.end_date ? new Date(slotProps.data.end_date).toLocaleDateString('zh-TW') : '-' }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editABTest(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'draft'"
              icon="pi pi-play"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="startABTest(slotProps.data.id)"
            />
            <Button
              v-if="slotProps.data.status === 'running'"
              icon="pi pi-pause"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="pauseABTest(slotProps.data.id)"
            />
            <Button
              v-if="slotProps.data.status === 'running'"
              icon="pi pi-check"
              outlined
              rounded
              severity="info"
              class="mr-2"
              @click="completeABTest(slotProps.data.id)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteABTest(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 測試結果分析 -->
    <div class="mt-6">
      <Card>
        <template #title>測試結果分析</template>
        <template #content>
          <div v-for="test in abTests.filter(t => t.status === 'completed')" :key="test.id" class="mb-6 p-4 border rounded-lg">
            <h5 class="mb-4">{{ test.name }}</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h6 class="font-semibold mb-2">{{ test.variant_a }}</h6>
                <div class="space-y-2">
                  <div>點擊率: {{ (test.metrics.variant_a.ctr * 100).toFixed(2) }}%</div>
                  <div>互動率: {{ (test.metrics.variant_a.engagement_rate * 100).toFixed(2) }}%</div>
                  <div>轉換率: {{ (test.metrics.variant_a.conversion_rate * 100).toFixed(2) }}%</div>
                  <div>樣本數: {{ test.metrics.variant_a.sample_size.toLocaleString() }}</div>
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h6 class="font-semibold mb-2">{{ test.variant_b }}</h6>
                <div class="space-y-2">
                  <div>點擊率: {{ (test.metrics.variant_b.ctr * 100).toFixed(2) }}%</div>
                  <div>互動率: {{ (test.metrics.variant_b.engagement_rate * 100).toFixed(2) }}%</div>
                  <div>轉換率: {{ (test.metrics.variant_b.conversion_rate * 100).toFixed(2) }}%</div>
                  <div>樣本數: {{ test.metrics.variant_b.sample_size.toLocaleString() }}</div>
                </div>
              </div>
            </div>
            <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <div class="font-semibold">分析結果:</div>
              <div>提升幅度: {{ calculateImprovement(test.metrics.variant_a, test.metrics.variant_b).toFixed(2) }}%</div>
              <div>統計顯著性: {{ calculateSignificance(test.metrics.variant_a, test.metrics.variant_b) < 0.05 ? '顯著' : '不顯著' }}</div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Dialog
      v-model:visible="abTestDialog"
      :style="{ width: '700px' }"
      header="A/B 測試詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">測試名稱</label>
          <InputText
            id="name"
            v-model.trim="abTest.name"
            required="true"
            autofocus
            :invalid="submitted && !abTest.name"
            fluid
          />
          <small v-if="submitted && !abTest.name" class="text-red-500"
            >測試名稱為必填項目。</small
          >
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">描述</label>
          <Textarea
            id="description"
            v-model="abTest.description"
            rows="3"
            required="true"
            :invalid="submitted && !abTest.description"
            fluid
          />
          <small v-if="submitted && !abTest.description" class="text-red-500"
            >描述為必填項目。</small
          >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="type" class="block font-bold mb-3">測試類型</label>
            <Select
              id="type"
              v-model="abTest.type"
              :options="types"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇類型"
              fluid
            ></Select>
          </div>
          <div>
            <label for="status" class="block font-bold mb-3">狀態</label>
            <Select
              id="status"
              v-model="abTest.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇狀態"
              fluid
            ></Select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="variant_a" class="block font-bold mb-3">變體 A</label>
            <InputText
              id="variant_a"
              v-model="abTest.variant_a"
              placeholder="變體 A 名稱"
              fluid
            />
          </div>
          <div>
            <label for="variant_b" class="block font-bold mb-3">變體 B</label>
            <InputText
              id="variant_b"
              v-model="abTest.variant_b"
              placeholder="變體 B 名稱"
              fluid
            />
          </div>
          <div>
            <label for="traffic_split" class="block font-bold mb-3">流量分配 (%)</label>
            <InputNumber
              id="traffic_split"
              v-model="abTest.traffic_split"
              :min="1"
              :max="99"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="start_date" class="block font-bold mb-3">開始日期</label>
            <Calendar
              id="start_date"
              v-model="abTest.start_date"
              :showIcon="true"
              class="w-full"
            />
          </div>
          <div>
            <label for="end_date" class="block font-bold mb-3">結束日期</label>
            <Calendar
              id="end_date"
              v-model="abTest.end_date"
              :showIcon="true"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveABTest" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteABTestDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="abTest"
          >您確定要刪除測試 <b>{{ abTest.name }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteABTestDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteABTest" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteABTestsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的 A/B 測試嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteABTestsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedABTests"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: 'A/B 測試管理'
  admin: true
</route>
