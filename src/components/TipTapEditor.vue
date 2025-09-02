<template>
  <div class="tiptap-editor" @click.stop @submit.prevent @keydown.stop>
    <div v-if="editor" class="editor-toolbar">
      <!-- 文字格式 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          title="粗體 (Ctrl+B)"
        >
          <i class="ri-bold"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          title="斜體 (Ctrl+I)"
        >
          <i class="ri-italic"></i>
        </button>

        <!-- 輔助文字 -->
        <button
          type="button"
          @click="editor.chain().focus().toggleSuperscript().run()"
          :class="{ 'is-active': editor.isActive('superscript') }"
          class="toolbar-btn"
          title="上標"
        >
          <i class="ri-superscript"></i>
        </button>

        <button
          type="button"
          @click="editor.chain().focus().toggleSubscript().run()"
          :class="{ 'is-active': editor.isActive('subscript') }"
          class="toolbar-btn"
          title="下標"
        >
          <i class="ri-subscript"></i>
        </button>

        <button
          type="button"
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          class="toolbar-btn"
          title="刪除線"
        >
          <i class="ri-strikethrough"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
          class="toolbar-btn"
          title="底線"
        >
          <i class="ri-underline"></i>
        </button>

        <button
          type="button"
          @click="toggleCode"
          :class="{
            'is-active':
              editor.isActive('code') || editor.isActive('codeBlock'),
          }"
          class="toolbar-btn"
          title="程式碼 (自動判斷行內或區塊)"
        >
          <i class="ri-code-s-slash-line"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 標題 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="標題 1"
        >
          <i class="ri-h-1"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="標題 2"
        >
          <i class="ri-h-2"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          title="標題 3"
        >
          <i class="ri-h-3"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 列表 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
          title="無序列表"
        >
          <i class="ri-list-unordered"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          class="toolbar-btn"
          title="有序列表"
        >
          <i class="ri-list-ordered-2"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 其他格式 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          class="toolbar-btn"
          title="引用"
        >
          <i class="ri-double-quotes-l"></i>
        </button>

        <button
          type="button"
          @click="toggleLink"
          :class="{ 'is-active': editor.isActive('link') }"
          class="toolbar-btn"
          :title="editor.isActive('link') ? '移除連結' : '插入連結'"
        >
          <i
            :class="editor.isActive('link') ? 'ri-link-unlink' : 'ri-link'"
          ></i>
        </button>

        <button
          type="button"
          @click="addImage"
          class="toolbar-btn"
          title="插入圖片"
        >
          <i class="ri-image-add-line"></i>
        </button>

        <button
          type="button"
          @click="addVideo"
          class="toolbar-btn"
          title="插入影片"
        >
          <i class="ri-video-add-line"></i>
        </button>

        <button
          type="button"
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="toolbar-btn"
          title="插入分隔線"
        >
          <i class="ri-separator"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 表格 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="insertTable"
          class="toolbar-btn"
          title="插入表格"
        >
          <i class="ri-table-line"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().addRowBefore().run()"
          :disabled="!editor?.isActive('table')"
          class="toolbar-btn"
          title="在上方插入行"
        >
          <i class="ri-insert-row-top"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().addColumnBefore().run()"
          :disabled="!editor?.isActive('table')"
          class="toolbar-btn"
          title="在左側插入列"
        >
          <i class="ri-insert-column-left"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().deleteTable().run()"
          :disabled="!editor?.isActive('table')"
          class="toolbar-btn"
          title="刪除表格"
        >
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 操作 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="toolbar-btn"
          title="復原 (Ctrl+Z)"
        >
          <i class="ri-arrow-go-back-line"></i>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="toolbar-btn"
          title="重做 (Ctrl+Y)"
        >
          <i class="ri-arrow-go-forward-line"></i>
        </button>
      </div>
    </div>
    <EditorContent
      :editor="editor"
      class="editor-content"
      @click="handleEditorClick"
    />

    <!-- 連結對話框 -->
    <Dialog
      v-model:visible="linkDialogVisible"
      :header="linkDialogTitle"
      :style="{ width: '25rem' }"
      :modal="true"
      :closable="true"
      :closeOnEscape="true"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label
            for="linkUrl"
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            連結網址
          </label>
          <InputText
            id="linkUrl"
            v-model="linkUrl"
            placeholder="https://example.com"
            class="w-full"
            @keyup.enter="confirmLink"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            @click="cancelLink"
            outlined
          />
          <Button
            label="確認"
            @click="confirmLink"
            :disabled="!linkUrl.trim()"
          />
        </div>
      </template>
    </Dialog>

    <!-- 圖片對話框 -->
    <Dialog
      v-model:visible="imageDialogVisible"
      header="插入圖片"
      :style="{ width: '30rem' }"
      :modal="true"
      :closable="true"
      :closeOnEscape="true"
    >
      <div class="flex flex-col gap-4">
        <!-- 圖片類型選擇 -->
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="imageType"
              value="upload"
              :inputId="'upload'"
              @change="switchImageType('upload')"
            />
            <label :for="'upload'" class="text-sm">上傳圖片</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="imageType"
              value="url"
              :inputId="'url'"
              @change="switchImageType('url')"
            />
            <label :for="'url'" class="text-sm">使用連結</label>
          </div>
        </div>

        <!-- 上傳圖片模式 -->
        <div v-if="imageType === 'upload'">
          <!-- 圖片預覽 -->
          <div v-if="selectedImage" class="relative inline-block">
            <img
              :src="getImagePreviewUrl(selectedImage)"
              :alt="selectedImage.name"
              class="w-auto max-w-xs h-40 object-cover rounded-lg border"
              draggable="false"
            />
            <div
              class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg flex items-center justify-center"
              @click="removeImage"
            >
              <i class="pi pi-trash text-white text-xl" />
            </div>
          </div>

          <!-- 圖片上傳元件 -->
          <FileUpload
            mode="basic"
            name="image"
            accept="image/*"
            :maxFileSize="5000000"
            @select="onImageSelect"
            chooseLabel="選擇圖片"
            :auto="false"
            class="w-full"
          />
          <small class="text-gray-500"
            >支援 JPG、PNG、GIF、WebP 格式，最大 5MB</small
          >
        </div>

        <!-- 圖片方向選擇 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            圖片方向
          </label>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="selectedImageOrientation"
                value="landscape"
                :inputId="'img-landscape'"
              />
              <label :for="'img-landscape'" class="text-sm">橫式 (4:3)</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="selectedImageOrientation"
                value="portrait"
                :inputId="'img-portrait'"
              />
              <label :for="'img-portrait'" class="text-sm">直式 (3:4)</label>
            </div>
          </div>
        </div>

        <!-- 圖片尺寸選擇 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            圖片尺寸
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="option in selectedImageOrientation === 'portrait'
                ? imageSizeOptionsPortrait
                : imageSizeOptions"
              :key="option.value"
              @click="selectedImageSize = option.value"
              :class="[
                'p-3 border rounded-lg cursor-pointer transition-colors',
                selectedImageSize === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500',
              ]"
            >
              <div class="font-medium text-sm">{{ option.label }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ option.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 圖片連結模式 -->
        <div v-if="imageType === 'url'">
          <div class="flex flex-col gap-2">
            <label
              for="imageUrl"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              圖片網址
            </label>
            <InputText
              id="imageUrl"
              v-model="imageUrl"
              placeholder="https://example.com/image.jpg"
              class="w-full"
              @keyup.enter="confirmImage"
            />
          </div>

          <!-- 圖片連結預覽 -->
          <div v-if="imageUrl" class="relative inline-block">
            <img
              :src="imageUrl"
              alt="預覽圖片"
              class="w-auto max-w-xs h-40 object-cover rounded-lg border"
              @error="$event.target.style.display = 'none'"
            />
            <div
              class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg flex items-center justify-center"
              @click="
                () => {
                  imageUrl = ''
                }
              "
            >
              <i class="pi pi-trash text-white text-xl" />
            </div>
          </div>
        </div>

        <!-- 圖片註解 -->
        <div class="flex flex-col gap-2">
          <label
            for="imageAnnotation"
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            圖片註解
          </label>
          <InputText
            id="imageAnnotation"
            v-model="imageAnnotation"
            placeholder="請輸入圖片註解（選填）"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            @click="cancelImage"
            outlined
          />
          <Button
            label="確認"
            @click="confirmImage"
            :disabled="!canConfirmImage()"
          />
        </div>
      </template>
    </Dialog>

    <!-- 影片對話框 -->
    <Dialog
      v-model:visible="videoDialogVisible"
      header="插入影片"
      :style="{ width: '30rem' }"
      :modal="true"
      :closable="true"
      :closeOnEscape="true"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label
            for="videoUrl"
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            影片網址
          </label>
          <InputText
            id="videoUrl"
            v-model="videoUrl"
            placeholder="https://www.youtube.com/watch?v=..."
            class="w-full"
            @keyup.enter="confirmVideo"
          />
        </div>

        <!-- 支援的影片平台說明 -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p class="font-medium mb-2">支援的影片平台：</p>
          <ul class="list-disc list-inside space-y-1">
            <li>YouTube</li>
            <li>Vimeo</li>
            <li>TikTok</li>
            <li>Twitch</li>
            <li>Dailymotion</li>
            <li>Bilibili</li>
          </ul>
        </div>

        <!-- 影片方向選擇 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            影片方向
          </label>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="selectedVideoOrientation"
                value="landscape"
                :inputId="'landscape'"
              />
              <label :for="'landscape'" class="text-sm">橫式 (16:9)</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="selectedVideoOrientation"
                value="portrait"
                :inputId="'portrait'"
              />
              <label :for="'portrait'" class="text-sm">直式 (9:16)</label>
            </div>
          </div>
        </div>

        <!-- 影片預覽 -->
        <div v-if="videoUrl && isExternalVideoUrl(videoUrl)" class="relative">
          <div
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            預覽：
          </div>
          <div
            class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
          >
            <iframe
              :src="getEmbedUrl(videoUrl)"
              title="影片預覽"
              class="w-full h-full"
              frameborder="0"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <!-- 不支援的影片格式提示 -->
        <div
          v-if="videoUrl && !isExternalVideoUrl(videoUrl)"
          class="text-sm text-primary-600 dark:text-primary-400 bg-primatext-primary-50 dark:bg-primatext-primary-900/20 p-3 rounded-lg"
        >
          <i class="ri-error-warning-line mr-2"></i>
          不支援的影片格式，請使用支援的影片平台連結。
        </div>

        <!-- 影片尺寸選擇 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            影片尺寸
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="option in selectedVideoOrientation === 'portrait'
                ? videoSizeOptionsPortrait
                : videoSizeOptions"
              :key="option.value"
              @click="selectedVideoSize = option.value"
              :class="[
                'p-3 border rounded-lg cursor-pointer transition-colors',
                selectedVideoSize === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500',
              ]"
            >
              <div class="font-medium text-sm">{{ option.label }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ option.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 影片註解 -->
        <div class="flex flex-col gap-2">
          <label
            for="videoAnnotation"
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            影片註解
          </label>
          <InputText
            id="videoAnnotation"
            v-model="videoAnnotation"
            placeholder="請輸入影片註解（選填）..."
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            @click="cancelVideo"
            outlined
          />
          <Button
            label="確認"
            @click="confirmVideo"
            :disabled="!videoUrl.trim() || !isExternalVideoUrl(videoUrl)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { watch, onBeforeUnmount, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Link } from '@tiptap/extension-link'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { VideoEmbed } from '../utils/tipTapVideoExtension.js'
import { CustomImage } from '../utils/tipTapImageExtension.js'
import { isExternalVideoUrl, getEmbedUrl } from '../utils/mediaUtils.js'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import RadioButton from 'primevue/radiobutton'

defineOptions({ name: 'TipTapEditor' })

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '',
  },
  outputJson: {
    type: Boolean,
    default: false,
  },
  // 新增：圖片上傳回調函數
  onImageUpload: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

