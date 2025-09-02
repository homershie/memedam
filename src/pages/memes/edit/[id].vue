<template>
  <div class="w-full p-8 mx-auto space-y-6 overflow-y-auto">
    <div class="w-5xl mx-auto overflow-hidden">
      <!-- Loading 狀態 -->
      <div
        v-if="loading && !form.title"
        class="flex justify-center items-center min-h-[400px]"
      >
        <div class="text-center">
          <i class="pi pi-spinner pi-spin text-4xl text-primary-500 mb-4"></i>
          <p class="text-surface-600">載入中...</p>
        </div>
      </div>

      <!-- 載入錯誤訊息 -->
      <div v-else-if="loadError" class="max-w-2xl mx-auto p-6">
        <Message severity="error" :closable="false">
          載入錯誤：{{ loadError }}
        </Message>
        <div class="mt-4 text-center">
          <Button
            label="返回迷因列表"
            icon="pi pi-arrow-left"
            @click="router.push('/memes/all')"
          />
          <Button
            label="重新載入"
            icon="pi pi-refresh"
            class="ml-2"
            @click="window.location.reload()"
          />
        </div>
      </div>

      <!-- 主要內容 -->
      <div v-else>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-surface-800">編輯迷因</h1>
          <p class="mt-2">修改你的迷因內容</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
            <!-- 迷因標題 -->
            <div class="field">
              <label for="title" class="block font-semibold mb-2">
                迷因標題 <span class="text-primary-500">*</span>
              </label>
              <InputText
                id="title"
                v-model="form.title"
                placeholder="為你的迷因取個有趣的標題..."
                maxlength="200"
                class="w-full"
                :class="{ 'p-invalid': errors.title }"
              />
              <Message
                v-if="errors.title"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.title }}
              </Message>
            </div>

            <!-- 迷因類型 -->
            <div class="field">
              <label for="type" class="block font-semibold mb-2">
                迷因類型 <span class="text-primary-500">*</span>
              </label>
              <Dropdown
                id="type"
                v-model="form.type"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="選擇迷因類型"
                class="w-full"
                appendTo="body"
                :class="{ 'p-invalid': errors.type }"
              />
              <Message
                v-if="errors.type"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.type }}
              </Message>
            </div>

            <!-- 迷因主圖 -->
            <div class="field">
              <label class="block font-semibold mb-2">
                <i class="pi pi-image mr-1"></i>
                迷因主圖
                <span class="text-surface-500 text-sm font-normal ml-2">
                  （選填，用於卡片顯示）
                </span>
              </label>
              <div class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- 檔案上傳 -->
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >上傳主圖檔案</label
                    >
                    <FileUpload
                      mode="basic"
                      name="cover_image"
                      :maxFileSize="10000000"
                      accept="image/*"
                      :auto="false"
                      chooseLabel="選擇圖片"
                      class="w-full"
                      @select="onCoverImageSelect"
                      @clear="onCoverImageClear"
                    />
                    <small class="text-surface-500 mt-1 block">
                      支援 JPG, PNG, GIF, WebP (最大 10MB)
                    </small>
                  </div>

                  <!-- 或是連結（只有沒選檔案時才顯示） -->
                  <div v-if="!uploadedCoverImageFile">
                    <label class="block text-sm font-medium mb-2"
                      >或提供主圖連結</label
                    >
                    <InputText
                      v-model="form.cover_image"
                      placeholder="https://example.com/cover.jpg"
                      type="url"
                      class="w-full"
                      :class="{ 'p-invalid': errors.coverImage }"
                    />
                    <small class="text-surface-500 mt-1 block">
                      支援常見圖片網站：Imgur、Reddit、Discord 等
                    </small>
                  </div>
                </div>

                <!-- 主圖預覽 -->
                <div
                  v-if="form.cover_image || uploadedCoverImageUrl"
                  class="mt-3"
                >
                  <label class="block text-sm font-medium mb-2">預覽</label>
                  <div
                    class="border rounded-lg p-2 bg-surface-50 dark:bg-surface-800"
                  >
                    <img
                      :src="uploadedCoverImageUrl || form.cover_image"
                      alt="主圖預覽"
                      class="max-w-full max-h-64 rounded object-contain mx-auto"
                      @error="onCoverImageError"
                      @load="coverImagePreviewError = false"
                    />
                    <div
                      v-if="coverImagePreviewError"
                      class="text-center text-primary-500 p-4"
                    >
                      <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                      <p>圖片載入失敗，請檢查連結是否正確</p>
                    </div>
                  </div>
                </div>
              </div>
              <Message
                v-if="errors.coverImage"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.coverImage }}
              </Message>
            </div>

            <!-- 迷因內容簡介 -->
            <div class="field">
              <label for="content" class="block font-semibold mb-2">
                迷因內容簡介 <span class="text-primary-500">*</span>
              </label>
              <Textarea
                id="content"
                v-model="form.content"
                placeholder="簡單描述這個迷因的內容或有趣的特點..."
                rows="4"
                maxlength="350"
                class="w-full"
                :class="{ 'p-invalid': errors.content }"
              />
              <Message
                v-if="errors.content"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.content }}
              </Message>
              <small
                class="text-surface-500"
                :class="{
                  'text-primary-500': getCharCount(form.content) > 350,
                }"
              >
                {{ getCharCount(form.content) }}/350
              </small>
            </div>

            <!-- 媒體內容 (根據類型顯示不同輸入方式) -->
            <div v-if="form.type !== 'text'" class="field">
              <label class="block font-semibold mb-2">
                <i :class="getTypeIcon(form.type)" class="mr-1"></i>
                {{ getMediaLabel(form.type) }}
                <span class="text-primary-500">*</span>
              </label>

              <!-- 圖片上傳 -->
              <div v-if="form.type === 'image'" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- 檔案上傳 -->
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >上傳圖片檔案</label
                    >
                    <FileUpload
                      mode="basic"
                      name="image"
                      :maxFileSize="10000000"
                      accept="image/*"
                      :auto="false"
                      chooseLabel="選擇圖片"
                      class="w-full"
                      @select="onImageSelect"
                      @clear="onImageClear"
                    />
                    <small class="text-surface-500 mt-1 block">
                      支援 JPG, PNG, GIF, WebP (最大 10MB)
                    </small>
                  </div>

                  <!-- 或是連結（只有沒選檔案時才顯示） -->
                  <div v-if="!uploadedImageFile">
                    <label class="block text-sm font-medium mb-2"
                      >或提供圖片連結</label
                    >
                    <InputText
                      v-model="form.image_url"
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      class="w-full"
                      :class="{ 'p-invalid': errors.mediaUrl }"
                    />
                    <small class="text-surface-500 mt-1 block">
                      支援常見圖片網站：Imgur、Reddit、Discord 等
                    </small>
                  </div>
                </div>

                <!-- 圖片預覽 -->
                <div v-if="form.image_url || uploadedImageUrl" class="mt-3">
                  <label class="block text-sm font-medium mb-2">預覽</label>
                  <div
                    class="border rounded-lg p-2 bg-surface-50 dark:bg-surface-800"
                  >
                    <img
                      :src="uploadedImageUrl || form.image_url"
                      alt="圖片預覽"
                      class="max-w-full max-h-64 rounded object-contain mx-auto"
                      @error="onImageError"
                      @load="imagePreviewError = false"
                    />
                    <div
                      v-if="imagePreviewError"
                      class="text-center text-primary-500 p-4"
                    >
                      <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                      <p>圖片載入失敗，請檢查連結是否正確</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 影片連結 -->
              <div v-else-if="form.type === 'video'" class="space-y-3">
                <InputText
                  v-model="form.video_url"
                  placeholder="https://youtube.com/watch?v=... 或其他影片平台連結"
                  type="url"
                  class="w-full"
                  :class="{ 'p-invalid': errors.mediaUrl }"
                />
                <small class="text-surface-500">
                  支援 YouTube、Vimeo、TikTok、Twitch 等影片平台連結
                </small>

                <!-- 影片預覽 -->
                <div v-if="form.video_url" class="mt-3">
                  <label class="block text-sm font-medium mb-2">預覽</label>
                  <div
                    class="border rounded-lg p-2 bg-surface-50 dark:bg-surface-800"
                  >
                    <div
                      v-if="isYouTubeUrl(form.video_url)"
                      class="aspect-video"
                    >
                      <iframe
                        :src="getYouTubeEmbedUrl(form.video_url)"
                        class="w-full h-full rounded"
                        allowfullscreen
                      ></iframe>
                    </div>
                    <div v-else class="text-center p-4 text-surface-500">
                      <i class="pi pi-video text-2xl mb-2"></i>
                      <p>影片連結：{{ form.video_url }}</p>
                      <small class="block mt-1"
                        >其他平台的影片將在發布後顯示</small
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- 音訊連結 -->
              <div v-else-if="form.type === 'audio'" class="space-y-3">
                <InputText
                  v-model="form.audio_url"
                  placeholder="https://youtube.com/watch?v=... 或其他音訊平台連結"
                  type="url"
                  class="w-full"
                  :class="{ 'p-invalid': errors.mediaUrl }"
                />
                <small class="text-surface-500">
                  支援 YouTube、SoundCloud、Spotify、Podcast 等音訊平台連結
                </small>

                <!-- 音訊預覽 -->
                <div v-if="form.audio_url" class="mt-3">
                  <label class="block text-sm font-medium mb-2">預覽</label>
                  <div class="border rounded-lg p-4 bg-surface-50">
                    <div
                      v-if="isYouTubeUrl(form.audio_url)"
                      class="aspect-video"
                    >
                      <iframe
                        :src="getYouTubeEmbedUrl(form.audio_url)"
                        class="w-full h-full rounded"
                        allowfullscreen
                      ></iframe>
                    </div>
                    <div v-else class="text-center text-surface-500">
                      <i class="pi pi-volume-up text-2xl mb-2"></i>
                      <p>音訊連結：{{ form.audio_url }}</p>
                      <small class="block mt-1"
                        >其他平台的音訊將在發布後顯示</small
                      >
                    </div>
                  </div>
                </div>
              </div>

              <Message
                v-if="errors.mediaUrl"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.mediaUrl }}
              </Message>
            </div>

            <!-- 標籤選擇與新增 -->
            <div class="field">
              <label class="block font-semibold mb-2">標籤</label>
              <div class="space-y-3">
                <!-- 已選標籤顯示 -->
                <div v-if="selectedTags.length" class="flex flex-wrap gap-2">
                  <Chip
                    v-for="tag in selectedTags"
                    :key="tag._id || tag.name"
                    :label="tag.name"
                    removable
                    @remove="removeTag(tag)"
                    class="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  />
                </div>

                <!-- 標籤輸入 -->
                <div class="flex gap-2">
                  <AutoComplete
                    v-model="tagInput"
                    :suggestions="tagSuggestions"
                    @complete="searchTags"
                    @keydown.enter.prevent="addTag"
                    optionLabel="name"
                    placeholder="輸入標籤名稱..."
                    appendTo="body"
                    class="w-80"
                    fluid
                  />
                  <Button
                    type="button"
                    icon="pi pi-plus"
                    label="新增"
                    @click="addTag"
                    :disabled="!tagInput.trim()"
                  />
                </div>
                <small class="text-surface-500">
                  輸入標籤名稱，按 Enter 或點擊新增。如果標籤不存在會自動建立。
                </small>
              </div>
            </div>

            <!-- 詳細介紹編輯器 -->
            <div class="field">
              <label class="block font-semibold mb-2">詳細介紹</label>
              <div class="overflow-hidden" @click.stop @submit.prevent>
                <TipTapEditor
                  v-model="detailContent"
                  :outputJson="true"
                  :onImageUpload="handleDetailImageUpload"
                />
              </div>
              <small class="text-surface-500">
                支援文本編輯，可以添加圖片、影片、連結、表格等豐富內容。
              </small>
            </div>

            <!-- 其他選項 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- NSFW 選項 -->
              <div class="field">
                <div class="flex items-center">
                  <Checkbox v-model="form.nsfw" inputId="nsfw" :binary="true" />
                  <label for="nsfw" class="ml-2 font-medium">
                    成人/限制級內容 (NSFW)
                  </label>
                </div>
                <small class="text-surface-500 block mt-1">
                  勾選此項表示內容可能不適合工作場所觀看
                </small>
              </div>
            </div>

            <!-- 來源選擇 -->
            <div class="field">
              <div class="flex items-center mb-3">
                <Checkbox
                  v-model="form.has_source"
                  inputId="hasSource"
                  :binary="true"
                />
                <label for="hasSource" class="ml-2 font-semibold">
                  此迷因有來源作品
                </label>
              </div>

              <SourceScenePicker
                v-if="form.has_source"
                v-model="sourceSceneData"
              />

              <Message
                v-if="errors.source"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.source }}
              </Message>
            </div>

            <!-- 變體/二創選擇 -->
            <div class="field">
              <div class="flex items-center mb-3">
                <Checkbox
                  v-model="form.is_variant"
                  inputId="isVariant"
                  :binary="true"
                />
                <label for="isVariant" class="ml-2 font-semibold">
                  這是某個迷因的變體/二創/其他用法
                </label>
              </div>

              <MemeRemoteSelect
                v-if="form.is_variant"
                v-model="form.variant_of"
                :required="form.is_variant"
              />

              <Message
                v-if="errors.variant"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errors.variant }}
              </Message>
            </div>

            <!-- 引用來源 -->
            <div class="field">
              <div class="flex items-center justify-between mb-3">
                <label class="block font-semibold">引用來源</label>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="新增來源"
                  severity="primary"
                  @click="addSource"
                />
              </div>

              <div
                v-for="(source, index) in form.sources"
                :key="index"
                class="flex gap-2 items-center mb-2 last:mb-10"
              >
                <div class="flex flex-col flex-1 md:flex-row gap-2 md:gap-8">
                  <FloatLabel variant="on">
                    <label for="name"
                      >來源名稱 (例如：網路溫度計、維基百科、搞完君...)</label
                    >
                    <InputText v-model="source.name" fluid maxlength="100" />
                  </FloatLabel>
                  <FloatLabel variant="on">
                    <label for="url"
                      >來源網址 (https://zh.wikipedia.org/zh-tw/)</label
                    >
                    <InputText v-model="source.url" type="url" fluid />
                  </FloatLabel>
                </div>
                <Button
                  type="button"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="removeSource(index)"
                  class="mt-1"
                />
              </div>
            </div>

            <!-- 錯誤訊息 -->
            <Message v-if="submitError" severity="error" :closable="false">
              {{ submitError }}
            </Message>

            <!-- 送出按鈕 -->
            <div class="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                label="重設"
                icon="pi pi-refresh"
                severity="secondary"
                @click="resetForm"
                :disabled="loading"
              />
              <Button
                type="submit"
                label="儲存變更"
                icon="pi pi-save"
                :loading="loading"
                class="px-8"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// PrimeVue 組件
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
import Message from 'primevue/message'
import FileUpload from 'primevue/fileupload'

// TipTap 編輯器
import TipTapEditor from '@/components/TipTapEditor.vue'

// 自訂元件
import SourceScenePicker from '@/components/SourceScenePicker.vue'
import MemeRemoteSelect from '@/components/MemeRemoteSelect.vue'

// API 服務
import memeService from '@/services/memeService'
import tagService from '@/services/tagService'
import memeTagService from '@/services/memeTagService'
import apiService from '@/services/apiService' // 新增 apiService

defineOptions({ name: 'EditMemePage' })

const toast = useToast()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const memeId = route.params.id

// 表單資料
const form = reactive({
  title: '',
  type: 'text',
  content: '',
  image_url: '',
  video_url: '',
  audio_url: '',
  nsfw: false,
  language: 'zh',
  sources: [],
  cover_image: '', // 新增主圖欄位
  has_source: false,
  source_id: null,
  scene_id: null,
  is_variant: false,
  variant_of: null,
})

// 表單驗證錯誤
const errors = reactive({
  title: '',
  type: '',
  content: '',
  mediaUrl: '',
  coverImage: '', // 新增主圖錯誤
  source: '',
  variant: '',
})

// 其他狀態
const uploadedImageUrl = ref('')
const imagePreviewError = ref(false)
const selectedTags = ref([])
const tagInput = ref('')
const tagSuggestions = ref([])
const allTags = ref([])
const detailContent = ref(null) // 改為 JSON 格式
const detailImages = ref([]) // 新增：詳細介紹中的圖片陣列
const loading = ref(false)
const submitError = ref('')
const loadError = ref('')
const uploadedImageFile = ref(null)
const uploadedCoverImageFile = ref(null) // 新增主圖檔案狀態
const uploadedCoverImageUrl = ref('') // 新增主圖預覽 URL
const coverImagePreviewError = ref(false) // 新增主圖預覽錯誤狀態

// 選項資料
const typeOptions = [
  { label: '用語', value: 'text', icon: 'pi pi-file-edit' },
  { label: '圖片/GIF', value: 'image', icon: 'pi pi-image' },
  { label: '影片', value: 'video', icon: 'pi pi-video' },
  { label: '音訊', value: 'audio', icon: 'pi pi-volume-up' },
]

// 載入標籤資料
onMounted(async () => {
  try {
    loading.value = true

    // 確保 memeId 存在
    if (!memeId) {
      throw new Error('未提供迷因 ID')
    }

    // 載入標籤數據
    try {
      const { data: tagData } = await tagService.getAll()
      // 正確解析後端 API 回應格式：{ tags: [...], pagination: {...} }
      allTags.value =
        tagData?.tags && Array.isArray(tagData.tags) ? tagData.tags : []
    } catch (tagError) {
      console.error('載入標籤失敗:', tagError)
      allTags.value = []
    }

    // 載入迷因數據 - 使用認證的 API 調用
    const { data } = await apiService.httpAuth.get(`/api/memes/${memeId}`)

    // 更靈活的數據解析 - 處理嵌套結構
    const meme = data.data?.meme || data.meme || data.data || data || {}

    // 檢查迷因數據是否有效
    if (!meme) {
      throw new Error('迷因數據無效或不存在')
    }

    if (!meme.title || meme.title.trim() === '') {
      throw new Error('迷因標題不能為空')
    }

    // 設置表單數據
    form.title = meme.title || ''
    form.type = meme.type || 'text'
    form.content = meme.content || ''
    form.image_url = meme.image_url || ''
    form.video_url = meme.video_url || ''
    form.audio_url = meme.audio_url || ''
    form.nsfw = meme.nsfw || false
    form.language = meme.language || 'zh'
    form.cover_image = meme.cover_image || '' // 設置主圖
    // 根據 source_id 是否存在來判斷 has_source
    form.has_source = !!meme.source_id
    form.source_id = meme.source_id || null
    form.scene_id = meme.scene_id || null
    // 根據 variant_of 是否存在來判斷 is_variant
    form.is_variant = !!meme.variant_of
    form.variant_of = meme.variant_of || null

    // 設置 sourceSceneData
    sourceSceneData.value = {
      source_id: meme.source_id || null,
      scene_id: meme.scene_id || null,
    }

    // 處理來源資料 - 支援舊格式轉換
    if (meme.sources && Array.isArray(meme.sources)) {
      form.sources = [...meme.sources]
    } else if (meme.source_url && meme.source_url.trim()) {
      // 將舊的單一來源轉換為新格式
      form.sources = [
        {
          name: '原始來源',
          url: meme.source_url,
        },
      ]
    } else {
      form.sources = []
    }

    // 設置詳細介紹內容 - 支援 JSON 格式
    if (meme.detail_content) {
      detailContent.value = meme.detail_content
    } else if (meme.detail_markdown) {
      // 如果只有 markdown，轉換為 JSON 格式
      detailContent.value = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: meme.detail_markdown }],
          },
        ],
      }
    } else {
      detailContent.value = null
    }

    // 設置詳細介紹圖片
    detailImages.value = meme.detail_images || []

    // 設置標籤
    selectedTags.value = []
    if (meme.tags && Array.isArray(meme.tags)) {
      selectedTags.value = meme.tags
    } else if (meme.tags_cache && Array.isArray(meme.tags_cache)) {
      // 從 tags_cache 名稱找到對應的完整標籤對象
      const tagObjects = []
      for (const tagName of meme.tags_cache) {
        const fullTag = allTags.value.find((tag) => tag.name === tagName)
        if (fullTag) {
          tagObjects.push(fullTag)
        } else {
          console.warn(`未找到標籤: ${tagName}`)
          tagObjects.push({ name: tagName })
        }
      }
      selectedTags.value = tagObjects
    }

    // 重置其他狀態
    uploadedImageUrl.value = ''
    imagePreviewError.value = false
    tagInput.value = ''
    tagSuggestions.value = []
    uploadedCoverImageFile.value = null
    uploadedCoverImageUrl.value = ''
    coverImagePreviewError.value = false
  } catch (error) {
    // 根據錯誤類型提供更詳細的錯誤信息
    if (error.response?.status === 404) {
      loadError.value = '迷因不存在或已被刪除'
    } else if (error.response?.status === 403) {
      loadError.value = '您沒有權限編輯此迷因'
    } else if (error.response?.status === 401) {
      loadError.value = '請先登入後再編輯迷因'
    } else {
      loadError.value =
        error.response?.data?.message || error.message || '無法載入迷因資料'
    }

    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: loadError.value,
      life: 5000,
    })
    // 延遲跳轉，讓用戶看到錯誤訊息
    setTimeout(() => {
      router.push('/memes/all')
    }, 2000)
  } finally {
    loading.value = false
  }
})

