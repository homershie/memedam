<template>
  <div class="comment-form">
    <h3 v-if="!parentId" class="text-lg font-semibold mb-3">新增留言</h3>
    <div class="flex flex-col gap-3">
      <MentionInput
        v-model="content"
        :placeholder="placeholder"
        :max-length="maxLength"
        @mention-selected="handleMentionSelected"
        @submit="handleSubmit"
        @cancel="handleCancel"
        ref="mentionInputRef"
      />
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <small class="text-gray-500"
            >{{ content.length }}/{{ maxLength }}</small
          >
          <small v-if="showTip" class="text-gray-400 text-xs">
            提示：Ctrl + Enter 快速發表，輸入@可提及用戶
          </small>
        </div>
        <div class="flex gap-2">
          <Button
            v-if="parentId"
            label="取消"
            severity="secondary"
            size="small"
            @click="handleCancel"
          />
          <Button
            :label="parentId ? '發表回復' : '發表留言'"
            icon="pi pi-send"
            :disabled="!content.trim() || isSubmitting"
            :loading="isSubmitting"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import Button from 'primevue/button'
import commentService from '@/services/commentService'
import MentionInput from './MentionInput.vue'
import { extractMentionedUsernames } from '@/utils/mentionUtils'

/**
 * @typedef {Object} User
 * @property {string} _id - 用戶ID
 * @property {string} username - 用戶名
 * @property {string} [displayName] - 顯示名稱
 * @property {string} [avatar] - 頭像URL
 */

/**
 * @typedef {Object} Props
 * @property {string|Object} memeId - 迷因ID
 * @property {string|Object|null} [parentId] - 父留言ID
 * @property {number} [maxLength] - 最大長度
 * @property {boolean} [showTip] - 是否顯示提示
 * @property {string} [placeholder] - 佔位符文字
 */

const props = defineProps({
  memeId: {
    type: [String, Object],
    required: true,
  },
  parentId: {
    type: [String, Object],
    default: null,
  },
  maxLength: {
    type: Number,
    default: 500,
  },
  showTip: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '寫下您的留言...',
  },
})

const emit = defineEmits(['submitted', 'error', 'cancel'])

const toast = useToast()
const userStore = useUserStore()

// 響應式數據
const content = ref('')
const isSubmitting = ref(false)
const mentionInputRef = ref(null)
const mentionedUsers = ref([])

// 監聽內容變化，提取@提及的用戶
watch(content, (newContent) => {
  if (newContent) {
    const mentioned = extractMentionedUsernames(newContent)
    mentionedUsers.value = mentioned
  } else {
    mentionedUsers.value = []
  }
})

// 處理取消
const handleCancel = () => {
  content.value = ''
  mentionedUsers.value = []

  // 清空 MentionInput 組件的內容
  if (mentionInputRef.value) {
    mentionInputRef.value.clear()
  }

  emit('cancel')
}

// 提交留言
const handleSubmit = async () => {
  try {
    if (!content.value.trim()) {
      toast.add({
        severity: 'warn',
        summary: '提示',
        detail: '請輸入留言內容',
        life: 3000,
      })
      return
    }

    if (content.value.length > props.maxLength) {
      toast.add({
        severity: 'warn',
        summary: '提示',
        detail: `留言內容不能超過 ${props.maxLength} 字`,
        life: 3000,
      })
      return
    }

    // 檢查用戶是否已登入
    if (!userStore.userId) {
      toast.add({
        severity: 'warn',
        summary: '提示',
        detail: '請先登入後再發表留言',
        life: 3000,
      })
      return
    }

    isSubmitting.value = true

    const commentData = {
      content: content.value.trim(),
      meme_id: props.memeId,
      user_id: userStore.userId,
      type: 'meme',
      mentioned_users: mentionedUsers.value, // 新增：包含@提及的用戶
    }

    // 如果是回復，加入 parent_id
    if (props.parentId) {
      commentData.parent_id = props.parentId
    }

    const response = await commentService.create(commentData)

    if (response.data) {
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: props.parentId ? '回復發表成功' : '留言發表成功',
        life: 3000,
      })

      // 清空表單
      content.value = ''
      mentionedUsers.value = []

      // 清空 MentionInput 組件的內容
      if (mentionInputRef.value) {
        mentionInputRef.value.clear()
      }

      // 通知父組件
      emit('submitted', response.data)
    }
  } catch (error) {
    console.error('發表留言失敗:', error)

    const errorMessage =
      error.response?.data?.message || '發表留言失敗，請稍後再試'

    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })

    // 通知父組件錯誤
    emit('error', error)
  } finally {
    isSubmitting.value = false
  }
}

// 清空表單
const clearForm = () => {
  content.value = ''
  mentionedUsers.value = []
}

// 聚焦到輸入框
const focus = () => {
  if (mentionInputRef.value) {
    mentionInputRef.value.focus()
  }
}

// 暴露方法給父組件
defineExpose({
  clearForm,
  focus,
  insertMention: (username) => {
    if (mentionInputRef.value) {
      mentionInputRef.value.insertMention(username)
    }
  },
})
</script>
