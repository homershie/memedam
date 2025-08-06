<template>
  <div class="settings-container">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">設定</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        管理您的帳號設定和個人偏好
      </p>
    </div>

    <!-- 設定區塊容器 -->
    <div class="settings-grid">
      <!-- 左側導航 -->
      <div class="settings-nav">
        <div class="settings-nav-card">
          <nav class="space-y-2">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors duration-200',
                activeSection === section.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
              ]"
            >
              <div class="flex items-center space-x-3">
                <i :class="section.icon" class="text-lg"></i>
                <span class="font-medium">{{ section.title }}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- 右側內容區域 -->
      <div class="settings-content">
        <div class="settings-card">
          <!-- 帳號管理 -->
          <div v-if="activeSection === 'account'" class="space-y-8">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                帳號管理
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                管理您的帳號安全設定
              </p>
            </div>

            <!-- 密碼變更 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                密碼變更
              </h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      目前密碼
                    </label>
                    <Password
                      v-model="passwordForm.currentPassword"
                      :feedback="false"
                      toggleMask
                      placeholder="輸入目前密碼"
                      class="w-full"
                      :class="{
                        'p-invalid': passwordForm.errors.currentPassword,
                      }"
                    />
                    <small
                      v-if="passwordForm.errors.currentPassword"
                      class="p-error"
                    >
                      {{ passwordForm.errors.currentPassword }}
                    </small>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      新密碼
                    </label>
                    <Password
                      v-model="passwordForm.newPassword"
                      :feedback="true"
                      toggleMask
                      placeholder="輸入新密碼"
                      class="w-full"
                      :class="{ 'p-invalid': passwordForm.errors.newPassword }"
                    />
                    <small
                      v-if="passwordForm.errors.newPassword"
                      class="p-error"
                    >
                      {{ passwordForm.errors.newPassword }}
                    </small>
                  </div>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    確認新密碼
                  </label>
                  <Password
                    v-model="passwordForm.confirmPassword"
                    :feedback="false"
                    toggleMask
                    placeholder="再次輸入新密碼"
                    class="w-full"
                    :class="{
                      'p-invalid': passwordForm.errors.confirmPassword,
                    }"
                  />
                  <small
                    v-if="passwordForm.errors.confirmPassword"
                    class="p-error"
                  >
                    {{ passwordForm.errors.confirmPassword }}
                  </small>
                </div>
                <div class="flex justify-end">
                  <Button
                    type="submit"
                    label="變更密碼"
                    icon="pi pi-key"
                    :loading="passwordForm.loading"
                    class="btn-primary"
                  />
                </div>
              </form>
            </div>

            <!-- 電子信箱管理 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                電子信箱管理
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ userProfile.email }}
                    </p>
                    <div class="flex items-center space-x-2 mt-1">
                      <i class="pi pi-check-circle text-success-500"></i>
                      <span
                        class="text-sm text-success-600 dark:text-success-400"
                        >已驗證</span
                      >
                    </div>
                  </div>
                  <Button
                    label="變更信箱"
                    icon="pi pi-pencil"
                    severity="secondary"
                    @click="showEmailDialog = true"
                    class="btn-secondary"
                  />
                </div>
              </div>
            </div>

            <!-- 兩步驟驗證 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                兩步驟驗證
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Google Authenticator
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      使用 Google Authenticator 應用程式進行兩步驟驗證
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full"
                    >
                      Beta
                    </span>
                    <Button
                      label="設定"
                      icon="pi pi-shield"
                      severity="secondary"
                      disabled
                      class="btn-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 社群帳號綁定 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                社群帳號綁定
              </h3>
              <div class="space-y-3">
                <div
                  v-for="account in socialAccounts"
                  :key="account.platform"
                  class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <i :class="account.icon" class="text-xl"></i>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ account.name }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ account.email }}
                      </p>
                    </div>
                  </div>
                  <Button
                    :label="account.connected ? '解除綁定' : '綁定帳號'"
                    :icon="account.connected ? 'pi pi-unlink' : 'pi pi-link'"
                    :severity="account.connected ? 'danger' : 'success'"
                    @click="toggleSocialAccount(account)"
                    class="btn-action"
                  />
                </div>
              </div>
            </div>

            <!-- 刪除帳號 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                刪除帳號
              </h3>
              <div
                class="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700 rounded-lg p-4"
              >
                <div class="flex items-start space-x-3">
                  <i
                    class="pi pi-exclamation-triangle text-danger-500 mt-1"
                  ></i>
                  <div class="flex-1">
                    <p
                      class="text-sm font-medium text-danger-800 dark:text-danger-200"
                    >
                      此操作不可恢復
                    </p>
                    <p
                      class="text-sm text-danger-700 dark:text-danger-300 mt-1"
                    >
                      刪除帳號後，所有資料將永久移除且無法復原。
                    </p>
                    <Button
                      label="刪除帳號"
                      icon="pi pi-trash"
                      severity="danger"
                      @click="showDeleteDialog = true"
                      class="mt-3 btn-danger"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 個人資訊 -->
          <div v-if="activeSection === 'profile'" class="space-y-8">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                個人資訊
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                編輯您的個人資料
              </p>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- 頭像 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  頭像
                </h3>
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img
                      :src="userProfile.avatar || '/default-avatar.png'"
                      alt="頭像"
                      class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <Button
                      icon="pi pi-camera"
                      severity="secondary"
                      size="small"
                      class="absolute -bottom-1 -right-1 w-8 h-8"
                      @click="$refs.avatarInput.click()"
                    />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      支援 JPG、PNG 格式，最大 2MB
                    </p>
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarChange"
                    />
                  </div>
                </div>
              </div>

              <!-- 基本資訊 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    顯示名稱
                  </label>
                  <InputText
                    v-model="userProfile.displayName"
                    placeholder="輸入顯示名稱"
                    class="w-full"
                    :class="{ 'p-invalid': profileForm.errors.displayName }"
                  />
                  <small v-if="profileForm.errors.displayName" class="p-error">
                    {{ profileForm.errors.displayName }}
                  </small>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    性別
                  </label>
                  <Dropdown
                    v-model="userProfile.gender"
                    :options="genderOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="選擇性別"
                    class="w-full"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    生日
                  </label>
                  <Calendar
                    v-model="userProfile.birthday"
                    dateFormat="yy-mm-dd"
                    placeholder="選擇生日"
                    class="w-full"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    生日隱私設定
                  </label>
                  <Dropdown
                    v-model="userProfile.birthdayPrivacy"
                    :options="privacyOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="選擇隱私設定"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- 自我介紹 -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  自我介紹
                </label>
                <Textarea
                  v-model="userProfile.bio"
                  placeholder="寫下您的自我介紹..."
                  rows="4"
                  class="w-full"
                  :class="{ 'p-invalid': profileForm.errors.bio }"
                />
                <div class="flex justify-between items-center mt-2">
                  <small v-if="profileForm.errors.bio" class="p-error">
                    {{ profileForm.errors.bio }}
                  </small>
                  <small class="text-gray-500">
                    {{ userProfile.bio?.length || 0 }}/500
                  </small>
                </div>
              </div>

              <div class="flex justify-end">
                <Button
                  type="submit"
                  label="儲存變更"
                  icon="pi pi-check"
                  :loading="profileForm.loading"
                  class="btn-primary"
                />
              </div>
            </form>
          </div>

          <!-- 通知偏好 -->
          <div v-if="activeSection === 'notifications'" class="space-y-8">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                通知偏好
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                管理您的通知設定
              </p>
            </div>

            <div class="space-y-6">
              <!-- 推播通知 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  推播通知
                </h3>
                <div
                  class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p
                        class="text-sm font-medium text-primary-800 dark:text-primary-200"
                      >
                        瀏覽器通知
                      </p>
                      <p
                        class="text-sm text-primary-700 dark:text-primary-300 mt-1"
                      >
                        需允許瀏覽器通知權限
                      </p>
                    </div>
                    <InputSwitch v-model="notificationSettings.browser" />
                  </div>
                </div>
              </div>

              <!-- 互動通知 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  互動通知
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="setting in interactionNotifications"
                    :key="setting.key"
                    class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ setting.label }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ setting.description }}
                      </p>
                    </div>
                    <InputSwitch v-model="notificationSettings[setting.key]" />
                  </div>
                </div>
              </div>

              <!-- 內容通知 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  內容通知
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="setting in contentNotifications"
                    :key="setting.key"
                    class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ setting.label }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ setting.description }}
                      </p>
                    </div>
                    <InputSwitch v-model="notificationSettings[setting.key]" />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button
                  label="儲存設定"
                  icon="pi pi-check"
                  @click="saveNotificationSettings"
                  :loading="notificationForm.loading"
                  class="btn-primary"
                />
              </div>
            </div>
          </div>

          <!-- 內容偏好 -->
          <div v-if="activeSection === 'preferences'" class="space-y-8">
            <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                內容偏好
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                自訂您的使用體驗
              </p>
            </div>

            <div class="space-y-6">
              <!-- 主題設定 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  主題設定
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      主題模式
                    </label>
                    <ThemeToggle
                      mode="dropdown"
                      v-model="preferences.themeMode"
                      @change="handleThemeChange"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      主題色彩
                    </label>
                    <Dropdown
                      v-model="preferences.theme"
                      :options="themeOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="選擇主題"
                      class="w-full"
                      disabled
                    />
                    <small class="text-gray-500">即將推出</small>
                  </div>
                </div>
              </div>

              <!-- 內容分級 -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  內容分級篩選
                </h3>
                <div
                  class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-4"
                >
                  <div class="flex items-center space-x-2 mb-2">
                    <i class="pi pi-info-circle text-warning-500"></i>
                    <span
                      class="text-sm font-medium text-warning-800 dark:text-warning-200"
                    >
                      會員專屬功能
                    </span>
                  </div>
                  <p class="text-sm text-warning-700 dark:text-warning-300">
                    內容分級篩選功能將在會員頁面提供，敬請期待。
                  </p>
                </div>
              </div>

              <div class="flex justify-end">
                <Button
                  label="儲存偏好"
                  icon="pi pi-check"
                  @click="savePreferences"
                  :loading="preferencesForm.loading"
                  class="btn-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 電子信箱變更對話框 -->
    <Dialog
      v-model:visible="showEmailDialog"
      modal
      header="變更電子信箱"
      :style="{ width: '500px' }"
      :closable="false"
    >
      <form @submit.prevent="changeEmail" class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            新電子信箱
          </label>
          <InputText
            v-model="emailForm.newEmail"
            type="email"
            placeholder="輸入新電子信箱"
            class="w-full"
            :class="{ 'p-invalid': emailForm.errors.newEmail }"
          />
          <small v-if="emailForm.errors.newEmail" class="p-error">
            {{ emailForm.errors.newEmail }}
          </small>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            目前密碼確認
          </label>
          <Password
            v-model="emailForm.currentPassword"
            :feedback="false"
            toggleMask
            placeholder="輸入目前密碼"
            class="w-full"
            :class="{ 'p-invalid': emailForm.errors.currentPassword }"
          />
          <small v-if="emailForm.errors.currentPassword" class="p-error">
            {{ emailForm.errors.currentPassword }}
          </small>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="取消"
            severity="secondary"
            @click="showEmailDialog = false"
            class="btn-secondary"
          />
          <Button
            label="發送驗證信"
            icon="pi pi-send"
            @click="changeEmail"
            :loading="emailForm.loading"
            class="btn-primary"
          />
        </div>
      </template>
    </Dialog>

    <!-- 刪除帳號確認對話框 -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="確認刪除帳號"
      :style="{ width: '500px' }"
      :closable="false"
    >
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <i
            class="pi pi-exclamation-triangle text-danger-500 text-xl mt-1"
          ></i>
          <div>
            <p class="text-danger-800 dark:text-danger-200 font-medium">
              此操作不可恢復
            </p>
            <p class="text-gray-700 dark:text-gray-300 mt-2">
              刪除帳號後，所有資料將永久移除且無法復原。請確認您真的要刪除帳號。
            </p>
          </div>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            輸入您的帳號名稱確認
          </label>
          <InputText
            v-model="deleteForm.confirmation"
            placeholder="輸入您的帳號名稱"
            class="w-full"
            :class="{ 'p-invalid': deleteForm.errors.confirmation }"
          />
          <small v-if="deleteForm.errors.confirmation" class="p-error">
            {{ deleteForm.errors.confirmation }}
          </small>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="取消"
            severity="secondary"
            @click="showDeleteDialog = false"
            class="btn-secondary"
          />
          <Button
            label="確認刪除"
            icon="pi pi-trash"
            severity="danger"
            @click="deleteAccount"
            :loading="deleteForm.loading"
            :disabled="deleteForm.confirmation !== userProfile.username"
            class="btn-danger"
          />
        </div>
      </template>
    </Dialog>

    <!-- Toast 通知 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import ThemeToggle from '@/components/ThemeToggle.vue'

