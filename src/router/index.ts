import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../views/Login.vue'
import Logon from '../views/Logon.vue'
import Home from "@/views/Home.vue";
import SearchResults from "@/views/SearchResults.vue";
import PersonalInfoTab from "@/views/PersonalInfoTab.vue";
import GameDetail from "@/views/GameDetail.vue";
import MatchDetail from "@/views/MatchDetail.vue";
import CreateMatch from "@/views/CreateMatch.vue";

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
    path: '/personal',
    name: 'PersonalInfoTab',
    component: PersonalInfoTab
  },
  {
    path: '/search/:value/:mode',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
   path: '/home',
    name:'Home',
    component:Home
  },
  {
    path: '/gameDetail',
    name:'gameDetail',
    component:GameDetail
  },
  {
    path:'/matchDetail/:matchId',
    name:'matchDetail',
    component:MatchDetail
  },
  {
    path:'/createMatch',
    name:'createMatch',
    component:CreateMatch
  }

]

const router = new VueRouter({
  routes
})

export default router
