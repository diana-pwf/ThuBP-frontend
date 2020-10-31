<template>
  <a-menu
      class="a-menu"
      theme="dark"
      mode="horizontal"
      :default-selected-keys="['1']"
     >
    <a-menu-item id="main" key="1">
      赛事主页
    </a-menu-item>
    <a-menu-item id="create"  key="2">
      创建比赛
    </a-menu-item>
    <a-menu-item id="logout"  key="3">
      登出
    </a-menu-item>
    <a-menu-item id="message"><a-icon type="message" /></a-menu-item>
    <a-menu-item id="user">
      <a-avatar class="avatar" icon="user" />
      <span> 用户名</span>
    </a-menu-item>
  </a-menu>
</template>



<script>

import {Component, Vue} from 'vue-property-decorator';

@Component

export  default class Navigation extends Vue{

}
</script>

<style scoped>

#main{
  position: absolute;
  left: 10%;
}
#create{
  position: absolute;
  left: 18%;
}
#logout{
  position: absolute;
  left: 26%;
}
#message{
  position: absolute;
  left: 77%;
}
#user{
  position: absolute;
  left: 80%;
}
.a-menu{
  height:46px;
  position:relative;
  margin-left:0;
}
.avatar{
  background-color: dodgerblue;
}
</style>
