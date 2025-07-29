# 工具函數快速參考 (Utils Quick Reference)

快速查找和導入 `src/utils` 目錄下的工具函數。詳細文檔請參閱 [工具函數 API 文檔](./utils-api.md)。

## 快速導入指南

### 📊 數據處理 (dataUtils.js)

```javascript
import { getId, formatPublishedTime, getMemeId } from '@/utils/dataUtils'
```

| 函數名                          | 功能                       | 返回值   |
| ------------------------------- | -------------------------- | -------- |
| `getId(val)`                    | 處理 MongoDB ObjectId 格式 | `string` |
| `formatPublishedTime(timeData)` | 格式化發布時間為相對時間   | `string` |
| `getMemeId(meme)`               | 從迷因對象提取統一格式 ID  | `string` |

---

### 🔐 身份驗證 (authUtils.js)

```javascript
import { requireLogin, hasPermission } from '@/utils/authUtils'
```

| 函數名                           | 功能                       | 返回值    |
| -------------------------------- | -------------------------- | --------- |
| `requireLogin(userStore, toast)` | 檢查登入狀態，未登入則跳轉 | `boolean` |
| `hasPermission(userStore, meme)` | 檢查用戶編輯/刪除權限      | `boolean` |

---

### 📤 分享功能 (shareUtils.js)

```javascript
import {
  getShareOptions,
  handlePlatformShare,
  isMobileDevice,
} from '@/utils/shareUtils'
```

| 函數名                                     | 功能                 | 返回值            |
| ------------------------------------------ | -------------------- | ----------------- |
| `getShareOptions()`                        | 獲取分享平台選項配置 | `Array<Object>`   |
| `handlePlatformShare(platform, shareData)` | 統一分享處理器       | `Promise<Object>` |
| `isMobileDevice()`                         | 檢測是否為行動裝置   | `boolean`         |
| `copyToClipboard(url)`                     | 複製文字到剪貼簿     | `Promise<void>`   |

**平台特定函數:**

```javascript
import {
  shareToFacebook,
  shareToInstagram,
  shareToTwitter,
  shareToLine,
  shareToWhatsApp,
  shareToTelegram,
  shareToThreads,
  shareToNative,
} from '@/utils/shareUtils'
```

---

### 🎬 媒體處理 (mediaUtils.js)

```javascript
import {
  isExternalVideoUrl,
  getEmbedUrl,
  isExternalAudioUrl,
  getAudioEmbedUrl,
} from '@/utils/mediaUtils'
```

| 函數名                    | 功能                   | 返回值    |
| ------------------------- | ---------------------- | --------- |
| `isExternalVideoUrl(url)` | 檢查是否為外部影片 URL | `boolean` |
| `getEmbedUrl(url)`        | 獲取影片嵌入 URL       | `string`  |
| `isExternalAudioUrl(url)` | 檢查是否為外部音訊 URL | `boolean` |
| `getAudioEmbedUrl(url)`   | 獲取音訊嵌入 URL       | `string`  |

---

## 常用組合

### 👤 用戶操作檢查

```javascript
import { requireLogin } from '@/utils/authUtils'

// 在需要登入的操作前使用
if (!requireLogin(userStore, toast)) return
```

### 📝 迷因資料處理

```javascript
import { getMemeId, formatPublishedTime } from '@/utils/dataUtils'

const memeId = getMemeId(meme)
const publishedTime = formatPublishedTime(meme)
```

### 📤 完整分享功能

```javascript
import { getShareOptions, handlePlatformShare } from '@/utils/shareUtils'

const shareOptions = getShareOptions()
const result = await handlePlatformShare(platform, {
  shareUrl: 'https://example.com/meme/123',
  shareTitle: '有趣的迷因',
  shareText: '分享文字',
})
```

### 🎬 媒體嵌入檢查

```javascript
import { isExternalVideoUrl, getEmbedUrl } from '@/utils/mediaUtils'

if (isExternalVideoUrl(url)) {
  const embedUrl = getEmbedUrl(url)
  // 使用嵌入式播放器
}
```

---

## 支援的平台

### 🎬 影片平台

- YouTube (youtube.com, youtu.be)
- Vimeo (vimeo.com)
- TikTok (tiktok.com)
- Twitch (twitch.tv)
- Dailymotion (dailymotion.com)
- Bilibili (bilibili.com)

### 🎵 音訊平台

- YouTube (音訊)
- SoundCloud (soundcloud.com)
- Spotify (spotify.com, open.spotify.com)
- Anchor.fm (anchor.fm)
- Podbean (podbean.com)
- Buzzsprout (buzzsprout.com)
- Libsyn (libsyn.com)
- Transistor.fm (transistor.fm)

### 📤 分享平台

- 系統原生分享 (native)
- 複製連結 (copylink)
- Facebook (facebook)
- Instagram (instagram)
- Threads (threads)
- Line (line)
- Twitter (twitter)
- WhatsApp (whatsapp)
- Telegram (telegram)

---

## 錯誤處理最佳實踐

```javascript
// 1. 分享功能錯誤處理
try {
  const result = await handlePlatformShare(platform, shareData)
  if (result) {
    toast.add({
      severity: result.type,
      detail: result.message,
    })
  }
} catch (error) {
  console.error('分享失敗:', error)
}

// 2. 媒體 URL 檢查
const embedUrl = getEmbedUrl(videoUrl)
if (embedUrl === videoUrl) {
  console.warn('不支援的影片平台')
}

// 3. 數據處理防護
const memeId = getMemeId(meme)
if (!memeId) {
  console.error('無法獲取有效的迷因 ID')
  return
}
```

---

## 快速鏈接

- 📖 [完整 API 文檔](./utils-api.md) - 詳細的函數說明和示例
- 🔍 [前端搜索實作](./frontend-search-implementation.md)
- 🏷️ [標籤過濾 API](./tag-filter-api.md)
- 🔎 [Fuse 搜索 API](./fuse-search-api.md)
