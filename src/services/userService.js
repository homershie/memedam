import apiService from './apiService'

// 獲取活躍用戶
const getActiveUsers = async (limit = 10) => {
  try {
    const response = await apiService.http.get(
      `/api/users/active?limit=${limit}`,
    )
    return response
  } catch (error) {
    console.error('獲取活躍用戶失敗:', error)
    throw error
  }
}

export default {
  // 使用者 CRUD
  create(data) {
    return apiService.http.post('/api/users', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/users')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/users/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/users/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/users/${id}`)
  },
  // 個人資料
  getMe() {
    return apiService.httpAuth.get('/api/users/me')
  },
  updateMe(data) {
    return apiService.httpAuth.put('/api/users/me', data)
  },
  deleteMe() {
    return apiService.httpAuth.delete('/api/users/me')
  },
  // 認證
  login(data) {
    return apiService.http.post('/api/users/login', data)
  },
  logout() {
    return apiService.httpAuth.post('/api/users/logout')
  },
  refresh() {
    return apiService.httpAuth.post('/api/users/refresh')
  },
  // 密碼變更
  changePassword(data) {
    return apiService.httpAuth.post('/api/users/change-password', data)
  },
  // 電子信箱變更
  changeEmail(data) {
    return apiService.httpAuth.post('/api/users/change-email', data)
  },
  // 綁定社群帳號
  bindSocial(provider, data) {
    return apiService.httpAuth.post(`/api/users/bind/${provider}`, data)
  },
  // 解除綁定社群帳號
  unbindSocial(provider) {
    return apiService.httpAuth.delete(`/api/users/unbind/${provider}`)
  },
  // OAuth 觸發
  googleAuth() {
    return apiService.http.get('/api/users/auth/google')
  },
  facebookAuth() {
    return apiService.http.get('/api/users/auth/facebook')
  },
  discordAuth() {
    return apiService.http.get('/api/users/auth/discord')
  },
  twitterAuth() {
    return apiService.http.get('/api/users/auth/twitter')
  },
  // 用戶統計相關
  getStats(userId) {
    return apiService.http.get(`/api/follows/stats/${userId}`)
  },
  getActiveUsers,
  // 搜索用戶（用於@提及功能）
  searchUsers(params = {}) {
    return apiService.http.get('/api/users/search', { params })
  },
}
