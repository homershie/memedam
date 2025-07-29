/**
 * 檢查用戶是否已登入，未登入則顯示錯誤並跳轉到登入頁面
 */
export function requireLogin(userStore, toast) {
  if (!userStore.isLoggedIn) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請先登入',
      life: 3000,
    })
    // 跳轉到登入頁面
    window.location.href = '/login'
    return false
  }
  return true
}

/**
 * 檢查用戶權限
 */
export function hasPermission(userStore, meme) {
  const currentUserId = getId(userStore.userId)
  const authorId = getId(meme.author?._id || meme.author?.id)
  const role = userStore.role

  return (
    role === 'admin' ||
    (currentUserId && authorId && currentUserId === authorId)
  )
}

/**
 * 處理 MongoDB ObjectId 格式（本地版本，避免循環依賴）
 */
function getId(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.$oid) return val.$oid
  return val._id || val.id || ''
}
