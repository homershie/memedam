import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/dislikes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/dislikes', { data })
  },
  getAll() {
    return apiService.http.get('/dislikes')
  },
  toggle(data) {
    return apiService.httpAuth.post('/dislikes/toggle', data)
  },
}
