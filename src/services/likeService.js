import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/likes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/likes', { data })
  },
  getAll() {
    return apiService.http.get('/likes')
  },
  toggle(data) {
    return apiService.httpAuth.post('/likes/toggle', data)
  },
}
