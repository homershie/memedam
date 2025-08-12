# 迷因典管理後台 API 整合指南

## 📋 概述

本指南詳細說明如何將迷因典現有的服務層與分析數據 API 整合到管理後台，實現完整的管理功能。

## 🔗 服務層整合

### 1. 分析數據服務 (`analyticsService.js`)

#### 現有功能

```javascript
// 已實現的 API 端點
;-trackRecommendation(data) - // 記錄推薦指標
  updateInteraction(data) - // 更新互動
  getAlgorithmStats(params) - // 取得演算法統計
  getUserEffectiveness(params) - // 取得用戶效果
  getAbTests(params) - // 取得 A/B 測試列表
  getAbTestStatus(testId) - // 取得 A/B 測試狀態
  getAbTest(testId) - // 取得 A/B 測試詳情
  getDashboard(params) // 取得分析儀表板
```

#### 擴展功能

```javascript
// 建議新增的功能
export default {
  // 現有功能...

  // 新增：取得系統健康度
  getSystemHealth() {
    return apiService.httpAuth.get('/api/analytics/system-health')
  },

  // 新增：取得用戶行為分析
  getUserBehavior(params = {}) {
    return apiService.httpAuth.get('/api/analytics/user-behavior', { params })
  },

  // 新增：取得內容分析
  getContentAnalytics(params = {}) {
    return apiService.httpAuth.get('/api/analytics/content-analytics', {
      params,
    })
  },

  // 新增：取得趨勢分析
  getTrendAnalysis(params = {}) {
    return apiService.httpAuth.get('/api/analytics/trend-analysis', { params })
  },

  // 新增：建立 A/B 測試
  createABTest(data) {
    return apiService.httpAuth.post('/api/analytics/ab-tests', data)
  },

  // 新增：更新 A/B 測試狀態
  updateABTestStatus(testId, status) {
    return apiService.httpAuth.put(`/api/analytics/ab-tests/${testId}/status`, {
      status,
    })
  },

  // 新增：刪除 A/B 測試
  deleteABTest(testId) {
    return apiService.httpAuth.delete(`/api/analytics/ab-tests/${testId}`)
  },
}
```

### 2. 管理服務 (`adminService.js`)

#### 現有功能整合

```javascript
// 系統維護功能
;-checkCounts(memeId) - // 檢查迷因計數
  checkAllCounts(data) - // 檢查所有迷因計數
  getCountStatistics() - // 取得計數統計
  checkUserCounts(userId) - // 檢查用戶計數
  checkAllUserCounts(data) - // 檢查所有用戶計數
  runFullCheck(data) - // 執行完整檢查
  getMaintenanceStatus() - // 取得維護狀態
  // 推薦系統管理
  batchUpdateHotScores(data) - // 批次更新熱門分數
  scheduledHotScoreUpdate(data) - // 排程熱門分數更新
  getHotScoreStatistics() - // 取得熱門分數統計
  updateAllRecommendationSystems(data) - // 更新所有推薦系統
  getRecommendationSystemStatus() - // 取得推薦系統狀態
  updateRecommendationSystemConfig(config) - // 更新推薦系統配置
  // 用戶偏好管理
  batchUpdateUserPreferences(data) - // 批次更新用戶偏好
  scheduledContentBasedUpdate(data) - // 排程內容基礎更新
  getContentBasedStatistics() - // 取得內容基礎統計
  updateContentBasedConfig(config) // 更新內容基礎配置
```

#### 擴展功能

```javascript
// 建議新增的管理功能
export default {
  // 現有功能...

  // 新增：取得系統配置
  getSystemConfig() {
    return apiService.httpAuth.get('/api/admin/system-config')
  },

  // 新增：更新系統配置
  updateSystemConfig(config) {
    return apiService.httpAuth.put('/api/admin/system-config', config)
  },

  // 新增：取得備份數據
  getBackupData() {
    return apiService.httpAuth.get('/api/admin/backup-data')
  },

  // 新增：執行數據備份
  createBackup() {
    return apiService.httpAuth.post('/api/admin/backup')
  },

  // 新增：取得系統日誌
  getSystemLogs(params = {}) {
    return apiService.httpAuth.get('/api/admin/system-logs', { params })
  },

  // 新增：清除快取
  clearCache(cacheType) {
    return apiService.httpAuth.post('/api/admin/clear-cache', { cacheType })
  },

  // 新增：取得效能統計
  getPerformanceStats() {
    return apiService.httpAuth.get('/api/admin/performance-stats')
  },

  // 新增：取得錯誤統計
  getErrorStats() {
    return apiService.httpAuth.get('/api/admin/error-stats')
  },
}
```

