<script setup>
import { ref } from 'vue'

const menu = ref(null)

const items = ref([
    { label: '標記全部已讀', icon: 'pi pi-fw pi-check' },
    { label: '清除通知', icon: 'pi pi-fw pi-trash' }
])
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">系統通知</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="!min-w-40"></Menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">今天</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-user !text-xl text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >新用戶註冊
                    <span class="text-surface-700 dark:text-surface-100">張小明 已註冊成為新用戶</span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-exclamation-triangle !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-700 dark:text-surface-100 leading-normal">有 <span class="text-primary font-bold">3</span> 個新的內容報告需要處理</span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">昨天</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-dollar !text-xl text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >收入更新
                    <span class="text-surface-700 dark:text-surface-100">本週收入達到 <span class="text-primary font-bold">$2,450</span></span>
                </span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-heart !text-xl text-pink-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >熱門內容
                    <span class="text-surface-700 dark:text-surface-100">有 <span class="text-primary font-bold">15</span> 個貼文獲得超過 1000 個讚</span>
                </span>
            </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">本週</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-arrow-up !text-xl text-purple-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">用戶活躍度提升 <span class="text-primary font-bold">25%</span></span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-image !text-xl text-cyan-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">新增 <span class="text-primary font-bold">156</span> 個貼文</span>
            </li>
        </ul>
    </div>
</template>