// 元件名稱
defineOptions({
  name: 'SettingsPage',
})

const toast = useToast()

// 響應式資料
const activeSection = ref('account')
const showEmailDialog = ref(false)
const showDeleteDialog = ref(false)

// 設定區塊
const sections = ref([
  { id: 'account', title: '帳號管理', icon: 'pi pi-user' },
  { id: 'profile', title: '個人資訊', icon: 'pi pi-id-card' },
  { id: 'notifications', title: '通知偏好', icon: 'pi pi-bell' },
  { id: 'preferences', title: '內容偏好', icon: 'pi pi-cog' },
])

// 使用者資料
const userProfile = reactive({
  username: 'memedex_user',
  email: 'user@example.com',
  displayName: '迷因達人',
  avatar: null,
  gender: 'not_specified',
  birthday: null,
  birthdayPrivacy: 'age_only',
  bio: '熱愛迷因文化的創作者 🎭',
})

// 密碼表單
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  loading: false,
  errors: {},
})

// 電子信箱表單
const emailForm = reactive({
  newEmail: '',
  currentPassword: '',
  loading: false,
  errors: {},
})

// 個人資料表單
const profileForm = reactive({
  loading: false,
  errors: {},
})

// 通知設定
const notificationSettings = reactive({
  browser: false,
  newFollower: true,
  newComment: true,
  newLike: true,
  newMention: true,
  trendingContent: false,
  weeklyDigest: true,
})

