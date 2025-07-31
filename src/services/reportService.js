import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/reports', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/reports')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/reports/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/reports/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/reports/${id}`)
  },
}
