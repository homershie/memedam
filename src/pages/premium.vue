<template>
  <div class="mx-auto">
    <!-- Hero 區塊 -->
    <AuroraBackground>
      <div
        class="pb-40 grid grid-cols-1 px-6 lg:pb-10 lg:grid-cols-2 lg:px-20 2xl:px-50"
      >
        <div class="py-16 text-white relative z-10">
          <div class="max-w-4xl mx-auto px-6">
            <h1 class="text-[4rem]! mb-6">
              解鎖<TextHighlight
                class="rounded-xl text-white! bg-gradient-to-r from-primary-500 to-purple-600"
                text-end-color="hsl(var(--accent))"
                duration="1000"
                >頂級會員</TextHighlight
              >
            </h1>
            <h1 class="text-[4rem]! mb-6">獲得專屬權益</h1>
            <p class="text-xl mb-8 leading-relaxed">
              每個月只要 NT$100，支持迷因典，享有頂級會員專屬小確幸。
            </p>
            <Button
              label="立即加入"
              icon="pi pi-arrow-right"
              size="large"
              severity="primary"
              @click="scrollToPricePlans"
            />
          </div>
        </div>
        <ExpandableGallery
          :images="[
            'https://res.cloudinary.com/dkhexh4fp/image/upload/v1756102436/benefit01_fzv4zx.jpg',
            'https://res.cloudinary.com/dkhexh4fp/image/upload/v1756102437/benefit02_ktjjtm.jpg',
            'https://res.cloudinary.com/dkhexh4fp/image/upload/v1756102436/benefit03_kkbswh.jpg',
            'https://res.cloudinary.com/dkhexh4fp/image/upload/v1756102436/benefit04_jwjqmm.jpg',
          ]"
          :titles="['VIP 徽章', '搶先新功能', '限定活動', '支持平台發展']"
          :descriptions="[
            '在個人頁面展示尊爵不凡',
            'Beta 功能優先體驗',
            '專屬活動與抽獎機會',
            '幫助迷因典持續成長',
          ]"
        />
      </div>
    </AuroraBackground>

    <!-- 會員權益 -->
    <div class="mx-auto min-h-screen bg-black">
      <div class="max-w-6xl mx-auto space-y-10 py-40" id="price-plans">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-center mb-14 text-white!">價格方案</h1>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 月繳方案 -->
            <Card
              class="bg-surface-900 text-white border-surface-700 hover:border-primary-500 transition-colors duration-300"
            >
              <template #content>
                <div class="text-center py-6">
                  <div class="text-normal mb-4">
                    NT$<span class="text-5xl font-bold mx-2">100</span>
                    /月
                  </div>
                  <small class="text-surface-400 mb-6 block"
                    >每月自動續訂，可隨時取消。</small
                  >
                  <Divider class="my-4" />
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">VIP 徽章</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">功能搶先體驗</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">限定活動</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">支持平台發展</span>
                    </div>
                  </div>
                  <Button
                    label="選擇月繳"
                    class="w-full mt-6"
                    severity="primary"
                    @click="handlePremium('monthly', 100)"
                  />
                </div>
              </template>
            </Card>

            <!-- 季繳方案 -->
            <Card class="bg-surface-900 text-white border-primary-500 relative">
              <template #content>
                <div class="text-center py-6">
                  <div
                    class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    <span
                      class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      9 折優惠
                    </span>
                  </div>
                  <div class="text-normal mb-4">
                    NT$<span class="text-5xl font-bold mx-2">270</span>
                    /季
                  </div>
                  <small class="text-surface-400 mb-6 block"
                    >每月自動續訂，可隨時取消。</small
                  >
                  <Divider class="my-4" />
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">VIP 徽章</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">功能搶先體驗</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">限定活動</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">支持平台發展</span>
                    </div>
                  </div>
                  <Button
                    label="選擇季繳"
                    class="w-full mt-6"
                    severity="primary"
                    @click="handlePremium('quarterly', 270)"
                  />
                </div>
              </template>
            </Card>

            <!-- 年繳方案 -->
            <Card
              class="bg-surface-900 text-white border-surface-700 hover:border-primary-500 transition-colors duration-300 relative"
            >
              <template #content>
                <div class="text-center py-6">
                  <div
                    class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    <span
                      class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      免費 2 個月
                    </span>
                  </div>
                  <div class="text-normal mb-4">
                    NT$<span class="text-5xl font-bold mx-2">1000</span>
                    /年
                  </div>
                  <small class="text-surface-400 mb-6 block"
                    >每月自動續訂，可隨時取消。</small
                  >
                  <Divider class="my-4" />
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">VIP 徽章</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">功能搶先體驗</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">限定活動</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <i class="pi pi-check text-green-500"></i>
                      <span class="font-medium">支持平台發展</span>
                    </div>
                  </div>
                  <Button
                    label="選擇年繳"
                    class="w-full mt-6"
                    severity="primary"
                    @click="handlePremium('yearly', 1000)"
                  />
                </div>
              </template>
            </Card>
          </div>

          <!-- 說明文字 -->
          <div class="my-10 p-4">
            <small class="text-center text-surface-300 block">
              金流由
              <strong class="text-white">Ko-fi</strong>
              處理；如選擇續訂方案，到期將自動續訂，可隨時登入網站取消。
            </small>
            <small class="text-center mt-2 text-surface-400 block">
              核心功能不因未加入會員而受限，頂級會員目前以贊助為主。
            </small>
          </div>
        </div>

        <!-- 為什麼要支持 -->
        <div
          class="max-w-6xl p-20 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-10 border-2 border-surface-700"
        >
          <h1 class="text-white! text-5xl/snug!">
            為什麼要加入<br />頂級會員？
          </h1>
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div>
                <h4 class="mb-2 text-white!">
                  <i class="pi pi-angle-double-up text-green-500"></i>
                  支持平台發展
                </h4>
                <p class="text-surface-300! dark:text-surface-800">
                  你的每一分支持，都會用在伺服器維護、功能開發與平台優化。
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div>
                <h4 class="mb-2 text-white!">
                  <i class="pi pi-angle-double-up text-green-500"></i>
                  避免迷因長肌肉流失<small class="text-surface-400!"
                    >（誤）</small
                  >
                </h4>
                <p class="text-surface-300! dark:text-surface-800">
                  補充能量，讓迷因長可以繼續搬遷更多迷因（和槓鈴）。
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div>
                <h4 class="mb-2 text-white!">
                  <i class="pi pi-angle-double-up text-green-500"></i>
                  讓社群更有趣
                </h4>
                <p class="text-surface-300! dark:text-surface-800">
                  幫助迷因典更長久運作，更多人能自在分享創意。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 價格方案 -->

    <!-- 常見問題 FAQ -->
    <div class="max-w-6xl mx-auto py-40">
      <h1 class="text-center mb-12">常見問題 FAQ</h1>
      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader
            ><span class="text-xl font-semibold"
              >Q：付款方式有哪些？</span
            ></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：目前使用 Ko-fi 平台處理付款，支援信用卡、PayPal
              等多種付款方式。
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader
            ><span class="text-xl font-semibold"
              >Q：之後可以取消嗎？</span
            ></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：可以，隨時隨地只要連得上迷因典網站就能自行取消（除非網路癱瘓）。
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader
            ><span class="text-xl font-semibold"
              >Q：沒有會員會少什麼功能嗎？</span
            ></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：正常功能不受影響，只是少了 VIP
              專屬權益。目前頂級會員仍以贊助性質為主。
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="3">
          <AccordionHeader
            ><span class="text-xl font-semibold"
              >Q：何時開始享有權益？</span
            ></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：完成付款後立即生效；若遇到延遲，請重新整理或聯繫我們。
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="4">
          <AccordionHeader
            ><span class="text-xl font-semibold"
              >Q：是否會自動續訂？</span
            ></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：若選擇可續訂方案，將於週期結束時自動續訂；可於設定頁隨時關閉。
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="5">
          <AccordionHeader
            ><span class="text-xl font-semibold">
              Q：退款政策？
            </span></AccordionHeader
          >
          <AccordionContent>
            <p class="m-0">
              A：原則上以月度服務提供，已啟用的當期不提供退費；特殊狀況請聯繫客服協助。
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <!-- 最後行動呼籲 CTA -->
    <div class="text-center bg-black py-40">
      <div class="max-w-2xl mx-auto px-6">
        <h1 class="text-white! mb-6">準備好加入了嗎？</h1>
        <Button
          label="成為頂級會員！"
          severity="primary"
          size="large"
          icon="pi pi-arrow-right"
          class="text-2xl font-bold!"
          @click="scrollToPricePlans"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useToast } from 'primevue/usetoast'

import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import AuroraBackground from '@/components/ui/aurora-background/AuroraBackground.vue'
import Button from 'primevue/button'
import ExpandableGallery from '@/components/ui/expandable-gallery/ExpandableGallery.vue'

// 定義組件名稱
defineOptions({
  name: 'PremiumPage',
})

const { updateSEO } = useSEO()
const toast = useToast()

const scrollToPricePlans = () => {
  console.log('Button clicked!')
  const element = document.getElementById('price-plans')
  console.log('Element found:', element)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 處理會員功能
const handlePremium = (type, amount) => {
  const planNames = {
    monthly: '月繳方案',
    quarterly: '季繳方案',
    yearly: '年繳方案',
    cta: '頂級會員',
  }

  toast.add({
    severity: 'info',
    summary: '會員功能',
    detail: `正在處理 ${planNames[type]}，金額：${amount} 元。目前為 MVP 階段，功能開發中。`,
    life: 3000,
  })
}

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
</script>

<route lang="yaml">
meta:
  title: '成為付費會員'
  layout: 'full'
  description: '加入迷因典頂級會員，每月 NT$100，獲得 VIP 徽章、功能搶先體驗與限定活動。'
  login: ''
  admin: false
</route>
