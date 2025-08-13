<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminSettings',
})

import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// 系統設定數據
const settings = ref({
  // 基本設定
  siteName: '迷因典',
  siteDescription: '最大的迷因分享平台',
  allowRegistration: true,
  requireEmailVerification: true,
  maxFileSize: 10,
  enableNotifications: true,

  // 推薦系統設定
  recommendation: {
    collaborativeWeight: 0.6,
    contentBasedWeight: 0.3,
    popularityWeight: 0.1,
    minInteractions: 5,
    maxRecommendations: 20,
    updateInterval: 3600,
  },

  // 內容審核設定
  moderation: {
    autoModeration: true,
    requireApproval: false,
    profanityFilter: true,
    imageModeration: true,
    maxReportsBeforeHide: 3,
    autoHideThreshold: 0.8,
  },

  // 通知設定
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    mentionNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    systemNotifications: true,
  },

  // 效能設定
  performance: {
    cacheEnabled: true,
    cacheTTL: 3600,
    imageOptimization: true,
    lazyLoading: true,
    compressionEnabled: true,
  },
})

const saveSettings = async () => {
  try {
    // TODO: 整合實際的設定服務
    // await adminService.updateSystemConfig(settings.value)

    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '設定已儲存',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存設定失敗',
      life: 3000,
    })
  }
}

const resetSettings = () => {
  // 重置為預設值
  settings.value = {
    siteName: '迷因典',
    siteDescription: '最大的迷因分享平台',
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: 10,
    enableNotifications: true,
    recommendation: {
      collaborativeWeight: 0.6,
      contentBasedWeight: 0.3,
      popularityWeight: 0.1,
      minInteractions: 5,
      maxRecommendations: 20,
      updateInterval: 3600,
    },
    moderation: {
      autoModeration: true,
      requireApproval: false,
      profanityFilter: true,
      imageModeration: true,
      maxReportsBeforeHide: 3,
      autoHideThreshold: 0.8,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      mentionNotifications: true,
      likeNotifications: true,
      commentNotifications: true,
      systemNotifications: true,
    },
    performance: {
      cacheEnabled: true,
      cacheTTL: 3600,
      imageOptimization: true,
      lazyLoading: true,
      compressionEnabled: true,
    },
  }

  toast.add({
    severity: 'info',
    summary: '已重置',
    detail: '設定已重置為預設值',
    life: 3000,
  })
}

// 計算推薦權重總和
const totalWeight = computed(() => {
  return (
    settings.value.recommendation.collaborativeWeight +
    settings.value.recommendation.contentBasedWeight +
    settings.value.recommendation.popularityWeight
  )
})
</script>

