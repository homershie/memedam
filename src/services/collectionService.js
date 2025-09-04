import apiService from './apiService'

export default {
  // 收藏迷因
  create(data) {
    return apiService.httpAuth.post('/api/collections', data)
  },

  // 取消收藏迷因
  remove(memeId) {
    return apiService.httpAuth.delete('/api/collections', {
      params: { meme_id: memeId },
    })
  },

  // 取得用戶的收藏列表
  getAll(userId = null, params = {}) {
    const queryParams = { ...params }
    if (userId) {
      queryParams.user_id = userId
    }
    return apiService.http.get('/api/collections', { params: queryParams })
  },

  // 切換收藏狀態
  toggle(data) {
    return apiService.httpAuth.post('/api/collections/toggle', data)
  },
}
