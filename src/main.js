import './assets/main.css'

import { createApp } from 'vue'
import pinia from '@/stores/pinia'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import Aura from '@primeuix/themes/aura'
import { updatePreset } from '@primeuix/themes'
import ConfirmationService from 'primevue/confirmationservice'

// 引入 PrimeVue 基本樣式
import 'primeicons/primeicons.css'
// 引入 Remix Icon
import 'remixicon/fonts/remixicon.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ToastService)
app.use(DialogService)
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
      50: '#FFF5FC',
      100: '#FFEBF9',
      200: '#FFCCEF',
      300: '#FFADE2',
      400: '#FF70C1',
      500: '#ff3399',
      600: '#E62984',
      700: '#BF1D63',
      800: '#991248',
      900: '#730A31',
      950: '#4A041A',
    },
    secondary: {
      50: '#FDF7FF',
      100: '#FAF0FF',
      200: '#EFD4FC',
      300: '#E4BBFC',
      400: '#C789FA',
      500: '#a259f7',
      600: '#8B47DE',
      700: '#6B32BA',
      800: '#4B2194',
      900: '#311270',
      950: '#1A0747',
    },
    info: {
      50: '#FDF7FF',
      100: '#FAF0FF',
      200: '#EFD4FC',
      300: '#E4BBFC',
      400: '#C789FA',
      500: '#a259f7',
      600: '#8B47DE',
      700: '#6B32BA',
      800: '#4B2194',
      900: '#311270',
      950: '#1A0747',
    },
    success: {
      50: '#F5FFFA',
      100: '#EBFFF4',
      200: '#CCFFE0',
      300: '#ADFFC6',
      400: '#70FF86',
      500: '#33FF33',
      600: '#29E629',
      700: '#1DBF1D',
      800: '#129912',
      900: '#0A730A',
      950: '#044A04',
    },
    warning: {
      50: '#FFFEF5',
      100: '#FFFEEB',
      200: '#FCFACA',
      300: '#FCF8AC',
      400: '#FAF170',
      500: '#f7e733',
      600: '#DEC62A',
      700: '#BA9B1E',
      800: '#947213',
      900: '#704E0A',
      950: '#472B04',
    },
    danger: {
      50: '#FFF5FC',
      100: '#FFEBF9',
      200: '#FFCCEF',
      300: '#FFADE2',
      400: '#FF70C1',
      500: '#ff3399',
      600: '#E62984',
      700: '#BF1D63',
      800: '#991248',
      900: '#730A31',
      950: '#4A041A',
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
      50: '#FDF7FF',
      100: '#FAF0FF',
      200: '#EFD4FC',
      300: '#E4BBFC',
      400: '#C789FA',
      500: '#a259f7',
      600: '#8B47DE',
      700: '#6B32BA',
      800: '#4B2194',
      900: '#311270',
      950: '#1A0747',
    },
    // 輔助色 Success/Green (#38FF8B)
    green: {
      50: '#F5FFFA',
      100: '#EBFFF4',
      200: '#CCFFE0',
      300: '#ADFFC6',
      400: '#70FF86',
      500: '#33FF33',
      600: '#29E629',
      700: '#1DBF1D',
      800: '#129912',
      900: '#0A730A',
      950: '#044A04',
    },
    // 警告色 Warning/Yellow (#F7E733)
    yellow: {
      50: '#FFFEF5',
      100: '#FFFEEB',
      200: '#FCFACA',
      300: '#FCF8AC',
      400: '#FAF170',
      500: '#f7e733',
      600: '#DEC62A',
      700: '#BA9B1E',
      800: '#947213',
      900: '#704E0A',
      950: '#472B04',
    },
  },
})

registerPlugins(app)

app.mount('#app')
