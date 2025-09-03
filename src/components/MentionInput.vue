<template>
  <div class="mention-input-container">
    <!-- 顯示層：渲染標籤 -->
    <div
      class="mention-display-layer"
      v-html="displayHtml"
      :style="displayLayerStyle"
    ></div>
    <!-- 輸入層：透明文字，實際輸入 -->
    <div
      ref="inputContainer"
      class="mention-input-layer bg-white w-full min-h-20 p-3 border border-gray-300 rounded-lg text-base leading-6 resize-vertical outline-none transition-all duration-200 dark:text-surface-100! dark:bg-gray-800 dark:border-gray-700"
      :class="{ focused: isFocused }"
      @click="focusInput"
      @keydown="handleKeydown"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      contenteditable="true"
      :placeholder="placeholder"
      role="textbox"
      aria-multiline="true"
      style="
        background: transparent;
        color: transparent;
        caret-color: #222;
        position: relative;
        z-index: 2;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: break-word;
      "
    ></div>
    <!-- @提及下拉選單 -->
    <div
      v-if="showMentionList && mentionList.length > 0"
      ref="mentionDropdown"
      class="bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto min-w-40 dark:bg-gray-800 dark:border-gray-700"
      :style="dropdownStyle"
    >
      <div
        v-for="(user, index) in mentionList"
        :key="user._id"
        class="mention-item p-2 cursor-pointer transition-all duration-200"
        :class="{ selected: index === selectedIndex }"
        @click="selectMention(user)"
        @mouseenter="selectedIndex = index"
      >
        <div class="flex items-center gap-2">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.username"
            class="w-6 h-6 rounded-full"
          />
          <div
            v-else
            class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center"
          >
            <i class="pi pi-user text-xs text-gray-600"></i>
          </div>
          <div class="flex-1">
            <div class="font-medium text-sm">{{ user.username }}</div>
            <div v-if="user.displayName" class="text-xs text-gray-500">
              {{ user.displayName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import userService from '@/services/userService'
// import { parseMentions } from '@/utils/mentionUtils' // 已不需要

/**
 * @typedef {Object} User
 * @property {string} _id - 用戶ID
 * @property {string} username - 用戶名
 * @property {string} [displayName] - 顯示名稱
 * @property {string} [avatar] - 頭像URL
 */

const props = defineProps({
  placeholder: {
    type: String,
    default: '輸入內容...',
  },
  maxLength: {
    type: Number,
    default: 1000,
  },
  mentionUsers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['mention-selected', 'submit', 'cancel'])

// 響應式數據
const inputContainer = ref()
const mentionDropdown = ref()
const isFocused = ref(false)
const showMentionList = ref(false)
const mentionList = ref([])
const selectedIndex = ref(0)
const currentMentionQuery = ref('')
const mentionStartPosition = ref(0)
const mentionEndPosition = ref(0)

// 新增：顯示層的 HTML
const displayHtml = ref('')

// 計算顯示層樣式，確保與輸入層完全一致
const displayLayerStyle = computed(() => ({
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  color: '#222',
  minHeight: '100%',
  padding: '12px',
  fontSize: '16px',
  lineHeight: '1.5',
  fontFamily: 'inherit',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  border: 'none',
  outline: 'none',
  resize: 'vertical',
  backgroundColor: 'transparent',
}))

const updateDisplayHtml = () => {
  const content = inputContainer.value?.textContent || ''
  // 將 @xxx 轉成 <span class="mention-tag">@xxx</span>
  let html = content.replace(/@(\w+)(?=\s|$|[^\w@])/g, (match) => {
    return `<span class="mention-tag">${match}</span>`
  })
  // 保留空格
  html = html.replace(/ /g, '&nbsp;')
  displayHtml.value = html
}

// 計算屬性
const dropdownStyle = computed(() => {
  if (!inputContainer.value) return {}

  const mentionRect = getMentionRect()
  const containerRect = inputContainer.value.getBoundingClientRect()

  // 計算相對於容器的位置
  let relativeTop = mentionRect.bottom - containerRect.top
  let relativeLeft = mentionRect.left - containerRect.left

  // 確保下拉選單不會超出容器邊界
  const dropdownWidth = 200 // 預估下拉選單寬度
  const dropdownHeight = Math.min(mentionList.value.length * 40, 160) // 預估高度

  // 檢查右邊界
  if (relativeLeft + dropdownWidth > containerRect.width) {
    relativeLeft = Math.max(0, containerRect.width - dropdownWidth)
  }

  // 檢查下邊界，如果超出則顯示在光標上方
  if (relativeTop + dropdownHeight > containerRect.height) {
    relativeTop = mentionRect.top - containerRect.top - dropdownHeight
  }

  return {
    position: 'absolute',
    top: `${relativeTop}px`,
    left: `${relativeLeft}px`,
    zIndex: 1000,
  }
})

// 方法
const focusInput = () => {
  inputContainer.value?.focus()
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
  // 延遲隱藏下拉選單，讓點擊事件能夠觸發
  setTimeout(() => {
    showMentionList.value = false
  }, 200)
}

// 修改 handleInput
const handleInput = () => {
  const content = inputContainer.value?.textContent || ''
  emit('update:modelValue', content)
  updateDisplayHtml()
  checkForMention(content)
}

const handleKeydown = (event) => {
  // 處理全局快捷鍵
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    emit('submit')
    return
  }

  if (event.key === 'Escape' && !showMentionList.value) {
    event.preventDefault()
    emit('cancel')
    return
  }

  // 處理@提及下拉選單的快捷鍵
  if (showMentionList.value) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex.value = Math.min(
          selectedIndex.value + 1,
          mentionList.value.length - 1,
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
        break
      case 'Enter':
        event.preventDefault()
        if (mentionList.value[selectedIndex.value]) {
          selectMention(mentionList.value[selectedIndex.value])
        }
        break
      case 'Escape':
        event.preventDefault()
        hideMentionList()
        break
    }
  }
}

const checkForMention = (content) => {
  const cursorPosition = getCursorPosition()
  const beforeCursor = content.substring(0, cursorPosition)

  // 查找@符號
  const atIndex = beforeCursor.lastIndexOf('@')

  if (atIndex !== -1) {
    // 檢查@後面是否有空格或其他分隔符
    const afterAt = beforeCursor.substring(atIndex + 1)
    const hasSpace = /\s/.test(afterAt)

    if (!hasSpace) {
      const query = afterAt.trim()
      currentMentionQuery.value = query
      mentionStartPosition.value = atIndex
      // 修正：mentionEndPosition 應該是 @ 加上查詢文本的結束位置
      mentionEndPosition.value = atIndex + 1 + query.length

      // 搜索用戶
      searchUsers(query)
    } else {
      hideMentionList()
    }
  } else {
    hideMentionList()
  }
}

const searchUsers = async (query) => {
  try {
    // 如果有預設的用戶列表，先從中搜索
    if (props.mentionUsers.length > 0) {
      const filtered = props.mentionUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          (user.displayName &&
            user.displayName.toLowerCase().includes(query.toLowerCase())),
      )
      mentionList.value = filtered.slice(0, 10)
      showMentionList.value = filtered.length > 0
      selectedIndex.value = 0
      return
    }

    // 否則從API搜索
    const response = await userService.searchUsers({ q: query, limit: 10 })
    if (response.data?.success) {
      mentionList.value = response.data.data
      showMentionList.value = response.data.data.length > 0
      selectedIndex.value = 0
    }
  } catch (error) {
    console.error('搜索用戶失敗:', error)
    mentionList.value = []
    showMentionList.value = false
  }
}

