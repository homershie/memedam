import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import userService from './userService'

// axios.create 建立一個有自己預設設定的 axios
// baseURL = http://localhost:4000
// api.post('/user')
// api.post('/user/login')
// baseURL = x
// axios.post('http://localhost:4000/user')
// axios.post('http://localhost:4000/user/login')
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// axios 攔截器
// 1. axios.get() axios.post()
// 2. 請求攔截器 interceptors.request
// 3. 送出
// 4. 回應攔截器 interceptors.response
// 5. await / .then() .catch()

// 在每個請求前，加入 token
// config = 請求設定值，路徑、資料等等
httpAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// .use(成功處理, 失敗處理)
httpAuth.interceptors.response.use(
  res => res,
  async error => {
    // 如果錯誤有回應，沒網路的話不會有回應
    if (
      error.response && // 如果是 400 錯誤，而且請求不是更新
      error.response.status === 400 &&
      error.response.data.message === 'token 已過期' &&
      error.config.url !== '/users/refresh'
    ) {
      const user = useUserStore()
      try {
        // 傳送更新請求
        const { data } = await userService.refresh()
        // 更新使用者資料
        user.token = data.token
        // 修改發生錯誤的請求設定，換成新的 token
        error.config.headers.Authorization = `Bearer ${data.token}`
        // 重新發送原本的請求
        return axios(error.config)
      } catch {
        // 如果更新失敗，清除 pinia 存的使用者 token 和資料
        user.logout()
      }
    }
    // 如果沒有回應，或是其他錯誤
    // 回傳原本的錯誤
    throw error
  }
)

export default { http, httpAuth }
