<template>
  <div>
  <div id="matchDetailPC">
  <div id="personalMenu">
    <Navigation :username="user.username" :avatar-key="user.avatar"></Navigation>
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
            <PictureUpload :picture-type="'AVATAR'" :image-url="user.avatar"></PictureUpload>
            <small>(推荐上传1:1的80px左右的图作为头像)</small>

            <a-descriptions id="descriptions" title="个人资料">
              <a-descriptions-item class="description-item" label="账号ID">
                {{user.userId}}
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="学工号">
                {{user.thuId}}
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="注册时间">
                {{user.createdAt}}
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="用户名">
                <span v-if="!isEditAccount">{{user.username}}</span>
                <div v-else>
                <b-form-input @input="isUsernameRepeat" v-model="editUsername" placeholder="用户名：由数字或字母组成" :state="validation&&containValidation" class="feedback-user">
                </b-form-input>

                <b-form-valid-feedback class="feedback" :state="validation&&containValidation">
                  Looks good
                </b-form-valid-feedback>
                <div>
                  <b-form-invalid-feedback class="feedback" :state="validation">
                    the username has been occupied!
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback class="feedback" :state="containValidation">
                    the username must contain number or letter!
                  </b-form-invalid-feedback>
                </div>
                </div>
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="手机号">
                <span v-if="!isEditAccount">{{user.mobile}}</span>
                <div v-else>
                <b-form-input v-model="user.mobile" :state="mobileValidation" class="feedback-user"></b-form-input>
                <b-form-invalid-feedback :state="mobileValidation">
                  Your mobile phone should be 11 number long
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="mobileValidation">
                  Looks Good.
                </b-form-valid-feedback>
                </div>
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="邮箱">
                <span v-if="!isEditAccount">{{user.email}}</span>
                <div v-else>
                  <b-form-input v-model="user.email" :state="emailValidation" class="feedback-user"></b-form-input>
                  <b-form-invalid-feedback :state="emailValidation">
                    not email format!
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="emailValidation">
                    Looks Good.
                  </b-form-valid-feedback>
                </div>
              </a-descriptions-item>
              <a-descriptions-item class="description-item" label="个人陈述">
                <span v-if="!isEditAccount">{{user.description}}</span>
                <div v-else>
                  <b-form-input v-model="user.description" :state="descriptionValidation" class="feedback-user"></b-form-input>
                  <b-form-invalid-feedback :state="descriptionValidation">
                    description length > 1000!
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="descriptionValidation">
                    Looks Good.
                  </b-form-valid-feedback>
                </div>
              </a-descriptions-item>
            </a-descriptions>

            <a-button class="edit-button" type="primary" v-if="!isEditAccount" @click="editAccount">修改账号资料</a-button>
            <a-button class="edit-button" type="primary"
                      :disabled="!(mobileValidation&&descriptionValidation&&emailValidation&&validation&&containValidation)" v-else @click="submitEditAccount">提交修改</a-button>
            <b-button size="sm" variant="success" v-b-modal.modal-password-changing>修改密码</b-button>
            <b-modal
                id="modal-password-changing"
                title="密码修改"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOkButton"
            >
              <b-form @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="请输入原密码"
                    label-for="old-password-input"
                >
                  <b-form-input
                      id="old-password-input"
                      v-model="oldPassword"
                      type="password"
                      :state="this.oldPassword.length > 0"
                      required
                  ></b-form-input>
                  <b-form-invalid-feedback :state="this.oldPassword.length > 0">
                    旧密码不能为空
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="this.oldPassword.length > 0">
                  </b-form-valid-feedback>
                </b-form-group>
                <b-form-group
                    label="请输入新密码"
                    label-for="new-password-input"
                >
                  <b-form-input
                      id="new-password-input"
                      v-model="newPassword"
                      type="password"
                      :state="this.newPassword.length > 0"
                      required
                  ></b-form-input>
                  <b-form-invalid-feedback :state="this.newPassword.length > 0">
                    新密码不能为空
                  </b-form-invalid-feedback>
                  <b-form-valid-feedback :state="this.newPassword.length > 0">
                  </b-form-valid-feedback>
                </b-form-group>
              </b-form>
            </b-modal>
          </a-tab-pane>
          <a-tab-pane  key="2">
            <span slot="tab">
              <a-icon type="schedule" />
                创建的比赛
            </span>
            <div v-if="onShowOrganizedMatches.length">
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in this.onShowOrganizedMatches">
                <SearchResultCard class="card" :matchId="item.matchId">
                  <img
                      class="card-img"
                      alt="example"
                      :src="item.previewLarge"
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
            </div>
            <div v-else>
              <a-empty :description="'暂无创建的赛事'"/>
            </div>
          </a-tab-pane>
          <a-tab-pane  key="3">
            <span slot="tab">
              <a-icon type="schedule" />
                参加的比赛
            </span>
            <div v-if="onShowParticipatedMatches.length">
              <ul class="wrapper">
                <li class="list" v-for="(item,index) in this.onShowParticipatedMatches">
                  <SearchResultCard class="card" :matchId="item.matchId">
                    <img
                        class="card-img"
                        alt="example"
                        :src="item.previewLarge"
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
            </div>
            <div v-else>
              <a-empty :description="'暂无参与的赛事'"/>
            </div>
          </a-tab-pane>
          <a-tab-pane  key="4">
            <span slot="tab">
              <a-icon type="message" />
                我的消息
            </span>
            <div>
              <div class='row' style='margin-top: 5ex'>
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
                          <a-divider type="vertical" />
                          <a class="delete-action" @click="onDelete(record)">删除</a>
                          <a-divider type="vertical" />
                          <a @click="showModal(record)"  class="ant-dropdown-link">查看详情<a-icon type="down" /> </a>
                          <a-modal :mask="false" v-model="modalVisible" :title="infoModal.title" >
                            <p>{{infoModal.content}}</p>
                            <a @click="onClickInviteLink(infoModal)" class="inviteLink" v-if="infoModal.tag==='REFEREE_INVITE'||infoModal.tag==='UNIT_INVITE'||infoModal.tag==='MATCH_INVITE'">点击链接同意邀请</a>
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
  </div>
  <div id="matchDetailMobile">
    <navigation></navigation>
    <b-card style="margin-top: 10px">
    <b-media style="margin-top: 10px;">
      <template #aside>
        <b-img style="width: 64px;height: 64px;" :src="user.avatar" width="64" alt="placeholder"></b-img>
      </template>
      <h5 class="mt-0"><b-badge variant="info">{{user.username}}</b-badge></h5>
      <p class="mb-0">
        <a-descriptions>
          <a-descriptions-item class="description-item" label="账号ID">
            {{user.userId}}
          </a-descriptions-item>
          <a-descriptions-item class="description-item" label="学工号">
            {{user.thuId}}
          </a-descriptions-item>
        </a-descriptions>
      </p>
    </b-media>
      <b-card-text>
        <div id="mobile-organizedMatches">
        <a-tag style="margin-bottom: 10px" color="purple">
          创建的比赛
        </a-tag>
        <b-list-group>
          <b-list-group-item @click="goMatchDetail(item.matchId)" class="d-flex align-items-center" v-for="(item,index) in  onShowOrganizedMatches ">
            <b-avatar size="sm" icon="trophy" variant="warning" class="mr-3"></b-avatar>
            <span class="mr-auto">{{item.name}}</span>
          </b-list-group-item>
        </b-list-group>
          <a-pagination v-if="myOrganizedMatches.length > 6" class="pagination" :default-current="1" :total="myOrganizedMatches.length"
                        :page-size="6" @change="onOrganizedMatchesPageChange"
          />
        </div>
        <div style="margin-top: 10px" id="mobile-participatedMatches">
          <a-tag  style="margin-bottom: 10px" color="orange">
            参与的比赛
          </a-tag>
          <b-list-group>
            <b-list-group-item @click="goMatchDetail(item.matchId)" class="d-flex align-items-center" v-for="(item,index) in  onShowParticipatedMatches ">
              <b-avatar size="sm" icon="trophy" variant="warning" class="mr-3"></b-avatar>
              <span class="mr-auto">{{item.name}}</span>
            </b-list-group-item>
          </b-list-group>
          <a-pagination v-if="myParticipatedMatches.length > 6" class="pagination" :default-current="1" :total="myParticipatedMatches.length"
                        :page-size="6" @change="onParticipatedMatchesPageChange"
          />
        </div>
      </b-card-text>
    </b-card>
  </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import axios from "axios";
