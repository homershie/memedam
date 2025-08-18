import apiService from './apiService.js'

class FeedbackService {
  // 提交意見
  async submitFeedback(feedbackData) {
    try {
      const response = await apiService.post('/feedback/submit', feedbackData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 取得意見列表 (管理員用)
  async getFeedbacks(params = {}) {
    try {
      const response = await apiService.get('/feedback/admin', { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 更新意見狀態 (管理員用)
  async updateFeedbackStatus(id, statusData) {
    try {
      const response = await apiService.put(`/feedback/admin/${id}`, statusData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 載入 reCAPTCHA 腳本
  loadRecaptchaScript() {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha)
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        if (window.grecaptcha) {
          resolve(window.grecaptcha)
        } else {
          reject(new Error('reCAPTCHA 載入失敗'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('reCAPTCHA 腳本載入失敗'))
      }

      document.head.appendChild(script)
    })
  }

  // 執行 reCAPTCHA 驗證
  async executeRecaptcha(action = 'submit_feedback') {
    try {
      const grecaptcha = await this.loadRecaptchaScript()
      const token = await grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action })
      return token
    } catch (error) {
      console.error('reCAPTCHA 執行失敗:', error)
      throw new Error('驗證失敗，請重新嘗試')
    }
  }

  // 錯誤處理
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    return new Error('操作失敗，請稍後再試')
  }
}

export default new FeedbackService()
