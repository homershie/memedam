<script setup>
import { useLayout } from '@/layouts/composables/layout'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

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
      <i :class="item.icon" class="menu-icon"></i>
      <span class="menu-text">{{ item.label }}</span>
      <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
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
    color: var(--text-color);
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
      color: var(--text-color-secondary, #6b7280);
      width: 1.25rem;
      text-align: center;
    }

    .menu-text {
      flex: 1;
      font-size: 0.875rem;
    }

    .menu-badge {
      background-color: var(--surface-200, #f3f4f6);
      color: var(--text-color-secondary, #6b7280);
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      border-radius: 1rem;
      min-width: 1.5rem;
      text-align: center;
    }
  }
}
</style>
