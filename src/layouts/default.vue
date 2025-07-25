<template>
  <div class="min-h-screen flex flex-col w-full relative">
    <Toast position="bottom-right" />
    <!-- 導覽列：改用 PrimeVue Menubar -->
    <Menubar
      :model="[]"
      class="px-4 w-full h-[80px] top-0 fixed right-0 left-0 z-50"
    >
      <template #start>
        <div class="flex items-center gap-6">
          <Button
            icon="pi pi-bars"
            severity="contrast"
            class="p-button-text rounded-full"
            @click="toggleSidebar"
          />
          <router-link to="/">
            <svg
              width="143"
              height="48"
              viewBox="0 0 143 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.6916 32.1988L64.3128 29.3821L61.9186 32.2281H59.1963L63.2991 26.1365V15.4445H60.3837L59.7948 12.501H66.2532V27.1014L66.2242 27.1306L68.85 29.2846H83.8037L83.2437 32.2281H67.7978L67.7012 32.2963V32.1988H67.6916ZM63.5598 3.924L65.9249 9.82068H63.3377L60.3837 3.924H63.5694H63.5598ZM73.5224 15.0838V2.66669H76.4379V15.0838H82.7321L82.1432 18.0663H76.4379V27.501H73.5224V18.0663H67.8846L67.2958 15.0838H73.5224ZM68.9659 18.924H71.8813L70.1147 27.501H67.6916L68.9659 18.924ZM71.0993 3.56337L71.8909 14.4601L69.5644 14.4893L68.1839 3.56337H71.0993ZM78.6099 3.56337H81.564L80.1835 14.4893L77.8183 14.4601L78.6099 3.56337ZM80.7724 18.924L81.9888 27.501H79.5946L77.828 18.924H80.782H80.7724Z"
                fill="black"
              />
              <path
                d="M89.6626 2.66669H113.098V32.2963H89.6626V2.66669ZM110.017 29.2865V5.68646H92.7537V29.2865H110.017ZM98.8045 18.0645H94.8245L94.2083 14.7458H99.7035V6.90234H103.098V14.7458H108.552L107.967 18.0645H103.946L108.542 28.0706H105.694L101.37 20.5262L97.0771 28.0706H94.1982L98.7944 18.0645H98.8045Z"
                fill="black"
              />
              <path
                d="M117.785 24.6603H119.852V6.12964H125.791V2.66669H128.708V6.11991H131.76V2.66669H134.715V6.11991H140.654V24.6506H142.393L141.833 27.5883H118.374L117.785 24.6506V24.6603ZM122.45 28.4929H125.994L123.271 32.2963H119.273L122.46 28.4929H122.45ZM125.791 14.8843V9.10622H122.769V14.8843H125.791ZM125.791 24.6603V17.5301H122.769V24.6603H125.791ZM131.769 14.8843V9.10622H128.718V14.8843H131.769ZM131.769 24.6603V17.5301H128.718V24.6603H131.769ZM137.738 28.4929L140.954 32.2963H136.955L134.203 28.4929H137.747H137.738ZM137.738 14.8843V9.10622H134.715V14.8843H137.738ZM137.738 24.6603V17.5301H134.715V24.6603H137.738Z"
                fill="black"
              />
              <path
                d="M60.9148 37.3032H62.1805L65.2853 41.1659H65.0876L68.1924 37.3032H69.4581V45.4511H68.0046V39.5565L68.1034 39.5967L65.2853 42.9564H65.0282L62.2497 39.5967L62.3486 39.5565V45.4511H60.895V37.3032H60.9148Z"
                fill="#828282"
              />
              <path
                d="M72.0586 42.0008H75.2624C75.2426 41.7996 75.1833 41.6286 75.0844 41.4677C74.9954 41.3168 74.8767 41.176 74.7383 41.0754C74.5999 40.9647 74.4417 40.8843 74.2637 40.834C74.0857 40.7736 73.9176 40.7434 73.7396 40.7434C73.4825 40.7434 73.2551 40.7937 73.0573 40.8843C72.8596 40.9748 72.7014 41.1056 72.5629 41.2665C72.4245 41.4275 72.3355 41.6186 72.2762 41.8399C72.2169 42.0612 72.1773 42.2925 72.1773 42.534C72.1773 42.7955 72.207 43.0369 72.2762 43.2582C72.3454 43.4795 72.4443 43.6706 72.5827 43.8316C72.7211 43.9925 72.8892 44.1132 73.087 44.2038C73.2848 44.2943 73.5221 44.3345 73.7989 44.3345C74.1055 44.3345 74.3725 44.2742 74.59 44.1535C74.8075 44.0328 74.9954 43.8517 75.124 43.6103H76.5379C76.3402 44.2138 75.9941 44.6967 75.4898 45.0387C74.9855 45.3907 74.3922 45.5618 73.6902 45.5618C73.2254 45.5618 72.8101 45.4813 72.4443 45.3103C72.0784 45.1393 71.7818 44.918 71.5346 44.6363C71.2973 44.3547 71.1094 44.0428 70.9808 43.6807C70.8523 43.3186 70.793 42.9464 70.793 42.5641C70.793 42.1819 70.8622 41.7896 70.9907 41.4375C71.1193 41.0754 71.3071 40.7535 71.5543 40.4819C71.8016 40.2002 72.1081 39.9789 72.4641 39.8079C72.82 39.6369 73.2452 39.5565 73.7198 39.5565C74.1549 39.5565 74.5504 39.6269 74.9064 39.7677C75.2624 39.9085 75.5689 40.1097 75.8161 40.3612C76.0633 40.6127 76.2611 40.9245 76.3995 41.2866C76.5379 41.6488 76.6072 42.031 76.6072 42.4635C76.6072 42.5541 76.6072 42.6345 76.6072 42.715C76.6072 42.7854 76.5973 42.8659 76.5775 42.9363H72.0092L72.029 42.0008H72.0586Z"
                fill="#828282"
              />
              <path
                d="M77.9025 45.4611V39.6972H79.1187L79.267 40.4114C79.3264 40.331 79.3956 40.2404 79.4944 40.1398C79.5933 40.0392 79.7021 39.9487 79.8405 39.8682C79.979 39.7878 80.1471 39.7174 80.3251 39.657C80.503 39.5966 80.7107 39.5665 80.948 39.5665C81.4226 39.5665 81.828 39.657 82.1543 39.8481C82.4807 40.0392 82.7279 40.2807 82.9058 40.6026C83.0047 40.4718 83.1135 40.341 83.242 40.2203C83.3706 40.0895 83.509 39.9789 83.687 39.8884C83.8551 39.7978 84.043 39.7174 84.2407 39.657C84.4385 39.5966 84.656 39.5665 84.8933 39.5665C85.2592 39.5665 85.5954 39.6268 85.8822 39.7375C86.1689 39.8481 86.4062 40.0091 86.604 40.2203C86.8018 40.4316 86.9402 40.683 87.049 40.9747C87.1478 41.2665 87.1973 41.5984 87.1973 41.9505V45.4511H85.8031V42.2523C85.8031 41.7996 85.6943 41.4576 85.4866 41.2162C85.279 40.9747 84.9823 40.8641 84.6066 40.8641C84.4187 40.8641 84.2506 40.8943 84.0825 40.9546C83.9243 41.015 83.776 41.1055 83.6573 41.2162C83.5387 41.3268 83.4398 41.4676 83.3706 41.6286C83.3014 41.7895 83.2618 41.9706 83.2519 42.1718V45.441H81.8577V42.2422C81.8577 41.7895 81.7489 41.4475 81.5413 41.2061C81.3336 40.9647 81.0271 40.854 80.6514 40.854C80.4635 40.854 80.2954 40.8842 80.1273 40.9446C79.9592 41.0049 79.8208 41.0955 79.6922 41.2162C79.5637 41.3369 79.4747 41.4777 79.4055 41.6487C79.3362 41.8197 79.3066 42.0108 79.3066 42.2221V45.4309H77.9124L77.9025 45.4611Z"
                fill="#828282"
              />
              <path
                d="M89.6001 42.0008H92.8039C92.7841 41.7996 92.7248 41.6286 92.6259 41.4677C92.5369 41.3168 92.4183 41.176 92.2798 41.0754C92.1414 40.9647 91.9832 40.8843 91.8052 40.834C91.6272 40.7736 91.4591 40.7434 91.2811 40.7434C91.024 40.7434 90.7966 40.7937 90.5988 40.8843C90.4011 40.9748 90.2429 41.1056 90.1044 41.2665C89.966 41.4275 89.877 41.6186 89.8177 41.8399C89.7584 42.0612 89.7188 42.2925 89.7188 42.534C89.7188 42.7955 89.7485 43.0369 89.8177 43.2582C89.8869 43.4795 89.9858 43.6706 90.1242 43.8316C90.2626 43.9925 90.4307 44.1132 90.6285 44.2038C90.8263 44.2943 91.0636 44.3345 91.3405 44.3345C91.647 44.3345 91.914 44.2742 92.1315 44.1535C92.349 44.0328 92.5369 43.8517 92.6655 43.6103H94.0795C93.8817 44.2138 93.5356 44.6967 93.0313 45.0387C92.527 45.3907 91.9337 45.5618 91.2317 45.5618C90.7669 45.5618 90.3516 45.4813 89.9858 45.3103C89.6199 45.1393 89.3233 44.918 89.0761 44.6363C88.8388 44.3547 88.6509 44.0428 88.5223 43.6807C88.3938 43.3186 88.3345 42.9464 88.3345 42.5641C88.3345 42.1819 88.4037 41.7896 88.5322 41.4375C88.6608 41.0754 88.8487 40.7535 89.0959 40.4819C89.3431 40.2002 89.6496 39.9789 90.0056 39.8079C90.3615 39.6369 90.7867 39.5565 91.2613 39.5565C91.6964 39.5565 92.0919 39.6269 92.4479 39.7677C92.8039 39.9085 93.1104 40.1097 93.3576 40.3612C93.6048 40.6127 93.8026 40.9245 93.941 41.2866C94.0795 41.6488 94.1487 42.031 94.1487 42.4635C94.1487 42.5541 94.1487 42.6345 94.1487 42.715C94.1487 42.7854 94.1388 42.8659 94.119 42.9363H89.5507L89.5705 42.0008H89.6001Z"
                fill="#828282"
              />
              <path
                d="M95.5428 37.3032H99.0333C99.6266 37.3032 100.17 37.4038 100.645 37.6151C101.12 37.8162 101.535 38.108 101.871 38.4701C102.207 38.8322 102.465 39.2648 102.652 39.7576C102.83 40.2505 102.919 40.7937 102.919 41.3872C102.919 41.9807 102.83 42.5038 102.652 43.0067C102.474 43.4996 102.217 43.9322 101.881 44.2943C101.545 44.6564 101.14 44.9482 100.655 45.1493C100.17 45.3505 99.6266 45.4612 99.0333 45.4612H95.5428V37.3133V37.3032ZM99.0037 44.1434C99.3992 44.1434 99.7453 44.073 100.052 43.9322C100.358 43.7914 100.606 43.5902 100.803 43.3488C101.001 43.1073 101.159 42.8156 101.258 42.4736C101.367 42.1417 101.416 41.7795 101.416 41.3872C101.416 40.9949 101.367 40.6429 101.258 40.3008C101.149 39.9588 101.001 39.6671 100.803 39.4156C100.606 39.1642 100.348 38.973 100.052 38.8221C99.7552 38.6713 99.3992 38.6109 99.0037 38.6109H96.8678L97.0162 38.46V44.2843L96.8678 44.1334H99.0037V44.1434Z"
                fill="#828282"
              />
              <path
                d="M105.055 42.0008H108.259C108.239 41.7996 108.18 41.6286 108.081 41.4677C107.992 41.3168 107.873 41.176 107.735 41.0754C107.596 40.9647 107.438 40.8843 107.26 40.834C107.082 40.7736 106.914 40.7434 106.736 40.7434C106.479 40.7434 106.252 40.7937 106.054 40.8843C105.856 40.9748 105.698 41.1056 105.56 41.2665C105.421 41.4275 105.332 41.6186 105.273 41.8399C105.213 42.0612 105.174 42.2925 105.174 42.534C105.174 42.7955 105.204 43.0369 105.273 43.2582C105.342 43.4795 105.441 43.6706 105.579 43.8316C105.718 43.9925 105.886 44.1132 106.084 44.2038C106.281 44.2943 106.519 44.3345 106.796 44.3345C107.102 44.3345 107.369 44.2742 107.587 44.1535C107.804 44.0328 107.992 43.8517 108.121 43.6103H109.535C109.337 44.2138 108.991 44.6967 108.486 45.0387C107.982 45.3907 107.389 45.5618 106.687 45.5618C106.222 45.5618 105.807 45.4813 105.441 45.3103C105.075 45.1393 104.778 44.918 104.531 44.6363C104.294 44.3547 104.106 44.0428 103.977 43.6807C103.849 43.3186 103.79 42.9464 103.79 42.5641C103.79 42.1819 103.859 41.7896 103.987 41.4375C104.116 41.0754 104.304 40.7535 104.551 40.4819C104.798 40.2002 105.105 39.9789 105.461 39.8079C105.817 39.6369 106.242 39.5565 106.716 39.5565C107.152 39.5565 107.547 39.6269 107.903 39.7677C108.259 39.9085 108.566 40.1097 108.813 40.3612C109.06 40.6127 109.258 40.9245 109.396 41.2866C109.535 41.6488 109.604 42.031 109.604 42.4635C109.604 42.5541 109.604 42.6345 109.604 42.715C109.604 42.7854 109.594 42.8659 109.574 42.9363H105.006L105.026 42.0008H105.055Z"
                fill="#828282"
              />
              <path
                d="M112.254 42.3932V42.6446L110.098 39.6973H111.68L113.094 41.6991H112.926L114.33 39.6973H115.902L113.767 42.6446V42.3932L115.952 45.4511H114.39L112.926 43.3287H113.094L111.621 45.4511H110.078L112.254 42.3932Z"
                fill="#828282"
              />
              <path
                d="M8.80988 47.7037L0.607422 39.1417V0.296326L8.80988 8.85837V47.7037Z"
                fill="black"
              />
              <path
                d="M21.6994 47.7037L13.4969 39.1417V8.85837L21.6994 0.296326V47.7037Z"
                fill="black"
              />
              <path
                d="M33.4172 39.1417L25.2147 47.7037V0.296326L33.4172 8.85837V39.1417Z"
                fill="black"
              />
              <path
                d="M47.4786 39.1417L39.2761 47.7037V8.85837L47.4786 0.296326V39.1417Z"
                fill="black"
              />
            </svg>
          </router-link>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-6">
          <!-- 搜尋列 -->
          <div class="relative">
            <InputGroup>
              <InputText v-model="searchQuery" placeholder="搜尋迷因" />
              <InputGroupAddon>
                <Button
                  icon="pi pi-search"
                  severity="secondary"
                  variant="text"
                  @click="handleSearch"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <!-- Menu Items -->
          <Button
            v-if="user.isLoggedIn"
            label="投稿"
            severity="secondary"
            class="p-button-text rounded-lg"
            @click="$router.push('/memes/post')"
          />
          <Button
            v-if="!user.isLoggedIn"
            label="登入"
            severity="secondary"
            class="p-button-text rounded-lg"
            @click="$router.push('/login')"
          />
          <Button
            v-if="user.isLoggedIn && user.isAdmin"
            label="管理"
            severity="secondary"
            class="p-button-text rounded-lg"
            @click="$router.push('/admin')"
          />
          <Button
            v-if="user.isLoggedIn"
            label="登出"
            severity="secondary"
            class="p-button-text rounded-lg"
            @click="logout"
          />
          <Button
            label="成為付費會員"
            class="text-white rounded-lg"
            @click="$router.push('/premium')"
          />
        </div>
      </template>
    </Menubar>
    <!-- 主內容 -->
    <div class="flex flex-1 h-screen mt-[80px]">
      <div
        :class="[
          'h-[calc(100vh-80px)] flex flex-col group transition-all duration-300 ease-in-out relative',
          sidebarVisible
            ? 'w-1/6 opacity-100'
            : 'w-0 opacity-0 overflow-hidden',
        ]"
        :style="{
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        }"
      >
        <div
          v-if="sidebarVisible"
          class="flex-1 overflow-y-hidden group-hover:overflow-y-auto flex flex-col"
          style="
            scrollbar-gutter: stable;
            scrollbar-width: thin;
            overflow-overlay: auto;
          "
        >
          <Menu :model="menuList" class="border-none px-4">
            <template #item="{ item, props }">
              <div v-if="item.separator" class="my-2 border-t"></div>
              <template v-else>
                <router-link
                  v-if="item.route"
                  v-slot="{ href, navigate }"
                  :to="item.route"
                  custom
                >
                  <a
                    v-ripple
                    :href="href"
                    v-bind="props.action"
                    @click="navigate"
                  >
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                  </a>
                </router-link>
                <a
                  v-else-if="item.url"
                  v-ripple
                  :href="item.url"
                  :target="item.target"
                  v-bind="props.action"
                >
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </a>
                <span v-else class="ml-2 text-xs text-gray-400">{{
                  item.label
                }}</span>
              </template>
            </template>
            <template #end>
              <!-- Google Adsense 佔位符 -->
              <div class="flex justify-center items-center my-2">
                <div
                  style="
                    width: 150px;
                    height: 600px;
                    background: #e5e7eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                    font-size: 14px;
                    border: 1px dashed #bbb;
                    margin: 10px;
                  "
                >
                  150x600<br />Google Ad
                </div>
              </div>
              <Divider />
              <div class="text-s mb-10">
                <div class="mb-2">© 2025 迷因典 MemeDex ®</div>
                <div>
                  <a href="#" class="hover:underline">privacy</a> |
                  <a href="#" class="hover:underline">terms of service</a> |
                  <a href="#" class="hover:underline">dmca</a> |
                  <a href="#" class="hover:underline">statement</a> |
                  <a href="#" class="hover:underline"
                    >information collection notice</a
                  >
                  <a href="#" class="hover:underline"
                    >data subject access request</a
                  >
                </div>
              </div>
            </template>
          </Menu>
        </div>
      </div>
      <div
        :class="[
          'h-[calc(100vh-80px)] overflow-y-auto transition-all duration-300 relative flex flex-1 justify-center',
          sidebarVisible ? 'w-5/6' : 'w-full',
        ]"
      >
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import userService from '@/services/userService'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'

