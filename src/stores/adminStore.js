import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 管理後台狀態管理
export const useAdminStore = defineStore('admin', () => {
  // 狀態定義
  const dashboardData = ref(null)
  const dashboardLastUpdated = ref(null)
  const dashboardLoading = ref(false)

  // 迷因管理
  const memes = ref([])
  const memeStats = ref(null)
  const memesLoading = ref(false)

  // 用戶管理
  const users = ref([])
  const userStats = ref(null)
  const usersLoading = ref(false)

  // 檢舉管理
  const reports = ref([])
  const reportStats = ref(null)
  const reportsLoading = ref(false)

  // 公告管理
  const announcements = ref([])
  const announcementStats = ref(null)
  const announcementsLoading = ref(false)

  // 分析數據
  const analyticsData = ref(null)
  const algorithmStats = ref([])
  const analyticsLoading = ref(false)

  // 系統狀態
  const systemHealth = ref(null)
  const systemLoading = ref(false)

  // 計算屬性
  const totalStats = computed(() => ({
    memes: memeStats.value?.total || 0,
    users: userStats.value?.total || 0,
    reports: reportStats.value?.pending || 0,
    systemHealth: systemHealth.value?.status || 'unknown',
  }))

  // 統計卡片數據
  const statsCards = computed(() => [
    {
      title: '總迷因數',
      value: formatNumber(memeStats.value?.total || 8456),
      icon: 'pi pi-image',
      color: 'blue',
      change: `+${memeStats.value?.thisWeek || 156}`,
      changeText: '本週新增',
      changeType: 'positive'
    },
    {
      title: '活躍用戶',
      value: formatNumber(userStats.value?.active || 15241),
      icon: 'pi pi-users',
      color: 'green',
      change: `+${userStats.value?.newThisWeek || 24}`,
      changeText: '本週新增',
      changeType: 'positive'
    },
    {
      title: '待處理檢舉',
      value: reportStats.value?.pending || 23,
      icon: 'pi pi-flag',
      color: reportStats.value?.pending > 50 ? 'red' : 'orange',
      change: `-${reportStats.value?.processed || 5}`,
      changeText: '已處理',
      changeType: 'positive'
    },
    {
      title: '系統健康度',
      value: `${systemHealth.value?.uptime || 98}%`,
      icon: 'pi pi-check-circle',
      color: 'purple',
      change: `+${systemHealth.value?.improvement || 2}%`,
      changeText: '較上週',
      changeType: 'positive'
    }
  ])

  // 過濾器
  const pendingMemes = computed(() =>
    memes.value.filter((meme) => meme.status === 'pending')
  )
  
  const bannedUsers = computed(() =>
    users.value.filter((user) => user.status === 'banned')
  )
  
  const urgentReports = computed(() =>
    reports.value.filter((report) => report.priority === 'high')
  )
  
  const publishedAnnouncements = computed(() =>
    announcements.value.filter(
      (announcement) => announcement.status === 'published'
    )
  )
  
  const pinnedAnnouncements = computed(() =>
    announcements.value.filter(
      (announcement) => announcement.is_pinned === true
    )
  )

  // 方法
  // 格式化數字顯示
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // 載入儀表板數據
  const loadDashboardData = async () => {
    // 檢查快取是否有效（5分鐘內）
    if (
      dashboardData.value &&
      dashboardLastUpdated.value &&
      Date.now() - dashboardLastUpdated.value < 5 * 60 * 1000
    ) {
      return dashboardData.value
    }

    dashboardLoading.value = true
    try {
      // 模擬載入數據 - 實際應該調用API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模擬數據
      const mockData = {
        analytics: {
          overall_stats: {
            ctr: 0.125,
            engagement_rate: 0.34
          }
        },
        memes: {
          total: 8456,
          thisWeek: 156,
          approved: 8200,
          pending: 256
        },
        users: {
          total: 15241,
          active: 12450,
          newThisWeek: 24
        },
        reports: {
          total: 89,
          pending: 23,
          processed: 5
        },
        system: {
          uptime: 98,
          improvement: 2,
          status: 'healthy'
        }
      }

      dashboardData.value = mockData
      memeStats.value = mockData.memes
      userStats.value = mockData.users
      reportStats.value = mockData.reports
      systemHealth.value = mockData.system
      dashboardLastUpdated.value = Date.now()
      
      return mockData
    } catch (error) {
      console.error('載入儀表板數據失敗:', error)
      throw error
    } finally {
      dashboardLoading.value = false
    }
  }

  // 載入迷因數據
  const loadMemes = async (params = {}) => {
    memesLoading.value = true
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockMemes = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `迷因 ${i + 1}`,
        author: `用戶${i + 1}`,
        status: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000)
      }))
      
      memes.value = mockMemes
      return { memes: mockMemes, total: 8456 }
    } catch (error) {
      console.error('載入迷因數據失敗:', error)
      throw error
    } finally {
      memesLoading.value = false
    }
  }

  // 載入用戶數據
  const loadUsers = async (params = {}) => {
    usersLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockUsers = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['active', 'banned', 'inactive'][Math.floor(Math.random() * 3)],
        role: ['user', 'moderator', 'admin'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        posts_count: Math.floor(Math.random() * 100)
      }))
      
      users.value = mockUsers
      return { users: mockUsers, total: 15241 }
    } catch (error) {
      console.error('載入用戶數據失敗:', error)
      throw error
    } finally {
      usersLoading.value = false
    }
  }

  // 載入檢舉數據
  const loadReports = async (params = {}) => {
    reportsLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockReports = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        type: ['spam', 'inappropriate', 'copyright', 'harassment'][Math.floor(Math.random() * 4)],
        status: ['pending', 'resolved', 'dismissed'][Math.floor(Math.random() * 3)],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        reported_by: `user${Math.floor(Math.random() * 100)}`,
        target_type: 'meme',
        target_id: Math.floor(Math.random() * 1000),
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
      
      reports.value = mockReports
      return { reports: mockReports, total: 89 }
    } catch (error) {
      console.error('載入檢舉數據失敗:', error)
      throw error
    } finally {
      reportsLoading.value = false
    }
  }

  // 清除快取
  const clearCache = () => {
    dashboardData.value = null
    dashboardLastUpdated.value = null
    memes.value = []
    users.value = []
    reports.value = []
    announcements.value = []
    analyticsData.value = null
    algorithmStats.value = []
  }

  return {
    // 狀態
    dashboardData,
    dashboardLastUpdated,
    dashboardLoading,
    memes,
    memeStats,
    memesLoading,
    users,
    userStats,
    usersLoading,
    reports,
    reportStats,
    reportsLoading,
    announcements,
    announcementStats,
    announcementsLoading,
    analyticsData,
    algorithmStats,
    analyticsLoading,
    systemHealth,
    systemLoading,

    // 計算屬性
    totalStats,
    statsCards,
    pendingMemes,
    bannedUsers,
    urgentReports,
    publishedAnnouncements,
    pinnedAnnouncements,

    // 方法
    loadDashboardData,
    loadMemes,
    loadUsers,
    loadReports,
    clearCache
  }
})