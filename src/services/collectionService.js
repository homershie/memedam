import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/collections', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/collections', { data })
  },
  getAll() {
    return apiService.http.get('/collections')
  },
  toggle(data) {
    return apiService.httpAuth.post('/collections/toggle', data)
  },
}
