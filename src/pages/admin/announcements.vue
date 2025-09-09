<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminAnnouncements',
})

import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import { onMounted, onUnmounted, ref } from 'vue'
import announcementService from '@/services/announcementService'
import uploadService from '@/services/uploadService'
import FileUpload from 'primevue/fileupload'
import RadioButton from 'primevue/radiobutton'
import TipTapEditor from '@/components/TipTapEditor.vue'

const toast = useToast()

// 表格與狀態
const dt = ref()
const loading = ref(false)
const announcements = ref([])
const selectedAnnouncements = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 對話框
const announcementDialog = ref(false)
const deleteAnnouncementDialog = ref(false)
const deleteAnnouncementsDialog = ref(false)

// 表單資料
const announcement = ref({})
const submitted = ref(false)
const selectedImage = ref(null)
const imageUrl = ref('')
const imageType = ref('upload') // 'upload' 或 'url'
const contentFormat = ref('plain') // 'plain' 或 'json'

// 篩選器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: '', matchMode: FilterMatchMode.EQUALS },
  category: { value: '', matchMode: FilterMatchMode.EQUALS },
})

// 篩選選單（含「全部」）
const filterStatuses = [
  { label: '全部', value: '' },
  { label: '草稿', value: 'draft' },
  { label: '已發布', value: 'public' },
  { label: '隱藏', value: 'hidden' },
  { label: '已刪除', value: 'deleted' },
]

const filterCategories = [
  { label: '全部', value: '' },
  { label: '系統', value: 'system' },
  { label: '活動', value: 'activity' },
  { label: '更新', value: 'update' },
  { label: '其他', value: 'other' },
]

// 表單選單（不含「全部」）
const formStatuses = [
  { label: '草稿', value: 'draft' },
  { label: '已發布', value: 'public' },
  { label: '隱藏', value: 'hidden' },
  { label: '已刪除', value: 'deleted' },
]

const formCategories = [
  { label: '系統', value: 'system' },
  { label: '活動', value: 'activity' },
  { label: '更新', value: 'update' },
  { label: '其他', value: 'other' },
]

// 收集content中待上傳的圖片檔案（參考post.vue做法）
const pendingContentImages = ref([])

// 載入真實數據
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
    }

    // 添加篩選條件
    if (filters.value.status.value && filters.value.status.value !== '') {
      params.status = filters.value.status.value
    } else {
      // 如果沒有選擇狀態，不傳送 status 參數，讓後端返回所有狀態
    }
    if (filters.value.category.value && filters.value.category.value !== '') {
      params.category = filters.value.category.value
    }
    if (
      filters.value.global.value &&
      filters.value.global.value.trim() !== ''
    ) {
      params.q = filters.value.global.value.trim()
    }

    const response = await announcementService.getAllAdmin(params)

    // 處理後端API響應格式
    if (
      response.data &&
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      announcements.value = response.data.data
      totalRecords.value =
        response.data.pagination?.total || response.data.data.length
    } else {
      announcements.value = []
      totalRecords.value = 0
    }

    // 清除選擇
    selectedAnnouncements.value = []
  } catch (error) {
    console.error('載入公告數據失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '載入公告數據失敗',
      life: 3000,
    })
    // 載入假資料作為備用
    loadFallbackData()
  } finally {
    loading.value = false
  }
}

// 備用假資料
const loadFallbackData = () => {
  announcements.value = [
    {
      _id: 1,
      id: 1,
      title: '系統維護通知',
      content: '系統將於今晚 2:00-4:00 進行維護，期間可能無法正常使用服務。',
      category: 'system',
      status: 'public',
      pinned: true,
      author_id: 'admin',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      _id: 2,
      id: 2,
      title: '新功能上線',
      content: '我們新增了標籤搜尋功能，讓您更容易找到喜歡的迷因！',
      category: 'update',
      status: 'public',
      pinned: false,
      author_id: 'admin',
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T16:00:00Z',
    },
    {
      _id: 3,
      id: 3,
      title: '春節活動',
      content: '春節期間將舉辦特別活動，敬請期待！',
      category: 'activity',
      status: 'draft',
      pinned: false,
      author_id: 'admin',
      createdAt: '2024-01-13T12:45:00Z',
      updatedAt: '2024-01-13T12:45:00Z',
    },
    {
      _id: 4,
      id: 4,
      title: '使用條款更新',
      content: '我們更新了使用條款，請用戶詳閱。',
      category: 'other',
      status: 'hidden',
      pinned: false,
      author_id: 'admin',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z',
    },
    {
      _id: 5,
      id: 5,
      title: '測試草稿公告',
      content: '這是一個測試用的草稿公告，只有管理員可以看到。',
      category: 'system',
      status: 'draft',
      pinned: false,
      author_id: 'admin',
      createdAt: '2024-01-12T08:30:00Z',
      updatedAt: '2024-01-12T08:30:00Z',
    },
    {
      _id: 6,
      id: 6,
      title: '已隱藏的公告',
      content: '這個公告已經被隱藏，一般用戶無法看到。',
      category: 'other',
      status: 'hidden',
      pinned: false,
      author_id: 'admin',
      createdAt: '2024-01-11T14:20:00Z',
      updatedAt: '2024-01-11T14:20:00Z',
    },
  ]
  totalRecords.value = announcements.value.length
  selectedAnnouncements.value = []
}

