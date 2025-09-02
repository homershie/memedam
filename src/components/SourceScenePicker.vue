<template>
  <div class="source-scene-picker">
    <!-- Source 選擇器 -->
    <div class="field">
      <label class="block font-semibold mb-2">
        選擇來源作品 <span class="text-primary-500">*</span>
      </label>

      <div class="flex gap-2">
        <AutoComplete
          v-model="sourceSearchText"
          :suggestions="sourceSuggestions"
          @complete="searchSources"
          @item-select="selectSource"
          optionLabel="display"
          placeholder="搜尋作品名稱..."
          class="w-80"
          :minLength="2"
          :delay="300"
          appendTo="body"
          :dropdown="false"
          :forceSelection="false"
          fluid
        >
          <template #option="slotProps">
            <div class="source-option">
              <div class="font-semibold">{{ slotProps.option.title }}</div>
              <div class="text-sm text-surface-500">
                <span v-if="slotProps.option.year"
                  >{{ slotProps.option.year }}年</span
                >
                <span v-if="slotProps.option.type" class="ml-2">
                  {{ getTypeLabel(slotProps.option.type) }}
                </span>
              </div>
            </div>
          </template>
        </AutoComplete>

        <Button
          type="button"
          icon="pi pi-plus"
          label="新增來源"
          @click="showCreateSourceDialog = true"
        />
      </div>

      <!-- 已選擇的來源顯示 -->
      <div
        v-if="selectedSource"
        class="mt-2 p-3 bg-surface-100 dark:bg-surface-800 rounded"
      >
        <div class="flex items-center justify-between">
          <div>
            <span class="font-semibold">{{ selectedSource.title }}</span>
            <span v-if="selectedSource.year" class="text-surface-500 ml-2">
              ({{ selectedSource.year }})
            </span>
          </div>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="clearSource"
          />
        </div>
      </div>

      <Message
        v-if="sourceError"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ sourceError }}
      </Message>
    </div>

    <!-- Scene 選擇器（只在選擇了 Source 後顯示） -->
    <div v-if="selectedSource" class="field mt-4">
      <label class="block font-semibold mb-2">
        選擇場景 <span class="text-surface-500">（選填）</span>
      </label>

      <div class="flex gap-2">
        <AutoComplete
          v-model="sceneSearchText"
          :suggestions="sceneSuggestions"
          @complete="searchScenes"
          @item-select="selectScene"
          optionLabel="display"
          placeholder="搜尋場景..."
          class="flex-1"
          :delay="300"
          appendTo="body"
          :dropdown="true"
          :forceSelection="false"
        >
          <template #option="slotProps">
            <div class="scene-option">
              <div v-if="slotProps.option.title" class="font-semibold">
                {{ slotProps.option.title }}
              </div>
              <div
                v-if="slotProps.option.quote"
                class="text-sm italic text-surface-600"
              >
                "{{ slotProps.option.quote }}"
              </div>
              <div
                v-if="slotProps.option.start_time"
                class="text-sm text-surface-500"
              >
                時間：{{ formatTime(slotProps.option.start_time) }}
                <span v-if="slotProps.option.end_time">
                  - {{ formatTime(slotProps.option.end_time) }}
                </span>
              </div>
            </div>
          </template>
        </AutoComplete>

        <Button
          type="button"
          icon="pi pi-plus"
          label="新增場景"
          @click="showCreateSceneDialog = true"
          severity="secondary"
        />
      </div>

      <!-- 已選擇的場景顯示 -->
      <div
        v-if="selectedScene"
        class="mt-2 p-3 bg-surface-100 dark:bg-surface-800 rounded"
      >
        <div class="flex items-center justify-between">
          <div>
            <div v-if="selectedScene.title" class="font-semibold">
              {{ selectedScene.title }}
            </div>
            <div
              v-if="selectedScene.quote"
              class="text-sm italic text-surface-600"
            >
              "{{ selectedScene.quote }}"
            </div>
            <div
              v-if="selectedScene.start_time"
              class="text-sm text-surface-500"
            >
              時間：{{ formatTime(selectedScene.start_time) }}
            </div>
          </div>
          <Button
            icon="pi pi-times"
            severity="secondary"
            text
            rounded
            @click="clearScene"
          />
        </div>
      </div>
    </div>

    <!-- 新增來源對話框 -->
    <Dialog
      v-model:visible="showCreateSourceDialog"
      modal
      header="新增來源作品"
      :style="{ width: '720px' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="space-y-4">
        <!-- 類型 -->
        <div class="field">
          <label for="newSourceType" class="block font-semibold mb-2">
            類型 <span class="text-primary-500">*</span>
          </label>
          <Dropdown
            id="newSourceType"
            v-model="newSource.type"
            :options="sourceTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇類型"
            class="w-full"
            appendTo="body"
          />
        </div>

        <!-- 標題 -->
        <div class="field">
          <label for="newSourceTitle" class="block font-semibold mb-2">
            標題 <span class="text-primary-500">*</span>
          </label>
          <InputText
            id="newSourceTitle"
            v-model="newSource.title"
            placeholder="輸入作品標題..."
            class="w-full"
          />
        </div>

        <!-- Slug -->
        <div class="field">
          <label for="newSourceSlug" class="block font-semibold mb-2">
            網址代稱 (Slug)
          </label>
          <div class="flex gap-2">
            <InputText
              id="newSourceSlug"
              v-model="newSource.slug"
              placeholder="自動產生或手動輸入..."
              class="flex-1"
              :class="{ 'p-invalid': newSourceSlugError }"
              @input="onNewSourceSlugInput"
              @blur="checkNewSourceSlugAvailable"
            />
            <div v-if="newSourceSlugChecking" class="flex items-center px-3">
              <i class="pi pi-spin pi-spinner text-primary-500"></i>
            </div>
            <div
              v-else-if="newSource.slug && newSourceSlugOk"
              class="flex items-center px-3"
            >
              <i class="pi pi-check-circle text-green-500"></i>
            </div>
            <div
              v-else-if="newSource.slug && !newSourceSlugOk"
              class="flex items-center px-3"
            >
              <i class="pi pi-times-circle text-red-500"></i>
            </div>
          </div>
          <Message
            v-if="newSourceSlugError"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ newSourceSlugError }}
          </Message>
          <small class="text-surface-500">
            留空將自動產生。只能使用小寫字母、數字和連字號
          </small>
        </div>

        <!-- 別名 -->
        <div class="field">
          <label class="block font-semibold mb-2">別名/其他譯名</label>
          <div class="space-y-2">
            <div
              v-for="(title, index) in newSource.alt_titles"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="newSource.alt_titles[index]"
                placeholder="輸入別名..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeAltTitle(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增別名"
              severity="secondary"
              size="small"
              @click="addAltTitle"
            />
          </div>
        </div>

        <!-- 縮圖 -->
        <div class="field">
          <label class="block font-semibold mb-2">縮圖/海報</label>
          <div class="space-y-2">
            <div
              v-for="(thumb, index) in newSource.thumbnails"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="newSource.thumbnails[index]"
                placeholder="圖片 URL"
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeThumbnail(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增縮圖"
              severity="secondary"
              size="small"
              @click="addThumbnail"
            />
          </div>
        </div>

        <!-- 年份 / 國家 -->
        <div class="field">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="newSourceYear" class="block font-semibold mb-2">
                年份
              </label>
              <InputNumber
                id="newSourceYear"
                v-model="newSource.year"
                placeholder="例如：2024"
                class="w-full"
                :min="1800"
                :max="new Date().getFullYear() + 10"
                :useGrouping="false"
              />
            </div>
            <div>
              <label
                for="newSourceOriginCountry"
                class="block font-semibold mb-2"
              >
                來源國家/地區
              </label>
              <Dropdown
                id="newSourceOriginCountry"
                v-model="newSource.origin_country"
                :options="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="選擇國家/地區"
                class="w-full"
                appendTo="body"
                :filter="true"
                filterPlaceholder="搜尋國家..."
              />
            </div>
          </div>
        </div>

        <!-- 簡介 -->
        <div class="field">
          <label for="newSourceSynopsis" class="block font-semibold mb-2">
            簡介
          </label>
          <Textarea
            id="newSourceSynopsis"
            v-model="newSource.synopsis"
            placeholder="簡單描述這個作品..."
            rows="3"
            class="w-full"
          />
        </div>

        <!-- 背景說明 -->
        <div class="field">
          <label for="newSourceContext" class="block font-semibold mb-2">
            背景/補充說明
          </label>
          <Textarea
            id="newSourceContext"
            v-model="newSource.context"
            placeholder="與作品相關的背景、爭議或影響..."
            rows="3"
            class="w-full"
          />
        </div>

        <!-- 創作者 -->
        <div class="field">
          <label class="block font-semibold mb-2">創作者</label>
          <div class="space-y-2">
            <div
              v-for="(creator, index) in newSource.creators"
              :key="index"
              class="grid grid-cols-2 gap-2 items-start"
            >
              <InputText
                v-model="creator.role"
                placeholder="角色（導演、演員...）"
              />
              <div class="flex gap-2">
                <InputText
                  v-model="creator.name"
                  placeholder="姓名"
                  class="flex-1"
                />
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  text
                  @click="removeCreator(index)"
                />
              </div>
            </div>
            <Button
              icon="pi pi-plus"
              label="新增創作者"
              severity="secondary"
              size="small"
              @click="addCreator"
            />
          </div>
        </div>

        <!-- 授權資訊 -->
        <div class="field">
          <label class="block font-semibold mb-2">授權</label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Dropdown
                v-model="newSource.license.type"
                :options="licenseTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="選擇授權類型"
                class="w-full"
                appendTo="body"
              />
            </div>
            <div>
              <InputText
                v-model="newSource.license.notes"
                placeholder="授權說明（選填）"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- 外部連結 -->
        <div class="field">
          <label class="block font-semibold mb-2">外部連結</label>
          <div class="space-y-2">
            <div
              v-for="(link, index) in newSource.links"
              :key="index"
              class="grid grid-cols-2 gap-2 items-start"
            >
              <InputText
                v-model="link.label"
                placeholder="標籤（IMDb、官網...）"
              />
              <div class="flex gap-2">
                <InputText
                  v-model="link.url"
                  placeholder="https://..."
                  class="flex-1"
                />
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  text
                  @click="removeLink(index)"
                />
              </div>
            </div>
            <Button
              icon="pi pi-plus"
              label="新增連結"
              severity="secondary"
              size="small"
              @click="addLink"
            />
          </div>
        </div>

        <!-- 標籤 -->
        <div class="field">
          <label class="block font-semibold mb-2">標籤</label>
          <div class="space-y-2">
            <div
              v-for="(tag, index) in newSource.tags"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="newSource.tags[index]"
                placeholder="輸入標籤..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeTag(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增標籤"
              severity="secondary"
              size="small"
              @click="addTag"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          @click="showCreateSourceDialog = false"
          severity="secondary"
        />
        <Button
          label="建立"
          icon="pi pi-check"
          @click="createSource"
          :loading="creatingSource"
        />
      </template>
    </Dialog>

    <!-- 新增場景對話框 -->
    <Dialog
      v-model:visible="showCreateSceneDialog"
      modal
      header="新增場景"
      :style="{ width: '500px' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="space-y-4">
        <!-- 標題 -->
        <div class="field">
          <label for="newSceneTitle" class="block font-semibold mb-2">
            場景標題 <span class="text-primary-500">*</span>
          </label>
          <InputText
            id="newSceneTitle"
            v-model="newScene.title"
            placeholder="描述這個場景..."
            class="w-full"
            :class="{ 'p-invalid': !newScene.title }"
          />
        </div>

        <!-- 台詞/引言 -->
        <div class="field">
          <label for="newSceneQuote" class="block font-semibold mb-2">
            台詞/引言
          </label>
          <Textarea
            id="newSceneQuote"
            v-model="newScene.quote"
            placeholder="這個場景的經典台詞或文字..."
            rows="2"
            class="w-full"
          />
        </div>

        <!-- 開始時間 -->
        <div class="field">
          <label for="newSceneStartTime" class="block font-semibold mb-2">
            開始時間
          </label>
          <TimeInput
            id="newSceneStartTime"
            v-model="newScene.start_time"
            placeholder="設定開始時間"
          />
          <small class="text-surface-500"> 選填，場景在影片中的開始時間 </small>
        </div>

        <!-- 結束時間 -->
        <div class="field">
          <label for="newSceneEndTime" class="block font-semibold mb-2">
            結束時間
          </label>
          <TimeInput
            id="newSceneEndTime"
            v-model="newScene.end_time"
            placeholder="設定結束時間"
          />
          <small class="text-surface-500"> 選填，場景在影片中的結束時間 </small>
        </div>

        <!-- 截圖連結 -->
        <div class="field">
          <label for="newSceneImages" class="block font-semibold mb-2">
            截圖連結
          </label>
          <div class="space-y-2">
            <div
              v-for="(image, index) in newScene.images"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="newScene.images[index]"
                placeholder="圖片網址..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeSceneImage(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增截圖"
              severity="secondary"
              size="small"
              @click="addSceneImage"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          @click="showCreateSceneDialog = false"
          severity="secondary"
        />
        <Button
          label="建立"
          icon="pi pi-check"
          @click="createScene"
          :loading="creatingScene"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import sourceService from '@/services/sourceService'
import sceneService from '@/services/sceneService'
import { slugify, validateSlug, isReservedSlug } from '@/utils/slugify'

// PrimeVue 組件
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import TimeInput from './TimeInput.vue'

const props = defineProps({
  modelValue: Object, // { source_id, scene_id }
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

// 狀態
const sourceSearchText = ref('')
const sourceSuggestions = ref([])
const selectedSource = ref(null)
const sourceError = ref('')

const sceneSearchText = ref('')
const sceneSuggestions = ref([])
const selectedScene = ref(null)

// 對話框狀態
const showCreateSourceDialog = ref(false)
const showCreateSceneDialog = ref(false)
const creatingSource = ref(false)
const creatingScene = ref(false)

// 新增來源表單
const newSource = ref({
  type: 'video',
  title: '',
  slug: '',
  year: null,
  origin_country: '',
  synopsis: '',
  context: '',
  alt_titles: [],
  creators: [],
  license: { type: null, notes: '' },
  links: [],
  thumbnails: [],
  tags: [],
})

// Slug 驗證狀態
const newSourceSlugOk = ref(true)
const newSourceSlugError = ref('')
const newSourceSlugChecking = ref(false)
let newSourceSlugCheckTimer = null

// 新增場景表單
const newScene = ref({
  title: '',
  quote: '',
  start_time: null,
  end_time: null,
  images: [],
})

// 來源類型選項（需與後端 enum 對應）
const sourceTypeOptions = [
  { label: '影片', value: 'video' },
  { label: '電影', value: 'film' },
  { label: '電視', value: 'tv' },
  { label: '廣告', value: 'ad' },
  { label: '網路', value: 'web' },
  { label: '文章', value: 'article' },
  { label: '音樂', value: 'music' },
  { label: '廣播', value: 'broadcast' },
  { label: 'Podcast', value: 'podcast' },
  { label: '遊戲', value: 'game' },
  { label: '動畫', value: 'anime' },
  { label: '漫畫', value: 'comic' },
  { label: '事件', value: 'event' },
  { label: '其他', value: 'other' },
]

// 授權選項（對應後端 enum）
const licenseTypeOptions = [
  { label: '著作權', value: 'copyright' },
  { label: 'CC BY', value: 'cc-by' },
  { label: 'CC BY-SA', value: 'cc-by-sa' },
  { label: 'CC BY-NC', value: 'cc-by-nc' },
  { label: 'CC BY-NC-SA', value: 'cc-by-nc-sa' },
  { label: 'CC0', value: 'cc0' },
  { label: 'Public Domain', value: 'public-domain' },
  { label: '其他', value: 'other' },
]

// 國家選項（英文）
const countryOptions = [
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Andorra', value: 'Andorra' },
  { label: 'Angola', value: 'Angola' },
  { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Armenia', value: 'Armenia' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Azerbaijan', value: 'Azerbaijan' },
  { label: 'Bahamas', value: 'Bahamas' },
  { label: 'Bahrain', value: 'Bahrain' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Barbados', value: 'Barbados' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Belize', value: 'Belize' },
  { label: 'Benin', value: 'Benin' },
  { label: 'Bhutan', value: 'Bhutan' },
  { label: 'Bolivia', value: 'Bolivia' },
  { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
  { label: 'Botswana', value: 'Botswana' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Brunei', value: 'Brunei' },
  { label: 'Bulgaria', value: 'Bulgaria' },
  { label: 'Burkina Faso', value: 'Burkina Faso' },
  { label: 'Burundi', value: 'Burundi' },
  { label: 'Cambodia', value: 'Cambodia' },
  { label: 'Cameroon', value: 'Cameroon' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Cape Verde', value: 'Cape Verde' },
  { label: 'Central African Republic', value: 'Central African Republic' },
  { label: 'Chad', value: 'Chad' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Comoros', value: 'Comoros' },
  { label: 'Congo', value: 'Congo' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Croatia', value: 'Croatia' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Cyprus', value: 'Cyprus' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  {
    label: 'Democratic Republic of the Congo',
    value: 'Democratic Republic of the Congo',
  },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Djibouti', value: 'Djibouti' },
  { label: 'Dominica', value: 'Dominica' },
  { label: 'Dominican Republic', value: 'Dominican Republic' },
  { label: 'East Timor', value: 'East Timor' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
  { label: 'Eritrea', value: 'Eritrea' },
  { label: 'Estonia', value: 'Estonia' },
  { label: 'Eswatini', value: 'Eswatini' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Fiji', value: 'Fiji' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Gabon', value: 'Gabon' },
  { label: 'Gambia', value: 'Gambia' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Grenada', value: 'Grenada' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Guinea', value: 'Guinea' },
  { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
  { label: 'Guyana', value: 'Guyana' },
  { label: 'Haiti', value: 'Haiti' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'Iceland', value: 'Iceland' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Ivory Coast', value: 'Ivory Coast' },
  { label: 'Jamaica', value: 'Jamaica' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kazakhstan', value: 'Kazakhstan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Kiribati', value: 'Kiribati' },
  { label: 'Kuwait', value: 'Kuwait' },
  { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
  { label: 'Laos', value: 'Laos' },
  { label: 'Latvia', value: 'Latvia' },
  { label: 'Lebanon', value: 'Lebanon' },
  { label: 'Lesotho', value: 'Lesotho' },
  { label: 'Liberia', value: 'Liberia' },
  { label: 'Libya', value: 'Libya' },
  { label: 'Liechtenstein', value: 'Liechtenstein' },
  { label: 'Lithuania', value: 'Lithuania' },
  { label: 'Luxembourg', value: 'Luxembourg' },
  { label: 'Madagascar', value: 'Madagascar' },
  { label: 'Malawi', value: 'Malawi' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Maldives', value: 'Maldives' },
  { label: 'Mali', value: 'Mali' },
  { label: 'Malta', value: 'Malta' },
  { label: 'Marshall Islands', value: 'Marshall Islands' },
  { label: 'Mauritania', value: 'Mauritania' },
  { label: 'Mauritius', value: 'Mauritius' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Micronesia', value: 'Micronesia' },
  { label: 'Moldova', value: 'Moldova' },
  { label: 'Monaco', value: 'Monaco' },
  { label: 'Mongolia', value: 'Mongolia' },
  { label: 'Montenegro', value: 'Montenegro' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Mozambique', value: 'Mozambique' },
  { label: 'Myanmar', value: 'Myanmar' },
  { label: 'Namibia', value: 'Namibia' },
  { label: 'Nauru', value: 'Nauru' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Niger', value: 'Niger' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'North Korea', value: 'North Korea' },
  { label: 'North Macedonia', value: 'North Macedonia' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Oman', value: 'Oman' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Palau', value: 'Palau' },
  { label: 'Panama', value: 'Panama' },
  { label: 'Papua New Guinea', value: 'Papua New Guinea' },
  { label: 'Paraguay', value: 'Paraguay' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Qatar', value: 'Qatar' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Rwanda', value: 'Rwanda' },
  { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
  { label: 'Saint Lucia', value: 'Saint Lucia' },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  { label: 'Samoa', value: 'Samoa' },
  { label: 'San Marino', value: 'San Marino' },
  { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Senegal', value: 'Senegal' },
  { label: 'Serbia', value: 'Serbia' },
  { label: 'Seychelles', value: 'Seychelles' },
  { label: 'Sierra Leone', value: 'Sierra Leone' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Slovakia', value: 'Slovakia' },
  { label: 'Slovenia', value: 'Slovenia' },
  { label: 'Solomon Islands', value: 'Solomon Islands' },
  { label: 'Somalia', value: 'Somalia' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'South Sudan', value: 'South Sudan' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sudan', value: 'Sudan' },
  { label: 'Suriname', value: 'Suriname' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Syria', value: 'Syria' },
  { label: 'Taiwan', value: 'Taiwan' },
  { label: 'Tajikistan', value: 'Tajikistan' },
  { label: 'Tanzania', value: 'Tanzania' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Togo', value: 'Togo' },
  { label: 'Tonga', value: 'Tonga' },
  { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { label: 'Tunisia', value: 'Tunisia' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Turkmenistan', value: 'Turkmenistan' },
  { label: 'Tuvalu', value: 'Tuvalu' },
  { label: 'Uganda', value: 'Uganda' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Uruguay', value: 'Uruguay' },
  { label: 'Uzbekistan', value: 'Uzbekistan' },
  { label: 'Vanuatu', value: 'Vanuatu' },
  { label: 'Vatican City', value: 'Vatican City' },
  { label: 'Venezuela', value: 'Venezuela' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Yemen', value: 'Yemen' },
  { label: 'Zambia', value: 'Zambia' },
  { label: 'Zimbabwe', value: 'Zimbabwe' },
]

// 搜尋來源
const searchSources = async (event) => {
  const query = event.query
  if (query.length < 2) {
    sourceSuggestions.value = []
    return
  }

  try {
    const { data } = await sourceService.search(query, 10)
    sourceSuggestions.value = data.data.map((source) => ({
      ...source,
      display: `${source.title}${source.year ? ` (${source.year})` : ''}`,
    }))
  } catch (error) {
    console.error('搜尋來源失敗:', error)
    sourceSuggestions.value = []
  }
}

// 選擇來源
const selectSource = (event) => {
  const source = event.value
  selectedSource.value = source
  sourceSearchText.value = source.display
  sourceError.value = ''

  // 清空場景選擇
  clearScene()

  // 更新父組件
  updateValue()
}

// 清除來源選擇
const clearSource = () => {
  selectedSource.value = null
  sourceSearchText.value = ''
  clearScene()
  updateValue()
}

// 搜尋場景
const searchScenes = async (event) => {
  if (!selectedSource.value) {
    sceneSuggestions.value = []
    return
  }

  const query = event.query

  try {
    const { data } = await sourceService.getScenes(selectedSource.value._id, {
      query,
      page: 1,
      limit: 10,
    })

    sceneSuggestions.value = data.data.map((scene) => ({
      ...scene,
      display:
        scene.title || scene.quote || `場景 ${formatTime(scene.start_time)}`,
    }))
  } catch (error) {
    console.error('搜尋場景失敗:', error)
    sceneSuggestions.value = []
  }
}

// 選擇場景
const selectScene = (event) => {
  const scene = event.value
  selectedScene.value = scene
  sceneSearchText.value = scene.display
  updateValue()
}

// 清除場景選擇
const clearScene = () => {
  selectedScene.value = null
  sceneSearchText.value = ''
  updateValue()
}

// 建立新來源
const createSource = async () => {
  if (!newSource.value.type || !newSource.value.title) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請填寫必填欄位',
      life: 3000,
    })
    return
  }

  creatingSource.value = true

  try {
    const payload = {
      type: newSource.value.type,
      title: newSource.value.title,
      slug: newSource.value.slug || undefined,
      year: newSource.value.year || undefined,
      origin_country: newSource.value.origin_country || undefined,
      synopsis: newSource.value.synopsis || undefined,
      context: newSource.value.context || undefined,
      alt_titles: (newSource.value.alt_titles || []).filter(
        (s) => s && s.trim(),
      ),
      creators: (newSource.value.creators || [])
        .filter((c) => (c.role && c.role.trim()) || (c.name && c.name.trim()))
        .map((c) => ({
          role: c.role?.trim() || undefined,
          name: c.name?.trim() || undefined,
        })),
      license:
        newSource.value.license?.type || newSource.value.license?.notes
          ? {
              type: newSource.value.license.type || undefined,
              notes: newSource.value.license.notes || undefined,
            }
          : undefined,
      links: (newSource.value.links || [])
        .filter((l) => l && (l.url || l.label))
        .map((l) => ({ label: l.label || undefined, url: l.url || undefined })),
      thumbnails: (newSource.value.thumbnails || []).filter(
        (u) => u && u.trim(),
      ),
      tags: (newSource.value.tags || [])
        .map((t) => (t || '').toLowerCase().trim())
        .filter((t) => t),
    }

    const { data } = await sourceService.create(payload)

    // 設定為選中的來源
    selectedSource.value = data.data
    sourceSearchText.value = `${data.data.title}${data.data.year ? ` (${data.data.year})` : ''}`

    // 關閉對話框
    showCreateSourceDialog.value = false

    // 重置表單
    newSource.value = {
      type: 'video',
      title: '',
      slug: '',
      year: null,
      origin_country: '',
      synopsis: '',
      context: '',
      alt_titles: [],
      creators: [],
      license: { type: null, notes: '' },
      links: [],
      thumbnails: [],
      tags: [],
    }

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '來源已建立',
      life: 3000,
    })

    updateValue()
  } catch (error) {
    console.error('建立來源失敗:', error)
    toast.add({
      severity: 'error',
      summary: '建立失敗',
      detail: error.response?.data?.message || '建立來源時發生錯誤',
      life: 5000,
    })
  } finally {
    creatingSource.value = false
  }
}

// 建立新場景
const createScene = async () => {
  if (!selectedSource.value) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請先選擇來源',
      life: 3000,
    })
    return
  }

  if (!newScene.value.title) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請填寫場景標題',
      life: 3000,
    })
    return
  }

  creatingScene.value = true

  try {
    const payload = {
      source_id: selectedSource.value._id,
      title: newScene.value.title,
      quote: newScene.value.quote || undefined,
      start_time: newScene.value.start_time || undefined,
      end_time: newScene.value.end_time || undefined,
      images: newScene.value.images.filter((img) => img),
    }

    const { data } = await sceneService.create(payload)

    // 設定為選中的場景
    selectedScene.value = data.data
    sceneSearchText.value =
      data.data.title ||
      data.data.quote ||
      `場景 ${formatTime(data.data.start_time)}`

    // 關閉對話框
    showCreateSceneDialog.value = false

    // 重置表單
    newScene.value = {
      title: '',
      quote: '',
      start_time: null,
      end_time: null,
      images: [],
    }

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '場景已建立',
      life: 3000,
    })

    updateValue()
  } catch (error) {
    console.error('建立場景失敗:', error)
    toast.add({
      severity: 'error',
      summary: '建立失敗',
      detail: error.response?.data?.message || '建立場景時發生錯誤',
      life: 5000,
    })
  } finally {
    creatingScene.value = false
  }
}

// 新增截圖欄位
const addSceneImage = () => {
  newScene.value.images.push('')
}

// 移除截圖欄位
const removeSceneImage = (index) => {
  newScene.value.images.splice(index, 1)
}

// 處理新來源 slug 輸入
const onNewSourceSlugInput = (event) => {
  // 只保留合法字元
  newSource.value.slug = event.target.value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')

  // 清除之前的計時器
  if (newSourceSlugCheckTimer) {
    clearTimeout(newSourceSlugCheckTimer)
  }

  // 設定新的計時器（debounce 500ms）
  newSourceSlugCheckTimer = setTimeout(() => {
    checkNewSourceSlugAvailable()
  }, 500)
}

// 檢查新來源 slug 是否可用
const checkNewSourceSlugAvailable = async () => {
  if (!newSource.value.slug) {
    newSourceSlugOk.value = true
    newSourceSlugError.value = ''
    return
  }

  // 先做本地驗證
  const validation = validateSlug(newSource.value.slug)
  if (!validation.valid) {
    newSourceSlugOk.value = false
    newSourceSlugError.value = validation.error
    return
  }

  // 檢查是否為保留字
  if (isReservedSlug(newSource.value.slug)) {
    newSourceSlugOk.value = false
    newSourceSlugError.value = '此 Slug 為保留字，請選擇其他名稱'
    return
  }

  newSourceSlugChecking.value = true
  newSourceSlugError.value = ''

  try {
    const response = await fetch(
      `/api/sources/slug-available?slug=${encodeURIComponent(newSource.value.slug)}`,
    )
    const data = await response.json()

    if (data.success && data.data.available) {
      newSourceSlugOk.value = true
      newSourceSlugError.value = ''
    } else {
      newSourceSlugOk.value = false
      newSourceSlugError.value = data.error || 'Slug 已被使用'
    }
  } catch (error) {
    console.error('檢查來源 slug 失敗:', error)
    // 發生錯誤時假設可用，讓後端做最終檢查
    newSourceSlugOk.value = true
    newSourceSlugError.value = ''
  } finally {
    newSourceSlugChecking.value = false
  }
}

// 新增/移除：別名
const addAltTitle = () => {
  newSource.value.alt_titles.push('')
}
const removeAltTitle = (index) => {
  newSource.value.alt_titles.splice(index, 1)
}

// 新增/移除：創作者
const addCreator = () => {
  newSource.value.creators.push({ role: '', name: '' })
}
const removeCreator = (index) => {
  newSource.value.creators.splice(index, 1)
}

// 新增/移除：外部連結
const addLink = () => {
  newSource.value.links.push({ label: '', url: '' })
}
const removeLink = (index) => {
  newSource.value.links.splice(index, 1)
}

// 新增/移除：縮圖
const addThumbnail = () => {
  newSource.value.thumbnails.push('')
}
const removeThumbnail = (index) => {
  newSource.value.thumbnails.splice(index, 1)
}

// 新增/移除：標籤
const addTag = () => {
  newSource.value.tags.push('')
}
const removeTag = (index) => {
  newSource.value.tags.splice(index, 1)
}

// 格式化時間
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return ''

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 取得類型標籤
const getTypeLabel = (type) => {
  const option = sourceTypeOptions.find((opt) => opt.value === type)
  return option ? option.label : type
}

// 更新父組件的值
const updateValue = () => {
  emit('update:modelValue', {
    source_id: selectedSource.value?._id || null,
    scene_id: selectedScene.value?._id || null,
  })
}

// 監聽 props 變化
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal && newVal.source_id) {
      // 如果有 source_id，載入來源資料
      try {
        // 使用認證的 API 調用
        const response = await fetch(`/api/sources/${newVal.source_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const result = await response.json()
        // 處理不同的資料結構
        const source =
          result.data?.source || result.source || result.data || result

        if (source) {
          selectedSource.value = source
          sourceSearchText.value = `${source.title}${source.year ? ` (${source.year})` : ''}`

          // 如果有 scene_id，也載入場景資料
          if (newVal.scene_id) {
            try {
              // 使用認證的 API 調用
              const sceneResponse = await fetch(
                `/api/scenes/${newVal.scene_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                },
              )
              const sceneResult = await sceneResponse.json()
              // 處理不同的資料結構
              const scene =
                sceneResult.data?.scene ||
                sceneResult.scene ||
                sceneResult.data ||
                sceneResult

              if (scene) {
                selectedScene.value = scene
                sceneSearchText.value =
                  scene.title ||
                  scene.quote ||
                  `場景 ${formatTime(scene.start_time)}`
              }
            } catch (sceneError) {
              console.warn('載入場景資料失敗:', sceneError)
            }
          }
        }
      } catch (sourceError) {
        console.warn('載入來源資料失敗:', sourceError)
      }
    } else {
      clearSource()
    }
  },
  { immediate: true },
)

// 自動從標題生成 slug（新增來源時）
watch(
  () => newSource.value.title,
  (title) => {
    if (title && !newSource.value.slug) {
      const slug = slugify(title, { maxLength: 60 })
      if (slug) {
        newSource.value.slug = slug
      }
    }
  },
)
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.source-option,
.scene-option {
  padding: 0.5rem 0;
}

.source-option:hover,
.scene-option:hover {
  background-color: var(--surface-100);
}
</style>
