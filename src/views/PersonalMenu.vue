<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="menu">
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
        <div id="show-page">
          <div v-if="currentKey === '1'">
            <a-descriptions
                title="个人信息"
                bordered
                :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
            >
              <a-descriptions-item label="name">
                pwf
              </a-descriptions-item>
              <a-descriptions-item label="studentID">
                2018013405
              </a-descriptions-item>
              <a-descriptions-item label="Time">
                18:00:00
              </a-descriptions-item>
              <a-descriptions-item label="Amount">
                $80.00
              </a-descriptions-item>
              <a-descriptions-item label="Discount">
                $20.00
              </a-descriptions-item>
              <a-descriptions-item label="Official">
                $60.00
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <ResultCardList v-if="currentKey === '2' || currentKey === '3'" :match-lists="new Array(20).fill(1)"></ResultCardList>
          <div v-if="currentKey === '4'">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import axios from "axios";
import {Modal} from "ant-design-vue";
import ResultCardList from "@/components/ResultCardList.vue";
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {ResultCardList, Navigation}
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
  max-width: 100%;
  margin: 0;
}

#menu-body {
  display: flex;
}

#menu {
  margin: 3% 10% auto 10%;
}

#show-page {
  height: 800px;
}

</style>
