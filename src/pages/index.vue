<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="w-full max-w-full space-y-12 page-scroll">
    <!-- 首頁標題與搜尋/上傳 -->
    <VortexBackground
      content-class="top-0 left-0"
      container-class="w-full"
      :particle-count="700"
      :rangeY="300"
      :base-hue="220"
      :base-speed="0.0"
      :range-speed="1.5"
      :base-radius="1"
      :range-radius="2"
    >
      <div class="text-center relative top-14 left-0 z-20">
        <h1 class="mb-2">迷因典－中文圈迷因的終極資料庫</h1>
        <p class="mb-8">
          整理散落各平台的迷因，讓你一眼認出流行迷因。用互動、探索各式各樣的經典，讓網路文化永續傳承！
        </p>
        <div class="flex flex-wrap justify-center gap-2 mt-4 mb-8">
          <p class="text-sm text-gray-500">熱門關鍵字：</p>
          <Tag
            v-for="tag in topTags"
            :key="tag._id"
            :value="`#${tag.name}`"
            severity="primary"
            class="cursor-pointer hover:scale-105 transition-transform"
            @click="handleTagClick(tag)"
          />
        </div>
        <Button
          label="來去看看"
          icon="pi pi-arrow-right"
          class="ml-2 p-button-primary w-48 h-14 text-lg hover:scale-105 transition-transform shadow-lg"
          @click="$router.push('/memes/all')"
        />
      </div>
      <div
        class="relative w-full h-[700px] -top-2 left-0 z-10 flex items-center justify-center"
      >
        <div
          class="w-[676px] max-w-full h-auto rounded-lg overflow-hidden scroll-scale-up"
        >
          <img
            src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756655459/vZ9MbIJ3MzY_yxp12o.png"
            alt="讓我看看"
            class="object-cover w-full h-full"
          />
        </div>
      </div>
      <div
        class="relative w-[1366px] min-h-[620px] -top-[640px] left-1/2 transform -translate-x-1/2 z-5 hidden xl:block"
      >
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756655458/1_MbCyr-5f1ZcamARuAVoKrg_kkukkl.webp"
          alt="卑鄙源之助"
          class="absolute w-60 h-auto rounded-lg left-50 top-0 fade-in-left scroll-fade-out-left"
        />
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756655458/489683234_17900609382167740_2674519705088244709_n_e1u8f4.jpg"
          alt="tralalero tralala"
          class="absolute w-48 h-auto rounded-lg right-50 bottom-0 fade-in-right scroll-fade-out-right"
        />
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756655458/9226c990-1935-11ed-bfe9-1a34c47a8851_s5ctg1.webp"
          alt="Virgil Guardian"
          class="absolute w-80 h-auto rounded-lg left-16 bottom-10 fade-in-left scroll-fade-out-left"
        />
        <img
          src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756655459/3F3F_3F_a7ponm.png"
          alt="冷傲退基佬"
          class="absolute w-60 h-auto rounded-lg right-20 top-4 fade-in-right scroll-fade-out-right"
        />
      </div>
    </VortexBackground>

    <!-- 贊助用戶銘謝 -->
    <div v-if="sponsorsLoading" class="flex justify-center items-center py-8">
      <ProgressSpinner />
      <span class="ml-2">載入贊助者資料中...</span>
    </div>
    <div v-else-if="sponsorsError" class="text-center py-8 text-gray-500">
      <p>載入贊助者資料失敗：{{ sponsorsError }}</p>
    </div>
    <SponsorshipWall
      v-else
      :sponsors="sponsorsData"
      @mounted="onSponsorshipWallMounted"
    />

    <!-- 廣告 -->
    <!-- <div v-if="!isVipUser" class="flex justify-center items-center my-8">
      <AdInline />
    </div> -->

    <!-- 公告欄 -->
    <div
      class="mb-4 px-4 py-24 flex flex-col items-center gap-4 md:px-32 lg:px-16 xl:px-32"
    >
      <div class="text-center mb-8">
        <p class="text-sm text-gray-500 mb-2">Announcements</p>
        <h2 class="text-3xl font-bold">迷因典的重要公告</h2>
        <p class="mt-2">最新消息與站務公告將在此處更新，請留意更新情況。</p>
      </div>
      <!-- 載入中狀態 -->
      <div v-if="announcementsLoading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 公告列表 -->
      <div
        v-else-if="announcements.length > 0"
        class="grid lg:grid-cols-3 gap-4 w-full"
      >
        <AnnouncementCard
          v-for="announcement in announcements"
          :key="announcement._id"
          :announcement="announcement"
        />
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-12">
        <i class="pi pi-bullhorn text-6xl text-gray-300 mb-4"></i>
        <h3 class="mb-2">暫無公告</h3>
        <p class="">目前沒有公告，請稍後再試</p>
        <Button
          label="重新載入"
          icon="pi pi-refresh"
          @click="loadAnnouncements"
          class="mt-4"
        />
      </div>
    </div>

    <!-- 近期精選迷因 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col items-center gap-4 md:px-32 lg:px-16 xl:px-32"
    >
      <div class="text-center mb-8">
        <p class="text-sm text-gray-500 mb-2">Featured</p>
        <h2 class="text-3xl font-bold">近期精選迷因</h2>
        <p class="mt-2">
          迷因長特別精選的迷因將在此處更新，看看最近迷因長喜歡什麼吧！
        </p>
      </div>

      <!-- 載入中狀態 -->
      <div v-if="loading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 迷因列表 -->
      <div
        v-else-if="featuredMemes.length > 0"
        class="grid lg:grid-cols-3 gap-4 w-full"
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
        <h3 class="mb-2">暫無精選迷因</h3>
        <p class="">目前沒有精選迷因，請稍後再試</p>
        <Button
          label="重新載入"
          icon="pi pi-refresh"
          @click="loadFeaturedMemes"
          class="mt-4"
        />
      </div>
    </div>

    <!-- 每日迷因 -->
    <div
      class="min-h-[780px] px-4 py-16 flex flex-col justify-center items-center gap-4 md:px-32 lg:px-16 xl:px-32"
    >
      <div class="text-center mb-4">
        <p class="text-sm text-gray-500 mb-2">Lotttery</p>
        <h2 class="text-3xl font-bold">每日迷因</h2>
        <p class="mt-2">點擊按鈕隨機抽一個屬於你今天的迷因吧！</p>
      </div>
      <div class="flex justify-center mb-4">
        <Button
          :label="dailyMemeButtonText"
          :icon="dailyMemeButtonIcon"
          :severity="dailyMemeButtonSeverity"
          :disabled="dailyMemeButtonDisabled"
          class="w-40 h-16"
          @click="getDailyMeme"
        />
      </div>

      <!-- 載入中狀態 -->
      <div v-if="dailyMemeLoading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- 隨機迷因顯示 -->
      <div v-else-if="dailyMeme" class="w-full max-w-2xl">
        <MemeCard
          :meme="dailyMeme"
          @tag-click="onTagClick"
          @show-comments="onShowComments"
          @deleted="onDailyMemeDeleted"
        />
      </div>
    </div>

    <!-- 本月活躍作者 -->
    <div
      class="mb-4 px-4 py-16 flex flex-col items-center gap-4 md:px-32 lg:px-16 xl:px-32"
    >
      <div class="flex flex-col lg:flex-row gap-20">
        <div class="flex-1 space-y-6 text-left">
          <p class="text-sm text-gray-500 mb-2">Active Users</p>
          <h2 class="text-3xl font-bold mb-2">本月活躍作者</h2>
          <p class="text-base text-gray-600">
            這些是本月最活躍的迷因創作者，他們為平台帶來了豐富多彩的內容。透過他們的創意和分享，讓我們的迷因社群更加精彩。
          </p>
          <Button
            class="w-32 h-16"
            label="建立迷因"
            @click="$router.push('/memes/post')"
          />
        </div>
        <div class="flex-1 space-y-2">
          <!-- 載入中狀態 -->
          <div
            v-if="activeUsersLoading"
            class="w-full flex justify-center py-8"
          >
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="4"
            />
          </div>

          <!-- 活躍用戶列表 -->
          <Panel
            v-else-if="activeUsers.length > 0"
            class="w-full"
            v-for="(user, index) in activeUsers"
            :key="user._id"
            toggleable
          >
            <template #header>
              <div class="flex items-center gap-2 py-2">
                <Avatar
                  :image="user.avatarUrl || user.avatar"
                  shape="circle"
                  size="large"
                  :data-user-id="user._id"
                />
                <router-link
                  v-if="user && (user.username || user._id || user.id)"
                  :to="`/users/${user.username || user._id || user.id}`"
                  class="font-semibold text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors cursor-pointer"
                  >{{ user.display_name || user.username }}
                </router-link>
              </div>
            </template>
            <template #footer>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <Button
                    rounded
                    text
                    @click="followUser(user._id, index)"
                    :disabled="userStore.userId === user._id"
                    :loading="user.followLoading"
                  >
                    <i
                      :class="
                        user.isFollowing
                          ? 'ri-user-follow-fill'
                          : 'ri-user-follow-line'
                      "
                    ></i>
                  </Button>
                  <p class="text-primary-500">
                    {{ user.follower_count || 0 }} 個追蹤者
                  </p>
                </div>
                <span class="text-gray-500 dark:text-gray-400">
                  參與 {{ user.meme_count }} 篇迷因創作
                </span>
              </div>
            </template>
            <template #icons>
              <Menu ref="menu" id="config_menu" :model="items" popup />
            </template>
            <div class="space-y-3">
              <p class="m-0">{{ user.bio || '這位創作者還沒有個人簡介' }}</p>
            </div>
          </Panel>

          <!-- 空狀態 -->
          <div v-else class="w-full text-center py-12">
            <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
            <h3 class="mb-2">暫無活躍作者</h3>
            <p class="text-gray-500">目前沒有活躍作者資料，請稍後再試</p>
            <Button
              label="重新載入"
              icon="pi pi-refresh"
              @click="loadActiveUsers"
              class="mt-4"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 廣告 -->
    <div v-if="!isVipUser" class="flex justify-center items-center my-8">
      <AdInline />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import { handleOAuthCallback } from '@/utils/oauthUtils'

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Panel from 'primevue/panel'
import Menu from 'primevue/menu'
import MemeCardSlim from '@/components/MemeCardSlim.vue'
import tagService from '@/services/tagService'
import recommendationService from '@/services/recommendationService'
import userService from '@/services/userService'
import followService from '@/services/followService'
import MemeCard from '@/components/MemeCard.vue'
import memeService from '@/services/memeService'
// import VortexBackground from '@/components/VortexBackground.vue'
import AdInline from '@/components/AdInline.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import announcementService from '@/services/announcementService'
import { SponsorshipWall } from '@/components/ui/marquee'
import sponsorService from '@/services/sponsorService'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick } from 'vue'
gsap.registerPlugin(ScrollTrigger)
// 除錯用：掛到 window
window._gsap = gsap
window._st = ScrollTrigger