const notificationForm = reactive({
  loading: false,
})

// 內容偏好
const preferences = reactive({
  themeMode: 'system',
  theme: 'default',
})

const preferencesForm = reactive({
  loading: false,
})

// 處理主題變化
const handleThemeChange = (newTheme) => {
  preferences.themeMode = newTheme
}

// 初始化主題設定
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    preferences.themeMode = savedTheme
  }
})

// 刪除帳號表單
const deleteForm = reactive({
  confirmation: '',
  loading: false,
  errors: {},
})

// 社群帳號
const socialAccounts = ref([
  {
    platform: 'google',
    name: 'Google',
    email: 'user@gmail.com',
    icon: 'pi pi-google',
    connected: true,
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    email: 'user@facebook.com',
    icon: 'pi pi-facebook',
    connected: false,
  },
  {
    platform: 'twitter',
    name: 'Twitter',
    email: 'user@twitter.com',
    icon: 'pi pi-twitter',
    connected: false,
  },
])

// 選項資料
const genderOptions = ref([
  { label: '不公開', value: 'not_specified' },
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
  { label: '其他', value: 'other' },
])

const privacyOptions = ref([
  { label: '完全不公開', value: 'private' },
  { label: '只顯示年齡', value: 'age_only' },
  { label: '公開完整日期', value: 'public' },
])

