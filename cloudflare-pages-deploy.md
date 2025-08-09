
# Cloudflare Pages 部署指南

## 🚀 自動部署設定

在 Cloudflare Pages 控制台中設定以下配置：

### 基本建置設定
- **框架預設**: `Vue`
- **建置命令**: `npm run build`
- **建置輸出目錄**: `dist`
- **根目錄**: `/` (保持預設)

### 🔧 環境變數（必須設定）
在 Cloudflare Pages 「設定」→「環境變數」中新增：

```
NODE_VERSION = 22.16.0
NODE_ENV = production
```

> **注意**：Cloudflare Pages 在 `NODE_ENV=production` 時預設不會安裝 `devDependencies`，
> 導致建置工具如 `vite` 無法使用。本專案於根目錄新增了 `.npmrc` 檔案，
> 內容設定 `production=false` 以確保開發依賴在部署時也會被安裝。

### 📦 部署步驟

1. **連接 GitHub Repository**
   - 在 Cloudflare Pages 控制台點擊「建立專案」
   - 選擇「連接到 Git」
   - 選擇您的 GitHub repository

2. **設定建置配置**
   - 選擇框架: `Vue`
   - 建置命令: `npm run build`
   - 建置輸出目錄: `dist`

3. **設定環境變數**
   - 新增 `NODE_VERSION = 22.16.0`
   - 新增 `NODE_ENV = production`

4. **部署**
   - 點擊「儲存並部署」
   - 等待建置完成

### 🔐 安全與效能

我們已經配置了：
- ✅ 安全標頭 (`_headers` 文件)
- ✅ SPA 路由重定向 (`_redirects` 文件)
- ✅ 資源快取策略
- ✅ Node.js 版本鎖定

### 🛠️ 故障排除

**如果建置失敗：**
1. 確認環境變數 `NODE_VERSION = 22.16.0` 已設定
2. 確認建置命令是 `npm run build`
3. 檢查建置日誌中的具體錯誤

**如果路由不工作：**
- 確認 `public/_redirects` 文件存在
- 檢查路由配置是否正確

### 🧪 本地測試

部署前請先測試：

```bash
# 安裝依賴
npm install

# 建置專案
npm run build

# 預覽建置結果
npm run preview
```

### 📝 後端 API 配置

如果您的應用需要連接後端 API：

1. 在 Cloudflare Pages 環境變數中設定：
   ```
   VITE_API_BASE_URL = https://your-api-domain.com/api
   ```

2. 在您的 Vue 應用中使用：
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
   ```

### 🎯 關鍵改動

相比上次部署，我們修正了：
- ✅ 移除了不相容的 `wrangler.toml` 檔案
- ✅ 透過 `.npmrc` (`production=false`) 確保部署時安裝開發依賴
- ✅ 簡化建置命令
- ✅ 確保 Node.js 版本一致性

現在您的專案應該可以成功部署到 Cloudflare Pages！
