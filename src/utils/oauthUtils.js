/**
 * OAuth 登入處理函數（支援彈窗和重定向方式）
 * @param {string} provider - 社群平台 (google, facebook, discord, twitter)
 * @param {function} router - Vue Router 實例
 * @param {object} toast - PrimeVue toast 實例
 * @param {boolean} usePopup - 是否使用彈窗方式，默認true
 * @returns {Promise} OAuth 登入結果
 */
export const handleOAuthLogin = async (
  provider,
  router,
  toast,
  usePopup = true,
) => {
  try {
    // 構建 OAuth URL
    let baseUrl = import.meta.env.VITE_API_URL

    // 如果環境變數為空或未定義，使用當前域名（開發環境使用 Vite 代理）
    if (!baseUrl || baseUrl.trim() === '') {
      baseUrl = window.location.origin
    }

    const oauthUrl = `${baseUrl}/api/users/auth/${provider}`

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
const handlePopupOAuth = (oauthUrl, provider, _router, _toast) => {
  return new Promise((resolve, reject) => {
    // 彈窗設定
    const popup = window.open(
      oauthUrl,
      `${provider}_oauth`,
      'width=500,height=600,scrollbars=yes,resizable=yes',
    )

    if (!popup) {
      const error = new Error('無法開啟彈窗，請確認瀏覽器允許彈窗')
      reject(error)
      return
    }

    // 監聽消息
    const messageHandler = (event) => {
      // 驗證消息來源（生產環境中應該更嚴格）
      if (event.origin !== window.location.origin && event.origin !== '*') {
        console.warn('收到來自未知來源的消息:', event.origin)
        return
      }

      const { type, data, error } = event.data

      switch (type) {
        case 'oauth_success':
          cleanup()
          resolve({ success: true, data, needsUsername: false })
          break

        case 'oauth_needs_username':
          cleanup()
          resolve({ success: true, data, needsUsername: true })
          break

        case 'oauth_error':
          console.error('OAuth登入失敗:', error)
          cleanup()
          reject(new Error(error || 'OAuth登入失敗'))
          break

        default:
      }
    }

    // 定時檢查彈窗是否被關閉
    const checkClosed = setInterval(() => {
      if (popup.closed) {
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

  // 直接重定向到 OAuth URL
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
const handleOAuthSuccess = async (token, userStore, toast, _router) => {
  try {
    // 暫時儲存 token
    localStorage.setItem('temp_oauth_token', token)

    // 使用 token 獲取用戶資訊
    const baseUrl =
      window.__VITE_API_URL__ ||
      import.meta.env.VITE_API_URL ||
      'https://api.memedam.com'

    const response = await fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('獲取用戶資訊失敗')
    }

    const userData = await response.json()

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
          profile: route.query.profile
            ? JSON.parse(decodeURIComponent(route.query.profile))
            : null,
          userData: route.query.user
            ? JSON.parse(decodeURIComponent(route.query.user))
            : null,
        }

        localStorage.setItem('oauth_callback_data', JSON.stringify(oauthData))
        router.replace('/login')
        return
      }

      await handleOAuthSuccess(token, userStore, toast, router)

      // 獲取保存的返回路徑
      const returnPath = localStorage.getItem('oauth_return_path') || '/'

      // 清除保存的狀態
      localStorage.removeItem('oauth_return_path')
      localStorage.removeItem('oauth_provider')

      // 確保用戶狀態已完全同步後再跳轉
      if (userStore.isLoggedIn) {
        // 清除 URL 參數並跳轉到目標頁面
        router
          .replace({ path: returnPath, query: {} })
          .then(() => {})
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
export const handleStoredOAuthSuccess = async (userStore, toast, _router) => {
  try {
    const storedData = localStorage.getItem('oauth_success_data')
    if (!storedData) return false

    const { token, user, userId } = JSON.parse(storedData)
    localStorage.removeItem('oauth_success_data')

    // 登入用戶
    userStore.login({
      ...user,
      token,
      userId,
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

/**
 * 優化 OAuth 流程中的資源載入
 * 防止在 OAuth 流程中載入不必要的資源導致流程中斷
 */
export const optimizeOAuthResourceLoading = () => {
  // 檢查是否在 OAuth 流程中
  const urlParams = new URLSearchParams(window.location.search)
  const hasOAuthParams =
    urlParams.get('code') ||
    urlParams.get('state') ||
    urlParams.get('provider') ||
    urlParams.get('error') ||
    urlParams.get('success') !== null

  if (hasOAuthParams) {
    // 延遲載入非關鍵資源
    setTimeout(() => {
      // 延遲載入 webmanifest
      const manifestLink = document.querySelector('link[rel="manifest"]')
      if (manifestLink && !manifestLink.href.includes('data:')) {
        const currentHref = manifestLink.href
        manifestLink.remove()
        const newLink = document.createElement('link')
        newLink.rel = 'manifest'
        newLink.href = currentHref
        newLink.crossOrigin = 'anonymous'
        document.head.appendChild(newLink)
      }

      // 延遲載入其他非關鍵資源
      const nonCriticalLinks = document.querySelectorAll(
        'link[rel="preconnect"]',
      )
      nonCriticalLinks.forEach((link) => {
        if (
          link.href.includes('fonts.googleapis.com') ||
          link.href.includes('fonts.gstatic.com')
        ) {
          // 重新載入字體資源
          const currentHref = link.href
          link.remove()
          const newLink = document.createElement('link')
          newLink.rel = 'preconnect'
          newLink.href = currentHref
          newLink.crossOrigin = 'anonymous'
          document.head.appendChild(newLink)
        }
      })
    }, 2000)
  }
}
