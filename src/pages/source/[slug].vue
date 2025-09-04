<template>
  <div class="w-full mx-auto min-h-[calc(100vh-100px)] overflow-y-auto">
    <!-- 載入狀態 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>

    <!-- 錯誤狀態 -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-[400px]"
    >
      <Card class="p-6 text-center" unstyled>
        <template #content>
          <i
            class="pi pi-exclamation-triangle text-6xl text-primary-400 mb-4"
          ></i>
          <h2 class="text-2xl font-bold text-surface-800 mb-2">載入失敗</h2>
          <p class="text-surface-600 mb-4">{{ error }}</p>
          <Button label="重新載入" @click="loadSource" />
        </template>
      </Card>
    </div>

    <!-- 主要內容 -->
    <div v-else-if="source" class="mx-auto max-w-6xl px-4 py-6">
      <!-- 麵包屑導航 -->
      <Breadcrumb
        :home="breadcrumbHome"
        :model="breadcrumbItems"
        class="p-2 bg-transparent mb-6"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="p-0! text-surface-800 dark:text-surface-100 hover:text-primary-500"
            >
              <span :class="[item.icon]" />
              <span class="hover:underline">{{ item.label }}</span>
            </a>
          </router-link>
          <span
            v-else
            v-bind="props.action"
            class="text-surface-800 dark:text-surface-100"
          >
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>

      <!-- 標題區域 -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h1 class="mb-4">
            {{ source.title }}
          </h1>
          <!-- 標籤 -->
          <div class="flex flex-wrap gap-2">
            <CustomTag
              v-for="tag in source.tags"
              :key="tag"
              :value="tag"
              severity="primary"
            />
          </div>
        </div>
        <div class="items-center space-x-2 hidden md:flex">
          <Button
            v-if="canEditSource"
            icon="pi pi-pencil"
            label="編輯來源"
            severity="secondary"
            size="small"
            @click="showEditSourceDialogFn"
          />
        </div>
      </div>

      <!-- 縮圖展示 -->
      <div
        v-if="source.thumbnails && source.thumbnails.length > 0"
        class="mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(thumbnail, index) in source.thumbnails"
            :key="index"
            class="aspect-video bg-surface-100 rounded-lg overflow-hidden"
          >
            <img
              :src="thumbnail"
              :alt="`${source.title} 縮圖 ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <Divider class="my-6" />

      <!-- 出處詳細資訊 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 主要內容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 簡介和背景/補充說明 -->
          <div class="p-4">
            <template v-if="source.synopsis">
              <h2 class="mb-4">簡介</h2>
              <div class="prose max-w-none">
                <p class="text-surface-700 leading-relaxed whitespace-pre-line">
                  {{ source.synopsis }}
                </p>
              </div>
            </template>
            <template v-else>
              <div class="text-surface-500 italic">暫無簡介</div>
            </template>

            <template v-if="source.context">
              <h2 class="mt-8 mb-4">背景/補充說明</h2>
              <div class="prose max-w-none">
                <p class="text-surface-700 leading-relaxed whitespace-pre-line">
                  {{ source.context }}
                </p>
              </div>
            </template>
          </div>

          <!-- 創作者 -->
          <Card v-if="source.creators && source.creators.length > 0">
            <template #title>
              <h2 class="mb-4">創作者</h2>
            </template>
            <template #content>
              <div class="space-y-2">
                <div
                  v-for="creator in source.creators"
                  :key="creator._id || creator.name"
                  class="flex items-center space-x-3 p-2 bg-surface-50 rounded-lg dark:bg-surface-800"
                >
                  <div
                    class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900"
                  >
                    <i class="pi pi-user text-primary-600"></i>
                  </div>
                  <div>
                    <h6
                      class="font-medium text-surface-800 dark:text-surface-100"
                    >
                      {{ creator.name }}
                    </h6>
                    <div
                      v-if="creator.role"
                      class="text-sm text-surface-600 dark:text-surface-400"
                    >
                      {{ creator.role }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 側邊欄 -->
        <div class="space-y-6">
          <!-- 出處統計 -->
          <Card>
            <template #title>
              <h3 class="text-lg font-bold text-surface-900">資訊卡</h3>
            </template>
            <template #content>
              <div class="space-y-3">
                <div
                  v-if="source.alt_titles && source.alt_titles.length > 0"
                  class="flex justify-between"
                >
                  <span class="flex-1 text-surface-600 dark:text-surface-400"
                    >其他名稱</span
                  >
                  <span class="flex-1 font-medium text-right">{{
                    source.alt_titles.join('、')
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >相關迷因</span
                  >
                  <span class="font-medium text-right">{{
                    source.counts?.memes || memes.length
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >場景數量</span
                  >
                  <span class="font-medium text-right">{{
                    source.counts?.scenes || scenes.length
                  }}</span>
                </div>
                <div v-if="source.year" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >發布年份</span
                  >
                  <span class="font-medium text-right">{{ source.year }}</span>
                </div>
                <div v-if="source.type" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >類型</span
                  >
                  <span class="font-medium text-right">{{
                    getSourceTypeName(source.type)
                  }}</span>
                </div>
                <div v-if="source.origin_country" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >來源國家</span
                  >
                  <span class="font-medium text-right">{{
                    source.origin_country
                  }}</span>
                </div>
                <div v-if="source.license" class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400 flex-1"
                    >授權資訊</span
                  >
                  <span class="font-medium flex-1 text-right">{{
                    getLicenseText(source.license)
                  }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >最後更新</span
                  >
                  <span class="font-medium text-right">{{
                    formatDate(source.updatedAt)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-surface-600 dark:text-surface-400"
                    >狀態</span
                  >
                  <span class="font-medium text-right">
                    <span
                      :class="{
                        'text-success-600': source.status === 'active',
                        'text-primary-600':
                          source.status === 'inactive' ||
                          source.status === 'rejected',
                        'text-warn-600': source.status === 'pending',
                        'text-surface-600': source.status === 'draft',
                      }"
                    >
                      {{ getStatusText(source.status) }}
                    </span>
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- 場景及相關迷因 -->
      <Card class="p-4 mb-8">
        <template #title>
          <h2 v-if="scenesWithMemes.length > 0" class="mb-4">場景及相關迷因</h2>
        </template>
        <template #content>
          <Panel
            toggleable
            collapsed
            v-for="scene in scenesWithMemes"
            :key="scene._id"
          >
            <template #header>
              <!-- 場景 -->

              <div class="flex items-start space-x-4 p-4">
                <div class="flex-shrink-0">
                  <div
                    v-if="scene.images && scene.images.length > 0"
                    class="w-16 h-16 bg-surface-100 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="scene.images[0]"
                      :alt="scene.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="pi pi-play text-primary-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="mb-1 font-medium">
                    {{ scene.title }}
                  </h4>
                  <div
                    v-if="scene.quote"
                    class="text-sm text-surface-600 dark:text-surface-400 mb-2 italic"
                  >
                    "{{ scene.quote }}"
                  </div>
                  <div
                    class="flex items-center space-x-4 text-sm text-surface-500"
                  >
                    <span v-if="scene.start_time">
                      開始：{{ formatTime(scene.start_time) }}
                    </span>
                    <span v-if="scene.end_time">
                      結束：{{ formatTime(scene.end_time) }}
                    </span>
                    <span v-if="scene.duration">
                      時長：{{ formatTime(scene.duration) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <template #icons>
              <Button
                v-if="canEditScene(scene)"
                icon="pi pi-pencil"
                severity="secondary"
                rounded
                text
                @click="showEditSceneDialogFn(scene)"
              />
            </template>

            <!-- 迷因 -->
            <div>
              <hr />
              <h4 class="my-4">此場景相關迷因：</h4>
              <div
                v-if="scene.memes && scene.memes.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <div
                  v-for="meme in scene.memes"
                  :key="meme._id"
                  class="bg-white rounded-lg shadow-sm border hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors cursor-pointer"
                  @click="navigateToMeme(meme)"
                >
                  <div
                    class="aspect-square bg-surface-100 rounded-t-lg overflow-hidden"
                  >
                    <img
                      v-if="
                        (meme.cover_image && meme.cover_image.trim()) ||
                        (meme.image_url && meme.image_url.trim())
                      "
                      :src="
                        meme.cover_image && meme.cover_image.trim()
                          ? meme.cover_image
                          : meme.image_url
                      "
                      :alt="meme.title"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-surface-400"
                    >
                      <i class="pi pi-image text-2xl"></i>
                    </div>
                  </div>
                  <div class="p-3">
                    <h4 class="mb-1 line-clamp-2">
                      {{ meme.title }}
                    </h4>
                    <div
                      class="flex items-center justify-between text-sm text-surface-500 dark:text-surface-300"
                    >
                      <div class="flex items-center space-x-2">
                        <span>{{ getMemeAuthorName(meme) }}</span> ·
                        <span>
                          {{ formatPublishedTime(meme) }}
                        </span>
                      </div>
                      <span class="flex items-center">
                        <i class="pi pi-thumbs-up mr-1"></i>
                        {{ meme.like_count || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-surface-500">
                <i class="pi pi-image text-4xl mb-2"></i>
                <p>暫無相關迷因</p>
              </div>
            </div>

            <template #footer>
              <!-- 分頁 -->
              <div
                v-if="totalMemes > pageSize"
                class="flex justify-center mt-6"
              >
                <Paginator
                  :rows="pageSize"
                  :total-records="totalMemes"
                  :first="(currentPage - 1) * pageSize"
                  @page="onPageChange"
                />
              </div>
            </template>
          </Panel>
        </template>
      </Card>

      <!-- 外部連結 -->
      <Card v-if="source.links && source.links.length > 0" class="mb-8 p-4">
        <template #title>
          <h2 class="mb-4">外部連結</h2>
        </template>
        <template #content>
          <div class="space-y-2 w-full">
            <a
              v-for="link in source.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center p-3! bg-surface-50 hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-lg transition-colors min-w-0"
            >
              <i
                class="pi pi-external-link m-4 text-primary-600 flex-shrink-0"
              ></i>
              <div class="ml-4 min-w-0 flex-1">
                <h6 class="truncate">
                  {{ link.label || link.title || '連結' }}
                </h6>
                <small
                  class="text-surface-600 dark:text-surface-400 truncate block"
                  >{{ link.url }}</small
                >
              </div>
            </a>
          </div>
        </template>
      </Card>
    </div>

    <!-- 編輯來源對話框 -->
    <Dialog
      v-model:visible="showEditSourceDialog"
      header="編輯來源"
      :style="{ width: '720px' }"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="space-y-4">
        <!-- 類型 -->
        <div class="field">
          <label for="editSourceType" class="block font-semibold mb-2">
            類型 <span class="text-primary-500">*</span>
          </label>
          <Dropdown
            id="editSourceType"
            v-model="editSource.type"
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
          <label for="editSourceTitle" class="block font-semibold mb-2">
            標題 <span class="text-primary-500">*</span>
          </label>
          <InputText
            id="editSourceTitle"
            v-model="editSource.title"
            placeholder="輸入作品標題..."
            class="w-full"
          />
        </div>

        <!-- Slug -->
        <div class="field">
          <label for="editSourceSlug" class="block font-semibold mb-2">
            網址代稱 (Slug)
          </label>
          <div class="flex gap-2">
            <InputText
              id="editSourceSlug"
              v-model="editSource.slug"
              placeholder="自動產生或手動輸入..."
              class="flex-1"
              :class="{ 'p-invalid': editSourceSlugError }"
              @input="onEditSourceSlugInput"
              @blur="checkEditSourceSlugAvailable"
            />
            <div v-if="editSourceSlugChecking" class="flex items-center px-3">
              <i class="pi pi-spin pi-spinner text-primary-500"></i>
            </div>
            <div
              v-else-if="editSource.slug && editSourceSlugOk"
              class="flex items-center px-3"
            >
              <i class="pi pi-check-circle text-green-500"></i>
            </div>
            <div
              v-else-if="editSource.slug && !editSourceSlugOk"
              class="flex items-center px-3"
            >
              <i class="pi pi-times-circle text-red-500"></i>
            </div>
          </div>
          <Message
            v-if="editSourceSlugError"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ editSourceSlugError }}
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
              v-for="(title, index) in editSource.alt_titles"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="editSource.alt_titles[index]"
                placeholder="輸入別名..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeEditAltTitle(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增別名"
              severity="secondary"
              size="small"
              @click="addEditAltTitle"
            />
          </div>
        </div>

        <!-- 縮圖 -->
        <div class="field">
          <label class="block font-semibold mb-2">縮圖/海報</label>
          <div class="space-y-2">
            <div
              v-for="(thumb, index) in editSource.thumbnails"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="editSource.thumbnails[index]"
                placeholder="圖片 URL"
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeEditThumbnail(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增縮圖"
              severity="secondary"
              size="small"
              @click="addEditThumbnail"
            />
          </div>
        </div>

        <!-- 年份 / 國家 -->
        <div class="field">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="editSourceYear" class="block font-semibold mb-2">
                年份
              </label>
              <InputNumber
                id="editSourceYear"
                v-model="editSource.year"
                placeholder="例如：2024"
                class="w-full"
                :min="1800"
                :max="new Date().getFullYear() + 10"
                :useGrouping="false"
              />
            </div>
            <div>
              <label
                for="editSourceOriginCountry"
                class="block font-semibold mb-2"
              >
                來源國家/地區
              </label>
              <Dropdown
                id="editSourceOriginCountry"
                v-model="editSource.origin_country"
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
          <label for="editSourceSynopsis" class="block font-semibold mb-2">
            簡介
          </label>
          <Textarea
            id="editSourceSynopsis"
            v-model="editSource.synopsis"
            placeholder="簡單描述這個作品..."
            rows="3"
            class="w-full"
          />
        </div>

        <!-- 背景說明 -->
        <div class="field">
          <label for="editSourceContext" class="block font-semibold mb-2">
            背景/補充說明
          </label>
          <Textarea
            id="editSourceContext"
            v-model="editSource.context"
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
              v-for="(creator, index) in editSource.creators"
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
                  @click="removeEditCreator(index)"
                />
              </div>
            </div>
            <Button
              icon="pi pi-plus"
              label="新增創作者"
              severity="secondary"
              size="small"
              @click="addEditCreator"
            />
          </div>
        </div>

        <!-- 授權資訊 -->
        <div class="field">
          <label class="block font-semibold mb-2">授權</label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Dropdown
                v-model="editSource.license.type"
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
                v-model="editSource.license.notes"
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
              v-for="(link, index) in editSource.links"
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
                  @click="removeEditLink(index)"
                />
              </div>
            </div>
            <Button
              icon="pi pi-plus"
              label="新增連結"
              severity="secondary"
              size="small"
              @click="addEditLink"
            />
          </div>
        </div>

        <!-- 標籤 -->
        <div class="field">
          <label class="block font-semibold mb-2">標籤</label>
          <div class="space-y-2">
            <div
              v-for="(tag, index) in editSource.tags"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="editSource.tags[index]"
                placeholder="輸入標籤..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeEditTag(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增標籤"
              severity="secondary"
              size="small"
              @click="addEditTag"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          @click="showEditSourceDialog = false"
          severity="secondary"
        />
        <Button
          label="儲存"
          icon="pi pi-check"
          @click="updateSource"
          :loading="updatingSource"
        />
      </template>
    </Dialog>

    <!-- 編輯場景對話框 -->
    <Dialog
      v-model:visible="showEditSceneDialog"
      header="編輯場景"
      :style="{ width: '600px' }"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="space-y-4">
        <!-- 標題 -->
        <div class="field">
          <label for="editSceneTitle" class="block font-semibold mb-2">
            場景標題 <span class="text-primary-500">*</span>
          </label>
          <InputText
            id="editSceneTitle"
            v-model="editScene.title"
            placeholder="描述這個場景..."
            class="w-full"
          />
        </div>

        <!-- 集數/章節 -->
        <div class="field">
          <label for="editSceneEpisode" class="block font-semibold mb-2">
            集數/章節
          </label>
          <InputText
            id="editSceneEpisode"
            v-model="editScene.episode"
            placeholder="例如：S01E05"
            class="w-full"
          />
        </div>

        <!-- 台詞/引言 -->
        <div class="field">
          <label for="editSceneQuote" class="block font-semibold mb-2">
            台詞/引言
          </label>
          <Textarea
            id="editSceneQuote"
            v-model="editScene.quote"
            placeholder="這個場景的經典台詞或文字..."
            rows="2"
            class="w-full"
          />
        </div>

        <!-- 場景說明 -->
        <div class="field">
          <label for="editSceneDescription" class="block font-semibold mb-2">
            場景說明
          </label>
          <Textarea
            id="editSceneDescription"
            v-model="editScene.description"
            placeholder="對這個場景的詳細描述..."
            rows="3"
            class="w-full"
          />
        </div>

        <!-- 逐字稿 -->
        <div class="field">
          <label for="editSceneTranscript" class="block font-semibold mb-2">
            逐字稿
          </label>
          <Textarea
            id="editSceneTranscript"
            v-model="editScene.transcript"
            placeholder="場景的對話內容..."
            rows="4"
            class="w-full"
          />
        </div>

        <!-- 開始時間 -->
        <div class="field">
          <div>
            <label for="editSceneStartTime" class="block font-semibold mb-2">
              開始時間
            </label>
            <TimeInput
              id="editSceneStartTime"
              v-model="editScene.start_time"
              placeholder="設定開始時間"
            />
          </div>
        </div>

        <!-- 結束時間 -->
        <div class="field">
          <div>
            <label for="editSceneEndTime" class="block font-semibold mb-2">
              結束時間
            </label>
            <TimeInput
              id="editSceneEndTime"
              v-model="editScene.end_time"
              placeholder="設定結束時間"
            />
          </div>
          <small class="text-surface-500">選填，場景在影片中的時間範圍</small>
        </div>

        <!-- 截圖連結 -->
        <div class="field">
          <label for="editSceneImages" class="block font-semibold mb-2">
            截圖連結
          </label>
          <div class="space-y-2">
            <div
              v-for="(image, index) in editScene.images"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="editScene.images[index]"
                placeholder="圖片網址..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeEditSceneImage(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增截圖"
              severity="secondary"
              size="small"
              @click="addEditSceneImage"
            />
          </div>
        </div>

        <!-- 影片連結 -->
        <div class="field">
          <label for="editSceneVideoUrl" class="block font-semibold mb-2">
            影片連結
          </label>
          <InputText
            id="editSceneVideoUrl"
            v-model="editScene.video_url"
            placeholder="https://..."
            class="w-full"
          />
          <small class="text-surface-500"
            >選填，可包含時間碼的外部影片連結</small
          >
        </div>

        <!-- 音訊連結 -->
        <div class="field">
          <label for="editSceneAudioUrl" class="block font-semibold mb-2">
            音訊連結
          </label>
          <InputText
            id="editSceneAudioUrl"
            v-model="editScene.audio_url"
            placeholder="https://..."
            class="w-full"
          />
          <small class="text-surface-500">選填，音訊場景連結</small>
        </div>

        <!-- 標籤 -->
        <div class="field">
          <label class="block font-semibold mb-2">標籤</label>
          <div class="space-y-2">
            <div
              v-for="(tag, index) in editScene.tags"
              :key="index"
              class="flex gap-2"
            >
              <InputText
                v-model="editScene.tags[index]"
                placeholder="輸入標籤..."
                class="flex-1"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                @click="removeEditSceneTag(index)"
              />
            </div>
            <Button
              icon="pi pi-plus"
              label="新增標籤"
              severity="secondary"
              size="small"
              @click="addEditSceneTag"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          @click="showEditSceneDialog = false"
          severity="secondary"
        />
        <Button
          label="儲存"
          icon="pi pi-check"
          @click="updateScene"
          :loading="updatingScene"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'

// PrimeVue 組件
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'
import Paginator from 'primevue/paginator'
import Breadcrumb from 'primevue/breadcrumb'
import Panel from 'primevue/panel'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'

// 服務
import sourceService from '@/services/sourceService'
import memeService from '@/services/memeService'
import sceneService from '@/services/sceneService'

// 工具函數
import { formatPublishedTime } from '@/utils/dataUtils'
import { validateSlug, isReservedSlug } from '@/utils/slugify'

// 自定義組件
import CustomTag from '@/components/CustomTag.vue'
import TimeInput from '@/components/TimeInput.vue'

// 路由和狀態
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

// 響應式數據
const loading = ref(true)
const error = ref(null)
const source = ref(null)
const scenes = ref([])
const memes = ref([])

// 麵包屑相關
const breadcrumbHome = ref({
  icon: 'pi pi-home',
  route: '/memes/all',
})

const breadcrumbItems = computed(() => {
  if (!source.value) return []

  return [
    {
      label: source.value.title,
      route: null, // 當前頁面，不設連結
    },
  ]
})

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(12)
const totalMemes = ref(0)

// 編輯來源相關
const showEditSourceDialog = ref(false)
const updatingSource = ref(false)
const editSource = ref({
  type: '',
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
const editSourceSlugOk = ref(true)
const editSourceSlugError = ref('')
const editSourceSlugChecking = ref(false)
let editSourceSlugCheckTimer = null

// 編輯場景相關
const showEditSceneDialog = ref(false)
const updatingScene = ref(false)
const editingScene = ref(null)
const editScene = ref({
  title: '',
  episode: '',
  quote: '',
  transcript: '',
  description: '',
  start_time: null,
  end_time: null,
  images: [],
  video_url: '',
  audio_url: '',
  tags: [],
})

// 計算屬性
const sourceSlug = computed(() => route.params.slug)

// 檢查是否可以編輯來源
const canEditSource = computed(() => {
  if (!userStore.isLoggedIn || !source.value) return false

  // 管理員或管理者可以編輯
  if (userStore.isManager || userStore.isAdmin) return true

  // 來源創建者可以編輯
  return source.value.created_by === userStore.userId
})

// 檢查是否可以建立新來源
// const canCreateSource = computed(() => {
//   return userStore.isLoggedIn
// })

// 檢查是否可以編輯場景
const canEditScene = (scene) => {
  if (!userStore.isLoggedIn || !scene) return false

  // 管理員或管理者可以編輯
  if (userStore.isManager || userStore.isAdmin) return true

  // 場景創建者可以編輯
  return scene.created_by === userStore.userId
}

// 檢查是否可以建立新場景
// const canCreateScene = computed(() => {
//   return userStore.isLoggedIn
// })

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
  // 版權相關
  { label: '版權所有', value: 'copyright' },
  { label: '版權所有 (All Rights Reserved)', value: 'all-rights-reserved' },

  // 創用CC授權
  { label: 'CC BY (姓名標示)', value: 'cc-by' },
  { label: 'CC BY-SA (姓名標示-相同方式分享)', value: 'cc-by-sa' },
  { label: 'CC BY-NC (姓名標示-非商業性)', value: 'cc-by-nc' },
  {
    label: 'CC BY-NC-SA (姓名標示-非商業性-相同方式分享)',
    value: 'cc-by-nc-sa',
  },
  { label: 'CC BY-ND (姓名標示-禁止改作)', value: 'cc-by-nd' },
  { label: 'CC BY-NC-ND (姓名標示-非商業性-禁止改作)', value: 'cc-by-nc-nd' },
  { label: 'CC0 (公眾領域貢獻宣告)', value: 'cc0' },

  // 公有領域
  { label: '公有領域', value: 'public-domain' },
  { label: '公有領域貢獻', value: 'public-domain-dedication' },

  // 合理使用
  { label: '合理使用', value: 'fair-use' },
  { label: '公平使用', value: 'fair-dealing' },

  // 其他常見授權
  { label: 'MIT授權', value: 'mit' },
  { label: 'Apache授權', value: 'apache' },
  { label: 'GPL授權', value: 'gpl' },
  { label: 'GPL v2', value: 'gpl-v2' },
  { label: 'GPL v3', value: 'gpl-v3' },
  { label: 'LGPL授權', value: 'lgpl' },
  { label: 'BSD授權', value: 'bsd' },
  { label: 'Mozilla公共授權', value: 'mozilla' },
  { label: '創用CC授權', value: 'creative-commons' },

  // 未知或自定義
  { label: '其他授權', value: 'other' },
  { label: '未知授權', value: 'unknown' },
  { label: '自定義授權', value: 'custom' },
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

// 將迷因根據scene_id分組到對應場景
const scenesWithMemes = computed(() => {
  if (!scenes.value.length || !memes.value.length) {
    return scenes.value.map((scene) => ({ ...scene, memes: [] }))
  }

  // 創建scene_id到迷因的映射
  const memesBySceneId = new Map()
  memes.value.forEach((meme) => {
    // 檢查 meme.scene_id 是否為有效的 ObjectId 或對象
    const sceneId = meme.scene_id?._id || meme.scene_id
    if (sceneId) {
      if (!memesBySceneId.has(sceneId)) {
        memesBySceneId.set(sceneId, [])
      }
      memesBySceneId.get(sceneId).push(meme)
    }
  })

  // 將迷因分配到對應的場景
  return scenes.value.map((scene) => ({
    ...scene,
    memes: memesBySceneId.get(scene._id) || [],
  }))
})

// 方法
const getSourceTypeName = (type) => {
  const typeMap = {
    video: '影片',
    film: '電影',
    tv: '電視',
    ad: '廣告',
    web: '網路',
    article: '文章',
    music: '音樂',
    broadcast: '廣播',
    podcast: 'Podcast',
    game: '遊戲',
    anime: '動畫',
    comic: '漫畫',
    event: '事件',
    other: '其他',
  }
  return typeMap[type] || type
}

const getLicenseText = (license) => {
  if (typeof license === 'string') {
    return getLicenseDisplayName(license)
  }

  if (license && typeof license === 'object') {
    const licenseType = getLicenseDisplayName(license.type)
    if (license.notes) {
      return `${licenseType} - ${license.notes}`
    }
    return licenseType
  }

  return '未知授權'
}

const getLicenseDisplayName = (licenseType) => {
  const licenseMap = {
    // 版權相關
    copyright: '版權所有',
    'all-rights-reserved': '版權所有',

    // 創用CC授權
    'cc-by': 'CC BY (姓名標示)',
    'cc-by-sa': 'CC BY-SA (姓名標示-相同方式分享)',
    'cc-by-nc': 'CC BY-NC (姓名標示-非商業性)',
    'cc-by-nc-sa': 'CC BY-NC-SA (姓名標示-非商業性-相同方式分享)',
    'cc-by-nd': 'CC BY-ND (姓名標示-禁止改作)',
    'cc-by-nc-nd': 'CC BY-NC-ND (姓名標示-非商業性-禁止改作)',
    cc0: 'CC0 (公眾領域貢獻宣告)',

    // 公有領域
    'public-domain': '公有領域',
    'public-domain-dedication': '公有領域貢獻',

    // 合理使用
    'fair-use': '合理使用',
    'fair-dealing': '公平使用',

    // 其他常見授權
    mit: 'MIT授權',
    apache: 'Apache授權',
    gpl: 'GPL授權',
    'gpl-v2': 'GPL v2',
    'gpl-v3': 'GPL v3',
    lgpl: 'LGPL授權',
    bsd: 'BSD授權',
    mozilla: 'Mozilla公共授權',
    'creative-commons': '創用CC授權',

    // 未知或自定義
    other: '其他授權',
    unknown: '未知授權',
    custom: '自定義授權',
  }

  return licenseMap[licenseType] || licenseType || '未知授權'
}

const getStatusText = (status) => {
  const statusMap = {
    active: '啟用',
    inactive: '停用',
    pending: '待審核',
    rejected: '已拒絕',
    draft: '草稿',
  }
  return statusMap[status] || status || '未知'
}

const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return ''

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getMemeAuthorName = (meme) => {
  const author = meme.author_id || meme.author
  if (!author) return '匿名用戶'
  return author.display_name || author.username || '匿名用戶'
}

const loadSource = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await sourceService.getBySlug(sourceSlug.value)

    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      response.data.data.source
    ) {
      source.value = response.data.data.source

      // 載入相關數據
      await Promise.allSettled([loadScenes(), loadMemes()])
    } else {
      error.value = '找不到該出處'
    }
  } catch (err) {
    console.error('載入出處失敗:', err)
    error.value =
      err.response?.status === 404 ? '找不到該出處' : '載入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

const loadScenes = async () => {
  try {
    if (!source.value?._id) return

    const response = await sourceService.getScenes(source.value._id)
    let sceneList = []

    if (response.data && response.data.success) {
      sceneList = response.data.data || []
    } else if (response.data) {
      sceneList = response.data || []
    } else {
      sceneList = []
    }

    scenes.value = sceneList
  } catch (error) {
    console.error('載入場景失敗:', error)
    scenes.value = []
  }
}

const loadMemes = async () => {
  try {
    if (!source.value?._id) return

    // 使用現有的 getBySource API 獲取所有迷因
    const response = await memeService.getBySource(source.value._id, {
      page: currentPage.value,
      limit: pageSize.value,
      sort: 'hot',
    })

    if (response.data && response.data.success) {
      const data = response.data.data
      memes.value = data.memes || []
      totalMemes.value = data.pagination?.total || memes.value.length
    } else if (response.data) {
      const data = response.data
      memes.value = data.memes || data || []
      totalMemes.value = data.pagination?.total || memes.value.length
    } else {
      memes.value = []
      totalMemes.value = 0
    }
  } catch (error) {
    console.error('載入迷因失敗:', error)
    memes.value = []
    totalMemes.value = 0
  }
}

const navigateToMeme = (meme) => {
  const memeId = meme.slug || meme._id
  router.push(`/memes/detail/${meme.slug || memeId}`)
}

// 顯示編輯來源對話框
const showEditSourceDialogFn = () => {
  if (!canEditSource.value) return

  // 複製來源資料到編輯表單
  editSource.value = {
    type: source.value.type || '',
    title: source.value.title || '',
    slug: source.value.slug || '',
    year: source.value.year || null,
    origin_country: source.value.origin_country || '',
    synopsis: source.value.synopsis || '',
    context: source.value.context || '',
    alt_titles: [...(source.value.alt_titles || [])],
    creators: [...(source.value.creators || [])],
    license: source.value.license
      ? { ...source.value.license }
      : { type: null, notes: '' },
    links: [...(source.value.links || [])],
    thumbnails: [...(source.value.thumbnails || [])],
    tags: [...(source.value.tags || [])],
  }

  // 重置 Slug 驗證狀態
  editSourceSlugOk.value = true
  editSourceSlugError.value = ''
  editSourceSlugChecking.value = false

  showEditSourceDialog.value = true
}

// 更新來源
const updateSource = async () => {
  if (!editSource.value.type || !editSource.value.title) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請填寫必填欄位',
      life: 3000,
    })
    return
  }

  updatingSource.value = true

  try {
    const payload = {
      type: editSource.value.type,
      title: editSource.value.title,
      slug: editSource.value.slug || undefined,
      year: editSource.value.year || undefined,
      origin_country: editSource.value.origin_country || undefined,
      synopsis: editSource.value.synopsis || undefined,
      context: editSource.value.context || undefined,
      alt_titles: (editSource.value.alt_titles || []).filter(
        (s) => s && s.trim(),
      ),
      creators: (editSource.value.creators || [])
        .filter((c) => (c.role && c.role.trim()) || (c.name && c.name.trim()))
        .map((c) => ({
          role: c.role?.trim() || undefined,
          name: c.name?.trim() || undefined,
        })),
      license:
        editSource.value.license?.type || editSource.value.license?.notes
          ? {
              type: editSource.value.license.type || undefined,
              notes: editSource.value.license.notes || undefined,
            }
          : undefined,
      links: (editSource.value.links || [])
        .filter((l) => l && (l.url || l.label))
        .map((l) => ({ label: l.label || undefined, url: l.url || undefined })),
      thumbnails: (editSource.value.thumbnails || []).filter(
        (u) => u && u.trim(),
      ),
      tags: (editSource.value.tags || [])
        .map((t) => (t || '').toLowerCase().trim())
        .filter((t) => t),
    }

    const { data } = await sourceService.update(source.value._id, payload)

    // 更新本地來源資料
    source.value = data.data

    // 關閉對話框
    showEditSourceDialog.value = false

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '來源已更新',
      life: 3000,
    })

    // 如果 slug 有變更，需要重新導向
    if (editSource.value.slug && editSource.value.slug !== source.value.slug) {
      router.push(`/source/${editSource.value.slug}`)
    }
  } catch (error) {
    console.error('更新來源失敗:', error)
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: error.response?.data?.message || '更新來源時發生錯誤',
      life: 5000,
    })
  } finally {
    updatingSource.value = false
  }
}

// 新增/移除：別名
const addEditAltTitle = () => {
  editSource.value.alt_titles.push('')
}
const removeEditAltTitle = (index) => {
  editSource.value.alt_titles.splice(index, 1)
}

// 新增/移除：創作者
const addEditCreator = () => {
  editSource.value.creators.push({ role: '', name: '' })
}
const removeEditCreator = (index) => {
  editSource.value.creators.splice(index, 1)
}

// 新增/移除：外部連結
const addEditLink = () => {
  editSource.value.links.push({ label: '', url: '' })
}
const removeEditLink = (index) => {
  editSource.value.links.splice(index, 1)
}

// 新增/移除：縮圖
const addEditThumbnail = () => {
  editSource.value.thumbnails.push('')
}
const removeEditThumbnail = (index) => {
  editSource.value.thumbnails.splice(index, 1)
}

// 新增/移除：標籤
const addEditTag = () => {
  editSource.value.tags.push('')
}
const removeEditTag = (index) => {
  editSource.value.tags.splice(index, 1)
}

// 處理編輯來源 slug 輸入
const onEditSourceSlugInput = (event) => {
  // 只保留合法字元
  editSource.value.slug = event.target.value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')

  // 清除之前的計時器
  if (editSourceSlugCheckTimer) {
    clearTimeout(editSourceSlugCheckTimer)
  }

  // 設定新的計時器（debounce 500ms）
  editSourceSlugCheckTimer = setTimeout(() => {
    checkEditSourceSlugAvailable()
  }, 500)
}

// 檢查編輯來源 slug 是否可用
const checkEditSourceSlugAvailable = async () => {
  if (!editSource.value.slug) {
    editSourceSlugOk.value = true
    editSourceSlugError.value = ''
    return
  }

  // 先做本地驗證
  const validation = validateSlug(editSource.value.slug)
  if (!validation.valid) {
    editSourceSlugOk.value = false
    editSourceSlugError.value = validation.error
    return
  }

  // 檢查是否為保留字
  if (isReservedSlug(editSource.value.slug)) {
    editSourceSlugOk.value = false
    editSourceSlugError.value = '此 Slug 為保留字，請選擇其他名稱'
    return
  }

  editSourceSlugChecking.value = true
  editSourceSlugError.value = ''

  try {
    const response = await fetch(
      `${window.__VITE_API_URL__ || 'https://api.memedam.com'}/api/sources/slug-available?slug=${encodeURIComponent(editSource.value.slug)}&exclude_id=${source.value._id}`,
    )
    const data = await response.json()

    if (data.success && data.data.available) {
      editSourceSlugOk.value = true
      editSourceSlugError.value = ''
    } else {
      editSourceSlugOk.value = false
      editSourceSlugError.value = data.error || 'Slug 已被使用'
    }
  } catch (error) {
    console.error('檢查來源 slug 失敗:', error)
    // 發生錯誤時假設可用，讓後端做最終檢查
    editSourceSlugOk.value = true
    editSourceSlugError.value = ''
  } finally {
    editSourceSlugChecking.value = false
  }
}

// 顯示編輯場景對話框
const showEditSceneDialogFn = (scene) => {
  if (!scene) return

  editingScene.value = scene

  // 複製場景資料到編輯表單
  editScene.value = {
    title: scene.title || '',
    episode: scene.episode || '',
    quote: scene.quote || '',
    transcript: scene.transcript || '',
    description: scene.description || '',
    start_time: scene.start_time || null,
    end_time: scene.end_time || null,
    images: [...(scene.images || [])],
    video_url: scene.video_url || '',
    audio_url: scene.audio_url || '',
    tags: [...(scene.tags || [])],
  }

  showEditSceneDialog.value = true
}

// 更新場景
const updateScene = async () => {
  if (!editingScene.value || !editScene.value.title) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '請填寫必填欄位',
      life: 3000,
    })
    return
  }

  updatingScene.value = true

  try {
    const payload = {
      title: editScene.value.title,
      episode: editScene.value.episode || undefined,
      quote: editScene.value.quote || undefined,
      transcript: editScene.value.transcript || undefined,
      description: editScene.value.description || undefined,
      start_time: editScene.value.start_time || undefined,
      end_time: editScene.value.end_time || undefined,
      images: editScene.value.images.filter((img) => img),
      video_url: editScene.value.video_url || undefined,
      audio_url: editScene.value.audio_url || undefined,
      tags: editScene.value.tags
        .filter((tag) => tag)
        .map((tag) => tag.toLowerCase().trim()),
    }

    // 呼叫場景更新API
    const { data } = await sceneService.update(editingScene.value._id, payload)

    // 更新本地場景資料
    Object.assign(editingScene.value, data.data || payload)

    // 關閉對話框
    showEditSceneDialog.value = false
    editingScene.value = null

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '場景已更新',
      life: 3000,
    })

    // 重新載入場景列表
    loadScenes()
  } catch (error) {
    console.error('更新場景失敗:', error)
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: error.response?.data?.message || '更新場景時發生錯誤',
      life: 5000,
    })
  } finally {
    updatingScene.value = false
  }
}

// 新增/移除：場景圖片
const addEditSceneImage = () => {
  editScene.value.images.push('')
}
const removeEditSceneImage = (index) => {
  editScene.value.images.splice(index, 1)
}

// 新增/移除：場景標籤
const addEditSceneTag = () => {
  editScene.value.tags.push('')
}
const removeEditSceneTag = (index) => {
  editScene.value.tags.splice(index, 1)
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  loadMemes()
}

// 監聽路由變化
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      loadSource()
    }
  },
)

// 頁面標題
watch(source, (newSource) => {
  if (newSource) {
    document.title = `${newSource.title} — 出處 | 迷因典 MemeDam`
  }
})

// 初始化
onMounted(() => {
  loadSource()
})
</script>

<script>
export default {
  name: 'SourceDetailPage',
}
</script>

<route lang="yaml">
meta:
  title: '出處詳情'
  description: '查看出處的詳細資訊、場景和相關迷因。'
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
