import apiService from './apiService'

export default {
  createImage(data) {
    return apiService.httpAuth.post('/api/upload/image', data)
  },

  // 通用圖片上傳方法
  async uploadImage(file, options = {}) {
    const formData = new FormData()
    formData.append('image', file)

    // 添加可選參數
    if (options.folder) {
      formData.append('folder', options.folder)
    }
    if (options.transformation && Array.isArray(options.transformation)) {
      formData.append('transformation', JSON.stringify(options.transformation))
    }
    if (options.public_id) {
      formData.append('public_id', options.public_id)
    }

    const response = await apiService.httpAuth.post(
      '/api/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },

  // 新增頭像上傳方法
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiService.httpAuth.post('/api/upload/avatar', formData)
  },
}
