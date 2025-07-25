import apiService from './apiService'

export default {
  createImage(data) {
    return apiService.httpAuth.post('/api/upload/image', data)
  },
}