onMounted(async () => {
  await loadData()
})

// 組件卸載時清理 URL 物件
onUnmounted(() => {
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
})

function openNew() {
  announcement.value = {
    status: 'draft',
    category: 'system',
    pinned: false,
    content_format: 'plain',
  }
  contentFormat.value = 'plain'

  // 清理之前的圖片預覽 URL
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
  selectedImage.value = null
  imageUrl.value = ''
  imageType.value = 'upload'
  submitted.value = false
  // 清空待上傳的content圖片清單
  pendingContentImages.value = []
  announcementDialog.value = true
}

function hideDialog() {
  announcementDialog.value = false
  submitted.value = false
  // 清理圖片預覽 URL
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
  selectedImage.value = null
  imageUrl.value = ''
  imageType.value = 'upload'
  // 清空待上傳的content圖片清單
  pendingContentImages.value = []
}

async function saveAnnouncement() {
  submitted.value = true
  const current = { ...announcement.value }

  // 確保 content_format 正確設定
  current.content_format = contentFormat.value

  // 驗證內容
  if (!current?.title?.trim()) return

  // 根據格式驗證內容
  if (contentFormat.value === 'plain') {
    if (!current?.content?.trim()) return
    if (current.content.trim().length > 10000) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '純文字內容長度不能超過10000字',
        life: 3000,
      })
      return
    }
  } else if (contentFormat.value === 'json') {
    if (!current?.content) return
    // JSON 格式的驗證會在後端處理
  }

  try {
    // 處理圖片資料
    if (imageType.value === 'upload' && selectedImage.value) {
      current.image = selectedImage.value
    } else if (imageType.value === 'url' && imageUrl.value.trim()) {
      current.image = imageUrl.value.trim()
    } else {
      // 如果沒有圖片或不需要更新圖片，保持原有圖片或清除
      // current.image 已經從 announcement.value 拷貝過來，無需重新賦值
      // 如果沒有圖片，清除圖片欄位
      if (!current.image) {
        current.image = null
      }
    }

    let savedAnnouncement

    if (current._id) {
      // 更新現有公告
      savedAnnouncement = await announcementService.update(current._id, current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '公告已更新',
        life: 3000,
      })
    } else {
      // 建立新公告
      // 後端會自動處理 author_id 和時間戳
      savedAnnouncement = await announcementService.create(current)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '公告已建立',
        life: 3000,
      })
    }

    // 上傳content中的圖片（參考post.vue做法）
    if (pendingContentImages.value.length > 0) {
      const uploadedUrls = []
      const placeholderMap = new Map() // 記錄佔位符 ID 與上傳 URL 的對應關係

      for (const item of pendingContentImages.value) {
        try {
          const result = await uploadService.uploadImage(item.file, {
            folder: 'announcements/content',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto', format: 'auto' },
            ],
          })

          if (result && result.url) {
            uploadedUrls.push(result.url)
            // 記錄佔位符 ID 與上傳 URL 的對應關係
            if (item.placeholderId) {
              placeholderMap.set(item.placeholderId, result.url)
            }
          } else {
            console.error('Content圖片上傳失敗: 無效回應', result)
          }
        } catch (error) {
          console.error('Content圖片上傳失敗:', error)
        }
      }

      // 替換編輯器內容中的佔位符
      if (placeholderMap.size > 0) {
        let contentToUpdate = current.content

        // 如果內容是 JSON 格式，需要解析後替換
        if (contentFormat.value === 'json') {
          try {
            const contentObj =
              typeof contentToUpdate === 'string'
                ? JSON.parse(contentToUpdate)
                : contentToUpdate

            // 遞歸替換內容中的佔位符
            const replacePlaceholders = (obj) => {
              if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                  if (key === 'src' && typeof obj[key] === 'string') {
                    // 如果 src 是佔位符 ID，用對應的 URL 替換
                    if (placeholderMap.has(obj[key])) {
                      obj[key] = placeholderMap.get(obj[key])
                    }
                  } else if (typeof obj[key] === 'object') {
                    replacePlaceholders(obj[key])
                  }
                }
              }
              return obj
            }

            const updatedContent = replacePlaceholders(contentObj)
            current.content = updatedContent

            // 更新編輯器內容
            announcement.value.content = updatedContent
          } catch (error) {
            console.error('替換JSON內容中的佔位符失敗:', error)
          }
        } else {
          // 如果是純文字格式，替換字串中的佔位符
          let contentStr =
            typeof contentToUpdate === 'string' ? contentToUpdate : ''

          for (const [placeholderId, url] of placeholderMap.entries()) {
            // 使用正則表達式替換所有出現的佔位符
            const regex = new RegExp(
              placeholderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g',
            )
            contentStr = contentStr.replace(regex, url)
          }

          current.content = contentStr
          announcement.value.content = contentStr
        }
      }

      // 如果有新的圖片上傳成功，更新公告的 content_images
      if (uploadedUrls.length > 0 && savedAnnouncement?.data?._id) {
        try {
          const existingImages = savedAnnouncement.data.content_images || []
          const updatedImages = [...existingImages, ...uploadedUrls]

          await announcementService.update(savedAnnouncement.data._id, {
            content_images: updatedImages,
          })
        } catch (error) {
          console.error('更新公告content_images失敗:', error)
        }
      }

      // 清空待上傳清單
      pendingContentImages.value = []
    }

    announcementDialog.value = false
    announcement.value = {}
    // 清理圖片預覽 URL
    if (selectedImage.value && selectedImage.value._previewUrl) {
      URL.revokeObjectURL(selectedImage.value._previewUrl)
    }
    selectedImage.value = null
    imageUrl.value = ''
    imageType.value = 'upload'
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('儲存公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '儲存公告失敗',
      life: 3000,
    })
  }
}

