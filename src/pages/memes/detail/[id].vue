<template>
  <div class="min-h-[calc(100vh-100px)]">
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
          <Button label="重新載入" @click="loadMeme" />
        </template>
      </Card>
    </div>

    <!-- 主要內容 -->
    <div v-else-if="meme" class="container mx-auto px-4 py-6">
      <div class="flex gap-6 max-w-[1400px] mx-auto">
        <!-- 左側主要內容 -->
        <div class="flex-1 space-y-6">
          <!-- 標題和內容展示區 -->
          <div
            id="content"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-800"
          >
            <!-- 標題區域 -->
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-surface-900 mb-2">
                  {{ meme.title }}
                </h1>
                <div
                  class="flex items-center text-sm text-surface-600 space-x-4"
                >
                  <span>
                    由
                    <router-link
                      v-if="meme.author && (meme.author._id || meme.author.id)"
                      :to="`/users/${meme.author._id || meme.author.id}`"
                      class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {{ authorName }}
                    </router-link>
                    <span v-else class="font-medium">{{ authorName }}</span>
                    發布
                  </span>
                  <span>{{ publishedTime }}</span>
                  <span>已瀏覽 {{ viewCount }} 次</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  v-if="canEdit"
                  icon="pi pi-pencil"
                  label="編輯"
                  severity="secondary"
                  size="small"
                  @click="editMeme"
                />
                <Button
                  v-if="canEdit"
                  icon="pi pi-cog"
                  label="側邊欄"
                  severity="secondary"
                  size="small"
                  @click="showSidebarEditor"
                />
                <Button
                  icon="pi pi-share-alt"
                  severity="secondary"
                  size="small"
                  @click="showShareOptions"
                  v-tooltip.bottom="'分享'"
                />
              </div>
            </div>

            <!-- 手機版基本資訊 -->
            <div v-if="!isDesktop" class="border-t pt-4 mb-6">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-surface-600">類型：</span
                  >{{ typeDisplayName }}
                </div>
                <div>
                  <span class="font-medium text-surface-600">按讚：</span
                  >{{ likesCount }}
                </div>
                <div>
                  <span class="font-medium text-surface-600">瀏覽：</span
                  >{{ viewCount }}
                </div>
                <div>
                  <span class="font-medium text-surface-600">評論：</span
                  >{{ commentsCount }}
                </div>
              </div>
            </div>

            <!-- 快速導航 -->
            <nav class="border-t pt-4 mb-6">
              <ScrollPanel style="width: 100%; height: 50px">
                <div class="flex space-x-6 text-sm">
                  <a href="#content" class="text-blue-600 hover:underline"
                    >內容</a
                  >
                  <a href="#details" class="text-blue-600 hover:underline"
                    >詳細資訊</a
                  >
                  <a href="#comments" class="text-blue-600 hover:underline"
                    >討論</a
                  >
                  <a href="#related" class="text-blue-600 hover:underline"
                    >相關迷因</a
                  >
                  <a href="#versions" class="text-blue-600 hover:underline"
                    >版本歷史</a
                  >
                </div>
              </ScrollPanel>
            </nav>

            <!-- 內容展示區 -->
            <div class="text-center mb-6">
              <!-- 圖片類型 -->
              <div v-if="meme.type === 'image' && meme.image_url" class="mb-4">
                <Image
                  :src="meme.image_url"
                  :alt="meme.title"
                  class="max-w-full max-h-[600px] mx-auto rounded-lg shadow-lg"
                  preview
                />
              </div>

              <!-- 影片類型 -->
              <div
                v-else-if="meme.type === 'video' && meme.video_url"
                class="mb-4"
              >
                <div
                  v-if="isExternalVideoUrl(meme.video_url)"
                  class="aspect-video max-w-4xl mx-auto"
                >
                  <iframe
                    :src="getEmbedUrl(meme.video_url)"
                    class="w-full h-full rounded-lg shadow-lg"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <video
                  v-else
                  controls
                  class="max-w-4xl w-full rounded-lg shadow-lg"
                  :poster="meme.image_url"
                >
                  <source :src="meme.video_url" type="video/mp4" />
                  您的瀏覽器不支援影片播放
                </video>
              </div>

              <!-- 音訊類型 -->
              <div
                v-else-if="meme.type === 'audio' && meme.audio_url"
                class="mb-4"
              >
                <div
                  v-if="isExternalAudioUrl(meme.audio_url)"
                  class="w-full max-w-2xl mx-auto h-32"
                >
                  <iframe
                    :src="getAudioEmbedUrl(meme.audio_url)"
                    class="w-full h-full rounded-lg shadow-lg"
                    frameborder="0"
                    allow="autoplay"
                  ></iframe>
                </div>
                <audio
                  v-else
                  controls
                  class="w-full max-w-2xl rounded-lg shadow-lg"
                  preload="metadata"
                >
                  <source :src="meme.audio_url" type="audio/mpeg" />
                  <source :src="meme.audio_url" type="audio/ogg" />
                  <source :src="meme.audio_url" type="audio/wav" />
                  您的瀏覽器不支援音訊播放
                </audio>
              </div>

              <!-- GIF類型 -->
              <div
                v-else-if="meme.type === 'gif' && meme.image_url"
                class="mb-4"
              >
                <img
                  :src="meme.image_url"
                  :alt="meme.title"
                  class="max-w-full max-h-[600px] mx-auto rounded-lg shadow-lg"
                />
              </div>

              <!-- 文字類型 -->
              <div v-else-if="meme.type === 'text'" class="mb-4">
                <TextMemeCard
                  :title="meme.title"
                  variant="random"
                  size="large"
                  :hover-effect="false"
                  :auto-resize="true"
                />
              </div>
            </div>

            <!-- 內容描述 - 使用 detail_markdown 欄位 -->
            <div
              v-if="meme.detail_markdown"
              class="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:text-surface-900 dark:prose-headings:text-white prose-p:text-surface-700 dark:prose-p:text-surface-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-surface-900 dark:prose-strong:text-white prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-blockquote:text-surface-600 dark:prose-blockquote:text-surface-400 prose-blockquote:border-blue-500"
            >
              <div v-html="renderMarkdown(meme.detail_markdown)"></div>
            </div>
            <!-- 如果沒有 detail_markdown，則顯示原本的 content -->
            <div v-else-if="meme.content" class="prose max-w-none">
              <p class="text-surface-700 leading-relaxed">{{ meme.content }}</p>
            </div>

            <!-- 互動按鈕 -->
            <div class="flex items-center justify-between mt-6 pt-6 border-t">
              <div class="flex items-center space-x-4">
                <Button
                  :icon="isLiked ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'"
                  :severity="isLiked ? 'success' : 'secondary'"
                  :label="likesCount.toString()"
                  @click="toggleLike"
                />
                <Button
                  :icon="
                    isDisliked ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'
                  "
                  :severity="isDisliked ? 'danger' : 'secondary'"
                  :label="dislikesCount.toString()"
                  @click="toggleDislike"
                />
                <Button
                  icon="pi pi-comment"
                  severity="secondary"
                  :label="commentsCount.toString()"
                  @click="scrollToComments"
                />
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  :icon="isCollected ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
                  :severity="isCollected ? 'warning' : 'secondary'"
                  @click="toggleCollection"
                  v-tooltip.top="isCollected ? '取消收藏' : '收藏'"
                />
              </div>
            </div>
          </div>

          <!-- 詳細資訊 -->
          <div
            id="details"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-800"
          >
            <h2 class="text-xl font-bold text-surface-900 mb-4">詳細資訊</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="font-semibold text-surface-700 mb-2">基本資訊</h3>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-medium">類型：</span>{{ typeDisplayName }}
                  </div>
                  <div>
                    <span class="font-medium">建立時間：</span
                    >{{ fullPublishedTime }}
                  </div>
                  <div
                    v-if="
                      (meme.modified_at || meme.modifiedAt) &&
                      (meme.modified_at !== meme.created_at ||
                        meme.modifiedAt !== meme.createdAt)
                    "
                  >
                    <span class="font-medium">最後修改：</span
                    >{{ lastUpdatedTime }}
                  </div>
                  <div>
                    <span class="font-medium">作者：</span>{{ authorName }}
                  </div>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-surface-700 mb-2">統計資料</h3>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-medium">瀏覽次數：</span>{{ viewCount }}
                  </div>
                  <div>
                    <span class="font-medium">按讚數：</span>{{ likesCount }}
                  </div>
                  <div>
                    <span class="font-medium">按噓數：</span>{{ dislikesCount }}
                  </div>
                  <div>
                    <span class="font-medium">評論數：</span>{{ commentsCount }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 瀏覽統計詳情 -->
            <div v-if="viewStats.total_views > 0" class="mt-6">
              <h3 class="font-semibold text-surface-700 mb-2">瀏覽統計詳情</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div>
                    <span class="font-medium">總瀏覽數：</span
                    >{{ viewStats.total_views }}
                  </div>
                  <div>
                    <span class="font-medium">有效瀏覽：</span
                    >{{ viewStats.effective_views }}
                  </div>
                  <div>
                    <span class="font-medium">重複瀏覽：</span
                    >{{ viewStats.duplicate_views }}
                  </div>
                </div>
                <div class="space-y-2">
                  <div>
                    <span class="font-medium">獨立用戶：</span
                    >{{ viewStats.unique_users }}
                  </div>
                  <div>
                    <span class="font-medium">平均瀏覽時間：</span
                    >{{ Math.round(viewStats.avg_duration) }}秒
                  </div>
                  <div>
                    <span class="font-medium">總瀏覽時間：</span
                    >{{ Math.round(viewStats.total_duration / 60) }}分鐘
                  </div>
                </div>
              </div>
            </div>

            <!-- 標籤 -->
            <div v-if="tags.length > 0" class="mt-6">
              <h3 class="font-semibold text-surface-700 mb-2">標籤</h3>
              <div class="flex flex-wrap gap-2">
                <Tag
                  v-for="tag in tags"
                  :key="tag._id"
                  :value="`#${tag.name}`"
                  severity="info"
                  class="cursor-pointer"
                  @click="navigateToTag(tag)"
                />
              </div>
            </div>
          </div>

          <!-- 手機板相關迷因 -->
          <div
            v-if="!isDesktop"
            id="related"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-800"
          >
            <h2 class="text-xl font-bold text-surface-900 mb-4">相關迷因</h2>
            <div v-if="relatedMemes.length > 0" class="space-y-3">
              <div
                v-for="relatedMeme in relatedMemes"
                :key="relatedMeme._id"
                class="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded cursor-pointer border"
                @click="navigateToMeme(relatedMeme)"
              >
                <div
                  class="w-20 h-20 bg-surface-100 rounded overflow-hidden flex-shrink-0"
                >
                  <img
                    v-if="relatedMeme.image_url"
                    :src="relatedMeme.image_url"
                    :alt="relatedMeme.title"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-surface-400"
                  >
                    <i class="pi pi-image"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm truncate">
                    {{ relatedMeme.title }}
                  </div>
                  <div class="text-xs text-surface-500 mt-1">
                    {{ relatedMeme.likes_count || 0 }} 讚 •
                    {{ relatedMeme.view_count || 0 }} 瀏覽
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-surface-500">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p>暫無相關迷因</p>
            </div>
          </div>

          <!-- 討論區 -->
          <div
            id="comments"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-800"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-surface-900">
                討論 ({{ commentsCount }})
              </h2>
              <Button
                v-if="userStore.isLoggedIn"
                label="新增留言"
                icon="pi pi-plus"
                @click="showCommentForm"
              />
            </div>

            <!-- 評論列表 -->
            <div v-if="comments.length > 0" class="space-y-4">
              <CommentItem
                v-for="comment in comments"
                :key="comment._id"
                :comment="comment"
                @reply="handleReply"
                @update="loadComments"
              />
            </div>
            <div v-else class="text-center py-8 text-surface-500">
              <i class="pi pi-comment text-4xl mb-2"></i>
              <p>還沒有人留言，成為第一個留言的人吧！</p>
            </div>

            <!-- 分頁 -->
            <div
              v-if="totalComments > pageSize"
              class="flex justify-center mt-6"
            >
              <Paginator
                :rows="pageSize"
                :total-records="totalComments"
                :first="(currentPage - 1) * pageSize"
                @page="onPageChange"
              />
            </div>
          </div>

          <!-- 版本歷史 -->
          <div
            id="versions"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-800"
          >
            <h2 class="text-xl font-bold text-surface-900 mb-4">版本歷史</h2>
            <div v-if="versions.length > 0" class="space-y-3">
              <div
                v-for="version in versions"
                :key="version._id"
                class="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div class="flex-1">
                  <div class="font-medium">
                    {{ version.description || '更新內容' }}
                  </div>
                  <div class="text-sm text-surface-600">
                    {{ formatDate(version.created_at) }} by
                    {{ version.editor?.username || '系統' }}
                  </div>
                </div>
                <Button
                  label="查看"
                  size="small"
                  severity="secondary"
                  @click="viewVersion"
                />
              </div>
            </div>
            <div v-else class="text-center py-4 text-surface-500">
              <p>目前沒有版本歷史記錄</p>
            </div>
          </div>
        </div>

        <!-- 右側資訊欄 - 僅桌面版顯示 -->
        <div v-if="isDesktop" class="w-80 space-y-6 s">
          <!-- 迷因資訊框 -->
          <Card class="shadow dark:bg-surface-800" v-if="!sidebarData">
            <template #title>
              <div
                class="text-lg font-bold text-center rounded-t-lg -m-6 mb-4 p-3"
              >
                {{ meme.title }}
              </div>
            </template>
            <template #content>
              <div class="space-y-3">
                <!-- 縮圖 -->
                <div class="flex justify-center">
                  <div
                    class="w-48 h-32 bg-surface-100 rounded border overflow-hidden"
                  >
                    <img
                      v-if="meme.image_url"
                      :src="meme.image_url"
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
                </div>

                <!-- 基本資訊表格 -->
                <table class="w-full text-sm">
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        類型
                      </td>
                      <td class="py-2">{{ typeDisplayName }}</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        作者
                      </td>
                      <td class="py-2">{{ authorName }}</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        發布時間
                      </td>
                      <td class="py-2">{{ shortPublishedTime }}</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        瀏覽次數
                      </td>
                      <td class="py-2">{{ viewCount }}</td>
                    </tr>
                    <tr class="border-b">
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        按讚
                      </td>
                      <td class="py-2">{{ likesCount }}</td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-2 font-medium text-surface-600">
                        評論
                      </td>
                      <td class="py-2">{{ commentsCount }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- 瀏覽統計詳情 -->
                <div
                  v-if="viewStats.total_views > 0"
                  class="mt-4 pt-4 border-t"
                >
                  <h4 class="font-semibold text-surface-700 mb-2 text-sm">
                    瀏覽統計
                  </h4>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                      <span class="text-surface-600">有效瀏覽：</span>
                      <span>{{ viewStats.effective_views }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-surface-600">獨立用戶：</span>
                      <span>{{ viewStats.unique_users }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-surface-600">平均時間：</span>
                      <span>{{ Math.round(viewStats.avg_duration) }}秒</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- 自定義側邊欄 -->
          <div
            v-if="sidebarData"
            class="p-4 rounded-lg dark:bg-surface-800"
            v-html="sidebarHtml"
          ></div>

          <!-- 相關迷因 -->
          <Card class="shadow dark:bg-surface-800" id="related">
            <template #title>
              <div class="text-lg font-bold">相關迷因</div>
            </template>
            <template #content>
              <div v-if="relatedMemes.length > 0" class="space-y-3">
                <div
                  v-for="relatedMeme in relatedMemes"
                  :key="relatedMeme._id"
                  class="flex items-center space-x-3 p-2 hover:bg-surface-50 rounded cursor-pointer"
                  @click="navigateToMeme(relatedMeme)"
                >
                  <div
                    class="w-16 h-16 bg-surface-100 rounded overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="relatedMeme.image_url"
                      :src="relatedMeme.image_url"
                      :alt="relatedMeme.title"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-surface-400"
                    >
                      <i class="pi pi-image"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">
                      {{ relatedMeme.title }}
                    </div>
                    <div class="text-xs text-surface-500">
                      {{ relatedMeme.likes_count || 0 }} 讚
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-surface-500">
                <p class="text-sm">暫無相關迷因</p>
              </div>
            </template>
          </Card>

          <!-- 工具箱 -->
          <Card class="shadow dark:bg-surface-800">
            <template #title>
              <div class="text-lg font-bold">工具</div>
            </template>
            <template #content>
              <div class="space-y-2">
                <Button
                  label="檢舉內容"
                  icon="pi pi-flag"
                  severity="contrast"
                  class="w-full justify-start"
                  size="small"
                  @click="reportMeme"
                />
                <Button
                  label="永久連結"
                  icon="pi pi-link"
                  severity="contrast"
                  class="w-full justify-start"
                  size="small"
                  @click="copyPermalink"
                />
                <Button
                  v-if="canEdit"
                  label="編輯迷因"
                  icon="pi pi-pencil"
                  severity="contrast"
                  class="w-full justify-start"
                  size="small"
                  @click="editMeme"
                />
                <Button
                  v-if="isDev"
                  label="測試瀏覽統計"
                  icon="pi pi-chart-bar"
                  severity="contrast"
                  class="w-full justify-start"
                  size="small"
                  @click="testViewStats"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 分享選單 -->
    <OverlayPanel ref="shareMenuRef">
      <div class="flex flex-col min-w-[160px]">
        <Button
          v-for="option in shareOptions"
          :key="option.value"
          :label="option.label"
          :icon="option.icon"
          text
          severity="contrast"
          class="justify-start w-full"
          @click="handleShare(option.value)"
        />
      </div>
    </OverlayPanel>

    <!-- 評論表單對話框 -->
    <Dialog
      v-model:visible="showCommentDialog"
      header="新增留言"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <CommentForm
        :meme-id="memeId"
        :parent-id="replyToComment"
        @submit="onCommentSubmit"
        @cancel="showCommentDialog = false"
      />
    </Dialog>

    <!-- 側邊欄編輯器對話框 -->
    <Dialog
      v-model:visible="showSidebarEditorDialog"
      header="編輯側邊欄"
      :style="{ width: '900px', maxHeight: '80vh' }"
      :modal="true"
    >
      <SidebarEditor
        :meme-id="memeId"
        :initial-data="sidebarEditorData"
        @update="onSidebarUpdate"
        @save="onSidebarSave"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'

// PrimeVue 組件
import Card from 'primevue/card'
import Button from 'primevue/button'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import ScrollPanel from 'primevue/scrollpanel'
import OverlayPanel from 'primevue/overlaypanel'
import Dialog from 'primevue/dialog'
import Paginator from 'primevue/paginator'

// 自定義組件
import TextMemeCard from '@/components/TextMemeCard.vue'
import CommentForm from '@/components/CommentForm.vue'
import CommentItem from '@/components/CommentItem.vue'
import SidebarEditor from '@/components/SidebarEditor.vue'

// 服務
import memeService from '@/services/memeService'
import commentService from '@/services/commentService'
import memeTagService from '@/services/memeTagService'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import collectionService from '@/services/collectionService'
import shareService from '@/services/shareService'
import memeVersionService from '@/services/memeVersionService'
import userService from '@/services/userService'
import viewService from '@/services/viewService'
import sidebarService from '@/services/sidebarService'
import recommendationService from '@/services/recommendationService'

// 工具函數
import { getId, formatPublishedTime, getMemeId } from '@/utils/dataUtils'
import {
  isExternalVideoUrl,
  getEmbedUrl,
  isExternalAudioUrl,
  getAudioEmbedUrl,
} from '@/utils/mediaUtils'
import { getShareOptions, handlePlatformShare } from '@/utils/shareUtils'
import { requireLogin } from '@/utils/authUtils'
import { isDevelopment } from '@/utils/envUtils'

// 路由和狀態
const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

// 響應式數據
const loading = ref(true)
const error = ref(null)
const meme = ref(null)
const tags = ref([])
const comments = ref([])
const relatedMemes = ref([])
const versions = ref([])

// 互動狀態
const isLiked = ref(false)
const isDisliked = ref(false)
const isCollected = ref(false)
const likesCount = ref(0)
const dislikesCount = ref(0)
const commentsCount = ref(0)

// 評論相關
const currentPage = ref(1)
const pageSize = ref(10)
const totalComments = ref(0)
const showCommentDialog = ref(false)
const replyToComment = ref(null)

// 側邊欄相關
const sidebarData = ref(null)
const sidebarHtml = ref('')
const showSidebarEditorDialog = ref(false)
const sidebarEditorData = ref({})

// 瀏覽統計
const viewCount = ref(0)
const viewStats = ref({
  total_views: 0,
  unique_users: 0,
  avg_duration: 0,
  total_duration: 0,
  duplicate_views: 0,
  effective_views: 0,
})

// 其他
const shareMenuRef = ref(null)
const isDev = isDevelopment()

// 桌面版判斷
const isDesktop = ref(false)

// 檢查螢幕尺寸
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024 // lg breakpoint
}

// 計算屬性
const memeId = computed(() => route.params.id)

const authorName = computed(() => {
  if (!meme.value?.author) return '匿名用戶'
  return (
    meme.value.author.display_name || meme.value.author.username || '匿名用戶'
  )
})

const publishedTime = computed(() => {
  if (!meme.value) return ''
  return formatPublishedTime(meme.value)
})

const fullPublishedTime = computed(() => {
  if (!meme.value) return ''
  // 優先使用 modified_at，如果沒有則使用 created_at
  let time =
    meme.value.modified_at ||
    meme.value.modifiedAt ||
    meme.value.created_at ||
    meme.value.createdAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return new Date(time).toLocaleString('zh-TW')
})

const shortPublishedTime = computed(() => {
  if (!meme.value) return ''
  // 優先使用 modified_at，如果沒有則使用 created_at
  let time =
    meme.value.modified_at ||
    meme.value.modifiedAt ||
    meme.value.created_at ||
    meme.value.createdAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return new Date(time).toLocaleDateString('zh-TW')
})

const lastUpdatedTime = computed(() => {
  if (!meme.value) return ''
  // 優先使用 modified_at，如果沒有則使用 updated_at
  let time =
    meme.value.modified_at ||
    meme.value.modifiedAt ||
    meme.value.updated_at ||
    meme.value.updatedAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return new Date(time).toLocaleString('zh-TW')
})

const typeDisplayName = computed(() => {
  const typeMap = {
    image: '圖片',
    video: '影片',
    audio: '音訊',
    gif: 'GIF動圖',
    text: '文字',
  }
  return typeMap[meme.value?.type] || '未知'
})

const canEdit = computed(() => {
  const currentUserId = getId(userStore.userId)
  const authorId = getId(meme.value?.author?._id || meme.value?.author?.id)
  const role = userStore.role
  return (
    role === 'admin' ||
    (currentUserId && authorId && currentUserId === authorId)
  )
})

const shareOptions = computed(() => getShareOptions())

// 渲染 Markdown 內容
const renderMarkdown = (markdown) => {
  if (!markdown) return ''

  // 簡單的 Markdown 渲染（可以根據需要擴展）
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗體
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜體
    .replace(/`(.*?)`/g, '<code class="bg-surface-100 px-1 rounded">$1</code>') // 行內代碼
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>') // 三級標題
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>') // 二級標題
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>') // 一級標題
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>') // 無序列表
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>') // 有序列表
    .replace(/\n\n/g, '</p><p class="mt-4">') // 段落
    .replace(/^(.+)$/gm, '<p class="leading-relaxed">$1</p>') // 一般文字
}

// 載入迷因資料
const loadMeme = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await memeService.get(memeId.value)
    if (response.data) {
      // 處理可能的嵌套數據結構
      const memeData = response.data.data || response.data

      // 載入作者資料（參考 memes/all.vue 的實現）
      try {
        if (memeData.author_id) {
          // 支援 { $oid: ... } 格式
          const authorId =
            typeof memeData.author_id === 'object' && memeData.author_id.$oid
              ? memeData.author_id.$oid
              : memeData.author_id
          const authorResponse = await userService.get(authorId)
          memeData.author = authorResponse.data.user || authorResponse.data
        } else if (!memeData.author || typeof memeData.author === 'string') {
          // 沒有作者 ID 或 author 只是字符串 ID，設定預設值
          memeData.author = {
            display_name: '匿名用戶',
            username: 'anonymous',
            avatar: null,
          }
        }
      } catch (error) {
        console.warn(`載入作者 ${memeData.author_id} 失敗:`, error.message)
        // 如果載入作者失敗，設定預設值
        memeData.author = {
          display_name: '未知用戶',
          username: 'unknown',
          avatar: null,
        }
      }

      meme.value = memeData

      // 更新統計數據 - 參考 MemeCard.vue 的處理方式
      likesCount.value = memeData.likes_count || memeData.like_count || 0
      dislikesCount.value =
        memeData.dislikes_count || memeData.dislike_count || 0
      commentsCount.value =
        memeData.comments_count || memeData.comment_count || 0
      viewCount.value = memeData.view_count || memeData.views || 0

      // 記錄瀏覽
      await recordView()

      // 載入相關數據
      await Promise.all([
        loadTags(),
        loadUserInteractionStatus(),
        loadComments(),
        loadRelatedMemes(),
        loadVersions(),
        loadViewStats(),
        loadSidebarData(),
      ])
    } else {
      error.value = '找不到該迷因'
    }
  } catch (err) {
    console.error('載入迷因失敗:', err)
    error.value =
      err.response?.status === 404 ? '找不到該迷因' : '載入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 載入標籤
const loadTags = async () => {
  try {
    // 統一取得 memeId，參考 MemeCard.vue 的處理方式
    let id = memeId.value
    if (!id) {
      console.warn('迷因 ID 不存在，跳過載入標籤')
      return
    }

    const response = await memeTagService.getTagsByMemeId(id)

    // 檢查資料結構，參考 MemeCard.vue
    if (response.data && Array.isArray(response.data)) {
      tags.value = response.data
    } else if (response.data && Array.isArray(response.data.tags)) {
      tags.value = response.data.tags
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      tags.value = response.data.data
    } else {
      console.warn('標籤資料格式不正確:', response.data)
      tags.value = []
    }
  } catch (error) {
    console.error('載入標籤失敗:', error)
    tags.value = []
  }
}

// 載入用戶互動狀態
const loadUserInteractionStatus = async () => {
  try {
    if (!memeId.value) return

    // 檢查當前用戶的互動狀態（如果已登入）
    if (userStore.userId) {
      // 檢查按讚狀態
      try {
        const likeResponse = await likeService.getAll()
        const userLikes = likeResponse.data.filter(
          (like) =>
            like.meme_id === memeId.value && like.user_id === userStore.userId,
        )
        isLiked.value = userLikes.length > 0
      } catch (error) {
        console.error('檢查按讚狀態失敗:', error)
      }

      // 檢查按噓狀態
      try {
        const dislikeResponse = await dislikeService.getAll()
        const userDislikes = dislikeResponse.data.filter(
          (dislike) =>
            dislike.meme_id === memeId.value &&
            dislike.user_id === userStore.userId,
        )
        isDisliked.value = userDislikes.length > 0
      } catch (error) {
        console.error('檢查按噓狀態失敗:', error)
      }

      // 檢查收藏狀態
      // TODO: 實作收藏狀態檢查
    }

    // 獲取最新的統計資料（參考 MemeCard.vue）
    try {
      const memeResponse = await memeService.get(memeId.value)
      if (memeResponse.data) {
        // 處理可能的嵌套數據結構
        const memeData = memeResponse.data.data || memeResponse.data

        // 更新統計數據
        const newLikesCount = memeData.likes_count || memeData.like_count || 0
        const newDislikesCount =
          memeData.dislikes_count || memeData.dislike_count || 0
        const newCommentsCount =
          memeData.comments_count || memeData.comment_count || 0

        likesCount.value = newLikesCount
        dislikesCount.value = newDislikesCount
        commentsCount.value = newCommentsCount
      }
    } catch (error) {
      console.error('獲取統計資料失敗:', error)
    }
  } catch (error) {
    console.error('載入用戶互動狀態失敗:', error)
  }
}

// 載入評論
const loadComments = async () => {
  try {
    const response = await commentService.getByMemeId(memeId.value)

    // 參考 CommentsDialog.vue 的處理方式
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      comments.value = response.data.data
      totalComments.value = response.data.data.length
    } else if (response.data && Array.isArray(response.data)) {
      comments.value = response.data
      totalComments.value = response.data.length
    } else {
      comments.value = []
      totalComments.value = 0
    }
  } catch (error) {
    console.error('載入評論失敗:', error)
    comments.value = []
    totalComments.value = 0
  }
}

// 載入相關迷因
const loadRelatedMemes = async () => {
  try {
    console.log('開始載入相關迷因，memeId:', memeId.value)

    // 使用推薦服務取得相似迷因
    const response = await recommendationService.getSimilarRecommendations(
      memeId.value,
      {
        limit: 5,
      },
    )

    console.log('推薦服務回應:', response)

    if (
      response.data &&
      response.data.data &&
      response.data.data.recommendations
    ) {
      // 處理推薦服務的回應
      const recommendations = response.data.data.recommendations
      const memesArray = Array.isArray(recommendations) ? recommendations : []
      relatedMemes.value = memesArray
        .filter((item) => getMemeId(item) !== memeId.value)
        .slice(0, 5)

      console.log('設定相關迷因:', relatedMemes.value)
    } else {
      console.log('推薦服務沒有結果，嘗試回退到標籤推薦')
      // 如果推薦服務沒有結果，回退到基於標籤的推薦
      if (tags.value.length > 0) {
        const tagNames = tags.value.map((tag) => tag.name)
        const fallbackResponse = await memeService.getByTags(tagNames, {
          limit: 5,
        })
        if (fallbackResponse.data) {
          const memesData = fallbackResponse.data.data || fallbackResponse.data
          const memesArray = Array.isArray(memesData) ? memesData : []
          relatedMemes.value = memesArray
            .filter((item) => getMemeId(item) !== memeId.value)
            .slice(0, 5)
          console.log('回退標籤推薦結果:', relatedMemes.value)
        }
      }
    }
  } catch (error) {
    console.error('載入相關迷因失敗:', error)
    // 錯誤時也嘗試回退到標籤推薦
    try {
      if (tags.value.length > 0) {
        const tagNames = tags.value.map((tag) => tag.name)
        const fallbackResponse = await memeService.getByTags(tagNames, {
          limit: 5,
        })
        if (fallbackResponse.data) {
          const memesData = fallbackResponse.data.data || fallbackResponse.data
          const memesArray = Array.isArray(memesData) ? memesData : []
          relatedMemes.value = memesArray
            .filter((item) => getMemeId(item) !== memeId.value)
            .slice(0, 5)
          console.log('錯誤回退標籤推薦結果:', relatedMemes.value)
        }
      }
    } catch (fallbackError) {
      console.error('回退推薦也失敗:', fallbackError)
      relatedMemes.value = []
    }
  }
}

// 載入版本歷史
const loadVersions = async () => {
  try {
    const response = await memeVersionService.getByMemeId(memeId.value)
    if (response.data) {
      // 處理可能的嵌套數據結構
      const versionsData = response.data.data || response.data
      versions.value = Array.isArray(versionsData) ? versionsData : []
    } else {
      versions.value = []
    }
  } catch (error) {
    console.error('載入版本歷史失敗:', error)
    versions.value = []
  }
}

// 記錄瀏覽
const recordView = async () => {
  try {
    const viewData = {
      duration: 0, // 初始瀏覽時間，後續可以根據實際瀏覽時間更新
      referrer: document.referrer || '',
    }

    const response = await viewService.recordView(memeId.value, viewData)

    if (response.data && response.data.data) {
      const { isDuplicate } = response.data.data
      if (!isDuplicate) {
        // 更新瀏覽次數
        viewCount.value += 1
      }
    }
  } catch (error) {
    console.error('記錄瀏覽失敗:', error)
  }
}

// 載入瀏覽統計
const loadViewStats = async () => {
  try {
    const response = await viewService.getStats(memeId.value, 'all')

    if (response.data && response.data.data) {
      const stats = response.data.data

      // 更新統計數據
      viewCount.value =
        stats.effective_views || stats.total_views || viewCount.value

      // 更新詳細統計數據
      viewStats.value = {
        total_views: stats.total_views || 0,
        unique_users: stats.unique_users || 0,
        avg_duration: stats.avg_duration || 0,
        total_duration: stats.total_duration || 0,
        duplicate_views: stats.duplicate_views || 0,
        effective_views: stats.effective_views || 0,
      }
    }
  } catch (error) {
    console.error('載入瀏覽統計失敗:', error)
  }
}

// 載入側邊欄資料
const loadSidebarData = async () => {
  try {
    const response = await sidebarService.getMemeSidebar(memeId.value)
    if (response.data) {
      sidebarData.value = response.data.data
      sidebarHtml.value = response.data.renderedHtml
      sidebarEditorData.value = {
        template: response.data.template,
        data: response.data.data,
      }
    }
  } catch (error) {
    console.error('載入側邊欄資料失敗:', error)
    console.error('錯誤詳情:', error.response?.data || error.message)

    // 檢查是否是 404 錯誤（迷因不存在）
    if (error.response?.status === 404) {
      console.log('迷因不存在或沒有側邊欄資料，使用預設值')
    }

    // 如果沒有側邊欄資料，使用預設值
    sidebarData.value = null
    sidebarHtml.value = ''
  }
}

// 互動功能
const toggleLike = async () => {
  if (!requireLogin(userStore, toast)) return

  try {
    await likeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    isLiked.value = !isLiked.value
    if (isLiked.value && isDisliked.value) {
      isDisliked.value = false
    }

    await loadUserInteractionStatus()
  } catch (error) {
    console.error('按讚操作失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '按讚操作失敗',
      life: 3000,
    })
  }
}

const toggleDislike = async () => {
  if (!requireLogin(userStore, toast)) return

  try {
    await dislikeService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    isDisliked.value = !isDisliked.value
    if (isDisliked.value && isLiked.value) {
      isLiked.value = false
    }

    await loadUserInteractionStatus()
  } catch (error) {
    console.error('按噓操作失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '按噓操作失敗',
      life: 3000,
    })
  }
}

