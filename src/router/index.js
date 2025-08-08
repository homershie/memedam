import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 檢查是否需要登入
  if (to.meta?.login === true && !userStore.isLoggedIn) {
    // 需要登入但未登入，重定向到登入頁面
    next('/login')
    return
  }

  // 檢查是否需要管理員權限
  if (to.meta?.admin === true && !userStore.isAdmin) {
    // 需要管理員權限但沒有權限，重定向到首頁
    next('/')
    return
  }

  // 其他情況正常通過
  next()
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' | 迷因典 MemeDam'
  } else {
    document.title = '迷因典 MemeDam'
  }
})

console.log(routes)

export default router
