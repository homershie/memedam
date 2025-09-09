# Ko-fi Webhooks 整合規劃文件

## ✅ 功能實作進度檢查表

### 📊 實作統計

- **總項目數**: 20 個主要功能模組
- **已完成**: 0 / 20 (0%)
- **進行中**: 0 / 20 (0%)
- **待開始**: 20 / 20 (100%)

### 🔴 高優先順序（核心功能）

#### 1. 工作佇列架構

- [ ] 安裝並配置 BullMQ 和 Redis
- [ ] 建立基礎工作佇列服務
- [ ] 實作同步快回 + 非同步處理
- [ ] 設定重試間隔（指數退避）
- [ ] 實作 Dead-Letter Queue（DLQ）
- [ ] Admin 頁面「一鍵重放」功能

#### 2. 絕對冪等

- [ ] 建立 `message_id` UNIQUE 索引
- [ ] 建立 `kofi_transaction_id` UNIQUE 索引
- [ ] 實作工作層去重排程
- [ ] 防重複交易處理邏輯
- [ ] 防重複訊息處理邏輯

#### 3. 輸入驗證

- [ ] 安裝 Zod 驗證套件
- [ ] 建立 Webhook 數據 schema
- [ ] 實作請求驗證中間件
- [ ] 整合到 Webhook 處理流程
- [ ] 錯誤處理與回饋

#### 4. 資料庫索引

- [ ] 建立 `(is_public, sponsor_level, createdAt)` 複合索引
- [ ] 建立 `(user_id, email, createdAt)` 統計索引
- [ ] 建立 `claimed_by_user_id` 和 `claim_token` 索引
- [ ] 建立 `refunded_at` 和審核狀態索引
- [ ] 效能測試與優化

### 🟡 中優先順序（重要功能）

#### 5. XSS 安全

- [ ] 實作訊息 XSS 清洗
- [ ] 設定長度限制
- [ ] 建立表情符號安全白名單
- [ ] 整合到數據處理流程

#### 6. 多項目支援

- [ ] 解析 `shop_items` 數量處理
- [ ] 實作合併規則邏輯（最高等級優先）
- [ ] 更新前端顯示邏輯
- [ ] 測試複雜訂單場景

#### 7. 用戶整合

- [ ] 實作 email 匹配現有用戶邏輯
- [ ] 更新頭像顯示優先級
- [ ] 整合 Discord 頭像支援
- [ ] 測試用戶關聯功能

#### 8. 隱私遵循

- [ ] 實作 `is_public=false` 處理
- [ ] PII 最小化（shipping 資訊）
- [ ] GDPR/CCPA 合規檢查
- [ ] 後台刪除/匿名化功能

#### 9. 退款處理機制

- [ ] Admin 手動標記退款介面
- [ ] 自動更新 `status=refunded`
- [ ] 撤除贊助牆露出邏輯
- [ ] 回沖統計數據功能
- [ ] 快取失效處理

#### 10. 匿名認領機制

- [ ] 生成認領 token 邏輯
- [ ] 認領連結頁面開發
- [ ] token 驗證與過期處理
- [ ] 用戶綁定後數據遷移
- [ ] 歷史記錄關聯維護

#### 11. 訊息審核系統

- [ ] 自動過濾 + 黑名單詞庫
- [ ] 人工審核介面（黃金級必審）
- [ ] 審核狀態管理
- [ ] 審核日誌記錄

### 🟢 低優先順序（增強功能）

#### 12. 幣別換匯

- [ ] 實作匯率獲取服務
- [ ] 自動轉換為 TWD 顯示
- [ ] 快取匯率數據
- [ ] 多幣別前端顯示

#### 13. 版本控制

- [ ] 產品配置版本管理
- [ ] `effective_from/until` 邏輯
- [ ] 商品變更歷史追蹤
- [ ] 管理介面支援

#### 14. 進階監控

- [ ] BullMQ 儀表板整合
- [ ] 關鍵指標收集（延遲、佇列深度、失敗率）
- [ ] 智能告警設定
- [ ] 結構化日誌系統

### 🎨 前端功能

#### 15. 贊助牆組件

- [ ] `SponsorshipWall.vue` 組件開發
- [ ] `SponsorCard.vue` 和 `SponsorCardSlim.vue` 開發
- [ ] 沿用現有 Marquee 設計
- [ ] 按等級分類顯示邏輯

#### 16. 捐款頁面增強

- [ ] 贊助等級說明 UI
- [ ] Email 匹配提示
- [ ] 認領功能入口
- [ ] Webhook 狀態指示器

### 🛠️ 管理介面

#### 17. Admin 功能

- [ ] 贊助者管理頁面
- [ ] 統計數據儀表板
- [ ] 商品管理功能
- [ ] DLQ 重放介面
- [ ] 退款處理介面
- [ ] 訊息審核介面
- [ ] 贊助認領管理

### 🧪 測試與部署

#### 18. 測試實現

- [ ] 單元測試（Webhook、驗證、服務）
- [ ] 整合測試（端到端流程）
- [ ] 負載測試（高併發場景）
- [ ] 安全測試（XSS、輸入驗證）
- [ ] 業務邏輯測試（退款、認領、審核）

#### 19. 部署與監控

- [ ] Ko-fi Webhook URL 配置
- [ ] 生產環境部署
- [ ] 監控系統上線
- [ ] 錯誤追蹤設定

### 📚 文件與維護

#### 20. 文件完善

- [ ] API 文檔更新
- [ ] 用戶操作指南
- [ ] 管理員操作手冊
- [ ] 故障排除指南

---

### 🎯 下一步行動

1. **開始第一階段**：擴展資料庫結構，建立基礎表和索引
2. **設定開發環境**：配置 BullMQ 和 Redis
3. **實作核心 Webhook**：基本接收和驗證邏輯
4. **建立測試框架**：為各功能模組準備單元測試

**更新說明**: 請在使用過程中更新對應的 checkbox，並在 commit message 中標註進度變化。

---

## 📋 專案概述

本文件規劃將 Ko-fi 支付平台的 Webhooks 功能整合到迷因典網站，專注處理 Shop Order 類型的贊助，實現自動化的贊助者管理系統和動態贊助牆展示。

## 🎯 功能目標

### 1. Webhooks 整合

- 接收 Ko-fi 發送的 Shop Order 支付完成通知
- 驗證請求真實性
- 根據 `direct_link_code` 自動識別贊助等級
- 自動處理贊助數據

### 2. 贊助等級系統

#### 商品配置

- **豆漿贊助 (30元)**：`direct_link_code: "c4043b71a4"` → 義美無加糖厚豆奶
- **雞肉贊助 (60元)**：`direct_link_code: "b7e4575bf6"` → 泰式香檸嫩雞胸
- **咖啡贊助 (150元)**：`direct_link_code: "25678099a7"` → 星巴克特大杯那堤

