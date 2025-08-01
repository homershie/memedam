import apiService from './apiService'

export default {
  // 取得熱門推薦
  getHotRecommendations(params = {}) {
    return apiService.http.get('/api/recommendations', {
      params: { ...params, algorithm: 'hot' },
    })
  },

  // 取得最新推薦
  getLatestRecommendations(params = {}) {
    return apiService.http.get('/api/recommendations/latest', { params })
  },

  // 取得相似迷因推薦
  getSimilarRecommendations(memeId, params = {}) {
    return apiService.http.get(`/api/recommendations/similar/${memeId}`, {
      params,
    })
  },

  // 取得用戶興趣推薦
  getUserInterestRecommendations(params = {}) {
    return apiService.httpAuth.get('/api/recommendations/user-interest', {
      params,
    })
  },

  // 取得內容基礎推薦
  getContentBasedRecommendations(params = {}) {
    return apiService.httpAuth.get('/api/recommendations/content-based', {
      params,
    })
  },

  // 取得標籤基礎推薦
  getTagBasedRecommendations(params = {}) {
    return apiService.httpAuth.get('/api/recommendations/tag-based', { params })
  },

  // 取得用戶偏好
  getUserPreferences() {
    return apiService.httpAuth.get('/api/recommendations/user-preferences')
  },

  // 更新用戶偏好
  updateUserPreferences(data) {
    return apiService.httpAuth.post(
      '/api/recommendations/update-preferences',
      data,
    )
  },

  // 取得混合推薦
  getMixedRecommendations(params = {}) {
    return apiService.httpAuth.get('/api/recommendations/mixed', { params })
  },

  // 取得無限滾動推薦（專門為前端無限滾動設計）
  getInfiniteScrollRecommendations(params = {}) {
    return apiService.httpAuth.get('/api/recommendations/infinite-scroll', {
      params,
    })
  },

  // 取得協同過濾推薦
  getCollaborativeFilteringRecommendations(params = {}) {
    return apiService.httpAuth.get(
      '/api/recommendations/collaborative-filtering',
      { params },
    )
  },

  // 取得協同過濾統計
  getCollaborativeFilteringStats() {
    return apiService.httpAuth.get(
      '/api/recommendations/collaborative-filtering-stats',
    )
  },

  // 更新協同過濾快取
  updateCollaborativeFilteringCache(data = {}) {
    return apiService.httpAuth.post(
      '/api/recommendations/update-collaborative-filtering-cache',
      data,
    )
  },

  // 取得社交協同過濾推薦
  getSocialCollaborativeFilteringRecommendations(params = {}) {
    return apiService.httpAuth.get(
      '/api/recommendations/social-collaborative-filtering',
      { params },
    )
  },

  // 取得社交協同過濾統計
  getSocialCollaborativeFilteringStats() {
    return apiService.httpAuth.get(
      '/api/recommendations/social-collaborative-filtering-stats',
    )
  },

  // 更新社交協同過濾快取
  updateSocialCollaborativeFilteringCache(data = {}) {
    return apiService.httpAuth.post(
      '/api/recommendations/update-social-collaborative-filtering-cache',
      data,
    )
  },

  // 取得社交分數
  getSocialScore(memeId) {
    return apiService.http.get(`/api/recommendations/social-score/${memeId}`)
  },

  // 取得推薦統計
  getRecommendationStats() {
    return apiService.httpAuth.get('/api/recommendations/stats')
  },

  // 取得演算法統計
  getAlgorithmStats() {
    return apiService.httpAuth.get('/api/recommendations/algorithm-stats')
  },

  // 調整策略
  adjustStrategy(data) {
    return apiService.httpAuth.post(
      '/api/recommendations/adjust-strategy',
      data,
    )
  },

  // 取得社交影響統計
  getSocialInfluenceStats() {
    return apiService.httpAuth.get(
      '/api/recommendations/social-influence-stats',
    )
  },

  // 取得所有推薦（通用端點）
  getAllRecommendations(params = {}) {
    return apiService.http.get('/api/recommendations', { params })
  },
}
