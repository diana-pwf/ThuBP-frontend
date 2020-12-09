<template>
  <div>
  <a-result v-if="this.$route.params.resultType==='fail'" id="fail" status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <a-button type="primary">
        Back Home
      </a-button>
    </template>
  </a-result>
    <a-result v-if="this.$route.params.resultType==='success'" id="success" title="Great, we have done all the operations!">
      <template #icon>
        <a-icon type="smile" theme="twoTone" />
      </template>
      <template #extra>
        <a-button type="primary">
          Next
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";

@Component

export default class UrlClickResult extends Vue{
  resultType=false;
  mounted(){

  }
}
</script>

<style scoped>

</style>
