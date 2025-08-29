<template>
  <div class="meme-remote-select">
    <div class="field">
      <label class="block font-semibold mb-2">
        選擇原始迷因 <span class="text-primary-500">*</span>
      </label>
      
      <AutoComplete
        v-model="searchText"
        :suggestions="suggestions"
        @complete="searchMemes"
        @item-select="selectMeme"
        placeholder="搜尋迷因標題..."
        class="w-full"
        :minLength="2"
        :delay="300"
        appendTo="body"
        :dropdown="false"
        :forceSelection="false"
      >
        <template #option="slotProps">
          <div class="meme-option flex items-start gap-3 p-2">
            <!-- 縮圖 -->
            <div class="meme-thumbnail flex-shrink-0">
              <img
                v-if="slotProps.option.image_url"
                :src="slotProps.option.image_url"
                :alt="slotProps.option.title"
                class="w-16 h-16 object-cover rounded"
                @error="(e) => e.target.src = '/images/placeholder.png'"
              />
              <div
                v-else-if="slotProps.option.type === 'text'"
                class="w-16 h-16 bg-surface-200 dark:bg-surface-700 rounded flex items-center justify-center"
              >
                <i class="pi pi-file-edit text-2xl text-surface-500"></i>
              </div>
              <div
                v-else
                class="w-16 h-16 bg-surface-200 dark:bg-surface-700 rounded flex items-center justify-center"
              >
                <i :class="getTypeIcon(slotProps.option.type)" class="text-2xl text-surface-500"></i>
              </div>
            </div>
            
            <!-- 資訊 -->
            <div class="meme-info flex-1">
              <div class="font-semibold">{{ slotProps.option.title }}</div>
              <div class="text-sm text-surface-500">
                作者：{{ slotProps.option.author_id?.display_name || slotProps.option.author_id?.username || '未知' }}
              </div>
              <div class="text-sm text-surface-400">
                <span v-if="slotProps.option.like_count">
                  <i class="pi pi-thumbs-up"></i> {{ slotProps.option.like_count }}
                </span>
                <span v-if="slotProps.option.view_count" class="ml-3">
                  <i class="pi pi-eye"></i> {{ slotProps.option.view_count }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </AutoComplete>

      <!-- 已選擇的迷因顯示 -->
      <div v-if="selectedMeme" class="mt-3 p-3 bg-surface-100 dark:bg-surface-800 rounded">
        <div class="flex items-start gap-3">
          <!-- 縮圖 -->
          <div class="flex-shrink-0">
            <img
              v-if="selectedMeme.image_url"
              :src="selectedMeme.image_url"
              :alt="selectedMeme.title"
              class="w-20 h-20 object-cover rounded"
              @error="(e) => e.target.src = '/images/placeholder.png'"
            />
            <div
              v-else-if="selectedMeme.type === 'text'"
              class="w-20 h-20 bg-surface-200 dark:bg-surface-700 rounded flex items-center justify-center"
            >
              <i class="pi pi-file-edit text-2xl text-surface-500"></i>
            </div>
            <div
              v-else
              class="w-20 h-20 bg-surface-200 dark:bg-surface-700 rounded flex items-center justify-center"
            >
              <i :class="getTypeIcon(selectedMeme.type)" class="text-2xl text-surface-500"></i>
            </div>
          </div>
          
          <!-- 資訊 -->
          <div class="flex-1">
            <div class="font-semibold text-lg">{{ selectedMeme.title }}</div>
            <div class="text-sm text-surface-500 mt-1">
              作者：{{ selectedMeme.author_id?.display_name || selectedMeme.author_id?.username || '未知' }}
            </div>
            <div v-if="selectedMeme.content" class="text-sm text-surface-600 mt-2">
              {{ truncateText(selectedMeme.content, 100) }}
            </div>
          </div>
          
          <!-- 清除按鈕 -->
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="clearSelection"
          />
        </div>
      </div>

      <Message v-if="error" severity="error" size="small" variant="simple">
        {{ error }}
      </Message>
      
      <small class="text-surface-500 block mt-2">
        <i class="pi pi-info-circle"></i>
        選擇原始迷因後，系統會自動計算變體系譜（lineage）
      </small>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import memeService from '@/services/memeService'

// PrimeVue 組件
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Message from 'primevue/message'

const props = defineProps({
  modelValue: String, // meme ID
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// 狀態
const searchText = ref('')
const suggestions = ref([])
const selectedMeme = ref(null)
const error = ref('')
const searching = ref(false)

// 搜尋迷因
const searchMemes = async (event) => {
  const query = event.query
  if (query.length < 2) {
    suggestions.value = []
    return
  }

  searching.value = true
  
  try {
    const { data } = await memeService.search(query, {
      limit: 10,
      fields: 'title,type,image_url,video_url,content,author_id,like_count,view_count',
    })
    
    suggestions.value = data.data || []
  } catch (err) {
    console.error('搜尋迷因失敗:', err)
    suggestions.value = []
  } finally {
    searching.value = false
  }
}

// 選擇迷因
const selectMeme = (event) => {
  const meme = event.value
  selectedMeme.value = meme
  searchText.value = meme.title
  error.value = ''
  
  // 更新父組件
  emit('update:modelValue', meme._id)
}

// 清除選擇
const clearSelection = () => {
  selectedMeme.value = null
  searchText.value = ''
  error.value = ''
  emit('update:modelValue', null)
}

// 取得類型圖示
const getTypeIcon = (type) => {
  const iconMap = {
    image: 'pi pi-image',
    video: 'pi pi-video',
    audio: 'pi pi-volume-up',
    text: 'pi pi-file-edit',
  }
  return iconMap[type] || 'pi pi-file'
}

// 截斷文字
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 監聽 props 變化
watch(() => props.modelValue, async (newVal) => {
  if (newVal && !selectedMeme.value) {
    // 如果有值但還沒載入，嘗試載入迷因資料
    try {
      const { data } = await memeService.get(newVal)
      selectedMeme.value = data.data
      searchText.value = data.data.title
    } catch (err) {
      console.error('載入迷因失敗:', err)
      error.value = '載入迷因資料失敗'
    }
  } else if (!newVal) {
    clearSelection()
  }
}, { immediate: true })

// 驗證必填
watch([() => props.required, () => props.modelValue], ([required, value]) => {
  if (required && !value) {
    error.value = '請選擇原始迷因'
  } else {
    error.value = ''
  }
})
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.meme-option {
  border-bottom: 1px solid var(--surface-200);
}

.meme-option:last-child {
  border-bottom: none;
}

.meme-option:hover {
  background-color: var(--surface-100);
}

.meme-thumbnail img {
  object-fit: cover;
}
</style>