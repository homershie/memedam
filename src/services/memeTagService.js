import apiService from './apiService'

export default {
  // 建立迷因標籤關聯
  create(data) {
    return apiService.httpAuth.post('/api/meme-tags', data)
  },

  // 批量建立迷因標籤關聯
  batchCreate(data) {
    return apiService.httpAuth.post('/api/meme-tags/batch', data)
  },
  batchCreateId(id, data) {
    return apiService.httpAuth.post(`/api/meme-tags/${id}/batch`, data)
  },

  // 取得所有迷因標籤關聯
  getAll(params = {}) {
    return apiService.http.get('/api/meme-tags', { params })
  },

  // 取得指定迷因標籤關聯
  get(id) {
    return apiService.http.get(`/api/meme-tags/${id}`)
  },

  // 根據迷因ID取得標籤列表
  getTagsByMemeId(memeId) {
    return apiService.http.get(`/api/meme-tags/meme/${memeId}/tags`)
  },

  // 根據標籤ID取得迷因列表
  getMemesByTagId(tagId) {
    return apiService.http.get(`/api/meme-tags/tag/${tagId}/memes`)
  },

  // 取得關聯詳情
  getRelation(id) {
    return apiService.http.get(`/api/meme-tags/relation/${id}`)
  },

  // 更新迷因標籤關聯
  update(id, data) {
    return apiService.httpAuth.put(`/api/meme-tags/${id}`, data)
  },

  // 刪除迷因標籤關聯
  remove(id) {
    return apiService.httpAuth.delete(`/api/meme-tags/${id}`)
  },

  // 刪除迷因的所有標籤
  removeAllTagsByMeme(memeId) {
    return apiService.httpAuth.delete(`/api/meme-tags/meme/${memeId}/tags`)
  },
}
