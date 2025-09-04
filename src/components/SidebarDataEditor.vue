<template>
  <div class="sidebar-editor space-y-4">
    <div class="field">
      <label class="block font-semibold mb-2">側邊欄資訊</label>
      <div class="space-y-4">
        <!-- 迷因簡稱 -->

        <label for="short_name">迷因簡稱</label>
        <InputText
          id="short_name"
          v-model="localData.short_name"
          placeholder="例如：梗圖、狗狗"
          maxlength="50"
          class="w-full"
        />

        <!-- 迷因全名 -->

        <label for="long_name">迷因全名</label>
        <InputText
          id="long_name"
          v-model="localData.long_name"
          placeholder="例如：這是什麼梗圖"
          maxlength="100"
          class="w-full"
        />

        <!-- 迷因類別 -->

        <label for="category">迷因類別</label>
        <Dropdown
          id="category"
          v-model="localData.category"
          :options="MEME_CATEGORIES"
          placeholder="選擇類別"
          class="w-full"
          appendTo="body"
        />

        <!-- 別名 -->
        <div>
          <label class="block text-sm font-medium mb-2">別名（AKA/別稱）</label>
          <div class="flex flex-col md:flex-row gap-2">
            <InputText
              v-model="newAlias"
              placeholder="輸入別名..."
              maxlength="50"
              class="flex-1"
              @keydown.enter="addAlias"
            />
            <Button
              type="button"
              icon="pi pi-plus"
              label="新增"
              @click="addAlias"
              :disabled="!newAlias.trim()"
            />
          </div>
          <div
            v-if="localData.aliases && localData.aliases.length"
            class="mt-2 flex flex-wrap gap-2"
          >
            <Chip
              v-for="(alias, index) in localData.aliases"
              :key="index"
              :label="alias"
              removable
              @remove="removeAlias(index)"
            />
          </div>
        </div>

        <!-- 受歡迎程度 -->
        <label for="popularity_level">受歡迎程度</label>
        <Dropdown
          id="popularity_level"
          v-model="localData.popularity_level"
          :options="POPULARITY_LEVELS"
          placeholder="選擇受歡迎程度"
          class="w-full"
          appendTo="body"
        />

        <!-- 網路文化/時代背景 -->
        <label for="cultural_context">網路文化/時代背景</label>
        <Dropdown
          id="cultural_context"
          v-model="localData.cultural_context"
          :options="CULTURAL_CONTEXTS"
          placeholder="選擇網路文化背景"
          class="w-full"
          appendTo="body"
        />

        <!-- 語言 -->

        <label for="languages">語言</label>
        <MultiSelect
          id="languages"
          v-model="localData.languages"
          :options="LANGUAGES"
          placeholder="選擇語言"
          class="w-full"
          appendTo="body"
        />

        <!-- 文化圈 -->

        <label for="cultural_region">文化圈/地區</label>
        <Dropdown
          id="cultural_region"
          v-model="localData.cultural_region"
          :options="CULTURAL_REGIONS"
          placeholder="選擇文化圈"
          class="w-full"
          appendTo="body"
        />

        <!-- 內容分級 -->

        <label for="content_rating">內容分級</label>
        <Dropdown
          id="content_rating"
          v-model="localData.content_rating"
          :options="CONTENT_RATINGS"
          placeholder="選擇分級"
          class="w-full"
          appendTo="body"
        />

        <!-- 版權 -->

        <label for="copyright">版權/授權</label>
        <Dropdown
          id="copyright"
          v-model="localData.copyright"
          :options="COPYRIGHT_TYPES"
          placeholder="選擇版權類型"
          class="w-full"
          appendTo="body"
        />

        <!-- 演變階段 -->
        <label for="evolution_stage">演變階段</label>
        <Dropdown
          id="evolution_stage"
          v-model="localData.evolution_stage"
          :options="EVOLUTION_STAGES"
          placeholder="選擇演變階段"
          class="w-full"
          appendTo="body"
        />

        <!-- 商業化程度 -->
        <label for="commercialization">商業化程度</label>
        <Dropdown
          id="commercialization"
          v-model="localData.commercialization"
          :options="COMMERCIALIZATION_LEVELS"
          placeholder="選擇商業化程度"
          class="w-full"
          appendTo="body"
        />

        <!-- 目標受眾 -->
        <label for="target_audience">目標受眾</label>
        <MultiSelect
          id="target_audience"
          v-model="localData.target_audience"
          :options="TARGET_AUDIENCES"
          placeholder="選擇目標受眾"
          class="w-full"
          appendTo="body"
        />

        <!-- 情感影響 -->
        <label for="emotional_impact">情感影響</label>
        <Dropdown
          id="emotional_impact"
          v-model="localData.emotional_impact"
          :options="EMOTIONAL_IMPACTS"
          placeholder="選擇情感影響"
          class="w-full"
          appendTo="body"
        />

        <!-- 使用情境 -->
        <label for="usage_context">使用情境</label>
        <MultiSelect
          id="usage_context"
          v-model="localData.usage_context"
          :options="USAGE_CONTEXTS"
          placeholder="選擇使用情境"
          class="w-full"
          appendTo="body"
        />

        <!-- 相關趨勢 -->
        <label for="related_trends">相關趨勢/主題標籤</label>
        <div>
          <div class="flex flex-col md:flex-row gap-2">
            <InputText
              v-model="newTrend"
              placeholder="輸入相關趨勢..."
              maxlength="30"
              class="flex-1"
              @keydown.enter="addTrend"
            />
            <Button
              type="button"
              icon="pi pi-plus"
              label="新增"
              @click="addTrend"
              :disabled="!newTrend.trim()"
            />
          </div>
          <div
            v-if="localData.related_trends && localData.related_trends.length"
            class="mt-2 flex flex-wrap gap-2"
          >
            <Chip
              v-for="(trend, index) in localData.related_trends"
              :key="index"
              :label="trend"
              removable
              @remove="removeTrend(index)"
            />
          </div>
        </div>

        <!-- 自訂欄位 -->
        <div>
          <label class="block text-sm font-medium mb-2">自訂欄位</label>
          <div class="flex flex-col md:flex-row gap-2 mb-3">
            <InputText
              v-model="newFieldName"
              placeholder="欄位名稱..."
              maxlength="30"
              class="flex-1"
              @keydown.enter="addCustomField"
            />
            <InputText
              v-model="newFieldValue"
              placeholder="欄位內容..."
              maxlength="100"
              class="flex-1"
              @keydown.enter="addCustomField"
            />
            <Button
              type="button"
              icon="pi pi-plus"
              label="新增"
              @click="addCustomField"
              :disabled="!newFieldName.trim() || !newFieldValue.trim()"
            />
          </div>
          <div
            v-if="localData.custom_fields && localData.custom_fields.length"
            class="space-y-2"
          >
            <div
              v-for="(field, index) in localData.custom_fields"
              :key="index"
              class="flex gap-2 items-center p-2 bg-surface-100 dark:bg-surface-800 rounded"
            >
              <div class="flex-1">
                <strong>{{ field.name }}：</strong>{{ field.value }}
              </div>
              <Button
                type="button"
                icon="pi pi-trash"
                severity="danger"
                text
                @click="removeCustomField(index)"
                class="p-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 即時預覽 -->
    <div class="mt-6">
      <label class="block font-semibold mb-2">預覽</label>
      <div class="border rounded-lg p-4 bg-surface-50 dark:bg-surface-800">
        <div v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Chip from 'primevue/chip'

