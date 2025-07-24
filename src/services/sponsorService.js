import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/sponsors', data)
  },
  getAll() {
    return apiService.httpAuth.get('/sponsors')
  },
  get(id) {
    return apiService.httpAuth.get(`/sponsors/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/sponsors/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/sponsors/${id}`)
  },
}