#### 顯示規則

- **豆漿贊助 (30元)**：顯示贊助者姓名
- **雞肉贊助 (60元)**：顯示姓名 + 留言
- **咖啡贊助 (150元)**：顯示姓名 + 留言 + 專屬徽章

### 3. 動態贊助牆

- 即時更新贊助資訊（Webhook 觸發）
- 根據贊助等級顯示不同內容
- 支援隱私設定（不公開的贊助不顯示）
- 與現有用戶系統整合（頭像和顯示名稱）

## 🏗️ 技術架構

### 後端架構

#### 1. Webhook 接收服務 (`/api/webhooks/kofi`)

```javascript
// 路由設計
POST / api / webhooks / kofi / shop - orders // 主要處理 Shop Order
```

#### 2. 驗證機制

- 驗證 `verification_token`
- 檢查請求來源 IP
- 防止重複處理（使用 `message_id`）
- 驗證 `direct_link_code` 合法性

#### 3. 數據處理流程

```
收到 Shop Order Webhook → 驗證請求 → 解析 direct_link_code → 確定贊助等級 → 比對用戶資料庫 → 儲存贊助數據 → 更新快取 → 返回 200 狀態碼
```

### 前端架構

#### 1. 贊助牆組件 (`SponsorshipWall.vue`)

沿用現有 index.vue 中的 Marquee 組件設計，使用 `ReviewCard` 和 `ReviewCardSlim` 組件：

```vue
<template>
  <!-- 贊助用戶銘謝 -->
  <div
    class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background my-30"
  >
    <h2 class="mb-8 text-center">感謝贊助！</h2>

    <!-- 咖啡贊助者 Marquee (150元) -->
    <Marquee pause-on-hover class="transition-transform duration-20s">
      <SponsorCard
        v-for="sponsor in coffeeSponsors"
        :key="sponsor._id"
        :img="getSponsorAvatar(sponsor)"
        :name="sponsor.display_name || sponsor.from_name"
        :username="sponsor.user?.username || sponsor.from_name"
        :body="sponsor.message"
        :amount="sponsor.amount"
        :tier="'coffee'"
      />
    </Marquee>

    <!-- 雞肉贊助者 Marquee (60元，反向) -->
    <Marquee reverse pause-on-hover class="transition-transform duration-20s">
      <SponsorCardSlim
        v-for="sponsor in chickenSponsors"
        :key="sponsor._id"
        :img="getSponsorAvatar(sponsor)"
        :name="sponsor.display_name || sponsor.from_name"
        :username="sponsor.user?.username || sponsor.from_name"
        :amount="sponsor.amount"
        :tier="'chicken'"
      />
    </Marquee>

    <!-- 豆漿贊助者 Marquee (30元) -->
    <Marquee pause-on-hover class="transition-transform duration-20s">
      <SponsorCardSlim
        v-for="sponsor in soySponsors"
        :key="sponsor._id"
        :img="getSponsorAvatar(sponsor)"
        :name="sponsor.display_name || sponsor.from_name"
        :username="sponsor.user?.username || sponsor.from_name"
        :amount="sponsor.amount"
        :tier="'soy'"
      />
    </Marquee>

    <!-- Left Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
    ></div>

    <!-- Right Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
    ></div>
  </div>
</template>
```

#### 2. 贊助卡片組件

基於現有的 `ReviewCard` 和 `ReviewCardSlim` 組件創建專門的贊助卡片：

**SponsorCard.vue** (用於黃金級，顯示留言):

```vue
<template>
  <div class="sponsor-card gold">
    <div class="card-content">
      <div class="avatar-section">
        <img :src="img" :alt="name" class="avatar" />
        <div v-if="tier === 'coffee'" class="coffee-badge">
          <i class="pi pi-star"></i>
        </div>
      </div>
      <div class="info-section">
        <h4 class="sponsor-name">{{ name }}</h4>
        <p class="sponsor-message">{{ body }}</p>
        <span class="amount">${{ amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  name: String,
  username: String,
  body: String,
  amount: Number,
  tier: String,
})
</script>
```

**SponsorCardSlim.vue** (用於雞肉贊助和豆漿贊助):

```vue
<template>
  <div :class="['sponsor-card-slim', tier]">
    <div class="card-content">
      <div class="avatar-section">
        <img :src="img" :alt="name" class="avatar" />
        <div v-if="tier === 'chicken'" class="tier-indicator">
          <i class="pi pi-trophy"></i>
        </div>
      </div>
      <div class="info-section">
        <h4 class="sponsor-name">{{ name }}</h4>
        <span class="amount">${{ amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  name: String,
  username: String,
  amount: Number,
  tier: String,
})
</script>
```

#### 3. 捐款頁面增強 (`donate.vue`)

```vue
<template>
  <!-- 現有捐款按鈕 -->
  <Button label="贊助" @click="handleDonate(amount)" />

  <!-- 露出規則說明 -->
  <div class="sponsorship-rules">
    <h4>贊助等級說明</h4>
    <div class="rule-item">
      <span class="tier-name">🍵 豆漿贊助 (30元)</span>
      <span class="rule-desc">顯示贊助者姓名</span>
    </div>
    <div class="rule-item">
      <span class="tier-name">🍗 雞肉贊助 (60元)</span>
      <span class="rule-desc">顯示姓名 + 留言</span>
    </div>
    <div class="rule-item">
      <span class="tier-name">☕ 咖啡贊助 (150元)</span>
      <span class="rule-desc">顯示姓名 + 留言 + 專屬徽章</span>
    </div>

    <div class="privacy-notice">
      <i class="pi pi-info-circle"></i>
      <span>使用與網站相同的 email 可自動顯示您的頭像和名稱</span>
    </div>
  </div>

  <!-- Webhook 狀態指示器 -->
  <div v-if="webhookConfigured" class="webhook-status">
    <i class="pi pi-check-circle text-green-500"></i>
    <span>已啟用即時贊助牆更新</span>
  </div>

  <!-- 認領贊助功能 -->
  <div v-if="hasUnclaimedSponsorships" class="claim-section">
    <h4>認領您的贊助</h4>
    <p>我們偵測到您可能有未認領的贊助記錄，認領後可顯示您的個人頭像和名稱。</p>
    <Button label="查看認領記錄" @click="showClaimDialog" />
  </div>
</template>

<script setup>
const hasUnclaimedSponsorships = ref(false)
const showClaimDialog = () => {
  // 實作認領對話框邏輯
}
</script>
```

## 📊 資料庫設計

### 1. 贊助者表 (`sponsors`) - 基於現有 Sponsor.js 模型擴展

