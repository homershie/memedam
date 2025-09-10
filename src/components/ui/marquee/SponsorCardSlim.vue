<template>
  <figure
    class="relative w-64 cursor-pointer rounded-xl border p-4 sponsor-card-slim"
    :class="tierClass"
    @click="handleClick"
  >
    <div class="flex flex-row items-center gap-2">
      <div class="relative">
        <img
          :src="img"
          class="rounded-full border border-surface-200 dark:border-surface-800"
          width="32"
          height="32"
          alt=""
        />
      </div>
      <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium dark:text-white">
            {{ name }}
          </span>
          <span
            v-if="amount"
            class="text-xs font-medium ml-2"
            :class="amountTextClass"
          >
            ${{ amount }}
          </span>
        </div>
        <small class="font-medium text-black/40! dark:text-white/40!">{{
          username
        }}</small>
      </div>
    </div>
  </figure>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  img: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  amount: { type: Number, required: false },
  tier: { type: String, required: false },
})

// 定義 emits
const emit = defineEmits(['click'])

// 處理點擊事件
const handleClick = () => {
  emit('click')
}

const tierClass = computed(() => {
  switch (props.tier) {
    case 'coffee':
      return 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/20'
    case 'chicken':
      return 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 dark:hover:bg-purple-900/20'
    case 'soy':
      return 'border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/20 hover:bg-surface-100/50 dark:hover:bg-surface-900/20'
    default:
      return ''
  }
})

const amountTextClass = computed(() => {
  switch (props.tier) {
    case 'coffee':
      return 'text-primary-500 dark:text-primary-400'
    case 'chicken':
      return 'text-purple-500 dark:text-purple-400'
    case 'soy':
      return 'text-surface-500 dark:text-surface-400'
    default:
      return 'text-primary-500 dark:text-primary-400'
  }
})
</script>
