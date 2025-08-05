<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 首頁標題與搜尋/上傳 -->
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
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
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-8 lg:px-32">
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
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-32">
      <h2 class="text-center text-3xl font-bold">公告欄</h2>
      <div class="text-center text-gray-500 mb-8">
        最新消息與站務公告將在此處更新，請留意更新情況。
      </div>
      <div class="grid lg:grid-cols-3 gap-4">
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
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-32">
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
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-32">
      <h2 class="text-center text-3xl font-bold">每日迷因</h2>
      <div class="text-center text-gray-500 mb-4">
        點擊按鈕隨機抽一個屬於你今天的迷因吧！
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
    <div class="mb-4 px-4 py-16 flex flex-col items-center gap-4 lg:px-32">
      <div class="flex flex-col lg:flex-row gap-20">
        <div class="flex-1 lg:flex-1">
          <h2 class="text-3xl font-bold mb-4">本月活躍作者</h2>
          <div class="mb-4 text-gray-600 text-base">
            這些是本月最活躍的迷因創作者，他們為平台帶來了豐富多彩的內容。透過他們的創意和分享，讓我們的迷因社群更加精彩。
          </div>
          <Button
            class="w-32 h-16"
            label="建立迷因"
            @click="$router.push('/memes/post')"
          />
        </div>
        <div class="flex-1 lg:flex-1 flex flex-wrap space-y-2">
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
            collapsed
          >
            <template #header>
              <div class="flex items-center gap-2">
                <Avatar
                  :image="user.avatar"
                  :icon="!user.avatar ? 'pi pi-user' : undefined"
                  shape="circle"
                  size="large"
                  :data-user-id="user._id"
                />
                <span class="font-bold">{{
                  user.display_name || user.username
                }}</span>
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
                <span class="text-surface-500 dark:text-surface-400">
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
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              暫無活躍作者
            </h3>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import Card from 'primevue/card'
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

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const topTags = ref([])
const featuredMemes = ref([])
const loading = ref(false)

// 活躍用戶相關狀態
const activeUsers = ref([])
const activeUsersLoading = ref(false)

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
            const authorId =
              typeof parsedMeme.author_id === 'object' &&
              parsedMeme.author_id.$oid
                ? parsedMeme.author_id.$oid
                : parsedMeme.author_id
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
        dailyMemeButtonSeverity.value = 'success'
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

// 載入活躍用戶
const loadActiveUsers = async () => {
  try {
    activeUsersLoading.value = true
    const response = await userService.getActiveUsers(10)

    if (response.data && response.data.success) {
      activeUsers.value = response.data.activeUsers || []

      // 初始化每個用戶的追蹤狀態
      activeUsers.value.forEach((user, index) => {
        activeUsers.value[index].isFollowing = false
        activeUsers.value[index].followLoading = false
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
                  followResponse.data.isFollowing || false
              }
            } catch (error) {
              console.warn(`檢查用戶 ${user._id} 追蹤狀態失敗:`, error)
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

// 獲取每日迷因
const getDailyMeme = async () => {
  if (dailyMemeButtonDisabled.value) {
    return
  }

  dailyMemeButtonDisabled.value = true
  dailyMemeButtonText.value = '抽取中...'
  dailyMemeButtonIcon.value = 'pi pi-spin pi-spinner'
  dailyMemeButtonSeverity.value = 'warning'

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
          const authorId =
            typeof randomMeme.author_id === 'object' &&
            randomMeme.author_id.$oid
              ? randomMeme.author_id.$oid
              : randomMeme.author_id
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
      dailyMemeButtonSeverity.value = 'success'

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

// 初始化
onMounted(async () => {
  // 檢查每日迷因狀態
  await checkDailyMemeStatus()
  await Promise.all([loadTopTags(), loadFeaturedMemes(), loadActiveUsers()])
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
