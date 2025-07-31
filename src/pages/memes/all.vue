<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ConfirmPopup />
  <div class="container p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">所有迷因</h1>
      <p class="text-gray-600 mt-2">探索最新、最熱門的迷因內容</p>
    </div>

    <div class="flex justify-center w-full lg:w-1/2 mx-auto">
      <SearchBox ref="searchBoxRef" @search="handleSearch" class="w-full" />
    </div>

    <!-- 篩選狀態顯示 -->
    <div
      v-if="selectedTags.length > 0"
      class="flex items-center justify-center gap-2 mb-4"
    >
      <span class="text-sm text-gray-600">已篩選：</span>
      <Tag
        v-for="tag in selectedTags"
        :key="tag._id"
        :value="`#${tag.name}`"
        severity="success"
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

    <!-- 熱門標籤 -->
    <div class="flex flex-wrap gap-2 mb-6 justify-center">
      <Tag
        v-for="tag in topTags"
        :key="tag._id"
        :value="`#${tag.name}`"
        :severity="isTagSelected(tag) ? 'success' : 'primary'"
        class="cursor-pointer hover:bg-primary-50"
        @click="onTagClick(tag)"
      />
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 迷因列表 -->
    <div v-else-if="memes.length > 0" class="space-y-6 pb-10">
      <MemeCard
        v-for="meme in memes"
        :key="meme.id"
        :meme="meme"
        @tag-click="onTagClick"
        @show-comments="onShowComments"
        @deleted="loadMemes"
      />
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-12">
      <i class="pi pi-image text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無迷因內容</h3>
      <p class="text-gray-500">
        {{
          searchQuery.trim()
            ? `找不到包含「${searchQuery}」的迷因`
            : selectedTags.length > 0
              ? '沒有符合篩選條件的迷因'
              : '目前沒有符合條件的迷因，請稍後再試或調整篩選條件'
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
      v-if="infiniteHasMore && !isRecommendationMode"
      ref="triggerRef"
      class="h-4 w-full"
    >
      <div v-if="infiniteLoading" class="flex justify-center py-6">
        <div class="flex items-center text-gray-500">
          <ProgressSpinner style="width: 20px; height: 20px" />
          <span class="ml-2">載入更多內容...</span>
        </div>
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import MemeCard from '@/components/MemeCard.vue'
import SearchBox from '@/components/SearchBox.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import memeService from '@/services/memeService'
import userService from '@/services/userService'
import tagService from '@/services/tagService'
import recommendationService from '@/services/recommendationService'
import Tag from 'primevue/tag'
import { useInfiniteScrollWrapper } from '@/composables/useInfiniteScroll'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// 響應式數據
const memes = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(50)

// 搜尋相關
const searchQuery = ref('')
const searchBoxRef = ref(null)
const isSearching = ref(false) // 標記是否正在搜尋

// 篩選和排序
const selectedTags = ref([])
const availableTags = ref([])

// 檢查是否為推薦模式
const isRecommendationMode = computed(() => {
  return !searchQuery.value.trim()
})

// 評論對話框
const showCommentsDialog = ref(false)
const selectedMeme = ref(null)

// 載入迷因列表
const loadMemes = async (reset = true) => {
  // 防止重複載入
  if (loading.value) {
    console.log('🔍 跳過重複載入（正在載入中）')
    return
  }

  console.log('🔍 loadMemes 開始:', {
    reset,
    searchQuery: searchQuery.value,
    selectedTags: selectedTags.value.length,
    currentPage: currentPage.value,
  })

  try {
    if (reset) {
      loading.value = true
      currentPage.value = 1
      memes.value = []
    }

    const params = {
      page: currentPage.value,
      limit: pageSize.value,
    }

    let response

    // 如果有搜尋關鍵字
    if (searchQuery.value.trim()) {
      isSearching.value = true // 標記正在搜尋
      console.log('🔍 進入搜尋模式')
      // 搜尋時使用傳統搜尋保持時間排序，不支援推薦排序
      const searchParams = {
        ...params,
        useFuzzySearch: false,
      }

      if (selectedTags.value.length > 0) {
        // 有搜尋關鍵字 + 標籤篩選
        const tagNames = selectedTags.value.map((tag) => tag.name)
        console.log('🔍 搜尋 + 標籤篩選:', tagNames)
        response = await memeService.searchByTags(
          searchQuery.value,
          tagNames,
          searchParams,
        )
      } else {
        // 只有搜尋關鍵字
        console.log('🔍 純搜尋模式')
        response = await memeService.search(searchQuery.value, searchParams)
      }
    } else {
      isSearching.value = false // 標記不是搜尋模式
      if (selectedTags.value.length > 0) {
        // 只有標籤篩選，使用混合推薦
        console.log('🔍 進入推薦模式（標籤篩選）')
        const tagNames = selectedTags.value.map((tag) => tag.name)
        response = await loadRecommendations('recommendation_mixed', {
          ...params,
          tags: tagNames,
        })
      } else {
        // 沒有篩選條件，使用混合推薦
        console.log('🔍 進入推薦模式（無篩選）')
        response = await loadRecommendations('recommendation_mixed', params)
      }
    }

    const newMemes = response.data.memes || response.data || []
    console.log('🔍 取得迷因數量:', newMemes.length)

    // 為每個迷因載入作者資訊（推薦模式下已經載入過，跳過）
    let memesWithAuthors
    if (!searchQuery.value.trim()) {
      console.log('🔍 跳過作者資訊載入（推薦模式）')
      memesWithAuthors = newMemes
    } else {
      console.log('🔍 載入搜尋結果的作者資訊')
      memesWithAuthors = await Promise.all(
        newMemes.map(async (meme) => {
          try {
            if (meme.author_id) {
              // 修正：支援 { $oid: ... } 格式
              const authorId =
                typeof meme.author_id === 'object' && meme.author_id.$oid
                  ? meme.author_id.$oid
                  : meme.author_id
              const authorResponse = await userService.get(authorId)
              meme.author = authorResponse.data.user
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
    }

    if (reset) {
      memes.value = memesWithAuthors
    } else {
      memes.value.push(...memesWithAuthors)
    }

    console.log('🔍 最終迷因數量:', memes.value.length)

    // 檢查是否還有更多資料（推薦模式下不支援分頁）
    if (!searchQuery.value.trim()) {
      hasMore.value = false
    } else {
      hasMore.value = newMemes.length === pageSize.value
    }

    console.log('🔍 分頁狀態:', { hasMore: hasMore.value })

    // 更新無限滾動狀態（推薦模式下不支援無限滾動）
    if (!searchQuery.value.trim()) {
      updateLoadingState(false, false)
    } else {
      updateLoadingState(false, hasMore.value)
    }
  } catch (error) {
    console.error('載入迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入迷因列表，請稍後再試',
      life: 3000,
    })

    // 更新無限滾動狀態（推薦模式下不支援無限滾動）
    if (!searchQuery.value.trim()) {
      updateLoadingState(false, false)
    } else {
      updateLoadingState(false, false)
    }
  } finally {
    loading.value = false
    console.log('🔍 loadMemes 結束')
  }
}

// 新增：載入推薦內容
const loadRecommendations = async (recommendationType, params) => {
  try {
    const recommendationParams = {
      limit: pageSize.value,
      // 推薦 API 通常不支援分頁，所以移除 page 參數
    }

    // 如果有標籤篩選，加入標籤參數
    if (params.tags) {
      recommendationParams.tags = params.tags
    }

    const response =
      await recommendationService.getMixedRecommendations(recommendationParams)

    // 處理不同的回應格式
    let memes = []
    if (response.data) {
      if (Array.isArray(response.data)) {
        memes = response.data
      } else if (response.data.memes) {
        memes = response.data.memes
      } else if (response.data.recommendations) {
        memes = response.data.recommendations
      } else if (response.data.data) {
        // 處理巢狀 data 結構
        const nestedData = response.data.data
        if (Array.isArray(nestedData)) {
          memes = nestedData
        } else if (nestedData.memes) {
          memes = nestedData.memes
        } else if (nestedData.recommendations) {
          memes = nestedData.recommendations
        } else {
          memes = [nestedData]
        }
      } else {
        memes = [response.data]
      }
    }

    // 為每個迷因載入作者資訊
    const memesWithAuthors = await Promise.all(
      memes.map(async (meme) => {
        try {
          if (meme.author_id) {
            // 修正：支援 { $oid: ... } 格式
            const authorId =
              typeof meme.author_id === 'object' && meme.author_id.$oid
                ? meme.author_id.$oid
                : meme.author_id
            const authorResponse = await userService.get(authorId)
            meme.author = authorResponse.data.user
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

    // 如果沒有資料，回退到一般 API
    if (memesWithAuthors.length === 0) {
      console.warn('推薦 API 返回空資料，回退到一般 API')
      // 使用一般 API 載入資料
      const fallbackParams = { ...params }
      delete fallbackParams.sort // 移除排序參數，使用預設排序
      return await memeService.getAll(fallbackParams)
    }

    // 確保回應格式一致
    return {
      data: {
        memes: memesWithAuthors,
        total:
          response.data?.total ||
          response.data?.count ||
          memesWithAuthors.length,
      },
    }
  } catch (error) {
    console.error('載入推薦失敗:', error)
    // 如果推薦失敗，回退到一般 API
    // 使用一般 API 載入資料
    const fallbackParams = { ...params }
    delete fallbackParams.sort // 移除排序參數，使用預設排序
    return await memeService.getAll(fallbackParams)
  }
}

// 無限滾動載入函數
const loadMoreContent = async () => {
  // 推薦模式下不支援無限滾動，直接返回
  if (!searchQuery.value.trim()) {
    updateLoadingState(false, false)
    return
  }

  currentPage.value++
  await loadMemes(false)
}

// 使用無限滾動組合式函數
const {
  triggerRef,
  isLoading: infiniteLoading,
  hasMore: infiniteHasMore,
  updateLoadingState,
} = useInfiniteScrollWrapper(loadMoreContent, {
  distance: 10,
  interval: 100,
})

// 處理搜尋
const handleSearch = (searchTerm) => {
  console.log('🔍 handleSearch 開始:', {
    oldSearchQuery: searchQuery.value,
    newSearchTerm: searchTerm,
    isEqual: searchQuery.value === searchTerm,
  })

  // 如果搜尋詞沒有變化，跳過處理
  if (searchQuery.value === searchTerm) {
    console.log('🔍 搜尋詞未變化，跳過處理')
    return
  }

  // 更新搜尋查詢
  searchQuery.value = searchTerm

  // 更新 URL 查詢參數（使用 replace 避免歷史記錄堆疊）
  if (searchTerm.trim()) {
    console.log('🔍 更新URL查詢參數（有搜尋詞）')
    router.replace({
      path: '/memes/all',
      query: {
        ...route.query,
        search: searchTerm,
      },
    })
  } else {
    // 清除搜尋時移除 search 參數
    console.log('🔍 更新URL查詢參數（清除搜尋）')
    const newQuery = { ...route.query }
    delete newQuery.search
    router.replace({
      path: '/memes/all',
      query: newQuery,
    })
  }

  console.log('🔍 handleSearch 結束')
  // 不需要手動呼叫 loadMemes，watch 會處理
}

// 載入可用標籤
const loadAvailableTags = async () => {
  try {
    const response = await tagService.getPopular()
    availableTags.value = response.data || []
  } catch {
    console.error('載入標籤失敗')
  }
}

// 檢查標籤是否已選擇
const isTagSelected = (tag) => {
  return selectedTags.value.some((selectedTag) => selectedTag._id === tag._id)
}

// 標籤點擊處理
const onTagClick = (tag) => {
  if (isTagSelected(tag)) {
    // 如果標籤已選擇，則移除
    removeTag(tag)
  } else {
    // 如果標籤未選擇，則加入
    addTag(tag)
  }
}

// 新增標籤到篩選
const addTag = (tag) => {
  if (!isTagSelected(tag)) {
    selectedTags.value.push(tag)
    loadMemes()
  }
}

// 移除標籤篩選
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t._id !== tag._id)
  loadMemes()
}

// 清除所有篩選
const clearFilters = () => {
  selectedTags.value = []
  loadMemes()
}

// 顯示評論
const onShowComments = (meme) => {
  selectedMeme.value = meme
  showCommentsDialog.value = true
}

// 監聽搜尋變化
watch(
  searchQuery,
  (newSearchQuery, oldSearchQuery) => {
    console.log('👀 搜尋查詢變化:', {
      old: oldSearchQuery,
      new: newSearchQuery,
      isEqual: newSearchQuery === oldSearchQuery,
      isSearching: isSearching.value,
    })

    // 只有在搜尋查詢真正變化時才重新載入
    if (newSearchQuery !== oldSearchQuery) {
      // 避免在搜尋進行中時重置為空字串
      if (
        isSearching.value &&
        !newSearchQuery.trim() &&
        oldSearchQuery.trim()
      ) {
        console.log('👀 跳過重置搜尋查詢（搜尋進行中）')
        return
      }

      console.log('👀 觸發重新載入')
      loadMemes()
    } else {
      console.log('👀 跳過重新載入（查詢未變化）')
    }
  },
  { immediate: true },
)

// 監聽路由查詢參數變化
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    console.log('👀 路由查詢參數變化:', {
      old: oldQuery,
      new: newQuery,
      currentSearchQuery: searchQuery.value,
      searchChanged: newQuery.search !== searchQuery.value,
      oldSearch: oldQuery?.search,
      newSearch: newQuery?.search,
      isSearching: isSearching.value,
    })

    // 只在搜尋查詢真正變化時才更新
    if (newQuery.search !== searchQuery.value) {
      // 避免在搜尋過程中重置為空字串
      if (searchQuery.value.trim() && !newQuery.search) {
        console.log('👀 跳過重置搜尋查詢（當前有搜尋內容）')
        return
      }

      // 避免在搜尋進行中時重置查詢
      if (loading.value && searchQuery.value.trim() && !newQuery.search) {
        console.log('👀 跳過重置搜尋查詢（正在載入中且有搜尋內容）')
        return
      }

      // 避免在搜尋狀態下重置為空字串
      if (isSearching.value && !newQuery.search) {
        console.log('👀 跳過重置搜尋查詢（當前為搜尋狀態）')
        return
      }

      // 避免在初始化時重置為空字串
      if (!oldQuery && !newQuery.search && searchQuery.value.trim()) {
        console.log('👀 跳過重置搜尋查詢（初始化時有搜尋內容）')
        return
      }

      console.log('👀 更新搜尋查詢:', newQuery.search)
      searchQuery.value = newQuery.search || ''
      if (searchBoxRef.value) {
        searchBoxRef.value.setQuery(searchQuery.value)
      }
    } else {
      console.log('👀 搜尋查詢未變化，跳過更新')
    }
  },
  { deep: true, immediate: false }, // 移除 immediate: true，避免初始化時觸發
)

const topTags = ref([])

const loadTopTags = async () => {
  try {
    const res = await tagService.getPopular(10)
    // 修正：正確取用 popularTags 陣列
    topTags.value = res.data.popularTags || []
    console.log('topTags', topTags.value)
  } catch {
    topTags.value = []
  }
}

// 初始化
onMounted(async () => {
  console.log('🔍 初始化開始')

  // 檢查路由查詢參數
  if (route.query.search) {
    console.log('🔍 從路由查詢參數載入搜尋:', route.query.search)
    searchQuery.value = route.query.search
    // 設定搜尋框的值
    if (searchBoxRef.value) {
      searchBoxRef.value.setQuery(route.query.search)
    }
  }

  // 載入資料
  console.log('🔍 開始載入資料')
  await Promise.all([loadMemes(), loadAvailableTags()])
  loadTopTags()

  console.log('🔍 初始化完成')
})
</script>

<route lang="yaml">
meta:
  title: '所有迷因'
  login: ''
  admin: false
</route>