### 3. 迷因管理服務 (`memeService.js`)

#### 現有功能整合

```javascript
// 基礎 CRUD 操作
;-create(data) - // 建立迷因
  getAll(params) - // 取得所有迷因
  get(id) - // 取得單一迷因
  update(id, data) - // 更新迷因
  remove(id) - // 刪除迷因
  // 搜尋和篩選
  getByTags(tagNames, params) - // 根據標籤篩選
  getByTagIds(tagIds, params) - // 根據標籤ID篩選
  search(searchTerm, params) - // 搜尋功能
  searchByTags(searchTerm, tagNames, params) - // 根據標籤搜尋
  getSearchSuggestions(query) - // 取得搜尋建議
  // 互動功能
  like(memeId) - // 點讚
  unlike(memeId) - // 取消點讚
  dislike(memeId) - // 不喜歡
  undislike(memeId) - // 取消不喜歡
  share(memeId, platform) - // 分享
  collect(memeId) - // 收藏
  uncollect(memeId) - // 取消收藏
  view(memeId) - // 觀看
  rate(memeId, rating) // 評分
```

#### 管理功能擴展

```javascript
// 建議新增的管理功能
export default {
  // 現有功能...

  // 新增：取得迷因統計
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/memes/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/memes/batch-update', { ids, data })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/memes/batch-delete', {
      data: { ids },
    })
  },

  // 新增：內容審核
  approve(memeId) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/approve`)
  },

  // 新增：拒絕內容
  reject(memeId, reason) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/reject`, { reason })
  },

  // 新增：取得待審核內容
  getPendingApproval(params = {}) {
    return apiService.httpAuth.get('/api/memes/pending-approval', { params })
  },

  // 新增：取得內容分析
  getAnalytics(memeId) {
    return apiService.httpAuth.get(`/api/memes/${memeId}/analytics`)
  },

  // 新增：更新標籤
  updateTags(memeId, tags) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/tags`, { tags })
  },
}
```

### 4. 用戶管理服務 (`userService.js`)

#### 現有功能整合

```javascript
// 基礎 CRUD 操作
;-create(data) - // 建立用戶
  getAll() - // 取得所有用戶
  get(id) - // 取得單一用戶
  update(id, data) - // 更新用戶
  remove(id) - // 刪除用戶
  // 個人資料管理
  getMe() - // 取得個人資料
  updateMe(data) - // 更新個人資料
  deleteMe() - // 刪除個人帳號
  // 認證功能
  login(data) - // 登入
  logout() - // 登出
  refresh() - // 重新整理 token
  changePassword(data) - // 變更密碼
  forgotPassword(email) - // 忘記密碼
  resetPassword(token, newPassword) - // 重設密碼
  // OAuth 功能
  googleAuth() - // Google 登入
  facebookAuth() - // Facebook 登入
  discordAuth() - // Discord 登入
  twitterAuth() - // Twitter 登入
  bindSocial(provider, data) - // 綁定社群帳號
  unbindSocial(provider) - // 解除綁定社群帳號
  getBindStatus() - // 取得綁定狀態
  initBindAuth(provider) // 初始化綁定認證
```

#### 管理功能擴展

```javascript
// 建議新增的管理功能
export default {
  // 現有功能...

  // 新增：取得用戶統計
  getStats(userId) {
    return apiService.httpAuth.get(`/api/users/${userId}/stats`)
  },

  // 新增：取得所有用戶統計
  getAllStats(params = {}) {
    return apiService.httpAuth.get('/api/users/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/users/batch-update', { ids, data })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/users/batch-delete', {
      data: { ids },
    })
  },

  // 新增：封鎖用戶
  banUser(userId, reason) {
    return apiService.httpAuth.put(`/api/users/${userId}/ban`, { reason })
  },

  // 新增：解除封鎖
  unbanUser(userId) {
    return apiService.httpAuth.put(`/api/users/${userId}/unban`)
  },

  // 新增：更新用戶角色
  updateRole(userId, role) {
    return apiService.httpAuth.put(`/api/users/${userId}/role`, { role })
  },

  // 新增：取得用戶活動
  getUserActivity(userId, params = {}) {
    return apiService.httpAuth.get(`/api/users/${userId}/activity`, { params })
  },

  // 新增：取得活躍用戶
  getActiveUsers(params = {}) {
    return apiService.httpAuth.get('/api/users/active', { params })
  },

  // 新增：取得新註冊用戶
  getNewUsers(params = {}) {
    return apiService.httpAuth.get('/api/users/new', { params })
  },
}
```

### 5. 檢舉管理服務 (`reportService.js`)

#### 現有功能整合

```javascript
// 基礎 CRUD 操作
;-create(data) - // 建立檢舉
  getAll(params) - // 取得所有檢舉
  get(id) - // 取得單一檢舉
  update(id, data) - // 更新檢舉
  remove(id) // 刪除檢舉