// 側邊欄資料選項
const MEME_CATEGORIES = [
  '二創',
  '表情符號',
  '網路用語',
  '惡搞',
  '諷刺',
  '影片梗',
  '音樂梗',
  '政治梗',
  '遊戲梗',
  '動漫梗',
  '電影梗',
  '音樂梗',
  '體育梗',
  '新聞梗',
  '廣告梗',
  '商品梗',
  '品牌梗',
  '科技梗',
  '教育梗',
  '生活梗',
  '工作梗',
  '學校梗',
  '交通梗',
  '天氣梗',
  '節日梗',
  '其他',
]

// 受歡迎程度選項
const POPULARITY_LEVELS = ['新興', '熱門', '經典', '過時', '傳奇', '其他']

// 網路文化/時代背景選項
const CULTURAL_CONTEXTS = [
  '2010年代前',
  '2010年代',
  '2020年代初',
  '2020年代中',
  '當代',
  '跨時代',
  '其他',
]

// 演變階段選項
const EVOLUTION_STAGES = [
  '原始形式',
  '演變中',
  '成熟階段',
  '衰退中',
  '經典地位',
  '其他',
]

// 商業化程度選項
const COMMERCIALIZATION_LEVELS = [
  '非商業',
  '輕度商業化',
  '中等商業化',
  '高度商業化',
  '品牌化',
  '其他',
]

