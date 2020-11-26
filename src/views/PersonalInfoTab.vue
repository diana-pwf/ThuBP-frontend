<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="menu">
      <div style="width: 100%; height:100%">
        <a-tabs
            default-active-key="1"
            :tab-position="'left'"
            :style="{ height: '100%' }"
            @change="callback"
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
                :matchLists="this.myOrganizedMatches">
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
            <div>
              <div class='row' style='margin-top: 5ex'>
                <div class='col-md-4'>
                  <h3><i class="fas fa-box"></i>5</h3>
                  <h5>我的待办</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-success'><i class="fas fa-box"></i>9</h3>
                  <h5 class='text-success'>本周累计收到消息</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-warning'><i class="fas fa-box"></i> 7</h3>
                  <h5 class='text-warning'>本周累计发送消息</h5>
                </div>
              </div>
              <div id="msg-list">
                    <!--<a-comment id="comment">
                      <a slot="author">消息主题</a>
                      <a-avatar
                          slot="avatar"
                          shape="square"
                          size="large"
                          :style="{ backgroundColor:'#f56a00', verticalAlign: 'left' }">
                        Msg
                      </a-avatar>
                      <p slot="content" :style="{verticalAlign:'left'}">
                        消息描述。
                      </p>-->
                      <a-table :columns="columns" :data-source="data">
                        <a slot="name" slot-scope="text">{{ text }}</a>
                        <span slot="customTitle"><a-icon type="smile-o" />发送者/接收者</span>
                        <span slot="tags" slot-scope="tags">
                          <a-tag
                              v-for="tag in tags"
                              :key="tag"
                              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
                          >
                            {{ tag.toUpperCase() }}
                          </a-tag>
                        </span>
                        <span slot="action" slot-scope="text, record">
                          <a>查看详情</a>
                          <a-divider type="vertical" />
                          <a>删除</a>
                          <a-divider type="vertical" />
                          <a class="ant-dropdown-link">更多<a-icon type="down" /> </a>
                        </span>
                      </a-table>
                      <!--<span class="more" style="color: dodgerblue" slot="actions">更多</span>
                    </a-comment>-->
                </div>
              </div>
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
import {findMatchesByOrganizerId} from '../../myQuery.js';
import { createDecorator } from 'vue-class-component'

// Declare Log decorator.
// export const Log = createDecorator((options, key) => {
//   console.log(options)
//   // Keep the original method for later.
//   const originalMethod = options.data[key]
//   options[key] = originalMethod
//   options.data[key] = undefined
// })



@Component({
  components: {ResultCardList, Navigation},
})



export default class PersonalInfoTab extends Vue {
  columns = [
    {
      dataIndex: 'name',
      key: 'name',
      slots: { title: 'customTitle' },
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '发送时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '消息主题',
      dataIndex: 'theme',
      key: 'theme',
    },
    {
      title: '标注',
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
      name: 'John Brown',
      time: '2020.11.16 20:30',
      theme: 'Hello world',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      time: '2020.11.16 20:30',
      theme: 'Hello world',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      time: '2020.11.16 20:30',
      theme: 'Hello world',
      tags: ['cool', 'teacher'],
    },
  ];

  user = {
    gender:'',
    thuId:'',
    userId:'',
    username:'',
    role:''
  }

  myOrganizedMatches = []
  myParticipatedMatches = []

  async getMyOrganizeMatch(userId) {
    try {
      let res = await this.$apollo.query({
        query: findMatchesByOrganizerId,
        variables:{userIds:userId}
      });
      this.myOrganizedMatches = res.data.findUserById[0].organizedMatches
      console.log(this.myOrganizedMatches)
    }
    catch (e) {
      console.log(e);
    }
  }

  callback(key)
  {
    if (key === "2")
    {
      this.getMyOrganizeMatch(this.user.userId);
    }
  }

  async getUserInfo()
  {
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/user/info',
        params: {

        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('get userInfo success!')
        this.user.userId = response.data.userId
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  querystring = require('querystring')

  mounted()
  {
    this.getUserInfo();
  }
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

ul,li {
  list-style-type: none;
}

#comment >>> p {
  text-align: left;
}

#msg-list {
  margin: 5%;
}
.row{
  margin-left: 10%;
}
</style>
