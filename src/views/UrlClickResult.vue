<template>
  <div>
  <a-result v-if="this.$route.params.resultType==='fail'" id="fail" status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <a-button @click="goHome" type="primary">
        Back Home
      </a-button>
    </template>
  </a-result>
    <a-result v-if="this.$route.params.resultType==='success'||this.$route.params.resultType==='logon-success'" id="success" title="Great, we have done all the operations!">
      <template #icon>
        <a-icon type="smile" theme="twoTone" />
      </template>
      <template #extra>
        <a-button @click="goHome" type="primary">
          Back Home
        </a-button>
      </template>
    </a-result>
    <a-result style="width: 60%;margin:auto" id="logon-fail" v-if="this.$route.params.resultType==='logon-fail'"
        status="error"
        title="注册失败"
        sub-title="请检查是否出现下列错误"
    >
      <template #extra>
        <a-button @click="gotoLogon"  type="primary">
          Back
        </a-button>
      </template>

      <div class="desc">
        <p style="font-size: 16px;">
          <strong>有可能出现的错误</strong>
        </p>
        <p>
          <a-icon :style="{ color: 'red' }" type="close-circle" /> 证件号已经被注册过
        </p>
        <p>
          <a-icon :style="{ color: 'red' }" type="close-circle" />
          ...
        </p>
      </div>
    </a-result>
  </div>
</template>

<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";

@Component

export default class UrlClickResult extends Vue{
  resultType=false

  gotoLogon(){
     this.$router.push('/logon')
  }

  goHome(){
    if(this.$route.params.resultType==='logon-success'||this.$route.params.resultType==='fail'){
      this.$router.push('/')
    }
    else
    {
    this.$router.push('/home')
    }
  }
}
</script>

<style scoped>

</style>
