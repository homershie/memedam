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
          <Button label="重新載入" @click="loadMeme" />
        </template>
      </Card>
    </div>

    <!-- 主要內容 -->
    <div v-else-if="meme" class="mx-auto w-6xl px-4 py-6">
      <!-- 麵包屑導航 -->
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-6">
        <template #item="{ item }">
          <router-link
            v-if="item.url"
            :to="item.url"
            class="hover:text-primary-600 transition-colors"
          >
            {{ item.label }}
          </router-link>
          <span v-else class="text-surface-800 font-medium">{{
            item.label
          }}</span>
        </template>
      </Breadcrumb>

      <!-- 標題區域 -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-surface-900 mb-2">
            {{ meme.title }}
          </h1>
          <!-- 標籤 -->
          <div class="flex items-center space-x-2">
            <Tag
              v-for="tag in tags"
              :key="tag._id || tag.id"
              :label="tag.name"
              class="bg-primary-50 text-primary-700 cursor-pointer hover:bg-primary-100 transition-colors"
              @click="navigateToTag(tag)"
            />
          </div>
          <div
            class="flex items-center text-sm text-surface-600 space-x-4 dark:text-surface-400"
          >
            <span>
              由
              <router-link
                v-if="meme.author && (meme.author._id || meme.author.id)"
                :to="`/users/${meme.author._id || meme.author.id}`"
                class="text-primary-500 hover:text-primary-700 font-medium transition-colors"
              >
                {{ authorName }}
              </router-link>
              <span v-else class="font-medium">{{ authorName }}</span>
              發布
            </span>
          </div>
          <div
            class="flex items-center text-sm text-surface-600 space-x-4 dark:text-surface-400"
          >
            <span>{{ lastUpdatedTime }}</span>
            <span>已瀏覽 {{ viewCount }} 次</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            v-if="canEdit && isDesktop"
            icon="pi pi-pencil"
            label="編輯"
            severity="secondary"
            size="small"
            @click="editMeme"
          />
          <Button
            v-if="canEdit && isDesktop"
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
          <Button
            icon="pi pi-flag"
            severity="secondary"
            size="small"
            @click="reportMeme"
          />
        </div>
      </div>

      <Divider class="my-6" />

      <!-- 出處資訊卡 -->
      <SourceCard
        v-if="source"
        :source="source"
        :scene="scene"
        :from-source="fromSource"
      />

      <!-- 使用 float 實現維基百科式文繞圖效果 -->
      <div class="relative">
        <!-- 右側側邊欄 - 使用 float，僅在大螢幕上浮動 -->
        <div
          class="lg:float-right lg:ml-6 lg:mb-6 w-full max-w-80 lg:w-80 flex-shrink-0 space-y-6"
        >
          <!-- 迷因資訊框 -->
          <Card
            class="shadow-lg border border-surface-200 dark:bg-surface-800 dark:border-surface-700"
            v-if="!sidebarData"
          >
            <template #title>
              <div
                class="text-lg font-bold text-center rounded-t-lg -m-6 mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
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
              </div>
            </template>
          </Card>

          <!-- 自定義側邊欄 -->
          <div
            v-if="sidebarData"
            class="p-4 rounded-lg shadow-sm border border-surface-200 dark:bg-surface-800 dark:border-surface-700"
            v-html="sidebarHtml"
          ></div>
        </div>

        <!-- 主要內容區域 -->
        <div class="space-y-6">
          <!-- 標題和內容展示區 -->
          <div id="content">
            <!-- 內容描述 - 使用 detail_content 欄位 -->
            <div v-if="meme.detail_content" class="tiptap-content">
              <div v-html="renderTipTapContent(meme.detail_content)"></div>
            </div>
            <!-- 如果沒有 detail_content，則顯示原本的 content -->
            <div v-else-if="meme.content" class="prose max-w-none">
              <p class="text-surface-700 leading-relaxed">{{ meme.content }}</p>
            </div>

            <!-- 引用來源（文章參考來源，來自 meme.sources） -->
            <div v-if="sources && sources.length" class="mt-6">
              <h4 class="text-lg font-bold text-surface-900 mb-2">引用來源</h4>
              <div
                v-for="citation in sources"
                :key="citation._id || citation.url || citation.name"
              >
                <a
                  :href="citation.url"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  >{{ citation.name || citation.url }}</a
                >
              </div>
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

          <!-- 相關迷因 -->
          <div
            id="related"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-900"
          >
            <h2 class="text-xl font-bold text-surface-900 mb-4">相關迷因</h2>
            <div
              v-if="relatedMemes.length > 0"
              class="grid grid-cols-3 gap-4 md:grid-cols-5"
            >
              <div
                v-for="relatedMeme in relatedMemes"
                :key="relatedMeme._id"
                class="flex flex-col items-center p-3 hover:bg-surface-50 dark:hover:bg-surface-700 rounded cursor-pointer border dark:border-surface-600"
                @click="navigateToMeme(relatedMeme)"
              >
                <div
                  class="w-full h-auto aspect-square bg-surface-100 rounded overflow-hidden"
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
                <div class="w-full text-center mt-2">
                  <div class="font-medium text-sm truncate px-2">
                    {{ relatedMeme.title }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-surface-500">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p>暫無相關迷因</p>
            </div>
          </div>

          <!-- 留言區 -->
          <div
            id="comments"
            class="bg-white rounded-lg shadow p-6 dark:bg-surface-900"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-surface-900">
                留言 <span class="text-base">({{ commentsCount }})</span>
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
        </div>

        <!-- 清除浮動 -->
        <div class="clear-both"></div>
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

    <!-- 檢舉對話框 -->
    <ReportDialog
      v-model:visible="showReportDialog"
      target-type="meme"
      :target-id="memeId"
      :target-info="{
        type: 'meme',
        title: meme?.title,
        author: authorName,
      }"
      @submitted="onReportSubmitted"
    />
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
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import OverlayPanel from 'primevue/overlaypanel'
import Dialog from 'primevue/dialog'
import ReportDialog from '@/components/ReportDialog.vue'
import Paginator from 'primevue/paginator'
import Breadcrumb from 'primevue/breadcrumb'

