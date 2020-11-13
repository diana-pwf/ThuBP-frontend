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
    <a-menu-item id="user">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-avatar class="avatar" icon="user" />
          <span> 用户名</span><a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item @click="goPersonInfo" key="0">
            <a-icon type="user"/>个人资料
          </a-menu-item>
          <a-menu-item key="1">
            <a-icon type="schedule" />创建的比赛
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">
            <a-icon type="schedule" />参加的比赛
          </a-menu-item>
          <a-menu-item key="4">
            <a-icon type="message" />我的消息
          </a-menu-item>
          <a-menu-item key="5">
            <a-icon type="logout" />登出
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-menu-item>
  </a-menu>
</template>



<script>

import {Component, Vue} from 'vue-property-decorator';

@Component

export  default class Navigation extends Vue{
goPersonInfo(){
this.$router.push('personal');
}
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
