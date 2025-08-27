# TipTap 編輯器尺寸選擇功能實作

## 功能概述

為 TipTap 編輯器新增圖片和影片的尺寸選擇功能，類似 Gmail 的做法，提供三個固定尺寸和一個滿版選項。

## 實作架構

### 1. 後端實作

#### Cloudinary 轉換設定 (`memedam_backend/services/uploadService.js`)

```javascript
// 圖片尺寸轉換設定
export const IMAGE_SIZES = {
  s: {
    width: 320,
    height: 240,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '小',
    description: '適合插圖或內嵌小圖',
  },
  m: {
    width: 640,
    height: 480,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '中',
    description: '一般內容圖，清楚又不撐版',
  },
  l: {
    width: 960,
    height: 720,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '大',
    description: '接近滿欄寬，適合重點圖',
  },
  full: {
    width: '100%',
    height: 'auto',
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '滿版',
    description: '自適應容器寬度',
  },
}
```

#### 新增工具函數

- `getImageUrlBySize(publicId, size)`: 根據尺寸取得圖片 URL
- `getImageSrcset(publicId)`: 取得圖片 srcset（支援響應式）

### 2. 前端實作

#### 自定義 Image 擴展 (`memedam/src/utils/tipTapImageExtension.js`)

```javascript
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'm',
        parseHTML: (element) => element.getAttribute('data-size') || 'm',
        renderHTML: (attributes) => {
          return {
            'data-size': attributes.size,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, size } = HTMLAttributes

    // 根據尺寸設定樣式
    const getSizeStyles = (size) => {
      const sizeMap = {
        s: { width: '320px', maxWidth: '320px' },
        m: { width: '640px', maxWidth: '640px' },
        l: { width: '960px', maxWidth: '960px' },
        full: { width: '100%', maxWidth: '100%' },
      }
      return sizeMap[size] || sizeMap.m
    }

    const sizeStyles = getSizeStyles(size)

    // 處理圖片 URL，根據尺寸進行轉換
    const processedSrc = processImageUrl(src, size)

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        src: processedSrc,
        style: `width: ${sizeStyles.width}; max-width: ${sizeStyles.maxWidth}; height: auto; display: block; margin: 1rem auto;`,
        loading: 'lazy',
        decoding: 'async',
      }),
    ]
  },
})
```

#### 圖片工具函數 (`memedam/src/utils/imageUtils.js`)

- `extractPublicIdFromUrl(url)`: 從 Cloudinary URL 提取 public_id
- `isCloudinaryUrl(url)`: 檢查是否為 Cloudinary URL
- `getCloudinaryImageUrl(publicId, size)`: 根據尺寸取得 Cloudinary 圖片 URL
- `processImageUrl(url, size)`: 處理圖片 URL，支援尺寸轉換

#### 編輯器 UI 更新 (`memedam/src/components/TipTapEditor.vue`)

在圖片和影片對話框中新增尺寸選擇 UI：

```vue
<!-- 圖片尺寸選擇 -->
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
    圖片尺寸
  </label>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-for="option in imageSizeOptions"
      :key="option.value"
      @click="selectedImageSize = option.value"
      :class="[
        'p-3 border rounded-lg cursor-pointer transition-colors',
        selectedImageSize === option.value
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      ]"
    >
      <div class="font-medium text-sm">{{ option.label }}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ option.description }}
      </div>
    </div>
  </div>
</div>
```

## 尺寸規格

### 圖片尺寸

#### 橫式圖片 (4:3)

| 尺寸   | 寬度×高度 | 用途           |
| ------ | --------- | -------------- |
| 小 (S) | 320×240   | 插圖、內嵌小圖 |
| 中 (M) | 640×480   | 一般內容圖     |
| 大 (L) | 960×720   | 重點圖片       |
| 滿版   | 100%      | 自適應寬度     |

#### 直式圖片 (3:4)

| 尺寸   | 寬度×高度 | 用途     |
| ------ | --------- | -------- |
| 小 (S) | 240×320   | 適合手機 |
| 中 (M) | 480×640   | 一般內容 |
| 大 (L) | 720×960   | 重點圖片 |

### 影片尺寸

#### 橫式影片 (16:9)

| 尺寸   | 寬度×高度 | 用途       |
| ------ | --------- | ---------- |
| 小 (S) | 480×270   | 適合小螢幕 |
| 中 (M) | 640×360   | 一般內容   |
| 大 (L) | 960×540   | 重點影片   |
| 滿版   | 100%      | 自適應寬度 |

#### 直式影片 (9:16)

| 尺寸   | 寬度×高度 | 用途       |
| ------ | --------- | ---------- |
| 小 (S) | 360×640   | 適合手機   |
| 中 (M) | 450×800   | 一般內容   |
| 大 (L) | 540×960   | 重點影片   |
| 滿版   | 100%      | 自適應寬度 |

## 使用方式

### 1. 插入圖片

1. 點擊編輯器工具列的圖片按鈕
2. 選擇上傳圖片或使用連結
3. 選擇圖片方向（橫式或直式）
4. 選擇圖片尺寸（小、中、大、滿版）
5. 點擊確認插入

### 2. 插入影片

1. 點擊編輯器工具列的影片按鈕
2. 輸入支援的影片平台連結
3. 選擇影片方向（橫式或直式）
4. 選擇影片尺寸（小、中、大、滿版）
5. 點擊確認插入

## 支援的影片平台

- YouTube
- Vimeo
- TikTok
- Twitch
- Dailymotion
- Bilibili

## 技術特點

### 1. Cloudinary 轉換

- 使用 `c_limit` 防止小圖被放大
- 自動品質和格式優化 (`q_auto,f_auto`)
- 支援視網膜螢幕 (`dpr_auto`)

### 2. 響應式設計

- 圖片支援 srcset 響應式載入
- 影片使用 aspect-ratio 保持比例
- 自適應容器寬度

### 3. 效能優化

- 懶載入 (`loading="lazy"`)
- 非同步解碼 (`decoding="async"`)
- 自動格式選擇

## 未來擴展

1. **更多尺寸選項**: 可根據需求新增更多尺寸
2. **自定義尺寸**: 允許使用者輸入自定義寬度
3. **拖拽調整**: 支援拖拽調整圖片和影片大小
4. **預設偏好**: 記住使用者的尺寸偏好設定
