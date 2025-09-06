<template>
  <div class="relative">
    <!-- 通知按鈕（使用 OverlayBadge 顯示未讀） -->
    <OverlayBadge
      v-if="unreadCount > 0"
      :value="unreadCount > 99 ? '99+' : unreadCount.toString()"
      size="small"
    >
      <Button
        @click="toggleNotifications"
        severity="contrast"
        class="p-button-text rounded-full w-10 h-10"
        :title="'通知'"
        ref="notificationBtn"
      >
        <i class="pi pi-bell"></i>
      </Button>
    </OverlayBadge>
    <Button
      v-else
      @click="toggleNotifications"
      severity="contrast"
      class="p-button-text rounded-full w-10 h-10"
      :title="'通知'"
      ref="notificationBtn"
    >
      <i class="pi pi-bell"></i>
    </Button>

    <!-- 通知彈出框 -->
    <Popover ref="notificationPopover" class="w-96">
      <div class="flex flex-col max-h-96">
        <!-- 標題區域 -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h5 class="text-lg font-semibold">通知</h5>
          <div class="flex gap-2">
            <Button
              @click="showSettings = !showSettings"
              size="small"
              severity="secondary"
              class="text-xs"
            >
              <i class="pi pi-cog mr-1"></i>
              設置
            </Button>
            <Button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              size="small"
              severity="secondary"
              class="text-xs"
              :disabled="markingAllRead"
            >
              <i class="pi pi-check mr-1"></i>
              全部已讀
            </Button>
            <Button
              @click="removeAllNotifications"
              size="small"
              class="text-xs"
              :disabled="deletingAll || loading || notifications.length === 0"
            >
              <i class="pi pi-trash mr-1"></i>
              全部移除
            </Button>
          </div>
        </div>

        <!-- 通知設置區域 -->
        <div
          v-if="showSettings"
          class="p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <h6 class="text-sm font-medium mb-3">通知設置</h6>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">新追蹤者通知</span>
              <ToggleSwitch
                v-model="notificationSettings.newFollower"
                @change="
                  updateNotificationSetting(
                    'newFollower',
                    notificationSettings.newFollower,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">新留言通知</span>
              <ToggleSwitch
                v-model="notificationSettings.newComment"
                @change="
                  updateNotificationSetting(
                    'newComment',
                    notificationSettings.newComment,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">新按讚通知</span>
              <ToggleSwitch
                v-model="notificationSettings.newLike"
                @change="
                  updateNotificationSetting(
                    'newLike',
                    notificationSettings.newLike,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">提及通知</span>
              <ToggleSwitch
                v-model="notificationSettings.newMention"
                @change="
                  updateNotificationSetting(
                    'newMention',
                    notificationSettings.newMention,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">熱門內容通知</span>
              <ToggleSwitch
                v-model="notificationSettings.trendingContent"
                @change="
                  updateNotificationSetting(
                    'trendingContent',
                    notificationSettings.trendingContent,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">週報摘要通知</span>
              <ToggleSwitch
                v-model="notificationSettings.weeklyDigest"
                @change="
                  updateNotificationSetting(
                    'weeklyDigest',
                    notificationSettings.weeklyDigest,
                  )
                "
                :disabled="updatingSettings"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">瀏覽器推送通知</span>
              <ToggleSwitch
                v-model="notificationSettings.browser"
                @change="updateBrowserNotificationSetting"
                :disabled="updatingSettings"
              />
            </div>
          </div>
        </div>

        <!-- 通知列表 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 載入中 -->
          <div
            v-if="loading && notifications.length === 0"
            class="p-4 text-center"
          >
            <ProgressSpinner size="small" />
            <p class="text-sm text-gray-500 mt-2">載入中...</p>
          </div>

          <!-- 無通知 -->
          <div v-else-if="notifications.length === 0" class="p-4 text-center">
            <i class="pi pi-bell-slash text-3xl text-gray-400 mb-2"></i>
            <p class="text-gray-500">暫無通知</p>
          </div>

          <!-- 通知項目 -->
          <div v-else class="divide-y">
            <div
              v-for="notification in notifications"
              :key="notification._id"
              class="p-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
              :class="{
                'bg-primary-50 dark:bg-primary-900/20': !notification.is_read,
              }"
              @mouseenter="handleHoverMarkRead(notification)"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start gap-3">
                <!-- 通知圖標 -->
                <div class="flex-shrink-0">
                  <i
                    :class="getNotificationIcon(notification.verb)"
                    class="text-lg text-primary-500"
                  ></i>
                </div>

                <!-- 通知內容 -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ getNotificationText(notification) }}
                  </p>

                  <div class="flex items-center justify-between mt-1">
                    <p class="text-xs text-gray-500">
                      {{
                        formatTime(
                          notification.createdAt || notification.eventCreatedAt,
                        )
                      }}
                    </p>

                    <!-- 操作按鈕 -->
                    <div class="flex gap-1">
                      <Button
                        @click.stop="deleteNotification(notification._id)"
                        size="small"
                        severity="primary"
                        class="p-1 text-xs"
                        :disabled="deleting.includes(notification._id)"
                      >
                        <i class="pi pi-trash"></i>
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- 未讀指示點 -->
                <div v-if="!notification.is_read" class="flex-shrink-0">
                  <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 載入更多 -->
        <div v-if="hasMore" class="p-3 border-t">
          <Button
            @click="loadMore"
            class="w-full"
            severity="secondary"
            size="small"
            :disabled="loading"
          >
            <i class="pi pi-angle-down mr-1"></i>
            載入更多
          </Button>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import OverlayBadge from 'primevue/overlaybadge'
import ProgressSpinner from 'primevue/progressspinner'
import notificationService from '@/services/notificationService'
import ToggleSwitch from 'primevue/toggleswitch'

const router = useRouter()
const toast = useToast()
const user = useUserStore()

// 響應式數據
const notifications = ref([])
const loading = ref(false)
const markingRead = ref([])
const markingAllRead = ref(false)
const deleting = ref([])
const deletingAll = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const unreadCount = ref(0)
const showSettings = ref(false)
const notificationSettings = ref({
  newFollower: true,
  newComment: true,
  newLike: true,
  newMention: true,
  trendingContent: false,
  weeklyDigest: true,
  browser: false,
})
const updatingSettings = ref(false)

// Popover 和按鈕引用
const notificationPopover = ref(null)
const notificationBtn = ref(null)

// 計算屬性
const hasMore = computed(() => currentPage.value < totalPages.value)

// 監聽用戶登入狀態變化
watch(
  () => user.isLoggedIn,
  (newValue) => {
    if (newValue) {
      // 用戶登入時重新載入數據
      initUnreadCount()
      fetchNotifications()
      getNotificationSettings()

      // 檢查瀏覽器通知權限
      if ('Notification' in window) {
        if (Notification.permission === 'denied') {
          notificationSettings.value.browser = false
          localStorage.setItem(
            'notificationSettings',
            JSON.stringify(notificationSettings.value),
          )
        }
      } else {
        notificationSettings.value.browser = false
        localStorage.setItem(
          'notificationSettings',
          JSON.stringify(notificationSettings.value),
        )
      }
    } else {
      // 用戶登出時清空數據
      notifications.value = []
      unreadCount.value = 0
      currentPage.value = 1
      totalPages.value = 1
    }
  },
)

// 方法
const toggleNotifications = (event) => {
  notificationPopover.value.toggle(event)
  // 每次點擊都重新請求，避免遺漏新訊息
  fetchNotifications()
}

const fetchNotifications = async (append = false) => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (loading.value) return

  loading.value = true
  try {
    const params = {
      page: append ? currentPage.value + 1 : 1,
      limit: 10,
      // 只獲取未刪除的通知
      deleted: false,
    }

    const response = await notificationService.getAll(params)

    if (response.data.success) {
      const newNotifications = response.data.data

      if (append) {
        notifications.value.push(...newNotifications)
        currentPage.value++
      } else {
        notifications.value = newNotifications
        currentPage.value = 1
      }

      // 更新分頁資訊
      if (response.data.pagination) {
        totalPages.value = response.data.pagination.pages
      }

      // 更新未讀數量（從 API 響應中獲取）
      if (response.data.unreadCount !== undefined) {
        unreadCount.value = response.data.unreadCount
      } else {
        updateUnreadCount()
      }
    }
  } catch (error) {
    console.error('獲取通知失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法載入通知',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const updateUnreadCount = () => {
  unreadCount.value = notifications.value.filter((n) => !n.is_read).length
}

const markAsRead = async (notificationId, options = {}) => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (markingRead.value.includes(notificationId)) return

  markingRead.value.push(notificationId)
  try {
    const response = await notificationService.markRead(notificationId)

    if (response.data.success) {
      // 更新本地狀態
      const notification = notifications.value.find(
        (n) => n._id === notificationId,
      )
      if (notification) {
        notification.is_read = true
        notification.readAt = new Date().toISOString()
        updateUnreadCount()
      }

      if (!options.silent) {
        toast.add({
          severity: 'success',
          summary: '已標記為已讀',
          life: 2000,
        })
      }
    }
  } catch (error) {
    console.error('標記已讀失敗:', error)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: '無法標記為已讀',
      life: 3000,
    })
  } finally {
    markingRead.value = markingRead.value.filter((id) => id !== notificationId)
  }
}

// 滑鼠移入即標記為已讀（靜默）
const handleHoverMarkRead = (notification) => {
  if (!notification || notification.is_read) return
  if (markingRead.value.includes(notification._id)) return
  markAsRead(notification._id, { silent: true })
}

const markAllAsRead = async () => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (markingAllRead.value) return

  markingAllRead.value = true
  try {
    const response = await notificationService.markAllRead()

    if (response.data.success) {
      // 更新本地狀態
      notifications.value.forEach((notification) => {
        notification.is_read = true
        notification.readAt = new Date().toISOString()
      })
      unreadCount.value = 0

      toast.add({
        severity: 'success',
        summary: '已全部標記為已讀',
        life: 2000,
      })
    }
  } catch (error) {
    console.error('全部標記已讀失敗:', error)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: '無法標記全部為已讀',
      life: 3000,
    })
  } finally {
    markingAllRead.value = false
  }
}

