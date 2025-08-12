<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminUsers'
})



import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const users = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的用戶服務
    // const response = await userService.getAll()
    // users.value = response.data.users
    
    // 暫時模擬數據
    users.value = [
      { id: 1, username: 'admin', email: 'admin@memedam.com', role: 'admin', status: 'active' },
      { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', status: 'active' },
      { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', status: 'banned' },
    ]
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入用戶數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="admin-users">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        用戶管理
      </h1>
      <Button label="新增用戶" icon="pi pi-plus" />
    </div>

    <Card>
      <template #content>
        <DataTable
          :value="users"
          :loading="loading"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          class="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" sortable />
          <Column field="username" header="用戶名" sortable />
          <Column field="email" header="電子郵件" sortable />
          <Column field="role" header="角色" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.role" 
                :severity="data.role === 'admin' ? 'danger' : 'info'"
              />
            </template>
          </Column>
          <Column field="status" header="狀態" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.status === 'active' ? '正常' : '封禁'" 
                :severity="data.status === 'active' ? 'success' : 'danger'"
              />
            </template>
          </Column>
                     <Column header="操作">
             <template #body="{ data: _data }">
               <div class="flex gap-2">
                 <Button icon="pi pi-pencil" size="small" text />
                 <Button icon="pi pi-ban" size="small" text severity="danger" />
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
  title: '用戶管理'
  admin: true
</route>