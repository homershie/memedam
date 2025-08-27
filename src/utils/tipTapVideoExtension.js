import { Node, mergeAttributes } from '@tiptap/core'
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
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="video-embed"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title, width, height } = HTMLAttributes

    if (!src) {
      return [
        'div',
        { 'data-type': 'video-embed', class: 'video-embed-placeholder' },
        '影片嵌入',
      ]
    }

    // 檢查是否為外部影片 URL
    if (isExternalVideoUrl(src)) {
      const embedUrl = getEmbedUrl(src)
      return [
        'div',
        { 'data-type': 'video-embed', class: 'video-embed-container' },
        [
          'iframe',
          mergeAttributes(HTMLAttributes, {
            src: embedUrl,
            title: title || '嵌入影片',
            width: width,
            height: height,
            frameborder: '0',
            allowfullscreen: true,
            loading: 'lazy',
            class: 'video-embed-iframe',
          }),
        ],
      ]
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
