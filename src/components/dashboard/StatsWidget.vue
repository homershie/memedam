<script setup>
import { computed } from 'vue'

// 定義組件名稱
defineOptions({
  name: 'StatsWidget'
})

// 接收props
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      {
        title: '總迷因數',
        value: '8,456',
        icon: 'pi pi-image',
        color: 'blue',
        change: '+156',
        changeText: '本週新增',
        changeType: 'positive'
      },
      {
        title: '活躍用戶',
        value: '15,241',
        icon: 'pi pi-users',
        color: 'green',
        change: '+24',
        changeText: '本週新增',
        changeType: 'positive'
      },
      {
        title: '待處理檢舉',
        value: '23',
        icon: 'pi pi-flag',
        color: 'orange',
        change: '-5',
        changeText: '已處理',
        changeType: 'positive'
      },
      {
        title: '系統健康度',
        value: '98%',
        icon: 'pi pi-check-circle',
        color: 'purple',
        change: '+2%',
        changeText: '較上週',
        changeType: 'positive'
      }
    ]
  }
})

// 顏色映射
const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-400/10',
    text: 'text-blue-500'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-400/10',
    text: 'text-green-500'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-400/10',
    text: 'text-orange-500'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-400/10',
    text: 'text-purple-500'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-400/10',
    text: 'text-red-500'
  }
}

// 計算變化文字的顏色
const getChangeClass = (changeType) => {
  return changeType === 'positive' 
    ? 'text-green-500' 
    : changeType === 'negative' 
      ? 'text-red-500' 
      : 'text-gray-500'
}
</script>

<template>
  <template v-for="(stat, index) in stats" :key="index">
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="stats-widget">
        <div class="flex justify-between items-start mb-4">
          <div class="stats-widget-content">
            <span class="stats-widget-title">{{ stat.title }}</span>
            <div class="stats-widget-value">{{ stat.value }}</div>
          </div>
          <div 
            class="stats-widget-icon"
            :class="colorClasses[stat.color]?.bg || colorClasses.blue.bg"
          >
            <i 
              :class="[stat.icon, colorClasses[stat.color]?.text || colorClasses.blue.text]"
              class="text-xl"
            ></i>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <span 
            class="stats-widget-change font-medium"
            :class="getChangeClass(stat.changeType)"
          >
            {{ stat.change }}
          </span>
          <span class="text-gray-500 dark:text-gray-400 text-sm">
            {{ stat.changeText }}
          </span>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
/* 額外的樣式可以在這裡添加 */
</style>
