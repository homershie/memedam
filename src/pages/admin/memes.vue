<script setup>
import { onMounted, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import { useAdminStore } from '@/stores/adminStore'

// Define component name to fix linter error
defineOptions({
  name: 'AdminMemes'
})

// Store and toast
const adminStore = useAdminStore()
const toast = useToast()

// Refs
const dt = ref()
const selectedMemes = ref([])
const memeDialog = ref(false)
const deleteMemeDialog = ref(false)
const deleteMemesDialog = ref(false)
const currentMeme = ref({})
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS }
})

// 迷因狀態選項
const statusOptions = ref([
  { label: '已核准', value: 'approved' },
  { label: '待審核', value: 'pending' },
  { label: '已拒絕', value: 'rejected' }
])

// 計算屬性
const memes = computed(() => adminStore.memes)
const loading = computed(() => adminStore.memesLoading)

// 載入數據
onMounted(async () => {
  await loadMemes()
})

// 方法
const loadMemes = async () => {
  try {
    await adminStore.loadMemes()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入迷因數據失敗',
      life: 3000
    })
  }
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warn'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'approved':
      return '已核准'
    case 'pending':
      return '待審核'
    case 'rejected':
      return '已拒絕'
    default:
      return status
  }
}

const viewMeme = (meme) => {
  currentMeme.value = { ...meme }
  memeDialog.value = true
}

const approveMeme = async (meme) => {
  try {
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地數據
    const index = memes.value.findIndex(m => m.id === meme.id)
    if (index !== -1) {
      memes.value[index].status = 'approved'
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '迷因已核准',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '核准失敗',
      life: 3000
    })
  }
}

const rejectMeme = async (meme, reason = '違反社區規範') => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = memes.value.findIndex(m => m.id === meme.id)
    if (index !== -1) {
      memes.value[index].status = 'rejected'
      memes.value[index].rejection_reason = reason
    }
    
    toast.add({
      severity: 'info',
      summary: '已拒絕',
      detail: '迷因已被拒絕',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '拒絕失敗',
      life: 3000
    })
  }
}

const confirmDeleteMeme = (meme) => {
  currentMeme.value = meme
  deleteMemeDialog.value = true
}

const deleteMeme = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = memes.value.findIndex(m => m.id === currentMeme.value.id)
    if (index !== -1) {
      memes.value.splice(index, 1)
    }
    
    deleteMemeDialog.value = false
    currentMeme.value = {}
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '迷因已刪除',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '刪除失敗',
      life: 3000
    })
  }
}

const confirmDeleteSelected = () => {
  deleteMemesDialog.value = true
}