function editAnnouncement(row) {
  announcement.value = { ...row }

  // 辨識並設定內容格式
  const detectedFormat = detectContentFormat(row.content)
  contentFormat.value = detectedFormat
  announcement.value.content_format = detectedFormat

  // 清理之前的圖片預覽 URL
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
  selectedImage.value = null

  // 設定圖片類型和 URL
  if (row.image) {
    // 判斷是否為 Cloudinary URL
    if (row.image.includes('cloudinary.com')) {
      imageType.value = 'upload'
      imageUrl.value = ''
    } else {
      imageType.value = 'url'
      imageUrl.value = row.image
    }
  } else {
    imageType.value = 'upload'
    imageUrl.value = ''
  }

  // 清空待上傳的content圖片清單（編輯時不保留之前的待上傳圖片）
  pendingContentImages.value = []

  announcementDialog.value = true
}

function confirmDeleteAnnouncement(row) {
  announcement.value = row
  deleteAnnouncementDialog.value = true
}

async function deleteAnnouncement() {
  try {
    await announcementService.remove(announcement.value._id)
    deleteAnnouncementDialog.value = false
    announcement.value = {}
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已刪除',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('刪除公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '刪除公告失敗',
      life: 3000,
    })
  }
}

function confirmDeleteSelected() {
  deleteAnnouncementsDialog.value = true
}

async function deleteSelectedAnnouncements() {
  try {
    const ids = selectedAnnouncements.value.map((a) => a._id)
    // 後端未提供批次刪除端點，逐一刪除
    await Promise.all(ids.map((id) => announcementService.remove(id)))
    selectedAnnouncements.value = []
    deleteAnnouncementsDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已刪除選取公告',
      life: 3000,
    })
    await loadData() // 重新載入數據
  } catch (error) {
    console.error('批量刪除失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '批量刪除失敗',
      life: 3000,
    })
  }
}

