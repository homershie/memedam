<template>
  <div class="relative">
    <InputGroup>
      <InputText
        ref="inputRef"
        v-model="searchQuery"
        :placeholder="props.placeholder"
        @keyup.enter="handleSearch"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
      />
      <InputGroupAddon>
        <div class="flex">
          <Button
            v-if="searchQuery.trim()"
            icon="pi pi-times"
            severity="secondary"
            variant="text"
            @click="clearSearch"
            v-tooltip.top="'清除搜尋'"
            class="mr-1"
          />
          <Button
            icon="pi pi-search"
            severity="secondary"
            variant="text"
            @click="handleSearch"
            v-tooltip.top="'搜尋'"
          />
        </div>
      </InputGroupAddon>
    </InputGroup>

    <!-- 搜尋建議下拉清單 -->
    <div
      v-if="
        showSuggestions &&
        (filteredSuggestions.length > 0 || popularKeywords.length > 0)
      "
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
    >
      <!-- 推薦關鍵字 -->
      <div v-if="!searchQuery.trim() && popularKeywords.length > 0" class="p-3">
        <div class="text-xs text-gray-500 mb-2">熱門搜尋</div>
        <div class="flex flex-wrap gap-1">
          <Tag
            v-for="keyword in popularKeywords"
            :key="keyword"
            :value="keyword"
            severity="secondary"
            class="cursor-pointer hover:bg-primary-50 text-xs"
            @click="selectSuggestion(keyword)"
          />
        </div>
      </div>

      <!-- 搜尋建議 -->
      <div v-if="searchQuery.trim() && filteredSuggestions.length > 0">
        <div class="text-xs text-gray-500 p-2 pb-0">搜尋建議</div>
        <div
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
          @mousedown="selectSuggestion(suggestion)"
        >
          <i class="pi pi-search text-gray-400 text-xs"></i>
          <span class="text-sm">{{ suggestion }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import memeService from '@/services/memeService'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜尋迷因',
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search'])

const router = useRouter()
const searchQuery = ref('')
const showSuggestions = ref(false)
const popularKeywords = ref([])
const searchSuggestions = ref([])
const inputRef = ref(null)

// 過濾後的建議
const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return searchSuggestions.value
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(query) &&
        suggestion.toLowerCase() !== query,
    )
    .slice(0, 5)
})

// 載入推薦關鍵字
const loadPopularKeywords = async () => {
  try {
    // 嘗試從熱門標籤獲取推薦關鍵字
    const tagService = await import('@/services/tagService')
    const response = await tagService.default.getPopular(10)
    const popularTags = response.data.popularTags || []

    // 從熱門標籤中提取關鍵字，並加入一些預設關鍵字
    const tagKeywords = popularTags.map((tag) => tag.name).slice(0, 6)
    const defaultKeywords = [
      '搞笑',
      '可愛',
      '表情包',
      '網路流行語',
      '心情',
      '工作',
    ]

    // 合併並去重
    popularKeywords.value = [
      ...new Set([...tagKeywords, ...defaultKeywords]),
    ].slice(0, 10)
  } catch (error) {
    console.warn('載入推薦關鍵字失敗:', error)
    // 使用預設關鍵字
    popularKeywords.value = [
      '貓咪',
      '狗狗',
      '搞笑',
      '可愛',
      '表情包',
      '台灣迷因',
      '網路流行語',
      '動物',
      '心情',
      '工作',
    ]
  }
}

// 載入搜尋建議
const loadSearchSuggestions = async () => {
  try {
    const response = await memeService.getSearchSuggestions()
    searchSuggestions.value = response.data.suggestions || []
  } catch (error) {
    console.warn('載入搜尋建議失敗:', error)
    // 使用預設建議
    searchSuggestions.value = [
      '可愛動物',
      '工作迷因',
      '心情迷因',
      '台灣特色',
      '網路梗圖',
      '表情包',
      '搞笑圖片',
      '日常生活',
      '學生生活',
      '上班族',
      '貓咪表情',
      '狗狗日常',
    ]
  }
}

// 處理輸入
const handleInput = () => {
  showSuggestions.value = true
}

// 處理失焦
const handleBlur = () => {
  // 延遲隱藏建議，允許點擊建議項目
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 選擇建議
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  handleSearch()
}

// 執行搜尋
const handleSearch = () => {
  if (!searchQuery.value.trim()) return

  showSuggestions.value = false

  // 觸發父元件事件
  emit('search', searchQuery.value.trim())

  // 跳轉到搜尋結果頁面
  router.push({
    path: '/memes/all',
    query: { search: searchQuery.value.trim() },
  })
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false

  // 觸發父元件事件，傳空值
  emit('search', '')

  // 跳轉到無搜尋參數的頁面
  router.push({
    path: '/memes/all',
  })
}

// 聚焦方法
const focus = () => {
  // 使用 setTimeout 確保 DOM 已經渲染
  setTimeout(() => {
    if (inputRef.value) {
      // 嘗試直接聚焦
      if (typeof inputRef.value.focus === 'function') {
        inputRef.value.focus()
      } else {
        // 如果沒有 focus 方法，嘗試找到實際的 input 元素
        const inputElement =
          inputRef.value.$el?.querySelector('input') ||
          document.querySelector('input[placeholder="搜尋迷因"]')
        if (inputElement) {
          inputElement.focus()
        }
      }
    }
  }, 50)
}

// 初始化
onMounted(() => {
  loadPopularKeywords()
  loadSearchSuggestions()

  // 如果設置了自動聚焦，等待 DOM 更新後聚焦
  if (props.autoFocus) {
    nextTick(() => {
      focus()
    })
  }
})

// 暴露方法給父元件
defineExpose({
  focus,
  clear: () => {
    searchQuery.value = ''
  },
  setQuery: (query) => {
    searchQuery.value = query
  },
})
</script>

<style scoped>
/* 自定義樣式 */
.p-inputgroup {
  width: 100%;
}

/* 確保建議清單在最上層 */
.z-50 {
  z-index: 50;
}
</style>