// 工具函數
const getMediaLabel = (type) => {
  const labelMap = {
    image: '圖片內容',
    video: '影片內容',
    audio: '音訊內容',
  }
  return labelMap[type] || '媒體內容'
}

// 字元計數函數 - 適合中文字元計算
const getCharCount = (text) => {
  if (!text) return 0
  return text.length
}

// 圖片上傳處理
const onImageSelect = (event) => {
  const file = event.files[0]
  if (file) {
    uploadedImageFile.value = file
    // 本地預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target.result
      form.image_url = ''
    }
    reader.readAsDataURL(file)
  }
}

const onImageClear = () => {
  uploadedImageUrl.value = ''
  uploadedImageFile.value = null
}

const onImageError = () => {
  imagePreviewError.value = true
}

// 主圖上傳處理
const onCoverImageSelect = (event) => {
  const file = event.files[0]
  if (file) {
    uploadedCoverImageFile.value = file
    // 本地預覽
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedCoverImageUrl.value = e.target.result
      form.cover_image = ''
    }
    reader.readAsDataURL(file)
  }
}

const onCoverImageClear = () => {
  uploadedCoverImageUrl.value = ''
  uploadedCoverImageFile.value = null
}

const onCoverImageError = () => {
  coverImagePreviewError.value = true
}

