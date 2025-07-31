<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ConfirmPopup />
  <div class="max-w-5xl p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-start">
      <h1 class="text-3xl font-bold text-gray-800">熱門迷因</h1>
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
      <h3 class="text-xl font-semibold text-gray-600 mb-2">暫無熱門迷因</h3>
      <p class="text-gray-500">
        {{
          selectedTags.length > 0
            ? '沒有符合篩選條件的熱門迷因'
            : '目前沒有熱門迷因，請稍後再試'
        }}
      </p>
      <Button
        label="重新載入"
        icon="pi pi-refresh"
        @click="loadMemes"
        class="mt-4"
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
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import MemeCard from '@/components/MemeCard.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import userService from '@/services/userService'
import recommendationService from '@/services/recommendationService'
import Tag from 'primevue/tag'

const toast = useToast()

// 響應式數據
const memes = ref([])
const loading = ref(false)

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

// 載入熱門迷因列表
const loadMemes = async () => {
  // 防止重複載入
  if (loading.value) {
    return
  }

  try {
    loading.value = true
    memes.value = []

    const params = {
      limit: 50,
    }

    const response = await recommendationService.getHotRecommendations(params)

    // 處理不同的回應格式
    let memesData = []
    if (response.data) {
      if (Array.isArray(response.data)) {
        memesData = response.data
      } else if (response.data.memes) {
        memesData = response.data.memes
      } else if (response.data.recommendations) {
        memesData = response.data.recommendations
      } else if (response.data.data) {
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
      } else {
        memesData = [response.data]
      }
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
                  authorId = null
                }
              } else if (typeof meme.author_id === 'number') {
                authorId = meme.author_id.toString()
              }

              if (authorId) {
                const authorResponse = await userService.get(authorId)
                meme.author = authorResponse.data.user
              } else {
                // 無法解析作者 ID，設定預設值
                meme.author = {
                  display_name: '匿名用戶',
                  username: 'anonymous',
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
        } catch {
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

    // 根據選擇的標籤進行前端篩選
    let filteredMemes = memesWithAuthors

    if (selectedTags.value.length > 0) {
      const selectedTypes = selectedTags.value.map((tag) => tag._id)
      filteredMemes = memesWithAuthors.filter((meme) => {
        return selectedTypes.includes(meme.type)
      })
    }

    memes.value = filteredMemes

    // 如果沒有資料，顯示提示
    if (filteredMemes.length === 0) {
      console.warn('熱門推薦 API 返回空資料或篩選後無結果')
    }
  } catch (error) {
    console.error('載入熱門迷因失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入熱門迷因列表，請稍後再試',
      life: 3000,
    })
  } finally {
    loading.value = false
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

// 初始化
onMounted(async () => {
  await loadMemes()
})
</script>

<route lang="yaml">
meta:
  title: '熱門迷因'
  login: ''
  admin: false
</route>
