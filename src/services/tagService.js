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

  // 取得標籤分類（用於前端篩選）
  getCategories(params = {}) {
    return apiService.http.get('/api/tags/categories', { params })
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

  // 新增：取得標籤統計
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/tags/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/tags/batch-update', { ids, data })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/tags/batch-delete', {
      data: { ids },
    })
  },

  // 新增：合併標籤
  mergeTags(primaryId, secondaryIds) {
    return apiService.httpAuth.post('/api/tags/merge', {
      primaryId,
      secondaryIds,
    })
  },

  // 新增：切換標籤狀態
  toggleStatus(id) {
    return apiService.httpAuth.put(`/api/tags/${id}/toggle-status`)
  },

  // 新增：取得標籤使用統計
  getUsageStats(id) {
    return apiService.httpAuth.get(`/api/tags/${id}/usage-stats`)
  },

  // 新增：更新標籤顏色
  updateColor(id, color) {
    return apiService.httpAuth.put(`/api/tags/${id}/color`, { color })
  },

  // 新增：匯出標籤數據
  exportTags(params = {}) {
    return apiService.httpAuth.get('/api/tags/export', {
      params,
      responseType: 'blob',
    })
  },
}
