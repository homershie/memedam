<template>
  <Card
    class="w-full relative cursor-pointer hover:shadow-lg transition-shadow"
    @click="navigateToDetail"
  >
    <template #header>
      <Button
        style="position: absolute; top: 10px; right: 10px; z-index: 10"
        icon="pi pi-ellipsis-h"
        severity="contrast"
        text
        rounded
        @click.stop="showMenu"
      />
      <div class="h-60 flex items-center justify-center overflow-hidden">
        <!-- 根據類型顯示不同內容 -->
        <div
          v-if="
            meme.cover_image ||
            (meme.type === 'image' && meme.image_url && meme.image_url.trim())
          "
          class="w-full h-full overflow-hidden rounded-t-lg"
        >
          <Image
            :src="meme.cover_image || meme.image_url"
            :alt="meme.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else-if="
            meme.type === 'video' && meme.video_url && meme.video_url.trim()
          "
          class="w-full h-full"
        >
          <!-- 外部影片平台 -->
          <div v-if="isExternalVideoUrl(meme.video_url)" class="w-full h-full">
            <iframe
              :src="getEmbedUrl(meme.video_url)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <!-- 一般影片 -->
          <video
            v-else
            controls
            class="w-full h-full object-cover"
            :poster="meme.image_url"
          >
            <source :src="meme.video_url" type="video/mp4" />
            您的瀏覽器不支援影片播放
          </video>
        </div>
        <div
          v-else-if="meme.type === 'audio' && meme.audio_url"
          class="w-full h-full overflow-hidden rounded-t-lg"
        >
          <!-- 外部音訊平台 -->
          <div v-if="isExternalAudioUrl(meme.audio_url)" class="w-full h-full">
            <iframe
              :src="getAudioEmbedUrl(meme.audio_url)"
              class="w-full h-full rounded-t-lg"
              frameborder="0"
              allow="autoplay"
            ></iframe>
          </div>
          <!-- 一般音訊檔案 -->
          <audio
            v-else
            controls
            class="w-full h-full object-cover rounded-t-lg"
            preload="metadata"
          >
            <source :src="meme.audio_url" type="audio/mpeg" />
            <source :src="meme.audio_url" type="audio/ogg" />
            <source :src="meme.audio_url" type="audio/wav" />
            您的瀏覽器不支援音訊播放
          </audio>
        </div>
        <div
          v-else-if="meme.type === 'gif' && meme.image_url"
          class="w-full h-full overflow-hidden rounded-t-lg"
        >
          <img
            :src="meme.image_url"
            :alt="meme.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else-if="meme.type === 'text'"
          class="w-full h-full overflow-hidden rounded-t-lg"
        >
          <!-- 裝飾性標題 -->
          <TextMemeCard
            :title="meme.title"
            variant="random"
            size="small"
            :hover-effect="false"
            :auto-resize="true"
          />
        </div>
        <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg"
        >
          <span class="text-gray-400 text-4xl">🖼️</span>
        </div>
      </div>
      <OverlayPanel ref="menuRef">
        <div class="flex flex-col min-w-[120px]">
          <Button
            label="檢舉"
            icon="pi pi-flag"
            text
            severity="contrast"
            class="justify-start w-full"
            @click="showReportDialog"
          />
          <Button
            v-if="canDelete"
            label="修改"
            icon="pi pi-pencil"
            text
            severity="contrast"
            class="justify-start w-full"
            @click="onEdit"
          />
          <Button
            v-if="canDelete"
            label="刪除"
            icon="pi pi-trash"
            text
            class="justify-start w-full"
            @click="showDeleteConfirm"
          />
        </div>
      </OverlayPanel>
    </template>

    <template #title>
      <div class="flex justify-start items-center gap-2">
        <h4 class="mb-1">{{ meme.title }}</h4>
        <span class="text-xs text-gray-400">· {{ publishedTime }}</span>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col h-60 min-h-48">
        <!-- 內容區域 -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <!-- 標籤 -->
          <div class="flex flex-wrap gap-2 mb-4" v-if="tags.length > 0">
            <Tag
              v-for="tag in tags.slice(0, 3)"
              :key="tag._id"
              :value="`#${tag.name}`"
              severity="primary"
              class="cursor-pointer"
              @click.stop="onTagClick(tag)"
            />
          </div>

          <p class="mb-4 line-clamp-5" v-if="meme.content">
            {{ meme.content }}
          </p>
        </div>

        <!-- 互動按鈕區域 -->
        <div class="flex-shrink-0 mt-auto">
          <Divider class="my-2" />
          <div class="flex justify-around text-gray-500 text-lg">
            <Button
              class="w-1/3"
              :icon="isLiked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'"
              :severity="isLiked ? 'primary' : 'secondary'"
              text
              :label="likesCount.toString()"
              @click.stop="toggleLike"
            />
            <Button
              class="w-1/3"
              :icon="
                isDisliked ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'
              "
              :severity="isDisliked ? 'success' : 'secondary'"
              text
              :label="dislikesCount.toString()"
              @click.stop="toggleDislike"
            />
            <Button
              class="w-1/3"
              icon="pi pi-comment"
              severity="secondary"
              text
              :label="commentsCount.toString()"
              @click.stop="showComments"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>

  <!-- 檢舉對話框 -->
  <ReportDialog
    v-model:visible="reportDialogVisible"
    target-type="meme"
    :target-id="memeId"
    :target-info="{
      type: 'meme',
      title: meme.title,
      author: meme.author?.display_name || meme.author?.username,
    }"
    @submitted="handleReportSubmitted"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog } from 'primevue/usedialog'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Image from 'primevue/image'
