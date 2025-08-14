<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppMenu from './AppMenu.vue'
import NotificationButton from '@/components/NotificationButton.vue'

const isDesktop = ref(true)
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

// 響應式螢幕寬度檢測
const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 991
}

onMounted(() => {
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
        <router-link to="/">
          <img
            v-if="isDark"
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1754649809/memedam-w-60_1_svvhiq.png"
            alt="logo-white"
          />
          <img
            v-else
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/e_negate/v1754649809/memedam-w-60_1_svvhiq.png"
            alt="logo-black"
          />
        </router-link>
        <router-link to="/">
          <div class="flex flex-col justify-center">
            <div
              class="font-bold text-3xl mb-0 leading-none mt-1 dark:text-white!"
            >
              迷因典
            </div>
            <div
              class="text-sm mb-0 text-gray-500 leading-none dark:text-gray-400"
            >
              MemeDam
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 用戶資料區域 -->
    <div class="flex flex-col items-center wrap gap-2 py-4 flex-shrink-0">
      <Avatar
        image="https://api.dicebear.com/9.x/notionists-neutral/svg?seed=admin001"
        shape="circle"
        size="xlarge"
        class="border-2 border-gray-200"
      />

      <div class="flex flex-col items-center gap-2">
        <div class="text-lg mb-0">管理者A</div>
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
          <Button icon="pi pi-search" variant="text" @click="toggle" />
        </InputGroupAddon>
      </InputGroup>
    </div>

    <!-- 可捲動的選單區域 -->
    <div
      class="pb-10 flex-1 overflow-y-hidden group-hover:overflow-y-auto"
      style="scrollbar-gutter: stable; scrollbar-width: thin"
    >
      <app-menu></app-menu>
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
