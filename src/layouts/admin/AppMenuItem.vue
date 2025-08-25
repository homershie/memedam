<script setup>
import { useLayout } from '@/layouts/composables/layout'
import { onBeforeMount, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import Badge from 'primevue/badge'

const route = useRoute()

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: [Number, String],
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
})

const isActiveMenu = ref(false)
const itemKey = ref(null)

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index)

  const activeItem = layoutState.activeMenuItem

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + '-')
      : false
})

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value =
      newVal === itemKey.value || newVal.startsWith(itemKey.value + '-')
  },
)

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (
    (item.to || item.url) &&
    (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)
  ) {
    toggleMenu()
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item })
  }

  const foundItemKey = item.items
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey.value
    : itemKey.value

  setActiveMenuItem(foundItemKey)
}

function checkActiveRoute(item) {
  return route.path === item.to
}

// 處理 badge 配置
function getBadgeProps(badge) {
  if (!badge) return null

  if (typeof badge === 'string') {
    return { value: badge }
  }

  if (typeof badge === 'object') {
    return {
      value: badge.value,
      severity: badge.severity || 'info',
    }
  }

  return null
}

// 計算 badge 是否應該顯示
const shouldShowBadge = computed(() => {
  const badge = props.item.badge

  if (!badge) return false

  if (typeof badge === 'string') {
    return badge.length > 0
  }

  if (typeof badge === 'object') {
    return badge.value && badge.value > 0
  }

  return false
})
</script>

<template>
  <li class="menu-item">
    <router-link
      v-if="item.to && !item.items && item.visible !== false"
      @click="itemClick($event, item)"
      :class="[
        'flex items-center gap-3 px-4! py-3! no-underline rounded-md mx-2 transition-all duration-200 relative hover:font-bold hover:bg-surface-200 dark:hover:bg-surface-700',
        checkActiveRoute(item) || item.active
          ? 'bg-surface-200 text-black font-bold dark:text-white dark:bg-surface-700'
          : '',
      ]"
      tabindex="0"
      :to="item.to"
    >
      <!-- 自定義圖標組件 -->
      <component
        v-if="item.customIcon"
        :is="item.customIcon"
        class="menu-icon custom-icon w-5 h-5 shrink-0"
      />
      <!-- PrimeVue 圖標 -->
      <i
        v-else
        :class="[item.icon, 'menu-icon text-[1.1rem] w-5 text-center']"
      ></i>
      <span class="menu-text flex-1 text-base">{{ item.label }}</span>
      <Badge
        v-if="shouldShowBadge"
        v-bind="getBadgeProps(item.badge)"
        class="menu-badge shrink-0"
      />
    </router-link>
  </li>
</template>

<style lang="scss" scoped>
.menu-item {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
