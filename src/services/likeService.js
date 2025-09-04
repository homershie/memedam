import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/likes', data)
  },
  remove(data) {
    return apiService.httpAuth.delete('/api/likes', { data })
  },
  getAll(userId = null, params = {}) {
    const queryParams = { ...params }
    if (userId) {
      queryParams.user_id = userId
    }
    return apiService.http.get('/api/likes', { params: queryParams })
  },
  toggle(data) {
    return apiService.httpAuth.post('/api/likes/toggle', data)
  },
}
