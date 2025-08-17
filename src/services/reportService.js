import apiService from './apiService'

export default {
  // 建立檢舉
  create(data) {
    return apiService.httpAuth.post('/api/reports', data)
  },

  // 取得用戶自己的檢舉歷史
  getMyReports(params = {}) {
    return apiService.httpAuth.get('/api/reports/my', { params })
  },

  // 取得檢舉選項配置
  getOptions() {
    return apiService.httpAuth.get('/api/reports/options')
  },

  // 取得所有檢舉（管理員功能）
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/reports', { params })
  },

  // 取得指定檢舉詳情
  get(id) {
    return apiService.httpAuth.get(`/api/reports/${id}`)
  },

  // 處理檢舉（管理員功能）
  resolve(id, data) {
    return apiService.httpAuth.put(`/api/reports/${id}/resolve`, data)
  },

  // 批次處理檢舉（管理員功能）
  batchResolve(data) {
    return apiService.httpAuth.put('/api/reports/batch/resolve', data)
  },

  // 取得檢舉統計（管理員功能）
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/reports/stats', { params })
  },

  // 取得用戶自己的檢舉統計
  getUserStats() {
    return apiService.httpAuth.get('/api/reports/my/stats')
  },

  // 更新檢舉
  update(id, data) {
    return apiService.httpAuth.put(`/api/reports/${id}`, data)
  },

  // 刪除檢舉
  remove(id) {
    return apiService.httpAuth.delete(`/api/reports/${id}`)
  },
}
