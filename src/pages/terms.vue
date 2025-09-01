<template>
  <div class="container h-fit mx-auto p-8 mb-20 space-y-8 overflow-y-auto">
    <!-- 頁面標題 -->
    <div class="mb-8 max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-4">迷因典 MemeDam 服務條款</h2>
      <p class="text-surface-600 dark:text-surface-400">
        最後更新：{{ lastUpdated }}
      </p>
    </div>

    <!-- 服務條款內容 -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 1. 平台資訊 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">1. 平台資訊</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              MemeDam（以下稱「本平台」）由
              <strong>荷馬桑</strong> 經營與維護。
            </p>
            <p>
              <strong>聯絡方式：</strong>
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
            </p>
          </div>
        </div>
      </div>

      <!-- 2. 使用條件與資格 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">2. 使用條件與資格</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              本平台目前不限制年齡使用，但若使用者所在國家／地區法律有最低使用年齡限制，使用者必須符合當地法律規範。
            </p>
            <p>
              註冊帳號時，需提供
              <strong>使用者名稱（username）</strong
              >、<strong>電子郵件（email）</strong>、<strong>密碼（password）</strong>。
            </p>
            <p>使用社群帳號登入時，仍須設定 username 才能進行互動與標記。</p>
            <p>username 不得與他人重複，每月最多可更改一次。</p>
            <p>使用者應保管好帳號資訊，不得將帳號轉讓、出借或冒充他人註冊。</p>
          </div>
        </div>
      </div>

      <!-- 3. 帳號安全與責任 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">3. 帳號安全與責任</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>使用者應對其帳號下的所有行為負責。</p>
            <p>若發現帳號遭未經授權使用，應立即通知本平台。</p>
            <p>因使用者未妥善保管帳號資訊而導致的損失，本平台不承擔責任。</p>
          </div>
        </div>
      </div>

      <!-- 4. 服務與功能調整 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">4. 服務與功能調整</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              本平台持續改進，可能隨時新增、刪除或修改功能（例如：演算法推薦、會員制度、廣告展示）。
            </p>
            <p>
              若有涉及重大權益的變更，本平台將透過網站公告或電子郵件通知使用者。
            </p>
          </div>
        </div>
      </div>

      <!-- 5. 使用者行為規範 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">5. 使用者行為規範</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>使用者不得從事以下行為：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>上傳或散布仇恨言論、違法或不當內容</li>
              <li>未經授權使用或散布受版權保護的作品</li>
              <li>騷擾、詐騙、冒充他人或其他干擾平台正常運作的行為</li>
              <li>嘗試未經授權存取、干擾或破壞本平台系統</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 6. 內容上傳與授權條款 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            6. 內容上傳與授權條款
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>使用者保留其上傳內容的所有權。</p>
            <p>
              使用者上傳內容時，即授予本平台一項
              <strong>非專屬、全球性、免授權費、可再授權</strong>
              的使用權，用於：
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>在平台內展示、推薦</li>
              <li>用於推廣本平台（例如廣告、社群貼文）</li>
            </ul>
            <p>
              使用者仍保有原始版權，可隨時刪除內容。刪除後授權即終止，但平台在備份、快取或既有使用（例如廣告素材）中可能暫時保留。
            </p>
            <p>
              若內容涉及侵權或收到版權所有者的通知，本平台將依情況移除或下架。
            </p>
          </div>
        </div>
      </div>

      <!-- 7. 平台資料使用與隱私 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            7. 平台資料使用與隱私
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              使用者同意本平台依照
              <router-link
                to="/privacy"
                class="text-primary-600 hover:text-primary-700 underline"
              >
                隱私政策
              </router-link>
              收集與處理個人資料。
            </p>
            <p>
              本平台可能利用使用者互動資料，用於演算法推薦、內容排序、廣告投放與服務改進。
            </p>
          </div>
        </div>
      </div>

      <!-- 8. 第三方連結與服務 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            8. 第三方連結與服務
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              本平台可能包含第三方網站或服務的連結（例如：Cloudinary
              圖片、YouTube 影片、廣告）。
            </p>
            <p>本平台不對第三方服務的內容、隱私政策或安全性負責。</p>
          </div>
        </div>
      </div>

      <!-- 9. 帳號停權與服務終止 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">
            9. 帳號停權與服務終止
          </h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>若使用者違反本條款或相關法律，本平台有權採取以下措施：</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>警告或限制部分功能</li>
              <li>移除違規內容</li>
              <li>暫停或刪除帳號</li>
            </ul>
            <p>
              對於涉及嚴重違法或危害社群安全的內容，本平台得主動通報主管機關。
            </p>
          </div>
        </div>
      </div>

      <!-- 10. 免責聲明 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">10. 免責聲明</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>本平台以「現狀」（as is）提供服務，不保證完全無錯誤或不中斷。</p>
            <p>
              對於因服務中斷、資料遺失、未經授權存取等造成的損失，本平台不承擔責任。
            </p>
            <p>使用者應自行承擔因使用或依賴本平台內容所導致的風險。</p>
          </div>
        </div>
      </div>

      <!-- 11. 爭議解決 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">11. 爭議解決</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>
              本條款受 <strong>台灣（中華民國）法律</strong> 管轄並依其解釋。
            </p>
            <p>因使用本平台所引起的任何爭議，應以台灣法院為第一審管轄法院。</p>
          </div>
        </div>
      </div>

      <!-- 12. 條款修改 -->
      <div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-primary-600">12. 條款修改</h3>
          <div class="space-y-1 text-surface-700 dark:text-surface-300">
            <p>本平台有權隨時修改本條款。</p>
            <p>
              修改後的條款將於公告後生效，若使用者繼續使用本平台，即視為同意最新版本。
            </p>
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
          如果您對本服務條款有任何疑問，歡迎透過以下方式聯絡我們：
        </p>
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="mailto:support@memedam.com"
            class="inline-flex justify-center items-center gap-2 w-30 h-10 bg-primary-600 text-white! rounded-lg hover:bg-primary-700 transition-colors"
          >
            <i class="pi pi-envelope"></i>
            發送郵件
          </a>
          <router-link
            to="/contact"
            class="inline-flex justify-center items-center gap-2 w-30 h-10 border border-primary-600 text-primary-600! rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
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
  name: 'TermsPage',
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
  title: '服務條款 - 迷因典'
  description: '閱讀迷因典的使用規範、內容授權、帳號安全與權利義務，保障雙方權益。'
  login: false
  admin: false
</route>
