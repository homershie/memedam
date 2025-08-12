import { computed, reactive, ref } from 'vue'

const layoutConfig = reactive({
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme: false,
  menuMode: 'static',
})

// 使用 ref 而不是 reactive 來確保響應式
const staticMenuDesktopInactive = ref(false)
const overlayMenuActive = ref(false)
const profileSidebarVisible = ref(false)
const configSidebarVisible = ref(false)
const staticMenuMobileActive = ref(false)
const menuHoverActive = ref(false)
const activeMenuItem = ref(null)

const layoutState = reactive({
  get staticMenuDesktopInactive() {
    return staticMenuDesktopInactive.value
  },
  set staticMenuDesktopInactive(value) {
    staticMenuDesktopInactive.value = value
  },
  get overlayMenuActive() {
    return overlayMenuActive.value
  },
  set overlayMenuActive(value) {
    overlayMenuActive.value = value
  },
  get profileSidebarVisible() {
    return profileSidebarVisible.value
  },
  set profileSidebarVisible(value) {
    profileSidebarVisible.value = value
  },
  get configSidebarVisible() {
    return configSidebarVisible.value
  },
  set configSidebarVisible(value) {
    configSidebarVisible.value = value
  },
  get staticMenuMobileActive() {
    return staticMenuMobileActive.value
  },
  set staticMenuMobileActive(value) {
    staticMenuMobileActive.value = value
  },
  get menuHoverActive() {
    return menuHoverActive.value
  },
  set menuHoverActive(value) {
    menuHoverActive.value = value
  },
  get activeMenuItem() {
    return activeMenuItem.value
  },
  set activeMenuItem(value) {
    activeMenuItem.value = value
  },
})

export function useLayout() {
  const setActiveMenuItem = (item) => {
    layoutState.activeMenuItem = item.value || item
  }

  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      executeDarkModeToggle()

      return
    }

    document.startViewTransition(() => executeDarkModeToggle(event))
  }

  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme
    document.documentElement.classList.toggle('app-dark')
  }

  const toggleMenu = () => {
    // 簡化邏輯：直接切換手機版選單狀態
    console.log(
      'toggleMenu called, current state:',
      staticMenuMobileActive.value,
    )
    staticMenuMobileActive.value = !staticMenuMobileActive.value
    console.log('toggleMenu new state:', staticMenuMobileActive.value)
  }

  const isSidebarActive = computed(
    () => overlayMenuActive.value || staticMenuMobileActive.value,
  )

  const isDarkTheme = computed(() => layoutConfig.darkTheme)

  const getPrimary = computed(() => layoutConfig.primary)

  const getSurface = computed(() => layoutConfig.surface)

  return {
    layoutConfig,
    layoutState,
    toggleMenu,
    isSidebarActive,
    isDarkTheme,
    getPrimary,
    getSurface,
    setActiveMenuItem,
    toggleDarkMode,
  }
}
