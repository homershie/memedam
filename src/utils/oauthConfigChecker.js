/**
 * OAuth 配置檢查工具
 * 用於診斷和修復 Google OAuth 配置問題
 */

// OAuth 配置檢查
export const checkOAuthConfig = () => {
  const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    frontendUrl: window.location.origin,
    isLocalhost: window.location.hostname === 'localhost',
    isHttps: window.location.protocol === 'https:',
    currentPath: window.location.pathname,
    searchParams: window.location.search,
  }

  console.log('OAuth 配置檢查結果:', config)

  // 檢查常見問題
  const issues = []

  // 1. 檢查 API URL 配置
  if (!config.apiUrl) {
    issues.push({
      type: 'error',
      message: 'VITE_API_URL 環境變數未設定',
      solution: '在 .env 檔案中設定 VITE_API_URL=http://localhost:4000',
    })
  }

  // 2. 檢查是否為 localhost
  if (!config.isLocalhost) {
    issues.push({
      type: 'warning',
      message: '非 localhost 環境，可能需要額外的 OAuth 配置',
      solution: '確保 Google OAuth 重定向 URI 包含生產環境網址',
    })
  }

  // 3. 檢查 HTTPS
  if (!config.isHttps && !config.isLocalhost) {
    issues.push({
      type: 'error',
      message: '非 HTTPS 環境，Google OAuth 可能無法正常工作',
      solution: '使用 HTTPS 或確保在 localhost 環境中測試',
    })
  }

  return {
    config,
    issues,
    hasErrors: issues.some((issue) => issue.type === 'error'),
    hasWarnings: issues.some((issue) => issue.type === 'warning'),
  }
}

// 生成正確的重定向 URI 列表
export const getRequiredRedirectUris = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const frontendUrl = window.location.origin

  return [
    // 後端回調 URI
    `${baseUrl}/api/users/auth/google/callback`,
    `${baseUrl}/api/users/bind-auth/google/callback`,

    // 前端 URI
    frontendUrl,
    `${frontendUrl}/`,
    `${frontendUrl}/oauth-callback`,
    `${frontendUrl}/settings`,

    // 開發環境特殊 URI
    'http://localhost:5173',
    'http://localhost:5173/',
    'http://localhost:5173/oauth-callback',
    'http://localhost:5173/settings',
  ]
}

// 檢查當前 URL 是否在授權的重定向 URI 列表中
export const checkCurrentUrlInRedirectUris = () => {
  const currentUrl = window.location.href.split('?')[0] // 移除查詢參數
  const requiredUris = getRequiredRedirectUris()

  const isAuthorized = requiredUris.some(
    (uri) => currentUrl.startsWith(uri) || uri.startsWith(currentUrl),
  )

  return {
    currentUrl,
    requiredUris,
    isAuthorized,
    missingUris: requiredUris.filter((uri) => !currentUrl.startsWith(uri)),
  }
}

// 生成 Google OAuth 配置指南
export const generateOAuthConfigGuide = () => {
  const redirectUris = getRequiredRedirectUris()

  return {
    title: 'Google OAuth 配置指南',
    steps: [
      {
        step: 1,
        title: '前往 Google API Console',
        description: '訪問 https://console.cloud.google.com/ 並選擇您的專案',
      },
      {
        step: 2,
        title: '配置 OAuth 同意畫面',
        description: '在左側選單中點擊「OAuth 同意畫面」並填寫必要資訊',
      },
      {
        step: 3,
        title: '設定重定向 URI',
        description:
          '在「憑證」頁面中，為您的 OAuth 2.0 用戶端 ID 添加以下重定向 URI：',
        uris: redirectUris,
      },
      {
        step: 4,
        title: '驗證應用程式',
        description: '如果選擇「外部」使用者類型，需要提交 Google 驗證申請',
      },
    ],
    redirectUris,
  }
}

// 診斷 OAuth 錯誤
export const diagnoseOAuthError = (error) => {
  const errorCode = error?.error || error?.error_code || ''
  const errorMessage = error?.error_description || error?.message || ''

  const diagnoses = {
    invalid_request: {
      title: '無效請求錯誤',
      description: '請求格式不正確或缺少必要參數',
      solutions: [
        '檢查 client_id 是否正確',
        '確認 redirect_uri 在授權列表中',
        '驗證 response_type 參數',
        '確保 scope 參數格式正確',
      ],
    },
    redirect_uri_mismatch: {
      title: '重定向 URI 不匹配',
      description: '請求中的重定向 URI 與 Google Console 中設定的不符',
      solutions: [
        '檢查 Google Console 中的重定向 URI 設定',
        '確保包含所有必要的 URI',
        '注意 URI 的協議（http/https）',
        '檢查端口號是否正確',
      ],
    },
    access_denied: {
      title: '存取被拒絕',
      description: '用戶拒絕了授權請求',
      solutions: [
        '用戶需要重新授權',
        '檢查 OAuth 同意畫面的設定',
        '確認應用程式狀態是否為「已驗證」',
      ],
    },
    unauthorized_client: {
      title: '未授權的客戶端',
      description: 'client_id 無效或應用程式未正確配置',
      solutions: [
        '檢查 client_id 是否正確',
        '確認應用程式是否已啟用',
        '檢查 API 是否已啟用',
      ],
    },
  }

  return (
    diagnoses[errorCode] || {
      title: '未知錯誤',
      description: errorMessage || '發生未知的 OAuth 錯誤',
      solutions: [
        '檢查瀏覽器控制台的詳細錯誤信息',
        '確認 Google OAuth 配置是否正確',
        '查看 Google API Console 的錯誤日誌',
      ],
    }
  )
}

// 測試 OAuth 配置
export const testOAuthConfig = async () => {
  const config = checkOAuthConfig()
  const redirectCheck = checkCurrentUrlInRedirectUris()
  const guide = generateOAuthConfigGuide()

  console.log('=== OAuth 配置測試結果 ===')
  console.log('配置檢查:', config)
  console.log('重定向 URI 檢查:', redirectCheck)
  console.log('配置指南:', guide)

  return {
    config,
    redirectCheck,
    guide,
    summary: {
      hasErrors: config.hasErrors,
      hasWarnings: config.hasWarnings,
      isRedirectUriValid: redirectCheck.isAuthorized,
      recommendations: [],
    },
  }
}
