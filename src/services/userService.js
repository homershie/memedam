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
  getAll(params = {}) {
    return apiService.httpAuth.get('/api/users', { params })
  },
  get(id, options = {}) {
    // 將選項轉換為查詢參數來避免快取
    const params = {}
    if (options.timestamp) {
      params._t = options.timestamp
    }
    return apiService.httpAuth.get(`/api/users/${id}`, { params })
  },
  // 根據 username 獲取用戶資料
  getByUsername(username) {
    return apiService.httpAuth.get(
      `/api/users/profile/${encodeURIComponent(username)}`,
    )
  },

  // 通用函數：根據標識符（ID 或 username）獲取用戶資料
  async getUserByIdentifier(identifier, options = {}) {
    if (!identifier) {
      throw new Error('標識符不能為空')
    }

    // 簡單的 ID 檢測邏輯
    const isMongoId = /^[a-f\d]{24}$/i.test(identifier)
    const isShortAlphanumeric =
      /^[a-zA-Z0-9_]{1,30}$/.test(identifier) && identifier.length <= 30

    const isLikelyId =
      isMongoId ||
      (isShortAlphanumeric && /\d/.test(identifier) && identifier.length > 10)
    const isLikelyUsername = isShortAlphanumeric && identifier.length <= 20

    try {
      let userId = identifier

      // 如果是 username，先通過 username API 獲取用戶 ID，然後使用 ID API
      if (isLikelyUsername) {
        const usernameResponse = await this.getByUsername(identifier)
        if (usernameResponse.data && usernameResponse.data.user) {
          userId = usernameResponse.data.user._id
        } else {
          throw new Error(`無法從 username "${identifier}" 獲取用戶 ID`)
        }
      }

      // 始終使用 ID 調用標準的用戶 API，添加選項來避免快取
      return await this.get(userId, options)
    } catch (error) {
      console.error('getUserByIdentifier 失敗:', error)

      // 如果是 404 錯誤，直接拋出
      if (error.response?.status === 404) {
        throw error
      }

      // 嘗試備用邏輯：如果 ID API 失敗，嘗試直接使用 username API
      if (isLikelyId) {
        console.warn(`ID API 失敗，嘗試使用 username API:`, identifier)
        try {
          return await this.getByUsername(identifier)
        } catch (usernameError) {
          console.error('username API 備用調用也失敗:', usernameError)
        }
      }

      // 拋出原始錯誤
      throw error
    }
  },
  // 根據 username 獲取用戶統計資料
  getStatsByUsername(username) {
    return apiService.http.get(
      `/api/users/profile/${encodeURIComponent(username)}/stats`,
    )
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
  // 密碼相關
  changePassword(data) {
    return apiService.httpAuth.post('/api/users/change-password', data)
  },
  // 檢查密碼狀態
  getPasswordStatus() {
    return apiService.httpAuth.get('/api/users/password-status')
  },
  forgotPassword(email) {
    return apiService.http.post('/api/users/forgot-password', { email })
  },
  resetPassword(token, newPassword) {
    return apiService.http.post('/api/users/reset-password', {
      token,
      newPassword,
    })
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

  // OAuth 綁定相關
  getBindStatus() {
    return apiService.httpAuth.get('/api/users/bind-status')
  },
  initBindAuth(provider) {
    return apiService.httpAuth.get(`/api/users/bind-auth/${provider}`)
  },

  // 搜索用戶（用於@提及功能）
  searchUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiService.http.get(`/api/users/search?${queryString}`)
  },

  // Username 相關 API
  // 預覽 username 建議
  previewUsernameSuggestions(provider, profile) {
    return apiService.http.post('/api/username/preview', {
      provider,
      profile,
    })
  },

  // 獲取 username 建議（用於 OAuth 註冊）
  getOAuthUsernameSuggestions(provider, profile) {
    const encodedProfile = encodeURIComponent(JSON.stringify(profile))
    return apiService.http.get(
      `/api/users/username-suggestions/${provider}?profile=${encodedProfile}`,
    )
  },

  // 檢查 username 可用性
  checkUsernameAvailability(username) {
    return apiService.http.get(
      `/api/username/check/${encodeURIComponent(username)}`,
    )
  },

  // 獲取個人化 username 建議（需登入）
  getUsernameSuggestions() {
    return apiService.httpAuth.get('/api/username/suggestions')
  },

  // 驗證 username 格式和可用性
  validateUsername(username) {
    return apiService.http.get(
      `/api/username/validate/${encodeURIComponent(username)}`,
    )
  },

  // 變更用戶的 username
  changeUsername(data) {
    return apiService.httpAuth.post('/api/username/change', data)
  },

  // 上傳封面圖片
  uploadCoverImage(file) {
    const formData = new FormData()
    formData.append('cover_image', file)
    return apiService.httpAuth.post('/api/users/me/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 上傳頭像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiService.httpAuth.post('/api/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 完成社群註冊
  completeSocialRegistration(data) {
    return apiService.http.post('/api/users/complete-social-registration', data)
  },

  getActiveUsers,

  // 新增：取得用戶統計
  getStats(userId) {
    return apiService.http.get(`/api/users/${userId}/stats`)
  },

  // 通用函數：根據標識符（ID 或 username）獲取用戶統計
  async getStatsByIdentifier(identifier) {
    if (!identifier) {
      throw new Error('標識符不能為空')
    }

    // 簡單的 ID 檢測邏輯
    const isMongoId = /^[a-f\d]{24}$/i.test(identifier)
    const isShortAlphanumeric =
      /^[a-zA-Z0-9_]{1,30}$/.test(identifier) && identifier.length <= 30

    const isLikelyId =
      isMongoId ||
      (isShortAlphanumeric && /\d/.test(identifier) && identifier.length > 10)
    const isLikelyUsername = isShortAlphanumeric && identifier.length <= 20

    try {
      let userId = identifier

      // 如果是 username，先通過 username API 獲取用戶 ID，然後使用 ID API
      if (isLikelyUsername) {
        const usernameResponse = await this.getByUsername(identifier)
        if (usernameResponse.data && usernameResponse.data.user) {
          userId = usernameResponse.data.user._id
        } else {
          throw new Error(`無法從 username "${identifier}" 獲取用戶 ID`)
        }
      }

      // 始終使用 ID 調用標準的統計 API
      return await this.getStats(userId)
    } catch (error) {
      console.error('getStatsByIdentifier 失敗:', error)

      // 如果是 404 錯誤，直接拋出
      if (error.response?.status === 404) {
        throw error
      }

      // 嘗試備用邏輯：如果 ID API 失敗，嘗試直接使用 username 統計 API
      if (isLikelyId) {
        console.warn(
          `ID 統計 API 失敗，嘗試使用 username 統計 API:`,
          identifier,
        )
        try {
          return await this.getStatsByUsername(identifier)
        } catch (usernameError) {
          console.error('username 統計 API 備用調用也失敗:', usernameError)
        }
      }

      // 拋出原始錯誤
      throw error
    }
  },

  // 新增：取得所有用戶統計
  getAllStats(params = {}) {
    return apiService.httpAuth.get('/api/users/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/users/batch-update', { ids, data })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/users/batch-delete', {
      data: { ids },
    })
  },

  // 新增：封鎖用戶
  banUser(userId, reason) {
    return apiService.httpAuth.put(`/api/users/${userId}/ban`, { reason })
  },

  // 新增：解除封鎖
  unbanUser(userId) {
    return apiService.httpAuth.put(`/api/users/${userId}/unban`)
  },

  // 新增：更新用戶角色
  updateRole(userId, role) {
    return apiService.httpAuth.put(`/api/users/${userId}/role`, { role })
  },

  // 新增：取得用戶活動
  getUserActivity(userId, params = {}) {
    return apiService.httpAuth.get(`/api/users/${userId}/activity`, { params })
  },

  // 取得活躍用戶（公開端點，已在檔案開頭提供 getActiveUsers(limit) 版本）
  // 保留前面的 `getActiveUsers` 匯出，避免覆蓋。

  // 新增：取得新註冊用戶
  getNewUsers(params = {}) {
    return apiService.httpAuth.get('/api/users/new', { params })
  },

  // 新增：匯出用戶數據
  exportUsers(params = {}) {
    return apiService.httpAuth.get('/api/users/export', {
      params,
      responseType: 'blob',
    })
  },
}
