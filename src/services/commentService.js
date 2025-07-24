import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/comments', data)
  },
  getAll() {
    return apiService.http.get('/comments')
  },
  get(id) {
    return apiService.http.get(`/comments/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/comments/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/comments/${id}`)
  },
}
