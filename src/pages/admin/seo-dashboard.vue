<template>
  <div class="container mx-auto px-6 py-8">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="pi pi-chart-line text-xl"></i>
                <h2 class="text-2xl font-semibold">SEO 監控儀表板</h2>
              </div>
              <div class="flex items-center gap-3">
                <Button
                  label="重新整理"
                  icon="pi pi-refresh"
                  outlined
                  @click="refreshData"
                  :loading="loading.dashboard"
                  severity="primary"
                />
                <Button
                  label="健康檢查"
                  icon="pi pi-heart"
                  @click="runHealthCheck"
                  :loading="loading.healthCheck"
                  severity="success"
                />
                <Button
                  label="啟動監控"
                  icon="pi pi-play"
                  @click="startMonitoring"
                  :loading="loading.startMonitoring"
                  v-if="dashboard.status && !dashboard.status.is_monitoring"
                  :disabled="!dashboard.status"
                  severity="warning"
                />
                <Button
                  label="生成報告"
                  icon="pi pi-file-pdf"
                  @click="generateReport"
                  :loading="loading.generateReport"
                  severity="info"
                  outlined
                />
              </div>
            </div>
          </template>

          <!-- 監控狀態 -->
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card class="border border-surface-border">
                <template #content>
                  <div class="flex items-center gap-4">
                    <i
                      :class="[
                        'pi text-3xl',
                        dashboard.status?.is_monitoring
                          ? dashboard.summary?.health_status === 'good'
                            ? 'pi-check-circle text-green-500'
                            : dashboard.summary?.health_status === 'poor'
                              ? 'pi-exclamation-triangle text-orange-500'
                              : 'pi-info-circle text-blue-500'
                          : 'pi-circle text-gray-400',
                      ]"
                    ></i>
                    <div>
                      <div class="text-2xl font-bold">
                        {{ dashboard.summary?.overall_score || 0 }}/100
                      </div>
                      <div class="text-sm text-gray-600">整體分數</div>
                    </div>
                  </div>
                  <Badge
                    :value="
                      dashboard.status?.is_monitoring
                        ? seoService.getStatusText(
                            dashboard.summary?.health_status,
                          )
                        : '監控未啟動'
                    "
                    :severity="
                      dashboard.status?.is_monitoring
                        ? dashboard.summary?.health_status === 'good'
                          ? 'success'
                          : dashboard.summary?.health_status === 'poor'
                            ? 'warning'
                            : 'info'
                        : 'secondary'
                    "
                    class="mt-3"
                  />
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="flex items-center gap-4">
                    <i class="pi pi-bell text-3xl text-orange-500"></i>
                    <div>
                      <div class="text-2xl font-bold">
                        {{ dashboard.alerts?.count || 0 }}
                      </div>
                      <div class="text-sm text-gray-600">活躍警報</div>
                    </div>
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="flex items-center gap-4">
                    <i class="pi pi-clock text-3xl text-green-500"></i>
                    <div>
                      <div class="text-2xl font-bold">
                        {{ formatLastUpdate(dashboard.summary?.last_update) }}
                      </div>
                      <div class="text-sm text-gray-600">最後更新</div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 監控狀態指示器 -->
    <div class="mt-8" v-if="!dashboard.status?.is_monitoring">
      <div class="col-span-12">
        <Message severity="info" class="mb-6">
          <i class="pi pi-info-circle mr-2"></i>
          SEO 監控系統尚未啟動。請點擊「啟動監控」按鈕開始收集指標資料。
        </Message>
      </div>
    </div>

    <!-- 狀態調試資訊 -->
    <div class="mt-6" v-if="false">
      <div class="col-span-12">
        <Card class="border border-surface-border p-4">
          <template #content>
            <h4>調試資訊</h4>
            <p>
              dashboard.status: {{ JSON.stringify(dashboard.status, null, 2) }}
            </p>
            <p>is_monitoring: {{ dashboard.status?.is_monitoring }}</p>
            <p>
              按鈕應該顯示:
              {{ dashboard.status && !dashboard.status.is_monitoring }}
            </p>
          </template>
        </Card>
      </div>
    </div>

    <!-- 性能指標 -->
    <div class="mt-8">
      <div class="col-span-12">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-tachometer text-xl"></i>
              <h3 class="text-xl font-semibold">性能指標</h3>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.performance?.lcp,
                          'milliseconds',
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                      Largest Contentful Paint
                    </div>
                    <Badge
                      :value="
                        dashboard.metrics?.performance?.lcp &&
                        dashboard.metrics.performance.lcp <= 2500
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.performance?.lcp &&
                        dashboard.metrics.performance.lcp <= 2500
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.performance?.fid,
                          'milliseconds',
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                      First Input Delay
                    </div>
                    <Badge
                      :value="
                        dashboard.metrics?.performance?.fid &&
                        dashboard.metrics.performance.fid <= 100
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.performance?.fid &&
                        dashboard.metrics.performance.fid <= 100
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.performance?.cls,
                          'number',
                          3,
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                      Cumulative Layout Shift
                    </div>
                    <Badge
                      :value="
                        dashboard.metrics?.performance?.cls &&
                        dashboard.metrics.performance.cls <= 0.1
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.performance?.cls &&
                        dashboard.metrics.performance.cls <= 0.1
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.performance?.ttfb,
                          'milliseconds',
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">
                      Time to First Byte
                    </div>
                    <Badge
                      :value="
                        dashboard.metrics?.performance?.ttfb &&
                        dashboard.metrics.performance.ttfb <= 800
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.performance?.ttfb &&
                        dashboard.metrics.performance.ttfb <= 800
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- SEO 健康指標 -->
    <div class="mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-shield text-xl"></i>
              <h3 class="text-xl font-semibold">SEO 健康狀態</h3>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.seo_health?.metaTagsScore,
                          'score',
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">Meta 標籤分數</div>
                    <Badge
                      :value="
                        dashboard.metrics?.seo_health?.metaTagsScore &&
                        dashboard.metrics.seo_health.metaTagsScore >= 80
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.seo_health?.metaTagsScore &&
                        dashboard.metrics.seo_health.metaTagsScore >= 80
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{
                        seoService.formatMetric(
                          dashboard.metrics?.seo_health?.structuredDataScore,
                          'score',
                        )
                      }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">結構化數據分數</div>
                    <Badge
                      :value="
                        dashboard.metrics?.seo_health?.structuredDataScore &&
                        dashboard.metrics.seo_health.structuredDataScore >= 70
                          ? '良好'
                          : '需改善'
                      "
                      :severity="
                        dashboard.metrics?.seo_health?.structuredDataScore &&
                        dashboard.metrics.seo_health.structuredDataScore >= 70
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </Card>

        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-search text-xl"></i>
              <h3 class="text-xl font-semibold">搜尋引擎指標</h3>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{ dashboard.metrics?.search_engine?.indexedPages || 0 }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">已索引頁面</div>
                    <Badge
                      :value="
                        seoService.formatMetric(
                          dashboard.metrics?.search_engine?.indexingRate,
                          'percentage',
                        )
                      "
                      severity="success"
                    />
                  </div>
                </template>
              </Card>

              <Card class="border border-surface-border">
                <template #content>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2">
                      {{ dashboard.metrics?.search_engine?.crawlErrors || 0 }}
                    </div>
                    <div class="text-sm text-gray-600 mb-3">爬蟲錯誤</div>
                    <Badge
                      :value="
                        (dashboard.metrics?.search_engine?.crawlErrors || 0) <=
                        5
                          ? '正常'
                          : '需關注'
                      "
                      :severity="
                        (dashboard.metrics?.search_engine?.crawlErrors || 0) <=
                        5
                          ? 'success'
                          : 'warning'
                      "
                    />
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- 活躍警報 -->
    <div class="mt-8" v-if="dashboard.alerts?.active?.length > 0">
      <div class="col-span-12">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-exclamation-triangle text-xl text-red-500"></i>
              <h3 class="text-xl font-semibold">
                活躍警報 ({{ dashboard.alerts.count }})
              </h3>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="alert in dashboard.alerts.active.slice(0, 6)"
                :key="alert.id"
                class="p-4 border border-red-200 rounded-lg bg-red-50"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="font-semibold text-red-800 mb-2">
                      {{ alert.message }}
                    </div>
                    <div class="text-sm text-red-600">
                      {{ formatAlertTime(alert.timestamp) }} •
                      {{ alert.metric }}: {{ alert.value }}
                    </div>
                  </div>
                  <Button
                    icon="pi pi-check"
                    size="small"
                    @click="resolveAlert(alert)"
                    :loading="resolvingAlert === alert.id"
                    severity="success"
                    outlined
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- SEO 建議 -->
    <div class="mt-8">
      <div class="col-span-12">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-lightbulb text-xl text-blue-500"></i>
              <h3 class="text-xl font-semibold">SEO 優化建議</h3>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                v-for="recommendation in recommendations.slice(0, 6)"
                :key="recommendation.title"
                class="border border-surface-border h-full"
              >
                <template #content>
                  <div class="flex items-center gap-2 mb-4">
                    <Badge
                      :value="
                        recommendation.priority === 'high'
                          ? '高'
                          : recommendation.priority === 'medium'
                            ? '中'
                            : '低'
                      "
                      :severity="
                        recommendation.priority === 'high'
                          ? 'danger'
                          : recommendation.priority === 'medium'
                            ? 'warning'
                            : 'info'
                      "
                    />
                    <span class="text-sm text-gray-600">{{
                      recommendation.type
                    }}</span>
                  </div>
                  <h4 class="text-lg font-semibold mb-3">
                    {{ recommendation.title }}
                  </h4>
                  <p class="text-gray-700 mb-4 text-sm leading-relaxed">
                    {{ recommendation.description }}
                  </p>
                  <div class="text-sm">
                    <strong class="text-gray-800">建議行動：</strong>
                    <ul class="mt-2 space-y-1">
                      <li
                        v-for="action in recommendation.actions.slice(0, 2)"
                        :key="action"
                        class="flex items-start gap-2"
                      >
                        <i
                          class="pi pi-check text-green-500 text-xs mt-0.5"
                        ></i>
                        <span class="text-gray-600">{{ action }}</span>
                      </li>
                    </ul>
                  </div>
                </template>
              </Card>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: 'SEO 監控'
  admin: true
