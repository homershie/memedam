<template>
  <div class="announcement-detail">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <ProgressSpinner />
    </div>

    <!-- 錯誤狀態 -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-screen"
    >
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">載入失敗</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button label="返回首頁" icon="pi pi-home" @click="$router.push('/')" />
      </div>
    </div>

    <!-- 公告內容 -->
    <div v-else-if="announcement" class="max-w-4xl mx-auto px-4 py-8">
      <!-- 返回按鈕 -->
      <div class="mb-6">
        <Button
          label="返回公告列表"
          icon="pi pi-arrow-left"
          text
          @click="$router.push('/announcements')"
        />
      </div>

      <!-- 公告卡片 -->
      <Card class="mb-6">
        <template #header>
          <div class="relative">
            <img
              :src="
                announcement.image_url ||
                'https://picsum.photos/800/400/?random=10'
              "
              :alt="announcement.title"
              class="w-full h-64 object-cover rounded-t-lg"
            />
            <!-- 置頂標籤 -->
            <Tag
              v-if="announcement.is_pinned"
              value="置頂"
              severity="warning"
              class="absolute top-4 right-4"
            />
            <!-- 優先級標籤 -->
            <Tag
              :value="getPriorityLabel(announcement.priority)"
              :severity="getPrioritySeverity(announcement.priority)"
              class="absolute top-4 left-4"
            />
          </div>
        </template>

        <template #content>
          <div class="space-y-6">
            <!-- 標題和類型 -->
            <div class="flex justify-between items-start">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ announcement.title }}
              </h1>
              <Tag
                :value="getTypeLabel(announcement.type)"
                :severity="getTypeSeverity(announcement.type)"
              />
            </div>

            <!-- 發布資訊 -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>
                <i class="pi pi-calendar mr-1"></i>
                發布時間：{{ formatDate(announcement.published_at) }}
              </span>
              <span>
                <i class="pi pi-eye mr-1"></i>
                瀏覽次數：{{ announcement.view_count || 0 }}
              </span>
            </div>

            <!-- 內容 -->
            <div class="prose prose-lg max-w-none">
              <div v-html="formatContent(announcement.content)"></div>
            </div>

            <!-- 標籤 -->
            <div
              v-if="announcement.tags && announcement.tags.length > 0"
              class="flex flex-wrap gap-2"
            >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >標籤：</span
              >
              <Tag
                v-for="tag in announcement.tags"
                :key="tag"
                :value="tag"
                severity="info"
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              最後更新：{{ formatDate(announcement.updated_at) }}
            </div>
            <div class="flex gap-2">
              <Button
                label="分享"
                icon="pi pi-share-alt"
                outlined
                @click="shareAnnouncement"
              />
              <Button
                label="返回列表"
                icon="pi pi-list"
                outlined
                @click="$router.push('/announcements')"
              />
            </div>
          </div>
        </template>
      </Card>

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
                  related.image_url ||
                  'https://picsum.photos/300/200/?random=10'
                "
                :alt="related.title"
                class="w-full h-32 object-cover rounded-t-lg"
              />
            </template>
            <template #content>
              <h4 class="font-semibold mb-2">{{ related.title }}</h4>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ truncateContent(related.content, 100) }}
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 公告不存在 -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="pi pi-file-excel text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">公告不存在</h2>
        <p class="text-gray-600 mb-4">您要查看的公告可能已被刪除或移動</p>
        <Button label="返回首頁" icon="pi pi-home" @click="$router.push('/')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import announcementService from '@/services/announcementService'

// 定義組件名稱以符合 multi-word 規則
defineOptions({
  name: 'AnnouncementDetailPage',
})

// 路由和響應式數據
const route = useRoute()
const router = useRouter()
const toast = useToast()

const announcement = ref(null)
const relatedAnnouncements = ref([])
const loading = ref(true)
const error = ref(null)

// 計算屬性
const announcementId = computed(() => route.params.id)

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
    announcement.value = response.data.announcement

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
      type: announcement.value?.type,
    })
    relatedAnnouncements.value = response.data.announcements || []
  } catch (err) {
    console.error('載入相關公告失敗:', err)
  }
}

// 查看公告
const viewAnnouncement = (id) => {
  router.push(`/announcements/${id}`)
}

// 分享公告
const shareAnnouncement = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: announcement.value.title,
        text: truncateContent(announcement.value.content, 200),
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
  return new Date(date).toLocaleString('zh-TW')
}

const truncateContent = (content, maxLength) => {
  if (!content) return ''
  return content.length > maxLength
    ? content.substring(0, maxLength) + '...'
    : content
}

const formatContent = (content) => {
  if (!content) return ''
  // 將換行符轉換為 HTML 換行
  return content.replace(/\n/g, '<br>')
}

const getTypeLabel = (type) => {
  const typeMap = {
    general: '一般公告',
    maintenance: '系統維護',
    update: '功能更新',
    event: '活動通知',
  }
  return typeMap[type] || type
}

const getTypeSeverity = (type) => {
  const severityMap = {
    general: 'info',
    maintenance: 'warning',
    update: 'success',
    event: 'primary',
  }
  return severityMap[type] || 'info'
}

const getPriorityLabel = (priority) => {
  const priorityMap = {
    normal: '一般',
    important: '重要',
    urgent: '緊急',
  }
  return priorityMap[priority] || priority
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    normal: 'info',
    important: 'warning',
    urgent: 'danger',
  }
  return severityMap[priority] || 'info'
}
</script>

<style scoped>
.announcement-detail {
  min-height: 100vh;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 深色模式支援 */
:deep(.dark) .prose {
  color: #e5e7eb;
}

:deep(.dark) .prose h1,
:deep(.dark) .prose h2,
:deep(.dark) .prose h3,
:deep(.dark) .prose h4,
:deep(.dark) .prose h5,
:deep(.dark) .prose h6 {
  color: #f9fafb;
}

:deep(.dark) .prose p {
  color: #d1d5db;
}
</style>

<route lang="yaml">
meta:
  title: '公告詳情'
  description: '查看公告詳細內容、發布時間與相關公告，掌握平台最新訊息。'
  login: ''
  admin: false
</route>