const router = useRouter()
const route = useRoute()
const toast = useToast()
const userStore = useUserStore()

// 贊助者數據
const sponsorsData = ref([])
const sponsorsLoading = ref(false)
const sponsorsError = ref(null)

// VIP 用戶判定
const isVipUser = computed(() => {
  return userStore.role === 'vip'
})

const topTags = ref([])
const featuredMemes = ref([])
const loading = ref(false)

// 活躍用戶相關狀態
const activeUsers = ref([])
const activeUsersLoading = ref(false)

// 公告相關狀態
const announcements = ref([])
const announcementsLoading = ref(false)

// Menu items for user actions
const items = ref([
  {
    label: '查看個人資料',
    icon: 'pi pi-user',
    command: () => {
      // 可以導航到用戶個人資料頁面
    },
  },
  {
    label: '查看迷因作品',
    icon: 'pi pi-images',
    command: () => {
      // 可以導航到用戶的迷因列表
    },
  },
])

// Daily meme state
const dailyMeme = ref(null)
const dailyMemeLoading = ref(false)
const dailyMemeButtonDisabled = ref(false)

// Text and icon for the daily meme button
const dailyMemeButtonText = ref('開始')
const dailyMemeButtonIcon = ref('pi pi-refresh')
const dailyMemeButtonSeverity = ref('primary')

