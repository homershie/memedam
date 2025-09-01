<template>
  <div
    :class="
      cn(
        'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        $props.class,
      )
    "
  >
    <div
      v-for="index in repeat"
      :key="index"
      :class="
        cn(
          'flex shrink-0 justify-around [gap:var(--gap)]',
          vertical
            ? 'animate-marquee-vertical flex-col'
            : 'animate-marquee flex-row',
        )
      "
      :style="{
        animationDirection: reverse ? 'reverse' : 'normal',
        animationDuration: `${duration}s`,
        animationPlayState: isPaused ? 'paused' : 'running',
      }"
      @mouseenter="pauseOnHover && (isPaused = true)"
      @mouseleave="pauseOnHover && (isPaused = false)"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { ref } from 'vue'

defineProps({
  class: { type: String, required: false },
  reverse: { type: Boolean, required: false },
  pauseOnHover: { type: Boolean, required: false, default: false },
  vertical: { type: Boolean, required: false, default: false },
  repeat: { type: Number, required: false, default: 4 },
  duration: { type: Number, required: false, default: 40 },
})

const isPaused = ref(false)

// 定義組件名稱以符合多詞命名規則
defineOptions({
  name: 'MarqueeComponent',
})
</script>

<style scoped>
.animate-marquee {
  animation: marquee linear infinite;
}

.animate-marquee-vertical {
  animation: marquee-vertical linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}

@keyframes marquee-vertical {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(-100% - var(--gap)));
  }
}
</style>
