import { Node } from '@tiptap/core'
import { isExternalVideoUrl, getEmbedUrl } from './mediaUtils.js'

export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400px',
      },
      size: {
        default: 'm', // 's', 'm', 'l', 'full'
      },
      orientation: {
        default: 'landscape', // 'landscape', 'portrait'
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

  parseHTML() {
    return [
      {
        tag: 'div[data-type="video-embed"]',
      },
      {
        tag: 'iframe',
        getAttrs: (node) => {
          // 檢查是否為影片嵌入的 iframe
          if (
            node.src &&
            (node.src.includes('youtube.com/embed') ||
              node.src.includes('vimeo.com') ||
              node.src.includes('dailymotion.com'))
          ) {
            const attrs = {
              src: node.src,
              title: node.title || '嵌入影片',
              size: node.getAttribute('size') || 'm',
              orientation: node.getAttribute('orientation') || 'landscape',
              annotation: node.getAttribute('data-annotation') || '',
            }
            return attrs
          }
          return false
        },
      },
      {
        tag: 'div',
        getAttrs: (node) => {
          // 檢查是否為包含影片的 div
          const iframe = node.querySelector('iframe')
          if (
            iframe &&
            iframe.src &&
            (iframe.src.includes('youtube.com/embed') ||
              iframe.src.includes('vimeo.com') ||
              iframe.src.includes('dailymotion.com'))
          ) {
            const attrs = {
              src: iframe.src,
              title: iframe.title || '嵌入影片',
              size: iframe.getAttribute('size') || 'm',
              orientation: iframe.getAttribute('orientation') || 'landscape',
              annotation: iframe.getAttribute('data-annotation') || '',
            }
            return attrs
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title, size, orientation } = HTMLAttributes
    // 從 data-annotation 屬性中讀取註解
    const annotation = HTMLAttributes['data-annotation'] || ''

    if (!src) {
      return [
        'div',
        { 'data-type': 'video-embed', class: 'video-embed-placeholder' },
        '影片嵌入',
      ]
    }

    // 根據尺寸和方向設定樣式
    const getSizeStyles = (size, orientation) => {
      const landscapeMap = {
        s: { width: '480px', maxWidth: '480px' },
        m: { width: '640px', maxWidth: '640px' },
        l: { width: '960px', maxWidth: '960px' },
        full: { width: '100%', maxWidth: 'none' },
      }
      const portraitMap = {
        s: { width: '360px', maxWidth: '360px' },
        m: { width: '450px', maxWidth: '450px' },
        l: { width: '540px', maxWidth: '540px' },
        full: { width: '100%', maxWidth: 'none' },
      }
      const sizeMap = orientation === 'portrait' ? portraitMap : landscapeMap
      return sizeMap[size] || sizeMap.m
    }

    const sizeStyles = getSizeStyles(size, orientation)

    // 檢查是否為外部影片 URL
    if (isExternalVideoUrl(src)) {
      const embedUrl = getEmbedUrl(src)
      const result = [
        'div',
        {
          'data-type': 'video-embed',
          class: 'video-embed-wrapper',
          style: `width: ${sizeStyles.width}; max-width: ${sizeStyles.maxWidth}; margin: auto;`,
        },
        [
          'div',
          {
            'data-type': 'video-embed',
            class: 'video-embed-container',
          },
          [
            'iframe',
            {
              src: embedUrl,
              title: title || '嵌入影片',
              width: '100%',
              height: '100%',
              frameborder: '0',
              allowfullscreen: true,
              loading: 'lazy',
              class: 'video-embed-iframe',
              style: `aspect-ratio: ${orientation === 'portrait' ? '9/16' : '16/9'};`,
            },
          ],
        ],
        annotation ? ['div', { class: 'video-annotation' }, annotation] : null,
      ].filter(Boolean)

      return result
    }

    // 如果不是支援的外部影片，顯示錯誤訊息
    return [
      'div',
      { 'data-type': 'video-embed', class: 'video-embed-error' },
      '不支援的影片格式，請使用支援的影片平台連結。',
    ]
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