const toggleCollection = async () => {
  if (!requireLogin(userStore, toast)) return

  try {
    await collectionService.toggle({
      meme_id: memeId.value,
      type: 'meme',
      user_id: userStore.userId,
    })

    isCollected.value = !isCollected.value

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: isCollected.value ? '已加入收藏' : '已取消收藏',
      life: 3000,
    })
  } catch (error) {
    console.error('收藏操作失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '收藏操作失敗',
      life: 3000,
    })
  }
}

// 導航功能
const navigateToTag = (tag) => {
  router.push(`/memes/all?tags=${encodeURIComponent(tag.name)}`)
}

const navigateToMeme = (targetMeme) => {
  router.push(`/memes/detail/${getMemeId(targetMeme)}`)
}

const scrollToComments = () => {
  document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
}

// 分享功能
const showShareOptions = (event) => {
  shareMenuRef.value.toggle(event)
}

const handleShare = async (platform) => {
  try {
    const shareData = {
      shareUrl: `${window.location.origin}/memes/detail/${memeId.value}`,
      shareTitle: meme.value.title || '有趣的迷因',
      shareText: meme.value.content || '',
    }

    const result = await handlePlatformShare(platform, shareData)

    if (result) {
      toast.add({
        severity: result.type,
        summary:
          result.type === 'success'
            ? '成功'
            : result.type === 'info'
              ? '提示'
              : '錯誤',
        detail: result.message,
        life: result.type === 'info' ? 5000 : 3000,
      })
    }

    // 記錄分享行為
    if (userStore.isLoggedIn) {
      await shareService.create({
        meme_id: memeId.value,
        platform_detail: platform,
      })
    }
  } catch (error) {
    console.error('分享失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '分享失敗，請稍後再試',
      life: 3000,
    })
  }
}

