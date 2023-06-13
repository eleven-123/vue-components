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

// 子应用
import { useQiankun } from './qiankun/qiankun'

Vue.config.productionTip = false

const globalData = {
  msg: 'sss'
}

const vueApp = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

vueApp.$nextTick(()=>{
  useQiankun(globalData)
})