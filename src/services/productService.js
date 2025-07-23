import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/products', data)
  },
  getAll() {
    return apiService.httpAuth.get('/products/all')
  },
  getId(id) {
    return apiService.http.get(`/products/${id}`)
  },
  get() {
    return apiService.http.get(`/products`)
  },
  update(id, data) {
    return apiService.httpAuth.patch(`/products/${id}`, data)
  },
}
