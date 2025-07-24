<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold mb-4">404</h1>
    <p class="text-xl mb-6">找不到這個頁面</p>
    <router-link to="/">
      <button class="bg-primary text-white px-4 py-2 rounded">回首頁</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
}
</script>

<route lang="yaml">
meta:
  title: '404找不到頁面'
  login: ''
  layout: 'full'
  admin: false
</route>
