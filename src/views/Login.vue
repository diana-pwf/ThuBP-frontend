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
        <a-input class="user" placeholder="input thuID" v-model="thuID">
          <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
        <a-input-password class="password" placeholder="input password" v-model="password">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input-password>
        <a-button id="button-login" type="primary" v-on:click="login()">login</a-button>
        <a-button id="button-logon" v-on:click="logon()">logon</a-button>
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
          this.$router.push('/home')
          // 在此处弹出提示 注册成功
        }
      } catch (e) {
        this.$message.error(JSON.stringify(e.response.data.error))
      }
    }

  logon(){
    this.$router.push('/logon')
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
