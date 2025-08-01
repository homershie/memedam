import apiService from './apiService'

export default {
  // 建立新標籤
  create(data) {
    return apiService.httpAuth.post('/api/tags', data)
  },

  // 取得所有標籤
  getAll(params = {}) {
    return apiService.http.get('/api/tags', { params })
  },

  // 取得熱門標籤
  getPopular(limit = 10) {
    return apiService.http.get('/api/tags/popular', {
      params: { limit },
    })
  },

  // 取得指定標籤
  get(id) {
    return apiService.http.get(`/api/tags/${id}`)
  },

  // 更新標籤
  update(id, data) {
    return apiService.httpAuth.put(`/api/tags/${id}`, data)
  },

  // 刪除標籤
  remove(id) {
    return apiService.httpAuth.delete(`/api/tags/${id}`)
  },
}
