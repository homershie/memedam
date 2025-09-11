import apiService from './apiService'

export default {
  // 建立贊助
  create(data) {
    return apiService.httpAuth.post('/api/sponsors', data)
  },

  // 取得公開贊助者資料（用於首頁顯示）
  getPublicSponsors(params = {}) {
    return apiService.http.get('/api/sponsors', { params })
  },

  // 取得指定贊助
  get(id) {
    return apiService.httpAuth.get(`/api/sponsors/${id}`)
  },

  // 更新贊助
  update(id, data) {
    return apiService.httpAuth.put(`/api/sponsors/${id}`, data)
  },

  // 刪除贊助
  remove(id) {
    return apiService.httpAuth.delete(`/api/sponsors/${id}`)
  },

  // 根據交易ID取得贊助資訊（無需認證）
  getByTransactionId(transactionId) {
    return apiService.http.get(`/api/sponsors/transaction/${transactionId}`)
  },

  // 獲取用戶最近一筆成功贊助（需要登入）
  getLatestSuccessSponsor() {
    return apiService.httpAuth.get('/api/sponsors/me/latest-success')
  },

  // 記錄贊助頁面訪問（無需認證）
  logPageAccess(data) {
    return apiService.http.post('/api/sponsors/log-access', data)
  },

  // 獲取支援的幣別列表（無需認證）
  getSupportedCurrencies() {
    return apiService.http.get('/api/sponsors/currencies/supported')
  },

  // 測試幣別轉換（無需認證）
  convertCurrency(data) {
    return apiService.http.post('/api/sponsors/currencies/convert', data)
  },

  // 獲取匯率快取統計資訊（管理員功能）
  getExchangeRateCacheStats() {
    return apiService.httpAuth.get(
      '/api/sponsors/currencies/exchange-rates/cache/stats',
    )
  },

  // 清除匯率快取（管理員功能）
  clearExchangeRateCache(params = {}) {
    return apiService.httpAuth.post(
      '/api/sponsors/currencies/exchange-rates/cache/clear',
      null,
      { params },
    )
  },

  // 更新匯率（管理員功能）
  updateExchangeRate(from, to, data) {
    return apiService.httpAuth.put(
      `/api/sponsors/currencies/exchange-rates/${from}/${to}`,
      data,
    )
  },
}
