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
import CreateRound from "@/views/CreateRound.vue";
import UrlClickResult from "@/views/UrlClickResult.vue";
import ThuRegister from "@/views/ThuRegister.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'main',
    component: Login
  },
  {
    path:'/login',
    name:'Login',
    component:Login
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
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
