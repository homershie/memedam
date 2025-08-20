<template>
  <Card class="mb-8 max-w-5xl mx-auto!">
    <template #header>
      <div class="flex items-center justify-between p-4 pb-0">
        <div class="flex items-center space-x-3">
          <!-- 用戶頭像骨架 -->
          <Skeleton shape="circle" size="3rem" />
          <div>
            <div class="flex items-center gap-2">
              <!-- 用戶名稱骨架 -->
              <Skeleton width="8rem" height="1.2rem" class="mb-1" />
              <!-- 發布時間骨架 -->
              <Skeleton width="4rem" height="0.8rem" />
            </div>
          </div>
        </div>
        <!-- 選單按鈕骨架 -->
        <Skeleton shape="circle" size="2rem" />
      </div>
    </template>

    <template #content>
      <div class="px-4">
        <div class="flex justify-center gap-4 flex-col lg:flex-row items-start">
          <!-- 媒體內容區域 -->
          <div class="mb-4 w-full lg:w-1/4">
            <!-- 圖片/影片骨架 -->
            <Skeleton width="100%" height="200px" borderRadius="8px" />
          </div>

          <div class="w-full lg:w-3/4">
            <!-- 標題骨架 -->
            <div class="mb-4">
              <Skeleton width="60%" height="1.5rem" class="mb-2" />
            </div>

            <!-- 內容預覽骨架 -->
            <div class="mb-4">
              <Skeleton width="100%" height="1rem" class="mb-2" />
              <Skeleton width="90%" height="1rem" class="mb-2" />
              <Skeleton width="75%" height="1rem" />
            </div>

            <!-- 標籤骨架 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <Skeleton width="4rem" height="1.5rem" borderRadius="16px" />
              <Skeleton width="5rem" height="1.5rem" borderRadius="16px" />
              <Skeleton width="3.5rem" height="1.5rem" borderRadius="16px" />
            </div>
          </div>
        </div>

        <!-- 互動按鈕骨架 -->
        <div
          class="flex items-center justify-between pt-4 border-t border-t-stone-200 dark:border-t-stone-800"
        >
          <div class="flex items-center space-x-6">
            <Skeleton width="3rem" height="2rem" />
            <Skeleton width="3rem" height="2rem" />
            <Skeleton width="3rem" height="2rem" />
          </div>
          <div class="flex items-center space-x-2">
            <Skeleton width="2rem" height="2rem" />
            <Skeleton width="2rem" height="2rem" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
</script>

<style scoped>
.p-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
