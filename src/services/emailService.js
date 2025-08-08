import apiService from './apiService'

export default {
  // 檢查 Email 服務狀態
  checkEmailStatus() {
    return apiService.http.get('/api/email/status')
  },

  // 發送測試 Email
  sendTestEmail(email) {
    return apiService.http.post('/api/email/test', { email })
  },

  // 發送驗證 Email
  sendVerificationEmail(email, username, verificationToken) {
    return apiService.http.post('/api/email/verification', {
      email,
      username,
      verificationToken,
    })
  },

  // 發送密碼重設 Email
  sendPasswordResetEmail(email, username, resetToken) {
    return apiService.http.post('/api/email/password-reset', {
      email,
      username,
      resetToken,
    })
  },
}