import OverlayPanel from 'primevue/overlaypanel'
import Divider from 'primevue/divider'
import TextMemeCard from './TextMemeCard.vue'
import CommentsDialog from './CommentsDialog.vue'
import ReportDialog from './ReportDialog.vue'
import { useUserStore } from '@/stores/userStore'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import memeTagService from '@/services/memeTagService'
import memeService from '@/services/memeService'

// 工具函數
import {
  getId,
  formatPublishedTime,
  getMemeId,
  getMemeSlug,
} from '@/utils/dataUtils'
import {
  isExternalVideoUrl,
  getEmbedUrl,
  isExternalAudioUrl,
  getAudioEmbedUrl,
} from '@/utils/mediaUtils'
import { requireLogin } from '@/utils/authUtils'

const props = defineProps({
  meme: {
    type: Object,
    required: true,
  },
})

// 調試資訊 - 檢查接收到的數據格式
// 可以在這裡添加更多調試資訊

const meme = props.meme
const emit = defineEmits(['tag-click', 'show-comments', 'deleted'])

// 檢舉相關
const reportDialogVisible = ref(false)

const toast = useToast()
const confirm = useConfirm()
const dialog = useDialog()
const router = useRouter()

// 響應式數據
const tags = ref([])
const isLiked = ref(false)
const isDisliked = ref(false)
const likesCount = ref(props.meme.like_count || props.meme.likes_count || 0)
const dislikesCount = ref(
  props.meme.dislike_count || props.meme.dislikes_count || 0,
)
const commentsCount = ref(
  props.meme.comment_count || props.meme.comments_count || 0,
)

const memeId = computed(() => getMemeId(meme))
const publishedTime = computed(() => formatPublishedTime(meme))

const userStore = useUserStore()
const menuRef = ref(null)

const canDelete = computed(() => {
  const currentUserId = getId(userStore.userId)
  const authorId = getId(meme.author?._id || meme.author?.id)
  const role = userStore.role
  return (
    role === 'admin' ||
    (currentUserId && authorId && currentUserId === authorId)
  )
})

