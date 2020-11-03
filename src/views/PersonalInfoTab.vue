<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="menu">
      <div style="width: 85%; height:100%">
        <a-tabs
            default-active-key="1"
            :tab-position="'left'"
            :style="{ height: '100%' }"
        >
          <a-tab-pane  key="1" force-render>
            <span slot="tab">
              <a-icon type="apple" />
                个人信息
            </span>
            <a-descriptions title="User Info">
              <a-descriptions-item label="username">
                pwf18
              </a-descriptions-item>
              <a-descriptions-item label="thuId">
                2018013405
              </a-descriptions-item>
              <a-descriptions-item label="gender">
                Female
              </a-descriptions-item>
              <a-descriptions-item label="mobile">
                18108654542
              </a-descriptions-item>
              <a-descriptions-item label="email">
                diana_pwf@163.com
              </a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane  key="2">
            <span slot="tab">
              <a-icon type="schedule" />
                创建的比赛
            </span>
            <ResultCardList
                :match-lists="new Array(20).fill(1)">
            </ResultCardList>
          </a-tab-pane>
          <a-tab-pane  key="3">
            <span slot="tab">
              <a-icon type="schedule" />
                参加的比赛
            </span>
            <ResultCardList :match-lists="new Array(20).fill(1)"></ResultCardList>
          </a-tab-pane>
          <a-tab-pane  key="4">
            <span slot="tab">
              <a-icon type="message" />
                我的消息
            </span>
            <ResultCardList :match-lists="new Array(20).fill(1)"></ResultCardList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import axios from "axios";
import {Modal} from "ant-design-vue";
import ResultCardList from "../components/ResultCardList.vue";
import Navigation from "../components/Navigation.vue";

@Component({
  components: {ResultCardList, Navigation}
})

export default class PersonalInfoTab extends Vue {


}
</script>

<style scoped>
#personalMenu {
  max-width: 100%;
  margin: 0;
}

#menu {
  margin: 3% 10% auto 10%;
}

a-tab-pane {
  overflow: scroll;
}

</style>
