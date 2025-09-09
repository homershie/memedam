import apiService from './apiService'

export default {
  // 建立公告
  create(data) {
    // 如果有檔案，使用 FormData
    if (data.image instanceof File) {
      const formData = new FormData()
      formData.append('image', data.image)
      formData.append('title', data.title)
      // 處理內容：如果是物件（JSON格式），轉為字串
      if (typeof data.content === 'object' && data.content !== null) {
        formData.append('content', JSON.stringify(data.content))
      } else {
        formData.append('content', data.content)
      }
      formData.append('status', data.status)
      formData.append('category', data.category)
      if (data.pinned !== undefined) {
        formData.append('pinned', data.pinned)
      }
      if (data.content_format) {
        formData.append('content_format', data.content_format)
      }
      return apiService.httpAuth.post('/api/announcements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return apiService.httpAuth.post('/api/announcements', data)
  },

  // 取得所有公告（公開的，不需要驗證）
  getAll(params = {}) {
    return apiService.http.get('/api/announcements', { params })
  },

  // 取得所有公告（管理員用，需要驗證）
  getAllAdmin(params = {}) {
    return apiService.httpAuth.get('/api/announcements/admin/all', { params })
  },

  // 取得指定公告（公開的，不需要驗證）
  get(id) {
    return apiService.http.get(`/api/announcements/${id}`)
  },

  // 取得指定公告（管理員用，需要驗證）
  getAdmin(id) {
    return apiService.httpAuth.get(`/api/announcements/admin/${id}`)
  },

  // 更新公告
  update(id, data) {
    // 如果有檔案，使用 FormData
    if (data.image instanceof File) {
      const formData = new FormData()
      formData.append('image', data.image)
      if (data.title) formData.append('title', data.title)
      // 處理內容：如果是物件（JSON格式），轉為字串
      if (data.content) {
        if (typeof data.content === 'object' && data.content !== null) {
          formData.append('content', JSON.stringify(data.content))
        } else {
          formData.append('content', data.content)
        }
      }
      if (data.status) formData.append('status', data.status)
      if (data.category) formData.append('category', data.category)
      if (data.pinned !== undefined) {
        formData.append('pinned', data.pinned)
      }
      if (data.content_format) {
        formData.append('content_format', data.content_format)
      }
      return apiService.httpAuth.put(`/api/announcements/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return apiService.httpAuth.put(`/api/announcements/${id}`, data)
  },

  // 刪除公告
  remove(id) {
    return apiService.httpAuth.delete(`/api/announcements/${id}`)
  },
}
