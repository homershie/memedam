<script setup>
import { useLayout } from '@/layouts/composables/layout'
import { ref, onMounted, onUnmounted } from 'vue'
import AppMenu from './AppMenu.vue'

const { toggleMenu } = useLayout()

const isDesktop = ref(true)

// 響應式螢幕寬度檢測
const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 991
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>

<template>
  <div class="layout-sidebar pb-10">
    <!-- 頂部區域：LOGO -->
    <div class="layout-sidebar-header p-4">
      <!-- 行動版選單切換按鈕 -->
      <button v-if="!isDesktop" class="menu-toggle-btn" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <div class="logo-section">
        <router-link to="/">
          <img
            v-if="isDark"
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1754649809/memedam-w-60_1_svvhiq.png"
            alt="logo-white"
          />
          <img
            v-else
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1754649809/memedam-w-60_nhgn74.png"
            alt="logo-black"
          />
          <div class="flex flex-col justify-center">
            <div class="font-bold text-3xl mb-0 leading-none mt-1">迷因典</div>
            <div class="text-sm mb-0 text-gray-500 leading-none">MemeDam</div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 用戶資料區域 -->
    <div class="flex flex-col items-center wrap gap-2 py-4">
      <Avatar
        image="https://api.dicebear.com/9.x/notionists-neutral/svg?seed=admin001"
        shape="circle"
        size="xlarge"
        class="border-2 border-gray-200"
      />

      <div class="flex flex-col items-center gap-2">
        <div class="text-lg mb-0">管理者A</div>
        <div class="flex items-center gap-2">
          <Button icon="pi pi-cog" severity="secondary" rounded />
          <OverlayBadge value="4" severity="primary" size="small">
            <Button icon="pi pi-bell" severity="secondary" rounded />
          </OverlayBadge>
        </div>
      </div>
    </div>

    <!-- 搜尋欄 -->
    <div class="search-section">
      <div class="search-input">
        <i class="pi pi-search"></i>
        <input type="text" placeholder="搜尋" />
      </div>
    </div>

    <!-- 選單 -->
    <app-menu></app-menu>
  </div>
</template>

<style lang="scss" scoped>
.layout-sidebar {
  .layout-sidebar-header {
    .menu-toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--surface-hover, #f9fafb);
      }

      i {
        font-size: 1rem;
      }
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
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

  .search-section {
    padding: 1rem;
    border-bottom: 1px solid var(--surface-border);

    .search-input {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: 0.75rem;
        color: var(--text-color-secondary, #6b7280);
        font-size: 0.875rem;
      }

      input {
        width: 100%;
        padding: 0.5rem 0.75rem 0.5rem 2rem;
        border: 1px solid var(--surface-border, #e5e7eb);
        border-radius: 0.375rem;
        background-color: var(--surface-ground, #f9fafb);
        color: var(--text-color);
        font-size: 0.875rem;

        &::placeholder {
          color: var(--text-color-secondary, #6b7280);
        }

        &:focus {
          outline: none;
          border-color: var(--primary-color, #3b82f6);
          background-color: var(--surface-card, #ffffff);
        }
      }
    }
  }
}
</style>
