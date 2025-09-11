# 贊助牆組件使用說明

## 概述

贊助牆組件基於現有的 Marquee 設計，專為顯示 Ko-fi 贊助者而設計。支持按贊助金額分級顯示，並包含豐富的視覺效果。

## 組件列表

### 1. SponsorshipWall.vue

主要組件，整合所有贊助顯示邏輯。

### 2. SponsorCard.vue

用於咖啡等級和雞肉等級贊助者，顯示完整資訊包含留言。

### 3. SponsorCardSlim.vue

用於豆漿等級贊助者，顯示簡潔資訊。

## 使用方法

### 基本用法

```vue
<template>
  <SponsorshipWall :sponsors="sponsorsData" />
</template>

<script setup>
import { SponsorshipWall } from '@/components/ui/marquee'

const sponsorsData = [
  {
    _id: '1',
    from_name: '張三',
    display_name: '咖啡愛好者',
    amount: 200,
    message: '支持你繼續創作！',
    user: {
      username: 'zhangsan',
      avatar: '/avatars/zhangsan.jpg',
    },
  },
  {
    _id: '2',
    from_name: '李四',
    amount: 60,
    user: {
      username: 'lisi',
      avatar: '/avatars/lisi.jpg',
    },
  },
]
</script>
```

### 贊助等級分類

| 等級 | 金額範圍 | 組件            | 樣式特色                     |
| ---- | -------- | --------------- | ---------------------------- |
| 咖啡 | ≥150元   | SponsorCard     | 金色邊框，星星標識，顯示留言 |
| 雞肉 | 60-149元 | SponsorCard     | 橙色邊框，獎杯標識，顯示留言 |
| 豆漿 | 30-59元  | SponsorCardSlim | 藍色邊框，心形標識           |

### 頭像整合邏輯

組件會按以下優先順序選擇頭像：

1. `sponsor.user.avatar` - 用戶系統頭像
2. `sponsor.avatar` - Ko-fi 頭像
3. Dicebear API 生成的頭像 - 使用 username 或 from_name 作為 seed

### 自定義樣式

組件支持暗色主題，並且會根據贊助等級自動應用對應的顏色主題：

- **咖啡等級**: 琥珀色系 (amber)
- **雞肉等級**: 橙色系 (orange)
- **豆漿等級**: 藍色系 (blue)

### 動畫效果

- 支援滑鼠懸停暫停
- 不同等級使用不同滾動速度
- 雞肉等級使用反向滾動效果
- 兩側漸層遮罩效果

## API 參考

### SponsorshipWall Props

| 屬性     | 類型  | 預設值 | 說明           |
| -------- | ----- | ------ | -------------- |
| sponsors | Array | []     | 贊助者數據陣列 |

### SponsorCard Props

| 屬性     | 類型   | 必填 | 說明     |
| -------- | ------ | ---- | -------- |
| img      | String | 是   | 頭像URL  |
| name     | String | 是   | 顯示名稱 |
| username | String | 是   | 用戶名稱 |
| body     | String | 否   | 贊助留言 |
| amount   | Number | 否   | 贊助金額 |
| tier     | String | 否   | 贊助等級 |

### SponsorCardSlim Props

| 屬性     | 類型   | 必填 | 說明     |
| -------- | ------ | ---- | -------- |
| img      | String | 是   | 頭像URL  |
| name     | String | 是   | 顯示名稱 |
| username | String | 是   | 用戶名稱 |
| amount   | Number | 否   | 贊助金額 |
| tier     | String | 否   | 贊助等級 |

## 數據格式

贊助者數據應符合以下格式：

```javascript
{
  _id: String,           // 贊助記錄ID
  from_name: String,     // Ko-fi 提供的名稱
  display_name: String,  // 顯示名稱（可選）
  amount: Number,        // 贊助金額
  message: String,       // 贊助留言（可選）
  avatar: String,        // Ko-fi 頭像URL（可選）
  user: {                // 關聯用戶資訊（可選）
    username: String,
    avatar: String
  }
}
```

## 注意事項

1. 組件會自動按金額分級顯示
2. 只有金額≥30元的贊助者會被顯示
3. 組件完全響應式設計
4. 支持暗色主題自動切換
5. 使用了 Tailwind CSS 進行樣式設計