```javascript
// 基於現有的 models/Sponsor.js 進行擴展
{
  _id: ObjectId,
  // 原有字段（保留）
  user_id: ObjectId, // 用戶ID（當email匹配現有用戶時設置）
  status: String, // 狀態：pending, success, failed, refunded
  amount: Number, // 贊助金額
  message: String, // 留言內容
  payment_method: String, // 支付方式（固定為 'ko-fi'）
  transaction_id: String, // 第三方金流訂單號
  created_ip: String, // 下單時IP

  // Ko-fi Shop Order 新增字段
  kofi_transaction_id: String, // Ko-fi 交易 ID
  from_name: String, // 贊助者姓名 (Ko-fi 提供)
  display_name: String, // 顯示名稱 (從用戶資料庫獲取)
  email: String, // 贊助者信箱
  discord_username: String, // Discord 用戶名
  discord_userid: String, // Discord 用戶 ID
  currency: String, // 貨幣類型 (預設 'USD')
  type: String, // 固定為 "Shop Order"
  direct_link_code: String, // 商品 direct_link_code
  shop_items: Array, // Ko-fi shop_items 詳細資訊
  shipping: Object, // 運送資訊
  is_public: Boolean, // 是否公開顯示 (預設 true)
  sponsor_level: String, // soy, chicken, coffee (根據 direct_link_code 判斷)
  badge_earned: Boolean, // 是否獲得徽章 (咖啡贊助為 true)

  // 時間戳（由 timestamps: true 自動生成）
  createdAt: Date,
  updatedAt: Date
}
```

### 更新現有 Sponsor.js 模型

將現有的 `models/Sponsor.js` 更新為支持 Ko-fi Webhooks：

```javascript
// models/Sponsor.js
const SponsorSchema = new mongoose.Schema(
  {
    // 原有字段（保留）
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // 移除 required，因為匿名贊助不需要用戶ID
      validate: {
        validator: (v) => !v || mongoose.Types.ObjectId.isValid(v),
        message: '用戶ID必須是有效的ObjectId',
      },
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'success', 'failed', 'refunded'],
        message: '狀態必須是 pending、success、failed、refunded',
      },
    },
    amount: {
      type: Number,
      required: [true, '金額為必填'],
      min: [1, '金額必須大於0'],
      max: [1000000, '金額過大'],
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, '留言長度不能超過1000字'],
    },
    payment_method: {
      type: String,
      default: 'ko-fi', // 預設為 ko-fi
      trim: true,
      maxlength: [50, '支付方式長度不能超過50字'],
    },
    transaction_id: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, '訂單號長度不能超過100字'],
    },
    created_ip: {
      type: String,
      default: '',
      trim: true,
      maxlength: [45, 'IP位址長度不能超過45字'],
      validate: {
        validator: (v) => !v || validator.isIP(v, 4) || validator.isIP(v, 6),
        message: 'IP位址格式不正確',
      },
    },

    // Ko-fi Shop Order 新增字段
    kofi_transaction_id: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Ko-fi 交易ID長度不能超過100字'],
    },
    from_name: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, '姓名長度不能超過100字'],
    },
    display_name: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, '顯示名稱長度不能超過100字'],
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      maxlength: [255, '信箱長度不能超過255字'],
      validate: {
        validator: (v) => !v || validator.isEmail(v),
        message: '信箱格式不正確',
      },
    },
    discord_username: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Discord 用戶名長度不能超過100字'],
    },
    discord_userid: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'Discord 用戶ID長度不能超過50字'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      maxlength: [10, '貨幣代碼長度不能超過10字'],
    },
    type: {
      type: String,
      default: 'Shop Order',
      trim: true,
      maxlength: [50, '類型長度不能超過50字'],
    },
    direct_link_code: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, '商品代碼長度不能超過50字'],
    },
    shop_items: [
      {
        direct_link_code: String,
        variation_name: String,
        quantity: Number,
      },
    ],
    shipping: {
      full_name: String,
      street_address: String,
      city: String,
      state_or_province: String,
      postal_code: String,
      country: String,
      country_code: String,
      telephone: String,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    sponsor_level: {
      type: String,
      default: 'soy',
      enum: {
        values: ['soy', 'chicken', 'coffee'],
        message: '贊助等級必須是 soy、chicken、coffee',
      },
    },
    badge_earned: {
      type: Boolean,
      default: false,
    },

    // 退款處理（ChatGPT 建議）
    refunded_at: {
      type: Date,
      default: null,
      comment: '退款處理時間',
    },
    refund_reason: {
      type: String,
      default: '',
      maxlength: [200, '退款原因長度不能超過200字'],
      comment: '退款原因說明',
    },
    refund_amount: {
      type: Number,
      default: null,
      comment: '實際退款金額',
    },

    // 認領機制（ChatGPT 建議）
    claimed_by_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      comment: '認領此贊助的用戶ID（用於匿名贊助後綁定）',
    },
    claim_token: {
      type: String,
      default: '',
      comment: '認領用的臨時token',
    },
    claim_token_expires: {
      type: Date,
      default: null,
      comment: '認領token過期時間',
    },

    // 訊息審核
    message_reviewed: {
      type: Boolean,
      default: false,
      comment: '留言是否已通過審核',
    },
    message_auto_filtered: {
      type: Boolean,
      default: false,
      comment: '留言是否被自動過濾',
    },

    // 多幣別支援（ChatGPT 建議）
    amount_twd: {
      type: Number,
      default: null,
      comment: '轉換後的台幣金額（依匯率計算）',
    },

    // 統計與分析欄位
    processed_at: {
      type: Date,
      default: null,
      comment: '實際處理完成的時間戳',
    },
    retry_count: {
      type: Number,
      default: 0,
      comment: '重試次數',
    },
    error_message: {
      type: String,
      default: '',
      maxlength: [500, '錯誤訊息長度不能超過500字'],
      comment: '處理失敗的錯誤訊息',
    },
  },
  {
    collection: 'sponsors',
    timestamps: true,
    versionKey: false,
  },
)

// 資料庫索引（ChatGPT 建議）
SponsorSchema.index({ message_id: 1 }, { unique: true }) // 防重複處理
SponsorSchema.index({ kofi_transaction_id: 1 }, { unique: true }) // 防重複交易
SponsorSchema.index({ email: 1 }) // 用戶查詢
SponsorSchema.index({ user_id: 1 }) // 用戶關聯查詢
SponsorSchema.index({ claimed_by_user_id: 1 }) // 認領用戶查詢
SponsorSchema.index({ claim_token: 1 }) // 認領token查詢
SponsorSchema.index({ is_public: 1, sponsor_level: 1, createdAt: -1 }) // 前端顯示查詢
SponsorSchema.index({ status: 1, createdAt: -1 }) // 管理後台查詢
SponsorSchema.index({ refunded_at: 1 }) // 退款查詢
SponsorSchema.index({ message_reviewed: 1, message_auto_filtered: 1 }) // 審核狀態查詢
SponsorSchema.index({ direct_link_code: 1 }) // 商品統計查詢
```

### 2. 贊助記錄表 (`sponsorship_logs`)

