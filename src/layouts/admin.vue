<template>
  <div class="admin-layout min-h-screen flex bg-gray-50">
    <!-- 左側導覽列 -->
    <aside
      class="sidebar bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300"
      :class="{
        '-translate-x-full': !sidebarOpen,
        'translate-x-0': sidebarOpen,
      }"
    >
      <!-- Logo 區域 -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-black rounded flex items-center justify-center"
          >
            <span class="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 class="text-white font-semibold text-sm">迷因典 MemeDam</h1>
          </div>
        </div>
      </div>

      <!-- 使用者資訊 -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"
          >
            <i class="pi pi-user text-white"></i>
          </div>
          <div>
            <p class="text-white text-sm font-medium">管理者A</p>
          </div>
        </div>
      </div>

      <!-- 設定和通知 -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <Button
            icon="pi pi-cog"
            class="p-button-text p-button-rounded"
            severity="secondary"
          />
          <div class="relative">
            <Button
              icon="pi pi-bell"
              class="p-button-text p-button-rounded"
              severity="secondary"
            />
            <Badge
              value="9"
              severity="danger"
              class="absolute -top-1 -right-1"
            />
          </div>
        </div>
      </div>

      <!-- 搜尋列 -->
      <div class="p-4 border-b border-gray-700">
        <div class="relative">
          <InputText
            v-model="searchQuery"
            placeholder="搜尋"
            class="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <i
            class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>

      <!-- 導覽選單 -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          <li>
            <router-link
              to="/admin"
              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
              :class="
                isActive('/admin')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <i class="pi pi-home"></i>
              <span>首頁</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/reports"
              class="flex items-center justify-between p-3 rounded-lg transition-colors"
              :class="
                isActive('/admin/reports')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-file"></i>
                <span>舉報審核</span>
              </div>
              <Badge value="99+" severity="danger" />
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/memes"
              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
              :class="
                isActive('/admin/memes')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <i class="pi pi-image"></i>
              <span>迷因管理</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/ads"
              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
              :class="
                isActive('/admin/ads')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <i class="pi pi-link"></i>
              <span>廣告管理</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/members"
              class="flex items-center gap-3 p-3 rounded-lg transition-colors"
              :class="
                isActive('/admin/members')
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              "
            >
              <i class="pi pi-users"></i>
              <span>會員管理</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 主要內容區域 -->
    <div class="main-content flex-1 ml-64 transition-all duration-300">
      <!-- 頂部標題列 -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- 左側：標題和導覽標籤 -->
          <div class="flex items-center gap-8">
            <Button
              icon="pi pi-bars"
              class="p-button-text p-button-rounded"
              @click="toggleSidebar"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">首頁</h1>
            </div>

            <!-- 導覽標籤 -->
            <div class="flex items-center gap-1">
              <Button
                label="總覽"
                class="p-button-text"
                :class="
                  activeTab === 'overview'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                "
                @click="activeTab = 'overview'"
              />
              <Button
                label="分析"
                class="p-button-text relative"
                :class="
                  activeTab === 'analysis'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                "
                @click="activeTab = 'analysis'"
              >
                <Badge
                  value="7"
                  severity="danger"
                  class="absolute -top-1 -right-1"
                />
              </Button>
              <Button
                label="空間狀態"
                class="p-button-text relative"
                :class="
                  activeTab === 'space'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                "
                @click="activeTab = 'space'"
              >
                <Badge
                  value="2"
                  severity="danger"
                  class="absolute -top-1 -right-1"
                />
              </Button>
              <Button
                label="管理"
                class="p-button-text relative"
                :class="
                  activeTab === 'management'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                "
                @click="activeTab = 'management'"
              >
                <Badge
                  value="99+"
                  severity="danger"
                  class="absolute -top-1 -right-1"
                />
              </Button>
              <Button
                label="設定"
                class="p-button-text"
                :class="
                  activeTab === 'settings'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600'
                "
                @click="activeTab = 'settings'"
              />
              <Button
                icon="pi pi-ellipsis-h"
                class="p-button-text"
                text-gray-600
              />
            </div>
          </div>

          <!-- 右側：日期選擇器 -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">開始日期</label>
              <Calendar v-model="startDate" class="w-32" showIcon />
            </div>
            <i class="pi pi-arrow-right text-gray-400"></i>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">結束日期</label>
              <Calendar v-model="endDate" class="w-32" showIcon />
            </div>
          </div>
        </div>
      </header>

      <!-- 主要內容 -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- 移動端遮罩 -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// 響應式資料
const sidebarOpen = ref(true)
const searchQuery = ref('')
const activeTab = ref('overview')
const startDate = ref(new Date())
const endDate = ref(new Date())

const route = useRoute()

// 計算屬性
const isActive = (path) => {
  return route.path === path
}

// 方法
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<script>
export default {
  name: 'AdminLayout',
}
</script>

<style scoped>
.admin-layout {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.sidebar {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.main-content {
  min-height: 100vh;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.translate-x-0 {
    transform: translateX(0);
  }
}

/* 自定義 PrimeVue 元件樣式 */
:deep(.p-button.p-button-text) {
  color: inherit;
}

:deep(.p-inputtext) {
  background-color: inherit;
  border-color: inherit;
  color: inherit;
}

:deep(.p-calendar) {
  width: auto;
}

:deep(.p-badge) {
  font-size: 0.75rem;
  min-width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
}
</style>