const deleteNotification = async (notificationId) => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (deleting.value.includes(notificationId)) return

  deleting.value.push(notificationId)
  try {
    await notificationService.remove(notificationId)

    // 從本地列表中移除
    notifications.value = notifications.value.filter(
      (n) => n._id !== notificationId,
    )
    updateUnreadCount()

    toast.add({
      severity: 'success',
      summary: '通知已刪除',
      life: 2000,
    })
  } catch (error) {
    console.error('刪除通知失敗:', error)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: '無法刪除通知',
      life: 3000,
    })
  } finally {
    deleting.value = deleting.value.filter((id) => id !== notificationId)
  }
}

// 已移除手動重新整理按鈕，避免重複讀取

const loadMore = () => {
  fetchNotifications(true)
}

const removeAllNotifications = async () => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) return
  if (deletingAll.value || loading.value) return

  deletingAll.value = true
  try {
    const response = await notificationService.removeBatch({
      unreadOnly: false,
    })

    if (response.data.success) {
      // 清空列表與狀態
      notifications.value = []
      currentPage.value = 1
      totalPages.value = 1
      unreadCount.value = 0

      toast.add({
        severity: 'success',
        summary: '已全部移除',
        life: 2000,
      })
    }
  } catch (error) {
    console.error('全部移除通知失敗:', error)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: '無法移除所有通知',
      life: 3000,
    })
  } finally {
    deletingAll.value = false
  }
}

