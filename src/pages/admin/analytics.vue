<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminAnalytics',
})

import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

onMounted(() => {
  loadAnalytics()
})

const toast = useToast()
const analyticsData = ref({})
const algorithmStats = ref([])
const userBehavior = ref({})
const loading = ref(false)
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  end: new Date().toISOString().split('T')[0],
})

const loadAnalytics = async () => {
  loading.value = true
  try {
    // TODO: 整合實際的分析服務
    // const response = await analyticsService.getDashboard({
    //   start_date: dateRange.value.start,
    //   end_date: dateRange.value.end
    // })
    // analyticsData.value = response.data

    // 暫時模擬數據
    analyticsData.value = {
      totalMemes: 1234,
      totalUsers: 5678,
      totalViews: 98765,
      totalLikes: 4321,
      totalComments: 2345,
      totalShares: 1234,
      activeUsers: 890,
      newUsers: 123,
      engagementRate: 0.045,
      ctr: 0.023,
      avgSessionDuration: 180,
      bounceRate: 0.35,
    }

    algorithmStats.value = [
      {
        algorithm: '協同過濾',
        ctr: 0.025,
        engagement_rate: 0.052,
        conversion_rate: 0.018,
        avg_rating: 4.2,
        total_recommendations: 45678,
      },
      {
        algorithm: '內容基礎',
        ctr: 0.021,
        engagement_rate: 0.048,
        conversion_rate: 0.015,
        avg_rating: 4.0,
        total_recommendations: 34567,
      },
      {
        algorithm: '混合推薦',
        ctr: 0.028,
        engagement_rate: 0.058,
        conversion_rate: 0.022,
        avg_rating: 4.5,
        total_recommendations: 56789,
      },
      {
        algorithm: '熱門推薦',
        ctr: 0.019,
        engagement_rate: 0.042,
        conversion_rate: 0.012,
        avg_rating: 3.8,
        total_recommendations: 23456,
      },
    ]

    userBehavior.value = {
      topCategories: [
        { name: '搞笑', count: 2345, percentage: 35 },
        { name: '動漫', count: 1890, percentage: 28 },
        { name: '遊戲', count: 1234, percentage: 18 },
        { name: '科技', count: 890, percentage: 13 },
        { name: '其他', count: 456, percentage: 6 },
      ],
      userActivity: [
        { time: '00:00', users: 45 },
        { time: '04:00', users: 23 },
        { time: '08:00', users: 156 },
        { time: '12:00', users: 234 },
        { time: '16:00', users: 189 },
        { time: '20:00', users: 267 },
        { time: '24:00', users: 78 },
      ],
      deviceUsage: [
        { device: '桌面', percentage: 45 },
        { device: '手機', percentage: 42 },
        { device: '平板', percentage: 13 },
      ],
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入分析數據失敗',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadAnalytics()
}

// 計算屬性
const ctrChartData = computed(() => ({
  labels: algorithmStats.value.map((stat) => stat.algorithm),
  datasets: [
    {
      label: '點擊率 (%)',
      data: algorithmStats.value.map((stat) => (stat.ctr * 100).toFixed(2)),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
}))

const engagementChartData = computed(() => ({
  labels: algorithmStats.value.map((stat) => stat.algorithm),
  datasets: [
    {
      label: '互動率 (%)',
      data: algorithmStats.value.map((stat) =>
        (stat.engagement_rate * 100).toFixed(2),
      ),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
}))

const userActivityChartData = computed(() => ({
  labels: userBehavior.value.userActivity?.map((item) => item.time) || [],
  datasets: [
    {
      label: '活躍用戶數',
      data: userBehavior.value.userActivity?.map((item) => item.users) || [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false,
    },
  ],
}))

const deviceUsageChartData = computed(() => ({
  labels: userBehavior.value.deviceUsage?.map((item) => item.device) || [],
  datasets: [
    {
      data:
        userBehavior.value.deviceUsage?.map((item) => item.percentage) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}
</script>

<template>
  <div class="admin-analytics">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">數據分析</h1>
      <div class="flex gap-4 items-center">
        <Calendar
          v-model="dateRange"
          selectionMode="range"
          :showIcon="true"
          placeholder="選擇日期範圍"
          class="w-64"
        />
        <Button
          label="重新整理"
          icon="pi pi-refresh"
          @click="refreshData"
          :loading="loading"
        />
      </div>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ analyticsData.totalMemes?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總迷因數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ analyticsData.totalUsers?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總用戶數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ analyticsData.totalViews?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總瀏覽數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">
              {{ analyticsData.totalLikes?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總點讚數</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 詳細統計 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-xl font-bold text-orange-600">
              {{ analyticsData.totalComments?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總評論數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-xl font-bold text-indigo-600">
              {{ analyticsData.totalShares?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">總分享數</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-xl font-bold text-teal-600">
              {{ analyticsData.activeUsers?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">活躍用戶</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="text-center">
            <div class="text-xl font-bold text-pink-600">
              {{ analyticsData.newUsers?.toLocaleString() }}
            </div>
            <div class="text-gray-600 dark:text-gray-400">新用戶</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 推薦系統效能分析 -->
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <span>推薦系統效能分析</span>
            <Button icon="pi pi-download" text size="small" />
          </div>
        </template>
        <template #content>
          <div class="h-80">
            <Chart type="bar" :data="ctrChartData" :options="chartOptions" />
          </div>
        </template>
      </Card>

      <!-- 互動率比較 -->
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <span>互動率比較</span>
            <Button icon="pi pi-download" text size="small" />
          </div>
        </template>
        <template #content>
          <div class="h-80">
            <Chart
              type="bar"
              :data="engagementChartData"
              :options="chartOptions"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- 用戶行為分析 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 用戶活躍度 -->
      <Card>
        <template #title>用戶活躍度 (24小時)</template>
        <template #content>
          <div class="h-80">
            <Chart
              type="line"
              :data="userActivityChartData"
              :options="chartOptions"
            />
          </div>
        </template>
      </Card>

      <!-- 設備使用分布 -->
      <Card>
        <template #title>設備使用分布</template>
        <template #content>
          <div class="h-80">
            <Chart
              type="doughnut"
              :data="deviceUsageChartData"
              :options="chartOptions"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- 演算法詳細統計 -->
    <Card>
      <template #title>演算法詳細統計</template>
      <template #content>
        <DataTable
          :value="algorithmStats"
          :loading="loading"
          class="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column field="algorithm" header="演算法" sortable />
          <Column field="ctr" header="點擊率" sortable>
            <template #body="{ data }">
              {{ (data.ctr * 100).toFixed(2) }}%
            </template>
          </Column>
          <Column field="engagement_rate" header="互動率" sortable>
            <template #body="{ data }">
              {{ (data.engagement_rate * 100).toFixed(2) }}%
            </template>
          </Column>
          <Column field="conversion_rate" header="轉換率" sortable>
            <template #body="{ data }">
              {{ (data.conversion_rate * 100).toFixed(2) }}%
            </template>
          </Column>
          <Column field="avg_rating" header="平均評分" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <span class="mr-2">{{ data.avg_rating.toFixed(1) }}</span>
                <div class="flex">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="
                      i <= Math.round(data.avg_rating)
                        ? 'pi pi-star-fill text-yellow-400'
                        : 'pi pi-star text-gray-300'
                    "
                  ></i>
                </div>
              </div>
            </template>
          </Column>
          <Column field="total_recommendations" header="推薦總數" sortable>
            <template #body="{ data }">
              {{ data.total_recommendations.toLocaleString() }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 熱門分類 -->
    <Card class="mt-6">
      <template #title>熱門分類</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="category in userBehavior.topCategories"
            :key="category.name"
            class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <div class="font-semibold">{{ category.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ category.count.toLocaleString() }} 個迷因
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-blue-600">
                {{ category.percentage }}%
              </div>
              <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: category.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '數據分析'
  admin: true
</route>
