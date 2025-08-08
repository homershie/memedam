import apiService from './apiService'

export default {
  // 發送驗證 Email
  sendVerificationEmail(email) {
    return apiService.http.post('/api/verification/send', { email })
  },

  // 驗證 Email Token
  verifyEmail(token) {
    return apiService.http.get(`/api/verification/verify?token=${token}`)
  },

  // 重新發送驗證 Email
  resendVerificationEmail(email) {
    return apiService.http.post('/api/verification/resend', { email })
  },
}