```

#### 管理功能擴展

```javascript
// 建議新增的管理功能
export default {
  // 現有功能...

  // 新增：取得檢舉統計
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/reports/stats', { params })
  },

  // 新增：批量處理檢舉
  batchProcess(ids, action, reason) {
    return apiService.httpAuth.put('/api/reports/batch-process', {
      ids,
      action,
      reason,
    })
  },

  // 新增：處理檢舉
  processReport(reportId, action, reason) {
    return apiService.httpAuth.put(`/api/reports/${reportId}/process`, {
      action,
      reason,
    })
  },

  // 新增：取得待處理檢舉
  getPendingReports(params = {}) {
    return apiService.httpAuth.get('/api/reports/pending', { params })
  },

  // 新增：取得已處理檢舉
  getProcessedReports(params = {}) {
    return apiService.httpAuth.get('/api/reports/processed', { params })
  },

  // 新增：取得檢舉類型統計
  getReportTypeStats() {
    return apiService.httpAuth.get('/api/reports/type-stats')
  },

  // 新增：取得檢舉趨勢
  getReportTrends(params = {}) {
    return apiService.httpAuth.get('/api/reports/trends', { params })
  },

  // 新增：匯出檢舉數據
  exportReports(params = {}) {
    return apiService.httpAuth.get('/api/reports/export', {
      params,
      responseType: 'blob',
    })
  },
}
```

### 6. 公告管理服務 (`announcementService.js`)

#### 現有功能整合

```javascript
// 基礎 CRUD 操作
;-create(data) - // 建立公告
  getAll(params) - // 取得所有公告
  get(id) - // 取得單一公告
  update(id, data) - // 更新公告
  remove(id) // 刪除公告
