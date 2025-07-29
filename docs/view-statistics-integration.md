# 瀏覽統計功能整合說明

## 概述

本專案已成功整合瀏覽統計功能到迷因詳情頁面，提供完整的瀏覽數據追蹤和分析功能。

## 功能特色

### 1. 自動瀏覽記錄

- 用戶進入迷因詳情頁面時自動記錄瀏覽
- 支援防刷機制，5分鐘內重複瀏覽不計入統計
- 記錄瀏覽時間、來源網址等詳細資訊

### 2. 豐富的統計數據

- **總瀏覽數**：包含重複瀏覽的總數
- **有效瀏覽**：扣除重複瀏覽後的實際瀏覽數
- **獨立用戶**：不同用戶的瀏覽次數
- **平均瀏覽時間**：用戶平均停留時間
- **總瀏覽時間**：所有用戶的總停留時間
- **重複瀏覽**：被過濾的重複瀏覽次數

### 3. 即時數據更新

- 頁面載入時自動更新統計數據
- 瀏覽記錄後即時更新顯示
- 支援不同時間週期的統計（全部、日、週、月）

## 技術實現

### 前端服務 (viewService.js)

```javascript
import apiService from './apiService'

export default {
  // 記錄瀏覽
  recordView(memeId, data = {}) {
    return apiService.http.post(`/views/${memeId}`, data)
  },

  // 取得迷因瀏覽統計
  getStats(memeId, period = 'all') {
    return apiService.http.get(`/views/stats/${memeId}`, {
      params: { period },
    })
  },

  // 取得用戶瀏覽歷史
  getUserHistory(params = {}) {
    return apiService.httpAuth.get('/views/history', { params })
  },

  // 取得熱門迷因
  getPopularMemes(params = {}) {
    return apiService.http.get('/views/popular', { params })
  },
}
```

### 頁面整合

#### 1. 自動記錄瀏覽

```javascript
// 在 loadMeme 函數中自動記錄瀏覽
await recordView()

// 記錄瀏覽函數
const recordView = async () => {
  try {
    const viewData = {
      duration: 0,
      referrer: document.referrer || '',
    }

    const response = await viewService.recordView(memeId.value, viewData)

    if (response.data && response.data.data) {
      const { isDuplicate } = response.data.data
      if (!isDuplicate) {
        viewCount.value += 1
      }
    }
  } catch (error) {
    console.error('記錄瀏覽失敗:', error)
  }
}
```

#### 2. 瀏覽時間追蹤

```javascript
// 頁面進入時間追蹤
const pageEnterTime = ref(null)

// 記錄頁面離開時的瀏覽時間
const recordPageLeave = () => {
  if (pageEnterTime.value && memeId.value) {
    const duration = Math.floor((Date.now() - pageEnterTime.value) / 1000)
    if (duration > 0) {
      viewService.recordView(memeId.value, {
        duration,
        referrer: document.referrer || '',
      })
    }
  }
}

// 監聽頁面離開事件
onMounted(() => {
  pageEnterTime.value = Date.now()
  window.addEventListener('beforeunload', recordPageLeave)
  window.addEventListener('pagehide', recordPageLeave)
})
```

#### 3. 統計數據顯示

```vue
<!-- 詳細資訊區域 -->
<div v-if="viewStats.total_views > 0" class="mt-6">
  <h3 class="font-semibold text-gray-700 mb-2">瀏覽統計詳情</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div class="space-y-2">
      <div>
        <span class="font-medium">總瀏覽數：</span>{{ viewStats.total_views }}
      </div>
      <div>
        <span class="font-medium">有效瀏覽：</span>{{ viewStats.effective_views }}
      </div>
      <div>
        <span class="font-medium">重複瀏覽：</span>{{ viewStats.duplicate_views }}
      </div>
    </div>
    <div class="space-y-2">
      <div>
        <span class="font-medium">獨立用戶：</span>{{ viewStats.unique_users }}
      </div>
      <div>
        <span class="font-medium">平均瀏覽時間：</span>{{ Math.round(viewStats.avg_duration) }}秒
      </div>
      <div>
        <span class="font-medium">總瀏覽時間：</span>{{ Math.round(viewStats.total_duration / 60) }}分鐘
      </div>
    </div>
  </div>
</div>
```

## 使用方式

### 1. 基本使用

瀏覽統計功能會在用戶訪問迷因詳情頁面時自動啟用，無需額外配置。

### 2. 開發測試

在開發環境中，迷因詳情頁面的工具箱會顯示「測試瀏覽統計」按鈕，可用於測試功能是否正常。

### 3. 數據查看

- 在迷因詳情頁面的「詳細資訊」區域查看完整統計
- 在右側資訊欄查看簡化統計
- 統計數據會自動更新

## API 端點

### 記錄瀏覽

```http
POST /views/:meme_id
Content-Type: application/json

{
  "duration": 30,
  "referrer": "https://www.google.com"
}
```

### 取得統計

```http
GET /views/stats/:meme_id?period=all
```

### 取得用戶瀏覽歷史

```http
GET /views/history?page=1&limit=20
Authorization: Bearer <token>
```

### 取得熱門迷因

```http
GET /views/popular?page=1&limit=20&period=all
```

## 注意事項

1. **防刷機制**：同一用戶/IP 在 5 分鐘內重複瀏覽不會計入統計
2. **隱私保護**：IP 和 User Agent 僅用於防刷，不會外洩
3. **效能考量**：大量瀏覽記錄會影響查詢效能，建議定期清理
4. **統計準確性**：`effective_views` 為扣除重複瀏覽後的實際瀏覽數

## 未來擴展

1. **圖表視覺化**：添加瀏覽趨勢圖表
2. **時間週期選擇**：允許用戶選擇不同時間週期查看統計
3. **熱門迷因頁面**：基於瀏覽數的熱門迷因列表
4. **用戶瀏覽歷史**：登入用戶的瀏覽歷史記錄
5. **管理員統計面板**：完整的統計分析工具

---

_本文檔最後更新：2024年12月_
