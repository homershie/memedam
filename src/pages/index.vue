<template>
  <div class="container mx-auto p-4 space-y-12">
    <!-- 首頁標題與搜尋/上傳 -->
    <Panel class="mb-4" header="">
      <template #header>
        <h1 class="text-3xl font-bold">讓最新的迷因為生活增添風味</h1>
        <p class="text-gray-500 text-base mt-1">
          Explore a variety of memes submitted by our community. Search for your
          favorite and discover trending content.
        </p>
      </template>
      <div class="flex flex-wrap justify-center gap-2 mt-4">
        <InputText placeholder="關鍵字搜尋…" class="w-48" />
        <Dropdown
          :options="[{ label: '分類', value: null }]"
          placeholder="分類"
          class="w-32"
        />
        <Dropdown
          :options="[{ label: '依熱度排序', value: null }]"
          placeholder="依熱度排序"
          class="w-32"
        />
        <Button
          label="馬上投稿"
          icon="pi pi-upload"
          class="ml-2 p-button-primary"
        />
      </div>
    </Panel>

    <!-- 活躍用戶橫條 -->
    <Panel class="mb-4" header="">
      <template #header>
        <div class="font-bold text-center">
          特別感謝站長馬與軟軟的朋友，給筆筆和蛇媽們一個大抱抱！
        </div>
      </template>
      <div class="flex flex-wrap justify-center gap-4 mt-2">
        <div v-for="n in 10" :key="n" class="flex flex-col items-center">
          <Avatar icon="pi pi-user" shape="circle" class="mb-1" size="large" />
          <div class="text-xs text-gray-500">使用者名稱<br />登入了100天</div>
        </div>
      </div>
    </Panel>

    <!-- 公告欄 -->
    <Panel class="mb-4" header="布告欄">
      <div class="text-center text-gray-500 mb-4">
        最新消息與站務公告將在此處更新，敬請留意。
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <Card v-for="n in 3" :key="n">
          <template #header>
            <div class="bg-gray-200 h-32 flex items-center justify-center">
              <span class="text-gray-400 text-3xl">🖼️</span>
            </div>
          </template>
          <template #content>
            <div class="text-xs text-gray-400 mb-1">更新・5 min read</div>
            <div class="font-bold mb-1">公告標題{{ n }}</div>
            <div class="text-sm text-gray-600 mb-2">
              這裡是公告內容的簡短描述，讓大家快速掌握最新動態。
            </div>
            <Button label="查看更多" link class="p-0 text-primary" />
          </template>
        </Card>
      </div>
    </Panel>

    <!-- 近期精選迷因 -->
    <Panel class="mb-4" header="近期精選迷因">
      <div class="text-center text-gray-500 mb-4">
        "If you don't try this app, you won't become the superhero you were
        meant to be"
      </div>
      <div class="flex flex-wrap justify-center gap-4">
        <Card v-for="n in 3" :key="n" class="w-72">
          <template #header>
            <div class="bg-gray-200 h-32 flex items-center justify-center">
              <span class="text-gray-400 text-3xl">🖼️</span>
            </div>
          </template>
          <template #content>
            <div
              class="flex justify-between items-center text-xs text-gray-400 mb-1"
            >
              <span>迷因分類</span>
              <span>2天前</span>
              <span>艾某某</span>
            </div>
            <div class="font-bold mb-1">迷因名稱</div>
            <div class="text-sm text-gray-600 flex-1">
              這是一個迷因的簡短描述或文案，吸引大家點擊。
            </div>
            <Divider class="my-2" />
            <div class="flex justify-between text-gray-500 text-lg">
              <Button icon="pi pi-thumbs-up" text />
              <Button icon="pi pi-comment" text />
              <Button icon="pi pi-share-alt" text />
            </div>
          </template>
        </Card>
      </div>
    </Panel>

    <!-- 每日迷因 -->
    <Panel class="mb-4" header="每日迷因">
      <div class="text-center text-gray-500 mb-4">
        點擊按鈕隨機抽一個讓你的小今天充滿迷因吧！
      </div>
      <div class="flex justify-center mb-4">
        <Button label="開始" icon="pi pi-refresh" class="p-button-secondary" />
      </div>
      <Card class="max-w-2xl mx-auto">
        <template #header>
          <div class="bg-gray-200 w-32 h-32 flex items-center justify-center">
            <span class="text-gray-400 text-4xl">🖼️</span>
          </div>
        </template>
        <template #content>
          <div class="flex items-center text-xs text-gray-400 mb-1">
            <span>迷因分類</span>
            <span class="mx-2">|</span>
            <span>2小時前</span>
            <span class="mx-2">|</span>
            <span>艾某某</span>
          </div>
          <div class="font-bold text-xl mb-1">這裡是迷因的名字</div>
          <div class="text-sm text-gray-600">
            這是一個迷因的較長文字或故事，描述內容更豐富，讓大家更有共鳴。
          </div>
        </template>
      </Card>
    </Panel>

    <!-- 本月活躍作者 -->
    <Panel class="mb-4" header="本月活躍作者">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="mb-2 text-gray-600 text-sm">
            這是一個根據貢獻和社交互動計算的榜單，顯示本月最活躍的作者。點擊以查看更多。
          </div>
          <Button label="進去投餵" outlined />
        </div>
        <div class="flex-[2] space-y-2">
          <Card v-for="n in 5" :key="n" class="mb-2">
            <template #header>
              <Avatar icon="pi pi-user" shape="circle" class="mt-1" />
            </template>
            <template #content>
              <div class="font-bold">使用者</div>
              <div class="text-xs text-gray-400 mb-1">本月貢獻{{ n }}篇</div>
              <div class="text-xs text-gray-600">
                這是一個簡短的作者介紹或自我描述，展現其個人特色。
              </div>
            </template>
          </Card>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'
</script>

<script>
export default {
  name: 'HomePage',
}
</script>

<route lang="yaml">
meta:
  title: '首頁'
  login: ''
  admin: false
</route>
