# 環境設定說明

## 概述

本專案支援多種環境設定，包括開發環境、生產環境等。

## 環境變數

### 基本環境變數

| 變數名稱           | 說明           | 預設值                  |
| ------------------ | -------------- | ----------------------- |
| `NODE_ENV`         | Node.js 環境   | `development`           |
| `VITE_API_URL`     | API 伺服器位址 | `http://localhost:4000` |
| `VITE_APP_TITLE`   | 應用程式標題   | `迷因典 MemeDam`        |
| `VITE_APP_VERSION` | 應用程式版本   | `1.0.0`                 |

### 開發環境設定

```bash
# Windows
set NODE_ENV=development
set VITE_API_URL=http://localhost:4000

# Linux/Mac
export NODE_ENV=development
export VITE_API_URL=http://localhost:4000
```

### 生產環境設定

```bash
# Windows
set NODE_ENV=production
set VITE_API_URL=https://your-api-domain.com

# Linux/Mac
export NODE_ENV=production
export VITE_API_URL=https://your-api-domain.com
```

## 環境檢查

### 在程式碼中檢查環境

```javascript
import { isDevelopment, isProduction, getApiUrl } from '@/utils/envUtils'

// 檢查是否為開發環境
if (isDevelopment()) {
  console.log('開發環境')
}

// 檢查是否為生產環境
if (isProduction()) {
  console.log('生產環境')
}

// 取得 API URL
const apiUrl = getApiUrl()
```

### 在 Vue 組件中使用

```vue
<template>
  <div>
    <!-- 只在開發環境顯示 -->
    <div v-if="isDev">開發模式功能</div>
  </div>
</template>

<script setup>
import { isDevelopment } from '@/utils/envUtils'

const isDev = isDevelopment()
</script>
```

## 瀏覽統計功能環境設定

瀏覽統計功能在不同環境下的行為：

### 開發環境

- 顯示測試按鈕
- 詳細的錯誤訊息
- 完整的調試資訊

### 生產環境

- 隱藏測試按鈕
- 簡化的錯誤訊息
- 優化的效能

## 啟動指令

### 開發環境

```bash
# 設定環境變數
set NODE_ENV=development

# 啟動開發伺服器
npm run dev
```

### 生產環境

```bash
# 設定環境變數
set NODE_ENV=production

# 建置專案
npm run build

# 預覽建置結果
npm run preview
```

## 注意事項

1. **環境變數前綴**：Vite 專案中，客戶端環境變數必須以 `VITE_` 開頭
2. **安全性**：不要在前端暴露敏感資訊
3. **建置優化**：生產環境會自動優化程式碼
4. **代理設定**：開發環境使用 `vite.config.js` 中的代理設定

## 故障排除

### 環境變數無法讀取

1. 確認變數名稱以 `VITE_` 開頭
2. 重新啟動開發伺服器
3. 檢查 `.env` 文件格式

### API 連接問題

1. 確認 `VITE_API_URL` 設定正確
2. 檢查後端伺服器是否運行
3. 確認代理設定是否正確

---

_本文檔最後更新：2024年12月_
