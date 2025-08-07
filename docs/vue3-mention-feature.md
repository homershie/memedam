# Vue 3 @提及功能實現指南

## 概述

本項目已實現完整的@提及功能，專為 Vue 3.4+ 優化，使用了最新的 Vue 3 特性。

## Vue 3 特性應用

### 1. defineModel (Vue 3.4+)

使用 Vue 3.4 中穩定的 `defineModel` 來簡化雙向綁定：

```vue
<script setup>
// 使用 defineModel 替代傳統的 props + emit
const modelValue = defineModel<string>()
</script>
```

### 2. TypeScript 支持

雖然當前項目使用 JavaScript，但組件設計支持 TypeScript：

```vue
<script setup lang="ts">
interface User {
  _id: string
  username: string
  displayName?: string
  avatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '輸入內容...',
  maxLength: 1000,
  mentionUsers: () => [],
})
</script>
```

### 3. 組合式 API

充分利用 Vue 3 的組合式 API：

```vue
<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

// 響應式數據
const inputContainer = ref()
const mentionList = ref([])

// 計算屬性
const dropdownStyle = computed(() => {
  // 計算下拉選單位置
})

// 生命週期
onMounted(() => {
  // 初始化邏輯
})

onUnmounted(() => {
  // 清理邏輯
})
</script>
```

## 組件使用

### MentionInput 組件 (Vue 3 版本)

```vue
<template>
  <MentionInput
    v-model="content"
    placeholder="輸入內容..."
    :mention-users="users"
    @mention-selected="handleMentionSelected"
  />
</template>

<script setup>
import { ref } from 'vue'
import MentionInput from '@/components/MentionInput.vue'

const content = ref('')
const users = ref([])

const handleMentionSelected = (user) => {
  console.log('選擇了用戶:', user)
}
</script>
```

### MentionDisplay 組件 (Vue 3 版本)

```vue
<template>
  <MentionDisplay
    :content="comment.content"
    :users="users"
    @mention-click="handleMentionClick"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import MentionDisplay from '@/components/MentionDisplay.vue'

const router = useRouter()

const handleMentionClick = (username) => {
  router.push(`/users/${username}`)
}
</script>
```

## Vue 3 最佳實踐

### 1. 響應式數據管理

```javascript
// 使用 ref 和 reactive
const mentionList = ref([])
const selectedIndex = ref(0)

// 使用 computed 進行派生狀態
const dropdownStyle = computed(() => {
  // 計算樣式
})
```

### 2. 事件處理

```javascript
// 使用 defineEmits 進行類型安全的事件定義
const emit = defineEmits(['mention-selected', 'mention-click'])

// 事件處理函數
const handleKeydown = (event) => {
  // 處理鍵盤事件
}
```

### 3. 生命週期管理

```javascript
// 使用 onMounted 和 onUnmounted
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
```

## 與 Vue 2 的差異

### 1. 組件註冊

**Vue 2:**

```javascript
export default {
  components: {
    MentionInput,
  },
}
```

**Vue 3:**

```vue
<script setup>
import MentionInput from '@/components/MentionInput.vue'
// 自動註冊，無需手動聲明
</script>
```

### 2. 數據綁定

**Vue 2:**

```vue
<template>
  <input v-model="content" />
</template>
<script>
export default {
  data() {
    return {
      content: '',
    }
  },
}
</script>
```

**Vue 3:**

```vue
<template>
  <input v-model="content" />
</template>
<script setup>
import { ref } from 'vue'
const content = ref('')
</script>
```

### 3. 事件處理

**Vue 2:**

```javascript
methods: {
  handleMentionSelected(user) {
    // 處理邏輯
  }
}
```

**Vue 3:**

```javascript
const handleMentionSelected = (user) => {
  // 處理邏輯
}
```

## 性能優化

### 1. 響應式優化

```javascript
// 使用 shallowRef 減少深度響應式
import { shallowRef } from 'vue'
const mentionList = shallowRef([])
```

### 2. 計算屬性緩存

```javascript
// 使用 computed 進行緩存
const filteredUsers = computed(() => {
  return props.mentionUsers.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase()),
  )
})
```

### 3. 事件防抖

```javascript
import { debounce } from '@vueuse/core'

const searchUsers = debounce(async (query) => {
  // 搜索邏輯
}, 300)
```

## 工具函數 (Vue 3 版本)

```javascript
// mentionUtils.js - Vue 3 版本
import { ref, computed } from 'vue'

// 響應式提及解析
export function useMentionParser(text) {
  const mentions = computed(() => parseMentions(text.value))
  return { mentions }
}

// 響應式提及統計
export function useMentionStats(text) {
  const stats = computed(() => getMentionStats(text.value))
  return { stats }
}
```

## 測試 (Vue 3 版本)

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MentionInput from '@/components/MentionInput.vue'

describe('MentionInput', () => {
  it('should emit mention-selected when user is selected', async () => {
    const wrapper = mount(MentionInput)

    // 模擬輸入 @ 符號
    await wrapper.find('.mention-input').setValue('@')

    // 驗證下拉選單顯示
    expect(wrapper.find('.mention-dropdown').exists()).toBe(true)
  })
})
```

## 遷移指南

### 從 Vue 2 遷移到 Vue 3

1. **更新組件語法**

   - 使用 `<script setup>` 替代 `export default`
   - 使用 `defineProps` 和 `defineEmits`

2. **更新響應式系統**

   - 使用 `ref` 和 `reactive` 替代 `data()`
   - 使用 `computed` 替代 `computed` 屬性

3. **更新生命週期**
   - 使用 `onMounted` 替代 `mounted()`
   - 使用 `onUnmounted` 替代 `beforeDestroy()`

## 總結

Vue 3 版本的@提及功能具有以下優勢：

1. ✅ **更好的 TypeScript 支持**
2. ✅ **更簡潔的語法**
3. ✅ **更好的性能**
4. ✅ **更強的響應式系統**
5. ✅ **更好的開發體驗**

該實現充分利用了 Vue 3 的最新特性，提供了更好的開發體驗和運行時性能。