<template>
  <div class="admin-settings">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">系統設定</h1>
      <div class="flex gap-2">
        <Button
          label="重置設定"
          icon="pi pi-refresh"
          severity="secondary"
          @click="resetSettings"
        />
        <Button label="儲存設定" icon="pi pi-save" @click="saveSettings" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基本設定 -->
      <Card>
        <template #title>基本設定</template>
        <template #content>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">網站名稱</label>
              <InputText v-model="settings.siteName" class="w-full" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">網站描述</label>
              <Textarea
                v-model="settings.siteDescription"
                class="w-full"
                rows="3"
              />
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.allowRegistration" />
              <label class="text-sm">允許用戶註冊</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.requireEmailVerification" />
              <label class="text-sm">需要電子郵件驗證</label>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2"
                >最大檔案大小 (MB)</label
              >
              <InputNumber
                v-model="settings.maxFileSize"
                class="w-full"
                :min="1"
                :max="100"
              />
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.enableNotifications" />
              <label class="text-sm">啟用通知系統</label>
            </div>
          </div>
        </template>
      </Card>

      <!-- 推薦系統設定 -->
      <Card>
        <template #title>推薦系統設定</template>
        <template #content>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">協同過濾權重</label>
              <Slider
                v-model="settings.recommendation.collaborativeWeight"
                :min="0"
                :max="1"
                :step="0.1"
                class="w-full"
              />
              <div class="text-sm text-gray-600">
                {{ settings.recommendation.collaborativeWeight }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">內容基礎權重</label>
              <Slider
                v-model="settings.recommendation.contentBasedWeight"
                :min="0"
                :max="1"
                :step="0.1"
                class="w-full"
              />
              <div class="text-sm text-gray-600">
                {{ settings.recommendation.contentBasedWeight }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">熱門度權重</label>
              <Slider
                v-model="settings.recommendation.popularityWeight"
                :min="0"
                :max="1"
                :step="0.1"
                class="w-full"
              />
              <div class="text-sm text-gray-600">
                {{ settings.recommendation.popularityWeight }}
              </div>
            </div>

            <div class="p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <div class="text-sm font-medium">
                權重總和: {{ totalWeight.toFixed(2) }}
              </div>
              <div
                class="text-xs text-gray-600"
                :class="
                  Math.abs(totalWeight - 1) > 0.01
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                {{
                  Math.abs(totalWeight - 1) > 0.01
                    ? '權重總和應為 1.0'
                    : '權重設定正確'
                }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">最小互動數</label>
              <InputNumber
                v-model="settings.recommendation.minInteractions"
                class="w-full"
                :min="1"
                :max="100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">最大推薦數</label>
              <InputNumber
                v-model="settings.recommendation.maxRecommendations"
                class="w-full"
                :min="5"
                :max="100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2"
                >更新間隔 (秒)</label
              >
              <InputNumber
                v-model="settings.recommendation.updateInterval"
                class="w-full"
                :min="300"
                :max="86400"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 內容審核設定 -->
      <Card>
        <template #title>內容審核設定</template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.moderation.autoModeration" />
              <label class="text-sm">啟用自動審核</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.moderation.requireApproval" />
              <label class="text-sm">需要人工審核</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.moderation.profanityFilter" />
              <label class="text-sm">啟用髒話過濾</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.moderation.imageModeration" />
              <label class="text-sm">啟用圖片審核</label>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2"
                >隱藏前最大檢舉數</label
              >
              <InputNumber
                v-model="settings.moderation.maxReportsBeforeHide"
                class="w-full"
                :min="1"
                :max="10"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">自動隱藏閾值</label>
              <Slider
                v-model="settings.moderation.autoHideThreshold"
                :min="0"
                :max="1"
                :step="0.1"
                class="w-full"
              />
              <div class="text-sm text-gray-600">
                {{ settings.moderation.autoHideThreshold }}
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 通知設定 -->
      <Card>
        <template #title>通知設定</template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <InputSwitch
                v-model="settings.notifications.emailNotifications"
              />
              <label class="text-sm">電子郵件通知</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.notifications.pushNotifications" />
              <label class="text-sm">推播通知</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch
                v-model="settings.notifications.mentionNotifications"
              />
              <label class="text-sm">提及通知</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.notifications.likeNotifications" />
              <label class="text-sm">點讚通知</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch
                v-model="settings.notifications.commentNotifications"
              />
              <label class="text-sm">評論通知</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch
                v-model="settings.notifications.systemNotifications"
              />
              <label class="text-sm">系統通知</label>
            </div>
          </div>
        </template>
      </Card>

      <!-- 效能設定 -->
      <Card class="lg:col-span-2">
        <template #title>效能設定</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <InputSwitch v-model="settings.performance.cacheEnabled" />
                <label class="text-sm">啟用快取</label>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2"
                  >快取 TTL (秒)</label
                >
                <InputNumber
                  v-model="settings.performance.cacheTTL"
                  class="w-full"
                  :min="60"
                  :max="86400"
                />
              </div>

              <div class="flex items-center gap-2">
                <InputSwitch v-model="settings.performance.imageOptimization" />
                <label class="text-sm">圖片優化</label>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <InputSwitch v-model="settings.performance.lazyLoading" />
                <label class="text-sm">懶載入</label>
              </div>

              <div class="flex items-center gap-2">
                <InputSwitch
                  v-model="settings.performance.compressionEnabled"
                />
                <label class="text-sm">啟用壓縮</label>
              </div>

              <div class="p-3 bg-green-50 dark:bg-green-900 rounded">
                <div class="text-sm font-medium">效能建議</div>
                <div class="text-xs text-gray-600 mt-1">
                  • 建議啟用快取以提升載入速度<br />
                  • 圖片優化可減少頻寬使用<br />
                  • 懶載入可改善初始載入時間
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 系統狀態 -->
    <Card class="mt-6">
      <template #title>系統狀態</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-green-50 dark:bg-green-900 rounded">
            <div class="text-2xl font-bold text-green-600">正常</div>
            <div class="text-sm text-gray-600">系統狀態</div>
          </div>
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded">
            <div class="text-2xl font-bold text-blue-600">98.5%</div>
            <div class="text-sm text-gray-600">系統可用性</div>
          </div>
          <div class="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded">
            <div class="text-2xl font-bold text-purple-600">1.2s</div>
            <div class="text-sm text-gray-600">平均響應時間</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '系統設定'
  admin: true
</route>
