<template>
  <div class="w-full">
    <div class="flex gap-2 items-center">
      <!-- 小時 -->
      <div class="flex flex-col items-center">
        <label
          class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1"
        >
          時
        </label>
        <InputNumber
          v-model="hours"
          :min="0"
          :max="23"
          :useGrouping="false"
          placeholder="0"
          showButtons
          size="small"
          class="w-24"
          buttonLayout="vertical"
          :step="1"
          @update:modelValue="updateTotalSeconds"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>

      <!-- 分隔符 -->
      <div class="flex flex-col items-center">
        <div class="h-6"></div>
        <span
          class="text-lg font-semibold text-surface-600 dark:text-surface-400"
          >:</span
        >
      </div>

      <!-- 分鐘 -->
      <div class="flex flex-col items-center">
        <label
          class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1"
        >
          分
        </label>
        <InputNumber
          v-model="minutes"
          :min="0"
          :max="59"
          :useGrouping="false"
          placeholder="0"
          showButtons
          size="small"
          class="w-24"
          buttonLayout="vertical"
          :step="1"
          @update:modelValue="updateTotalSeconds"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>

      <!-- 分隔符 -->
      <div class="flex flex-col items-center">
        <div class="h-6"></div>
        <span
          class="text-lg font-semibold text-surface-600 dark:text-surface-400"
          >:</span
        >
      </div>

      <!-- 秒 -->
      <div class="flex flex-col items-center">
        <label
          class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1"
        >
          秒
        </label>
        <InputNumber
          v-model="seconds"
          :min="0"
          :max="59"
          :useGrouping="false"
          placeholder="0"
          showButtons
          size="small"
          class="w-24"
          buttonLayout="vertical"
          :step="1"
          @update:modelValue="updateTotalSeconds"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: '設定時間',
  },
})

const emit = defineEmits(['update:modelValue'])

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const totalSeconds = ref(0)

// 格式化時間顯示（用於內部計算，未來可能需要）
const _formattedTime = computed(() => {
  if (totalSeconds.value === 0) return null

  const h = Math.floor(totalSeconds.value / 3600)
  const m = Math.floor((totalSeconds.value % 3600) / 60)
  const s = totalSeconds.value % 60

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  } else {
    return `${m}:${s.toString().padStart(2, '0')}`
  }
})

// 更新總秒數
const updateTotalSeconds = () => {
  totalSeconds.value =
    (hours.value || 0) * 3600 + (minutes.value || 0) * 60 + (seconds.value || 0)
  emit('update:modelValue', totalSeconds.value)
}

// 從秒數轉換為時分秒
const convertSecondsToTime = (totalSecs) => {
  if (!totalSecs || totalSecs === 0) {
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    totalSeconds.value = 0
    return
  }

  hours.value = Math.floor(totalSecs / 3600)
  minutes.value = Math.floor((totalSecs % 3600) / 60)
  seconds.value = totalSecs % 60
  totalSeconds.value = totalSecs
}

// 監聽外部值變化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== totalSeconds.value) {
      convertSecondsToTime(newValue)
    }
  },
  { immediate: true },
)

// 組件掛載時初始化
onMounted(() => {
  if (props.modelValue) {
    convertSecondsToTime(props.modelValue)
  }
})
</script>
