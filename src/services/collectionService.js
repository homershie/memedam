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
  getAll(params = {}) {
    return apiService.http.get('/api/collections', { params })
  },

  // 切換收藏狀態
  toggle(data) {
    return apiService.httpAuth.post('/api/collections/toggle', data)
  },
}
