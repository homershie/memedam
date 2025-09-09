<template>
  <div class="min-h-screen flex flex-col w-full relative">
    <!-- 隱私同意對話框 -->
    <PrivacyConsentDialog
      ref="privacyConsentRef"
      @consent-given="handleConsentGiven"
    />

    <!-- 搜尋模式下的自定義佈局 -->
    <div
      v-if="isSearchMode"
      class="px-4 w-full h-[80px] top-0 fixed right-0 left-0 z-50 flex items-center bg-[var(--p-menubar-background)] border-b border-b-surface-700"
    >
      <div class="flex items-center gap-4 w-full">
        <Button
          icon="pi pi-arrow-left"
          severity="contrast"
          class="p-button-text rounded-full"
          @click="exitSearchMode"
        />
        <div class="flex-1 flex justify-center">
          <div class="w-full max-w-md">
            <SearchBox
              ref="searchBoxRef"
              @search="handleSearch"
              :auto-focus="true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 正常模式下的 Menubar -->
    <Menubar
      v-else
      :model="[]"
      class="px-4 w-full h-[80px] top-0 fixed right-0 left-0 z-50 rounded-none border-0 border-b"
    >
      <template #start>
        <div class="flex items-center gap-2 sm:gap-6">
          <Button
            icon="pi pi-bars"
            severity="contrast"
            class="p-button-text rounded-full"
            @click="handleMenuClick"
          />

          <router-link to="/" class="logo-link">
            <img
              src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-light_ne9fhd.png"
              alt="MemeDam"
              class="h-12 w-auto"
              v-if="isDark"
            />
            <img
              src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-dark_saeqez.png"
              alt="MemeDam"
              class="h-12 w-auto"
              v-else
            />
          </router-link>
        </div>
      </template>
      <template #end>
        <div class="flex gap-2 items-center lg:gap-4">
          <!-- 桌面版搜尋列 -->
          <div class="relative hidden md:block">
            <SearchBox @search="handleSearch" />
          </div>

          <!-- 手機版搜尋按鈕 -->
          <Button
            @click="enterSearchMode"
            severity="contrast"
            class="p-button-text rounded-full w-10 h-10 md:hidden"
            title="搜尋"
          >
            <i class="pi pi-search"></i>
          </Button>

          <!-- Menu Items -->
          <Button
            v-if="user.isLoggedIn"
            label="投稿"
            severity="secondary"
            class="p-button-text rounded-lg hidden lg:inline-flex"
            @click="$router.push('/memes/post')"
          />
          <Button
            v-if="!user.isLoggedIn"
            label="登入"
            severity="secondary"
            class="p-button-text rounded-lg hidden lg:inline-flex"
            @click="$router.push('/login')"
          />
          <Button
            v-if="user.isLoggedIn && user.isAdmin"
            label="管理"
            severity="secondary"
            class="p-button-text rounded-lg hidden lg:inline-flex"
            @click="$router.push('/admin')"
          />
          <Button
            v-if="user.isLoggedIn"
            label="登出"
            severity="secondary"
            class="p-button-text rounded-lg hidden lg:inline-flex"
            @click="logout"
          />

          <!-- 通知按鈕（僅登入用戶可見） -->
          <NotificationButton
            v-if="user.isLoggedIn"
            class="hidden sm:inline-flex"
          />

          <!-- 主題切換按鈕 -->
          <ThemeToggle mode="single" class="hidden sm:inline-flex" />

          <!-- 手機板登入登出按鈕 -->
          <div class="inline-flex lg:hidden">
            <Button
              v-if="user.isLoggedIn"
              @click="logout"
              severity="contrast"
              class="p-button-text rounded-full w-10 h-10"
              title="登出"
            >
              <i class="pi pi-sign-out"></i>
            </Button>
            <Button
              v-else
              @click="$router.push('/login')"
              severity="contrast"
              class="p-button-text rounded-full w-10 h-10"
              title="登入"
            >
              <i class="pi pi-sign-in"></i>
            </Button>
          </div>

          <!-- 個人頁面按鈕 -->
          <div
            v-if="user.isLoggedIn"
            class="cursor-pointer rounded-full inline-flex w-10 h-10 overflow-hidden hover:scale-110 transition-all duration-300"
            @click="$router.push(`/users/${user.username || user.userId}`)"
          >
            <img
              v-if="userProfile && userProfile.avatarUrl"
              :src="userProfile.avatarUrl"
              :alt="userProfile.display_name || userProfile.username"
              class="w-full h-full object-cover rounded-full border-1 border-gray-200 dark:border-gray-800"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
            >
              <i class="pi pi-user text-lg" />
            </div>
          </div>

          <!-- 成為付費會員按鈕(暫時不開放) -->
          <!-- <Button
            v-if="!isVipUser"
            label="成為頂級會員"
            class="text-white rounded-lg hidden lg:inline-flex"
            @click="$router.push('/premium')"
          /> -->
        </div>
      </template>
    </Menubar>

    <!-- 主內容 -->
    <div class="flex flex-1 h-screen mt-[80px]">
      <!-- 桌面版側邊欄 (lg 以上顯示) -->
      <div
        :class="[
          'bg-surface-0 dark:bg-surface-900 h-[calc(100vh-80px)] flex-col group transition-discrete duration-300 ease-in-out relative hidden lg:flex',
          sidebarVisible
            ? 'w-1/6 max-w-[280px] opacity-100 min-w-64'
            : 'w-0 opacity-0 overflow-hidden',
        ]"
        :style="{
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        }"
      >
        <div
          v-if="sidebarVisible"
          class="flex-1 overflow-y-hidden group-hover:overflow-y-auto flex flex-col border-r border-[var(--p-content-border-color)]"
          style="scrollbar-gutter: stable; scrollbar-width: thin"
        >
          <Menu :model="filteredMenuList" class="border-none px-4">
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
              <!-- Google Adsense 廣告 - VIP 用戶不顯示 -->
              <!-- <div
                v-if="!isVipUser"
                class="flex justify-center items-center my-2"
              >
                <AdSidebar />
              </div>
              <Divider /> -->
              <div class="my-4 space-y-1">
                <div class="text-xs flex gap-2">
                  <router-link to="/terms" class="text-sm hover:underline p-0!"
                    >條款</router-link
                  ><router-link
                    to="/privacy"
                    class="text-sm hover:underline p-0!"
                    >隱私權</router-link
                  ><a href="/dmca" class="text-sm hover:underline p-0!">DMCA</a
                  ><a href="/dsar" class="text-sm hover:underline p-0!"
                    >資料請求</a
                  >
                </div>
                <div class="text-xs">
                  <router-link to="/terms" class="text-sm hover:underline p-0!"
                    >Terms of Service</router-link
                  >
                  · <a href="/dmca" class="text-sm hover:underline p-0!">DMCA</a
                  ><br /><router-link
                    to="/privacy"
                    class="text-sm hover:underline p-0!"
                    >Privacy Policy</router-link
                  >
                  ·
                  <a href="/dsar" class="text-sm hover:underline p-0!">DSAR</a>
                </div>
                <div class="text-sm dark:text-surface-300">
                  內容僅供娛樂，勿作真實資訊。
                </div>

                <div class="mt-4">© 2025 迷因典 MemeDam</div>
              </div>
            </template>
          </Menu>
        </div>
      </div>

      <!-- 主內容區域 -->
      <div
        :class="[
          'h-[calc(100vh-80px)] overflow-hidden transition-all duration-300 relative flex flex-1 justify-center',
          sidebarVisible ? 'lg:w-5/6' : 'lg:w-full',
          'w-full',
        ]"
      >
        <router-view :key="$route.fullPath" />
      </div>
    </div>

    <!-- 行動版側邊欄 (lg 以下顯示) -->
    <Transition name="mobile-sidebar">
      <div
        v-if="mobileSidebarVisible"
        class="fixed inset-0 z-50 lg:hidden"
        @click="closeMobileSidebar"
      >
        <!-- 底色 - 透明度動畫 -->
        <div class="bg-black h-full w-full opacity-50"></div>
        <!-- 側邊欄 -->
        <div
          class="fixed left-0 top-0 h-full w-60 bg-white shadow-lg"
          @click.stop
        >
          <div class="flex flex-col h-full">
            <!-- 行動版選單 -->
            <div
              class="flex-1 overflow-y-auto w-[280px]"
              style="scrollbar-gutter: stable; scrollbar-width: thin"
            >
              <!-- 固定按鈕 -->
              <div
                class="flex items-center gap-2 sm:gap-6 h-[80px] px-4 bg-white dark:bg-surface-900"
              >
                <Button
                  icon="pi pi-bars"
                  severity="contrast"
                  class="p-button-text rounded-full"
                  @click="handleMenuClick"
                />
                <router-link to="/" class="logo-link">
                  <img
                    src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-light_ne9fhd.png"
                    alt="MemeDam"
                    class="h-12 w-auto"
                    v-if="isDark"
                  />
                  <img
                    src="https://res.cloudinary.com/dkhexh4fp/image/upload/v1756045061/memedam-f-bw-dark_saeqez.png"
                    alt="MemeDam"
                    class="h-12 w-auto"
                    v-else
                  />
                </router-link>
              </div>

              <!-- 可捲動的 Menu -->
              <Menu
                :model="filteredMenuList"
                class="border-none px-4 pb-2"
                style="scrollbar-gutter: stable; scrollbar-width: thin"
              >
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
                        @click="
                          () => {
                            navigate()
                            closeMobileSidebar()
                          }
                        "
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
                <template #end
                  ><!-- Google Adsense 佔位符 -->
                  <!-- Google Adsense 廣告 - VIP 用戶不顯示 -->
                  <!-- <div
                    v-if="!isVipUser"
                    class="flex justify-center items-center my-2"
                  >
                    <AdSidebar />
                  </div>
                  <Divider /> -->
                  <div class="mt-4 mb-10 space-y-1">
                    <div class="text-xs flex gap-2">
                      <router-link
                        to="/terms"
                        class="text-sm hover:underline p-0!"
                        >條款</router-link
                      ><router-link
                        to="/privacy"
                        class="text-sm hover:underline p-0!"
                        >隱私權</router-link
                      ><a href="/dmca" class="text-sm hover:underline p-0!"
                        >DMCA</a
                      ><a href="/dsar" class="text-sm hover:underline p-0!"
                        >資料請求</a
                      >
                    </div>
                    <div class="text-xs">
                      <router-link
                        to="/terms"
                        class="text-sm hover:underline p-0!"
                        >Terms of Service</router-link
                      >
                      ·
                      <a href="/dmca" class="text-sm hover:underline p-0!"
                        >DMCA</a
                      ><br /><router-link
                        to="/privacy"
                        class="text-sm hover:underline p-0!"
                        >Privacy Policy</router-link
                      >
                      ·
                      <a href="/dsar" class="text-sm hover:underline p-0!"
                        >DSAR</a
                      >
                    </div>
                    <div class="text-sm">內容僅供娛樂，勿作真實資訊。</div>

                    <div class="mt-4">© 2025 迷因典 MemeDam</div>
                  </div>
                </template>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import userService from '@/services/userService'