// YouTube 支援 (影片和音訊都可以用)
const isYouTubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'))
}

const getYouTubeEmbedUrl = (url) => {
  let videoId = ''
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  }
  return `https://www.youtube.com/embed/${videoId}`
}

// 標籤相關函數
const searchTags = async (event) => {
  const query = event.query.toLowerCase().trim()

  if (!query || query.length < 1) {
    tagSuggestions.value = []
    return
  }

  try {
    // 發送 API 請求到後端搜尋標籤
    const { data } = await tagService.getAll({
      search: query,
      limit: 20,
      lang: 'zh', // 預設搜尋中文標籤
    })

    // 解析回應資料
    const tags = data.tags || data || []

    // 過濾掉已選擇的標籤
    tagSuggestions.value = tags.filter(
      (tag) =>
        !selectedTags.value.some((selected) => selected.name === tag.name),
    )
  } catch (error) {
    console.error('搜尋標籤失敗:', error)
    // 如果 API 失敗，回退到本地搜尋
    tagSuggestions.value = Array.isArray(allTags.value)
      ? allTags.value.filter(
          (tag) =>
            tag.name.toLowerCase().includes(query) &&
            !selectedTags.value.some((selected) => selected.name === tag.name),
        )
      : []
  }
}

const addTag = () => {
  const tagName =
    typeof tagInput.value === 'string'
      ? tagInput.value.trim()
      : tagInput.value?.name?.trim() || ''

  if (!tagName || tagName.length > 50) return

  // 檢查是否已選擇
  if (selectedTags.value.some((tag) => tag.name === tagName)) {
    tagInput.value = ''
    return
  }

  // 尋找現有標籤
  const existingTag = Array.isArray(allTags.value)
    ? allTags.value.find((tag) => tag.name === tagName)
    : null

  if (existingTag) {
    selectedTags.value.push(existingTag)
  } else {
    // 新標籤，先加入選擇清單，實際建立會在送出時處理
    selectedTags.value.push({ name: tagName, isNew: true })
  }

  tagInput.value = ''
}

