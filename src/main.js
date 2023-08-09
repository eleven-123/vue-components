import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/js/prototype'

// element引入
import '@/assets/js/element-import.js'

// mock
import "@/mock";

// 多语言
import i18n from './lang'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
