/**
 * 贊助系統錯誤處理工具
 * 統一處理贊助相關的錯誤和數據格式
 */

// 錯誤類型定義
export const SPONSOR_ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  NETWORK_ERROR: 'network_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHORIZATION_ERROR: 'authorization_error',
  NOT_FOUND_ERROR: 'not_found_error',
  SERVER_ERROR: 'server_error',
  UNKNOWN_ERROR: 'unknown_error',
}

// 錯誤嚴重程度
export const SPONSOR_ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

/**
 * 解析 API 錯誤回應
 * @param {Object} error - 錯誤物件
 * @returns {Object} 標準化的錯誤資訊
 */
export const parseSponsorError = (error) => {
  // 網路錯誤
  if (!error.response) {
    return {
      type: SPONSOR_ERROR_TYPES.NETWORK_ERROR,
      severity: SPONSOR_ERROR_SEVERITY.MEDIUM,
      message: '網路連線錯誤，請檢查您的網路連線',
      details: error.message,
      code: 'NETWORK_ERROR',
    }
  }

  const { status, data } = error.response
  const errorData = data || {}

  // 根據 HTTP 狀態碼分類錯誤
  switch (status) {
    case 400:
      return {
        type: SPONSOR_ERROR_TYPES.VALIDATION_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.LOW,
        message: errorData.error || '請求參數錯誤',
        details: errorData.details || errorData.message,
        code: 'VALIDATION_ERROR',
        validationErrors: errorData.validationErrors,
      }

    case 401:
      return {
        type: SPONSOR_ERROR_TYPES.AUTHENTICATION_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.MEDIUM,
        message: '未授權，請重新登入',
        details: errorData.error || 'Authentication required',
        code: 'AUTHENTICATION_ERROR',
      }

    case 403:
      return {
        type: SPONSOR_ERROR_TYPES.AUTHORIZATION_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.MEDIUM,
        message: '權限不足',
        details: errorData.error || 'Insufficient permissions',
        code: 'AUTHORIZATION_ERROR',
      }

    case 404:
      return {
        type: SPONSOR_ERROR_TYPES.NOT_FOUND_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.LOW,
        message: '找不到請求的資源',
        details: errorData.error || 'Resource not found',
        code: 'NOT_FOUND_ERROR',
      }

    case 409:
      return {
        type: SPONSOR_ERROR_TYPES.VALIDATION_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.MEDIUM,
        message: '資料衝突，請檢查是否重複',
        details: errorData.error || 'Data conflict',
        code: 'CONFLICT_ERROR',
      }

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: SPONSOR_ERROR_TYPES.SERVER_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.HIGH,
        message: '伺服器錯誤，請稍後再試',
        details: errorData.error || 'Internal server error',
        code: 'SERVER_ERROR',
      }

    default:
      return {
        type: SPONSOR_ERROR_TYPES.UNKNOWN_ERROR,
        severity: SPONSOR_ERROR_SEVERITY.MEDIUM,
        message: '發生未知錯誤',
        details: errorData.error || error.message,
        code: 'UNKNOWN_ERROR',
      }
  }
}

/**
 * 格式化贊助數據
 * @param {Object} sponsorData - 原始贊助數據
 * @returns {Object} 格式化後的贊助數據
 */
export const formatSponsorData = (sponsorData) => {
  if (!sponsorData) return null

  return {
    // 基本資訊
    id: sponsorData._id || sponsorData.id,
    transactionId: sponsorData.transaction_id,
    kofiTransactionId: sponsorData.kofi_transaction_id,

    // 金額資訊
    amount: sponsorData.amount,
    amountOriginal: sponsorData.amount_original,
    amountUsd: sponsorData.amount_usd,
    amountTwd: sponsorData.amount_twd,
    currency: sponsorData.currency,
    currencyOriginal: sponsorData.currency_original,

    // 用戶資訊
    userId: sponsorData.user_id?._id || sponsorData.user_id,
    userNickname: sponsorData.user_id?.nickname,
    userAvatar: sponsorData.user_id?.avatar,

    // Ko-fi 資訊
    fromName: sponsorData.from_name,
    displayName: sponsorData.display_name,
    email: sponsorData.email,
    discordUsername: sponsorData.discord_username,
    discordUserid: sponsorData.discord_userid,

    // 贊助等級和權益
    sponsorLevel: sponsorData.sponsor_level,
    badgeEarned: sponsorData.badge_earned,

    // 訊息資訊
    message: sponsorData.message,
    messageOriginal: sponsorData.message_original,
    messageReviewed: sponsorData.message_reviewed,
    messageAutoFiltered: sponsorData.message_auto_filtered,
    messageFilterReason: sponsorData.message_filter_reason,
    messageFilterSeverity: sponsorData.message_filter_severity,
    requiresManualReview: sponsorData.requires_manual_review,

    // Shop Items 資訊
    shopItems: sponsorData.shop_items,
    shopItemsParsed: sponsorData.shop_items_parsed,
    shopItemsMerged: sponsorData.shop_items_merged,
    shopItemsQuantity: sponsorData.shop_items_quantity,
    shopItemsTotalAmount: sponsorData.shop_items_total_amount,
    shopItemsMergeRule: sponsorData.shop_items_merge_rule,

    // 狀態和時間
    status: sponsorData.status,
    paymentMethod: sponsorData.payment_method,
    createdAt: sponsorData.createdAt,
    updatedAt: sponsorData.updatedAt,
    processedAt: sponsorData.processed_at,

    // 匯率資訊
    exchangeRate: sponsorData.exchange_rate,
    exchangeRateUsed: sponsorData.exchange_rate_used,

    // 其他資訊
    isPublic: sponsorData.is_public,
    directLinkCode: sponsorData.direct_link_code,
    type: sponsorData.type,
    shipping: sponsorData.shipping,
    createdIp: sponsorData.created_ip,
    messageId: sponsorData.message_id,
  }
}