async function publishAnnouncement(announcementId) {
  try {
    await announcementService.update(announcementId, {
      status: 'public',
    })
    const idx = announcements.value.findIndex((a) => a._id === announcementId)
    if (idx !== -1) {
      announcements.value[idx].status = 'public'
    }
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已發布',
      life: 3000,
    })
  } catch (error) {
    console.error('發布公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '發布公告失敗',
      life: 3000,
    })
  }
}

async function unpublishAnnouncement(announcementId) {
  try {
    await announcementService.update(announcementId, { status: 'hidden' })
    const idx = announcements.value.findIndex((a) => a._id === announcementId)
    if (idx !== -1) {
      announcements.value[idx].status = 'hidden'
    }
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已下架',
      life: 3000,
    })
  } catch (error) {
    console.error('下架公告失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '下架公告失敗',
      life: 3000,
    })
  }
}

async function togglePinAnnouncement(announcementId) {
  try {
    const idx = announcements.value.findIndex((a) => a._id === announcementId)
    if (idx === -1) return

    const newPinnedState = !announcements.value[idx].pinned
    await announcementService.update(announcementId, {
      pinned: newPinnedState,
    })
    announcements.value[idx].pinned = newPinnedState

    const action = newPinnedState ? '置頂' : '取消置頂'
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `公告已${action}`,
      life: 3000,
    })
  } catch (error) {
    console.error('切換置頂狀態失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '切換置頂狀態失敗',
      life: 3000,
    })
  }
}

async function batchPublish() {
  if (
    !selectedAnnouncements.value ||
    selectedAnnouncements.value.length === 0
  ) {
    toast.add({
      severity: 'warn',
      summary: '警告',
      detail: '請先選擇要發布的公告',
      life: 3000,
    })
    return
  }

  try {
    await Promise.all(
      selectedAnnouncements.value.map((announcement) =>
        publishAnnouncement(announcement._id),
      ),
    )

    selectedAnnouncements.value = []
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已批量發布公告',
      life: 3000,
    })
  } catch (error) {
    console.error('批量發布失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: error.response?.data?.error || '批量發布失敗',
      life: 3000,
    })
  }
}

// 工具函數
function getStatusLabel(status) {
  switch (status) {
    case 'public':
      return 'success'
    case 'draft':
      return 'info'
    case 'hidden':
      return 'secondary'
    case 'deleted':
      return 'danger'
    default:
      return null
  }
}

function getCategoryLabel(category) {
  switch (category) {
    case 'system':
      return 'danger'
    case 'activity':
      return 'warn'
    case 'update':
      return 'info'
    case 'other':
      return 'secondary'
    default:
      return null
  }
}

// 分頁事件處理
function onPageChange(event) {
  pageSize.value = event.rows
  currentPage.value = event.page + 1
  loadData()
}

// 篩選器變更處理
function onFilterChange() {
  currentPage.value = 1
  loadData()
}

// 圖片選擇處理
function onImageSelect(event) {
  if (event.files && event.files.length > 0) {
    // 清理之前的 URL 物件
    if (selectedImage.value && selectedImage.value._previewUrl) {
      URL.revokeObjectURL(selectedImage.value._previewUrl)
    }

    const file = event.files[0]
    // 為檔案添加預覽 URL
    if (typeof window !== 'undefined') {
      file._previewUrl = URL.createObjectURL(file)
    }
    selectedImage.value = file
  }
}

// 移除圖片
function removeImage() {
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
  selectedImage.value = null
}

// 取得圖片預覽 URL（安全處理 SSR）
function getImagePreviewUrl(file) {
  if (file && file._previewUrl) {
    return file._previewUrl
  }
  return ''
}

// 切換圖片類型
function switchImageType(type) {
  imageType.value = type
  if (type === 'upload') {
    imageUrl.value = ''
  } else {
    // 清理之前的圖片預覽 URL
    if (selectedImage.value && selectedImage.value._previewUrl) {
      URL.revokeObjectURL(selectedImage.value._previewUrl)
    }
    selectedImage.value = null
  }
}