// 對話框狀態
const linkDialogVisible = ref(false)
const imageDialogVisible = ref(false)
const videoDialogVisible = ref(false)
const linkUrl = ref('')
const imageUrl = ref('')
const videoUrl = ref('')
const linkDialogTitle = ref('插入連結')

// 圖片上傳相關狀態
const imageType = ref('upload') // 'upload' 或 'url'
const selectedImage = ref(null)
const imageAnnotation = ref('') // 圖片註解

// 影片相關狀態
const videoAnnotation = ref('') // 影片註解

// 尺寸選擇相關狀態
const selectedImageSize = ref('m') // 's', 'm', 'l', 'full'
const selectedImageOrientation = ref('landscape') // 'landscape', 'portrait'
const selectedVideoSize = ref('m') // 's', 'm', 'l', 'full'
const selectedVideoOrientation = ref('landscape') // 'landscape', 'portrait'

// 橫式圖片尺寸選項
const imageSizeOptions = [
  { value: 's', label: '小', description: '320×240，適合插圖' },
  { value: 'm', label: '中', description: '640×480，一般內容' },
  { value: 'l', label: '大', description: '960×720，重點圖片' },
  { value: 'full', label: '滿版', description: '自適應寬度' },
]

// 直式圖片尺寸選項
const imageSizeOptionsPortrait = [
  { value: 's', label: '小', description: '240×320，適合手機' },
  { value: 'm', label: '中', description: '480×640，一般內容' },
  { value: 'l', label: '大', description: '720×960，重點圖片' },
]

