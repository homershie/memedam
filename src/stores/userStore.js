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

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      // 處理用戶資料
      if (data.username) {
        account.value = data.username
      } else if (data.account) {
        account.value = data.account
      }

      cartTotal.value = data.cartTotal || 0
      role.value = data.role || 'user'

      // 處理 token 和 userId
      if (data.token) {
        token.value = data.token
      }
      if (data.userId) {
        userId.value = data.userId
      } else if (data._id) {
        userId.value = data._id
      }
    }

    const logout = () => {
      account.value = ''
      cartTotal.value = 0
      role.value = 'user'
      token.value = ''
      userId.value = ''
    }

    return {
      account,
      cartTotal,
      role,
      token,
      userId,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'user',
      pick: ['token', 'userId', 'role'],
    },
  },
)
