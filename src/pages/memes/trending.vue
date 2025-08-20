<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ConfirmPopup />
  <div class="w-5xl p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-start">
      <h1 class="text-3xl font-bold text-gray-800">近期話題</h1>
      <p class="text-gray-600 mt-2">基於熱門趨勢和社交信號的推薦</p>
    </div>

    <div class="flex justify-between flex-wrap">
      <!-- 迷因類型標籤 -->
      <div class="flex flex-wrap gap-2 mb-6 justify-start items-center">
        <CustomTag
          v-for="tag in memeTypeTags"
          :key="tag._id"
          :value="`#${tag.name}`"
          :severity="isTagSelected(tag) ? 'featured' : 'primary'"
          class="cursor-pointer hover:bg-primary-50"
          @click="onTagClick(tag)"
        />
      </div>
      <!-- 篩選狀態顯示 -->
      <div
        v-if="selectedTags.length > 0"
        class="flex justify-start items-center gap-2 mb-4"
      >
        <span class="text-sm text-gray-600">已篩選：</span>
        <CustomTag
          v-for="tag in selectedTags"
          :key="tag._id"
          :value="`#${tag.name}`"
          severity="featured"
          class="cursor-pointer"
          @click="removeTag(tag)"
        />
        <Button
          label="清除篩選"
          icon="pi pi-times"
          size="small"
          severity="secondary"
          text
          @click="clearFilters"
        />
      </div>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="space-y-6 pb-10">
      <MemeCardSkeleton v-for="n in 3" :key="n" />
    </div>

    <!-- 迷因列表 -->
    <div v-else-if="memes.length > 0" class="space-y-6 pb-10">
      <template v-for="(meme, index) in memes" :key="meme.id">
        <MemeCard
          :meme="meme"
          @tag-click="onTagClick"
          @show-comments="onShowComments"
          @deleted="loadMemes"
        />
        <!-- 每8則迷因插入一個廣告 -->
        <AdInline v-if="(index + 1) % 8 === 0 && !isVipUser" />
      </template>
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-12">
      <i class="pi pi-image text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無話題迷因</h3>
      <p class="text-gray-500">
        {{
          selectedTags.length > 0
            ? '沒有符合篩選條件的話題迷因'
            : '目前沒有話題迷因，請稍後再試'
        }}
      </p>
      <Button
        label="重新載入"
        icon="pi pi-refresh"
        @click="loadMemes"
        class="mt-4"
      />
    </div>

    <!-- 無限滾動觸發元素 -->
    <div
      v-if="infiniteHasMore && memes.length > 0"
      ref="triggerRef"
      class="h-4 w-full"
    >
      <div v-if="infiniteLoading" class="space-y-6 pb-10">
        <MemeCardSkeleton v-for="n in 2" :key="`infinite-${n}`" />
      </div>
    </div>

    <!-- 評論對話框 -->
    <Dialog
      v-model:visible="showCommentsDialog"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      header="評論"
      :modal="true"
    >
      <div v-if="selectedMeme">
        <h4 class="font-semibold mb-4">{{ selectedMeme.title }}</h4>
        <!-- 這裡可以加入評論元件 -->
        <p class="text-gray-600">評論功能開發中...</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import MemeCard from '@/components/MemeCard.vue'
import MemeCardSkeleton from '@/components/MemeCardSkeleton.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import userService from '@/services/userService'
import tagService from '@/services/tagService'
import { useInfiniteScrollWrapper } from '@/composables/useInfiniteScroll'
import CustomTag from '@/components/CustomTag.vue'
import AdInline from '@/components/AdInline.vue'
import { useUserStore } from '@/stores/userStore'

// 新增推薦服務
import recommendationService from '@/services/recommendationService'

const toast = useToast()
const userStore = useUserStore()

// VIP 用戶判定
const isVipUser = computed(() => {
  return userStore.role === 'vip'
})

// 響應式數據
const memes = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 篩選和排序
const selectedTags = ref([])

// 迷因類型標籤
const memeTypeTags = ref([])

// 評論對話框
const showCommentsDialog = ref(false)
const selectedMeme = ref(null)

