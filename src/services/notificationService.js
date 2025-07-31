import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/notifications', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/notifications')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/notifications/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/notifications/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/notifications/${id}`)
  },
  markRead(id) {
    return apiService.httpAuth.patch(`/api/notifications/${id}/read`)
  },
  markAllRead() {
    return apiService.httpAuth.patch('/api/notifications/read/all')
  },
  removeBatch() {
    return apiService.httpAuth.delete('/api/notifications/batch')
  },
}
