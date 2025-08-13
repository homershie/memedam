<script setup>
import { useLayout } from '@/layouts/composables/layout'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import AppFooter from './admin/AppFooter.vue'
import AppSidebar from './admin/AppSidebar.vue'

// Define component name to fix linter error
defineOptions({
  name: 'AdminLayout',
})

const { layoutConfig, isSidebarActive } = useLayout()

// 直接在組件中定義響應式狀態
const staticMenuDesktopInactive = ref(false)
const overlayMenuActive = ref(false)
const staticMenuMobileActive = ref(false)

const outsideClickListener = ref(null)
const isDesktop = ref(true)

// 響應式螢幕寬度檢測
const updateScreenSize = () => {
  const wasDesktop = isDesktop.value
  isDesktop.value = window.innerWidth > 991

  // 當螢幕尺寸改變時，重新設置選單狀態
  if (wasDesktop !== isDesktop.value) {
    if (isDesktop.value) {
      // 切換到桌面版：固定顯示側邊欄
      staticMenuDesktopInactive.value = false
      staticMenuMobileActive.value = false
    } else {
      // 切換到手機版：隱藏側邊欄
      staticMenuDesktopInactive.value = true
      staticMenuMobileActive.value = false
    }
  }
}

// 簡化的選單切換函數
const toggleMenu = () => {
  if (isDesktop.value) {
    staticMenuDesktopInactive.value = !staticMenuDesktopInactive.value
  } else {
    staticMenuMobileActive.value = !staticMenuMobileActive.value
  }
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)

  // 桌面版預設開啟選單，手機版預設關閉選單
  if (isDesktop.value) {
    staticMenuDesktopInactive.value = false // 桌面版固定顯示側邊欄
  } else {
    staticMenuMobileActive.value = false // 手機版預設關閉選單
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener()
  } else {
    unbindOutsideClickListener()
  }
})

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static' && isDesktop.value,
    'layout-static-inactive':
      staticMenuDesktopInactive.value &&
      layoutConfig.menuMode === 'static' &&
      isDesktop.value,
    'layout-overlay-active': overlayMenuActive.value,
    'layout-mobile-active': staticMenuMobileActive.value,
  }
})

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        overlayMenuActive.value = false
        staticMenuMobileActive.value = false
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event) {
  const sidebarEl = document.querySelector('.layout-sidebar')

  return !(
    sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target)
  )
}
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-sidebar></app-sidebar>

    <!-- 遮罩層 - 手機版選單開啟時顯示 -->
    <div
      v-if="!isDesktop && staticMenuMobileActive"
      class="layout-mask"
      @click="staticMenuMobileActive = false"
    ></div>

    <div class="layout-main-container">
      <!-- 浮動選單切換按鈕 - 只在手機版顯示 -->
      <button
        v-if="!isDesktop"
        class="layout-menu-toggle-button"
        @click="toggleMenu"
      >
        <i class="pi pi-bars"></i>
      </button>
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
  </div>
  <Toast />
</template>

<style lang="scss" scoped>
.layout-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;

  .layout-main-container {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .layout-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
  }

  .layout-sidebar {
    width: 280px;
    overflow-y: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
  }

  .layout-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: block;
  }

  &.layout-overlay-active .layout-mask,
  &.layout-mobile-active .layout-mask {
    display: block;
  }

  &.layout-static {
    .layout-main-container {
      margin-left: 280px;
    }
  }

  &.layout-static-inactive {
    .layout-main-container {
      margin-left: 0;
    }

    .layout-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
    }
  }

  &.layout-overlay {
    .layout-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
    }

    &.layout-overlay-active .layout-sidebar {
      transform: translateX(0);
    }
  }

  @media (max-width: 991px) {
    .layout-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s;
    }

    &.layout-mobile-active .layout-sidebar {
      transform: translateX(0) !important;
    }

    .layout-main-container {
      margin-left: 0 !important;
    }

    // 確保手機版時不會有任何左邊間距
    &.layout-static .layout-main-container {
      margin-left: 0 !important;
    }

    &.layout-static-inactive .layout-main-container {
      margin-left: 0 !important;
    }

    // 確保手機版選單能正確顯示
    &.layout-mobile-active .layout-sidebar {
      transform: translateX(0) !important;
      z-index: 1000;
    }
  }

  .layout-menu-toggle-button {
    position: fixed;
    top: 1rem;
    right: 2rem;
    z-index: 1000;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s;

    &:hover {
      background: var(--p-primary-600);
      transform: scale(1.05);
    }

    i {
      font-size: 1.2rem;
    }
  }
}
</style>
