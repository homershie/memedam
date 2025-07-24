import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/shares', data)
  },
  getAll() {
    return apiService.httpAuth.get('/shares')
  },
  get(id) {
    return apiService.httpAuth.get(`/shares/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/shares/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/shares/${id}`)
  },
}
