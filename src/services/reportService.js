import apiService from './apiService'

export default {
  // 建立舉報
  create(data) {
    return apiService.httpAuth.post('/api/reports', data)
  },

  // 取得所有舉報（管理員功能）
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/reports', { params })
  },

  // 取得指定舉報
  get(id) {
    return apiService.httpAuth.get(`/api/reports/${id}`)
  },

  // 更新舉報
  update(id, data) {
    return apiService.httpAuth.put(`/api/reports/${id}`, data)
  },

  // 刪除舉報
  remove(id) {
    return apiService.httpAuth.delete(`/api/reports/${id}`)
  },
}
