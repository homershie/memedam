<template>
  <div
    :class="[
      'p-6 h-90 flex items-center justify-center rounded-lg shadow-lg text-center transition-all duration-300',
      gradientClass,
      hoverEffect,
    ]"
  >
    <div>
      <h3 :class="['font-bold', titleClass]">{{ title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
})

const gradientClass = computed(() => {
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
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  }
  return `${sizeClasses[props.size]} text-white`
})

const hoverEffect = computed(() => {
  if (!props.hoverEffect) return ''
  return 'hover:transform hover:-translate-y-1 hover:shadow-xl'
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
