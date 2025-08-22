<template>
  <Card class="w-full announcement-card" @click="toggleExpanded">
    <template #header>
      <div
        class="h-60 flex items-center justify-center cursor-pointer overflow-hidden rounded-t-lg"
        :class="
          announcement.image
            ? 'bg-gray-100'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100'
        "
      >
        <img
          v-if="announcement.image"
          :src="announcement.image"
          :alt="announcement.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="text-center">
          <i class="pi pi-bullhorn text-4xl text-indigo-500 mb-2"></i>
          <p class="text-gray-600 text-sm">公告</p>
        </div>
      </div>
    </template>
    <template #content>
      <div class="mb-2 flex justify-between items-start">
        <h4 class="mb-1 text-lg font-semibold text-gray-800 line-clamp-2">
          {{ announcement.title }}
        </h4>
        <Tag
          :value="getCategoryLabel(announcement.category)"
          :severity="getCategorySeverity(announcement.category)"
          class="ml-2 flex-shrink-0"
        />
      </div>
      <p class="mb-3 text-gray-600" :class="expanded ? '' : 'line-clamp-3'">
        {{
          expanded
            ? announcement.content
            : getContentPreview(announcement.content)
        }}
      </p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ formatDate(announcement.createdAt) }}</span>
        <div class="flex items-center gap-2">
          <Button
            v-if="announcement.pinned"
            icon="pi pi-thumbtack"
            text
            size="small"
            class="text-orange-500"
            :pt="{ root: { class: 'p-0' } }"
          />
          <Button
            :icon="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            text
            size="small"
            class="text-blue-500"
            :pt="{ root: { class: 'p-0' } }"
            @click.stop="toggleExpanded"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

const props = defineProps({
  announcement: {
    type: Object,
    required: true,
  },
})

const expanded = ref(false)

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

// 取得分類標籤文字
const getCategoryLabel = (category) => {
  const labels = {
    system: '系統',
    activity: '活動',
    update: '更新',
    other: '其他',
  }
  return labels[category] || '其他'
}

// 取得分類標籤樣式
const getCategorySeverity = (category) => {
  const severities = {
    system: 'danger',
    activity: 'success',
    update: 'info',
    other: 'secondary',
  }
  return severities[category] || 'secondary'
}

// 取得內容預覽（限制字數）
const getContentPreview = (content) => {
  if (!content) return ''
  // 移除HTML標籤
  const plainText = content.replace(/<[^>]*>/g, '')
  // 限制在100字以內
  return plainText.length > 100
    ? plainText.substring(0, 100) + '...'
    : plainText
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '今天'
  } else if (diffDays === 2) {
    return '昨天'
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`
  } else {
    return date.toLocaleDateString('zh-TW')
  }
}
</script>

<style scoped>
.announcement-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