import Menu from 'primevue/menu'
// import Divider from 'primevue/divider'
import SearchBox from '@/components/SearchBox.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import NotificationButton from '@/components/NotificationButton.vue'
// import AdSidebar from '@/components/AdSidebar.vue'
import PrivacyConsentDialog from '@/components/PrivacyConsentDialog.vue'

const user = useUserStore()
const router = useRouter()
const toast = useToast()
const sidebarVisible = ref(true)
const mobileSidebarVisible = ref(false)
const userProfile = ref(null)
const privacyConsentRef = ref(null)

// 響應式數據
const isSearchMode = ref(false)
const searchBoxRef = ref(null)

// 深淺色模式判斷
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const closeMobileSidebar = () => {
  mobileSidebarVisible.value = false
}

const handleMenuClick = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    mobileSidebarVisible.value = !mobileSidebarVisible.value
  }
}

const handleSearch = () => {
  // SearchBox 元件會處理頁面跳轉，這裡可以加入額外的搜尋邏輯
  if (isSearchMode.value) {
    exitSearchMode()
  }
}

const enterSearchMode = () => {
  isSearchMode.value = true
  // 等待 DOM 更新後聚焦搜尋框
  setTimeout(() => {
    if (searchBoxRef.value) {
      searchBoxRef.value.focus()
    }
  }, 100)
}

