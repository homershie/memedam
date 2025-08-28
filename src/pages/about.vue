<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 關於迷因典區塊 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col lg:flex-row items-center gap-8 lg:px-32"
    >
      <div class="py-40 flex-1 space-y-6 order-last lg:order-first">
        <p class="text-sm text-gray-500 mb-2">About</p>
        <h1 class="text-5xl font-bold">關於迷因典</h1>
        <div class="space-y-4 text-base text-gray-600">
          <p>
            迷因典成立於2025年，是一個專注於迷因文化的社群平台，希望盡量以去中心化的方式經營，讓大家可以用互動的方式，讓迷因可以依照熱度排序。在符合迷因典的宗旨下，希望能讓喜歡迷因的怪咖們集結起來，打造一個迷因的理想鄉，互相分享和交流奇奇怪怪的東西。
          </p>
          <p>
            在這裡你可以追蹤最新梗潮、上傳你最愛的地獄梗，跟同好互相一起搭上地獄列車（誤）。也可以安靜地當個角落人潛水，等著下一個噴飯的瞬間。
          </p>
          <p>
            迷因典的宗旨很簡單：讓迷因在合乎倫理的範圍內更容易被了解和傳播。透過技術創新與用戶體驗優化，迷因典能集結各路迷因愛好者，讓迷因能讓更多人知道。
          </p>
        </div>
      </div>
      <div class="flex-1 flex justify-center order-first lg:order-last">
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045758/memedam-c-1024t_tnwl5r.png"
          alt="logo"
          class="w-100 h-100 drop-shadow-lg transform transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>
    </div>

    <!-- 迷因典的作者 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col lg:flex-row items-center gap-8 lg:px-32"
    >
      <div class="py-40 flex items-center gap-40 space-y-6">
        <div
          class="flex-1 flex justify-center rounded-full overflow-hidden aspect-square"
        >
          <img
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1754649874/memes/d1j6eq0dho1yleoiy4y7.png"
            alt="logo"
            class="object-cover aspect-square w-full h-full transform transition-transform duration-200 hover:scale-[1.02]"
          />
        </div>

        <div class="space-y-2 flex-1">
          <p class="text-sm text-gray-500 mb-2">Author</p>
          <h1 class="text-5xl font-bold mb-4">關於作者</h1>
          <p>
            我是荷馬桑，迷因典的開發者兼站長。是一位喜歡迷因的怪咖，原本是平面設計、UI
            設計和動畫製作出身，興趣很多，包含健身、動漫、遊戲、音樂和各種冷知識。喜歡把抽象的想法變成有趣的作品。最近在學前端工程當作武器庫，把設計腦和工程腦融合在一起，做出這個充滿歡樂與惡搞的迷因平台。
          </p>
          <p>
            如果你對迷因典有建議或合作想法，歡迎使用聯絡頁面，或是意見反饋功能，也可以直接聯絡我：
          </p>
          <div class="flex items-center gap-2">
            <i class="pi pi-envelope"></i>
            <a
              href="mailto:support@memedam.com"
              class="underline hover:text-primary-500!"
              >support@memedam.com</a
            >
          </div>
          <p>
            另外，如果你覺得迷因典不錯，也可以贊助我，讓我可以繼續維護這個平台：
          </p>
          <div class="flex items-center gap-2">
            <i class="pi pi-money-bill"></i>
            歐付寶會員編號: 1018892
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-money-bill"></i>
            <a
              class="underline hover:text-primary-500!"
              href="https://ko-fi.com/homershie"
              >KO-FI贊助頁面</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 迷因典重視的價值區塊 -->
    <div class="mb-4 px-4 py-28 flex flex-col items-center gap-8 lg:px-32">
      <div class="text-center mb-8">
        <p class="text-sm text-gray-500 mb-2">Values</p>
        <h2 class="text-3xl font-bold">迷因典重視的價值</h2>
        <p class="text-base text-gray-600 mt-2">
          我們相信這些核心價值能夠讓迷因文化更加豐富多彩
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-12 w-full">
        <!-- 幽默 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-60 h-40 bg-gray-200 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
          >
            <img
              src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755655918/641yf1drx6f91_rp6mum.jpg"
              alt="rickroll"
              title="rickroll"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-xl font-bold">幽默</h3>
          <p class="text-gray-600">
            幽默是人與人之間的潤滑劑，也是文化交流的橋樑。每個迷因都能在笑聲中建立連結，讓快樂被分享，也讓更多人因為一個迷因而找到共鳴。
          </p>
        </div>

        <!-- 開放 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-60 h-40 bg-gray-200 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
          >
            <img
              src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755656344/640_yguja2.png"
              alt="Ikari Shinji"
              title="Ikari Shinji"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-xl font-bold">開放</h3>
          <p class="text-gray-600">
            不管中文、日文、英文，或是梗圖、短影音，還是純文字，都能在這裡找到舞台。多元表達讓文化更有火花，靈感也因此自由流動不被侷限。
          </p>
        </div>

        <!-- 自由 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-60 h-40 bg-gray-200 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
          >
            <img
              src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755656425/EyHnASXU8AMaOcc_wccdfv.jpg"
              alt="Eren Yeager"
              title="Eren Yeager"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-xl font-bold">自由</h3>
          <p class="text-gray-600">
            支持創作與知識的自由，相信自由才能帶來多元想法和創意。在遵守社群規範的前提下，每個人都能盡情發揮，愛怎麼玩就怎麼玩。
          </p>
        </div>
      </div>
    </div>

    <!-- 網站故事區塊 -->
    <div class="mb-4 px-4 py-40 flex flex-col xl:flex-row gap-8 xl:px-32">
      <div class="flex-1 space-y-6 text-center xl:text-left">
        <p class="text-sm text-gray-500 mb-2">Timeline</p>
        <h2 class="text-3xl font-bold mb-2">迷因典的誕生</h2>
        <p class="text-base text-gray-600">
          歡迎登入後使用提供意見功能，我們會斟酌評估後續開發
        </p>
      </div>

      <div class="flex-2">
        <!-- PrimeVue Timeline 組件 -->
        <Timeline :value="timelineEvents" align="left">
          <template #marker="slotProps">
            <span
              class="flex w-10 h-10 items-center justify-center text-white rounded-full z-10 shadow-md"
              :style="{ backgroundColor: slotProps.item.color }"
            >
              <i :class="slotProps.item.icon" class="text-lg"></i>
            </span>
          </template>
          <template #opposite="slotProps">
            <small class="text-surface-500 dark:text-surface-400 font-medium">
              {{ slotProps.item.date }}
            </small>
          </template>
          <template #content="slotProps">
            <Card class="mt-4 hover:shadow-md transition-shadow duration-300">
              <template #title>
                <span class="font-bold text-lg">{{
                  slotProps.item.title
                }}</span>
              </template>
              <template #content>
                <p class="text-gray-600 leading-relaxed">
                  {{ slotProps.item.description }}
                </p>
                <div
                  v-if="slotProps.item.details"
                  class="mt-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
                >
                  <p class="text-sm text-gray-700">
                    {{ slotProps.item.details }}
                  </p>
                </div>
              </template>
            </Card>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Timeline from 'primevue/timeline'
