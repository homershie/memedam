import apiService from './apiService'

export default {
  // 建立新留言
  create(data) {
    return apiService.httpAuth.post('/api/comments', data)
  },

  // 取得留言列表
  getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/api/comments?${queryString}` : '/api/comments'
    return apiService.http.get(url)
  },

  // 取得指定留言
  get(id) {
    return apiService.http.get(`/api/comments/${id}`)
  },

  // 更新留言
  update(id, data) {
    return apiService.httpAuth.put(`/api/comments/${id}`, data)
  },

  // 刪除留言
  remove(id) {
    return apiService.httpAuth.delete(`/api/comments/${id}`)
  },

  // 獲取指定迷因的所有留言
  getByMemeId(memeId, params = {}) {
    return this.getAll({ meme_id: memeId, ...params })
  },

  // 獲取主留言（沒有 parent_id 的留言）
  getMainComments(memeId, params = {}) {
    return this.getAll({ meme_id: memeId, parent_id: null, ...params })
  },

  // 獲取指定留言的回復
  getReplies(parentId, params = {}) {
    return this.getAll({ parent_id: parentId, ...params })
  },
}
