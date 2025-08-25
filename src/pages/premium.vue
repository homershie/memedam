<template>
  <div class="premium-page min-h-screen w-full mt-10">
    <div class="container mx-auto p-4 space-y-12 pb-20">
      <!-- Hero 區塊 -->
      <div
        class="text-center py-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white"
      >
        <div class="max-w-4xl mx-auto px-6">
          <h1 class="text-5xl font-bold mb-6">解鎖你的迷因宇宙</h1>
          <p class="text-xl mb-8 leading-relaxed">
            只要 NT$100，支持迷因典，享有頂級會員專屬小確幸。
          </p>
          <p class="text-lg mb-8 opacity-90">
            頂級會員目前以贊助為主，權益會持續升級中。
          </p>
          <button
            class="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            👉 立即成為頂級會員
          </button>
        </div>
      </div>

      <!-- 會員權益 -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">會員權益</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <div class="text-3xl mb-4">✨</div>
            <h3 class="text-xl font-semibold mb-3">VIP 徽章</h3>
            <p class="text-gray-600">名字旁邊顯示尊爵不凡，好看又好認。</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <div class="text-3xl mb-4">🚀</div>
            <h3 class="text-xl font-semibold mb-3">功能搶先體驗</h3>
            <p class="text-gray-600">新功能 Beta 優先開啟。</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <div class="text-3xl mb-4">🎉</div>
            <h3 class="text-xl font-semibold mb-3">限定活動</h3>
            <p class="text-gray-600">未來可能有會員專屬小活動或抽獎。</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <div class="text-3xl mb-4">💖</div>
            <h3 class="text-xl font-semibold mb-3">支持平台發展</h3>
            <p class="text-gray-600">幫助伺服器維護、功能開發與平台優化。</p>
          </div>
        </div>
        <p class="text-center text-gray-500 mt-8">
          實際可用權益將持續更新與調整，以頁面公告為準。
        </p>
      </div>

      <!-- 為什麼要支持 -->
      <div class="max-w-4xl mx-auto bg-blue-50 p-8 rounded-2xl">
        <h2 class="text-3xl font-bold text-center mb-8">為什麼要支持？</h2>
        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <div class="text-2xl">✅</div>
            <div>
              <h3 class="font-semibold mb-2">支持平台發展</h3>
              <p class="text-gray-600">
                你的每一分支持，都會用在伺服器維護、功能開發與平台優化。
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="text-2xl">✅</div>
            <div>
              <h3 class="font-semibold mb-2">避免迷因長肌肉流失（誤）</h3>
              <p class="text-gray-600">
                補充能量，讓迷因長可以繼續搬梗（和槓鈴）。
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="text-2xl">✅</div>
            <div>
              <h3 class="font-semibold mb-2">讓社群更好玩</h3>
              <p class="text-gray-600">
                幫助迷因典更長久運作，更多人能自在分享創意。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 價格方案 -->
      <Card class="p-4 max-w-xl mx-auto bg-surface-50 dark:bg-surface-900">
        <template #header>
          <h2 class="text-center mb-12">價格方案</h2>
        </template>
        <template #content>
          <Tabs class="mx-auto">
            <TabList class="flex justify-center">
              <Tab value="monthly">月繳</Tab>
              <Tab value="quarterly">季繳</Tab>
              <Tab value="yearly">年繳</Tab>
            </TabList>
            <TabPanels class="mx-auto text-center">
              <TabPanel value="quarterly">
                <div>
                  <p class="mb-6">頂級會員</p>
                  <div class="price-container">
                    <span>NT$</span>270
                    <span>/季</span>
                  </div>
                  <p class="text-gray-500 mb-6">
                    省下 NT$30，每季自動續訂，可隨時取消。（季繳優惠）
                  </p>
                  <Separator />
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">VIP 徽章</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">功能搶先體驗</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">限定活動</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">支持平台發展</p>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="monthly">
                <div>
                  <p class="mb-6">頂級會員</p>
                  <div class="price-container">
                    <span>NT$</span>100
                    <span>/月</span>
                  </div>
                  <p class="text-gray-500 mb-6">
                    省下 NT$30，每季自動續訂，可隨時取消。（季繳優惠）
                  </p>
                  <Separator />
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">VIP 徽章</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">功能搶先體驗</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">限定活動</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">支持平台發展</p>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="yearly">
                <div>
                  <p class="mb-6">頂級會員</p>
                  <div class="price-container">
                    <span>NT$</span>
                    <span class="text-4xl font-bold">1000</span>
                    <span>/年</span>
                  </div>
                  <p class="text-gray-500 mb-6">
                    省下 NT$30，每季自動續訂，可隨時取消。（季繳優惠）
                  </p>
                  <Separator />
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">VIP 徽章</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">功能搶先體驗</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">限定活動</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-plus text-green-500"></i>
                      <p class="text-gray-500 mb-6">支持平台發展</p>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </template>
        <template #footer>
          <div class="mt-8 p-6 bg-gray-50 rounded-xl">
            <p class="text-sm text-gray-600 text-center">
              金流由
              <strong>藍新金流（NewebPay）</strong>
              處理；如選擇續訂方案，到期將自動續訂，可隨時登入網站取消。
            </p>
            <p class="text-sm text-gray-600 text-center mt-2">
              核心功能不因未加入會員而受限，頂級會員目前以贊助為主。
            </p>
          </div>
        </template>
      </Card>

      <!-- 常見問題 FAQ -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">常見問題 FAQ</h2>
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：付款方式有哪些？</h3>
            <p class="text-gray-600">
              A：目前預計串接
              藍新金流（NewebPay），支援方式以藍新提供為準（如信用卡等）。
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：之後可以取消嗎？</h3>
            <p class="text-gray-600">
              A：可以，隨時隨地只要連得上迷因典網站就能自行取消（除非世界進入斷網模式
              😅）。
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：沒有會員會少什麼功能嗎？</h3>
            <p class="text-gray-600">
              A：正常功能不受影響，只是少了 VIP
              專屬權益。目前頂級會員仍以贊助性質為主。
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：何時開始享有權益？</h3>
            <p class="text-gray-600">
              A：完成付款後立即生效；若遇到延遲，請重新整理或聯繫我們。
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：是否會自動續訂？</h3>
            <p class="text-gray-600">
              A：若選擇可續訂方案，將於週期結束時自動續訂；可於設定頁隨時關閉。
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg border">
            <h3 class="font-semibold mb-3">Q：退款政策？</h3>
            <p class="text-gray-600">
              A：原則上以月度服務提供，已啟用的當期不提供退費；特殊狀況請聯繫客服協助。
            </p>
          </div>
        </div>
      </div>

      <!-- 最後行動呼籲 CTA -->
      <div
        class="text-center py-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white"
      >
        <div class="max-w-2xl mx-auto px-6">
          <h2 class="text-3xl font-bold mb-6">準備好加入了嗎？</h2>
          <button
            class="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            👉 用 NT$100 支持迷因典，成為頂級會員！
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'

