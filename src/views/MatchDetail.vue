<template>
  <div>
    <div id="personalMenu">
      <Navigation :username="user.username"></Navigation>
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
              <img :src="this.match.previewLarge" alt="比赛照片"/>
<!--                <b-container id="description" class="bv-example-row">-->
<!--                  <b-row>-->
<!--                    <b-col><p>比赛名称：{{this.match.name}}</p></b-col>-->
<!--                    <b-col>2 of 3</b-col>-->
<!--                    <b-col>3 of 3</b-col>-->
<!--                  </b-row>-->
<!--                </b-container>-->
              <a-descriptions id="description" >
                <a-descriptions-item label="比赛名称">
                  {{this.match.name}}
                </a-descriptions-item>
                <a-descriptions-item label="组织者">
                  {{this.match.organizerName}}
                </a-descriptions-item>
                <a-descriptions-item label="球赛类型">
                  {{this.match.matchType}}
                </a-descriptions-item>
                <a-descriptions-item label="开始时间">
                  <p v-if="!this.match.edit">{{ this.match.startTime }}</p>
                  <a-date-picker
                      v-else
                       v-model="matchEditStartTime"
                      @change="dateChange"
                  />
                </a-descriptions-item>
<!--                <a-descriptions-item label="结束时间">-->
<!--                  2020/12/04-->
<!--                </a-descriptions-item>-->
                <a-descriptions-item label="面向人群">
                  <p v-if="!this.match.edit">{{this.match.targetGroup}}</p>
                  <a-input v-else v-model="matchEditAim"></a-input>
                </a-descriptions-item>
                <a-descriptions-item label="访问方式">
                  <p v-if="!this.match.edit">{{this.match.publicShowUp===true?"公开":"非公开"}}</p>
                  <a-radio-group v-else v-model="matchEditShowUp">
                    <a-radio :value="1">
                      公开
                    </a-radio>
                    <a-radio :value="2">
                      非公开
                    </a-radio>
                  </a-radio-group>
                </a-descriptions-item>
                <a-descriptions-item label="报名方式">
                  <p v-if="!this.match.edit">{{this.match.publicSignUp===true?"公开":"非公开"}}</p>
                  <a-radio-group v-else v-model="matchEditSignUp">
                    <a-radio :value="1">
                      公开
                    </a-radio>
                    <a-radio :value="2">
                      非公开
                    </a-radio>
                  </a-radio-group>
                </a-descriptions-item>


              </a-descriptions>
              </div>
              <div id="intro">
                <a-card>
                  <a-textarea
                      v-if="this.match.edit"
                      v-model="matchEditDescription"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                  <p v-else>{{this.match.description}}</p>
                </a-card>
              </div>
              <div>
              <a-button @click="onDetailEdit" v-if="this.isOrganizer&&!this.match.edit" id="detail_edit" type="link">
                编辑
              </a-button>
                <template v-if="this.isOrganizer&&this.match.edit">
                  <a-button @click="submitDetailEdit" class="detail_button" type="link">确认</a-button>
                  <a-button @click="cancelDetailEdit" class="detail_button" type="link">取消</a-button>
                </template>
              </div>
            </a-tab-pane>
            <a-tab-pane  key="2">
            <span slot="tab">
              <a-icon type="unordered-list" />
               选手、裁判列表
            </span>
              <div class='row' style='margin-top: 5ex'>
                <div class='col-md-4'>
                  <h3><i class="fas fa-box"></i>{{this.match.teams.length}}</h3>
                  <h5>比赛队伍</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-success'><i class="fas fa-box"></i>{{this.match.totalMember}}</h3>
                  <h5 class='text-success'>比赛选手</h5>
                </div>
                <div class='col-md-4'>
                  <h3 class='text-warning'><i class="fas fa-box"></i> {{this.match.referees.length}}</h3>
                  <h5 class='text-warning'>比赛裁判</h5>
                </div>
              </div>
              <div id="selective-buttons">
                <div v-if="isSingleMatch">
                  <b-button v-if="isOrganizer" variant="outline-success" class="add">
                    <b-icon icon="person-plus-fill"/>
                    添加选手
                  </b-button>
                  <b-button v-else-if="isParticipant"
                            variant="outline-success" class="add"
                            @click="cancelSignUp">
                    <b-icon icon="person-plus-fill"/>
                    取消报名
                  </b-button>
                  <b-button v-if="!isOrganizer && !isParticipant"
                            variant="outline-success"
                            class="add"
                            @click="signUpPersonal">
                    <b-icon icon="person-plus-fill"/>
                    我要报名
                  </b-button>
                </div>
                <div v-else>
                  <b-button v-if="isOrganizer" variant="outline-success" class="add"><b-icon icon="person-plus-fill"/>
                    添加队伍
                  </b-button>
                  <b-button v-else-if="isParticipant"
                            variant="outline-success" class="add"
                            @click="gotoTeamDetail(this.myUnitId)">
                    <b-icon icon="person-plus-fill"/>
                    查看我的队伍
                  </b-button>
                  <b-button v-if="!isOrganizer && !isParticipant"
                            variant="outline-success"
                            class="add"
                            v-b-toggle.sidebar-backdrop>
                    <b-icon icon="person-plus-fill"/>
                    创建我的队伍
                  </b-button>
                </div>
                <b-button
                          v-if="isOrganizer"
                          v-b-modal.addUser variant="outline-success"
                          b-icon="person-plus" class="add">
                  <b-icon icon="person-plus"/>
                  添加裁判
                </b-button>
                <b-sidebar
                        id="sidebar-backdrop"
                        :backdrop-variant="'dark'"
                        :width="'50%'"
                        backdrop
                        right
                        shadow
                    >
                      <div class="px-3 py-2">
                        <h4 id="sidebar-title">组建我的队伍</h4>
                        <b-form @submit="createNewTeam" @reset="resetForm">
                          <b-form-group
                              id="input-group-1"
                              label="队伍名称"
                              label-for="input-1"
                              description="有趣的队名会吸引更多的观众哦~"
                          >
                            <b-form-input
                                id="input-1"
                                v-model="form.name"
                                required
                                placeholder="Enter name"
                            ></b-form-input>
                          </b-form-group>
                          <b-form-group
                              label="队伍简介"
                              label-for="input-2"
                              description="说点什么吧~"
                          >
                          <b-form-textarea
                              v-model="form.description"
                              placeholder="Enter something..."
                              rows="3"
                          ></b-form-textarea>
                          </b-form-group>
                          <b-button class="form-button" type="submit" variant="outline-primary">Submit</b-button>
                          <b-button class="form-button" type="reset" variant="outline-danger">Reset</b-button>
                        </b-form>
                      </div>
                  </b-sidebar>
              </div>
              <div id="person_list">
                <div>
                  <div v-if="isSingleMatch">
                    <span class="list_title">选手列表</span>
                    <ul id="athlete">
                      <li v-for="(item,index) in this.match.teams" :key="index">
                        <a-comment>
                          <a slot="author">{{item.creator.username}}</a>
                          <a-avatar
                              slot="avatar"
                              shape="square"
                              size="large"
                              :style="{ backgroundColor:'#f56a00', verticalAlign: 'left' }">
                            Athlete
                          </a-avatar>
                          <p slot="content" :style="{verticalAlign:'left'}">
                            选手简介
                          </p>
                          <span class="more" style="color: dodgerblue" slot="actions">更多</span>
                        </a-comment>
                      </li>
                    </ul>
                  </div>
                  <div v-else>
                    <span class="list_title">队伍列表</span>
                    <ul id="team">
                      <li v-for="(item,index) in this.match.teams" :key="index">
                        <a-comment>
                          <a slot="author">{{item.name}}</a>
                          <a-avatar
                              slot="avatar"
                              shape="square"
                              size="large"
                              :style="{ backgroundColor:'#f56a00', verticalAlign: 'left' }">
                            Team
                          </a-avatar>
                          <p slot="content" :style="{verticalAlign:'left'}">
                            队伍简介
                          </p>
                          <span @click="gotoTeamDetail(item.unitId)" class="more" style="color: dodgerblue" slot="actions">更多</span>
                        </a-comment>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <span class="list_title">裁判列表</span>
                  <InviteUser type="InviteReferee" :unit="match"></InviteUser>
                  <ul id="referee">
                    <li v-for="(item,index) in this.match.referees" :key="index">
                      <a-comment>
                        <a slot="author">{{item.username}}</a>
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
              <b-button v-if="this.isOrganizer" @click="gotoCreateRound" class="button" block variant="outline-success">
                <b-icon icon="journal-plus"></b-icon>
                添加轮次
              </b-button>
            <ul>
              <li class="list" v-for="(item,index) in this.match.rounds">
              <b-card class="roundCard" bg-variant="default">
                <b-card-text>
                    <div>
                      <div class="matchCard">
                    <img :src="match.previewLarge" alt="赛事图片"/>
                    <div>
                      <h4>{{item.name}}
                      </h4>
                      <a-descriptions style="margin-top:5%">
                        <a-descriptions-item label="比赛场数">
                          {{item.games.length}}
                        </a-descriptions-item>
                        <a-descriptions-item label="简介">
                          {{item.description}}
                        </a-descriptions-item>
                      </a-descriptions>
                    </div>
                    </div>
                          <a-table @change="handleTableChange" :pagination="pagination" class="table" :columns="columns" :data-source="item.games">
