import { useUserStore } from '@/stores/userStore'

/**
 * OAuth 登入處理函數（支援彈窗和重定向方式）
 * @param {string} provider - 社群平台 (google, facebook, discord, twitter)
 * @param {function} router - Vue Router 實例
 * @param {object} toast - PrimeVue toast 實例
 * @param {boolean} usePopup - 是否使用彈窗方式，默認true
 * @returns {Promise} OAuth 登入結果
 */
export const handleOAuthLogin = async (provider, router, toast, usePopup = true) => {
  try {
    console.log(`開始 ${provider} OAuth 登入流程（${usePopup ? '彈窗' : '重定向'}方式）`)

    // 構建 OAuth URL
    let baseUrl = import.meta.env.VITE_API_URL

    // 如果環境變數為空或未定義，使用當前域名（開發環境使用 Vite 代理）
    if (!baseUrl || baseUrl.trim() === '') {
      baseUrl = window.location.origin
    }

    const oauthUrl = `${baseUrl}/api/users/auth/${provider}`
    console.log(`OAuth URL: ${oauthUrl}`)

    if (usePopup) {
      return handlePopupOAuth(oauthUrl, provider, router, toast)
    } else {
      return handleRedirectOAuth(oauthUrl, router)
    }
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
 * 彈窗方式的 OAuth 處理
 */
const handlePopupOAuth = (oauthUrl, provider, router, toast) => {
  return new Promise((resolve, reject) => {
    console.log('開始彈窗 OAuth 流程')
    
    // 彈窗設定
    const popup = window.open(
      oauthUrl,
      `${provider}_oauth`,
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      const error = new Error('無法開啟彈窗，請確認瀏覽器允許彈窗')
      reject(error)
      return
    }

    // 監聽消息
    const messageHandler = (event) => {
      console.log('收到OAuth回調消息:', event.data)

      // 驗證消息來源（生產環境中應該更嚴格）
      if (event.origin !== window.location.origin && event.origin !== '*') {
        console.warn('收到來自未知來源的消息:', event.origin)
        return
      }

      const { type, data, error } = event.data

      switch (type) {
        case 'oauth_success':
          console.log('OAuth登入成功')
          cleanup()
          resolve({ success: true, data, needsUsername: false })
          break

        case 'oauth_needs_username':
          console.log('OAuth成功，但需要選擇username')
          cleanup()
          resolve({ success: true, data, needsUsername: true })
          break

        case 'oauth_error':
          console.error('OAuth登入失敗:', error)
          cleanup()
          reject(new Error(error || 'OAuth登入失敗'))
          break

        default:
          console.log('未知的消息類型:', type)
      }
    }

    // 定時檢查彈窗是否被關閉
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log('用戶關閉了OAuth彈窗')
        cleanup()
        reject(new Error('用戶取消了授權'))
      }
    }, 1000)

    // 清理函數
    const cleanup = () => {
      window.removeEventListener('message', messageHandler)
      clearInterval(checkClosed)
      if (!popup.closed) {
        popup.close()
      }
    }

    // 註冊消息監聽器
    window.addEventListener('message', messageHandler)

    // 設定超時（60秒）
    setTimeout(() => {
      if (!popup.closed) {
        console.warn('OAuth超時')
        cleanup()
        reject(new Error('OAuth授權超時，請重試'))
      }
    }, 60000)
  })
}

/**
 * 重定向方式的 OAuth 處理（保持原有邏輯）
 */
const handleRedirectOAuth = (oauthUrl, router) => {
  // 保存當前頁面狀態
  const currentPath = router.currentRoute.value.fullPath
  const returnPath = currentPath === '/login' ? '/' : currentPath

  localStorage.setItem('oauth_return_path', returnPath)
  console.log(`當前頁面: ${currentPath}, 登入後將跳轉到: ${returnPath}`)

  // 直接重定向到 OAuth URL
  console.log('開始重定向到 OAuth 提供者...')
  window.location.href = oauthUrl

  return Promise.resolve()
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
    console.log('開始處理 OAuth 成功，token:', token.substring(0, 20) + '...')

    // 暫時儲存 token
    localStorage.setItem('temp_oauth_token', token)

    // 使用 token 獲取用戶資訊
    let baseUrl = import.meta.env.VITE_API_URL

    // 如果環境變數為空或未定義，使用當前域名（開發環境使用 Vite 代理）
    if (!baseUrl || baseUrl.trim() === '') {
      baseUrl = window.location.origin
    }

    const response = await fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('獲取用戶資訊失敗')
    }

    const userData = await response.json()

    console.log('獲取用戶資訊成功:', userData.user?.username)

    // 登入用戶
    userStore.login({
      ...userData.user,
      token: token,
    })

    // 等待一下確保 Pinia 狀態完全更新
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 再次確認登入狀態
    if (!userStore.isLoggedIn) {
      console.warn('用戶狀態未正確更新，重試中...')
      // 重新設置 token
      userStore.login({
        ...userData.user,
        token: token,
      })
      // 再等待一下
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // 清除臨時 token
    localStorage.removeItem('temp_oauth_token')

    toast.add({
      severity: 'success',
      summary: '登入成功',
      detail: '歡迎回來！',
      life: 3000,
    })

    console.log('用戶登入處理完成，登入狀態:', userStore.isLoggedIn)
  } catch (error) {
    console.error('handleOAuthSuccess 錯誤:', error)
    localStorage.removeItem('temp_oauth_token')
    throw error
  }
}