```javascript
{
  _id: ObjectId,
  sponsor_id: ObjectId,
  message_id: String, // Ko-fi message_id (防重複處理)
  transaction_id: String,
  direct_link_code: String, // 用於追蹤商品類型
  amount: Number,
  currency: String,
  type: String, // 固定為 "Shop Order"
  status: String, // pending, processed, failed
  webhook_data: Object, // 完整的 webhook 數據
  processed_at: Date,
  retry_count: Number,
  error_message: String // 錯誤訊息
}
```

### 3. 用戶贊助統計表 (`user_sponsorship_stats`)

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  total_amount: Number,
  total_count: Number,
  sponsor_level: String, // 最高贊助等級
  badge_earned: Boolean,
  last_sponsorship_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### 4. 商品映射表 (`sponsorship_products`) - 支援版本控制

```javascript
{
  _id: ObjectId,
  direct_link_code: String, // Ko-fi direct_link_code
  name: String, // 商品名稱
  amount: Number, // 商品價格
  currency: String, // 貨幣類型（預設 'USD'）
  sponsor_level: String, // soy, chicken, coffee
  badge_earned: Boolean, // 是否獲得徽章
  is_active: Boolean, // 是否啟用

  // 版本控制（ChatGPT 建議）
  version: {
    type: Number,
    default: 1,
    comment: '配置版本號'
  },
  effective_from: {
    type: Date,
    default: Date.now,
    comment: '生效開始時間'
  },
  effective_until: {
    type: Date,
    default: null,
    comment: '生效結束時間（null 表示永久有效）'
  },

  // 多項目處理支援
  max_quantity: {
    type: Number,
    default: 1,
    comment: '單筆訂單最大數量限制'
  },
  combine_rule: {
    type: String,
    default: 'highest', // highest, sum, average
    enum: ['highest', 'sum', 'average'],
    comment: '多項目合併規則：最高等級、總和、平均'
  },

  created_at: Date,
  updated_at: Date
}

// 預設數據
[
  {
    direct_link_code: "c4043b71a4",
    name: "豆漿贊助",
    amount: 30,
    sponsor_level: "soy",
    badge_earned: false,
    is_active: true
  },
  {
    direct_link_code: "b7e4575bf6",
    name: "雞肉贊助",
    amount: 60,
    sponsor_level: "chicken",
    badge_earned: false,
    is_active: true
  },
  {
    direct_link_code: "25678099a7",
    name: "咖啡贊助",
    amount: 150,
    sponsor_level: "coffee",
    badge_earned: true,
    is_active: true
  }
]
```

## 🔧 實作細節

### 後端實作

#### 1. Webhook 控制器 (`webhookController.js`)

```javascript
const handleKofiShopOrderWebhook = async (req, res) => {
  try {
    // 1. 驗證請求
    const isValid = await validateWebhookRequest(req)
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid webhook request' })
    }

    // 2. 解析數據
    const webhookData = req.body.data
    const paymentData = JSON.parse(webhookData)

    // 3. 檢查是否為 Shop Order
    if (paymentData.type !== 'Shop Order') {
      return res
        .status(400)
        .json({ error: 'Only Shop Order webhooks are supported' })
    }

    // 4. 檢查是否已處理過
    const existingLog = await SponsorshipLog.findOne({
      message_id: paymentData.message_id,
    })

    if (existingLog) {
      return res.status(200).json({ message: 'Already processed' })
    }

    // 5. 處理 Shop Order 數據
    const sponsor = await processShopOrderData(paymentData)

    // 6. 記錄處理日誌
    await createSponsorshipLog(paymentData, 'processed')

    // 7. 更新快取
    await updateSponsorshipCache()

    res
      .status(200)
      .json({ message: 'Shop Order webhook processed successfully' })
  } catch (error) {
    console.error('Shop Order webhook processing error:', error)

    // 記錄錯誤日誌
    await createSponsorshipLog(req.body, 'failed')

    res.status(500).json({ error: 'Internal server error' })
  }
}
```

#### 2. Shop Order 數據處理服務 (`sponsorshipService.js`)

