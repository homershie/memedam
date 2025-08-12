# OAuth 流程優化改進

## 問題描述

在嘗試綁定 Google 帳戶時，請求會停留在 `https://www.memedam.com/api/users/bind-auth/google/init?state=...`，且前端不斷發送 GET 請求至 `https://www.memedam.com/api/users/bind-auth/google/favicon/site.webmanifest`，這導致 OAuth 流程卡住。

## 根本原因

1. **資源載入衝突**：在 OAuth 流程中，瀏覽器會自動請求 `site.webmanifest` 等資源，這些請求會干擾 OAuth 授權流程
2. **重定向方式問題**：使用 `window.location.href` 進行重定向會導致整個頁面跳轉，可能觸發不必要的資源載入
3. **缺乏流程控制**：沒有適當的流程控制和錯誤處理機制

## 解決方案

### 1. 使用彈出視窗進行 OAuth 授權

**改進前**：

```javascript
// 使用 window.location.href 重定向
window.location.href = response.data.authUrl
```

**改進後**：

```javascript
// 使用 window.open 開啟彈出視窗
const authWindow = window.open(
  response.data.authUrl,
  'oauth_auth',
  'width=500,height=600,scrollbars=yes,resizable=yes',
)
```

### 2. 資源載入優化

**index.html 改進**：

```html
<!-- 使用非阻塞式載入 site.webmanifest -->
<link rel="manifest" href="favicon/site.webmanifest" crossorigin="anonymous" />

<!-- 添加 OAuth 流程優化腳本 -->
<script>
  // 防止在 OAuth 流程中自動載入不必要的資源
  if (
    window.location.search.includes('code=') ||
    window.location.search.includes('state=')
  ) {
    document.addEventListener('DOMContentLoaded', function () {
      // 延遲載入 webmanifest
      setTimeout(function () {
        const manifestLink = document.querySelector('link[rel="manifest"]')
        if (manifestLink) {
          manifestLink.href = manifestLink.href
        }
      }, 1000)
    })
  }
</script>
```

### 3. 創建專門的 OAuth 綁定對話框組件

新增 `OAuthBindingDialog.vue` 組件，提供：

- 更好的用戶體驗
- 清晰的狀態指示
- 詳細的操作提示
- 完善的錯誤處理

### 4. 資源載入優化工具函數

在 `oauthUtils.js` 中新增 `optimizeOAuthResourceLoading()` 函數：

```javascript
export const optimizeOAuthResourceLoading = () => {
  // 檢查是否在 OAuth 流程中
  const urlParams = new URLSearchParams(window.location.search)
  const hasOAuthParams =
    urlParams.get('code') ||
    urlParams.get('state') ||
    urlParams.get('provider') ||
    urlParams.get('error') ||
    urlParams.get('success') !== null

  if (hasOAuthParams) {
    // 延遲載入非關鍵資源
    setTimeout(() => {
      // 延遲載入 webmanifest 和其他非關鍵資源
    }, 2000)
  }
}
```

## 改進效果

### 1. 流程穩定性

- ✅ 避免 OAuth 流程中斷
- ✅ 防止不必要的資源請求
- ✅ 提供更好的錯誤處理

### 2. 用戶體驗

- ✅ 清晰的狀態指示
- ✅ 詳細的操作提示
- ✅ 彈出視窗不會影響主頁面

### 3. 開發體驗

- ✅ 模組化的組件設計
- ✅ 可重用的工具函數
- ✅ 完善的錯誤處理機制

## 使用方式

### 基本使用

```vue
<template>
  <OAuthBindingDialog
    v-model:visible="showOAuthBindingDialog"
    :provider="selectedAccount?.platform"
    :provider-name="selectedAccount?.name"
    :provider-icon="selectedAccount?.icon"
    @binding-success="onOAuthBindingSuccess"
    @binding-error="onOAuthBindingError"
  />
</template>
```

### 在頁面初始化時優化資源載入

```javascript
import { optimizeOAuthResourceLoading } from '@/utils/oauthUtils'

onMounted(() => {
  // 優化 OAuth 流程中的資源載入
  optimizeOAuthResourceLoading()
})
```

## 注意事項

1. **彈出視窗阻擋**：確保瀏覽器允許彈出視窗
2. **跨域問題**：確保 OAuth 提供商的授權 URL 支援彈出視窗
3. **用戶體驗**：提供清晰的操作指引，避免用戶困惑

## 未來改進

1. **支援更多 OAuth 提供商**：擴展到 Facebook、Discord、Twitter 等
2. **更智能的資源管理**：根據用戶行為動態調整資源載入策略
3. **更好的錯誤恢復**：提供自動重試和降級方案
