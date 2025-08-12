<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: '首頁',
    icon: 'pi pi-fw pi-home',
    to: '/admin',
    badge: null,
    active: true,
  },
  {
    label: '舉報審核',
    icon: 'pi pi-fw pi-folder',
    to: '/admin/reports',
    badge: '99+',
  },
  {
    label: '迷因管理',
    icon: 'pi pi-fw pi-image',
    to: '/admin/memes',
    badge: null,
  },
  {
    label: '廣告管理',
    icon: 'pi pi-fw pi-tag',
    to: '/admin/ads',
    badge: null,
  },
  {
    label: '會員管理',
    icon: 'pi pi-fw pi-users',
    to: '/admin/users',
    badge: null,
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

<style lang="scss" scoped>
.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
