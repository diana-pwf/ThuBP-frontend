<template>
  <div id="center">
    <div>
      <a-result title="正在注册...">
        <template #icon>
          <a-spin size="large" />
        </template>
        <template #extra>
          <a-button @click="gotoLogon" type="primary">
            Back
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ThuRegister extends Vue {


  async logon() {
    try {
      const logonData = JSON.parse(localStorage.getItem("logon"));
      localStorage.removeItem("logon");
      if (!logonData) {
        this.$message.error("请重新访问注册页面");
        setTimeout(() => this.$router.push("/logon"), 2000);
        return;
      }
      const { username, password, timestamp } = logonData;
      if (new Date().getTime() - timestamp > 240 * 1000) {
        this.$message.error("注册信息过期，请重新访问注册页面");
        setTimeout(() => this.$router.push("/logon"), 2000);
        return;
      }
      const [, ticket] = location.search.split("=");
      let response = await axios({
        method: "post",
        url: '/api/v1/auth/register',
        data: {
          username: username,
          password: password,
          ticket: ticket
        }
      });
      if (response.status === 200) {
        this.$message.success('注册成功');
        setTimeout(() => this.$router.push("/urlClickResult/logon-success"), 1000);
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
      setTimeout(() => this.$router.push("/urlClickResult/logon-fail"), 1000);
    }
  }

  gotoLogon(){
    setTimeout(() => this.$router.push("/logon"), 2000);
  }
  mounted() {
    this.logon();
  }
}
</script>

<style scoped>
#center {
  position: relative;
  padding-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

</style>
