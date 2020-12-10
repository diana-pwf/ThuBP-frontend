<template>
  <div id="personalMenu">
    <Navigation :username="user.username"></Navigation>
    <div id="menu">
      <div style="width: 100%; height:100%">
        <a-tabs
            :default-active-key = this.$route.params.key
            :activeKey = this.$route.params.key
            :tab-position = "'left'"
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
            <ResultCardList
                :match-lists="this.myParticipatedMatches">
            </ResultCardList>
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
                      <a-table :columns="columns" :data-source="myNotifications">
<!--                        <a slot="name" slot-scope="text">{{ text }}</a>-->
<!--                        <span slot="customTitle"><a-icon type="smile-o" />发送者</span>-->
                        <span slot="tags" slot-scope="tags">
                          <a-tag
                              v-for="tag in tags"
                              :key="tag"
                              :color="tag === 'unread' ? 'volcano' : 'read' ? 'geekblue' : 'green'"
                          >
                            {{ tag.toUpperCase() }}
                          </a-tag>
                        </span>
                        <span  slot='action' slot-scope="text, record">
<!--                          <a>查看详情</a>-->
                          <a-divider type="vertical" />
                          <a @click="deleteNote(record)">删除</a>
                          <a-divider type="vertical" />
                          <a @click="showModal(record)"  class="ant-dropdown-link">查看详情<a-icon type="down" /> </a>
                          <a-modal :mask="false" v-model="modalVisible" :title="infoModal.title" @ok="handleOk">
                            <p>{{infoModal.content}}</p>
                            <a @click="onClickInviteLink(infoModal)" class="inviteLink" v-if="infoModal.tag==='REFEREE_INVITE'||infoModal.tag==='UNIT_INVITE'">点击链接同意邀请</a>
                          </a-modal>
                        </span>
                      </a-table>
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
import {findMatchesByOrganizerId, findMatchesByParticipantId} from '../../myQuery.js';
import {isTypeSystemDefinitionNode} from "graphql";

@Component({
  components: {ResultCardList, Navigation},
})

export default class PersonalInfoTab extends Vue {
  columns = [
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'time',
    },
    {
      title: '消息主题',
      dataIndex: 'tag',
      key: 'theme',
    },
    {
      title: '标注',
      key: 'readStatus',
      dataIndex: 'readStatus',
      scopedSlots: { customRender: 'tags' },
    },
    {
      title: '...',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];

  // data = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     time: '2020.11.16 20:30',
  //     theme: 'Hello world',
  //     tags: ['nice', 'developer'],
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     time: '2020.11.16 20:30',
  //     theme: 'Hello world',
  //     tags: ['loser'],
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     time: '2020.11.16 20:30',
  //     theme: 'Hello world',
  //     tags: ['cool', 'teacher'],
  //   },
  // ];

  user = {
    gender:'',
    thuId:'',
    userId:'',
    username:'',
    role:''
  }

  infoModal={}
  modalVisible=false
  myOrganizedMatches = []
  myParticipatedMatches = []

  noteData=[]
  myNotifications=[]

  deleteNote(record){
    // this.myNotifications.slice(record.key,1)
  }

  async onClickInviteLink(record:Object){
    let inviteToken={}
    let token=''
    let id=''
    let url=''
    // console.log(record['extra'])
    // inviteToken=JSON.parse(record['extra'])
    // token=inviteToken['token']
    token = record['extra'].token
    if(record['tag']==='REFEREE_INVITE'){
      // id=inviteToken['matchId']
      id = record['extra'].matchId
      url=`/api/v1/match/become-referee/${id}`
    }
    else if(record['tag']==='UNIT_INVITE'){
      // id=inviteToken['unitId']
      id = record['extra'].unitId
      url=`/api/v1/match/participate/${id}`
    }
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: url,
        data: {
          token:token
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$router.push('/urlClickResult/success')
      }
      else
      {
        this.$router.push('/urlClickResult/fail')
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }

  showModal(record:object){
   this.modalVisible=true
    this.infoModal =record
  }

  handleOk(){
    this.modalVisible=false
  }

  getNotificationDetail(){

  }

  async getMyNotifications(){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/notification'
      })
      // 对response做处理
      if (response.status === 200) {
        this.myNotifications=response.data.notifications
        for(let index=0;index<this.myNotifications.length;index++){
          this.myNotifications[index]['readStatus']=(this.myNotifications[index]['isRead'])?['read']:['unread']
          this.myNotifications[index]['key']=index
        }
        console.log(this.myNotifications)
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  async getMyOrganizeMatch(userId) {
    try {
      let res = await this.$apollo.query({
        query: findMatchesByOrganizerId,
        variables:{userIds:userId}
      });
      this.myOrganizedMatches = res.data.findUserById[0].organizedMatches
    }
    catch (e) {
      console.log(e);
    }
  }

  async getMyParticipateMatch(userId) {
    try {
      let res = await this.$apollo.query({
        query: findMatchesByParticipantId,
        variables:{userIds:userId}
      });
      this.myParticipatedMatches = res.data.findUserById[0].participatedMatches
    }
    catch (e) {
      console.log(e);
    }
  }

  async getUserInfo()
  {
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/user/info',
        params: { }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('get userInfo success!')
        this.user.userId = response.data.userId
        this.user.username = response.data.username
        await this.getMyOrganizeMatch(this.user.userId)
        await this.getMyParticipateMatch(this.user.userId)
        await this.getMyNotifications();
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  callback(key)
  {
    if (this.$route.params.key !== key) {
      this.$router.push(`/personal/${key}`);
    }
  }

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

.inviteLink{
  color: dodgerblue;
}
</style>
