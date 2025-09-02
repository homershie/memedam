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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  console.log('路由守衛檢查:', {
    to: to.path,
    from: from.path,
    isLoggedIn: userStore.isLoggedIn,
    token: userStore.token ? userStore.token.substring(0, 20) + '...' : '無',
    requiresLogin: to.meta?.login === true,
    requiresAdmin: to.meta?.admin === true,
    isAdmin: userStore.isAdmin,
  })

  // 檢查是否需要登入
  if (to.meta?.login === true && !userStore.isLoggedIn) {
    console.log('需要登入但未登入，重定向到登入頁面')
    next('/login')
    return
  }

  // 檢查是否需要管理員權限
  if (to.meta?.admin === true && !userStore.isAdmin) {
    console.log('需要管理員權限但沒有權限，重定向到首頁')
    next('/')
    return
  }

  // 贊助成功頁面驗證
  if (to.path === '/sponsor/success') {
    const transactionId = to.query.transaction_id

    // 記錄訪問嘗試
    logSponsorPageAccess('success', transactionId)

    if (!transactionId) {
      console.log('贊助成功頁面缺少交易ID，重定向到贊助頁面')
      next('/donate')
      return
    }

    try {
      // 使用驗證工具驗證交易
      const validation = await validateSponsorTransaction(transactionId)

      switch (validation.status) {
        case SPONSOR_VALIDATION_STATUS.VALID:
          console.log('贊助成功頁面驗證通過')
          break

        case SPONSOR_VALIDATION_STATUS.PENDING:
          console.log('贊助尚未完成，重定向到錯誤頁面')
          next(
            `/sponsor/error?message=${encodeURIComponent(validation.message)}`,
          )
          return

        case SPONSOR_VALIDATION_STATUS.INVALID:
          console.log('交易驗證失敗，重定向到贊助頁面')
          next('/donate')
          return

        case SPONSOR_VALIDATION_STATUS.ERROR:
          console.log('驗證過程中發生錯誤，重定向到贊助頁面')
          next('/donate')
          return

        default:
          console.log('未知驗證狀態，重定向到贊助頁面')
          next('/donate')
          return
      }
    } catch (error) {
      console.error('驗證贊助交易時發生錯誤:', error)
      next('/donate')
      return
    }
  }

  // 贊助錯誤頁面驗證
  if (to.path === '/sponsor/error') {
    const message = to.query.message
    logSponsorPageAccess('error', null, message)
    console.log('訪問贊助錯誤頁面')
  }

  // 其他情況正常通過
  console.log('路由守衛通過')
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

console.log(routes)

export default router