// 載入迷因列表 - 使用 trending 推薦算法
const loadMemes = async (reset = true) => {
  // 防止重複載入
  if (loading.value) {
    return
  }

  try {
    if (reset) {
      loading.value = true
      currentPage.value = 1
      memes.value = []
    }

    // 使用 trending 推薦 API
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      include_social_signals: true,
    }

    // 如果有標籤篩選，加入標籤參數
    if (selectedTags.value.length > 0) {
      // 使用迷因的 type 欄位進行篩選（與 hot.vue 保持一致）
      const types = selectedTags.value.map((tag) => tag._id)
      params.types = types.join(',')
    }

    // 如果有已載入的迷因，排除它們以避免重複
    if (memes.value.length > 0) {
      const excludeIds = memes.value
        .map((meme) => {
          // 確保返回正確的ID格式
          if (meme.id) {
            return meme.id.toString()
          } else if (meme._id) {
            return meme._id.toString()
          }
          return null
        })
        .filter(Boolean)
      if (excludeIds.length > 0) {
        params.exclude_ids = excludeIds.join(',')
      }
    }

    console.log('Trending recommendations request params:', params)
    const response =
      await recommendationService.getTrendingRecommendations(params)
    console.log('Trending recommendations response:', response.data)

    // 處理推薦系統的回應格式
    let memesData = []
    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      response.data.data.recommendations
    ) {
      // 處理後端返回的標準結構
      memesData = response.data.data.recommendations
    } else if (
      response.data &&
      response.data.data &&
      response.data.data.recommendations
    ) {
      // 處理後端返回的標準結構（沒有 success 欄位）
      memesData = response.data.data.recommendations
    } else if (Array.isArray(response.data)) {
      memesData = response.data
    } else if (response.data && response.data.memes) {
      memesData = response.data.memes
    } else if (response.data && response.data.recommendations) {
      memesData = response.data.recommendations
    } else if (response.data && response.data.data) {
      // 處理巢狀 data 結構
      const nestedData = response.data.data
      if (Array.isArray(nestedData)) {
        memesData = nestedData
      } else if (nestedData.memes) {
        memesData = nestedData.memes
      } else if (nestedData.recommendations) {
        memesData = nestedData.recommendations
      } else {
        memesData = [nestedData]
      }
    } else if (response.data) {
      memesData = [response.data]
    } else {
      memesData = []
    }

    // 為每個迷因載入作者資訊
    const memesWithAuthors = await Promise.all(
      memesData.map(async (meme) => {
        try {
          if (meme.author_id) {
            // 檢查是否已經是完整的用戶物件
            if (typeof meme.author_id === 'object' && meme.author_id._id) {
              // 如果 author_id 已經是完整的用戶物件，直接使用
              meme.author = {
                _id: meme.author_id._id,
                username: meme.author_id.username || 'unknown',
                display_name: meme.author_id.display_name || '未知用戶',
                avatar:
                  meme.author_id.avatar || meme.author_id.avatarUrl || null,
              }
            } else {
              // 處理不同格式的作者 ID
              let authorId = null

              if (typeof meme.author_id === 'string') {
                authorId = meme.author_id
              } else if (typeof meme.author_id === 'object') {
                if (meme.author_id.$oid) {
                  authorId = meme.author_id.$oid
                } else if (meme.author_id.toString) {
                  authorId = meme.author_id.toString()
                } else {
                  authorId = meme.author_id
                }
              } else {
                authorId = meme.author_id
              }

              try {
                const authorResponse = await userService.get(authorId)
                meme.author = authorResponse.data.user
              } catch (authorError) {
                console.warn(`載入作者 ${authorId} 失敗:`, authorError.message)
                // 如果載入作者失敗，設定預設值
                meme.author = {
                  display_name: '未知用戶',
                  username: 'unknown',
                  avatar: null,
                }
              }
            }
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
          console.warn(
            `處理迷因 ${meme._id || meme.id} 時發生錯誤:`,
            error.message,
          )
          // 如果處理迷因失敗，設定預設值
          meme.author = {
            display_name: '未知用戶',
            username: 'unknown',
            avatar: null,
          }
          return meme
        }
      }),
    )

    if (reset) {
      memes.value = memesWithAuthors
    } else {
      memes.value.push(...memesWithAuthors)
    }

    // 檢查是否還有更多資料
    let backendHasMore = false
    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      response.data.data.pagination
    ) {
      backendHasMore = response.data.data.pagination.hasMore
      console.log(
        'Trending recommendations pagination:',
        response.data.data.pagination,
      )
    } else if (
      response.data &&
      response.data.data &&
      response.data.data.pagination
    ) {
      backendHasMore = response.data.data.pagination.hasMore
      console.log(
        'Trending recommendations pagination (fallback):',
        response.data.data.pagination,
      )
    } else if (response.data && response.data.pagination) {
      backendHasMore = response.data.pagination.hasMore
      console.log(
        'Trending recommendations pagination (fallback):',
        response.data.pagination,
      )
    } else {
      backendHasMore = memesWithAuthors.length === pageSize.value
      console.log(
        'Trending recommendations hasMore (fallback):',
        backendHasMore,
        'memesWithAuthors.length:',
        memesWithAuthors.length,
        'pageSize:',
        pageSize.value,
      )
    }

    // 智能 hasMore 邏輯：如果後端返回了數據，且數據量等於頁面大小，或者後端明確表示還有更多數據
    hasMore.value =
      memesWithAuthors.length > 0 &&
      (memesWithAuthors.length >= pageSize.value || backendHasMore)

    console.log(
      'Trending recommendations currentPage:',
      currentPage.value,
      'hasMore:',
      hasMore.value,
      'memes count:',
      memesWithAuthors.length,
      'pageSize:',
      pageSize.value,
      'backendHasMore:',
      backendHasMore,
    )

    // 更新無限滾動狀態
    console.log(
      'Trending recommendations updateLoadingState: loading=false, hasMore=',
      hasMore.value,
    )
    updateLoadingState(false, hasMore.value)
  } catch (error) {
    console.error('載入話題推薦失敗:', error)

    // 檢查是否是後端錯誤
    let errorMessage = '無法載入話題推薦列表，請稍後再試'
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: errorMessage,
      life: 3000,
    })

    // 更新無限滾動狀態
    updateLoadingState(false, false)
  } finally {
    loading.value = false
  }
}

