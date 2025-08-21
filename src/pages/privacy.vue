<template>
  <div class="container h-fit mx-auto p-8 mb-20 space-y-8">
    <!-- 頁面標題 -->
    <div class="mb-8 max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">隱私政策</h1>
      <p class="text-surface-600 dark:text-surface-400">
        最後更新：{{ lastUpdated }}
      </p>
    </div>

    <!-- 隱私政策內容 -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 1. 我們收集哪些資料 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            1. 我們收集哪些資料
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <h5 class="text-lg font-semibold">(1) 你提供的資料</h5>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                註冊資訊：使用者名稱（username）、電子郵件（email）、密碼（password）
              </li>
              <li>
                互動資訊：發文、留言、按讚/噓、收藏、分享、追蹤紀錄、檢舉紀錄、提供意見回饋
              </li>
              <li>選填資訊：顯示名稱、自我介紹、性別、生日</li>
            </ul>

            <h5 class="text-lg font-semibold mt-4">(2) 他人提供的資料</h5>
            <p>
              當其他使用者在內容中標記你、提及你或與你互動時，可能會產生與你相關的資料。
            </p>

            <h5 class="text-lg font-semibold mt-4">(3) 自動收集的資料</h5>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                技術資料：IP 位址、瀏覽器與裝置資訊、作業系統、登入與使用時間
              </li>
              <li>
                Cookie 與追蹤資料：用於維持登入狀態、記錄使用偏好與改善體驗
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 2. 我們如何使用資料 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            2. 我們如何使用資料
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>帳號登入、身份驗證與安全維護</li>
              <li>提供個人化體驗（例如演算法推薦、內容排序）</li>
              <li>平台安全維護、防止濫用與處理檢舉</li>
              <li>改善平台服務（包含流量分析與功能優化）</li>
              <li>
                提供廣告與贊助內容推薦（不會出售個人資料，但可能使用匿名化或彙總數據）
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. 我們與誰分享資料 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            3. 我們與誰分享資料
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                技術供應商：包括 MongoDB
                Atlas、Redis、Cloudinary、Render、Cloudflare
                等，用於資料儲存與服務運行
              </li>
              <li>
                分析與廣告服務：如 Google
                Analytics，用於匿名化流量統計與廣告投放
              </li>
              <li>
                其他使用者：你上傳的迷因、公開的留言與互動紀錄，會顯示於平台內
              </li>
              <li>
                法律或政府機關：如因法律要求或涉及安全事件，本平台有義務提供相關資料
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 4. 資料保存期限 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">4. 資料保存期限</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>一般使用者資料會在刪除帳號後立即刪除。</p>
            <p>
              為了安全性與備份需求，部分資料（例如系統日誌、快取、備份）可能會在技術上短期保留，但不再公開，並會在合理時間內完全清除。
            </p>
          </div>
        </div>
      </div>

      <!-- 5. 跨境資料傳輸 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">5. 跨境資料傳輸</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              使用者資料可能會被處理或儲存在不同國家的伺服器（取決於雲端供應商的基礎設施）。
            </p>
            <p>我們將盡力依照適用法律（如 GDPR）保護使用者的資料安全。</p>
          </div>
        </div>
      </div>

      <!-- 6. 使用者權利 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">6. 使用者權利</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>使用者可隨時於設定頁編輯或刪除部分個人資訊</li>
              <li>使用者可透過聯絡方式請求刪除帳號與所有相關資料</li>
              <li>使用者可聯繫我們以申請存取或下載其個人資料</li>
              <li>
                若有隱私疑慮，可透過
                <a
                  href="mailto:support@memedam.com"
                  class="text-primary-600 hover:text-primary-700 underline"
                  >support@memedam.com</a
                >
                聯繫我們，我們將於合理時間內回覆
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 7. 未成年人保護 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">7. 未成年人保護</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>若使用者為未成年人，應在監護人同意下使用本平台。</p>
            <p>
              若發現未成年人未經允許提供個人資料，本平台有權刪除相關帳號與內容。
            </p>
          </div>
        </div>
      </div>

      <!-- 8. Cookies 與追蹤技術 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            8. Cookies 與追蹤技術
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>本平台使用 Cookies 儲存登入狀態與偏好設定</li>
              <li>可能使用第三方工具（如 Google Analytics）收集匿名流量數據</li>
              <li>
                使用者可於瀏覽器設定中管理或停用 Cookies，但部分功能可能因此受限
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
          如果您對本隱私政策有任何疑問，歡迎透過以下方式聯絡我們：
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
  name: 'PrivacyPage',
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
  title: '隱私政策 - 迷因典'
  login: false
  admin: false
</route>