// 自定義組件
import CommentForm from '@/components/CommentForm.vue'
import CommentItem from '@/components/CommentItem.vue'
import SidebarEditor from '@/components/SidebarEditor.vue'
import SourceCard from '@/components/SourceCard.vue'

// 服務
import memeService from '@/services/memeService'
import commentService from '@/services/commentService'
import memeTagService from '@/services/memeTagService'
import likeService from '@/services/likeService'
import dislikeService from '@/services/dislikeService'
import collectionService from '@/services/collectionService'
import shareService from '@/services/shareService'
import memeVersionService from '@/services/memeVersionService'
import viewService from '@/services/viewService'
import sidebarService from '@/services/sidebarService'
import recommendationService from '@/services/recommendationService'

// 工具函數
import { getId, getMemeId } from '@/utils/dataUtils'
import { isExternalVideoUrl, getEmbedUrl } from '@/utils/mediaUtils'
import { getShareOptions, handlePlatformShare } from '@/utils/shareUtils'
import { requireLogin } from '@/utils/authUtils'

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

// 麵包屑相關
const breadcrumbHome = ref({
  icon: 'pi pi-home',
  url: '/',
})

const breadcrumbItems = computed(() => {
  if (!meme.value) return []

  return [
    {
      label: '迷因',
      url: '/memes/all',
    },
    {
      label: meme.value.title,
      url: null, // 當前頁面，不設連結
    },
  ]
})

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

// 檢舉相關
const showReportDialog = ref(false)

// 瀏覽統計
const viewCount = ref(0)

// 出處相關
const source = ref(null)
const scene = ref(null)
const fromSource = ref([])

// 其他
const shareMenuRef = ref(null)

// 桌面版判斷
const isDesktop = ref(false)

// 檢查螢幕尺寸
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024 // lg breakpoint
}

// 計算屬性
const memeId = computed(() => route.params.slug)

const authorName = computed(() => {
  if (!meme.value?.author) return '匿名用戶'
  return (
    meme.value.author.display_name || meme.value.author.username || '匿名用戶'
  )
})

