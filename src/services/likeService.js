import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/likes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/api/likes', { data })
  },
  getAll() {
    return apiService.http.get('/api/likes')
  },
  toggle(data) {
    return apiService.httpAuth.post('/api/likes/toggle', data)
  },
}
