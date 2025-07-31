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
}