// 目標受眾選項
const TARGET_AUDIENCES = [
  '青少年',
  '年輕成人',
  '上班族',
  '學生',
  '銀髮族',
  '家庭主婦/夫',
  '遊戲玩家',
  '動漫迷',
  '音樂愛好者',
  '潮流追隨者',
  '專業人士',
  '大眾',
  '其他',
]

// 情感影響選項
const EMOTIONAL_IMPACTS = [
  '歡樂',
  '感動',
  '共鳴',
  '諷刺',
  '憤怒',
  '恐懼',
  '驚喜',
  '溫馨',
  '懷舊',
  '啟發',
  '其他',
]

// 使用情境選項
const USAGE_CONTEXTS = [
  '娛樂',
  '社交',
  '表達情感',
  '諷刺時事',
  '團體認同',
  '網路文化',
  '工作場合',
  '學術討論',
  '創作靈感',
  '品牌行銷',
  '其他',
]

const LANGUAGES = [
  '繁體中文',
  '簡體中文',
  '台語',
  '客語',
  '粵語',
  '英文',
  '日文',
  '韓文',
  '法文',
  '德文',
  '西班牙文',
  '義大利文',
  '俄文',
  '阿拉伯文',
  '印度文',
  '泰文',
  '越南文',
  '馬來文',
  '印尼文',
  '菲律賓文',
  '葡萄牙文',
  '荷蘭文',
  '瑞典文',
  '挪威文',
  '丹麥文',
  '芬蘭文',
  '希臘文',
  '土耳其文',
  '波蘭文',
  '捷克文',
  '匈牙利文',
  '其他',
]

const CULTURAL_REGIONS = [
  '台灣',
  '中國大陸',
  '香港',
  '澳門',
  '新加坡',
  '馬來西亞',
  '日本',
  '韓國',
  '北韓',
  '泰國',
  '越南',
  '菲律賓',
  '印尼',
  '印度',
  '美國',
  '加拿大',
  '英國',
  '法國',
  '德國',
  '義大利',
  '西班牙',
  '俄羅斯',
  '澳洲',
  '紐西蘭',
  '巴西',
  '阿根廷',
  '墨西哥',
  '以色列',
  '沙烏地阿拉伯',
  '土耳其',
  '埃及',
  '南非',
  '歐美',
  '東亞',
  '東南亞',
  '南亞',
  '中東',
  '非洲',
  '拉丁美洲',
  '其他',
]

const CONTENT_RATINGS = [
  '適合所有年齡',
  '適合18歲以上',
  '衝擊性',
  '血腥',
  '政治敏感',
  '暴力',
  '恐怖',
  '噁心',
  '性暗示',
  '粗俗語言',
  '歧視',
  '仇恨言論',
  '自殘',
  '藥物',
  '酒精',
  '賭博',
  '詐騙',
  '兒童不宜',
  '其他',
]

