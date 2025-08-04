<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 首頁標題與搜尋/上傳 -->
    <div class="mb-4 px-32 py-16 flex flex-col items-center gap-8">
      <h1 class="text-5xl font-bold">讓最新的迷因為生活增添風味</h1>
      <p class="text-base mt-1">
        探索網友們精心整理的迷因，用互動的方式參與迷因的定義，讓自己成為最新穎最顛覆的迷因。
      </p>
      <div class="flex flex-wrap justify-center gap-2 mt-4">
        <p>熱門關鍵字：</p>
        <Tag
          v-for="tag in topTags"
          :key="tag._id"
          :value="`#${tag.name}`"
          severity="secondary"
          class="cursor-pointer hover:bg-primary-50"
          @click="handleTagClick(tag)"
        />
      </div>
      <Button
        label="來去看看"
        icon="pi pi-arrow-right"
        class="ml-2 p-button-primary w-48 h-14"
        @click="$router.push('/memes/all')"
      />
    </div>

    <!-- 贊助用戶橫條 -->
    <div class="mb-4 px-32 py-16 flex flex-col items-center gap-8">
      <h2 class="text-center text-3xl font-bold">
        特別感謝請站長喝飲料的乾爹和乾媽！
      </h2>

      <div class="flex flex-wrap justify-center gap-8 mt-2">
        <div v-for="n in 11" :key="n" class="flex items-center gap-4">
          <Avatar icon="pi pi-user" shape="circle" class="mb-1" size="large" />
          <div class="text-xs">
            <h4 class="font-bold text-base">使用者名稱</h4>
            <p class="text-sm">注入了100點快樂</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 公告欄 -->
    <div class="mb-4 px-32 py-16 flex flex-col items-center gap-4">
      <h2 class="text-center text-3xl font-bold">公告欄</h2>
      <div class="text-center text-gray-500 mb-8">
        最新消息與站務公告將在此處更新，請留意更新情況。
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <Card v-for="n in 3" :key="n" class="w-full">
          <template #header>
            <div class="h-60 flex items-center justify-center">
              <img
                src="https://picsum.photos/300/200/?random=10"
                class="w-full h-full object-cover rounded-t-lg"
              />
            </div>
          </template>
          <template #content>
            <div class="mb-2 flex justify-between items-center">
              <h3 class="text-xl font-bold mb-1">標題{{ n }}</h3>
              <Tag value="公告" severity="secondary" />
            </div>
            <div class="text-base text-gray-600 mb-2">
              這裡是公告內容的簡短描述，讓大家快速掌握最新動態。
              如果公告內容較長，可以點擊進入公告頁面。這邊的字數限制在100字以內。
              讓使用者可以快速了解公告內容，並決定是否要點擊進入公告頁面。
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 近期精選迷因 -->
    <div class="mb-4 px-32 py-16 flex flex-col items-center gap-4">
      <h2 class="text-center text-3xl font-bold">近期精選迷因</h2>
      <div class="text-center text-gray-500 mb-8">
        精選迷因將在此處更新，請留意更新情況。
      </div>

      <!-- 載入中狀態 -->
      <div v-if="loading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 迷因列表 -->
      <div
        v-else-if="featuredMemes.length > 0"
        class="grid md:grid-cols-3 gap-4 w-full"
      >
        <MemeCardSlim
          v-for="meme in featuredMemes"
          :key="meme.id"
          :meme="meme"
          @tag-click="onTagClick"
          @show-comments="onShowComments"
          @deleted="loadFeaturedMemes"
        />
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-12">
        <i class="pi pi-image text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無精選迷因</h3>
        <p class="text-gray-500">目前沒有精選迷因，請稍後再試</p>
        <Button
          label="重新載入"
          icon="pi pi-refresh"
          @click="loadFeaturedMemes"
          class="mt-4"
        />
      </div>
    </div>

    <!-- 每日迷因 -->
    <Panel class="mb-4" header="每日迷因">
      <div class="text-center text-gray-500 mb-4">
        點擊按鈕隨機抽一個讓你的小今天充滿迷因吧！
      </div>
      <div class="flex justify-center mb-4">
        <Button label="開始" icon="pi pi-refresh" class="p-button-secondary" />
      </div>
      <Card class="max-w-2xl mx-auto">
        <template #header>
          <div class="bg-gray-200 w-32 h-32 flex items-center justify-center">
            <span class="text-gray-400 text-4xl">🖼️</span>
          </div>
        </template>
        <template #content>
          <div class="flex items-center text-xs text-gray-400 mb-1">
            <span>迷因分類</span>
            <span class="mx-2">|</span>
            <span>2小時前</span>
            <span class="mx-2">|</span>
            <span>艾某某</span>
          </div>
          <div class="font-bold text-xl mb-1">這裡是迷因的名字</div>
          <div class="text-sm text-gray-600">
            這是一個迷因的較長文字或故事，描述內容更豐富，讓大家更有共鳴。
          </div>
        </template>
      </Card>
    </Panel>

    <!-- 本月活躍作者 -->
    <Panel class="mb-4" header="本月活躍作者">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="mb-2 text-gray-600 text-sm">
            這是一個根據貢獻和社交互動計算的榜單，顯示本月最活躍的作者。點擊以查看更多。
          </div>
          <Button label="進去投餵" outlined />
        </div>
        <div class="flex-[2] space-y-2">
          <Card v-for="n in 5" :key="n" class="mb-2">
            <template #header>
              <Avatar icon="pi pi-user" shape="circle" class="mt-1" />
            </template>
            <template #content>
              <div class="font-bold">使用者</div>
              <div class="text-xs text-gray-400 mb-1">本月貢獻{{ n }}篇</div>
              <div class="text-xs text-gray-600">
                這是一個簡短的作者介紹或自我描述，展現其個人特色。
              </div>
            </template>
          </Card>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import MemeCardSlim from '@/components/MemeCardSlim.vue'
