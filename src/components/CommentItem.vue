<template>
  <div class="comment-item border border-gray-200 rounded-lg p-4 bg-white">
    <!-- 留言頭部 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <Avatar
          :image="getUserInfo(comment).avatar"
          :icon="!getUserInfo(comment).avatar ? 'pi pi-user' : undefined"
          shape="circle"
          size="normal"
          class="border border-gray-200"
        />
        <div>
          <div class="font-semibold text-gray-800">
            {{
              getUserInfo(comment).display_name ||
              getUserInfo(comment).username ||
              '匿名用戶'
            }}
          </div>
          <div class="text-xs text-gray-500">
            {{ formatTime(comment.createdAt || comment.created_at) }}
            <span
              v-if="
                comment.updatedAt && comment.updatedAt !== comment.createdAt
              "
            >
              · 已編輯
            </span>
          </div>
        </div>
      </div>

      <!-- 操作選單 -->
      <div v-if="canEdit || canDelete" class="relative">
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          text
          size="small"
          @click="showMenu"
          ref="menuTrigger"
        />
        <OverlayPanel ref="menuRef">
          <div class="flex flex-col min-w-[100px]">
            <Button
              v-if="canEdit"
              label="編輯"
              icon="pi pi-pencil"
              text
              severity="contrast"
              size="small"
              class="justify-start w-full"
              @click="startEdit"
            />
            <Button
              v-if="canDelete"
              label="刪除"
              icon="pi pi-trash"
              text
              severity="danger"
              size="small"
              class="justify-start w-full"
              @click="confirmDelete"
            />
          </div>
        </OverlayPanel>
      </div>
    </div>

    <!-- 留言內容 -->
    <div v-if="!isEditing" class="text-gray-700 leading-relaxed">
      {{ comment.content }}
    </div>

    <!-- 編輯模式 -->
    <div v-else class="space-y-3">
      <Textarea
        v-model="editContent"
        rows="3"
        class="w-full"
        :maxlength="500"
        @keydown.esc="cancelEdit"
      />
      <div class="flex justify-between items-center">
        <small class="text-gray-500">{{ editContent.length }}/500</small>
        <div class="flex gap-2">
          <Button
            label="取消"
            severity="secondary"
            size="small"
            @click="cancelEdit"
          />
          <Button
            label="儲存"
            size="small"
            :disabled="!editContent.trim() || editContent === comment.content"
            @click="saveEdit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useUserStore } from '@/stores/userStore'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import OverlayPanel from 'primevue/overlaypanel'
import { getId, formatPublishedTime } from '@/utils/dataUtils'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete', 'edit'])

const confirm = useConfirm()
const userStore = useUserStore()

// 響應式數據
const isEditing = ref(false)
const editContent = ref('')
const menuRef = ref(null)

// 獲取用戶資訊的統一方法
const getUserInfo = (comment) => {
  // 檢查新的資料結構（populate 後的）
  if (
    comment.user_id &&
    typeof comment.user_id === 'object' &&
    comment.user_id._id
  ) {
    return comment.user_id
  }

  // 檢查舊的資料結構（如果還有 author 欄位）
  if (comment.author && typeof comment.author === 'object') {
    return comment.author
  }

  // 預設值
  return {
    _id: comment.user_id,
    username: '匿名用戶',
    display_name: '匿名用戶',
    avatar: null,
  }
}

// 計算屬性
const canEdit = computed(() => {
  const currentUserId = getId(userStore.userId)
  const commentUserId = getId(getUserInfo(props.comment)._id)
  return currentUserId && commentUserId && currentUserId === commentUserId
})

const canDelete = computed(() => {
  const currentUserId = getId(userStore.userId)
  const commentUserId = getId(getUserInfo(props.comment)._id)
  const role = userStore.role
  return (
    role === 'admin' ||
    (currentUserId && commentUserId && currentUserId === commentUserId)
  )
})

// 格式化時間
const formatTime = (timestamp) => {
  if (!timestamp) return '未知時間'
  return formatPublishedTime({ created_at: timestamp })
}

// 顯示選單
const showMenu = (event) => {
  menuRef.value.toggle(event)
}

// 開始編輯
const startEdit = () => {
  isEditing.value = true
  editContent.value = props.comment.content
  menuRef.value.hide()
}

// 取消編輯
const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

// 儲存編輯
const saveEdit = () => {
  if (
    !editContent.value.trim() ||
    editContent.value === props.comment.content
  ) {
    return
  }

  emit('edit', {
    id: props.comment._id || props.comment.id,
    content: editContent.value.trim(),
  })

  isEditing.value = false
  editContent.value = ''
}

// 確認刪除
const confirmDelete = (event) => {
  menuRef.value.hide()

  confirm.require({
    target: event?.currentTarget || undefined,
    message: '確定要刪除這則留言嗎？',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '刪除',
    rejectLabel: '取消',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('delete', props.comment._id || props.comment.id)
    },
  })
}
</script>

<style scoped>
.comment-item {
  transition: box-shadow 0.2s ease;
}

.comment-item:hover {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
}
</style>