// 其他功能
const editMeme = () => {
  router.push(`/memes/edit/${memeId.value}`)
}

const showSidebarEditor = () => {
  showSidebarEditorDialog.value = true
}

const onSidebarUpdate = (data) => {
  // 即時更新預覽
  sidebarEditorData.value = data
}

const onSidebarSave = async (_data) => {
  // 保存成功後更新側邊欄顯示
  await loadSidebarData()
  showSidebarEditorDialog.value = false

  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '側邊欄已更新',
    life: 3000,
  })
}

const reportMeme = () => {
  // TODO: 實作檢舉功能
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '檢舉功能即將推出',
    life: 3000,
  })
}

const copyPermalink = async () => {
  try {
    const url = `${window.location.origin}/memes/detail/${memeId.value}`
    await navigator.clipboard.writeText(url)
    toast.add({
      severity: 'success',
      summary: '已複製',
      detail: '永久連結已複製到剪貼簿',
      life: 3000,
    })
  } catch (error) {
    console.error('複製連結失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '無法複製連結',
      life: 3000,
    })
  }
}

// 評論功能
const showCommentForm = () => {
  if (!requireLogin(userStore, toast)) {
    router.push('/login')
    return
  }
  replyToComment.value = null
  showCommentDialog.value = true
}

const handleReply = (commentId) => {
  if (!requireLogin(userStore, toast)) {
    router.push('/login')
    return
  }
  replyToComment.value = commentId
  showCommentDialog.value = true
}