```javascript
const processShopOrderData = async (paymentData) => {
  // 1. 從 shop_items 中提取 direct_link_code
  const directLinkCode = extractDirectLinkCode(paymentData.shop_items)

  // 2. 根據 direct_link_code 確定贊助等級
  const sponsorLevel = await determineSponsorLevelByCode(directLinkCode)

  // 3. 根據 email 查找現有用戶
  const existingUser = await findUserByEmail(paymentData.email)

  // 4. 查找或創建贊助者
  let sponsor = await findOrCreateSponsor(paymentData, existingUser)

  // 5. 更新贊助者資訊
  sponsor = await updateSponsorInfo(
    sponsor,
    paymentData,
    sponsorLevel,
    directLinkCode,
  )

  // 6. 如果關聯到現有用戶，更新用戶統計
  if (existingUser) {
    await updateUserSponsorshipStats(
      existingUser._id,
      paymentData,
      sponsorLevel,
    )
  }

  // 7. 如果是首次贊助，發送歡迎通知
  if (isFirstTimeSponsor(sponsor)) {
    await sendWelcomeNotification(sponsor)
  }

  return sponsor
}

const extractDirectLinkCode = (shopItems) => {
  // 從 shop_items 中提取第一個商品的 direct_link_code
  if (shopItems && shopItems.length > 0) {
    return shopItems[0].direct_link_code
  }
  throw new Error('No shop items found in webhook data')
}

const determineSponsorLevelByCode = async (directLinkCode) => {
  // 查詢商品映射表
  const product = await SponsorshipProduct.findOne({
    direct_link_code: directLinkCode,
    is_active: true,
  })

  if (!product) {
    throw new Error(`Unknown product with direct_link_code: ${directLinkCode}`)
  }

  return {
    level: product.sponsor_level,
    badgeEarned: product.badge_earned,
    amount: product.amount,
  }

  // 備用：直接根據 direct_link_code 判斷等級
  const getSponsorLevelByCode = (directLinkCode) => {
    const levelMap = {
      c4043b71a4: 'soy', // 豆漿贊助
      b7e4575bf6: 'chicken', // 雞肉贊助
      '25678099a7': 'coffee', // 咖啡贊助
    }
    return levelMap[directLinkCode] || 'soy'
  }
}

// 多項目處理（ChatGPT 建議）
const processMultipleItems = async (shopItems) => {
  if (!shopItems || shopItems.length === 0) {
    throw new Error('No shop items found')
  }

  // 1. 取得所有項目的產品資訊
  const products = []
  for (const item of shopItems) {
    const product = await SponsorshipProduct.findOne({
      direct_link_code: item.direct_link_code,
      is_active: true,
      $or: [
        { effective_until: null },
        { effective_until: { $gte: new Date() } },
      ],
    })

    if (!product) {
      throw new Error(`Unknown or inactive product: ${item.direct_link_code}`)
    }

    products.push({
      ...product.toObject(),
      quantity: item.quantity || 1,
      variation_name: item.variation_name,
    })
  }

  // 2. 根據合併規則計算最終等級
  const finalLevel = calculateCombinedLevel(products)

  // 3. 計算總金額
  const totalAmount = products.reduce(
    (sum, product) => sum + product.amount * product.quantity,
    0,
  )

  return {
    products,
    finalLevel,
    totalAmount,
    currency: products[0].currency, // 假設所有項目使用相同貨幣
  }
}

const calculateCombinedLevel = (products) => {
  const levels = ['soy', 'chicken', 'coffee']
  const levelValues = { soy: 1, chicken: 2, coffee: 3 }

  let highestLevel = 'soy'
  let highestValue = 1

  for (const product of products) {
    const levelValue = levelValues[product.sponsor_level] || 1
    if (levelValue > highestValue) {
      highestValue = levelValue
      highestLevel = product.sponsor_level
    }
  }

  return highestLevel
}

// 幣別換匯（ChatGPT 建議）
const convertToTWD = async (amount, currency) => {
  if (currency === 'TWD') {
    return amount
  }

  // 從快取取得匯率（應該有排程每天更新）
  const exchangeRate = await getExchangeRate(currency, 'TWD')

  if (!exchangeRate) {
    console.warn(`Exchange rate not found for ${currency} to TWD`)
    return null
  }

  return Math.round(amount * exchangeRate * 100) / 100 // 保留兩位小數
}

const getExchangeRate = async (fromCurrency, toCurrency) => {
  // 實作邏輯：從 Redis 快取或資料庫取得匯率
  // 建議每天排程從 Fixer/ECB API 更新匯率
  const cacheKey = `exchange_rate:${fromCurrency}:${toCurrency}`
  const cachedRate = await redis.get(cacheKey)

  return cachedRate ? parseFloat(cachedRate) : null
}

// 認領機制（ChatGPT 建議）
const generateClaimToken = async (sponsorId) => {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天後過期

  await Sponsor.findByIdAndUpdate(sponsorId, {
    claim_token: token,
    claim_token_expires: expiresAt,
  })

  return token
}

const claimSponsorship = async (token, userId) => {
  const sponsor = await Sponsor.findOne({
    claim_token: token,
    claim_token_expires: { $gt: new Date() },
    $or: [
      { user_id: null },
      { user_id: { $ne: userId } }, // 允許其他用戶認領（如果原本未綁定）
    ],
  })

  if (!sponsor) {
    throw new Error('認領token無效或已過期')
  }

  // 更新贊助記錄
  sponsor.user_id = userId
  sponsor.claimed_by_user_id = userId
  sponsor.claim_token = '' // 清空token
  sponsor.claim_token_expires = null
  await sponsor.save()

  // 更新用戶統計
  await updateUserSponsorshipStats(userId, null, sponsor.sponsor_level)

  return sponsor
}

// 退款處理（ChatGPT 建議）
const processRefund = async (sponsorId, refundReason, refundAmount = null) => {
  const sponsor = await Sponsor.findById(sponsorId)

  if (!sponsor) {
    throw new Error('贊助記錄不存在')
  }

  if (sponsor.status === 'refunded') {
    throw new Error('此筆贊助已處理退款')
  }

  // 更新贊助狀態
  sponsor.status = 'refunded'
  sponsor.refunded_at = new Date()
  sponsor.refund_reason = refundReason
  sponsor.refund_amount = refundAmount || sponsor.amount
  await sponsor.save()

  // 回沖統計數據
  if (sponsor.user_id) {
    await rollbackUserSponsorshipStats(
      sponsor.user_id,
      sponsor.sponsor_level,
      sponsor.amount,
    )
  }

  // 從快取中移除
  await invalidateSponsorCache(sponsor.sponsor_level)

  return sponsor
}

// 訊息審核（ChatGPT 建議）
const reviewMessage = async (sponsorId, approved, adminUserId) => {
  const sponsor = await Sponsor.findById(sponsorId)

  if (!sponsor) {
    throw new Error('贊助記錄不存在')
  }

  if (approved) {
    sponsor.message_reviewed = true
    sponsor.message_auto_filtered = false
  } else {
    sponsor.is_public = false // 不通過則隱藏
  }

  await sponsor.save()

  // 記錄審核日誌
  await createReviewLog(sponsorId, approved, adminUserId)

  return sponsor
}

const findUserByEmail = async (email) => {
  if (!email) return null

  const user = await User.findOne({ email: email.toLowerCase() })
  return user
}

const findOrCreateSponsor = async (paymentData, existingUser) => {
  // 查找現有贊助者（根據 email）
  let sponsor = await Sponsor.findOne({
    email: paymentData.email.toLowerCase(),
  })

  if (!sponsor) {
    // 創建新贊助者
    sponsor = new Sponsor({
      from_name: paymentData.from_name,
      email: paymentData.email,
      discord_username: paymentData.discord_username,
      discord_userid: paymentData.discord_userid,
      user_id: existingUser ? existingUser._id : null,
      display_name: existingUser ? existingUser.display_name : null,
      is_public: paymentData.is_public !== false, // 預設為公開
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  return sponsor
}

const updateSponsorInfo = async (
  sponsor,
  paymentData,
  sponsorLevel,
  directLinkCode,
) => {
  sponsor.kofi_transaction_id = paymentData.kofi_transaction_id
  sponsor.amount = paymentData.amount
  sponsor.currency = paymentData.currency
  sponsor.message = paymentData.message
  sponsor.type = paymentData.type
  sponsor.direct_link_code = directLinkCode
  sponsor.shop_items = paymentData.shop_items
  sponsor.shipping = paymentData.shipping
  sponsor.sponsor_level = sponsorLevel.level
  sponsor.badge_earned = sponsorLevel.badgeEarned
  sponsor.updated_at = new Date()

  await sponsor.save()
  return sponsor
}
```

#### 3. 快取管理服務 (`sponsorshipCache.js`)

```javascript
const updateSponsorshipCache = async () => {
  try {
    // 獲取最新的贊助者列表
    const sponsors = await getVisibleSponsors()

    // 更新 Redis 快取
    await redis.set('sponsors:visible', JSON.stringify(sponsors), 'EX', 300) // 5分鐘過期

    // 更新統計數據快取
    const stats = await getSponsorshipStats()
    await redis.set('sponsors:stats', JSON.stringify(stats), 'EX', 300)
  } catch (error) {
    console.error('Cache update error:', error)
  }
}
```

### 前端實作

#### 1. 贊助牆組件 (`SponsorshipWall.vue`)

