<template>
  <div
    class="source-card bg-white rounded-lg shadow p-6 dark:bg-surface-900 mb-6"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-surface-900 mb-2">出處資訊</h3>
        <div class="flex items-center space-x-4 text-sm text-surface-600">
          <span v-if="source.year">{{ source.year }}</span>
          <span v-if="source.type">{{ getSourceTypeName(source.type) }}</span>
        </div>
      </div>
      <Button
        label="前往出處頁"
        icon="pi pi-external-link"
        severity="secondary"
        size="small"
        @click="navigateToSource"
      />
    </div>

    <!-- 出處基本資訊 -->
    <div class="mb-4">
      <h4 class="font-semibold text-surface-800 mb-2">{{ source.title }}</h4>

      <!-- 精簡 synopsis（可收折） -->
      <div v-if="source.synopsis" class="mb-3">
        <div
          v-if="!expandedSynopsis"
          class="text-surface-700 text-sm leading-relaxed"
        >
          {{ truncatedSynopsis }}
          <button
            v-if="source.synopsis.length > 200"
            @click="expandedSynopsis = true"
            class="text-primary-600 hover:text-primary-700 font-medium ml-1"
          >
            展開更多
          </button>
        </div>
        <div v-else class="text-surface-700 text-sm leading-relaxed">
          {{ source.synopsis }}
          <button
            @click="expandedSynopsis = false"
            class="text-primary-600 hover:text-primary-700 font-medium ml-1"
          >
            收合
          </button>
        </div>
      </div>

      <!-- 外部連結 -->
      <div v-if="source.links && source.links.length > 0" class="mb-3">
        <div class="text-sm text-surface-600 mb-2">外部連結：</div>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="link in source.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-1 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-md text-sm transition-colors"
          >
            <i class="pi pi-external-link mr-1"></i>
            {{ link.title || '連結' }}
          </a>
        </div>
      </div>
    </div>

    <!-- 片段資訊（如果有） -->
    <div
      v-if="scene"
      class="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h5 class="font-semibold text-primary-700 dark:text-primary-300 mb-1">
            相關片段
          </h5>
          <div v-if="scene.quote" class="text-sm text-surface-700 mb-2 italic">
            "{{ scene.quote }}"
          </div>
          <div v-if="scene.start_time" class="text-sm text-surface-600">
            時間：{{ formatTime(scene.start_time) }}
          </div>
        </div>
        <Button
          label="在出處頁查看片段"
          icon="pi pi-play"
          severity="primary"
          size="small"
          @click="navigateToSource"
        />
      </div>
    </div>

    <!-- 同出處其他迷因 -->
    <div v-if="fromSource && fromSource.length > 0">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-surface-800">同出處其他迷因</h4>
        <Button
          label="查看全部"
          icon="pi pi-arrow-right"
          text
          size="small"
          @click="navigateToSource"
        />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          v-for="meme in fromSource.slice(0, 6)"
          :key="meme._id"
          class="flex flex-col items-center p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded cursor-pointer border dark:border-surface-600 transition-colors"
          @click="navigateToMeme(meme)"
        >
          <div
            class="w-full h-auto aspect-square bg-surface-100 rounded overflow-hidden mb-2"
          >
            <img
              v-if="meme.image_url"
              :src="meme.image_url"
              :alt="meme.title"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-surface-400"
            >
              <i class="pi pi-image"></i>
            </div>
          </div>
          <div class="w-full text-center">
            <div class="font-medium text-xs truncate px-1">
              {{ meme.title }}
            </div>
            <div class="text-xs text-surface-500 mt-1">
              {{ getAuthorName(meme.author) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

// Props
const props = defineProps({
  source: {
    type: Object,
    required: true,
  },
  scene: {
    type: Object,
    default: null,
  },
  fromSource: {
    type: Array,
    default: () => [],
  },
})

// 響應式數據
const expandedSynopsis = ref(false)

// 路由
const router = useRouter()

// 計算屬性
const truncatedSynopsis = computed(() => {
  if (!props.source.synopsis) return ''
  return props.source.synopsis.length > 200
    ? props.source.synopsis.substring(0, 200) + '...'
    : props.source.synopsis
})

// 方法
const getSourceTypeName = (type) => {
  const typeMap = {
    movie: '電影',
    tv: '電視劇',
    anime: '動畫',
    game: '遊戲',
    book: '書籍',
    music: '音樂',
    other: '其他',
  }
  return typeMap[type] || type
}

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return ''

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

const getAuthorName = (author) => {
  if (!author) return '匿名用戶'
  return author.display_name || author.username || '匿名用戶'
}

const navigateToSource = () => {
  if (props.source.slug) {
    router.push(`/source/${props.source.slug}`)
  }
}

const navigateToMeme = (meme) => {
  const memeId = meme.slug || meme._id
  router.push(`/memes/detail/${memeId}`)
}
</script>

<script>
export default {
  name: 'SourceCard',
}
</script>

<style scoped>
.source-card {
  border: 1px solid #e5e7eb;
}

.dark .source-card {
  border-color: #374151;
}
</style>
