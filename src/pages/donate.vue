<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <!-- 頁面標題 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-16 xl:px-32"
    >
      <h1 class="mb-4 text-center">幫忙迷因長變成肌肉棒子</h1>
      <div class="text-center text-surface-600 max-w-4xl">
        <p class="text-lg">
          希望你在迷因典玩得愉快！「迷因典」是我用幽默和創意打造的網路小角落，想要分享快樂和提供生活靈感。但要讓這個小宇宙持續發光發熱，需要你的支持！
          你的支持是迷因長從鍵盤戰士進化成肌肉棒子的關鍵！讓我能升級伺服器、導入更多服務、偷偷去買乳清蛋白、打造更優質的迷因平台，甚至未來可以推出獨家周邊商品！
          無論是一杯豆奶的小額贊助，還是豪邁的星巴克咖啡，每一份心意都能讓迷因長的笑料更強大、影響力更廣。
          幫助迷因長完成「迷因健身計畫」，一起讓網路世界充滿歡樂！
        </p>
      </div>
      <Button
        label="手刀贊助"
        icon="pi pi-arrow-down"
        size="large"
        severity="primary"
        rounded
        variant="outlined"
        @click="scrollToSection('donate')"
        class="mb-4"
      >
      </Button>

      <div
        class="w-90 h-90 bg-surface-200 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
      >
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755830973/fe9e3654a490811b11ee8a0f1417b8b9_tngd3w.jpg"
          alt="Billy Herrington"
          title="Billy Herrington"
          class="w-full h-full object-cover object-top"
        />
      </div>
    </div>

    <!-- 贊助說明 -->
    <div class="mb-40 px-4 py-44 flex flex-col items-center gap-8 lg:px-32">
      <div class="text-center mb-8">
        <p class="text-sm text-surface-500 mb-2">Reasons</p>
        <h2 class="text-3xl font-bold">為什麼要贊助迷因長？</h2>
      </div>

      <div
        class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-4xl md:justify-items-center gap-y-12"
      >
        <div
          class="text-center md:col-span-2 md:col-start-1 xl:col-span-1 xl:col-start-auto"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-heart text-2xl text-primary-600"></i>
          </div>
          <h3 class="mb-2">支持平台發展</h3>
          <p>
            您的贊助將用於伺服器維護、功能開發和平台優化，讓迷因典能夠持續提供更穩定、更好玩的服務。
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-star text-2xl text-primary-600"></i>
          </div>
          <h3 class="mb-2">獲得特殊權益</h3>
          <p>
            贊助者可獲得專屬徽章、首頁展示等特別回饋，讓您在迷因社群中自帶光環，成為眾人矚目的存在。
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-mars text-2xl text-primary-500"></i>
          </div>
          <h3 class="mb-2">避免肌肉流失 <span class="text-sm">(誤)</span></h3>
          <p>
            健身需要蛋白質，維持需要熱忱，兩者都不能斷供。贊助能讓迷因長有源源不絕的高蛋白。
          </p>
        </div>
      </div>
    </div>

    <!-- 產品比較 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col items-center gap-8 2xl:px-32"
      id="donate"
    >
      <div class="text-center mb-8">
        <p class="text-sm text-surface-500 mb-2">Plans</p>
        <h2 class="text-3xl font-bold">迷因長的肌肉來源</h2>
        <p class="text-base text-surface-600 mt-2">
          你的贊助是迷因長練出「八塊腹肌」的關鍵！以下是三款贊助品項，幫助迷因長補充能量，成為中文迷因界的傳奇。
        </p>
      </div>

      <div
        class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-6xl md:justify-items-center"
      >
        <!-- 產品 1 -->
        <Card
          class="shadow-lg border border-surface-200 dark:border-surface-700 md:col-span-2 md:col-start-1 xl:col-span-1 xl:col-start-auto"
        >
          <template #header>
            <div class="aspect-3/2 rounded-t-xl overflow-hidden">
              <img
                alt="soy milk"
                src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755834220/%E6%9C%AA%E5%91%BD%E5%90%8D_2_svya2n.png"
                class="w-full h-full object-cover"
              />
            </div>
          </template>

          <template #content>
            <div class="space-y-2 mb-6">
              <div class="text-center">
                <h4>義美無加糖厚豆奶</h4>
                <small class="text-surface-600 dark:text-surface-300">
                  樸實無華的選擇，每日必備兩罐買一送一。
                </small>
              </div>
              <div class="text-center text-surface-600 dark:text-surface-300">
                ‥
              </div>
              <div class="space-y-4">
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">價格</span>
                  <span class="text-lg font-bold text-primary-600">30</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">顯示在首頁贊助名單</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">首頁是否有留言</span>
                  <i class="pi pi-times text-primary-500 text-lg"></i>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="font-medium">乾爹/乾媽徽章</span>
                  <i class="pi pi-times text-primary-500 text-lg"></i>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="贊助"
              class="w-full p-button-primary h-12"
              @click="handleDonate(30)"
            />
          </template>
        </Card>

        <!-- 產品 2 -->
        <Card
          class="shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <template #header>
            <div class="aspect-3/2 rounded-t-xl overflow-hidden">
              <img
                alt="chicken breast"
                src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755834229/%E6%9C%AA%E5%91%BD%E5%90%8D_1_yqb3wp.png"
                class="w-full h-full object-cover"
              />
            </div>
          </template>

          <template #content>
            <div class="space-y-2 mb-6">
              <div class="text-center">
                <h4>泰式香檸嫩雞胸</h4>
                <small class="text-surface-600 dark:text-surface-300">
                  又嫩又滑又清爽，迷因長的超商雞胸肉最愛。
                </small>
              </div>
              <div class="text-center text-surface-600 dark:text-surface-300">
                ‥
              </div>
              <div class="space-y-4">
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">價格</span>
                  <span class="text-lg font-bold text-primary-600">60</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">顯示在首頁贊助名單</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">首頁是否有留言</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="font-medium">乾爹/乾媽徽章</span>
                  <i class="pi pi-times text-primary-500 text-lg"></i>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="贊助"
              class="w-full p-button-primary h-12"
              @click="handleDonate(60)"
            />
          </template>
        </Card>

        <!-- 產品 3 -->
        <Card
          class="shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <template #header>
            <div class="aspect-3/2 rounded-t-xl overflow-hidden">
              <img
                alt="starbucks latte"
                src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755834221/%E6%9C%AA%E5%91%BD%E5%90%8D_ejhcho.png"
                class="w-full h-full object-cover"
              />
            </div>
          </template>

          <template #content>
            <div class="space-y-2 mb-6">
              <div class="text-center">
                <h4>星巴克特大杯那堤</h4>
                <small class="text-surface-600 dark:text-surface-300">
                  高級續命補給，適合熬夜不睡覺的時候補充。
                </small>
              </div>
              <div class="text-center text-surface-600 dark:text-surface-300">
                ‥
              </div>
              <div class="space-y-4">
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">價格</span>
                  <span class="text-lg font-bold text-primary-600">150</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">顯示在首頁贊助名單</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-700"
                >
                  <span class="font-medium">首頁是否有留言</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="font-medium">乾爹/乾媽徽章</span>
                  <i class="pi pi-check text-green-500 text-lg"></i>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="贊助"
              class="w-full p-button-primary h-12"
              @click="handleDonate(150)"
            />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'

const toast = useToast()

// 處理贊助功能
const handleDonate = (amount) => {
  // 取得當前用戶ID（如果已登入）
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = currentUser._id || 'anonymous'

  // 建立 Ko-fi 贊助連結
  const koFiUrl = `https://ko-fi.com/memedam?amount=${amount}&user_id=${userId}`

  // 開啟新視窗進行贊助
  window.open(koFiUrl, '_blank', 'width=500,height=600')

  toast.add({
    severity: 'info',
    summary: '贊助功能',
    detail: `正在開啟 Ko-fi 贊助頁面，金額：${amount} 元。`,
    life: 3000,
  })
}

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<script>
export default {
  name: 'DonatePage',
}
</script>

<route lang="yaml">
meta:
  title: '抖內贊助'
  description: '支持迷因典的持續運作與功能開發，成為平台的乾爹乾媽，讓迷因更有趣！'
  login: ''
  admin: false
</route>
