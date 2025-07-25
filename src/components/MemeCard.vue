<template>
  <Card class="mb-6 max-w-2xl mx-auto!">
    <ConfirmPopup />
    <template #header>
      <div class="flex items-center justify-between p-4 pb-0">
        <div class="flex items-center space-x-3">
          <Avatar
            :image="meme.author?.avatar || '/default-avatar.png'"
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

    <template #title>
      <div class="px-4 pb-2">
        <h3 class="text-xl font-bold text-gray-800">{{ meme.title }}</h3>
      </div>
    </template>

    <template #content>
      <div class="px-4">
        <!-- 內容預覽 -->
        <p class="text-gray-600 mb-4" v-if="meme.content">
          {{ meme.content }}
        </p>

        <!-- 根據類型顯示不同內容 -->
        <div class="mb-4">
          <div v-if="meme.type === 'image' && meme.image_url" class="relative">
            <Image
              :src="meme.image_url"
              :alt="meme.title"
              class="w-full rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
              preview
            />
          </div>
          <div
            v-else-if="meme.type === 'video' && meme.image_url"
            class="relative"
          >
            <video
              controls
              class="w-full rounded-lg"
              :poster="meme.thumbnail_url"
            >
              <source :src="meme.image_url" type="video/mp4" />
              您的瀏覽器不支援影片播放
            </video>
          </div>
          <div
            v-else-if="meme.type === 'gif' && meme.image_url"
            class="relative"
          >
            <img
              :src="meme.image_url"
              :alt="meme.title"
              class="w-full rounded-lg"
            />
          </div>
          <div
            v-else-if="meme.type === 'text'"
            class="bg-gray-50 p-4 rounded-lg"
          >
            <div class="text-lg text-center">
              {{ meme.text_content || meme.content }}
            </div>
          </div>
        </div>

        <!-- 標籤 -->
        <div class="flex flex-wrap gap-2 mb-4" v-if="tags.length > 0">
          <Tag
            v-for="tag in tags"
            :key="tag.id"
            :value="`#${tag.name}`"
            severity="info"
            class="cursor-pointer hover:bg-blue-100 transition-colors"
            @click="onTagClick(tag)"
          />
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
              @click="shareContent"
              v-tooltip.top="'分享'"
            />
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
import { useUserStore } from '@/stores/userStore'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import collectionService from '@/services/collectionService'
import shareService from '@/services/shareService'
import memeTagService from '@/services/memeTagService'
import memeService from '@/services/memeService'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw'

dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

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

const memeId = computed(() => {
  // 支援 id、_id，並處理 {$oid: ...} 格式
  let id = props.meme.id || props.meme._id
  if (typeof id === 'object' && id.$oid) {
    id = id.$oid
  }
  return id
})

const publishedTime = computed(() => {
  // 支援 created_at 或 createdAt，並處理 {$date: ...} 格式
  let time = props.meme.created_at || props.meme.createdAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return dayjs(time).fromNow()
})

const userStore = useUserStore()
const menuRef = ref(null)

function getId(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.$oid) return val.$oid
  return val._id || val.id || ''
}

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
    tags.value = response.data || []
  } catch (error) {
    console.error('載入標籤失敗:', error)
  }
}

onMounted(() => {
  loadTags()
})

// 按讚功能
const toggleLike = async () => {
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

    await likeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
    })

    if (isLiked.value) {
      likesCount.value--
      isLiked.value = false
    } else {
      likesCount.value++
      isLiked.value = true
      // 如果之前按過噓，要取消噓
      if (isDisliked.value) {
        await dislikeService.toggle({
          meme_id: memeId.value,
          type: 'meme',
        })
        dislikesCount.value--
        isDisliked.value = false
      }
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
    if (!memeId.value) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '迷因資料不完整',
        life: 3000,
      })
      return
    }
    await dislikeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
    })

    if (isDisliked.value) {
      dislikesCount.value--
      isDisliked.value = false
    } else {
      dislikesCount.value++
      isDisliked.value = true
      // 如果之前按過讚，要取消讚
      if (isLiked.value) {
        await likeService.toggle({
          meme_id: memeId.value,
          type: 'meme',
        })
        likesCount.value--
        isLiked.value = false
      }
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

// 分享功能
const shareContent = async () => {
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
    if (navigator.share) {
      await navigator.share({
        title: props.meme.title,
        text: props.meme.content,
        url: window.location.href,
      })
    } else {
      // 回退到複製連結
      await navigator.clipboard.writeText(window.location.href)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '連結已複製到剪貼簿',
        life: 3000,
      })
    }

    // 記錄分享
    await shareService.create({
      meme_id: memeId.value,
      platform: 'web',
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '分享失敗',
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
