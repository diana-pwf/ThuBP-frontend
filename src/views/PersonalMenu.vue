<template>
  <div id="personalMenu">
    <div id="menu-body">
      <a-menu
          style="width: 256px; height:800px"
          :default-selected-keys="['1']"
          :default-open-keys="['1']"
          mode="inline"
          :theme="'light'"
          :selected-keys="[current]"
          @click="handleClick"
      >
        <a-menu-item key="1">
          <a-icon type="file-done" />
          个人信息
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="history" />
          我参加的比赛
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="history" />
          我组织的比赛
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="history" />
          设置
        </a-menu-item>
      </a-menu>
      <ResultCardList :match-lists="new Array(20).fill(1)"></ResultCardList>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import axios from "axios";
import {Modal} from "ant-design-vue";
import ResultCardList from "@/components/ResultCardList.vue";

@Component({
  components: {ResultCardList}
})

export default class PersonalMenu extends Vue {
  current = 1
  postList = []
  currentKey = '1';

  handleClick(e:any) {
    this.currentKey = e.key
  }

}
</script>

<style scoped>
#personalMenu {
  width: 1200px;
  margin: 100px auto 20px auto;
}

#menu-body {
  display: flex;
}


</style>
