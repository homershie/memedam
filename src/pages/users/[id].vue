<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 用戶資訊頁首 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <!-- 用戶頭像 -->
          <div class="flex-shrink-0">
            <Avatar
              :image="userProfile?.avatar"
              :icon="!userProfile?.avatar ? 'pi pi-user' : undefined"
              shape="circle"
              size="xlarge"
              class="border-4 border-gray-200 w-32 h-32"
            />
          </div>

          <!-- 用戶資訊 -->
          <div class="flex-1 text-center md:text-left">
            <div class="mb-4">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                {{
                  userProfile?.display_name || userProfile?.username || '用戶'
                }}
              </h1>
              <p class="text-gray-600 text-lg">
                @{{ userProfile?.username || 'username' }}
              </p>
            </div>

            <!-- 用戶描述 -->
            <div v-if="userProfile?.bio" class="mb-6">
              <p class="text-gray-700 max-w-2xl">
                {{ userProfile.bio }}
              </p>
            </div>

            <!-- 統計數據 -->
            <div
              class="bg-black text-white rounded-full px-8 py-4 inline-block"
            >
              <div class="flex items-center gap-8 text-center">
                <div class="flex flex-col">
                  <span class="text-sm text-gray-300">關注數</span>
                  <span class="text-xl font-bold">{{
                    userStats.following || 8
                  }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm text-gray-300">粉絲數</span>
                  <span class="text-xl font-bold">{{
                    userStats.followers || 113
                  }}</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="text-sm text-gray-300">使用者自訂名稱</span>
                  <div class="flex items-center gap-1">
                    <span class="text-lg">👑</span>
                    <span class="text-lg">💋</span>
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm text-gray-300">貼文數</span>
                  <span class="text-xl font-bold">{{
                    userStats.posts || memes.length
                  }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm text-gray-300">收藏數</span>
                  <span class="text-xl font-bold">{{
                    userStats.collections || 54
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 用戶簡介文字 -->
            <div class="mt-6 max-w-4xl">
              <p class="text-gray-600 leading-relaxed">
                這是一個關於幽默和社交文化的迷因，捕捉了現代生活中的有趣時刻。作為一種年輕人喜歡的內容，迷因不僅能帶來歡樂，還能反映當實生活中的各種問題和感悟。無論是通過圖像、影片或文字，迷因都是一種富有創意和感染力的表達方式。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 內容區域 -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 標籤導航 -->
      <div class="mb-8">
        <div class="flex items-center justify-between border-b border-gray-200">
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
                class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
      <div v-if="loading" class="flex justify-center items-center py-20">
        <ProgressSpinner />
      </div>

      <!-- 迷因列表 -->
      <div v-else-if="filteredMemes.length > 0" class="space-y-4">
        <SimpleMemeCard
          v-for="meme in filteredMemes"
          :key="meme.id || meme._id"
          :meme="meme"
          @tag-click="handleTagClick"
        />

        <!-- 載入更多按鈕 -->
        <div v-if="hasMore" class="flex justify-center mt-8">
          <Button
            label="載入更多"
            icon="pi pi-plus"
            @click="loadMoreMemes"
            :loading="loadingMore"
            outlined
          />
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-20">
        <div class="mb-4">
          <i class="pi pi-inbox text-6xl text-gray-300"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">
          {{ getEmptyStateMessage() }}
        </h3>
        <p class="text-gray-500">
          {{ getEmptyStateDescription() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import SimpleMemeCard from '@/components/SimpleMemeCard.vue'
import userService from '@/services/userService'
import memeService from '@/services/memeService'

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
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const searchQuery = ref('')
const sortOrder = ref('newest')
const activeTab = ref('posts')

// 標籤配置
const tabs = ref([
  { key: 'posts', label: '貼文', icon: 'pi pi-th-large' },
  { key: 'liked', label: '收藏', icon: 'pi pi-bookmark' },
  { key: 'collected', label: '已按讚', icon: 'pi pi-thumbs-up' },
  { key: 'about', label: '關於', icon: 'pi pi-info-circle' },
])

// 排序選項
const sortOptions = ref([
  { label: '排序', value: 'newest' },
  { label: '最新', value: 'newest' },
  { label: '最舊', value: 'oldest' },
  { label: '最熱門', value: 'popular' },
  { label: '最多讚', value: 'most_liked' },
])

// 計算屬性
const userId = computed(() => route.params.id)

const filteredMemes = computed(() => {
  let filtered = [...memes.value]

  // 搜索過濾
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (meme) =>
        meme.title?.toLowerCase().includes(query) ||
        meme.content?.toLowerCase().includes(query),
    )
  }

  // 排序
  switch (sortOrder.value) {
    case 'oldest':
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt || a.created_at) -
          new Date(b.createdAt || b.created_at),
      )
      break
    case 'popular':
      filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      break
    case 'most_liked':
      filtered.sort(
        (a, b) =>
          (b.likes_count || b.like_count || 0) -
          (a.likes_count || a.like_count || 0),
      )
      break
    case 'newest':
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt || b.created_at) -
          new Date(a.createdAt || a.created_at),
      )
      break
  }

  return filtered
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
      limit: 10,
    }

    const response = await memeService.getAll(params)

    if (response.data) {
      const allMemes = Array.isArray(response.data)
        ? response.data
        : response.data.memes || response.data.data || []

      // 為每個迷因載入作者資訊，參考 all.vue 的做法
      const memesWithAuthors = await Promise.all(
        allMemes.map(async (meme) => {
          try {
            if (meme.author_id) {
              // 修正：支援 { $oid: ... } 格式
              const authorId =
                typeof meme.author_id === 'object' && meme.author_id.$oid
                  ? meme.author_id.$oid
                  : meme.author_id
              const authorResponse = await userService.get(authorId)
              meme.author = authorResponse.data.user || authorResponse.data
            } else {
              // 沒有作者 ID，設定預設值
              meme.author = {
                display_name: '匿名用戶',
                username: 'anonymous',
                avatar: null,
              }
            }
            return meme
          } catch (error) {
            console.warn(`載入作者 ${meme.author_id} 失敗:`, error.message)
            // 如果載入作者失敗，設定預設值
            meme.author = {
              display_name: '未知用戶',
              username: 'unknown',
              avatar: null,
            }
            return meme
          }
        }),
      )

      // 篩選出屬於當前用戶的迷因
      const userMemes = memesWithAuthors.filter((meme) => {
        const authorId = meme.author?._id || meme.author?.id
        const currentUserId = userId.value

        // 處理不同的ID格式
        if (typeof authorId === 'object' && authorId.$oid) {
          return authorId.$oid === currentUserId
        }
        return authorId === currentUserId
      })

      if (reset) {
        memes.value = userMemes
      } else {
        memes.value.push(...userMemes)
      }

      // 判斷是否還有更多數據（基於實際篩選結果）
      hasMore.value = allMemes.length === params.limit && userMemes.length > 0

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

// 載入更多迷因
const loadMoreMemes = async () => {
  if (loadingMore.value || !hasMore.value) return

  loadingMore.value = true
  await loadUserMemes(false)
  loadingMore.value = false
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
  if (newTab === 'posts') {
    loadUserMemes(true)
  }
  // 其他標籤的邏輯可以在這裡添加
})

// 監聽用戶ID變化
watch(
  userId,
  () => {
    if (userId.value) {
      loadUserProfile()
      if (activeTab.value === 'posts') {
        loadUserMemes(true)
      }
    }
  },
  { immediate: true },
)

// 組件掛載
onMounted(async () => {
  loading.value = true

  try {
    await Promise.all([loadUserProfile(), loadUserMemes(true)])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 自定義樣式 */
.p-avatar.w-32.h-32 {
  width: 8rem !important;
  height: 8rem !important;
  font-size: 3rem !important;
}
</style>
