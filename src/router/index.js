import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '@/stores/userStore'
import { setPageMeta, cleanUrlParams } from '@/utils/seoUtils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 路由守衛
router.beforeEach((to, from, next) => {
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

  // 其他情況正常通過
  console.log('路由守衛通過')
  next()
})

router.afterEach((to) => {
  const baseTitle = '迷因典 MemeDam'
  const pageTitle = to.meta && to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  document.title = pageTitle

  // 根據當前路由自動設定 canonical 與基本 Open Graph
  try {
    const rawQuery = to.query || {}
    const cleaned = cleanUrlParams(rawQuery)

    const url = new URL(window.location.origin + to.path)
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

    setPageMeta({
      title: to.meta?.title || baseTitle,
      description: undefined,
      canonical,
      openGraph: {
        title: pageTitle,
        description: undefined,
        url: canonical,
        image: `${window.location.origin}/favicon/apple-touch-icon.png`,
      },
    })
  } catch (e) {
    // 靜默處理 SEO 設定錯誤，避免影響導航
  }
})

console.log(routes)

export default router