const themeOptions = ref([
  { label: '預設主題', value: 'default' },
  { label: '藍色主題', value: 'blue' },
  { label: '綠色主題', value: 'green' },
  { label: '紫色主題', value: 'purple' },
])

const interactionNotifications = ref([
  {
    key: 'newFollower',
    label: '新追蹤者',
    description: '當有人追蹤您時通知',
  },
  {
    key: 'newComment',
    label: '新留言',
    description: '當有人留言給您時通知',
  },
  {
    key: 'newLike',
    label: '新按讚',
    description: '當有人按讚您的內容時通知',
  },
  {
    key: 'newMention',
    label: '新提及',
    description: '當有人在內容中提及您時通知',
  },
])

const contentNotifications = ref([
  {
    key: 'trendingContent',
    label: '熱門內容',
    description: '接收熱門迷因和趨勢內容通知',
  },
  {
    key: 'weeklyDigest',
    label: '週報摘要',
    description: '每週接收個人活動摘要',
  },
])

// 方法
const changePassword = async () => {
  passwordForm.loading = true
  passwordForm.errors = {}

  // 驗證
  if (!passwordForm.currentPassword) {
    passwordForm.errors.currentPassword = '請輸入目前密碼'
  }
  if (!passwordForm.newPassword) {
    passwordForm.errors.newPassword = '請輸入新密碼'
  } else if (passwordForm.newPassword.length < 8) {
    passwordForm.errors.newPassword = '密碼長度至少 8 個字元'
  }
  if (!passwordForm.confirmPassword) {
    passwordForm.errors.confirmPassword = '請確認新密碼'
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordForm.errors.confirmPassword = '密碼不一致'
  }

  if (Object.keys(passwordForm.errors).length > 0) {
    passwordForm.loading = false
    return
  }

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '密碼已成功變更',
      life: 3000,
    })

    // 清空表單
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '密碼變更失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    passwordForm.loading = false
  }
}