const selectMention = (user) => {
  const content = inputContainer.value?.textContent || ''
  const beforeMention = content.substring(0, mentionStartPosition.value)
  const afterMention = content.substring(mentionEndPosition.value)

  // 插入@提及，確保後面有空格
  const mentionText = `@${user.username} `
  const newContent = beforeMention + mentionText + afterMention

  // 更新輸入框內容
  if (inputContainer.value) {
    inputContainer.value.textContent = newContent
    emit('update:modelValue', newContent)
    updateDisplayHtml()
  }

  // 設置光標位置
  const newCursorPosition = mentionStartPosition.value + mentionText.length
  setCursorPosition(newCursorPosition)

  // 隱藏下拉選單
  hideMentionList()

  // 觸發選擇事件
  emit('mention-selected', user)

  // 重新聚焦
  nextTick(() => {
    inputContainer.value?.focus()
  })
}

const hideMentionList = () => {
  showMentionList.value = false
  mentionList.value = []
  selectedIndex.value = 0
}

const getCursorPosition = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    if (inputContainer.value?.contains(range.commonAncestorContainer)) {
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(inputContainer.value)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      return preCaretRange.toString().length
    }
  }
  return 0
}

const setCursorPosition = (position) => {
  const selection = window.getSelection()
  const range = document.createRange()

  if (inputContainer.value) {
    const textNode = inputContainer.value.firstChild || inputContainer.value
    const maxLength = textNode.textContent?.length || 0
    const safePosition = Math.min(position, maxLength)

    try {
      if (textNode.nodeType === Node.TEXT_NODE) {
        range.setStart(textNode, safePosition)
      } else {
        range.setStart(textNode, 0)
      }
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    } catch (error) {
      console.warn('設置光標位置失敗:', error)
    }
  }
}

