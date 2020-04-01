import Clipboard from './clipboard'
import VueClipboard from 'vue-clipboard2'
const install = function(Vue) {
  Vue.directive('Clipboard', Clipboard)
}

if (window.Vue) {
  window.clipboard = Clipboard
  Vue.use(install); // eslint-disable-line
  Vue.use(VueClipboard)
}

Clipboard.install = install
export default Clipboard