const exitSearchMode = () => {
  isSearchMode.value = false
}

const menuList = [
  { label: '首頁', icon: 'pi pi-home', route: '/' },
  { label: '關於迷因典', icon: 'pi pi-info-circle', route: '/about' },
  { label: '聯絡迷因長', icon: 'pi pi-envelope', route: '/contact' },
  { label: '抖內贊助', icon: 'pi pi-gift', route: '/donate' },
  { separator: true },
  { label: '探索' },
  { label: '所有迷因', icon: 'pi pi-list', route: '/memes/all' },
  { label: '熱門迷因', icon: 'pi pi-star', route: '/memes/hot' },
  { label: '近期話題', icon: 'pi pi-comments', route: '/memes/trending' },
  { label: '最新迷因', icon: 'pi pi-bell', route: '/memes/new' },
  { label: '大家都在看', icon: 'pi pi-thumbs-up', route: '/memes/liked' },
  { separator: true },
  { label: '設定', icon: 'pi pi-cog', route: '/settings', requireAuth: true },
  {
    label: '檢舉紀錄',
    icon: 'pi pi-flag',
    route: '/reports',
    requireAuth: true,
  },
  {
    label: '提供意見',
    icon: 'pi pi-comment',
    route: '/feedback',
    requireAuth: true,
  },
  { separator: true },
]

// VIP 用戶判定
// const isVipUser = computed(() => {
//   return user.role === 'vip'
// })

