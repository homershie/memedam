<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">意見管理</h1>
      <div class="flex space-x-2">
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">全部狀態</option>
          <option value="pending">待處理</option>
          <option value="in_progress">處理中</option>
          <option value="resolved">已解決</option>
          <option value="closed">已關閉</option>
        </select>
        <select
          v-model="categoryFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">全部分類</option>
          <option value="suggestion">建議</option>
          <option value="bug">錯誤回報</option>
          <option value="content">內容問題</option>
          <option value="feature">功能請求</option>
          <option value="other">其他</option>
        </select>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- 意見列表 -->
    <div v-else-if="feedbacks.length > 0" class="space-y-4">
      <div
        v-for="feedback in feedbacks"
        :key="feedback._id"
        class="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold">{{ feedback.title }}</h3>
            <p class="text-gray-600">
              {{ feedback.userId?.username || '未知使用者' }} ({{
                feedback.email
              }})
            </p>
            <div class="flex items-center space-x-2 mt-1">
              <span
                :class="getCategoryClass(feedback.category)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ feedback.categoryText }}
              </span>
              <p class="text-sm text-gray-500">
                {{ formatDate(feedback.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="getStatusClass(feedback.status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ feedback.statusText }}
            </span>
            <button
              @click="toggleDetails(feedback._id)"
              class="text-blue-600 hover:text-blue-800"
            >
              {{ expandedDetails.includes(feedback._id) ? '收起' : '詳情' }}
            </button>
          </div>
        </div>

        <div v-if="expandedDetails.includes(feedback._id)" class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-700 mb-2">訊息內容：</h4>
            <p class="text-gray-800 whitespace-pre-wrap">
              {{ feedback.message }}
            </p>
          </div>

          <div v-if="feedback.adminResponse" class="bg-gray-50 p-4 rounded-md">
            <h4 class="font-medium text-gray-700 mb-2">管理員回覆：</h4>
            <p class="text-gray-800 whitespace-pre-wrap">
              {{ feedback.adminResponse }}
            </p>
            <p class="text-sm text-gray-500 mt-2">
              回覆時間：{{ formatDate(feedback.respondedAt) }}
            </p>
          </div>

          <div class="flex space-x-2">
            <select
              v-model="feedback.status"
              @change="updateStatus(feedback._id, feedback.status)"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="pending">待處理</option>
              <option value="in_progress">處理中</option>
              <option value="resolved">已解決</option>
              <option value="closed">已關閉</option>
            </select>
            <button
              @click="showResponseDialog(feedback)"
              class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              回覆
            </button>
          </div>
        </div>
      </div>

      <!-- 分頁 -->
      <div v-if="pagination.total > 1" class="flex justify-center space-x-2">
        <button
          @click="changePage(pagination.current - 1)"
          :disabled="!pagination.hasPrev"
          class="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一頁
        </button>
        <span class="px-3 py-2"
          >{{ pagination.current }} / {{ pagination.total }}</span
        >
        <button
          @click="changePage(pagination.current + 1)"
          :disabled="!pagination.hasNext"
          class="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一頁
        </button>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-else class="text-center py-8 text-gray-500">目前沒有意見資料</div>

    <!-- 回覆對話框 -->
    <div
      v-if="showResponseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">回覆意見</h3>
        <textarea
          v-model="responseText"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="請輸入您的回覆..."
        ></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="showResponseModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md"
          >
            取消
          </button>
          <button
            @click="submitResponse"
            :disabled="!responseText.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            提交回覆
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import feedbackService from '../../services/feedbackService.js'

export default {
  name: 'AdminFeedbacksPage',
  setup() {
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

    const loadFeedbacks = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.current,
          limit: 20,
        }
        if (statusFilter.value) {
          params.status = statusFilter.value
        }
        if (categoryFilter.value) {
          params.category = categoryFilter.value
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

    const changePage = (page) => {
      pagination.current = page
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

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || classes.pending
    }

    const getCategoryClass = (category) => {
      const classes = {
        suggestion: 'bg-purple-100 text-purple-800',
        bug: 'bg-red-100 text-red-800',
        content: 'bg-orange-100 text-orange-800',
        feature: 'bg-indigo-100 text-indigo-800',
        other: 'bg-gray-100 text-gray-800',
      }
      return classes[category] || classes.other
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

    return {
      feedbacks,
      loading,
      statusFilter,
      categoryFilter,
      expandedDetails,
      showResponseModal,
      responseText,
      pagination,
      changePage,
      updateStatus,
      toggleDetails,
      showResponseDialog,
      submitResponse,
      getStatusClass,
      getCategoryClass,
      formatDate,
    }
  },
}
</script>

<route lang="yaml">
meta:
  title: '意見管理'
  login: true
  admin: true
</route>
