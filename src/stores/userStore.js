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
      account.value = data.account
      cartTotal.value = data.cartTotal
      role.value = data.role

      // 重新整理頁面時，用 token 取得使用者資料
      // 這個回應不包含 token
      if (data.token) {
        token.value = data.token
      }
      if (data.userId) {
        userId.value = data.userId
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
      pick: ['token', 'userId'],
    },
  },
)
