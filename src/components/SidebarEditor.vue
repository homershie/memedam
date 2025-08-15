<template>
  <div class="sidebar-editor">
    <!-- 編輯器標題 -->
    <div class="editor-header">
      <h3 class="text-lg font-bold text-gray-900 mb-4">側邊欄編輯器</h3>
      <div class="flex items-center space-x-2">
        <Button
          label="預覽"
          icon="pi pi-eye"
          severity="secondary"
          size="small"
          @click="previewSidebar"
        />
        <Button
          label="重置"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          @click="resetSidebar"
        />
        <Button
          label="保存"
          icon="pi pi-check"
          severity="success"
          size="small"
          @click="saveSidebar"
          :loading="saving"
        />
      </div>
    </div>

    <!-- 模板選擇 -->
    <div class="template-selector mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        選擇模板
      </label>
      <Dropdown
        v-model="selectedTemplate"
        :options="templates"
        option-label="name"
        option-value="key"
        placeholder="選擇側邊欄模板"
        class="w-full"
        @change="onTemplateChange"
      />
      <p v-if="currentTemplateDefinition" class="text-sm text-gray-600 mt-1">
        {{ currentTemplateDefinition.description }}
      </p>
    </div>

    <!-- 自定義模板欄位編輯器 -->
    <div v-if="selectedTemplate === 'custom'" class="custom-fields-editor mb-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-md font-semibold text-gray-800">自定義欄位</h4>
        <Button
          label="新增欄位"
          icon="pi pi-plus"
          size="small"
          @click="addCustomField"
        />
      </div>

      <div
        v-if="customFields.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <i class="pi pi-plus-circle text-3xl mb-2"></i>
        <p>點擊「新增欄位」開始自定義側邊欄</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(field, index) in customFields"
          :key="index"
          class="custom-field-item border rounded-lg p-4 bg-gray-50"
        >
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-medium">欄位 {{ index + 1 }}</h5>
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              @click="removeCustomField(index)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                欄位鍵名
              </label>
              <InputText
                v-model="field.key"
                placeholder="例如: title, author"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                顯示標籤
              </label>
              <InputText
                v-model="field.label"
                placeholder="例如: 標題, 作者"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                欄位類型
              </label>
              <Dropdown
                v-model="field.type"
                :options="fieldTypes"
                option-label="label"
                option-value="value"
                placeholder="選擇類型"
                class="w-full"
              />
            </div>

            <div v-if="field.type === 'select'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                選項列表
              </label>
              <InputText
                v-model="field.optionsText"
                placeholder="用逗號分隔，例如: 選項1,選項2,選項3"
                class="w-full"
                @input="updateFieldOptions(field)"
              />
            </div>
          </div>

          <div class="mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              欄位值
            </label>
            <InputText
              v-model="field.value"
              :placeholder="getFieldPlaceholder(field.type)"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 標準模板欄位編輯器 -->
    <div v-else class="standard-fields-editor">
      <div
        v-for="(fieldSchema, fieldName) in currentTemplateDefinition?.schema
          ?.properties"
        :key="fieldName"
        class="field-item mb-4"
      >
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ fieldSchema.title }}
          <span v-if="isRequiredField(fieldName)" class="text-red-500">*</span>
        </label>

        <!-- 文字輸入 -->
        <InputText
          v-if="fieldSchema.type === 'string' && !fieldSchema.enum"
          v-model="formData[fieldName]"
          :placeholder="fieldSchema.description"
          class="w-full"
          :maxlength="fieldSchema.maxLength"
        />

        <!-- 數字輸入 -->
        <InputNumber
          v-else-if="fieldSchema.type === 'number'"
          v-model="formData[fieldName]"
          :placeholder="fieldSchema.description"
          class="w-full"
          :min="fieldSchema.minimum"
          :max="fieldSchema.maximum"
        />

        <!-- 下拉選單 -->
        <Dropdown
          v-else-if="fieldSchema.enum"
          v-model="formData[fieldName]"
          :options="getEnumOptions(fieldSchema)"
          option-label="label"
          option-value="value"
          :placeholder="fieldSchema.description"
          class="w-full"
        />

        <!-- 日期選擇 -->
        <Calendar
          v-else-if="fieldSchema.format === 'date'"
          v-model="formData[fieldName]"
          :placeholder="fieldSchema.description"
          class="w-full"
          date-format="yy-mm-dd"
        />

        <!-- 陣列輸入（多選或標籤） -->
        <div v-else-if="fieldSchema.type === 'array'">
          <!-- 如果有枚舉選項，使用多選下拉 -->
          <Dropdown
            v-if="fieldSchema.items?.enum"
            v-model="formData[fieldName]"
            :options="getEnumOptions(fieldSchema.items)"
            option-label="label"
            option-value="value"
            :placeholder="fieldSchema.description"
            class="w-full"
            multiple
          />
          <!-- 否則使用文字輸入（逗號分隔） -->
          <div v-else>
            <InputText
              :model-value="getArrayAsString(formData[fieldName])"
              @update:model-value="updateArrayFromString(fieldName, $event)"
              :placeholder="fieldSchema.description + ' (用逗號分隔)'"
              class="w-full"
            />
            <small class="text-gray-500">用逗號分隔多個項目</small>
          </div>
        </div>

        <!-- 物件輸入 -->
        <div v-else-if="fieldSchema.type === 'object'" class="object-field">
          <div
            v-for="(propSchema, propName) in fieldSchema.properties"
            :key="propName"
            class="mb-3 pl-4 border-l-2 border-gray-200"
          >
            <label class="block text-sm font-medium text-gray-600 mb-1">
              {{ propSchema.title || propName }}
            </label>

            <!-- 物件屬性的文字輸入 -->
            <InputText
              v-if="propSchema.type === 'string'"
              v-model="formData[fieldName][propName]"
              :placeholder="propSchema.description"
              class="w-full"
              :maxlength="propSchema.maxLength"
            />

            <!-- 物件屬性的數字輸入 -->
            <InputNumber
              v-else-if="propSchema.type === 'number'"
              v-model="formData[fieldName][propName]"
              :placeholder="propSchema.description"
              class="w-full"
              :min="propSchema.minimum"
              :max="propSchema.maximum"
            />
          </div>
        </div>

        <p v-if="fieldSchema.description" class="text-xs text-gray-500 mt-1">
          {{ fieldSchema.description }}
        </p>
      </div>
    </div>

    <!-- 預覽區域 -->
    <div v-if="showPreview" class="preview-section mt-6">
      <h4 class="text-md font-semibold text-gray-800 mb-3">預覽效果</h4>
      <div class="preview-container border rounded-lg p-4 bg-white">
        <div v-html="previewHtml" class="sidebar-preview"></div>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <div v-if="errors.length > 0" class="error-messages mt-4">
      <Message
        v-for="error in errors"
        :key="error"
        severity="error"
        :closable="false"
        class="mb-2"
      >
        {{ error }}
      </Message>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

