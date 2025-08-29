import apiService from './apiService'

export default {
  // 建立新片段
  create(data) {
    return apiService.httpAuth.post('/api/scenes', data)
  },

  // 取得單一片段
  get(id) {
    return apiService.http.get(`/api/scenes/${id}`)
  },

  // 更新片段
  update(id, data) {
    return apiService.httpAuth.put(`/api/scenes/${id}`, data)
  },

  // 刪除片段
  remove(id) {
    return apiService.httpAuth.delete(`/api/scenes/${id}`)
  },

  // 搜尋片段
  search(query, params = {}) {
    return apiService.http.get('/api/scenes/search', {
      params: { q: query, ...params },
    })
  },

  // 根據來源 ID 取得片段
  getBySourceId(sourceId, params = {}) {
    return apiService.http.get('/api/scenes', {
      params: { source_id: sourceId, ...params },
    })
  },
}