// 載入標籤
const loadTags = async () => {
  try {
    let id = meme.id || meme._id
    if (typeof id === 'object' && id.$oid) {
      id = id.$oid
    }
    if (!id) {
      console.warn('迷因 ID 不存在，跳過載入標籤')
      return
    }
    const response = await memeTagService.getTagsByMemeId(id)

    if (response.data && Array.isArray(response.data)) {
      tags.value = response.data
    } else if (response.data && Array.isArray(response.data.tags)) {
      tags.value = response.data.tags
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      tags.value = response.data.data
    } else {
      console.warn('標籤資料格式不正確:', response.data)
      tags.value = []
    }
  } catch (error) {
    console.error('載入標籤失敗:', error)
  }
}

// 載入用戶互動狀態和統計資料
const loadUserInteractionStatus = async () => {
  try {
    if (!memeId.value || !userStore.userId) {
      return
    }

    // 檢查當前用戶是否已按讚
    try {
      const likeResponse = await likeService.getAll(userStore.userId)
      const userLikes = likeResponse.data.filter(
        (like) => like.meme_id === memeId.value,
      )
      isLiked.value = userLikes.length > 0
    } catch (error) {
      console.error('檢查按讚狀態失敗:', error)
    }

    // 檢查當前用戶是否已按噓
    try {
      const dislikeResponse = await dislikeService.getAll(userStore.userId)
      const userDislikes = dislikeResponse.data.filter(
        (dislike) => dislike.meme_id === memeId.value,
      )
      isDisliked.value = userDislikes.length > 0
    } catch (error) {
      console.error('檢查按噓狀態失敗:', error)
    }

    // 獲取最新的統計資料
    try {
      const memeResponse = await memeService.get(memeId.value)

      if (memeResponse.data) {
        // 處理嵌套的數據結構
        let memeData = memeResponse.data
        if (
          memeResponse.data.data &&
          typeof memeResponse.data.data === 'object'
        ) {
          memeData = memeResponse.data.data
        }

        const newLikesCount = memeData.like_count || memeData.likes_count || 0
        const newDislikesCount =
          memeData.dislike_count || memeData.dislikes_count || 0
        const newCommentsCount =
          memeData.comment_count || memeData.comments_count || 0

        // 只有在有新數據時才更新，避免覆蓋現有數據
        if (
          newLikesCount > 0 ||
          memeData.like_count === 0 ||
          memeData.likes_count === 0
        ) {
          likesCount.value = newLikesCount
        }
        if (
          newDislikesCount > 0 ||
          memeData.dislike_count === 0 ||
          memeData.dislikes_count === 0
        ) {
          dislikesCount.value = newDislikesCount
        }
        if (
          newCommentsCount > 0 ||
          memeData.comment_count === 0 ||
          memeData.comments_count === 0
        ) {
          commentsCount.value = newCommentsCount
        }
      }
    } catch (error) {
      console.error('獲取統計資料失敗:', error)
    }
  } catch (error) {
    console.error('載入用戶互動狀態失敗:', error)
  }
}

onMounted(() => {
  loadTags()
  loadUserInteractionStatus()
})

// 按讚功能
const toggleLike = async () => {
  try {
    if (!requireLogin(userStore, toast)) {
      return
    }

    if (!memeId.value) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '迷因資料不完整',
        life: 3000,
      })
      return
    }

    const response = await likeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    if (response && response.data && response.data.success) {
      // 後端返回成功，立即更新本地狀態和計數器
      isLiked.value = !isLiked.value

      // 如果之前是按噓狀態，取消按噓
      if (isLiked.value && isDisliked.value) {
        isDisliked.value = false
        dislikesCount.value = Math.max(0, dislikesCount.value - 1)
      }

      // 立即更新按讚計數
      if (isLiked.value) {
        likesCount.value += 1
      } else {
        likesCount.value = Math.max(0, likesCount.value - 1)
      }
    } else {
      console.error('按讚失敗或響應格式異常')
    }
  } catch (error) {
    console.error('按讚操作失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '按讚操作失敗，請稍後再試',
      life: 3000,
    })
  }
}

