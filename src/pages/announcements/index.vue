<!--
  eslint-disable vue/multi-word-component-names
-->
<template>
  <div class="container mx-auto p-8 space-y-8">
    <div class="text-center mb-6">
      <h1>公告列表</h1>
      <p class="text-surface-600">最新站務與更新公告</p>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>

    <div
      v-else-if="announcements.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <Card
        v-for="a in announcements"
        :key="a.id"
        class="cursor-pointer hover:shadow-md transition-shadow"
        @click="viewAnnouncement(a.id)"
      >
        <template #header>
          <img
            :src="a.image_url || 'https://picsum.photos/600/300'"
            :alt="a.title"
            class="w-full h-44 object-cover rounded-t-lg"
          />
        </template>
        <template #content>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold truncate">{{ a.title }}</h4>
            <Tag
              :value="getTypeLabel(a.type)"
              :severity="getTypeSeverity(a.type)"
            />
          </div>
          <p class="text-sm text-surface-600 line-clamp-2">
            {{ truncate(a.content, 120) }}
          </p>
        </template>
        <template #footer>
          <div class="text-xs text-surface-500">
            {{ formatDate(a.published_at) }}
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-20 text-surface-500">目前沒有公告</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { setPageMeta } from '@/utils/seoUtils'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'
import announcementService from '@/services/announcementService'

const router = useRouter()
const announcements = ref([])
const loading = ref(true)

onMounted(async () => {
  setPageMeta({
    title: '公告列表',
    description: '查看迷因典的最新站務公告與更新事項',
    canonical: `${window.location.origin}/announcements`,
  })

  try {
    const res = await announcementService.getAll({
      status: 'public',
      limit: 30,
    })
    announcements.value = res.data.announcements || res.data.data || []
  } catch {
    announcements.value = []
  } finally {
    loading.value = false
  }
})

const viewAnnouncement = (id) => router.push(`/announcements/${id}`)
const truncate = (t, n) => (!t ? '' : t.length > n ? t.slice(0, n) + '…' : t)
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('zh-TW') : '-')
const getTypeLabel = (type) =>
  ({
    general: '一般公告',
    maintenance: '系統維護',
    update: '功能更新',
    event: '活動通知',
  })[type] || type
const getTypeSeverity = (type) =>
  ({
    general: 'info',
    maintenance: 'warning',
    update: 'success',
    event: 'primary',
  })[type] || 'info'
</script>

<route lang="yaml">
meta:
  title: '公告列表'
  description: '瀏覽迷因典的重要公告、系統維護與功能更新，一次掌握最新動態。'
  login: ''
  admin: false
</route>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
