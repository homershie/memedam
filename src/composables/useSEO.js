/**
 * SEO 組合式函數
 * 提供響應式的 SEO 管理功能
 */

import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  setPageMeta,
  generateCanonicalUrl,
  setPaginationLinks,
  cleanUrlParams,
  setMemeListSEO,
} from '@/utils/seoUtils'

/**
 * 使用基本 SEO 功能
 * @param {Object} defaultMeta - 預設 meta 資訊
 * @returns {Object} SEO 相關的響應式參考和方法
 */
export function useSEO(defaultMeta = {}) {
  const route = useRoute()
  const router = useRouter()

  const seoMeta = ref({
    title: '',
    description: '',
    canonical: '',
    openGraph: {},
    ...defaultMeta,
  })

  // 更新 SEO meta 資訊
  const updateSEO = (newMeta) => {
    seoMeta.value = {
      ...seoMeta.value,
      ...newMeta,
    }

    setPageMeta(seoMeta.value)
  }

  // 清理函數
  const cleanup = () => {
    // 移除動態添加的 meta 標籤
    const dynamicTags = document.querySelectorAll(
      'meta[name="description"]:not([data-original]),' +
        'link[rel="canonical"]:not([data-original]),' +
        'meta[property^="og:"]:not([data-original]),' +
        'meta[name^="twitter:"]:not([data-original]),' +
        'link[rel="prev"],' +
        'link[rel="next"]',
    )
    dynamicTags.forEach((tag) => tag.remove())
  }

  onMounted(() => {
    // 設定初始 SEO
    updateSEO(seoMeta.value)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    seoMeta,
    updateSEO,
    cleanup,
  }
}

/**
 * 使用分頁 SEO 功能
 * @param {Object} options - 配置選項
 * @returns {Object} 分頁相關的 SEO 功能
 */
export function usePaginationSEO(options = {}) {
  const {
    basePath = '',
    defaultTitle = '',
    defaultDescription = '',
    pageSize = 10,
  } = options

  const route = useRoute()
  const router = useRouter()

  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: true,
  })

  const filters = ref({
    search: '',
    tags: [],
    type: '',
    status: '',
  })

  // 從 URL 查詢參數初始化狀態
  const initializeFromQuery = () => {
    if (route.query.page) {
      const pageNum = parseInt(route.query.page)
      if (!isNaN(pageNum) && pageNum > 0) {
        pagination.value.currentPage = pageNum
      }
    }

    if (route.query.search) {
      filters.value.search = route.query.search
    }

    if (route.query.tags) {
      filters.value.tags = route.query.tags
        .split(',')
        .filter((tag) => tag.trim())
    }

    if (route.query.type) {
      filters.value.type = route.query.type
    }

    if (route.query.status) {
      filters.value.status = route.query.status
    }
  }

  // 更新分頁資訊
  const updatePagination = (newPagination) => {
    pagination.value = {
      ...pagination.value,
      ...newPagination,
    }
    updatePaginationSEO()
  }

  // 更新篩選條件
  const updateFilters = (newFilters) => {
    filters.value = {
      ...filters.value,
      ...newFilters,
    }
    updatePaginationSEO()
  }

  // 更新分頁的 SEO 設定
  const updatePaginationSEO = () => {
    let title = defaultTitle
    let description = defaultDescription

    // 根據篩選條件調整標題和描述
    if (filters.value.search) {
      title = `搜尋「${filters.value.search}」的結果`
      description = `搜尋「${filters.value.search}」的結果，${
        pagination.value.totalCount > 0
          ? `找到 ${pagination.value.totalCount} 個相關結果`
          : '暫無相關結果'
      }`
    }

    if (filters.value.tags.length > 0) {
      const tagNames = filters.value.tags.join('、')
      title += ` - ${tagNames}標籤`
      description += `，已篩選標籤：${tagNames}`
    }

    if (pagination.value.currentPage > 1) {
      title += ` - 第 ${pagination.value.currentPage} 頁`
      description += `，第 ${pagination.value.currentPage} 頁`
    }

    // 準備查詢參數
    const params = cleanUrlParams({
      search: filters.value.search,
      tags: filters.value.tags.length > 0 ? filters.value.tags : null,
      type: filters.value.type,
      status: filters.value.status,
    })

    // 生成 canonical URL
    const canonicalUrl = generateCanonicalUrl(
      basePath,
      params,
      pagination.value.currentPage,
    )

    // 設定頁面 meta
    setPageMeta({
      title,
      description,
      canonical: canonicalUrl,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        image: `${window.location.origin}/favicon/apple-touch-icon.png`,
      },
    })

    // 設定分頁連結
    if (pagination.value.totalPages > 1) {
      setPaginationLinks(
        basePath,
        params,
        pagination.value.currentPage,
        pagination.value.totalPages,
      )
    }
  }

  // 更新 URL
  const updateURL = (replace = true) => {
    const params = cleanUrlParams({
      search: filters.value.search,
      tags: filters.value.tags.length > 0 ? filters.value.tags.join(',') : null,
      type: filters.value.type,
      status: filters.value.status,
      page:
        pagination.value.currentPage > 1 ? pagination.value.currentPage : null,
    })

    const newQuery = {}
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        newQuery[key] = params[key]
      }
    })

    const method = replace ? 'replace' : 'push'
    router[method]({
      path: basePath,
      query: newQuery,
    })
  }

  // 監聽路由變化
  watch(
    () => route.query,
    () => {
      initializeFromQuery()
      updatePaginationSEO()
    },
    { deep: true },
  )

  // 監聽分頁和篩選變化
  watch(
    [pagination, filters],
    () => {
      updatePaginationSEO()
    },
    { deep: true },
  )

  onMounted(() => {
    initializeFromQuery()
    updatePaginationSEO()
  })

  return {
    pagination,
    filters,
    updatePagination,
    updateFilters,
    updateURL,
    updatePaginationSEO,
    initializeFromQuery,
  }
}

/**
 * 使用迷因列表 SEO
 * 專門為迷因列表頁面設計的 SEO 功能
 */
export function useMemeListSEO(basePath = '/memes/all') {
  const {
    pagination,
    filters,
    updatePagination,
    updateFilters,
    updateURL,
    initializeFromQuery,
  } = usePaginationSEO({
    basePath,
    defaultTitle: '所有迷因',
    defaultDescription: '探索最新、最熱門的迷因內容',
    pageSize: 5,
  })

  // 專門的迷因列表 SEO 更新
  const updateMemeListSEO = () => {
    setMemeListSEO({
      title: '所有迷因',
      basePath,
      searchQuery: filters.value.search,
      selectedTags: filters.value.tags.map((tag) => ({ name: tag })),
      currentPage: pagination.value.currentPage,
      totalPages: pagination.value.totalPages,
      totalCount: pagination.value.totalCount,
    })
  }

  // 重寫更新方法以使用專門的迷因 SEO
  const updatePaginationWithSEO = (newPagination) => {
    updatePagination(newPagination)
    updateMemeListSEO()
  }

  const updateFiltersWithSEO = (newFilters) => {
    updateFilters(newFilters)
    updateMemeListSEO()
  }

  onMounted(() => {
    initializeFromQuery()
    updateMemeListSEO()
  })

  return {
    pagination,
    filters,
    updatePagination: updatePaginationWithSEO,
    updateFilters: updateFiltersWithSEO,
    updateURL,
    updateMemeListSEO,
    initializeFromQuery,
  }
}