/**
 * 處理 OAuth 回調（用於首頁或回調頁面）
 * @param {object} route - Vue Route 物件
 * @param {object} router - Vue Router
 * @param {object} userStore - Pinia 用戶 store
 * @param {object} toast - PrimeVue toast
 */
export const handleOAuthCallback = async (route, router, userStore, toast) => {
  const token = route.query.token
  const error = route.query.error
  const needsUsername = route.query.needsUsername === 'true'

  console.log(
    '處理 OAuth 回調，token:',
    token ? token.substring(0, 20) + '...' : '無',
    'error:',
    error,
    'needsUsername:',
    needsUsername
  )

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'OAuth 登入失敗',
      detail: `授權失敗: ${error}`,
      life: 5000,
    })

    // 清除保存的狀態
    localStorage.removeItem('oauth_return_path')
    localStorage.removeItem('oauth_provider')

    // 清除 URL 參數並回到首頁
    router.replace({ path: '/', query: {} })
    return
  }

  if (token) {
    try {
      if (needsUsername) {
        // 需要選擇username，重定向到登入頁面並傳遞相關數據
        const oauthData = {
          token,
          needsUsername: true,
          provider: route.query.provider,
          profile: route.query.profile ? JSON.parse(decodeURIComponent(route.query.profile)) : null,
          userData: route.query.user ? JSON.parse(decodeURIComponent(route.query.user)) : null
        }

        localStorage.setItem('oauth_callback_data', JSON.stringify(oauthData))
        router.replace('/login')
        return
      }

      await handleOAuthSuccess(token, userStore, toast, router)

      // 獲取保存的返回路徑
      const returnPath = localStorage.getItem('oauth_return_path') || '/'
      const provider = localStorage.getItem('oauth_provider')

      // 清除保存的狀態
      localStorage.removeItem('oauth_return_path')
      localStorage.removeItem('oauth_provider')

      console.log(`${provider} OAuth 登入成功，跳轉到:`, returnPath)

      // 確保用戶狀態已完全同步後再跳轉
      if (userStore.isLoggedIn) {
        // 清除 URL 參數並跳轉到目標頁面
        router
          .replace({ path: returnPath, query: {} })
          .then(() => {
            console.log('OAuth 回調處理完成，跳轉成功')
          })
          .catch((routerError) => {
            console.error('路由跳轉失敗:', routerError)
            // 如果跳轉失敗，回到首頁
            router.replace('/')
          })
      } else {
        console.error('用戶狀態未正確設置，無法跳轉')
        toast.add({
          severity: 'error',
          summary: '登入失敗',
          detail: '用戶狀態設置失敗，請重新登入',
          life: 5000,
        })
        // 清除 URL 參數並回到首頁
        router.replace({ path: '/', query: {} })
      }
    } catch (error) {
      console.error('OAuth 回調處理失敗:', error)
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: error.message || 'OAuth 登入過程中發生錯誤',
        life: 5000,
      })

      // 清除保存的狀態
      localStorage.removeItem('oauth_return_path')
      localStorage.removeItem('oauth_provider')

      // 清除 URL 參數並回到首頁
      router.replace({ path: '/', query: {} })
    }
  }
}

/**
 * 處理來自localStorage的OAuth成功數據（用於沒有主視窗的情況）
 * @param {object} userStore - Pinia 用戶 store  
 * @param {object} toast - PrimeVue toast
 * @param {object} router - Vue Router
 */
export const handleStoredOAuthSuccess = async (userStore, toast, router) => {
  try {
    const storedData = localStorage.getItem('oauth_success_data')
    if (!storedData) return false

    const { token, user, userId } = JSON.parse(storedData)
    localStorage.removeItem('oauth_success_data')

    // 登入用戶
    userStore.login({
      ...user,
      token,
      userId
    })

    toast.add({
      severity: 'success',
      summary: '登入成功',
      detail: '歡迎回來！',
      life: 3000,
    })

    return true
  } catch (error) {
    console.error('處理儲存的OAuth成功數據失敗:', error)
    localStorage.removeItem('oauth_success_data')
    return false
  }
}
