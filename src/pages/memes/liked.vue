<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ConfirmPopup />
  <div class="w-5xl p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-start">
      <h1 class="text-3xl font-bold text-gray-800">最多人喜歡</h1>
    </div>

    <div class="flex justify-between flex-wrap">
      <!-- 迷因類型標籤 -->
      <div class="flex flex-wrap gap-2 mb-6 justify-start items-center">
        <Tag
          v-for="tag in memeTypeTags"
          :key="tag._id"
          :value="`#${tag.name}`"
          :severity="isTagSelected(tag) ? 'success' : 'primary'"
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
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無受歡迎迷因</h3>
      <p class="text-gray-500">
        {{
          selectedTags.length > 0
            ? '沒有符合篩選條件的受歡迎迷因'
            : '目前沒有受歡迎的迷因，請稍後再試'
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
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import MemeCard from '@/components/MemeCard.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import memeService from '@/services/memeService'
import userService from '@/services/userService'
import Tag from 'primevue/tag'
import { useInfiniteScrollWrapper } from '@/composables/useInfiniteScroll'

const toast = useToast()

// 響應式數據
const memes = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(5)

// 篩選和排序
const selectedTags = ref([])

// 迷因類型標籤
const memeTypeTags = ref([
  { _id: 'text', name: '用語' },
  { _id: 'image', name: '圖片' },
  { _id: 'gif', name: 'GIF' },
  { _id: 'video', name: '影片' },
  { _id: 'audio', name: '音訊' },
])

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
      sort: 'likes',
      order: 'desc',
    }

    // 如果有標籤篩選，加入標籤參數
    if (selectedTags.value.length > 0) {
      const tagNames = selectedTags.value.map((tag) => tag.name)
      params.tags = tagNames.join(',')
    }

    const response = await memeService.getAll(params)

    const newMemes = response.data.memes || response.data || []

    // 為每個迷因載入作者資訊
    const memesWithAuthors = await Promise.all(
      newMemes.map(async (meme) => {
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

    if (reset) {
      memes.value = memesWithAuthors
    } else {
      memes.value.push(...memesWithAuthors)
    }

    // 檢查是否還有更多資料
    if (response.data && response.data.pagination) {
      hasMore.value = response.data.pagination.hasMore
    } else {
      hasMore.value = memesWithAuthors.length === pageSize.value
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

// 無限滾動載入函數
const loadMoreContent = async () => {
  if (memes.value.length === 0) {
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

// 初始化
onMounted(async () => {
  await loadMemes()
})
</script>

<route lang="yaml">
meta:
  title: '最多人喜歡'
  login: ''
  admin: false
</route>
