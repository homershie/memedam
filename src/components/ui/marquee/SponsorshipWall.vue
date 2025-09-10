<template>
  <div
    class="relative flex h-fit w-full flex-col items-center justify-center overflow-hidden bg-background my-30 sponsorship-wall"
  >
    <!-- 標題 -->
    <h2
      class="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white"
    >
      感謝贊助！
    </h2>

    <!-- 混合贊助者 Marquee (按行打亂順序) -->
    <div v-if="hasSponsors" class="w-full relative z-10">
      <div
        v-for="(pageData, pageIndex) in getShuffledSponsorPages()"
        :key="`mixed-page-${pageIndex}`"
        class="mb-2"
      >
        <Marquee
          :reverse="pageIndex % 2 === 1"
          pause-on-hover
          class="transition-transform duration-20000"
          :duration="getMarqueeDuration(pageData.sponsors.length)"
          :repeat="getMarqueeRepeat(pageData.sponsors.length)"
        >
          <template v-for="sponsor in pageData.sponsors" :key="sponsor._id">
            <!-- 咖啡等級使用 SponsorCard -->
            <SponsorCard
              v-if="pageData.tier === 'coffee'"
              :img="getSponsorAvatar(sponsor)"
              :name="sponsor.display_name || sponsor.from_name"
              :username="getUsernameDisplay(sponsor)"
              :body="sponsor.message"
              :amount="sponsor.amount"
              :tier="'coffee'"
              @click="handleSponsorClick(sponsor)"
            />
            <!-- 雞肉等級使用 SponsorCard -->
            <SponsorCard
              v-else-if="pageData.tier === 'chicken'"
              :img="getSponsorAvatar(sponsor)"
              :name="sponsor.display_name || sponsor.from_name"
              :username="getUsernameDisplay(sponsor)"
              :body="sponsor.message"
              :amount="sponsor.amount"
              :tier="'chicken'"
              @click="handleSponsorClick(sponsor)"
            />
            <!-- 豆漿等級使用 SponsorCardSlim -->
            <SponsorCardSlim
              v-else-if="pageData.tier === 'soy'"
              :img="getSponsorAvatar(sponsor)"
              :name="sponsor.display_name || sponsor.from_name"
              :username="getUsernameDisplay(sponsor)"
              :amount="sponsor.amount"
              :tier="'soy'"
              @click="handleSponsorClick(sponsor)"
            />
          </template>
        </Marquee>
      </div>
    </div>

    <!-- 左側漸層遮罩 -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background z-10"
    ></div>

    <!-- 右側漸層遮罩 -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background z-10"
    ></div>

    <!-- 空狀態 -->
    <div
      v-if="!hasSponsors"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      <p>目前還沒有贊助者，快來成為第一個贊助者吧！</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Marquee } from './index.js'
import SponsorCard from './SponsorCard.vue'
import SponsorCardSlim from './SponsorCardSlim.vue'

// Props
const props = defineProps({
  sponsors: {
    type: Array,
    default: () => [],
  },
})

// Router
const router = useRouter()

// 計算屬性：按等級分類贊助者
const coffeeSponsors = computed(() =>
  props.sponsors.filter((sponsor) => sponsor.amount >= 150),
)

const chickenSponsors = computed(() =>
  props.sponsors.filter(
    (sponsor) => sponsor.amount >= 60 && sponsor.amount < 150,
  ),
)

const soySponsors = computed(() =>
  props.sponsors.filter(
    (sponsor) => sponsor.amount >= 30 && sponsor.amount < 60,
  ),
)

const hasSponsors = computed(
  () =>
    coffeeSponsors.value.length > 0 ||
    chickenSponsors.value.length > 0 ||
    soySponsors.value.length > 0,
)

// 頭像整合邏輯
const getSponsorAvatar = (sponsor) => {
  // 優先使用用戶頭像
  if (sponsor.user?.avatar) {
    return sponsor.user.avatar
  }

  // 其次使用 Ko-fi 提供的頭像
  if (sponsor.avatar) {
    return sponsor.avatar
  }

  // 默認頭像
  return '/images/default-avatar.png'
}

// 用戶名顯示邏輯
const getUsernameDisplay = (sponsor) => {
  // 如果有系統帳戶，顯示 @username 格式
  if (sponsor.user?.username) {
    return `@${sponsor.user.username}`
  }

  // 如果沒有系統帳戶，顯示 ko-fi 的 from_name
  return sponsor.from_name || '匿名用戶'
}

// 分頁邏輯：將贊助者分成多行
const getSponsorPages = (sponsors, maxPerPage = 15) => {
  if (sponsors.length <= maxPerPage) {
    return [sponsors]
  }

  const pages = []
  for (let i = 0; i < sponsors.length; i += maxPerPage) {
    pages.push(sponsors.slice(i, i + maxPerPage))
  }
  return pages
}

// 動態計算每頁最大數量（可選：根據螢幕大小調整）
const getMaxPerPage = () => {
  // 可以根據需要調整這個值
  // 例如：大螢幕顯示更多，小螢幕顯示較少
  switch (true) {
    case window.innerWidth < 768:
      return 5
    case window.innerWidth < 1200:
      return 10
    default:
      return 15
  }
}

// 可配置的 seed 值，用於控制隨機數生成
// 可以修改這個值來測試不同的亂序效果
// 建議的 seed 值：
// 42 - 平衡分布，輕微隨機
// 123 - 更規律的分布
// 456 - 較隨機的分布
// 789 - 非常隨機的分布
// 0 - 完全規律的分布（不推薦）
const shuffleSeed = ref(777)

