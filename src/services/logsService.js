import apiService from './apiService.js'

class LogsService {
  constructor() {
    this.baseURL = '/api/logs'
  }

  /**
   * 獲取日誌列表
   * @param {Object} params - 查詢參數
   * @param {string} params.level - 日誌等級 (info, warn, error)
   * @param {string} params.context - 日誌來源
   * @param {string} params.search - 搜尋關鍵字
   * @param {string} params.startDate - 開始時間
   * @param {string} params.endDate - 結束時間
   * @param {number} params.page - 頁碼
   * @param {number} params.limit - 每頁數量
   * @returns {Promise<Object>} 日誌列表和分頁資訊
   */
  async getLogs(params = {}) {
    try {
      const response = await apiService.get(this.baseURL, { params })
      return response.data
    } catch (error) {
      console.error('獲取日誌失敗:', error)
      throw new Error('獲取日誌失敗')
    }
  }

  /**
   * 獲取日誌統計資訊
   * @returns {Promise<Object>} 統計資料
   */
  async getStatistics() {
    try {
      const response = await apiService.get(`${this.baseURL}/statistics`)
      return response.data
    } catch (error) {
      console.error('獲取日誌統計失敗:', error)
      throw new Error('獲取日誌統計失敗')
    }
  }

  /**
   * 匯出日誌為 CSV
   * @param {Object} params - 篩選參數
   * @returns {Promise<Blob>} CSV 檔案 blob
   */
  async exportLogs(params = {}) {
    try {
      const response = await apiService.get(`${this.baseURL}/export`, {
        params,
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('匯出日誌失敗:', error)
      throw new Error('匯出日誌失敗')
    }
  }

  /**
   * 獲取可用的日誌來源列表
   * @returns {Promise<Array>} 來源列表
   */
  async getContexts() {
    try {
      const response = await apiService.get(`${this.baseURL}/contexts`)
      return response.data.data
    } catch (error) {
      console.error('獲取日誌來源失敗:', error)
      throw new Error('獲取日誌來源失敗')
    }
  }

  /**
   * 清理舊日誌
   * @param {number} daysToKeep - 保留天數
   * @returns {Promise<Object>} 清理結果
   */
  async cleanupLogs(daysToKeep = 7) {
    try {
      const response = await apiService.post(`${this.baseURL}/cleanup`, {
        daysToKeep,
      })
      return response.data
    } catch (error) {
      console.error('清理日誌失敗:', error)
      throw new Error('清理日誌失敗')
    }
  }

  /**
   * 建立即時日誌串流連線
   * @param {Object} options - 串流選項
   * @param {string} options.level - 篩選等級
   * @param {Function} options.onMessage - 訊息回調
   * @param {Function} options.onError - 錯誤回調
   * @returns {EventSource} EventSource 實例
   */
  createLogStream(options = {}) {
    const { level, onMessage, onError } = options

    // 構建 URL
    let streamURL = `${this.getStreamBaseURL()}/api/logs/stream`
    const params = new URLSearchParams()

    if (level) {
      params.append('level', level)
    }

    if (params.toString()) {
      streamURL += `?${params.toString()}`
    }

    // 建立 EventSource
    const eventSource = new EventSource(streamURL, {
      withCredentials: true,
    })

    // 設置事件監聽器
    eventSource.onmessage = (event) => {
      try {
        const logData = JSON.parse(event.data)
        if (onMessage) {
          onMessage(logData)
        }
      } catch (error) {
        console.error('解析日誌串流資料失敗:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('日誌串流錯誤:', error)
      if (onError) {
        onError(error)
      }
    }

    return eventSource
  }

  /**
   * 獲取串流基礎 URL
   * @returns {string} 基礎 URL
   */
  getStreamBaseURL() {
    // 開發環境
    if (import.meta.env.DEV) {
      return 'http://localhost:4000'
    }

    // 生產環境 - 根據當前域名決定
    const currentHost = window.location.hostname
    if (currentHost === 'memedam.com' || currentHost === 'www.memedam.com') {
      return 'https://api.memedam.com'
    }

    // 預設使用相對路徑
    return window.location.origin
  }

  /**
   * 下載 CSV 檔案
   * @param {Blob} blob - 檔案 blob
   * @param {string} filename - 檔案名稱
   */
  downloadCSV(blob, filename = null) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download =
      filename || `logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * 格式化日誌等級為中文
   * @param {string} level - 英文等級
   * @returns {string} 中文等級
   */
  formatLevel(level) {
    const levelMap = {
      info: '資訊',
      warn: '警告',
      error: '錯誤',
    }
    return levelMap[level] || level
  }

  /**
   * 獲取等級對應的嚴重性
   * @param {string} level - 等級
   * @returns {string} PrimeVue 嚴重性
   */
  getLevelSeverity(level) {
    const severityMap = {
      info: 'info',
      warn: 'warning',
      error: 'danger',
    }
    return severityMap[level] || 'secondary'
  }

  /**
   * 格式化時間為本地時間
   * @param {string} dateString - ISO 時間字串
   * @returns {string} 格式化後的時間
   */
  formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  /**
   * 獲取時間範圍預設選項
   * @returns {Array} 時間範圍選項
   */
  getTimeRangeOptions() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return [
      {
        label: '最近 1 小時',
        value: 'last-hour',
        startDate: new Date(now.getTime() - 60 * 60 * 1000),
        endDate: now,
      },
      {
        label: '今天',
        value: 'today',
        startDate: today,
        endDate: now,
      },
      {
        label: '最近 24 小時',
        value: 'last-24h',
        startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endDate: now,
      },
      {
        label: '最近 3 天',
        value: 'last-3d',
        startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        endDate: now,
      },
      {
        label: '最近 7 天',
        value: 'last-7d',
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: now,
      },
    ]
  }
}

const logsService = new LogsService()
export default logsService