const changeEmail = async () => {
  emailForm.loading = true
  emailForm.errors = {}

  // 驗證
  if (!emailForm.newEmail) {
    emailForm.errors.newEmail = '請輸入新電子信箱'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
    emailForm.errors.newEmail = '請輸入有效的電子信箱格式'
  }
  if (!emailForm.currentPassword) {
    emailForm.errors.currentPassword = '請輸入目前密碼'
  }

  if (Object.keys(emailForm.errors).length > 0) {
    emailForm.loading = false
    return
  }

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '驗證信已發送，請檢查您的信箱',
      life: 3000,
    })

    showEmailDialog.value = false
    emailForm.newEmail = ''
    emailForm.currentPassword = ''
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '發送驗證信失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    emailForm.loading = false
  }
}

const updateProfile = async () => {
  profileForm.loading = true
  profileForm.errors = {}

  // 驗證
  if (!userProfile.displayName) {
    profileForm.errors.displayName = '請輸入顯示名稱'
  }
  if (userProfile.bio && userProfile.bio.length > 500) {
    profileForm.errors.bio = '自我介紹不能超過 500 字元'
  }

  if (Object.keys(profileForm.errors).length > 0) {
    profileForm.loading = false
    return
  }

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '個人資料已成功更新',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '更新失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    profileForm.loading = false
  }
}

const saveNotificationSettings = async () => {
  notificationForm.loading = true

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '通知設定已儲存',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    notificationForm.loading = false
  }
}

const savePreferences = async () => {
  preferencesForm.loading = true

  try {
    // 儲存主題設定到 localStorage
    localStorage.setItem('theme', preferences.themeMode)

    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '偏好設定已儲存',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    preferencesForm.loading = false
  }
}

const toggleSocialAccount = (account) => {
  if (account.connected) {
    // 解除綁定邏輯
    account.connected = false
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `${account.name} 帳號已解除綁定`,
      life: 3000,
    })
  } else {
    // 綁定邏輯
    account.connected = true
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `${account.name} 帳號已綁定`,
      life: 3000,
    })
  }
}

const deleteAccount = async () => {
  deleteForm.loading = true
  deleteForm.errors = {}

  if (deleteForm.confirmation !== userProfile.username) {
    deleteForm.errors.confirmation = '帳號名稱不正確'
    deleteForm.loading = false
    return
  }

  try {
    // 模擬 API 呼叫
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '帳號已刪除',
      life: 3000,
    })

    showDeleteDialog.value = false
    deleteForm.confirmation = ''
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '刪除失敗，請稍後再試',
      life: 3000,
    })
  } finally {
    deleteForm.loading = false
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 這裡可以處理檔案上傳邏輯
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  // 初始化時可以載入使用者資料
})
</script>

<style scoped lang="scss">
/* 按鈕樣式群組 */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white border-primary-600 hover:border-primary-700
         focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
         transition-colors duration-200 font-medium px-4 py-2 rounded-lg;
}

