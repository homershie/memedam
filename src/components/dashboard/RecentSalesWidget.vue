<script setup>
import { onMounted, ref } from 'vue'

const recentSales = ref(null)

function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

onMounted(() => {
  // 模擬最近銷售資料
  recentSales.value = [
    {
      id: 1,
      product: 'Premium 會員',
      customer: '張小明',
      amount: 299,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 2,
      product: '廣告投放',
      customer: '李美玲',
      amount: 1500,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      id: 3,
      product: '贊助貼文',
      customer: '王大華',
      amount: 800,
      status: 'pending',
      date: '2024-01-13'
    },
    {
      id: 4,
      product: 'Premium 會員',
      customer: '陳小芳',
      amount: 299,
      status: 'completed',
      date: '2024-01-12'
    },
    {
      id: 5,
      product: '廣告投放',
      customer: '劉志明',
      amount: 2000,
      status: 'completed',
      date: '2024-01-11'
    }
  ]
})
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">最近銷售</div>
    <DataTable
      :value="recentSales"
      :rows="5"
      :paginator="true"
      responsiveLayout="scroll"
    >
      <Column field="product" header="產品" :sortable="true" style="width: 30%"></Column>
      <Column field="customer" header="客戶" :sortable="true" style="width: 25%"></Column>
      <Column field="amount" header="金額" :sortable="true" style="width: 20%">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
      </Column>
      <Column field="status" header="狀態" style="width: 15%">
        <template #body="slotProps">
          <Tag 
            :value="slotProps.data.status === 'completed' ? '完成' : '處理中'"
            :severity="slotProps.data.status === 'completed' ? 'success' : 'warning'"
          />
        </template>
      </Column>
      <Column style="width: 10%" header="操作">
        <template #body>
          <Button
            icon="pi pi-eye"
            type="button"
            class="p-button-text"
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