/**
 * 格式化貨幣顯示
 * @param {number} amount - 金額
 * @param {string} currency - 幣別
 * @returns {string} 格式化後的貨幣字串
 */
export const formatCurrency = (amount, currency = 'TWD') => {
  if (!amount && amount !== 0) return 'N/A'

  const currencySymbols = {
    TWD: 'NT$',
    USD: 'US$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    HKD: 'HK$',
    KRW: '₩',
    THB: '฿',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    MYR: 'RM',
    CAD: 'C$',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || currency
  return `${symbol} ${amount}`
}

/**
 * 格式化日期顯示
 * @param {string|Date} date - 日期
 * @param {Object} options - 格式化選項
 * @returns {string} 格式化後的日期字串
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A'

  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  return new Date(date).toLocaleString('zh-TW', defaultOptions)
}

/**
 * 取得贊助等級顯示名稱
 * @param {string} level - 贊助等級代碼
 * @returns {string} 顯示名稱
 */
export const getSponsorLevelName = (level) => {
  const levelNames = {
    soy: '豆漿贊助',
    chicken: '雞肉贊助',
    coffee: '咖啡贊助',
  }

  return levelNames[level] || level
}

/**
 * 取得支付方式顯示名稱
 * @param {string} method - 支付方式代碼
 * @returns {string} 顯示名稱
 */
export const getPaymentMethodName = (method) => {
  const methodNames = {
    'ko-fi': 'Ko-fi',
    ko_fi: 'Ko-fi',
    credit_card: '信用卡',
    paypal: 'PayPal',
    linepay: 'LINE Pay',
    stripe: 'Stripe',
  }

  return methodNames[method] || method
}

/**
 * 檢查是否應該顯示留言
 * @param {Object} sponsorData - 贊助數據
 * @returns {boolean} 是否應該顯示留言
 */
export const shouldShowMessage = (sponsorData) => {
  if (!sponsorData) return false

  const sponsorLevel = sponsorData.sponsor_level
  const amount = sponsorData.amount

  // 雞肉等級以上或金額 >= 60 顯示留言
  return sponsorLevel === 'chicken' || sponsorLevel === 'coffee' || amount >= 60
}

/**
 * 檢查是否應該顯示徽章
 * @param {Object} sponsorData - 贊助數據
 * @returns {boolean} 是否應該顯示徽章
 */
export const shouldShowBadge = (sponsorData) => {
  if (!sponsorData) return false

  const sponsorLevel = sponsorData.sponsor_level
  const amount = sponsorData.amount
  const badgeEarned = sponsorData.badge_earned

  // 咖啡等級或金額 >= 150 或已獲得徽章
  return sponsorLevel === 'coffee' || amount >= 150 || badgeEarned
}

/**
 * 取得錯誤處理建議
 * @param {Object} error - 錯誤資訊
 * @returns {string} 處理建議
 */
export const getErrorHandlingSuggestion = (error) => {
  switch (error.type) {
    case SPONSOR_ERROR_TYPES.NETWORK_ERROR:
      return '請檢查您的網路連線，或稍後再試'

    case SPONSOR_ERROR_TYPES.VALIDATION_ERROR:
      return '請檢查輸入的資料是否正確'

    case SPONSOR_ERROR_TYPES.AUTHENTICATION_ERROR:
      return '請重新登入後再試'

    case SPONSOR_ERROR_TYPES.AUTHORIZATION_ERROR:
      return '您沒有權限執行此操作'

    case SPONSOR_ERROR_TYPES.NOT_FOUND_ERROR:
      return '找不到相關資料，請確認連結是否正確'

    case SPONSOR_ERROR_TYPES.SERVER_ERROR:
      return '伺服器暫時無法處理請求，請稍後再試'

    default:
      return '請稍後再試，或聯繫客服協助'
  }
}
