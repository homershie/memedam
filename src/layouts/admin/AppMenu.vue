<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: '儀表板',
        items: [{ label: '總覽', icon: 'pi pi-fw pi-home', to: '/admin' }]
    },
    {
        label: '內容管理',
        items: [
            { label: '迷因管理', icon: 'pi pi-fw pi-image', to: '/admin/memes' },
            { label: '標籤管理', icon: 'pi pi-fw pi-tags', to: '/admin/tags' },
            { label: '評論管理', icon: 'pi pi-fw pi-comments', to: '/admin/comments' },
            { label: '公告管理', icon: 'pi pi-fw pi-bullhorn', to: '/admin/announcements' }
        ]
    },
    {
        label: '用戶管理',
        items: [
            { label: '用戶列表', icon: 'pi pi-fw pi-users', to: '/admin/users' },
            { label: '權限管理', icon: 'pi pi-fw pi-shield', to: '/admin/permissions' }
        ]
    },
    {
        label: '檢舉管理',
        items: [
            { label: '檢舉處理', icon: 'pi pi-fw pi-flag', to: '/admin/reports' },
            { label: '檢舉統計', icon: 'pi pi-fw pi-chart-bar', to: '/admin/report-stats' }
        ]
    },
    {
        label: '數據分析',
        items: [
            { label: '推薦分析', icon: 'pi pi-fw pi-chart-line', to: '/admin/analytics' },
            { label: 'A/B 測試', icon: 'pi pi-fw pi-flask', to: '/admin/ab-tests' },
            { label: '用戶行為', icon: 'pi pi-fw pi-user-edit', to: '/admin/user-behavior' }
        ]
    },
    {
        label: '系統管理',
        items: [
            { label: '系統設定', icon: 'pi pi-fw pi-cog', to: '/admin/settings' },
            { label: '維護工具', icon: 'pi pi-fw pi-wrench', to: '/admin/tools' },
            { label: '日誌查看', icon: 'pi pi-fw pi-file-text', to: '/admin/logs' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