<!--                            <a slot="name" slot-scope="text">{{ text }}</a>-->
<!--                            <span slot="customTitle">比赛队伍0</span>-->
                            <span slot="tags" slot-scope="tags">
                         <a-tag
                             v-for="tag in tags"
                             :key="tag"
                             :color="tag === 'unread' ? 'volcano' : 'read' ? 'geekblue' : 'green'"
                         >
                            {{ tag.toUpperCase() }}
                          </a-tag>
                            </span>
                            <span slot="action" slot-scope="text, record">
                          <a @click="gotoGameDetail(record,item)" class="ant-dropdown-link">查看详情</a>
                        </span>
                          </a-table>
                      <div class="roundButton">
                      <b-button v-if="isOrganizer" @click="onEditRound(item)" id="edit_button" variant="warning">修改轮次</b-button>
                      <b-button v-if="isOrganizer" @click="onDeleteRound(item)" id="delete_button" variant="danger">删除轮次</b-button>
                      </div>
                  </div>

                </b-card-text>
              </b-card>
              </li>
            </ul>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import InviteUser from "@/components/InviteUser.vue";
import {findMatchDetailById, findUserByName, findMatchesByOrganizerId, findMatchesByParticipantId, findOrganizerById, getParticipants} from "../../myQuery";
import {isStringElement} from "ant-design-vue/es/_util/props-util";
import {concat} from "apollo-link";
import moment from 'moment'

