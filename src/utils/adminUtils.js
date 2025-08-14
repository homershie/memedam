import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
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
    isLoggedIn: userStore.isLoggedIn,
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
    guest: '訪客',
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
    guest: ['view_posts'],
  }

  const userPermissions = permissions[userRole] || []
  return userPermissions.includes('all') || userPermissions.includes(permission)
}

/**
 * 統一的錯誤處理機制
 * @param {Error} error - 錯誤對象
 * @param {string} context - 錯誤上下文
 * @param {Object} options - 選項
 */
export const handleServiceError = (error, context = '', options = {}) => {
  const toast = useToast()
  const router = useRouter()
  const userStore = useUserStore()

  console.error(`${context} 服務錯誤:`, error)

  // 處理不同的錯誤狀態碼
  if (error.response?.status === 401) {
    // 重新登入
    userStore.logout()
    router.push('/login')
    toast.add({
      severity: 'error',
      summary: '登入過期',
      detail: '請重新登入',
      life: 3000,
    })
  } else if (error.response?.status === 403) {
    // 權限不足
    toast.add({
      severity: 'error',
      summary: '權限不足',
      detail: '您沒有權限執行此操作',
      life: 3000,
    })
  } else if (error.response?.status === 404) {
    // 資源不存在
    toast.add({
      severity: 'error',
      summary: '資源不存在',
      detail: '請求的資源不存在',
      life: 3000,
    })
  } else if (error.response?.status === 422) {
    // 驗證錯誤
    const errors = error.response.data?.errors || error.response.data?.error
    if (Array.isArray(errors)) {
      errors.forEach((err) => {
        toast.add({
          severity: 'error',
          summary: '驗證錯誤',
          detail: err.message || err,
          life: 3000,
        })
      })
    } else {
      toast.add({
        severity: 'error',
        summary: '驗證錯誤',
        detail: errors || '輸入資料有誤',
        life: 3000,
      })
    }
  } else if (error.response?.status >= 500) {
    // 伺服器錯誤
    toast.add({
      severity: 'error',
      summary: '伺服器錯誤',
      detail: '伺服器發生錯誤，請稍後重試',
      life: 3000,
    })
  } else {
    // 一般錯誤
    toast.add({
      severity: 'error',
      summary: `${context} 操作失敗`,
      detail: error.response?.data?.message || error.message || '請稍後重試',
      life: 3000,
    })
  }
}

/**
 * 處理API響應數據
 * @param {Object} response - API響應
 * @param {string} dataKey - 數據鍵名
 * @returns {Object} 處理後的數據
 */
export const processApiResponse = (response, dataKey = null) => {
  if (!response || !response.data) {
    return { data: [], total: 0 }
  }

  const data = response.data

  // 如果指定了數據鍵名，則從該鍵獲取數據
  if (dataKey && data[dataKey]) {
    return {
      data: data[dataKey],
      total: data.pagination?.total || data[dataKey].length,
      pagination: data.pagination,
    }
  }

  // 檢查是否為分頁格式
  if (data.memes || data.users || data.tags || data.reports) {
    const key = data.memes
      ? 'memes'
      : data.users
        ? 'users'
        : data.tags
          ? 'tags'
          : 'reports'
    return {
      data: data[key],
      total: data.pagination?.total || data[key].length,
      pagination: data.pagination,
    }
  }

  // 如果直接是陣列
  if (Array.isArray(data)) {
    return {
      data: data,
      total: data.length,
    }
  }

  // 其他情況
  return {
    data: data,
    total: 1,
  }
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} locale - 地區設定
 * @returns {string} 格式化後的日期
 */
export const formatDate = (date, locale = 'zh-TW') => {
  if (!date) return '-'

  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return '-'
  }
}

/**
 * 格式化數字
 * @param {number} num - 數字
 * @returns {string} 格式化後的數字
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }

  return num.toString()
}

/**
 * 下載CSV文件
 * @param {Blob} blob - 文件blob
 * @param {string} filename - 文件名
 */
export const downloadCSV = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 確認對話框
 * @param {string} message - 確認訊息
 * @param {string} title - 標題
 * @returns {Promise<boolean>} 用戶選擇
 */
export const confirmAction = (message, title = '確認') => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(`${title}\n${message}`)
    resolve(confirmed)
  })
}

/**
 * 防抖函數
 * @param {Function} func - 要防抖的函數
 * @param {number} wait - 等待時間
 * @returns {Function} 防抖後的函數
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 節流函數
 * @param {Function} func - 要節流的函數
 * @param {number} limit - 限制時間
 * @returns {Function} 節流後的函數
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷貝對象
 * @param {Object} obj - 要拷貝的對象
 * @returns {Object} 拷貝後的對象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map((item) => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 生成唯一ID
 * @param {number} length - ID長度
 * @returns {string} 唯一ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 驗證電子郵件格式
 * @param {string} email - 電子郵件
 * @returns {boolean} 是否有效
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 驗證URL格式
 * @param {string} url - URL
 * @returns {boolean} 是否有效
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
