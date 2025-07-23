/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import pinia from '@/stores/pinia'
import router from '@/router'
import PrimeVue from 'primevue/config'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'

export function registerPlugins(app) {
  app
    .use(router)
    .use(pinia)
    .use(PrimeVue)
    .use(ToastService)
    .component('Panel', Panel)
    .component('Card', Card)
    .component('Toast', Toast)
    .component('Button', Button)
    .component('Menubar', Menubar)
}
