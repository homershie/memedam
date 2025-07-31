import apiService from './apiService'

export default {
  // 取得熱門推薦
  getHotRecommendations(params = {}) {
    return apiService.http.get('/api/recommendations/hot', { params })
  },
}