const COPYRIGHT_TYPES = [
  '不確定',
  'CC0 (公共領域)',
  'CC BY (署名)',
  'CC BY-SA (署名-相同方式分享)',
  'CC BY-NC (署名-非商業)',
  'CC BY-NC-SA (署名-非商業-相同方式分享)',
  'CC BY-ND (署名-禁止改作)',
  'CC BY-NC-ND (署名-非商業-禁止改作)',
  '作者自有',
  '合理使用',
  '商業授權',
  '開源授權',
  'MIT',
  'GPL',
  'Apache',
  '版權所有',
  '已授權',
  '爭議中',
  '其他',
]

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      short_name: '',
      long_name: '',
      category: '二創',
      aliases: [],
      popularity_level: '新興',
      cultural_context: '當代',
      languages: ['繁體中文'],
      cultural_region: '台灣',
      content_rating: '適合所有年齡',
      copyright: '不確定',
      evolution_stage: '原始形式',
      commercialization: '非商業',
      target_audience: [],
      emotional_impact: '歡樂',
      usage_context: [],
      related_trends: [],
      custom_fields: [],
    }),
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 組件狀態
const newAlias = ref('')
const newTrend = ref('')
const newFieldName = ref('')
const newFieldValue = ref('')

// 本地資料
const localData = ref({ ...props.modelValue })

// 同步 props 到 localData
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && typeof newValue === 'object') {
      const currentString = JSON.stringify(localData.value)
      const newString = JSON.stringify(newValue)
      if (newString !== currentString) {
        localData.value = {
          short_name: newValue.short_name || '',
          long_name: newValue.long_name || '',
          category: newValue.category || '二創',
          aliases: Array.isArray(newValue.aliases) ? [...newValue.aliases] : [],
          popularity_level: newValue.popularity_level || '新興',
          cultural_context: newValue.cultural_context || '當代',
          languages: Array.isArray(newValue.languages)
            ? [...newValue.languages]
            : ['繁體中文'],
          cultural_region: newValue.cultural_region || '台灣',
          content_rating: newValue.content_rating || '適合所有年齡',
          copyright: newValue.copyright || '不確定',
          evolution_stage: newValue.evolution_stage || '原始形式',
          commercialization: newValue.commercialization || '非商業',
          target_audience: Array.isArray(newValue.target_audience)
            ? [...newValue.target_audience]
            : [],
          emotional_impact: newValue.emotional_impact || '歡樂',
          usage_context: Array.isArray(newValue.usage_context)
            ? [...newValue.usage_context]
            : [],
          related_trends: Array.isArray(newValue.related_trends)
            ? [...newValue.related_trends]
            : [],
          custom_fields: Array.isArray(newValue.custom_fields)
            ? [...newValue.custom_fields]
            : [],
        }
      }
    }
  },
  { deep: true },
)

// 同步 localData 到 props - 使用防抖優化
let emitTimeout = null
let lastEmittedValue = null

watch(
  () => localData.value,
  (newValue) => {
    // 避免重複發射相同的值
    const stringifiedValue = JSON.stringify(newValue)
    if (stringifiedValue === lastEmittedValue) return

    if (emitTimeout) clearTimeout(emitTimeout)
    emitTimeout = setTimeout(() => {
      lastEmittedValue = stringifiedValue
      emit('update:modelValue', { ...newValue })
    }, 300) // 300ms 防抖
  },
  { deep: true },
)

// 別名處理函數
const addAlias = () => {
  const alias = newAlias.value.trim()
  if (alias && !localData.value.aliases.includes(alias)) {
    localData.value.aliases.push(alias)
    newAlias.value = ''
  }
}

const removeAlias = (index) => {
  localData.value.aliases.splice(index, 1)
}

