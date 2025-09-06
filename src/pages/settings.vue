<template>
  <div class="w-full mx-auto p-4 space-y-12 overflow-y-auto">
    <!-- 使用 PrimeVue Tabs 的設定區塊 -->
    <div class="rounded-lg max-w-5xl mx-auto">
      <Tabs v-model:value="activeTabIndex" class="w-full">
        <TabList>
          <Tab
            v-for="(section, index) in sections"
            :key="section.id"
            :value="String(index)"
            class="px-6 py-4 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 font-medium cursor-pointer"
          >
            <div class="flex items-center space-x-3">
              <i :class="section.icon" class="text-lg"></i>
              <span class="font-medium">{{ section.title }}</span>
            </div>
          </Tab>
        </TabList>

        <TabPanels>
          <!-- 帳號管理 TabPanel -->
          <TabPanel value="0">
            <div class="space-y-4 mt-4">
              <!-- 使用者名稱變更 -->
              <div class="space-y-4 mt-4">
                <h3 class="text-lg font-medium">使用者名稱變更</h3>
                <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ userProfile.username }}
                      </p>
                      <!-- 如果沒有密碼，顯示提示 -->
                      <p
                        v-if="!userProfile.hasPassword"
                        class="text-xs text-warning-600 dark:text-warning-400 mt-1"
                      >
                        <i class="pi pi-exclamation-triangle mr-1"></i>
                        需要設定密碼才能變更使用者名稱
                      </p>
                    </div>
                    <div>
                      <Button
                        label="變更"
                        icon="pi pi-pencil"
                        severity="primary"
                        size="small"
                        :disabled="!userProfile.hasPassword"
                        @click="showUsernameDialog = true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 密碼變更 -->
              <div class="space-y-4 mt-10">
                <h3 class="text-lg font-medium">密碼變更</h3>

                <!-- 如果沒有密碼，顯示提示訊息和設定密碼選項 -->
                <div v-if="!userProfile.hasPassword" class="space-y-4">
                  <div
                    class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-4"
                  >
                    <div class="flex items-start space-x-2">
                      <i class="pi pi-info-circle text-warning-500 mt-0.5"></i>
                      <div>
                        <p
                          class="text-sm font-medium text-warning-800 dark:text-warning-200"
                        >
                          社群帳號登入
                        </p>
                        <p
                          class="text-sm text-warning-700 dark:text-warning-300 mt-1"
                        >
                          如果沒有設定密碼，無法使用變更使用者名稱和電子信箱等設定
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 設定密碼表單 -->
                  <div
                    class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4"
                  >
                    <h4
                      class="text-sm font-medium text-primary-800 dark:text-primary-200 mb-3"
                    >
                      設定密碼
                    </h4>
                    <form
                      @submit.prevent="setPassword"
                      class="space-y-4"
                      data-testid="set-password-form"
                      autocomplete="on"
                      novalidate
                    >
                      <div
                        class="flex items-center gap-4 flex-wrap md:flex-nowrap"
                      >
                        <div class="w-full md:w-1/2">
                          <label
                            for="new-password-set"
                            class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                          >
                            新密碼
                          </label>
                          <Password
                            id="new-password-set"
                            v-model="passwordForm.newPassword"
                            name="newPassword"
                            autocomplete="new-password"
                            data-testid="new-password-set-input"
                            :feedback="true"
                            toggleMask
                            fluid
                            placeholder="輸入新密碼"
                            :invalid="!!passwordForm.errors.newPassword"
                            aria-describedby="new-password-set-error"
                            :aria-invalid="!!passwordForm.errors.newPassword"
                          />
                          <Message
                            v-if="passwordForm.errors.newPassword"
                            severity="error"
                            size="small"
                            variant="simple"
                            id="new-password-set-error"
                          >
                            {{ passwordForm.errors.newPassword }}
                          </Message>
                        </div>
                        <div class="w-full md:w-1/2">
                          <label
                            for="confirm-password-set"
                            class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                          >
                            確認新密碼
                          </label>
                          <Password
                            id="confirm-password-set"
                            v-model="passwordForm.confirmPassword"
                            name="confirmPassword"
                            autocomplete="new-password"
                            data-testid="confirm-password-set-input"
                            :feedback="false"
                            toggleMask
                            fluid
                            placeholder="再次輸入新密碼"
                            :invalid="!!passwordForm.errors.confirmPassword"
                            aria-describedby="confirm-password-set-error"
                            :aria-invalid="
                              !!passwordForm.errors.confirmPassword
                            "
                          />
                          <Message
                            v-if="passwordForm.errors.confirmPassword"
                            severity="error"
                            size="small"
                            variant="simple"
                            id="confirm-password-set-error"
                          >
                            {{ passwordForm.errors.confirmPassword }}
                          </Message>
                        </div>
                      </div>
                      <div class="flex justify-end">
                        <Button
                          type="submit"
                          label="設定密碼"
                          icon="pi pi-key"
                          :loading="passwordForm.loading"
                          class="btn-primary"
                          data-testid="set-password-button"
                          aria-label="設定密碼"
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <!-- 如果有密碼，顯示密碼變更表單 -->
                <form
                  v-if="userProfile.hasPassword"
                  @submit.prevent="changePassword"
                  class="space-y-4"
                  data-testid="change-password-form"
                  autocomplete="on"
                  novalidate
                >
                  <div class="flex items-center gap-4 flex-wrap md:flex-nowrap">
                    <div class="w-full md:w-1/3">
                      <label
                        for="current-password"
                        class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                      >
                        目前密碼
                      </label>
                      <Password
                        id="current-password"
                        v-model="passwordForm.currentPassword"
                        name="currentPassword"
                        autocomplete="current-password"
                        data-testid="current-password-input"
                        :feedback="false"
                        toggleMask
                        placeholder="輸入目前密碼"
                        fluid
                        :invalid="!!passwordForm.errors.currentPassword"
                        aria-describedby="current-password-error"
                        :aria-invalid="!!passwordForm.errors.currentPassword"
                      />
                      <Message
                        v-if="passwordForm.errors.currentPassword"
                        severity="error"
                        size="small"
                        variant="simple"
                        id="current-password-error"
                      >
                        {{ passwordForm.errors.currentPassword }}
                      </Message>
                    </div>
                    <div class="w-full md:w-1/3">
                      <label
                        for="new-password-change"
                        class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                      >
                        新密碼
                      </label>
                      <Password
                        id="new-password-change"
                        v-model="passwordForm.newPassword"
                        name="newPassword"
                        autocomplete="new-password"
                        data-testid="new-password-change-input"
                        :feedback="true"
                        toggleMask
                        fluid
                        placeholder="輸入新密碼"
                        :invalid="!!passwordForm.errors.newPassword"
                        aria-describedby="new-password-change-error"
                        :aria-invalid="!!passwordForm.errors.newPassword"
                      />
                      <Message
                        v-if="passwordForm.errors.newPassword"
                        severity="error"
                        size="small"
                        variant="simple"
                        id="new-password-change-error"
                      >
                        {{ passwordForm.errors.newPassword }}
                      </Message>
                    </div>
                    <div class="w-full md:w-1/3">
                      <label
                        for="confirm-password-change"
                        class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                      >
                        確認新密碼
                      </label>
                      <Password
                        id="confirm-password-change"
                        v-model="passwordForm.confirmPassword"
                        name="confirmPassword"
                        autocomplete="new-password"
                        data-testid="confirm-password-change-input"
                        :feedback="false"
                        toggleMask
                        placeholder="再次輸入新密碼"
                        fluid
                        :invalid="!!passwordForm.errors.confirmPassword"
                        aria-describedby="confirm-password-change-error"
                        :aria-invalid="!!passwordForm.errors.confirmPassword"
                      />
                      <Message
                        v-if="passwordForm.errors.confirmPassword"
                        severity="error"
                        size="small"
                        variant="simple"
                        id="confirm-password-change-error"
                      >
                        {{ passwordForm.errors.confirmPassword }}
                      </Message>
                    </div>
                  </div>

                  <div class="flex justify-end">
                    <Button
                      type="submit"
                      label="變更密碼"
                      icon="pi pi-key"
                      :loading="passwordForm.loading"
                      class="btn-primary"
                      data-testid="change-password-button"
                      aria-label="變更密碼"
                    />
                  </div>
                </form>
              </div>

              <!-- 電子信箱管理 -->
              <div class="space-y-4 mt-10">
                <h3 class="text-lg font-medium">電子信箱管理</h3>
                <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ userProfile.email }}
                      </p>
                      <div class="flex items-center space-x-2 mt-1">
                        <i
                          :class="
                            userProfile.emailVerified
                              ? 'pi pi-check-circle text-success-500'
                              : 'pi pi-exclamation-triangle text-warning-500'
                          "
                        ></i>
                        <span
                          :class="
                            userProfile.emailVerified
                              ? 'text-sm text-success-600 dark:text-success-400'
                              : 'text-sm text-warning-600 dark:text-warning-400'
                          "
                        >
                          {{ userProfile.emailVerified ? '已驗證' : '未驗證' }}
                        </span>
                      </div>
                      <p
                        v-if="!userProfile.emailVerified"
                        class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                      >
                        請驗證您的電子信箱以使用完整功能
                      </p>
                      <p
                        v-if="!userProfile.emailVerified"
                        class="text-xs text-danger-600 dark:text-danger-400 mt-1"
                      >
                        <i class="pi pi-exclamation-triangle mr-1"></i>
                        未完成郵件驗證的帳號將於1年後由系統刪除
                      </p>
                      <!-- 如果沒有電子信箱，顯示提示 -->
                      <p
                        v-if="!userProfile.email"
                        class="text-xs text-warning-600 dark:text-warning-400 mt-1"
                      >
                        <i class="pi pi-exclamation-triangle mr-1"></i>
                        沒有電子信箱，無法發送驗證信
                      </p>
                      <!-- 如果沒有密碼，顯示提示 -->
                      <p
                        v-if="!userProfile.hasPassword"
                        class="text-xs text-warning-600 dark:text-warning-400 mt-1"
                      >
                        <i class="pi pi-exclamation-triangle mr-1"></i>
                        需要設定密碼才能變更電子信箱
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <Button
                        v-if="!userProfile.emailVerified"
                        label="重新發送驗證信"
                        icon="pi pi-send"
                        severity="warning"
                        size="small"
                        :disabled="!userProfile.email"
                        @click="resendVerificationEmail"
                        :loading="isResendingVerification"
                        class="btn-secondary"
                      />
                      <Button
                        label="變更信箱"
                        icon="pi pi-pencil"
                        severity="secondary"
                        size="small"
                        :disabled="!userProfile.hasPassword"
                        @click="showEmailDialog = true"
                        class="btn-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 兩步驟驗證 -->
              <div class="space-y-4 mt-10">
                <h3 class="text-lg font-medium">兩步驟驗證</h3>
                <div class="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium">Google Authenticator</p>
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
              <div class="space-y-4 mt-10">
                <h3 class="text-lg font-medium">社群帳號綁定</h3>
                <div class="space-y-3">
                  <div
                    v-for="account in socialAccounts"
                    :key="account.platform"
                    class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <i :class="account.icon" class="text-xl"></i>
                      <div>
                        <p class="font-medium">
                          {{ account.name }}
                        </p>
                        <p
                          v-if="account.connected && account.email"
                          class="text-sm text-gray-600 dark:text-gray-400"
                        >
                          {{ account.email }}
                        </p>
                        <p
                          v-else-if="account.connected"
                          class="text-sm text-success-600 dark:text-success-400"
                        >
                          已綁定
                        </p>
                        <p
                          v-else
                          class="text-sm text-gray-500 dark:text-gray-400"
                        >
                          未綁定
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        v-if="account.connected"
                        class="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full dark:bg-success-900/20 dark:text-success-300"
                      >
                        已綁定
                      </span>
                      <div class="flex space-x-2">
                        <Button
                          :label="account.connected ? '解除綁定' : '綁定帳號'"
                          :icon="
                            account.connected ? 'pi pi-power-off' : 'pi pi-link'
                          "
                          :severity="
                            account.connected ? 'secondary' : 'primary'
                          "
                          :loading="account.loading"
                          :disabled="account.loading"
                          @click="toggleSocialAccount(account)"
                          class="btn-action"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 刪除帳號 -->
              <div class="space-y-4 mt-10">
                <h3 class="text-lg font-medium">刪除帳號</h3>
                <div
                  class="bg-primary-50 dark:bg-primary-900/20 border border-primary-400 dark:border-primary-700 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <i
                      class="pi pi-exclamation-triangle text-primary-500 mt-1"
                    ></i>
                    <div class="flex-1">
                      <p
                        class="text-sm font-medium text-primary-800 dark:text-primary-200"
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
                        @click="showDeleteDialog = true"
                        class="mt-3 btn-danger"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- 個人資訊 TabPanel -->
          <TabPanel value="1">
            <div class="space-y-8">
              <form
                @submit.prevent="updateProfile"
                class="space-y-6"
                data-testid="profile-form"
                autocomplete="on"
                novalidate
              >
                <!-- 頭像 -->
                <div class="space-y-4 mt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    頭像
                  </h3>
                  <div class="flex items-center space-x-4">
                    <div class="relative group">
                      <Avatar
                        :image="avatarDisplayUrl"
                        shape="circle"
                        size="xlarge"
                        class="border-2 border-gray-200 dark:border-gray-600"
                      />
                      <!-- Hover 覆蓋層 - 移除按鈕 -->
                      <div
                        v-if="
                          userProfile.avatar &&
                          !userProfile.avatar.startsWith('blob:')
                        "
                        class="absolute w-16 h-16 inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Button
                          icon="pi pi-trash"
                          severity="primary"
                          size="small"
                          class="w-8 h-8 rounded-full"
                          @click="removeAvatar"
                          aria-label="移除頭像"
                        />
                      </div>
                      <!-- 相機按鈕 -->
                      <Button
                        icon="pi pi-camera"
                        severity="secondary"
                        size="small"
                        class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                        @click="$refs.avatarInput.click()"
                        aria-label="上傳頭像"
                      />

                      <!-- 如果有暫存檔案，顯示預覽提示 -->
                      <div
                        v-if="tempAvatarFile"
                        class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs px-1 py-0.5 rounded-full"
                      >
                        預覽
                      </div>
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

                <!-- 封面圖片 -->
                <div class="space-y-4 mt-10">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    封面圖片
                  </h3>
                  <div class="space-y-4">
                    <!-- 封面圖片預覽 -->
                    <div class="relative group">
                      <div
                        class="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                      >
                        <img
                          v-if="userProfile.cover_image"
                          :src="userProfile.cover_image"
                          alt="封面圖片"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
                        >
                          <i class="pi pi-image text-gray-500 text-2xl"></i>
                        </div>
                      </div>
                      <!-- Hover 覆蓋層 - 編輯按鈕 -->
                      <div
                        class="absolute cursor-pointer inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 rounded-lg"
                        @click="$refs.coverImageInput.click()"
                        aria-label="編輯封面圖片"
                      >
                        <i
                          class="pi pi-pen-to-square rounded-full text-lg text-white absolute top-4 right-4"
                        />
                      </div>
                      <!-- Hover 覆蓋層 - 移除按鈕 -->
                      <div
                        v-if="userProfile.cover_image"
                        class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Button
                          icon="pi pi-trash"
                          severity="danger"
                          size="small"
                          class="w-10 h-10 rounded-full shadow-lg"
                          @click="removeCoverImage"
                          aria-label="移除封面圖片"
                        />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        支援 JPG、PNG 格式，最大 5MB，建議尺寸 1920x242 像素
                      </p>
                      <input
                        ref="coverImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleCoverImageChange"
                      />
                    </div>
                  </div>
                </div>
                <h3 class="mt-10">個人資料</h3>

                <!-- 基本資訊 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="display-name"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      顯示名稱
                    </label>
                    <InputText
                      id="display-name"
                      v-model="userProfile.displayName"
                      name="displayName"
                      type="text"
                      autocomplete="name"
                      data-testid="display-name-input"
                      placeholder="輸入顯示名稱"
                      class="w-full"
                      :invalid="!!profileForm.errors.displayName"
                      aria-describedby="display-name-error"
                      :aria-invalid="!!profileForm.errors.displayName"
                    />
                    <Message
                      v-if="profileForm.errors.displayName"
                      severity="error"
                      size="small"
                      variant="simple"
                      id="display-name-error"
                    >
                      {{ profileForm.errors.displayName }}
                    </Message>
                  </div>

                  <div>
                    <label
                      for="gender"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      性別
                    </label>
                    <Dropdown
                      id="gender"
                      v-model="userProfile.gender"
                      name="gender"
                      :options="genderOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="選擇性別"
                      class="w-full"
                      data-testid="gender-dropdown"
                      aria-describedby="gender-error"
                      :aria-invalid="!!profileForm.errors.gender"
                    />
                    <Message
                      v-if="profileForm.errors.gender"
                      severity="error"
                      size="small"
                      variant="simple"
                      id="gender-error"
                    >
                      {{ profileForm.errors.gender }}
                    </Message>
                  </div>

                  <div>
                    <label
                      for="birthday"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      生日
                    </label>
                    <Calendar
                      id="birthday"
                      v-model="userProfile.birthday"
                      name="birthday"
                      dateFormat="yy-mm-dd"
                      placeholder="選擇生日"
                      class="w-full"
                      data-testid="birthday-calendar"
                      aria-describedby="birthday-error"
                      :aria-invalid="!!profileForm.errors.birthday"
                    />
                    <Message
                      v-if="profileForm.errors.birthday"
                      severity="error"
                      size="small"
                      variant="simple"
                      id="birthday-error"
                    >
                      {{ profileForm.errors.birthday }}
                    </Message>
                  </div>
                </div>

                <!-- 自我介紹 -->
                <div>
                  <label
                    for="bio"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    自我介紹
                  </label>
                  <Textarea
                    id="bio"
                    v-model="userProfile.bio"
                    name="bio"
                    data-testid="bio-textarea"
                    placeholder="寫下您的自我介紹..."
                    rows="4"
                    class="w-full"
                    :invalid="!!profileForm.errors.bio"
                    aria-describedby="bio-error"
                    :aria-invalid="!!profileForm.errors.bio"
                  />
                  <div class="flex justify-between items-center mt-2">
                    <Message
                      v-if="profileForm.errors.bio"
                      severity="error"
                      size="small"
                      variant="simple"
                      id="bio-error"
                    >
                      {{ profileForm.errors.bio }}
                    </Message>
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
                    data-testid="save-profile-button"
                    aria-label="儲存個人資料變更"
                  />
                </div>
              </form>
            </div>
          </TabPanel>

          <!-- 通知偏好 TabPanel -->
          <TabPanel value="2">
            <div class="space-y-8">
              <div class="space-y-6">
                <!-- 推播通知 -->
                <div class="space-y-4 mt-4">
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
                <div class="space-y-4 mt-10">
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
                      <InputSwitch
                        v-model="notificationSettings[setting.key]"
                      />
                    </div>
                  </div>
                </div>

                <!-- 內容通知 -->
                <div class="space-y-4 mt-10">
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
                      <InputSwitch
                        v-model="notificationSettings[setting.key]"
                      />
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
          </TabPanel>

          <!-- 內容偏好 TabPanel -->
          <TabPanel value="3">
            <div class="space-y-8">
              <div class="space-y-6">
                <!-- 主題設定 -->
                <div class="space-y-4 mt-4">
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
                        v-model="themeMode"
                        @change="handleThemeChange"
                      />
                    </div>
                  </div>
                </div>
                <!--
                <div class="flex justify-end space-x-2">
                  <Button
                    label="清除設定"
                    icon="pi pi-trash"
                    severity="secondary"
                    @click="clearAllPreferences"
                    :loading="preferencesForm.loading"
                    class="btn-secondary"
                  />
                  <Button
                    label="儲存偏好"
                    icon="pi pi-check"
                    @click="saveAllPreferences"
                    :loading="preferencesForm.loading"
                    class="btn-primary"
                  />
                </div> -->
              </div>
            </div>
          </TabPanel>

          <!-- 隱私設定 TabPanel -->
          <TabPanel value="4">
            <div class="space-y-6">
              <!-- 說明 -->
              <div class="space-y-4 mb-8">
                <h3
                  class="text-lg font-semibold text-gray-800 dark:text-gray-200"
                >
                  關於 Cookie
                </h3>

                <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Cookie
                    是小型文字檔案，儲存在您的裝置上，幫助我們提供更好的服務體驗，除了剛開始進入網站的時候可以設定，您也可以隨時在此頁面調整設定，或透過瀏覽器設定管理
                    Cookie。 請查看我們的
                    <router-link
                      to="/privacy"
                      class="text-primary-600 hover:text-primary-700 underline"
                      target="_blank"
                      >隱私政策</router-link
                    >了解更多詳情。
                  </p>
                </div>
              </div>
              <!-- Cookie 設定 -->
              <div class="space-y-4">
                <h3 class="mb-4">Cookie 與隱私設定</h3>
                <!-- 必要 Cookie -->
                <div
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div class="flex items-center justify-start mb-2 gap-6">
                    <div>
                      <h5>必要 Cookie</h5>
                      <small class="text-sm text-gray-600 dark:text-gray-400">
                        維持網站基本功能
                      </small>
                    </div>
                    <div class="flex items-center">
                      <i class="pi pi-lock text-gray-400 mr-2"></i>
                      <span class="text-sm text-gray-500">始終啟用</span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500">
                    這些 Cookie 對於網站正常運作是必要的，無法停用。
                  </p>
                </div>

                <!-- 功能 Cookie -->
                <div
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div class="flex items-center justify-start mb-2 gap-6">
                    <div>
                      <h5>功能 Cookie</h5>
                      <small class="text-sm text-gray-600 dark:text-gray-400">
                        記住您的偏好設定
                      </small>
                    </div>
                    <InputSwitch
                      v-model="cookiePreferences.functional"
                      :disabled="!currentConsent"
                    />
                  </div>
                  <p class="text-xs text-gray-500">
                    這些 Cookie
                    記住您的語言偏好、主題設定等，提供更好的使用體驗。
                  </p>
                </div>

                <!-- 分析 Cookie -->
                <div
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div class="flex items-center justify-start mb-2 gap-6">
                    <div>
                      <h5>分析 Cookie</h5>
                      <small class="text-sm text-gray-600 dark:text-gray-400">
                        匿名統計，改善服務
                      </small>
                    </div>
                    <InputSwitch
                      v-model="cookiePreferences.analytics"
                      :disabled="!currentConsent"
                    />
                  </div>
                  <p class="text-xs text-gray-500">
                    這些 Cookie
                    幫助我們了解網站使用情況，改善服務品質。所有數據都是匿名的。
                  </p>
                </div>

                <!-- 操作按鈕 -->
                <div class="flex justify-end pt-4">
                  <Button
                    label="儲存設定"
                    icon="pi pi-save"
                    :disabled="!currentConsent || !hasChanges"
                    @click="saveSettings"
                  />
                </div>

                <!-- 最後更新時間 -->
                <div
                  class="text-xs text-right text-gray-500 dark:text-gray-400 mt-4"
                >
                  <p>最後更新：{{ formatDate(currentConsent?.timestamp) }}</p>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- 電子信箱變更對話框 -->
    <Dialog
      v-model:visible="showEmailDialog"
      modal
      header="變更電子信箱"
      :style="{ width: '500px' }"
      :closable="false"
    >
      <form
        @submit.prevent="changeEmail"
        class="space-y-4"
        data-testid="change-email-form"
        autocomplete="on"
        novalidate
      >
        <div>
          <label
            for="new-email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            新電子信箱
          </label>
          <InputText
            id="new-email"
            v-model="emailForm.newEmail"
            name="newEmail"
            type="email"
            autocomplete="email"
            data-testid="new-email-input"
            placeholder="輸入新電子信箱"
            fluid
            :invalid="!!emailForm.errors.newEmail"
            aria-describedby="new-email-error"
            :aria-invalid="!!emailForm.errors.newEmail"
          />
          <Message
            v-if="emailForm.errors.newEmail"
            severity="error"
            size="small"
            variant="simple"
            id="new-email-error"
          >
            {{ emailForm.errors.newEmail }}
          </Message>
        </div>
        <div v-if="userProfile.hasPassword">
          <label
            for="current-password-email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            目前密碼確認
          </label>
          <Password
            id="current-password-email"
            v-model="emailForm.currentPassword"
            name="currentPassword"
            autocomplete="current-password"
            data-testid="current-password-email-input"
            :feedback="false"
            toggleMask
            fluid
            placeholder="輸入目前密碼"
            :invalid="!!emailForm.errors.currentPassword"
            aria-describedby="current-password-email-error"
            :aria-invalid="!!emailForm.errors.currentPassword"
          />
          <Message
            v-if="emailForm.errors.currentPassword"
            severity="error"
            size="small"
            variant="simple"
            id="current-password-email-error"
          >
            {{ emailForm.errors.currentPassword }}
          </Message>
        </div>
        <!-- 如果沒有密碼，顯示提示 -->
        <div
          v-else
          class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-3"
        >
          <div class="flex items-start space-x-2">
            <i class="pi pi-exclamation-triangle text-warning-500 mt-0.5"></i>
            <div>
              <p
                class="text-sm font-medium text-warning-800 dark:text-warning-200"
              >
                無法變更電子信箱
              </p>
              <p class="text-sm text-warning-700 dark:text-warning-300 mt-1">
                社群帳號登入的用戶需要先設定密碼才能變更電子信箱
              </p>
            </div>
          </div>
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
            :disabled="!userProfile.hasPassword"
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
            for="delete-confirmation"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            輸入您的使用者名稱確認
          </label>
          <InputText
            id="delete-confirmation"
            v-model="deleteForm.confirmation"
            name="confirmation"
            type="text"
            autocomplete="username"
            data-testid="delete-confirmation-input"
            placeholder="輸入您的使用者名稱"
            class="w-full"
            :invalid="!!deleteForm.errors.confirmation"
            aria-describedby="delete-confirmation-error"
            :aria-invalid="!!deleteForm.errors.confirmation"
          />
          <Message
            v-if="deleteForm.errors.confirmation"
            severity="error"
            size="small"
            variant="simple"
            id="delete-confirmation-error"
          >
            {{ deleteForm.errors.confirmation }}
          </Message>
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

    <!-- 解除綁定確認對話框 -->
    <Dialog
      v-model:visible="showUnbindDialog"
      modal
      header="確認解除綁定"
      :style="{ width: '500px' }"
      :closable="false"
    >
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <i
            class="pi pi-exclamation-triangle text-warning-500 text-xl mt-1"
          ></i>
          <div>
            <p class="text-warning-800 dark:text-warning-200 font-medium">
              確認解除綁定
            </p>
            <p class="text-gray-700 dark:text-gray-300 mt-2">
              解除綁定
              {{ selectedAccount?.name }}
              帳號後，您將無法使用該帳號登入。您可以隨時重新綁定。
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="取消"
            severity="secondary"
            @click="showUnbindDialog = false"
            class="btn-secondary"
          />
          <Button
            label="確認解除綁定"
            icon="pi pi-unlink"
            severity="warning"
            @click="confirmUnbind"
            class="btn-warning"
          />
        </div>
      </template>
    </Dialog>

    <!-- OAuth 綁定對話框 -->
    <OAuthBindingDialog
      v-model:visible="showOAuthBindingDialog"
      :provider="selectedAccount?.platform"
      :provider-name="selectedAccount?.name"
      :provider-icon="selectedAccount?.icon"
      @binding-success="onOAuthBindingSuccess"
      @binding-error="onOAuthBindingError"
    />

    <!-- 使用者名稱變更對話框 -->
    <Dialog
      v-model:visible="showUsernameDialog"
      modal
      header="變更使用者名稱"
      :style="{ width: '600px' }"
      :closable="false"
    >
      <div class="space-y-4">
        <!-- 目前使用者名稱顯示 -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p class="text-sm text-gray-600 dark:text-gray-400">目前使用者名稱</p>
          <p class="text-lg font-medium text-gray-900 dark:text-white">
            {{ userProfile.username }}
          </p>
        </div>

        <!-- 變更限制提示 -->
        <div
          class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-3"
        >
          <div class="flex items-start space-x-2">
            <i class="pi pi-info-circle text-warning-500 mt-0.5"></i>
            <div>
              <p
                class="text-sm font-medium text-warning-800 dark:text-warning-200"
              >
                變更限制
              </p>
              <p class="text-sm text-warning-700 dark:text-warning-300 mt-1">
                使用者名稱一個月只能變更一次，請謹慎選擇。
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="changeUsername" class="space-y-4" novalidate>
          <!-- 新使用者名稱輸入 -->
          <div>
            <label
              for="new-username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              新使用者名稱
            </label>
            <div class="flex space-x-2">
              <InputText
                id="new-username"
                v-model="usernameForm.newUsername"
                name="newUsername"
                type="text"
                autocomplete="username"
                data-testid="new-username-input"
                placeholder="輸入新使用者名稱"
                class="flex-1"
                :class="{
                  'p-success': usernameForm.availability === true,
                  'p-error': usernameForm.availability === false,
                }"
                :invalid="!!usernameForm.errors.newUsername"
                @input="handleUsernameInput"
                @blur="checkUsernameAvailability"
                aria-describedby="new-username-error"
                :aria-invalid="!!usernameForm.errors.newUsername"
              />
              <Button
                type="button"
                label="檢查"
                icon="pi pi-search"
                severity="secondary"
                :loading="usernameForm.checking"
                :disabled="
                  !usernameForm.newUsername ||
                  usernameForm.newUsername === usernameForm.lastChecked
                "
                @click="checkUsernameAvailability"
                data-testid="check-username-button"
                aria-label="檢查使用者名稱可用性"
              />
            </div>

            <!-- 錯誤訊息 -->
            <Message
              v-if="usernameForm.errors.newUsername"
              severity="error"
              size="small"
              variant="simple"
              id="new-username-error"
            >
              {{ usernameForm.errors.newUsername }}
            </Message>

            <!-- 可用性狀態 -->
            <div v-if="usernameForm.availability !== null" class="mt-2">
              <div
                v-if="usernameForm.availability === true"
                class="flex items-center space-x-1 text-success-600 dark:text-success-400"
              >
                <i class="pi pi-check-circle text-sm"></i>
                <span class="text-sm">此使用者名稱可以使用</span>
              </div>
              <div
                v-else
                class="flex items-center space-x-1 text-error-600 dark:text-error-400"
              >
                <i class="pi pi-times-circle text-sm"></i>
                <span class="text-sm">此使用者名稱已被使用</span>
              </div>
            </div>

            <!-- 格式提示 -->
            <small class="text-gray-500 dark:text-gray-400">
              使用者名稱長度需在 5-30
              個字元之間，只能包含小寫英文字母、數字、點號(.)和底線(_)
            </small>
          </div>

          <!-- 目前密碼確認 -->
          <div v-if="userProfile.hasPassword">
            <label
              for="current-password-username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              目前密碼確認
            </label>
            <Password
              id="current-password-username"
              v-model="usernameForm.currentPassword"
              name="currentPassword"
              autocomplete="current-password"
              data-testid="current-password-username-input"
              :feedback="false"
              toggleMask
              fluid
              placeholder="輸入目前密碼"
              :invalid="!!usernameForm.errors.currentPassword"
              aria-describedby="current-password-username-error"
              :aria-invalid="!!usernameForm.errors.currentPassword"
            />
            <Message
              v-if="usernameForm.errors.currentPassword"
              severity="error"
              size="small"
              variant="simple"
              id="current-password-username-error"
            >
              {{ usernameForm.errors.currentPassword }}
            </Message>
          </div>
          <!-- 如果沒有密碼，顯示提示 -->
          <div
            v-else
            class="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-3"
          >
            <div class="flex items-start space-x-2">
              <i class="pi pi-exclamation-triangle text-warning-500 mt-0.5"></i>
              <div>
                <p
                  class="text-sm font-medium text-warning-800 dark:text-warning-200"
                >
                  無法變更使用者名稱
                </p>
                <p class="text-sm text-warning-700 dark:text-warning-300 mt-1">
                  社群帳號登入的用戶需要先設定密碼才能變更使用者名稱
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            label="取消"
            severity="secondary"
            @click="closeUsernameDialog"
            class="btn-secondary"
          />
          <Button
            label="變更使用者名稱"
            icon="pi pi-check"
            @click="changeUsername"
            :loading="usernameForm.loading"
            :disabled="!canSubmitUsernameChange || !userProfile.hasPassword"
            class="btn-primary"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/themeStore'
