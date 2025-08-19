<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">意見管理</h1>
      <div class="flex space-x-2">
        <Dropdown
          v-model="statusFilter"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="全部狀態"
          class="w-40"
        />
        <Dropdown
          v-model="categoryFilter"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="全部分類"
          class="w-40"
        />
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <!-- 意見列表 -->
    <div v-else-if="feedbacks.length > 0" class="space-y-4">
      <Card v-for="feedback in feedbacks" :key="feedback._id" class="mb-4">
        <template #content>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold">{{ feedback.title }}</h3>
              <p class="text-gray-600">
                {{ feedback.userId?.username || '未知使用者' }} ({{
                  feedback.email
                }})
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <Tag
                  :value="feedback.categoryText"
                  :severity="getCategorySeverity(feedback.category)"
                />
                <p class="text-sm text-gray-500">
                  {{ formatDate(feedback.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Tag
                :value="feedback.statusText"
                :severity="getStatusSeverity(feedback.status)"
              />
              <Button
                @click="toggleDetails(feedback._id)"
                text
                :label="
                  expandedDetails.includes(feedback._id) ? '收起' : '詳情'
                "
                icon="pi pi-eye"
              />
            </div>
          </div>

          <div v-if="expandedDetails.includes(feedback._id)" class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">訊息內容：</h4>
              <p class="text-gray-800 whitespace-pre-wrap">
                {{ feedback.message }}
              </p>
            </div>

            <div
              v-if="feedback.adminResponse"
              class="bg-surface-100 p-4 rounded-md dark:bg-surface-800"
            >
              <h4 class="font-medium text-gray-700 mb-2">管理員回覆：</h4>
              <p class="text-gray-800 whitespace-pre-wrap">
                {{ feedback.adminResponse }}
              </p>
              <p class="text-sm text-gray-500 mt-2">
                回覆時間：{{ formatDate(feedback.respondedAt) }}
              </p>
            </div>

            <div class="flex space-x-2">
              <Dropdown
                v-model="feedback.status"
                :options="statusUpdateOptions"
                optionLabel="label"
                optionValue="value"
                @change="updateStatus(feedback._id, feedback.status)"
                class="w-40"
              />
              <Button
                @click="showResponseDialog(feedback)"
                label="回覆"
                icon="pi pi-reply"
                size="small"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 分頁 -->
      <Paginator
        v-if="pagination.total > 1"
        :first="(pagination.current - 1) * 20"
        :rows="20"
        :totalRecords="feedbacks.length > 0 ? pagination.total * 20 : 0"
        @page="onPageChange"
        class="flex justify-center"
      />
    </div>

    <!-- 無資料 -->
    <div v-else class="text-center py-8 text-gray-500">目前沒有意見資料</div>

    <!-- 回覆對話框 -->
    <Dialog
      v-model:visible="showResponseModal"
      modal
      header="回覆意見"
      :style="{ width: '500px' }"
    >
      <Textarea
        v-model="responseText"
        rows="4"
        placeholder="請輸入您的回覆..."
        class="w-full"
      />
      <template #footer>
        <Button @click="showResponseModal = false" label="取消" text />
        <Button
          @click="submitResponse"
          :disabled="!responseText.trim()"
          label="提交回覆"
          icon="pi pi-check"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminFeedbacksPage',
})

import { ref, reactive, onMounted, watch } from 'vue'
import feedbackService from '../../services/feedbackService.js'

const feedbacks = ref([])
const loading = ref(false)
const statusFilter = ref('')
const categoryFilter = ref('')
const expandedDetails = ref([])
const showResponseModal = ref(false)
const responseText = ref('')
const selectedFeedback = ref(null)

const pagination = reactive({
  current: 1,
  total: 1,
  hasNext: false,
  hasPrev: false,
})

// 狀態選項（包含全部選項，用於篩選）
const statusOptions = [
  { label: '全部狀態', value: '' },
  { label: '待處理', value: 'pending' },
  { label: '處理中', value: 'in_progress' },
  { label: '已解決', value: 'resolved' },
  { label: '已關閉', value: 'closed' },
]

// 狀態選項（不包含全部選項，用於狀態更新）
const statusUpdateOptions = [
  { label: '待處理', value: 'pending' },
  { label: '處理中', value: 'in_progress' },
  { label: '已解決', value: 'resolved' },
  { label: '已關閉', value: 'closed' },
]

// 分類選項
const categoryOptions = [
  { label: '全部分類', value: '' },
  { label: '建議', value: 'suggestion' },
  { label: '錯誤回報', value: 'bug' },
  { label: '內容問題', value: 'content' },
  { label: '功能請求', value: 'feature' },
  { label: '其他', value: 'other' },
]

const loadFeedbacks = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      limit: 20,
    }

    // 處理篩選值，將「全部」相關的字串轉換為空字串
    const normalizeFilterValue = (value) => {
      if (!value || value.trim() === '') return ''
      const v = String(value).trim()
      if (v === '全部狀態' || v === '全部分類' || v === '全部') return ''
      return v
    }

    const statusValue = normalizeFilterValue(statusFilter.value)
    const categoryValue = normalizeFilterValue(categoryFilter.value)

    // 只有非空值才添加到參數中（參考 memes.vue 的實作）
    if (statusValue !== '') {
      params.status = statusValue
    }
    if (categoryValue !== '') {
      params.category = categoryValue
    }

    const response = await feedbackService.getFeedbacks(params)
    feedbacks.value = response.data
    Object.assign(pagination, response.pagination)
  } catch (error) {
    console.error('載入意見失敗:', error)
  } finally {
    loading.value = false
  }
}

const onPageChange = (event) => {
  pagination.current = Math.floor(event.first / 20) + 1
  loadFeedbacks()
}

const updateStatus = async (id, status) => {
  try {
    await feedbackService.updateFeedbackStatus(id, { status })
    // 重新載入資料
    loadFeedbacks()
  } catch (error) {
    console.error('更新狀態失敗:', error)
  }
}

const toggleDetails = (id) => {
  const index = expandedDetails.value.indexOf(id)
  if (index > -1) {
    expandedDetails.value.splice(index, 1)
  } else {
    expandedDetails.value.push(id)
  }
}

const showResponseDialog = (feedback) => {
  selectedFeedback.value = feedback
  responseText.value = feedback.adminResponse || ''
  showResponseModal.value = true
}

const submitResponse = async () => {
  if (!selectedFeedback.value || !responseText.value.trim()) return

  try {
    await feedbackService.updateFeedbackStatus(selectedFeedback.value._id, {
      adminResponse: responseText.value.trim(),
    })
    showResponseModal.value = false
    responseText.value = ''
    selectedFeedback.value = null
    loadFeedbacks()
  } catch (error) {
    console.error('提交回覆失敗:', error)
  }
}

const getStatusSeverity = (status) => {
  const severities = {
    pending: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'secondary',
  }
  return severities[status] || 'warning'
}

const getCategorySeverity = (category) => {
  const severities = {
    suggestion: 'info',
    bug: 'danger',
    content: 'warning',
    feature: 'primary',
    other: 'secondary',
  }
  return severities[category] || 'secondary'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-TW')
}

// 監聽篩選變化
watch([statusFilter, categoryFilter], () => {
  pagination.current = 1
  loadFeedbacks()
})

onMounted(() => {
  loadFeedbacks()
})
</script>

<route lang="yaml">
meta:
  layout: admin
  title: '意見管理'
  admin: true
</route>
