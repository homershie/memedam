<template>
  <div
    :class="[containerClass, gradientClass, hoverEffectClass]"
    :style="adminPreviewStyle"
  >
    <div>
      <h3
        class="text-white!"
        :class="['font-bold', titleClass, textAlignClass]"
      >
        {{ displayText }}
      </h3>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

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
})

const containerClass = computed(() => {
  // 管理頁小尺寸預覽盒
  if (props.adminPreview) {
    // 固定 64x64，較小 padding，避免陰影過重
    return 'w-16 h-16 p-2 flex items-center justify-center rounded-lg shadow text-center overflow-hidden'
  }
  // 一般卡片樣式（正方形比例）
  return 'p-6 aspect-square flex items-center justify-center rounded-lg shadow-lg text-center transition-all duration-300'
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
onMounted(() => {
  if (props.adminPreview) previewBg.value = randomColor()
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
</style>