// 檢查今天是否已經抽取過迷因
const checkDailyMemeStatus = async () => {
  const today = new Date().toDateString()
  const lastMemeDate = localStorage.getItem('dailyMemeDate')

  if (lastMemeDate === today) {
    // 今天已經抽取過，檢查是否有儲存的迷因資料
    const savedMeme = localStorage.getItem('dailyMemeData')
    if (savedMeme) {
      try {
        const parsedMeme = JSON.parse(savedMeme)

        // 確保有作者資訊
        if (parsedMeme.author) {
          // 已經有作者資訊，直接使用
        } else if (parsedMeme.author_id) {
          try {
            let authorId = parsedMeme.author_id
            if (typeof authorId === 'object') {
              if (authorId.$oid) {
                authorId = authorId.$oid
              } else if (authorId._id) {
                authorId = authorId._id
              } else {
                throw new Error('無法解析作者ID')
              }
            }
            if (!authorId || typeof authorId !== 'string') {
              throw new Error('無效的作者ID')
            }
            const authorResponse = await userService.get(authorId)
            parsedMeme.author = authorResponse.data.user
          } catch (error) {
            console.warn('載入儲存迷因的作者資訊失敗:', error)
            parsedMeme.author = {
              display_name: '未知用戶',
              username: 'unknown',
              avatar: null,
            }
          }
        } else {
          parsedMeme.author = {
            display_name: '匿名用戶',
            username: 'anonymous',
            avatar: null,
          }
        }

        dailyMeme.value = parsedMeme
        dailyMemeButtonDisabled.value = true
        dailyMemeButtonText.value = '今日已抽取'
        dailyMemeButtonIcon.value = 'pi pi-check'
        dailyMemeButtonSeverity.value = 'primary'
      } catch (error) {
        console.error('解析儲存的迷因資料失敗:', error)
        // 如果解析失敗，清除儲存資料
        localStorage.removeItem('dailyMemeDate')
        localStorage.removeItem('dailyMemeData')
      }
    }
  } else {
    // 今天還沒抽取過，重置狀態
    dailyMeme.value = null
    dailyMemeButtonDisabled.value = false
    dailyMemeButtonText.value = '開始'
    dailyMemeButtonIcon.value = 'pi pi-refresh'
    dailyMemeButtonSeverity.value = 'primary'
  }
}

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