```

#### 管理功能擴展

```javascript
// 建議新增的管理功能
export default {
  // 現有功能...

  // 新增：取得公告統計
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/announcements/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/announcements/batch-update', {
      ids,
      data,
    })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/announcements/batch-delete', {
      data: { ids },
    })
  },

  // 新增：發布公告
  publish(id) {
    return apiService.httpAuth.put(`/api/announcements/${id}/publish`)
  },

  // 新增：下架公告
  unpublish(id) {
    return apiService.httpAuth.put(`/api/announcements/${id}/unpublish`)
  },

  // 新增：置頂公告
  pin(id) {
    return apiService.httpAuth.put(`/api/announcements/${id}/pin`)
  },

  // 新增：取消置頂
  unpin(id) {
    return apiService.httpAuth.put(`/api/announcements/${id}/unpin`)
  },

  // 新增：取得已發布公告
  getPublished(params = {}) {
    return apiService.httpAuth.get('/api/announcements/published', { params })
  },

  // 新增：取得草稿公告
  getDrafts(params = {}) {
    return apiService.httpAuth.get('/api/announcements/drafts', { params })
  },

  // 新增：取得置頂公告
  getPinned() {
    return apiService.httpAuth.get('/api/announcements/pinned')
  },

  // 新增：更新公告排序
  updateOrder(ids) {
    return apiService.httpAuth.put('/api/announcements/order', { ids })
  },

  // 新增：匯出公告數據
  exportAnnouncements(params = {}) {
    return apiService.httpAuth.get('/api/announcements/export', {
      params,
      responseType: 'blob',
    })
  },
}
```

## 📊 數據整合策略

### 1. 儀表板數據整合

```javascript
// 整合多個服務的數據
const loadDashboardData = async () => {
  try {
    // 並行載入多個數據源
    const [analyticsData, memeStats, userStats, reportStats, systemHealth] =
      await Promise.all([
        analyticsService.getDashboard(),
        memeService.getStats(),
        userService.getAllStats(),
        reportService.getStats(),
        analyticsService.getSystemHealth(),
      ])

    return {
      analytics: analyticsData.data,
      memes: memeStats.data,
      users: userStats.data,
      reports: reportStats.data,
      system: systemHealth.data,
    }
  } catch (error) {
    console.error('載入儀表板數據失敗:', error)
    throw error
  }
}
```

### 2. 統計數據聚合

```javascript
// 聚合不同服務的統計數據
const aggregateStats = (data) => {
  return {
    totalMemes: data.memes.total || 0,
    activeUsers: data.users.active || 0,
    pendingReports: data.reports.pending || 0,
    systemUptime: data.system.uptime || 0,
    ctr: data.analytics.overall_stats?.ctr || 0,
    engagementRate: data.analytics.overall_stats?.engagement_rate || 0,
  }
}
```

### 3. 錯誤處理統一

```javascript
// 統一的錯誤處理機制
const handleServiceError = (error, serviceName) => {
  console.error(`${serviceName} 服務錯誤:`, error)

  if (error.response?.status === 401) {
    // 重新登入
    userStore.logout()
    router.push('/login')
  } else if (error.response?.status === 403) {
    // 權限不足
    toast.add({
      severity: 'error',
      summary: '權限不足',
      detail: '您沒有權限執行此操作',
      life: 3000,
    })
  } else {
    // 一般錯誤
    toast.add({
      severity: 'error',
      summary: `${serviceName} 操作失敗`,
      detail: error.response?.data?.message || '請稍後重試',
      life: 3000,
    })
  }
}
```

## 🔄 狀態管理整合

### 1. Pinia Store 整合

```javascript
// 管理後台狀態管理
export const useAdminStore = defineStore('admin', {
  state: () => ({
    // 儀表板數據
    dashboardData: null,
    dashboardLastUpdated: null,
    dashboardLoading: false,

    // 迷因管理
    memes: [],
    memeStats: null,
    memesLoading: false,

    // 用戶管理
    users: [],
    userStats: null,
    usersLoading: false,

    // 檢舉管理
    reports: [],
    reportStats: null,
    reportsLoading: false,

    // 公告管理
    announcements: [],
    announcementStats: null,
    announcementsLoading: false,

    // 分析數據
    analyticsData: null,
    algorithmStats: [],
    analyticsLoading: false,

    // 系統狀態
    systemHealth: null,
    systemLoading: false,
  }),

  getters: {
    // 計算屬性
    totalStats: (state) => ({
      memes: state.memeStats?.total || 0,
      users: state.userStats?.total || 0,
      reports: state.reportStats?.pending || 0,
      systemHealth: state.systemHealth?.status || 'unknown',
    }),

    // 過濾器
    pendingMemes: (state) =>
      state.memes.filter((meme) => meme.status === 'pending'),
    bannedUsers: (state) =>
      state.users.filter((user) => user.status === 'banned'),
    urgentReports: (state) =>
      state.reports.filter((report) => report.priority === 'high'),
    publishedAnnouncements: (state) =>
      state.announcements.filter(
        (announcement) => announcement.status === 'published',
      ),
    pinnedAnnouncements: (state) =>
      state.announcements.filter(
        (announcement) => announcement.is_pinned === true,
      ),
  },

  actions: {
    // 載入儀表板數據
    async loadDashboardData() {
      if (
        this.dashboardData &&
        Date.now() - this.dashboardLastUpdated < 5 * 60 * 1000
      ) {
        return this.dashboardData
      }

      this.dashboardLoading = true
      try {
        const data = await loadDashboardData()
        this.dashboardData = data
        this.dashboardLastUpdated = Date.now()
        return data
      } catch (error) {
        handleServiceError(error, '儀表板')
        throw error
      } finally {
        this.dashboardLoading = false
      }
    },

    // 載入迷因數據
    async loadMemes(params = {}) {
      this.memesLoading = true
      try {
        const response = await memeService.getAll(params)
        this.memes = response.data.memes
        this.memeStats = response.data.stats
        return response.data
      } catch (error) {
        handleServiceError(error, '迷因管理')
        throw error
      } finally {
        this.memesLoading = false
      }
    },

    // 載入用戶數據
    async loadUsers(params = {}) {
      this.usersLoading = true
      try {
        const response = await userService.getAll(params)
        this.users = response.data.users
        this.userStats = response.data.stats
        return response.data
      } catch (error) {
        handleServiceError(error, '用戶管理')
        throw error
      } finally {
        this.usersLoading = false
      }
    },

    // 載入檢舉數據
    async loadReports(params = {}) {
      this.reportsLoading = true
      try {
        const response = await reportService.getAll(params)
        this.reports = response.data.reports
        this.reportStats = response.data.stats
        return response.data
      } catch (error) {
        handleServiceError(error, '檢舉管理')
        throw error
      } finally {
        this.reportsLoading = false
      }
    },

    // 載入公告數據
    async loadAnnouncements(params = {}) {
      this.announcementsLoading = true
      try {
        const response = await announcementService.getAll(params)
        this.announcements = response.data.announcements
        this.announcementStats = response.data.stats
        return response.data
      } catch (error) {
        handleServiceError(error, '公告管理')
        throw error
      } finally {
        this.announcementsLoading = false
      }
    },

    // 載入分析數據
    async loadAnalyticsData(params = {}) {
      this.analyticsLoading = true
      try {
        const [dashboard, algorithms] = await Promise.all([
          analyticsService.getDashboard(params),
          analyticsService.getAlgorithmStats(params),
        ])

        this.analyticsData = dashboard.data
        this.algorithmStats = algorithms.data.stats
        return { dashboard: dashboard.data, algorithms: algorithms.data }
      } catch (error) {
        handleServiceError(error, '數據分析')
        throw error
      } finally {
        this.analyticsLoading = false
      }
    },

    // 載入系統狀態
    async loadSystemHealth() {
      this.systemLoading = true
      try {
        const response = await analyticsService.getSystemHealth()
        this.systemHealth = response.data
        return response.data
      } catch (error) {
        handleServiceError(error, '系統狀態')
        throw error
      } finally {
        this.systemLoading = false
      }
    },

    // 清除快取
    clearCache() {
      this.dashboardData = null
      this.dashboardLastUpdated = null
      this.memes = []
      this.users = []
      this.reports = []
      this.announcements = []
      this.analyticsData = null
      this.algorithmStats = []
    },
  },
})
```

### 2. 組件整合

```javascript
// 在組件中使用 Store
<script setup>
import { useAdminStore } from '@/stores/adminStore'
import { onMounted, computed } from 'vue'