import userService from '@/services/userService'
import uploadService from '@/services/uploadService'
import verificationService from '@/services/verificationService'
import privacyConsentService from '@/services/privacyConsentService'
import preferencesService from '@/services/preferencesService'
import { optimizeOAuthResourceLoading } from '@/utils/oauthUtils'
import OAuthBindingDialog from '@/components/OAuthBindingDialog.vue'

// PrimeVue 組件
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Avatar from 'primevue/avatar'

// 元件名稱
defineOptions({
  name: 'SettingsPage',
})

// 全域 toast 服務
const toast = useToast()

const router = useRouter()

// 響應式資料
const activeTabIndex = ref('0')
const showEmailDialog = ref(false)
const showDeleteDialog = ref(false)
const showUnbindDialog = ref(false)
const showUsernameDialog = ref(false)
const showOAuthBindingDialog = ref(false)
const selectedAccount = ref(null)
const avatarInput = ref(null)

// 設定區塊
const sections = ref([
  { id: 'account', title: '帳號管理', icon: 'pi pi-user' },
  { id: 'profile', title: '個人資訊', icon: 'pi pi-id-card' },
  { id: 'notifications', title: '通知偏好', icon: 'pi pi-bell' },
  { id: 'preferences', title: '內容偏好', icon: 'pi pi-cog' },
  { id: 'privacy', title: '隱私設定', icon: 'pi pi-shield' },
])

