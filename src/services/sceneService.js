import apiService from './apiService'

export default {
  // 建立新場景
  create(data) {
    return apiService.httpAuth.post('/api/scenes', data)
  },

  // 取得單一場景
  get(id, params = {}) {
    return apiService.http.get(`/api/scenes/${id}`, { params })
  },

  // 取得單一場景
  get(id) {
    return apiService.http.get(`/api/scenes/${id}`)
  },

  // 更新場景
  update(id, data) {
    return apiService.httpAuth.put(`/api/scenes/${id}`, data)
  },

  // 刪除場景
  remove(id) {
    return apiService.httpAuth.delete(`/api/scenes/${id}`)
  },

  // 搜尋場景
  search(query, params = {}) {
    return apiService.http.get('/api/scenes/search', {
      params: { q: query, ...params },
    })
  },

  // 根據來源 ID 取得場景
  getBySourceId(sourceId, params = {}) {
    return apiService.http.get('/api/scenes', {
      params: { source_id: sourceId, ...params },
    })
  },
}
