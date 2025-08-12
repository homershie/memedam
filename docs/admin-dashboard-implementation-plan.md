# 迷因典管理功能頁面實作規劃

## 📋 專案概述

本文件規劃迷因典管理後台的完整實作方案，整合 PrimeVue 管理模板、分析數據 API 和現有服務，建立功能完整的管理介面。

## 🎯 整合架構

### 核心組件

- **PrimeVue 管理模板**: 提供 UI 框架和佈局
- **分析數據 API**: 提供數據視覺化和統計功能
- **現有服務層**: 整合迷因、用戶、檢舉等管理功能
- **Layout 狀態管理**: 統一管理 UI 狀態和主題

## 🏗️ 技術架構

```
src/
├── layouts/
│   ├── admin.vue                    # 管理後台主佈局
│   └── admin/
│       ├── AppMenu.vue              # 側邊選單
│       ├── AppTopbar.vue            # 頂部工具列
│       ├── AppSidebar.vue           # 側邊欄容器
│       └── AppConfigurator.vue      # 主題配置器
├── pages/admin/
│   ├── index.vue                    # 儀表板首頁
│   ├── memes.vue                    # 迷因管理
│   ├── users.vue                    # 用戶管理
│   ├── reports.vue                  # 檢舉管理
│   ├── analytics.vue                # 數據分析
│   ├── ab-tests.vue                 # A/B 測試管理
│   └── settings.vue                 # 系統設定
├── components/dashboard/
│   ├── StatsWidget.vue              # 統計卡片
│   ├── AnalyticsChart.vue           # 分析圖表
│   ├── UserActivityWidget.vue       # 用戶活躍度
│   ├── ReportQueueWidget.vue        # 檢舉佇列
│   └── SystemStatusWidget.vue       # 系統狀態
└── services/
    ├── analyticsService.js          # 分析數據服務
    ├── adminService.js              # 管理功能服務
    ├── memeService.js               # 迷因管理服務
    ├── userService.js               # 用戶管理服務
    └── reportService.js             # 檢舉管理服務
```

## 📊 頁面功能規劃

### 1. 儀表板首頁 (`/admin`)

#### 功能概述

- 整體系統概覽
- 關鍵指標展示
- 即時數據監控
- 快速操作入口

#### 整合組件

```javascript
// 使用現有的 dashboard 元件
import StatsWidget from '@/components/dashboard/StatsWidget.vue'
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue'
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue'
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue'
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue'
```

#### 數據整合

```javascript
// 整合分析 API 和現有服務
const dashboardData = await analyticsService.getDashboard()
const memeStats = await memeService.getStats()
const userStats = await userService.getStats()
const reportStats = await reportService.getStats()
```

#### 自訂統計卡片

```javascript
// 修改 StatsWidget 顯示迷因典相關數據
const stats = [
  {
    title: '總迷因數',
    value: memeStats.total,
    icon: 'pi pi-image',
    color: 'blue',
    change: '+12%',
  },
  {
    title: '活躍用戶',
    value: userStats.active,
    icon: 'pi pi-users',
    color: 'green',
    change: '+8%',
  },
  {
    title: '待處理檢舉',
    value: reportStats.pending,
    icon: 'pi pi-flag',
    color: 'orange',
    change: '-5%',
  },
  {
    title: '系統健康度',
    value: '98%',
    icon: 'pi pi-check-circle',
    color: 'purple',
    change: '+2%',
  },
]
```

### 2. 迷因管理頁面 (`/admin/memes`)

#### 功能概述

- 迷因列表管理
- 批量操作
- 內容審核
- 標籤管理

#### 整合 PrimeVue DataTable

```javascript
// 使用 PrimeVue 的 DataTable 組件
import { DataTable } from 'primevue/datatable'
import { Column } from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'

// 整合現有的 memeService
const memes = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  tags: { value: null, matchMode: FilterMatchMode.IN },
})

// 載入迷因數據
const loadMemes = async () => {
  const response = await memeService.getAll({
    page: currentPage.value,
    limit: pageSize.value,
    sort: sortField.value,
    order: sortOrder.value,
  })
  memes.value = response.data.memes
  totalRecords.value = response.data.total
}
```