// 影片尺寸選項
const videoSizeOptions = [
  { value: 's', label: '小', description: '480×270 (16:9)' },
  { value: 'm', label: '中', description: '640×360 (16:9)' },
  { value: 'l', label: '大', description: '960×540 (16:9)' },
  { value: 'full', label: '滿版', description: '自適應寬度' },
]

const videoSizeOptionsPortrait = [
  { value: 's', label: '小', description: '360×640 (9:16)' },
  { value: 'm', label: '中', description: '450×800 (9:16)' },
  { value: 'l', label: '大', description: '540×960 (9:16)' },
  { value: 'full', label: '滿版', description: '自適應寬度' },
]

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    CustomImage,
    Link,
    HorizontalRule,
    Subscript,
    Superscript,
    VideoEmbed,
  ],
  onUpdate: ({ editor }) => {
    // 根據 outputJson 屬性決定輸出格式
    const content = props.outputJson ? editor.getJSON() : editor.getHTML()
    emit('update:modelValue', content)
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-img:max-w-none',
    },
  },
})

// 處理編輯器點擊事件，確保點擊任何地方都能 focus
const handleEditorClick = () => {
  if (editor.value && !editor.value.isFocused) {
    editor.value.commands.focus()
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor.value) return

    // 根據 outputJson 屬性決定如何比較和設置內容
    if (props.outputJson) {
      const currentJson = editor.value.getJSON()
      const isSame = JSON.stringify(currentJson) === JSON.stringify(newValue)
      if (!isSame) {
        editor.value.commands.setContent(newValue || null, false)
      }
    } else {
      const isSame = editor.value.getHTML() === newValue
      if (!isSame) {
        editor.value.commands.setContent(newValue || '', false)
      }
    }
  },
)

