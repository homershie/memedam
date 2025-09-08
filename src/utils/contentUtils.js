// 內容處理工具函數
// 支援公告系統的富文本內容渲染和解析

/**
 * 從JSON內容中提取純文字
 * @param {Object|string} content - 內容（JSON物件或純文字）
 * @returns {string} 純文字內容
 */
export const extractTextFromJson = (content) => {
  if (!content || typeof content !== 'object') return String(content || '')

  let text = ''

  // 處理不同類型的JSON結構
  if (content.content && Array.isArray(content.content)) {
    // TipTap或其他富文本編輯器的格式
    text = content.content
      .filter(
        (node) =>
          node.type === 'text' ||
          node.type === 'paragraph' ||
          node.type === 'heading',
      )
      .map((node) => {
        if (node.type === 'text') {
          return node.text || ''
        }
        if (node.type === 'paragraph' && node.content) {
          return node.content
            .filter((child) => child.type === 'text')
            .map((child) => child.text || '')
            .join('')
        }
        if (node.type === 'heading' && node.content) {
          return node.content
            .filter((child) => child.type === 'text')
            .map((child) => child.text || '')
            .join('')
        }
        return ''
      })
      .join(' ')
  } else if (content.text) {
    // 簡單的文字節點
    text = content.text
  } else if (typeof content === 'string') {
    // 如果JSON內容實際上是字串
    text = content
  }

  return text.trim()
}

/**
 * 渲染JSON格式的內容為HTML（參考 detail 頁面的 TipTap 渲染邏輯）
 * @param {Object|string} content - 內容（JSON物件或純文字）
 * @param {string} format - 內容格式 ('plain' | 'json')
 * @returns {string} HTML字串
 */
export const renderContentToHtml = (content, format = 'plain') => {
  if (!content) return ''

  if (format === 'json' && typeof content === 'object') {
    return renderJsonToHtml(content)
  }

  // 純文字格式，轉換換行符
  return String(content).replace(/\n/g, '<br>')
}

/**
 * 將JSON內容渲染為HTML（參考 detail 頁面的實現）
 * @param {Object} jsonContent - JSON內容物件
 * @returns {string} HTML字串
 */
