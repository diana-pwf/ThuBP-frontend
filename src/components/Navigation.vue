<template>
  <a-menu
      class="a-menu"
      theme="dark"
      mode="horizontal"
      id="navigation-bar"
      :default-selected-keys=navKeys
     >
    <a-menu-item id="main" @click="goHome" key="1">
      赛事主页
    </a-menu-item>
    <a-menu-item id="create" @click="goCreateMatch" key="2">
      创建比赛
    </a-menu-item>
    <a-menu-item id="user" key="3">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link user-dropdown-link" @click="e => e.preventDefault()">
          <a-avatar class="avatar" icon="user" :style="{}" />
          <span class="delimiter"></span>
          <span class="text-middle">{{username}}</span><a-icon class="down-icon" type="down" />
        </a>
        <a-menu slot="overlay" class="dropdown-list">
          <a-menu-item @click="goPersonInfo('1')" key="4">
            <a-icon type="user"/>个人资料
          </a-menu-item>
          <a-menu-item @click="goPersonInfo('2')" key="5">
            <a-icon type="schedule" />创建的比赛
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item @click="goPersonInfo('3')" key="6">
            <a-icon type="schedule" />参加的比赛
          </a-menu-item>
          <a-menu-item @click="goPersonInfo('4')" key="7">
            <a-icon type="message" />我的消息
          </a-menu-item>
          <a-menu-item @click="goPersonInfo('5')" key="8">
            <a-icon type="logout" />登出
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-menu-item>
  </a-menu>
</template>



<script>

import {Component, Prop, Vue} from 'vue-property-decorator';

@Component

export default class Navigation extends Vue{
  @Prop({type:Array,default:function (){return []}})navKeys
  @Prop({type:String, default:function (){return ""}})username

  goPersonInfo(key){
    if (this.$router.currentRoute.path !== `/personal/${key}`) {
      this.$router.push(`/personal/${key}`);
    }
  }

  goHome(){
    if (this.$router.currentRoute.path !== '/home') {
      this.$router.push('/home');
    }
  }

  goCreateMatch(){
    if (this.$router.currentRoute.path !== '/creatematch') {
      this.$router.push('/creatematch');
    }
  }
  mounted(){
    // console.log(this.navKeys)
  }
}
</script>

<style scoped>
#navigation-bar {
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
}

@media screen and (min-width: 500px) {
  #navigation-bar {
    padding-left: 10%;
    padding-right: 10%;
  }
}

#main{

}
#create{

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
  margin-left: auto;
}
.a-menu{
  height:46px;
  position:relative;
  margin-left:0;
}
.delimiter {
  display: inline-block;
  width: 4px;
}
.down-icon {
  margin: 0;
  vertical-align: middle;
}
.text-middle {
  vertical-align: middle;
}
.dropdown-list .ant-dropdown-menu-item {
  display: flex;
  align-items: center;
}
.avatar {
  background-color: dodgerblue;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
