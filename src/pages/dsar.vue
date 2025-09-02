<template>
  <div class="w-full mx-auto px-6 py-10 space-y-12 overflow-y-auto">
    <!-- 頁面標題 -->
    <div class="mb-8 max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-4">資料主體存取請求</h2>
      <p class="text-surface-600 dark:text-surface-400">
        最後更新：{{ lastUpdated }}
      </p>
    </div>

    <!-- DSAR 內容 -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 簡介 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            資料主體存取請求 (Data Subject Access Request, DSAR)
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              為符合歐盟《一般資料保護規範》（GDPR）與其他隱私法，MemeDam
              提供使用者以下權利：
            </p>
          </div>
        </div>
      </div>

      <!-- 1. 申請方式 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">1. 申請方式</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>您可透過以下方式提交資料請求：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Email 或表單：</strong>寄送至
                <a
                  href="mailto:support@memedam.com"
                  class="text-primary-600 hover:text-primary-700 underline"
                  >support@memedam.com</a
                >
                或
                <router-link
                  to="/contact"
                  class="text-primary-600 hover:text-primary-700 underline"
                >
                  聯絡表單
                </router-link>
              </li>
            </ul>

            <h5 class="text-lg font-semibold mt-4">必須提供：</h5>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>您的 <strong>使用者名稱（username）</strong></li>
              <li>您的 <strong>註冊電子郵件（email）</strong></li>
            </ul>
            <p>我們將透過您提供的信箱與您聯絡，以確認身份並回覆申請。</p>
          </div>
        </div>
      </div>

      <!-- 2. 可申請的權利 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">2. 可申請的權利</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>您有權：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>存取並下載您的個人資料</li>
              <li>更正不正確或不完整的資料</li>
              <li>刪除您的個人資料（Right to Erasure）</li>
              <li>限制我們處理您的資料</li>
              <li>要求資料可攜（提供結構化格式，轉移至其他服務）</li>
              <li>反對我們使用資料於行銷或自動化決策</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. 回覆期限 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">3. 回覆期限</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>我們將於 <strong>30 天內</strong> 回覆並處理申請。</li>
              <li>
                若因資料量龐大或技術限制需要延長，會通知您，並於最長
                <strong>60 天內</strong> 完成處理。
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 4. 限制與例外 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">4. 限制與例外</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                若請求涉及他人隱私、法律義務或安全因素，我們可能無法完全滿足。
              </li>
              <li>
                刪除帳號後，部分資料可能因備份或法律規定而短期保留，但不再公開，並會在合理時間內清除。
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5. 資料類型說明 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">5. 資料類型說明</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>您可申請存取的資料類型包括：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>基本個人資料（使用者名稱、電子郵件、顯示名稱等）</li>
              <li>帳號設定與偏好</li>
              <li>上傳的內容與互動記錄</li>
              <li>系統日誌與使用統計</li>
              <li>第三方服務連結資料（如社群帳號綁定）</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 6. 聯絡資訊 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">6. 聯絡資訊</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>如需提交 DSAR 申請或有相關疑問，請透過以下方式聯絡我們：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>電子郵件：</strong>
                <a
                  href="mailto:support@memedam.com"
                  class="text-primary-600 hover:text-primary-700 underline"
                  >support@memedam.com</a
                >
              </li>
              <li>
                <strong>聯絡表單：</strong>
                <router-link
                  to="/contact"
                  class="text-primary-600 hover:text-primary-700 underline"
                >
                  點擊此處
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 聯絡資訊 -->
    <div
      class="max-w-4xl mx-auto bg-surface-50 border border-surface-300 rounded-lg dark:border-surface-700 dark:bg-surface-800 p-12"
    >
      <div class="text-center space-y-4">
        <h3 class="text-xl font-bold text-primary-600">有任何問題？</h3>
        <p class="text-surface-600 dark:text-surface-400">
          如果您對本資料主體存取請求程序有任何疑問，歡迎透過以下方式聯絡我們：
        </p>
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="mailto:support@memedam.com"
            class="inline-flex justify-center items-center gap-2 w-30 h-10 bg-primary-600 text-white! hover:bg-primary-700 transition-colors"
          >
            <i class="pi pi-envelope"></i>
            發送郵件
          </a>
          <router-link
            to="/contact"
            class="inline-flex justify-center items-center gap-2 w-30 h-10 border border-primary-600 text-primary-600! hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <i class="pi pi-comments"></i>
            聯絡表單
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定義組件名稱
defineOptions({
  name: 'DSARPage',
})

// 最後更新日期
const lastUpdated = ref('2025年9月')
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>

<route lang="yaml">
meta:
  title: '資料主體存取請求 (DSAR) - GDPR 隱私權'
  description: '依 GDPR 等隱私法提交個人資料存取、下載、刪除或更正請求的完整流程說明。包含申請方式、處理時限與聯絡資訊。'
  login: false
  admin: false
</route>