const getMentionRect = () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)

    // 確保範圍在輸入容器內
    if (inputContainer.value?.contains(range.commonAncestorContainer)) {
      const rect = range.getBoundingClientRect()

      // 如果範圍為空（只有光標），創建一個小的矩形
      if (rect.width === 0) {
        const tempRange = range.cloneRange()
        tempRange.collapse(false)
        const tempRect = tempRange.getBoundingClientRect()
        return tempRect
      }

      return rect
    }
  }

  // 如果無法獲取光標位置，返回輸入框底部位置
  const containerRect = inputContainer.value?.getBoundingClientRect()
  if (containerRect) {
    return {
      top: containerRect.bottom - 20,
      bottom: containerRect.bottom,
      left: containerRect.left + 10,
      right: containerRect.right - 10,
      width: containerRect.width - 20,
      height: 20,
    }
  }

  return new DOMRect()
}

// 監聽點擊外部
const handleClickOutside = (event) => {
  const target = event.target
  if (
    !inputContainer.value?.contains(target) &&
    !mentionDropdown.value?.contains(target)
  ) {
    hideMentionList()
  }
}

// 生命週期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 設置初始內容
  if (props.modelValue && inputContainer.value) {
    inputContainer.value.textContent = props.modelValue
    updateDisplayHtml()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法
defineExpose({
  focus: focusInput,
  clear: () => {
    if (inputContainer.value) {
      inputContainer.value.textContent = ''
      emit('update:modelValue', '')
      updateDisplayHtml()
    }
  },
  insertMention: (username) => {
    if (inputContainer.value && username) {
      const currentContent = inputContainer.value.textContent || ''
      const cursorPosition = getCursorPosition()

      // 在當前光標位置插入提及
      const beforeCursor = currentContent.substring(0, cursorPosition)
      const afterCursor = currentContent.substring(cursorPosition)
      const mentionText = `@${username} `
      const newContent = beforeCursor + mentionText + afterCursor

      // 更新輸入框內容
      inputContainer.value.textContent = newContent
      emit('update:modelValue', newContent)
      updateDisplayHtml()

      // 設置光標位置到提及後面
      const newCursorPosition = cursorPosition + mentionText.length
      setCursorPosition(newCursorPosition)

      // 重新聚焦
      nextTick(() => {
        inputContainer.value?.focus()
      })
    }
  },
})
</script>

<style scoped>
.mention-input-container {
  position: relative;
  width: 100%;
  min-height: 48px;
}

.mention-display-layer {
  pointer-events: none;
  position: absolute;
  inset: 0;
  color: #222;
  min-height: 100%;
  z-index: 1;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
  padding: 12px;
  border: none;
  outline: none;
  resize: vertical;
  background-color: transparent;
}

.mention-input-layer {
  background: transparent;
  color: transparent;
  caret-color: #ffffff;
  position: relative;
  z-index: 2;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

.dark .mention-input-layer {
  caret-color: #ffffff;
}

.mention-tag {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  padding: 0 4px;
  margin: 0 1px;
  font-weight: 500;
  border: 1px solid #bbdefb;
}

.mention-input:focus {
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 0.2rem var(--p-primary-color-alpha-20);
}

.mention-input:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.mention-item:hover,
.mention-item.selected {
  background-color: var(--p-surface-100);
}

.dark .mention-item:hover,
.dark .mention-item.selected {
  background-color: var(--p-primary-500);
}

.mention-item:first-child {
  border-radius: 8px 8px 0 0;
}

.mention-item:last-child {
  border-radius: 0 0 8px 8px;
}
</style>
