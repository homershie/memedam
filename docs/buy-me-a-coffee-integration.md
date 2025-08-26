# Buy Me a Coffee 整合說明

## 概述

本文件說明如何將 Buy Me a Coffee 整合到迷因典平台，讓用戶可以透過 Buy Me a Coffee 進行贊助，並在完成後重定向回迷因典網站。

## 功能架構

### 1. 前端整合

#### 贊助頁面 (`/donate`)

- 用戶選擇贊助金額（30、60、150 元）
- 點擊贊助按鈕後，開啟 Buy Me a Coffee 贊助頁面
- 傳遞用戶ID和贊助金額參數

#### 成功頁面 (`/sponsor/success`)

- 顯示贊助成功訊息
- 展示贊助詳情（金額、時間、留言等）
- 說明贊助者權益

#### 錯誤頁面 (`/sponsor/error`)

- 處理贊助失敗情況
- 提供常見問題解答
- 提供聯繫方式

### 2. 後端 API

#### 回調處理

- **端點**: `POST /api/sponsors/callback/buy-me-a-coffee`
- **功能**: 處理 Buy Me a Coffee 的回調請求
- **參數**:
  - `transaction_id`: 交易編號
  - `amount`: 贊助金額
  - `user_id`: 用戶ID
  - `message`: 贊助留言
  - `payment_method`: 支付方式

#### 贊助資訊查詢

- **端點**: `GET /api/sponsors/transaction/:transaction_id`
- **功能**: 根據交易ID取得贊助詳情
- **權限**: 無需認證

## 設定步驟

### 1. Buy Me a Coffee 設定

1. 登入 Buy Me a Coffee 帳戶
2. 前往設定頁面
3. 設定重定向 URL：
   ```
   成功: https://www.memedam.com/sponsor/success
   失敗: https://www.memedam.com/sponsor/error
   ```

### 2. 環境變數

在 `.env` 檔案中新增：

```env
# Buy Me a Coffee 設定
BUY_ME_A_COFFEE_WEBHOOK_SECRET=your_webhook_secret
BUY_ME_A_COFFEE_USERNAME=memedam
```

### 3. 路由設定

確保以下路由已正確設定：

```javascript
// 前端路由
/sponsor/success - 贊助成功頁面
/sponsor/error   - 贊助錯誤頁面

// 後端路由
POST /api/sponsors/callback/buy-me-a-coffee - 回調處理
GET  /api/sponsors/transaction/:id         - 查詢贊助資訊
```

## 使用流程

### 1. 用戶贊助流程

1. 用戶訪問 `/donate` 頁面
2. 選擇贊助金額（30、60、150 元）
3. 點擊贊助按鈕
4. 系統開啟 Buy Me a Coffee 贊助頁面
5. 用戶在 Buy Me a Coffee 完成付款
6. Buy Me a Coffee 重定向到 `/sponsor/success` 或 `/sponsor/error`

### 2. 系統處理流程

1. Buy Me a Coffee 發送回調請求到後端
2. 後端驗證並記錄贊助資訊
3. 重定向用戶到對應的成功或錯誤頁面
4. 前端頁面顯示贊助結果

## 贊助者權益

根據贊助金額提供不同權益：

- **30 元**: 顯示在首頁贊助名單
- **60 元**: 顯示在首頁贊助名單 + 首頁留言展示
- **150 元**: 顯示在首頁贊助名單 + 首頁留言展示 + 乾爹/乾媽徽章

## 安全性考量

### 1. 回調驗證

- 驗證 Buy Me a Coffee 的 webhook 簽名
- 檢查交易ID是否重複
- 驗證必要參數

### 2. 資料保護

- 贊助者個人資訊加密儲存
- 匿名贊助選項
- 符合 GDPR 規範

## 測試

### 1. 本地測試

```bash
# 啟動後端服務
npm run dev

# 啟動前端服務
cd ../memedam
npm run dev
```

### 2. 測試流程

1. 訪問贊助頁面
2. 選擇贊助金額
3. 模擬 Buy Me a Coffee 回調
4. 驗證成功/錯誤頁面顯示

## 故障排除

### 常見問題

1. **回調失敗**

   - 檢查 webhook URL 設定
   - 驗證 API 端點是否正常運作
   - 檢查網路連線

2. **贊助資訊無法載入**

   - 確認交易ID是否正確
   - 檢查資料庫連線
   - 驗證 API 回應格式

3. **重定向失敗**
   - 檢查前端路由設定
   - 確認 URL 格式正確
   - 驗證頁面元件是否正常載入

## 維護

### 定期檢查項目

1. Buy Me a Coffee 回調是否正常
2. 贊助記錄是否正確儲存
3. 前端頁面是否正常顯示
4. 用戶回饋和問題處理

### 更新記錄

- 2024-01-XX: 初始版本
- 功能：基本贊助流程、成功/錯誤頁面、API 整合
