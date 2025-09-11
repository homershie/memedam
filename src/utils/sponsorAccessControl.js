import sponsorService from '@/services/sponsorService'

/**
 * 檢查用戶是否有有效的贊助記錄
 * @param {Object} userStore - 用戶狀態管理
 * @returns {Promise<{hasSponsor: boolean, sponsorData: Object|null, error: string|null}>}
 */
export async function checkUserSponsorStatus(userStore) {
  try {
    // 檢查用戶是否已登入
    if (!userStore.isLoggedIn) {
      return {
        hasSponsor: false,
        sponsorData: null,
        error: '需要登入才能查看贊助相關頁面',
      }
    }

    // 調用API獲取用戶最近的贊助記錄
    const response = await sponsorService.getLatestSuccessSponsor()

    if (response.data.success && response.data.data) {
      const sponsor = response.data.data

      // 檢查贊助是否有效（例如：在過去30天內）
      const sponsorDate = new Date(sponsor.createdAt)
      const now = new Date()
      const daysDiff = (now - sponsorDate) / (1000 * 60 * 60 * 24)

      // 可以根據需要調整有效期限（這裡設為30天）
      const validPeriod = 30

      if (daysDiff <= validPeriod) {
        return {
          hasSponsor: true,
          sponsorData: sponsor,
          error: null,
        }
      } else {
        return {
          hasSponsor: false,
          sponsorData: sponsor,
          error: `您的贊助已過期（超過${validPeriod}天），請重新贊助以訪問相關頁面`,
        }
      }
    } else {
      return {
        hasSponsor: false,
        sponsorData: null,
        error: '您尚未進行任何贊助，請先贊助以訪問相關頁面',
      }
    }
  } catch (error) {
    console.error('檢查用戶贊助狀態失敗:', error)

    // 根據不同的錯誤狀態返回相應的錯誤訊息
    if (error?.response?.status === 401) {
      return {
        hasSponsor: false,
        sponsorData: null,
        error: '登入已過期，請重新登入',
      }
    } else if (error?.response?.status === 404) {
      return {
        hasSponsor: false,
        sponsorData: null,
        error: '您尚未進行任何贊助，請先贊助以訪問相關頁面',
      }
    } else {
      return {
        hasSponsor: false,
        sponsorData: null,
        error: '檢查贊助狀態時發生錯誤，請稍後再試',
      }
    }
  }
}

/**
 * 檢查特定路徑是否需要贊助權限
 * @param {string} path - 路由路徑
 * @returns {boolean}
 */
export function requiresSponsorAccess(path) {
  // 定義需要贊助權限的路徑
  const sponsorProtectedPaths = [
    // '/sponsor/success', // 放寬：允許登入後直接驗證
    // '/sponsor/thanks',  // 放寬：允許登入後進入檢查狀態
    // 可以根據需要添加更多路徑
  ]

  return sponsorProtectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath),
  )
}

/**
 * 獲取贊助相關的錯誤頁面URL
 * @param {string} errorMessage - 錯誤訊息
 * @param {string} redirectTo - 重定向目標（可選）
 * @returns {string}
 */
export function getSponsorErrorUrl(errorMessage, redirectTo = null) {
  const params = new URLSearchParams()
  params.set('message', errorMessage)

  if (redirectTo) {
    params.set('redirect', redirectTo)
  }

  return `/sponsor/error?${params.toString()}`
}

/**
 * 記錄贊助訪問嘗試
 * @param {string} path - 嘗試訪問的路徑
 * @param {string} reason - 訪問失敗的原因
 * @param {boolean} hasSponsor - 是否有贊助
 */
export async function logSponsorAccessAttempt(path, reason, hasSponsor) {
  try {
    await sponsorService.logPageAccess({
      pageType: 'sponsor_access_denied',
      message: `訪問被拒絕: ${path} - ${reason}`,
      hasSponsor,
      attemptedPath: path,
    })
  } catch (error) {
    console.error('記錄贊助訪問嘗試失敗:', error)
  }
}
