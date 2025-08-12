<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: '管理儀表板',
    items: [{ label: '儀表板', icon: 'pi pi-fw pi-home', to: '/admin' }],
  },
  {
    label: '內容管理',
    items: [
      { label: '貼文管理', icon: 'pi pi-fw pi-image', to: '/admin/memes' },
      { label: '用戶管理', icon: 'pi pi-fw pi-users', to: '/admin/users' },
      {
        label: '報告處理',
        icon: 'pi pi-fw pi-exclamation-triangle',
        to: '/admin/reports',
      },
    ],
  },
  {
    label: '數據分析',
    items: [
      {
        label: '統計分析',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/admin/analytics',
      },
      { label: '收入統計', icon: 'pi pi-fw pi-dollar', to: '/admin/revenue' },
    ],
  },
  {
    label: '系統設定',
    items: [
      { label: '一般設定', icon: 'pi pi-fw pi-cog', to: '/admin/settings' },
      { label: '工具管理', icon: 'pi pi-fw pi-wrench', to: '/admin/tools' },
    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
