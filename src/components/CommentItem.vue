<template>
  <div
    :class="[
      'comment-item border rounded-lg p-4 transition-all duration-200',
      isReply
        ? 'border-blue-100 bg-blue-50/30 hover:bg-blue-50/50'
        : 'border-gray-200 bg-white hover:shadow-md',
    ]"
  >
    <!-- 回復標示 -->
    <div
      v-if="isReply"
      class="flex items-center gap-2 mb-2 text-xs text-blue-600"
    >
      <i class="pi pi-reply text-xs"></i>
      <span>回復留言</span>
    </div>

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
          <router-link
            v-if="getUserInfo(comment)._id"
            :to="`/users/${getUserInfo(comment)._id}`"
            class="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer block"
          >
            {{
              getUserInfo(comment).display_name ||
              getUserInfo(comment).username ||
              '匿名用戶'
            }}
          </router-link>
          <div v-else class="font-semibold text-gray-800">匿名用戶</div>
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

    <!-- 回復和點讚區域 -->
    <div v-if="!isEditing && !isReply" class="mt-3 flex items-center gap-4">
      <!-- 回復按鈕 -->
      <Button
        label="回復"
        icon="pi pi-reply"
        size="small"
        severity="secondary"
        text
        @click="toggleReplyForm"
      />

      <!-- 顯示回復數量 -->
      <span v-if="comment.reply_count > 0" class="text-sm text-gray-500">
        {{ comment.reply_count }} 則回復
      </span>
    </div>

    <!-- 回復表單 -->
    <div v-if="showReplyForm && !isEditing" class="mt-4 pl-12">
      <CommentForm
        :meme-id="memeId"
        :parent-id="comment._id || comment.id"
        :max-length="500"
        :show-tip="false"
        placeholder="回復這則留言..."
        @submitted="onReplySubmitted"
        @cancel="cancelReply"
        ref="replyFormRef"
      />
    </div>

    <!-- 回復列表 -->
    <div v-if="replies && replies.length > 0" class="mt-4 pl-4 space-y-3">
      <div class="border-l-2 border-blue-200 pl-4 space-y-3">
        <CommentItem
          v-for="reply in replies"
          :key="reply._id || reply.id"
          :comment="reply"
          :meme-id="memeId"
          :is-reply="true"
          @delete="$emit('delete', $event)"
          @edit="$emit('edit', $event)"
          @reply-submitted="$emit('reply-submitted', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useUserStore } from '@/stores/userStore'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import OverlayPanel from 'primevue/overlaypanel'
import CommentForm from './CommentForm.vue'
import { getId, formatPublishedTime } from '@/utils/dataUtils'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  memeId: {
    type: [String, Object],
    required: true,
  },
  replies: {
    type: Array,
    default: () => [],
  },
  isReply: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'edit', 'reply-submitted'])

const confirm = useConfirm()
const userStore = useUserStore()

// 響應式數據
const isEditing = ref(false)
const editContent = ref('')
const menuRef = ref(null)
const showReplyForm = ref(false)
const replyFormRef = ref(null)

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

// 切換回復表單
const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value
  if (showReplyForm.value) {
    // 使用 nextTick 確保 DOM 更新後再聚焦
    nextTick(() => {
      if (replyFormRef.value) {
        replyFormRef.value.focus()
      }
    })
  }
}

// 取消回復
const cancelReply = () => {
  showReplyForm.value = false
}

// 回復提交成功
const onReplySubmitted = (reply) => {
  showReplyForm.value = false
  emit('reply-submitted', {
    parentComment: props.comment,
    reply: reply,
  })
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
/* 自定義樣式可以在這裡添加 */
</style>
