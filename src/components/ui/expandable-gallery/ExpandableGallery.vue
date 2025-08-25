<template>
  <div :class="cn('flex h-96 w-full gap-2', props.class)">
    <div
      v-for="(image, index) in images"
      :key="image"
      class="relative flex h-full flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out hover:flex-[3] group"
    >
      <img
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        :src="image"
        :alt="image"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:opacity-100"
      >
        <div
          class="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 opacity-0 transition-all duration-500 delay-100 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          <h4
            v-if="titles[index]"
            class="text-white! shadow-md mb-2 text-lg font-semibold animate-fade-in-up"
          >
            {{ titles[index] }}
          </h4>
          <p
            v-if="descriptions[index]"
            class="text-white! shadow-md opacity-90 text-sm animate-fade-in-up"
            style="animation-delay: 0.2s"
          >
            {{ descriptions[index] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  images: { type: Array, required: true },
  class: { type: null, required: false },
  titles: { type: Array, required: false, default: () => [] },
  descriptions: { type: Array, required: false, default: () => [] },
})
</script>
