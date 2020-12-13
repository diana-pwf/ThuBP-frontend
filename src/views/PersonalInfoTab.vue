<template>
  <div id="personalMenu">
    <Navigation :username="user.username"></Navigation>
    <div id="menu">
      <div>
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
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in this.onShowOrganizedMatches">
                <SearchResultCard class="card" :matchId="item.matchId">
                  <img
                      alt="example"
                      src="background.png"
                      slot="card-img"
                  />
                  <h2 slot="card-title"> {{item.name}}  </h2>
                  <p slot="card-content"> {{item.description}} </p>
                </SearchResultCard>
              </li>
            </ul>
            <a-pagination class="pagination" :default-current="1" :total="myOrganizedMatches.length" :page-size="6"
                          @change="onOrganizedMatchesPageChange"
            />
          </a-tab-pane>
          <a-tab-pane  key="3">
            <span slot="tab">
              <a-icon type="schedule" />
                参加的比赛
            </span>
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in this.onShowParticipatedMatches">
                <SearchResultCard class="card" :matchId="item.matchId">
                  <img
                      alt="example"
                      src="background.png"
                      slot="card-img"
                  />
                  <h2 slot="card-title"> {{item.name}}  </h2>
                  <p slot="card-content"> {{item.description}} </p>
                </SearchResultCard>
              </li>
            </ul>
            <a-pagination class="pagination" :default-current="1" :total="myParticipatedMatches.length" :page-size="6"
                          @change="onParticipatedMatchesPageChange"
            />
          </a-tab-pane>
          <a-tab-pane  key="4">
            <span slot="tab">
              <a-icon type="message" />
                我的消息
            </span>
            <div>
              <div class='row' style='margin-top: 5ex'>
<!--                <div class='col-md-4'>-->
<!--                  <h3><i class="fas fa-box"></i>5</h3>-->
<!--                  <h5>我的待办</h5>-->
<!--                </div>-->
                <div class='col-md-4'>
                  <h3 class='text-success'><i class="fas fa-box"></i>{{this.pagination.total}}</h3>
                  <h5 class='text-success'>收到消息数</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-warning'><i class="fas fa-box"></i>{{this.unreadNote}}</h3>
                  <h5 class='text-warning'>未读消息数</h5>
                </div>
              </div>
              <div id="msg-list">
                      <a-table @change="handleTableChange" :pagination="pagination" :columns="columns" :data-source="myNotifications">
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
                          <a class="delete-action" @click="onDelete(record)">删除</a>
                          <a-divider type="vertical" />
                          <a @click="showModal(record)"  class="ant-dropdown-link">查看详情<a-icon type="down" /> </a>
                          <a-modal :mask="false" v-model="modalVisible" :title="infoModal.title" >
                            <p>{{infoModal.content}}</p>
                            <a @click="onClickInviteLink(infoModal)" class="inviteLink" v-if="infoModal.tag==='REFEREE_INVITE'||infoModal.tag==='UNIT_INVITE'">点击链接同意邀请</a>
                            <template slot="footer">
                                  <a-button key="read" type="primary" @click="handleOk(infoModal)">
                                    已读
                                  </a-button>
                            </template>
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
import SearchResultCard from "@/components/SearchResultCard.vue";

@Component({
  components: {SearchResultCard, ResultCardList, Navigation},
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
  onShowOrganizedMatches = []
  onShowParticipatedMatches = []

  unreadNote=0

  noteData=[]
  myNotifications=[]

  pagination={
    pageSize:10,
    total:0,
    current:0
  }

  onOrganizedMatchesPageChange(page, pageSize)
  {
    let total = this.myOrganizedMatches.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowOrganizedMatches = this.myOrganizedMatches.slice(left, right)
  }

  onParticipatedMatchesPageChange(page, pageSize)
  {
    let total = this.myParticipatedMatches.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowParticipatedMatches = this.myParticipatedMatches.slice(left, right)
  }

  async getUnreadNoteNum(){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/notification/unread',
      })
      if (response.status === 200) {
        this.unreadNote=response.data.unread
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }

  handleTableChange(pagination){
    this.pagination=pagination
    let page=pagination.current - 1
    this.getMyNotifications(page,pagination.pageSize)
  }

  async readNote(record){
    console.log('readNote')
    let id = this.myNotifications[record.key]['notificationId']
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/notification/${id}`,
      })
      if (response.status === 200) {

      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }

  onDelete(record){
    this.$bvModal.msgBoxConfirm('确定要删除这封站内信吗？', {
      title: '删除站内信',
      size: 'sm',
      buttonSize: 'sm',
      okVariant: 'danger',
      okTitle: 'YES',
      cancelTitle: 'NO',
      footerClass: 'p-2',
      hideHeaderClose: false,
      centered: true
    })
        .then(value => {
         if(value===true){
           this.deleteNote(record)
         }
        })
        .catch(err => {
          this.$message.error(err)
        })
  }

  async deleteNote(record){
    let id = this.myNotifications[record.key]['notificationId']
    this.myNotifications.splice(record.key,1)
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'delete',
        url: '/api/v1/notification',
        data: {
          notifications: [id]
        }
      })
      if (response.status === 200) {
        this.$message.success('删除成功！')
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }

  async onClickInviteLink(record:Object){
    let inviteToken={}
    let token=''
    let id=''
    let url=''
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

  showModal(record){
    this.myNotifications[record.key]['readStatus']=['read']
   this.modalVisible=true
    this.infoModal =record
  }

  async handleOk(record){
    this.modalVisible=false
    await this.readNote(record)
    await this.getUnreadNoteNum()
    window.location.reload()
  }

  async getMyNotifications(page,pageSize){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/notification',
        params:{
          page:page,
          pageSize:pageSize
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.pagination.total=response.data.total
        this.myNotifications=response.data.notifications.reverse()
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
      this.onOrganizedMatchesPageChange(1, 6)
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
      this.onParticipatedMatchesPageChange(1, 6)
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
        await this.getMyNotifications(0,10)
        await this.getUnreadNoteNum()
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
.pagination {
  margin: auto;
  display: flex;
  justify-content: center;
}

.wrapper{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}

img {
  max-width: 100%;
  max-height: 100%;
  margin: 0
}

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
.delete-action{
  color: dodgerblue;
}
</style>
