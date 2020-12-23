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
import TeamDetail from "@/views/TeamDetail.vue";
import CreateRound from "@/views/CreateRound.vue";
import UrlClickResult from "@/views/UrlClickResult.vue";
import ThuRegister from "@/views/ThuRegister.vue";
// import qwq from "@/views/qwq.vue";

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
    path: '/personal/:key',
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
    path: '/gameDetail/:matchId/:roundId/:gameId',
    name:'gameDetail',
    component:GameDetail
  },
  {
    path:'/matchDetail/:matchId',
    name:'matchDetail',
    component:MatchDetail
  },
  {
    path:'/matchDetail/:matchId/:token',
    name:'matchDetailWithToken',
    component:MatchDetail
  },
  {
    path:'/createMatch',
    name:'createMatch',
    component:CreateMatch
  },
  {
    path:'/teamDetail/:matchId/:unitId',
    name:'teamDetail',
    component:TeamDetail
  },
  {
    path:'/createRound/:matchId',
    name:'createRound',
    component:CreateRound
  },
  {
    path:'/editRound/:matchId/:roundId',
    name:'editRound',
    component:CreateRound
  },
  {
    path:'/urlClickResult/:resultType',
    name:'urlClickResult',
    component:UrlClickResult
  },
  {
    path:'/local-login',
    name:'localLogin',
    component:ThuRegister
  },
  {
    path:'/thuLogin',
    name:'thuLogin',
    component:ThuRegister
  },
  // {
  //   path:'/qwq',
  //   name:'qwq',
  //   component:qwq
  // }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
