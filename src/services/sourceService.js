import apiService from './apiService'

export default {
  // 搜尋來源
  search(query, limit = 10) {
    return apiService.http.get('/api/sources/search/autocomplete', {
      params: { q: query, limit },
    })
  },

  // 建立新來源
  create(data) {
    return apiService.httpAuth.post('/api/sources', data)
  },

  // 取得單一來源
  get(id) {
    return apiService.http.get(`/api/sources/${id}`)
  },
  // 新增：使用 slug 取得來源
  getBySlug(slug) {
    return apiService.http.get(`/api/sources/${slug}`)
  },
  // 取得來源的片段列表
  getScenes(sourceId, params = {}) {
    return apiService.http.get(`/api/scenes/source/${sourceId}`, { params })
  },

  // 更新來源
  update(id, data) {
    return apiService.httpAuth.put(`/api/sources/${id}`, data)
  },

  // 刪除來源
  remove(id) {
    return apiService.httpAuth.delete(`/api/sources/${id}`)
  },

  // 取得所有來源（分頁）
  getAll(params = {}) {
    return apiService.http.get('/api/sources', { params })
  },

  // 檢查 slug 是否可用
  checkSlugAvailable(slug) {
    return apiService.http.get('/api/sources/slug-available', {
      params: { slug },
    })
  },
}
