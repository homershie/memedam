<script setup>
import { onMounted, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import { useAdminStore } from '@/stores/adminStore'

// Define component name to fix linter error
defineOptions({
  name: 'AdminUsers'
})

// Store and toast
const adminStore = useAdminStore()
const toast = useToast()

// Refs
const dt = ref()
const selectedUsers = ref([])
const userDialog = ref(false)
const deleteUserDialog = ref(false)
const deleteUsersDialog = ref(false)
const currentUser = ref({})
const submitted = ref(false)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  role: { value: null, matchMode: FilterMatchMode.EQUALS }
})

// 用戶狀態選項
const statusOptions = ref([
  { label: '活躍', value: 'active' },
  { label: '已封鎖', value: 'banned' },
  { label: '不活躍', value: 'inactive' }
])

// 用戶角色選項
const roleOptions = ref([
  { label: '管理員', value: 'admin' },
  { label: '版主', value: 'moderator' },
  { label: '用戶', value: 'user' }
])

// 計算屬性
const users = computed(() => adminStore.users)
const loading = computed(() => adminStore.usersLoading)

// 載入數據
onMounted(async () => {
  await loadUsers()
})

// 方法
const loadUsers = async () => {
  try {
    await adminStore.loadUsers()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入用戶數據失敗',
      life: 3000
    })
  }
}

const getStatusSeverity = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'banned':
      return 'danger'
    case 'inactive':
      return 'secondary'
    default:
      return 'info'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return '活躍'
    case 'banned':
      return '已封鎖'
    case 'inactive':
      return '不活躍'
    default:
      return status
  }
}

const getRoleLabel = (role) => {
  switch (role) {
    case 'admin':
      return '管理員'
    case 'moderator':
      return '版主'
    case 'user':
      return '用戶'
    default:
      return role
  }
}

const getRoleSeverity = (role) => {
  switch (role) {
    case 'admin':
      return 'danger'
    case 'moderator':
      return 'warn'
    case 'user':
      return 'info'
    default:
      return 'secondary'
  }
}

const openNew = () => {
  currentUser.value = {
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  }
  submitted.value = false
  userDialog.value = true
}

const editUser = (user) => {
  currentUser.value = { ...user }
  userDialog.value = true
}

const hideDialog = () => {
  userDialog.value = false
  submitted.value = false
  currentUser.value = {}
}

const saveUser = async () => {
  submitted.value = true

  if (currentUser.value.username?.trim() && currentUser.value.email?.trim()) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      if (currentUser.value.id) {
        // 更新用戶
        const index = users.value.findIndex(u => u.id === currentUser.value.id)
        if (index !== -1) {
          users.value[index] = { ...currentUser.value }
        }
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '用戶更新成功',
          life: 3000
        })
      } else {
        // 新增用戶
        const newUser = {
          ...currentUser.value,
          id: Math.max(...users.value.map(u => u.id), 0) + 1,
          created_at: new Date().toISOString(),
          posts_count: 0
        }
        users.value.push(newUser)
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '用戶創建成功',
          life: 3000
        })
      }

      userDialog.value = false
      currentUser.value = {}
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '操作失敗',
        life: 3000
      })
    }
  }
}

const banUser = async (user) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = 'banned'
    }
    
    toast.add({
      severity: 'info',
      summary: '已封鎖',
      detail: `用戶 ${user.username} 已被封鎖`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '封鎖失敗',
      life: 3000
    })
  }
}

const unbanUser = async (user) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = 'active'
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `用戶 ${user.username} 已解除封鎖`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '解除封鎖失敗',
      life: 3000
    })
  }
}

const confirmDeleteUser = (user) => {
  currentUser.value = user
  deleteUserDialog.value = true
}

const deleteUser = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
    
    deleteUserDialog.value = false
    currentUser.value = {}
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '用戶已刪除',
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
  deleteUsersDialog.value = true
}

