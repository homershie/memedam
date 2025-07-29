<template>
  <div class="container mx-auto">
    <!-- Loading 狀態 -->
    <div
      v-if="loading && !form.title"
      class="flex justify-center items-center min-h-[400px]"
    >
      <div class="text-center">
        <i class="pi pi-spinner pi-spin text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">載入中...</p>
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
    <div v-else class="bg-white overflow-hidden">
      <div class="text-center py-6">
        <h1 class="text-3xl font-bold text-gray-800">編輯迷因</h1>
        <p class="text-gray-600 mt-2">修改你的迷因內容</p>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 迷因標題 -->
          <div class="field">
            <label for="title" class="block font-semibold mb-2">
              迷因標題 <span class="text-red-500">*</span>
            </label>
            <InputText
              id="title"
              v-model="form.title"
              placeholder="為你的迷因取個有趣的標題..."
              maxlength="200"
              required
              class="w-full"
              :class="{ 'p-invalid': errors.title }"
            />
            <small v-if="errors.title" class="p-error">{{
              errors.title
            }}</small>
          </div>

          <!-- 迷因型態 -->
          <div class="field">
            <label for="type" class="block font-semibold mb-2">
              迷因型態 <span class="text-red-500">*</span>
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
              required
              :class="{ 'p-invalid': errors.type }"
            />
            <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
          </div>

          <!-- 迷因內容簡介 -->
          <div class="field">
            <label for="content" class="block font-semibold mb-2">
              迷因內容簡介 <span class="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              v-model="form.content"
              placeholder="簡單描述這個迷因的內容或梗點..."
              rows="4"
              maxlength="350"
              required
              class="w-full"
              :class="{ 'p-invalid': errors.content }"
            />
            <small v-if="errors.content" class="p-error">{{
              errors.content
            }}</small>
            <small
              class="text-gray-500"
              :class="{ 'text-red-500': getCharCount(form.content) > 350 }"
            >
              {{ getCharCount(form.content) }}/350
            </small>
          </div>

          <!-- 媒體內容 (根據類型顯示不同輸入方式) -->
          <div v-if="form.type !== 'text'" class="field">
            <label class="block font-semibold mb-2">
              <i :class="getTypeIcon(form.type)" class="mr-1"></i>
              {{ getMediaLabel(form.type) }}
              <span class="text-red-500">*</span>
            </label>
            <!-- 圖片上傳 -->
            <div v-if="form.type === 'image'" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <small class="text-gray-500 mt-1 block"
                    >支援 JPG, PNG, GIF, WebP (最大 10MB)</small
                  >
                </div>
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
                  <small class="text-gray-500 mt-1 block"
                    >支援常見圖片網站：Imgur、Reddit、Discord 等</small
                  >
                </div>
              </div>
              <div v-if="form.image_url || uploadedImageUrl" class="mt-3">
                <label class="block text-sm font-medium mb-2">預覽</label>
                <div class="border rounded-lg p-2 bg-gray-50">
                  <img
                    :src="uploadedImageUrl || form.image_url"
                    alt="圖片預覽"
                    class="max-w-full max-h-64 rounded object-contain mx-auto"
                    @error="onImageError"
                    @load="imagePreviewError = false"
                  />
                  <div
                    v-if="imagePreviewError"
                    class="text-center text-red-500 p-4"
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
              <small class="text-gray-500"
                >支援 YouTube、Vimeo、TikTok、Twitch 等影片平台連結</small
              >
              <div v-if="form.video_url" class="mt-3">
                <label class="block text-sm font-medium mb-2">預覽</label>
                <div class="border rounded-lg p-2 bg-gray-50">
                  <div v-if="isYouTubeUrl(form.video_url)" class="aspect-video">
                    <iframe
                      :src="getYouTubeEmbedUrl(form.video_url)"
                      class="w-full h-full rounded"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div v-else class="text-center p-4 text-gray-500">
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
              <small class="text-gray-500"
                >支援 YouTube、SoundCloud、Spotify、Podcast
                等音訊平台連結</small
              >
              <div v-if="form.audio_url" class="mt-3">
                <label class="block text-sm font-medium mb-2">預覽</label>
                <div class="border rounded-lg p-4 bg-gray-50">
                  <div v-if="isYouTubeUrl(form.audio_url)" class="aspect-video">
                    <iframe
                      :src="getYouTubeEmbedUrl(form.audio_url)"
                      class="w-full h-full rounded"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div v-else class="text-center text-gray-500">
                    <i class="pi pi-volume-up text-2xl mb-2"></i>
                    <p>音訊連結：{{ form.audio_url }}</p>
                    <small class="block mt-1"
                      >其他平台的音訊將在發布後顯示</small
                    >
                  </div>
                </div>
              </div>
            </div>
            <small v-if="errors.mediaUrl" class="p-error">{{
              errors.mediaUrl
            }}</small>
          </div>

          <!-- 標籤選擇與新增 -->
          <div class="field">
            <label class="block font-semibold mb-2">標籤</label>
            <div class="space-y-3">
              <div v-if="selectedTags.length" class="flex flex-wrap gap-2">
                <Chip
                  v-for="tag in selectedTags"
                  :key="tag._id || tag.name"
                  :label="tag.name"
                  removable
                  @remove="removeTag(tag)"
                  class="bg-blue-100 text-blue-800"
                />
              </div>
              <div class="flex gap-2">
                <AutoComplete
                  v-model="tagInput"
                  :suggestions="tagSuggestions"
                  @complete="searchTags"
                  @keydown.enter.prevent="addTag"
                  optionLabel="name"
                  placeholder="輸入標籤名稱..."
                  class="flex-1"
                  appendTo="body"
                />
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="新增"
                  @click="addTag"
                  :disabled="!tagInput.trim()"
                />
              </div>
              <small class="text-gray-500"
                >輸入標籤名稱，按 Enter
                或點擊新增。如果標籤不存在會自動建立。</small
              >
            </div>
          </div>

          <!-- 詳細介紹編輯器 -->
          <div class="field">
            <label class="block font-semibold mb-2">詳細介紹</label>
            <div class="overflow-hidden">
              <QuillEditor
                v-model:content="detailMarkdown"
                content-type="html"
                theme="snow"
                :options="editorOptions"
                class="min-h-[300px]"
              />
            </div>
            <small class="text-gray-500"
              >支援富文本編輯，可以添加圖片、連結、表格等豐富內容。</small
            >
          </div>

          <!-- 其他選項 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <div class="flex items-center">
                <Checkbox v-model="form.nsfw" inputId="nsfw" :binary="true" />
                <label for="nsfw" class="ml-2 font-medium"
                  >成人/限制級內容 (NSFW)</label
                >
              </div>
              <small class="text-gray-500 block mt-1"
                >勾選此項表示內容可能不適合工作場所觀看</small
              >
            </div>
            <div class="field">
              <label for="language" class="block font-semibold mb-2"
                >語言</label
              >
              <Dropdown
                id="language"
                v-model="form.language"
                :options="languageOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                appendTo="body"
              />
            </div>
          </div>

          <!-- 來源網址 -->
          <div class="field">
            <label for="sourceUrl" class="block font-semibold mb-2"
              >來源網址</label
            >
            <InputText
              id="sourceUrl"
              v-model="form.source_url"
              placeholder="如果有引用來源，請提供原始網址..."
              type="url"
              class="w-full"
            />
            <small class="text-gray-500">選填，標註內容來源以示尊重</small>
          </div>

          <Message v-if="submitError" severity="error" :closable="false">{{
            submitError
          }}</Message>

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
  <Toast />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