const handleNotificationClick = (notification) => {
  // 如果通知未讀，先標記為已讀
  if (!notification.is_read) {
    markAsRead(notification._id)
  }

  // 如果有 URL，則跳轉
  if (notification.url) {
    try {
      // 檢查是否為外部連結
      if (notification.url.startsWith('http')) {
        window.open(notification.url, '_blank')
      } else {
        // 內部路由
        router.push(notification.url)
        notificationPopover.value.hide()
      }
    } catch (error) {
      console.error('跳轉失敗:', error)
      toast.add({
        severity: 'error',
        summary: '跳轉失敗',
        detail: '無法打開通知連結',
        life: 3000,
      })
    }
  } else if (notification.objectType && notification.objectId) {
    // 根據物件類型生成默認跳轉 URL
    try {
      let url = ''
      switch (notification.objectType) {
        case 'meme':
          url = `/memes/detail/${notification.objectId}`
          break
        case 'comment':
          url = `/memes/detail/${notification.objectId}`
          break
        case 'user':
          url = `/users/${notification.objectId}`
          break
        case 'collection':
          url = `/collections/${notification.objectId}`
          break
        default:
          return
      }

      if (url) {
        router.push(url)
        notificationPopover.value.hide()
      }
    } catch (error) {
      console.error('生成跳轉 URL 失敗:', error)
    }
  }
}

