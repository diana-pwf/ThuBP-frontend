<template>
  <div id="center">
    <div id="left">
      <img src="background.png" alt="">
    </div>
    <div id="right">
      <div id="title">
        <img id="icon" src="icon.png" width="50px" alt="">
        <h1>清球汇</h1>
      </div>
      <div id="form-body">
        <a-input class="user" placeholder="input TsinghuaID" v-model="ticket">
          <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
        <a-input class="user" placeholder="input nickname" v-model="username">
          <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
        <a-input-password class="password" placeholder="input password" v-model="password">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input-password>
        <a-button id="button-login" v-on:click="login()">login</a-button>
        <a-button id="button-logon" type="primary" v-on:click="logon()">logon</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";

@Component
export default class Logon extends Vue {
  username = 'pwf18'
  password = '123456'
  ticket = '2018013405'


  querystring = require('querystring')

  login(){
    this.$router.push('/')
  }
  async logon () {
    try {
      const { username, password } = this;
      const timestamp = new Date().getTime();
      window.location.href = "https://alumni-test.iterator-traits.com/fake-id-tsinghua/do/off/ui/auth/login/form/032771ca2d05561cefc5ca65dcff39f9/0?/local-login";
      localStorage.setItem("logon", JSON.stringify({
        username, password, timestamp
      }));
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }
}
</script>

<style scoped>
#center {
  width: 800px;
  height: 600px;
  margin: auto;
  position: relative;
  top: 100px;
  display: flex;
  align-items: center;
}

#form-body {
  width: 300px;
  margin-left: 20px;
}

.user {
  margin-bottom: 20px;
}

.password {
  margin-bottom: 20px;
}

#button {
  grid-column-start: 2;
}

#title {
  display: flex;
  justify-content: center;
  align-items: center;
}

#icon {
  margin: 20px;
}

</style>
