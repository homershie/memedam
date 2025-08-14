<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminDashboard',
})

import BestMemesWidget from '@/components/dashboard/BestMemesWidget.vue'
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue'
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue'
import StatsWidget from '@/components/dashboard/StatsWidget.vue'
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <StatsWidget />

    <div class="col-span-12 xl:col-span-6">
      <RecentSalesWidget />
      <BestMemesWidget />
    </div>
    <div class="col-span-12 xl:col-span-6">
      <RevenueStreamWidget />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '管理儀表板'
  admin: true
</route>
