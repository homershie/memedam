import apiService from './apiService'

export default {
  // 檢查並修正單一迷因的計數
  checkCounts(memeId) {
    return apiService.httpAuth.post(`/api/admin/check-counts/${memeId}`)
  },

  // 檢查並修正所有迷因的計數
  checkAllCounts(data = {}) {
    return apiService.httpAuth.post('/api/admin/check-all-counts', data)
  },

  // 取得計數統計資訊
  getCountStatistics() {
    return apiService.httpAuth.get('/api/admin/count-statistics')
  },

  // 檢查並修正用戶的計數
  checkUserCounts(userId) {
    return apiService.httpAuth.post(`/api/admin/check-user-counts/${userId}`)
  },

  // 檢查並修正所有用戶的計數
  checkAllUserCounts(data = {}) {
    return apiService.httpAuth.post('/api/admin/check-all-user-counts', data)
  },

  // 執行完整檢查
  runFullCheck(data = {}) {
    return apiService.httpAuth.post('/api/admin/run-full-check', data)
  },

  // 取得維護狀態
  getMaintenanceStatus() {
    return apiService.httpAuth.get('/api/admin/maintenance-status')
  },

  // 批次更新熱門分數
  batchUpdateHotScores(data = {}) {
    return apiService.httpAuth.post('/api/admin/batch-update-hot-scores', data)
  },

  // 排程熱門分數更新
  scheduledHotScoreUpdate(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/scheduled-hot-score-update',
      data,
    )
  },

  // 取得熱門分數統計
  getHotScoreStatistics() {
    return apiService.httpAuth.get('/api/admin/hot-score-statistics')
  },

  // 更新所有推薦系統
  updateAllRecommendationSystems(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/update-all-recommendation-systems',
      data,
    )
  },

  // 取得推薦系統狀態
  getRecommendationSystemStatus() {
    return apiService.httpAuth.get('/api/admin/recommendation-system-status')
  },

  // 更新推薦系統配置
  updateRecommendationSystemConfig(config) {
    return apiService.httpAuth.put('/api/admin/recommendation-system-config', {
      config,
    })
  },

  // 批次更新用戶偏好
  batchUpdateUserPreferences(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/batch-update-user-preferences',
      data,
    )
  },

  // 排程內容基礎更新
  scheduledContentBasedUpdate(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/scheduled-content-based-update',
      data,
    )
  },

  // 取得內容基礎統計
  getContentBasedStatistics() {
    return apiService.httpAuth.get('/api/admin/content-based-statistics')
  },

  // 更新內容基礎配置
  updateContentBasedConfig(config) {
    return apiService.httpAuth.put('/api/admin/content-based-config', {
      config,
    })
  },

  // 批次更新協同過濾
  batchUpdateCollaborativeFiltering(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/batch-update-collaborative-filtering',
      data,
    )
  },

  // 排程協同過濾更新
  scheduledCollaborativeFilteringUpdate(data = {}) {
    return apiService.httpAuth.post(
      '/api/admin/scheduled-collaborative-filtering-update',
      data,
    )
  },

  // 取得協同過濾統計
  getCollaborativeFilteringStatistics() {
    return apiService.httpAuth.get(
      '/api/admin/collaborative-filtering-statistics',
    )
  },

  // 更新協同過濾配置
  updateCollaborativeFilteringConfig(config) {
    return apiService.httpAuth.put(
      '/api/admin/collaborative-filtering-config',
      {
        config,
      },
    )
  },

  // 用戶清理相關功能
  // 手動執行刪除提醒任務
  sendDeletionReminders() {
    return apiService.httpAuth.post('/api/users/admin/send-deletion-reminders')
  },

  // 手動執行刪除未驗證用戶任務
  deleteUnverifiedUsers() {
    return apiService.httpAuth.post('/api/users/admin/delete-unverified-users')
  },

  // 獲取未驗證用戶統計資訊
  getUnverifiedUsersStats() {
    return apiService.httpAuth.get('/api/users/admin/unverified-stats')
  },

  // 通知管理功能
  // 手動觸發熱門內容通知
  sendHotContentNotifications() {
    return apiService.httpAuth.post('/api/admin/notifications/hot-content')
  },

  // 手動觸發週報摘要通知
  sendWeeklySummaryNotifications() {
    return apiService.httpAuth.post('/api/admin/notifications/weekly-summary')
  },

  // 手動清理舊通知
  cleanupOldNotifications(days = 30) {
    return apiService.httpAuth.post(
      `/api/admin/notifications/cleanup?days=${days}`,
    )
  },
}
