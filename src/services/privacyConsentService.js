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
    try {
      console.log('準備發送隱私權同意資料:', consentData)

      // 確保資料格式正確
      const sanitizedData = {
        necessary: consentData.necessary !== false, // 預設為 true
        functional: consentData.functional === true, // 明確檢查是否為 true
        analytics: consentData.analytics === true, // 明確檢查是否為 true
        consentVersion: consentData.consentVersion || '1.0',
        consentSource: consentData.consentSource || 'settings',
      }

      console.log('清理後的資料:', sanitizedData)

      const response = await apiService.http.post(
        '/api/privacy-consent',
        sanitizedData,
      )

      console.log('隱私權同意建立成功:', response.data)
      return response
    } catch (error) {
      console.error('建立隱私權同意記錄失敗:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData: consentData,
      })

      // 如果是認證錯誤，提供更明確的訊息
      if (error.response?.status === 401) {
        throw new Error('認證失敗，請重新登入')
      }

      // 如果是伺服器錯誤，提供重試建議
      if (error.response?.status >= 500) {
        throw new Error('伺服器暫時無法處理請求，請稍後再試')
      }

      // 如果是客戶端錯誤，提供資料驗證建議
      if (error.response?.status === 400) {
        throw new Error('資料格式錯誤，請檢查設定值')
      }

      throw error
    }
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
      console.log('開始同步隱私權同意資料...')

      // 獲取本地資料
      const localConsent = localStorage.getItem('privacy-consent')
      const localData = localConsent ? JSON.parse(localConsent) : null

      console.log('本地資料:', localData)

      // 獲取後端資料
      let backendData = null
      try {
        console.log('嘗試獲取後端同意資料...')
        const response = await this.getCurrentConsent()
        backendData = response.data?.consent || response.data || null
        console.log('後端資料:', backendData)
      } catch (error) {
        console.warn('無法獲取後端同意資料:', {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
        })

        // 如果是認證錯誤，記錄但不拋出錯誤
        if (error.response?.status === 401) {
          console.warn('用戶未認證，跳過後端同步')
        }
      }

      // 比較時間戳並同步
      if (localData && backendData) {
        const localTime = new Date(
          localData.timestamp || localData.createdAt || 0,
        )
        const backendTime = new Date(
          backendData.timestamp || backendData.createdAt || 0,
        )

        console.log('時間比較:', {
          localTime: localTime.toISOString(),
          backendTime: backendTime.toISOString(),
          localIsNewer: localTime > backendTime,
        })

        if (localTime > backendTime) {
          // 本地資料更新，同步到後端
          console.log('本地資料較新，同步到後端')
          try {
            await this.createConsent({
              necessary: localData.necessary,
              functional: localData.functional,
              analytics: localData.analytics,
              consentVersion: '1.0',
              consentSource: 'sync',
            })
            console.log('本地資料已成功同步到後端')
            return localData
          } catch (syncError) {
            console.error('同步到後端失敗，但返回本地資料:', syncError)
            return localData
          }
        } else {
          // 後端資料更新，同步到本地
          console.log('後端資料較新，同步到本地')
          const updatedLocalData = {
            ...backendData,
            timestamp: new Date().toISOString(),
          }
          localStorage.setItem(
            'privacy-consent',
            JSON.stringify(updatedLocalData),
          )
          console.log('後端資料已同步到本地')
          return updatedLocalData
        }
      } else if (localData && !backendData) {
        // 只有本地資料，同步到後端
        console.log('只有本地資料，嘗試同步到後端')
        try {
          await this.createConsent({
            necessary: localData.necessary,
            functional: localData.functional,
            analytics: localData.analytics,
            consentVersion: '1.0',
            consentSource: 'sync',
          })
          console.log('本地資料已成功同步到後端')
          return localData
        } catch (syncError) {
          console.warn('同步到後端失敗，但返回本地資料:', syncError)
          return localData
        }
      } else if (!localData && backendData) {
        // 只有後端資料，同步到本地
        console.log('只有後端資料，同步到本地')
        const localData = {
          ...backendData,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem('privacy-consent', JSON.stringify(localData))
        console.log('後端資料已同步到本地')
        return localData
      } else {
        // 都沒有資料
        console.log('沒有找到任何同意資料')
        return null
      }
    } catch (error) {
      console.error('同步同意資料失敗:', {
        error: error.message,
        stack: error.stack,
      })

      // 同步失敗時，優先使用本地資料
      const localConsent = localStorage.getItem('privacy-consent')
      if (localConsent) {
        try {
          const parsedConsent = JSON.parse(localConsent)
          console.log('同步失敗，使用本地資料作為備用:', parsedConsent)
          return parsedConsent
        } catch (parseError) {
          console.error('解析本地資料失敗:', parseError)
          return null
        }
      }

      return null
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