// PrimeVue 組件
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Message from 'primevue/message'

// 服務
import sidebarService from '@/services/sidebarService.js'

// Props
const props = defineProps({
  memeId: {
    type: String,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

// Emits
const emit = defineEmits(['update', 'save'])

// 響應式數據
const toast = useToast()
const saving = ref(false)
const showPreview = ref(false)
const errors = ref([])

// 模板相關
const templates = ref([])
const selectedTemplate = ref('default')
const currentTemplateDefinition = ref(null)

// 表單數據
const formData = ref({})
const customFields = ref([])

// 欄位類型選項
const fieldTypes = [
  { label: '文字', value: 'text' },
  { label: '數字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '網址', value: 'url' },
  { label: '選項', value: 'select' },
]

// 計算屬性
const isRequiredField = (fieldName) => {
  return currentTemplateDefinition.value?.schema?.required?.includes(fieldName)
}

// 方法
const loadTemplates = async () => {
  try {
    const response = await sidebarService.getTemplates()
    console.log('模板回應:', response)
    templates.value = response.data
  } catch (error) {
    console.error('載入模板失敗:', error)
    console.error('錯誤詳情:', error.response?.data || error.message)

    // 檢查是否是 404 錯誤
    if (error.response?.status === 404) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '側邊欄功能暫時不可用',
        life: 5000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: `載入模板失敗: ${error.response?.data?.message || error.message}`,
        life: 5000,
      })
    }
  }
}

const loadTemplateDefinition = async (templateName) => {
  try {
    const response = await sidebarService.getTemplate(templateName)
    currentTemplateDefinition.value = response.data

    // 初始化表單數據
    if (templateName === 'custom') {
      customFields.value = response.data.defaultData.fields || []
    } else {
      formData.value = { ...response.data.defaultData }
      // 初始化物件和陣列欄位
      initializeFormData()
    }
  } catch (error) {
    console.error('載入模板定義失敗:', error)
  }
}

// 初始化表單資料結構
const initializeFormData = () => {
  if (!currentTemplateDefinition.value?.schema?.properties) return

  // 確保所有欄位都有初始值
  for (const [fieldName, fieldSchema] of Object.entries(
    currentTemplateDefinition.value.schema.properties,
  )) {
    if (formData.value[fieldName] === undefined) {
      if (fieldSchema.type === 'array') {
        formData.value[fieldName] = []
      } else if (fieldSchema.type === 'object') {
        formData.value[fieldName] = {}
        ensureObjectField(fieldName, fieldSchema)
      } else if (fieldSchema.type === 'number') {
        formData.value[fieldName] = fieldSchema.minimum || 0
      } else {
        formData.value[fieldName] = fieldSchema.default || ''
      }
    } else if (fieldSchema.type === 'object') {
      // 確保現有物件有正確結構
      ensureObjectField(fieldName, fieldSchema)
    }
  }
}

const onTemplateChange = async () => {
  await loadTemplateDefinition(selectedTemplate.value)
  emit('update', {
    template: selectedTemplate.value,
    data:
      selectedTemplate.value === 'custom'
        ? { fields: customFields.value }
        : formData.value,
  })
}

const getEnumOptions = (fieldSchema) => {
  return fieldSchema.enum.map((value, index) => ({
    label: fieldSchema.enumNames?.[index] || value,
    value: value,
  }))
}

// 將陣列轉為字串（用於顯示）
const getArrayAsString = (array) => {
  if (!Array.isArray(array)) return ''
  return array.join(', ')
}

// 從字串更新陣列
const updateArrayFromString = (fieldName, value) => {
  if (!value) {
    formData.value[fieldName] = []
    return
  }
  formData.value[fieldName] = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item)
}

