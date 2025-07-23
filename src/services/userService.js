import apiService from './apiService'

export default {
  create(data) {
    return apiService.http.post('/users', data)
  },
  login(data) {
    return apiService.http.post('/users/login', data)
  },
  profile() {
    return apiService.httpAuth.get('/users/profile')
  },
  refresh() {
    return apiService.httpAuth.patch('/users/refresh')
  },
  logout() {
    return apiService.httpAuth.delete('/users/logout')
  },
  cart(data) {
    return apiService.httpAuth.patch('/users/cart', data)
  },
  getCart() {
    return apiService.httpAuth.get('/users/cart')
  },
}
