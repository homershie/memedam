import apiService from './apiService'

export default {
  // 建立迷因版本
  create(data) {
    return apiService.httpAuth.post('/api/meme-versions', data)
  },

  // 取得迷因版本列表
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/meme-versions', { params })
  },

  // 取得指定迷因版本
  get(id) {
    return apiService.httpAuth.get(`/api/meme-versions/${id}`)
  },

  // 根據迷因ID取得版本列表
  getByMemeId(memeId, params = {}) {
    return this.getAll({ meme_id: memeId, ...params })
  },

  // 更新迷因版本
  update(id, data) {
    return apiService.httpAuth.put(`/api/meme-versions/${id}`, data)
  },

  // 刪除迷因版本
  remove(id) {
    return apiService.httpAuth.delete(`/api/meme-versions/${id}`)
  },
}
