# 檢舉系統實作計劃 V2

## 概述

本計劃旨在實作迷因典平台的檢舉功能，第一階段專注於迷因檢舉功能，後續階段將擴展至用戶檢舉和留言檢舉。

## V2 規格變更總覽

### 0) 主要變更

- **取消匿名檢舉**：必須登入且顯示檢舉者身分
- **防止重複檢舉**：同一用戶對同一目標不可重複檢舉（資料庫唯一索引強制）
- **新增處理方式**：後台新增「處理方式（Action）」與批次作業
- **MVP 通知機制**：站內通知
- **反濫用規則**：速率與品質雙管齊下
- **加強索引與群組化**：完整性檢查與群組化視圖

## 第一階段：迷因檢舉功能

### 1. 前端元件設計

#### 1.1 檢舉對話框元件 (ReportDialog.vue)

- **位置**: `src/components/ReportDialog.vue`
- **功能**:
  - 檢舉原因選擇（不當內容、仇恨言論、垃圾訊息、版權問題、其他）
  - 詳細描述輸入框
  - 提交和取消按鈕
  - 已檢舉狀態顯示（按鈕顯示「已檢舉」）
- **觸發方式**: 從 MemeCard 和 MemeCardSlim 的選單中呼叫
- **V2 變更**: 移除匿名檢舉選項，未登入用戶點擊檢舉 → 彈出登入要求

#### 1.2 檢舉按鈕整合

- **MemeCard.vue**: 在選單中新增「檢舉」按鈕
- **MemeCardSlim.vue**: 在選單中新增「檢舉」按鈕
- **權限控制**: 只有登入用戶才能檢舉

#### 1.3 使用者檢舉紀錄頁面 (reports.vue)

- **位置**: `src/pages/reports.vue`
- **功能**:
  - 顯示用戶的檢舉歷史
  - 檢舉狀態追蹤（待處理、已處理、已駁回）
  - 管理員回應顯示
  - 處理方式與結果顯示
  - 分頁功能
  - **V2 新增**: 檢舉有效率顯示、速率限制狀態

### 2. 後端API設計

#### 2.1 檢舉相關API端點

```
POST /api/reports - 建立檢舉（命中唯一索引則回 409）
GET /api/reports/my - 取得用戶自己的檢舉（分頁、排序）
GET /api/reports - 取得檢舉列表（管理員，支援群組模式）
GET /api/reports/:id - 取得單一檢舉詳情
PUT /api/reports/:id/resolve - 處理檢舉（設定狀態、處理方式）
PUT /api/reports/batch/resolve - 批次處理檢舉
PUT /api/reports/batch/notify - 批次發送通知
DELETE /api/reports/:id - 刪除檢舉
```

#### 2.2 檢舉原因選項

```javascript
const reportReasons = [
  { value: 'inappropriate', label: '不當內容' },
  { value: 'hate_speech', label: '仇恨言論' },
  { value: 'spam', label: '垃圾訊息' },
  { value: 'copyright', label: '版權問題' },
  { value: 'other', label: '其他' },
]
```

#### 2.3 檢舉狀態

```javascript
const reportStatuses = [
  { value: 'pending', label: '待處理' },
  { value: 'processed', label: '已處理' },
  { value: 'rejected', label: '已駁回' },
]
```

### 3. 資料庫設計

#### 3.1 Report 模型更新

```javascript
// V2 完整模型
{
  // 檢舉者ID（必填）
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 檢舉目標類型（必填）
  target_type: {
    type: String,
    required: true,
    enum: ['meme', 'comment', 'user'],
    default: 'meme'
  },

  // 檢舉目標ID（必填）
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  // 檢舉原因（必填）
  reason: {
    type: String,
    required: true,
    enum: ['inappropriate', 'hate_speech', 'spam', 'copyright', 'other']
  },

  // 詳細描述
  description: {
    type: String,
    maxlength: 1000
  },

  // 檢舉狀態
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processed', 'rejected']
  },

  // V2 新增：處理方式
  action: {
    type: String,
    enum: ['none', 'remove_content', 'soft_hide', 'age_gate', 'mark_nsfw',
           'lock_comments', 'issue_strike', 'warn_author'],
    default: 'none'
  },

  // V2 新增：處理方式詳細資訊
  action_meta: {
    type: Object
  },

  // 管理員處理備註
  admin_comment: {
    type: String,
    maxlength: 1000
  },

  // 處理時間
  processed_at: {
    type: Date
  },

  // 處理人員ID
  handler_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}
```

#### 3.2 資料庫索引設計

