import apiService from './apiService'

export default {
  // 建立新分享記錄
  create(data) {
    return apiService.httpAuth.post('/api/shares', data)
  },

  // 取得用戶的分享記錄
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/shares', { params })
  },

  // 取得指定分享記錄
  get(id) {
    return apiService.httpAuth.get(`/api/shares/${id}`)
  },

  // 更新分享記錄
  update(id, data) {
    return apiService.httpAuth.put(`/api/shares/${id}`, data)
  },

  // 刪除分享記錄
  remove(id) {
    return apiService.httpAuth.delete(`/api/shares/${id}`)
  },
}
