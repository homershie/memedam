# 推薦系統實現方案

## 概述

本系統採用 **方式 A + 方式 B** 的組合推薦策略，根據用戶登入狀態智能選擇合適的推薦算法。

## 架構設計

### 1. 智能推薦邏輯

```javascript
// 前端示例
const getRecommendations = async (isLoggedIn) => {
  if (isLoggedIn) {
    // 登入用戶：使用個人化推薦
    return fetch('/api/recommendations/social-collaborative-filtering')
  } else {
    // 未登入用戶：使用大家都在看的內容
    return fetch('/api/recommendations/trending')
  }
}
```

### 2. API 端點設計

#### 登入用戶端點

- **端點**: `/api/recommendations/social-collaborative-filtering`
- **方法**: GET
- **驗證**: 需要登入
- **功能**: 基於用戶興趣和社交網絡的個人化推薦

#### 未登入用戶端點

- **端點**: `/api/recommendations/trending`
- **方法**: GET
- **驗證**: 不需要登入
- **功能**: 基於熱門趨勢和社交信號的推薦

### 3. URL 參數支援

#### 通用參數

- `page`: 分頁頁碼
- `limit`: 每頁數量
- `tags`: 標籤篩選（逗號分隔）

#### 登入用戶專用參數

- `include_hot_score`: 是否結合熱門分數
- `hot_score_weight`: 熱門分數權重（0-1）
- `exclude_interacted`: 是否排除已互動的迷因

#### 未登入用戶專用參數

- `time_range`: 時間範圍（1h, 6h, 24h, 7d, 30d）
- `include_social_signals`: 是否計算社交分數

## 前端實現

### 1. 服務層 (`recommendationService.js`)

```javascript
// 智能推薦：根據登入狀態選擇合適的推薦算法
getSmartRecommendations(params = {}, isLoggedIn = false) {
  if (isLoggedIn) {
    // 登入用戶：使用個人化推薦
    return this.getSocialCollaborativeFilteringRecommendations(params)
  } else {
    // 未登入用戶：使用大家都在看的內容
    return this.getTrendingRecommendations(params)
  }
}
```

### 2. 頁面實現

#### "大家都在看" 頁面 (`liked.vue`)

- 根據登入狀態動態調整頁面描述
- 未登入用戶顯示時間範圍選擇器
- 智能選擇推薦算法

#### "近期話題" 頁面 (`trending.vue`)

- 專門為未登入用戶設計
- 支援時間範圍篩選
- 基於熱門趨勢和社交信號

### 3. 用戶體驗優化

#### 動態頁面描述

```vue
<p class="text-gray-600 mt-2">
  {{ userStore.isLoggedIn ? '基於您的興趣和社交網絡的智能推薦' : '基於熱門趨勢和社交信號的推薦' }}
</p>
```

#### 條件性功能顯示

```vue
<!-- 時間範圍選擇器（僅對未登入用戶顯示） -->
<div
  v-if="!userStore.isLoggedIn"
  class="flex flex-wrap gap-2 mb-6 justify-start items-center"
>
  <span class="text-sm text-gray-600 mr-2">時間範圍：</span>
  <Button
    v-for="timeRange in timeRanges"
    :key="timeRange.value"
    :label="timeRange.label"
    :severity="selectedTimeRange === timeRange.value ? 'success' : 'secondary'"
    size="small"
    text
    @click="onTimeRangeChange(timeRange.value)"
  />
</div>
```

## 後端 API 設計

### 1. Trending 端點

```javascript
// GET /api/recommendations/trending
{
  "success": true,
  "data": {
    "recommendations": [...],
    "pagination": {
      "hasMore": true,
      "currentPage": 1,
      "totalPages": 10
    }
  }
}
```

### 2. 支援的查詢參數

| 參數                     | 類型    | 說明             | 預設值 |
| ------------------------ | ------- | ---------------- | ------ |
| `time_range`             | string  | 時間範圍         | `24h`  |
| `include_social_signals` | boolean | 是否計算社交分數 | `true` |
| `tags`                   | string  | 標籤篩選         | -      |
| `page`                   | number  | 分頁頁碼         | `1`    |
| `limit`                  | number  | 每頁數量         | `10`   |
| `exclude_ids`            | string  | 排除的迷因ID     | -      |

### 3. 時間範圍選項

- `1h`: 1小時內
- `6h`: 6小時內
- `24h`: 24小時內
- `7d`: 7天內
- `30d`: 30天內

## 優勢特點

### 1. 用戶體驗

- **無縫切換**: 根據登入狀態自動選擇合適的推薦
- **個性化**: 登入用戶享受個人化推薦
- **即時性**: 未登入用戶可查看熱門趨勢

### 2. 技術優勢

- **API 一致性**: 統一的參數結構和回應格式
- **可擴展性**: 易於添加新的推薦算法
- **性能優化**: 針對不同用戶群體優化

### 3. 業務價值

- **用戶留存**: 未登入用戶也能獲得有價值的內容
- **轉化率**: 個人化推薦提高用戶登入意願
- **內容發現**: 多維度的內容推薦機制

## 未來擴展

### 1. 算法優化

- 添加更多推薦算法（協同過濾、內容基礎等）
- 實現混合推薦策略
- 支援 A/B 測試

### 2. 功能增強

- 添加推薦原因說明
- 支援用戶反饋機制
- 實現推薦質量評估

### 3. 性能優化

- 實現推薦結果快取
- 添加預載入機制
- 優化資料庫查詢

## 各分頁演算法配置

### 1. "大家都在看" (`liked.vue`)

- **演算法**: 智能推薦（根據登入狀態動態選擇）
- **登入用戶**: 社交協同過濾推薦 (`/api/recommendations/social-collaborative-filtering`)
- **未登入用戶**: 熱門趨勢推薦 (`/api/recommendations/trending`)
- **特色**: 動態頁面描述、智能算法選擇

### 2. "最新迷因" (`new.vue`)

- **演算法**: 最新推薦
- **API**: `/api/recommendations/latest`
- **特色**: 基於時間排序的最新內容推薦

### 3. "熱門迷因" (`hot.vue`)

- **演算法**: 熱門推薦
- **API**: `/api/recommendations?algorithm=hot`
- **特色**: 基於熱門分數、30天時間範圍

### 4. "近期話題" (`trending.vue`)

- **演算法**: 趨勢推薦
- **API**: `/api/recommendations/trending`
- **特色**: 時間範圍選擇、社交信號計算

| 分頁           | 演算法類型 | 目標用戶   | 特色功能               |
| -------------- | ---------- | ---------- | ---------------------- |
| **大家都在看** | 智能推薦   | 全體用戶   | 動態算法選擇、個人化   |
| **最新迷因**   | 最新推薦   | 全體用戶   | 基於時間排序、推薦系統 |
| **熱門迷因**   | 熱門推薦   | 全體用戶   | 熱門分數、30天範圍     |
| **近期話題**   | 趨勢推薦   | 未登入用戶 | 時間範圍選擇、社交信號 |

## 總結

這個推薦系統實現方案成功結合了個人化推薦和熱門趨勢推薦的優勢，為不同類型的用戶提供了最佳的內容發現體驗。通過智能的算法選擇和優雅的用戶界面設計，確保了系統的可擴展性和用戶滿意度。
