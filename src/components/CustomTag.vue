<template>
  <Tag :value="value" :severity="standardSeverity" :class="customClass" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: String,
  severity: {
    type: String,
    default: 'primary',
  },
})

const standardSeverities = [
  'success',
  'info',
  'warn',
  'error',
  'secondary',
  'contrast',
  'primary',
]

const standardSeverity = computed(() => {
  if (standardSeverities.includes(props.severity)) {
    return props.severity
  }
  return 'primary' // 預設值
})

const customClass = computed(() => {
  if (standardSeverities.includes(props.severity)) {
    return ''
  }

  // 自定義 severity 的樣式類別
  const severityStyles = {
    custom:
      '!bg-primary-100 !text-primary-800 dark:!bg-primary-800 dark:!text-primary-100',
    premium:
      '!bg-warn-100 !text-warn-800 dark:!bg-warn-800 dark:!text-warn-100',
    featured: '!bg-primary-500 !text-primary-50 ',
  }

  return severityStyles[props.severity] || ''
})
</script>
