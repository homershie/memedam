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
  const baseUrl = import.meta.env.VITE_API_URL || 'http://api.memedam.com'
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
      title: '無效請求錯誤 (Google OAuth 2.0 政策問題)',
      description: '請求格式不正確或不符合 Google OAuth 2.0 政策要求',
      solutions: [
        '檢查 client_id 是否正確',
        '確認 redirect_uri 在授權列表中',
        '驗證 response_type 參數',
        '確保 scope 參數格式正確',
        '檢查應用程式是否已通過 Google 驗證',
        '確認 OAuth 同意畫面的設定',
        '檢查應用程式類型（內部/外部）設定',
      ],
      googlePolicyCheck: [
        '確保只請求必要的 scopes（openid, email, profile）',
        '檢查應用程式是否在 Google Cloud Console 中正確配置',
        '確認 OAuth 同意畫面的隱私政策和使用條款已設定',
        '檢查應用程式是否已提交驗證申請（外部應用程式需要）',
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
        '確認 URI 完全匹配，包括結尾的斜線',
      ],
    },
    access_denied: {
      title: '存取被拒絕',
      description: '用戶拒絕了授權請求或應用程式不符合 Google 政策',
      solutions: [
        '用戶需要重新授權',
        '檢查 OAuth 同意畫面的設定',
        '確認應用程式狀態是否為「已驗證」',
        '檢查應用程式是否在測試用戶列表中',
      ],
    },
    unauthorized_client: {
      title: '未授權的客戶端',
      description: 'client_id 無效或應用程式未正確配置',
      solutions: [
        '檢查 client_id 是否正確',
        '確認應用程式是否已啟用',
        '檢查 API 是否已啟用',
        '確認 OAuth 2.0 憑證是否正確',
      ],
    },
    invalid_client: {
      title: '無效的客戶端',
      description: 'client_id 或 client_secret 無效',
      solutions: [
        '檢查 client_id 和 client_secret 是否正確',
        '確認憑證是否已過期',
        '檢查憑證類型是否為「網頁應用程式」',
        '確認憑證狀態是否為「已啟用」',
      ],
    },
  }

  // 特殊處理 Google OAuth 2.0 政策錯誤
  if (
    errorCode === 'invalid_request' &&
    errorMessage.includes("doesn't comply with Google's OAuth 2.0 policy")
  ) {
    return {
      title: 'Google OAuth 2.0 政策不合規',
      description: '應用程式不符合 Google OAuth 2.0 安全政策要求',
      solutions: [
        '確保應用程式類型設定正確（內部/外部）',
        '檢查 OAuth 同意畫面的必要資訊是否完整',
        '確認隱私政策和使用條款 URL 已設定',
        '檢查應用程式是否已提交 Google 驗證申請',
        '確保只請求必要的 scopes，避免敏感權限',
        '檢查應用程式是否在測試用戶列表中（外部應用程式）',
      ],
      immediateActions: [
        '1. 登入 Google Cloud Console',
        '2. 檢查 OAuth 同意畫面設定',
        '3. 確認應用程式類型（建議改為「內部」進行測試）',
        '4. 添加測試用戶（如果是外部應用程式）',
        '5. 檢查重定向 URI 設定',
      ],
      googlePolicyRequirements: [
        '應用程式必須有明確的隱私政策',
        '應用程式必須有使用條款',
        'OAuth 同意畫面必須包含應用程式描述',
        '外部應用程式需要 Google 驗證',
        '只能請求必要的用戶資料',
      ],
    }
  }

  return (
    diagnoses[errorCode] || {
      title: '未知錯誤',
      description: errorMessage || '發生未知的 OAuth 錯誤',
      solutions: [
        '檢查瀏覽器控制台的詳細錯誤信息',
        '確認 Google OAuth 配置是否正確',
        '查看 Google API Console 的錯誤日誌',
        '檢查網路連線和防火牆設定',
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

// Google OAuth 配置檢查清單
export const getGoogleOAuthChecklist = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://api.memedam.com'
  const frontendUrl = window.location.origin
  const isLocalhost = window.location.hostname === 'localhost'

  return {
    title: 'Google OAuth 2.0 配置檢查清單',
    description: '請按照以下步驟檢查和修正 Google OAuth 配置',
    steps: [
      {
        step: 1,
        title: 'Google Cloud Console 基本設定',
        items: [
          '確認 Google Cloud Console 專案已建立',
          '檢查 Google+ API 或 Google Identity API 已啟用',
          '確認 OAuth 2.0 憑證類型為「網頁應用程式」',
          '檢查憑證狀態為「已啟用」',
        ],
        urls: [
          'https://console.cloud.google.com/apis/credentials',
          'https://console.cloud.google.com/apis/library',
        ],
      },
      {
        step: 2,
        title: 'OAuth 同意畫面設定',
        items: [
          '設定應用程式名稱',
          '添加應用程式描述',
          '設定隱私政策 URL（必需）',
          '設定使用條款 URL（必需）',
          '添加應用程式圖示',
          '設定應用程式類型（內部/外部）',
        ],
        urls: ['https://console.cloud.google.com/apis/credentials/consent'],
        notes: [
          '外部應用程式需要 Google 驗證',
          '內部應用程式僅限於組織內使用',
          '開發階段建議使用內部應用程式',
        ],
      },
      {
        step: 3,
        title: '重定向 URI 設定',
        items: [
          '添加後端回調 URI',
          '添加前端 URI',
          '確認 URI 格式正確',
          '檢查協議和端口號',
        ],
        requiredUris: [
          `${baseUrl}/api/users/auth/google/callback`,
          `${baseUrl}/api/users/bind-auth/google/callback`,
          frontendUrl,
          `${frontendUrl}/`,
          `${frontendUrl}/oauth-callback`,
          `${frontendUrl}/settings`,
        ],
        developmentUris: isLocalhost
          ? [
              'http://localhost:5173',
              'http://localhost:5173/',
              'http://localhost:5173/oauth-callback',
              'http://localhost:5173/settings',
            ]
          : [],
        urls: ['https://console.cloud.google.com/apis/credentials'],
      },
      {
        step: 4,
        title: '測試用戶設定（外部應用程式）',
        items: [
          '添加測試用戶電子信箱',
          '確認測試用戶已接受邀請',
          '檢查應用程式是否在測試模式',
        ],
        urls: ['https://console.cloud.google.com/apis/credentials/consent'],
        notes: [
          '僅適用於外部應用程式',
          '內部應用程式不需要測試用戶',
          '測試用戶數量限制為 100 個',
        ],
      },
      {
        step: 5,
        title: '環境變數檢查',
        items: [
          '確認 GOOGLE_CLIENT_ID 已設定',
          '確認 GOOGLE_CLIENT_SECRET 已設定',
          '確認 GOOGLE_REDIRECT_URI 已設定',
          '確認 GOOGLE_BIND_REDIRECT_URI 已設定',
        ],
        exampleEnv: {
          GOOGLE_CLIENT_ID: 'your-google-client-id.apps.googleusercontent.com',
          GOOGLE_CLIENT_SECRET: 'your-google-client-secret',
          GOOGLE_REDIRECT_URI: `${baseUrl}/api/users/auth/google/callback`,
          GOOGLE_BIND_REDIRECT_URI: `${baseUrl}/api/users/bind-auth/google/callback`,
        },
      },
      {
        step: 6,
        title: 'Scopes 設定檢查',
        items: [
          '確認只使用必要的 scopes',
          '檢查 scopes 格式正確',
          '避免使用敏感或受限的 scopes',
        ],
        recommendedScopes: ['openid', 'email', 'profile'],
        restrictedScopes: [
          'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/drive',
        ],
        notes: [
          '最小化 scopes 有助於通過 Google 驗證',
          '避免請求不必要的用戶資料',
          '確保 scopes 與應用程式功能相符',
        ],
      },
      {
        step: 7,
        title: '常見問題排查',
        items: [
          '檢查網路連線和防火牆設定',
          '確認瀏覽器允許彈出視窗',
          '檢查瀏覽器控制台錯誤訊息',
          '驗證 API 端點是否正常運作',
        ],
        troubleshooting: {
          invalid_request: '檢查 client_id 和 redirect_uri',
          redirect_uri_mismatch: '確認重定向 URI 完全匹配',
          access_denied: '檢查應用程式驗證狀態',
          unauthorized_client: '確認憑證配置正確',
        },
      },
    ],
    recommendations: [
      '開發階段建議使用內部應用程式類型',
      '確保所有重定向 URI 都已正確設定',
      '定期檢查 Google Cloud Console 的錯誤日誌',
      '使用 OAuth 調試工具進行測試',
    ],
  }
}
