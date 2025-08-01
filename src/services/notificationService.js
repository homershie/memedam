import apiService from './apiService'

export default {
  // 建立通知（管理員功能）
  create(data) {
    return apiService.httpAuth.post('/api/notifications', data)
  },

  // 取得用戶的通知列表
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/notifications', { params })
  },

  // 取得指定通知
  get(id) {
    return apiService.httpAuth.get(`/api/notifications/${id}`)
  },

  // 更新通知
  update(id, data) {
    return apiService.httpAuth.put(`/api/notifications/${id}`, data)
  },

  // 刪除通知
  remove(id) {
    return apiService.httpAuth.delete(`/api/notifications/${id}`)
  },

  // 標記通知為已讀
  markRead(id) {
    return apiService.httpAuth.patch(`/api/notifications/${id}/read`)
  },

  // 標記所有通知為已讀
  markAllRead() {
    return apiService.httpAuth.patch('/api/notifications/read/all')
  },

  // 批次刪除通知
  removeBatch() {
    return apiService.httpAuth.delete('/api/notifications/batch')
  },
}
