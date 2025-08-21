<template>
  <div
    :class="[containerClass, gradientClass, hoverEffectClass]"
    :style="adminPreviewStyle"
    ref="containerRef"
  >
    <div class="w-full h-full flex items-center justify-center p-4">
      <div
        class="w-full h-full flex items-center justify-center"
        :style="dynamicTextStyle"
      >
        <h3
          class="text-white! font-bold leading-tight break-words"
          :class="[textAlignClass, dynamicTextClass]"
        >
          {{ displayText }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'random',
    validator: (value) =>
      [
        'default',
        'warm',
        'cool',
        'bright',
        'dark',
        'pastel',
        'random',
      ].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  textAlign: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
  showShadow: {
    type: Boolean,
    default: true,
  },
  hoverEffect: {
    type: Boolean,
    default: true,
  },
  // 管理頁預覽模式：固定 64x64 並縮小字級、關閉 hover
  adminPreview: {
    type: Boolean,
    default: false,
  },
  // 自動調整文字大小
  autoResize: {
    type: Boolean,
    default: true,
  },
})

const containerRef = ref(null)
const fontSize = ref(16)

const containerClass = computed(() => {
  // 管理頁小尺寸預覽盒
  if (props.adminPreview) {
    // 固定 64x64，較小 padding，避免陰影過重
    return 'w-16 h-16 flex items-center justify-center rounded-lg shadow text-center overflow-hidden'
  }
  // 一般卡片樣式（適應父容器尺寸）
  return 'w-full h-full flex items-center justify-center rounded-lg shadow-lg text-center transition-all duration-300'
})

const gradientClass = computed(() => {
  // 管理頁預覽改用純色背景，不用漸層
  if (props.adminPreview) return ''
  const variants = {
    default: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    warm: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
    cool: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    bright: 'bg-gradient-to-r from-pink-500 to-violet-500',
    dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
    pastel: 'bg-gradient-to-r from-pink-300 to-purple-300',
  }

  if (props.variant === 'random') {
    const variantKeys = Object.keys(variants).filter((key) => key !== 'random')
    const randomVariant =
      variantKeys[Math.floor(Math.random() * variantKeys.length)]
    return variants[randomVariant]
  }

  return variants[props.variant]
})

const titleClass = computed(() => {
  if (props.adminPreview) return 'text-2xl leading-none'
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  }
  return `${sizeClasses[props.size]} text-white`
})

const textAlignClass = computed(() => {
  switch (props.textAlign) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
})

const hoverEffectClass = computed(() => {
  // 管理頁預覽時關閉 hover 效果
  if (props.adminPreview || !props.hoverEffect) return ''
  return 'hover:transform hover:-translate-y-1 hover:shadow-xl'
})

// 僅顯示首字（管理頁預覽）
const displayText = computed(() => {
  if (!props.adminPreview) return props.title
  const t = (props.title || '').trim()
  return t ? t[0] : ''
})

// 動態文字樣式
const dynamicTextClass = computed(() => {
  if (!props.autoResize || props.adminPreview) {
    return titleClass.value
  }
  return 'text-white'
})

const dynamicTextStyle = computed(() => {
  if (!props.autoResize || props.adminPreview) {
    return {}
  }
  return {
    fontSize: `${fontSize.value}px`,
    lineHeight: '1.1',
    maxWidth: '100%',
    wordBreak: 'break-word',
    hyphens: 'auto',
    textAlign: 'center',
  }
})

// 自動調整文字大小
const adjustTextSize = async () => {
  if (!props.autoResize || props.adminPreview || !containerRef.value) {
    return
  }

  await nextTick()

  const container = containerRef.value
  const textElement = container.querySelector('h3')

  if (!textElement) return

  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width - 16 // 減去 padding
  const containerHeight = containerRect.height - 16 // 減去 padding

  // 初始字體大小 - 根據容器比例調整
  const aspectRatio = containerWidth / containerHeight
  let currentSize

  if (aspectRatio > 1.5) {
    // 寬容器，以寬度為準
    currentSize = containerWidth / 8
  } else if (aspectRatio < 0.7) {
    // 高容器，以高度為準
    currentSize = containerHeight / 2
  } else {
    // 接近正方形，取較小值
    currentSize = Math.min(containerWidth / 10, containerHeight / 3)
  }

  currentSize = Math.max(currentSize, 12) // 最小字體大小
  currentSize = Math.min(currentSize, 48) // 最大字體大小

  textElement.style.fontSize = `${currentSize}px`

  // 檢查文字是否超出容器
  const checkOverflow = () => {
    const textWidth = textElement.scrollWidth
    const textHeight = textElement.scrollHeight

    return textWidth > containerWidth || textHeight > containerHeight
  }

  // 逐步縮小字體直到文字完全適應容器
  while (checkOverflow() && currentSize > 12) {
    currentSize -= 0.5 // 更精細的調整
    textElement.style.fontSize = `${currentSize}px`
  }

  fontSize.value = currentSize
}

// 隨機背景色（管理頁預覽）
const previewBg = ref('')
const randomColor = () => {
  const colors = [
    '#FF5733',
    '#33B5E5',
    '#2ECC71',
    '#9B59B6',
    '#F39C12',
    '#E91E63',
    '#009688',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 監聽容器大小變化
let resizeObserver = null

onMounted(async () => {
  if (props.adminPreview) {
    previewBg.value = randomColor()
  }

  if (props.autoResize && !props.adminPreview) {
    await nextTick()
    adjustTextSize()

    // 設置 ResizeObserver 監聽容器大小變化
    if (window.ResizeObserver && containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        adjustTextSize()
      })
      resizeObserver.observe(containerRef.value)
    }
  }
})

// 監聽標題變化
watch(
  () => props.title,
  () => {
    if (props.autoResize && !props.adminPreview) {
      nextTick(() => {
        adjustTextSize()
      })
    }
  },
)

// 清理 ResizeObserver
const cleanup = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

// 組件卸載時清理
onUnmounted(() => {
  cleanup()
})

const adminPreviewStyle = computed(() => {
  if (!props.adminPreview) return {}
  return {
    width: '64px',
    height: '64px',
    backgroundColor: previewBg.value || '#6B7280',
    color: '#ffffff',
  }
})
</script>

<style scoped>
/* 自定義動畫效果 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 文字選擇時的樣式 */
.text-white {
  user-select: text;
}

/* 確保文字在各種背景下都清晰可見 */
.text-white {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 文字自動調整相關樣式 */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 確保容器內的文字完全居中 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

/* 確保文字迷因卡片適應父容器 */
.w-full.h-full {
  width: 100% !important;
  height: 100% !important;
}

/* 文字容器樣式 */
.text-white {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
</style>