// 載入公告
const loadAnnouncements = async () => {
  try {
    announcementsLoading.value = true
    const response = await announcementService.getAll({
      status: 'public',
      limit: 3,
      page: 1,
      sort: '-createdAt', // 按創建時間降序排列，顯示最新公告
    })

    if (response.data && response.data.success) {
      announcements.value = response.data.data || []
    } else {
      announcements.value = []
    }
  } catch (error) {
    console.error('載入公告失敗:', error)
    // 如果後端無法連接，使用模擬資料
    announcements.value = [
      {
        _id: '1',
        title: '系統維護通知',
        content:
          '親愛的用戶們，我們將於本週末進行系統維護，屆時網站可能會暫時無法訪問。維護時間預計為 2 小時，我們會盡快完成維護工作。感謝您的理解與支持！',
        content_format: 'plain',
        category: 'system',
        status: 'public',
        pinned: true,
        image:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: '新功能上線',
        content:
          '我們很高興地宣布，迷因編輯器的新功能已經上線！現在您可以更方便地編輯和分享您的迷因作品。新功能包括：1. 更直觀的編輯介面 2. 更多濾鏡效果 3. 一鍵分享功能。快來試試看吧！',
        content_format: 'plain',
        category: 'update',
        status: 'public',
        pinned: false,
        image:
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        _id: '3',
        title: '社群活動預告',
        content:
          '下個月我們將舉辦第一屆迷因創作大賽！參賽者將有機會獲得豐厚獎品，包括現金獎勵和平台 VIP 會員資格。比賽詳情將在近期公布，敬請期待！',
        content_format: 'plain',
        category: 'activity',
        status: 'public',
        pinned: false,
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2天前
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        _id: '4',
        title: '平台更新公告',
        content: {
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '我們很高興宣布' },
                { type: 'text', text: '公告系統', marks: [{ type: 'bold' }] },
                { type: 'text', text: '已經完成升級！' },
              ],
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '現在支援' },
                {
                  type: 'text',
                  text: '富文本編輯',
                  marks: [{ type: 'italic' }],
                },
                { type: 'text', text: '功能，包括' },
                {
                  type: 'text',
                  text: '連結',
                  marks: [
                    { type: 'link', attrs: { href: 'https://memedam.com' } },
                  ],
                },
                { type: 'text', text: '和各種格式化選項。' },
              ],
            },
          ],
        },
        content_format: 'json',
        category: 'update',
        status: 'public',
        pinned: false,
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3天前
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ]
  } finally {
    announcementsLoading.value = false
  }
}