const user = useUserStore()
const router = useRouter()
const toast = useToast()
const searchQuery = ref('')
const sidebarVisible = ref(true)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 這裡可以實作搜尋邏輯
    console.log('搜尋:', searchQuery.value)
  }
}

const menuList = [
  { label: '首頁', icon: 'pi pi-home', route: '/' },
  { label: '關於本站', icon: 'pi pi-info-circle', route: '/about' },
  { label: '聯絡站長', icon: 'pi pi-envelope', route: '/contact' },
  { label: '請站長喝飲料', icon: 'pi pi-gift', route: '/donate' },
  { separator: true },
  { label: '探索' },
  { label: '所有迷因', icon: 'pi pi-list', route: '/memes/all' },
  { label: '熱門迷因', icon: 'pi pi-star', route: '/memes/hot' },
  { label: '近期話題', icon: 'pi pi-comments', route: '/memes/trending' },
  { label: '最新迷因', icon: 'pi pi-bell', route: '/memes/new' },
  { label: '最多人喜歡', icon: 'pi pi-thumbs-up', route: '/memes/liked' },
  { separator: true },
  { label: '設定', icon: 'pi pi-cog', route: '/settings' },
  { label: '檢舉紀錄', icon: 'pi pi-flag', route: '/reports' },
  { label: '提供意見', icon: 'pi pi-comment', route: '/feedback' },
  { separator: true },
]

const logout = async () => {
  try {
    await userService.logout()
  } catch (error) {
    console.error(error)
  }
  user.logout()
  toast.add({
    severity: 'success',
    summary: '登出成功！',
    life: 3000,
  })
  router.push('/')
}
</script>

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style scoped>
:deep(.p-menu-item-content) {
  padding-top: 0.2rem !important;
  padding-bottom: 0.2rem !important;
}
</style>
