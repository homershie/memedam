/**
 * 贊助驗證工具
 * 用於驗證贊助交易的真實性和有效性
 */

// 贊助驗證狀態
const SPONSOR_VALIDATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
  PENDING: 'pending',
  ERROR: 'error',
}

/**
 * 驗證贊助交易
 * @param {string} transactionId - 交易ID
 * @returns {Promise<Object>} 驗證結果
 */
export const validateSponsorTransaction = async (transactionId) => {
  if (!transactionId) {
    return {
      status: SPONSOR_VALIDATION_STATUS.INVALID,
      message: '缺少交易ID',
      data: null,
    }
  }

  try {
    // 呼叫 API 驗證交易
    const response = await fetch(`/api/sponsors/transaction/${transactionId}`)

    if (!response.ok) {
      return {
        status: SPONSOR_VALIDATION_STATUS.INVALID,
        message: '交易不存在或驗證失敗',
        data: null,
      }
    }

    const result = await response.json()

    if (!result.success || !result.data) {
      return {
        status: SPONSOR_VALIDATION_STATUS.INVALID,
        message: result.error || '交易驗證失敗',
        data: null,
      }
    }

    const sponsorData = result.data

    // 檢查交易狀態
    if (sponsorData.status !== 'success') {
      return {
        status: SPONSOR_VALIDATION_STATUS.PENDING,
        message: '贊助尚未完成',
        data: sponsorData,
      }
    }

    // 檢查交易時間（防止過期訪問）
    const transactionTime = new Date(sponsorData.createdAt)
    const now = new Date()
    const timeDiff = now - transactionTime
    const maxAge = 24 * 60 * 60 * 1000 // 24小時

    if (timeDiff > maxAge) {
      return {
        status: SPONSOR_VALIDATION_STATUS.INVALID,
        message: '贊助記錄已過期',
        data: sponsorData,
      }
    }

    return {
      status: SPONSOR_VALIDATION_STATUS.VALID,
      message: '驗證成功',
      data: sponsorData,
    }
  } catch (error) {
    console.error('驗證贊助交易時發生錯誤:', error)
    return {
      status: SPONSOR_VALIDATION_STATUS.ERROR,
      message: '驗證過程中發生錯誤',
      data: null,
    }
  }
}

/**
 * 檢查是否為有效的贊助成功頁面訪問
 * @param {string} transactionId - 交易ID
 * @returns {Promise<boolean>} 是否有效
 */
export const isValidSponsorSuccessAccess = async (transactionId) => {
  const validation = await validateSponsorTransaction(transactionId)
  return validation.status === SPONSOR_VALIDATION_STATUS.VALID
}

/**
 * 取得贊助驗證狀態
 * @param {string} transactionId - 交易ID
 * @returns {Promise<Object>} 驗證狀態和資料
 */
export const getSponsorValidationStatus = async (transactionId) => {
  return await validateSponsorTransaction(transactionId)
}

/**
 * 記錄贊助頁面訪問
 * @param {string} pageType - 頁面類型 ('success' | 'error')
 * @param {string} transactionId - 交易ID（可選）
 * @param {string} message - 錯誤訊息（可選）
 */
export const logSponsorPageAccess = async (
  pageType,
  transactionId = null,
  message = null,
) => {
  const logData = {
    pageType,
    transactionId,
    message,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  }

  console.log('贊助頁面訪問記錄:', logData)

  try {
    // 發送到後端記錄
    await fetch('/api/sponsors/log-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    })
  } catch (error) {
    console.error('記錄贊助頁面訪問失敗:', error)
    // 靜默處理錯誤，不影響主要功能
  }
}

export { SPONSOR_VALIDATION_STATUS }
