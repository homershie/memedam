import apiService from './apiService'

export default {
  // 記錄瀏覽
  recordView(memeId, data = {}) {
    return apiService.http.post(`/views/${memeId}`, data)
  },

  // 取得迷因瀏覽統計
  getStats(memeId, period = 'all') {
    return apiService.http.get(`/views/stats/${memeId}`, {
      params: { period },
    })
  },

  // 取得用戶瀏覽歷史
  getUserHistory(params = {}) {
    return apiService.httpAuth.get('/views/history', { params })
  },

  // 取得熱門迷因
  getPopularMemes(params = {}) {
    return apiService.http.get('/views/popular', { params })
  },

  // 清理過期瀏覽記錄（管理員功能）
  cleanupOldViews(days = 90) {
    return apiService.httpAuth.delete('/views/cleanup', {
      params: { days },
    })
  },
}
