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
  },
  {
    path: '/classSchedule',
    name: 'classSchedule',
    component: () => import(/* webpackChunkName: "classSchedule" */ '@/views/classSchedule/classSchedule'),
  },
  {
    path: '/reserveSite',
    name: 'reserveSite',
    component: () => import(/* webpackChunkName: "reserveSite" */ '@/views/classSchedule/reserveSite'),
  },
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

const router = new Router({
  mode: 'hash',
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

// 解决VUE路由报错NAVIGATION ABORTED FROM “/A“ TO “/B“ VIA A NAVIGATION GUAR
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject){
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

export default router