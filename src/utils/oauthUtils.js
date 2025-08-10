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
    console.log(`開始 ${provider} OAuth 登入流程`)
    
    // 1. 計算彈出視窗位置
    const width = 500
    const height = 600
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2

    const oauthUrl = `${import.meta.env.VITE_API_URL}/api/users/auth/${provider}`
    console.log(`OAuth URL: ${oauthUrl}`)

    // 2. 開啟 OAuth 授權彈出視窗
    const popup = window.open(
      oauthUrl,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=no`,
    )

    if (!popup) {
      console.error('彈出視窗被瀏覽器阻擋')
      throw new Error('彈出視窗被阻擋，請允許彈出視窗並重試')
    }
    
    console.log('彈出視窗成功開啟，開始監聽...')

    // 3. 監聽彈出視窗關閉和消息
    return new Promise((resolve, reject) => {
      let isResolved = false

      // 監聽來自彈出視窗的消息
      const messageHandler = (event) => {
        console.log('收到 postMessage:', event.data, 'from origin:', event.origin)
        
        // 檢查消息類型而不是來源，因為 OAuth 重定向可能來自不同域名
        if (!event.data || typeof event.data !== 'object') {
          console.log('忽略非對象類型的消息:', event.data)
          return
        }

        if (event.data.type === 'oauth_success') {
          if (isResolved) {
            console.log('OAuth 已經處理過，忽略重複消息')
            return
          }
          isResolved = true

          console.log('收到 OAuth 成功消息，開始處理登入')

          // 移除消息監聽器
          window.removeEventListener('message', messageHandler)
          clearInterval(checkClosed)

          // 處理 OAuth 成功
          handleOAuthSuccess(event.data.token, userStore, toast, router)
            .then(() => {
              console.log('OAuth 處理完成，開始跳轉')
              // 使用 Vue Router 進行跳轉
              router.push('/').then(() => {
                console.log('頁面跳轉成功')
                resolve()
              }).catch((error) => {
                console.error('路由跳轉失敗:', error)
                // 如果 router.push 失敗，則使用 window.location.href
                window.location.href = '/'
                resolve()
              })
            })
            .catch(reject)
        } else if (event.data.type === 'oauth_error') {
          if (isResolved) {
            console.log('OAuth 已經處理過，忽略重複錯誤消息')
            return
          }
          isResolved = true

          console.log('收到 OAuth 錯誤消息:', event.data.error)

          // 移除消息監聽器
          window.removeEventListener('message', messageHandler)
          clearInterval(checkClosed)

          reject(new Error(`OAuth 授權失敗: ${event.data.error}`))
        }
      }

      // 添加消息監聽器
      window.addEventListener('message', messageHandler)

      const checkClosed = setInterval(() => {
        try {
          // 檢查視窗是否真的關閉
          if (popup.closed) {
            console.log('檢測到彈出視窗關閉')
            if (isResolved) {
              console.log('OAuth 已經處理過，忽略視窗關閉')
              return
            }
            isResolved = true

            clearInterval(checkClosed)
            window.removeEventListener('message', messageHandler)
            console.log('用戶取消了授權或視窗意外關閉')
            reject(new Error('用戶取消了授權'))
            return
          }

          // 檢查是否回到我們的域名（表示授權完成）
          try {
            const currentUrl = popup.location.href
            console.log('檢查彈出視窗當前 URL:', currentUrl)

            if (currentUrl.includes(window.location.origin) || currentUrl.includes('/oauth-callback')) {
              if (isResolved) {
                console.log('OAuth 已經處理過，忽略 URL 檢查')
                return
              }
              isResolved = true

              console.log('檢測到回調 URL，解析參數')

              // 解析 URL 參數
              const url = new URL(currentUrl)
              const token = url.searchParams.get('token')
              const error = url.searchParams.get('error')

              clearInterval(checkClosed)
              window.removeEventListener('message', messageHandler)

              // 立即關閉小視窗
              popup.close()

              if (error) {
                console.log('從 URL 檢測到錯誤:', error)
                reject(new Error(`OAuth 授權失敗: ${error}`))
              } else if (token) {
                console.log('從 URL 獲取到 token，開始處理登入')
                // 4. 使用 token 獲取用戶資訊並登入
                handleOAuthSuccess(token, userStore, toast, router)
                  .then(() => {
                    console.log('OAuth 處理完成，開始跳轉')
                    // 使用 Vue Router 進行跳轉
                    router.push('/').then(() => {
                      console.log('頁面跳轉成功')
                      resolve()
                    }).catch((error) => {
                      console.error('路由跳轉失敗:', error)
                      // 如果 router.push 失敗，則使用 window.location.href
                      window.location.href = '/'
                      resolve()
                    })
                  })
                  .catch(reject)
              } else {
                console.log('未在 URL 中找到 token 或 error')
                reject(new Error('未收到有效的授權 token'))
              }
            }
          } catch (urlError) {
            // 跨域錯誤是正常的，表示還在外部域名進行授權
            console.log('無法訪問彈出視窗 URL (跨域限制)，繼續等待...')
          }
        } catch (generalError) {
          console.error('檢查彈出視窗時發生錯誤:', generalError)
          // 跨域錯誤是正常的，繼續檢查
          if (popup.closed) {
            if (isResolved) return
            isResolved = true

            clearInterval(checkClosed)
            window.removeEventListener('message', messageHandler)
            console.log('用戶取消了授權')
            reject(new Error('用戶取消了授權'))
          }
        }
      }, 1000) // 增加檢查間隔到 1 秒，給 OAuth 流程更多時間

      // 設定超時（5分鐘）
      setTimeout(() => {
        if (isResolved) return
        isResolved = true

        clearInterval(checkClosed)
        window.removeEventListener('message', messageHandler)
        if (!popup.closed) {
          popup.close()
        }
        reject(new Error('OAuth 授權超時，請重試'))
      }, 300000) // 5分鐘超時
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
 * 處理 OAuth 回調（用於首頁）
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
    // 清除 URL 參數
    router.replace({ query: {} })
    return
  }

  if (token) {
    try {
      await handleOAuthSuccess(token, userStore, toast, router)
      
      // 成功後跳轉到首頁
      router.push('/').then(() => {
        console.log('OAuth 回調處理完成，跳轉成功')
        // 清除 URL 參數
        router.replace({ query: {} })
      }).catch((routerError) => {
        console.error('路由跳轉失敗:', routerError)
        // 如果 router.push 失敗，則使用 window.location.href
        window.location.href = '/'
      })
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
