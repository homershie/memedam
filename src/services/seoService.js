/**
 * SEO 監控服務
 * 提供前端與後端 SEO API 的介面
 */

import apiService from './apiService.js'

class SEOService {
  /**
   * 取得 SEO 監控狀態
   */
  async getMonitoringStatus() {
    try {
      const response = await apiService.httpAuth.get('/api/seo/status')
      return response.data
    } catch (error) {
      console.error('取得 SEO 監控狀態失敗:', error)
      throw error
    }
  }

  /**
   * 取得最新 SEO 指標
   */
  async getLatestMetrics() {
    try {
      const response = await apiService.httpAuth.get('/api/seo/metrics')
      return response.data
    } catch (error) {
      console.error('取得最新指標失敗:', error)
      throw error
    }
  }

  /**
   * 取得 SEO 報告
   */
  async getSEOReport(date = null) {
    try {
      const params = date ? { date } : {}
      const response = await apiService.httpAuth.get('/api/seo/reports', {
        params,
      })
      return response.data
    } catch (error) {
      console.error('取得 SEO 報告失敗:', error)
      throw error
    }
  }

  /**
   * 取得 SEO 報告列表
   */
  async getSEOReportsList(limit = 30) {
    try {
      const response = await apiService.httpAuth.get('/api/seo/reports/list', {
        params: { limit },
      })
      return response.data
    } catch (error) {
      console.error('取得報告列表失敗:', error)
      throw error
    }
  }

  /**
   * 取得活躍警報
   */
  async getActiveAlerts(filters = {}) {
    try {
      const response = await apiService.httpAuth.get('/api/seo/alerts', {
        params: filters,
      })
      return response.data
    } catch (error) {
      console.error('取得活躍警報失敗:', error)
      throw error
    }
  }

  /**
   * 解析警報
   */
  async resolveAlert(alertId, resolutionNote = '') {
    try {
      const response = await apiService.httpAuth.post(
        `/api/seo/alerts/${alertId}/resolve`,
        {
          resolution_note: resolutionNote,
        },
      )
      return response.data
    } catch (error) {
      console.error('解析警報失敗:', error)
      throw error
    }
  }

  /**
   * 取得 SEO 建議
   */
  async getSEORecommendations(filters = {}) {
    try {
      const response = await apiService.httpAuth.get(
        '/api/seo/recommendations',
        {
          params: filters,
        },
      )
      return response.data.data
    } catch (error) {
      console.error('取得 SEO 建議失敗:', error)
      throw error
    }
  }

  /**
   * 執行 SEO 健康檢查
   */
  async runSEOHealthCheck() {
    try {
      const response = await apiService.httpAuth.post('/api/seo/health-check')
      return response.data
    } catch (error) {
      console.error('執行 SEO 健康檢查失敗:', error)
      throw error
    }
  }

  /**
   * 取得 SEO 儀表板數據
   */
  async getSEODashboard() {
    try {
      const response = await apiService.httpAuth.get('/api/seo/dashboard')
      return response.data.data
    } catch (error) {
      console.error('取得 SEO 儀表板數據失敗:', error)
      throw error
    }
  }

  /**
   * 啟動監控（管理員功能）
   */
  async startMonitoring() {
    try {
      const response = await apiService.httpAuth.post(
        '/api/seo/monitoring/start',
      )
      return response.data
    } catch (error) {
      console.error('啟動 SEO 監控失敗:', error)
      throw error
    }
  }

  /**
   * 停止監控（管理員功能）
   */
  async stopMonitoring() {
    try {
      const response = await apiService.httpAuth.post(
        '/api/seo/monitoring/stop',
      )
      return response.data
    } catch (error) {
      console.error('停止 SEO 監控失敗:', error)
      throw error
    }
  }

  /**
   * 手動生成報告（管理員功能）
   */
  async generateReport() {
    try {
      const response = await apiService.httpAuth.post(
        '/api/seo/reports/generate',
      )
      return response.data
    } catch (error) {
      console.error('生成 SEO 報告失敗:', error)
      throw error
    }
  }

  /**
   * 格式化指標值
   */
  formatMetric(value, type = 'number', decimals = 1) {
    if (value === null || value === undefined) return '資料收集中'

    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(decimals)}%`
      case 'milliseconds':
        return `${value.toFixed(decimals)}ms`
      case 'bytes':
        return this.formatBytes(value)
      case 'score':
        return value.toFixed(0)
      default:
        return typeof value === 'number' ? value.toFixed(decimals) : value
    }
  }

  /**
   * 格式化字節數
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * 取得狀態顏色
   */
  getStatusColor(status) {
    switch (status) {
      case 'good':
      case 'excellent':
        return 'success'
      case 'fair':
        return 'warning'
      case 'poor':
        return 'error'
      default:
        return 'grey'
    }
  }

  /**
   * 取得狀態文字
   */
  getStatusText(status) {
    switch (status) {
      case 'excellent':
        return '優秀'
      case 'good':
        return '良好'
      case 'fair':
        return '一般'
      case 'poor':
        return '需改善'
      default:
        return '未知'
    }
  }

  /**
   * 取得嚴重程度顏色
   */
  getSeverityColor(severity) {
    switch (severity) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'grey'
    }
  }

  /**
   * 取得嚴重程度文字
   */
  getSeverityText(severity) {
    switch (severity) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return '未知'
    }
  }

  /**
   * 取得趨勢圖標
   */
  getTrendIcon(trend) {
    switch (trend) {
      case 'increasing':
        return 'trending_up'
      case 'decreasing':
        return 'trending_down'
      case 'stable':
        return 'trending_flat'
      default:
        return 'help'
    }
  }

  /**
   * 取得趨勢顏色
   */
  getTrendColor(trend) {
    switch (trend) {
      case 'increasing':
        return 'error' // 上升通常是壞事（如錯誤增加）
      case 'decreasing':
        return 'success' // 下降通常是好事（如錯誤減少）
      case 'stable':
        return 'info'
      default:
        return 'grey'
    }
  }
}

export default new SEOService()
