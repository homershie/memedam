<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'AdminSettings'
})

// Route meta for admin protection
definePageMeta({
  layout: 'admin',
  admin: true,
  title: '系統設定'
})

import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// 系統設定數據
const settings = ref({
  siteName: '迷因典',
  siteDescription: '最大的迷因分享平台',
  allowRegistration: true,
  requireEmailVerification: true,
  maxFileSize: 10,
  enableNotifications: true
})

const saveSettings = async () => {
  try {
    // TODO: 整合實際的設定服務
    // await adminService.updateSystemConfig(settings.value)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '設定已儲存',
      life: 3000
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存設定失敗',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="admin-settings">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        系統設定
      </h1>
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
              <Textarea v-model="settings.siteDescription" class="w-full" rows="3" />
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.allowRegistration" />
              <label class="text-sm">允許用戶註冊</label>
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.requireEmailVerification" />
              <label class="text-sm">需要電子郵件驗證</label>
            </div>
          </div>
        </template>
      </Card>

      <!-- 上傳設定 -->
      <Card>
        <template #title>上傳設定</template>
        <template #content>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">最大檔案大小 (MB)</label>
              <InputNumber v-model="settings.maxFileSize" class="w-full" :min="1" :max="100" />
            </div>

            <div class="flex items-center gap-2">
              <InputSwitch v-model="settings.enableNotifications" />
              <label class="text-sm">啟用通知系統</label>
            </div>
          </div>
        </template>
      </Card>

      <!-- 推薦系統設定 -->
      <Card class="lg:col-span-2">
        <template #title>推薦系統設定</template>
        <template #content>
          <div class="text-center py-8">
            <i class="pi pi-cog text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600 dark:text-gray-400">推薦系統設定將在後續實作中加入</p>
          </div>
        </template>
      </Card>
    </div>

    <div class="mt-6 flex justify-end">
      <Button label="儲存設定" icon="pi pi-save" @click="saveSettings" />
    </div>
  </div>
</template>