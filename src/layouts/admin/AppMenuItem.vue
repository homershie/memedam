<script setup>
import { useLayout } from '@/layouts/composables/layout'
import { onBeforeMount, ref, watch } from 'vue'
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
    type: Number,
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
      : itemKey
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
</script>

<template>
  <li class="menu-item">
    <router-link
      v-if="item.to && !item.items && item.visible !== false"
      @click="itemClick($event, item, index)"
      :class="['menu-link', { active: checkActiveRoute(item) || item.active }]"
      tabindex="0"
      :to="item.to"
    >
      <!-- 自定義圖標組件 -->
      <component
        v-if="item.customIcon"
        :is="item.customIcon"
        class="menu-icon custom-icon"
      />
      <!-- PrimeVue 圖標 -->
      <i v-else :class="item.icon" class="menu-icon"></i>
      <span class="menu-text">{{ item.label }}</span>
      <Badge
        v-if="item.badge"
        v-bind="getBadgeProps(item.badge)"
        class="menu-badge"
      />
    </router-link>
  </li>
</template>

<style lang="scss" scoped>
.menu-item {
  list-style: none;
  margin: 0;
  padding: 0;

  .menu-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    border-radius: 0.375rem;
    margin: 0 0.5rem;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background-color: var(--surface-hover, #f9fafb);
    }

    &.active {
      background-color: var(--primary-50);
      color: var(--primary-600);
      font-weight: 500;

      .menu-icon {
        color: var(--primary-600);
      }
    }

    .menu-icon {
      font-size: 1.1rem;
      width: 1.25rem;
      text-align: center;

      &.custom-icon {
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
      }
    }

    .menu-text {
      flex: 1;
      font-size: 1rem;
    }

    .menu-badge {
      flex-shrink: 0;
    }
  }
}
</style>
