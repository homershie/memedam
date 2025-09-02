<template>
  <div class="w-full mx-auto px-6 py-10 space-y-12 overflow-y-auto">
    <!-- 頁面標題 -->
    <div class="mb-8 max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-4">DMCA 下架程序</h2>
      <p class="text-surface-600 dark:text-surface-400">
        最後更新：{{ lastUpdated }}
      </p>
    </div>

    <!-- DMCA 內容 -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 簡介 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            DMCA 下架程序 (DMCA Takedown Policy)
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              MemeDam 尊重著作權，並依據《美國數位千禧年著作權法》（Digital
              Millennium Copyright Act,
              DMCA）及其他相關法律，制定以下下架處理流程：
            </p>
          </div>
        </div>
      </div>

      <!-- 1. 提交侵權通知 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">1. 提交侵權通知</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              若您認為 MemeDam
              上的內容侵犯了您的著作權，您可以透過以下方式提交通知：
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>網站檢舉功能：</strong
                >登入後，對該內容使用「檢舉」功能並選擇「版權問題」。
              </li>
              <li>
                <strong>聯絡方式：</strong>寄送至
                <a
                  href="mailto:support@memedam.com"
                  class="text-primary-600 hover:text-primary-700 underline"
                  >support@memedam.com</a
                >
                或使用
                <router-link
                  to="/contact"
                  class="text-primary-600 hover:text-primary-700 underline"
                >
                  聯絡表單
                </router-link>
                。
              </li>
            </ul>

            <h5 class="text-lg font-semibold mt-4">通知必須包含：</h5>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>著作權所有者或其合法代理人的姓名與聯絡方式</li>
              <li>被控侵權的內容（提供 URL 或截圖）</li>
              <li>權利作品或權利描述</li>
              <li>聲明您「真誠相信」該使用未經授權</li>
              <li>聲明通知內容正確，並確認您是著作權人或合法代理人</li>
              <li>簽名（電子或手寫皆可）</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 2. 平台處理流程 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">2. 平台處理流程</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>
                收到完整通知後，我們將審查並在合理時間內採取措施，包含暫時移除或限制存取相關內容。
              </li>
              <li>我們會通知上傳者，並提供回應的機會。</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. 反通知 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            3. 反通知（Counter-Notice）
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>若上傳者認為內容未侵權，可提交反通知，包含：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>使用者姓名與聯絡方式</li>
              <li>被移除內容的描述與位置</li>
              <li>聲明該內容未侵權，且願意接受相關司法管轄</li>
              <li>簽名（電子或手寫皆可）</li>
            </ul>
            <p>
              收到反通知後，若版權人未於合理期間內提起訴訟，本平台可能恢復該內容。
            </p>
          </div>
        </div>
      </div>

      <!-- 4. 重要提醒 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">4. 重要提醒</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>請確保您的通知包含所有必要資訊，否則可能延遲處理時間</li>
              <li>惡意提交虛假通知可能面臨法律責任</li>
              <li>本平台保留在必要時尋求法律協助的權利</li>
              <li>對於重複侵權者，本平台可能採取更嚴格的措施，包括帳號停權</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5. 聯絡資訊 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">5. 聯絡資訊</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>如需提交 DMCA 通知或有相關疑問，請透過以下方式聯絡我們：</p>
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
                  >點擊此處</router-link
                >
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
          如果您對本 DMCA 下架程序有任何疑問，歡迎透過以下方式聯絡我們：
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
            ><i class="pi pi-comments"></i>聯絡表單</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定義組件名稱
defineOptions({
  name: 'DMCAPage',
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
  title: 'DMCA 下架程序 - 迷因典'
  description: '瞭解如何提交 DMCA 侵權通知與反通知，以及平台處理流程與聯絡方式。'
  login: false
  admin: false
</route>
