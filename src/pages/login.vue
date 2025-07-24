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
          <label class="field-label">姓名*</label>
          <InputText
            v-model="formData.name"
            class="form-input"
            :class="{ 'p-invalid': errors.name }"
            placeholder="請輸入姓名"
          />
          <small class="error-message" v-if="errors.name">{{
            errors.name
          }}</small>
        </div>

        <div class="form-field">
          <label class="field-label">電子信箱*</label>
          <InputText
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ 'p-invalid': errors.email }"
            placeholder="請輸入電子信箱"
          />
          <small class="error-message" v-if="errors.email">{{
            errors.email
          }}</small>
        </div>

        <div class="form-field">
          <label class="field-label">密碼*</label>
          <InputText
            v-model="formData.password"
            class="form-input"
            :class="{ 'p-invalid': errors.password }"
            placeholder="請輸入密碼"
            type="password"
          />
          <small class="error-message" v-if="errors.password">{{
            errors.password
          }}</small>
        </div>

        <!-- 新增確認密碼欄位（僅註冊時顯示） -->
        <div class="form-field" v-if="activeTab === 'register'">
          <label class="field-label">確認密碼*</label>
          <InputText
            v-model="formData.confirmPassword"
            class="form-input"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="請再次輸入密碼"
            type="password"
          />
          <small class="error-message" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</small>
        </div>

        <Button
          type="submit"
          class="submit-button"
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
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import userService from '@/services/userService'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const toast = useToast()
const user = useUserStore()

// 響應式數據
const activeTab = ref('register')
const isSubmitting = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 驗證函數
const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (activeTab.value === 'register' && !formData.name.trim()) {
    errors.name = '姓名必填'
  }

  if (!formData.email.trim()) {
    errors.email = '電子信箱必填'
  } else if (!/^[^\s@]+@[^"]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '請輸入有效的電子信箱'
  }

  if (!formData.password) {
    errors.password = '密碼必填'
  } else if (formData.password.length < 4) {
    errors.password = '密碼至少4個字元'
  } else if (formData.password.length > 20) {
    errors.password = '密碼最多20個字元'
  }

  if (activeTab.value === 'register') {
    if (!formData.confirmPassword) {
      errors.confirmPassword = '請再次輸入密碼'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '兩次密碼輸入不一致'
    }
  }

  return (
    !errors.name &&
    !errors.email &&
    !errors.password &&
    (!activeTab.value === 'register' || !errors.confirmPassword)
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
      await userService.register({
        name: formData.name,
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
      formData.name = ''
      formData.email = ''
      formData.password = ''
      formData.confirmPassword = ''
    } else {
      // 登入邏輯
      const { data } = await userService.login({
        account: formData.email,
        password: formData.password,
      })

      user.login({ ...data.user, token: data.token })

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

.submit-button {
  width: 100%;
  background-color: #000 !important;
  border-color: #000 !important;
  color: #fff !important;
  padding: 0.75rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  border-radius: 4px !important;
  transition: background-color 0.3s ease !important;
}

.submit-button:hover {
  background-color: #333 !important;
}

.submit-button:disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
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
</style>

<route lang="yaml">
meta:
  title: '登入'
  admin: false
  layout: 'full'
</route>
