<template>
  <Card class="mb-6 shadow-none bg-surface-50 dark:bg-surface-900">
    <template #content>
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <small class="text-surface-500 dark:text-surface-400">出處資訊</small>
          <h4>{{ source.title }}</h4>
        </div>
        <Button
          label="前往出處頁"
          icon="pi pi-external-link"
          severity="primary"
          size="small"
          @click="navigateToSource"
        />
      </div>

      <!-- 出處基本資訊 -->
      <div class="mb-2">
        <div>
          這篇迷因來自於<span v-if="source.year">{{ source.year }}</span
          >年的<span v-if="source.type">{{
            getSourceTypeName(source.type)
          }}</span
          >：<a
            @click.prevent="navigateToSource"
            class="font-semibold underline hover:text-primary-500 cursor-pointer"
            >{{ source.title }}</a
          >，點擊連結可以前往出處頁面，查看其他相同出處的迷因，以及相關的資訊。
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'

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

// 路由
const router = useRouter()

// 方法
const getSourceTypeName = (type) => {
  const typeMap = {
    // 舊鍵值（向後相容）
    movie: '電影',
    tv: '電視劇',
    anime: '動畫',
    game: '遊戲',
    book: '書籍',
    music: '音樂',
    other: '其他',
    // 與 SourceScenePicker 對應
    video: '影片',
    film: '電影',
    ad: '廣告',
    web: '網路影片',
    article: '文章',
  }
  return typeMap[type] || type
}

const navigateToSource = () => {
  const slug = props.source?.slug
  if (slug) {
    router.push(`/source/${slug}`)
    return
  }
  const id = props.source?._id
  if (id) {
    router.push(`/source/${id}`)
    return
  }
  // 後備：若沒有 slug，嘗試開啟原始連結
  if (props.source?.url) {
    window.open(props.source.url, '_blank', 'noopener,noreferrer')
    return
  }
  console.warn('[SourceCard] 缺少 slug 與 url，無法導向來源頁', props.source)
}
</script>

<script>
export default {
  name: 'SourceCard',
}
</script>
