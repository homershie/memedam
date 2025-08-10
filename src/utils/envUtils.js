/**
 * 環境工具函數
 * 用於檢查和管理不同環境的設定
 */

// 檢查是否為開發環境
export const isDevelopment = () => {
  return (
    import.meta.env.DEV ||
    import.meta.env.MODE === 'development' ||
    import.meta.env.NODE_ENV === 'development'
  )
}

// 檢查是否為生產環境
export const isProduction = () => {
  return (
    import.meta.env.PROD ||
    import.meta.env.MODE === 'production' ||
    import.meta.env.NODE_ENV === 'production'
  )
}

// 取得 API URL
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || ''
}

// 取得應用程式標題
export const getAppTitle = () => {
  return import.meta.env.VITE_APP_TITLE || '迷因典 MemeDam'
}

// 取得應用程式版本
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}

// 檢查是否啟用調試模式
export const isDebugMode = () => {
  return isDevelopment() || import.meta.env.VITE_DEBUG === 'true'
}

// 取得環境資訊
export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    apiUrl: getApiUrl(),
    appTitle: getAppTitle(),
    appVersion: getAppVersion(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isDebug: isDebugMode(),
  }
}
