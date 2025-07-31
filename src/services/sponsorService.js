import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/sponsors', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/sponsors')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/sponsors/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/sponsors/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/sponsors/${id}`)
  },
}
