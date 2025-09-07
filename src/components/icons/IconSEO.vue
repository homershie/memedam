<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="[$style.icon, $style[color]]"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="currentColor"
    />
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 24,
  },
  color: {
    type: String,
    default: 'default',
  },
})
</script>

<style module>
.icon {
  display: inline-block;
  flex-shrink: 0;
}

.default {
  color: currentColor;
}

.primary {
  color: #1976d2;
}

.secondary {
  color: #dc004e;
}

.success {
  color: #388e3c;
}

.warning {
  color: #f57c00;
}

.error {
  color: #d32f2f;
}
</style>
