// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const cartTotal = ref(0)
    const role = ref('user')
    const token = ref('')
    const userId = ref('')
    const username = ref('')
    const userProfile = ref(null)

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')
    const isManager = computed(() => ['manager', 'admin'].includes(role.value))

    const login = (data) => {
      console.log('用戶登入，接收資料:', {
        username: data.username,
        account: data.account,
        token: data.token ? data.token.substring(0, 20) + '...' : '無',
        userId: data.userId || data._id,
      })

      // 處理用戶資料
      if (data.username) {
        account.value = data.username
        username.value = data.username
      } else if (data.account) {
        account.value = data.account
        username.value = data.account
      }

      // 保存完整的用戶資料
      if (data.user) {
        userProfile.value = data.user
        username.value = data.user.username || username.value
        if (data.user._id && !userId.value) {
          userId.value = data.user._id
        }
      }

      cartTotal.value = data.cartTotal || 0
      role.value = data.role || 'user'

      // 處理 token 和 userId
      if (data.token) {
        token.value = data.token
        console.log('Token 已設置，長度:', data.token.length)
      }
      if (data.userId) {
        userId.value = data.userId
      } else if (data._id) {
        userId.value = data._id
      }

      console.log('登入完成，當前狀態:', {
        isLoggedIn: token.value.length > 0,
        account: account.value,
        username: username.value,
        userId: userId.value,
      })
    }

    const logout = () => {
      account.value = ''
      cartTotal.value = 0
      role.value = 'user'
      token.value = ''
      userId.value = ''
      username.value = ''
      userProfile.value = null
    }

    return {
      account,
      cartTotal,
      role,
      token,
      userId,
      username,
      userProfile,
      isLoggedIn,
      isAdmin,
      isManager,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['token', 'userId', 'role', 'username', 'userProfile'],
    },
  },
)
