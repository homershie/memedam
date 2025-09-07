<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon left>analytics</v-icon>
              SEO 監控儀表板
            </div>
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                outlined
                @click="refreshData"
                :loading="loading.dashboard"
              >
                <v-icon left>refresh</v-icon>
                重新整理
              </v-btn>
              <v-btn
                color="success"
                @click="runHealthCheck"
                :loading="loading.healthCheck"
              >
                <v-icon left>health_and_safety</v-icon>
                健康檢查
              </v-btn>
              <v-btn
                color="info"
                @click="generateReport"
                :loading="loading.generateReport"
              >
                <v-icon left>description</v-icon>
                生成報告
              </v-btn>
            </div>
          </v-card-title>

          <!-- 監控狀態 -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card outlined class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon
                      :color="
                        seoService.getStatusColor(
                          dashboard.summary?.health_status,
                        )
                      "
                      size="32"
                      class="mr-3"
                    >
                      {{
                        dashboard.status?.is_monitoring
                          ? 'check_circle'
                          : 'error'
                      }}
                    </v-icon>
                    <div>
                      <div class="text-h6">
                        {{ dashboard.summary?.overall_score || 0 }}/100
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        整體分數
                      </div>
                    </div>
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.summary?.health_status,
                      )
                    "
                    size="small"
                    class="mt-2"
                  >
                    {{
                      seoService.getStatusText(dashboard.summary?.health_status)
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card outlined class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="warning" size="32" class="mr-3"
                      >warning</v-icon
                    >
                    <div>
                      <div class="text-h6">
                        {{ dashboard.alerts?.count || 0 }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        活躍警報
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card outlined class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon color="success" size="32" class="mr-3"
                      >schedule</v-icon
                    >
                    <div>
                      <div class="text-h6">
                        {{ formatLastUpdate(dashboard.summary?.last_update) }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        最後更新
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 性能指標 -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>speed</v-icon>
            性能指標
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.performance?.lcp,
                        'milliseconds',
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    Largest Contentful Paint
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.performance?.lcp &&
                          dashboard.metrics.performance.lcp <= 2500
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.performance?.lcp &&
                      dashboard.metrics.performance.lcp <= 2500
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.performance?.fid,
                        'milliseconds',
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    First Input Delay
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.performance?.fid &&
                          dashboard.metrics.performance.fid <= 100
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.performance?.fid &&
                      dashboard.metrics.performance.fid <= 100
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.performance?.cls,
                        'number',
                        3,
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    Cumulative Layout Shift
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.performance?.cls &&
                          dashboard.metrics.performance.cls <= 0.1
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.performance?.cls &&
                      dashboard.metrics.performance.cls <= 0.1
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.performance?.ttfb,
                        'milliseconds',
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    Time to First Byte
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.performance?.ttfb &&
                          dashboard.metrics.performance.ttfb <= 800
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.performance?.ttfb &&
                      dashboard.metrics.performance.ttfb <= 800
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- SEO 健康指標 -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>health_and_safety</v-icon>
            SEO 健康狀態
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.seo_health?.metaTagsScore,
                        'score',
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    Meta 標籤分數
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.seo_health?.metaTagsScore &&
                          dashboard.metrics.seo_health.metaTagsScore >= 80
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.seo_health?.metaTagsScore &&
                      dashboard.metrics.seo_health.metaTagsScore >= 80
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.seo_health?.structuredDataScore,
                        'score',
                      )
                    }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    結構化數據分數
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        dashboard.metrics?.seo_health?.structuredDataScore &&
                          dashboard.metrics.seo_health.structuredDataScore >= 70
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      dashboard.metrics?.seo_health?.structuredDataScore &&
                      dashboard.metrics.seo_health.structuredDataScore >= 70
                        ? '良好'
                        : '需改善'
                    }}
                  </v-chip>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>search</v-icon>
            搜尋引擎指標
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{ dashboard.metrics?.search_engine?.indexedPages || 0 }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    已索引頁面
                  </div>
                  <v-chip color="success" size="small">
                    {{
                      seoService.formatMetric(
                        dashboard.metrics?.search_engine?.indexingRate,
                        'percentage',
                      )
                    }}
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 text-center">
                  <div class="text-h4 mb-2">
                    {{ dashboard.metrics?.search_engine?.crawlErrors || 0 }}
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    爬蟲錯誤
                  </div>
                  <v-chip
                    :color="
                      seoService.getStatusColor(
                        (dashboard.metrics?.search_engine?.crawlErrors || 0) <=
                          5
                          ? 'good'
                          : 'poor',
                      )
                    "
                    size="small"
                  >
                    {{
                      (dashboard.metrics?.search_engine?.crawlErrors || 0) <= 5
                        ? '正常'
                        : '需關注'
                    }}
                  </v-chip>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 活躍警報 -->
    <v-row class="mt-6" v-if="dashboard.alerts?.active?.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left color="error">warning</v-icon>
            活躍警報 ({{ dashboard.alerts.count }})
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
                v-for="alert in dashboard.alerts.active.slice(0, 6)"
                :key="alert.id"
              >
                <v-alert
                  :type="seoService.getSeverityColor(alert.severity)"
                  outlined
                  class="mb-3"
                >
                  <div class="d-flex justify-space-between align-start">
                    <div class="flex-grow-1">
                      <div class="font-weight-medium">{{ alert.message }}</div>
                      <div class="text-caption mt-1">
                        {{ formatAlertTime(alert.timestamp) }} •
                        {{ alert.metric }}: {{ alert.value }}
                      </div>
                    </div>
                    <v-btn
                      icon
                      size="small"
                      @click="resolveAlert(alert)"
                      :loading="resolvingAlert === alert.id"
                    >
                      <v-icon>check</v-icon>
                    </v-btn>
                  </div>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- SEO 建議 -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left color="info">lightbulb</v-icon>
            SEO 優化建議
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="4"
                v-for="recommendation in recommendations.slice(0, 6)"
                :key="recommendation.title"
              >
                <v-card outlined class="pa-4 h-100">
                  <div class="d-flex align-center mb-3">
                    <v-chip
                      :color="
                        recommendation.priority === 'high'
                          ? 'error'
                          : recommendation.priority === 'medium'
                            ? 'warning'
                            : 'info'
                      "
                      size="small"
                      class="mr-2"
                    >
                      {{
                        recommendation.priority === 'high'
                          ? '高'
                          : recommendation.priority === 'medium'
                            ? '中'
                            : '低'
                      }}
                    </v-chip>
                    <div class="text-caption text-medium-emphasis">
                      {{ recommendation.type }}
                    </div>
                  </div>
                  <h4 class="text-h6 mb-2">{{ recommendation.title }}</h4>
                  <p class="text-body-2 text-medium-emphasis mb-3">
                    {{ recommendation.description }}
                  </p>
                  <div class="text-caption">
                    <strong>建議行動：</strong>
                    <ul class="mt-1">
                      <li
                        v-for="action in recommendation.actions.slice(0, 2)"
                        :key="action"
                      >
                        {{ action }}
                      </li>
                    </ul>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  metrics: null,
  alerts: { active: [], count: 0 },
  summary: { overall_score: 0, health_status: 'unknown' },
})

const recommendations = ref([])
const loading = ref({
  dashboard: false,
  healthCheck: false,
  generateReport: false,
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
    dashboard.value = response.data
  } catch (error) {
    console.error('載入儀表板數據失敗:', error)
  } finally {
    loading.value.dashboard = false
  }
}

const loadRecommendations = async () => {
  try {
    const response = await seoService.getSEORecommendations()
    recommendations.value = response.data.recommendations
  } catch (error) {
    console.error('載入建議失敗:', error)
  }
}

const refreshData = async () => {
  await Promise.all([loadDashboardData(), loadRecommendations()])
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
