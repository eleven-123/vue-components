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
    path: '/reserveSite',
    name: 'reserveSite',
    component: () => import(/* webpackChunkName: "reserveSite" */ '@/views/reserveSite/reserveSite'),
  },
  {
    path: '/dayCourseTable',
    name: 'dayCourseTable',
    component: () => import(/* webpackChunkName: "dayCourseTable" */ '@/views/courseTable/dayCourseTable'),
  },
  {
    path: '/weekCourseTable',
    name: 'weekCourseTable',
    component: () => import(/* webpackChunkName: "weekCourseTable" */ '@/views/courseTable/weekCourseTable'),
  },
  {
    path: '/monthCourseTable',
    name: 'monthCourseTable',
    component: () => import(/* webpackChunkName: "monthCourseTable" */ '@/views/courseTable/monthCourseTable'),
  },
  {
    path: '/certificate',
    name: 'certificate',
    component: () => import(/* webpackChunkName: "certificate" */ '@/views/customTemplate/certificate'),
  },
]
const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home'),
    },
    ...childRoutes
]

const router = new Router({
  // mode: 'hash',
  mode: 'history',
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