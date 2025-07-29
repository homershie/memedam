import { ref, computed } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

/**
 * 無限滾動組合式函數 - 基於 VueUse 的 useInfiniteScroll
 * @param {Function} loadMoreFunction - 載入更多數據的函數
 * @param {Object} options - 配置選項
 * @param {boolean} options.enabled - 是否啟用無限滾動，預設為 true
 * @param {number} options.distance - 距離底部的最小距離，預設為 10
 * @param {number} options.interval - 兩次載入之間的間隔時間，預設為 100ms
 * @returns {Object} 返回觸發元素 ref 和載入狀態
 */
export function useInfiniteScrollWrapper(loadMoreFunction, options = {}) {
  const { enabled = true, distance = 10, interval = 100 } = options

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

  // 使用 VueUse 的 useInfiniteScroll
  const { isLoading: vueUseLoading, reset } = useInfiniteScroll(
    triggerRef,
    () => {
      if (hasMore.value && !isLoading.value) {
        loadMore()
      }
    },
    {
      distance,
      interval,
      canLoadMore: () => hasMore.value && !isLoading.value,
    },
  )

  // 更新載入狀態
  const updateLoadingState = (loading, hasMoreData) => {
    isLoading.value = loading
    hasMore.value = hasMoreData
  }

  // 重置狀態
  const resetState = () => {
    isLoading.value = false
    hasMore.value = true
    reset()
  }

  // 手動觸發載入
  const triggerLoad = () => {
    if (!isLoading.value && hasMore.value) {
      loadMore()
    }
  }

  return {
    triggerRef,
    isLoading: computed(() => isLoading.value || vueUseLoading.value),
    hasMore,
    loadMore,
    updateLoadingState,
    resetState,
    triggerLoad,
  }
}
