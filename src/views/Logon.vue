<template>
  <div id="center">
    <div id="form">
      <div id="title">
        <img id="icon" src="icon.png" width="60px" alt="">
        <h1 style="color: purple;font-size: 50px">清球汇</h1>
      </div>
      <div id="form-body">
        <b-form-input @input="isUsernameRepeat" v-model="username" placeholder="用户名：由数字或字母组成" :state="validation&&containValidation" class="feedback-user">
        </b-form-input>
        <b-form-valid-feedback class="feedback" :state="validation&&containValidation">
          Looks good
        </b-form-valid-feedback>
        <div>
        <b-form-invalid-feedback class="feedback" :state="validation">
          the username has been occupied!
        </b-form-invalid-feedback>
        <b-form-invalid-feedback class="feedback" :state="containValidation">
          the username must contain number or letter!
        </b-form-invalid-feedback>
        </div>
        <a-input-password class="password" placeholder="input password" v-model="password">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input-password>
        <div style="margin-top: 10px; display: grid; column-gap: 10%; grid-template-columns: 1fr 1fr;">
          <a-button id="button-login" style="flex-basis: 0;" v-on:click="login()">login</a-button>
          <a-button id="button-logon" style="flex-basis: 0;" type="primary" v-on:click="logon()">logon</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import {getCarouselMatches,findUserExactByName} from "../../myQuery";

@Component
export default class Logon extends Vue {
  username = ''
  password = ''
  ticket = ''

  validation=false
  containValidation=false
  querystring = require('querystring')


  async isUsernameRepeat(){
    try {
      let response = await axios({
        method: 'get',
        url: `/api/v1/user/check?username=${encodeURIComponent(this.username)}`,
      })
      this.validation = (response.data.userId === null)
      let regNumber = /\d+/;
      let regString = /[a-zA-Z]+/;
      if(!regNumber.test(this.username) && !regString.test(this.username)){
        this.containValidation=false
      }
      else{
        this.containValidation=true
      }
    }
    catch (e) {
      console.log(e);
    }
  }


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
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  mounted(){
    this.isUsernameRepeat()
  }
}
</script>

<style scoped>
#center {
  height: 100%;
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/ball.png');
  background-size: cover;
}

#form-body {
  margin-top: 5%;
  width: 450px;
  margin-left: 20px;
}

.password {
  margin-bottom: 20px;
}

#title {
  display: flex;
  justify-content: center;
  align-items: center;
}

#icon {
  margin: 20px;
}

.feedback{
  margin-bottom: 20px;
}

@media screen and (max-width: 1000px){
  #form-body {
      margin-top: 5%;
      margin-left: 20px;
      width: 100%;
      margin: auto;
    }
}
</style>
