<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <div class="mb-4">
      <h1 class="text-3xl font-bold mb-6">投稿迷因</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 標題 -->
        <div>
          <label class="block font-semibold mb-1"
            >標題 <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.title"
            type="text"
            class="input"
            maxlength="200"
            required
          />
        </div>
        <!-- 型態 -->
        <div>
          <label class="block font-semibold mb-1"
            >型態 <span class="text-red-500">*</span></label
          >
          <select v-model="form.type" class="input" required>
            <option value="text">文字</option>
            <option value="image">圖片</option>
            <option value="video">影片</option>
            <option value="audio">音訊</option>
          </select>
        </div>
        <!-- 內容 -->
        <div>
          <label class="block font-semibold mb-1"
            >內容 <span class="text-red-500">*</span></label
          >
          <textarea
            v-model="form.content"
            class="input"
            maxlength="5000"
            rows="3"
            required
          />
        </div>
        <!-- 圖片/影片/音訊連結 -->
        <div v-if="form.type === 'image'">
          <label class="block font-semibold mb-1"
            >圖片連結 <span class="text-red-500">*</span></label
          >
          <input v-model="form.image_url" type="url" class="input" required />
        </div>
        <div v-if="form.type === 'video'">
          <label class="block font-semibold mb-1"
            >影片連結 <span class="text-red-500">*</span></label
          >
          <input v-model="form.video_url" type="url" class="input" required />
        </div>
        <div v-if="form.type === 'audio'">
          <label class="block font-semibold mb-1"
            >音訊連結 <span class="text-red-500">*</span></label
          >
          <input v-model="form.audio_url" type="url" class="input" required />
        </div>
        <!-- 標籤 -->
        <div>
          <label class="block font-semibold mb-1">標籤（以逗號分隔）</label>
          <input
            v-model="tagsInput"
            type="text"
            class="input"
            placeholder="搞笑,迷因,梗圖"
          />
        </div>
        <!-- NSFW -->
        <div>
          <label class="inline-flex items-center">
            <input v-model="form.nsfw" type="checkbox" class="mr-2" />
            成人/限制級（NSFW）
          </label>
        </div>
        <!-- 語言 -->
        <div>
          <label class="block font-semibold mb-1">語言</label>
          <select v-model="form.language" class="input">
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="ja">日文</option>
            <option value="ko">韓文</option>
          </select>
        </div>
        <!-- 來源網址 -->
        <div>
          <label class="block font-semibold mb-1">來源網址</label>
          <input v-model="form.source_url" type="url" class="input" />
        </div>
        <!-- 詳細介紹（Markdown 編輯器） -->
        <div>
          <label class="block font-semibold mb-1">詳細介紹（Markdown）</label>
          <Milkdown v-model="form.detail_markdown" />
        </div>
        <!-- 錯誤訊息 -->
        <div v-if="error" class="text-red-500">{{ error }}</div>
        <!-- 送出按鈕 -->
        <div>
          <button type="submit" class="btn-primary w-full">送出投稿</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Milkdown } from '@milkdown/vue'

const form = ref({
  title: '',
  type: 'text',
  content: '',
  image_url: '',
  video_url: '',
  audio_url: '',
  nsfw: false,
  language: 'zh',
  source_url: '',
  detail_markdown: '',
  tags_cache: [],
})
const tagsInput = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  // 標籤處理
  form.value.tags_cache = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t.length <= 50)

  // 前端驗證
  if (!form.value.title || !form.value.type || !form.value.content) {
    error.value = '請填寫所有必填欄位'
    return
  }
  if (form.value.type === 'image' && !form.value.image_url) {
    error.value = '請提供圖片連結'
    return
  }
  if (form.value.type === 'video' && !form.value.video_url) {
    error.value = '請提供影片連結'
    return
  }
  if (form.value.type === 'audio' && !form.value.audio_url) {
    error.value = '請提供音訊連結'
    return
  }
  // 送出API（請依實際API路徑調整）
  try {
    // await apiService.post('/api/memes', form.value)
    alert('投稿成功！\n（此為前端示範，請串接API）')
    // 清空表單
    Object.assign(form.value, {
      title: '',
      type: 'text',
      content: '',
      image_url: '',
      video_url: '',
      audio_url: '',
      nsfw: false,
      language: 'zh',
      source_url: '',
      detail_markdown: '',
      tags_cache: [],
    })
    tagsInput.value = ''
  } catch (e) {
    error.value = e.message || '投稿失敗，請稍後再試'
  }
}
</script>

<script>
export default {
  name: 'PostMemesPage',
}
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400;
}
.btn-primary {
  @apply bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition;
}
</style>

<route lang="yaml">
meta:
  title: '投稿迷因'
  login: ''
  admin: false
</route>