// 簡單的隨機數生成器（基於 seed）
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 按行打亂贊助者順序，讓不同等級的行交錯顯示
const getShuffledSponsorPages = () => {
  const maxPerPage = getMaxPerPage()

  // 為每個等級的贊助者分頁
  const coffeePages = getSponsorPages(coffeeSponsors.value, maxPerPage).map(
    (page) => ({
      sponsors: page,
      tier: 'coffee',
    }),
  )
  const chickenPages = getSponsorPages(chickenSponsors.value, maxPerPage).map(
    (page) => ({
      sponsors: page,
      tier: 'chicken',
    }),
  )
  const soyPages = getSponsorPages(soySponsors.value, maxPerPage).map(
    (page) => ({
      sponsors: page,
      tier: 'soy',
    }),
  )

  // 合併所有行
  const allPages = [...coffeePages, ...chickenPages, ...soyPages]

  // 打亂行的順序
  const shuffledPages = shufflePagesWithBalance(allPages, shuffleSeed.value)

  // 返回打亂後的行
  return shuffledPages
}

// 智能打亂行順序，確保不同等級的行均勻分布
const shufflePagesWithBalance = (pages, seed = 42) => {
  // 按等級分組行
  const coffeePages = pages.filter((page) => page.tier === 'coffee')
  const chickenPages = pages.filter((page) => page.tier === 'chicken')
  const soyPages = pages.filter((page) => page.tier === 'soy')

  // 計算每個等級的行數比例
  const totalPages = pages.length
  const coffeeRatio = coffeePages.length / totalPages
  const chickenRatio = chickenPages.length / totalPages

  // 創建一個平衡的行序列
  const result = []
  let coffeeIndex = 0,
    chickenIndex = 0,
    soyIndex = 0

  for (let i = 0; i < totalPages; i++) {
    const position = i / totalPages

    // 根據位置和比例決定下一個應該選擇哪個等級的行
    if (position < coffeeRatio && coffeeIndex < coffeePages.length) {
      result.push(coffeePages[coffeeIndex++])
    } else if (
      position < coffeeRatio + chickenRatio &&
      chickenIndex < chickenPages.length
    ) {
      result.push(chickenPages[chickenIndex++])
    } else if (soyIndex < soyPages.length) {
      result.push(soyPages[soyIndex++])
    } else {
      // 如果某個等級的行已經用完，從其他等級補充
      if (coffeeIndex < coffeePages.length) {
        result.push(coffeePages[coffeeIndex++])
      } else if (chickenIndex < chickenPages.length) {
        result.push(chickenPages[chickenIndex++])
      }
    }
  }

  // 進行更強烈的隨機調整，讓效果更明顯
  for (let i = 0; i < result.length - 1; i += 2) {
    const randomValue = seededRandom(seed + i)
    if (randomValue > 0.5) {
      // 降低閾值，增加交換機率
      // 50% 機率交換相鄰行
      ;[result[i], result[i + 1]] = [result[i + 1], result[i]]
    }
  }

  // 額外的隨機調整
  for (let i = 0; i < result.length; i++) {
    const randomValue = seededRandom(seed + i + 100)
    if (randomValue > 0.2) {
      // 80% 機率進行額外交換
      const swapIndex = Math.floor(seededRandom(seed + i + 200) * result.length)
      if (swapIndex !== i && swapIndex < result.length) {
        ;[result[i], result[swapIndex]] = [result[swapIndex], result[i]]
      }
    }
  }
  return result
}

// 動態計算跑馬燈持續時間（基於每頁的贊助者數量）
const getMarqueeDuration = (sponsorCount) => {
  // 基礎時間：每個贊助者 3 秒
  const baseTimePerSponsor = 3
  // 最小時間：15 秒
  const minDuration = 15
  // 最大時間：60 秒
  const maxDuration = 60

  const calculatedDuration = sponsorCount * baseTimePerSponsor
  return Math.max(minDuration, Math.min(maxDuration, calculatedDuration))
}

// 動態計算重複次數
const getMarqueeRepeat = (sponsorCount) => {
  // 如果贊助者很少（1-2個），需要更多重複來填滿螢幕
  if (sponsorCount <= 2) {
    return 6
  }
  // 如果贊助者中等（3-5個），適中重複
  if (sponsorCount <= 5) {
    return 4
  }
  // 如果贊助者很多（6個以上），減少重複避免過度重複
  return 2
}

// 處理贊助者卡片點擊事件
const handleSponsorClick = (sponsor) => {
  // 如果有系統帳戶，跳轉到用戶頁面
  if (sponsor.user?.username) {
    router.push(`/users/${sponsor.user.username}`)
  }
}

// 組件名稱定義
defineOptions({
  name: 'SponsorshipWall',
})

// 開發模式下的調試功能
if (import.meta.env.DEV) {
  // 將測試函數暴露到全局，方便在控制台調試
  window.testShuffleSeed = (seed) => {
    shuffleSeed.value = seed
  }

  // 暴露當前 seed 值到全局
  window.currentShuffleSeed = shuffleSeed
  window.shuffleSeed = shuffleSeed // 直接暴露 ref 對象
}
</script>

<style scoped>
.sponsorship-wall h2 {
  background: linear-gradient(45deg, #ff3399, #a259f7, #45b7d1, #33ff33);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