// 趨勢處理函數
const addTrend = () => {
  const trend = newTrend.value.trim()
  if (trend && !localData.value.related_trends.includes(trend)) {
    localData.value.related_trends.push(trend)
    newTrend.value = ''
  }
}

const removeTrend = (index) => {
  localData.value.related_trends.splice(index, 1)
}

// 自訂欄位處理函數
const addCustomField = () => {
  const name = newFieldName.value.trim()
  const value = newFieldValue.value.trim()

  if (
    name &&
    value &&
    !localData.value.custom_fields.some((field) => field.name === name)
  ) {
    localData.value.custom_fields.push({ name, value })
    newFieldName.value = ''
    newFieldValue.value = ''
  }
}

const removeCustomField = (index) => {
  localData.value.custom_fields.splice(index, 1)
}

// 預覽 HTML 生成 - 使用防抖優化
let previewTimeout = null
const previewHtml = ref('<p class="text-surface-500">無資料</p>')

const updatePreview = () => {
  const data = localData.value
  if (!data || Object.keys(data).length === 0) {
    previewHtml.value = '<p class="text-surface-500">無資料</p>'
    return
  }

  let html = '<div class="sidebar-info">'

  if (data.category) html += `<p><strong>類別：</strong>${data.category}</p>`
  if (data.short_name)
    html += `<p><strong>簡稱：</strong>${data.short_name}</p>`
  if (data.long_name) html += `<p><strong>全名：</strong>${data.long_name}</p>`
  if (data.aliases && data.aliases.length > 0) {
    html += `<p><strong>別名：</strong>${data.aliases.join('、')}</p>`
  }
  if (data.popularity_level)
    html += `<p><strong>受歡迎程度：</strong>${data.popularity_level}</p>`
  if (data.cultural_context)
    html += `<p><strong>網路文化背景：</strong>${data.cultural_context}</p>`
  if (data.languages && data.languages.length > 0) {
    html += `<p><strong>語言：</strong>${data.languages.join('、')}</p>`
  }
  if (data.cultural_region)
    html += `<p><strong>文化圈：</strong>${data.cultural_region}</p>`
  if (data.evolution_stage)
    html += `<p><strong>演變階段：</strong>${data.evolution_stage}</p>`
  if (data.commercialization)
    html += `<p><strong>商業化程度：</strong>${data.commercialization}</p>`
  if (data.target_audience && data.target_audience.length > 0) {
    html += `<p><strong>目標受眾：</strong>${data.target_audience.join('、')}</p>`
  }
  if (data.emotional_impact)
    html += `<p><strong>情感影響：</strong>${data.emotional_impact}</p>`
  if (data.usage_context && data.usage_context.length > 0) {
    html += `<p><strong>使用情境：</strong>${data.usage_context.join('、')}</p>`
  }
  if (data.related_trends && data.related_trends.length > 0) {
    html += `<p><strong>相關趨勢：</strong>${data.related_trends.join('、')}</p>`
  }
  if (data.content_rating)
    html += `<p><strong>內容分級：</strong>${data.content_rating}</p>`
  if (data.copyright) html += `<p><strong>版權：</strong>${data.copyright}</p>`

  // 顯示自訂欄位
  if (data.custom_fields && data.custom_fields.length > 0) {
    data.custom_fields.forEach((field) => {
      html += `<p><strong>${field.name}：</strong>${field.value}</p>`
    })
  }

  html += '</div>'
  previewHtml.value = html
}

// 監視 localData 變化來更新預覽
watch(
  () => localData.value,
  () => {
    if (previewTimeout) clearTimeout(previewTimeout)
    previewTimeout = setTimeout(updatePreview, 100)
  },
  { deep: true },
)

// 組件掛載時初始化預覽
onMounted(() => {
  updatePreview()
})

// 組件卸載時清理資源
onUnmounted(() => {
  if (emitTimeout) clearTimeout(emitTimeout)
  if (previewTimeout) clearTimeout(previewTimeout)
})
</script>
