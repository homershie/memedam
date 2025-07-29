<template>
  <Card
    class="mb-4 cursor-pointer hover:shadow-md transition-shadow"
    @click="navigateToDetail"
  >
    <template #content>
      <div class="p-4">
        <div class="flex gap-4">
          <!-- 媒體內容 -->
          <div class="w-20 h-20 flex-shrink-0">
            <div
              v-if="meme.type === 'image' && meme.image_url"
              class="relative w-full h-full overflow-hidden rounded-lg"
            >
              <img
                :src="meme.image_url"
                :alt="meme.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else-if="meme.type === 'video' && meme.video_url"
              class="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <i class="pi pi-play text-gray-500 text-xl"></i>
            </div>
            <div
              v-else-if="meme.type === 'audio' && meme.audio_url"
              class="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <i class="pi pi-volume-up text-gray-500 text-xl"></i>
            </div>
            <div
              v-else-if="meme.type === 'gif' && meme.image_url"
              class="relative w-full h-full overflow-hidden rounded-lg"
            >
              <img
                :src="meme.image_url"
                :alt="meme.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else-if="meme.type === 'text'"
              class="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
            >
              <i class="pi pi-align-left text-white text-xl"></i>
            </div>
            <div
              v-else
              class="relative w-full h-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center"
            >
              <i class="pi pi-image text-gray-400 text-xl"></i>
            </div>
          </div>

          <!-- 內容信息 -->
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-semibold text-gray-800 mb-2 truncate">
              {{ meme.title }}
            </h4>
            <p
              v-if="meme.content"
              class="text-gray-600 text-sm mb-3 line-clamp-2"
            >
              {{ meme.content }}
            </p>

            <!-- 標籤 -->
            <div class="flex flex-wrap gap-1 mb-3" v-if="tags.length > 0">
              <Tag
                v-for="tag in tags.slice(0, 3)"
                :key="tag._id"
                :value="`#${tag.name}`"
                severity="secondary"
                class="text-xs cursor-pointer"
                @click.stop="onTagClick(tag)"
              />
              <span v-if="tags.length > 3" class="text-xs text-gray-400">
                +{{ tags.length - 3 }}
              </span>
            </div>

            <!-- 互動統計 -->
            <div
              class="flex items-center justify-between text-sm text-gray-500"
            >
              <div class="flex items-center space-x-4">
                <span class="flex items-center gap-1">
                  <i class="pi pi-thumbs-up text-xs"></i>
                  {{ likesCount }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-comment text-xs"></i>
                  {{ commentsCount }}
                </span>
              </div>
              <span class="text-xs">{{ publishedTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import memeTagService from '@/services/memeTagService'
import { formatPublishedTime, getMemeId } from '@/utils/dataUtils'

const props = defineProps({
  meme: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['tag-click'])

const router = useRouter()
const tags = ref([])

const memeId = computed(() => getMemeId(props.meme))
const publishedTime = computed(() => formatPublishedTime(props.meme))
const likesCount = computed(
  () => props.meme.likes_count || props.meme.like_count || 0,
)
const commentsCount = computed(
  () => props.meme.comments_count || props.meme.comment_count || 0,
)

// 載入標籤
const loadTags = async () => {
  try {
    let id = props.meme.id || props.meme._id
    if (typeof id === 'object' && id.$oid) {
      id = id.$oid
    }
    if (!id) return

    const response = await memeTagService.getTagsByMemeId(id)
    if (response.data && Array.isArray(response.data)) {
      tags.value = response.data
    } else if (response.data && Array.isArray(response.data.tags)) {
      tags.value = response.data.tags
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      tags.value = response.data.data
    } else {
      tags.value = []
    }
  } catch (error) {
    console.error('載入標籤失敗:', error)
    tags.value = []
  }
}

const navigateToDetail = () => {
  router.push(`/memes/detail/${memeId.value}`)
}

const onTagClick = (tag) => {
  emit('tag-click', tag)
}

onMounted(() => {
  loadTags()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.p-card {
  border: 1px solid #e5e7eb;
}

.p-card:hover {
  border-color: #d1d5db;
}
</style>
