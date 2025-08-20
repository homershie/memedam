import apiService from './apiService'

export default {
  // 建立通知（管理員功能）
  create(data) {
    return apiService.httpAuth.post('/api/notifications/admin', data)
  },

  // 取得用戶的通知列表
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/notifications', { params })
  },

  // 取得未讀通知數量
  getUnreadCount() {
    return apiService.httpAuth.get('/api/notifications/unread/count')
  },

  // 取得指定通知
  get(id) {
    return apiService.httpAuth.get(`/api/notifications/${id}`)
  },

  // 更新通知收件項
  update(id, data) {
    return apiService.httpAuth.patch(`/api/notifications/${id}`, data)
  },

  // 刪除通知收件項（軟刪除）
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

  // 批次刪除通知收件項
  removeBatch(data = {}) {
    return apiService.httpAuth.delete('/api/notifications', { data })
  },

  // 管理員功能：硬刪除通知事件
  hardDelete(id, hard = false) {
    return apiService.httpAuth.delete(`/api/notifications/admin/${id}?hard=${hard}`)
  },

  // 管理員功能：清理孤兒收件項
  cleanupOrphans() {
    return apiService.httpAuth.post('/api/notifications/admin/cleanup-orphans')
  },

  // 管理員功能：清理過期已刪除收件項
  cleanupExpired() {
    return apiService.httpAuth.post('/api/notifications/admin/cleanup-expired')
  },

  // 通知設置相關
  // 取得通知設置
  getNotificationSettings() {
    return apiService.httpAuth.get('/api/users/notification-settings')
  },

  // 更新通知設置
  updateNotificationSettings(settings) {
    return apiService.httpAuth.patch('/api/users/notification-settings', settings)
  }
}
