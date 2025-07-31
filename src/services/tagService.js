import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/tags', data)
  },
  getAll() {
    return apiService.http.get('/api/tags')
  },
  getPopular(limit = null) {
    const params = limit ? { limit } : {}
    return apiService.http.get('/api/tags/popular', { params })
  },
  get(id) {
    return apiService.http.get(`/api/tags/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/tags/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/tags/${id}`)
  },
}