const shortPublishedTime = computed(() => {
  if (!meme.value) return ''
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
  let time =
    meme.value.modified_at ||
    meme.value.modifiedAt ||
    meme.value.updated_at ||
    meme.value.updatedAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return (
    new Date(time).toLocaleDateString('zh-TW') +
    ' ' +
    new Date(time).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  )
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

// 文章引用與參考來源（與迷因來源卡片 `source` 不同）
const sources = computed(() => {
  const list = meme.value?.sources
  return Array.isArray(list)
    ? list.filter((item) => item && (item.name || item.url))
    : []
})

// 渲染 TipTap JSON 內容
const renderTipTapContent = (content) => {
  if (!content) return ''

  // 如果是字串，可能是舊的 markdown 格式，使用原本的處理方式
  if (typeof content === 'string') {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗體
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜體
      .replace(
        /`(.*?)`/g,
        '<code class="bg-surface-100 px-1 rounded">$1</code>',
      ) // 行內代碼
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>',
      ) // 三級標題
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>',
      ) // 二級標題
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>',
      ) // 一級標題
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>') // 無序列表
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>') // 有序列表
      .replace(/\n\n/g, '</p><p class="mt-4">') // 段落
      .replace(/^(.+)$/gm, '<p class="leading-relaxed">$1</p>') // 一般文字
  }

  // 如果是 TipTap JSON 格式
  if (
    typeof content === 'object' &&
    content.type === 'doc' &&
    content.content
  ) {
    return renderTipTapNodes(content.content)
  }

  return ''
}

// 遞迴渲染 TipTap 節點
const renderTipTapNodes = (nodes) => {
  if (!Array.isArray(nodes)) return ''

  return nodes
    .map((node) => {
      switch (node.type) {
        case 'paragraph':
          return `<p>${renderTipTapMarks(node.content)}</p>`

        case 'heading': {
          const level = node.attrs?.level || 1
          return `<h${level}>${renderTipTapMarks(node.content)}</h${level}>`
        }

        case 'image': {
          const {
            src,
            alt,
            annotation,
            size = 'm',
            orientation = 'landscape',
          } = node.attrs || {}

          // 根據尺寸和方向設定樣式
          const getSizeStyles = (size, orientation) => {
            const landscapeMap = {
              s: { width: '320px', maxWidth: '320px' },
              m: { width: '640px', maxWidth: '640px' },
              l: { width: '960px', maxWidth: '960px' },
              full: { width: '100%', maxWidth: '100%' },
            }
            const portraitMap = {
              s: { width: '240px', maxWidth: '240px' },
              m: { width: '480px', maxWidth: '480px' },
              l: { width: '720px', maxWidth: '720px' },
              full: { width: '100%', maxWidth: '100%' },
            }
            const sizeMap =
              orientation === 'portrait' ? portraitMap : landscapeMap
            return sizeMap[size] || sizeMap.m
          }

          const sizeStyles = getSizeStyles(size, orientation)
          const imageStyle =
            size === 'full'
              ? 'width: 100%; max-width: 100%; height: auto; display: block;'
              : `width: 100%; max-width: ${sizeStyles.maxWidth}; height: auto; display: block;`

          let imageHtml = `<div class="custom-image-wrapper" style="width: 100%; max-width: ${sizeStyles.maxWidth};"><img src="${src}" alt="${alt || ''}" class="custom-image" style="${imageStyle}" />`
          if (annotation) {
            imageHtml += `<p class="image-annotation">${annotation}</p>`
          }
          imageHtml += `</div>`
          return imageHtml
        }

        case 'videoEmbed': {
          const {
            src: videoSrc,
            size = 'm',
            orientation = 'landscape',
            annotation,
          } = node.attrs || {}

          if (videoSrc && isExternalVideoUrl(videoSrc)) {
            // 根據尺寸和方向設定樣式
            const getSizeStyles = (size, orientation) => {
              const landscapeMap = {
                s: { width: '100%', maxWidth: '480px' },
                m: { width: '100%', maxWidth: '640px' },
                l: { width: '100%', maxWidth: '960px' },
                full: { width: '100%', maxWidth: 'none' },
              }
              const portraitMap = {
                s: { width: '100%', maxWidth: '360px' },
                m: { width: '100%', maxWidth: '450px' },
                l: { width: '100%', maxWidth: '540px' },
                full: { width: '100%', maxWidth: 'none' },
              }
              const sizeMap =
                orientation === 'portrait' ? portraitMap : landscapeMap
              return sizeMap[size] || sizeMap.m
            }

            const sizeStyles = getSizeStyles(size, orientation)
            const aspectRatio = orientation === 'portrait' ? '9/16' : '16/9'

            let videoHtml = `<div class="video-embed-wrapper" style="width: 100%; max-width: ${sizeStyles.maxWidth};">
            <div class="video-embed-container">
            <iframe src="${getEmbedUrl(videoSrc)}"
                    class="video-embed-iframe"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style="aspect-ratio: ${aspectRatio};">
            </iframe>
          </div>`

            if (annotation) {
              videoHtml += `<p class="video-annotation">${annotation}</p>`
            }

            videoHtml += `</div>`
            return videoHtml
          }
          return ''
        }

        case 'bulletList':
          return `<ul>${renderTipTapNodes(node.content)}</ul>`

        case 'orderedList':
          return `<ol>${renderTipTapNodes(node.content)}</ol>`

        case 'listItem':
          return `<li>${renderTipTapMarks(node.content)}</li>`

        case 'blockquote':
          return `<blockquote >${renderTipTapMarks(node.content)}</blockquote>`

        case 'codeBlock':
          return `<pre><code>${node.content?.[0]?.text || ''}</code></pre>`

        case 'horizontalRule':
          return `<hr />`

        default:
          return ''
      }
    })
    .join('')
}

