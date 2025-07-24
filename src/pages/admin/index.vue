<template>
  <div class="admin-dashboard">
    <!-- 關鍵指標卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="metric-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">總用戶數</h3>
              <p class="text-3xl font-bold text-gray-900">11.8M</p>
              <p class="text-sm text-green-600 mt-1">+2.5%</p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="metric-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">新用戶</h3>
              <p class="text-3xl font-bold text-gray-900">8.236K</p>
              <p class="text-sm text-red-600 mt-1">-1.2%</p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-user-plus text-green-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="metric-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">活躍用戶</h3>
              <p class="text-3xl font-bold text-gray-900">2.352M</p>
              <p class="text-sm text-green-600 mt-1">+11%</p>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-chart-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="metric-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">新用戶</h3>
              <p class="text-3xl font-bold text-gray-900">8K</p>
              <p class="text-sm text-green-600 mt-1">+5.2%</p>
            </div>
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-star text-orange-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 圖表和地圖區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- 目標完成度 -->
      <Card class="chart-card">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-900">目標</h3>
        </template>
        <template #content>
          <div class="flex items-center justify-center h-48">
            <div class="relative">
              <div
                class="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center"
              >
                <div
                  class="w-24 h-24 rounded-full border-8 border-gray-600 flex items-center justify-center"
                >
                  <span class="text-2xl font-bold text-gray-900">67%</span>
                </div>
              </div>
              <div
                class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
              >
                <div class="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span class="text-sm text-gray-600">已達成</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 最活躍帳戶類型 -->
      <Card class="chart-card">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-900">最活躍帳戶類型</h3>
        </template>
        <template #content>
          <div class="flex items-center justify-center h-48">
            <div class="relative">
              <div
                class="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center"
              >
                <div
                  class="w-24 h-24 rounded-full border-8 border-gray-600 flex items-center justify-center"
                >
                  <span class="text-lg font-bold text-gray-900">活躍</span>
                </div>
              </div>
              <div
                class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
              >
                <div class="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span class="text-sm text-gray-600">非常活躍</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 活躍國家 -->
      <Card class="chart-card">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-900">活躍國家</h3>
        </template>
        <template #content>
          <div class="flex items-center justify-center h-48">
            <div
              class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <i class="pi pi-globe text-gray-400 text-4xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 列表和圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 各國用戶分佈 -->
      <Card class="list-card">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-900">各國用戶分佈</h3>
        </template>
        <template #content>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-blue-500 rounded"></div>
                <span class="font-medium">美國</span>
              </div>
              <div class="text-right">
                <p class="font-semibold">27.5%</p>
                <p class="text-sm text-gray-500">4.5M</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-green-500 rounded"></div>
                <span class="font-medium">澳洲</span>
              </div>
              <div class="text-right">
                <p class="font-semibold">11.2%</p>
                <p class="text-sm text-gray-500">2.3M</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-red-500 rounded"></div>
                <span class="font-medium">中國</span>
              </div>
              <div class="text-right">
                <p class="font-semibold">9.4%</p>
                <p class="text-sm text-gray-500">2M</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-yellow-500 rounded"></div>
                <span class="font-medium">德國</span>
              </div>
              <div class="text-right">
                <p class="font-semibold">8%</p>
                <p class="text-sm text-gray-500">1.7M</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 前5名最佳銷售用戶 -->
      <Card class="list-card">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-900">前5名最佳銷售用戶</h3>
        </template>
        <template #content>
          <div class="flex gap-6">
            <!-- 圓餅圖 -->
            <div class="flex-1 flex items-center justify-center">
              <div class="relative">
                <div
                  class="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center"
                >
                  <div
                    class="w-16 h-16 rounded-full border-8 border-gray-600 flex items-center justify-center"
                  >
                    <span class="text-sm font-bold text-gray-900">Top 5</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 用戶列表 -->
            <div class="flex-1 space-y-3">
              <div class="flex items-center justify-between p-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span class="text-sm">用戶名稱</span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">$1.2M</p>
                  <p class="text-xs text-green-600">+8.2%</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span class="text-sm">用戶名稱</span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">$800K</p>
                  <p class="text-xs text-green-600">+7%</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span class="text-sm">用戶名稱</span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">$645K</p>
                  <p class="text-xs text-green-600">+2.5%</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span class="text-sm">用戶名稱</span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">$590K</p>
                  <p class="text-xs text-red-600">-6.5%</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <span class="text-sm">用戶名稱</span>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">$342K</p>
                  <p class="text-xs text-green-600">+1.7%</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'AdminDashboardIndex',
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 100%;
}

.metric-card {
  transition: transform 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.chart-card {
  min-height: 300px;
}

.list-card {
  min-height: 400px;
}

/* 自定義 PrimeVue Card 樣式 */
:deep(.p-card) {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

:deep(.p-card .p-card-title) {
  color: #111827;
  font-weight: 600;
}

:deep(.p-card .p-card-content) {
  padding: 1.5rem;
}
</style>
