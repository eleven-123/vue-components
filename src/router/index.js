import { createRouter, createWebHashHistory } from "vue-router"

const childRoutes = [
  {
    path: '/elTableList',
    name: 'elTableList',
    component: () => import(/* webpackChunkName: "elTableList" */ '@/views/tableList/elTableList'),
  }
]
const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home'),
      children: childRoutes
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router