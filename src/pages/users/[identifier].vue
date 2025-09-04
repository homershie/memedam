<template>
  <div class="w-full mx-auto space-y-12 overflow-y-auto">
    <!-- 背景圖片 -->
    <div
      v-if="userProfile?.cover_image"
      class="w-full z-0 relative top-0 left-0 h-60 group"
    >
      <img
        :src="
          userProfile?.cover_image ||
          'https://res.cloudinary.com/dkhexh4fp/image/upload/v1755748262/announcements/ftwo79lbkiwcp0m2ov3n.jpg'
        "
        alt="banner"
        class="w-full h-full object-cover rounded-b-2xl"
      />
      <!-- 編輯按鈕 - 只有當前用戶才能看到 -->
      <div
        v-if="isCurrentUser"
        class="absolute cursor-pointer inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 rounded-b-2xl"
        @click="$refs.coverImageInput.click()"
        aria-label="編輯封面圖片"
      >
        <i
          class="pi pi-pen-to-square rounded-full text-lg text-white absolute top-4 right-4"
        />
        <input
          ref="coverImageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleCoverImageChange"
        />
      </div>

      <!-- 移除按鈕 - 只有當前用戶且有封面圖片時才能看到 -->
      <div
        v-if="isCurrentUser && userProfile?.cover_image"
        class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          class="w-10 h-10 rounded-full shadow-lg"
          @click="removeCoverImage"
          aria-label="移除封面圖片"
        />
      </div>

      <!-- 尺寸提示 - 只有當前用戶才能看到 -->
      <div
        v-if="isCurrentUser"
        class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <div class="bg-black/70 text-white text-xs px-2 py-1 rounded">
          建議尺寸：1920x242 像素
        </div>
      </div>
    </div>
    <div v-else class="absolute top-4 right-8">
      <Button
        label="上傳封面圖片"
        icon="pi pi-upload"
        severity="secondary"
        size="small"
        class="w-36"
        :loading="isUploadingCoverImage"
        @click="$refs.coverImageInput.click()"
        aria-label="上傳封面圖片"
      />
      <input
        ref="coverImageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleCoverImageChange"
      />
    </div>

    <!-- 內容區域 -->
    <div
      class="min-h-fit mb-30 mx-auto space-y-30 relative"
      :class="userProfile?.cover_image ? '-top-20' : 'top-20'"
    >
      <!-- 用戶資訊頁首 -->
      <div class="mx-auto">
        <div class="flex flex-col items-center gap-8">
          <!-- 用戶頭像 -->
          <div class="relative group">
            <Avatar
              :image="avatarDisplayUrl"
              shape="circle"
              size="xlarge"
              class="border-3 border-surface-200 w-28 h-28"
            />
            <!-- 編輯按鈕 - 只有當前用戶才能看到 -->
            <div
              v-if="isCurrentUser"
              class="absolute h-[112px] w-[112px] cursor-pointer inset-0 bg-black/70 to-transparent opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 rounded-full"
              @click="$refs.avatarInput.click()"
              aria-label="編輯頭像"
            >
              <i
                class="pi pi-pen-to-square rounded-full text-lg text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
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
              <p class="max-w-xl block">
                @{{ userProfile?.username || 'username' }}
              </p>
            </div>
          </div>

          <!-- 統計數據 -->
          <div
            class="w-full flex flex-row flex-wrap justify-center gap-8 md:gap-20"
          >
            <div class="flex flex-col items-center justify-center">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >追蹤中</span
              >
              <span class="text-2xl font-bold">{{
                userStats.following_count || 0
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >粉絲數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.follower_count || 0
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >貼文數</span
              >
              <span class="text-2xl font-bold">{{
                userStats.meme_count || memes.length
              }}</span>
            </div>
            <div class="flex flex-col items-center justify-center">
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

          <!-- 追蹤按鈕 -->
          <div>
            <Button
              :label="userProfile?.is_following ? '已追蹤' : '追蹤'"
              :severity="userProfile?.is_following ? 'secondary' : 'primary'"
              :disabled="isCurrentUser"
              size="small"
              class="w-36"
              @click="handleFollow"
            />
          </div>
        </div>
      </div>

      <!-- 內容區域 -->
      <div class="max-w-5xl mx-auto px-4 pb-20 2xl:px-0">
        <!-- 標籤導航 -->
        <div class="mb-8">
          <div
            class="flex items-center flex-wrap flex-col justify-between gap-8 xl:flex-row"
          >
            <!-- 使用 PrimeVue Tabs 作為導航選單 -->
            <Tabs
              :value="activeTab"
              @update:value="activeTab = $event"
              class="order-2 xl:order-1"
            >
              <TabList class="border-b-0">
                <Tab
                  v-for="tab in tabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="p-4 transition-colors"
                >
                  <i v-if="tab.icon" :class="[tab.icon, 'mr-2']"></i>
                  {{ tab.label }}
                </Tab>
              </TabList>
            </Tabs>

            <!-- 搜索和排序 -->
            <div
              v-if="activeTab !== 'about'"
              class="flex items-center gap-4 order-1 xl:order-2"
            >
              <FloatLabel variant="on">
                <IconField>
                  <InputIcon class="pi pi-search" />
                  <InputText
                    id="on_label"
                    v-model="searchQuery"
                    class="pl-10 pr-4 py-2 w-64"
                  />
                  <InputIcon
                    v-if="searchQuery"
                    class="pi pi-times cursor-pointer transition-colors duration-300 hover:text-surface-900 dark:hover:text-white!"
                    @click="searchQuery = ''"
                  />
                </IconField>
                <label for="on_label">搜尋</label>
              </FloatLabel>
              <Dropdown
                v-model="sortOrder"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="排序"
                class="w-36"
              />
            </div>
          </div>
        </div>

        <!-- 關於標籤頁內容 -->
        <div v-if="activeTab === 'about'" class="max-w-5xl mx-auto">
          <!-- 載入中狀態 -->
          <div v-if="loading" class="space-y-6">
            <div class="animate-pulse">
              <div class="h-4 bg-surface-200 rounded w-1/4 mb-4"></div>
              <div class="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
            <div class="animate-pulse">
              <div class="h-4 bg-surface-200 rounded w-1/4 mb-4"></div>
              <div class="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
          </div>

          <!-- 關於內容 -->
          <div v-else class="space-y-8">
            <!-- 基本資料卡片 -->
            <div
              class="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6"
            >
              <h3
                class="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center"
              >
                <i class="pi pi-user mr-2 text-primary"></i>
                基本資料
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 使用者名稱 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >使用者名稱</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ userProfile?.username || '未設定' }}
                  </p>
                </div>

                <!-- 顯示名稱 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >顯示名稱</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ userProfile?.display_name || '未設定' }}
                  </p>
                </div>

                <!-- 性別 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >性別</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ getGenderText(userProfile?.gender) }}
                  </p>
                </div>

                <!-- 生日 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >生日</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ formatBirthday(userProfile?.birthday) }}
                  </p>
                </div>

                <!-- 註冊時間 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >註冊時間</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ formatDateOnly(userProfile?.createdAt) }}
                  </p>
                </div>

                <!-- 最後登入 -->
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-surface-600 dark:text-surface-400"
                    >最後登入</label
                  >
                  <p class="text-surface-900 dark:text-white font-medium">
                    {{ formatDateOnly(userProfile?.last_login_at) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 自我介紹卡片 -->
            <div
              class="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6"
            >
              <h3
                class="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center"
              >
                <i class="pi pi-comment mr-2 text-primary"></i>
                自我介紹
              </h3>

              <div class="space-y-2">
                <p
                  v-if="userProfile?.bio"
                  class="text-surface-700 dark:text-surface-300 leading-relaxed"
                >
                  {{ userProfile.bio }}
                </p>
                <p v-else class="text-surface-500 dark:text-surface-400 italic">
                  此用戶尚未填寫自我介紹
                </p>
              </div>
            </div>

            <!-- 統計資料卡片 -->
            <div
              class="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6"
            >
              <h3
                class="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center"
              >
                <i class="pi pi-chart-bar mr-2 text-primary"></i>
                統計資料
              </h3>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary mb-1">
                    {{ userStats.follower_count || 0 }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">
                    粉絲數
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary mb-1">
                    {{ userStats.following_count || 0 }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">
                    追蹤中
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary mb-1">
                    {{ userStats.meme_count || 0 }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">
                    貼文數
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-primary mb-1">
                    {{ userStats.collection_count || 0 }}
                  </div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">
                    收藏數
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他標籤頁內容 -->
        <div v-else>
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
              <i class="pi pi-inbox text-5xl text-surface-300"></i>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
import { useUserStore } from '@/stores/userStore'

// 組件名稱 (修復linter錯誤)
defineOptions({
  name: 'UserProfile',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

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

// 封面圖片相關
const coverImageInput = ref(null)
const isUploadingCoverImage = ref(false)

// 頭像相關
const avatarInput = ref(null)
const isUploadingAvatar = ref(false)

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
      username: userProfile.value.username || username.value || 'unknown',
      display_name: userProfile.value.display_name || '未知用戶',
      avatar: userProfile.value.avatarUrl || null,
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
    { label: '最冷門', value: 'popularity_asc' },
    { label: '最高互動', value: 'quality' },
    { label: '最低互動', value: 'quality_asc' },
  ]

  // 只有在搜尋時才顯示相關性選項
  if (searchQuery.value.trim()) {
    baseOptions.push({ label: '相關性', value: 'relevance' })
  }

  return baseOptions
})

// 計算屬性
const identifier = computed(() => route.params.identifier)

// 智能檢測參數類型
const userIdentifier = computed(() => {
  const value = identifier.value
  if (!value) return null

  // 簡單的 ID 檢測邏輯：如果包含字母和數字組合且長度較長，可能是 ID
  // 如果只包含字母、數字和下劃線且長度較短，可能是 username
  const isMongoId = /^[a-f\d]{24}$/i.test(value) // MongoDB ObjectId 格式
  const isShortAlphanumeric =
    /^[a-zA-Z0-9_]{1,30}$/.test(value) && value.length <= 30

  return {
    value,
    isLikelyId:
      isMongoId ||
      (isShortAlphanumeric && /\d/.test(value) && value.length > 10),
    isLikelyUsername: isShortAlphanumeric && value.length <= 20,
  }
})

// 向後兼容：提供 userId 和 username 計算屬性
const userId = computed(() => userIdentifier.value?.value || null)
const username = computed(() => userIdentifier.value?.value || null)

// 判斷是否為當前用戶
const isCurrentUser = computed(() => {
  // 比較用戶 ID 或用戶名
  const currentUserId = userStore.userId
  const currentUsername = userStore.username
  const pageUserId = userProfile.value?._id
  const pageUsername = userProfile.value?.username
  const pageIdentifier = userIdentifier.value?.value

  // 如果用戶已登入，檢查是否為當前用戶
  if (currentUserId && currentUsername) {
    // 比較用戶 ID
    if (currentUserId === pageUserId) {
      return true
    }
    // 比較用戶名
    if (
      currentUsername === pageUsername ||
      currentUsername === pageIdentifier
    ) {
      return true
    }
  }

  return false
})

const filteredMemes = computed(() => {
  // 直接返回 memes，因為搜尋和排序現在由後端處理
  return memes.value
})

// 頭像顯示 URL（處理預覽和正式頭像）
const avatarDisplayUrl = computed(() => {
  // 如果是 blob URL（預覽），直接使用
  if (
    userProfile.value?.avatar &&
    userProfile.value.avatar.startsWith('blob:')
  ) {
    return userProfile.value.avatar
  }

  // 如果有正式頭像，使用正式頭像
  if (
    userProfile.value?.avatar &&
    typeof userProfile.value.avatar === 'string' &&
    userProfile.value.avatar.trim().length > 0
  ) {
    return userProfile.value.avatar
  }

  // 如果沒有頭像，使用預設頭像
  const seed =
    userProfile.value?.username && userProfile.value.username.trim().length > 0
      ? encodeURIComponent(userProfile.value.username)
      : 'default'
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed}`
})

// 載入用戶資料
const loadUserProfile = async () => {
  try {
    const ident = userIdentifier.value
    if (!ident) return

    const { value } = ident

    // 使用通用函數獲取用戶資料，添加時間戳來避免快取
    const response = await userService.getUserByIdentifier(value, {
      timestamp: Date.now(),
    })

    if (response.data) {
      // 處理可能的資料結構差異，參考 all.vue 中的做法
      userProfile.value = response.data.user || response.data

      // 如果當前用戶已登入且不是當前用戶頁面，檢查追隨狀態
      if (!isCurrentUser.value && userStore.isLoggedIn) {
        try {
          const followStatusResponse = await followService.getFollowStatus(
            userProfile.value._id,
          )
          if (followStatusResponse.data.success) {
            userProfile.value.is_following =
              followStatusResponse.data.data.is_following
          }
        } catch (error) {
          console.warn('檢查追隨狀態失敗:', error)
          // 設定預設值
          userProfile.value.is_following = false
        }
      } else {
        // 如果是當前用戶，無法追隨自己
        userProfile.value.is_following = false
      }
    }
  } catch (error) {
    console.error('載入用戶資料失敗:', error)
    const errorMessage = error.response?.data?.message || '無法載入用戶資料'

    // 檢查是否是用戶不存在的錯誤
    if (error.response?.status === 404) {
      toast.add({
        severity: 'warn',
        summary: '用戶不存在',
        detail: `找不到用戶 "${identifier.value}"`,
        life: 5000,
      })

      // 3秒後重定向到首頁
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } else {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: errorMessage,
        life: 3000,
      })
    }

    // 設定預設值以防止頁面崩潰
    userProfile.value = {
      display_name: '未知用戶',
      username: 'unknown',
      avatar: null,
      bio: '',
    }
  }
}

// 處理封面圖片變更
const handleCoverImageChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '封面圖片大小不能超過 5MB',
        life: 3000,
      })
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '只能上傳圖片檔案',
        life: 3000,
      })
      return
    }

    isUploadingCoverImage.value = true

    // 上傳封面圖片
    const response = await userService.uploadCoverImage(file)

    if (response.data.success) {
      // 更新用戶資料中的封面圖片（直接使用新的封面圖片 URL）
      userProfile.value.cover_image = response.data.url

      // 添加一個小的延遲後重新載入資料，確保資料庫更新已完成並避免快取問題
      setTimeout(async () => {
        try {
          await loadUserProfile()

          // 觸發自定義事件，讓其他組件知道封面圖片已更新
          window.dispatchEvent(
            new CustomEvent('user-cover-updated', {
              detail: { coverImageUrl: response.data.url },
            }),
          )
        } catch (error) {
          console.warn('重新載入用戶資料失敗:', error)
          // 不影響主要功能，只是資料同步
        }
      }, 1000) // 1秒後重新載入

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '封面圖片已更新',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('封面圖片上傳失敗:', error)
    const errorMessage = error.response?.data?.message || '封面圖片上傳失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    isUploadingCoverImage.value = false
    // 清空 input 值，允許重複上傳相同檔案
    event.target.value = ''
  }
}

// 處理頭像變更
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 檢查檔案大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '頭像大小不能超過 2MB',
        life: 3000,
      })
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '只能上傳圖片檔案',
        life: 3000,
      })
      return
    }

    isUploadingAvatar.value = true

    // 上傳頭像
    const response = await userService.uploadAvatar(file)

    if (response.data.success) {
      // 更新用戶資料中的頭像（直接使用新的頭像 URL）
      userProfile.value.avatar = response.data.url

      // 添加一個小的延遲後重新載入資料，確保資料庫更新已完成並避免快取問題
      setTimeout(async () => {
        try {
          await loadUserProfile()

          // 觸發自定義事件，讓其他組件知道頭像已更新
          window.dispatchEvent(
            new CustomEvent('user-avatar-updated', {
              detail: { avatarUrl: response.data.url },
            }),
          )
        } catch (error) {
          console.warn('重新載入用戶資料失敗:', error)
          // 不影響主要功能，只是資料同步
        }
      }, 1000) // 1秒後重新載入

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '頭像已更新',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('頭像上傳失敗:', error)
    const errorMessage = error.response?.data?.message || '頭像上傳失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    isUploadingAvatar.value = false
    // 清空 input 值，允許重複上傳相同檔案
    event.target.value = ''
  }
}

// 處理追隨按鈕點擊
const handleFollow = async () => {
  try {
    const response = await followService.toggleFollow(userProfile.value._id)

    if (response.data.success) {
      // 更新追隨狀態
      userProfile.value.is_following = response.data.action === 'followed'

      // 更新統計數據
      if (response.data.action === 'followed') {
        userStats.value.follower_count =
          (userStats.value.follower_count || 0) + 1
      } else {
        userStats.value.follower_count = Math.max(
          0,
          (userStats.value.follower_count || 0) - 1,
        )
      }

      // 顯示成功訊息
      const actionText =
        response.data.action === 'followed' ? '追隨' : '取消追隨'
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: `${actionText}用戶成功`,
        life: 3000,
      })
    }
  } catch (error) {
    console.error('追隨操作失敗:', error)
    const errorMessage = error.response?.data?.message || '追隨操作失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  }
}

// 載入用戶統計資料
const loadUserStats = async () => {
  try {
    const ident = userIdentifier.value
    if (!ident) return

    const { value } = ident

    // 使用通用函數獲取用戶統計（包含追隨統計）
    const userStatsResponse = await userService.getStatsByIdentifier(value)
    const userStatsData = userStatsResponse.data?.data || {}

    // 設置統計資訊
    userStats.value = {
      ...userStatsData,
    }
  } catch (error) {
    console.error('載入用戶統計失敗:', error)

    // 如果是用戶不存在的錯誤，不顯示錯誤訊息（因為用戶頁面已經處理了）
    if (error.response?.status !== 404) {
      const errorMessage = error.response?.data?.message || '無法載入用戶統計'
      toast.add({
        severity: 'warn',
        summary: '載入統計失敗',
        detail: errorMessage,
        life: 3000,
      })
    }

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

    const ident = userIdentifier.value
    if (!ident) return

    const { value } = ident

    const params = {
      page: currentPage.value,
      limit: 20, // 增加每次載入的數量，提高效率
      author: value, // 使用參數作為作者篩選參數
      authorId: value, // 保留作為備用參數
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
      // 处理不同格式的响应数据
      let allMemes = []
      if (Array.isArray(response.data)) {
        allMemes = response.data
      } else if (response.data.memes && Array.isArray(response.data.memes)) {
        allMemes = response.data.memes
      } else if (response.data.data && Array.isArray(response.data.data)) {
        allMemes = response.data.data
      } else if (response.data.meme) {
        // 如果返回单个迷因，包装成数组
        allMemes = [response.data.meme]
      } else {
        console.warn('Unexpected response format:', response.data)
        allMemes = []
      }

      // 在用戶頁面中，所有迷因都屬於同一個用戶，直接使用當前用戶資訊
      const memesWithAuthors = allMemes.map((meme) => {
        // 使用當前頁面的用戶資訊作為作者資訊
        meme.author = {
          _id: userProfile.value?._id || userId.value,
          username: userProfile.value?.username || username.value || 'unknown',
          display_name: userProfile.value?.display_name || '未知用戶',
          avatar: userProfile.value?.avatarUrl || null,
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

    // 設置用戶資料更新事件監聽器
    setupUserUpdateListeners()
  } catch (error) {
    console.error('載入初始數據失敗:', error)
  } finally {
    loading.value = false
  }
}

// 設置用戶資料更新事件監聽器
const setupUserUpdateListeners = () => {
  // 監聽頭像更新事件
  const handleAvatarUpdate = (event) => {
    const { avatarUrl } = event.detail
    console.log('用戶頁面收到頭像更新事件:', avatarUrl)

    // 更新用戶資料中的頭像
    if (userProfile.value) {
      userProfile.value.avatar = avatarUrl
      userProfile.value.avatarUrl = avatarUrl
    }
  }

  // 監聽封面圖片更新事件
  const handleCoverUpdate = (event) => {
    const { coverImageUrl } = event.detail
    console.log('用戶頁面收到封面圖片更新事件:', coverImageUrl)

    // 更新用戶資料中的封面圖片
    if (userProfile.value) {
      userProfile.value.cover_image = coverImageUrl
    }
  }

  window.addEventListener('user-avatar-updated', handleAvatarUpdate)
  window.addEventListener('user-cover-updated', handleCoverUpdate)

  // 在組件卸載時移除事件監聽器
  onUnmounted(() => {
    window.removeEventListener('user-avatar-updated', handleAvatarUpdate)
    window.removeEventListener('user-cover-updated', handleCoverUpdate)
  })
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
    const userId = userProfile.value?._id || userId.value
    if (!userId) return
    const collectionsResponse = await collectionService.getAll(userId)

    let userCollections = []
    if (Array.isArray(collectionsResponse.data)) {
      userCollections = collectionsResponse.data
    } else {
      console.warn(
        'Unexpected collections response format:',
        collectionsResponse.data,
      )
      userCollections = []
    }

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
            // 檢查API響應格式
            if (!memeResponse.data) {
              console.error('找不到迷因響應數據:', collection.meme_id)
              return null
            }

            // 根據API響應格式調整數據提取
            let memeData
            if (
              memeResponse.data &&
              memeResponse.data.data &&
              memeResponse.data.data.meme
            ) {
              // 後端返回格式: {success: true, data: {meme: {...}}, error: null}
              memeData = memeResponse.data.data.meme
            } else if (memeResponse.data && memeResponse.data.meme) {
              // 後端返回格式: {meme: {...}}
              memeData = memeResponse.data.meme
            } else if (memeResponse.data) {
              // 直接返回迷因數據
              memeData = memeResponse.data
            } else {
              console.error(
                '找不到收藏迷因數據:',
                collection.meme_id,
                memeResponse.data,
              )
              return null
            }

            const meme = { ...memeData }

            // 載入作者資訊（使用快取機制）
            if (meme.author_id) {
              let authorId = meme.author_id
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
    const userId = userProfile.value?._id || userId.value
    if (!userId) return
    const likesResponse = await likeService.getAll(userId)

    let userLikes = []
    if (Array.isArray(likesResponse.data)) {
      userLikes = likesResponse.data
    } else {
      console.warn('Unexpected likes response format:', likesResponse.data)
      userLikes = []
    }

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
            // 檢查API響應格式
            if (!memeResponse.data) {
              console.error('找不到按讚迷因響應數據:', like.meme_id)
              return null
            }

            // 根據API響應格式調整數據提取
            let memeData
            if (
              memeResponse.data &&
              memeResponse.data.data &&
              memeResponse.data.data.meme
            ) {
              // 後端返回格式: {success: true, data: {meme: {...}}, error: null}
              memeData = memeResponse.data.data.meme
            } else if (memeResponse.data && memeResponse.data.meme) {
              // 後端返回格式: {meme: {...}}
              memeData = memeResponse.data.meme
            } else if (memeResponse.data) {
              // 直接返回迷因數據
              memeData = memeResponse.data
            } else {
              console.error(
                '找不到按讚迷因數據:',
                like.meme_id,
                memeResponse.data,
              )
              return null
            }

            const meme = { ...memeData }

            // 載入作者資訊（使用快取機制）
            if (meme.author_id) {
              let authorId = meme.author_id
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
  } else if (newTab === 'about') {
    // 關於標籤不需要載入迷因資料，只需要確保用戶資料已載入
    if (!userProfile.value) {
      loadUserProfile()
    }
    if (!userStats.value || Object.keys(userStats.value).length === 0) {
      loadUserStats()
    }
  }
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

// 輔助函數：格式化性別顯示
const getGenderText = (gender) => {
  if (!gender) return '未設定'
  switch (gender.toLowerCase()) {
    case 'male':
    case 'm':
      return '男性'
    case 'female':
    case 'f':
      return '女性'
    case 'other':
    case 'o':
      return '其他'
    default:
      return '未設定'
  }
}

// 輔助函數：格式化生日
const formatBirthday = (birthday) => {
  if (!birthday) return '未設定'
  try {
    const date = new Date(birthday)
    if (isNaN(date.getTime())) return '未設定'
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '未設定'
  }
}

// 輔助函數：格式化日期（只顯示日期）
const formatDateOnly = (date) => {
  if (!date) return '未設定'
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return '未設定'
    return dateObj.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return '未設定'
  }
}

// 移除封面圖片
const removeCoverImage = async () => {
  try {
    // 立即呼叫 API 移除封面圖片
    await userService.updateMe({
      cover_image: null,
    })

    // 更新封面圖片顯示
    userProfile.value.cover_image = null

    // 觸發自定義事件，讓其他組件知道封面圖片已移除
    window.dispatchEvent(
      new CustomEvent('user-cover-updated', {
        detail: { coverImageUrl: null },
      }),
    )

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '封面圖片已移除',
      life: 3000,
    })
  } catch (error) {
    console.error('封面圖片移除失敗:', error)
    const errorMessage = error.response?.data?.message || '封面圖片移除失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  }
}

// 監聽用戶標識符變化
watch(
  identifier,
  () => {
    if (identifier.value) {
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
:deep(.p-tablist-tab-list),
:deep(.p-tab) {
  border-color: transparent !important;
}
</style>

<route lang="yaml">
meta:
  title: '用戶頁面'
  description: '查看用戶的頭像、簡介、貼文、收藏與互動資訊，探索創作者的迷因作品。'
  login: ''
  admin: false
</route>
