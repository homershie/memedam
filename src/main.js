import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Menubar from 'primevue/menubar'
import Aura from '@primeuix/themes/aura'
import { updatePreset } from '@primeuix/themes'
import ConfirmationService from 'primevue/confirmationservice'

// 引入 PrimeVue 基本樣式
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(Menubar)
app.use(ConfirmationService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false, // 強制只用淺色
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})

// 自訂品牌顏色主題
updatePreset({
  semantic: {
    primary: {
      50: '#fef7fc',
      100: '#fce7f6',
      200: '#fcceee',
      300: '#faa2de',
      400: '#f967c7',
      500: '#ff3399', // 主色 #FF3399
      600: '#e91b7a',
      700: '#cc1461',
      800: '#a91150',
      900: '#8b1144',
      950: '#55022a',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
  primitive: {
    // 次要色 Secondary (#A259F7)
    purple: {
      50: '#f4f1ff',
      100: '#ebe5ff',
      200: '#d9ceff',
      300: '#bfa8ff',
      400: '#9f75ff',
      500: '#a259f7', // 次要色 #A259F7
      600: '#7c2ee8',
      700: '#6b1fcc',
      800: '#5918a7',
      900: '#4a1687',
      950: '#2d0a5a',
    },
    // 輔助色 Success/Green (#38FF8B)
    green: {
      50: '#f0fdf9',
      100: '#ccfdf2',
      200: '#99fae6',
      300: '#5cf4d6',
      400: '#38ff8b', // 輔助色 #38FF8B
      500: '#10d9aa',
      600: '#05b88a',
      700: '#059470',
      800: '#07745b',
      900: '#0a5f4b',
      950: '#01372d',
    },
    // 警告色 Warning/Yellow (#F7E733)
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#f7e733', // 警告色 #F7E733
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
  },
})

registerPlugins(app)

app.mount('#app')
