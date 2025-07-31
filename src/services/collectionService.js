import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/collections', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/api/collections', { data })
  },
  getAll() {
    return apiService.http.get('/api/collections')
  },
  toggle(data) {
    return apiService.httpAuth.post('/api/collections/toggle', data)
  },
}
