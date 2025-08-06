<template>
  <Card
    class="w-full relative cursor-pointer hover:shadow-lg transition-shadow"
    @click="navigateToDetail"
  >
    <ConfirmPopup />
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
          v-if="meme.type === 'image' && meme.image_url"
          class="w-full h-full"
        >
          <Image
            :src="meme.image_url"
            :alt="meme.title"
            class="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div
          v-else-if="meme.type === 'video' && meme.video_url"
          class="w-full h-full"
        >
          <!-- 外部影片平台 -->
          <div v-if="isExternalVideoUrl(meme.video_url)" class="w-full h-full">
            <iframe
              :src="getEmbedUrl(meme.video_url)"
              class="w-full h-full rounded-t-lg"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <!-- 一般影片 -->
          <video
            v-else
            controls
            class="w-full h-full object-cover rounded-t-lg"
            :poster="meme.image_url"
          >
            <source :src="meme.video_url" type="video/mp4" />
            您的瀏覽器不支援影片播放
          </video>
        </div>
        <div
          v-else-if="meme.type === 'audio' && meme.audio_url"
          class="w-full h-full"
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
          class="w-full h-full"
        >
          <img
            :src="meme.image_url"
            :alt="meme.title"
            class="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div v-else-if="meme.type === 'text'" class="w-full h-full">
          <!-- 裝飾性標題 -->
          <TextMemeCard
            :title="meme.title"
            variant="random"
            size="small"
            :hover-effect="false"
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
        <h3 class="mb-1 text-xl font-bold">{{ meme.title }}</h3>
        <span class="text-xs text-gray-400">· {{ publishedTime }}</span>
      </div>
    </template>

    <template #content>
      <!-- 標籤 -->
      <div class="flex flex-wrap gap-2 mb-4" v-if="tags.length > 0">
        <Tag
          v-for="tag in tags.slice(0, 3)"
          :key="tag._id"
          :value="`#${tag.name}`"
          severity="secondary"
          class="cursor-pointer"
          @click.stop="onTagClick(tag)"
        />
      </div>

      <p class="mb-4" v-if="meme.content">
        {{
          meme.content.length > 100
            ? meme.content.substring(0, 100) + '...'
            : meme.content
        }}
      </p>

      <Divider class="my-2" />
      <div class="flex justify-around text-gray-500 text-lg">
        <Button
          class="w-1/3"
          :icon="isLiked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'"
          :severity="isLiked ? 'success' : 'secondary'"
          text
          :label="likesCount.toString()"
          @click.stop="toggleLike"
        />
        <Button
          class="w-1/3"
          :icon="isDisliked ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'"
          :severity="isDisliked ? 'danger' : 'secondary'"
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
    </template>
  </Card>
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
import ConfirmPopup from 'primevue/confirmpopup'
import TextMemeCard from './TextMemeCard.vue'
import CommentsDialog from './CommentsDialog.vue'
import { useUserStore } from '@/stores/userStore'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import memeTagService from '@/services/memeTagService'
import memeService from '@/services/memeService'

// 工具函數
import { getId, formatPublishedTime, getMemeId } from '@/utils/dataUtils'
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

const emit = defineEmits(['tag-click', 'show-comments', 'deleted'])

const toast = useToast()
const confirm = useConfirm()
const dialog = useDialog()
const router = useRouter()

// 響應式數據
const tags = ref([])
const isLiked = ref(false)
const isDisliked = ref(false)
const likesCount = ref(props.meme.likes_count || 0)
const dislikesCount = ref(props.meme.dislikes_count || 0)
const commentsCount = ref(props.meme.comments_count || 0)

const memeId = computed(() => getMemeId(props.meme))
const publishedTime = computed(() => formatPublishedTime(props.meme))

const userStore = useUserStore()
const menuRef = ref(null)

const canDelete = computed(() => {
  const currentUserId = getId(userStore.userId)
  const authorId = getId(props.meme.author?._id || props.meme.author?.id)
  const role = userStore.role
  return (
    role === 'admin' ||
    (currentUserId && authorId && currentUserId === authorId)
  )
})

// 載入標籤
const loadTags = async () => {
  try {
    let id = props.meme.id || props.meme._id
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
      const likeResponse = await likeService.getAll()
      const userLikes = likeResponse.data.filter(
        (like) =>
          like.meme_id === memeId.value && like.user_id === userStore.userId,
      )
      isLiked.value = userLikes.length > 0
    } catch (error) {
      console.error('檢查按讚狀態失敗:', error)
    }

    // 檢查當前用戶是否已按噓
    try {
      const dislikeResponse = await dislikeService.getAll()
      const userDislikes = dislikeResponse.data.filter(
        (dislike) =>
          dislike.meme_id === memeId.value &&
          dislike.user_id === userStore.userId,
      )
      isDisliked.value = userDislikes.length > 0
    } catch (error) {
      console.error('檢查按噓狀態失敗:', error)
    }

    // 獲取最新的統計資料
    try {
      const memeResponse = await memeService.get(memeId.value)
      if (memeResponse.data) {
        const newLikesCount =
          memeResponse.data.like_count || memeResponse.data.likes_count || 0
        const newDislikesCount =
          memeResponse.data.dislike_count ||
          memeResponse.data.dislikes_count ||
          0
        const newCommentsCount =
          memeResponse.data.comment_count ||
          memeResponse.data.comments_count ||
          0

        likesCount.value = newLikesCount
        dislikesCount.value = newDislikesCount
        commentsCount.value = newCommentsCount
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
      isLiked.value = !isLiked.value
      if (isLiked.value && isDisliked.value) {
        isDisliked.value = false
      }
      await loadUserInteractionStatus()
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
      isDisliked.value = !isDisliked.value
      if (isDisliked.value && isLiked.value) {
        isLiked.value = false
      }
      await loadUserInteractionStatus()
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
  window.location.href = `/memes/edit/${memeId.value}`
}

const navigateToDetail = () => {
  router.push(`/memes/detail/${memeId.value}`)
}

const showDeleteConfirm = (event) => {
  confirm.require({
    target: event?.currentTarget || undefined,
    message: '確定要刪除這則迷因嗎？',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '刪除',
    rejectLabel: '取消',
    acceptClass: 'p-button-contrast',
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
</style>