const toggleCode = () => {
  const { from, to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to)

  // 如果已經是程式碼區塊，切換回普通文字
  if (editor.value.isActive('codeBlock')) {
    editor.value.chain().focus().toggleCodeBlock().run()
    return
  }

  // 如果已經是行內程式碼，切換回普通文字
  if (editor.value.isActive('code')) {
    editor.value.chain().focus().toggleCode().run()
    return
  }

  // 智能判斷：多行或長文字使用程式碼區塊，短文字使用行內程式碼
  const isMultiLine = selectedText.includes('\n')
  const isLongText = selectedText.length > 50

  if (isMultiLine || isLongText || selectedText.trim() === '') {
    // 使用程式碼區塊
    editor.value.chain().focus().toggleCodeBlock().run()
  } else {
    // 使用行內程式碼
    editor.value.chain().focus().toggleCode().run()
  }
}

const toggleLink = () => {
  if (editor.value?.isActive('link')) {
    // 如果已經是連結，則移除連結
    editor.value.chain().focus().unsetLink().run()
  } else {
    // 如果不是連結，則顯示連結對話框
    linkDialogTitle.value = '插入連結'
    linkUrl.value = ''
    linkDialogVisible.value = true
  }
}

const confirmLink = () => {
  if (linkUrl.value.trim()) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl.value.trim() })
      .run()
    linkDialogVisible.value = false
    linkUrl.value = ''
  }
}

const cancelLink = () => {
  linkDialogVisible.value = false
  linkUrl.value = ''
}

const addImage = () => {
  imageUrl.value = ''
  imageAnnotation.value = ''
  imageType.value = 'upload'
  selectedImage.value = null
  selectedImageSize.value = 'm'
  selectedImageOrientation.value = 'landscape'
  imageDialogVisible.value = true
}