```vue
<template>
  <div class="sponsorship-wall">
    <div class="wall-header">
      <h2>感謝贊助！</h2>
      <p>以下是支持迷因典的熱心贊助者</p>
    </div>

    <div class="sponsors-container">
      <!-- 黃金級贊助者 (150元) -->
      <div class="sponsor-tier gold-tier">
        <h3>🥇 黃金贊助者</h3>
        <div class="sponsors-grid">
          <div
            v-for="sponsor in goldSponsors"
            :key="sponsor.id"
            class="sponsor-card gold"
          >
            <div class="sponsor-avatar">
              <img :src="getSponsorAvatar(sponsor)" :alt="sponsor.from_name" />
              <div class="badge">
                <i class="pi pi-star"></i>
              </div>
            </div>
            <div class="sponsor-info">
              <h4>{{ sponsor.from_name }}</h4>
              <p v-if="sponsor.message" class="sponsor-message">
                "{{ sponsor.message }}"
              </p>
              <span class="amount">${{ sponsor.amount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 白銀級贊助者 (60元) -->
      <div class="sponsor-tier silver-tier">
        <h3>🥈 白銀贊助者</h3>
        <div class="sponsors-grid">
          <div
            v-for="sponsor in silverSponsors"
            :key="sponsor.id"
            class="sponsor-card silver"
          >
            <div class="sponsor-avatar">
              <img :src="getSponsorAvatar(sponsor)" :alt="sponsor.from_name" />
            </div>
            <div class="sponsor-info">
              <h4>{{ sponsor.from_name }}</h4>
              <p v-if="sponsor.message" class="sponsor-message">
                "{{ sponsor.message }}"
              </p>
              <span class="amount">${{ sponsor.amount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 青銅級贊助者 (30元) -->
      <div class="sponsor-tier bronze-tier">
        <h3>🥉 青銅贊助者</h3>
        <div class="sponsors-grid">
          <div
            v-for="sponsor in bronzeSponsors"
            :key="sponsor.id"
            class="sponsor-card bronze"
          >
            <div class="sponsor-avatar">
              <img :src="getSponsorAvatar(sponsor)" :alt="sponsor.from_name" />
            </div>
            <div class="sponsor-info">
              <h4>{{ sponsor.from_name }}</h4>
              <span class="amount">${{ sponsor.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Marquee from '@/components/ui/marquee/Marquee.vue'
import SponsorCard from '@/components/SponsorCard.vue'
import SponsorCardSlim from '@/components/SponsorCardSlim.vue'
import sponsorshipService from '@/services/sponsorshipService'

const sponsors = ref([])

// 按等級分類贊助者並轉換為 Marquee 格式
const coffeeSponsors = computed(() =>
  sponsors.value
    .filter((s) => s.sponsor_level === 'coffee')
    .map((sponsor) => ({
      ...sponsor,
      img: getSponsorAvatar(sponsor),
      name: sponsor.display_name || sponsor.from_name,
      username: sponsor.user?.username || sponsor.from_name,
      body: sponsor.message,
    })),
)

const chickenSponsors = computed(() =>
  sponsors.value
    .filter((s) => s.sponsor_level === 'chicken')
    .map((sponsor) => ({
      ...sponsor,
      img: getSponsorAvatar(sponsor),
      name: sponsor.display_name || sponsor.from_name,
      username: sponsor.user?.username || sponsor.from_name,
      amount: sponsor.amount,
    })),
)

const soySponsors = computed(() =>
  sponsors.value
    .filter((s) => s.sponsor_level === 'soy')
    .map((sponsor) => ({
      ...sponsor,
      img: getSponsorAvatar(sponsor),
      name: sponsor.display_name || sponsor.from_name,
      username: sponsor.user?.username || sponsor.from_name,
      amount: sponsor.amount,
    })),
)

// 獲取贊助者頭像
const getSponsorAvatar = (sponsor) => {
  // 優先使用關聯用戶的頭像（如果 user_id 存在）
  if (sponsor.user_id && sponsor.user) {
    // 使用現有 User 模型的頭像生成邏輯
    const seed =
      sponsor.user.username && sponsor.user.username.trim().length > 0
        ? encodeURIComponent(sponsor.user.username)
        : 'default'

    return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed}`
  }

  // 如果有 Discord 頭像，使用 Discord 頭像
  if (sponsor.discord_userid) {
    return `https://cdn.discordapp.com/avatars/${sponsor.discord_userid}/${sponsor.discord_avatar}.png`
  }

  // 最後使用預設頭像（基於贊助者姓名）
  return (
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' +
    encodeURIComponent(sponsor.from_name)
  )
}

// 載入贊助者數據
const loadSponsors = async () => {
  try {
    const response = await sponsorshipService.getVisibleSponsors()
    // 確保贊助者數據包含用戶關聯資訊（用於頭像顯示）
    sponsors.value = response.data.sponsors.map((sponsor) => ({
      ...sponsor,
      // 如果有關聯用戶，包含用戶資訊
      user: sponsor.user_id
        ? {
            username: sponsor.user?.username,
            display_name: sponsor.user?.display_name,
          }
        : null,
    }))
  } catch (error) {
    console.error('載入贊助者失敗:', error)
  }
}

onMounted(() => {
  loadSponsors()
})
</script>
```

#### 2. 捐款頁面增強

```vue
<script setup>
// ... 現有代碼 ...

const webhookConfigured = ref(false)

// 檢查 Webhook 配置狀態
const checkWebhookStatus = async () => {
  try {
    const response = await sponsorshipService.getWebhookStatus()
    webhookConfigured.value = response.data.configured
  } catch (error) {
    console.error('檢查 Webhook 狀態失敗:', error)
  }
}

// 處理捐款
const handleDonate = async (amount) => {
  // 現有邏輯...

  // 顯示 Webhook 提示
  if (webhookConfigured.value) {
    toast.add({
      severity: 'info',
      summary: '即時更新',
      detail: '您的贊助將立即顯示在贊助牆上！',
      life: 3000,
    })
  }
}

