<template>
  <div>
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
              <a-icon type="form" />
                赛事详情
            </span>
              <div id="detail">
              <img src="background.png" alt="比赛照片"/>
              <a-descriptions id="description" >
                <a-descriptions-item label="比赛名称">
                  一场比赛
                </a-descriptions-item>
                <a-descriptions-item label="组织者">
                  NPC
                </a-descriptions-item>
                <a-descriptions-item label="开始时间">
                  2020/11/12
                </a-descriptions-item>
                <a-descriptions-item label="结束时间">
                  2020/12/04
                </a-descriptions-item>
                <a-descriptions-item label="赛事地点">
                  清华紫荆操场
                </a-descriptions-item>
                <a-descriptions-item label="面向人群">
                   软件学院本科生
                </a-descriptions-item>
              </a-descriptions>
              </div>
              <div id="intro">
                <a-card>
                  <p>这是一段简介</p>
                </a-card>
              </div>
              <a-button id="detail_edit" type="link">
                编辑
              </a-button>
            </a-tab-pane>
            <a-tab-pane  key="2">
            <span slot="tab">
              <a-icon type="unordered-list" />
               选手、裁判列表
            </span>
              <ul>
                <li>
                  <a-comment>
                    <a slot="author">这是一支队伍名称</a>
                    <a-avatar
                        slot="avatar"
                        shape="square"
                        size="large"
                        :style="{ backgroundColor:'#f56a00', verticalAlign: 'left' }">
                      Team
                    </a-avatar>
                    <p slot="content" :style="{verticalAlign:'left'}">
                      这是一段简短的对比赛队伍的描述。
                    </p>
                  </a-comment>
                </li>
              </ul>
            </a-tab-pane>
            <a-tab-pane  key="3">
            <span slot="tab">
              <a-icon type="unordered-list" />
                比赛列表
            </span>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  <div>
  </div>
  </div>
</template>


<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";

@Component({components:{Navigation}})
export default class MatchDetail extends Vue{

}
</script>

<style scoped>
li{
  list-style-type: none;
  width:40%
}

#menu {
  margin: 3% 10% auto 10%;
}

a-tab-pane {
  overflow: scroll;
}

#description{
  margin-top:5%;
  margin-left: 5%;
}
img{
  width: 100px;
  height: 100px;
}
#detail{
  display: grid;
  grid-template-columns: 10% 90%;
}
#intro{
  margin-top: 5%;
  background:#ECECEC;
  padding:5%
}
#detail_edit{
  margin-top: 2%;
  margin-left: 80%;
}
</style>
