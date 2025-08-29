/**
 * Slugify 工具函數
 * 將文字轉換為 URL 友善的 slug 格式
 */

/**
 * 將文字轉換為 slug
 * @param {string} text - 要轉換的文字
 * @param {Object} options - 選項
 * @param {number} options.maxLength - 最大長度（預設 80）
 * @param {boolean} options.lowercase - 是否轉小寫（預設 true）
 * @returns {string} slug
 */
export function slugify(text, options = {}) {
  const { maxLength = 80, lowercase = true } = options

  if (!text) return ''

  let slug = text
    .toString()
    .normalize('NFD') // 分解組合字元
    .replace(/[\u0300-\u036f]/g, '') // 移除變音符號
    .replace(/[^\w\s-]/g, '') // 移除非字母數字、空白、連字號
    .replace(/[\s_]+/g, '-') // 空白和底線轉連字號
    .replace(/--+/g, '-') // 多個連字號合併為一個
    .replace(/^-+|-+$/g, '') // 移除開頭結尾的連字號

  if (lowercase) {
    slug = slug.toLowerCase()
  }

  // 限制長度
  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength).replace(/-+$/, '')
  }

  // 確保長度至少 3 個字元
  if (slug.length < 3) {
    return ''
  }

  return slug
}

/**
 * 檢查 slug 是否為保留字
 * @param {string} slug - 要檢查的 slug
 * @returns {boolean} 是否為保留字
 */
export function isReservedSlug(slug) {
  const reserved = [
    'new',
    'edit',
    'search',
    'api',
    'admin',
    'login',
    'register',
    'logout',
    'settings',
    'profile',
    'dashboard',
    'about',
    'contact',
    'privacy',
    'terms',
    'help',
    'support',
    'faq',
    'all',
    'popular',
    'trending',
    'random',
    'latest',
    'hot',
    'top',
    'best',
    'worst',
    'feed',
    'home',
    'index',
    'page',
    'post',
    'create',
    'update',
    'delete',
    'remove',
    'add',
    'upload',
    'download',
    'export',
    'import',
    'share',
    'like',
    'comment',
    'reply',
    'report',
    'flag',
    'block',
    'unblock',
    'follow',
    'unfollow',
    'subscribe',
    'unsubscribe',
  ]

  return reserved.includes(slug.toLowerCase())
}

/**
 * 驗證 slug 格式
 * @param {string} slug - 要驗證的 slug
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateSlug(slug) {
  if (!slug) {
    return { valid: false, error: 'Slug 不能為空' }
  }

  if (slug.length < 3) {
    return { valid: false, error: 'Slug 至少需要 3 個字元' }
  }

  if (slug.length > 80) {
    return { valid: false, error: 'Slug 不能超過 80 個字元' }
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, error: 'Slug 只能包含小寫字母、數字和連字號' }
  }

  if (/^-|-$/.test(slug)) {
    return { valid: false, error: 'Slug 不能以連字號開頭或結尾' }
  }

  if (/--/.test(slug)) {
    return { valid: false, error: 'Slug 不能包含連續的連字號' }
  }

  if (isReservedSlug(slug)) {
    return { valid: false, error: '此 Slug 為保留字，請選擇其他名稱' }
  }

  return { valid: true }
}

/**
 * 生成建議的 slug（當發生衝突時）
 * @param {string} baseSlug - 基礎 slug
 * @param {number} suffix - 後綴數字
 * @returns {string} 新的 slug
 */
export function generateAlternativeSlug(baseSlug, suffix = 1) {
  // 移除既有的數字後綴
  const cleanSlug = baseSlug.replace(/-\d+$/, '')
  return `${cleanSlug}-${suffix}`
}

/**
 * 從標題生成 slug
 * @param {string} title - 標題
 * @returns {string} slug
 */
export function generateSlugFromTitle(title) {
  if (!title) return ''

  // 中文標題的特殊處理
  // 如果標題全是中文，嘗試使用拼音或直接使用隨機字串
  if (/^[\u4e00-\u9fa5]+$/.test(title.trim())) {
    // 這裡簡單處理，實際專案可能需要拼音轉換庫
    // 暫時返回空字串，讓使用者手動輸入
    return ''
  }

  return slugify(title, { maxLength: 60 })
}

export default {
  slugify,
  isReservedSlug,
  validateSlug,
  generateAlternativeSlug,
  generateSlugFromTitle,
}