import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/dislikes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/api/dislikes', { data })
  },
  getAll() {
    return apiService.http.get('/api/dislikes')
  },
  toggle(data) {
    return apiService.httpAuth.post('/api/dislikes/toggle', data)
  },
}
