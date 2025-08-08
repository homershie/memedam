# memedam

一個基於 Vue 3 + Vite 的迷因分享平台，支援無限滾動、推薦系統和搜尋功能。

## 功能特色

### 無限滾動實作

- **觸發機制**：使用 `@vueuse/core` 的 `useInfiniteScroll` 實現
- **觸發條件**：`infiniteHasMore && memes.length > 0`
- **觸發距離**：200px（確保真正接近底部時才觸發）
- **間隔時間**：100ms（避免重複觸發）
- **分頁邏輯**：使用後端返回的 `hasMore` 資訊
- **頁碼管理**：正確的 `currentPage` 遞增

### 推薦系統

- **混合推薦**：結合熱門、最新、內容基礎、協同過濾等多種演算法
- **個人化推薦**：基於用戶行為和偏好
- **冷啟動處理**：新用戶使用熱門推薦
- **快取機制**：Redis 快取提升效能

### 搜尋功能

- **模糊搜尋**：支援標題和內容搜尋
- **標籤篩選**：多標籤組合篩選
- **即時搜尋**：輸入時即時更新結果

## 技術架構

### 前端

- **Vue 3**：使用 Composition API
- **Vite**：快速開發和建置
- **PrimeVue**：UI 元件庫
- **Vue Router**：路由管理
- **Pinia**：狀態管理

### 後端

- **Node.js + Express**：API 服務
- **MongoDB**：資料庫
- **Redis**：快取系統
- **JWT**：身份驗證

````

## 無限滾動實作詳解

### 核心組件
```javascript
// 無限滾動載入函數
const loadMoreContent = async () => {
  // 防止在初始載入時觸發
  if (memes.value.length === 0) {
    return
  }

  currentPage.value++
  await loadMemes(false)
}

// 使用無限滾動組合式函數
const {
  triggerRef,
  isLoading: infiniteLoading,
  hasMore: infiniteHasMore,
  updateLoadingState,
} = useInfiniteScrollWrapper(loadMoreContent, {
  distance: 200, // 觸發距離
  interval: 100, // 間隔時間
})
````

### 觸發元素

```html
<!-- 無限滾動觸發元素 -->
<div
  v-if="infiniteHasMore && memes.length > 0"
  ref="triggerRef"
  class="h-4 w-full"
>
  <div v-if="infiniteLoading" class="flex justify-center py-6">
    <div class="flex items-center text-gray-500">
      <ProgressSpinner style="width: 20px; height: 20px" />
      <span class="ml-2">載入更多內容...</span>
    </div>
  </div>
</div>
```

### 分頁邏輯

```javascript
// 檢查是否還有更多資料
if (!searchQuery.value.trim()) {
  // 推薦模式：使用後端返回的分頁資訊
  if (response.data && response.data.pagination) {
    hasMore.value = response.data.pagination.hasMore
  } else {
    hasMore.value = newMemes.length >= pageSize.value
  }
} else {
  // 搜尋模式：傳統分頁邏輯
  hasMore.value = newMemes.length === pageSize.value
}
```

### 關鍵特性

1. **防止初始觸發**：確保頁面載入時不會立即觸發
2. **條件顯示**：只有有內容且有更多資料時才顯示觸發元素
3. **正確分頁**：使用後端返回的 `hasMore` 資訊
4. **避免重複**：通過距離和間隔設定避免重複觸發
5. **狀態管理**：正確的載入狀態和頁碼管理
