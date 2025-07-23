<template>
  <div class="p-4">
    <!-- 歡迎區塊 -->
    <div class="mb-8">
      <p-panel header="歡迎來到購物網站" class="mb-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-4">歡迎來到購物網站</h1>
            <p class="text-lg mb-4">發現優質商品，享受購物樂趣</p>
            <router-link to="/products">
              <Button
                label="開始購物"
                icon="pi pi-shopping-bag"
                class="p-button-lg p-button-primary"
              />
            </router-link>
          </div>
          <div class="flex-1 text-center">
            <i class="pi pi-shopping-bag text-8xl text-primary"></i>
          </div>
        </div>
      </p-panel>
    </div>

    <!-- 特色區塊 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-6 text-center">網站特色</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <p-card class="text-center">
          <template #header>
            <i class="pi pi-shield text-5xl text-primary mb-2"></i>
          </template>
          <h3 class="text-lg font-bold mb-2">安全購物</h3>
          <p>保障您的購物安全，安心消費</p>
        </p-card>
        <p-card class="text-center">
          <template #header>
            <i class="pi pi-truck text-5xl text-primary mb-2"></i>
          </template>
          <h3 class="text-lg font-bold mb-2">快速配送</h3>
          <p>全台快速配送，準時送達</p>
        </p-card>
        <p-card class="text-center">
          <template #header>
            <i class="pi pi-headphones text-5xl text-primary mb-2"></i>
          </template>
          <h3 class="text-lg font-bold mb-2">24小時客服</h3>
          <p>專業客服團隊，隨時為您服務</p>
        </p-card>
      </div>
    </div>

    <!-- 最新商品預覽 -->
    <div>
      <h2 class="text-2xl font-bold mb-6 text-center">最新商品</h2>
      <div class="grid md:grid-cols-4 gap-4">
        <p-card
          v-for="product in latestProducts"
          :key="product._id"
          class="h-full"
        >
          <template #header>
            <img
              :src="product.image || 'https://via.placeholder.com/150'"
              alt="商品圖片"
              class="w-full h-40 object-cover mb-2"
            />
          </template>
          <h3 class="text-lg font-bold mb-2">{{ product.name }}</h3>
          <p class="mb-2">{{ product.description }}</p>
          <div class="font-bold text-primary mb-2">${{ product.price }}</div>
          <Button
            label="加入購物車"
            icon="pi pi-shopping-cart"
            class="p-button-success w-full"
            @click="addToCart(product)"
          />
        </p-card>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<script>
export default {
  name: 'HomePage',
}
</script>

<route lang="yaml">
meta:
  title: '首頁'
  login: ''
  admin: false
</route>
