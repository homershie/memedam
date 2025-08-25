<template>
  <span :class="cn('inline-block px-2 py-2 mx-4 ', props.class)">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  delay: { type: Number, required: false, default: 0 },
  duration: { type: Number, required: false, default: 2000 },
  class: { type: null, required: false },
  textEndColor: { type: String, required: false },
})

const delayMs = computed(() => `${props.delay}ms`)
const durationMs = computed(() => `${props.duration}ms`)
</script>

<style scoped>
@keyframes background-expand {
  0% {
    background-size: 0% 100%;
  }
  100% {
    background-size: 100% 100%;
  }
}

@keyframes text-color-change {
  0% {
    color: inherit;
  }
  100% {
    color: v-bind(textEndColor);
  }
}

span {
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left center;
  animation:
    background-expand v-bind(durationMs) ease-in-out v-bind(delayMs) forwards,
    text-color-change v-bind(durationMs) ease-in-out v-bind(delayMs) forwards;
}
</style>
