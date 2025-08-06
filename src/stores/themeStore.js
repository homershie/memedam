import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('system')

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(selectedTheme)
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    applyTheme(theme.value)

    // 監聽系統主題變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })
  }

  // 新增 isDark 屬性
  const isDark = computed(() => {
    if (theme.value === 'dark') return true
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  return {
    theme,
    setTheme,
    initTheme,
    isDark, // 記得回傳
  }
})