```javascript
// 防止重複檢舉的唯一索引
schema.index({ reporter_id: 1, target_type: 1, target_id: 1 }, { unique: true })

// 群組化查詢索引
schema.index({ target_type: 1, target_id: 1, status: 1, created_at: -1 })

// 用戶檢舉歷史查詢
schema.index({ reporter_id: 1, created_at: -1 })

// 管理員篩選查詢
schema.index({ status: 1, created_at: -1 })
```

### 4. 管理員後台功能

#### 4.1 檢舉管理頁面 (admin/reports.vue)

- **V2 群組化設計**:
  - 預設「群組模式」列表：每列 = 一個目標
  - 顯示：總檢舉數、原因分布、最近時間、快速操作
  - 支援篩選：狀態、原因、目標類型、分頁

#### 4.2 檢舉詳情與處理

- **檢舉詳情對話框**:
  - 左側：目標內容預覽
  - 右側：所有檢舉清單（可勾選批次處理）
- **處理方式選項**:
  - `remove_content`: 直接刪除內容
  - `soft_hide`: 從清單下架但保留連結
  - `age_gate`: 年齡門檻限制
  - `mark_nsfw`: 標記為成人/敏感內容
  - `lock_comments`: 鎖定留言
  - `issue_strike`: 對作者記違規點數
  - `warn_author`: 向作者發出告誡
- **批次處理功能**: 一鍵處理多筆檢舉
- **通知功能**: 處理完成後自動通知檢舉者/作者

### 5. 實作步驟

#### 步驟1: 後端API實作

1. **更新 Report 模型**

   - 移除 `is_anonymous` 欄位
   - 新增 `action` 和 `action_meta` 欄位
   - 建立資料庫索引（防止重複檢舉、群組化查詢）
   - 新增時間戳記欄位

2. **修正 reportController.js**

   - 更新 API 響應格式
   - 新增 `GET /api/reports/my` 端點
   - 新增 `PUT /api/reports/:id/resolve` 端點
   - 新增批次處理 API
   - 實作目標完整性檢查

3. **更新路由權限控制**

   - 確保只有登入用戶可檢舉
   - 管理員權限驗證

4. **實作反濫用機制**
   - 速率限制中間件
   - 品質限制檢查
   - 用戶檢舉有效率計算

#### 步驟2: 通知系統實作

1. **建立通知模型**

   - 通知資料結構設計
   - 通知類型定義

2. **實作通知服務**
   - 檢舉提交成功通知
   - 檢舉處理結果通知
   - 作者警告通知

#### 步驟3: 前端服務層

1. **更新 reportService.js**

   - 新增檢舉相關的API呼叫方法
   - 實作檢舉狀態檢查
   - 批次處理 API 呼叫

2. **新增通知服務**
   - 通知相關 API 呼叫
   - 通知狀態管理

#### 步驟4: 前端元件開發

1. **建立 ReportDialog.vue 元件**

   - 移除匿名檢舉選項
   - 新增已檢舉狀態顯示
   - 實作登入檢查

2. **更新 MemeCard.vue 和 MemeCardSlim.vue**

   - 整合檢舉按鈕
   - 實作檢舉狀態檢查
   - 新增檢舉成功提示

3. **實作使用者檢舉紀錄頁面**
   - 顯示檢舉歷史
   - 檢舉有效率顯示
   - 速率限制狀態顯示

#### 步驟5: 管理員後台

1. **優化 admin/reports.vue**

   - 實作群組化檢視
   - 新增批次處理功能
   - 處理方式選擇介面

2. **新增檢舉詳情對話框**

   - 目標內容預覽
   - 檢舉清單顯示
   - 批次選擇功能

3. **實作處理功能**
   - 多種處理方式選擇
   - 批次處理邏輯
   - 自動通知發送

#### 步驟6: 統計與分析

1. **實作統計 API**

   - 檢舉分布統計
   - 處理效率分析
   - Top 檢舉內容

2. **後台統計介面**
   - 統計卡片顯示
   - 圖表化呈現

#### 步驟7: 測試與整合

1. **單元測試**

   - API 端點測試
   - 資料庫操作測試
   - 權限控制測試

2. **整合測試**

   - 完整檢舉流程測試
   - 批次處理測試
   - 通知機制測試

3. **使用者體驗測試**
   - 檢舉流程順暢性
   - 後台操作效率
   - 響應式設計測試

### 6. 技術考量

#### 6.1 安全性

- **防止重複檢舉**: 資料庫唯一索引強制 (reporter_id, target_type, target_id)
- **檢舉者身份驗證**: 必須登入才能檢舉
- **管理員權限控制**: 僅管理員可處理檢舉
- **目標完整性檢查**: 建立時檢查 target_id 是否存在

#### 6.2 反濫用機制

