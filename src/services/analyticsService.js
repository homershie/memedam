import apiService from './apiService'

export default {
  // 記錄推薦指標
  trackRecommendation(data) {
    return apiService.httpAuth.post('/api/analytics/track-recommendation', data)
  },

  // 更新互動
  updateInteraction(data) {
    return apiService.httpAuth.post('/api/analytics/update-interaction', data)
  },

  // 取得演算法統計
  getAlgorithmStats(params = {}) {
    return apiService.httpAuth.get('/api/analytics/algorithm-stats', { params })
  },

  // 取得用戶效果
  getUserEffectiveness(params = {}) {
    return apiService.httpAuth.get('/api/analytics/user-effectiveness', {
      params,
    })
  },

  // 取得 A/B 測試列表
  getAbTests(params = {}) {
    return apiService.httpAuth.get('/api/analytics/ab-tests', { params })
  },

  // 取得 A/B 測試狀態
  getAbTestStatus(testId) {
    return apiService.httpAuth.get(`/api/analytics/ab-tests/${testId}/status`)
  },

  // 取得 A/B 測試詳情
  getAbTest(testId) {
    return apiService.httpAuth.get(`/api/analytics/ab-tests/${testId}`)
  },

  // 取得分析儀表板
  getDashboard(params = {}) {
    return apiService.httpAuth.get('/api/analytics/dashboard', { params })
  },
}
