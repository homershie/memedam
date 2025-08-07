<template>
  <div class="mention-input-container">
    <!-- 輸入框 -->
    <div
      ref="inputContainer"
      class="mention-input"
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
    ></div>

    <!-- @提及下拉選單 -->
    <div
      v-if="showMentionList && mentionList.length > 0"
      ref="mentionDropdown"
      class="mention-dropdown"
      :style="dropdownStyle"
    >
      <div
        v-for="(user, index) in mentionList"
        :key="user._id"
        class="mention-item"
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

// 計算屬性
const dropdownStyle = computed(() => {
  if (!inputContainer.value) return {}

  const mentionRect = getMentionRect()

  return {
    position: 'absolute',
    top: `${mentionRect.bottom + 5}px`,
    left: `${mentionRect.left}px`,
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

const handleInput = () => {
  const content = inputContainer.value?.textContent || ''
  // 更新 v-model
  emit('update:modelValue', content)

  // 檢查是否需要顯示@提及列表
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
      mentionEndPosition.value = cursorPosition

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

  // 插入@提及
  const mentionText = `@${user.username} `
  const newContent = beforeMention + mentionText + afterMention

  // 更新輸入框內容
  if (inputContainer.value) {
    inputContainer.value.textContent = newContent
    emit('update:modelValue', newContent)
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
    return range.getBoundingClientRect()
  }
  return inputContainer.value?.getBoundingClientRect() || new DOMRect()
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
    }
  },
})
</script>

<style scoped>
.mention-input-container {
  position: relative;
  width: 100%;
}

.mention-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background-color: white;
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

.mention-dropdown {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  min-width: 200px;
}

.mention-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mention-item:hover,
.mention-item.selected {
  background-color: #f3f4f6;
}

.mention-item:first-child {
  border-radius: 8px 8px 0 0;
}

.mention-item:last-child {
  border-radius: 0 0 8px 8px;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .mention-input {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .mention-dropdown {
    background: #1f2937;
    border-color: #4b5563;
  }

  .mention-item:hover,
  .mention-item.selected {
    background-color: #374151;
  }
}
</style>