const deleteSelectedMemes = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    selectedMemes.value.forEach(selectedMeme => {
      const index = memes.value.findIndex(m => m.id === selectedMeme.id)
      if (index !== -1) {
        memes.value.splice(index, 1)
      }
    })
    
    deleteMemesDialog.value = false
    selectedMemes.value = []
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '選中的迷因已刪除',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '批量刪除失敗',
      life: 3000
    })
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const hideDialog = () => {
  memeDialog.value = false
  currentMeme.value = {}
}
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1 class="admin-page-title">迷因管理</h1>
      <p class="admin-page-description">管理平台上的所有迷因內容</p>
    </div>

    <div class="admin-content-card">
      <!-- 工具列 -->
      <Toolbar class="mb-6">
        <template #start>
          <Button 
            label="批量核准" 
            icon="pi pi-check" 
            severity="success" 
            class="mr-2" 
            @click="selectedMemes.forEach(approveMeme)"
            :disabled="!selectedMemes || !selectedMemes.length" 
          />
          <Button 
            label="批量刪除" 
            icon="pi pi-trash" 
            severity="danger" 
            @click="confirmDeleteSelected" 
            :disabled="!selectedMemes || !selectedMemes.length" 
          />
        </template>

        <template #end>
          <Button 
            label="匯出" 
            icon="pi pi-download" 
            severity="secondary" 
            @click="exportCSV" 
          />
          <Button 
            label="重新整理" 
            icon="pi pi-refresh" 
            severity="secondary" 
            class="ml-2"
            @click="loadMemes"
            :loading="loading"
          />
        </template>
      </Toolbar>

      <!-- 數據表格 -->
      <DataTable
        ref="dt"
        v-model:selection="selectedMemes"
        :value="memes"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 項迷因"
      >
        <template #header>
          <div class="flex flex-wrap gap-4 items-center justify-between">
            <h4 class="m-0 text-lg font-semibold">迷因列表</h4>
            <div class="flex gap-2">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText 
                  v-model="filters['global'].value" 
                  placeholder="搜尋迷因..." 
                />
              </IconField>
              <Select
                v-model="filters['status'].value"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="篩選狀態"
                :showClear="true"
                class="min-w-[150px]"
              />
            </div>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        
        <Column field="id" header="ID" sortable style="min-width: 6rem">
          <template #body="slotProps">
            #{{ slotProps.data.id }}
          </template>
        </Column>
        
        <Column field="title" header="標題" sortable style="min-width: 16rem">
          <template #body="slotProps">
            <div class="font-medium">{{ slotProps.data.title }}</div>
          </template>
        </Column>
        
        <Column field="author" header="作者" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-gray-500"></i>
              </div>
              <span>{{ slotProps.data.author }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="status" header="狀態" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag 
              :value="getStatusLabel(slotProps.data.status)" 
              :severity="getStatusSeverity(slotProps.data.status)" 
            />
          </template>
        </Column>
        
        <Column field="views" header="觀看數" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex items-center space-x-1">
              <i class="pi pi-eye text-gray-500"></i>
              <span>{{ slotProps.data.views?.toLocaleString() }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="likes" header="讚數" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <div class="flex items-center space-x-1">
              <i class="pi pi-heart text-red-500"></i>
              <span>{{ slotProps.data.likes?.toLocaleString() }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="created_at" header="建立時間" sortable style="min-width: 12rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>
        
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <div class="table-actions">
              <Button 
                icon="pi pi-eye" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn" 
                @click="viewMeme(slotProps.data)"
                v-tooltip="'查看詳情'"
              />
              <Button 
                v-if="slotProps.data.status === 'pending'"
                icon="pi pi-check" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn success" 
                @click="approveMeme(slotProps.data)"
                v-tooltip="'核准'"
              />
              <Button 
                v-if="slotProps.data.status === 'pending'"
                icon="pi pi-times" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn danger" 
                @click="rejectMeme(slotProps.data)"
                v-tooltip="'拒絕'"
              />
              <Button 
                icon="pi pi-trash" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn danger" 
                @click="confirmDeleteMeme(slotProps.data)"
                v-tooltip="'刪除'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 查看迷因對話框 -->
    <Dialog 
      v-model:visible="memeDialog" 
      :style="{ width: '600px' }" 
      header="迷因詳情" 
      :modal="true"
    >
      <div v-if="currentMeme" class="space-y-4">
        <div>
          <label class="block font-bold mb-2">標題</label>
          <p>{{ currentMeme.title }}</p>
        </div>
        
        <div>
          <label class="block font-bold mb-2">作者</label>
          <p>{{ currentMeme.author }}</p>
        </div>
        
        <div>
          <label class="block font-bold mb-2">狀態</label>
          <Tag 
            :value="getStatusLabel(currentMeme.status)" 
            :severity="getStatusSeverity(currentMeme.status)" 
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-bold mb-2">觀看數</label>
            <p>{{ currentMeme.views?.toLocaleString() }}</p>
          </div>
          <div>
            <label class="block font-bold mb-2">讚數</label>
            <p>{{ currentMeme.likes?.toLocaleString() }}</p>
          </div>
        </div>
        
        <div>
          <label class="block font-bold mb-2">建立時間</label>
          <p>{{ formatDate(currentMeme.created_at) }}</p>
        </div>
        
        <div v-if="currentMeme.rejection_reason">
          <label class="block font-bold mb-2">拒絕原因</label>
          <p class="text-red-600">{{ currentMeme.rejection_reason }}</p>
        </div>
      </div>

      <template #footer>
        <Button label="關閉" icon="pi pi-times" @click="hideDialog" />
        <Button 
          v-if="currentMeme.status === 'pending'"
          label="核准" 
          icon="pi pi-check" 
          severity="success"
          @click="approveMeme(currentMeme); hideDialog()" 
        />
        <Button 
          v-if="currentMeme.status === 'pending'"
          label="拒絕" 
          icon="pi pi-times" 
          severity="danger"
          @click="rejectMeme(currentMeme); hideDialog()" 
        />
      </template>
    </Dialog>

    <!-- 刪除確認對話框 -->
    <Dialog 
      v-model:visible="deleteMemeDialog" 
      :style="{ width: '450px' }" 
      header="確認刪除" 
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
        <span v-if="currentMeme">
          確定要刪除迷因 <b>{{ currentMeme.title }}</b> 嗎？
        </span>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="deleteMemeDialog = false" />
        <Button label="確定" icon="pi pi-check" severity="danger" @click="deleteMeme" />
      </template>
    </Dialog>

    <!-- 批量刪除確認對話框 -->
    <Dialog 
      v-model:visible="deleteMemesDialog" 
      :style="{ width: '450px' }" 
      header="確認批量刪除" 
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
        <span>確定要刪除選中的 {{ selectedMemes.length }} 個迷因嗎？</span>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="deleteMemesDialog = false" />
        <Button label="確定" icon="pi pi-check" severity="danger" @click="deleteSelectedMemes" />
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
