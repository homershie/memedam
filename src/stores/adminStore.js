import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import memeService from '@/services/memeService'
import userService from '@/services/userService'
import tagService from '@/services/tagService'
import analyticsService from '@/services/analyticsService'
import reportService from '@/services/reportService'
import { handleServiceError, processApiResponse } from '@/utils/adminUtils'

export const useAdminStore = defineStore('admin', () => {
  // 狀態
  const dashboardData = ref(null)
  const dashboardLastUpdated = ref(null)
  const dashboardLoading = ref(false)

  // 迷因管理
  const memes = ref([])
  const memeStats = ref(null)
  const memesLoading = ref(false)
  const memePagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })

  // 用戶管理
  const users = ref([])
  const userStats = ref(null)
  const usersLoading = ref(false)
  const userPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })

  // 標籤管理
  const tags = ref([])
  const tagStats = ref(null)
  const tagsLoading = ref(false)
  const tagPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })

  // 檢舉管理
  const reports = ref([])
  const reportStats = ref(null)
  const reportsLoading = ref(false)
  const reportPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })
  const pendingReportsCount = ref(0)
  const pendingReportsLoading = ref(false)
  const pendingReportsLastUpdated = ref(null)

  // 公告管理
  const announcements = ref([])
  const announcementStats = ref(null)
  const announcementsLoading = ref(false)
  const announcementPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  })

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
    tags: tagStats.value?.total || 0,
    reports: reportStats.value?.pending || 0,
    systemHealth: systemHealth.value?.status || 'unknown',
  }))

  const pendingMemes = computed(() =>
    memes.value.filter((meme) => meme.status === 'pending'),
  )

  const bannedUsers = computed(() =>
    users.value.filter((user) => user.status === 'banned'),
  )

  const urgentReports = computed(() =>
    reports.value.filter((report) => report.priority === 'high'),
  )

  const publishedAnnouncements = computed(() =>
    announcements.value.filter(
      (announcement) => announcement.status === 'published',
    ),
  )

  const pinnedAnnouncements = computed(() =>
    announcements.value.filter(
      (announcement) => announcement.is_pinned === true,
    ),
  )

  // 動作
  const loadDashboardData = async () => {
    // 檢查快取是否有效（5分鐘）
    if (
      dashboardData.value &&
      Date.now() - dashboardLastUpdated.value < 5 * 60 * 1000
    ) {
      return dashboardData.value
    }

    dashboardLoading.value = true
    try {
      const data = await analyticsService.getDashboard()
      dashboardData.value = data.data
      dashboardLastUpdated.value = Date.now()
      return data.data
    } catch (error) {
      handleServiceError(error, '儀表板')
      throw error
    } finally {
      dashboardLoading.value = false
    }
  }

  const loadMemes = async (params = {}) => {
    memesLoading.value = true
    try {
      const response = await memeService.getAll(params)
      const processed = processApiResponse(response, 'memes')

      memes.value = processed.data
      memePagination.value = {
        page: params.page || 1,
        limit: params.limit || 10,
        total: processed.total,
      }

      return processed
    } catch (error) {
      handleServiceError(error, '迷因管理')
      throw error
    } finally {
      memesLoading.value = false
    }
  }

  const loadUsers = async (params = {}) => {
    usersLoading.value = true
    try {
      const response = await userService.getAll(params)
      const processed = processApiResponse(response, 'users')

      users.value = processed.data
      userPagination.value = {
        page: params.page || 1,
        limit: params.limit || 10,
        total: processed.total,
      }

      return processed
    } catch (error) {
      handleServiceError(error, '用戶管理')
      throw error
    } finally {
      usersLoading.value = false
    }
  }

  const loadTags = async (params = {}) => {
    tagsLoading.value = true
    try {
      const response = await tagService.getAll(params)
      const processed = processApiResponse(response, 'tags')

      tags.value = processed.data
      tagPagination.value = {
        page: params.page || 1,
        limit: params.limit || 10,
        total: processed.total,
      }

      return processed
    } catch (error) {
      handleServiceError(error, '標籤管理')
      throw error
    } finally {
      tagsLoading.value = false
    }
  }

  const loadReports = async (params = {}) => {
    reportsLoading.value = true
    try {
      const response = await reportService.getAll(params)
      const processed = processApiResponse(response, 'reports')

      reports.value = processed.data
      reportPagination.value = {
        page: params.page || 1,
        limit: params.limit || 10,
        total: processed.total,
      }

      return processed
    } catch (error) {
      handleServiceError(error, '檢舉管理')
      throw error
    } finally {
      reportsLoading.value = false
    }
  }

  // 載入待處理檢舉數量
  const loadPendingReportsCount = async (forceRefresh = false) => {
    // 檢查快取是否有效（2分鐘）
    if (
      !forceRefresh &&
      pendingReportsCount.value !== null &&
      pendingReportsLastUpdated.value &&
      Date.now() - pendingReportsLastUpdated.value < 2 * 60 * 1000
    ) {
      return pendingReportsCount.value
    }

    pendingReportsLoading.value = true
    try {
      const response = await reportService.getPendingCount()

      // 正確提取 count 值：response.data.data.count
      const count = response.data?.data?.count ?? 0

      pendingReportsCount.value = count
      pendingReportsLastUpdated.value = Date.now()
      return count
    } catch (error) {
      console.error('載入待處理檢舉數量失敗:', error)
      // 靜默失敗，不顯示錯誤訊息給用戶
      pendingReportsCount.value = 0
      return 0
    } finally {
      pendingReportsLoading.value = false
    }
  }

  const loadAnnouncements = async (params = {}) => {
    announcementsLoading.value = true
    try {
      // 假設有announcementService
      // const response = await announcementService.getAll(params)
      // const processed = processApiResponse(response, 'announcements')
      // announcements.value = processed.data
      // announcementPagination.value = {
      //   page: params.page || 1,
      //   limit: params.limit || 10,
      //   total: processed.total,
      // }
      // return processed
    } catch (error) {
      handleServiceError(error, '公告管理')
      throw error
    } finally {
      announcementsLoading.value = false
    }
  }

  const loadAnalyticsData = async (params = {}) => {
    analyticsLoading.value = true
    try {
      const [dashboard, algorithms] = await Promise.all([
        analyticsService.getDashboard(params),
        analyticsService.getAlgorithmStats(params),
      ])

      analyticsData.value = dashboard.data
      algorithmStats.value = algorithms.data.stats
      return { dashboard: dashboard.data, algorithms: algorithms.data }
    } catch (error) {
      handleServiceError(error, '數據分析')
      throw error
    } finally {
      analyticsLoading.value = false
    }
  }

  const loadSystemHealth = async () => {
    systemLoading.value = true
    try {
      const response = await analyticsService.getSystemHealth()
      systemHealth.value = response.data
      return response.data
    } catch (error) {
      handleServiceError(error, '系統狀態')
      throw error
    } finally {
      systemLoading.value = false
    }
  }

  // 迷因管理動作
  const createMeme = async (data) => {
    try {
      const response = await memeService.create(data)
      await loadMemes() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '建立迷因')
      throw error
    }
  }

  const updateMeme = async (id, data) => {
    try {
      const response = await memeService.update(id, data)
      await loadMemes() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '更新迷因')
      throw error
    }
  }

  const deleteMeme = async (id) => {
    try {
      const response = await memeService.remove(id)
      await loadMemes() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '刪除迷因')
      throw error
    }
  }

  const batchDeleteMemes = async (ids) => {
    try {
      const response = await memeService.batchDelete(ids)
      await loadMemes() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '批量刪除迷因')
      throw error
    }
  }

  // 用戶管理動作
  const createUser = async (data) => {
    try {
      const response = await userService.create(data)
      await loadUsers() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '建立用戶')
      throw error
    }
  }

  const updateUser = async (id, data) => {
    try {
      const response = await userService.update(id, data)
      await loadUsers() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '更新用戶')
      throw error
    }
  }

  const deleteUser = async (id) => {
    try {
      const response = await userService.remove(id)
      await loadUsers() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '刪除用戶')
      throw error
    }
  }

  const banUser = async (id, reason) => {
    try {
      const response = await userService.banUser(id, reason)
      await loadUsers() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '封禁用戶')
      throw error
    }
  }

  const unbanUser = async (id) => {
    try {
      const response = await userService.unbanUser(id)
      await loadUsers() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '解除封禁用戶')
      throw error
    }
  }

  // 標籤管理動作
  const createTag = async (data) => {
    try {
      const response = await tagService.create(data)
      await loadTags() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '建立標籤')
      throw error
    }
  }

  const updateTag = async (id, data) => {
    try {
      const response = await tagService.update(id, data)
      await loadTags() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '更新標籤')
      throw error
    }
  }

  const deleteTag = async (id) => {
    try {
      const response = await tagService.remove(id)
      await loadTags() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '刪除標籤')
      throw error
    }
  }

  const mergeTags = async (primaryId, secondaryIds) => {
    try {
      const response = await tagService.mergeTags(primaryId, secondaryIds)
      await loadTags() // 重新載入數據
      return response
    } catch (error) {
      handleServiceError(error, '合併標籤')
      throw error
    }
  }

  // 清除快取
  const clearCache = () => {
    dashboardData.value = null
    dashboardLastUpdated.value = null
    memes.value = []
    users.value = []
    tags.value = []
    reports.value = []
    announcements.value = []
    analyticsData.value = null
    algorithmStats.value = []
    pendingReportsCount.value = 0
    pendingReportsLastUpdated.value = null
  }

  return {
    // 狀態
    dashboardData,
    dashboardLastUpdated,
    dashboardLoading,
    memes,
    memeStats,
    memesLoading,
    memePagination,
    users,
    userStats,
    usersLoading,
    userPagination,
    tags,
    tagStats,
    tagsLoading,
    tagPagination,
    reports,
    reportStats,
    reportsLoading,
    reportPagination,
    pendingReportsCount,
    pendingReportsLoading,
    pendingReportsLastUpdated,
    announcements,
    announcementStats,
    announcementsLoading,
    announcementPagination,
    analyticsData,
    algorithmStats,
    analyticsLoading,
    systemHealth,
    systemLoading,

    // 計算屬性
    totalStats,
    pendingMemes,
    bannedUsers,
    urgentReports,
    publishedAnnouncements,
    pinnedAnnouncements,

    // 動作
    loadDashboardData,
    loadMemes,
    loadUsers,
    loadTags,
    loadReports,
    loadPendingReportsCount,
    loadAnnouncements,
    loadAnalyticsData,
    loadSystemHealth,
    createMeme,
    updateMeme,
    deleteMeme,
    batchDeleteMemes,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    unbanUser,
    createTag,
    updateTag,
    deleteTag,
    mergeTags,
    clearCache,
  }
})
