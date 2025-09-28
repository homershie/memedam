import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import userService from './userService'

// 獲取 API 基礎 URL
const getApiBaseUrl = () => {
  // 生產環境使用定義的常量，開發環境使用環境變數
  if (import.meta.env.PROD && window.__VITE_API_URL__) {
    return window.__VITE_API_URL__
  }
  return import.meta.env.VITE_API_URL || 'http://api.memedam.com'
}

// 獲取完整的 API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}${endpoint}`
}

// axios.create 建立一個有自己預設設定的 axios
const http = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})

const httpAuth = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})

// axios 攔截器
// 1. axios.get() axios.post()
// 2. 請求攔截器 interceptors.request
// 3. 送出
// 4. 回應攔截器 interceptors.response
// 5. await / .then() .catch()

// 在每個請求前，加入 token
// config = 請求設定值，路徑、資料等等
httpAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// .use(成功處理, 失敗處理)
httpAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    const user = useUserStore()
    const msg = error?.response?.data?.message
    const status = error?.response?.status
    const isTokenIssue =
      msg === 'token 已過期' ||
      msg === '無效的 token' ||
      msg === 'Token is invalid' ||
      msg === 'Token expired'

    // 優先針對 401 未授權觸發 refresh，其次相容舊有 400
    if (
      error.response &&
      (status === 401 || (status === 400 && isTokenIssue)) &&
      error.config.url !== '/api/users/refresh'
    ) {
      try {
        const { data } = await userService.refresh()
        user.token = data.token
        error.config.headers.Authorization = `Bearer ${data.token}`
        return axios(error.config)
      } catch {
        user.logout()
      }
    }

    throw error
  },
)

export default { http, httpAuth }