#### 管理功能

```javascript
// 批量操作
const selectedMemes = ref([])

const batchApprove = async () => {
  for (const meme of selectedMemes.value) {
    await memeService.update(meme.id, { status: 'approved' })
  }
  await loadMemes()
}

const batchDelete = async () => {
  for (const meme of selectedMemes.value) {
    await memeService.remove(meme.id)
  }
  await loadMemes()
}

// 內容審核
const approveMeme = async (memeId) => {
  await memeService.update(memeId, { status: 'approved' })
  await loadMemes()
}

const rejectMeme = async (memeId, reason) => {
  await memeService.update(memeId, {
    status: 'rejected',
    rejection_reason: reason,
  })
  await loadMemes()
}
```

### 3. 用戶管理頁面 (`/admin/users`)

#### 功能概述

- 用戶列表管理
- 權限管理
- 用戶統計
- 帳號狀態管理

#### 整合用戶服務

```javascript
// 整合 userService
const users = ref([])
const userStats = ref({})

const loadUsers = async () => {
  const response = await userService.getAll({
    page: currentPage.value,
    limit: pageSize.value,
  })
  users.value = response.data.users
  totalRecords.value = response.data.total
}

const loadUserStats = async () => {
  const response = await userService.getStats()
  userStats.value = response.data
}
```

#### 權限管理

```javascript
// 用戶權限管理
const updateUserRole = async (userId, role) => {
  await userService.update(userId, { role })
  await loadUsers()
}

const banUser = async (userId, reason) => {
  await userService.update(userId, {
    status: 'banned',
    ban_reason: reason,
  })
  await loadUsers()
}

const unbanUser = async (userId) => {
  await userService.update(userId, { status: 'active' })
  await loadUsers()
}
```

### 4. 檢舉管理頁面 (`/admin/reports`)

#### 功能概述

- 檢舉列表
- 檢舉處理
- 批量操作
- 統計分析

#### 整合檢舉服務

```javascript
// 整合 reportService
const reports = ref([])
const reportStats = ref({})

const loadReports = async () => {
  const response = await reportService.getAll({
    status: filterStatus.value,
    page: currentPage.value,
    limit: pageSize.value,
  })
  reports.value = response.data.reports
  totalRecords.value = response.data.total
}

const processReport = async (reportId, action, reason) => {
  await reportService.update(reportId, {
    status: action,
    admin_comment: reason,
    processed_at: new Date().toISOString(),
  })
  await loadReports()
}
```

### 5. 數據分析頁面 (`/admin/analytics`)

#### 功能概述

- 推薦效果分析
- 演算法效能比較
- 用戶行為分析
- 趨勢圖表

#### 整合分析 API

```javascript
// 整合 analyticsService
const dashboardData = ref({})
const algorithmStats = ref([])
const userEffectiveness = ref({})

const loadAnalyticsData = async () => {
  // 載入儀表板數據
  const dashboardResponse = await analyticsService.getDashboard({
    start_date: dateRange.value.start,
    end_date: dateRange.value.end,
  })
  dashboardData.value = dashboardResponse.data

  // 載入演算法統計
  const algorithmResponse = await analyticsService.getAlgorithmStats({
    start_date: dateRange.value.start,
    end_date: dateRange.value.end,
  })
  algorithmStats.value = algorithmResponse.data.stats

  // 載入用戶效果分析
  const userResponse = await analyticsService.getUserEffectiveness({
    start_date: dateRange.value.start,
    end_date: dateRange.value.end,
  })
  userEffectiveness.value = userResponse.data
}
```

#### 圖表組件

```javascript
// 使用 Chart.js 或 PrimeVue Charts
import { Chart } from 'primevue/chart'

// CTR 趨勢圖
const ctrChartData = computed(() => ({
  labels: algorithmStats.value.map((stat) => stat.algorithm),
  datasets: [
    {
      label: '點擊率 (%)',
      data: algorithmStats.value.map((stat) => stat.ctr * 100),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
}))

// 互動率比較圖
const engagementChartData = computed(() => ({
  labels: algorithmStats.value.map((stat) => stat.algorithm),
  datasets: [
    {
      label: '互動率 (%)',
      data: algorithmStats.value.map((stat) => stat.engagement_rate * 100),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
}))
```