@Component({components:{InviteUser, Navigation}})

export default class MatchDetail extends Vue{
  columns = [
    {
      dataIndex: 'unit0_name',
      key: 'unit0_name',
      title:'比赛队伍A'
      // slots: { title: 'customTitle' },
      // scopedSlots: { customRender: 'unit0' },
    },
    {
      title: '比赛队伍B',
      dataIndex: 'unit1_name',
      key: 'unit1_name',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    // {
    //   title: '结束时间',
    //   key: 'end_time',
    //   dataIndex: 'end_time',
    // },
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
  pagination={
    pageSize:3,
    total:0,
    current:0
  }

  isSingleMatch = false

  //TODO:后端实现删除轮次接口
  matchEditAim=""
  matchEditDescription=""
  matchEditStartTime=''
  matchEditShowUp=1
  matchEditSignUp=1
  currentUserId = ''
  isOrganizer = false
  isParticipant = false
  myUnitId = -1

  form = {
    name: '',
    description: ''
  }

  user = {
    username: ''
  }

  match = {
    id:'',
    description: '',
    matchType: '',
    name: '',
    organizerId: '',
    organizerName: '',
    targetGroup: '',
    teams: [],
    referees: [],
    minUnitMember: 1,
    maxUnitMember: 1,
    previewLarge: 'background.png',
    rounds: [],
    edit:false,
    startTime:'',
    publicShowUp: true,
    publicSignUp:true
  }

  dateChange(date,dateString){
    this.matchEditStartTime=dateString
  }

  onEditRound(item){
    this.$router.push(`/editRound/${this.match.id}/${item.roundId}`)
  }

  onDetailEdit(){
    this.match.edit=true
    this.matchEditDescription=this.match.description
    this.matchEditAim=this.match.targetGroup
    if(this.match.publicShowUp){
      this.matchEditShowUp=1
    }
    else{
      this.matchEditShowUp=2
    }
    if(this.match.publicSignUp){
      this.matchEditSignUp=1
    }
    else{
      this.matchEditSignUp=2
    }

  }
  cancelDetailEdit(){
    this.match.edit=false
  }
  submitDetailEdit(){
    this.match.edit=false
    this.match.targetGroup=this.matchEditAim
    this.match.description=this.matchEditDescription
    this.match.startTime=this.matchEditStartTime
    if(this.matchEditShowUp===1){
      this.match.publicShowUp=true
    }
    else{
      this.match.publicShowUp=false
    }
    if(this.matchEditSignUp===1){
      this.match.publicSignUp=true
    }
    else{
      this.match.publicSignUp=false
    }
    this.modifyMatchDetail()
  }

  async modifyMatchDetail(){
    let time=new Date(this.match.startTime).toISOString()
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.match['id']}`,
        data:{
          description:this.match.description,
          targetGroup:this.match.targetGroup,
          startTime:time,
          publicShowUp:this.match.publicShowUp,
          publicSignUp:this.match.publicSignUp
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('修改赛事信息成功！')
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  handleTableChange(pagination){
    this.pagination=pagination
    let page=pagination.current - 1
  }
  async getRefereeToken(){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/assign-referee-token/${this.match['id']}`
      })
      // 对response做处理
      if (response.status === 200) {
        this.$bvModal.msgBoxOk(`签发裁判邀请码成功！过期时间：${response.data.expirationTime}`)
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  gotoGameDetail(record,item){
    this.$router.push(`/gameDetail/${this.match['id']}/${item.roundId}/${record.gameId}`)
  }

  onDeleteRound(item){
    this.$bvModal.msgBoxConfirm('确定要删除轮次吗？', {
      title: '删除轮次',
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
            this.deleteRound(item)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
  }

  async deleteRound(item){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'delete',
        url: `/api/v1/match/${this.match['id']}/round/${item.roundId}`
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success("删除轮次成功！")
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  async getMatchDetail()
  {
    try {
      let res = await this.$apollo.query({
        query: findMatchDetailById,
        variables:{matchId:this.$route.params.matchId}
      });

      this.match = {
        id:res.data.findMatchById.matchId,
        description: res.data.findMatchById.description,
        matchType: res.data.findMatchById.matchTypeId,
        name: res.data.findMatchById.name,
        organizerId: res.data.findMatchById.organizerUser.userId,
        organizerName: res.data.findMatchById.organizerUser.username,
        targetGroup: res.data.findMatchById.targetGroup,
        teams: res.data.findMatchById.units,
        referees:res.data.findMatchById.referees,
        minUnitMember: res.data.findMatchById.minUnitMember,
        maxUnitMember: res.data.findMatchById.maxUnitMember,
        previewLarge: 'background.png',
        rounds:res.data.findMatchById.rounds,
        edit:false,
        startTime:res.data.findMatchById.startTime,
        publicShowUp: res.data.findMatchById.publicShowUp,
        publicSignUp: res.data.findMatchById.publicSignUp
      }
      for (let x of this.match['rounds']){
        for(let game of x.games){
          game['unit0_name']=game.unit0.name
          game['unit1_name']=game.unit1.name
          game['key']=game.gameId
          game['tags']=[game.status]
        }
      }
       if(res.data.findMatchById.previewLarge !== null)
       {
         // @ts-ignore
         this.match.previewLarge = res.data.findMatchById.previewLarge
       }

      // @ts-ignore
      if (this.match.minUnitMember === 1 && this.match.maxUnitMember === 1)
      {
        this.isSingleMatch = true
      }
      let totalMember=0
      for(let x of this.match['teams']){
        totalMember += x.members.length
      }
      this.match['totalMember']=totalMember
      await this.getCurrentUserRole();
    }
    catch (e) {
      console.log(e);
    }
  }

  async getCurrentUserRole()
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
        this.currentUserId = response.data.userId
        this.user.username = response.data.username
        //@ts-ignore
        if(this.currentUserId === this.match.organizerId)
        {
          this.isOrganizer = true
          return
        }
        //@ts-ignore
        if (this.match['teams'].length === 0)
        {
          this.isParticipant = false
          return
        }
        // @ts-ignore
        for (let team of this.match.teams)
        {
          for (let person of team.members)
          {
            if (this.currentUserId === person.userId)
            {
              this.isParticipant = true
              this.myUnitId = team.unitId
              return
            }
          }
        }
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  async signUpPersonal()
  {
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/register/${this.$route.params.matchId}`,
        data: {
          unitName: this.user.username
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('sign up success!')
        window.location.reload()
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  async cancelSignUp()
  {
    if (this.isSingleMatch)
    {
      try {
        axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
        let response = await axios({
          method: 'delete',
          url: `/api/v1/match/${this.$route.params.matchId}/unit/${this.myUnitId}`,
          data: {}
        })
        if (response.status === 200)
        {
          this.$message.success('cancel signup success!')
          window.location.reload()
        }
        else
        {

        }
      }
      catch (e) {
        this.$message.error(JSON.stringify(e.response.data.error))
      }
    }
    else
    {

    }
  }

  gotoTeamDetail(id)
  {
    this.$router.push(`/teamDetail/${id}`)
  }

  async createNewTeam(evt)
  {
    evt.preventDefault()
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/register/${this.$route.params.matchId}`,
        data: {
          unitName: this.form.name
          // TODO:description
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('create New Team success!')
        window.location.reload()
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  resetForm(evt)
  {
    evt.preventDefault()
    // Reset our form values
    this.form.name = ''
    this.form.description = ''
  }

  mounted()
  {
    this.getMatchDetail();
  }

  gotoCreateRound(){
    this.$router.push(`/CreateRound/${this.$route.params.matchId}`)
  }

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
.detail_button{
  margin-top: 2%;
  float: right;
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
  margin-right: 10px;
}
.row{
  margin-left: 10%;
}

#sidebar-title {
  text-align: center;
}
.form-button {
  margin-right: 10px;
}
ul{
  padding-left: 0;
}
.roundCard{
  margin-bottom: 10px;
}

.roundButton{
  float: right;
}

</style>
