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

// 引入 PrimeVue Icon - 使用正確的路徑
import 'primeicons/primeicons.css'
// 引入 Remix Icon
import 'remixicon/fonts/remixicon.css'

// 引入 Vue Gtag
import { configure } from 'vue-gtag'

// 設定 Vue Gtag
configure({
  tagId: 'G-7L0HW510TQ',
  pageTracker: {
    router,
  },
})

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
      darkModeSelector: '.dark',
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
      500: '#A259F7',
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
    dark: {
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
      surface: {
        50: '#f5f6f6',
        100: '#e6e7e7',
        200: '#cfd2d2',
        300: '#aeb1b2',
        400: '#858a8b',
        500: '#6a6f71',
        600: '#5a5e60',
        700: '#4d4f51',
        800: '#434547',
        900: '#3b3d3e',
        950: '#252627',
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
      50: '#edfff4',
      100: '#d5ffe7',
      200: '#aeffd0',
      300: '#6fffae',
      400: '#38ff8b',
      500: '#00e960',
      600: '#00c24c',
      700: '#00983f',
      800: '#047736',
      900: '#06612f',
      950: '#003717',
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