const removeTag = (tagToRemove) => {
  const index = selectedTags.value.findIndex(
    (tag) => tag.name === tagToRemove.name,
  )
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

const getTypeIcon = (type) => {
  const iconMap = {
    image: 'pi pi-image',
    video: 'pi pi-video',
    audio: 'pi pi-volume-up',
  }
  return iconMap[type] || 'pi pi-file'
}

const getTypeName = (type) => {
  const nameMap = {
    image: '圖片',
    video: '影片',
    audio: '音訊',
  }
  return nameMap[type] || '未知'
}

// 收集詳細介紹中待上傳的圖片檔案
const pendingDetailImages = ref([])

const handleDetailImageUpload = (file) => {
  // 將檔案加入待上傳清單，而不是立即上傳
  pendingDetailImages.value.push(file)
}

// Source/Scene 資料綁定
const sourceSceneData = ref({
  source_id: null,
  scene_id: null,
})

// 監聽 sourceSceneData 變化，同步到 form
watch(
  sourceSceneData,
  (newVal) => {
    if (newVal) {
      form.source_id = newVal.source_id
      form.scene_id = newVal.scene_id
    }
  },
  { deep: true },
)

// 表單驗證
const validateForm = () => {
  // 清空錯誤
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  let isValid = true

  if (!form.title.trim()) {
    errors.title = '請輸入迷因標題'
    isValid = false
  }

  if (!form.content.trim()) {
    errors.content = '請輸入迷因內容簡介'
    isValid = false
  } else if (getCharCount(form.content) > 350) {
    errors.content = '內容簡介不能超過 350 個字元'
    isValid = false
  }

  // 檢查來源
  if (form.has_source && !form.source_id) {
    errors.source = '請選擇來源作品'
    isValid = false
  }

  // 檢查變體
  if (form.is_variant && !form.variant_of) {
    errors.variant = '請選擇原始迷因'
    isValid = false
  }

  // 檢查媒體內容
  if (form.type !== 'text') {
    if (form.type === 'image') {
      // 沒選檔案也沒填連結才報錯
      if (!uploadedImageFile.value && !form.image_url) {
        errors.mediaUrl = '請上傳圖片或提供圖片連結'
        isValid = false
      }
    } else {
      const urlField = `${form.type}_url`
      if (!form[urlField] || form[urlField].trim() === '') {
        errors.mediaUrl = `請提供${getTypeName(form.type)}連結`
        isValid = false
      }
    }
  }

  return isValid
}

// 新增來源
const addSource = () => {
  form.sources.push({
    name: '',
    url: '',
  })
}

// 移除來源
const removeSource = (index) => {
  form.sources.splice(index, 1)
}

// 重設表單
const resetForm = () => {
  Object.assign(form, {
    title: '',
    type: 'text',
    content: '',
    image_url: '',
    video_url: '',
    audio_url: '',
    nsfw: false,
    language: 'zh',
    sources: [],
    cover_image: '', // 重置主圖
    has_source: false,
    source_id: null,
    scene_id: null,
    is_variant: false,
    variant_of: null,
  })

  uploadedImageUrl.value = ''
  imagePreviewError.value = false
  selectedTags.value = []
  tagInput.value = ''
  detailContent.value = null
  detailImages.value = []
  pendingDetailImages.value = []
  submitError.value = ''
  loadError.value = ''
  uploadedCoverImageFile.value = null
  uploadedCoverImageUrl.value = ''
  coverImagePreviewError.value = false

  Object.keys(errors).forEach((key) => (errors[key] = ''))
}

// 送出表單
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  submitError.value = ''

  try {
    // 取得認證 token
    const token = userStore.token
    if (!token) {
      throw new Error('未提供授權 token')
    }

    // 送出時才上傳主圖片
    if (uploadedCoverImageFile.value) {
      const formData = new FormData()
      formData.append('image', uploadedCoverImageFile.value) // key 必須是 'image'

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        // 不要加 headers: Content-Type
      })
      const data = await res.json()
      if (
        data.success &&
        data.url &&
        data.url.startsWith('https://res.cloudinary.com/')
      ) {
        form.cover_image = data.url
      } else {
        throw new Error(data.message || '主圖上傳失敗')
      }
    }

    // 送出時才上傳圖片（如果是圖片類型）
    if (form.type === 'image' && uploadedImageFile.value) {
      const formData = new FormData()
      formData.append('image', uploadedImageFile.value) // key 必須是 'image'

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        // 不要加 headers: Content-Type
      })
      const data = await res.json()
      if (
        data.success &&
        data.url &&
        data.url.startsWith('https://res.cloudinary.com/')
      ) {
        form.image_url = data.url
      } else {
        throw new Error(data.message || '圖片上傳失敗')
      }
    }

    // 先檢查 isNew: true 的標籤是否已存在於 allTags
    for (let i = 0; i < selectedTags.value.length; i++) {
      const tag = selectedTags.value[i]
      if (tag.isNew) {
        const exist = Array.isArray(allTags.value)
          ? allTags.value.find(
              (t) =>
                t.name.trim().toLowerCase() === tag.name.trim().toLowerCase(),
            )
          : null
        if (exist) {
          // 用現有標籤取代 selectedTags 裡的 isNew 標籤
          selectedTags.value[i] = exist
        }
      }
    }

    // 準備新標籤
    const newTags = selectedTags.value.filter(
      (tag) =>
        tag.isNew &&
        !allTags.value.some(
          (t) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase(),
        ),
    )
    const createdTags = []

    // 建立新標籤
    for (const newTag of newTags) {
      try {
        const { data } = await tagService.create({ name: newTag.name })
        createdTags.push(data)
        // 更新本地標籤清單
        if (Array.isArray(allTags.value)) {
          allTags.value.push(data)
        }
      } catch (error) {
        console.error(`建立標籤 "${newTag.name}" 失敗:`, error)
      }
    }

    // 準備標籤快取和ID
    const allSelectedTags = [
      ...selectedTags.value.filter((tag) => !tag.isNew),
      ...createdTags,
    ]

    const tagNames = allSelectedTags.map((tag) => tag.name)

    // 準備迷因數據
    const memeData = {
      ...form,
      source_id: form.has_source ? form.source_id : null,
      scene_id: form.has_source ? form.scene_id : null,
      variant_of: form.is_variant ? form.variant_of : null,
      detail_content: detailContent.value,
      detail_images: detailImages.value,
      tags_cache: tagNames,
      // 標記為實質性修改，讓後端更新 modified_at
      _markAsModified: true,
    }

    // 清理空字串欄位，避免後端驗證問題
    if (memeData.image_url === '') memeData.image_url = undefined
    if (memeData.video_url === '') memeData.video_url = undefined
    if (memeData.audio_url === '') memeData.audio_url = undefined
    if (memeData.cover_image === '') memeData.cover_image = undefined

    // 過濾空的來源資料
    if (memeData.sources && Array.isArray(memeData.sources)) {
      memeData.sources = memeData.sources.filter(
        (source) =>
          source &&
          source.name &&
          source.name.trim() &&
          source.url &&
          source.url.trim(),
      )
    }

    await memeService.update(memeId, memeData)

    // 現在有了 memeId，上傳詳細介紹中的圖片
    if (pendingDetailImages.value.length > 0) {
      const uploadedUrls = []

      for (const file of pendingDetailImages.value) {
        try {
          const formData = new FormData()
          formData.append('image', file)

          // 使用 URL 查詢參數來傳遞這些值，因為 multer 可能無法正確解析 FormData 中的文字欄位
          const uploadUrl = `/api/upload/image?isDetailImage=true&memeId=${memeId}`

          const res = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })

          const data = await res.json()
          if (
            data.success &&
            data.url &&
            data.url.startsWith('https://res.cloudinary.com/')
          ) {
            // 將上傳的圖片 URL 加入 detail_images 陣列
            if (!detailImages.value.includes(data.url)) {
              detailImages.value.push(data.url)
            }
            uploadedUrls.push(data.url)
          } else {
            console.error('詳細介紹圖片上傳失敗:', data.message || '未知錯誤')
          }
        } catch (error) {
          console.error('詳細介紹圖片上傳失敗:', error)
        }
      }

      // 如果有新的圖片上傳成功，更新迷因的 detail_images
      if (uploadedUrls.length > 0) {
        try {
          await memeService.update(memeId, {
            detail_images: detailImages.value,
            _markAsModified: true,
          })
        } catch (error) {
          console.error('更新迷因詳細介紹圖片失敗:', error)
        }
      }
    }

    // 更新標籤關聯 - 使用安全的差異更新
    try {
      // 檢查標籤對象結構並獲取 ID
      const newTagIds = []
      for (const tag of allSelectedTags) {
        if (tag._id) {
          newTagIds.push(tag._id)
        } else {
          console.warn('標籤缺少 _id:', tag)
        }
      }

      // 1. 獲取當前的 meme_tags 關聯記錄
      let currentMemeTagRecords = []

      try {
        const response = await memeTagService.getTagsByMemeId(memeId)

        // 解析響應數據
        const responseData = response.data || response || []

        // 修復：正確解析 response.data.tags
        if (responseData.tags && Array.isArray(responseData.tags)) {
          currentMemeTagRecords = responseData.tags.map((tag) => ({
            _id: `${memeId}_${tag._id}`, // 臨時 ID，用於識別
            meme_id: memeId,
            tag_id: tag._id,
          }))
        } else if (Array.isArray(responseData)) {
          currentMemeTagRecords = responseData.map((tag) => ({
            _id: `${memeId}_${tag._id}`, // 臨時 ID，用於識別
            meme_id: memeId,
            tag_id: tag._id,
          }))
        }
      } catch (error) {
        console.error('獲取當前標籤關聯失敗:', error)
        console.error('錯誤詳情:', error.response?.data || error.message)

        // 如果專用 API 失敗，嘗試使用 getAll 方法
        try {
          const fallbackResponse = await memeTagService.getAll()

          const allMemeTagsResponse =
            fallbackResponse.data?.memeTags ||
            fallbackResponse.data ||
            fallbackResponse ||
            []

          if (allMemeTagsResponse.length > 0) {
            currentMemeTagRecords = allMemeTagsResponse.filter(
              (record) => record.meme_id === memeId,
            )
          }
        } catch (fallbackError) {
          console.error('備用方法也失敗:', fallbackError)
          currentMemeTagRecords = []
        }
      }

      const currentTagIds = currentMemeTagRecords.map((record) => record.tag_id)

      // 2. 計算需要刪除和新增的標籤
      const toRemove = currentMemeTagRecords.filter((record) => {
        const shouldRemove = !newTagIds.includes(record.tag_id)
        return shouldRemove
      })
      const toAdd = newTagIds.filter((tagId) => {
        const shouldAdd = !currentTagIds.includes(tagId)
        return shouldAdd
      })

      // 3. 安全的標籤關聯更新策略
      // 由於我們沒有真實的關聯記錄 ID，使用先清空再重建的方式
      if (toRemove.length > 0 || toAdd.length > 0) {
        try {
          // 先清空所有現有關聯
          await memeTagService.removeAllTagsByMeme(memeId)

          // 重建需要保留的關聯
          const allTargetTagIds = newTagIds // 這已經是我們想要保留的標籤

          const rebuildErrors = []

          for (const tagId of allTargetTagIds) {
            try {
              const relationData = { meme_id: memeId, tag_id: tagId }
              await memeTagService.create(relationData)
            } catch (error) {
              console.error(`重建關聯失敗 (tagId: ${tagId}):`, error)
              console.error(`錯誤詳情:`, error.response?.data || error.message)
              console.error(`錯誤狀態:`, error.response?.status)
              rebuildErrors.push({ tagId, error: error.message })
            }
          }

          if (rebuildErrors.length > 0) {
            console.error('重建錯誤:', rebuildErrors)
            toast.add({
              severity: 'warn',
              summary: '標籤關聯部分更新',
              detail: `標籤關聯已清空，但重建時 ${rebuildErrors.length}/${allTargetTagIds.length} 個失敗`,
              life: 6000,
            })
          }
        } catch (error) {
          console.error('重建策略失敗:', error)
          console.error('錯誤詳情:', error.response?.data || error.message)
          toast.add({
            severity: 'error',
            summary: '標籤關聯更新失敗',
            detail: '清空或重建標籤關聯時發生錯誤',
            life: 8000,
          })
        }
      } else {
        console.log('ℹ️ 標籤沒有變化，無需更新關聯')
      }
    } catch (error) {
      console.error('標籤關聯處理失敗:', error)
      console.error('錯誤詳情:', error.response?.data || error.message)
      toast.add({
        severity: 'error',
        summary: '標籤關聯處理失敗',
        detail:
          '迷因內容已更新，但標籤關聯處理時發生錯誤。現有標籤關聯保持不變。',
        life: 8000,
      })
    }

    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '迷因已更新',
      life: 5000,
    })

    // 清空詳細介紹欄位
    detailContent.value = null
    detailImages.value = []
    pendingDetailImages.value = []

    router.push('/memes/all')
  } catch (error) {
    console.error('更新迷因失敗:', error)
    submitError.value =
      error?.response?.data?.message || error.message || '儲存失敗，請稍後再試'

    toast.add({
      severity: 'error',
      summary: '儲存失敗',
      detail: submitError.value,
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

/* TipTap 編輯器樣式已在組件內統一處理 */
</style>

<route lang="yaml">
meta:
  title: '修改迷因'
  description: '編輯你的迷因內容，包括標題、內容、標籤和詳細介紹。'
  login: required
  admin: false
</route>
