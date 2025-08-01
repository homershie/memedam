<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="w-5xl p-8 mx-auto space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6 text-start">
      <h1 class="text-3xl font-bold text-gray-800">標籤分類</h1>
      <p class="text-gray-600 mt-2">探索不同類型的迷因標籤</p>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 標籤分類內容 -->
    <div v-else class="space-y-8">
      <!-- 迷因類型標籤 -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">迷因類型</h2>
        <div class="flex flex-wrap gap-3">
          <Tag
            v-for="tag in memeTypeTags"
            :key="tag._id"
            :value="`#${tag.name} (${tag.count})`"
            :severity="isTagSelected(tag) ? 'success' : 'primary'"
            class="cursor-pointer hover:bg-primary-50"
            @click="onTagClick(tag)"
          />
        </div>
      </div>

      <!-- 熱門標籤 -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">熱門標籤</h2>
        <div class="flex flex-wrap gap-3">
          <Tag
            v-for="tag in popularTags"
            :key="tag._id"
            :value="`#${tag.name} (${tag.usageCount})`"
            :severity="isTagSelected(tag) ? 'success' : 'info'"
            class="cursor-pointer hover:bg-info-50"
            @click="onTagClick(tag)"
          />
        </div>
      </div>

      <!-- 所有標籤 -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">所有標籤</h2>
        <div class="flex flex-wrap gap-3">
          <Tag
            v-for="tag in allTags"
            :key="tag._id"
            :value="`#${tag.name}`"
            :severity="isTagSelected(tag) ? 'success' : 'secondary'"
            class="cursor-pointer hover:bg-secondary-50"
            @click="onTagClick(tag)"
          />
        </div>
      </div>

      <!-- 篩選狀態顯示 -->
      <div v-if="selectedTags.length > 0" class="bg-blue-50 rounded-lg p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">已篩選：</span>
            <Tag
              v-for="tag in selectedTags"
              :key="tag._id"
              :value="`#${tag.name}`"
              severity="success"
              class="cursor-pointer"
              @click="removeTag(tag)"
            />
          </div>
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

      <!-- 篩選結果 -->
      <div
        v-if="selectedTags.length > 0"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          篩選結果 ({{ filteredMemes.length }} 個迷因)
        </h3>
        <div v-if="filteredMemes.length > 0" class="space-y-4">
          <MemeCard
            v-for="meme in filteredMemes"
            :key="meme.id"
            :meme="meme"
            @tag-click="onTagClick"
            @show-comments="onShowComments"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <i class="pi pi-search text-4xl mb-2"></i>
          <p>沒有找到符合篩選條件的迷因</p>
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
import tagService from '@/services/tagService'
import Tag from 'primevue/tag'

const toast = useToast()

// 響應式數據
const loading = ref(false)
const memeTypeTags = ref([])
const popularTags = ref([])
const allTags = ref([])
const selectedTags = ref([])
const filteredMemes = ref([])

// 評論對話框
const showCommentsDialog = ref(false)
const selectedMeme = ref(null)

// 載入標籤分類
const loadTagCategories = async () => {
  try {
    loading.value = true
    const response = await tagService.getCategories({ lang: 'zh' })
    if (response.data && response.data.categories) {
      memeTypeTags.value = response.data.categories.memeTypes || []
      popularTags.value = response.data.categories.popularTags || []
      allTags.value = response.data.categories.allTags || []
    }
  } catch (error) {
    console.error('載入標籤分類失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入標籤分類，請稍後再試',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 載入篩選結果
const loadFilteredMemes = async () => {
  if (selectedTags.value.length === 0) {
    filteredMemes.value = []
    return
  }

  try {
    const tagNames = selectedTags.value.map((tag) => tag.name)
    const params = {
      tags: tagNames.join(','),
      limit: 20,
    }

    const response = await memeService.getAll(params)
    filteredMemes.value = response.data.memes || []
  } catch (error) {
    console.error('載入篩選結果失敗:', error)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法載入篩選結果，請稍後再試',
      life: 3000,
    })
  }
}

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
    loadFilteredMemes()
  }
}

// 移除標籤篩選
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t._id !== tag._id)
  loadFilteredMemes()
}

// 清除所有篩選
const clearFilters = () => {
  selectedTags.value = []
  filteredMemes.value = []
}

// 顯示評論
const onShowComments = (meme) => {
  selectedMeme.value = meme
  showCommentsDialog.value = true
}

// 初始化
onMounted(async () => {
  await loadTagCategories()
})
</script>

<route lang="yaml">
meta:
  title: '標籤分類'
  login: ''
  admin: false
</route>
