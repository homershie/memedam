import { useUserStore } from '@/stores/userStore'

/**
 * OAuth 登入處理函數
 * @param {string} provider - 社群平台 (google, facebook, discord, twitter)
 * @param {function} router - Vue Router 實例
 * @param {object} toast - PrimeVue toast 實例
 * @returns {Promise} OAuth 登入結果
 */
export const handleOAuthLogin = async (provider, router, toast) => {
  const userStore = useUserStore()

  try {
    // 1. 計算彈出視窗位置
    const width = 500
    const height = 600
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2

    // 2. 開啟 OAuth 授權彈出視窗
    const popup = window.open(
      `${import.meta.env.VITE_API_URL}/api/users/auth/${provider}`,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    )

    if (!popup) {
      throw new Error('彈出視窗被阻擋，請允許彈出視窗並重試')
    }

    // 3. 監聽彈出視窗關閉或 URL 變化
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        try {
          // 檢查視窗是否關閉
          if (popup.closed) {
            clearInterval(checkClosed)
            reject(new Error('用戶取消了授權'))
            return
          }

          // 檢查是否回到我們的域名（表示授權完成）
          const currentUrl = popup.location.href

          if (currentUrl.includes(window.location.origin)) {
            // 解析 URL 參數
            const url = new URL(currentUrl)
            const token = url.searchParams.get('token')
            const error = url.searchParams.get('error')

            clearInterval(checkClosed)
            popup.close()

            if (error) {
              reject(new Error(`OAuth 授權失敗: ${error}`))
            } else if (token) {
              // 4. 使用 token 獲取用戶資訊並登入
              handleOAuthSuccess(token, userStore, toast, router)
                .then(resolve)
                .catch(reject)
            } else {
              reject(new Error('未收到有效的授權 token'))
            }
          }
        } catch (e) {
          // 跨域錯誤是正常的，繼續檢查
          if (popup.closed) {
            clearInterval(checkClosed)
            reject(new Error('用戶取消了授權'))
          }
        }
      }, 1000)

      // 設定超時（10分鐘）
      setTimeout(() => {
        clearInterval(checkClosed)
        if (!popup.closed) {
          popup.close()
        }
        reject(new Error('OAuth 授權超時'))
      }, 600000)
    })
  } catch (error) {
    console.error(`${provider} OAuth 登入失敗:`, error)
    if (toast) {
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: error.message || '社群登入過程中發生錯誤',
        life: 5000,
      })
    }
    throw error
  }
}

/**
 * 處理 OAuth 登入成功
 * @param {string} token - JWT token
 * @param {object} userStore - Pinia 用戶 store
 * @param {object} toast - PrimeVue toast
 * @param {object} router - Vue Router
 */
const handleOAuthSuccess = async (token, userStore, toast, router) => {
  try {
    // 暫時儲存 token
    localStorage.setItem('temp_oauth_token', token)

    // 使用 token 獲取用戶資訊
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('獲取用戶資訊失敗')
    }

    const userData = await response.json()

    // 登入用戶
    userStore.login({
      ...userData.user,
      token: token,
      userId: userData.user._id,
    })

    // 清除臨時 token
    localStorage.removeItem('temp_oauth_token')

    toast.add({
      severity: 'success',
      summary: '登入成功',
      detail: '歡迎回來！',
      life: 3000,
    })

    // 導向首頁
    router.push('/')
  } catch (error) {
    localStorage.removeItem('temp_oauth_token')
    throw error
  }
}

/**
 * 處理 OAuth 回調（用於首頁）
 * @param {object} route - Vue Route 物件
 * @param {object} router - Vue Router
 * @param {object} userStore - Pinia 用戶 store
 * @param {object} toast - PrimeVue toast
 */
export const handleOAuthCallback = async (route, router, userStore, toast) => {
  const token = route.query.token
  const error = route.query.error

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'OAuth 登入失敗',
      detail: `授權失敗: ${error}`,
      life: 5000,
    })
    // 清除 URL 參數
    router.replace({ query: {} })
    return
  }

  if (token) {
    try {
      await handleOAuthSuccess(token, userStore, toast, router)
      // 清除 URL 參數
      router.replace({ query: {} })
    } catch (error) {
      console.error('OAuth 回調處理失敗:', error)
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: error.message || 'OAuth 登入過程中發生錯誤',
        life: 5000,
      })
      // 清除 URL 參數
      router.replace({ query: {} })
    }
  }
}
