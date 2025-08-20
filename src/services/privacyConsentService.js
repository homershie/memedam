import apiService from './apiService'

class PrivacyConsentService {
  /**
   * 建立新的隱私權同意記錄
   * @param {Object} consentData - 同意資料
   * @param {boolean} consentData.necessary - 必要 Cookie
   * @param {boolean} consentData.functional - 功能 Cookie
   * @param {boolean} consentData.analytics - 分析 Cookie
   * @param {string} consentData.consentVersion - 同意版本
   * @param {string} consentData.consentSource - 同意來源 (initial, settings, reconsent)
   * @returns {Promise} API 回應
   */
  async createConsent(consentData) {
    return apiService.http.post('/api/privacy-consent', consentData)
  }

  /**
   * 獲取當前有效的同意設定
   * @returns {Promise} API 回應
   */
  async getCurrentConsent() {
    return apiService.http.get('/api/privacy-consent/current')
  }

  /**
   * 獲取同意歷史記錄
   * @param {Object} params - 查詢參數
   * @param {string} params.userId - 使用者 ID
   * @param {string} params.sessionId - 會話 ID
   * @param {number} params.page - 頁碼
   * @param {number} params.limit - 每頁數量
   * @param {boolean} params.includeRevoked - 是否包含已撤銷的記錄
   * @returns {Promise} API 回應
   */
  async getConsentHistory(params = {}) {
    return apiService.http.get('/api/privacy-consent/history', { params })
  }

  /**
   * 更新同意設定
   * @param {string} consentId - 同意記錄 ID
   * @param {Object} updateData - 更新資料
   * @param {boolean} updateData.necessary - 必要 Cookie
   * @param {boolean} updateData.functional - 功能 Cookie
   * @param {boolean} updateData.analytics - 分析 Cookie
   * @param {string} updateData.consentSource - 同意來源
   * @returns {Promise} API 回應
   */
  async updateConsent(consentId, updateData) {
    return apiService.http.put(`/api/privacy-consent/${consentId}`, updateData)
  }

  /**
   * 撤銷同意
   * @param {string} consentId - 同意記錄 ID
   * @returns {Promise} API 回應
   */
  async revokeConsent(consentId) {
    return apiService.http.delete(`/api/privacy-consent/${consentId}`)
  }

  /**
   * 獲取同意統計資料 (管理員專用)
   * @param {Object} params - 查詢參數
   * @param {string} params.startDate - 開始日期
   * @param {string} params.endDate - 結束日期
   * @returns {Promise} API 回應
   */
  async getConsentStats(params = {}) {
    return apiService.httpAuth.get('/api/privacy-consent/admin/stats', {
      params,
    })
  }

  /**
   * 比較並同步本地和後端的同意資料
   * @returns {Promise<Object>} 同步後的同意資料
   */
  async syncConsentData() {
    try {
      // 獲取本地資料
      const localConsent = localStorage.getItem('privacy-consent')
      const localData = localConsent ? JSON.parse(localConsent) : null

      // 獲取後端資料
      let backendData = null
      try {
        const response = await this.getCurrentConsent()
        backendData = response.data?.consent || null
      } catch (error) {
        console.log('無法獲取後端同意資料:', error.message)
      }

      // 比較時間戳並同步
      if (localData && backendData) {
        const localTime = new Date(localData.timestamp)
        const backendTime = new Date(backendData.timestamp)

        if (localTime > backendTime) {
          // 本地資料更新，同步到後端
          console.log('本地資料較新，同步到後端')
          await this.createConsent({
            necessary: localData.necessary,
            functional: localData.functional,
            analytics: localData.analytics,
            consentVersion: '1.0',
            consentSource: 'sync',
          })
          return localData
        } else {
          // 後端資料更新，同步到本地
          console.log('後端資料較新，同步到本地')
          localStorage.setItem('privacy-consent', JSON.stringify(backendData))
          return backendData
        }
      } else if (localData && !backendData) {
        // 只有本地資料，同步到後端
        console.log('只有本地資料，同步到後端')
        await this.createConsent({
          necessary: localData.necessary,
          functional: localData.functional,
          analytics: localData.analytics,
          consentVersion: '1.0',
          consentSource: 'sync',
        })
        return localData
      } else if (!localData && backendData) {
        // 只有後端資料，同步到本地
        console.log('只有後端資料，同步到本地')
        localStorage.setItem('privacy-consent', JSON.stringify(backendData))
        return backendData
      } else {
        // 都沒有資料
        console.log('沒有同意資料')
        return null
      }
    } catch (error) {
      console.error('同步同意資料失敗:', error)
      // 同步失敗時，優先使用本地資料
      const localConsent = localStorage.getItem('privacy-consent')
      return localConsent ? JSON.parse(localConsent) : null
    }
  }

  /**
   * 檢查並修復資料一致性
   * @returns {Promise<boolean>} 是否成功修復
   */
  async repairConsistency() {
    try {
      const syncedData = await this.syncConsentData()
      return syncedData !== null
    } catch (error) {
      console.error('修復資料一致性失敗:', error)
      return false
    }
  }
}

export default new PrivacyConsentService()
