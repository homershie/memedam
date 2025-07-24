import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/reports', data)
  },
  getAll() {
    return apiService.httpAuth.get('/reports')
  },
  get(id) {
    return apiService.httpAuth.get(`/reports/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/reports/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/reports/${id}`)
  },
}
