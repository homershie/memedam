<template>
  <div>
    <!-- 按鈕組模式 -->
    <div v-if="mode === 'buttons'" class="flex items-center gap-2">
      <button
        @click="setTheme('light')"
        :class="[
          'p-2 rounded-lg transition-colors',
          theme === 'light'
            ? 'bg-surface-700 text-white'
            : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300',
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
            ? 'bg-surface-700 text-white'
            : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300',
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
            ? 'bg-surface-700 text-white'
            : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300',
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
        class="w-8 h-8 rounded-full transition-colors text-secondary-700 hover:bg-stone-100 dark:text-secondary-300 dark:hover:bg-stone-700"
        :title="getCurrentThemeTitle()"
      >
        <i :class="getCurrentThemeIcon()"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

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

const theme = ref(props.modelValue)

// 主題選項
const themeOptions = ref([
  { label: '淺色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
  { label: '根據系統設定', value: 'system' },
])

// 從 localStorage 讀取保存的主題設定
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
    applyTheme(savedTheme)
  } else {
    applyTheme(theme.value)
  }
})

// 監聽主題變化
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
  emit('update:modelValue', newTheme)
  emit('change', newTheme)
})

// 監聽 props 變化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== theme.value) {
      theme.value = newValue
    }
  },
)

const applyTheme = (selectedTheme) => {
  const root = document.documentElement

  // 移除所有主題類別
  root.classList.remove('light', 'dark')

  if (selectedTheme === 'system') {
    // 使用系統偏好
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  } else {
    // 使用使用者選擇的主題
    root.classList.add(selectedTheme)
  }
}

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

// 監聽系統主題變化
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  })
})
</script>

<style scoped lang="scss">
.theme-toggle:hover {
  background-color: var(--p-surface-100);
}
.dark .theme-toggle:hover {
  background-color: var(--p-surface-700);
}
</style>