// 無限滾動載入函數
const loadMoreContent = async () => {
  // 防止在初始載入時觸發
  if (memes.value.length === 0) {
    console.log(
      'Trending recommendations loadMoreContent: memes is empty, skipping',
    )
    return
  }

  console.log(
    'Trending recommendations loadMoreContent: currentPage before increment:',
    currentPage.value,
  )
  currentPage.value++
  console.log(
    'Trending recommendations loadMoreContent: currentPage after increment:',
    currentPage.value,
  )
  await loadMemes(false)
}

// 使用無限滾動組合式函數
const {
  triggerRef,
  isLoading: infiniteLoading,
  hasMore: infiniteHasMore,
  updateLoadingState,
} = useInfiniteScrollWrapper(loadMoreContent, {
  distance: 200,
  interval: 100,
})

// 檢查標籤是否已選擇
const isTagSelected = (tag) => {
  return selectedTags.value.some((selectedTag) => selectedTag._id === tag._id)
}

// 標籤點擊處理
const onTagClick = (tag) => {
  if (isTagSelected(tag)) {
    removeTag(tag)
  } else {
    addTag(tag)
  }
}

// 新增標籤到篩選
const addTag = (tag) => {
  if (!isTagSelected(tag)) {
    selectedTags.value.push(tag)
    loadMemes(true)
  }
}

// 移除標籤篩選
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t._id !== tag._id)
  loadMemes(true)
}

// 清除所有篩選
const clearFilters = () => {
  selectedTags.value = []
  loadMemes(true)
}

// 顯示評論
const onShowComments = (meme) => {
  selectedMeme.value = meme
  showCommentsDialog.value = true
}

// 載入標籤分類
const loadTagCategories = async () => {
  try {
    const response = await tagService.getCategories({ lang: 'zh' })
    if (response.data && response.data.categories) {
      memeTypeTags.value = response.data.categories.memeTypes || []
    }
  } catch (error) {
    console.error('載入標籤分類失敗:', error)
    // 如果載入失敗，使用預設標籤
    memeTypeTags.value = [
      { _id: 'text', name: '用語', count: 0 },
      { _id: 'image', name: '圖片', count: 0 },
      { _id: 'video', name: '影片', count: 0 },
      { _id: 'audio', name: '音訊', count: 0 },
    ]
  }
}

// 初始化
onMounted(async () => {
  await loadTagCategories()
  await loadMemes()
})
</script>

<route lang="yaml">
meta:
  title: '近期話題'
  login: ''
  admin: false
</route>
