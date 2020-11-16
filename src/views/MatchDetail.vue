<template>
  <div>
    <div id="personalMenu">
      <Navigation></Navigation>
      <div id="menu">
        <div style="width: 100%; height:100%">
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
              <div class='row' style='margin-top: 5ex'>
                <div class='col-md-4'>
                  <h3><i class="fas fa-box"></i>5</h3>
                  <h5>比赛队伍</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-success'><i class="fas fa-box"></i>55</h3>
                  <h5 class='text-success'>比赛选手</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-warning'><i class="fas fa-box"></i> 7</h3>
                  <h5 class='text-warning'>比赛裁判</h5>
                </div>
              </div>
              <div id="person_list">
                <div>
                  <span class="list_title">队伍列表</span>
                  <br/>
                  <b-button variant="outline-success" class="add"><b-icon icon="person-plus-fill"/> 添加队伍</b-button>
              <ul id="team">
                <li v-for="(item,index) in new Array(5).fill(1)" :key="index">
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
                    <span class="more" style="color: dodgerblue" slot="actions">更多</span>
                  </a-comment>
                </li>
              </ul>
                </div>
                <div>
                  <span class="list_title">裁判列表</span>
                  <b-button variant="outline-success" b-icon="person-plus" class="add"><b-icon icon="person-plus"/> 添加裁判</b-button>
              <ul id="referee">
                <li v-for="(item,index) in new Array(5).fill(1)" :key="index">
                  <a-comment>
                    <a slot="author">裁判名称</a>
                    <a-avatar
                        slot="avatar"
                        shape="square"
                        size="large"
                        :style="{ backgroundColor:'#9400D3', verticalAlign: 'left' }">
                      Referee
                    </a-avatar>
                    <p slot="content" :style="{verticalAlign:'left'}">
                      这是一段简介
                    </p>
                    <span class="more" style="color: dodgerblue" slot="actions">更多</span>
                  </a-comment>
                </li>
              </ul>
              </div>
              </div>
            </a-tab-pane>
            <a-tab-pane  key="3">
            <span slot="tab">
              <a-icon type="unordered-list" />
                比赛列表
            </span>
              <b-button class="button" block variant="outline-success"><b-icon icon="journal-plus"></b-icon>添加赛事</b-button>
              <b-card bg-variant="default">
                <b-card-text>
                    <div>
                      <div class="matchCard">
                    <img src="background.png" alt="赛事图片"/>
                    <div>
                      <h4>第一轮小组赛<b-button  id="edit_button" variant="danger">修改赛事</b-button></h4>
                      <a-descriptions style="margin-top:5%">
                        <a-descriptions-item label="比赛场数">
                          8场
                        </a-descriptions-item>
                        <a-descriptions-item label="赛制">
                          循环赛
                        </a-descriptions-item>
                        <a-descriptions-item label="状态">
                          进行中
                        </a-descriptions-item>
                      </a-descriptions>

                    </div>
                    </div>
                          <a-table class="table" :columns="columns" :data-source="data">
                            <a slot="name" slot-scope="text">{{ text }}</a>
                            <span slot="customTitle">比赛名称</span>
                            <span slot="tags" slot-scope="tags">
                          <a-tag
                              v-for="tag in tags"
                              :key="tag"
                              :color="tag === 'onprocess' ? '' : tag.length > 5 ? 'geekblue' : 'green'"
                          >
                            {{ tag.toUpperCase() }}
                          </a-tag>
                            </span>
                            <span slot="action" slot-scope="text, record">
                          <a class="ant-dropdown-link">查看详情</a>
                        </span>
                          </a-table>
                  </div>

                </b-card-text>
              </b-card>
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
  columns = [
    {
      dataIndex: 'name',
      key: 'name',
      slots: { title: 'customTitle' },
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '组织者',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '开始时间',
      dataIndex: 'begin_time',
      key: 'begin_time',
    },
    {
      title: '结束时间',
      key: 'end_time',
      dataIndex: 'end_time',
    },
    {
      title: '地点',
      key: 'location',
      dataIndex: 'location',
    },
    {
      title: 'tags',
      key: 'tags',
      dataIndex: 'tags',
      scopedSlots: { customRender: 'tags' },
    },
    {
      title: '...',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];
  data = [
    {
      key: '1',
      name: '赛事名称',
      owner: 'npc',
      location: '紫荆操场',
      begin_time:'2020/10/22',
      end_time:'2020/12/04',
      tags: ['nice', 'on_process'],
    },
    {
      key: '2',
      name: '赛事名称',
      owner: 'npc',
      location: '紫荆操场',
      begin_time:'2020/10/22',
      end_time:'2020/12/04',
      tags: ['nice', 'on_process'],
    }
  ]

}
</script>

<style scoped>
li{
  list-style-type: none;
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
#person_list{
  margin-top: 10%;
  display: grid;
  grid-template-columns:  50% 50%;

}
.list_title{
  font-weight: bold;
}
.add{
  width:90%;
  margin-top: 10%;
  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 2%;
}
h4{
  font-weight: bold;
  color: dodgerblue;
  text-align: left;
}
.matchCard{
  display: grid;
  grid-template-columns: 20% 80%;

}

.table{
  margin-top:2%
}
/*.game{*/
/*  display: grid;*/
/*  grid-template-columns: 10% 90%;*/
/*  margin-top: 5%;*/
/*}*/
/*.game_name{*/
/*  left: 2%;*/
/*}*/
.button {
  margin-bottom: 2%;
}
#edit_button{
  margin-top:-6%;
  margin-left: 85%;
}
</style>