const filteredMenuList = computed(() => {
  const filtered = menuList.filter((item) => {
    // 如果項目需要認證但用戶未登入，則過濾掉
    if (item.requireAuth && !user.isLoggedIn) {
      return false
    }
    return true
  })

  // 移除連續的分隔線
  return filtered.filter((item, index, array) => {
    if (item.separator) {
      // 如果是第一個項目且是分隔線，則移除
      if (index === 0) return false
      // 如果前一個項目也是分隔線，則移除
      if (array[index - 1] && array[index - 1].separator) return false
    }
    return true
  })
})

const logout = async () => {
  try {
    await userService.logout()
  } catch (error) {
    console.error(error)
  }
  user.logout()
  userProfile.value = null
  toast.add({
    severity: 'success',
    summary: '登出成功！',
    life: 3000,
  })
  router.push('/')
}

// 獲取使用者資料
const fetchUserProfile = async () => {
  if (user.isLoggedIn) {
    try {
      const response = await userService.getMe()
      userProfile.value = response.data.user
    } catch (error) {
      console.error('獲取使用者資料失敗:', error)
    }
  }
}

// 監聽登入狀態變化
watch(
  () => user.isLoggedIn,
  (newValue) => {
    if (newValue) {
      fetchUserProfile()
    } else {
      userProfile.value = null
    }
  },
)

// 組件掛載時獲取使用者資料
onMounted(() => {
  if (user.isLoggedIn) {
    fetchUserProfile()
  }

  // 監聽主題類別變化
  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        isDark.value = document.documentElement.classList.contains('dark')
      }
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true })

  // 監聽頭像更新事件
  const handleAvatarUpdate = (event) => {
    const { avatarUrl } = event.detail

    // 更新用戶資料中的頭像
    if (userProfile.value) {
      userProfile.value.avatar = avatarUrl
      // 強制重新計算 avatarUrl 虛擬字段
      userProfile.value.avatarUrl = avatarUrl
    }

    // 更新用戶 store 中的用戶資料（如果存在）
    if (user.userProfile) {
      user.userProfile.avatar = avatarUrl
      user.userProfile.avatarUrl = avatarUrl
    }
  }

  // 監聽封面圖片更新事件
  const handleCoverUpdate = (event) => {
    const { coverImageUrl } = event.detail

    // 更新用戶資料中的封面圖片
    if (userProfile.value) {
      userProfile.value.cover_image = coverImageUrl
    }

    // 更新用戶 store 中的用戶資料（如果存在）
    if (user.userProfile) {
      user.userProfile.cover_image = coverImageUrl
    }
  }

  window.addEventListener('user-avatar-updated', handleAvatarUpdate)
  window.addEventListener('user-cover-updated', handleCoverUpdate)

  // 在組件卸載時移除事件監聽器
  onUnmounted(() => {
    window.removeEventListener('user-avatar-updated', handleAvatarUpdate)
    window.removeEventListener('user-cover-updated', handleCoverUpdate)
  })
})

// 組件卸載時清理監聽器
onUnmounted(() => {
  if (themeObserver) themeObserver.disconnect()
})

// 處理圖片載入錯誤
const handleImageError = (event) => {
  console.error('頭像圖片載入失敗:', event.target.src)
  // 可以設定一個預設圖片或隱藏圖片元素
  event.target.style.display = 'none'
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

/* Logo 在深色模式下的顏色轉換 */
.logo-link svg {
  transition: filter 0.3s ease;
}

/* 深色模式下將 Logo 反轉為白色 */
.dark .logo-link svg {
  filter: invert(1);
}

/* 整體容器動畫 - 控制底色透明度 */
.mobile-sidebar-enter-active,
.mobile-sidebar-leave-active {
  transition: all 0.3s ease;
}

/* 底色透明度動畫 */
.mobile-sidebar-enter-active .bg-black,
.mobile-sidebar-leave-active .bg-black {
  transition: opacity 0.3s ease;
}

.mobile-sidebar-enter-from .bg-black {
  opacity: 0;
}

.mobile-sidebar-leave-to .bg-black {
  opacity: 0;
}

/* 側邊欄滑動動畫 - 沒有透明度變化 */
.mobile-sidebar-enter-active .fixed.left-0,
.mobile-sidebar-leave-active .fixed.left-0 {
  transition: transform 0.3s ease;
}

.mobile-sidebar-enter-from .fixed.left-0 {
  transform: translateX(-100%);
}

.mobile-sidebar-leave-to .fixed.left-0 {
  transform: translateX(-100%);
}

/* 確保搜尋模式下的搜尋框佔滿可用空間 */
.flex-1 {
  flex: 1;
}

.max-w-md {
  max-width: 28rem;
}
</style>
