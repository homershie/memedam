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
import Chart from 'primevue/chart'
import Menu from 'primevue/menu'
import Toolbar from 'primevue/toolbar'
import { useConfirm } from 'primevue/useconfirm'
import { useDialog } from 'primevue/usedialog'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import Tooltip from 'primevue/tooltip'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator from 'primevue/paginator'
import ConfirmPopup from 'primevue/confirmpopup'
import OverlayPanel from 'primevue/overlaypanel'
import Divider from 'primevue/divider'
import Avatar from 'primevue/avatar'
import Image from 'primevue/image'
import ConfirmDialog from 'primevue/confirmdialog'
import Skeleton from 'primevue/skeleton'

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
    .component('Chart', Chart)
    .component('Menu', Menu)
    .component('Toolbar', Toolbar)
    .component('IconField', IconField)
    .component('InputIcon', InputIcon)
    .component('ProgressSpinner', ProgressSpinner)
    .component('Paginator', Paginator)
    .component('ConfirmPopup', ConfirmPopup)
    .component('OverlayPanel', OverlayPanel)
    .component('Divider', Divider)
    .component('Avatar', Avatar)
    .component('Image', Image)
    .component('ConfirmDialog', ConfirmDialog)
    .component('Skeleton', Skeleton)

  // 全域提供 composables
  app.provide('useConfirm', useConfirm)
  app.provide('useDialog', useDialog)
  app.provide('useToast', useToast)
  app.provide('FilterMatchMode', FilterMatchMode)

  // 註冊全域指令
  app.directive('tooltip', Tooltip)
}
