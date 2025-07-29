<template>
  <div class="comment-form">
    <h3 v-if="!parentId" class="text-lg font-semibold mb-3">新增留言</h3>
    <div class="flex flex-col gap-3">
      <Textarea
        v-model="content"
        :placeholder="placeholder"
        rows="3"
        class="w-full"
        :maxlength="maxLength"
        @keydown.ctrl.enter="handleSubmit"
        @keydown.meta.enter="handleSubmit"
        @keydown.esc="handleCancel"
        ref="textareaRef"
      />
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <small class="text-gray-500"
            >{{ content.length }}/{{ maxLength }}</small
          >
          <small v-if="showTip" class="text-gray-400 text-xs">
            提示：Ctrl + Enter 快速發表
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
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import commentService from '@/services/commentService'

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
const textareaRef = ref(null)

// 監聽內容變化，自動調整高度
watch(content, () => {
  // 可以在這裡添加自動調整 textarea 高度的邏輯
})

// 處理取消
const handleCancel = () => {
  content.value = ''
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

    isSubmitting.value = true

    const commentData = {
      content: content.value.trim(),
      meme_id: props.memeId,
      user_id: userStore.userId,
      type: 'meme',
    }

    // 如果是回復，加入 parent_id
    if (props.parentId) {
      commentData.parent_id = props.parentId
    }

    console.log('提交留言資料:', commentData)

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
}

// 聚焦到輸入框
const focus = () => {
  if (textareaRef.value) {
    textareaRef.value.$el.focus()
  }
}

// 暴露方法給父組件
defineExpose({
  clearForm,
  focus,
})
</script>

<style scoped>
.comment-form {
  /* 可以添加特定的樣式 */
}

/* 自定義 textarea 樣式 */
:deep(.p-textarea) {
  min-height: 80px;
  resize: vertical;
}

:deep(.p-textarea:focus) {
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 0.2rem var(--p-primary-color-alpha-20);
}
</style>
