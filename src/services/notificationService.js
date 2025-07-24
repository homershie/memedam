import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/notifications', data)
  },
  getAll() {
    return apiService.httpAuth.get('/notifications')
  },
  get(id) {
    return apiService.httpAuth.get(`/notifications/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/notifications/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/notifications/${id}`)
  },
  markRead(id) {
    return apiService.httpAuth.patch(`/notifications/${id}/read`)
  },
  markAllRead() {
    return apiService.httpAuth.patch('/notifications/read/all')
  },
  removeBatch() {
    return apiService.httpAuth.delete('/notifications/batch')
  },
}
