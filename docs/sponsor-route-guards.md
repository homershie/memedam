# 贊助頁面路由守衛說明

## 概述

本文件說明贊助頁面的路由守衛機制，確保只有真正完成贊助的用戶才能訪問成功頁面，並防止未授權訪問。

## 安全機制

### 1. 路由守衛驗證

#### 成功頁面 (`/sponsor/success`)

- **驗證項目**：

  - 必須包含有效的 `transaction_id` 參數
  - 交易必須在資料庫中存在
  - 交易狀態必須為 `success`
  - 交易時間不能超過 24 小時

- **驗證流程**：

  1. 檢查 URL 參數是否包含 `transaction_id`
  2. 呼叫 API 驗證交易真實性
  3. 檢查交易狀態和時間有效性
  4. 記錄訪問嘗試

- **重定向規則**：
  - 缺少交易ID → 重定向到 `/donate`
  - 交易不存在 → 重定向到 `/donate`
  - 交易狀態非成功 → 重定向到 `/sponsor/error`
  - 交易已過期 → 重定向到 `/donate`

#### 錯誤頁面 (`/sponsor/error`)

- **訪問控制**：允許所有用戶訪問
- **記錄功能**：記錄訪問時間和錯誤訊息

### 2. 驗證工具

#### `sponsorValidation.js`

提供統一的贊助驗證功能：

```javascript
// 驗證交易
const validation = await validateSponsorTransaction(transactionId)

// 檢查訪問權限
const isValid = await isValidSponsorSuccessAccess(transactionId)

// 記錄頁面訪問
await logSponsorPageAccess('success', transactionId)
```

#### 驗證狀態

- `VALID`: 驗證成功，可以訪問
- `INVALID`: 驗證失敗，交易無效
- `PENDING`: 交易待處理
- `ERROR`: 驗證過程發生錯誤

### 3. 後端 API

#### 交易驗證端點

```
GET /api/sponsors/transaction/:transaction_id
```

#### 訪問記錄端點

```
POST /api/sponsors/log-access
```

## 實現細節

### 1. 路由守衛設定

```javascript
// 在 router/index.js 中
router.beforeEach(async (to, from, next) => {
  // 贊助成功頁面驗證
  if (to.path === '/sponsor/success') {
    const validation = await validateSponsorTransaction(transactionId)

    switch (validation.status) {
      case SPONSOR_VALIDATION_STATUS.VALID:
        // 允許訪問
        break
      case SPONSOR_VALIDATION_STATUS.PENDING:
        // 重定向到錯誤頁面
        next('/sponsor/error')
        return
      default:
        // 重定向到贊助頁面
        next('/donate')
        return
    }
  }
})
```

### 2. 頁面組件驗證

```javascript
// 在 success.vue 中
const loadSponsorInfo = async () => {
  const validation = await validateSponsorTransaction(transactionId)

  if (validation.status === SPONSOR_VALIDATION_STATUS.VALID) {
    sponsorInfo.value = validation.data
  } else {
    // 處理錯誤
  }
}
```

## 安全考量

### 1. 防止直接訪問

- 用戶無法直接輸入 URL 訪問成功頁面
- 必須通過有效的交易ID驗證

### 2. 防止重複訪問

- 交易ID驗證確保每次訪問都是有效的
- 24小時過期機制防止長期濫用

### 3. 訪問記錄

- 記錄所有訪問嘗試
- 包含用戶代理、來源頁面等資訊
- 便於追蹤和分析

### 4. 錯誤處理

- 優雅的錯誤處理機制
- 不會暴露敏感資訊
- 提供適當的重定向

## 測試案例

### 1. 正常流程

1. 用戶完成贊助
2. 重定向到成功頁面
3. 驗證通過，顯示贊助詳情

### 2. 異常情況

1. **缺少交易ID**：重定向到贊助頁面
2. **無效交易ID**：重定向到贊助頁面
3. **交易狀態非成功**：重定向到錯誤頁面
4. **交易已過期**：重定向到贊助頁面
5. **網路錯誤**：重定向到贊助頁面

### 3. 安全測試

1. **直接訪問**：無法直接訪問成功頁面
2. **偽造交易ID**：驗證失敗，重定向
3. **重複訪問**：每次都需要重新驗證

## 維護注意事項

### 1. 定期檢查

- 監控訪問記錄
- 檢查異常訪問模式
- 更新安全規則

### 2. 效能優化

- 考慮快取驗證結果
- 優化 API 回應時間
- 監控資料庫查詢效能

### 3. 錯誤處理

- 記錄所有驗證錯誤
- 監控 API 可用性
- 提供降級方案

## 更新記錄

- 2024-01-XX: 初始版本
- 功能：基本路由守衛、交易驗證、訪問記錄