// 確保物件欄位有正確的結構
const ensureObjectField = (fieldName, schema) => {
  if (
    !formData.value[fieldName] ||
    typeof formData.value[fieldName] !== 'object'
  ) {
    formData.value[fieldName] = {}
  }

  // 初始化物件屬性
  if (schema.properties) {
    for (const propName of Object.keys(schema.properties)) {
      if (formData.value[fieldName][propName] === undefined) {
        formData.value[fieldName][propName] = ''
      }
    }
  }
}

const getFieldPlaceholder = (type) => {
  const placeholders = {
    text: '輸入文字',
    number: '輸入數字',
    date: '選擇日期',
    url: '輸入網址',
    select: '選擇選項',
  }
  return placeholders[type] || '輸入值'
}

const addCustomField = () => {
  customFields.value.push({
    key: '',
    label: '',
    type: 'text',
    value: '',
    options: [],
    optionsText: '',
  })
}

const removeCustomField = (index) => {
  customFields.value.splice(index, 1)
}

const updateFieldOptions = (field) => {
  if (field.optionsText) {
    field.options = field.optionsText.split(',').map((option) => option.trim())
  } else {
    field.options = []
  }
}

const previewHtml = ref('')

const previewSidebar = async () => {
  try {
    const data =
      selectedTemplate.value === 'custom'
        ? { fields: customFields.value }
        : formData.value

    const response = await sidebarService.previewSidebar({
      template: selectedTemplate.value,
      data,
    })

    previewHtml.value = response.data.renderedHtml
    showPreview.value = true
  } catch (error) {
    console.error('預覽失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '預覽失敗',
      life: 3000,
    })
  }
}

const resetSidebar = async () => {
  try {
    await sidebarService.resetMemeSidebar(props.memeId, selectedTemplate.value)
    await loadTemplateDefinition(selectedTemplate.value)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '側邊欄已重置',
      life: 3000,
    })

    emit('update', {
      template: selectedTemplate.value,
      data:
        selectedTemplate.value === 'custom'
          ? { fields: customFields.value }
          : formData.value,
    })
  } catch (error) {
    console.error('重置失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '重置失敗',
      life: 3000,
    })
  }
}

const saveSidebar = async () => {
  try {
    saving.value = true
    errors.value = []

    const data =
      selectedTemplate.value === 'custom'
        ? { fields: customFields.value }
        : formData.value

    const response = await sidebarService.updateMemeSidebar(props.memeId, {
      template: selectedTemplate.value,
      data,
      schema: currentTemplateDefinition.value?.schema,
    })

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '側邊欄已保存',
      life: 3000,
    })

    emit('save', response.data)
  } catch (error) {
    console.error('保存失敗:', error)

    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '保存失敗',
        life: 3000,
      })
    }
  } finally {
    saving.value = false
  }
}

// 監聽數據變化
watch(
  [formData, customFields],
  () => {
    const data =
      selectedTemplate.value === 'custom'
        ? { fields: customFields.value }
        : formData.value

    emit('update', {
      template: selectedTemplate.value,
      data,
    })
  },
  { deep: true },
)

// 初始化
onMounted(async () => {
  await loadTemplates()
  await loadTemplateDefinition(selectedTemplate.value)

  // 如果有初始數據，載入它
  if (props.initialData.template) {
    selectedTemplate.value = props.initialData.template
    await loadTemplateDefinition(selectedTemplate.value)

    if (props.initialData.data) {
      if (selectedTemplate.value === 'custom') {
        customFields.value = props.initialData.data.fields || []
      } else {
        formData.value = { ...props.initialData.data }
      }
    }
  }
})
</script>

<style scoped>
.sidebar-editor {
  max-width: 800px;
  margin: 0 auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.custom-field-item {
  transition: all 0.2s ease;
}

.custom-field-item:hover {
  background-color: #f8fafc;
}

.sidebar-preview {
  max-width: 100%;
  overflow-x: auto;
}

.sidebar-preview :deep(.sidebar-info-box) {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.sidebar-preview :deep(.info-header) {
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-preview :deep(.info-header h3) {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.sidebar-preview :deep(.info-content) {
  padding: 1rem;
}

.sidebar-preview :deep(.info-table) {
  width: 100%;
  border-collapse: collapse;
}

.sidebar-preview :deep(.info-table td) {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.sidebar-preview :deep(.info-table .label) {
  font-weight: 500;
  color: #6b7280;
  width: 30%;
  padding-right: 1rem;
}

.sidebar-preview :deep(.minimal-item) {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.sidebar-preview :deep(.minimal-item:last-child) {
  border-bottom: none;
}
</style>
