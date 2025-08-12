# 密碼管理工具優化指南

## 概述

本文檔說明我們對登入頁面所做的優化，以提升與 Google Password Manager、NordPass、1Password 等密碼管理工具的相容性。

## 主要改進

### 1. 預設頁面設定

- **變更**: 將預設顯示的表單從「註冊」改為「登入」
- **影響**: 用戶進入頁面時直接看到登入表單，符合大多數用戶的使用習慣

### 2. 表單結構優化

#### 語義化 HTML 結構

```html
<form
  @submit.prevent="onSubmit"
  class="space-y-6 mb-8"
  :data-form-type="activeTab"
  data-testid="login-form"
  autocomplete="on"
></form>
```

#### 明確的標籤關聯

```html
<label for="username" class="block text-sm font-medium"> 使用者名稱* </label>
<InputText
  id="username"
  name="username"
  type="text"
  autocomplete="username"
  required
/>
```

### 3. Autocomplete 屬性優化

#### 登入表單

- 帳號欄位: `autocomplete="username"`
- 密碼欄位: `autocomplete="current-password"`

#### 註冊表單

- 使用者名稱: `autocomplete="username"`
- 電子信箱: `autocomplete="email"`
- 密碼: `autocomplete="new-password"`
- 確認密碼: `autocomplete="new-password"`

### 4. 無障礙支援 (ARIA)

#### 錯誤處理

```html
<InputText aria-describedby="username-error" aria-invalid="false" />
<small
  id="username-error"
  class="text-red-500 text-xs"
  v-if="errors.username"
  role="alert"
>
  {{ errors.username }}
</small>
```

#### 動態 ARIA 屬性更新

- 根據表單驗證狀態動態更新 `aria-invalid` 屬性
- 提供 `aria-describedby` 關聯錯誤訊息
- 添加 `role="alert"` 給錯誤訊息

### 5. 表單識別屬性

#### Data 屬性

- `data-form-type`: 標識當前表單類型 (login/register)
- `data-testid`: 用於測試和自動化工具識別

#### 按鈕標識

```html
<button
  type="submit"
  data-testid="submit-button"
  :aria-label="activeTab === 'register' ? '註冊帳號' : '登入帳號'"
></button>
```

### 6. 社交登入按鈕優化

```html
<button
  type="button"
  aria-label="使用 Google 登入"
  @click="handleSocialLogin('google')"
></button>
```

## 技術實現

### 1. 響應式狀態管理

```javascript
// 預設顯示登入表單
const activeTab = ref('login')

// 表單數據
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
```

### 2. 動態屬性綁定

```javascript
// 根據表單類型動態設定屬性
:autocomplete="activeTab === 'register' ? 'email' : 'username'"
:name="activeTab === 'register' ? 'email' : 'login'"
:type="activeTab === 'register' ? 'email' : 'text'"
```

### 3. 錯誤狀態監聽

```javascript
// 監聽錯誤變化，更新 ARIA 屬性
watch(
  () => errors,
  (newErrors) => {
    const inputs = document.querySelectorAll('input, .p-password-input')
    inputs.forEach((input) => {
      const fieldName = input.name || input.id
      if (fieldName && newErrors[fieldName]) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.setAttribute('aria-invalid', 'false')
      }
    })
  },
  { deep: true },
)
```

### 4. 表單切換處理

```javascript
const handleTabChange = (newTab) => {
  activeTab.value = newTab

  // 重置錯誤狀態
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // 更新表單屬性
  const form = document.querySelector('form[data-testid="login-form"]')
  if (form) {
    form.setAttribute('data-form-type', newTab)
  }
}
```

## 測試建議

### 1. 密碼管理工具測試

#### Google Password Manager

- 測試自動填入功能
- 驗證密碼儲存提示
- 檢查表單識別準確性

#### NordPass

- 測試自動填入
- 驗證密碼生成功能
- 檢查表單欄位識別

#### 1Password

- 測試自動填入
- 驗證密碼儲存
- 檢查表單結構識別

### 2. 無障礙測試

#### 螢幕閱讀器

- 測試標籤關聯
- 驗證錯誤訊息朗讀
- 檢查表單導航

#### 鍵盤導航

- 測試 Tab 鍵導航
- 驗證 Enter 鍵提交
- 檢查焦點指示器

### 3. 自動化測試

```javascript
// 使用 data-testid 進行測試
cy.get('[data-testid="login-form"]').should('be.visible')
cy.get('[data-testid="username-input"]').type('testuser')
cy.get('[data-testid="password-input"]').type('testpass')
cy.get('[data-testid="submit-button"]').click()
```

## 相容性清單

### 支援的密碼管理工具

- ✅ Google Password Manager
- ✅ NordPass
- ✅ 1Password
- ✅ LastPass
- ✅ Bitwarden
- ✅ Dashlane
- ✅ KeePass
- ✅ Firefox Lockwise
- ✅ Safari Keychain

### 支援的瀏覽器

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## 未來改進

### 1. 進階功能

- [ ] 支援 Passkey (WebAuthn)
- [ ] 生物識別登入
- [ ] 雙因素認證整合

### 2. 使用者體驗

- [ ] 密碼強度指示器
- [ ] 自動登入選項
- [ ] 記住登入狀態

### 3. 安全性

- [ ] 密碼洩露檢查
- [ ] 登入嘗試限制
- [ ] 異常登入偵測

## 參考資源

- [HTML Living Standard - Autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
- [MDN - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Password Manager Best Practices](https://www.w3.org/WAI/WCAG21/Techniques/html/H98)