.btn-secondary {
  @apply bg-secondary-100 hover:bg-secondary-200 text-secondary-700 border-secondary-300 hover:border-secondary-400
         dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-300 dark:border-secondary-600
         dark:hover:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
         transition-colors duration-200 font-medium px-4 py-2 rounded-lg;
}

.btn-danger {
  @apply bg-danger-600 hover:bg-danger-700 text-white border-danger-600 hover:border-danger-700
         focus:ring-2 focus:ring-danger-500 focus:ring-offset-2
         transition-colors duration-200 font-medium px-4 py-2 rounded-lg;
}

.btn-action {
  @apply text-sm px-3 py-1 font-medium transition-colors duration-200;
}

/* 卡片樣式群組 */
.settings-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200
         dark:border-gray-700 p-6 transition-all duration-200;
}

.settings-nav-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200
         dark:border-gray-700 p-4;
}

/* 表單樣式群組 */
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600
         rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
         transition-colors duration-200;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-error {
  @apply text-danger-600 dark:text-danger-400 text-sm mt-1;
}

/* 狀態指示器樣式群組 */
.status-verified {
  @apply flex items-center space-x-2 text-success-600 dark:text-success-400;
}

.status-unverified {
  @apply flex items-center space-x-2 text-warning-600 dark:text-warning-400;
}

.status-beta {
  @apply text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full
         dark:bg-warning-900/20 dark:text-warning-300;
}

/* 警告區塊樣式群組 */
.warning-block {
  @apply bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700
         rounded-lg p-4;
}

.info-block {
  @apply bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700
         rounded-lg p-4;
}

.beta-block {
  @apply bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700
         rounded-lg p-4;
}

/* 社交帳號卡片樣式群組 */
.social-account-card {
  @apply flex items-center justify-between p-4 border border-gray-200
         dark:border-gray-600 rounded-lg transition-colors duration-200
         hover:bg-gray-50 dark:hover:bg-gray-700;
}

.social-account-info {
  @apply flex items-center space-x-3;
}

.social-account-icon {
  @apply text-xl;
}

.social-account-details {
  @apply flex-1;
}

.social-account-name {
  @apply font-medium text-gray-900 dark:text-white;
}

.social-account-email {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* 通知設定卡片樣式群組 */
.notification-card {
  @apply flex items-center justify-between p-4 border border-gray-200
         dark:border-gray-600 rounded-lg transition-colors duration-200;
}

.notification-info {
  @apply flex-1;
}

.notification-title {
  @apply font-medium text-gray-900 dark:text-white;
}

.notification-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* 響應式設計群組 */
.settings-container {
  @apply container mx-auto p-4 space-y-8;
}

.settings-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8;
}

.settings-content {
  @apply lg:col-span-2;
}

.settings-nav {
  @apply lg:col-span-1;
}

/* 深色模式適配 */
@media (prefers-color-scheme: dark) {
  .settings-card {
    @apply bg-gray-800 border-gray-700;
  }

  .form-input {
    @apply bg-gray-700 border-gray-600 text-white placeholder-gray-400;
  }
}

/* 動畫效果群組 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.slide-enter-active,
.slide-leave-active {
  @apply transition-transform duration-300;
}

.slide-enter-from {
  @apply transform translate-x-full;
}

.slide-leave-to {
  @apply transform -translate-x-full;
}

/* 載入狀態群組 */
.loading-overlay {
  @apply absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center
         justify-center rounded-lg;
}

.loading-spinner {
  @apply animate-spin h-6 w-6 text-primary-600;
}

/* 成功/錯誤狀態群組 */
.success-state {
  @apply text-success-600 dark:text-success-400;
}

.error-state {
  @apply text-danger-600 dark:text-danger-400;
}

.warning-state {
  @apply text-warning-600 dark:text-warning-400;
}

/* 無障礙設計群組 */
.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .container {
    @apply px-4;
  }
}

@media (max-width: 768px) {
  .grid {
    @apply grid-cols-1;
  }
}
</style>

<route lang="yaml">
meta:
  title: '設定'
  login: ''
  admin: false
</route>
