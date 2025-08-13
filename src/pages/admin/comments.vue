<script setup>
defineOptions({
  name: 'AdminComments',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const dt = ref()
const comments = ref([])
const commentDialog = ref(false)
const deleteCommentDialog = ref(false)
const deleteCommentsDialog = ref(false)
const comment = ref({})
const selectedComments = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const submitted = ref(false)
const loading = ref(false)

const statuses = ref([
  { label: '可見', value: 'visible' },
  { label: '隱藏', value: 'hidden' },
  { label: '待審核', value: 'pending' },
  { label: '已標記', value: 'flagged' },
])

const loadComments = async () => {
  loading.value = true
  try {
    // 模擬評論資料
    comments.value = [
      {
        id: 'C-1001',
        content: '這個迷因太好笑了！',
        memeTitle: '經典迷因 1',
        author: { username: 'user1' },
        status: 'visible',
        likeCount: 12,
        replyCount: 2,
        createdAt: '2024-01-14T10:30:00Z',
      },
      {
        id: 'C-1000',
        content: '內容有點不妥，已檢舉。',
        memeTitle: '熱門迷因 2',
        author: { username: 'user2' },
        status: 'flagged',
        likeCount: 1,
        replyCount: 0,
        createdAt: '2024-01-13T15:12:00Z',
      },
      {
        id: 'C-0999',
        content: '請問有原圖嗎？',
        memeTitle: '冷門迷因 3',
        author: { username: 'user3' },
        status: 'pending',
        likeCount: 0,
        replyCount: 1,
        createdAt: '2024-01-12T08:45:00Z',
      },
      {
        id: 'C-0998',
        content: '已隱藏的測試評論',
        memeTitle: '經典迷因 4',
        author: { username: 'moderator' },
        status: 'hidden',
        likeCount: 0,
        replyCount: 0,
        createdAt: '2024-01-11T21:05:00Z',
      },
    ]
  } catch (error) {
    console.error('載入評論失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入評論失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadComments()
})

function openNew() {
  comment.value = {}
  submitted.value = false
  commentDialog.value = true
}

function hideDialog() {
  commentDialog.value = false
  submitted.value = false
}

function saveComment() {
  submitted.value = true

  if (comment?.value.content?.trim()) {
    if (comment.value.id) {
      comments.value[findIndexById(comment.value.id)] = comment.value
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '評論已更新',
        life: 3000,
      })
    } else {
      comment.value.id = createId()
      comment.value.status = comment.value.status
        ? comment.value.status
        : 'visible'
      comment.value.createdAt = new Date().toISOString()
      comments.value.push(comment.value)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '評論已建立',
        life: 3000,
      })
    }

    commentDialog.value = false
    comment.value = {}
  }
}

function editComment(commentItem) {
  comment.value = { ...commentItem }
  commentDialog.value = true
}

function confirmDeleteComment(commentItem) {
  comment.value = commentItem
  deleteCommentDialog.value = true
}

function deleteComment() {
  comments.value = comments.value.filter((val) => val.id !== comment.value.id)
  deleteCommentDialog.value = false
  comment.value = {}
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '評論已刪除',
    life: 3000,
  })
}

function hideOne(commentId) {
  const idx = findIndexById(commentId)
  if (idx !== -1) {
    comments.value[idx].status = 'hidden'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已隱藏評論',
      life: 3000,
    })
  }
}

function unhideOne(commentId) {
  const idx = findIndexById(commentId)
  if (idx !== -1) {
    comments.value[idx].status = 'visible'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已顯示評論',
      life: 3000,
    })
  }
}

function findIndexById(id) {
  let index = -1
  for (let i = 0; i < comments.value.length; i++) {
    if (comments.value[i].id === id) {
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
  deleteCommentsDialog.value = true
}

function deleteSelectedComments() {
  comments.value = comments.value.filter(
    (val) => !selectedComments.value?.includes(val),
  )
  deleteCommentsDialog.value = false
  selectedComments.value = null
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '選取的評論已刪除',
    life: 3000,
  })
}

function getStatusSeverity(status) {
  switch (status) {
    case 'visible':
      return 'success'
    case 'hidden':
      return 'secondary'
    case 'pending':
      return 'warning'
    case 'flagged':
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
            label="新增評論"
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
            :disabled="!selectedComments || !selectedComments.length"
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
        v-model:selection="selectedComments"
        :value="comments"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 則評論"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">管理評論</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="搜尋評論..."
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <Column field="id" header="ID" sortable style="min-width: 6rem" />
        <Column field="content" header="內容" style="min-width: 16rem">
          <template #body="{ data }">
            {{
              data.content?.length > 60
                ? data.content.slice(0, 60) + '…'
                : data.content
            }}
          </template>
        </Column>
        <Column
          field="memeTitle"
          header="迷因"
          sortable
          style="min-width: 12rem"
        />
        <Column field="author" header="作者" sortable style="min-width: 10rem">
          <template #body="{ data }">{{
            data.author?.username || '未知'
          }}</template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <Tag
              :value="
                data.status === 'visible'
                  ? '可見'
                  : data.status === 'hidden'
                    ? '隱藏'
                    : data.status === 'pending'
                      ? '待審核'
                      : '已標記'
              "
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>
        <Column
          field="likeCount"
          header="讚"
          sortable
          style="min-width: 6rem"
        />
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
              class="mr-2"
              @click="editComment(data)"
            />
            <Button
              v-if="data.status !== 'hidden'"
              icon="pi pi-eye-slash"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="hideOne(data.id)"
            />
            <Button
              v-else
              icon="pi pi-eye"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="unhideOne(data.id)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteComment(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="commentDialog"
      :style="{ width: '500px' }"
      header="評論詳細"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="content" class="block font-bold mb-3">內容</label>
          <Textarea
            id="content"
            v-model.trim="comment.content"
            rows="4"
            fluid
            :invalid="submitted && !comment.content"
          />
          <small v-if="submitted && !comment.content" class="text-red-500"
            >內容為必填項目。</small
          >
        </div>
        <div>
          <label for="status" class="block font-bold mb-3">狀態</label>
          <Select
            id="status"
            v-model="comment.status"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇狀態"
            fluid
          />
        </div>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveComment" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCommentDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="comment">您確定要刪除評論嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteCommentDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteComment" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCommentsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的評論嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteCommentsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedComments"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '評論管理'
  admin: true
</route>
