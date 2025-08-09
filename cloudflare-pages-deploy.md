# Cloudflare Pages 部署指南

## 自動部署設定

在 Cloudflare Pages 控制台中設定以下配置：

### 建置設定
- **建置命令**: `npm run build`
- **建置輸出目錄**: `dist`
- **根目錄**: `/` (預設)

### 環境變數
在 Cloudflare Pages 設定中加入以下環境變數：

```
NODE_VERSION = 22.16.0
NPM_FLAGS = --include=dev
NODE_ENV = production
```

### 自訂域名設定
1. 在 Cloudflare Pages 專案設定中點擊「自訂域名」
2. 新增您的域名
3. 確保 DNS 設定正確指向 Cloudflare

### 安全標頭
我們已經在 `public/_headers` 文件中設定了安全標頭，包括：
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- 快取控制設定

### 故障排除

如果遇到 `vite: not found` 錯誤：
1. 確認 `NODE_VERSION` 環境變數設定為 `22.16.0`
2. 確認 `NPM_FLAGS` 設定為 `--include=dev`
3. 檢查建置命令是否為 `npm run build`

如果建置失敗：
1. 檢查 package.json 中的 devDependencies 是否包含 vite
2. 確認所有必要的插件都在 devDependencies 中
3. 檢視建置日誌中的詳細錯誤訊息

### 本地測試
在部署前，請先在本地測試建置：

```bash
npm install
npm run build
npm run preview
```