### 6. A/B 測試管理頁面 (`/admin/ab-tests`)

#### 功能概述

- A/B 測試列表
- 測試創建和配置
- 結果監控
- 統計分析

#### 整合 A/B 測試 API

```javascript
// 整合 analyticsService 的 A/B 測試功能
const abTests = ref([])
const currentTest = ref(null)

const loadABTests = async () => {
  const response = await analyticsService.getAbTests({
    page: currentPage.value,
    limit: pageSize.value,
  })
  abTests.value = response.data.tests
  totalRecords.value = response.data.pagination.total
}

const createABTest = async (testData) => {
  await analyticsService.createABTest(testData)
  await loadABTests()
}

const updateABTestStatus = async (testId, status) => {
  await analyticsService.updateABTestStatus(testId, status)
  await loadABTests()
}
```

### 7. 公告管理頁面 (`/admin/announcements`)

#### 功能概述

- 公告列表管理
- 公告創建和編輯
- 公告狀態管理
- 公告排序和置頂

#### 整合公告服務

```javascript
// 整合 announcementService
const announcements = ref([])
const announcementStats = ref({})
const currentAnnouncement = ref({})

const loadAnnouncements = async () => {
  const response = await announcementService.getAll({
    page: currentPage.value,
    limit: pageSize.value,
    status: filterStatus.value,
  })
  announcements.value = response.data.announcements
  totalRecords.value = response.data.total
}

const createAnnouncement = async (data) => {
  await announcementService.create(data)
  await loadAnnouncements()
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '公告創建成功',
    life: 3000,
  })
}

const updateAnnouncement = async (id, data) => {
  await announcementService.update(id, data)
  await loadAnnouncements()
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '公告更新成功',
    life: 3000,
  })
}

const deleteAnnouncement = async (id) => {
  await announcementService.remove(id)
  await loadAnnouncements()
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '公告刪除成功',
    life: 3000,
  })
}

const toggleAnnouncementStatus = async (id, status) => {
  await announcementService.update(id, { status })
  await loadAnnouncements()
}

const setAnnouncementPriority = async (id, priority) => {
  await announcementService.update(id, { priority })
  await loadAnnouncements()
}
```

#### 公告管理功能

```javascript
// 公告狀態管理
const announcementStatuses = [
  { label: '草稿', value: 'draft' },
  { label: '已發布', value: 'published' },
  { label: '已下架', value: 'archived' },
]

// 公告優先級
const announcementPriorities = [
  { label: '一般', value: 'normal' },
  { label: '重要', value: 'important' },
  { label: '緊急', value: 'urgent' },
]

// 公告類型
const announcementTypes = [
  { label: '一般公告', value: 'general' },
  { label: '系統維護', value: 'maintenance' },
  { label: '功能更新', value: 'update' },
  { label: '活動通知', value: 'event' },
]
```

### 8. 系統設定頁面 (`/admin/settings`)

#### 功能概述

- 系統配置
- 推薦系統設定
- 內容審核規則
- 通知設定

#### 整合管理服務

```javascript
// 整合 adminService
const systemConfig = ref({})
const recommendationConfig = ref({})

const loadSystemConfig = async () => {
  const response = await adminService.getSystemConfig()
  systemConfig.value = response.data
}

const updateSystemConfig = async (config) => {
  await adminService.updateSystemConfig(config)
  await loadSystemConfig()
}

const updateRecommendationConfig = async (config) => {
  await adminService.updateRecommendationSystemConfig(config)
  await loadSystemConfig()
}
```

## 🎨 UI/UX 設計規範

### 1. 選單結構

