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

  // 測試工具
  // 創建測試報告
  createTestReports() {
    return apiService.httpAuth.post('/api/admin/create-test-reports')
  },

  // 系統監控
  // 獲取系統性能統計
  getSystemPerformanceStats() {
    return apiService.httpAuth.get('/api/admin/system-performance-stats')
  },

  // 獲取資料庫統計
  getDatabaseStats() {
    return apiService.httpAuth.get('/api/admin/database-stats')
  },

  // 獲取快取統計
  getCacheStats() {
    return apiService.httpAuth.get('/api/admin/cache-stats')
  },

  // 系統維護
  // 清理過期快取
  cleanupExpiredCache() {
    return apiService.httpAuth.post('/api/admin/cleanup-expired-cache')
  },

  // 重建索引
  rebuildIndexes() {
    return apiService.httpAuth.post('/api/admin/rebuild-indexes')
  },

  // 備份資料庫
  backupDatabase() {
    return apiService.httpAuth.post('/api/admin/backup-database')
  },

  // 恢復資料庫
  restoreDatabase(backupId) {
    return apiService.httpAuth.post(`/api/admin/restore-database/${backupId}`)
  },

  // 獲取備份列表
  getBackupList() {
    return apiService.httpAuth.get('/api/admin/backup-list')
  },

  // 安全工具
  // 掃描安全漏洞
  scanSecurityVulnerabilities() {
    return apiService.httpAuth.post('/api/admin/scan-security-vulnerabilities')
  },

  // 更新安全設定
  updateSecuritySettings(settings) {
    return apiService.httpAuth.put('/api/admin/security-settings', settings)
  },

  // 獲取安全日誌
  getSecurityLogs(limit = 100) {
    return apiService.httpAuth.get(`/api/admin/security-logs?limit=${limit}`)
  },

  // 內容管理
  // 批量審核內容
  batchModerateContent(contentIds, action) {
    return apiService.httpAuth.post('/api/admin/batch-moderate-content', {
      contentIds,
      action,
    })
  },

  // 獲取待審核內容統計
  getPendingModerationStats() {
    return apiService.httpAuth.get('/api/admin/pending-moderation-stats')
  },

  // 設置自動審核規則
  setAutoModerationRules(rules) {
    return apiService.httpAuth.put('/api/admin/auto-moderation-rules', rules)
  },

  // 獲取自動審核規則
  getAutoModerationRules() {
    return apiService.httpAuth.get('/api/admin/auto-moderation-rules')
  },
}