const onCommentSubmit = () => {
  showCommentDialog.value = false
  replyToComment.value = null
  loadComments()
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  loadComments()
}

// 版本相關
const viewVersion = () => {
  // TODO: 實作版本查看功能
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '版本查看功能即將推出',
    life: 3000,
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  let time = dateString
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  return new Date(time).toLocaleString('zh-TW')
}

// 測試瀏覽統計功能
const testViewStats = async () => {
  try {
    toast.add({
      severity: 'info',
      summary: '測試中',
      detail: '正在測試瀏覽統計功能...',
      life: 2000,
    })

    // 測試記錄瀏覽
    const testViewData = {
      duration: 30,
      referrer: 'test',
    }

    await viewService.recordView(memeId.value, testViewData)

    // 測試取得統計
    await viewService.getStats(memeId.value, 'all')

    // 更新統計數據
    await loadViewStats()

    toast.add({
      severity: 'success',
      summary: '測試完成',
      detail: '瀏覽統計功能測試完成',
      life: 3000,
    })
  } catch (error) {
    console.error('測試瀏覽統計失敗:', error)
    toast.add({
      severity: 'error',
      summary: '測試失敗',
      detail: '瀏覽統計功能測試失敗',
      life: 3000,
    })
  }
}

// 監聽路由變化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadMeme()
    }
  },
)

