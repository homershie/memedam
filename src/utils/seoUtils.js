/**
 * SEO 工具函數
 * 用於處理頁面 meta 標籤、canonical 標籤等 SEO 相關功能
 */

// 固定 canonical 主機，避免 www 與非 www 造成重複內容
export const CANONICAL_ORIGIN = 'https://www.memedam.com'

/**
 * 動態設定頁面的 meta 標籤
 * @param {Object} meta - meta 資訊
 * @param {string} meta.title - 頁面標題
 * @param {string} meta.description - 頁面描述
 * @param {string} meta.canonical - 標準網址
 * @param {Object} meta.openGraph - Open Graph 資訊
 */
export function setPageMeta({
  title,
  description,
  canonical,
  openGraph = {},
  robots,
}) {
  // 設定頁面標題
  if (title) {
    document.title = `${title} | 迷因典 MemeDam`
  }

  // 移除現有的 meta 標籤和 canonical 標籤
  removeExistingMetaTags()

  // 設定基本 meta 標籤
  if (description) {
    addMetaTag('name', 'description', description)
  }

  // 設定 robots（可選）
  if (robots) {
    addMetaTag('name', 'robots', robots)
  }

  // 設定 canonical 標籤
  if (canonical) {
    addCanonicalTag(canonical)
  }

  // 設定 Open Graph 標籤
  if (openGraph.title) {
    addMetaTag('property', 'og:title', openGraph.title)
  }
  if (openGraph.description) {
    addMetaTag('property', 'og:description', openGraph.description)
  }
  if (openGraph.image) {
    addMetaTag('property', 'og:image', openGraph.image)
  }
  if (openGraph.url) {
    addMetaTag('property', 'og:url', openGraph.url)
  }

  // 設定 Twitter Card
  addMetaTag('name', 'twitter:card', 'summary_large_image')
  if (openGraph.title) {
    addMetaTag('name', 'twitter:title', openGraph.title)
  }
  if (openGraph.description) {
    addMetaTag('name', 'twitter:description', openGraph.description)
  }
  if (openGraph.image) {
    addMetaTag('name', 'twitter:image', openGraph.image)
  }
}

/**
 * 移除現有的動態 meta 標籤
 */
function removeExistingMetaTags() {
  const tagsToRemove = [
    'meta[name="description"]:not([data-original])',
    'link[rel="canonical"]:not([data-original])',
    'meta[property^="og:"]:not([data-original])',
    'meta[name^="twitter:"]:not([data-original])',
  ]

  tagsToRemove.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => element.remove())
  })
}

/**
 * 添加 meta 標籤
 */
function addMetaTag(attribute, name, content) {
  if (!content) return

  const meta = document.createElement('meta')
  meta.setAttribute(attribute, name)
  meta.setAttribute('content', content)
  document.head.appendChild(meta)
}

/**
 * 添加 canonical 標籤
 */
function addCanonicalTag(url) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'canonical')
  link.setAttribute('href', url)
  document.head.appendChild(link)
}

/**
 * 生成分頁的 canonical URL
 * @param {string} basePath - 基礎路徑
 * @param {Object} params - 查詢參數
 * @param {number} page - 頁碼
 * @returns {string} canonical URL
 */
export function generateCanonicalUrl(basePath, params = {}, page = 1) {
  const url = new URL(CANONICAL_ORIGIN + basePath)

  // 只保留重要的查詢參數
  const importantParams = ['search', 'tags', 'type', 'status']

  importantParams.forEach((param) => {
    if (params[param] && params[param].toString().trim()) {
      url.searchParams.set(param, params[param].toString().trim())
    }
  })

  // 只在非第一頁時添加 page 參數
  if (page > 1) {
    url.searchParams.set('page', page.toString())
  }

  return url.toString()
}

/**
 * 生成分頁的上一頁/下一頁連結
 * @param {string} basePath - 基礎路徑
 * @param {Object} params - 查詢參數
 * @param {number} currentPage - 當前頁碼
 * @param {number} totalPages - 總頁數
 */
