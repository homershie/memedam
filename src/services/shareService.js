import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/shares', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/shares')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/shares/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/shares/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/shares/${id}`)
  },
}