const deleteSelectedUsers = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    selectedUsers.value.forEach(selectedUser => {
      const index = users.value.findIndex(u => u.id === selectedUser.id)
      if (index !== -1) {
        users.value.splice(index, 1)
      }
    })
    
    deleteUsersDialog.value = false
    selectedUsers.value = []
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '選中的用戶已刪除',
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
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1 class="admin-page-title">用戶管理</h1>
      <p class="admin-page-description">管理平台上的所有用戶帳號</p>
    </div>

    <div class="admin-content-card">
      <!-- 工具列 -->
      <Toolbar class="mb-6">
        <template #start>
          <Button 
            label="新增用戶" 
            icon="pi pi-plus" 
            severity="secondary" 
            class="mr-2" 
            @click="openNew" 
          />
          <Button 
            label="批量刪除" 
            icon="pi pi-trash" 
            severity="danger" 
            @click="confirmDeleteSelected" 
            :disabled="!selectedUsers || !selectedUsers.length" 
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
            @click="loadUsers"
            :loading="loading"
          />
        </template>
      </Toolbar>

      <!-- 數據表格 -->
      <DataTable
        ref="dt"
        v-model:selection="selectedUsers"
        :value="users"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 項用戶"
      >
        <template #header>
          <div class="flex flex-wrap gap-4 items-center justify-between">
            <h4 class="m-0 text-lg font-semibold">用戶列表</h4>
            <div class="flex gap-2">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText 
                  v-model="filters['global'].value" 
                  placeholder="搜尋用戶..." 
                />
              </IconField>
              <Select
                v-model="filters['status'].value"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="篩選狀態"
                :showClear="true"
                class="min-w-[120px]"
              />
              <Select
                v-model="filters['role'].value"
                :options="roleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="篩選角色"
                :showClear="true"
                class="min-w-[120px]"
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
        
        <Column field="username" header="用戶名" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <span class="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  {{ slotProps.data.username.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="font-medium">{{ slotProps.data.username }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="email" header="電子郵箱" sortable style="min-width: 16rem">
          <template #body="slotProps">
            <span class="text-gray-600 dark:text-gray-400">{{ slotProps.data.email }}</span>
          </template>
        </Column>
        
        <Column field="role" header="角色" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <Tag 
              :value="getRoleLabel(slotProps.data.role)" 
              :severity="getRoleSeverity(slotProps.data.role)" 
            />
          </template>
        </Column>
        
        <Column field="status" header="狀態" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <Tag 
              :value="getStatusLabel(slotProps.data.status)" 
              :severity="getStatusSeverity(slotProps.data.status)" 
            />
          </template>
        </Column>
        
        <Column field="posts_count" header="貼文數" sortable style="min-width: 8rem">
          <template #body="slotProps">
            <span>{{ slotProps.data.posts_count || 0 }}</span>
          </template>
        </Column>
        
        <Column field="created_at" header="註冊時間" sortable style="min-width: 12rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>
        
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <div class="table-actions">
              <Button 
                icon="pi pi-pencil" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn" 
                @click="editUser(slotProps.data)"
                v-tooltip="'編輯'"
              />
              <Button 
                v-if="slotProps.data.status === 'active'"
                icon="pi pi-ban" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn danger" 
                @click="banUser(slotProps.data)"
                v-tooltip="'封鎖'"
              />
              <Button 
                v-if="slotProps.data.status === 'banned'"
                icon="pi pi-check" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn success" 
                @click="unbanUser(slotProps.data)"
                v-tooltip="'解除封鎖'"
              />
              <Button 
                icon="pi pi-trash" 
                outlined 
                rounded 
                size="small"
                class="table-action-btn danger" 
                @click="confirmDeleteUser(slotProps.data)"
                v-tooltip="'刪除'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 用戶編輯對話框 -->
    <Dialog 
      v-model:visible="userDialog" 
      :style="{ width: '450px' }" 
      :header="currentUser.id ? '編輯用戶' : '新增用戶'" 
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="username" class="block font-bold mb-3">用戶名</label>
          <InputText 
            id="username" 
            v-model.trim="currentUser.username" 
            required 
            autofocus 
            :invalid="submitted && !currentUser.username" 
            fluid 
          />
          <small v-if="submitted && !currentUser.username" class="text-red-500">
            用戶名為必填項。
          </small>
        </div>
        
        <div>
          <label for="email" class="block font-bold mb-3">電子郵箱</label>
          <InputText 
            id="email" 
            v-model.trim="currentUser.email" 
            type="email"
            required 
            :invalid="submitted && !currentUser.email" 
            fluid 
          />
          <small v-if="submitted && !currentUser.email" class="text-red-500">
            電子郵箱為必填項。
          </small>
        </div>
        
        <div>
          <label for="role" class="block font-bold mb-3">角色</label>
          <Select 
            id="role" 
            v-model="currentUser.role" 
            :options="roleOptions" 
            optionLabel="label" 
            optionValue="value"
            placeholder="選擇角色" 
            fluid 
          />
        </div>
        
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Select 
            id="status" 
            v-model="currentUser.status" 
            :options="statusOptions" 
            optionLabel="label" 
            optionValue="value"
            placeholder="選擇狀態" 
            fluid 
          />
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <!-- 刪除確認對話框 -->
    <Dialog 
      v-model:visible="deleteUserDialog" 
      :style="{ width: '450px' }" 
      header="確認刪除" 
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
        <span v-if="currentUser">
          確定要刪除用戶 <b>{{ currentUser.username }}</b> 嗎？
        </span>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="deleteUserDialog = false" />
        <Button label="確定" icon="pi pi-check" severity="danger" @click="deleteUser" />
      </template>
    </Dialog>

    <!-- 批量刪除確認對話框 -->
    <Dialog 
      v-model:visible="deleteUsersDialog" 
      :style="{ width: '450px' }" 
      header="確認批量刪除" 
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500" />
        <span>確定要刪除選中的 {{ selectedUsers.length }} 個用戶嗎？</span>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" @click="deleteUsersDialog = false" />
        <Button label="確定" icon="pi pi-check" severity="danger" @click="deleteSelectedUsers" />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '用戶管理'
  admin: true
</route>