</route>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import seoService from '@/services/seoService.js'

// 響應式數據
const dashboard = ref({
  status: { is_monitoring: false },
  metrics: {
    performance: null,
    seo_health: null,
    search_engine: null,
    timestamp: null,
  },
  alerts: { active: [], count: 0 },
  summary: { overall_score: 0, health_status: 'unknown', last_update: null },
})

const recommendations = ref([])
const loading = ref({
  dashboard: false,
  healthCheck: false,
  generateReport: false,
  startMonitoring: false,
})

const resolvingAlert = ref(null)
let refreshInterval = null

// 生命周期
onMounted(async () => {
  await loadDashboardData()
  await loadRecommendations()

  // 每 5 分鐘自動重新整理
  refreshInterval = setInterval(
    async () => {
      await loadDashboardData()
    },
    5 * 60 * 1000,
  )
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// 方法
const loadDashboardData = async () => {
  try {
    loading.value.dashboard = true
    const response = await seoService.getSEODashboard()

    // 深度合併資料，保留預設值結構
    dashboard.value = {
      ...dashboard.value,
      ...response,
      status: { ...dashboard.value.status, ...(response.status || {}) },
      metrics: {
        ...dashboard.value.metrics,
        ...(response.metrics || {}),
        performance:
          response.metrics?.performance || dashboard.value.metrics.performance,
        seo_health:
          response.metrics?.seo_health || dashboard.value.metrics.seo_health,
        search_engine:
          response.metrics?.search_engine ||
          dashboard.value.metrics.search_engine,
      },
      alerts: { ...dashboard.value.alerts, ...(response.alerts || {}) },
      summary: { ...dashboard.value.summary, ...(response.summary || {}) },
    }
  } catch (error) {
    console.error('載入儀表板數據失敗:', error)
  } finally {
    loading.value.dashboard = false
  }
}

const loadRecommendations = async () => {
  try {
    const response = await seoService.getSEORecommendations()
    recommendations.value = response.recommendations || []
  } catch (error) {
    console.error('載入建議失敗:', error)
  }
}

const refreshData = async () => {
  await Promise.all([loadDashboardData(), loadRecommendations()])
}

const startMonitoring = async () => {
  try {
    loading.value.startMonitoring = true
    await seoService.startMonitoring()
    await loadDashboardData() // 重新載入數據
  } catch (error) {
    console.error('啟動監控失敗:', error)
  } finally {
    loading.value.startMonitoring = false
  }
}

const runHealthCheck = async () => {
  try {
    loading.value.healthCheck = true
    await seoService.runSEOHealthCheck()
    await loadDashboardData() // 重新載入數據
  } catch (error) {
    console.error('執行健康檢查失敗:', error)
  } finally {
    loading.value.healthCheck = false
  }
}

const generateReport = async () => {
  try {
    loading.value.generateReport = true
    await seoService.generateReport()
    // 可以顯示成功訊息
  } catch (error) {
    console.error('生成報告失敗:', error)
  } finally {
    loading.value.generateReport = false
  }
}

const resolveAlert = async (alert) => {
  try {
    resolvingAlert.value = alert.id
    await seoService.resolveAlert(alert.id, '從管理員儀表板解析')
    await loadDashboardData() // 重新載入數據
  } catch (error) {
    console.error('解析警報失敗:', error)
  } finally {
    resolvingAlert.value = null
  }
}

// 工具方法
const formatLastUpdate = (timestamp) => {
  if (!timestamp) return '未知'

  const now = new Date()
  const updateTime = new Date(timestamp)
  const diffMinutes = Math.floor((now - updateTime) / (1000 * 60))

  if (diffMinutes < 1) return '剛剛'
  if (diffMinutes < 60) return `${diffMinutes} 分鐘前`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} 小時前`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} 天前`
}

const formatAlertTime = (timestamp) => {
  if (!timestamp) return '未知'

  const date = new Date(timestamp)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.h-100 {
  height: 100%;
}
</style>