// 載入贊助者資料
const loadSponsors = async () => {
  try {
    sponsorsLoading.value = true
    sponsorsError.value = null

    const response = await sponsorService.getPublicSponsors({
      sort_by: 'createdAt',
      sort_dir: 'desc',
    })

    if (response.data && response.data.success) {
      sponsorsData.value = response.data.data || []
    } else {
      console.warn('⚠️ API回應格式錯誤或失敗:', response.data)
      sponsorsData.value = []
    }
  } catch (error) {
    console.error('❌ 載入贊助者資料失敗:', error)
    sponsorsError.value = error.message || '載入贊助者資料失敗'
    sponsorsData.value = []
  } finally {
    sponsorsLoading.value = false
  }
}

// 贊助牆組件掛載完成
const onSponsorshipWallMounted = () => {
  // 組件已成功掛載
}

// 載入活躍用戶
const loadActiveUsers = async () => {
  try {
    activeUsersLoading.value = true
    const response = await userService.getActiveUsers(10)

    if (response.data && response.data.success) {
      activeUsers.value = response.data.activeUsers || []

      // 初始化每個用戶的追蹤狀態
      activeUsers.value.forEach((user, index) => {
        activeUsers.value[index].followLoading = false
        // 總是初始化 isFollowing 為 false，這樣如果 API 調用失敗，UI 也會顯示正確狀態
        activeUsers.value[index].isFollowing = false
      })

      // 如果用戶已登入，檢查每個用戶的追蹤狀態
      if (userStore.isLoggedIn) {
        await Promise.all(
          activeUsers.value.map(async (user, index) => {
            try {
              // 跳過自己的追蹤狀態檢查
              if (user._id === userStore.userId) {
                activeUsers.value[index].isFollowing = false
                return
              }

              const followResponse = await followService.getFollowStatus(
                user._id,
              )
              if (followResponse.data && followResponse.data.success) {
                activeUsers.value[index].isFollowing =
                  followResponse.data.data?.is_following || false
              } else {
                // API 調用成功但回應格式不正確，保持原有狀態
                console.warn(
                  `檢查用戶 ${user._id} 追蹤狀態回應格式錯誤:`,
                  followResponse,
                )
              }
            } catch (error) {
              console.warn(`檢查用戶 ${user._id} 追蹤狀態失敗:`, error)
              // 錯誤時將 isFollowing 設為 false，確保 UI 顯示正確狀態
              activeUsers.value[index].isFollowing = false
            }
          }),
        )
      }
    } else {
      activeUsers.value = []
    }
  } catch (error) {
    console.error('載入活躍用戶失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入活躍用戶資料，請稍後再試',
      life: 3000,
    })
    activeUsers.value = []
  } finally {
    activeUsersLoading.value = false
  }
}

// 追蹤用戶
const followUser = async (userId, index) => {
  try {
    // 檢查是否已登入
    if (!userStore.isLoggedIn) {
      toast.add({
        severity: 'info',
        summary: '需要登入',
        detail: '請先登入後再進行追蹤操作',
        life: 3000,
      })
      // 跳轉到登入頁面
      router.push('/login')
      return
    }

    // 檢查是否追蹤自己
    if (userId === userStore.userId) {
      toast.add({
        severity: 'warn',
        summary: '無法追蹤',
        detail: '您無法追蹤自己',
        life: 3000,
      })
      return
    }

    // 設定載入狀態
    activeUsers.value[index].followLoading = true

    // 調用追蹤API
    const response = await followService.toggleFollow(userId)

    if (response.data && response.data.success) {
      // 根據 API 回應的 action 欄位判斷新的追蹤狀態
      const newFollowStatus = response.data.action === 'followed'

      // 更新本地狀態
      activeUsers.value[index].isFollowing = newFollowStatus

      // 更新追蹤人數
      if (newFollowStatus) {
        // 開始追蹤，增加追蹤人數
        activeUsers.value[index].follower_count =
          (activeUsers.value[index].follower_count || 0) + 1
      } else {
        // 取消追蹤，減少追蹤人數
        activeUsers.value[index].follower_count = Math.max(
          (activeUsers.value[index].follower_count || 0) - 1,
          0,
        )
      }

      toast.add({
        severity: 'success',
        summary: '操作成功',
        detail: newFollowStatus ? '已追蹤用戶' : '已取消追蹤',
        life: 2000,
      })
    } else {
      throw new Error('API回應格式錯誤')
    }
  } catch (error) {
    console.error('追蹤用戶失敗:', error)

    // 根據錯誤類型顯示不同訊息
    let errorMessage = '追蹤操作失敗，請稍後再試'
    if (error.response?.status === 401) {
      errorMessage = '請先登入後再進行追蹤操作'
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || '操作失敗'
    }

    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    // 清除載入狀態
    activeUsers.value[index].followLoading = false
  }
}

