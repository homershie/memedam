<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppMenu from './AppMenu.vue'
import NotificationButton from '@/components/NotificationButton.vue'
import { useUserStore } from '@/stores/userStore'
import userService from '@/services/userService'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import InputGroupAddon from 'primevue/inputgroupaddon'

const isDesktop = ref(true)
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

// 使用者資訊
const displayName = ref('')
const avatarUrl = ref('')

// 響應式螢幕寬度檢測
const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 991
}

onMounted(async () => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)

  // 監聽主題類別變化
  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true })

  // 載入目前使用者資訊以顯示頭像與名稱
  try {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      const { data } = await userService.getMe()
      const user = data?.user || data
      const name = user?.display_name || user?.username || ''
      const avatar =
        user?.avatarUrl ||
        (user?.username
          ? `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(user.username)}`
          : '')

      displayName.value = name
      avatarUrl.value = avatar
    }
  } catch (e) {
    console.error('載入使用者資料失敗：', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  if (themeObserver) themeObserver.disconnect()
})
</script>

<template>
  <div
    class="layout-sidebar bg-white dark:bg-black group h-full overflow-y-hidden group-hover:overflow-y-auto flex flex-col border-r border-[var(--p-content-border-color)]"
    style="scrollbar-gutter: stable; scrollbar-width: thin"
  >
    <!-- 頂部區域：LOGO -->
    <div class="layout-sidebar-header p-4 flex-shrink-0">
      <div class="flex justify-center items-center">
        <router-link to="/" class="logo-link">
          <img
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-light_ne9fhd.png"
            alt="MemeDam"
            class="h-12 w-auto"
            v-if="isDark"
          />
          <img
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-dark_saeqez.png"
            alt="MemeDam"
            class="h-12 w-auto"
            v-else
          />
        </router-link>
      </div>
    </div>

    <!-- 用戶資料區域 -->
    <div class="flex flex-col items-center wrap gap-2 py-4 flex-shrink-0">
      <Avatar
        :image="
          avatarUrl ||
          'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=admin001'
        "
        shape="circle"
        size="xlarge"
        class="border-2 border-gray-200"
      />

      <div class="flex flex-col items-center gap-2">
        <div class="text-lg mb-0">{{ displayName || '管理者' }}</div>
        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-cog"
            severity="contrast"
            class="p-button-text rounded-full w-10 h-10"
            title="系統設定"
            @click="$router.push('/admin/settings')"
          />
          <NotificationButton />
        </div>
      </div>
    </div>

    <!-- 搜尋欄 -->
    <div
      class="p-4 flex-shrink-0 border-b border-[var(--p-content-border-color)]"
    >
      <InputGroup>
        <InputText placeholder="搜尋功能" />
        <InputGroupAddon>
          <Button icon="pi pi-search" variant="text" />
        </InputGroupAddon>
      </InputGroup>
    </div>

    <!-- 可捲動的選單區域 -->
    <div
      class="pb-10 flex-1 overflow-y-hidden group-hover:overflow-y-auto"
      style="scrollbar-gutter: stable; scrollbar-width: thin"
    >
      <app-menu />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 自訂捲動軸樣式 */
.layout-sidebar {
  /* Webkit 瀏覽器 (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
  }

  /* 深色模式捲動軸 */
  .dark &::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
  }

  .dark &::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.8);
  }
}

/* 選單區域的捲動軸樣式 */
.layout-sidebar > div:last-child {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
  }

  /* 深色模式捲動軸 */
  .dark &::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
  }

  .dark &::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.8);
  }
}

.user-profile-section {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--surface-border);

  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--surface-200, #f3f4f6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-secondary, #6b7280);

    i {
      font-size: 1.5rem;
    }
  }

  .user-info {
    flex: 1;

    .user-name {
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 0.25rem;
    }

    .user-actions {
      display: flex;
      gap: 0.5rem;

      .action-btn {
        background: transparent;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        position: relative;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--surface-hover, #f9fafb);
        }

        i {
          font-size: 1rem;
        }

        &.notification-btn {
          .notification-badge {
            position: absolute;
            top: -0.25rem;
            right: -0.25rem;
            background-color: #ef4444;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 50%;
            width: 1.25rem;
            height: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }
        }
      }
    }
  }
}
</style>
