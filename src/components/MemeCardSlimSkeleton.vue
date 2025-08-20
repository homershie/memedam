<template>
  <Card class="w-full relative">
    <template #header>
      <!-- 選單按鈕骨架 -->
      <Skeleton
        shape="circle"
        size="2rem"
        style="position: absolute; top: 10px; right: 10px; z-index: 10"
      />

      <!-- 媒體內容區域 -->
      <div class="h-60 flex items-center justify-center overflow-hidden">
        <Skeleton width="100%" height="100%" borderRadius="8px 8px 0 0" />
      </div>
    </template>

    <template #title>
      <div class="flex justify-start items-center gap-2">
        <!-- 標題骨架 -->
        <Skeleton width="60%" height="1.2rem" class="mb-1" />
        <!-- 發布時間骨架 -->
        <Skeleton width="3rem" height="0.8rem" />
      </div>
    </template>

    <template #content>
      <!-- 標籤骨架 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <Skeleton width="3rem" height="1.5rem" borderRadius="16px" />
        <Skeleton width="4rem" height="1.5rem" borderRadius="16px" />
        <Skeleton width="3.5rem" height="1.5rem" borderRadius="16px" />
      </div>

      <!-- 內容預覽骨架 -->
      <div class="mb-4">
        <Skeleton width="100%" height="1rem" class="mb-2" />
        <Skeleton width="90%" height="1rem" class="mb-2" />
        <Skeleton width="75%" height="1rem" />
      </div>

      <Divider class="my-2" />

      <!-- 互動按鈕骨架 -->
      <div class="flex justify-around text-gray-500 text-lg">
        <Skeleton width="30%" height="2rem" />
        <Skeleton width="30%" height="2rem" />
        <Skeleton width="30%" height="2rem" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import Divider from 'primevue/divider'
</script>

<style scoped>
.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