import tagService from '@/services/tagService'
import recommendationService from '@/services/recommendationService'
import userService from '@/services/userService'

const router = useRouter()
const toast = useToast()

const topTags = ref([])
const featuredMemes = ref([])
const loading = ref(false)

// 載入熱門標籤
const loadTopTags = async () => {
  try {
    const res = await tagService.getPopular(5) // 只取5個熱門標籤
    topTags.value = res.data.popularTags || []
  } catch (error) {
    console.error('載入熱門標籤失敗:', error)
    topTags.value = []
  }
}

// 載入精選迷因
const loadFeaturedMemes = async () => {
  try {
    loading.value = true

    const response =
      await recommendationService.getInfiniteScrollRecommendations({
        limit: 3, // 只取前3筆
        page: 1,
        clear_cache: true,
      })

    // 處理不同的回應格式
    let recommendations = []
    if (response.data) {
      if (Array.isArray(response.data)) {
        recommendations = response.data
      } else if (response.data.memes) {
        recommendations = response.data.memes
      } else if (response.data.recommendations) {
        recommendations = response.data.recommendations
      } else if (response.data.data) {
        const nestedData = response.data.data
        if (Array.isArray(nestedData)) {
          recommendations = nestedData
        } else if (nestedData.memes) {
          recommendations = nestedData.memes
        } else if (nestedData.recommendations) {
          recommendations = nestedData.recommendations
        } else {
          recommendations = [nestedData]
        }
      } else {
        recommendations = [response.data]
      }
    }

    // 為每個迷因載入作者資訊
    const memesWithAuthors = await Promise.all(
      recommendations.map(async (meme) => {
        try {
          if (meme.author_id) {
            const authorId =
              typeof meme.author_id === 'object' && meme.author_id.$oid
                ? meme.author_id.$oid
                : meme.author_id
            const authorResponse = await userService.get(authorId)
            meme.author = authorResponse.data.user
          } else {
            meme.author = {
              display_name: '匿名用戶',
              username: 'anonymous',
              avatar: null,
            }
          }
          return meme
        } catch (error) {
          console.warn(`載入作者 ${meme.author_id} 失敗:`, error.message)
          meme.author = {
            display_name: '未知用戶',
            username: 'unknown',
            avatar: null,
          }
          return meme
        }
      }),
    )

    featuredMemes.value = memesWithAuthors
  } catch (error) {
    console.error('載入精選迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入精選迷因，請稍後再試',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 處理標籤點擊
const handleTagClick = (tag) => {
  // 跳轉到搜尋頁面並帶入標籤名稱
  router.push({
    path: '/memes/all',
    query: { search: tag.name },
  })
}

// 標籤點擊處理
const onTagClick = (tag) => {
  handleTagClick(tag)
}

// 顯示評論
const onShowComments = (meme) => {
  // 這裡可以打開評論對話框，但首頁通常不需要
  console.log('顯示評論:', meme)
}

// 初始化
onMounted(async () => {
  await Promise.all([loadTopTags(), loadFeaturedMemes()])
})
</script>

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
