import apiService from './apiService'

export default {
  // 追隨用戶
  follow(userId) {
    return apiService.httpAuth.post('/api/follows/follow', { user_id: userId })
  },

  // 取消追隨用戶
  unfollow(userId) {
    return apiService.httpAuth.post('/api/follows/unfollow', {
      user_id: userId,
    })
  },

  // 切換追隨狀態
  toggleFollow(userId) {
    return apiService.httpAuth.post('/api/follows/toggle', { user_id: userId })
  },

  // 檢查追隨狀態
  getFollowStatus(userId) {
    return apiService.httpAuth.get(`/api/follows/status/${userId}`)
  },

  // 獲取指定用戶的追隨列表（我追隨的人）
  getFollowing(userId, params = {}) {
    return apiService.http.get(`/api/follows/following/${userId}`, { params })
  },

  // 獲取指定用戶的粉絲列表（追隨我的人）
  getFollowers(userId, params = {}) {
    return apiService.http.get(`/api/follows/followers/${userId}`, { params })
  },

  // 獲取用戶統計資訊
  getStats(userId) {
    return apiService.http.get(`/api/follows/stats/${userId}`)
  },
}
