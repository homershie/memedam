<template>
  <div class="w-full mx-auto space-y-6">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>

    <!-- 錯誤狀態 -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-[400px]"
    >
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">載入失敗</h2>
        <p class="text-surface-600 mb-4">{{ error }}</p>
      </div>
    </div>

    <!-- 公告內容 -->
    <div v-else-if="announcement" class="w-full max-w-4xl mx-auto px-4">
      <!-- 公告卡片 -->
      <div class="relative">
        <img
          :src="
            announcement.image || 'https://picsum.photos/800/400/?random=10'
          "
          :alt="announcement.title"
          class="w-full h-64 object-cover"
        />
        <div class="absolute top-4 left-4 space-y-2">
          <div class="space-x-2">
            <!-- 置頂標籤 -->
            <Tag v-if="announcement.pinned" value="置頂" severity="warn" />
            <!-- 分類標籤 -->
            <Tag
              :value="getCategoryLabel(announcement.category)"
              :severity="getCategorySeverity(announcement.category)"
            />
          </div>
        </div>
        <div class="absolute bottom-4 right-4">
          <!-- 發布資訊 -->
          <div class="flex items-center gap-2 bg-black/90 px-3 py-1 rounded-md">
            <i class="pi pi-calendar mr-1"></i>
            <span class="text-sm text-white">
              {{ formatDate(announcement.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 內容 -->
        <div class="prose prose-lg max-w-none">
          <div
            v-html="
              formatContent(announcement.content, announcement.content_format)
            "
          ></div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div class="text-sm text-surface-500">
          最後更新：{{ formatDate(announcement.updatedAt) }}
        </div>
        <div class="flex gap-2">
          <Button
            label="分享"
            icon="pi pi-share-alt"
            outlined
            @click="shareAnnouncement"
          />
        </div>
      </div>

      <!-- 相關公告 -->
      <div v-if="relatedAnnouncements.length > 0" class="mb-6">
        <h3 class="text-xl font-bold mb-4">相關公告</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="related in relatedAnnouncements"
            :key="related.id"
            class="cursor-pointer hover:shadow-lg transition-shadow"
            @click="viewAnnouncement(related.id)"
          >
            <template #header>
              <img
                :src="
                  related.image || 'https://picsum.photos/300/200/?random=10'
                "
                :alt="related.title"
                class="w-full h-32 object-cover rounded-t-lg"
              />
            </template>
            <template #content>
              <h4 class="font-semibold mb-2">{{ related.title }}</h4>
              <p class="text-sm text-surface-600 line-clamp-2">
                {{
                  truncateAnnouncementContent(
                    related.content,
                    100,
                    related.content_format,
                  )
                }}
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 公告不存在 -->
    <div v-else class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="text-center">
        <i class="pi pi-file-excel text-6xl text-surface-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">公告不存在</h2>
        <p class="text-surface-600 mb-4">您要查看的公告可能已被刪除或移動</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useToast } from 'primevue/usetoast'
import announcementService from '@/services/announcementService'
import { renderContentToHtml, truncateContent } from '@/utils/contentUtils'

// 定義組件名稱以符合 multi-word 規則
defineOptions({
  name: 'AnnouncementDetailDialog',
})

// 注入 dialogRef
const dialogRef = inject('dialogRef')

// 路由和響應式數據
const toast = useToast()

const announcement = ref(null)
const relatedAnnouncements = ref([])
const loading = ref(true)
const error = ref(null)

// 從 dialogRef 中獲取傳遞的數據
const announcementId = ref(dialogRef.value?.data?.announcementId)

// 生命週期
onMounted(async () => {
  await loadAnnouncement()
})

// 載入公告數據
const loadAnnouncement = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await announcementService.get(announcementId.value)
    announcement.value = response.data.data

    // 載入相關公告
    await loadRelatedAnnouncements()
  } catch (err) {
    console.error('載入公告失敗:', err)
    error.value = '載入公告失敗，請稍後重試'

    if (err.response?.status === 404) {
      error.value = '公告不存在'
    }
  } finally {
    loading.value = false
  }
}

// 載入相關公告
const loadRelatedAnnouncements = async () => {
  try {
    const response = await announcementService.getAll({
      limit: 3,
      exclude: announcementId.value,
      category: announcement.value?.category,
    })
    relatedAnnouncements.value = response.data.data || []
  } catch (err) {
    console.error('載入相關公告失敗:', err)
  }
}

// 查看公告 - 在對話框中打開新公告
const viewAnnouncement = (id) => {
  // 關閉當前對話框並重新打開新的公告詳情
  dialogRef.value.close({
    action: 'openNewAnnouncement',
    announcementId: id,
  })
}

// 分享公告
const shareAnnouncement = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: announcement.value.title,
        text: truncateAnnouncementContent(
          announcement.value.content,
          200,
          announcement.value.content_format,
        ),
        url: window.location.href,
      })
    } catch (err) {
      console.error('分享失敗:', err)
    }
  } else {
    // 複製連結到剪貼簿
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '連結已複製到剪貼簿',
        life: 3000,
      })
    } catch (err) {
      console.error('複製失敗:', err)
      toast.add({
        severity: 'error',
        summary: '失敗',
        detail: '複製連結失敗',
        life: 3000,
      })
    }
  }
}

// 工具函數
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const dateStr = d.toLocaleDateString('zh-TW')
  const timeStr = d.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${dateStr} ${timeStr}`
}

const truncateAnnouncementContent = (content, maxLength, format = null) => {
  // 如果沒有提供 format，使用預設邏輯判斷格式
  let actualFormat = format
  if (!actualFormat) {
    actualFormat =
      typeof content === 'object' && content !== null ? 'json' : 'plain'
  }

  return truncateContent(content, actualFormat, maxLength)
}

const formatContent = (content, format = null) => {
  if (!content) return ''

  // 如果沒有提供 format，使用預設邏輯判斷格式
  let actualFormat = format
  if (!actualFormat) {
    actualFormat =
      typeof content === 'object' && content !== null ? 'json' : 'plain'
  }

  if (actualFormat === 'json' && typeof content === 'object') {
    return renderContentToHtml(content, 'json')
  }

  // 純文字格式，轉換換行符
  return String(content).replace(/\n/g, '<br>')
}

const getCategoryLabel = (category) => {
  const categoryMap = {
    system: '系統',
    activity: '活動',
    update: '更新',
    other: '其他',
  }
  return categoryMap[category] || '其他'
}

const getCategorySeverity = (category) => {
  const severityMap = {
    system: 'danger',
    activity: 'success',
    update: 'info',
    other: 'secondary',
  }
  return severityMap[category] || 'secondary'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
