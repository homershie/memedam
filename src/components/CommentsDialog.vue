<template>
  <div class="comments-dialog p-4">
    <!-- 留言表單 -->
    <div class="mb-6">
      <CommentForm
        :meme-id="memeId"
        @submitted="onCommentSubmitted"
        @error="onCommentError"
      />
    </div>

    <Divider />

    <!-- 留言列表 -->
    <div class="mt-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">留言 ({{ comments.length }})</h3>
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          text
          @click="loadComments"
          v-tooltip.top="'重新整理'"
        />
      </div>

      <!-- 載入狀態 -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <ProgressSpinner size="40" />
      </div>

      <!-- 無留言 -->
      <div
        v-else-if="comments.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <i class="pi pi-comment text-3xl mb-2"></i>
        <p>還沒有留言，成為第一個留言的人吧！</p>
      </div>

      <!-- 留言列表 -->
      <div v-else class="space-y-4">
        <CommentItem
          v-for="comment in comments"
          :key="comment._id || comment.id"
          :comment="comment"
          @delete="deleteComment"
          @edit="editComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import commentService from '@/services/commentService'
import { getId } from '@/utils/dataUtils'

const dialogRef = inject('dialogRef')
const toast = useToast()

// 響應式數據
const comments = ref([])
const isLoading = ref(false)

// 從 dialog data 獲取 meme 資訊
const memeData = dialogRef.value.data
const memeId = memeData.memeId

// 載入留言
const loadComments = async () => {
  try {
    isLoading.value = true
    const response = await commentService.getAll()

    // 過濾出屬於當前迷因的留言
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      const filteredComments = response.data.data.filter((comment) => {
        const commentMemeId = getId(comment.meme_id)
        const currentMemeId = getId(memeId)
        return commentMemeId === currentMemeId
      })

      comments.value = filteredComments.sort(
        (a, b) =>
          new Date(b.createdAt || b.created_at) -
          new Date(a.createdAt || a.created_at),
      )
    } else {
      comments.value = []
    }
  } catch (error) {
    console.error('載入留言失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入留言失敗',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

// 處理留言提交成功
const onCommentSubmitted = async () => {
  await loadComments() // 重新載入留言列表

  // 通知父組件留言計數已更新
  const newCount = comments.value.length

  // 設置到 dialogRef.data（備選方案）
  if (dialogRef.value) {
    dialogRef.value.data.hasUpdates = true
    dialogRef.value.data.newCommentsCount = newCount
  }

  // 使用全局回調函數直接更新（主要方案）
  if (window.updateCommentsCount) {
    window.updateCommentsCount(newCount)
  }
}

// 處理留言提交錯誤
const onCommentError = (error) => {
  console.error('留言提交錯誤:', error)
  // 錯誤已經在 CommentForm 中處理了，這裡可以做額外的處理
}

// 刪除留言
const deleteComment = async (commentId) => {
  try {
    await commentService.remove(commentId)
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '留言已刪除',
      life: 3000,
    })
    await loadComments()

    // 通知父組件留言計數已更新
    const newCount = comments.value.length

    // 設置到 dialogRef.data（備選方案）
    if (dialogRef.value) {
      dialogRef.value.data.hasUpdates = true
      dialogRef.value.data.newCommentsCount = newCount
    }

    // 使用全局回調函數直接更新（主要方案）
    if (window.updateCommentsCount) {
      window.updateCommentsCount(newCount)
    }
  } catch (error) {
    console.error('刪除留言失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '刪除留言失敗',
      life: 3000,
    })
  }
}

// 編輯留言
const editComment = async (commentData) => {
  try {
    await commentService.update(commentData.id, {
      content: commentData.content,
    })
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '留言已更新',
      life: 3000,
    })
    await loadComments()

    // 編輯不會改變留言數量，但仍標記有更新
    if (dialogRef.value) {
      dialogRef.value.data.hasUpdates = true
      // 編輯不改變計數，所以不需要更新 newCommentsCount
    }
  } catch (error) {
    console.error('編輯留言失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '編輯留言失敗',
      life: 3000,
    })
  }
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comments-dialog {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}
</style>
