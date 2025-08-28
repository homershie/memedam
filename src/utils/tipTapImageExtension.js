import { Image } from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'
import { processImageUrl } from './imageUtils.js'

// 自定義 Image 擴展，支援尺寸、方向和註解屬性
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'm',
        parseHTML: (element) => element.getAttribute('data-size') || 'm',
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          }
        },
      },
      orientation: {
        default: 'landscape',
        parseHTML: (element) =>
          element.getAttribute('data-orientation') || 'landscape',
        renderHTML: (attributes) => {
          return {
            'data-orientation': attributes.orientation,
          }
        },
      },
      annotation: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-annotation') || '',
        renderHTML: (attributes) => {
          return {
            'data-annotation': attributes.annotation,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { src } = HTMLAttributes
    // 從 data- 屬性中讀取 size、orientation 和 annotation
    const size = HTMLAttributes['data-size'] || 'm'
    const orientation = HTMLAttributes['data-orientation'] || 'landscape'
    const annotation = HTMLAttributes['data-annotation'] || ''

    // 根據尺寸和方向設定樣式
    const getSizeStyles = (size, orientation) => {
      const landscapeMap = {
        s: { width: '100%', maxWidth: '320px' },
        m: { width: '100%', maxWidth: '640px' },
        l: { width: '100%', maxWidth: '960px' },
        full: { width: '100%', maxWidth: '100%' },
      }
      const portraitMap = {
        s: { width: '100%', maxWidth: '240px' },
        m: { width: '100%', maxWidth: '480px' },
        l: { width: '100%', maxWidth: '720px' },
        full: { width: '100%', maxWidth: '100%' },
      }
      const sizeMap = orientation === 'portrait' ? portraitMap : landscapeMap
      return sizeMap[size] || sizeMap.m
    }

    const sizeStyles = getSizeStyles(size, orientation)

    // 處理圖片 URL，根據尺寸和方向進行轉換
    const processedSrc = processImageUrl(src, size, orientation)

    // 根據尺寸設定不同的樣式，使用 !important 覆蓋 prose 樣式
    let imageStyle
    if (size === 'full') {
      // 滿版圖片：自適應容器寬度
      imageStyle = `width: 100% !important; max-width: 100% !important; height: auto !important; display: block !important;;`
    } else {
      // 響應式圖片：寬度自適應，最大寬度限制
      imageStyle = `width: 100% !important; max-width: ${sizeStyles.maxWidth} !important; height: auto !important; display: block !important;`
    }

    return [
      'div',
      { class: 'custom-image-wrapper' },
      [
        'img',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          src: processedSrc,
          style: imageStyle,
          loading: 'lazy',
          decoding: 'async',
          class: 'custom-image',
        }),
      ],
      annotation ? ['div', { class: 'image-annotation' }, annotation] : null,
    ].filter(Boolean)
  },
})
