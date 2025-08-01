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
      v-if="infiniteHasMore && memes.length > 0"
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
import { ref, onMounted, watch } from 'vue'
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
const pageSize = ref(5)

// 搜尋相關
const searchQuery = ref('')
const searchBoxRef = ref(null)
const isSearching = ref(false) // 標記是否正在搜尋

// 篩選和排序
const selectedTags = ref([])
const availableTags = ref([])

// 評論對話框
const showCommentsDialog = ref(false)
const selectedMeme = ref(null)

// 載入迷因列表
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

    const params = {
      page: currentPage.value,
      limit: pageSize.value,
    }

    let response

    // 如果有搜尋關鍵字
    if (searchQuery.value.trim()) {
      isSearching.value = true // 標記正在搜尋
      // 搜尋時使用傳統搜尋保持時間排序，不支援推薦排序
      const searchParams = {
        ...params,
        useFuzzySearch: false,
      }

      if (selectedTags.value.length > 0) {
        // 有搜尋關鍵字 + 標籤篩選
        const tagNames = selectedTags.value.map((tag) => tag.name)
        // 將陣列轉換為逗號分隔的字串
        const tagsString = tagNames.join(',')
        response = await memeService.searchByTags(
          searchQuery.value,
          tagsString,
          searchParams,
        )
      } else {
        // 只有搜尋關鍵字
        response = await memeService.search(searchQuery.value, searchParams)
      }
    } else {
      isSearching.value = false // 標記不是搜尋模式
      if (selectedTags.value.length > 0) {
        // 只有標籤篩選，使用混合推薦
        const tagNames = selectedTags.value.map((tag) => tag.name)
        // 將陣列轉換為逗號分隔的字串
        const tagsString = tagNames.join(',')
        response = await loadRecommendations('recommendation_mixed', {
          ...params,
          tags: tagsString,
        })
      } else {
        // 沒有篩選條件，使用混合推薦
        response = await loadRecommendations('recommendation_mixed', params)
      }
    }

    const newMemes = response.data.memes || response.data || []

    // 為每個迷因載入作者資訊（推薦模式下已經載入過，跳過）
    let memesWithAuthors
    if (!searchQuery.value.trim()) {
      memesWithAuthors = newMemes
    } else {
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

    // 檢查是否還有更多資料
    if (!searchQuery.value.trim()) {
      // 推薦模式：使用後端返回的分頁資訊
      if (response.data && response.data.pagination) {
        hasMore.value = response.data.pagination.hasMore
      } else {
        // 如果沒有分頁資訊，使用傳統邏輯
        hasMore.value = newMemes.length >= pageSize.value
      }
    } else {
      // 搜尋模式：傳統分頁邏輯
      hasMore.value = newMemes.length === pageSize.value
    }

    // 更新無限滾動狀態
    updateLoadingState(false, hasMore.value)
  } catch (error) {
    console.error('載入迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入迷因列表，請稍後再試',
      life: 3000,
    })

    // 更新無限滾動狀態
    updateLoadingState(false, false)
  } finally {
    loading.value = false
  }
}

// 新增：載入推薦內容
const loadRecommendations = async (recommendationType, params) => {
  try {
    const recommendationParams = {
      limit: pageSize.value,
      // 推薦 API 支援分頁，保留 page 參數
      page: currentPage.value,
      // 清除舊的快取數據
      clear_cache: true,
    }

    // 移除 exclude_ids 邏輯，讓後端自己處理分頁
    // 後端會根據 page 參數正確計算分頁，不需要前端排除

    // 如果有標籤篩選，加入標籤參數
    if (params.tags) {
      // 確保標籤參數是字串格式
      recommendationParams.tags = Array.isArray(params.tags)
        ? params.tags.join(',')
        : params.tags
    }

    const response =
      await recommendationService.getInfiniteScrollRecommendations(
        recommendationParams,
      )

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
        // 處理巢狀 data 結構
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
  // 防止在初始載入時觸發
  if (memes.value.length === 0) {
    return
  }

  // 修改：推薦模式也支援無限滾動
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
  distance: 200, // 增加距離，確保只有真正接近底部時才觸發
  interval: 100, // 增加間隔，避免重複觸發
})

// 處理搜尋
const handleSearch = (searchTerm) => {
  // 如果搜尋詞沒有變化，跳過處理
  if (searchQuery.value === searchTerm) {
    return
  }

  // 更新搜尋查詢
  searchQuery.value = searchTerm

  // 更新 URL 查詢參數（使用 replace 避免歷史記錄堆疊）
  if (searchTerm.trim()) {
    router.replace({
      path: '/memes/all',
      query: {
        ...route.query,
        search: searchTerm,
      },
    })
  } else {
    // 清除搜尋時移除 search 參數
    const newQuery = { ...route.query }
    delete newQuery.search
    router.replace({
      path: '/memes/all',
      query: newQuery,
    })
  }
  // 不需要手動呼叫 loadMemes，watch 會處理
}

// 載入可用標籤
const loadAvailableTags = async () => {
  try {
    const response = await tagService.getPopular()
    availableTags.value = response.data || []
  } catch {
    // 載入標籤失敗，靜默處理
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
    loadMemes(true) // 明確指定重置
  }
}

// 移除標籤篩選
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t._id !== tag._id)
  loadMemes(true) // 明確指定重置
}

// 清除所有篩選
const clearFilters = () => {
  selectedTags.value = []
  loadMemes(true) // 明確指定重置
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
    // 只有在搜尋查詢真正變化時才重新載入
    if (newSearchQuery !== oldSearchQuery) {
      // 避免在搜尋進行中時重置為空字串
      if (
        isSearching.value &&
        !newSearchQuery.trim() &&
        oldSearchQuery.trim()
      ) {
        return
      }

      loadMemes(true) // 明確指定重置
    }
  },
  { immediate: false },
)

// 監聽路由查詢參數變化
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // 只在搜尋查詢真正變化時才更新
    if (newQuery.search !== searchQuery.value) {
      // 避免在搜尋過程中重置為空字串
      if (searchQuery.value.trim() && !newQuery.search) {
        return
      }

      // 避免在搜尋進行中時重置查詢
      if (loading.value && searchQuery.value.trim() && !newQuery.search) {
        return
      }

      // 避免在搜尋狀態下重置為空字串
      if (isSearching.value && !newQuery.search) {
        return
      }

      // 避免在初始化時重置為空字串
      if (!oldQuery && !newQuery.search && searchQuery.value.trim()) {
        return
      }

      searchQuery.value = newQuery.search || ''
      if (searchBoxRef.value) {
        searchBoxRef.value.setQuery(searchQuery.value)
      }
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
  } catch {
    topTags.value = []
  }
}

// 初始化
onMounted(async () => {
  // 檢查路由查詢參數
  if (route.query.search) {
    searchQuery.value = route.query.search
    // 設定搜尋框的值
    if (searchBoxRef.value) {
      searchBoxRef.value.setQuery(route.query.search)
    }
  }

  // 載入資料
  await Promise.all([loadMemes(), loadAvailableTags()])
  loadTopTags()
})
</script>

<route lang="yaml">
meta:
  title: '所有迷因'
  login: ''
  admin: false
</route>