const getNotificationIcon = (verb) => {
  const iconMap = {
    like: 'pi pi-heart',
    comment: 'pi pi-comment',
    follow: 'pi pi-user-plus',
    mention: 'pi pi-at',
    system: 'pi pi-cog',
    announcement: 'pi pi-megaphone',
    share: 'pi pi-share-alt',
    report: 'pi pi-flag',
    default: 'pi pi-bell',
  }
  return iconMap[verb] || iconMap.default
}

const getNotificationText = (notification) => {
  // 優先使用 title 字段
  if (notification.title) {
    return notification.title
  }

  // 其次使用 content 字段
  if (notification.content) {
    return notification.content
  }

  // 根據 verb 生成默認文本
  const verbTextMap = {
    like: '有人對您的內容按讚',
    comment: '有人評論了您的內容',
    follow: '有人開始關注您',
    mention: '有人在內容中提到了您',
    system: '系統通知',
    announcement: '公告',
    share: '有人分享了您的內容',
    report: '舉報通知',
  }

  return verbTextMap[notification.verb] || '新通知'
}

const formatTime = (timestamp) => {
  if (!timestamp) return '剛剛'

  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '剛剛'
  if (minutes < 60) return `${minutes}分鐘前`
  if (hours < 24) return `${hours}小時前`
  if (days < 7) return `${days}天前`

  return time.toLocaleDateString('zh-TW')
}

// 定期檢查新通知
const checkForNewNotifications = () => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (!document.hidden) {
    // 只獲取第一頁來檢查是否有新通知
    fetchNotifications()
  }
}

// 初始化未讀通知數量
const initUnreadCount = async () => {
  if (!user.isLoggedIn) return

  try {
    const response = await notificationService.getUnreadCount()
    if (response.data.success) {
      unreadCount.value = response.data.data.unreadCount
    }
  } catch (error) {
    console.error('獲取未讀通知數量失敗:', error)
  }
}

// 獲取通知設置
const getNotificationSettings = async () => {
  if (!user.isLoggedIn) return

  try {
    const response = await notificationService.getNotificationSettings()
    if (response.data.success) {
      // 合併默認設置和用戶設置
      const userSettings = response.data.data || {}
      const settings = {
        newFollower:
          userSettings.newFollower !== undefined
            ? userSettings.newFollower
            : true,
        newComment:
          userSettings.newComment !== undefined
            ? userSettings.newComment
            : true,
        newLike:
          userSettings.newLike !== undefined ? userSettings.newLike : true,
        newMention:
          userSettings.newMention !== undefined
            ? userSettings.newMention
            : true,
        trendingContent:
          userSettings.trendingContent !== undefined
            ? userSettings.trendingContent
            : false,
        weeklyDigest:
          userSettings.weeklyDigest !== undefined
            ? userSettings.weeklyDigest
            : true,
        browser:
          userSettings.browser !== undefined ? userSettings.browser : false,
      }
      notificationSettings.value = settings

      // 保存到本地存儲
      localStorage.setItem('notificationSettings', JSON.stringify(settings))
    }
  } catch (error) {
    console.error('獲取通知設置失敗:', error)
    // 嘗試從本地存儲恢復設置
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      try {
        notificationSettings.value = JSON.parse(savedSettings)
      } catch {
        // 使用默認設置
        notificationSettings.value = {
          newFollower: true,
          newComment: true,
          newLike: true,
          newMention: true,
          trendingContent: false,
          weeklyDigest: true,
          browser: false,
        }
      }
    } else {
      // 使用默認設置
      notificationSettings.value = {
        newFollower: true,
        newComment: true,
        newLike: true,
        newMention: true,
        trendingContent: false,
        weeklyDigest: true,
        browser: false,
      }
    }
  }
}