onMounted(() => {
  checkWebhookStatus()
})
</script>
```

## 🔒 安全考量

### 1. Webhook 驗證與架構

- **同步快回 + 非同步處理**：Webhook 只做驗證與將 payload 丟進工作佇列（BullMQ/Redis）
  - 避免 Ko-fi 重試造成重複處理
  - 縮短 TTFB，提升響應速度
- **絕對冪等**：對 `message_id`、`kofi_transaction_id` 建 UNIQUE 索引
  - 工作層再做「去重排程」（以 message_id 當 jobId）
  - 多層保障不重覆入帳
- **佇列策略**：設定重試間隔（指數退避）、最大重試次數
  - Dead-Letter Queue（DLQ）+ Admin 頁面「一鍵重放」
- 使用 Ko-fi 提供的 `verification_token` 驗證請求
- 檢查請求來源 IP 位址

### 2. 數據保護與隱私

- **輸入驗證 & 訊息清洗**：
  - 用 Zod/Yup 對 data 反序列化後做 schema 驗證
  - 對留言做 XSS 清洗、長度限制、表情/emoji 安全白名單
  - **訊息審核系統**：
    - 自動過濾 + 黑名單詞庫
    - 人工審核開關（黃金級留言必審）
    - 預防濫用內容顯示
- **PII 最小化**：
  - 若不需要寄送實體，不要落地完整 shipping
  - 如需保留供對帳，用欄位遮蔽（city/country 留下、street/phone hash 或不存）
- **隱私遵循**：
  - 尊重 `is_public=false` → 前端完全不顯示
  - 後台提供「刪除/匿名化」一鍵處理（GDPR/CCPA 請求）
- **退款處理機制**：
  - Admin 手動標記退款入口
  - 自動更新 `sponsors.status=refunded`
  - 撤除贊助牆露出
  - 回沖統計數據（`user_sponsorship_stats`）
- **匿名/綁定帳號機制**：
  - Email 自動對應現有用戶
  - 提供「認領贊助」功能（一次性 token 連結）
  - 維持歷史記錄關聯（用戶改信箱情境）
- 敏感資訊加密儲存
- 用戶隱私設定尊重

### 3. 速率限制與異常檢測

- 防止惡意請求攻擊
- 實作請求頻率限制
- 異常檢測機制
- 實作 IP 白名單（只允許 Ko-fi IP）
- 請求大小限制（防止大 payload 攻擊）

## 📈 效能優化

### 1. 快取策略

- **精準快取失效**：
  - 收到 webhook 時只清掉對應等級的 Redis key（例：`sponsors:visible:coffee`）
  - 避免全量重建，提升效能
  - 寫入 `sponsors:lastUpdatedAt`，前端可據此判斷是否拉新
- **即時更新選項**：
  - 目前用輪詢/快取已足夠
  - 若需「秒更」，可考慮 WS/SSE 廣播 tier-level 更新事件
  - 前端只刷新對應區塊，避免全頁重載
- Redis 快取贊助者數據
- CDN 快取頭像資源
- 定期更新快取

### 2. 數據庫優化

- **建立適當的索引**：
  - UNIQUE(message_id)、UNIQUE(kofi_transaction_id)：防重複處理
  - (is_public, sponsor_level, createdAt)：前端顯示查詢
  - (user_id)、(email)、(createdAt)：統計查詢
  - (direct_link_code)：商品統計查詢
- 使用分頁查詢
- 定期清理舊數據（保留最近 2 年的記錄）
- 實作讀寫分離（如果數據量大）

### 3. 前端優化

- 懶載入贊助牆組件
- 虛擬滾動處理大量數據
- 圖片優化載入

## 🧪 測試計劃

### 1. 單元測試

- Webhook 處理邏輯測試
- 數據驗證測試
- 快取機制測試

### 2. 整合測試

- Webhook 端到端測試
- 前後端數據同步測試
- 錯誤處理測試

### 3. 負載測試

- 高併發 Webhook 請求測試
- 大量贊助者數據處理測試

## 📋 實作階段

### 第一階段：基礎架構

1. **擴展現有資料庫結構**

   - 基於現有的 `models/Sponsor.js` 進行擴展，添加 Ko-fi Shop Order 字段
   - 建立 `sponsorship_logs`、`user_sponsorship_stats`、`sponsorship_products` 表
   - 初始化商品映射數據（豆漿、雞肉、咖啡贊助）
   - 建立資料庫索引和驗證規則

2. **建立 Shop Order Webhook 接收端點**

   - `POST /api/webhooks/kofi/shop-orders`
   - 實作請求驗證機制
   - 設定 Webhook URL 為 Ko-fi 的三個商品

3. **實作基本驗證機制**

   - 驗證 `verification_token`
   - 檢查 `direct_link_code` 合法性
   - 防重複處理（使用 `message_id`）
   - 驗證 `shop_items` 數據結構

4. **建立贊助服務**
   - `sponsorshipService.js` - Shop Order 數據處理
   - 用戶 email 比對邏輯（更新現有用戶的 display_name）
   - 商品等級映射邏輯（豆漿=soy、雞肉=chicken、咖啡=coffee）
   - 數據遷移腳本（處理現有贊助記錄）

### 第二階段：核心功能

1. **實作 Shop Order 數據處理**

   - 解析 `shop_items` 數據（支援多項目與數量）
   - 根據 `direct_link_code` 判斷贊助等級
   - 實作多項目合併規則（最高等級優先）
   - 用戶關聯邏輯（email 匹配）
   - 幣別換匯處理（支援多幣別顯示）
   - 訊息自動審核與過濾
   - 匿名贊助自動生成認領token

2. **建立贊助等級系統**

   - 豆漿贊助 (30元)：只顯示姓名
   - 雞肉贊助 (60元)：顯示姓名 + 留言
   - 咖啡贊助 (150元)：顯示姓名 + 留言 + 徽章

3. **開發贊助牆組件**

   - `SponsorshipWall.vue` 前端組件（沿用現有 Marquee 設計）
   - 創建 `SponsorCard.vue` 和 `SponsorCardSlim.vue` 組件（基於 ReviewCard）
   - 按等級分類顯示（咖啡贊助用 SponsorCard，雞肉/豆漿贊助用 SponsorCardSlim）
   - 頭像整合邏輯（優先使用用戶頭像）
   - 支持反向滾動效果

4. **整合前後端**
   - API 端點串接
   - 數據格式統一
   - 錯誤處理機制

### 第三階段：進階功能

1. **實作工作佇列系統**

   - 整合 BullMQ/Redis 工作佇列
   - 設定重試間隔（指數退避）
   - 實作 Dead-Letter Queue（DLQ）
   - Admin 頁面「一鍵重放」功能

2. **實作輸入驗證與安全**

   - 整合 Zod/Yup 進行 schema 驗證
   - XSS 清洗與長度限制
   - Emoji/表情符號安全白名單
   - PII 最小化處理 shipping 資訊

3. **實作快取機制**

   - Redis 快取贊助者數據
   - 快取失效策略
   - 即時更新機制

4. **添加通知功能**

   - 首次贊助歡迎通知
   - 咖啡贊助特別通知
   - 管理員通知機制

5. **開發管理介面**

   - 贊助者管理頁面
   - 統計數據儀表板
   - 商品管理功能
   - DLQ 重放介面
   - 退款處理介面（手動標記退款）
   - 訊息審核介面（人工審核黃金級留言）
   - 贊助認領管理（查看認領記錄）

6. **效能優化**
   - 數據庫查詢優化
   - 前端渲染優化
   - CDN 資源優化
   - 工作佇列效能監控

### 第四階段：測試上線

1. **完整測試**

   - 單元測試（Webhook 處理、數據驗證、Zod schema 驗證）
   - 整合測試（端到端流程、工作佇列處理）
   - 負載測試（高併發 Webhook、重試機制測試）
   - 安全測試（XSS 防護、輸入驗證、PII 處理）
   - 業務邏輯測試（退款處理、認領機制、訊息審核）
   - 監控測試（指標收集、告警觸發、追蹤日誌）

2. **監控系統建立**

   - **關鍵指標監控**：
     - `webhook_ingest_latency`：Webhook 處理延遲
     - `queue_depth`：工作佇列長度
     - `job_fail_rate`：任務失敗率
     - `cache_hit_ratio`：快取命中率
   - **告警機制**：
     - N 次失敗/分鐘以上 → Discord/Email 告警
     - 佇列長度 > 門檻 → 自動擴 worker
     - DLQ 累積 > 門檻 → 管理員通知
   - **追蹤日誌**：
     - 每筆寫入 `trace_id` / `message_id` 到結構化日誌
     - JSON 格式便於對帳與排錯
   - Webhook 處理監控
   - 工作佇列狀態監控（BullMQ 儀表板）
   - 錯誤日誌追蹤
   - 效能指標監控

3. **正式上線**

   - 在 Ko-fi 設定正式 Webhook URL
   - 監控初始數據處理
   - 用戶反饋收集

4. **問題修復**
   - 處理實際使用中的問題
   - 優化用戶體驗
   - 數據修復和遷移

## 🎯 成功指標

### 技術指標

- Webhook 響應時間 < 500ms
- 數據處理成功率 > 99.9%
- 系統可用性 > 99.5%

### 業務指標

- 贊助轉換率提升 20%
- 用戶參與度提升 15%
- 捐款總額增長目標

## 🔄 維護計劃

### 定期維護

- 每月檢查 Webhook 健康狀態
- 每週清理過期數據
- 每日監控系統效能

### 版本更新

- 跟蹤 Ko-fi API 變更
- 定期更新依賴套件
- 持續優化用戶體驗

## 📞 支援與聯繫

### 技術支援

- Webhook 問題排查指南
- 數據遷移支援
- 效能優化諮詢

### 用戶支援

- 贊助者隱私設定說明
- 捐款問題處理流程
- 功能使用指南

---

## ⚙️ Ko-fi 設定指南

### 1. 進入 Webhook 設定頁面

訪問 Ko-fi 管理後台的 Webhook 設定頁面：

```
https://ko-fi.com/manage/webhooks?src=sidemenu
```

### 2. 設定 Webhook URL

為三個商品分別設定相同的 Webhook URL：

```
Webhook URL: https://www.memedam.com/api/webhooks/kofi/shop-orders
```

**重要**：確保 URL 以 `https://` 開頭，並指向正確的域名。