// 渲染 TipTap 標記
const renderTipTapMarks = (content) => {
  if (!Array.isArray(content)) return ''

  return content
    .map((item) => {
      if (item.type === 'text') {
        let text = item.text || ''

        // 處理標記
        if (item.marks) {
          item.marks.forEach((mark) => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`
                break
              case 'italic':
                text = `<em>${text}</em>`
                break
              case 'underline':
                text = `<u>${text}</u>`
                break
              case 'strike':
                text = `<del>${text}</del>`
                break
              case 'code':
                text = `<code class="bg-surface-100 text-surface-800 p-1 rounded-md dark:bg-surface-900 dark:text-surface-300 font-mono">${text}</code>`
                break
              case 'link': {
                const { href, target, rel } = mark.attrs || {}
                text = `<a href="${href}" target="${target || '_blank'}" rel="${rel || 'noopener noreferrer'}" class="decoration-0 cursor-pointer font-medium text-surface-800 transition-all p-1 dark:text-surface-300 hover:text-primary-500 underline">${text}</a>`
                break
              }
            }
          })
        }

        return text
      }

      if (item.type === 'hardBreak') {
        return '<br />'
      }

      return ''
    })
    .join('')
}

// 載入迷因資料
const loadMeme = async () => {
  try {
    loading.value = true
    error.value = null

    // 使用 bundle API 取得迷因及相關資料
    const response = await memeService.getBundle(memeId.value, {
      include: 'scene,source,from_source',
    })

    if (response.data && response.data.data) {
      const bundleData = response.data.data

      // 設定迷因資料
      meme.value = bundleData.meme

      // 設定出處相關資料
      source.value = bundleData.source || null
      scene.value = bundleData.scene || null
      fromSource.value = bundleData.from_source || []

      // 更新統計數據
      likesCount.value = meme.value.likes_count || meme.value.like_count || 0
      dislikesCount.value =
        meme.value.dislikes_count || meme.value.dislike_count || 0
      commentsCount.value =
        meme.value.comments_count || meme.value.comment_count || 0
      viewCount.value = meme.value.view_count || meme.value.views || 0

      // 記錄瀏覽
      await recordView()

      // 載入相關數據 - 使用 Promise.allSettled 避免單一服務失敗影響整體
      const results = await Promise.allSettled([
        loadTags(),
        loadUserInteractionStatus(),
        loadComments(),
        loadRelatedMemes(),
        loadVersions(),
        loadSidebarData(),
      ])

      // 記錄失敗的服務
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const services = [
            'loadTags',
            'loadUserInteractionStatus',
            'loadComments',
            'loadRelatedMemes',
            'loadVersions',
            'loadSidebarData',
          ]
          console.warn(`${services[index]} 載入失敗:`, result.reason)
        }
      })
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

    // 根據後端 API 回應格式處理
    if (
      response.data &&
      response.data.tags &&
      Array.isArray(response.data.tags)
    ) {
      tags.value = response.data.tags
    } else if (response.data && Array.isArray(response.data)) {
      tags.value = response.data
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
        let memeData = memeResponse.data
        if (
          memeResponse.data.data &&
          typeof memeResponse.data.data === 'object'
        ) {
          memeData = memeResponse.data.data
        }

        // 更新統計數據
        const newLikesCount = memeData.likes_count || memeData.like_count || 0
        const newDislikesCount =
          memeData.dislikes_count || memeData.dislike_count || 0
        const newCommentsCount =
          memeData.comments_count || memeData.comment_count || 0

        // 只有在有新數據時才更新，避免覆蓋已經正確設置的計數器
        if (
          newLikesCount > 0 ||
          memeData.likes_count === 0 ||
          memeData.like_count === 0
        ) {
          likesCount.value = newLikesCount
        }
        if (
          newDislikesCount > 0 ||
          memeData.dislikes_count === 0 ||
          memeData.dislike_count === 0
        ) {
          dislikesCount.value = newDislikesCount
        }
        if (
          newCommentsCount > 0 ||
          memeData.comments_count === 0 ||
          memeData.comment_count === 0
        ) {
          commentsCount.value = newCommentsCount
        }
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
      await loadFallbackRecommendations()
    }
  } catch (error) {
    console.error('載入相關迷因失敗:', error)
    // 錯誤時也嘗試回退到標籤推薦
    await loadFallbackRecommendations()
  }
}

// 回退推薦方法
const loadFallbackRecommendations = async () => {
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
        console.log('回退標籤推薦結果:', relatedMemes.value)
      }
    } else {
      // 如果沒有標籤，嘗試取得最新迷因
      const latestResponse = await memeService.getAll({
        limit: 5,
        sort: 'created_at',
        order: 'desc',
      })
      if (latestResponse.data) {
        const memesData = latestResponse.data.data || latestResponse.data
        const memesArray = Array.isArray(memesData) ? memesData : []
        relatedMemes.value = memesArray
          .filter((item) => getMemeId(item) !== memeId.value)
          .slice(0, 5)
        console.log('回退最新迷因結果:', relatedMemes.value)
      }
    }
  } catch (fallbackError) {
    console.error('回退推薦也失敗:', fallbackError)
    relatedMemes.value = []
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

    // 後端返回成功，立即更新本地狀態和計數器
    isLiked.value = !isLiked.value

    // 如果之前是按噓狀態，取消按噓
    if (isLiked.value && isDisliked.value) {
      isDisliked.value = false
      dislikesCount.value = Math.max(0, dislikesCount.value - 1)
    }

    // 立即更新按讚計數
    if (isLiked.value) {
      likesCount.value += 1
    } else {
      likesCount.value = Math.max(0, likesCount.value - 1)
    }

    // 不需要重新載入統計資料，避免覆蓋本地更新
    // await loadUserInteractionStatus()
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

    // 後端返回成功，立即更新本地狀態和計數器
    isDisliked.value = !isDisliked.value

    // 如果之前是按讚狀態，取消按讚
    if (isDisliked.value && isLiked.value) {
      isLiked.value = false
      likesCount.value = Math.max(0, likesCount.value - 1)
    }

    // 立即更新按噓計數
    if (isDisliked.value) {
      dislikesCount.value += 1
    } else {
      dislikesCount.value = Math.max(0, dislikesCount.value - 1)
    }

    // 不需要重新載入統計資料，避免覆蓋本地更新
    // await loadUserInteractionStatus()
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
  if (!requireLogin(userStore, toast)) {
    router.push('/login')
    return
  }
  showReportDialog.value = true
}

const onReportSubmitted = (reportData) => {
  console.log('檢舉已提交:', reportData)
  // 可以在這裡添加額外的處理邏輯，例如更新 UI 狀態等
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

// 監聽路由變化
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
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
    memeId.value || route.params.slug || pageEnterRoute.value?.split('/').pop()

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
  name: 'MemeDetailPageSlug',
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
/* 樣式保持與原本的 [id].vue 相同 */
</style>
