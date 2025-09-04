import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/dislikes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/api/dislikes', { data })
  },
  getAll(userId = null, params = {}) {
    const queryParams = { ...params }
    if (userId) {
      queryParams.user_id = userId
    }
    return apiService.http.get('/api/dislikes', { params: queryParams })
  },
  toggle(data) {
    return apiService.httpAuth.post('/api/dislikes/toggle', data)
  },
}
