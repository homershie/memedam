import apiService from './apiService'

export default {
  createImage(data) {
    return apiService.httpAuth.post('/api/upload/image', data)
  },

  // 新增頭像上傳方法
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiService.httpAuth.post('/api/upload/avatar', formData)
  },
}
