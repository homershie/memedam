<template>
  <Dialog
    v-model:visible="dialogVisible"
    :style="{ width: '500px' }"
    header="檢舉內容"
    :modal="true"
    :closable="true"
    @hide="handleClose"
  >
    <div class="flex flex-col gap-4">
      <!-- 檢舉原因選擇 -->
      <div>
        <label for="reason" class="block font-medium mb-2">檢舉原因 *</label>
        <Dropdown
          id="reason"
          v-model="reportData.reason"
          :options="reportReasons"
          optionLabel="label"
          optionValue="value"
          placeholder="請選擇檢舉原因"
          class="w-full"
          :class="{ 'p-invalid': submitted && !reportData.reason }"
        />
        <small v-if="submitted && !reportData.reason" class="text-red-500">
          請選擇檢舉原因
        </small>
      </div>

      <!-- 詳細描述 -->
      <div>
        <label for="description" class="block font-medium mb-2">詳細描述</label>
        <Textarea
          id="description"
          v-model="reportData.description"
          rows="4"
          placeholder="請詳細描述檢舉原因（選填）"
          class="w-full"
          :maxlength="1000"
          :autoResize="true"
        />
        <small class="text-gray-500">
          {{ reportData.description?.length || 0 }}/1000 字元
        </small>
      </div>

      <!-- 檢舉目標資訊 -->
      <div v-if="targetInfo" class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <h4 class="font-medium mb-2">檢舉目標</h4>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>類型：</strong>{{ getTargetTypeLabel(targetInfo.type) }}
          </p>
          <p v-if="targetInfo.title">
            <strong>標題：</strong>{{ targetInfo.title }}
          </p>
          <p v-if="targetInfo.author">
            <strong>作者：</strong>{{ targetInfo.author }}
          </p>
        </div>
      </div>

      <!-- 已檢舉狀態 -->
      <div
        v-if="isAlreadyReported"
        class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-info-circle text-blue-500"></i>
          <span class="text-blue-700 dark:text-blue-300"
            >您已經檢舉過此內容</span
          >
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="取消" icon="pi pi-times" text @click="handleClose" />
        <Button
          label="提交檢舉"
          icon="pi pi-flag"
          :loading="loading"
          :disabled="isAlreadyReported"
          @click="submitReport"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import reportService from '@/services/reportService'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  targetType: {
    type: String,
    required: true,
    validator: (value) => ['meme', 'comment', 'user'].includes(value),
  },
  targetId: {
    type: String,
    required: true,
  },
  targetInfo: {
    type: Object,
    default: () => ({}),
  },
})

// Emits
const emit = defineEmits(['update:visible', 'submitted'])

// 計算屬性來處理 visible 的雙向綁定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 響應式數據
const toast = useToast()
const loading = ref(false)
const submitted = ref(false)
const isAlreadyReported = ref(false)
const reportOptions = ref({
  reasons: [],
  statuses: [],
  actions: [],
})

const reportData = ref({
  target_type: props.targetType,
  target_id: props.targetId,
  reason: '',
  description: '',
})

// 檢舉原因選項（預設值，會從 API 獲取）
const reportReasons = computed(() => {
  if (reportOptions.value.reasons.length > 0) {
    return reportOptions.value.reasons
  }

  // 預設選項
  return [
    { value: 'inappropriate', label: '不當內容' },
    { value: 'hate_speech', label: '仇恨言論' },
    { value: 'spam', label: '垃圾訊息' },
    { value: 'copyright', label: '版權問題' },
    { value: 'other', label: '其他' },
  ]
})

// 監聽 props 變化
watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      await loadReportOptions()
      await checkAlreadyReported()
    }
  },
)

watch(
  () => props.targetId,
  (newValue) => {
    reportData.value.target_id = newValue
  },
)

watch(
  () => props.targetType,
  (newValue) => {
    reportData.value.target_type = newValue
  },
)

// 載入檢舉選項
const loadReportOptions = async () => {
  try {
    const response = await reportService.getOptions()
    if (response.data) {
      reportOptions.value = response.data
    }
  } catch (error) {
    console.error('載入檢舉選項失敗:', error)
    // 使用預設選項
  }
}

// 檢查是否已檢舉
const checkAlreadyReported = async () => {
  try {
    // 這裡可以檢查用戶是否已經檢舉過此內容
    // 由於後端會返回 409 錯誤，我們可以在提交時處理
    isAlreadyReported.value = false
  } catch (error) {
    console.error('檢查檢舉狀態失敗:', error)
  }
}

// 提交檢舉
const submitReport = async () => {
  submitted.value = true

  if (!reportData.value.reason) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請選擇檢舉原因',
      life: 3000,
    })
    return
  }

  loading.value = true
  try {
    await reportService.create(reportData.value)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '檢舉已提交，我們會盡快處理',
      life: 3000,
    })

    emit('submitted', reportData.value)
    handleClose()
  } catch (error) {
    console.error('提交檢舉失敗:', error)

    if (error.response?.status === 409) {
      toast.add({
        severity: 'warn',
        summary: '已檢舉',
        detail: '您已經檢舉過此內容',
        life: 3000,
      })
      isAlreadyReported.value = true
    } else if (error.response?.status === 429) {
      toast.add({
        severity: 'error',
        summary: '檢舉頻率過高',
        detail: '請稍後再試',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: error.response?.data?.message || '提交檢舉失敗，請稍後重試',
        life: 3000,
      })
    }
  } finally {
    loading.value = false
  }
}

// 關閉對話框
const handleClose = () => {
  submitted.value = false
  loading.value = false
  isAlreadyReported.value = false
  reportData.value = {
    target_type: props.targetType,
    target_id: props.targetId,
    reason: '',
    description: '',
  }
  emit('update:visible', false)
}

// 工具函數
const getTargetTypeLabel = (type) => {
  const typeMap = {
    meme: '迷因',
    comment: '留言',
    user: '用戶',
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.p-invalid {
  border-color: #f56565;
}

.p-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(245, 101, 101, 0.25);
}
</style>
