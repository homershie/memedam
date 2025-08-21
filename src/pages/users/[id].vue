<template>
  <div class="relative">
    <!-- 背景圖片 -->
    <div class="w-full z-0 relative top-0 left-0 h-60">
      <img
        src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1755748262/announcements/ftwo79lbkiwcp0m2ov3n.jpg"
        alt="banner"
        class="w-full h-full object-cover rounded-b-2xl"
      />
    </div>

    <!-- 內容區域 -->
    <div class="min-h-fit px-8 pt-8 mb-20 mx-auto space-y-6 relative -top-36">
      <!-- 用戶資訊頁首 -->
      <div class="mx-auto px-4 py-8">
        <div class="flex flex-col items-center gap-8">
          <!-- 用戶頭像 -->
          <div>
            <Avatar
              :image="userProfile?.avatar"
              shape="circle"
              size="xlarge"
              class="border-3 border-surface-200 w-28 h-28"
            />
          </div>

          <!-- 用戶資訊 -->
          <div class="text-center md:text-left">
            <div class="text-center">
              <h2 class="text-3xl">
                {{
                  userProfile?.display_name || userProfile?.username || '用戶'
                }}
              </h2>
              <p>@{{ userProfile?.username || 'username' }}</p>
            </div>
          </div>

          <!-- 統計數據 -->
          <div class="w-full flex flex-row justify-center gap-20">
            <div class="flex flex-col items-center justify-center rounded-xl">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >關注數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.following_count || 0
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-xl">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >粉絲數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.follower_count || 0
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-xl">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >貼文數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.meme_count || memes.length
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-xl">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >收藏數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.collection_count || 0
              }}</span>
            </div>
          </div>

          <!-- 用戶描述 -->
          <div v-if="userProfile?.bio">
            <p class="text-surface-700 max-w-2xl">
              {{ userProfile.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- 內容區域 -->
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- 標籤導航 -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <!-- 使用 PrimeVue Tabs 作為導航選單 -->
            <Tabs :value="activeTab" @update:value="activeTab = $event">
              <TabList class="border-b-0">
                <Tab
                  v-for="tab in tabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="py-4 px-2 font-medium text-sm transition-colors"
                >
                  <i v-if="tab.icon" :class="[tab.icon, 'mr-2']"></i>
                  {{ tab.label }}
                </Tab>
              </TabList>
            </Tabs>

            <!-- 搜索和排序 -->
            <div class="flex items-center gap-4">
              <div class="relative">
                <InputText
                  v-model="searchQuery"
                  placeholder="搜尋"
                  class="pl-10 pr-4 py-2 w-64"
                />
                <i
                  class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
                ></i>
              </div>
              <Dropdown
                v-model="sortOrder"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="排序"
                class="w-32"
              />
            </div>
          </div>
        </div>

        <!-- 載入中狀態 -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <MemeCardSlimSkeleton v-for="n in 6" :key="n" />
        </div>

        <!-- 迷因列表 -->
        <div
          v-else-if="filteredMemes.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <MemeCardSlim
            v-for="meme in filteredMemes"
            :key="meme.id || meme._id"
            :meme="meme"
            @tag-click="handleTagClick"
          />

          <!-- 無限滾動觸發元素 -->
          <div v-if="infiniteHasMore" ref="triggerRef" class="h-4 w-full">
            <div
              v-if="infiniteLoading"
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8"
            >
              <MemeCardSlimSkeleton v-for="n in 6" :key="`infinite-${n}`" />
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="text-center py-20">
          <div class="mb-4">
            <i class="pi pi-inbox text-6xl text-surface-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-surface-600 mb-2">
            {{ getEmptyStateMessage() }}
          </h3>
          <p class="text-surface-500">
            {{ getEmptyStateDescription() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { debounce } from 'lodash'
import Avatar from 'primevue/avatar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import MemeCardSlim from '@/components/MemeCardSlim.vue'
import MemeCardSlimSkeleton from '@/components/MemeCardSlimSkeleton.vue'
import userService from '@/services/userService'
import memeService from '@/services/memeService'
import collectionService from '@/services/collectionService'
import likeService from '@/services/likeService'
import followService from '@/services/followService'
import { useInfiniteScrollWrapper } from '@/composables/useInfiniteScroll'

// 組件名稱 (修復linter錯誤)
defineOptions({
  name: 'UserProfile',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// 響應式數據
const userProfile = ref(null)
const userStats = ref({})
const memes = ref([])
const loading = ref(true)
const hasMore = ref(true)
const currentPage = ref(1)
const searchQuery = ref('')
const sortOrder = ref('comprehensive')
const activeTab = ref('posts')

// 用戶資訊快取，避免重複載入相同用戶的資訊
const userCache = ref(new Map())

// 智能載入用戶資訊的輔助函數
const loadUserInfo = async (authorId) => {
  // 如果快取中已有該用戶資訊，直接返回
  if (userCache.value.has(authorId)) {
    return userCache.value.get(authorId)
  }

  // 如果是當前頁面的用戶，使用已載入的資訊
  if (authorId === userId.value && userProfile.value) {
    const userInfo = {
      _id: userProfile.value._id || userId.value,
      username: userProfile.value.username || 'unknown',
      display_name: userProfile.value.display_name || '未知用戶',
      avatar: userProfile.value.avatar || null,
    }
    userCache.value.set(authorId, userInfo)
    return userInfo
  }

  try {
    // 載入用戶資訊
    const authorResponse = await userService.get(authorId)
    const userInfo = authorResponse.data.user || authorResponse.data

    // 快取用戶資訊
    userCache.value.set(authorId, userInfo)
    return userInfo
  } catch (error) {
    console.warn(`載入作者 ${authorId} 失敗:`, error.message)
    // 設定預設值
    const defaultUserInfo = {
      _id: authorId,
      display_name: '未知用戶',
      username: 'unknown',
      avatar: null,
    }
    userCache.value.set(authorId, defaultUserInfo)
    return defaultUserInfo
  }
}

// 標籤配置
const tabs = ref([
  { key: 'posts', label: '貼文', icon: 'pi pi-th-large' },
  { key: 'liked', label: '收藏', icon: 'pi pi-bookmark' },
  { key: 'collected', label: '已按讚', icon: 'pi pi-thumbs-up' },
  { key: 'about', label: '關於', icon: 'pi pi-info-circle' },
])

// 排序選項
const sortOptions = computed(() => {
  const baseOptions = [
    { label: '綜合排序', value: 'comprehensive' },
    { label: '最新', value: 'createdAt' },
    { label: '最舊', value: 'createdAt_asc' },
    { label: '最熱門', value: 'popularity' },
    { label: '最少人看', value: 'popularity_asc' },
    { label: '互動數', value: 'quality' },
    { label: '最少互動', value: 'quality_asc' },
  ]

  // 只有在搜尋時才顯示相關性選項
  if (searchQuery.value.trim()) {
    baseOptions.push({ label: '相關性', value: 'relevance' })
  }

  return baseOptions
})

// 計算屬性
const userId = computed(() => route.params.id)

const filteredMemes = computed(() => {
  // 直接返回 memes，因為搜尋和排序現在由後端處理
  return memes.value
})

// 載入用戶資料
const loadUserProfile = async () => {
  try {
    const response = await userService.get(userId.value)
    if (response.data) {
      // 處理可能的資料結構差異，參考 all.vue 中的做法
      userProfile.value = response.data.user || response.data
    }
  } catch (error) {
    console.error('載入用戶資料失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法載入用戶資料',
      life: 3000,
    })

    // 設定預設值以防止頁面崩潰
    userProfile.value = {
      display_name: '未知用戶',
      username: 'unknown',
      avatar: null,
      bio: '',
    }
  }
}

// 載入用戶統計資料
const loadUserStats = async () => {
  try {
    // 獲取追隨相關統計資訊
    const followStatsResponse = await followService.getStats(userId.value)
    const followStats = followStatsResponse.data?.data || {}

    // 獲取用戶相關統計資訊
    const userStatsResponse = await userService.getStats(userId.value)
    const userStatsData = userStatsResponse.data?.data || {}

    // 合併統計資訊
    userStats.value = {
      ...userStatsData,
      follower_count: followStats.follower_count || 0,
      following_count: followStats.following_count || 0,
    }
  } catch (error) {
    console.error('載入用戶統計失敗:', error)
    // 設定預設值
    userStats.value = {
      follower_count: 0,
      following_count: 0,
      meme_count: 0,
      collection_count: 0,
      total_likes_received: 0,
      comment_count: 0,
      share_count: 0,
    }
  }
}

// 載入用戶迷因
const loadUserMemes = async (reset = false) => {
  try {
    if (reset) {
      currentPage.value = 1
      memes.value = []
      hasMore.value = true
    }

    const params = {
      page: currentPage.value,
      limit: 20, // 增加每次載入的數量，提高效率
      author: userId.value, // 直接按作者篩選，避免前端篩選
    }

    let response

    // 如果有搜尋關鍵字
    if (searchQuery.value.trim()) {
      // 使用搜尋 API（後端支援 author 與排序，前端不再手動過濾）
      const searchParams = {
        ...params,
        useAdvancedSearch: 'true',
        sort: sortOrder.value,
      }
      response = await memeService.search(searchQuery.value, searchParams)
    } else {
      // 使用一般 API，添加排序參數
      const getAllParams = {
        ...params,
        sort: sortOrder.value, // 添加排序參數
        useAdvancedSearch: 'true', // 強制使用進階搜尋以確保排序正確
      }
      response = await memeService.getAll(getAllParams)
    }

    if (response.data) {
      const allMemes = Array.isArray(response.data)
        ? response.data
        : response.data.memes || response.data.data || []

      // 在用戶頁面中，所有迷因都屬於同一個用戶，直接使用當前用戶資訊
      const memesWithAuthors = allMemes.map((meme) => {
        // 使用當前頁面的用戶資訊作為作者資訊
        meme.author = {
          _id: userProfile.value?._id || userId.value,
          username: userProfile.value?.username || 'unknown',
          display_name: userProfile.value?.display_name || '未知用戶',
          avatar: userProfile.value?.avatar || null,
        }
        return meme
      })

      // 由於已經在後端按作者篩選，這裡不需要再次篩選
      const userMemes = memesWithAuthors

      if (reset) {
        memes.value = userMemes
      } else {
        // 避免重複添加相同的迷因
        const existingIds = memes.value.map((m) => m._id || m.id)
        const newMemes = userMemes.filter(
          (meme) => !existingIds.includes(meme._id || meme.id),
        )
        memes.value.push(...newMemes)
      }

      // 修正：使用API返回的分頁資訊來判斷是否還有更多數據
      const pagination = response.data.pagination
      if (pagination) {
        hasMore.value = pagination.hasNext || false
      } else {
        // 如果沒有分頁資訊，則基於返回的數據量判斷
        hasMore.value = allMemes.length >= params.limit
      }

      if (hasMore.value) {
        currentPage.value++
      }
    }
  } catch (error) {
    console.error('載入用戶迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法載入迷因內容',
      life: 3000,
    })
  }
}

// 無限滾動載入函數
const loadMoreContent = async () => {
  try {
    // 根據當前標籤頁調用對應的載入函數
    switch (activeTab.value) {
      case 'posts':
        await loadUserMemes(false)
        break
      case 'liked':
        await loadUserCollections(false)
        break
      case 'collected':
        await loadUserLikedMemes(false)
        break
      default:
        await loadUserMemes(false)
    }

    // 更新無限滾動狀態
    updateLoadingState(false, hasMore.value)
  } catch (error) {
    console.error('載入更多內容失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入更多內容失敗',
      life: 3000,
    })
    updateLoadingState(false, false)
  }
}

// 使用無限滾動組合式函數
const {
  triggerRef,
  isLoading: infiniteLoading,
  hasMore: infiniteHasMore,
  updateLoadingState,
  resetState,
} = useInfiniteScrollWrapper(loadMoreContent, {
  distance: 10,
  interval: 100,
})

// 組件掛載時載入初始數據
onMounted(() => {
  loadInitialData()
})

// 載入初始數據
const loadInitialData = async () => {
  try {
    await Promise.all([loadUserProfile(), loadUserStats(), loadUserMemes(true)])
  } catch (error) {
    console.error('載入初始數據失敗:', error)
  } finally {
    loading.value = false
  }
}

// 載入用戶收藏的迷因
const loadUserCollections = async (reset = false) => {
  try {
    if (reset) {
      currentPage.value = 1
      memes.value = []
      hasMore.value = true
    }

    // 獲取用戶的收藏記錄
    const collectionsResponse = await collectionService.getAll()
    const userCollections = collectionsResponse.data.filter(
      (collection) => collection.user_id === userId.value,
    )

    // 分頁處理收藏記錄
    const pageSize = 6
    const startIndex = (currentPage.value - 1) * pageSize
    const endIndex = startIndex + pageSize
    const pagedCollections = userCollections.slice(startIndex, endIndex)

    if (pagedCollections.length > 0) {
      const memesWithAuthors = await Promise.all(
        pagedCollections.map(async (collection) => {
          try {
            const memeResponse = await memeService.get(collection.meme_id)
            const meme = memeResponse.data

            // 載入作者資訊（使用快取機制）
            if (meme.author_id) {
              const authorId =
                typeof meme.author_id === 'object' && meme.author_id.$oid
                  ? meme.author_id.$oid
                  : meme.author_id
              meme.author = await loadUserInfo(authorId)
            } else {
              meme.author = {
                display_name: '匿名用戶',
                username: 'anonymous',
                avatar: null,
              }
            }
            return meme
          } catch (error) {
            console.warn(
              `載入收藏迷因 ${collection.meme_id} 失敗:`,
              error.message,
            )
            return null
          }
        }),
      )

      const validMemes = memesWithAuthors.filter((meme) => meme !== null)

      if (reset) {
        memes.value = validMemes
      } else {
        // 避免重複添加相同的迷因
        const existingIds = memes.value.map((m) => m._id || m.id)
        const newMemes = validMemes.filter(
          (meme) => !existingIds.includes(meme._id || meme.id),
        )
        memes.value.push(...newMemes)
      }

      // 判斷是否還有更多數據
      hasMore.value = endIndex < userCollections.length
      if (hasMore.value) {
        currentPage.value++
      }
    } else {
      if (reset) {
        memes.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    console.error('載入用戶收藏失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法載入收藏內容',
      life: 3000,
    })
  }
}

// 載入用戶按讚的迷因
const loadUserLikedMemes = async (reset = false) => {
  try {
    if (reset) {
      currentPage.value = 1
      memes.value = []
      hasMore.value = true
    }

    // 獲取用戶的按讚記錄
    const likesResponse = await likeService.getAll()
    const userLikes = likesResponse.data.filter(
      (like) => like.user_id === userId.value,
    )

    // 分頁處理按讚記錄
    const pageSize = 6
    const startIndex = (currentPage.value - 1) * pageSize
    const endIndex = startIndex + pageSize
    const pagedLikes = userLikes.slice(startIndex, endIndex)

    if (pagedLikes.length > 0) {
      const memesWithAuthors = await Promise.all(
        pagedLikes.map(async (like) => {
          try {
            const memeResponse = await memeService.get(like.meme_id)
            const meme = memeResponse.data

            // 載入作者資訊（使用快取機制）
            if (meme.author_id) {
              const authorId =
                typeof meme.author_id === 'object' && meme.author_id.$oid
                  ? meme.author_id.$oid
                  : meme.author_id
              meme.author = await loadUserInfo(authorId)
            } else {
              meme.author = {
                display_name: '匿名用戶',
                username: 'anonymous',
                avatar: null,
              }
            }
            return meme
          } catch (error) {
            console.warn(`載入按讚迷因 ${like.meme_id} 失敗:`, error.message)
            return null
          }
        }),
      )

      const validMemes = memesWithAuthors.filter((meme) => meme !== null)

      if (reset) {
        memes.value = validMemes
      } else {
        // 避免重複添加相同的迷因
        const existingIds = memes.value.map((m) => m._id || m.id)
        const newMemes = validMemes.filter(
          (meme) => !existingIds.includes(meme._id || meme.id),
        )
        memes.value.push(...newMemes)
      }

      // 判斷是否還有更多數據
      hasMore.value = endIndex < userLikes.length
      if (hasMore.value) {
        currentPage.value++
      }
    } else {
      if (reset) {
        memes.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    console.error('載入用戶按讚失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法載入按讚內容',
      life: 3000,
    })
  }
}

// 標籤點擊處理
const handleTagClick = (tag) => {
  router.push({
    path: '/memes/all',
    query: { tag: tag.name },
  })
}

// 空狀態消息
const getEmptyStateMessage = () => {
  switch (activeTab.value) {
    case 'liked':
      return '尚無收藏的內容'
    case 'collected':
      return '尚無按讚的內容'
    case 'about':
      return '關於此用戶'
    default:
      return '尚無發布的內容'
  }
}

const getEmptyStateDescription = () => {
  switch (activeTab.value) {
    case 'liked':
      return '此用戶還沒有收藏任何迷因'
    case 'collected':
      return '此用戶還沒有按讚任何迷因'
    case 'about':
      return '暫無更多關於此用戶的資訊'
    default:
      return '此用戶還沒有發布任何迷因'
  }
}

// 監聽標籤切換
watch(activeTab, (newTab) => {
  // 重置分頁狀態
  currentPage.value = 1
  hasMore.value = true
  resetState()

  if (newTab === 'posts') {
    loadUserMemes(true)
  } else if (newTab === 'liked') {
    loadUserCollections(true)
  } else if (newTab === 'collected') {
    loadUserLikedMemes(true)
  }
  // 其他標籤的邏輯可以在這裡添加
})

// 防抖搜尋函數
const debouncedSearch = debounce(() => {
  if (activeTab.value === 'posts') {
    // 重置分頁並重新載入
    currentPage.value = 1
    hasMore.value = true
    resetState()
    loadUserMemes(true)
  }
}, 300)

// 監聽搜尋查詢變化
watch(searchQuery, debouncedSearch)

// 監聽排序變化
watch(sortOrder, () => {
  if (activeTab.value === 'posts') {
    // 重置分頁並重新載入
    currentPage.value = 1
    hasMore.value = true
    resetState()
    loadUserMemes(true)
  }
})

// 監聽用戶ID變化
watch(
  userId,
  () => {
    if (userId.value) {
      loadUserProfile()
      loadUserStats()
      if (activeTab.value === 'posts') {
        loadUserMemes(true)
      }
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* 自定義樣式 */
.p-avatar.w-32.h-32 {
  width: 8rem !important;
  height: 8rem !important;
  font-size: 3rem !important;
}
</style>
