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

  // 如果是字串，可能是舊的 markdown 格式，使用原本的處理方式
  if (typeof content === 'string') {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗體
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜體
      .replace(
        /`(.*?)`/g,
        '<code class="bg-surface-100 px-1 rounded">$1</code>',
      ) // 行內代碼
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>',
      ) // 三級標題
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>',
      ) // 二級標題
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>',
      ) // 一級標題
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>') // 無序列表
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>') // 有序列表
      .replace(/\n\n/g, '</p><p class="mt-4">') // 段落
      .replace(/^(.+)$/gm, '<p class="leading-relaxed">$1</p>') // 一般文字
  }

  // 如果是 TipTap JSON 格式
  if (
    typeof content === 'object' &&
    content.type === 'doc' &&
    content.content
  ) {
    return renderTipTapNodes(content.content)
  }

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
          case 'paragraph': {
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
            return `<p class="leading-relaxed mb-4">${text}</p>`
          }

          case 'heading': {
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

            // 根據標題級別添加適當的 CSS 類別
            let className = ''
            switch (level) {
              case 1:
                className = 'text-2xl font-bold mt-8 mb-4'
                break
              case 2:
                className = 'text-xl font-bold mt-6 mb-3'
                break
              case 3:
                className = 'text-lg font-bold mt-4 mb-2'
                break
              default:
                className = 'font-bold mt-4 mb-2'
            }

            return `<h${level} class="${className}">${headingText}</h${level}>`
          }

          case 'bulletList': {
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
                    return `<li class="ml-4 mb-2">${itemText}</li>`
                  })
                  .join('')
              : ''
            return `<ul class="mb-4">${bulletItems}</ul>`
          }

          case 'orderedList': {
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
                    return `<li class="ml-4 mb-2">${itemText}</li>`
                  })
                  .join('')
              : ''
            return `<ol class="mb-4">${orderedItems}</ol>`
          }

          case 'blockquote': {
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
          }

          case 'horizontalRule':
            return '<hr class="my-4 border-t border-surface-300 dark:border-surface-600">'

          case 'hardBreak':
            return '<br />'

          case 'text': {
            let nodeText = node.text || ''

            // 處理標記
            if (node.marks) {
              node.marks.forEach((mark) => {
                switch (mark.type) {
                  case 'bold':
                    nodeText = `<strong>${nodeText}</strong>`
                    break
                  case 'italic':
                    nodeText = `<em>${nodeText}</em>`
                    break
                  case 'underline':
                    nodeText = `<u>${nodeText}</u>`
                    break
                  case 'strike':
                    nodeText = `<del>${nodeText}</del>`
                    break
                  case 'code':
                    nodeText = `<code class="bg-surface-100 text-surface-800 p-1 rounded-md dark:bg-surface-900 dark:text-surface-300 font-mono">${nodeText}</code>`
                    break
                  case 'link': {
                    const { href, target, rel } = mark.attrs || {}
                    nodeText = `<a href="${href}" target="${target || '_blank'}" rel="${rel || 'noopener noreferrer'}" class="decoration-0 cursor-pointer font-medium text-surface-800 transition-all p-1 dark:text-surface-300 hover:text-primary-500 underline">${nodeText}</a>`
                    break
                  }
                }
              })
            }

            return nodeText
          }

          default:
            return ''
        }
      })
      .join('')
  }

  return JSON.stringify(jsonContent)
}

/**
 * 遞歸渲染 TipTap 節點（參考 [slug].vue 的實現）
 * @param {Array} nodes - TipTap 節點陣列
 * @returns {string} HTML字串
 */
