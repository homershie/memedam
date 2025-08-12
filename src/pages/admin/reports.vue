<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminReports'
})



import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const reports = ref([])
const loading = ref(false)

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
        reason: '不當內容', 
        status: 'pending',
        reporter: 'user1',
        created_at: '2024-01-15T10:30:00Z'
      },
      { 
        id: 2, 
        type: 'comment', 
        target_id: 456, 
        reason: '仇恨言論', 
        status: 'processed',
        reporter: 'user2',
        created_at: '2024-01-14T15:20:00Z'
      }
    ]
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入檢舉數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReports()
})
</script>

<template>
  <div class="admin-reports">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        檢舉管理
      </h1>
    </div>

    <Card>
      <template #content>
        <DataTable
          :value="reports"
          :loading="loading"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          class="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" sortable />
          <Column field="type" header="類型" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.type === 'meme' ? '迷因' : '評論'" 
                :severity="data.type === 'meme' ? 'info' : 'secondary'"
              />
            </template>
          </Column>
          <Column field="target_id" header="目標ID" sortable />
          <Column field="reason" header="檢舉原因" sortable />
          <Column field="reporter" header="檢舉者" sortable />
          <Column field="status" header="狀態" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.status === 'pending' ? '待處理' : '已處理'" 
                :severity="data.status === 'pending' ? 'warning' : 'success'"
              />
            </template>
          </Column>
          <Column field="created_at" header="檢舉時間" sortable>
            <template #body="{ data }">
              {{ new Date(data.created_at).toLocaleDateString() }}
            </template>
          </Column>
                     <Column header="操作">
             <template #body="{ data: _data }">
               <div class="flex gap-2">
                 <Button label="處理" size="small" />
                 <Button label="駁回" size="small" severity="secondary" />
               </div>
             </template>
           </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '檢舉管理'
  admin: true
</route>