<script setup>
defineOptions({
  name: 'AdminUserBehavior',
})

import { ref, onMounted, computed } from 'vue'

const dateRange = ref(null)
const activeUsersTrend = ref({ labels: [], datasets: [] })
const retentionData = ref({ labels: [], datasets: [] })
const deviceUsage = ref({ labels: [], datasets: [] })
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
}))

const refreshData = () => {
  // 模擬活躍用戶趨勢
  activeUsersTrend.value = {
    labels: ['01/09', '01/10', '01/11', '01/12', '01/13', '01/14', '01/15'],
    datasets: [
      {
        label: 'DAU',
        data: [220, 260, 240, 280, 300, 290, 320],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'WAU',
        data: [1200, 1300, 1280, 1350, 1400, 1420, 1480],
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102,187,106,0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // 模擬留存率
  retentionData.value = {
    labels: ['D1', 'D7', 'D14', 'D30'],
    datasets: [
      {
        label: '留存率(%)',
        data: [46, 24, 18, 12],
        backgroundColor: '#AB47BC',
      },
    ],
  }

  // 模擬裝置分佈
  deviceUsage.value = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        data: [68, 27, 5],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  }
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <div>
    <div class="card">
      <div class="flex flex-wrap items-end gap-4 mb-6">
        <div class="flex-1 min-w-[16rem]">
          <label class="block font-bold mb-2">日期範圍</label>
          <Calendar
            v-model="dateRange"
            selectionMode="range"
            :manualInput="false"
            showIcon
            iconDisplay="input"
            class="w-full"
          />
        </div>
        <Button
          label="重新整理"
          icon="pi pi-refresh"
          severity="secondary"
          @click="refreshData"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-2" :pt="{ body: { class: 'h-[360px]' } }">
          <template #title>活躍用戶趨勢</template>
          <template #content>
            <div class="h-[320px]">
              <Chart
                type="line"
                :data="activeUsersTrend"
                :options="chartOptions"
              />
            </div>
          </template>
        </Card>
        <Card :pt="{ body: { class: 'h-[360px]' } }">
          <template #title>裝置分佈</template>
          <template #content>
            <div class="h-[320px]">
              <Chart
                type="doughnut"
                :data="deviceUsage"
                :options="chartOptions"
              />
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 gap-6 mt-6">
        <Card :pt="{ body: { class: 'h-[360px]' } }">
          <template #title>留存分析</template>
          <template #content>
            <div class="h-[320px]">
              <Chart type="bar" :data="retentionData" :options="chartOptions" />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '用戶行為分析'
  admin: true
</route>