export default {
  name: 'PremiumPage',
  setup() {
    const { updateSEO } = useSEO()

    onMounted(() => {
      updateSEO({
        title: '成為付費會員',
        description:
          '支持迷因典 MemeDam，成為頂級會員，享有 VIP 徽章、功能搶先體驗與更多小確幸。',
        canonical: `https://www.memedam.com/premium`,
        openGraph: {
          title: '成為付費會員 - 迷因典 MemeDam',
          description:
            '支持迷因典 MemeDam，成為頂級會員，享有 VIP 徽章、功能搶先體驗與更多小確幸。',
          url: `https://www.memedam.com/premium`,
          image: `${window.location.origin}/favicon/apple-touch-icon.png`,
        },
      })
    })

    return {}
  },
}
</script>

<style scoped>
.premium-page {
  overflow-y: auto;
  overflow-x: hidden;
}

/* 確保內容有足夠的高度來觸發捲動軸 */
.premium-page .container {
  min-height: calc(100vh + 200px);
}

/* 自定義捲動軸樣式 */
.premium-page::-webkit-scrollbar {
  width: 8px;
}

.premium-page::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.premium-page::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.premium-page::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色模式下的捲動軸 */
.dark .premium-page::-webkit-scrollbar-track {
  background: #374151;
}

.dark .premium-page::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .premium-page::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

<route lang="yaml">
meta:
  title: '成為付費會員'
  layout: 'full'
  login: ''
  admin: false
</route>
