<template>
  <div class="w-full mx-auto min-h-[calc(100vh-100px)] overflow-y-auto">
    <!-- 載入狀態 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>

    <!-- 錯誤狀態 -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-[400px]"
    >
      <Card class="p-6 text-center" unstyled>
        <template #content>
          <i
            class="pi pi-exclamation-triangle text-6xl text-primary-400 mb-4"
          ></i>
          <h2 class="text-2xl font-bold text-surface-800 mb-2">載入失敗</h2>
          <p class="text-surface-600 mb-4">{{ error }}</p>
          <Button label="重新載入" @click="loadSource" />
        </template>
      </Card>
    </div>

    <!-- 主要內容 -->
    <div v-else-if="source" class="mx-auto w-6xl px-4 py-6">
      <!-- 麵包屑導航 -->
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-6">
        <template #item="{ item, props }">
          <router-link
            v-if="item.url"
            v-slot="{ href, navigate }"
            :to="item.url"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
          <span
            v-else
            v-bind="props.action"
            class="text-surface-700 dark:text-surface-0"
          >
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>

      <!-- 標題區域 -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-surface-900 mb-2">
            {{ source.title }}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-surface-600">
            <span v-if="source.year">{{ source.year }}</span>
            <span v-if="source.type">{{ getSourceTypeName(source.type) }}</span>
            <span v-if="source.license">{{ source.license }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            v-if="userStore.isLoggedIn"
            icon="pi pi-plus"
            label="補充來源資訊"
            severity="secondary"
            size="small"
            @click="showSuggestionModal"
          />
          <Button
            v-if="userStore.isLoggedIn"
            icon="pi pi-plus"
            label="新增場景"
            severity="secondary"
            size="small"
            @click="showSceneModal"
          />
        </div>
      </div>

      <Divider class="my-6" />

      <!-- 出處詳細資訊 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 主要內容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 背景介紹 -->
          <Card class="shadow-sm">
            <template #title>
              <h2 class="text-xl font-bold text-surface-900">背景介紹</h2>
            </template>
            <template #content>
              <div v-if="source.synopsis" class="prose max-w-none">
                <p class="text-surface-700 leading-relaxed">
                  {{ source.synopsis }}
                </p>
              </div>
              <div v-else class="text-surface-500 italic">暫無背景介紹</div>
            </template>
          </Card>

          <!-- 授權資訊 -->
          <Card v-if="source.license" class="shadow-sm">
            <template #title>
              <h2 class="text-xl font-bold text-surface-900">授權資訊</h2>
            </template>
            <template #content>
              <p class="text-surface-700">{{ source.license }}</p>
            </template>
          </Card>

          <!-- 外部連結 -->
          <Card
            v-if="source.links && source.links.length > 0"
            class="shadow-sm"
          >
            <template #title>
              <h2 class="text-xl font-bold text-surface-900">外部連結</h2>
            </template>
            <template #content>
              <div class="space-y-2">
                <a
                  v-for="link in source.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center p-3 bg-surface-50 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <i class="pi pi-external-link mr-3 text-primary-600"></i>
                  <div>
                    <div class="font-medium text-surface-800">
                      {{ link.title || '連結' }}
                    </div>
                    <div class="text-sm text-surface-600">{{ link.url }}</div>
                  </div>
                </a>
              </div>
            </template>
          </Card>
        </div>

        <!-- 側邊欄 -->
        <div class="space-y-6">
          <!-- 出處統計 -->
          <Card class="shadow-sm">
            <template #title>
              <h3 class="text-lg font-bold text-surface-900">統計資訊</h3>
            </template>
            <template #content>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-surface-600">相關迷因</span>
                  <span class="font-medium">{{ memes.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600">場景數量</span>
                  <span class="font-medium">{{ scenes.length }}</span>
                </div>
                <div v-if="source.year" class="flex justify-between">
                  <span class="text-surface-600">發布年份</span>
                  <span class="font-medium">{{ source.year }}</span>
                </div>
                <div v-if="source.type" class="flex justify-between">
                  <span class="text-surface-600">類型</span>
                  <span class="font-medium">{{
                    getSourceTypeName(source.type)
                  }}</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- 快速操作 -->
          <Card class="shadow-sm">
            <template #title>
              <h3 class="text-lg font-bold text-surface-900">快速操作</h3>
            </template>
            <template #content>
              <div class="space-y-2">
                <Button
                  label="查看所有迷因"
                  icon="pi pi-images"
                  severity="primary"
                  class="w-full"
                  @click="scrollToMemes"
                />
                <Button
                  v-if="scenes.length > 0"
                  label="查看場景時間線"
                  icon="pi pi-clock"
                  severity="secondary"
                  class="w-full"
                  @click="scrollToScenes"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- 場景時間線 -->
      <div v-if="scenes.length > 0" id="scenes" class="mb-8">
        <Card class="shadow-sm">
          <template #title>
            <h2 class="text-xl font-bold text-surface-900">場景時間線</h2>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="scene in scenes"
                :key="scene._id"
                class="flex items-start space-x-4 p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="pi pi-play text-primary-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-surface-800 mb-1">
                    {{ scene.title }}
                  </h3>
                  <div
                    v-if="scene.quote"
                    class="text-sm text-surface-600 mb-2 italic"
                  >
                    "{{ scene.quote }}"
                  </div>
                  <div
                    class="flex items-center space-x-4 text-sm text-surface-500"
                  >
                    <span v-if="scene.start_time">
                      開始：{{ formatTime(scene.start_time) }}
                    </span>
                    <span v-if="scene.end_time">
                      結束：{{ formatTime(scene.end_time) }}
                    </span>
                    <span v-if="scene.duration">
                      時長：{{ formatTime(scene.duration) }}
                    </span>
                  </div>
                </div>
                <Button
                  label="查看場景"
                  icon="pi pi-external-link"
                  severity="secondary"
                  size="small"
                  @click="viewScene(scene)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- 相關迷因列表 -->
      <div id="memes" class="mb-8">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-surface-900">
                使用此出處的迷因
              </h2>
              <div class="flex items-center space-x-2">
                <Dropdown
                  v-model="sortBy"
                  :options="sortOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="排序方式"
                  class="w-40"
                  @change="loadMemes"
                />
                <Button
                  icon="pi pi-refresh"
                  severity="secondary"
                  size="small"
                  @click="loadMemes"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div
              v-if="memes.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <div
                v-for="meme in memes"
                :key="meme._id"
                class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                @click="navigateToMeme(meme)"
              >
                <div
                  class="aspect-square bg-surface-100 rounded-t-lg overflow-hidden"
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
                    <i class="pi pi-image text-2xl"></i>
                  </div>
                </div>
                <div class="p-3">
                  <h3 class="font-medium text-surface-800 mb-1 line-clamp-2">
                    {{ meme.title }}
                  </h3>
                  <div
                    class="flex items-center justify-between text-sm text-surface-500"
                  >
                    <span>{{ getAuthorName(meme.author) }}</span>
                    <div class="flex items-center space-x-2">
                      <span class="flex items-center">
                        <i class="pi pi-thumbs-up mr-1"></i>
                        {{ meme.like_count || 0 }}
                      </span>
                      <span class="flex items-center">
                        <i class="pi pi-eye mr-1"></i>
                        {{ meme.view_count || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-surface-500">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p>暫無相關迷因</p>
            </div>

            <!-- 分頁 -->
            <div v-if="totalMemes > pageSize" class="flex justify-center mt-6">
              <Paginator
                :rows="pageSize"
                :total-records="totalMemes"
                :first="(currentPage - 1) * pageSize"
                @page="onPageChange"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 建議模態框 -->
    <Dialog
      v-model:visible="showSuggestionDialog"
      header="補充來源資訊"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <div class="space-y-4">
        <p class="text-surface-600">
          您可以為這個出處補充更多資訊，包括背景介紹、外部連結等。
        </p>
        <Button
          label="前往建議頁面"
          icon="pi pi-external-link"
          severity="primary"
          @click="navigateToSuggestion"
        />
      </div>
    </Dialog>

    <!-- 新增場景模態框 -->
    <Dialog
      v-model:visible="showSceneDialog"
      header="新增場景"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <div class="space-y-4">
        <p class="text-surface-600">
          您可以為這個出處新增場景，包括時間碼、引用內容等。
        </p>
        <Button
          label="前往新增場景頁面"
          icon="pi pi-external-link"
          severity="primary"
          @click="navigateToSceneCreate"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'

// PrimeVue 組件
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'
import Breadcrumb from 'primevue/breadcrumb'

// 服務
import sourceService from '@/services/sourceService'
import memeService from '@/services/memeService'

// 路由和狀態
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

// 響應式數據
const loading = ref(true)
const error = ref(null)
const source = ref(null)
const scenes = ref([])
const memes = ref([])

// 麵包屑相關
const breadcrumbHome = ref({
  icon: 'pi pi-home',
  url: '/',
})

const breadcrumbItems = computed(() => {
  if (!source.value) return []

  return [
    {
      label: source.value.title,
      url: null, // 當前頁面，不設連結
    },
  ]
})

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(12)
const totalMemes = ref(0)

// 排序相關
const sortBy = ref('hot')
const sortOptions = ref([
  { label: '熱門', value: 'hot' },
  { label: '最新', value: 'new' },
  { label: '最多讚', value: 'likes' },
  { label: '最多瀏覽', value: 'views' },
])

// 模態框
const showSuggestionDialog = ref(false)
const showSceneDialog = ref(false)

// 計算屬性
const sourceSlug = computed(() => route.params.slug)

// 方法
const getSourceTypeName = (type) => {
  const typeMap = {
    video: '影片',
    film: '電影',
    tv: '電視',
    ad: '廣告',
    web: '網路',
    article: '文章',
    music: '音樂',
    broadcast: '廣播',
    podcast: 'Podcast',
    game: '遊戲',
    anime: '動畫',
    comic: '漫畫',
    event: '事件',
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

const loadSource = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await sourceService.getBySlug(sourceSlug.value)

    if (response.data && response.data.data) {
      source.value = response.data.data

      // 載入相關數據
      await Promise.allSettled([loadScenes(), loadMemes()])
    } else {
      error.value = '找不到該出處'
    }
  } catch (err) {
    console.error('載入出處失敗:', err)
    error.value =
      err.response?.status === 404 ? '找不到該出處' : '載入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

const loadScenes = async () => {
  try {
    if (!source.value?._id) return

    const response = await sourceService.getScenes(source.value._id)
    if (response.data) {
      scenes.value = response.data.data || response.data || []
    }
  } catch (error) {
    console.error('載入場景失敗:', error)
    scenes.value = []
  }
}

const loadMemes = async () => {
  try {
    if (!source.value?._id) return

    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortBy.value,
    }

    const response = await memeService.getBySource(source.value._id, params)
    if (response.data) {
      const data = response.data.data || response.data
      memes.value = data.memes || data || []
      totalMemes.value = data.pagination?.total || memes.value.length
    }
  } catch (error) {
    console.error('載入迷因失敗:', error)
    memes.value = []
    totalMemes.value = 0
  }
}

const navigateToMeme = (meme) => {
  const memeId = meme.slug || meme._id
  router.push(`/memes/detail/${memeId}`)
}

const viewScene = (_scene) => {
  // TODO: 實作場景查看功能
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '場景查看功能即將推出',
    life: 3000,
  })
}

const scrollToMemes = () => {
  document.getElementById('memes')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToScenes = () => {
  document.getElementById('scenes')?.scrollIntoView({ behavior: 'smooth' })
}

const showSuggestionModal = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  showSuggestionDialog.value = true
}

const showSceneModal = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  showSceneDialog.value = true
}

const navigateToSuggestion = () => {
  showSuggestionDialog.value = false
  // TODO: 導向建議頁面
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '建議功能即將推出',
    life: 3000,
  })
}

const navigateToSceneCreate = () => {
  showSceneDialog.value = false
  // TODO: 導向新增場景頁面
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '新增場景功能即將推出',
    life: 3000,
  })
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  loadMemes()
}

// 監聽路由變化
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      loadSource()
    }
  },
)

// 頁面標題
watch(source, (newSource) => {
  if (newSource) {
    document.title = `${newSource.title} — 出處 | 迷因典 MemeDam`
  }
})

// 初始化
onMounted(() => {
  loadSource()
})
</script>

<script>
export default {
  name: 'SourceDetailPage',
}
</script>

<route lang="yaml">
meta:
  title: '出處詳情'
  description: '查看出處的詳細資訊、場景時間線和相關迷因。'
  login: ''
  admin: false
</route>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
