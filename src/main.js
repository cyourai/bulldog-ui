import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fontIcon/iconfont.css' // fontIcon

import '@/styles/index.scss' // global css
import '@/styles/weui.css'

import VueClipboard from 'vue-clipboard2'
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import VConsole from 'vconsole'
if (process.env.ENV_CONFIG === 'dev' || process.env.ENV_CONFIG === 'test') new VConsole()

import * as filters from './filters' // global filters

import {
  Toast,
  ToastPlugin,
  LoadingPlugin
} from 'vux'

Vue.use(Toast)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

// V-charts
import VCharts from 'v-charts'
Vue.use(VCharts)

// vue-codemirrot
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror)

// Vue.component('tinymce', tinymce)
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueClipboard)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
require('promise.prototype.finally').shim()

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
