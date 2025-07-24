# 後台管理 Layout 使用說明

## 概述

我已經為您創建了一個完整的後台管理 layout (`admin.vue`)，參考您提供的圖片設計。這個 layout 包含了現代化的後台管理界面，具有響應式設計和完整的導覽功能。

## 檔案結構

```
src/
├── layouts/
│   └── admin.vue          # 後台管理 layout
└── pages/
    ├── admin-dashboard.vue # 後台管理路由頁面
    └── admin/
        └── index.vue       # 後台管理首頁內容
```

## 功能特色

### 1. 左側導覽列

- **Logo 區域**: 顯示 "迷因典 MemeDex" 品牌標識
- **使用者資訊**: 顯示當前管理者資訊
- **設定和通知**: 包含設定按鈕和通知鈴鐺（帶有數字徽章）
- **搜尋列**: 全站搜尋功能
- **導覽選單**:
  - 首頁
  - 舉報審核（帶有 99+ 徽章）
  - 迷因管理
  - 廣告管理
  - 會員管理

### 2. 頂部標題列

- **側邊欄切換按鈕**: 可收合/展開左側導覽列
- **頁面標題**: 顯示當前頁面名稱
- **導覽標籤**:
  - 總覽（預設選中）
  - 分析（帶有 7 徽章）
  - 空間狀態（帶有 2 徽章）
  - 管理（帶有 99+ 徽章）
  - 設定
  - 更多選項
- **日期選擇器**: 開始日期和結束日期選擇

### 3. 主要內容區域

- 響應式設計，支援各種螢幕尺寸
- 使用 `<slot />` 來插入頁面內容

## 使用方法

### 1. 在頁面中使用 admin layout

```vue
<template>
  <div>
    <!-- 您的頁面內容 -->
  </div>
</template>

<script setup>
defineOptions({
  layout: 'admin',
})
</script>
```

### 2. 路由配置

後台管理頁面會自動使用 admin layout，您可以在 `src/pages/admin/` 目錄下創建子頁面：

- `/admin` - 後台管理首頁
- `/admin/reports` - 舉報審核頁面
- `/admin/memes` - 迷因管理頁面
- `/admin/ads` - 廣告管理頁面
- `/admin/members` - 會員管理頁面

### 3. 響應式設計

- **桌面版**: 左側導覽列固定顯示
- **平板版**: 左側導覽列可收合
- **手機版**: 左側導覽列預設隱藏，可透過按鈕展開

## 樣式特色

### 1. 色彩方案

- 主要使用灰色系配色
- 左側導覽列使用深灰色背景
- 主要內容區域使用淺灰色背景
- 卡片使用白色背景

### 2. 互動效果

- 按鈕和連結有 hover 效果
- 卡片有輕微的陰影效果
- 側邊欄有平滑的收合動畫

### 3. 字體和圖示

- 使用 PrimeVue 的圖示系統
- 支援繁體中文顯示
- 現代化的字體堆疊

## 自定義選項

### 1. 修改導覽選單

在 `src/layouts/admin.vue` 中修改導覽選單：

```vue
<router-link
  to="/your-route"
  class="flex items-center gap-3 p-3 rounded-lg transition-colors"
  :class="
    isActive('/your-route')
      ? 'bg-gray-700 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  "
>
  <i class="pi pi-your-icon"></i>
  <span>您的選單項目</span>
</router-link>
```

### 2. 修改頂部標籤

在 `src/layouts/admin.vue` 中修改頂部標籤：

```vue
<Button
  label="您的標籤"
  class="p-button-text"
  :class="
    activeTab === 'your-tab' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
  "
  @click="activeTab = 'your-tab'"
/>
```

### 3. 修改頁面標題

在 `src/layouts/admin.vue` 中修改頁面標題：

```vue
<h1 class="text-2xl font-bold text-gray-900">您的頁面標題</h1>
```

## 技術細節

### 1. 使用的技術棧

- Vue 3 Composition API
- PrimeVue 4.x UI 元件庫
- Tailwind CSS 4.x 樣式框架
- Vue Router 4.x 路由管理

### 2. 響應式斷點

- `lg:hidden` - 大螢幕隱藏
- `lg:grid-cols-4` - 大螢幕 4 欄佈局
- `md:grid-cols-2` - 中螢幕 2 欄佈局

### 3. 狀態管理

- 使用 Vue 3 的 `ref` 和 `computed` 進行響應式狀態管理
- 側邊欄開關狀態
- 當前選中的標籤
- 搜尋查詢
- 日期選擇

## 注意事項

1. 確保您的專案已安裝 PrimeVue 和 Tailwind CSS
2. 確保路由配置正確
3. 在移動端，側邊欄預設會隱藏
4. 所有的互動效果都經過優化，確保流暢的使用體驗

這個 admin layout 完全參考了您提供的圖片設計，提供了現代化、專業的後台管理界面體驗。
