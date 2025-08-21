import apiService from './apiService.js'

/**
 * 偏好設定服務
 * 處理使用者偏好設定，包括主題、語言、個人化和搜尋偏好
 */
class PreferencesService {
  /**
   * 設定主題偏好
   * @param {string} theme - 主題選項 (light, dark, auto)
   * @returns {Promise} API 回應
   */
  async setTheme(theme) {
    return apiService.httpAuth.post('/api/users/preferences/theme', { theme })
  }

  /**
   * 設定語言偏好
   * @param {string} language - 語言選項 (zh-TW, en-US, ja-JP)
   * @returns {Promise} API 回應
   */
  async setLanguage(language) {
    return apiService.httpAuth.post('/api/users/preferences/language', { language })
  }

  /**
   * 設定個人化偏好
   * @param {Object} personalization - 個人化設定物件
   * @returns {Promise} API 回應
   */
  async setPersonalization(personalization) {
    return apiService.httpAuth.post('/api/users/preferences/personalization', personalization)
  }

  /**
   * 設定搜尋偏好
   * @param {Object} searchPreferences - 搜尋偏好物件
   * @returns {Promise} API 回應
   */
  async setSearchPreferences(searchPreferences) {
    return apiService.httpAuth.post('/api/users/preferences/search', searchPreferences)
  }

  /**
   * 取得當前偏好設定
   * @returns {Promise} API 回應
   */
  async getPreferences() {
    return apiService.httpAuth.get('/api/users/preferences')
  }

  /**
   * 清除所有偏好設定
   * @returns {Promise} API 回應
   */
  async clearPreferences() {
    return apiService.httpAuth.delete('/api/users/preferences')
  }

  /**
   * 取得隱私設定狀態
   * @returns {Promise} API 回應
   */
  async getPrivacyStatus() {
    return apiService.httpAuth.get('/api/users/privacy-status')
  }

  /**
   * 更新所有偏好設定
   * @param {Object} preferences - 完整的偏好設定物件
   * @returns {Promise} API 回應
   */
  async updateAllPreferences(preferences) {
    const promises = []

    // 主題設定
    if (preferences.theme) {
      promises.push(this.setTheme(preferences.theme))
    }

    // 語言設定
    if (preferences.language) {
      promises.push(this.setLanguage(preferences.language))
    }

    // 個人化設定
    if (preferences.personalization) {
      promises.push(this.setPersonalization(preferences.personalization))
    }

    // 搜尋偏好
    if (preferences.searchPreferences) {
      promises.push(this.setSearchPreferences(preferences.searchPreferences))
    }

    // 並行執行所有設定更新
    return Promise.all(promises)
  }
}

export default new PreferencesService()
