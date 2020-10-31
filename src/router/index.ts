import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../views/Login.vue'
import Logon from '../views/Logon.vue'
import PersonalMenu from "@/views/PersonalMenu.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/logon',
    name: 'Logon',
    component: Logon
  },
  {
    path: '/person',
    name: 'PersonalMenu',
    component: PersonalMenu
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