```javascript
// 修改 AppMenu.vue 的選單結構
const model = ref([
  {
    label: '儀表板',
    items: [{ label: '總覽', icon: 'pi pi-fw pi-home', to: '/admin' }],
  },
  {
    label: '內容管理',
    items: [
      { label: '迷因管理', icon: 'pi pi-fw pi-image', to: '/admin/memes' },
      { label: '標籤管理', icon: 'pi pi-fw pi-tags', to: '/admin/tags' },
      {
        label: '評論管理',
        icon: 'pi pi-fw pi-comments',
        to: '/admin/comments',
      },
      {
        label: '公告管理',
        icon: 'pi pi-fw pi-bullhorn',
        to: '/admin/announcements',
      },
    ],
  },
  {
    label: '用戶管理',
    items: [
      { label: '用戶列表', icon: 'pi pi-fw pi-users', to: '/admin/users' },
      {
        label: '權限管理',
        icon: 'pi pi-fw pi-shield',
        to: '/admin/permissions',
      },
    ],
  },
  {
    label: '檢舉管理',
    items: [
      { label: '檢舉處理', icon: 'pi pi-fw pi-flag', to: '/admin/reports' },
      {
        label: '檢舉統計',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/admin/report-stats',
      },
    ],
  },
  {
    label: '數據分析',
    items: [
      {
        label: '推薦分析',
        icon: 'pi pi-fw pi-chart-line',
        to: '/admin/analytics',
      },
      { label: 'A/B 測試', icon: 'pi pi-fw pi-flask', to: '/admin/ab-tests' },
      {
        label: '用戶行為',
        icon: 'pi pi-fw pi-user-edit',
        to: '/admin/user-behavior',
      },
    ],
  },
  {
    label: '系統管理',
    items: [
      { label: '系統設定', icon: 'pi pi-fw pi-cog', to: '/admin/settings' },
      { label: '維護工具', icon: 'pi pi-fw pi-wrench', to: '/admin/tools' },
      { label: '日誌查看', icon: 'pi pi-fw pi-file-text', to: '/admin/logs' },
    ],
  },
])
```

### 2. 主題整合

```javascript
// 整合現有的主題系統
const { toggleDarkMode, isDarkTheme } = useLayout()
const { theme } = useThemeStore()

// 同步主題狀態
watch(isDarkTheme, (newValue) => {
  theme.value = newValue ? 'dark' : 'light'
})
```

### 3. 響應式設計

```css
/* 使用 Tailwind CSS 的響應式類別 */
.grid {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
}

.table-container {
  @apply overflow-x-auto;
}
```

## 🔧 技術實作細節

### 1. 路由配置

```javascript
// 在 router/index.js 中添加管理路由
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/memes',
    component: () => import('@/pages/admin/memes.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/users',
    component: () => import('@/pages/admin/users.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/reports',
    component: () => import('@/pages/admin/reports.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/analytics',
    component: () => import('@/pages/admin/analytics.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/ab-tests',
    component: () => import('@/pages/admin/ab-tests.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/announcements',
    component: () => import('@/pages/admin/announcements.vue'),
    meta: { admin: true, layout: 'admin' },
  },
  {
    path: '/admin/settings',
    component: () => import('@/pages/admin/settings.vue'),
    meta: { admin: true, layout: 'admin' },
  },
]
```

### 2. 權限控制

```javascript
// 路由守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta?.admin === true && !userStore.isAdmin) {
    next('/')
    return
  }

  next()
})
```

### 3. 錯誤處理

```javascript
// 統一的錯誤處理
const handleApiError = (error, context = '') => {
  console.error(`${context} 錯誤:`, error)

  if (error.response?.status === 401) {
    // 重新登入
    userStore.logout()
    router.push('/login')
  } else if (error.response?.status === 403) {
    // 權限不足
    toast.add({
      severity: 'error',
      summary: '權限不足',
      detail: '您沒有權限執行此操作',
      life: 3000,
    })
  } else {
    // 一般錯誤
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error.response?.data?.message || '請稍後重試',
      life: 3000,
    })
  }
}
```

### 4. 數據快取

```javascript
// 使用 Pinia 進行狀態管理
export const useAdminStore = defineStore('admin', {
  state: () => ({
    dashboardData: null,
    lastUpdated: null,
    isLoading: false,
  }),

  actions: {
    async loadDashboardData() {
      if (this.dashboardData && Date.now() - this.lastUpdated < 5 * 60 * 1000) {
        return this.dashboardData
      }

      this.isLoading = true
      try {
        const response = await analyticsService.getDashboard()
        this.dashboardData = response.data
        this.lastUpdated = Date.now()
        return this.dashboardData
      } finally {
        this.isLoading = false
      }
    },
  },
})
```