// 載入精選迷因（直接從後端獲取精選迷因）
const loadFeaturedMemes = async () => {
  try {
    loading.value = true

    const response = await recommendationService.getFeaturedMemes({
      limit: 3,
      page: 1,
    })

    // 處理回應格式
    let memes = []
    if (response.data && response.data.success && response.data.data) {
      if (Array.isArray(response.data.data.memes)) {
        memes = response.data.data.memes
      } else if (Array.isArray(response.data.data)) {
        memes = response.data.data
      }
    }

    // 為每個迷因處理作者資訊（後端已經 populate 了）
    const memesWithAuthors = memes.map((meme) => {
      // 如果後端已經提供了作者資訊，直接使用
      if (
        meme.author_id &&
        typeof meme.author_id === 'object' &&
        meme.author_id.display_name
      ) {
        meme.author = {
          display_name: meme.author_id.display_name,
          username: meme.author_id.username,
          avatar: meme.author_id.avatar,
        }
        delete meme.author_id
      } else if (meme.author) {
        // 已經有作者資訊，保持不變
      } else {
        // 沒有作者資訊，設置預設值
        meme.author = {
          display_name: '未知用戶',
          username: 'unknown',
          avatar: null,
        }
      }
      return meme
    })

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

// 獲取每日迷因
const getDailyMeme = async () => {
  if (dailyMemeButtonDisabled.value) {
    return
  }

  dailyMemeButtonDisabled.value = true
  dailyMemeButtonText.value = '抽取中...'
  dailyMemeButtonIcon.value = 'pi pi-spin pi-spinner'
  dailyMemeButtonSeverity.value = 'warn'

  try {
    dailyMemeLoading.value = true
    const response = await memeService.getRandom()

    // 處理不同的資料格式
    let memes = []
    if (response.data) {
      if (Array.isArray(response.data)) {
        memes = response.data
      } else if (response.data.memes && Array.isArray(response.data.memes)) {
        memes = response.data.memes
      } else if (response.data.data && Array.isArray(response.data.data)) {
        memes = response.data.data
      } else if (response.data.meme) {
        // 如果後端直接回傳單一迷因
        memes = [response.data.meme]
      } else if (typeof response.data === 'object' && response.data.id) {
        // 如果後端直接回傳迷因物件
        memes = [response.data]
      } else if (
        response.data.success &&
        response.data.data &&
        response.data.data.meme
      ) {
        // 處理後端回傳的標準格式：{success: true, data: {meme: {...}}}
        memes = [response.data.data.meme]
      } else {
        console.warn('無法識別的資料格式:', response.data)
        memes = []
      }
    }

    if (memes.length > 0) {
      // 隨機選擇一個迷因
      const randomIndex = Math.floor(Math.random() * memes.length)
      const randomMeme = memes[randomIndex]

      // 載入作者資訊
      if (randomMeme.author) {
        // 後端已經提供了作者資訊
      } else if (randomMeme.author_id) {
        try {
          let authorId = randomMeme.author_id
          if (typeof authorId === 'object') {
            if (authorId.$oid) {
              authorId = authorId.$oid
            } else if (authorId._id) {
              authorId = authorId._id
            } else {
              throw new Error('無法解析作者ID')
            }
          }
          if (!authorId || typeof authorId !== 'string') {
            throw new Error('無效的作者ID')
          }
          const authorResponse = await userService.get(authorId)
          randomMeme.author = authorResponse.data.user
        } catch (error) {
          console.warn('載入作者資訊失敗:', error)
          randomMeme.author = {
            display_name: '未知用戶',
            username: 'unknown',
            avatar: null,
          }
        }
      } else {
        randomMeme.author = {
          display_name: '匿名用戶',
          username: 'anonymous',
          avatar: null,
        }
      }

      dailyMeme.value = randomMeme

      // 儲存今日迷因資料
      const today = new Date().toDateString()
      localStorage.setItem('dailyMemeDate', today)
      localStorage.setItem('dailyMemeData', JSON.stringify(randomMeme))

      // 更新按鈕狀態
      dailyMemeButtonText.value = '今日已抽取'
      dailyMemeButtonIcon.value = 'pi pi-check'
      dailyMemeButtonSeverity.value = 'primary'

      toast.add({
        severity: 'success',
        summary: '抽取成功',
        detail: '今天的迷因已為您準備好了！',
        life: 3000,
      })
    } else {
      dailyMeme.value = null
      toast.add({
        severity: 'error',
        summary: '抽取失敗',
        detail: '無法獲取隨機迷因，請稍後再試',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('獲取每日迷因失敗:', error)
    dailyMeme.value = null
    toast.add({
      severity: 'error',
      summary: '抽取失敗',
      detail: '無法獲取隨機迷因，請稍後再試',
      life: 3000,
    })
  } finally {
    dailyMemeLoading.value = false
  }
}

// 每日迷因刪除處理
const onDailyMemeDeleted = () => {
  dailyMeme.value = null
  // 清除儲存的資料
  localStorage.removeItem('dailyMemeDate')
  localStorage.removeItem('dailyMemeData')
  // 重置按鈕狀態
  dailyMemeButtonDisabled.value = false
  dailyMemeButtonText.value = '開始'
  dailyMemeButtonIcon.value = 'pi pi-refresh'
  dailyMemeButtonSeverity.value = 'primary'
}

// 處理 OAuth 回調
const handleOAuthCallbackOnMount = async () => {
  // 只在首頁載入時處理 OAuth 回調
  if (route.query.token || route.query.error) {
    await handleOAuthCallback(route, router, userStore, toast)
  }
}

// GSAP 動畫初始化
const initGSAPAnimations = () => {
  // 確保 DOM 已經渲染完成
  nextTick(() => {
    // 淡入動畫
    gsap.from('.fade-in-left', {
      opacity: 0,
      x: -100,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.5,
    })

    gsap.from('.fade-in-right', {
      opacity: 0,
      x: 100,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.5,
    })

    // 滾動縮放動畫
    gsap.from('.scale-up', {
      width: '540px',
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
    })

    const scroller = document.querySelector('.page-scroll')

    gsap.to('.scroll-scale-up', {
      scrollTrigger: {
        trigger: '.scroll-scale-up',
        scroller,
        start: 'top 25%',
        end: 'bottom 0%',
        scrub: 1,
      },
      width: '1024px',
      transform: 'translateY(20%)',
      opacity: 0,
      duration: 1,
    })

    gsap.utils.toArray('.scroll-fade-out-left').forEach((el) => {
      gsap.fromTo(
        el,
        { x: 0, opacity: 1 },
        {
          x: -100,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 20%',
            end: '+=25%',
            scrub: true,
          },
        },
      )
    })

    gsap.utils.toArray('.scroll-fade-out-right').forEach((el) => {
      gsap.fromTo(
        el,
        { x: 0, opacity: 1 },
        {
          x: 100,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 20%',
            end: '+=25%',
            scrub: true,
          },
        },
      )
    })
  })
}

// 監聽贊助者資料變化
watch(
  () => sponsorsData.value,
  (_newData, _oldData) => {
    // 資料已更新
  },
  { deep: true },
)

// 監聽登入狀態變化，重新載入追蹤狀態
watch(
  () => userStore.isLoggedIn,
  async (newIsLoggedIn, oldIsLoggedIn) => {
    // 當用戶從未登入變為已登入時，重新載入活躍用戶的追蹤狀態
    if (newIsLoggedIn && !oldIsLoggedIn && activeUsers.value.length > 0) {
      await loadActiveUsers()
    }
  },
)

// 初始化
onMounted(async () => {
  // 處理 OAuth 回調
  await handleOAuthCallbackOnMount()

  // 檢查每日迷因狀態
  await checkDailyMemeStatus()
  await Promise.all([
    loadTopTags(),
    loadFeaturedMemes(),
    loadActiveUsers(),
    loadAnnouncements(),
    loadSponsors(),
  ])

  // 初始化 GSAP 動畫
  initGSAPAnimations()
})
</script>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.page-scroll {
  height: 100vh;
  overflow: auto;
  position: relative; /* 讓 markers 有定位上下文 */
}
</style>

<route lang="yaml">
meta:
  title: '首頁'
  description: '迷因典 MemeDam：探索最新熱門迷因、精選內容、每日抽迷因與活躍創作者，立即加入分享與互動！'
  login: ''
  admin: false
</route>
