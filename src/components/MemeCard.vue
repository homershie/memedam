<template>
  <Card class="mb-8 max-w-5xl mx-auto!">
    <ConfirmPopup />
    <template #header>
      <div class="flex items-center justify-between p-4 pb-0">
        <div class="flex items-center space-x-3">
          <Avatar
            :image="meme.author?.avatar"
            :icon="!meme.author?.avatar ? 'pi pi-user' : undefined"
            shape="circle"
            size="large"
            class="border-2 border-gray-200"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-800">
                {{
                  meme.author?.display_name ||
                  meme.author?.username ||
                  '匿名用戶'
                }}
              </span>
              <span class="text-xs text-gray-400">· {{ publishedTime }}</span>
            </div>
          </div>
        </div>
        <Button
          icon="pi pi-ellipsis-h"
          severity="secondary"
          text
          rounded
          @click="showMenu"
        />
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
      </div>
    </template>

    <template #content>
      <div class="px-4">
        <div class="flex justify-center gap-4 flex-col lg:flex-row items-start">
          <!-- 根據類型顯示不同內容 -->
          <div class="mb-4 w-full lg:w-1/4">
            <div
              v-if="meme.type === 'image' && meme.image_url"
              class="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                :src="meme.image_url"
                :alt="meme.title"
                class="w-full object-none rounded-lg"
              />
            </div>
            <div
              v-else-if="meme.type === 'video' && meme.video_url"
              class="relative"
            >
              <!-- 外部影片平台 -->
              <div
                v-if="isExternalVideoUrl(meme.video_url)"
                class="relative w-full"
              >
                <iframe
                  :src="getEmbedUrl(meme.video_url)"
                  class="w-full aspect-square rounded-lg"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <!-- 一般影片 -->
              <video
                v-else
                controls
                class="w-full rounded-lg"
                :poster="meme.image_url"
              >
                <source :src="meme.video_url" type="video/mp4" />
                您的瀏覽器不支援影片播放
              </video>
            </div>
            <div
              v-else-if="meme.type === 'audio' && meme.audio_url"
              class="relative aspect-square overflow-hidden rounded-lg"
            >
              <!-- 外部音訊平台 -->
              <div
                v-if="isExternalAudioUrl(meme.audio_url)"
                class="relative w-full h-full"
              >
                <iframe
                  :src="getAudioEmbedUrl(meme.audio_url)"
                  class="w-full h-full rounded-lg"
                  frameborder="0"
                  allow="autoplay"
                ></iframe>
              </div>
              <!-- 一般音訊檔案 -->
              <audio
                v-else
                controls
                class="w-full h-full object-cover rounded-lg"
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
              class="relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                :src="meme.image_url"
                :alt="meme.title"
                class="w-full rounded-lg"
              />
            </div>
            <div v-else-if="meme.type === 'text'" class="relative">
              <!-- 裝飾性標題 -->
              <TextMemeCard
                :title="meme.title"
                variant="random"
                size="medium"
                :hover-effect="true"
              />
            </div>
          </div>

          <div class="w-full lg:w-3/4">
            <!-- 標題 - 只在非文字類型時顯示 -->
            <div class="mb-4">
              <h3 class="text-xl font-bold text-gray-800">{{ meme.title }}</h3>
            </div>

            <!-- 內容預覽 -->
            <p class="text-gray-600 mb-4" v-if="meme.content">
              {{ meme.content }}
            </p>

            <!-- 標籤 -->
            <div class="flex flex-wrap gap-2 mb-4" v-if="tags.length > 0">
              <Tag
                v-for="tag in tags"
                :key="tag._id"
                :value="`#${tag.name}`"
                severity="secondary"
                class="cursor-pointer"
                @click="onTagClick(tag)"
              />
            </div>
          </div>
        </div>

        <!-- 互動按鈕 -->
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200"
        >
          <div class="flex items-center space-x-6">
            <Button
              :icon="isLiked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'"
              :severity="isLiked ? 'success' : 'secondary'"
              text
              :label="likesCount.toString()"
              @click="toggleLike"
              class="transition-colors"
            />
            <Button
              :icon="
                isDisliked ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'
              "
              :severity="isDisliked ? 'danger' : 'secondary'"
              text
              :label="dislikesCount.toString()"
              @click="toggleDislike"
              class="transition-colors"
            />
            <Button
              icon="pi pi-comment"
              severity="secondary"
              text
              :label="commentsCount.toString()"
              @click="showComments"
            />
          </div>
          <div class="flex items-center space-x-2">
            <Button
              :icon="isCollected ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
              :severity="isCollected ? 'warning' : 'secondary'"
              text
              @click="toggleCollection"
              v-tooltip.top="isCollected ? '取消收藏' : '收藏'"
            />
            <Button
              icon="pi pi-share-alt"
              severity="secondary"
              text
              @click="showShareOptions"
              v-tooltip.top="'分享'"
            />
            <OverlayPanel ref="shareMenuRef">
              <div class="flex flex-col min-w-[160px]">
                <Button
                  v-for="option in shareOptions"
                  :key="option.value"
                  :label="option.label"
                  :icon="option.icon"
                  text
                  severity="contrast"
                  class="justify-start w-full"
                  @click="handleShare(option.value)"
                />
              </div>
            </OverlayPanel>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Image from 'primevue/image'
