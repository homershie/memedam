import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * 無限滾動組合式函數
 * @param {Function} loadMoreFunction - 載入更多數據的函數
 * @param {Object} options - 配置選項
 * @param {boolean} options.enabled - 是否啟用無限滾動，預設為 true
 * @param {number} options.threshold - 觸發閾值，預設為 0.1
 * @param {number} options.rootMargin - 根邊距，預設為 '100px'
 * @returns {Object} 返回觸發元素 ref 和載入狀態
 */
export function useInfiniteScroll(loadMoreFunction, options = {}) {
  const { enabled = true, threshold = 0.1, rootMargin = '100px' } = options

  // 觸發元素 ref
  const triggerRef = ref(null)

  // 載入狀態
  const isLoading = ref(false)
  const hasMore = ref(true)

  // 載入更多函數的包裝器
  const loadMore = async () => {
    if (isLoading.value || !hasMore.value || !enabled) return

    isLoading.value = true
    try {
      await loadMoreFunction()
    } catch (error) {
      console.error('無限滾動載入失敗:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 使用 VueUse 的 Intersection Observer
  if (enabled) {
    useIntersectionObserver(
      triggerRef,
      ([{ isIntersecting }]) => {
        if (isIntersecting && hasMore.value && !isLoading.value) {
          loadMore()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )
  }

  // 更新載入狀態
  const updateLoadingState = (loading, hasMoreData) => {
    isLoading.value = loading
    hasMore.value = hasMoreData
  }

  // 重置狀態
  const resetState = () => {
    isLoading.value = false
    hasMore.value = true
  }

  // 手動觸發載入
  const triggerLoad = () => {
    if (!isLoading.value && hasMore.value) {
      loadMore()
    }
  }

  return {
    triggerRef,
    isLoading,
    hasMore,
    loadMore,
    updateLoadingState,
    resetState,
    triggerLoad,
  }
}