// 驗證圖片 URL
function validateImageUrl(url) {
  if (!url) return true
  // 支援常見圖片服務的URL格式
  const imagePatterns = [
    // 有副檔名的圖片URL
    /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico|avif)(\?.*)?$/i,
    // Unsplash等服務的URL（沒有副檔名但有圖片參數）
    /^https?:\/\/[^\s]+\/[^\s]*\?(.*&)?auto=format(&.*)?$/i,
    // 其他圖片服務的URL（檢查常見圖片相關關鍵字）
    /^https?:\/\/[^\s]+\/[^\s]*(format|image|photo|picture|img)[^\s]*$/i,
    // 允許沒有副檔名的圖片URL（只要是圖片服務域名）
    /^https?:\/\/(images\.unsplash\.com|plus\.unsplash\.com|i\.imgur\.com|cdn\.pixabay\.com|images\.pexels\.com)[^\s]*$/i,
  ]

  return imagePatterns.some((pattern) => pattern.test(url))
}

// 內容格式辨識函數
function detectContentFormat(content) {
  if (!content) return 'plain'

  // 如果是物件且有 content 屬性，通常是 JSON 格式
  if (typeof content === 'object' && content !== null) {
    if (content.content && Array.isArray(content.content)) {
      return 'json'
    }
    // 其他物件格式也視為 JSON
    return 'json'
  }

  // 如果是字串，檢查是否包含 HTML 標籤或其他富文本特徵
  if (typeof content === 'string') {
    // 檢查是否包含常見的 HTML 標籤
    const htmlTags =
      /<(p|br|strong|em|u|del|code|h[1-6]|blockquote|ul|ol|li|a|img|hr)[^>]*>/i
    if (htmlTags.test(content)) {
      return 'json'
    }

    // 檢查是否包含 TipTap 常見的結構化特徵
    const jsonIndicators = [
      /"type":\s*"paragraph"/,
      /"marks":\s*\[/,
      /"content":\s*\[/,
      /"attrs":\s*{/,
    ]

    if (jsonIndicators.some((pattern) => pattern.test(content))) {
      return 'json'
    }
  }

  return 'plain'
}

// 處理內容格式變化
function handleContentChange(newContent) {
  // 自動辨識內容格式
  const detectedFormat = detectContentFormat(newContent)
  contentFormat.value = detectedFormat

  // 同步更新 announcement 物件中的 content_format 欄位
  if (announcement.value) {
    announcement.value.content_format = detectedFormat
  }
}

// 設定內容格式（手動切換用）
function setContentFormat(format) {
  contentFormat.value = format
  if (announcement.value) {
    announcement.value.content_format = format
  }
}

// 處理content中圖片上傳（參考post.vue做法，先收集後批量上傳）
function handleContentImageUpload(file, placeholderId) {
  // 將檔案和佔位符 ID 加入待上傳清單，而不是立即上傳
  pendingContentImages.value.push({
    file: file,
    placeholderId: placeholderId,
  })
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="新增公告"
            icon="pi pi-plus"
            severity="primary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="批量發布"
            icon="pi pi-check"
            severity="secondary"
            class="mr-2"
            @click="batchPublish"
            :disabled="!selectedAnnouncements || !selectedAnnouncements.length"
          />
          <Button
            label="刪除"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedAnnouncements || !selectedAnnouncements.length"
          />
        </template>

        <template #end>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="搜尋公告..."
              @input="onFilterChange"
            />
          </IconField>
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="announcements"
        v-model:selection="selectedAnnouncements"
        dataKey="_id"
        :loading="loading"
        lazy
        paginator
        :totalRecords="totalRecords"
        :rows="pageSize"
        :first="(currentPage - 1) * pageSize"
        :filters="filters"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        currentPageReportTemplate="顯示第 {first} 到 {last} 項，共 {totalRecords} 個公告"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        @page="onPageChange"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">公告管理</h4>
            <div class="flex gap-2">
              <Dropdown
                v-model="filters.category.value"
                :options="filterCategories"
                optionLabel="label"
                optionValue="value"
                placeholder="按分類篩選"
                @change="onFilterChange"
              />
              <Dropdown
                v-model="filters.status.value"
                :options="filterStatuses"
                optionLabel="label"
                optionValue="value"
                placeholder="按狀態篩選"
                @change="onFilterChange"
              />
            </div>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column field="title" header="標題" sortable style="min-width: 16rem">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <span>{{ slotProps.data.title }}</span>
              <i
                v-if="slotProps.data.pinned"
                class="pi pi-thumbtack text-orange-500"
              ></i>
            </div>
          </template>
        </Column>
        <Column
          field="category"
          header="分類"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.category === 'system'
                  ? '系統'
                  : slotProps.data.category === 'activity'
                    ? '活動'
                    : slotProps.data.category === 'update'
                      ? '更新'
                      : '其他'
              "
              :severity="getCategoryLabel(slotProps.data.category)"
            />
          </template>
        </Column>
        <Column field="status" header="狀態" sortable style="min-width: 10rem">
          <template #body="slotProps">
            <Tag
              :value="
                slotProps.data.status === 'public'
                  ? '已發布'
                  : slotProps.data.status === 'draft'
                    ? '草稿'
                    : slotProps.data.status === 'hidden'
                      ? '隱藏'
                      : '已刪除'
              "
              :severity="getStatusLabel(slotProps.data.status)"
            />
          </template>
        </Column>

        <Column
          field="createdAt"
          header="建立時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column
          field="updatedAt"
          header="更新時間"
          sortable
          style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ new Date(slotProps.data.updatedAt).toLocaleDateString('zh-TW') }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 16rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editAnnouncement(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status === 'draft'"
              icon="pi pi-check"
              outlined
              rounded
              severity="success"
              class="mr-2"
              @click="publishAnnouncement(slotProps.data._id)"
            />
            <Button
              v-if="slotProps.data.status === 'public'"
              icon="pi pi-times"
              outlined
              rounded
              severity="warning"
              class="mr-2"
              @click="unpublishAnnouncement(slotProps.data._id)"
            />
            <Button
              :icon="
                slotProps.data.pinned ? 'pi pi-thumbtack' : 'pi pi-thumbtack'
              "
              outlined
              rounded
              :severity="slotProps.data.pinned ? 'warning' : 'secondary'"
              class="mr-2"
              @click="togglePinAnnouncement(slotProps.data._id)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteAnnouncement(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 新增/編輯對話框 -->
    <Dialog
      v-model:visible="announcementDialog"
      :style="{ width: '600px' }"
      header="公告詳細資料"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="title" class="block font-bold mb-3">標題</label>
          <InputText
            id="title"
            v-model.trim="announcement.title"
            required="true"
            autofocus
            :invalid="submitted && !announcement.title"
            fluid
          />
          <small v-if="submitted && !announcement.title" class="text-red-500"
            >標題為必填項目。</small
          >
        </div>
        <div>
          <label for="content" class="block font-bold mb-3">內容</label>
          <div class="mb-3 flex gap-4 items-center">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="contentFormat"
                value="plain"
                :inputId="'content-plain'"
                @change="setContentFormat('plain')"
              />
              <label :for="'content-plain'" class="text-sm">純文字</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="contentFormat"
                value="json"
                :inputId="'content-json'"
                @change="setContentFormat('json')"
              />
              <label :for="'content-json'" class="text-sm">富文本</label>
            </div>
            <small class="text-gray-500"
              >目前格式：{{
                contentFormat === 'plain' ? '純文字' : '富文本'
              }}</small
            >
          </div>
          <TipTapEditor
            v-model="announcement.content"
            :output-json="contentFormat === 'json'"
            class="border rounded-lg min-h-[200px]"
            placeholder="請輸入公告內容..."
            @update:modelValue="handleContentChange"
            :onImageUpload="handleContentImageUpload"
          />
          <small v-if="submitted && !announcement.content" class="text-red-500">
            內容為必填項目。
          </small>
          <small
            v-else-if="contentFormat === 'json'"
            class="text-gray-500 mt-1 block"
          >
            支援富文本編輯：粗體、斜體、連結、清單、圖片等功能
          </small>
          <small v-else class="text-gray-500 mt-1 block">
            純文字模式：支援基本的文字輸入
          </small>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="category" class="block font-bold mb-3">分類</label>
            <Dropdown
              id="category"
              v-model="announcement.category"
              :options="formCategories"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇分類"
              fluid
            ></Dropdown>
          </div>
          <div>
            <label for="status" class="block font-bold mb-3">狀態</label>
            <Dropdown
              id="status"
              v-model="announcement.status"
              :options="formStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇狀態"
              fluid
            ></Dropdown>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <InputSwitch v-model="announcement.pinned" />
          <label class="text-sm">置頂公告</label>
        </div>

        <!-- 圖片上傳 -->
        <div>
          <label class="block font-bold mb-3">公告圖片</label>

          <!-- 圖片類型選擇 -->
          <div class="flex gap-4 mb-4">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="imageType"
                value="upload"
                :inputId="'upload'"
                @change="switchImageType('upload')"
              />
              <label :for="'upload'" class="text-sm">上傳圖片</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="imageType"
                value="url"
                :inputId="'url'"
                @change="switchImageType('url')"
              />
              <label :for="'url'" class="text-sm">使用連結</label>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <!-- 上傳圖片模式 -->
            <div v-if="imageType === 'upload'">
              <!-- 當前圖片預覽 -->
              <div
                v-if="
                  announcement.image &&
                  !selectedImage &&
                  announcement.image.includes('cloudinary.com')
                "
                class="relative"
              >
                <img
                  :src="announcement.image"
                  :alt="announcement.title"
                  class="w-full max-w-xs h-48 object-cover rounded-lg border"
                />
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  size="small"
                  class="absolute top-2 right-2"
                  @click="announcement.image = null"
                  text
                  rounded
                />
              </div>

              <!-- 新選擇的圖片預覽 -->
              <div v-if="selectedImage" class="relative">
                <img
                  :src="getImagePreviewUrl(selectedImage)"
                  :alt="selectedImage.name"
                  class="w-full max-w-xs h-48 object-cover rounded-lg border"
                />
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  size="small"
                  class="absolute top-2 right-2"
                  @click="removeImage"
                  text
                  rounded
                />
              </div>

              <!-- 圖片上傳元件 -->
              <FileUpload
                mode="basic"
                name="image"
                accept="image/*"
                :maxFileSize="5000000"
                @select="onImageSelect"
                chooseLabel="選擇圖片"
                :auto="false"
                class="w-full"
              />
              <small class="text-gray-500"
                >支援 JPG、PNG、GIF、WebP 格式，最大 5MB</small
              >
            </div>

            <!-- 圖片連結模式 -->
            <div v-if="imageType === 'url'">
              <InputText
                v-model="imageUrl"
                placeholder="請輸入圖片連結 (https://...)"
                class="w-full"
                :class="{
                  'p-invalid':
                    submitted && imageUrl && !validateImageUrl(imageUrl),
                }"
              />
              <small
                v-if="submitted && imageUrl && !validateImageUrl(imageUrl)"
                class="text-red-500"
                >請輸入有效的圖片連結</small
              >
              <small class="text-gray-500"
                >支援 JPG、PNG、GIF、WebP、SVG 格式的圖片連結</small
              >

              <!-- 圖片連結預覽 -->
              <div
                v-if="imageUrl && validateImageUrl(imageUrl)"
                class="relative"
              >
                <img
                  :src="imageUrl"
                  :alt="announcement.title || '預覽圖片'"
                  class="w-full max-w-xs h-48 object-cover rounded-lg border"
                  @error="$event.target.style.display = 'none'"
                />
              </div>
            </div>

            <!-- 當前外部圖片預覽 -->
            <div
              v-if="
                announcement.image &&
                !announcement.image.includes('cloudinary.com') &&
                imageType === 'url'
              "
              class="relative"
            >
              <img
                :src="announcement.image"
                :alt="announcement.title"
                class="w-full max-w-xs h-48 object-cover rounded-lg border"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                size="small"
                class="absolute top-2 right-2"
                @click="
                  () => {
                    announcement.image = null
                    imageUrl = ''
                  }
                "
                text
                rounded
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" text @click="hideDialog" />
        <Button label="儲存" icon="pi pi-check" @click="saveAnnouncement" />
      </template>
    </Dialog>

    <!-- 單筆刪除確認 -->
    <Dialog
      v-model:visible="deleteAnnouncementDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="announcement"
          >您確定要刪除公告 <b>{{ announcement.title }}</b> 嗎？</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementDialog = false"
        />
        <Button label="是" icon="pi pi-check" @click="deleteAnnouncement" />
      </template>
    </Dialog>

    <!-- 多筆刪除確認 -->
    <Dialog
      v-model:visible="deleteAnnouncementsDialog"
      :style="{ width: '450px' }"
      header="確認"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>您確定要刪除選取的公告嗎？</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          text
          @click="deleteAnnouncementsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          text
          @click="deleteSelectedAnnouncements"
        />
      </template>
    </Dialog>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '公告管理'
  admin: true
</route>