- **速率限制**:
  - 24 小時內最多 5 次檢舉
  - 7 日內最多 20 次檢舉
- **品質限制**:
  - 觀察近 20 筆檢舉的有效率（被標為 processed 的比率）
  - < 10%：發出警示通知
  - < 5% 且累計檢舉 ≥ 40 筆：暫停 7 天檢舉功能

#### 6.3 效能

- 檢舉列表分頁與群組化查詢
- 資料庫索引優化（多個複合索引）
- 快取機制

#### 6.4 使用者體驗

- 檢舉流程簡化
- 即時狀態更新
- 友善的錯誤訊息
- 響應式設計
- 成功送出顯示 Toast：「已收到檢舉，我們會盡快處理。」

### 7. 通知機制（MVP）

#### 7.1 站內通知事件

- **檢舉提交成功** → 通知檢舉者（感謝/回饋）
- **檢舉被處理** → 通知檢舉者，附上處理結果
- **warn_author 或 issue_strike** → 通知作者

#### 7.2 通知資料結構

```javascript
// Notification
{
  _id, user_id, type, title, message, link, read: false, created_at
}
```

### 8. 統計與分析

#### 8.1 MVP 指標

- **每日/每週統計**:
  - 被檢舉次數 Top 10 的迷因
  - 檢舉原因分布（圓餅或長條）
  - 檢舉處理耗時（中位數、P90）
  - 檢舉有效率（全站）

#### 8.2 後台介面

- 簡單後台卡片 + 表格
- 後續可擴展為圖表化顯示

### 9. 後續階段規劃

#### 第二階段：留言檢舉

- 擴展檢舉目標類型至留言
- 留言檢舉對話框
- 留言檢舉管理

#### 第三階段：用戶檢舉

- 用戶檢舉功能
- 用戶檢舉管理
- 用戶封鎖機制

#### 第四階段：進階功能

- 檢舉統計分析
- 自動化處理規則
- 檢舉獎勵機制
- Email/推播通知

## 檔案結構

```
memedam/
├── src/
│   ├── components/
│   │   ├── ReportDialog.vue (新增)
│   │   ├── MemeCard.vue (更新)
│   │   └── MemeCardSlim.vue (更新)
│   ├── pages/
│   │   ├── reports.vue (更新)
│   │   └── admin/
│   │       └── reports.vue (更新)
│   └── services/
│       └── reportService.js (更新)

memedam_backend/
├── models/
│   └── Report.js (更新)
├── controllers/
│   └── reportController.js (更新)
├── routes/
│   └── reportRoutes.js (更新)
└── middleware/
    └── auth.js (已有相關權限控制)
```

## API 摘要

### 檢舉相關 API

```
POST /api/reports
# 建立檢舉；命中唯一索引則回 409（已檢舉過）
Body: { target_type, target_id, reason, description }

GET /api/reports/my
# 取得自己的檢舉列表（分頁、排序）
Query: { page, limit, status, sort, order }

GET /api/reports              # admin
# 支援 ?groupBy=target | ?status= | ?reason= | ?target_type= | 分頁
Query: { groupBy, status, reason, target_type, page, limit }

GET /api/reports/:id          # admin
# 單筆詳情，並可附帶同目標的其他檢舉摘要

PUT /api/reports/:id/resolve  # admin
# 設定 status / action / action_meta / admin_comment
Body: { status, action, action_meta, admin_comment }

PUT /api/reports/batch/resolve   # admin
# 批次處理檢舉
Body: { ids: [], status, action, action_meta, admin_comment }

PUT /api/reports/batch/notify    # admin
# 批次發送通知
Body: { ids: [], template, custom_message }

DELETE /api/reports/:id
# 刪除檢舉
```

### 通知相關 API

```
GET /api/notifications
# 取得用戶通知列表
Query: { page, limit, read }

PUT /api/notifications/:id/read
# 標記通知為已讀

PUT /api/notifications/batch/read
# 批次標記通知為已讀
Body: { ids: [] }
```

## 時間規劃

- **第一週**: 後端API實作和測試
- **第二週**: 前端元件開發
- **第三週**: 管理員後台功能
- **第四週**: 整合測試和優化

## 驗收標準

1. 用戶可以成功檢舉迷因
2. 管理員可以查看和處理檢舉
3. 用戶可以查看自己的檢舉紀錄
4. 系統正確處理權限控制
5. 檢舉功能不會影響現有功能
6. 響應式設計在不同裝置上正常運作
7. **V2 新增**: 後台可群組化檢視與批次處理檢舉
8. **V2 新增**: 已實施速率限制與品質限制（可在系統設定中調整）
9. **V2 新增**: 防止重複檢舉機制正常運作
10. **V2 新增**: 站內通知機制正常運作
