<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
defineOptions({
  layout: 'admin',
})
</script>

<route lang="yaml">
meta:
  title: '管理後台'
  admin: true
</route>
