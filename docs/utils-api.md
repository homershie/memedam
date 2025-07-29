# 工具函數 API 文檔 (Utils API Documentation)

本文檔記錄 `src/utils` 目錄下所有工具函數的功能、參數和使用方法，方便後續開發時查閱和調用。

## 目錄

- [數據處理工具 (dataUtils.js)](#數據處理工具-datautilsjs)
- [身份驗證工具 (authUtils.js)](#身份驗證工具-authutilsjs)
- [分享功能工具 (shareUtils.js)](#分享功能工具-shareutilsjs)
- [媒體處理工具 (mediaUtils.js)](#媒體處理工具-mediautilsjs)

---

## 數據處理工具 (dataUtils.js)

處理 MongoDB 數據格式和時間格式化的工具函數。

### getId(val)

處理 MongoDB ObjectId 格式，支援各種格式轉換。

**參數:**

- `val` - 需要處理的值，可以是 string、{$oid: ...}、{\_id: ...}、{id: ...} 等格式

**返回值:**

- `string` - 標準化的 ID 字符串，失敗時返回空字符串

**使用示例:**

```javascript
import { getId } from '@/utils/dataUtils'

// 處理不同格式的 ID
const stringId = getId('507f1f77bcf86cd799439011') // '507f1f77bcf86cd799439011'
const mongoId = getId({ $oid: '507f1f77bcf86cd799439011' }) // '507f1f77bcf86cd799439011'
const objId = getId({ _id: '507f1f77bcf86cd799439011' }) // '507f1f77bcf86cd799439011'
const emptyId = getId(null) // ''
```

---

### formatPublishedTime(timeData)

格式化發布時間為相對時間格式 (如 "3分鐘前", "2小時前")。

**參數:**

- `timeData` - 包含時間信息的對象，支援 `created_at` 或 `createdAt` 欄位，並處理 `{$date: ...}` 格式

**返回值:**

- `string` - 格式化的相對時間字符串，失敗時返回空字符串

**使用示例:**

```javascript
import { formatPublishedTime } from '@/utils/dataUtils'

// 處理不同格式的時間數據
const meme = {
  created_at: '2024-01-15T10:30:00Z',
}
const timeStr = formatPublishedTime(meme) // '2小時前'

// 處理 MongoDB 格式
const mongoTime = {
  created_at: { $date: '2024-01-15T10:30:00Z' },
}
const timeStr2 = formatPublishedTime(mongoTime) // '2小時前'
```

---

### getMemeId(meme)

從迷因對象中提取統一格式的 ID。

**參數:**

- `meme` - 迷因對象，包含 `id` 或 `_id` 欄位

**返回值:**

- `string` - 標準化的迷因 ID

**使用示例:**

```javascript
import { getMemeId } from '@/utils/dataUtils'

const meme = {
  _id: { $oid: '507f1f77bcf86cd799439011' },
  title: '有趣的迷因',
}
const memeId = getMemeId(meme) // '507f1f77bcf86cd799439011'
```

---

## 身份驗證工具 (authUtils.js)

處理用戶身份驗證和權限檢查的工具函數。

### requireLogin(userStore, toast)

檢查用戶是否已登入，未登入則顯示錯誤訊息並跳轉到登入頁面。

**參數:**

- `userStore` - 用戶狀態管理對象，包含 `isLoggedIn` 屬性
- `toast` - PrimeVue Toast 實例，用於顯示提示訊息

**返回值:**

- `boolean` - 已登入返回 `true`，未登入返回 `false`

**使用示例:**

```javascript
import { requireLogin } from '@/utils/authUtils'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const toast = useToast()

// 在需要登入的操作前檢查
if (!requireLogin(userStore, toast)) {
  return // 用戶未登入，已自動跳轉
}

// 執行需要登入的操作
await performAuthenticatedAction()
```

---

### hasPermission(userStore, meme)

檢查用戶是否有權限編輯或刪除指定迷因。

**參數:**

- `userStore` - 用戶狀態管理對象，包含 `userId` 和 `role` 屬性
- `meme` - 迷因對象，包含作者信息

**返回值:**

- `boolean` - 有權限返回 `true`，無權限返回 `false`

**使用示例:**

```javascript
import { hasPermission } from '@/utils/authUtils'

const canEdit = hasPermission(userStore, meme)
if (canEdit) {
  // 顯示編輯/刪除按鈕
  showEditButtons()
}
```

---

## 分享功能工具 (shareUtils.js)

提供各種社交平台分享功能的工具函數。

### getShareOptions()

獲取分享平台選項配置，會根據瀏覽器支援情況動態調整。

**參數:** 無

**返回值:**

- `Array<Object>` - 分享選項數組，每個對象包含 `label`、`value`、`icon` 屬性

**使用示例:**

```javascript
import { getShareOptions } from '@/utils/shareUtils'

const shareOptions = getShareOptions()
// [
//   { label: '系統分享', value: 'native', icon: 'pi pi-mobile' },  // 僅在支援時顯示
//   { label: '複製連結', value: 'copylink', icon: 'pi pi-copy' },
//   { label: 'Facebook', value: 'facebook', icon: 'pi pi-facebook' },
//   ...
// ]
```

---

### isMobileDevice()

檢測當前裝置是否為行動裝置。

**參數:** 無

**返回值:**

- `boolean` - 行動裝置返回 `true`，桌面裝置返回 `false`

**使用示例:**

```javascript
import { isMobileDevice } from '@/utils/shareUtils'

if (isMobileDevice()) {
  // 行動裝置特定邏輯
  openAppDeepLink()
} else {
  // 桌面版邏輯
  openWebPage()
}
```

---

### handlePlatformShare(platform, shareData)

統一的分享處理器，根據平台類型執行對應的分享邏輯。

**參數:**

- `platform` - 分享平台名稱 (`'native'` | `'copylink'` | `'facebook'` | `'instagram'` | `'threads'` | `'line'` | `'twitter'` | `'whatsapp'` | `'telegram'`)
- `shareData` - 分享數據對象
  - `shareUrl` (string) - 分享連結
  - `shareTitle` (string) - 分享標題
  - `shareText` (string) - 分享文字

**返回值:**

- `Promise<Object>` - 分享結果對象
  - `success` (boolean) - 分享是否成功
  - `message` (string) - 結果訊息
  - `type` (string) - 訊息類型 (`'success'` | `'info'` | `'error'`)

**使用示例:**

```javascript
import { handlePlatformShare } from '@/utils/shareUtils'

const shareData = {
  shareUrl: 'https://example.com/meme/123',
  shareTitle: '有趣的迷因',
  shareText: '這是一個很有趣的迷因',
}

try {
  const result = await handlePlatformShare('facebook', shareData)
  if (result) {
    toast.add({
      severity: result.type,
      summary: result.type === 'success' ? '成功' : '提示',
      detail: result.message,
      life: 3000,
    })
  }
} catch (error) {
  console.error('分享失敗:', error)
}
```

---

### 平台特定分享函數

#### shareToFacebook(shareUrl)

分享到 Facebook。

#### shareToInstagram(shareUrl)

分享到 Instagram，自動處理行動裝置和桌面版的不同邏輯。

#### shareToThreads(shareTitle, shareUrl)

分享到 Threads。

#### shareToLine(shareTitle, shareUrl)

分享到 Line。

#### shareToTwitter(shareTitle, shareUrl)

分享到 Twitter。

#### shareToWhatsApp(shareTitle, shareUrl)

分享到 WhatsApp。

#### shareToTelegram(shareTitle, shareUrl)

分享到 Telegram。

#### shareToNative(shareTitle, shareText, shareUrl)

使用瀏覽器原生分享 API。

#### shareToCopyLink(shareUrl)

複製連結到剪貼簿。

---

### 輔助函數

#### copyToClipboard(url)

複製文字到剪貼簿。

#### openAppDeepLink(url)

打開應用程式深層連結。

---

## 媒體處理工具 (mediaUtils.js)

處理外部媒體平台 URL 和嵌入功能的工具函數。

### 影片處理

#### isExternalVideoUrl(url)

檢查 URL 是否為支援的外部影片平台。

**參數:**

- `url` (string) - 要檢查的 URL

**返回值:**

- `boolean` - 是外部影片 URL 返回 `true`

**支援平台:**

- YouTube (youtube.com, youtu.be)
- Vimeo (vimeo.com)
- TikTok (tiktok.com)
- Twitch (twitch.tv)
- Dailymotion (dailymotion.com)
- Bilibili (bilibili.com)

**使用示例:**

```javascript
import { isExternalVideoUrl } from '@/utils/mediaUtils'

const isExternal = isExternalVideoUrl(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
) // true
const isNotExternal = isExternalVideoUrl('https://example.com/video.mp4') // false
```

---

#### getEmbedUrl(url)

將外部影片 URL 轉換為嵌入格式的 URL。

**參數:**

- `url` (string) - 原始影片 URL

**返回值:**

- `string` - 嵌入格式的 URL，不支援的 URL 返回原始 URL

**使用示例:**

```javascript
import { getEmbedUrl } from '@/utils/mediaUtils'

// YouTube
const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
const embedUrl = getEmbedUrl(youtubeUrl) // 'https://www.youtube.com/embed/dQw4w9WgXcQ'

// Vimeo
const vimeoUrl = 'https://vimeo.com/123456789'
const vimeoEmbed = getEmbedUrl(vimeoUrl) // 'https://player.vimeo.com/video/123456789'
```

---

### 音訊處理

#### isExternalAudioUrl(url)

檢查 URL 是否為支援的外部音訊平台。

**參數:**

- `url` (string) - 要檢查的 URL

**返回值:**

- `boolean` - 是外部音訊 URL 返回 `true`

**支援平台:**

- YouTube (youtube.com, youtu.be)
- SoundCloud (soundcloud.com)
- Spotify (spotify.com, open.spotify.com)
- Anchor.fm (anchor.fm)
- Podbean (podbean.com)
- Buzzsprout (buzzsprout.com)
- Libsyn (libsyn.com)
- Transistor.fm (transistor.fm)

**使用示例:**

```javascript
import { isExternalAudioUrl } from '@/utils/mediaUtils'

const isExternal = isExternalAudioUrl(
  'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
) // true
```

---

#### getAudioEmbedUrl(url)

將外部音訊 URL 轉換為嵌入格式的 URL。

**參數:**

- `url` (string) - 原始音訊 URL

**返回值:**

- `string` - 嵌入格式的 URL，不支援的 URL 返回原始 URL

**使用示例:**

```javascript
import { getAudioEmbedUrl } from '@/utils/mediaUtils'

// Spotify
const spotifyUrl = 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh'
const embedUrl = getAudioEmbedUrl(spotifyUrl) // 'https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh'

// SoundCloud
const soundcloudUrl = 'https://soundcloud.com/user/tracks/123456'
const scEmbed = getAudioEmbedUrl(soundcloudUrl) // SoundCloud 嵌入 URL
```

---

## 使用建議

### 1. 導入規範

```javascript
// 推薦：按需導入
import { getId, formatPublishedTime } from '@/utils/dataUtils'
import { requireLogin } from '@/utils/authUtils'
import { handlePlatformShare } from '@/utils/shareUtils'
import { isExternalVideoUrl, getEmbedUrl } from '@/utils/mediaUtils'

// 避免：全量導入
import * as dataUtils from '@/utils/dataUtils' // ❌
```

### 2. 錯誤處理

```javascript
// 分享功能
try {
  const result = await handlePlatformShare(platform, shareData)
  // 處理結果
} catch (error) {
  console.error('分享失敗:', error)
  // 錯誤處理邏輯
}

// 媒體處理
const embedUrl = getEmbedUrl(videoUrl)
if (embedUrl === videoUrl) {
  // URL 未被轉換，可能不支援該平台
  console.warn('不支援的影片平台:', videoUrl)
}
```

### 3. 性能最佳化

```javascript
// 在組件中使用 computed 屬性
const publishedTime = computed(() => formatPublishedTime(props.meme))
const memeId = computed(() => getMemeId(props.meme))
const canEdit = computed(() => hasPermission(userStore, props.meme))
```

### 4. 類型安全

```javascript
// 在 TypeScript 項目中，建議添加類型檢查
if (!meme?.id && !meme?._id) {
  console.warn('迷因對象缺少 ID 欄位')
  return
}

const memeId = getMemeId(meme)
if (!memeId) {
  console.error('無法獲取有效的迷因 ID')
  return
}
```

---

## 更新記錄

- **2025-07-29**: 初始版本，包含所有工具函數文檔
- 記錄了 4 個工具文件的 20+ 個函數
- 提供詳細的參數說明和使用示例

---

## 相關文檔

- [前端搜索實作文檔](./frontend-search-implementation.md)
- [標籤過濾 API 文檔](./tag-filter-api.md)
- [Fuse 搜索 API 文檔](./fuse-search-api.md)
