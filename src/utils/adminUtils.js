import { useUserStore } from '@/stores/userStore'

/**
 * 檢查當前用戶是否為管理員
 * @returns {boolean} 是否為管理員
 */
export const isAdmin = () => {
  const userStore = useUserStore()
  return userStore.isAdmin
}

/**
 * 檢查當前用戶是否已登入
 * @returns {boolean} 是否已登入
 */
export const isLoggedIn = () => {
  const userStore = useUserStore()
  return userStore.isLoggedIn
}

/**
 * 導航守衛：檢查管理員權限
 * @param {Function} next - 導航函數
 * @param {string} redirectPath - 重定向路徑，默認為首頁
 */
export const requireAdmin = (next, redirectPath = '/') => {
  if (!isAdmin()) {
    console.warn('需要管理員權限，重定向到:', redirectPath)
    next(redirectPath)
    return false
  }
  return true
}

/**
 * 導航守衛：檢查登入狀態
 * @param {Function} next - 導航函數
 * @param {string} redirectPath - 重定向路徑，默認為登入頁
 */
export const requireAuth = (next, redirectPath = '/login') => {
  if (!isLoggedIn()) {
    console.warn('需要登入，重定向到:', redirectPath)
    next(redirectPath)
    return false
  }
  return true
}

/**
 * 管理員權限檢查中間件
 * 用於組件內的權限檢查
 */
export const useAdminGuard = () => {
  const userStore = useUserStore()
  
  const checkAdminAccess = () => {
    if (!userStore.isAdmin) {
      throw new Error('需要管理員權限')
    }
  }
  
  const hasAdminAccess = () => {
    return userStore.isAdmin
  }
  
  return {
    checkAdminAccess,
    hasAdminAccess,
    isAdmin: userStore.isAdmin,
    isLoggedIn: userStore.isLoggedIn
  }
}

/**
 * 獲取用戶角色顯示名稱
 * @param {string} role - 用戶角色
 * @returns {string} 角色顯示名稱
 */
export const getRoleDisplayName = (role) => {
  const roleMap = {
    admin: '管理員',
    moderator: '版主',
    user: '一般用戶',
    guest: '訪客'
  }
  return roleMap[role] || '未知'
}

/**
 * 檢查用戶是否有特定權限
 * @param {string} permission - 權限名稱
 * @param {string} userRole - 用戶角色
 * @returns {boolean} 是否有權限
 */
export const hasPermission = (permission, userRole) => {
  const permissions = {
    admin: ['all'],
    moderator: ['edit_posts', 'delete_posts', 'manage_users'],
    user: ['create_posts', 'edit_own_posts'],
    guest: ['view_posts']
  }
  
  const userPermissions = permissions[userRole] || []
  return userPermissions.includes('all') || userPermissions.includes(permission)
}