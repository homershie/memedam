import apiService from './apiService.js'

class FeedbackService {
  // 提交意見
  async submitFeedback(feedbackData) {
    try {
      const response = await apiService.httpAuth.post(
        'api/feedback/submit',
        feedbackData,
      )

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 取得意見列表 (管理員用)
  async getFeedbacks(params = {}) {
    try {
      const response = await apiService.httpAuth.get('api/feedback/admin', {
        params,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 更新意見狀態 (管理員用)
  async updateFeedbackStatus(id, statusData) {
    try {
      const response = await apiService.httpAuth.put(
        `api/feedback/admin/${id}`,
        statusData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 檢查 reCAPTCHA 設定
  checkRecaptchaConfig() {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

    if (
      !siteKey ||
      siteKey === 'your_site_key_here' ||
      siteKey === 'undefined'
    ) {
      throw new Error('reCAPTCHA 設定未完成，請聯絡管理員')
    }
    return siteKey
  }

  // 載入 reCAPTCHA 腳本
  loadRecaptchaScript() {
    return new Promise((resolve, reject) => {
      // 檢查是否已經載入
      if (window.grecaptcha) {
        resolve(window.grecaptcha)
        return
      }

      // 檢查環境變數
      const siteKey = this.checkRecaptchaConfig()

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true

      script.onload = () => {
        // 等待 grecaptcha 初始化
        const checkGrecaptcha = () => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            resolve(window.grecaptcha)
          } else {
            setTimeout(checkGrecaptcha, 100)
          }
        }
        checkGrecaptcha()
      }

      script.onerror = () => {
        reject(new Error('reCAPTCHA 腳本載入失敗，請檢查網路連線'))
      }

      document.head.appendChild(script)
    })
  }

  // 執行 reCAPTCHA 驗證
  async executeRecaptcha(action = 'submit_feedback') {
    try {
      const grecaptcha = await this.loadRecaptchaScript()

      return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(this.checkRecaptchaConfig(), { action })
            .then((token) => {
              if (token) {
                resolve(token)
              } else {
                reject(new Error('reCAPTCHA 驗證失敗'))
              }
            })
            .catch((error) => {
              console.error('reCAPTCHA 執行錯誤:', error)
              reject(new Error('驗證失敗，請重新嘗試'))
            })
        })
      })
    } catch (error) {
      console.error('reCAPTCHA 執行失敗:', error)
      throw error
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