const renderTipTapNodes = (nodes) => {
  if (!Array.isArray(nodes)) return ''

  return nodes
    .map((node) => {
      switch (node.type) {
        case 'paragraph':
          return `<p class="leading-relaxed mb-4">${renderTipTapMarks(node.content)}</p>`

        case 'heading': {
          const level = node.attrs?.level || 1
          let className = ''
          switch (level) {
            case 1:
              className = 'text-2xl font-bold mt-8 mb-4'
              break
            case 2:
              className = 'text-xl font-bold mt-6 mb-3'
              break
            case 3:
              className = 'text-lg font-bold mt-4 mb-2'
              break
            default:
              className = 'font-bold mt-4 mb-2'
          }
          return `<h${level} class="${className}">${renderTipTapMarks(node.content)}</h${level}>`
        }

        case 'image': {
          const {
            src,
            alt,
            annotation,
            size = 'm',
            orientation = 'landscape',
          } = node.attrs || {}

          // 根據尺寸和方向設定樣式
          const getSizeStyles = (size, orientation) => {
            const landscapeMap = {
              s: { width: '320px', maxWidth: '320px' },
              m: { width: '640px', maxWidth: '640px' },
              l: { width: '960px', maxWidth: '960px' },
              full: { width: '100%', maxWidth: '100%' },
            }
            const portraitMap = {
              s: { width: '240px', maxWidth: '240px' },
              m: { width: '480px', maxWidth: '480px' },
              l: { width: '720px', maxWidth: '720px' },
              full: { width: '100%', maxWidth: '100%' },
            }
            const sizeMap =
              orientation === 'portrait' ? portraitMap : landscapeMap
            return sizeMap[size] || sizeMap.m
          }

          const sizeStyles = getSizeStyles(size, orientation)
          const imageStyle =
            size === 'full'
              ? 'width: 100%; max-width: 100%; height: auto; display: block;'
              : `width: 100%; max-width: ${sizeStyles.maxWidth}; height: auto; display: block;`

          let imageHtml = `<div class="custom-image-wrapper" style="width: 100%; max-width: ${sizeStyles.maxWidth};"><img src="${src}" alt="${alt || ''}" class="custom-image" style="${imageStyle}" />`
          if (annotation) {
            imageHtml += `<p class="image-annotation">${annotation}</p>`
          }
          imageHtml += `</div>`
          return imageHtml
        }

        case 'videoEmbed': {
          const {
            src: videoSrc,
            size = 'm',
            orientation = 'landscape',
            annotation,
          } = node.attrs || {}

          if (videoSrc && isExternalVideoUrl(videoSrc)) {
            // 根據尺寸和方向設定樣式
            const getSizeStyles = (size, orientation) => {
              const landscapeMap = {
                s: { width: '100%', maxWidth: '480px' },
                m: { width: '100%', maxWidth: '640px' },
                l: { width: '100%', maxWidth: '960px' },
                full: { width: '100%', maxWidth: 'none' },
              }
              const portraitMap = {
                s: { width: '100%', maxWidth: '360px' },
                m: { width: '100%', maxWidth: '450px' },
                l: { width: '100%', maxWidth: '540px' },
                full: { width: '100%', maxWidth: 'none' },
              }
              const sizeMap =
                orientation === 'portrait' ? portraitMap : landscapeMap
              return sizeMap[size] || sizeMap.m
            }

            const sizeStyles = getSizeStyles(size, orientation)
            const aspectRatio = orientation === 'portrait' ? '9/16' : '16/9'

            let videoHtml = `<div class="video-embed-wrapper" style="width: 100%; max-width: ${sizeStyles.maxWidth};">
            <div class="video-embed-container">
            <iframe src="${getEmbedUrl(videoSrc)}"
                    class="video-embed-iframe"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style="aspect-ratio: ${aspectRatio};">
            </iframe>
          </div>`

            if (annotation) {
              videoHtml += `<p class="video-annotation">${annotation}</p>`
            }

            videoHtml += `</div>`
            return videoHtml
          }
          return ''
        }

        case 'bulletList':
          return `<ul>${renderTipTapNodes(node.content)}</ul>`

        case 'orderedList':
          return `<ol>${renderTipTapNodes(node.content)}</ol>`

        case 'listItem':
          return `<li>${renderTipTapMarks(node.content)}</li>`

        case 'blockquote':
          return `<blockquote class="border-l-4 border-primary-500 pl-4 italic">${renderTipTapMarks(node.content)}</blockquote>`

        case 'codeBlock':
          return `<pre class="bg-surface-100 dark:bg-surface-900 p-4 rounded-md overflow-x-auto mb-4"><code class="text-surface-800 dark:text-surface-300 font-mono text-sm">${node.content?.[0]?.text || ''}</code></pre>`

        case 'horizontalRule':
          return '<hr class="my-4 border-t border-surface-300 dark:border-surface-600">'

        default:
          return ''
      }
    })
    .join('')
}

/**
 * 渲染 TipTap 標記（參考 [slug].vue 的實現）
 * @param {Array} content - 內容陣列
 * @returns {string} HTML字串
 */
const renderTipTapMarks = (content) => {
  if (!Array.isArray(content)) return ''

  return content
    .map((item) => {
      if (item.type === 'text') {
        let text = item.text || ''

        // 處理標記
        if (item.marks) {
          item.marks.forEach((mark) => {
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
      }

      if (item.type === 'hardBreak') {
        return '<br />'
      }

      return ''
    })
    .join('')
}

/**
 * 檢查是否為外部影片 URL
 * @param {string} url - 影片URL
 * @returns {boolean} 是否為支援的影片平台
 */
const isExternalVideoUrl = (url) => {
  if (!url) return false
  const videoPatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
    /^https?:\/\/(www\.)?twitch\.tv\/[\w/]+/,
    /^https?:\/\/(www\.)?dailymotion\.com\/video\/[\w]+/,
    /^https?:\/\/(www\.)?bilibili\.com\/video\/[\w]+/,
  ]
  return videoPatterns.some((pattern) => pattern.test(url))
}

/**
 * 獲取影片嵌入 URL
 * @param {string} url - 原始影片URL
 * @returns {string} 嵌入URL
 */
const getEmbedUrl = (url) => {
  if (!url) return ''

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop()
    return `https://player.vimeo.com/video/${videoId}`
  }

  // Twitch
  if (url.includes('twitch.tv')) {
    const channel = url.split('/').pop()
    return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`
  }

  // Dailymotion
  if (url.includes('dailymotion.com')) {
    const videoId = url.split('/video/')[1]?.split('_')[0]
    return `https://www.dailymotion.com/embed/video/${videoId}`
  }

  // Bilibili
  if (url.includes('bilibili.com')) {
    const videoId = url.split('/video/')[1]?.split('/')[0]
    return `https://player.bilibili.com/player.html?bvid=${videoId}`
  }

  return url
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
