import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/comments', data)
  },
  getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/comments?${queryString}` : '/comments'
    return apiService.http.get(url)
  },
  get(id) {
    return apiService.http.get(`/comments/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/comments/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/comments/${id}`)
  },
  // 獲取指定迷因的所有留言（包含回復）
  getByMemeId(memeId) {
    return this.getAll({ meme_id: memeId })
  },
  // 獲取主留言（沒有 parent_id 的留言）
  getMainComments(memeId) {
    return this.getAll({ meme_id: memeId, parent_id: null })
  },
  // 獲取指定留言的回復
  getReplies(parentId) {
    return this.getAll({ parent_id: parentId })
  },
}
