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

        <a-button id="button-login" v-on:click="login()">login</a-button>
        <a-button :disabled="!validation||!containValidation" id="button-logon" type="primary" v-on:click="logon()">logon</a-button>
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
  username = 'pwf18'
  password = '123456'
  ticket = '2018013405'

  temp=true
  validation=false
  containValidation=false
  querystring = require('querystring')


  async isUsernameRepeat(){
    try {
      let res = await this.$apollo.query({
        query:findUserExactByName,
        variables:{
          username:this.username
        }
      })
      if(res.data.findUserByUsername===null){
        this.validation=true
      }
      else{
        this.validation=false
      }
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
    }
  }

  mounted(){
    this.isUsernameRepeat()
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

.feedback{
  margin-bottom: 20px;
}

</style>
