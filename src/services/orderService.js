import apiService from './apiService'

export default {
  create() {
    return apiService.httpAuth.post('/orders')
  },
  getMy() {
    return apiService.httpAuth.get('/orders/my')
  },
  getAll() {
    return apiService.httpAuth.get('/orders/all')
  },
}
