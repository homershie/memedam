<template>
  <div class="page-content">
    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 導航標籤 -->
      <div class="nav-tabs">
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          註冊
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登入
        </button>
      </div>

      <!-- 標題 -->
      <h1 class="page-title">
        {{ activeTab === 'register' ? '註冊' : '登入' }}
      </h1>

      <!-- 條款說明 -->
      <p class="terms-text" v-if="activeTab === 'register'">
        如果註冊，即表示你同意
        <a href="#" class="link">服務條款</a>和
        <a href="#" class="link">隱私政策</a>，包括
        <a href="#" class="link">Cookie 使用政策</a>。
      </p>

      <!-- 表單 -->
      <form @submit.prevent="onSubmit" class="form-container">
        <div class="form-field" v-if="activeTab === 'register'">
          <label class="field-label">使用者名稱*</label>
          <InputText
            v-model="formData.username"
            class="form-input"
            :class="{ 'p-invalid': errors.username }"
            placeholder="請輸入使用者名稱"
          />
          <small class="error-message" v-if="errors.username">{{
            errors.username
          }}</small>
        </div>

        <div class="form-field">
          <label class="field-label">{{
            activeTab === 'register' ? '電子信箱*' : '使用者名稱或電子信箱*'
          }}</label>
          <InputText
            v-model="formData.email"
            :type="activeTab === 'register' ? 'email' : 'text'"
            class="form-input"
            :class="{ 'p-invalid': errors.email }"
            :placeholder="
              activeTab === 'register'
                ? '請輸入電子信箱'
                : '請輸入使用者名稱或電子信箱'
            "
          />
          <small class="error-message" v-if="errors.email">{{
            errors.email
          }}</small>
        </div>

        <div class="form-field">
          <label class="field-label">密碼*</label>
          <Password
            v-model="formData.password"
            class="form-input"
            :class="{ 'p-invalid': errors.password }"
            placeholder="請輸入密碼"
            :feedback="false"
            toggleMask
          />
          <small class="error-message" v-if="errors.password">{{
            errors.password
          }}</small>
        </div>

        <!-- 新增確認密碼欄位（僅註冊時顯示） -->
        <div class="form-field" v-if="activeTab === 'register'">
          <label class="field-label">確認密碼*</label>
          <Password
            v-model="formData.confirmPassword"
            class="form-input"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="請再次輸入密碼"
            :feedback="false"
            toggleMask
          />
          <small class="error-message" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</small>
        </div>

        <Button
          type="submit"
          color="primary"
          class="btn-block"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ activeTab === 'register' ? '註冊' : '登入' }}
        </Button>
      </form>

      <!-- 社交媒體登入 -->
      <div class="social-login">
        <div class="social-buttons">
          <button class="social-button">
            <i class="pi pi-google"></i>
          </button>
          <button class="social-button">
            <i class="pi pi-facebook"></i>
          </button>
          <button class="social-button">
            <i class="pi pi-twitter"></i>
          </button>
          <button class="social-button">
            <i class="pi pi-discord"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- 版權聲明 -->
    <div class="copyright">© 2025 迷因典 MemeDex</div>
  </div>
</template>

<script setup>
// 組件名稱修正為多字

defineOptions({ name: 'LoginPage' })

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const user = useUserStore()
const toast = useToast()

// 響應式數據
const activeTab = ref('register')
const isSubmitting = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 驗證函數
const validateForm = () => {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (activeTab.value === 'register') {
    // 使用者名稱驗證
    if (!formData.username.trim()) {
      errors.username = '使用者名稱必填'
    } else if (formData.username.length < 8) {
      errors.username = '使用者名稱至少8個字元'
    } else if (formData.username.length > 20) {
      errors.username = '使用者名稱最多20個字元'
    } else if (!/^[A-Za-z0-9]+$/.test(formData.username)) {
      errors.username = '使用者名稱只能包含英文字母和數字'
    }
  }

  // 電子信箱/帳號驗證
  if (!formData.email.trim()) {
    errors.email =
      activeTab.value === 'register'
        ? '電子信箱必填'
        : '請輸入使用者名稱或電子信箱'
  } else if (
    activeTab.value === 'register' &&
    !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(
      formData.email,
    )
  ) {
    errors.email = '請輸入有效的電子信箱'
  }

  // 密碼驗證
  if (!formData.password) {
    errors.password = '密碼必填'
  } else if (formData.password.length < 8) {
    errors.password = '密碼至少8個字元'
  } else if (formData.password.length > 20) {
    errors.password = '密碼最多20個字元'
  }

  // 註冊時確認密碼
  if (activeTab.value === 'register') {
    if (!formData.confirmPassword) {
      errors.confirmPassword = '請再次輸入密碼'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '兩次密碼輸入不一致'
    }
  }

  return (
    !errors.username &&
    !errors.email &&
    !errors.password &&
    (activeTab.value !== 'register' || !errors.confirmPassword)
  )
}

// 提交表單
const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    if (activeTab.value === 'register') {
      // 註冊邏輯
      await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      toast.add({
        severity: 'success',
        summary: '註冊成功',
        detail: '歡迎加入 MemeDex！',
        life: 3000,
      })

      // 註冊成功後切換到登入
      activeTab.value = 'login'
      formData.username = ''
      formData.email = ''
      formData.password = ''
      formData.confirmPassword = ''
    } else {
      // 登入邏輯
      const { data } = await userService.login({
        login: formData.email, // 支援帳號或信箱
        password: formData.password,
      })

      console.log('登入API回傳:', data)
      user.login({
        ...data.user,
        token: data.token,
        userId: data.userId || data.user?._id, // 兩種都支援
      })

      toast.add({
        severity: 'success',
        summary: '登入成功',
        detail: '歡迎回來！',
        life: 3000,
      })

      router.push('/')
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: error?.response?.data?.message || '請稍後再試',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.page-content {
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
}

.main-content {
  width: 100%;
}

.nav-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.nav-tab {
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-tab.active {
  color: #000;
  font-weight: bold;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 1rem;
}

.terms-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.link {
  color: #000;
  text-decoration: underline;
}

.form-container {
  margin-bottom: 2rem;
}

.form-field {
  margin-bottom: 1.5rem;
  text-align: left;
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #000;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #000;
}

.form-input.p-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.social-login {
  margin-top: 2rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-button {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  border-color: #000;
  background-color: #f8f9fa;
}

.social-button i {
  font-size: 1.2rem;
  color: #000;
}

.copyright {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.btn-block {
  width: 100%;
}

:deep(.p-password-input) {
  width: 90%;
}

:deep(.p-password-input) {
  padding: 0.1rem;
  border: none;
}

:deep(.p-password-input:focus) {
  outline: none;
}

:deep(.p-password.p-invalid .p-password-input) {
  border-color: #dc3545;
}
</style>

<route lang="yaml">
meta:
  title: '登入'
  admin: false
  layout: 'full'
</route>
