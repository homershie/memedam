<script setup>
import { ref } from 'vue'

const menu = ref(null)

const items = ref([
    { label: '查看全部', icon: 'pi pi-fw pi-eye' },
    { label: '匯出數據', icon: 'pi pi-fw pi-download' }
])
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">熱門貼文</div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="!min-w-40"></Menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">搞笑貓咪合集</span>
                    <div class="mt-1 text-muted-color">娛樂</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-orange-500 h-full" style="width: 85%"></div>
                    </div>
                    <span class="text-orange-500 ml-4 font-medium">85%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">程式設計梗圖</span>
                    <div class="mt-1 text-muted-color">科技</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-cyan-500 h-full" style="width: 72%"></div>
                    </div>
                    <span class="text-cyan-500 ml-4 font-medium">72%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">生活日常趣事</span>
                    <div class="mt-1 text-muted-color">生活</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-pink-500 h-full" style="width: 68%"></div>
                    </div>
                    <span class="text-pink-500 ml-4 font-medium">68%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">美食分享</span>
                    <div class="mt-1 text-muted-color">美食</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-green-500 h-full" style="width: 55%"></div>
                    </div>
                    <span class="text-primary ml-4 font-medium">55%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">旅遊風景</span>
                    <div class="mt-1 text-muted-color">旅遊</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-purple-500 h-full" style="width: 42%"></div>
                    </div>
                    <span class="text-purple-500 ml-4 font-medium">42%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">運動健身</span>
                    <div class="mt-1 text-muted-color">運動</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-teal-500 h-full" style="width: 38%"></div>
                    </div>
                    <span class="text-teal-500 ml-4 font-medium">38%</span>
                </div>
            </li>
        </ul>
    </div>
</template>
