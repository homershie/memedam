/**
 * @提及相關工具函數
 */

/**
 * 解析文本中的@提及
 * @param {string} text - 要解析的文本
 * @returns {Array} 提及列表
 */
export function parseMentions(text) {
  if (!text) return []

  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      start: match.index,
      end: match.index + match[0].length,
      fullMatch: match[0],
    })
  }

  return mentions
}

/**
 * 提取文本中的@用戶名列表
 * @param {string} text - 要解析的文本
 * @returns {Array} 用戶名列表（去重）
 */
export function extractMentionedUsernames(text) {
  const mentions = parseMentions(text)
  const usernames = mentions.map((mention) => mention.username)
  return [...new Set(usernames)] // 去重
}

/**
 * 將@提及轉換為HTML格式
 * @param {string} text - 原始文本
 * @param {Function} userLinkGenerator - 生成用戶連結的函數
 * @returns {string} 包含HTML的文本
 */
export function convertMentionsToHTML(text, userLinkGenerator = null) {
  if (!text) return ''

  let html = text

  // 解析提及
  const mentions = parseMentions(text)

  // 從後往前替換，避免位置偏移
  for (let i = mentions.length - 1; i >= 0; i--) {
    const mention = mentions[i]
    const username = mention.username

    let replacement = `<span class="mention" data-username="${username}">@${username}</span>`

    // 如果提供了連結生成器，則生成連結
    if (userLinkGenerator) {
      const userLink = userLinkGenerator(username)
      if (userLink) {
        replacement = `<a href="${userLink}" class="mention-link" data-username="${username}">@${username}</a>`
      }
    }

    html =
      html.substring(0, mention.start) +
      replacement +
      html.substring(mention.end)
  }

  return html
}

/**
 * 檢查文本是否包含@提及
 * @param {string} text - 要檢查的文本
 * @returns {boolean} 是否包含提及
 */
export function hasMentions(text) {
  if (!text) return false
  return /@\w+/.test(text)
}

/**
 * 驗證@提及的用戶名是否有效
 * @param {string} username - 用戶名
 * @returns {boolean} 是否有效
 */
export function isValidMentionUsername(username) {
  if (!username) return false

  // 基本驗證規則
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 格式化@提及顯示
 * @param {string} text - 原始文本
 * @param {Array} users - 用戶信息數組
 * @returns {string} 格式化後的文本
 */
export function formatMentions(text, users = []) {
  if (!text) return ''

  let formatted = text

  // 創建用戶名到顯示名的映射
  const userMap = {}
  users.forEach((user) => {
    userMap[user.username] = user.displayName || user.username
  })

  // 解析提及並替換
  const mentions = parseMentions(text)

  for (let i = mentions.length - 1; i >= 0; i--) {
    const mention = mentions[i]
    const username = mention.username
    const displayName = userMap[username] || username

    const replacement = `@${displayName}`
    formatted =
      formatted.substring(0, mention.start) +
      replacement +
      formatted.substring(mention.end)
  }

  return formatted
}

/**
 * 獲取@提及的統計信息
 * @param {string} text - 要分析的文本
 * @returns {Object} 統計信息
 */
export function getMentionStats(text) {
  if (!text) {
    return {
      totalMentions: 0,
      uniqueMentions: 0,
      mentionRate: 0,
    }
  }

  const mentions = parseMentions(text)
  const uniqueUsernames = extractMentionedUsernames(text)

  return {
    totalMentions: mentions.length,
    uniqueMentions: uniqueUsernames.length,
    mentionRate: text.length > 0 ? (mentions.length / text.length) * 100 : 0,
  }
}

/**
 * 清理無效的@提及
 * @param {string} text - 原始文本
 * @param {Array} validUsernames - 有效的用戶名列表
 * @returns {string} 清理後的文本
 */
export function cleanInvalidMentions(text, validUsernames = []) {
  if (!text) return ''

  const mentions = parseMentions(text)
  let cleaned = text

  // 從後往前替換
  for (let i = mentions.length - 1; i >= 0; i--) {
    const mention = mentions[i]
    const username = mention.username

    // 檢查用戶名是否有效
    if (!validUsernames.includes(username)) {
      // 移除@符號，保留用戶名
      cleaned =
        cleaned.substring(0, mention.start) +
        username +
        cleaned.substring(mention.end)
    }
  }

  return cleaned
}

/**
 * 生成@提及的通知文本
 * @param {string} originalText - 原始文本
 * @param {number} maxLength - 最大長度
 * @returns {string} 通知文本
 */
export function generateMentionNotificationText(originalText, maxLength = 100) {
  if (!originalText) return ''

  // 移除@提及，只保留純文本
  let cleanText = originalText.replace(/@\w+/g, '')

  // 清理多餘的空格
  cleanText = cleanText.replace(/\s+/g, ' ').trim()

  // 截斷到指定長度
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength - 3) + '...'
  }

  return cleanText
}

/**
 * 檢查文本中的@提及是否包含當前用戶
 * @param {string} text - 要檢查的文本
 * @param {string} currentUsername - 當前用戶名
 * @returns {boolean} 是否提及當前用戶
 */
export function isCurrentUserMentioned(text, currentUsername) {
  if (!text || !currentUsername) return false

  const mentionedUsernames = extractMentionedUsernames(text)
  return mentionedUsernames.includes(currentUsername)
}

/**
 * 獲取@提及的用戶列表（用於後端處理）
 * @param {string} text - 文本內容
 * @returns {Array} 用戶名列表
 */
export function getMentionedUsers(text) {
  return extractMentionedUsernames(text)
}