import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * Pull-to-refresh 組合式函數
 * 用於實現手機版的下拉刷新功能，包含精確的手勢識別和防誤觸邏輯
 * @param {Function} refreshFunction - 重新整理數據的函數
 * @param {Object} options - 配置選項
 * @param {number} options.threshold - 觸發刷新的距離閾值，預設為 100px
 * @param {number} options.maxDistance - 最大下拉距離，預設為 150px
 * @param {boolean} options.enabled - 是否啟用功能，預設為 true
 * @param {Ref} containerRef - 容器元素的引用
 * @returns {Object} 返回狀態和控制函數
 *
 * 功能特點：
 * - 精確的手勢識別，只在頁面頂部且明顯下拉時觸發
 * - 防誤觸邏輯，避免一般滑動時誤觸發
 * - 開發模式調試支持
 * - 動態配置支持（開發模式下通過 URL 參數調整）
 */
export function usePullToRefresh(
  refreshFunction,
  options = {},
  containerRef = null,
) {
  const { threshold = 100, maxDistance = 150, enabled = true } = options // 增加閾值使判定更嚴格

  // 響應式狀態
  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const startY = ref(0)
  const isDragging = ref(false)
  const touchStartTime = ref(0)
  const minSwipeDistance = 30 // 最小觸摸距離

  // 計算屬性
  const isNearTop = () => {
    if (!containerRef.value) return false
    // 更嚴格的頂部判斷：必須完全在頂部，且沒有任何滾動
    return containerRef.value.scrollTop <= 5
  }

  const isValidPullGesture = (deltaY, deltaTime) => {
    // 必須是明顯的下拉手勢
    if (deltaY < minSwipeDistance) return false

    // 檢查手勢速度，避免太慢或太快的操作
    const velocity = Math.abs(deltaY) / deltaTime
    if (velocity < 0.1 || velocity > 2) return false // 速度範圍檢查

    return true
  }

  const pullProgress = () => {
    return Math.min(pullDistance.value / threshold, 1)
  }

  const shouldTriggerRefresh = () => {
    return pullDistance.value >= threshold
  }

  // 事件處理
  const handleTouchStart = (event) => {
    if (!enabled || !isNearTop()) return

    startY.value = event.touches[0].clientY
    touchStartTime.value = Date.now()
    isDragging.value = true

    // 開發模式調試信息
    if (import.meta.env.DEV) {
      console.log('Touch start at top:', startY.value)
    }
  }

  const handleTouchMove = (event) => {
    if (!enabled || !isDragging.value) return

    // 如果已經不在頂部，取消拖拽
    if (!isNearTop()) {
      isDragging.value = false
      pullDistance.value = 0
      return
    }

    const currentY = event.touches[0].clientY
    const deltaY = currentY - startY.value

    // 只處理明顯的向下拉動，且距離足夠大
    if (deltaY > 0 && deltaY >= minSwipeDistance) {
      pullDistance.value = Math.min(deltaY * 0.5, maxDistance)
    } else if (deltaY <= 0) {
      // 如果用戶向上滑動，重置狀態
      pullDistance.value = 0
    }
  }

  const handleTouchEnd = async () => {
    if (!enabled || !isDragging.value) {
      isDragging.value = false
      pullDistance.value = 0
      return
    }

    const touchEndTime = Date.now()
    const touchDuration = touchEndTime - touchStartTime.value
    const finalDistance = pullDistance.value

    isDragging.value = false

    // 檢查是否應該觸發刷新 - 增加更多驗證條件
    if (
      shouldTriggerRefresh() &&
      !isRefreshing.value &&
      isValidPullGesture(finalDistance, touchDuration)
    ) {
      // 確保是在頁面頂部完成的拉動
      if (isNearTop()) {
        isRefreshing.value = true
        try {
          await refreshFunction()
        } catch (error) {
          console.error('Pull-to-refresh failed:', error)
        } finally {
          isRefreshing.value = false
        }
      }
    }

    // 重置拉動距離
    pullDistance.value = 0

    // 開發模式調試信息
    if (import.meta.env.DEV) {
      console.log('Touch end:', {
        duration: touchDuration,
        distance: finalDistance,
        shouldRefresh:
          shouldTriggerRefresh() &&
          isValidPullGesture(finalDistance, touchDuration),
      })
    }
  }

  // 滾動事件處理（防止在滾動時觸發）
  const handleScroll = () => {
    // 如果用戶滾動了頁面，立即取消任何正在進行的拖拽
    if (isDragging.value) {
      const currentScrollTop = containerRef.value?.scrollTop || 0

      // 如果滾動距離超過5px，取消拖拽
      if (currentScrollTop > 5) {
        isDragging.value = false
        pullDistance.value = 0

        // 開發模式調試信息
        if (import.meta.env.DEV) {
          console.log('Scroll detected, cancelling pull gesture')
        }
      }
    }
  }

  // 設置事件監聽器
  const setupEventListeners = () => {
    if (!containerRef || !containerRef.value) return

    const element = containerRef.value

    // 添加觸摸事件
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    // 添加滾動事件
    element.addEventListener('scroll', handleScroll, { passive: true })
  }

  // 移除事件監聽器
  const removeEventListeners = () => {
    if (!containerRef || !containerRef.value) return

    const element = containerRef.value

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
    element.removeEventListener('scroll', handleScroll)
  }

  // 組件掛載時添加事件監聽
  onMounted(() => {
    // 如果已經有容器引用，立即設置事件監聽
    if (containerRef && containerRef.value) {
      setupEventListeners()
    }

    // 在開發模式下添加調試信息
    if (import.meta.env.DEV) {
      console.log('🔄 Pull-to-refresh 已啟用:', {
        threshold: `${threshold}px`,
        maxDistance: `${maxDistance}px`,
        minSwipeDistance: `${minSwipeDistance}px`,
        enabled,
        container: containerRef?.value?.tagName || 'No container',
      })
    }
  })

  // 組件卸載時移除事件監聽
  onUnmounted(() => {
    removeEventListeners()
  })

  // 如果傳入了容器引用，監聽其變化
  if (containerRef) {
    const stopWatcher = watch(containerRef, (newValue, oldValue) => {
      // 移除舊的事件監聽
      if (oldValue) {
        removeEventListeners()
      }

      // 添加新的事件監聽
      if (newValue) {
        setupEventListeners()
      }
    })

    // 在組件卸載時停止監聽
    onUnmounted(() => {
      stopWatcher()
    })
  }

  return {
    isRefreshing,
    pullDistance,
    pullProgress,
    isDragging,
    shouldTriggerRefresh,
  }
}
