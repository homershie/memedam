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
    <div v-else-if="source" class="mx-auto max-w-6xl px-4 py-6">
      <!-- 麵包屑導航 -->
      <Breadcrumb
        :home="breadcrumbHome"
        :model="breadcrumbItems"
        class="p-2 bg-transparent mb-6"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="p-0! text-surface-800 dark:text-surface-100 hover:text-primary-500"
            >
              <span :class="[item.icon]" />
              <span class="hover:underline">{{ item.label }}</span>
            </a>
          </router-link>
          <span
            v-else
            v-bind="props.action"
            class="text-surface-800 dark:text-surface-100"
          >
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>

      <!-- 標題區域 -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h1 class="mb-4">
            {{ source.title }}
          </h1>
          <!-- 標籤 -->
          <div class="flex flex-wrap gap-2">
            <CustomTag
              v-for="tag in source.tags"
              :key="tag"
              :value="tag"
              severity="primary"
            />
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
            @click="showScenePicker"
          />
        </div>
      </div>

      <!-- 縮圖展示 -->
      <div
        v-if="source.thumbnails && source.thumbnails.length > 0"
        class="mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(thumbnail, index) in source.thumbnails"
            :key="index"
            class="aspect-video bg-surface-100 rounded-lg overflow-hidden"
          >
            <img
              :src="thumbnail"
              :alt="`${source.title} 縮圖 ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <Divider class="my-6" />

      <!-- 出處詳細資訊 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 主要內容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 簡介和背景/補充說明 -->
          <div class="p-4">
            <template v-if="source.synopsis">
              <h2 class="mb-4">簡介</h2>
              <div class="prose max-w-none">
                <p class="text-surface-700 leading-relaxed whitespace-pre-line">
                  {{ source.synopsis }}
                </p>
              </div>
            </template>
            <template v-else>
              <div class="text-surface-500 italic">暫無簡介</div>
            </template>

            <template v-if="source.context">
              <h2 class="mt-8 mb-4">背景/補充說明</h2>
              <div class="prose max-w-none">
                <p class="text-surface-700 leading-relaxed whitespace-pre-line">
                  {{ source.context }}
                </p>
              </div>
            </template>
          </div>

          <!-- 創作者 -->
          <Card v-if="source.creators && source.creators.length > 0">
            <template #title>
              <h2 class="text-xl font-bold text-surface-900">創作者</h2>
            </template>
            <template #content>
              <div class="space-y-2">
                <div
                  v-for="creator in source.creators"
                  :key="creator._id || creator.name"
                  class="flex items-center space-x-3 p-2 bg-surface-50 rounded-lg"
                >
                  <div
                    class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <i class="pi pi-user text-primary-600"></i>
                  </div>
                  <div>
                    <div class="font-medium text-surface-800">
                      {{ creator.name }}
                    </div>
                    <div v-if="creator.role" class="text-sm text-surface-600">
                      {{ creator.role }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 側邊欄 -->
        <div class="space-y-6">
          <!-- 出處統計 -->
          <Card>
            <template #title>
              <h3 class="text-lg font-bold text-surface-900">資訊卡</h3>
            </template>
            <template #content>
              <div class="space-y-3">
                <div
                  v-if="source.alt_titles && source.alt_titles.length > 0"
                  class="flex justify-between"
                >
                  <span class="flex-1 text-surface-600 dark:text-surface-400"
                    >其他名稱</span
                  >
                  <span class="flex-1 font-medium text-right">{{
                    source.alt_titles.join('、')
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >相關迷因</span
                  >
                  <span class="font-medium">{{
                    source.counts?.memes || memes.length
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >場景數量</span
                  >
                  <span class="font-medium">{{
                    source.counts?.scenes || scenes.length
                  }}</span>
                </div>
                <div v-if="source.year" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >發布年份</span
                  >
                  <span class="font-medium">{{ source.year }}</span>
                </div>
                <div v-if="source.type" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >類型</span
                  >
                  <span class="font-medium">{{
                    getSourceTypeName(source.type)
                  }}</span>
                </div>
                <div v-if="source.origin_country" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >來源國家</span
                  >
                  <span class="font-medium">{{ source.origin_country }}</span>
                </div>
                <div v-if="source.license" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400 flex-1"
                    >授權資訊</span
                  >
                  <span class="font-medium flex-1 text-right">{{
                    getLicenseText(source.license)
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >最後更新</span
                  >
                  <span class="font-medium">{{
                    formatDate(source.updatedAt)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >狀態</span
                  >
                  <span class="font-medium">
                    <span
                      :class="{
                        'text-success-600': source.status === 'active',
                        'text-primary-600':
                          source.status === 'inactive' ||
                          source.status === 'rejected',
                        'text-warn-600': source.status === 'pending',
                        'text-surface-600': source.status === 'draft',
                      }"
                    >
                      {{ getStatusText(source.status) }}
                    </span>
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- 場景及相關迷因 -->
      <Card class="p-4 mb-8">
        <template #title>
          <h2 v-if="scenesWithMemes.length > 0" class="mb-4">場景及相關迷因</h2>
        </template>
        <template #content>
          <Panel
            toggleable
            collapsed
            v-for="scene in scenesWithMemes"
            :key="scene._id"
          >
            <template #header>
              <!-- 場景 -->

              <div class="flex items-start space-x-4 p-4">
                <div class="flex-shrink-0">
                  <div
                    v-if="scene.images && scene.images.length > 0"
                    class="w-16 h-16 bg-surface-100 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="scene.images[0]"
                      :alt="scene.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="pi pi-play text-primary-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="mb-1 font-medium">
                    {{ scene.title }}
                  </h4>
                  <div
                    v-if="scene.quote"
                    class="text-sm text-surface-600 dark:text-surface-400 mb-2 italic"
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
              </div>
            </template>

            <!-- 迷因 -->
            <div>
              <hr />
              <h4 class="my-4">使用此場景的迷因：</h4>
              <div
                v-if="memes.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <div
                  v-for="meme in memes"
                  :key="meme._id"
                  class="bg-white rounded-lg shadow-sm border hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors cursor-pointer"
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
                    <h4 class="mb-1 line-clamp-2">
                      {{ meme.title }}
                    </h4>
                    <div
                      class="flex items-center justify-between text-sm text-surface-500 dark:text-surface-300"
                    >
                      <div class="flex items-center space-x-2">
                        <span>{{ getMemeAuthorName(meme) }}</span> ·
                        <span>
                          {{ formatPublishedTime(meme) }}
                        </span>
                      </div>
                      <span class="flex items-center">
                        <i class="pi pi-thumbs-up mr-1"></i>
                        {{ meme.like_count || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-surface-500">
                <i class="pi pi-image text-4xl mb-2"></i>
                <p>暫無相關迷因</p>
              </div>
            </div>

            <template #footer>
              <!-- 分頁 -->
              <div
                v-if="totalMemes > pageSize"
                class="flex justify-center mt-6"
              >
                <Paginator
                  :rows="pageSize"
                  :total-records="totalMemes"
                  :first="(currentPage - 1) * pageSize"
                  @page="onPageChange"
                />
              </div>
            </template>
          </Panel>
        </template>
      </Card>

      <!-- 外部連結 -->
      <Card v-if="source.links && source.links.length > 0" class="mb-8 p-4">
        <template #title>
          <h2 class="mb-4">外部連結</h2>
        </template>
        <template #content>
          <div class="space-y-2">
            <a
              v-for="link in source.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center p-3! bg-surface-50 hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <i class="pi pi-external-link m-4 text-primary-600"></i>
              <div class="ml-4">
                <h6>
                  {{ link.label || link.title || '連結' }}
                </h6>
                <small class="text-surface-600 dark:text-surface-400">{{
                  link.url
                }}</small>
              </div>
            </a>
          </div>
        </template>
      </Card>
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
          您可以為這個出處補充更多資訊，包括簡介、外部連結等。
        </p>
        <Button
          label="前往建議頁面"
          icon="pi pi-external-link"
          severity="primary"
          @click="navigateToSuggestion"
        />
      </div>
    </Dialog>

    <!-- 場景選擇器對話框 -->
    <Dialog
      v-model:visible="showScenePickerDialog"
      header="新增場景"
      :style="{ width: '800px' }"
      :modal="true"
    >
      <SourceScenePicker
        v-model="scenePickerValue"
        @update:modelValue="onScenePickerUpdate"
      />
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
import Paginator from 'primevue/paginator'
import Breadcrumb from 'primevue/breadcrumb'
import Panel from 'primevue/panel'

// 服務
import sourceService from '@/services/sourceService'
import memeService from '@/services/memeService'

// 工具函數
import { formatPublishedTime } from '@/utils/dataUtils'

// 自定義組件
import CustomTag from '@/components/CustomTag.vue'
import SourceScenePicker from '@/components/SourceScenePicker.vue'

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
  route: '/memes/all',
})

const breadcrumbItems = computed(() => {
  if (!source.value) return []

  return [
    {
      label: source.value.title,
      route: null, // 當前頁面，不設連結
    },
  ]
})

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(12)
const totalMemes = ref(0)

// 模態框
const showSuggestionDialog = ref(false)
const showScenePickerDialog = ref(false)
const scenePickerValue = ref({ source_id: null, scene_id: null })

// 計算屬性
const sourceSlug = computed(() => route.params.slug)

// 將迷因根據scene_id分組到對應場景
const scenesWithMemes = computed(() => {
  if (!scenes.value.length || !memes.value.length) {
    return scenes.value.map((scene) => ({ ...scene, memes: [] }))
  }

  // 創建scene_id到迷因的映射
  const memesBySceneId = new Map()
  memes.value.forEach((meme) => {
    if (meme.scene_id) {
      if (!memesBySceneId.has(meme.scene_id)) {
        memesBySceneId.set(meme.scene_id, [])
      }
      memesBySceneId.get(meme.scene_id).push(meme)
    }
  })

  // 將迷因分配到對應的場景
  return scenes.value.map((scene) => ({
    ...scene,
    memes: memesBySceneId.get(scene._id) || [],
  }))
})

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

const getLicenseText = (license) => {
  if (typeof license === 'string') {
    return getLicenseDisplayName(license)
  }

  if (license && typeof license === 'object') {
    const licenseType = getLicenseDisplayName(license.type)
    if (license.notes) {
      return `${licenseType} - ${license.notes}`
    }
    return licenseType
  }

  return '未知授權'
}

const getLicenseDisplayName = (licenseType) => {
  const licenseMap = {
    // 版權相關
    copyright: '版權所有',
    'all-rights-reserved': '版權所有',

    // 創用CC授權
    'cc-by': 'CC BY (姓名標示)',
    'cc-by-sa': 'CC BY-SA (姓名標示-相同方式分享)',
    'cc-by-nc': 'CC BY-NC (姓名標示-非商業性)',
    'cc-by-nc-sa': 'CC BY-NC-SA (姓名標示-非商業性-相同方式分享)',
    'cc-by-nd': 'CC BY-ND (姓名標示-禁止改作)',
    'cc-by-nc-nd': 'CC BY-NC-ND (姓名標示-非商業性-禁止改作)',
    cc0: 'CC0 (公眾領域貢獻宣告)',

    // 公有領域
    'public-domain': '公有領域',
    'public-domain-dedication': '公有領域貢獻',

    // 合理使用
    'fair-use': '合理使用',
    'fair-dealing': '公平使用',

    // 其他常見授權
    mit: 'MIT授權',
    apache: 'Apache授權',
    gpl: 'GPL授權',
    'gpl-v2': 'GPL v2',
    'gpl-v3': 'GPL v3',
    lgpl: 'LGPL授權',
    bsd: 'BSD授權',
    mozilla: 'Mozilla公共授權',
    'creative-commons': '創用CC授權',

    // 未知或自定義
    other: '其他授權',
    unknown: '未知授權',
    custom: '自定義授權',
  }

  return licenseMap[licenseType] || licenseType || '未知授權'
}

const getStatusText = (status) => {
  const statusMap = {
    active: '啟用',
    inactive: '停用',
    pending: '待審核',
    rejected: '已拒絕',
    draft: '草稿',
  }
  return statusMap[status] || status || '未知'
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

const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getMemeAuthorName = (meme) => {
  const author = meme.author_id || meme.author
  if (!author) return '匿名用戶'
  return author.display_name || author.username || '匿名用戶'
}

const loadSource = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await sourceService.getBySlug(sourceSlug.value)

    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      response.data.data.source
    ) {
      source.value = response.data.data.source

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
    let sceneList = []

    if (response.data && response.data.success) {
      sceneList = response.data.data || []
    } else if (response.data) {
      sceneList = response.data || []
    } else {
      sceneList = []
    }

    scenes.value = sceneList
  } catch (error) {
    console.error('載入場景失敗:', error)
    scenes.value = []
  }
}

const loadMemes = async () => {
  try {
    if (!source.value?._id) return

    // 使用現有的 getBySource API 獲取所有迷因
    const response = await memeService.getBySource(source.value._id, {
      page: currentPage.value,
      limit: pageSize.value,
      sort: 'hot',
    })

    if (response.data && response.data.success) {
      const data = response.data.data
      memes.value = data.memes || []
      totalMemes.value = data.pagination?.total || memes.value.length
    } else if (response.data) {
      const data = response.data
      memes.value = data.memes || data || []
      totalMemes.value = data.pagination?.total || memes.value.length
    } else {
      memes.value = []
      totalMemes.value = 0
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

const showSuggestionModal = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  showSuggestionDialog.value = true
}

const showScenePicker = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  // 預設選擇當前來源
  scenePickerValue.value = {
    source_id: source.value?._id || null,
    scene_id: null,
  }
  showScenePickerDialog.value = true
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

const onScenePickerUpdate = (value) => {
  scenePickerValue.value = value
  if (value.scene_id) {
    // 場景建立成功，重新載入場景列表
    loadScenes()
    showScenePickerDialog.value = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '場景已建立',
      life: 3000,
    })
  }
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
  description: '查看出處的詳細資訊、場景和相關迷因。'
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
