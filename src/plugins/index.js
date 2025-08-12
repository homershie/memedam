/* eslint-disable vue/multi-word-component-names */
/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// PrimeVue Components
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'

export function registerPlugins(app) {
  app
    .component('Panel', Panel)
    .component('Card', Card)
    .component('Toast', Toast)
    .component('Button', Button)
    .component('Menubar', Menubar)
    .component('InputText', InputText)
    .component('Password', Password)
    .component('Tag', Tag)
    .component('Dropdown', Dropdown)
    .component('Calendar', Calendar)
    .component('Textarea', Textarea)
    .component('Dialog', Dialog)
    .component('InputSwitch', InputSwitch)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('InputNumber', InputNumber)
}
