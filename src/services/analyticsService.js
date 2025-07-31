import apiService from './apiService'

export default {
  // 記錄推薦指標
  trackRecommendation(data) {
    return apiService.httpAuth.post('/api/analytics/track-recommendation', data)
  },
}
