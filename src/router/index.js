import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '@/stores/userStore'
import { setPageMeta, cleanUrlParams } from '@/utils/seoUtils'
import {
  validateSponsorTransaction,
  logSponsorPageAccess,
  SPONSOR_VALIDATION_STATUS,
} from '@/utils/sponsorValidation'
import {
  checkUserSponsorStatus,
  requiresSponsorAccess,
  getSponsorErrorUrl,
  logSponsorAccessAttempt,
} from '@/utils/sponsorAccessControl'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 檢查是否需要登入
  if (to.meta?.login === true && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 檢查是否需要管理員權限
  if (to.meta?.admin === true && !userStore.isAdmin) {
    next('/')
    return
  }

  // 檢查是否需要贊助權限
  if (to.meta?.requiresSponsor === true || requiresSponsorAccess(to.path)) {
    const sponsorCheck = await checkUserSponsorStatus(userStore)

    if (!sponsorCheck.hasSponsor) {
      // 記錄訪問嘗試
      await logSponsorAccessAttempt(to.path, sponsorCheck.error, false)

      // 如果用戶未登入，重定向到錯誤頁面並提供登入選項
      if (!userStore.isLoggedIn) {
        const errorUrl = getSponsorErrorUrl(sponsorCheck.error, to.fullPath)
        next(errorUrl)
        return
      }

      // 如果用戶已登入但沒有贊助記錄
      if (sponsorCheck.error.includes('尚未進行任何贊助')) {
        // 如果是訪問 success 頁面，重定向到錯誤頁面讓用戶知道需要先贊助
        if (to.path === '/sponsor/success') {
          const errorUrl = getSponsorErrorUrl(sponsorCheck.error, to.fullPath)
          next(errorUrl)
          return
        }
        // 其他頁面直接跳轉到贊助頁面
        next('/donate')
        return
      }

      // 其他情況（如贊助過期），重定向到錯誤頁面
      const errorUrl = getSponsorErrorUrl(sponsorCheck.error, to.fullPath)
      next(errorUrl)
      return
    }
  }

  // 贊助成功頁面驗證
  if (to.path === '/sponsor/success') {
    const transactionId = to.query.transaction_id

    // 記錄訪問嘗試
    logSponsorPageAccess('success', transactionId)

    if (!transactionId) {
      next(
        `/sponsor/error?message=${encodeURIComponent('缺少交易資訊，無法載入贊助詳情')}`,
      )
      return
    }

    try {
      // 使用驗證工具驗證交易
      const validation = await validateSponsorTransaction(transactionId)

      switch (validation.status) {
        case SPONSOR_VALIDATION_STATUS.VALID:
          break

        case SPONSOR_VALIDATION_STATUS.PENDING:
          next(
            `/sponsor/error?message=${encodeURIComponent(validation.message)}`,
          )
          return

        case SPONSOR_VALIDATION_STATUS.INVALID:
          next(
            `/sponsor/error?message=${encodeURIComponent(validation.message || '交易驗證失敗')}`,
          )
          return

        case SPONSOR_VALIDATION_STATUS.ERROR:
          next(
            `/sponsor/error?message=${encodeURIComponent(validation.message || '驗證過程中發生錯誤')}`,
          )
          return

        default:
          next(`/sponsor/error?message=${encodeURIComponent('未知的驗證狀態')}`)
          return
      }
    } catch (error) {
      console.error('驗證贊助交易時發生錯誤:', error)
      next(
        `/sponsor/error?message=${encodeURIComponent(error.message || '驗證過程中發生錯誤')}`,
      )
      return
    }
  }

  // 贊助錯誤頁面驗證
  if (to.path === '/sponsor/error') {
    const message = to.query.message
    logSponsorPageAccess('error', null, message)
  }

  // 其他情況正常通過
  next()
})

router.afterEach((to) => {
  const baseTitle = '迷因典 MemeDam'
  const pageTitle =
    to.meta && to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  document.title = pageTitle

  // 根據當前路由自動設定 canonical 與基本 Open Graph
  try {
    const rawQuery = to.query || {}
    const cleaned = cleanUrlParams(rawQuery)

    // 使用當前網域作為 canonical，避免強制重新導向
    const currentOrigin = window.location.origin
    const url = new URL(currentOrigin + to.path)
    const searchParams = new URLSearchParams()
    Object.keys(cleaned).forEach((key) => {
      const value = cleaned[key]
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v))
        } else {
          searchParams.set(key, value)
        }
      }
    })

    const canonical = searchParams.toString()
      ? `${url.origin}${url.pathname}?${searchParams.toString()}`
      : `${url.origin}${url.pathname}`

    // 特定頁面標記 noindex：使用者頁、個人化列表、OAuth、帳務頁等
    const noindexPaths = new Set([
      '/login',
      '/reset-password',
      '/forgot-password',
      '/oauth-callback',
      '/settings',
      '/admin',
      '/memes/liked',
      '/users', // 使用者個人頁避免薄內容索引
    ])

    const robotsMeta = [...noindexPaths].some((p) => to.path.startsWith(p))
      ? 'noindex,follow'
      : 'index,follow' // 明確設定允許索引

    setPageMeta({
      title: to.meta?.title || baseTitle,
      description: to.meta?.description,
      canonical,
      robots: robotsMeta,
      openGraph: {
        title: pageTitle,
        description: to.meta?.description,
        url: canonical,
        image: `${currentOrigin}/favicon/apple-touch-icon.png`,
      },
    })
  } catch {
    // 靜默處理 SEO 設定錯誤，避免影響導航
  }
})

export default router