### 3. 商品 Direct Link 設定

確認三個商品的 Direct Link Code：

- **30元商品**：`c4043b71a4`

  - URL: https://ko-fi.com/s/c4043b71a4

- **60元商品**：`b7e4575bf6`

  - URL: https://ko-fi.com/s/b7e4575bf6

- **150元商品**：`25678099a7`
  - URL: https://ko-fi.com/s/25678099a7

### 4. 測試 Webhook

1. 在 Ko-fi 中進行測試購買
2. 檢查服務器日誌確認 Webhook 接收
3. 驗證數據處理是否正確
4. 確認贊助牆是否即時更新

### 5. 監控與維護

- 定期檢查 Webhook 健康狀態
- 監控錯誤日誌
- 處理重複或失敗的 Webhook

## 🔍 故障排除

### 常見問題

1. **Webhook 未收到**

   - 檢查 URL 是否正確
   - 確認服務器可從公網訪問
   - 檢查防火牆設定

2. **數據處理失敗**

   - 驗證 `verification_token`
   - 檢查 `direct_link_code` 是否正確
   - 確認資料庫連接正常

3. **頭像顯示異常**

   - 檢查用戶 email 匹配邏輯
   - 驗證頭像生成邏輯
   - 確認前端數據結構

4. **贊助牆未更新**
   - 檢查快取更新機制
   - 驗證前端數據載入
   - 確認 WebSocket 連接（如有使用）

## 📝 結論

本規劃提供了一個完整的 Ko-fi Shop Order Webhooks 整合方案，專注處理三個贊助等級的商品購買。系統設計考慮了用戶體驗、數據安全、效能優化和維護便利性。

### 關鍵特色

- **高可用架構**：同步快回 + 非同步處理，避免重複處理和 TTFB 延遲
- **絕對冪等**：UNIQUE 索引 + 工作佇列去重，多層保障不重覆入帳
- **安全強化**：Zod 驗證、XSS 清洗、PII 最小化、GDPR 合規
- **多項目支援**：處理 shop_items 數量與合併規則，支援多幣別
- **業務完善**：退款處理、匿名認領、訊息審核，完整商業邏輯
- **精準快取**：分級快取失效 + 即時更新選項，提升效能
- **前端友好**：明文化露出規則，降低用戶預期落差
- **可觀測性**：完整指標監控 + 智能告警 + 結構化追蹤
- **沿用現有設計**：完全整合現有的 Marquee 組件和 ReviewCard 設計風格
- **符合網站風格**：使用「豆漿贊助、雞肉贊助、咖啡贊助」的命名
- **精準等級控制**：根據 `direct_link_code` 正確識別贊助等級
- **用戶整合**：通過 email 匹配現有用戶，統一頭像和顯示名稱
- **即時更新**：Webhook 觸發的實時贊助牆更新
- **一致的用戶體驗**：與現有評論牆保持相同的視覺風格和互動方式

### 實作建議

#### 🔴 高優先順序（核心功能）

1. **工作佇列架構**：BullMQ 非同步處理，避免重複處理，提升可靠性
2. **絕對冪等**：UNIQUE 索引防護，重複交易與訊息防護
3. **輸入驗證**：Zod schema 驗證，資料完整性與安全性
4. **資料庫索引**：優化查詢效能，支援高併發場景

#### 🟡 中優先順序（重要功能）

5. **XSS 安全**：防護惡意輸入，訊息清洗與過濾
6. **多項目支援**：處理複雜訂單，shop_items 數量與合併邏輯
7. **用戶整合**：email 匹配現有用戶，頭像與名稱統一
8. **隱私遵循**：GDPR 合規，is_public 控制與資料保護

#### 🟢 低優先順序（增強功能）

9. **幣別換匯**：多幣別支援，自動轉換為 TWD 顯示
10. **版本控制**：產品配置管理，支援商品變更歷史
11. **進階監控**：BullMQ 儀表板，工作佇列狀態監控

#### 基礎建設

- **第一步**：擴展現有的 `models/Sponsor.js` 並建立其他必要表結構
- **第二步**：實作 Webhook 接收和基本處理邏輯
- **第三步**：開發前端贊助牆組件
- **第四步**：完整測試和上線部署

按照這個規劃實作，將能夠建立一個穩定、用戶友好的贊助系統。