export function setPaginationLinks(basePath, params, currentPage, totalPages) {
  // 移除現有的分頁連結
  const existingLinks = document.querySelectorAll(
    'link[rel="prev"], link[rel="next"]',
  )
  existingLinks.forEach((link) => link.remove())

  // 添加上一頁連結
  if (currentPage > 1) {
    const prevUrl = generateCanonicalUrl(basePath, params, currentPage - 1)
    const prevLink = document.createElement('link')
    prevLink.setAttribute('rel', 'prev')
    prevLink.setAttribute('href', prevUrl)
    document.head.appendChild(prevLink)
  }

  // 添加下一頁連結
  if (currentPage < totalPages) {
    const nextUrl = generateCanonicalUrl(basePath, params, currentPage + 1)
    const nextLink = document.createElement('link')
    nextLink.setAttribute('rel', 'next')
    nextLink.setAttribute('href', nextUrl)
    document.head.appendChild(nextLink)
  }
}

/**
 * 清理 URL 參數，移除空值和重複值
 * @param {Object} params - 原始參數
 * @returns {Object} 清理後的參數
 */
export function cleanUrlParams(params) {
  const cleaned = {}

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value !== '0'
    ) {
      // 特殊處理陣列參數
      if (Array.isArray(value)) {
        const filteredArray = value.filter(
          (item) => item !== null && item !== undefined && item !== '',
        )
        if (filteredArray.length > 0) {
          cleaned[key] = filteredArray.join(',')
        }
      } else {
        cleaned[key] = value.toString().trim()
      }
    }
  })

  return cleaned
}

/**
 * 生成結構化數據 (JSON-LD)
 * @param {Object} data - 結構化數據
 */
export function setStructuredData(data) {
  // 移除現有的結構化數據
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]',
  )
  if (existingScript) {
    existingScript.remove()
  }

  // 添加新的結構化數據
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * 為迷因列表頁面設定 SEO
 * @param {Object} options - 配置選項
 */
export function setMemeListSEO({
  title = '所有迷因',
  basePath = '/memes/all',
  searchQuery = '',
  selectedTags = [],
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
}) {
  let pageTitle = title
  let description = `探索最新、最熱門的迷因內容，共 ${totalCount} 個迷因`

  // 根據搜尋和標籤調整標題和描述
  if (searchQuery.trim()) {
    pageTitle = `搜尋「${searchQuery}」的迷因結果`
    description = `搜尋「${searchQuery}」的迷因結果，${totalCount > 0 ? `找到 ${totalCount} 個相關迷因` : '暫無相關結果'}`
  }

  if (selectedTags.length > 0) {
    const tagNames = selectedTags.map((tag) => tag.name || tag).join('、')
    pageTitle += ` - ${tagNames}標籤`
    description += `，已篩選標籤：${tagNames}`
  }

  if (currentPage > 1) {
    pageTitle += ` - 第 ${currentPage} 頁`
    description += `，第 ${currentPage} 頁`
  }

  // 準備查詢參數
  const params = cleanUrlParams({
    search: searchQuery,
    tags:
      selectedTags.length > 0
        ? selectedTags.map((tag) => tag.name || tag)
        : null,
  })

  // 生成 canonical URL
  const canonicalUrl = generateCanonicalUrl(basePath, params, currentPage)

  // 設定頁面 meta
  setPageMeta({
    title: pageTitle,
    description,
    canonical: canonicalUrl,
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      image: `${window.location.origin}/favicon/apple-touch-icon.png`,
    },
  })

  // 設定分頁連結
  if (totalPages > 1) {
    setPaginationLinks(basePath, params, currentPage, totalPages)
  }

  // 設定結構化數據
  setStructuredData({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: description,
    url: canonicalUrl,
    numberOfItems: totalCount,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
    },
  })
}
