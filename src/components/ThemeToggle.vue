<template>
  <div>
    <!-- 按鈕組模式 -->
    <div v-if="mode === 'buttons'" class="flex items-center gap-2">
      <button
        @click="setTheme('light')"
        :class="[
          'p-2 rounded-lg transition-colors',
          theme === 'light'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        :title="'淺色模式'"
      >
        <i class="ri-sun-line"></i>
      </button>

      <button
        @click="setTheme('system')"
        :class="[
          'p-2 rounded-lg transition-colors',
          theme === 'system'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        :title="'根據系統設定'"
      >
        <i class="ri-computer-line"></i>
      </button>

      <button
        @click="setTheme('dark')"
        :class="[
          'p-2 rounded-lg transition-colors',
          theme === 'dark'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        ]"
        :title="'深色模式'"
      >
        <i class="ri-moon-line"></i>
      </button>
    </div>

    <!-- 下拉選單模式 -->
    <div v-else-if="mode === 'dropdown'" class="w-full">
      <Dropdown
        v-model="theme"
        :options="themeOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="選擇主題模式"
        class="w-full"
        @change="handleThemeChange"
      />
    </div>

    <!-- 單一按鈕模式（用於導覽列） -->
    <div v-else-if="mode === 'single'" class="flex items-center">
      <button
        @click="toggleTheme"
        class="w-10 h-10 rounded-full transition-colors theme-toggle"
        :title="getCurrentThemeTitle()"
      >
        <i :class="getCurrentThemeIcon()"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

// Props
const props = defineProps({
  mode: {
    type: String,
    default: 'buttons', // 'buttons', 'dropdown', 'single'
  },
  modelValue: {
    type: String,
    default: 'system',
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

const themeStore = useThemeStore()

// 使用全域主題作為單一真相來源
const theme = computed({
  get: () => themeStore.theme,
  set: (val) => {
    themeStore.setTheme(val)
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// 主題選項
const themeOptions = ref([
  { label: '淺色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
  { label: '根據系統設定', value: 'system' },
])

// 與外部 v-model 同步（若父層提供值則覆寫 store）
onMounted(() => {
  const incoming = props.modelValue
  if (incoming && incoming !== themeStore.theme) {
    themeStore.setTheme(incoming)
  }
})

// 當父層變更 modelValue 時，同步到 store
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== themeStore.theme) {
      themeStore.setTheme(newValue)
    }
  },
)

const setTheme = (newTheme) => {
  theme.value = newTheme
}

const handleThemeChange = (event) => {
  setTheme(event.value)
}

// 單一按鈕模式的主題切換邏輯
const toggleTheme = () => {
  const themes = ['light', 'system', 'dark']
  const currentIndex = themes.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  setTheme(themes[nextIndex])
}

// 獲取當前主題的圖標
const getCurrentThemeIcon = () => {
  switch (theme.value) {
    case 'light':
      return 'ri-sun-line'
    case 'dark':
      return 'ri-moon-line'
    case 'system':
    default:
      return 'ri-computer-line'
  }
}

// 獲取當前主題的標題
const getCurrentThemeTitle = () => {
  switch (theme.value) {
    case 'light':
      return '淺色模式'
    case 'dark':
      return '深色模式'
    case 'system':
    default:
      return '根據系統設定'
  }
}

// 監聽系統主題變化交由 themeStore 處理（在 App.vue initTheme 中）
</script>

<style scoped lang="scss">
.theme-toggle:hover {
  background-color: var(--p-surface-100);
}
.dark .theme-toggle:hover {
  background-color: var(--p-surface-700);
}
</style>
