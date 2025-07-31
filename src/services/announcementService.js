import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/announcements', data)
  },
  getAll() {
    return apiService.http.get('/api/announcements')
  },
  get(id) {
    return apiService.http.get(`/api/announcements/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/announcements/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/announcements/${id}`)
  },
}