// 更新通知設置
const updateNotificationSetting = async (key, value) => {
  if (!user.isLoggedIn) return

  if (updatingSettings.value) return

  updatingSettings.value = true
  try {
    // 使用專門的通知設定 API 端點
    // 準備完整的通知設定物件，確保所有設定都被包含
    const requestData = { ...notificationSettings.value, [key]: value }

    const response =
      await notificationService.updateNotificationSettings(requestData)

    if (response.data.success) {
      notificationSettings.value[key] = value

      // 更新本地存儲
      localStorage.setItem(
        'notificationSettings',
        JSON.stringify(notificationSettings.value),
      )

      toast.add({
        severity: 'success',
        summary: '設置已更新',
        detail: `通知設置已更新`,
        life: 2000,
      })
    }
  } catch (error) {
    console.error('更新通知設置失敗:', error)
    // 恢復原始值
    notificationSettings.value[key] = !value

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '無法更新通知設置'

    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    updatingSettings.value = false
  }
}

// 更新瀏覽器推送通知設置
const updateBrowserNotificationSetting = async () => {
  if (!user.isLoggedIn) return

  if (updatingSettings.value) return

  updatingSettings.value = true
  try {
    // 檢查瀏覽器通知權限
    if (notificationSettings.value.browser) {
      if (!('Notification' in window)) {
        toast.add({
          severity: 'warn',
          summary: '不支援',
          detail: '您的瀏覽器不支援推送通知',
          life: 3000,
        })
        notificationSettings.value.browser = false
        return
      }

      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          notificationSettings.value.browser = false
          toast.add({
            severity: 'warn',
            summary: '權限被拒絕',
            detail: '需要通知權限才能啟用瀏覽器推送通知',
            life: 3000,
          })
          return
        }
      } else if (Notification.permission === 'denied') {
        notificationSettings.value.browser = false
        toast.add({
          severity: 'warn',
          summary: '權限被拒絕',
          detail: '請在瀏覽器設置中允許通知權限',
          life: 3000,
        })
        return
      }
    }

    // 更新設置 - 使用專門的通知設定 API 端點
    // 準備完整的通知設定物件，確保所有設定都被包含
    const requestData = { ...notificationSettings.value }
    const response =
      await notificationService.updateNotificationSettings(requestData)

    if (response.data.success) {
      localStorage.setItem(
        'notificationSettings',
        JSON.stringify(notificationSettings.value),
      )
      toast.add({
        severity: 'success',
        summary: '設置已更新',
        detail: '瀏覽器推送通知設置已更新',
        life: 2000,
      })
    }
  } catch (error) {
    console.error('更新瀏覽器推送通知設置失敗:', error)
    // 恢復原始值
    notificationSettings.value.browser = !notificationSettings.value.browser

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '無法更新瀏覽器推送通知設置'

    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    updatingSettings.value = false
  }
}

// 組件掛載時獲取通知
onMounted(() => {
  // 檢查用戶是否已登入
  if (user.isLoggedIn) {
    // 先初始化未讀數量
    initUnreadCount()
    // 然後獲取通知列表
    fetchNotifications()
    // 獲取通知設置
    getNotificationSettings()
  } else {
    // 用戶未登入時，嘗試從本地存儲載入設置
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      try {
        notificationSettings.value = JSON.parse(savedSettings)
      } catch {
        // 使用默認設置
      }
    }
  }

  // 檢查瀏覽器通知權限
  if ('Notification' in window) {
    if (Notification.permission === 'denied') {
      // 如果權限被拒絕，禁用瀏覽器通知設置
      notificationSettings.value.browser = false
      localStorage.setItem(
        'notificationSettings',
        JSON.stringify(notificationSettings.value),
      )
    }
  } else {
    // 瀏覽器不支援通知，禁用設置
    notificationSettings.value.browser = false
    localStorage.setItem(
      'notificationSettings',
      JSON.stringify(notificationSettings.value),
    )
  }

  // 設定定期檢查（每5分鐘）
  const interval = setInterval(checkForNewNotifications, 5 * 60 * 1000)

  // 監聽頁面可見性變化
  document.addEventListener('visibilitychange', checkForNewNotifications)

  // 清理
  return () => {
    clearInterval(interval)
    document.removeEventListener('visibilitychange', checkForNewNotifications)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
