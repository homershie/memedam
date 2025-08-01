import apiService from './apiService'

export default {
  // 建立贊助
  create(data) {
    return apiService.httpAuth.post('/api/sponsors', data)
  },

  // 取得所有贊助（管理員功能）
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/sponsors', { params })
  },

  // 取得指定贊助
  get(id) {
    return apiService.httpAuth.get(`/api/sponsors/${id}`)
  },

  // 更新贊助
  update(id, data) {
    return apiService.httpAuth.put(`/api/sponsors/${id}`, data)
  },

  // 刪除贊助
  remove(id) {
    return apiService.httpAuth.delete(`/api/sponsors/${id}`)
  },
}