const addVideo = () => {
  videoUrl.value = ''
  videoAnnotation.value = ''
  selectedVideoSize.value = 'm'
  selectedVideoOrientation.value = 'landscape'
  videoDialogVisible.value = true
}

const confirmImage = async () => {
  let imageSrc = ''

  if (imageType.value === 'upload' && selectedImage.value) {
    // 使用本地預覽作為佔位符，實際上傳會在發布時處理
    imageSrc = getImagePreviewUrl(selectedImage.value)

    // 如果有提供上傳回調函數，將檔案傳遞給父組件處理
    if (props.onImageUpload) {
      props.onImageUpload(selectedImage.value)
    }
  } else if (imageType.value === 'url' && imageUrl.value.trim()) {
    // 使用圖片連結
    imageSrc = imageUrl.value.trim()
  }

  if (imageSrc) {
    // 根據選擇的尺寸設定圖片屬性
    const imageAttrs = {
      src: imageSrc,
      size: selectedImageSize.value,
      orientation: selectedImageOrientation.value,
      annotation: imageAnnotation.value, // 使用使用者輸入的註解
    }

    editor.value?.chain().focus().setImage(imageAttrs).run()
    imageDialogVisible.value = false
    imageUrl.value = ''
    selectedImage.value = null
    imageAnnotation.value = ''
    selectedImageSize.value = 'm'
    selectedImageOrientation.value = 'landscape'
  }
}

const cancelImage = () => {
  imageDialogVisible.value = false
  imageUrl.value = ''
  selectedImage.value = null
  imageAnnotation.value = ''
  selectedImageSize.value = 'm'
  selectedImageOrientation.value = 'landscape'
}

const confirmVideo = () => {
  if (videoUrl.value.trim()) {
    // 根據選擇的尺寸設定影片屬性
    const videoAttrs = {
      src: videoUrl.value.trim(),
      title: '嵌入影片',
      size: selectedVideoSize.value,
      orientation: selectedVideoOrientation.value,
      annotation: videoAnnotation.value, // 使用使用者輸入的註解
    }

    editor.value?.chain().focus().setVideoEmbed(videoAttrs).run()
    videoDialogVisible.value = false
    videoUrl.value = ''
    videoAnnotation.value = ''
    selectedVideoSize.value = 'm' // 重置為預設值
    selectedVideoOrientation.value = 'landscape' // 重置為預設值
  }
}

const cancelVideo = () => {
  videoDialogVisible.value = false
  videoUrl.value = ''
  videoAnnotation.value = ''
  selectedVideoSize.value = 'm'
  selectedVideoOrientation.value = 'landscape'
}

// 圖片上傳相關方法
const onImageSelect = (event) => {
  if (event.files && event.files.length > 0) {
    // 清理之前的 URL 物件
    if (selectedImage.value && selectedImage.value._previewUrl) {
      URL.revokeObjectURL(selectedImage.value._previewUrl)
    }

    const file = event.files[0]
    // 為檔案添加預覽 URL
    if (typeof window !== 'undefined') {
      file._previewUrl = URL.createObjectURL(file)
    }
    selectedImage.value = file
  }
}

const removeImage = () => {
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
  selectedImage.value = null
}

const getImagePreviewUrl = (file) => {
  if (file && file._previewUrl) {
    return file._previewUrl
  }
  return ''
}

const switchImageType = (type) => {
  imageType.value = type
  if (type === 'upload') {
    imageUrl.value = ''
  } else {
    // 清理之前的圖片預覽 URL
    if (selectedImage.value && selectedImage.value._previewUrl) {
      URL.revokeObjectURL(selectedImage.value._previewUrl)
    }
    selectedImage.value = null
  }
}

const canConfirmImage = () => {
  if (imageType.value === 'upload') {
    return selectedImage.value !== null
  } else {
    // 在 URL 模式下，只要輸入了 URL 就允許確認
    // 讓使用者可以嘗試插入任何 URL，如果無效會在顯示時處理
    return imageUrl.value.trim() !== ''
  }
}

const insertTable = () => {
  editor.value
    ?.chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
    .run()
}

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
  // 清理圖片預覽 URL
  if (selectedImage.value && selectedImage.value._previewUrl) {
    URL.revokeObjectURL(selectedImage.value._previewUrl)
  }
})
</script>

<style scoped></style>