## 📈 效能優化

### 1. 組件懶載入

```javascript
// 使用動態導入
const AdminDashboard = () => import('@/pages/admin/index.vue')
const AdminMemes = () => import('@/pages/admin/memes.vue')
```

### 2. 數據分頁

```javascript
// 實現無限滾動或分頁
const loadMoreData = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  const response = await service.getAll({
    page: currentPage.value + 1,
    limit: pageSize.value,
  })

  data.value.push(...response.data.items)
  currentPage.value++
  hasMore.value = response.data.items.length === pageSize.value
  loading.value = false
}
```

### 3. 圖片優化

```javascript
// 使用圖片懶載入
const lazyLoadImage = (src, placeholder) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(placeholder)
    img.src = src
  })
}
```

## 🧪 測試策略

### 1. 單元測試

```javascript
// 測試服務層
describe('AnalyticsService', () => {
  it('should load dashboard data', async () => {
    const mockData = { success: true, data: {} }
    jest.spyOn(apiService.httpAuth, 'get').mockResolvedValue(mockData)

    const result = await analyticsService.getDashboard()
    expect(result).toEqual(mockData)
  })
})
```

### 2. 整合測試

```javascript
// 測試頁面組件
describe('AdminDashboard', () => {
  it('should display dashboard widgets', () => {
    const wrapper = mount(AdminDashboard)
    expect(wrapper.findComponent(StatsWidget)).toBeTruthy()
    expect(wrapper.findComponent(AnalyticsChart)).toBeTruthy()
  })
})
```

### 3. E2E 測試

```javascript
// 使用 Cypress 進行端到端測試
describe('Admin Dashboard', () => {
  it('should load and display data', () => {
    cy.login('admin')
    cy.visit('/admin')
    cy.get('[data-testid="stats-widget"]').should('be.visible')
    cy.get('[data-testid="analytics-chart"]').should('be.visible')
  })
})
```

## 📋 實作檢查清單

### 第一階段：基礎架構

- [ ] 修正 Linter 錯誤
- [ ] 整合 PrimeVue 模板
- [ ] 設置管理路由
- [ ] 實現權限控制

### 第二階段：核心功能

- [ ] 實作儀表板頁面
- [ ] 實作迷因管理頁面
- [ ] 實作用戶管理頁面
- [ ] 實作標籤管理頁面
- [ ] 實作檢舉管理頁面

### 第三階段：進階功能

- [ ] 實作數據分析頁面
- [ ] 實作 A/B 測試管理
- [ ] 實作公告管理頁面
- [ ] 實作系統設定頁面
- [ ] 整合圖表組件

### 第四階段：優化完善

- [ ] 實現響應式設計
- [ ] 優化效能
- [ ] 添加錯誤處理
- [ ] 編寫測試

## 🚀 部署考量

### 1. 環境配置

```javascript
// 環境變數配置
const config = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    analyticsEnabled: true,
  },
  production: {
    apiBaseUrl: 'https://api.memedam.com/api',
    analyticsEnabled: true,
  },
}
```

### 2. 監控和日誌

```javascript
// 添加監控
const logAdminAction = (action, details) => {
  console.log(`[ADMIN] ${action}:`, details)
  // 發送到日誌服務
  analyticsService.trackAdminAction(action, details)
}
```

### 3. 備份和恢復

```javascript
// 數據備份功能
const backupData = async () => {
  const backup = {
    timestamp: new Date().toISOString(),
    data: await adminService.getBackupData(),
  }
  // 保存到備份服務
  return backup
}
```

## 📞 後續維護

### 1. 文檔維護

- 保持 API 文檔更新
- 維護用戶操作手冊
- 記錄系統變更日誌

### 2. 效能監控

- 監控頁面載入時間
- 追蹤 API 響應時間
- 分析用戶使用模式

### 3. 功能迭代

- 收集用戶反饋
- 定期評估功能需求
- 持續優化用戶體驗

---

**注意**: 本規劃文件將根據實作過程中的發現和需求變更進行調整。請確保在開發過程中保持與後端團隊的密切溝通。
