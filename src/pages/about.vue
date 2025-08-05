<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 頁面標題 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <h1 class="text-5xl font-bold">關於迷因典</h1>
      <p class="text-base mt-1 text-center max-w-2xl">
        迷因典是一個專注於迷因文化的平台，致力於為用戶提供最新、最有趣的迷因內容。
        我們相信迷因不僅是娛樂，更是現代文化的重要組成部分。
      </p>
    </div>

    <!-- 關於迷因典區塊 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col lg:flex-row items-center gap-8 lg:px-32"
    >
      <div class="flex-1 space-y-6">
        <h2 class="text-3xl font-bold">關於迷因典</h2>
        <div class="space-y-4 text-base text-gray-600">
          <p>
            迷因典成立於2024年，是一個專注於迷因文化的社群平台。我們的使命是為迷因愛好者提供一個自由、開放、友善的分享空間，讓每個人都能參與到迷因文化的創造與傳播中。
          </p>
          <p>
            在這裡，你可以發現最新的迷因趨勢，分享你的創意作品，與其他迷因愛好者交流互動。我們相信每個迷因背後都有一個故事，每個創作者都值得被看見。無論你是迷因新手還是資深玩家，迷因典都歡迎你的加入。
          </p>
          <p>
            我們致力於打造一個健康、正向的迷因社群，讓迷因文化能夠持續發展，為更多人帶來歡樂與啟發。透過技術創新與用戶體驗優化，我們希望迷因典能成為迷因愛好者的首選平台。
          </p>
        </div>
      </div>
      <div class="flex-1 flex justify-center">
        <div
          class="w-80 h-60 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-image text-6xl text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 迷因典重視的價值區塊 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
      <div class="text-center mb-8">
        <p class="text-sm text-gray-500 mb-2">Tagline</p>
        <h2 class="text-3xl font-bold">迷因典重視的價值</h2>
        <p class="text-base text-gray-600 mt-2">
          我們相信這些核心價值能夠讓迷因文化更加豐富多彩
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 w-full">
        <!-- 幽默 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-smile text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-bold">幽默</h3>
          <p class="text-gray-600">
            我們相信幽默是連接人們的橋樑。在迷因典，每個迷因都承載著創作者的幽默感與智慧，讓大家在歡笑中建立連結，分享快樂。
          </p>
        </div>

        <!-- 開放 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-globe text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-bold">開放</h3>
          <p class="text-gray-600">
            迷因典秉持開放精神，歡迎各種形式的創意表達。我們相信多元文化的碰撞能夠激發更多靈感，讓迷因文化更加豐富多彩。
          </p>
        </div>

        <!-- 自由 -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-heart text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-bold">自由</h3>
          <p class="text-gray-600">
            我們支持創作自由，鼓勵用戶表達真實想法。在遵守社群規範的前提下，每個人都應該有權利自由地創作和分享迷因。
          </p>
        </div>
      </div>
    </div>

    <!-- 網站故事區塊 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col lg:flex-row items-center gap-8 lg:px-32"
    >
      <div class="flex-1 space-y-6">
        <p class="text-sm text-gray-500">網站的故事</p>
        <h2 class="text-3xl font-bold">如果有興趣的話，分享開發歷程給你們</h2>
        <p class="text-base text-gray-600">
          如果有其他開發建議，歡迎來迷因典的GitHub發布需求
        </p>
      </div>

      <div class="flex-1">
        <!-- 時間軸 -->
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <!-- 時間軸項目 -->
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box text-white text-sm"></i>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-gray-500">2024. 01</p>
                <h4 class="font-bold">專案啟動</h4>
                <p class="text-gray-600 text-sm">
                  迷因典專案正式啟動，開始規劃平台架構與功能設計，致力於打造最佳的迷因分享體驗。
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box text-white text-sm"></i>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-gray-500">2024. 03</p>
                <h4 class="font-bold">核心功能開發</h4>
                <p class="text-gray-600 text-sm">
                  完成用戶系統、迷因上傳、標籤系統等核心功能的開發，為平台奠定堅實基礎。
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box text-white text-sm"></i>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-gray-500">2024. 06</p>
                <h4 class="font-bold">社群功能上線</h4>
                <p class="text-gray-600 text-sm">
                  推出評論系統、追蹤功能、推薦算法等社群功能，讓用戶能夠更好地互動交流。
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box text-white text-sm"></i>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-gray-500">2024. 09</p>
                <h4 class="font-bold">平台優化</h4>
                <p class="text-gray-600 text-sm">
                  根據用戶反饋持續優化平台體驗，提升搜尋功能、改善介面設計，讓使用更加順暢。
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"
              >
                <i class="pi pi-box text-white text-sm"></i>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-gray-500">2024. 12</p>
                <h4 class="font-bold">未來展望</h4>
                <p class="text-gray-600 text-sm">
                  持續開發新功能，擴大社群影響力，讓迷因典成為迷因文化的領導平台。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
}
</script>

<route lang="yaml">
meta:
  title: '關於本站'
  login: ''
  admin: false
</route>
