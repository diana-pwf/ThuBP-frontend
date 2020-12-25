<template>
  <div id="center">
    <div id="form">
      <div id="title">
        <img id="icon" src="icon.png" width="60px" alt="">
        <h1 style="color: purple;font-size: 50px">清球汇</h1>
      </div>
      <div id="form-body">
        <a-form>
        <a-input class="user" placeholder="input thuID" name="username" v-model="thuID">
          <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
        <a-input-password class="password" placeholder="input password" name="password" v-model="password">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input-password>
        <a-checkbox @change="statusChange">
          <span style="color: white">Remember Me</span>
        </a-checkbox>
        </a-form>
        <div style="margin-top: 10px">
        <a-button id="button-login" style="margin-right: 20%;width: 40%" type="primary" v-on:click="login()">login</a-button>
        <a-button id="button-logon" style="width: 40%" v-on:click="logon">logon</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";

@Component
export default class Login extends Vue {
  thuID = ""
  password = ""
  rememberMe = false

  statusChange() {
    if (this.rememberMe)
    {
      this.rememberMe = false
    }
    else
    {
      this.rememberMe = true
    }
  }

  async login () {
    try {
      let response = await axios({
        method:"post",
        url:'/api/v1/auth/login',
        data:{
          thuId: this.thuID,
          password: this.password,
          rememberMe:this.rememberMe
        }})
      if (response.status === 200) {
        this.$message.success('log in success!')
        localStorage.setItem('jwt',response.headers.authorization)
        this.$router.push('/home')
        // 在此处弹出提示 注册成功
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
    }
  }

  logon(){
    this.$router.push('/logon')
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

#left img {
  height: 100%;
}

.user {
  margin-bottom: 20px;
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


@media screen and (max-width: 1000px){
  #form-body {
    margin-top: 5%;
    margin-left: 20px;
    width: 80%;
    margin: auto;
  }
}
</style>
