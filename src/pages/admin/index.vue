<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminDashboard'
})

// Route meta for admin protection
definePageMeta({
  layout: 'admin',
  admin: true,
  title: '管理儀表板'
})
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue'
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue'
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue'
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue'
import StatsWidget from '@/components/dashboard/StatsWidget.vue'
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <StatsWidget />

    <div class="col-span-12 xl:col-span-6">
      <RecentSalesWidget />
      <BestSellingWidget />
    </div>
    <div class="col-span-12 xl:col-span-6">
      <RevenueStreamWidget />
      <NotificationsWidget />
    </div>
  </div>
</template>
