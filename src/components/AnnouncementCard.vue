<template>
  <Card
    v-if="announcement && announcement.title"
    class="w-full announcement-card"
  >
    <template #header>
      <div
        class="h-60 flex items-center justify-center overflow-hidden rounded-t-lg"
        :class="
          announcement.image
            ? 'bg-surface-100'
            : 'bg-gradient-to-br from-green-50 to-indigo-100'
        "
      >
        <img
          v-if="announcement.image"
          :src="announcement.image"
          :alt="announcement.title || '公告圖片'"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div v-else class="text-center">
          <i class="pi pi-bullhorn text-4xl text-indigo-500 mb-2"></i>
          <p class="text-surface-600 text-sm">公告</p>
        </div>
      </div>
    </template>
    <template #content>
      <div class="mb-2 flex justify-between items-start">
        <h4 class="mb-1 text-lg font-semibold text-surface-800 line-clamp-1">
          {{ announcement.title || '無標題公告' }}
        </h4>
        <Tag
          :value="getCategoryLabel(announcement.category)"
          :severity="getCategorySeverity(announcement.category)"
          class="ml-2 flex-shrink-0"
        />
      </div>
      <p class="mb-3 text-surface-600 line-clamp-3">
        {{ getContentPreview(announcement.content) }}
      </p>
      <div class="flex justify-between items-center text-sm text-surface-500">
        <span>{{ formatDate(announcement.createdAt) }}</span>
        <div class="flex items-center gap-2">
          <Button text severity="success" @click.stop="goToDetail"
            ><i class="ri-arrow-right-s-fill"></i>查看詳情</Button
          >
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useDialog } from 'primevue/usedialog'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { extractTextFromJson } from '@/utils/contentUtils'
import AnnouncementDetailDialog from '@/components/AnnouncementDetailDialog.vue'

const dialog = useDialog()

// 定義 props
const props = defineProps({
  announcement: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// 打開詳情對話框
const goToDetail = () => {
  if (props.announcement && props.announcement._id) {
    dialog.open(AnnouncementDetailDialog, {
      props: {
        header: props.announcement.title || '公告詳情',
        style: {
          width: '90vw',
          maxWidth: '1200px',
        },
        breakpoints: {
          '960px': '85vw',
          '640px': '95vw',
        },
        modal: true,
        closable: true,
        dismissableMask: true,
      },
      data: {
        announcementId: props.announcement._id,
      },
      onClose: (options) => {
        // 處理對話框關閉後的回調
        if (options?.data?.action === 'openNewAnnouncement') {
          // 打開新的公告詳情對話框
          openAnnouncementDialog(options.data.announcementId)
        }
      },
    })
  }
}

// 打開指定公告的對話框（用於相關公告點擊）
const openAnnouncementDialog = (announcementId) => {
  dialog.open(AnnouncementDetailDialog, {
    props: {
      header: '公告詳情',
      style: {
        width: '90vw',
        maxWidth: '1200px',
      },
      breakpoints: {
        '960px': '85vw',
        '640px': '95vw',
      },
      modal: true,
      closable: true,
      dismissableMask: true,
    },
    data: {
      announcementId: announcementId,
    },
    onClose: (options) => {
      // 處理對話框關閉後的回調
      if (options?.data?.action === 'openNewAnnouncement') {
        // 打開新的公告詳情對話框
        openAnnouncementDialog(options.data.announcementId)
      }
    },
  })
}

// 處理圖片載入錯誤
const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling.style.display = 'block'
}

// 取得分類標籤文字
const getCategoryLabel = (category) => {
  const labels = {
    system: '系統',
    activity: '活動',
    update: '更新',
    other: '其他',
  }
  return labels[category] || '其他'
}

// 取得分類標籤樣式
const getCategorySeverity = (category) => {
  const severities = {
    system: 'danger',
    activity: 'success',
    update: 'info',
    other: 'secondary',
  }
  return severities[category] || 'secondary'
}

// 取得內容預覽（支援JSON和純文字）
const getContentPreview = (content, maxLength = 60) => {
  if (!content) return '無內容'

  let plainText = ''

  // 如果是JSON格式，解析並提取純文字
  if (typeof content === 'object' && content !== null) {
    plainText = extractTextFromJson(content)
  } else {
    // 純文字格式，移除HTML標籤
    plainText = String(content).replace(/<[^>]*>/g, '')
  }

  // 限制字數
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知時間'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '未知時間'

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return '今天'
    } else if (diffDays === 2) {
      return '昨天'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`
    } else {
      return date.toLocaleDateString('zh-TW')
    }
  } catch (error) {
    console.error('日期格式化錯誤:', error)
    return '未知時間'
  }
}
</script>

<style scoped>
.announcement-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.announcement-card:hover {
  transform: translateY(-2px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
