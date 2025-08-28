<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ConfirmPopup />
  <div class="container p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-center">
      <h1>所有迷因</h1>
      <p class="mt-2">探索最新、最熱門的迷因內容</p>
    </div>

    <div class="flex justify-center w-full lg:w-1/2 mx-auto">
      <SearchBox ref="searchBoxRef" @search="handleSearch" class="w-full" />
    </div>

    <!-- 熱門標籤 -->
    <div class="flex flex-wrap gap-2 mb-6 justify-center">
      <CustomTag
        v-for="tag in topTags"
        :key="tag._id"
        :value="`#${tag.name}`"
        :severity="isTagSelected(tag) ? 'featured' : 'primary'"
        class="cursor-pointer"
        @click="onTagClick(tag)"
      />
    </div>

    <!-- 篩選狀態顯示 -->
    <div
      v-if="selectedTags.length > 0"
      class="flex items-center justify-center gap-2 mb-4"
    >
      <p class="text-sm!">已篩選：</p>
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { setMemeListSEO, cleanUrlParams } from '@/utils/seoUtils'
import MemeCard from '@/components/MemeCard.vue'
import MemeCardSkeleton from '@/components/MemeCardSkeleton.vue'
import SearchBox from '@/components/SearchBox.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import memeService from '@/services/memeService'
import userService from '@/services/userService'
import tagService from '@/services/tagService'
import recommendationService from '@/services/recommendationService'
import { useInfiniteScrollWrapper } from '@/composables/useInfiniteScroll'
import CustomTag from '@/components/CustomTag.vue'
import AdInline from '@/components/AdInline.vue'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
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
const pageSize = ref(5)
const totalCount = ref(0)
const totalPages = ref(1)

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

                const authorResponse = await userService.get(authorId)
                meme.author = authorResponse.data.user
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
    let backendHasMore = false
    if (!searchQuery.value.trim()) {
      // 推薦模式：使用後端返回的分頁資訊
      if (response.data && response.data.pagination) {
        backendHasMore = response.data.pagination.hasMore
      } else {
        // 如果沒有分頁資訊，使用傳統邏輯
        backendHasMore = newMemes.length >= pageSize.value
      }
    } else {
      // 搜尋模式：傳統分頁邏輯
      backendHasMore = newMemes.length === pageSize.value
    }

    // 智能 hasMore 邏輯：如果後端返回了數據，且數據量等於頁面大小，或者後端明確表示還有更多數據
    hasMore.value =
      newMemes.length > 0 &&
      (newMemes.length === pageSize.value || backendHasMore)

    // 更新總數和頁數資訊
    if (response.data?.pagination) {
      totalCount.value = response.data.pagination.total || 0
      totalPages.value = response.data.pagination.totalPages || 1
    } else if (response.data?.total) {
      totalCount.value = response.data.total
      totalPages.value = Math.ceil(totalCount.value / pageSize.value)
    } else {
      totalCount.value = memes.value.length
      totalPages.value = hasMore.value
        ? currentPage.value + 1
        : currentPage.value
    }

    // 只在初始載入時更新 SEO 設定，避免在無限滾動時更新 URL
    if (reset) {
      updateSEOSettings()
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

              const authorResponse = await userService.get(authorId)
              meme.author = authorResponse.data.user
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

// 更新 SEO 設定
const updateSEOSettings = () => {
  // 準備 SEO 參數
  const seoParams = {
    title: '所有迷因',
    basePath: '/memes/all',
    searchQuery: searchQuery.value,
    selectedTags: selectedTags.value,
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    totalCount: totalCount.value,
  }

  // 設定 SEO
  setMemeListSEO(seoParams)

  // 更新瀏覽器 URL（只在初始載入或搜尋/篩選變化時）
  updateBrowserUrl(true)
}

// 更新瀏覽器 URL
const updateBrowserUrl = (shouldUpdate = false) => {
  // 如果不是明確要求更新，則跳過
  if (!shouldUpdate) {
    return
  }

  // 在無限滾動載入時不更新 URL，避免循環觸發
  if (
    currentPage.value > 1 &&
    !searchQuery.value.trim() &&
    selectedTags.value.length === 0
  ) {
    return
  }

  const params = cleanUrlParams({
    search: searchQuery.value,
    tags:
      selectedTags.value.length > 0
        ? selectedTags.value.map((tag) => tag.name)
        : null,
    // 只在第一頁或搜尋/篩選時才在 URL 中顯示頁面參數
    page:
      currentPage.value > 1 &&
      (searchQuery.value.trim() || selectedTags.value.length > 0)
        ? currentPage.value
        : null,
  })

  const newQuery = {}
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      newQuery[key] = params[key]
    }
  })

  // 只在查詢參數真正改變時更新 URL
  const currentQueryString = JSON.stringify(route.query)
  const newQueryString = JSON.stringify(newQuery)

  if (currentQueryString !== newQueryString) {
    router.replace({
      path: '/memes/all',
      query: newQuery,
    })
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

  // 檢查頁面參數
  if (route.query.page) {
    const pageNum = parseInt(route.query.page)
    if (!isNaN(pageNum) && pageNum > 0) {
      currentPage.value = pageNum
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
  description: '瀏覽所有迷因內容與熱門標籤，支援搜尋與標籤篩選，發現你喜歡的梗。'
  login: ''
  admin: false
</route>
