<template>
  <div class="relative">
    <!-- 通知按鈕（使用 OverlayBadge 顯示未讀） -->
    <OverlayBadge
      v-if="unreadCount > 0"
      :value="unreadCount > 99 ? '99+' : unreadCount.toString()"
      severity="danger"
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
                'bg-primary-50 dark:bg-primary-900/20': !notification.read,
              }"
              @mouseenter="handleHoverMarkRead(notification)"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start gap-3">
                <!-- 通知圖標 -->
                <div class="flex-shrink-0">
                  <i
                    :class="getNotificationIcon(notification.type)"
                    class="text-lg text-primary-500"
                  ></i>
                </div>

                <!-- 通知內容 -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ notification.content }}
                  </p>

                  <div class="flex items-center justify-between mt-1">
                    <p class="text-xs text-gray-500">
                      {{ formatTime(notification.createdAt) }}
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
                <div v-if="!notification.read" class="flex-shrink-0">
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import OverlayBadge from 'primevue/overlaybadge'
import ProgressSpinner from 'primevue/progressspinner'
import notificationService from '@/services/notificationService'

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

// Popover 和按鈕引用
const notificationPopover = ref(null)
const notificationBtn = ref(null)

// 計算屬性
const hasMore = computed(() => currentPage.value < totalPages.value)

// 方法
const toggleNotifications = (event) => {
  notificationPopover.value.toggle(event)
  if (!notifications.value.length) {
    fetchNotifications()
  }
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

      // 計算未讀數量
      updateUnreadCount()
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
  unreadCount.value = notifications.value.filter((n) => !n.read).length
}

const markAsRead = async (notificationId, options = {}) => {
  // 檢查用戶是否已登入
  if (!user.isLoggedIn) {
    return
  }

  if (markingRead.value.includes(notificationId)) return

  markingRead.value.push(notificationId)
  try {
    await notificationService.markRead(notificationId)

    // 更新本地狀態
    const notification = notifications.value.find(
      (n) => n._id === notificationId,
    )
    if (notification) {
      notification.read = true
      updateUnreadCount()
    }

    if (!options.silent) {
      toast.add({
        severity: 'success',
        summary: '已標記為已讀',
        life: 2000,
      })
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
  if (!notification || notification.read) return
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
    await notificationService.markAllRead()

    // 更新本地狀態
    notifications.value.forEach((notification) => {
      notification.read = true
    })
    updateUnreadCount()

    toast.add({
      severity: 'success',
      summary: '已全部標記為已讀',
      life: 2000,
    })
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
    await notificationService.removeBatch()
    // 清空列表與狀態
    notifications.value = []
    currentPage.value = 1
    totalPages.value = 1
    updateUnreadCount()

    toast.add({
      severity: 'success',
      summary: '已全部移除',
      life: 2000,
    })
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
  if (!notification.read) {
    markAsRead(notification._id)
  }

  // 如果有 URL，則跳轉
  if (notification.url) {
    // 檢查是否為外部連結
    if (notification.url.startsWith('http')) {
      window.open(notification.url, '_blank')
    } else {
      // 內部路由
      router.push(notification.url)
      notificationPopover.value.hide()
    }
  }
}

const getNotificationIcon = (type) => {
  const iconMap = {
    like: 'pi pi-heart',
    comment: 'pi pi-comment',
    follow: 'pi pi-user-plus',
    mention: 'pi pi-at',
    system: 'pi pi-cog',
    announcement: 'pi pi-megaphone',
    default: 'pi pi-bell',
  }
  return iconMap[type] || iconMap.default
}

const formatTime = (timestamp) => {
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

// 組件掛載時獲取通知
onMounted(() => {
  // 檢查用戶是否已登入
  if (user.isLoggedIn) {
    fetchNotifications()

    // 設定定期檢查（每5分鐘）
    const interval = setInterval(checkForNewNotifications, 5 * 60 * 1000)

    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', checkForNewNotifications)

    // 清理
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', checkForNewNotifications)
    }
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