// 按噓功能
const toggleDislike = async () => {
  try {
    if (!requireLogin(userStore, toast)) {
      return
    }

    if (!memeId.value) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '迷因資料不完整',
        life: 3000,
      })
      return
    }

    const response = await dislikeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    if (response && response.data && response.data.success) {
      // 後端返回成功，立即更新本地狀態和計數器
      isDisliked.value = !isDisliked.value

      // 如果之前是按讚狀態，取消按讚
      if (isDisliked.value && isLiked.value) {
        isLiked.value = false
        likesCount.value = Math.max(0, likesCount.value - 1)
      }

      // 立即更新按噓計數
      if (isDisliked.value) {
        dislikesCount.value += 1
      } else {
        dislikesCount.value = Math.max(0, dislikesCount.value - 1)
      }
    } else {
      console.error('按噓失敗或響應格式異常')
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '按噓操作失敗',
      life: 3000,
    })
  }
}

// 標籤點擊
const onTagClick = (tag) => {
  emit('tag-click', tag)
}

// 顯示評論
const showComments = () => {
  if (!requireLogin(userStore, toast)) {
    return router.push('/login')
  }

  let hasUpdatedViaCallback = false

  window.updateCommentsCount = (newCount) => {
    commentsCount.value = newCount
    hasUpdatedViaCallback = true
  }

  dialog.open(CommentsDialog, {
    props: {
      header: `${props.meme.title} - 留言`,
      style: {
        width: '90vw',
        maxWidth: '800px',
        height: '80vh',
      },
      modal: true,
      closable: true,
      dismissableMask: true,
      draggable: false,
      resizable: false,
    },
    data: {
      meme: props.meme,
      memeId: memeId.value,
    },
    onClose: (closeData) => {
      if (window.updateCommentsCount) {
        delete window.updateCommentsCount
      }

      if (hasUpdatedViaCallback) {
        return
      }

      if (
        closeData?.hasUpdates &&
        typeof closeData.newCommentsCount === 'number'
      ) {
        commentsCount.value = closeData.newCommentsCount
        return
      }

      const dialogInstance = dialog.dialogRef
      if (
        dialogInstance?.data?.hasUpdates &&
        typeof dialogInstance.data.newCommentsCount === 'number'
      ) {
        commentsCount.value = dialogInstance.data.newCommentsCount
        return
      }

      loadUserInteractionStatus()
    },
  })
}

// 顯示選單
const showMenu = (event) => {
  menuRef.value.toggle(event)
}

const onEdit = () => {
  router.push(`/memes/edit/${getMemeSlug(meme)}`)
}

const navigateToDetail = () => {
  router.push(`/memes/detail/${getMemeSlug(meme)}`)
}

const showDeleteConfirm = () => {
  confirm.require({
    message: '確定要刪除這則迷因嗎？',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '刪除',
    rejectLabel: '取消',
    acceptClass: 'p-button-contrast',
    closable: false,
    accept: async () => {
      try {
        await memeService.remove(memeId.value)
        toast.add({
          severity: 'success',
          summary: '刪除成功',
          detail: '迷因已刪除',
          life: 2000,
        })
        emit('deleted')
      } catch {
        toast.add({
          severity: 'error',
          summary: '刪除失敗',
          detail: '無法刪除迷因',
          life: 3000,
        })
      }
    },
  })
}

// 顯示檢舉對話框
const showReportDialog = () => {
  if (!requireLogin(userStore, toast)) {
    return
  }
  reportDialogVisible.value = true
}
</script>

<style scoped>
.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.p-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.p-image) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.p-image img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

:deep(.p-image .p-image-preview) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.p-image .p-image-preview img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

/* 多行截斷：限制 5 行，超出以省略號顯示 */
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