const adminStore = useAdminStore()

// 計算屬性
const totalStats = computed(() => adminStore.totalStats)
const isLoading = computed(() => adminStore.dashboardLoading)

// 載入數據
onMounted(async () => {
  try {
    await adminStore.loadDashboardData()
  } catch (error) {
    console.error('載入數據失敗:', error)
  }
})
</script>
```

## 📈 效能優化

### 1. 數據快取策略

```javascript
// 快取配置
const CACHE_CONFIG = {
  dashboard: 5 * 60 * 1000, // 5分鐘
  memes: 2 * 60 * 1000, // 2分鐘
  users: 2 * 60 * 1000, // 2分鐘
  reports: 1 * 60 * 1000, // 1分鐘
  analytics: 10 * 60 * 1000, // 10分鐘
  system: 30 * 1000, // 30秒
}

// 檢查快取是否有效
const isCacheValid = (lastUpdated, cacheTime) => {
  return lastUpdated && Date.now() - lastUpdated < cacheTime
}
```

### 2. 請求去重

```javascript
// 防止重複請求
const pendingRequests = new Map()

const makeRequest = async (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }

  const promise = requestFn()
  pendingRequests.set(key, promise)

  try {
    const result = await promise
    return result
  } finally {
    pendingRequests.delete(key)
  }
}
```

### 3. 數據預載入

```javascript
// 預載入常用數據
const preloadData = async () => {
  const promises = [
    adminStore.loadDashboardData(),
    adminStore.loadSystemHealth(),
  ]

  // 不等待完成，讓用戶可以立即看到部分數據
  Promise.allSettled(promises)
}
```

## 🔧 實作建議

### 1. 分階段實作

1. **第一階段**: 整合基礎服務 (memeService, userService, tagService)
2. **第二階段**: 整合次要基礎服務 (reportService, announcementService)
3. **第二階段**: 整合分析服務 (analyticsService)
4. **第四階段**: 整合管理服務 (adminService)
5. **第五階段**: 優化和效能調優

### 2. 錯誤處理策略

- 實現統一的錯誤處理機制
- 提供用戶友好的錯誤訊息
- 實現自動重試機制
- 記錄詳細的錯誤日誌

### 3. 測試策略

- 為每個服務編寫單元測試
- 實現整合測試
- 進行效能測試
- 進行錯誤處理測試

### 4. 監控和日誌

- 監控 API 響應時間
- 記錄用戶操作日誌
- 監控錯誤率
- 實現效能警報

---

**注意**: 本整合指南提供了完整的 API 整合方案，實際實作時請根據專案需求和後端 API 的實際情況進行調整。
