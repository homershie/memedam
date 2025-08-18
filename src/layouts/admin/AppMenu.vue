<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

import AppMenuItem from './AppMenuItem.vue'
import {
  IconTags,
  IconComments,
  IconBullhorn,
  IconFlag,
  IconChartBar,
  IconChartLine,
  IconFlask,
  IconUserEdit,
  IconWrench,
  IconFileText,
} from '@/components/icons'

// 使用 admin store
const adminStore = useAdminStore()
let refreshInterval = null

// 載入待處理檢舉數量
const loadPendingCounts = async () => {
  try {
    await adminStore.loadPendingReportsCount()
  } catch (error) {
    console.warn('無法載入待處理檢舉數量:', error)
  }
}

// 組件掛載時初始化並設置定期刷新
onMounted(async () => {
  await loadPendingCounts()

  // 每5分鐘刷新一次
  refreshInterval = setInterval(loadPendingCounts, 5 * 60 * 1000)
})

// 組件卸載時清除定時器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

// 響應式的 menu model
const model = computed(() => {
  const count = adminStore.pendingReportsCount
  return [
    {
      label: '儀表板',
      items: [
        {
          label: '總覽',
          icon: 'pi pi-fw pi-home',
          to: '/admin',
          badge: null,
        },
      ],
    },
    {
      label: '內容管理',
      items: [
        {
          label: '迷因管理',
          icon: 'pi pi-fw pi-image',
          to: '/admin/memes',
          badge: null,
        },
        {
          label: '標籤管理',
          icon: 'pi pi-fw pi-tags',
          to: '/admin/tags',
          badge: null,
          customIcon: IconTags,
        },
        {
          label: '評論管理',
          icon: 'pi pi-fw pi-comments',
          to: '/admin/comments',
          badge: null,
          customIcon: IconComments,
        },
        {
          label: '公告管理',
          icon: 'pi pi-fw pi-bullhorn',
          to: '/admin/announcements',
          badge: null,
          customIcon: IconBullhorn,
        },
      ],
    },
    {
      label: '用戶管理',
      items: [
        {
          label: '用戶列表',
          icon: 'pi pi-fw pi-users',
          to: '/admin/users',
          badge: null,
        },
      ],
    },
    {
      label: '檢舉管理',
      items: [
        {
          label: '檢舉處理',
          icon: 'pi pi-fw pi-flag',
          to: '/admin/reports',
          badge: count > 0 ? { value: count, severity: 'danger' } : null,
          customIcon: IconFlag,
        },
        {
          label: '檢舉統計',
          icon: 'pi pi-fw pi-chart-bar',
          to: '/admin/report-stats',
          badge: null,
          customIcon: IconChartBar,
        },
      ],
    },
    {
      label: '數據分析',
      items: [
        {
          label: '推薦分析',
          icon: 'pi pi-fw pi-chart-line',
          to: '/admin/analytics',
          badge: null,
          customIcon: IconChartLine,
        },
        {
          label: 'A/B 測試',
          icon: 'pi pi-fw pi-flask',
          to: '/admin/ab-tests',
          badge: null,
          customIcon: IconFlask,
        },
        {
          label: '用戶行為',
          icon: 'pi pi-fw pi-user-edit',
          to: '/admin/user-behavior',
          badge: null,
          customIcon: IconUserEdit,
        },
      ],
    },
    {
      label: '系統管理',
      items: [
        {
          label: '維護工具',
          icon: 'pi pi-fw pi-wrench',
          to: '/admin/tools',
          badge: null,
          customIcon: IconWrench,
        },
        {
          label: '日誌查看',
          icon: 'pi pi-fw pi-file-text',
          to: '/admin/logs',
          badge: null,
          customIcon: IconFileText,
        },
      ],
    },
  ]
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <li v-if="item.label" class="menu-category">
        <span class="menu-category-text">{{ item.label }}</span>
      </li>
      <template v-for="(subItem, j) in item.items" :key="`${item.label}-${j}`">
        <app-menu-item
          v-if="!subItem.separator"
          :item="subItem"
          :index="`${i}-${j}`"
        ></app-menu-item>
        <li v-if="subItem.separator" class="menu-separator"></li>
      </template>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-category {
  padding: 0.75rem 1rem 0.25rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 0.5rem;
}

.menu-category-text {
  display: block;
}

.menu-separator {
  border-top: 1px solid var(--surface-border);
  margin: 0.5rem 0;
}
</style>
