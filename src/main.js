import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// element引入
import element from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import * as Icons from '@element-plus/icons-vue' // 引入所有图标，并命名为 Icons

const app = createApp(App)
// 通过遍历的形式注册所有 svg组件，会就义一点点性能
for (let i in Icons) {
    app.component(i, Icons[i])
}

app.use(router)
app.use(element)
app.mount('#app')