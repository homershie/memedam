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

  // 取得推薦系統配置
  getRecommendationSystemConfig() {
    return apiService.httpAuth.get('/api/admin/recommendation-system-config')
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

  // 取得內容基礎配置
  getContentBasedConfig() {
    return apiService.httpAuth.get('/api/admin/content-based-config')
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

  // 取得協同過濾配置
  getCollaborativeFilteringConfig() {
    return apiService.httpAuth.get('/api/admin/collaborative-filtering-config')
  },
}
