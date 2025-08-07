<template>
  <div
    class="mention-display"
    v-html="formattedContent"
    @click="handleMentionClick"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { convertMentionsToHTML } from '@/utils/mentionUtils'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  users: {
    type: Array,
    default: () => [],
  },
  showLinks: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['mention-click'])

// 計算格式化後的內容
const formattedContent = computed(() => {
  if (!props.content) return ''

  // 生成用戶連結的函數
  const userLinkGenerator = props.showLinks
    ? (username) => {
        return `/users/${username}`
      }
    : null

  return convertMentionsToHTML(props.content, userLinkGenerator)
})

// 處理@提及點擊
const handleMentionClick = (event) => {
  const target = event.target
  if (
    target.classList.contains('mention-link') ||
    target.classList.contains('mention')
  ) {
    const username = target.dataset.username
    if (username) {
      emit('mention-click', username)
    }
  }
}
</script>

<style scoped>
.mention-display {
  line-height: 1.6;
  word-wrap: break-word;
}

.mention-display :deep(.mention) {
  color: #3b82f6;
  font-weight: 500;
  background-color: #eff6ff;
  padding: 2px 4px;
  border-radius: 4px;
  text-decoration: none;
}

.mention-display :deep(.mention-link) {
  color: #3b82f6;
  font-weight: 500;
  background-color: #eff6ff;
  padding: 2px 4px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.mention-display :deep(.mention-link:hover) {
  background-color: #dbeafe;
  text-decoration: underline;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .mention-display :deep(.mention),
  .mention-display :deep(.mention-link) {
    color: #60a5fa;
    background-color: #1e3a8a;
  }

  .mention-display :deep(.mention-link:hover) {
    background-color: #1e40af;
  }
}
</style>