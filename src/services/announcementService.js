import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/announcements', data)
  },
  getAll() {
    return apiService.http.get('/announcements')
  },
  get(id) {
    return apiService.http.get(`/announcements/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/announcements/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/announcements/${id}`)
  },
}