// 使用者資料
const userProfile = reactive({
  username: '',
  email: '',
  emailVerified: false,
  displayName: '',
  avatar: null,
  gender: '',
  birthday: null,
  bio: '',
  hasPassword: false, // 新增：是否有密碼
})

// 重新發送驗證信狀態
const isResendingVerification = ref(false)

// 暫存的頭像檔案
const tempAvatarFile = ref(null)

// 封面圖片相關
const coverImageInput = ref(null)
const isUploadingCoverImage = ref(false)

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

// 使用者名稱變更表單
const usernameForm = reactive({
  newUsername: '',
  currentPassword: '',
  loading: false,
  checking: false,
  errors: {},
  availability: null, // null: 未檢查, true: 可用, false: 不可用
  lastChecked: '', // 記錄最後檢查的 username
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

// 內容偏好（主題同步使用全域 store）
const themeStore = useThemeStore()

// 使用者偏好設定
const userPreferences = reactive({
  theme: 'auto',
  language: 'zh-TW',
})

// 使用 computed 來確保與 themeStore 的同步
const themeMode = computed({
  get: () => themeStore.theme,
  set: (val) => {
    themeStore.setTheme(val)
  },
})

// 頭像顯示 URL（處理預覽和正式頭像）
const avatarDisplayUrl = computed(() => {
  // 如果是 blob URL（預覽），直接使用
  if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
    return userProfile.avatar
  }

  // 如果有正式頭像，使用正式頭像
  if (
    userProfile.avatar &&
    typeof userProfile.avatar === 'string' &&
    userProfile.avatar.trim().length > 0
  ) {
    return userProfile.avatar
  }

  // 如果沒有頭像，使用預設頭像
  const seed =
    userProfile.username && userProfile.username.trim().length > 0
      ? encodeURIComponent(userProfile.username)
      : 'default'
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed}`
})

// const preferencesForm = reactive({
//   loading: false,
// })

// 處理主題變化（同步到全域 store）
const handleThemeChange = (newTheme) => {
  themeStore.setTheme(newTheme)
  // 同時更新偏好設定中的主題
  userPreferences.theme = newTheme
}

// 初始化主題設定
onMounted(async () => {
  // 移除重複的主題初始化，避免循環依賴
  // preferences.themeMode 已經在 reactive 初始化時與 themeStore.theme 同步

  // 優化 OAuth 流程中的資源載入
  optimizeOAuthResourceLoading()

  // 載入使用者資料
  await loadUserProfile()

  // 載入隱私設定（使用雙向同步）
  await loadCurrentConsent()

  // 載入偏好設定
  await loadUserPreferences()

  // 檢查 URL 中是否有驗證 token，如果有則重定向到驗證頁面
  const urlParams = new URLSearchParams(window.location.search)
  const verificationToken = urlParams.get('token')
  if (verificationToken) {
    router.push(`/verify?token=${verificationToken}`)
    return
  }

  // 處理 OAuth 回調
  await handleOAuthCallback()

  // 改善密碼管理工具的相容性
  setupPasswordManagerCompatibility()
})

// 改善密碼管理工具相容性的函數
const setupPasswordManagerCompatibility = () => {
  // 監聽密碼表單錯誤變化，更新 ARIA 屬性
  watch(
    () => passwordForm.errors,
    (newErrors) => {
      // 更新所有密碼輸入欄位的 aria-invalid 屬性
      const passwordInputs = document.querySelectorAll(
        '.p-password-input, input[type="password"]',
      )
      passwordInputs.forEach((input) => {
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

  // 監聽電子信箱表單錯誤變化
  watch(
    () => emailForm.errors,
    (newErrors) => {
      const emailInputs = document.querySelectorAll(
        'input[type="email"], .p-password-input',
      )
      emailInputs.forEach((input) => {
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

  // 監聽使用者名稱表單錯誤變化
  watch(
    () => usernameForm.errors,
    (newErrors) => {
      const usernameInputs = document.querySelectorAll(
        'input[type="text"], .p-password-input',
      )
      usernameInputs.forEach((input) => {
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

  // 監聽個人資料表單錯誤變化
  watch(
    () => profileForm.errors,
    (newErrors) => {
      const profileInputs = document.querySelectorAll(
        'input, textarea, .p-dropdown',
      )
      profileInputs.forEach((input) => {
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

  // 監聽刪除表單錯誤變化
  watch(
    () => deleteForm.errors,
    (newErrors) => {
      const deleteInputs = document.querySelectorAll('input')
      deleteInputs.forEach((input) => {
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
}

// 組件卸載時清理預覽 URL
onUnmounted(() => {
  if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
    URL.revokeObjectURL(userProfile.avatar)
  }
})

// 載入使用者資料
const loadUserProfile = async () => {
  try {
    const response = await userService.getMe()
    const userData = response.data.user || response.data

    // 更新使用者資料
    Object.assign(userProfile, {
      username: userData.username || '',
      email: userData.email || '',
      emailVerified: userData.email_verified || userData.emailVerified || false,
      displayName: userData.display_name || userData.displayName || '',
      // 使用自定義頭像
      avatar: userData.avatar || null,
      // 封面圖片
      cover_image: userData.cover_image || null,
      gender: userData.gender || '',
      birthday: userData.birthday ? new Date(userData.birthday) : null,
      bio: userData.bio || '',
    })

    // 獲取密碼狀態
    await loadPasswordStatus()

    // 載入通知設定（從後端）
    if (userData.notificationSettings) {
      Object.assign(notificationSettings, userData.notificationSettings)
    } else {
      // 如果後端沒有，嘗試從 localStorage 載入
      const savedNotificationSettings = localStorage.getItem(
        'notificationSettings',
      )
      if (savedNotificationSettings) {
        try {
          const parsed = JSON.parse(savedNotificationSettings)
          Object.assign(notificationSettings, parsed)
        } catch (e) {
          console.error('解析通知設定失敗:', e)
        }
      }
    }

    // 載入偏好設定（從後端）
    if (userData.preferences) {
      // 只載入非主題相關的偏好設定
      if (userData.preferences.theme) {
        userPreferences.theme = userData.preferences.theme
      }
      // 主題模式由 themeStore 管理，不從後端載入
    } else {
      // 如果後端沒有，嘗試從 localStorage 載入
      const savedPreferences = localStorage.getItem('userPreferences')
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          if (parsed.theme) {
            userPreferences.theme = parsed.theme
          }
          // 主題模式由 themeStore 管理，不從 localStorage 載入
        } catch (e) {
          console.error('解析偏好設定失敗:', e)
        }
      }
    }

    // 更新社群帳號狀態
    updateSocialAccountsStatus(userData)

    // 獲取詳細的綁定狀態
    await loadBindStatus()
  } catch (error) {
    console.error('載入使用者資料失敗:', error)

    // 檢查是否為認證錯誤
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.add({
        severity: 'error',
        summary: '認證失敗',
        detail: '請重新登入以繼續使用',
        life: 3000,
      })

      // 重定向到登入頁面
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '載入使用者資料失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  }
}

// 載入密碼狀態
const loadPasswordStatus = async () => {
  try {
    const response = await userService.getPasswordStatus()
    if (response.data && response.data.success) {
      userProfile.hasPassword = response.data.hasPassword
    }
  } catch (error) {
    console.error('載入密碼狀態失敗:', error)
    // 如果無法獲取密碼狀態，預設為 false
    userProfile.hasPassword = false
  }
}

// 載入使用者偏好設定
const loadUserPreferences = async () => {
  try {
    const response = await preferencesService.getPreferences()

    if (response.data && response.data.success) {
      const preferences = response.data.data
      // 更新偏好設定
      if (preferences.theme) {
        userPreferences.theme = preferences.theme
      }
      if (preferences.language) {
        userPreferences.language = preferences.language
      }
    }
  } catch (error) {
    console.error('載入偏好設定失敗:', error)
  }
}

// 更新社群帳號狀態
const updateSocialAccountsStatus = (userData) => {
  socialAccounts.value.forEach((account) => {
    const socialIdField = `${account.platform}_id`
    const socialEmailField = `${account.platform}_email`
    const socialNameField = `${account.platform}_name`

    account.connected = !!userData[socialIdField]

    // 如果有綁定，從對應欄位獲取資訊
    if (account.connected) {
      account.email = userData[socialEmailField] || userData.email || ''
      account.displayName = userData[socialNameField] || account.name
    } else {
      account.email = ''
      account.displayName = account.name
    }
  })
}

// 載入綁定狀態
const loadBindStatus = async () => {
  try {
    const response = await userService.getBindStatus()
    if (response.data && response.data.bindStatus) {
      // 更新社群帳號的綁定狀態
      socialAccounts.value.forEach((account) => {
        const bindStatus = response.data.bindStatus[account.platform]
        if (bindStatus !== undefined) {
          account.connected = bindStatus
        }
      })
    }
  } catch (error) {
    console.error('載入綁定狀態失敗:', error)
    // 不顯示錯誤訊息，因為這不是關鍵功能
  }
}

// 確認解除綁定
const confirmUnbind = async () => {
  if (!selectedAccount.value) return

  try {
    await userService.unbindSocial(selectedAccount.value.platform)
    selectedAccount.value.connected = false
    selectedAccount.value.email = ''
    selectedAccount.value.displayName = selectedAccount.value.name

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `${selectedAccount.value.name} 帳號已解除綁定`,
      life: 3000,
    })
  } catch (error) {
    console.error('社群帳號解除綁定失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '解除綁定失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    showUnbindDialog.value = false
    selectedAccount.value = null
  }
}

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
    email: '',
    icon: 'pi pi-google',
    connected: false,
    loading: false,
  },
  // {
  //   platform: 'facebook',
  //   name: 'Facebook',
  //   email: '',
  //   icon: 'pi pi-facebook',
  //   connected: false,
  //   loading: false,
  // },
  {
    platform: 'discord',
    name: 'Discord',
    email: '',
    icon: 'pi pi-discord',
    connected: false,
    loading: false,
  },
  {
    platform: 'twitter',
    name: 'Twitter',
    email: '',
    icon: 'pi pi-twitter',
    connected: false,
    loading: false,
  },
])

// 選項資料
const genderOptions = ref([
  { label: '不公開', value: '' },
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
  { label: '其他', value: 'other' },
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

// 處理郵件驗證

// 重新發送驗證信
const resendVerificationEmail = async () => {
  if (!userProfile.email) {
    toast.add({
      severity: 'error',
      summary: '發送失敗',
      detail: '沒有電子信箱地址，無法發送驗證信',
      life: 3000,
    })
    return
  }

  isResendingVerification.value = true
  try {
    await verificationService.resendVerificationEmail(userProfile.email)
    toast.add({
      severity: 'success',
      summary: '發送成功',
      detail: '驗證郵件已重新發送，請檢查您的信箱',
      life: 3000,
    })

    // 重新載入使用者資料以確保狀態同步
    await loadUserProfile()
  } catch (error) {
    console.error('重新發送驗證信失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '發送失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '發送失敗',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    isResendingVerification.value = false
  }
}

const setPassword = async () => {
  passwordForm.loading = true
  passwordForm.errors = {}

  // 驗證
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
    // 呼叫 API 設定密碼
    await userService.changePassword({
      newPassword: passwordForm.newPassword,
    })

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '密碼已成功設定',
      life: 3000,
    })

    // 清空表單
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    // 重新載入使用者資料以更新 hasPassword 狀態
    await loadUserProfile()
  } catch (error) {
    console.error('密碼設定失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '密碼設定失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    passwordForm.loading = false
  }
}

const changePassword = async () => {
  passwordForm.loading = true
  passwordForm.errors = {}

  // 驗證
  if (userProfile.hasPassword && !passwordForm.currentPassword) {
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
    // 呼叫 API 變更密碼
    const passwordData = {
      newPassword: passwordForm.newPassword,
    }

    // 只有在有密碼的情況下才添加目前密碼參數
    if (userProfile.hasPassword) {
      passwordData.currentPassword = passwordForm.currentPassword
    }

    await userService.changePassword(passwordData)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '密碼已成功變更，請重新登入',
      life: 3000,
    })

    // 清空表單
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    // 重新導向到登入頁面
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  } catch (error) {
    console.error('密碼變更失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '密碼變更失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
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
  if (userProfile.hasPassword && !emailForm.currentPassword) {
    emailForm.errors.currentPassword = '請輸入目前密碼'
  }

  if (Object.keys(emailForm.errors).length > 0) {
    emailForm.loading = false
    return
  }

  try {
    // 呼叫 API 變更電子信箱
    const emailData = {
      newEmail: emailForm.newEmail,
    }

    // 只有在有密碼的情況下才添加密碼參數
    if (userProfile.hasPassword) {
      emailData.currentPassword = emailForm.currentPassword
    }

    const response = await userService.changeEmail(emailData)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: response.data?.message || '電子信箱已成功變更，請重新驗證',
      life: 3000,
    })

    // 更新使用者資料中的電子信箱
    userProfile.email = emailForm.newEmail
    userProfile.emailVerified = false // 重置驗證狀態

    // 重新載入使用者資料以確保資料同步
    await loadUserProfile()

    showEmailDialog.value = false
    emailForm.newEmail = ''
    emailForm.currentPassword = ''
  } catch (error) {
    console.error('電子信箱變更失敗:', error)

    // 更詳細的錯誤處理
    let errorMessage = '電子信箱變更失敗，請稍後再試'

    if (error.response) {
      // 伺服器回應了錯誤狀態碼
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          errorMessage = data?.message || '請求格式錯誤'
          break
        case 401:
          errorMessage = data?.message || '目前密碼不正確'
          break
        case 409:
          errorMessage = data?.message || '此電子信箱已被其他使用者註冊'
          break
        case 422:
          errorMessage = data?.message || '電子信箱格式不正確'
          break
        default:
          errorMessage = data?.message || '電子信箱變更失敗'
      }
    } else if (error.request) {
      // 請求已發出但沒有收到回應
      errorMessage = '無法連接到伺服器，請檢查網路連線'
    } else {
      // 其他錯誤
      errorMessage = error.message || '電子信箱變更失敗'
    }

    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
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
    // 準備要更新的資料
    const updateData = {
      display_name: userProfile.displayName,
      gender: userProfile.gender,
      birthday: userProfile.birthday,
      bio: userProfile.bio,
    }

    // 如果有新的頭像檔案，先上傳
    if (tempAvatarFile.value) {
      // 使用新的頭像上傳端點
      const uploadResponse = await uploadService.uploadAvatar(
        tempAvatarFile.value,
      )

      if (uploadResponse.data.success) {
        // 將頭像 URL 加入更新資料
        updateData.avatar = uploadResponse.data.url

        // 立即更新本地頭像顯示，避免重新載入資料
        userProfile.avatar = uploadResponse.data.url

        // 觸發自定義事件，讓其他組件知道頭像已更新
        window.dispatchEvent(
          new CustomEvent('user-avatar-updated', {
            detail: { avatarUrl: uploadResponse.data.url },
          }),
        )

        // 清除暫存檔案
        tempAvatarFile.value = null
      } else {
        throw new Error('頭像上傳失敗')
      }
    }

    // 如果有封面圖片變更，加入更新資料
    if (userProfile.cover_image !== undefined) {
      updateData.cover_image = userProfile.cover_image
    }

    // 呼叫 API 更新個人資料（不包含頭像，因為頭像已經在上傳時處理了）
    const response = await userService.updateMe(updateData)

    // 更新其他欄位（除了頭像，因為頭像已經在上傳時更新了）
    if (response.data.user) {
      userProfile.displayName =
        response.data.user.display_name ||
        response.data.user.displayName ||
        userProfile.displayName
      userProfile.gender = response.data.user.gender || userProfile.gender
      userProfile.birthday = response.data.user.birthday
        ? new Date(response.data.user.birthday)
        : userProfile.birthday
      userProfile.bio = response.data.user.bio || userProfile.bio
      if (response.data.user.cover_image !== undefined) {
        userProfile.cover_image = response.data.user.cover_image
      }
    }

    // 清理預覽 URL（如果有的話）
    if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(userProfile.avatar)
    }

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '個人資料已成功更新',
      life: 3000,
    })
  } catch (error) {
    console.error('個人資料更新失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '更新失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    profileForm.loading = false
  }
}

const saveNotificationSettings = async () => {
  notificationForm.loading = true

  try {
    // 呼叫 API 儲存通知設定
    await userService.updateMe({
      notificationSettings: notificationSettings,
    })

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '通知設定已儲存',
      life: 3000,
    })
  } catch (error) {
    console.error('通知設定儲存失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '儲存失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    notificationForm.loading = false
  }
}

// 儲存所有偏好設定
// const saveAllPreferences = async () => {
//   preferencesForm.loading = true

//   try {
//     // 儲存主題和語言設定
//     await preferencesService.updateAllPreferences({
//       theme: userPreferences.theme,
//       language: userPreferences.language,
//     })

//     toast.add({
//       severity: 'success',
//       summary: '成功',
//       detail: '偏好設定已儲存',
//       life: 3000,
//     })
//   } catch (error) {
//     console.error('偏好設定儲存失敗:', error)
//     const errorMessage =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       '儲存失敗，請稍後再試'
//     toast.add({
//       severity: 'error',
//       summary: '錯誤',
//       detail: errorMessage,
//       life: 3000,
//     })
//   } finally {
//     preferencesForm.loading = false
//   }
// }

// // 清除所有偏好設定
// const clearAllPreferences = async () => {
//   preferencesForm.loading = true

//   try {
//     await preferencesService.clearPreferences()

//     // 重置為預設值
//     Object.assign(userPreferences, {
//       theme: 'auto',
//       language: 'zh-TW',
//     })

//     toast.add({
//       severity: 'success',
//       summary: '成功',
//       detail: '偏好設定已清除',
//       life: 3000,
//     })
//   } catch (error) {
//     console.error('清除偏好設定失敗:', error)
//     const errorMessage =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       '清除失敗，請稍後再試'
//     toast.add({
//       severity: 'error',
//       summary: '錯誤',
//       detail: errorMessage,
//       life: 3000,
//     })
//   } finally {
//     preferencesForm.loading = false
//   }
// }

const toggleSocialAccount = async (account) => {
  if (account.connected) {
    // 顯示解除綁定確認對話框
    selectedAccount.value = account
    showUnbindDialog.value = true
  } else {
    // 綁定邏輯 - 使用新的 OAuth 對話框
    selectedAccount.value = account
    showOAuthBindingDialog.value = true
  }
}

// 處理 OAuth 回調
const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const oauthCode = urlParams.get('code')
  const oauthState = urlParams.get('state')
  const oauthProvider = urlParams.get('provider')
  const oauthError = urlParams.get('error')
  const success = urlParams.get('success')
  const message = urlParams.get('message')

  // 處理綁定回調結果
  if (success !== null) {
    if (success === 'true') {
      toast.add({
        severity: 'success',
        summary: '綁定成功',
        detail: message || '社群帳號綁定成功',
        life: 3000,
      })
    } else {
      const friendly = mapBindErrorMessage(oauthProvider, message)
      toast.add({
        severity: 'error',
        summary: '綁定失敗',
        detail: friendly,
        life: 6000,
      })
    }

    // 重新載入使用者資料以更新綁定狀態
    await loadUserProfile()

    // 清理 URL 參數
    window.history.replaceState({}, document.title, window.location.pathname)
    // 若是錯誤回調，嘗試關閉小視窗（由子視窗發送訊息或由後端統一 close）。
    try {
      window.postMessage({ type: 'oauth_parent_ack' }, window.location.origin)
    } catch {
      /* no-op */
    }
    return
  }

  // 處理傳統的 OAuth 回調（向後相容）
  if (oauthError) {
    toast.add({
      severity: 'error',
      summary: 'OAuth 錯誤',
      detail: mapBindErrorMessage(oauthProvider, oauthError),
      life: 5000,
    })
    // 清理 URL 參數
    window.history.replaceState({}, document.title, window.location.pathname)
    return
  }

  if (oauthCode && oauthProvider) {
    try {
      // 顯示載入提示
      toast.add({
        severity: 'info',
        summary: '處理中',
        detail: `正在處理 ${oauthProvider} 授權...`,
        life: 3000,
      })

      // 呼叫後端 API 處理 OAuth 回調
      await userService.bindSocial(oauthProvider, {
        code: oauthCode,
        state: oauthState,
      })

      // 重新載入使用者資料
      await loadUserProfile()

      toast.add({
        severity: 'success',
        summary: '綁定成功',
        detail: `${oauthProvider} 帳號已成功綁定`,
        life: 3000,
      })

      // 清理 URL 參數
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error) {
      console.error('OAuth 回調處理失敗:', error)
      const status = error.response?.status
      const raw =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      const errorMessage = mapBindErrorMessage(oauthProvider, raw, status)
      toast.add({
        severity: 'error',
        summary: '綁定失敗',
        detail: errorMessage,
        life: 6000,
      })
      // 清理 URL 參數
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }
}

// 綁定錯誤訊息格式化
const mapBindErrorMessage = (provider, err, status) => {
  const providerNameMap = {
    google: 'Google',
    // facebook: 'Facebook',
    discord: 'Discord',
    twitter: 'Twitter',
  }
  const name = providerNameMap[provider] || '社群'
  const text = typeof err === 'string' ? err : err?.message || ''

  // 常見狀態碼對應
  if (status === 409 || /已被其他用戶綁定|already bound/i.test(text)) {
    return `此 ${name} 帳號已被其他用戶綁定。請改用其他 ${name} 帳號，或先至原帳號解除綁定後再重試。`
  }
  if (
    status === 400 ||
    /invalid state|state.*mismatch|bad request/i.test(text)
  ) {
    return '授權流程已過期或驗證碼不正確，請重新發起綁定。'
  }
  if (status === 401 || /unauthorized|未授權/i.test(text)) {
    return '授權未通過或尚未登入，請先登入後再重試。'
  }
  if (status === 403 || /forbidden|權限不足/i.test(text)) {
    return '您沒有執行此綁定操作的權限。'
  }
  if (status === 429 || /too many requests|rate limit/i.test(text)) {
    return '操作過於頻繁，請稍後再試。'
  }
  if (status === 500 || /server error|internal/i.test(text)) {
    return '伺服器發生錯誤，請稍後再試。'
  }

  // 常見文案關鍵字
  if (/permission|scope|未授權存取/i.test(text)) {
    return `未取得必要授權範圍，請在 ${name} 授權頁面允許必要的權限後再試。`
  }

  // 預設回退
  return text || '綁定失敗，請稍後再試'
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
    // 呼叫 API 刪除帳號
    await userService.deleteMe()

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '帳號已刪除',
      life: 3000,
    })

    showDeleteDialog.value = false
    deleteForm.confirmation = ''

    // 重新導向到登入頁面
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  } catch (error) {
    console.error('帳號刪除失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '刪除失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    deleteForm.loading = false
  }
}

const removeAvatar = async () => {
  try {
    // 清理預覽 URL（如果有的話）
    if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(userProfile.avatar)
    }

    // 清除暫存檔案
    tempAvatarFile.value = null

    // 立即呼叫 API 以預設頭像更新 avatar 欄位（avatarUrl 是虛擬欄位）
    await userService.updateMe({
      avatar: null,
    })

    // 更新頭像顯示
    userProfile.avatar = null

    // 觸發自定義事件，讓其他組件知道頭像已移除
    window.dispatchEvent(
      new CustomEvent('user-avatar-updated', {
        detail: { avatarUrl: null },
      }),
    )
  } catch (error) {
    console.error('頭像移除失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '移除失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // 檢查檔案大小 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.add({
          severity: 'error',
          summary: '錯誤',
          detail: '檔案大小不能超過 2MB',
          life: 3000,
        })
        return
      }

      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        toast.add({
          severity: 'error',
          summary: '錯誤',
          detail: '只能上傳圖片檔案',
          life: 3000,
        })
        return
      }

      // 清理舊的預覽 URL
      if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(userProfile.avatar)
      }

      // 暫存檔案，不立即上傳
      tempAvatarFile.value = file

      // 建立預覽 URL
      const previewUrl = URL.createObjectURL(file)
      userProfile.avatar = previewUrl
    } catch (error) {
      console.error('頭像選擇失敗:', error)
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '頭像選擇失敗，請稍後再試',
        life: 3000,
      })
    }
  }
}

// 處理封面圖片變更
const handleCoverImageChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '封面圖片大小不能超過 5MB',
        life: 3000,
      })
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'error',
        summary: '錯誤',
        detail: '只能上傳圖片檔案',
        life: 3000,
      })
      return
    }

    isUploadingCoverImage.value = true

    // 上傳封面圖片
    const response = await userService.uploadCoverImage(file)

    if (response.data.success) {
      // 更新用戶資料中的封面圖片
      userProfile.cover_image = response.data.url

      // 觸發自定義事件，讓其他組件知道封面圖片已更新
      window.dispatchEvent(
        new CustomEvent('user-cover-updated', {
          detail: { coverImageUrl: response.data.url },
        }),
      )

      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '封面圖片已更新',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('封面圖片上傳失敗:', error)
    const errorMessage = error.response?.data?.message || '封面圖片上傳失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    isUploadingCoverImage.value = false
    // 清空 input 值，允許重複上傳相同檔案
    event.target.value = ''
  }
}

// 移除封面圖片
const removeCoverImage = async () => {
  try {
    // 立即呼叫 API 移除封面圖片
    await userService.updateMe({
      cover_image: null,
    })

    // 更新封面圖片顯示
    userProfile.cover_image = null

    // 觸發自定義事件，讓其他組件知道封面圖片已移除
    window.dispatchEvent(
      new CustomEvent('user-cover-updated', {
        detail: { coverImageUrl: null },
      }),
    )

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '封面圖片已移除',
      life: 3000,
    })
  } catch (error) {
    console.error('封面圖片移除失敗:', error)
    const errorMessage = error.response?.data?.message || '封面圖片移除失敗'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  }
}

// 使用者名稱變更相關方法
const handleUsernameInput = () => {
  // 清除之前的檢查結果
  usernameForm.availability = null
  usernameForm.errors.newUsername = ''

  // 基本格式驗證
  if (usernameForm.newUsername) {
    if (
      usernameForm.newUsername.length < 5 ||
      usernameForm.newUsername.length > 30
    ) {
      usernameForm.errors.newUsername = '使用者名稱長度需在 5-30 個字元之間'
    } else if (!/^[a-z0-9._]+$/.test(usernameForm.newUsername)) {
      usernameForm.errors.newUsername =
        '使用者名稱只能包含小寫英文字母、數字、點號(.)和底線(_)'
    } else if (usernameForm.newUsername === userProfile.username) {
      usernameForm.errors.newUsername = '新使用者名稱不能與目前使用者名稱相同'
    }
  }
}

const checkUsernameAvailability = async () => {
  if (!usernameForm.newUsername) {
    usernameForm.errors.newUsername = '請輸入使用者名稱'
    usernameForm.availability = null
    return
  }

  // 基本格式驗證
  if (
    usernameForm.newUsername.length < 5 ||
    usernameForm.newUsername.length > 30
  ) {
    usernameForm.errors.newUsername = '使用者名稱長度需在 5-30 個字元之間'
    usernameForm.availability = null
    return
  }

  if (!/^[a-z0-9._]+$/.test(usernameForm.newUsername)) {
    usernameForm.errors.newUsername =
      '使用者名稱只能包含小寫英文字母、數字、點號(.)和底線(_)'
    usernameForm.availability = null
    return
  }

  if (usernameForm.newUsername === userProfile.username) {
    usernameForm.errors.newUsername = '新使用者名稱不能與目前使用者名稱相同'
    usernameForm.availability = null
    return
  }

  usernameForm.checking = true
  usernameForm.errors.newUsername = ''
  usernameForm.availability = null

  try {
    const response = await userService.checkUsernameAvailability(
      usernameForm.newUsername,
    )
    usernameForm.availability = response.data.available
    usernameForm.lastChecked = usernameForm.newUsername

    if (!response.data.available) {
      usernameForm.errors.newUsername = '此使用者名稱已被使用'
    }
  } catch (error) {
    console.error('檢查使用者名稱可用性失敗:', error)
    const errorMessage = error.response?.data?.message || '檢查失敗，請稍後再試'
    usernameForm.errors.newUsername = errorMessage
    usernameForm.availability = null
  } finally {
    usernameForm.checking = false
  }
}

const changeUsername = async () => {
  usernameForm.loading = true
  usernameForm.errors = {}

  // 驗證
  if (!usernameForm.newUsername) {
    usernameForm.errors.newUsername = '請輸入新使用者名稱'
  } else if (usernameForm.availability !== true) {
    usernameForm.errors.newUsername = '請先檢查使用者名稱是否可用'
  }
  if (userProfile.hasPassword && !usernameForm.currentPassword) {
    usernameForm.errors.currentPassword = '請輸入目前密碼'
  }

  if (Object.keys(usernameForm.errors).length > 0) {
    usernameForm.loading = false
    return
  }

  try {
    // 呼叫 API 變更使用者名稱
    const usernameData = {
      username: usernameForm.newUsername,
    }

    // 只有在有密碼的情況下才添加密碼參數
    if (userProfile.hasPassword) {
      usernameData.currentPassword = usernameForm.currentPassword
    }

    const response = await userService.changeUsername(usernameData)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: response.data?.message || '使用者名稱已成功變更',
      life: 3000,
    })

    // 更新使用者資料中的使用者名稱
    userProfile.username = usernameForm.newUsername

    // 重新載入使用者資料以確保資料同步
    await loadUserProfile()

    showUsernameDialog.value = false
    usernameForm.newUsername = ''
    usernameForm.currentPassword = ''
    usernameForm.lastChecked = ''
    usernameForm.availability = null
  } catch (error) {
    console.error('使用者名稱變更失敗:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '使用者名稱變更失敗，請稍後再試'
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: errorMessage,
      life: 3000,
    })
  } finally {
    usernameForm.loading = false
  }
}

const closeUsernameDialog = () => {
  showUsernameDialog.value = false
  usernameForm.newUsername = ''
  usernameForm.currentPassword = ''
  usernameForm.lastChecked = ''
  usernameForm.availability = null
  usernameForm.errors = {}
  usernameForm.checking = false
}

// OAuth 綁定成功處理
const onOAuthBindingSuccess = async () => {
  // 重新載入使用者資料以更新綁定狀態
  await loadUserProfile()

  // 清理選中的帳號
  selectedAccount.value = null
}

// OAuth 綁定錯誤處理
const onOAuthBindingError = (errorMessage) => {
  console.error('OAuth 綁定失敗:', errorMessage)
  // 錯誤訊息已經在對話框中顯示，這裡可以添加額外的處理邏輯

  // 清理選中的帳號
  selectedAccount.value = null
}

// 開啟調試對話框
// 已移除調試對話框與相關按鈕

const canSubmitUsernameChange = computed(() => {
  return (
    userProfile.hasPassword &&
    usernameForm.newUsername &&
    usernameForm.currentPassword &&
    usernameForm.availability === true &&
    !usernameForm.errors.newUsername &&
    !usernameForm.errors.currentPassword
  )
})

// 隱私設定相關數據
const currentConsent = ref(null)
const cookiePreferences = ref({
  functional: true,
  analytics: true,
})

// 檢查是否有變更
const hasChanges = computed(() => {
  if (!currentConsent.value) return false
  return (
    cookiePreferences.value.functional !== currentConsent.value.functional ||
    cookiePreferences.value.analytics !== currentConsent.value.analytics
  )
})

// 載入當前設定（使用雙向同步）
const loadCurrentConsent = async () => {
  try {
    // 使用雙向同步獲取最新的同意資料
    const syncedConsent = await privacyConsentService.syncConsentData()

    if (syncedConsent) {
      currentConsent.value = syncedConsent
      cookiePreferences.value = {
        functional: syncedConsent.functional,
        analytics: syncedConsent.analytics,
      }
    } else {
      currentConsent.value = null
      cookiePreferences.value = {
        functional: true,
        analytics: true,
      }
    }
  } catch (error) {
    console.error('載入同意設定失敗:', error)
    // 同步失敗時，使用本地資料作為備用
    const consent = localStorage.getItem('privacy-consent')
    if (consent) {
      currentConsent.value = JSON.parse(consent)
      cookiePreferences.value = {
        functional: currentConsent.value.functional,
        analytics: currentConsent.value.analytics,
      }
    }
  }
}

// 儲存設定
const saveSettings = async () => {
  const consent = {
    necessary: true,
    functional: cookiePreferences.value.functional,
    analytics: cookiePreferences.value.analytics,
    timestamp: new Date().toISOString(),
  }

  try {
    // 同步到後端
    await privacyConsentService.createConsent({
      necessary: consent.necessary,
      functional: consent.functional,
      analytics: consent.analytics,
      consentVersion: '1.0',
      consentSource: 'settings',
    })

    // 更新本地儲存
    localStorage.setItem('privacy-consent', JSON.stringify(consent))
    currentConsent.value = consent

    toast.add({
      severity: 'success',
      summary: '設定已同步',
      detail: '隱私設定已成功同步到伺服器',
      life: 3000,
    })
  } catch (error) {
    console.error('隱私設定同步失敗:', {
      error: error.message,
      status: error.response?.status,
    })

    // 根據錯誤類型提供不同的錯誤訊息
    let errorDetail = '隱私設定同步失敗，但已儲存在本地'

    if (error.message === '認證失敗，請重新登入') {
      errorDetail = '認證已過期，請重新登入後再試'
    } else if (error.message === '伺服器暫時無法處理請求，請稍後再試') {
      errorDetail = '伺服器暫時無法處理請求，請稍後再試'
    } else if (error.message === '資料格式錯誤，請檢查設定值') {
      errorDetail = '資料格式錯誤，請檢查設定值'
    }

    toast.add({
      severity: 'error',
      summary: '同步失敗',
      detail: errorDetail,
      life: 5000,
    })

    // 即使同步失敗，也要儲存到本地
    localStorage.setItem('privacy-consent', JSON.stringify(consent))
    currentConsent.value = consent
  }
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '未設定'
  return new Date(timestamp).toLocaleString('zh-TW')
}
</script>

<style scoped lang="scss">
h3 {
  margin-top: 1.5rem;
}
</style>

<route lang="yaml">
meta:
  title: '設定'
  login: true
  admin: false
</route>