import ResultCardList from "../components/ResultCardList.vue";
import Navigation from "../components/Navigation.vue";
import {findMatchesByOrganizerId, findMatchesByParticipantId,findUserExactByName} from '../../myQuery.js';
import {isTypeSystemDefinitionNode} from "graphql";
import SearchResultCard from "@/components/SearchResultCard.vue";
import PictureUpload from "@/components/PictureUpload.vue";

@Component({
  components: {PictureUpload, SearchResultCard, ResultCardList, Navigation},
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
    avatar:'',
    email:'',
    mobile:'',
    newPassword:'',
    oldPassword:'',
    thuId:'',
    userId:'',
    username:'',
    description:'',
    createdAt:''
  }

  editUsername=''
  isEditAccount = false

  validation=false
  containValidation=false
  querystring = require('querystring')

  get descriptionValidation(){
    return this.user.description.length<1000
  }
  async isUsernameRepeat(){
    try {
      if(this.user.username!==this.editUsername) {
        let response = await axios({
          method: 'get',
          url: `/api/v1/user/check?username=${encodeURIComponent(this.editUsername)}`,
        })
        this.validation = (response.data.userId === null)
      }
      else{
        this.validation=true
      }
      let regNumber = /\d+/;
      let regString = /[a-zA-Z]+/;
      if(!regNumber.test(this.editUsername) && !regString.test(this.editUsername)){
        this.containValidation=false
      }
      else{
        this.containValidation=true
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  get mobileValidation(){
    let  re = /^1\d{10}$/
    return re.test(this.user.mobile)
  }
  get emailValidation(){
     let re=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
     return re.test(this.user.email)
  }
  editAccount(){
    this.isEditAccount = true
    this.editUsername=this.user.username
    this.isUsernameRepeat()
  }
  async submitEditAccount(){
    this.user.username=this.editUsername
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/user/info`,
        data: {
          username: this.user.username,
          mobile: this.user.mobile,
          email: this.user.email,
          description: this.user.description
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }

    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
    this.isEditAccount = false
  }

  oldPassword = ''
  newPassword = ''

  resetModal() {
    this.oldPassword = ''
    this.newPassword = ''
  }

  handleOkButton(bvModalEvt) {
    // Prevent modal from closing
    bvModalEvt.preventDefault()
    // Trigger submit handler
    this.handleSubmit()
  }

  async handleSubmit() {
    if (this.newPassword === '' || this.oldPassword === '') {
      return
    }
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/user/info`,
        data: {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-password-changing')
    })
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
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  handleTableChange(pagination){
    this.pagination=pagination
    let page=pagination.current - 1
    this.getMyNotifications(page,pagination.pageSize)
  }

  async readNote(record){

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
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
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
        window.location.reload()
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  async onClickInviteLink(record:Object){
    let inviteToken={}
    let token=''
    let id=''
    let url=''

    await this.readNote(record)

    token = record['extra'].token
    if(record['tag']==='REFEREE_INVITE'){
      id = record['extra'].matchId
      url=`/api/v1/match/become-referee/${id}`
      await this.acceptInvitation(token, url)
    }
    else if(record['tag']==='UNIT_INVITE'){
      id = record['extra'].unitId
      url=`/api/v1/match/participate/${id}`
      await this.acceptInvitation(token, url)
    }
    else if(record['tag']==='MATCH_INVITE'){
      id=record['extra'].matchId
      this.$router.push(`/matchDetail/${id}/${token}`)
    }
    setTimeout(() => window.location.reload(), 1000);
  }

  async acceptInvitation(token,url){
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
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
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
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
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

        this.user.userId = response.data.userId
        this.user.username = response.data.username
        this.user.avatar = response.data.avatar
        this.user.mobile = response.data.mobile
        this.user.email = response.data.email
        this.user.createdAt = response.data.createdAt
        this.user.thuId = response.data.thuId
        this.user.description = response.data.description
        if(!this.user.description){
          this.user.description=''
        }
        if(!this.user.mobile){
          this.user.mobile=''
        }
        if(!this.user.email){
          this.user.email=''
        }
        // 更多修改信息
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
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }



  callback(key)
  {
    if (this.$route.params.key !== key) {
      this.$router.push(`/personal/${key}`);
    }
  }

  goMatchDetail(id){
    this.$router.push(`/matchdetail/${id}`)
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
  margin-top: 20px;
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

.card-img {
  height: 100px;
  object-fit: cover;
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

#descriptions {
  margin: 20px;
}

.edit-button {
  margin-right: 20px;
}

/*.text {*/
/*  text-align: left;*/
/*  text-overflow: ellipsis;*/
/*  overflow: hidden;*/
/*  white-space: nowrap;*/
/*}*/

#matchDetailMobile{
  display: none;
}

@media screen and (max-width: 1000px){
  #matchDetailPC{
    display: none;
  }
  #matchDetailMobile{
    display: block;
  }
}
</style>