import OverlayPanel from 'primevue/overlaypanel'
import ConfirmPopup from 'primevue/confirmpopup'
import TextMemeCard from './TextMemeCard.vue'
import { useUserStore } from '@/stores/userStore'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import collectionService from '@/services/collectionService'
import shareService from '@/services/shareService'
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
import { getShareOptions, handlePlatformShare } from '@/utils/shareUtils'
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

// 響應式數據
const tags = ref([])
const isLiked = ref(false)
const isDisliked = ref(false)
const isCollected = ref(false)
const likesCount = ref(props.meme.likes_count || 0)
const dislikesCount = ref(props.meme.dislikes_count || 0)
const commentsCount = ref(props.meme.comments_count || 0)

const memeId = computed(() => getMemeId(props.meme))

const publishedTime = computed(() => formatPublishedTime(props.meme))

const userStore = useUserStore()
const menuRef = ref(null)
const shareMenuRef = ref(null)

// 分享選項配置
const shareOptions = computed(() => getShareOptions())

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
    // 統一取得 memeId
    let id = props.meme.id || props.meme._id
    if (typeof id === 'object' && id.$oid) {
      id = id.$oid
    }
    if (!id) {
      console.warn('迷因 ID 不存在，跳過載入標籤')
      return
    }
    const response = await memeTagService.getTagsByMemeId(id)

    // 檢查資料結構
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
        // 修正欄位名稱以匹配後端模型
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

    console.log('按讚資料:', {
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    const response = await likeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    console.log('按讚 API 響應:', response)

    // 檢查 API 響應並即時更新統計
    if (response && response.data && response.data.success) {
      // 後端返回成功，但沒有統計資料，需要重新獲取
      console.log('按讚成功，重新獲取統計資料')

      // 立即更新用戶狀態（樂觀更新）
      isLiked.value = !isLiked.value
      if (isLiked.value && isDisliked.value) {
        isDisliked.value = false
      }

      // 重新獲取統計資料
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

    console.log('按噓資料:', {
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    const response = await dislikeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    console.log('按噓 API 響應:', response)

    // 檢查 API 響應並即時更新統計
    if (response && response.data && response.data.success) {
      // 後端返回成功，但沒有統計資料，需要重新獲取
      console.log('按噓成功，重新獲取統計資料')

      // 立即更新用戶狀態（樂觀更新）
      isDisliked.value = !isDisliked.value
      if (isDisliked.value && isLiked.value) {
        isLiked.value = false
      }

      // 重新獲取統計資料
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

// 收藏功能
const toggleCollection = async () => {
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
    await collectionService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    isCollected.value = !isCollected.value

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: isCollected.value ? '已加入收藏' : '已取消收藏',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '收藏操作失敗',
      life: 3000,
    })
  }
}

// 顯示分享選單
const showShareOptions = (event) => {
  shareMenuRef.value.toggle(event)
}

// 處理特定平台分享
const handleShare = async (platform) => {
  try {
    if (!memeId.value) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '迷因資料不完整',
        life: 3000,
      })
      return
    }

    const shareData = {
      shareUrl: `${window.location.origin}/memes/${memeId.value}`,
      shareTitle: props.meme.title || '有趣的迷因',
      shareText: props.meme.content || '',
    }

    const result = await handlePlatformShare(platform, shareData)

    if (result) {
      toast.add({
        severity: result.type,
        summary:
          result.type === 'success'
            ? '成功'
            : result.type === 'info'
              ? '提示'
              : '錯誤',
        detail: result.message,
        life: result.type === 'info' ? 5000 : 3000,
      })
    }

    // 記錄分享行為
    await recordShare(platform)
  } catch (error) {
    console.error('分享失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '分享失敗，請稍後再試',
      life: 3000,
    })
  }
}

// 記錄分享行為
const recordShare = async (platform) => {
  try {
    if (!userStore.isLoggedIn) {
      console.warn('用戶未登入，無法記錄分享')
      return
    }

    await shareService.create({
      meme_id: memeId.value,
      platform_detail: platform,
    })
  } catch (error) {
    console.error('記錄分享失敗:', error)
    // 不影響用戶分享體驗，只記錄錯誤
  }
}

// 標籤點擊
const onTagClick = (tag) => {
  emit('tag-click', tag)
}

// 顯示評論
const showComments = () => {
  if (!requireLogin(userStore, toast)) {
    return
  }
  emit('show-comments', props.meme)
}

// 顯示選單
const showMenu = (event) => {
  menuRef.value.toggle(event)
}

const onEdit = () => {
  window.location.href = `/memes/edit/${memeId.value}`
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 處理 PrimeVue Image 組件的內部結構 */
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