const renderJsonToHtml = (jsonContent) => {
  if (!jsonContent || typeof jsonContent !== 'object') return ''

  if (jsonContent.content && Array.isArray(jsonContent.content)) {
    return jsonContent.content
      .map((node) => {
        switch (node.type) {
          case 'paragraph':
            const text = node.content
              ? node.content
                  .map((child) => {
                    if (child.type === 'text') {
                      let childText = child.text || ''

                      // 處理標記（參考 detail 頁面的邏輯）
                      if (child.marks) {
                        child.marks.forEach((mark) => {
                          switch (mark.type) {
                            case 'bold':
                              childText = `<strong>${childText}</strong>`
                              break
                            case 'italic':
                              childText = `<em>${childText}</em>`
                              break
                            case 'underline':
                              childText = `<u>${childText}</u>`
                              break
                            case 'strike':
                              childText = `<del>${childText}</del>`
                              break
                            case 'code':
                              childText = `<code class="bg-surface-100 text-surface-800 p-1 rounded-md dark:bg-surface-900 dark:text-surface-300 font-mono">${childText}</code>`
                              break
                            case 'link': {
                              const { href, target, rel } = mark.attrs || {}
                              childText = `<a href="${href}" target="${target || '_blank'}" rel="${rel || 'noopener noreferrer'}" class="decoration-0 cursor-pointer font-medium text-surface-800 transition-all p-1 dark:text-surface-300 hover:text-primary-500 underline">${childText}</a>`
                              break
                            }
                          }
                        })
                      }

                      return childText
                    }
                    return child.text || ''
                  })
                  .join('')
              : ''
            return `<p>${text}</p>`

          case 'heading':
            const level = node.attrs?.level || 1
            const headingText = node.content
              ? node.content
                  .map((child) => {
                    if (child.type === 'text') {
                      let childText = child.text || ''

                      // 處理標記
                      if (child.marks) {
                        child.marks.forEach((mark) => {
                          switch (mark.type) {
                            case 'bold':
                              childText = `<strong>${childText}</strong>`
                              break
                            case 'italic':
                              childText = `<em>${childText}</em>`
                              break
                          }
                        })
                      }

                      return childText
                    }
                    return child.text || ''
                  })
                  .join('')
              : ''
            return `<h${level}>${headingText}</h${level}>`

          case 'bulletList':
            const bulletItems = node.content
              ? node.content
                  .map((item) => {
                    const itemText = item.content
                      ? item.content
                          .map((child) => {
                            if (child.type === 'paragraph') {
                              return child.content
                                ? child.content
                                    .map((paraChild) => {
                                      if (paraChild.type === 'text') {
                                        let paraText = paraChild.text || ''

                                        // 處理標記
                                        if (paraChild.marks) {
                                          paraChild.marks.forEach((mark) => {
                                            switch (mark.type) {
                                              case 'bold':
                                                paraText = `<strong>${paraText}</strong>`
                                                break
                                              case 'italic':
                                                paraText = `<em>${paraText}</em>`
                                                break
                                            }
                                          })
                                        }

                                        return paraText
                                      }
                                      return paraChild.text || ''
                                    })
                                    .join('')
                                : ''
                            }
                            return child.text || ''
                          })
                          .join('')
                      : ''
                    return `<li>${itemText}</li>`
                  })
                  .join('')
              : ''
            return `<ul>${bulletItems}</ul>`

          case 'orderedList':
            const orderedItems = node.content
              ? node.content
                  .map((item) => {
                    const itemText = item.content
                      ? item.content
                          .map((child) => {
                            if (child.type === 'paragraph') {
                              return child.content
                                ? child.content
                                    .map((paraChild) => {
                                      if (paraChild.type === 'text') {
                                        let paraText = paraChild.text || ''

                                        // 處理標記
                                        if (paraChild.marks) {
                                          paraChild.marks.forEach((mark) => {
                                            switch (mark.type) {
                                              case 'bold':
                                                paraText = `<strong>${paraText}</strong>`
                                                break
                                              case 'italic':
                                                paraText = `<em>${paraText}</em>`
                                                break
                                            }
                                          })
                                        }

                                        return paraText
                                      }
                                      return paraChild.text || ''
                                    })
                                    .join('')
                                : ''
                            }
                            return child.text || ''
                          })
                          .join('')
                      : ''
                    return `<li>${itemText}</li>`
                  })
                  .join('')
              : ''
            return `<ol>${orderedItems}</ol>`

          case 'blockquote':
            const quoteText = node.content
              ? node.content
                  .map((child) => {
                    if (child.type === 'paragraph') {
                      return child.content
                        ? child.content
                            .map((paraChild) => {
                              if (paraChild.type === 'text') {
                                let paraText = paraChild.text || ''

                                // 處理標記
                                if (paraChild.marks) {
                                  paraChild.marks.forEach((mark) => {
                                    switch (mark.type) {
                                      case 'bold':
                                        paraText = `<strong>${paraText}</strong>`
                                        break
                                      case 'italic':
                                        paraText = `<em>${paraText}</em>`
                                        break
                                    }
                                  })
                                }

                                return paraText
                              }
                              return paraChild.text || ''
                            })
                            .join('')
                        : ''
                    }
                    return child.text || ''
                  })
                  .join('')
              : ''
            return `<blockquote class="border-l-4 border-primary-500 pl-4 italic">${quoteText}</blockquote>`

          case 'horizontalRule':
            return '<hr class="my-4 border-t border-surface-300 dark:border-surface-600">'

          case 'hardBreak':
            return '<br />'

          case 'text':
            let text = node.text || ''

            // 處理標記
            if (node.marks) {
              node.marks.forEach((mark) => {
                switch (mark.type) {
                  case 'bold':
                    text = `<strong>${text}</strong>`
                    break
                  case 'italic':
                    text = `<em>${text}</em>`
                    break
                  case 'underline':
                    text = `<u>${text}</u>`
                    break
                  case 'strike':
                    text = `<del>${text}</del>`
                    break
                  case 'code':
                    text = `<code class="bg-surface-100 text-surface-800 p-1 rounded-md dark:bg-surface-900 dark:text-surface-300 font-mono">${text}</code>`
                    break
                  case 'link': {
                    const { href, target, rel } = mark.attrs || {}
                    text = `<a href="${href}" target="${target || '_blank'}" rel="${rel || 'noopener noreferrer'}" class="decoration-0 cursor-pointer font-medium text-surface-800 transition-all p-1 dark:text-surface-300 hover:text-primary-500 underline">${text}</a>`
                    break
                  }
                }
              })
            }

            return text

          default:
            return ''
        }
      })
      .join('')
  }

  return JSON.stringify(jsonContent)
}

/**
 * 截斷內容文字
 * @param {Object|string} content - 內容
 * @param {string} format - 內容格式（可選，會自動判斷）
 * @param {number} maxLength - 最大長度
 * @returns {string} 截斷後的文字
 */
export const truncateContent = (content, format, maxLength = 60) => {
  if (!content) return ''

  // 如果沒有提供 format，自動判斷
  let actualFormat = format
  if (!actualFormat) {
    actualFormat =
      typeof content === 'object' && content !== null ? 'json' : 'plain'
  }

  const plainText =
    actualFormat === 'json' ? extractTextFromJson(content) : String(content)

  // 移除HTML標籤（如果有的話）
  const cleanText = plainText.replace(/<[^>]*>/g, '')

  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + '...'
    : cleanText
}

/**
 * 驗證內容格式
 * @param {Object|string} content - 內容
 * @param {string} format - 內容格式
 * @returns {boolean} 是否有效
 */
export const validateContent = (content, format = 'plain') => {
  if (!content) return false

  if (format === 'plain') {
    return typeof content === 'string' && content.trim().length > 0
  }

  if (format === 'json') {
    return typeof content === 'object' && content !== null
  }

  return false
}

/**
 * 獲取內容統計資訊
 * @param {Object|string} content - 內容
 * @param {string} format - 內容格式
 * @returns {Object} 統計資訊
 */
export const getContentStats = (content, format = 'plain') => {
  const plainText =
    format === 'json' ? extractTextFromJson(content) : String(content || '')

  return {
    characters: plainText.length,
    words: plainText.trim() ? plainText.trim().split(/\s+/).length : 0,
    lines: plainText.split('\n').length,
    format: format,
  }
}
