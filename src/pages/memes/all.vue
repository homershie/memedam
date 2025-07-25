<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">所有迷因</h1>
      <p class="text-gray-600 mt-2">探索最新、最熱門的迷因內容</p>
    </div>

    <!-- 篩選和排序 -->
    <div class="flex flex-wrap gap-2 mb-6 justify-center">
      <Tag
        v-for="tag in topTags"
        :key="tag._id"
        :value="`#${tag.name}`"
        severity="primary"
        class="cursor-pointer hover:bg-primary-50"
        @click="onTagClick(tag)"
      />
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 迷因列表 -->
    <div v-else-if="memes.length > 0" class="space-y-6">
      <MemeCard
        v-for="meme in memes"
        :key="meme.id"
        :meme="meme"
        @tag-click="onTagClick"
        @show-comments="onShowComments"
      />
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-12">
      <i class="pi pi-image text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無迷因內容</h3>
      <p class="text-gray-500">
        目前沒有符合條件的迷因，請稍後再試或調整篩選條件
      </p>
      <Button
        label="重新載入"
        icon="pi pi-refresh"
        @click="loadMemes"
        class="mt-4"
      />
    </div>

    <!-- 載入更多按鈕 -->
    <div v-if="hasMore && !loading" class="text-center py-6">
      <Button
        label="載入更多"
        icon="pi pi-chevron-down"
        @click="loadMore"
        :loading="loadingMore"
        severity="secondary"
        outlined
      />
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
import { useToast } from 'primevue/usetoast'
import MemeCard from '@/components/MemeCard.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import memeService from '@/services/memeService'
import userService from '@/services/userService'
import tagService from '@/services/tagService'
import Tag from 'primevue/tag'

const toast = useToast()

// 響應式數據
const memes = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 篩選和排序
const sortBy = ref('created_at_desc')
const selectedTags = ref([])
const availableTags = ref([])

// 評論對話框
const showCommentsDialog = ref(false)
const selectedMeme = ref(null)

// 載入迷因列表
const loadMemes = async (reset = true) => {
  try {
    if (reset) {
      loading.value = true
      currentPage.value = 1
      memes.value = []
    } else {
      loadingMore.value = true
    }

    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortBy.value,
    }

    // 如果有選擇標籤，加入篩選參數
    if (selectedTags.value.length > 0) {
      params.tags = selectedTags.value.join(',')
    }

    const response = await memeService.getAll(params)
    const newMemes = response.data.memes || response.data || []

    // 為每個迷因載入作者資訊
    const memesWithAuthors = await Promise.all(
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

    if (reset) {
      memes.value = memesWithAuthors
    } else {
      memes.value.push(...memesWithAuthors)
    }

    // 檢查是否還有更多資料
    hasMore.value = newMemes.length === pageSize.value
  } catch {
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入迷因列表，請稍後再試',
      life: 3000,
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 載入更多
const loadMore = async () => {
  currentPage.value++
  await loadMemes(false)
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

// 載入特定標籤的迷因
const loadMemesByTag = async (tagId) => {
  try {
    loading.value = true
    currentPage.value = 1
    memes.value = []
    selectedTags.value = [tagId]
    await loadMemes()
  } catch {
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入標籤迷因，請稍後再試',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 標籤點擊處理
const onTagClick = (tag) => {
  // 這裡根據 tag 查詢迷因
  // 你原本的 loadMemesByTag 或其他查詢邏輯
  loadMemesByTag(tag.id)
}

// 顯示評論
const onShowComments = (meme) => {
  selectedMeme.value = meme
  showCommentsDialog.value = true
}

// 監聽排序變化
watch(sortBy, () => {
  loadMemes()
})

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
