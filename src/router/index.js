import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const childRoutes = [
  {
    path: '/elTableList',
    name: 'elTableList',
    component: () => import(/* webpackChunkName: "elTableList" */ '@/views/tableList/elTableList'),
  },
  {
    path: '/tableList',
    name: 'tableList',
    component: () => import(/* webpackChunkName: "tableList" */ '@/views/tableList/tableList'),
  }
]
const routes = [
    {
      path: '/',
      redirect: '/elTableList'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home'),
      children: childRoutes
    },
]

const router = new Router({
  mode: 'hash',
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
export default router