<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminUsers',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

onMounted(() => {
  loadUsers()
})

const toast = useToast()
const dt = ref()
const users = ref([])
const userDialog = ref(false)
const deleteUserDialog = ref(false)
const deleteUsersDialog = ref(false)
const user = ref({})
const selectedUsers = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  role: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const submitted = ref(false)
const loading = ref(false)

const statuses = ref([
  { label: '正常', value: 'active' },
  { label: '封禁', value: 'banned' },
  { label: '待驗證', value: 'pending' },
])

const roles = ref([
  { label: '首席迷因長', value: 'admin' },
  { label: '一般用戶', value: 'user' },
  { label: '營銷經理', value: 'manager' },
])

const loadUsers = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的用戶服務
    // const response = await userService.getAll()
    // users.value = response.data.users

    // 暫時模擬數據
    users.value = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@memedam.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-15T10:30:00Z',
        memeCount: 0,
        likeCount: 0,
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-10T00:00:00Z',
        lastLogin: '2024-01-15T09:15:00Z',
        memeCount: 15,
        likeCount: 45,
      },
      {
        id: 3,
        username: 'user2',
        email: 'user2@example.com',
        role: 'user',
        status: 'banned',
        createdAt: '2024-01-05T00:00:00Z',
        lastLogin: '2024-01-14T16:20:00Z',
        memeCount: 8,
        likeCount: 12,
      },
      {
        id: 4,
        username: 'manager1',
        email: 'manager@memedam.com',
        role: 'manager',
        status: 'active',
        createdAt: '2024-01-08T00:00:00Z',
        lastLogin: '2024-01-15T11:45:00Z',
        memeCount: 25,
        likeCount: 89,
      },
    ]
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入用戶數據失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

function openNew() {
  user.value = {}
  submitted.value = false
  userDialog.value = true
}

function hideDialog() {
  userDialog.value = false
  submitted.value = false
}

function saveUser() {
  submitted.value = true

  if (user?.value.username?.trim() && user?.value.email?.trim()) {
    if (user.value.id) {
      users.value[findIndexById(user.value.id)] = user.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '用戶已更新',
        life: 3000,
      })
    } else {
      user.value.id = createId()
      user.value.createdAt = new Date().toISOString()
      users.value.push(user.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '用戶已建立',
        life: 3000,
      })
    }

    userDialog.value = false
    user.value = {}
  }
}

function editUser(userItem) {
  user.value = { ...userItem }
  userDialog.value = true
}

function confirmDeleteUser(userItem) {
  user.value = userItem
  deleteUserDialog.value = true
}

function deleteUser() {
  users.value = users.value.filter((val) => val.id !== user.value.id)
  deleteUserDialog.value = false
  user.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '用戶已刪除',
    life: 3000,
  })
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < users.value.length; i++) {
    if (users.value[i].id === id) {
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
  deleteUsersDialog.value = true
}

function deleteSelectedUsers() {
  users.value = users.value.filter((val) => !selectedUsers.value.includes(val))
  deleteUsersDialog.value = false
  selectedUsers.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '選取的用戶已刪除',
    life: 3000,
  })
}

function getStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'success'
    case 'banned':
      return 'danger'
    case 'pending':
      return 'warn'
    default:
      return null
  }
}

function getRoleLabel(role) {
  switch (role) {
    case 'admin':
      return 'danger'
    case 'manager':
      return 'warn'
    case 'user':
      return 'secondary'
    default:
      return null
  }
}

function banUser(userId) {
  const userIndex = findIndexById(userId)
  if (userIndex !== -1) {
    users.value[userIndex].status = 'banned'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '用戶已被封禁',
      life: 3000,
    })
  }
}

function unbanUser(userId) {
  const userIndex = findIndexById(userId)
  if (userIndex !== -1) {
    users.value[userIndex].status = 'active'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '用戶已解除封禁',
      life: 3000,
    })
  }
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="新增用戶"
            icon="pi pi-plus"
            severity="primary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedUsers || !selectedUsers.length"
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
        v-model:selection="selectedUsers"
        :value="users"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        tableStyle="width: 100%; table-layout: auto;"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個用戶"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理用戶</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋用戶..."
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
          field="username"
          header="用戶名"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="email"
          header="電子郵件"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column field="role" header="角色" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.role === 'admin'
                  ? '首席迷因長'
                  : slotProps.data.role === 'manager'
                    ? '營銷經理'
                    : '一般用戶'
              "
              :severity="getRoleLabel(slotProps.data.role)"
            />
          </template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.status === 'active'
                  ? '正常'
                  : slotProps.data.status === 'banned'
                    ? '封禁'
                    : '待驗證'
              "
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>
        <Column
          field="memeCount"
          header="迷因數"
          sortable
          style="min-width: 8rem"
        ></Column>
        <Column
          field="createdAt"
          header="註冊時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column
          field="lastLogin"
          header="最後登入"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.lastLogin).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="editUser(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'active'"
              icon="pi pi-ban"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="banUser(slotProps.data.id)"
            />
            <Button
              v-else-if="slotProps.data.status === 'banned'"
              icon="pi pi-check"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="unbanUser(slotProps.data.id)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="secondary"
              @click="confirmDeleteUser(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      header="用戶詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="username" class="block font-bold mb-3">用戶名</label>
          <InputText
            id="username"
            v-model.trim="user.username"
            required="true"
            autofocus
            :invalid="submitted && !user.username"
            fluid
          />
          <small v-if="submitted && !user.username" class="text-red-500"
            >用戶名為必填項目。</small
          >
        </div>
        <div>
          <label for="email" class="block font-bold mb-3">電子郵件</label>
          <InputText
            id="email"
            v-model.trim="user.email"
            required="true"
            :invalid="submitted && !user.email"
            fluid
          />
          <small v-if="submitted && !user.email" class="text-red-500"
            >電子郵件為必填項目。</small
          >
        </div>
        <div>
          <label for="role" class="block font-bold mb-3">角色</label>
          <Select
            id="role"
            v-model="user.role"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇角色"
            fluid
          ></Select>
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Select
            id="status"
            v-model="user.status"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          ></Select>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="user"
          >您確定要刪除用戶 <b>{{ user.username }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteUserDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteUser" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteUsersDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的用戶嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteUsersDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedUsers"
        />
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
