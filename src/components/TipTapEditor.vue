<template>
  <div class="tiptap-editor">
    <div v-if="editor" class="editor-toolbar">
      <!-- 文字格式 -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          title="粗體 (Ctrl+B)"
        >
          <i class="ri-bold"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          title="斜體 (Ctrl+I)"
        >
          <i class="ri-italic"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          class="toolbar-btn"
          title="刪除線"
        >
          <i class="ri-strikethrough"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
          class="toolbar-btn"
          title="底線"
        >
          <i class="ri-underline"></i>
        </button>

        <button
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
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="標題 1"
        >
          <i class="ri-h-1"></i>
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="標題 2"
        >
          <i class="ri-h-2"></i>
        </button>
        <button
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
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
          title="無序列表"
        >
          <i class="ri-list-unordered"></i>
        </button>
        <button
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
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          class="toolbar-btn"
          title="引用"
        >
          <i class="ri-double-quotes-l"></i>
        </button>

        <button
          @click="toggleLink"
          :class="{ 'is-active': editor.isActive('link') }"
          class="toolbar-btn"
          :title="editor.isActive('link') ? '移除連結' : '插入連結'"
        >
          <i
            :class="editor.isActive('link') ? 'ri-link-unlink' : 'ri-link'"
          ></i>
        </button>

        <button @click="addImage" class="toolbar-btn" title="插入圖片">
          <i class="ri-image-add-line"></i>
        </button>

        <button
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
        <button @click="insertTable" class="toolbar-btn" title="插入表格">
          <i class="ri-table-line"></i>
        </button>
        <button
          @click="editor.chain().focus().addRowBefore().run()"
          :disabled="!editor?.isActive('table')"
          class="toolbar-btn"
          title="在上方插入行"
        >
          <i class="ri-insert-row-top"></i>
        </button>
        <button
          @click="editor.chain().focus().addColumnBefore().run()"
          :disabled="!editor?.isActive('table')"
          class="toolbar-btn"
          title="在左側插入列"
        >
          <i class="ri-insert-column-left"></i>
        </button>
        <button
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
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="toolbar-btn"
          title="復原 (Ctrl+Z)"
        >
          <i class="ri-arrow-go-back-line"></i>
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="toolbar-btn"
          title="重做 (Ctrl+Y)"
        >
          <i class="ri-arrow-go-forward-line"></i>
        </button>
      </div>
    </div>
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'

defineOptions({ name: 'TipTapEditor' })

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

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
    Image,
    Link,
    HorizontalRule,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary-600 dark:prose-code:text-primary-400',
    },
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    const isSame = editor.value?.getHTML() === newValue
    if (!isSame && editor.value) {
      editor.value.commands.setContent(newValue || '', false)
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
    // 如果不是連結，則添加連結
    const url = window.prompt('請輸入連結網址：')
    if (url) {
      editor.value
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
  }
}

const addImage = () => {
  const url = window.prompt('請輸入圖片網址：')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
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
})
</script>
