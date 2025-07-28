import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/tags', data)
  },
  getAll() {
    return apiService.http.get('/tags')
  },
  getPopular(limit = null) {
    const params = limit ? { limit } : {}
    return apiService.http.get('/tags/popular', { params })
  },
  get(id) {
    return apiService.http.get(`/tags/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/tags/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/tags/${id}`)
  },
}