import Message from 'primevue/message'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import memeService from '@/services/memeService'
import tagService from '@/services/tagService'

defineOptions({ name: 'EditMemePage' })

const toast = useToast()
const router = useRouter()
const route = useRoute()
const memeId = route.params.id

const form = reactive({
  title: '',
  type: 'text',
  content: '',
  image_url: '',
  video_url: '',
  audio_url: '',
  nsfw: false,
  language: 'zh',
  source_url: '',
})
const errors = reactive({
  title: '',
  type: '',
  content: '',
  mediaUrl: '',
})
const uploadedImageUrl = ref('')
const imagePreviewError = ref(false)
const selectedTags = ref([])
const tagInput = ref('')
const tagSuggestions = ref([])
const allTags = ref([])
const detailMarkdown = ref('')
const loading = ref(false)
const submitError = ref('')
const loadError = ref('')
const uploadedImageFile = ref(null)
const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: '請輸入詳細介紹...',
  theme: 'snow',
}
const typeOptions = [
  { label: '純文字', value: 'text', icon: 'pi pi-file-edit' },
  { label: '圖片/GIF', value: 'image', icon: 'pi pi-image' },
  { label: '影片', value: 'video', icon: 'pi pi-video' },
  { label: '音訊', value: 'audio', icon: 'pi pi-volume-up' },
]
const languageOptions = [
  { label: '繁體中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
]

onMounted(async () => {
  try {
    loading.value = true
    console.log('開始載入迷因數據，ID:', memeId)

    // 確保 memeId 存在
    if (!memeId) {
      throw new Error('未提供迷因 ID')
    }

    // 載入標籤數據
    try {
      const { data: tagData } = await tagService.getAll()
      allTags.value = Array.isArray(tagData) ? tagData : []
      console.log('標籤載入成功:', allTags.value.length)
    } catch (tagError) {
      console.error('載入標籤失敗:', tagError)
      // 標籤載入失敗不應該阻止頁面載入
      allTags.value = []
    }

    // 載入迷因數據
    console.log('開始載入迷因數據...')
    const { data } = await memeService.get(memeId)
    console.log('API 響應:', data)

    // 更靈活的數據解析
    const meme = data.data || data.meme || data || {}
    console.log('解析的迷因數據:', meme)

    // 檢查迷因數據是否有效
    if (!meme || !meme.title) {
      throw new Error('迷因數據無效或不存在')
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
    form.source_url = meme.source_url || ''
    detailMarkdown.value = meme.detail_markdown || ''

    // 設置標籤
    selectedTags.value = []
    if (meme.tags && Array.isArray(meme.tags)) {
      selectedTags.value = meme.tags
    } else if (meme.tags_cache && Array.isArray(meme.tags_cache)) {
      selectedTags.value = meme.tags_cache.map((name) => ({ name }))
    }

    // 重置其他狀態
    uploadedImageUrl.value = ''
    imagePreviewError.value = false
    tagInput.value = ''
    tagSuggestions.value = []

    console.log('迷因數據載入完成')
  } catch (error) {
    console.error('載入迷因失敗:', error)
    loadError.value = error.message || '無法載入迷因資料'
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
const onImageSelect = (event) => {
  const file = event.files[0]
  if (file) {
    uploadedImageFile.value = file
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
const searchTags = (event) => {
  const query = event.query.toLowerCase()
  tagSuggestions.value = Array.isArray(allTags.value)
    ? allTags.value.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query) &&
          !selectedTags.value.some((selected) => selected.name === tag.name),
      )
    : []
}
const addTag = () => {
  const tagName =
    typeof tagInput.value === 'string'
      ? tagInput.value.trim()
      : tagInput.value?.name?.trim() || ''
  if (!tagName || tagName.length > 50) return
  if (selectedTags.value.some((tag) => tag.name === tagName)) {
    tagInput.value = ''
    return
  }
  const existingTag = Array.isArray(allTags.value)
    ? allTags.value.find((tag) => tag.name === tagName)
    : null
  if (existingTag) {
    selectedTags.value.push(existingTag)
  } else {
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
// 字元計數函數 - 適合中文字元計算
const getCharCount = (text) => {
  if (!text) return 0

  // 計算字元數，中文字元算 1 個字元
  // 這裡使用簡單的長度計算，因為中文字元在 JavaScript 中也是 1 個字元
  // 如果需要更複雜的計算（如考慮全形字元），可以進一步修改
  return text.length
}

const validateForm = () => {
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
  if (form.type !== 'text') {
    if (form.type === 'image') {
      // 沒選檔案也沒填連結才報錯
      if (!uploadedImageFile.value && !form.image_url) {
        errors.mediaUrl = '請上傳圖片或提供圖片連結'
        isValid = false
      }
      // 如果有填連結，可加強合法性檢查（可選）
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
    source_url: '',
  })

  uploadedImageUrl.value = ''
  uploadedImageFile.value = null
  imagePreviewError.value = false
  selectedTags.value = []
  tagInput.value = ''
  detailMarkdown.value = ''
  submitError.value = ''
  loadError.value = ''

  Object.keys(errors).forEach((key) => (errors[key] = ''))
}
const handleSubmit = async () => {
  if (!validateForm()) return
  loading.value = true
  submitError.value = ''

  try {
    // 先上傳圖片（如果有的話）
    if (form.type === 'image' && uploadedImageFile.value) {
      const formData = new FormData()
      formData.append('image', uploadedImageFile.value) // key 必須是 'image'

      const res = await fetch('/api/upload/image', {
        method: 'POST',
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

    // 處理新標籤創建
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
          selectedTags.value[i] = exist
        }
      }
    }

    const newTags = selectedTags.value.filter(
      (tag) =>
        tag.isNew &&
        !allTags.value.some(
          (t) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase(),
        ),
    )

    const createdTags = []
    for (const newTag of newTags) {
      try {
        const { data } = await tagService.create({ name: newTag.name })
        createdTags.push(data)
        if (Array.isArray(allTags.value)) {
          allTags.value.push(data)
        }
      } catch (error) {
        console.error(`建立標籤 "${newTag.name}" 失敗:`, error)
      }
    }

    const allSelectedTags = [
      ...selectedTags.value.filter((tag) => !tag.isNew),
      ...createdTags,
    ]
    const tagNames = allSelectedTags.map((tag) => tag.name)

    // 準備迷因數據
    const memeData = {
      ...form,
      detail_markdown: detailMarkdown.value,
      tags_cache: tagNames,
    }

    // 清理空字串欄位，避免後端驗證問題
    if (memeData.image_url === '') memeData.image_url = undefined
    if (memeData.video_url === '') memeData.video_url = undefined
    if (memeData.audio_url === '') memeData.audio_url = undefined
    if (memeData.source_url === '') memeData.source_url = undefined

    console.log('使用 JSON 數據更新')
    await memeService.update(memeId, memeData)

    toast.add({
      severity: 'success',
      summary: '儲存成功',
      detail: '迷因已更新',
      life: 5000,
    })
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

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
:deep(.quill-editor) {
  min-height: 300px;
}
:deep(.quill-editor .ql-editor) {
  outline: none;
  padding: 1rem;
}
:deep(.quill-editor .ql-container) {
  outline: none;
}
</style>

<route lang="yaml">
meta:
  title: '編輯迷因'
  login: required
  layout: default
  admin: false
</route>
