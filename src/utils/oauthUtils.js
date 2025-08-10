import { useUserStore } from '@/stores/userStore'

/**
 * OAuth 登入處理函數（重定向方式）
 * @param {string} provider - 社群平台 (google, facebook, discord, twitter)
 * @param {function} router - Vue Router 實例
 * @param {object} toast - PrimeVue toast 實例
 * @returns {Promise} OAuth 登入結果
 */
export const handleOAuthLogin = async (provider, router, toast) => {
  try {
    console.log(`開始 ${provider} OAuth 登入流程（重定向方式）`)
    
    // 保存當前頁面狀態，登入完成後可以回到原頁面
    localStorage.setItem('oauth_return_path', router.currentRoute.value.fullPath)
    localStorage.setItem('oauth_provider', provider)
    
    // 構建 OAuth URL
    let baseUrl = import.meta.env.VITE_API_URL
    
    // 如果環境變數為空或未定義，使用當前域名（開發環境使用 Vite 代理）
    if (!baseUrl || baseUrl.trim() === '') {
      baseUrl = window.location.origin
    }
    
    const oauthUrl = `${baseUrl}/api/users/auth/${provider}`
    console.log(`OAuth URL: ${oauthUrl}`)
    
    // 直接重定向到 OAuth URL
    console.log('開始重定向到 OAuth 提供者...')
    window.location.href = oauthUrl
    
    // 返回 Promise（雖然實際上頁面會重定向）
    return Promise.resolve()
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
const handleOAuthSuccess = async (
  token,
  userStore,
  toast,
  router,
) => {
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
    
    const response = await fetch(
      `${baseUrl}/api/users/me`,
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

    console.log('獲取用戶資訊成功:', userData.user?.username)

    // 登入用戶
    userStore.login({
      ...userData.user,
      token: token,
    })

    // 清除臨時 token
    localStorage.removeItem('temp_oauth_token')

    toast.add({
      severity: 'success',
      summary: '登入成功',
      detail: '歡迎回來！',
      life: 3000,
    })

    console.log('用戶登入處理完成')
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

  console.log('處理 OAuth 回調，token:', token ? token.substring(0, 20) + '...' : '無', 'error:', error)

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'OAuth 登入失敗',
      detail: `授權失敗: ${error}`,
      life: 5000,
    })
    
    // 清除 URL 參數並回到登入頁
    router.replace({ path: '/login', query: {} })
    return
  }

  if (token) {
    try {
      await handleOAuthSuccess(token, userStore, toast, router)
      
      // 獲取保存的返回路徑
      const returnPath = localStorage.getItem('oauth_return_path') || '/'
      const provider = localStorage.getItem('oauth_provider')
      
      // 清除保存的狀態
      localStorage.removeItem('oauth_return_path')
      localStorage.removeItem('oauth_provider')
      
      console.log(`${provider} OAuth 登入成功，跳轉到:`, returnPath)
      
      // 清除 URL 參數並跳轉到目標頁面
      router.replace({ path: returnPath, query: {} }).then(() => {
        console.log('OAuth 回調處理完成，跳轉成功')
      }).catch((routerError) => {
        console.error('路由跳轉失敗:', routerError)
        // 如果跳轉失敗，回到首頁
        router.replace('/')
      })
    } catch (error) {
      console.error('OAuth 回調處理失敗:', error)
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: error.message || 'OAuth 登入過程中發生錯誤',
        life: 5000,
      })
      
      // 清除 URL 參數並回到登入頁
      router.replace({ path: '/login', query: {} })
    }
  }
}