// 頁面標題
watch(meme, (newMeme) => {
  if (newMeme) {
    document.title = `${newMeme.title} | 迷因典 MemeDam`
  }
})

// 瀏覽時間追蹤
const pageEnterTime = ref(null)
const pageEnterRoute = ref(null) // 記錄進入頁面時的路由

// 記錄頁面離開時的瀏覽時間
const recordPageLeave = () => {
  // 檢查是否從迷因詳情頁面進入
  const wasOnMemeDetailPage = pageEnterRoute.value?.includes('/memes/detail/')
  const currentMemeId =
    memeId.value || route.params.id || pageEnterRoute.value?.split('/').pop()

  if (pageEnterTime.value && currentMemeId && wasOnMemeDetailPage) {
    const duration = Math.floor((Date.now() - pageEnterTime.value) / 1000)

    if (duration > 0) {
      const leaveViewData = {
        duration,
        referrer: document.referrer || '',
      }

      // 異步記錄瀏覽時間，不等待回應
      viewService.recordView(currentMemeId, leaveViewData).catch((error) => {
        console.error('記錄瀏覽時間失敗:', error)
      })
    }
  }
}

// 初始化
onMounted(() => {
  pageEnterTime.value = Date.now()
  pageEnterRoute.value = route.fullPath

  loadMeme()

  // 監聽螢幕尺寸變化
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  // 監聽頁面離開事件
  window.addEventListener('beforeunload', recordPageLeave)
  window.addEventListener('pagehide', recordPageLeave)
})

// 清理事件監聽器
onUnmounted(() => {
  // 檢查是否從迷因詳情頁面進入
  const wasOnMemeDetailPage = pageEnterRoute.value?.includes('/memes/detail/')
  if (wasOnMemeDetailPage) {
    recordPageLeave()
  }

  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('beforeunload', recordPageLeave)
  window.removeEventListener('pagehide', recordPageLeave)
})
</script>

<script>
export default {
  name: 'MemeDetailPage',
}
</script>

<route lang="yaml">
meta:
  title: '迷因詳情'
  description: '閱讀迷因的標題、內容、標籤與互動統計，查看相關迷因並參與討論。'
  login: ''
  admin: false
</route>

<style scoped>
/* TipTap 內容使用 Tailwind prose 類別，無需額外樣式 */

/* 保留舊的 prose 樣式給非 TipTap 內容 */
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1em;
  line-height: 1.6;
}

/* 平滑滾動 */
html {
  scroll-behavior: smooth;
}

/* 表格樣式 */
table td {
  vertical-align: top;
}
</style>