import Card from 'primevue/card'

export default {
  name: 'AboutPage',
  components: {
    Timeline,
    Card,
  },
  setup() {
    const timelineEvents = ref([
      {
        date: '2025.07',
        title: '專案啟動',
        description:
          '確定平台骨架、技術選型與視覺方向。從今天起，立志把「幽默」與「網站」融合成一種全新的體驗。',
        details: '完成專案規劃／技術模型／UI/UX 初稿，建立第一版設計規劃',
        icon: 'pi pi-folder-open',
        color: 'var(--p-primary-500)',
      },
      {
        date: '2025.09',
        title: '核心功能',
        description:
          '帳號、迷因編輯、社群互動、標籤、搜尋等基礎功能到位。開始發現光怪陸離的奇聞軼事。',
        details:
          '註冊／登入、迷因編輯、推薦演算法、標籤管理、基礎搜尋等等，讓迷因不止是迷因，而是成為一種文化。',
        icon: 'pi pi-cog',
        color: 'var(--p-purple-500)',
      },
    ])

    return {
      timelineEvents,
    }
  },
}
</script>

<style scoped>
/* 調整 Timeline 組件的寬度分配 */
:deep(.p-timeline-event-opposite) {
  flex: 0 0 120px !important; /* 固定寬度，只給日期顯示 */
  max-width: 120px !important;
  min-width: 120px !important;
}

:deep(.p-timeline-event-content) {
  flex: 1 !important; /* 讓內容區域佔據剩餘空間 */
  min-width: 0 !important; /* 允許內容區域縮小 */
}

/* 確保日期文字在窄區域內正確顯示 */
:deep(.p-timeline-event-opposite small) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* 響應式調整 */
@media (max-width: 768px) {
  :deep(.p-timeline-event-opposite) {
    flex: 0 0 80px !important;
    max-width: 80px !important;
    min-width: 80px !important;
  }

  :deep(.p-timeline-event-opposite small) {
    font-size: 0.75rem;
  }
}

/* 確保卡片內容正確顯示 */
:deep(.p-card) {
  border: 0;
}

:deep(.p-card-body) {
  padding: 1rem;
}

:deep(.p-card-title) {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

:deep(.p-card-content) {
  padding: 0;
}
</style>

<route lang="yaml">
meta:
  title: '關於迷因典'
  description: '認識迷因典的理念、價值與故事：以幽默、開放與自由打造中文迷因的理想鄉。'
  login: ''
  admin: false
</route>
