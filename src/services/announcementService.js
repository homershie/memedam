import apiService from './apiService'

export default {
  // 建立公告
  create(data) {
    return apiService.httpAuth.post('/api/announcements', data)
  },

  // 取得所有公告（公開的，不需要驗證）
  getAll(params = {}) {
    return apiService.http.get('/api/announcements', { params })
  },

  // 取得指定公告（公開的，不需要驗證）
  get(id) {
    return apiService.http.get(`/api/announcements/${id}`)
  },

  // 更新公告
  update(id, data) {
    return apiService.httpAuth.put(`/api/announcements/${id}`, data)
  },

  // 刪除公告
  remove(id) {
    return apiService.httpAuth.delete(`/api/announcements/${id}`)
  },
}
