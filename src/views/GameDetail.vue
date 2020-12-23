<template>
  <div id="personalMenu">
    <Navigation :username="user.username" :avatar-key="user.avatar"></Navigation>
    <div class="flex-box" id="whole">
      <div id="records">
        <b-card id="card" no-body class="text-center">
          <div class="flex-box">
            <p id="date" v-if="startTime">{{startTime}}</P>
            <p v-if="location !== 'null'">{{location}}</p>
          </div>
          <div id="qwq">
            <div class="flex-box">
              <div class="right-direct unit0-color">
                <b-badge class="unit-name-info unit-name unit0-color" pill variant="light">
                  {{unit[0].name}}
                </b-badge>
                <div class="invisible-tip">.</div>
                <div class="unit-score-info unit0-main-score">{{unit[0].score}}</div>
                <div class="invisible-tip">.</div>
                <div class="unit-score-info unit-round-score-info">
                  {{roundScoreItemList[roundScoreItemList.length - 1].score0}}
                </div>
                <div v-if="isReferee">
                  <div class="score-change-form">{{unit[0].name}}分数增加（扣分为负）：</div>
                  <a-input-number :precision="0" v-model="unit0ScoreDelta"/>
                  <a-button @click="changeScore(0)">提交</a-button>
                </div>
              </div>
              <div id="center-symbol">
                <div class="unit-name-info">VS</div>
                <div class="visible-tip">当前比分</div>
                <div class="unit-score-info">-</div>
                <div class="visible-tip">本轮比分</div>
                <div class="unit-round-score-info">:</div>
              </div>
              <div class="left-direct unit1-color">
                <b-badge class="unit-name-info unit-name unit1-color" pill variant="light">
                  {{unit[1].name}}
                </b-badge>
                <div class="invisible-tip">.</div>
                <div class="unit-score-info unit1-main-score">{{unit[1].score}}</div>
                <div class="invisible-tip">.</div>
                <div class="unit-round-score-info">
                  {{roundScoreItemList[roundScoreItemList.length - 1].score1}}
                </div>
                <div v-if="isReferee">
                  <div class="score-change-form">{{unit[1].name}}分数增加（扣分为负）：</div>
                  <a-input-number :precision="0" v-model="unit1ScoreDelta"/>
                  <a-button @click="changeScore(1)">提交</a-button>
                </div>
              </div>
            </div>
          </div>
          <b-button v-if="isReferee" id="end-button"
                    variant="outline-info" @click="startNewRound"
          >结束当前轮次</b-button>
        </b-card>
        <div v-if="isReferee">
          <h3><b-badge pill variant="primary">增加记录</b-badge></h3>
          <a-form-model ref="ruleForm"
                        :model="form"
                        :rules="rules"
                        :label-col="{span: 4}"
                        :wrapper-col="{span: 20}"
          >
            <a-form-model-item prop="name" label="选择队伍">
              <a-radio-group :options="[{ label: unit[0].name, value: 0 },{ label: unit[1].name, value: 1 },]"
                             :default-value="0" v-model="form.team" />
            </a-form-model-item>
            <a-form-model-item prop="description" label="简要说明">
              <a-input v-model="form.description" placeholder="队员号码及事件"/>
            </a-form-model-item>
            <a-button class="button" type="primary" @click="onSubmit">
              提交
            </a-button>
          </a-form-model>
        </div>
        <h3><b-badge pill variant="warning">比赛动态</b-badge></h3>
        <div id="logs">
          <div id="round-score">
            <b-table
                show-empty
                small
                stacked="md"
                :items="roundScoreItemList"
                :fields="fields"
                :hover="true"
                :fixed="true"
            >
              <template #cell(index)="row">
                第{{ row.value }}局
              </template>
              <template #cell(score0)="row">
                {{ row.value }}
              </template>
              <template #cell(score1)="row">
                {{ row.value}}
              </template>
            </b-table>
          </div>
          <div id="timeline">
            <a-timeline mode="alternate">
              <a-timeline-item :color="getColor(item.id)" :position="getDirection(item.id)"
                               v-for="(item,index) in recordList" :key="index">
                {{item.name}}:{{item.description}}
                <a-popover v-if="isReferee">
                  <template slot="content">
                    <span>Click to delete it</span>
                  </template>
                  <a-icon id="delete-icon" type="close-circle"
                          theme="twoTone" two-tone-color="red"
                          @click="deleteRecord(index)"
                          title="click to delete"/>
                </a-popover>
              </a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </div>
      <a-divider type="vertical" id="divider"/>
      <div id="photo-and-comment">
        <div id="photo">
          <b-container fluid class="p-3">
            <b-img thumbnail fluid src="/sweet.jpg" alt="Image 3"></b-img>
          </b-container>
        </div>
        <div id="comment-list">
          <h3><b-badge pill variant="success">评论区</b-badge></h3>
          <a-list
              class="comment-list"
              item-layout="horizontal"
              :data-source="onShowComments"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-comment :author="item.authorName" :avatar="item.avatar">
                <div slot="content" class="flex-box">
                  <p id="comment-content">
                    <b-badge v-if="item.replyUser" variant="warning">@{{item.replyUser}}</b-badge>
                    {{ item.content }}
                  </p>
                </div>
                <b-link class="link-button" v-if="item.authorId === user.userId" @click="deleteComment(item.id)">删除</b-link>
                <b-link class="link-button" v-b-modal.modal-reply @click="setReplyId(item.id)">回复</b-link>
                <b-modal
                    id="modal-reply"
                    title="写下你的回复"
                    @show="resetModal"
                    @hidden="resetModal"
                    @ok="handleReplyOk"
                >
                  <form @submit.stop.prevent="handleReplySubmit">
                    <b-form-group
                        label="回复内容"
                        label-for="reply-input"
                    >
                      <b-form-input
                          id="reply-input"
                          v-model="replyContent"
                          :state="replyContent.length > 0"
                          required
                      ></b-form-input>
                      <b-form-invalid-feedback :state="replyContent.length > 0">
                        回复内容不能为空
                      </b-form-invalid-feedback>
                      <b-form-valid-feedback :state="replyContent.length > 0">
                      </b-form-valid-feedback>
                    </b-form-group>
                  </form>
                </b-modal>
              </a-comment>
            </a-list-item>
          </a-list>
          <a-pagination class="pagination" :default-current="1" :total="comments.length" :page-size="3"
                        @change="onCommentsPageChange"
          />
        </div>
        <div id="my-comment">
          <h3><b-badge pill variant="primary">我也说一句</b-badge></h3>
          <a-textarea placeholder="写下我的想法" :autoSize="{minRows:4}" v-model="myComment"/>
          <a-button class="button" type="primary" @click="createComment">发布</a-button>
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
import moment from 'moment';
import {getGameComments, getGameScoreAndRecord, getGameInfo} from "../../myQuery";

@Component({
  components:{
    Navigation
  }
})

export default class GameDetail extends Vue {
  comments = []
  onShowComments = []
  async getComments(){
    let res = await this.$apollo.query({
      query: getGameComments,
      variables:{gameId:this.$route.params.gameId}
    });
    console.log(res.data.findGameById.comments)
    this.comments = []
    for(let item of res.data.findGameById.comments){
      let comment = {
        id: item.commentId,
        authorName: item.issuer.username,
        authorId: item.issuer.userId,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: item.content,
        replyUser: null,
      }
      if (item.reply !== null) {
        comment.replyUser = item.reply.issuer.username
      }
      this.comments.push(comment)
    }
    this.comments.reverse()
    this.onCommentsPageChange(1, 3)
  }
  onCommentsPageChange(page, pageSize){
    let total = this.comments.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowComments = this.comments.slice(left, right)
  }

  myComment = ''
  async createComment(){
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/comment/game/${this.$route.params.gameId}`,
        data: {
          content: this.myComment,
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getComments()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }
  async deleteComment(id){
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'delete',
        url: `/api/v1/comment/${id}`,
        data: { }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getComments()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  replyContent = ''
  replyId = ''
  setReplyId(id){
    this.replyId = id
  }
  resetModal() {
    this.replyContent = ''
  }
  async handleReplyOk(bvModalEvt) {
    bvModalEvt.preventDefault()
    this.handleReplySubmit()
  }
  async handleReplySubmit() {
    if (this.replyContent === '') {
      return
    }
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/comment/game/${this.$route.params.gameId}`,
        data: {
          replyId: this.replyId,
          content: this.replyContent
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getComments()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
    await this.getComments()
    this.$nextTick(() => {
      this.$bvModal.hide('modal-reply')
    })
  }

  unit = [
    {
      id: '',
      name: '',
      score: 0,
    },
    {
      id: '',
      name: '',
      score: 0,
    }
  ]
  getDirection(id){
    if(id === this.unit[0].id)
    {
      return 'left'
    }
    else
    {
      return 'right'
    }
  }
  getColor(id){
    if(id === this.unit[0].id)
    {
      return 'blue'
    }
    else
    {
      return 'green'
    }
  }

  unit0ScoreDelta = 0
  unit1ScoreDelta = 0

  roundScoreList = [
    {
      score0: 0,
      score1: 0
    }
  ]

  roundScoreItemList = [
    {
      index: 1,
      score0: 0,
      score1: 0,
      _rowVariant: 'success'
    }
  ]

  fields = [
    { key: 'score0', label: `${this.unit[0].name}得分`},
    { key: 'score1', label: `${this.unit[1].name}得分`}
  ]

  totalStrategy = 0

  async getGameScore(){
    let res = await this.$apollo.query({
      query: getGameScoreAndRecord,
      variables:{gameId:this.$route.params.gameId}
    })
    // console.log(res.data.findGameById)
    if (res.data.findGameById.result)
    {
      if (res.data.findGameById.result.rounds)
      {
        this.roundScoreList = []
        this.roundScoreItemList = []
        let index = 1
        for (let item of res.data.findGameById.result.rounds)
        {
          let roundScoreItem = {
            score0: item.score0,
            score1: item.score1
          }
          this.roundScoreList.push(roundScoreItem)
          this.roundScoreItemList.push({
            index: index,
            score0: item.score0,
            score1: item.score1,
            _rowVariant: ''
          })
          index += 1
        }
        this.roundScoreItemList[index - 2]['_rowVariant'] = 'success'
      }
      if (res.data.findGameById.result.result)
      {
        this.unit[0].score = res.data.findGameById.result.result.output0
        this.unit[1].score = res.data.findGameById.result.result.output1
      }
      if (res.data.findGameById.result.extra)
      {
        this.recordList = JSON.parse(res.data.findGameById.result.extra).records
      }
    }
  }

  async changeScore(id) {
    let len = this.roundScoreList.length
    let unit0score = this.unit[0].score
    let unit1score = this.unit[1].score

    if (id === 0) {
      this.roundScoreList[len - 1].score0 += this.unit0ScoreDelta
      unit0score += this.unit0ScoreDelta
    } else if (id === 1) {
      this.roundScoreList[len - 1].score1 += this.unit1ScoreDelta
      unit1score += this.unit1ScoreDelta
    }

    // if (this.totalStrategy === 0)
    // {
    //   if (id === 0) {
    //     unit0score += this.unit0ScoreDelta
    //   } else if (id === 1) {
    //     unit1score += this.unit1ScoreDelta
    //   }
    // }

    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/round/${this.$route.params.roundId}/game/${this.$route.params.gameId}`,
        data: {
          result: {
            rounds: this.roundScoreList,
            result: {
              winner: 2,
              output0: unit0score,
              output1: unit1score
            }
          }
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      this.unit0ScoreDelta = 0
      this.unit1ScoreDelta = 0
      await this.getGameScore()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  async startNewRound(){
    this.roundScoreList.push(
      {
        score0: 0,
        score1: 0
      }
    )

    let score0 = this.unit[0].score
    let score1 = this.unit[1].score

    if(this.totalStrategy === 1)
    {
      let len = this.roundScoreList.length

      if (this.roundScoreList[len - 2].score0 > this.roundScoreList[len - 2].score1)
      {
        score0 += 1
      }
      else if(this.roundScoreList[len - 2].score0 < this.roundScoreList[len - 2].score1)
      {
        score1 += 1
      }
    }

    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/round/${this.$route.params.roundId}/game/${this.$route.params.gameId}`,
        data: {
          result: {
            rounds: this.roundScoreList,
            result: {
              winner: 2,
              output0: score0,
              output1: score1
            }
          }
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getGameScore()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  recordList = []

  form = {
    team: 0,
    description: ''
  }
  rules = {
    description: [
      { required: true, message: '请简要描述'},
    ]
  }

  onSubmit() {
    //@ts-ignore
    this.$refs.ruleForm.validate(valid => {
      if (valid) {
        this.createRecord();
      } else {
        return false;
      }
    });
  }

  async createRecord(){
    let currentRecordList = this.recordList
    currentRecordList.push(
        {
          id: this.unit[this.form.team].id,
          name: this.unit[this.form.team].name,
          description: this.form.description
        }
    )
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/round/${this.$route.params.roundId}/game/${this.$route.params.gameId}`,
        data: {
          result: {
            extra: {
              records: currentRecordList
            }
          }
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getGameScore()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  async deleteRecord(index) {
    let currentRecordList = this.recordList
    currentRecordList.splice(index, 1)
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/round/${this.$route.params.roundId}/game/${this.$route.params.gameId}`,
        data: {
          result: {
            extra: {
              records: currentRecordList
            }
          }
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getGameScore()
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  user = {
    userId: '',
    username: '',
    avatar: ''
  }

  refereeId = ''
  // 可修改
  isReferee = false
  startTime = ''
  location = ''

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
        this.user.avatar = response.data.avatar
        await this.getGameInfo()
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

  async getGameInfo()
  {
    let res = await this.$apollo.query({
      query: getGameInfo,
      variables:{gameId:this.$route.params.gameId}
    })
    this.unit[0].id = res.data.findGameById.unit0.unitId
    this.unit[1].id = res.data.findGameById.unit1.unitId
    this.unit[0].name = res.data.findGameById.unit0.name
    this.unit[1].name = res.data.findGameById.unit1.name

    this.fields = [
      { key: 'index', label: "局数"},
      { key: 'score0', label: `${this.unit[0].name}得分`},
      { key: 'score1', label: `${this.unit[1].name}得分`}
    ]

    this.refereeId = res.data.findGameById.referee.userId
    if (this.refereeId === this.user.userId)
    {
      this.isReferee = true
    }
    this.startTime = res.data.findGameById.startTime
    this.location = res.data.findGameById.location
  }

  async getMatchType(){

  }

  createFunc()
  {
    if (this.$router.currentRoute.path === `/gameDetail/${this.$route.params.matchId}/${this.$route.params.roundId}/${this.$route.params.gameId}`)
    {
      this.getComments()
      this.getGameScore()
      setTimeout(this.createFunc, 1000)
    }
  }


  mounted() {
    this.getUserInfo()
    this.createFunc()
  }

}
</script>


<style scoped>
.pagination {
  margin: auto;
  display: flex;
  justify-content: center;
}

>>> .ant-comment {
  width: 100%
}

.flex-box {
  display: flex;
}

>>> #divider {
  height: auto;
  width: 3px;
}

#reply-button {
  position: absolute;
  right: 0;
  bottom: 0;
}

#comment-content {
  margin-bottom: 0;
  max-width: 100%;
}

#photo {
  margin: auto;
  margin-bottom: 10px;
  max-width: 100%;
}

#photo-and-comment {
  width: 40%;
  height: 100%;
  margin: 0 20px 20px 20px;
}

#records {
  width: 60%;
  margin: 1% 20px 10px 20px;
}

#comment-list {
  height: 30%;
}

#my-comment {
  margin-top: 20px;
  height: 12%;
  position: relative;
}

.button {
  float: right;
  margin: 1%;
}

#card{
  margin-bottom: 20px;
  padding: 20px;
}

#date {
  margin-right: 10px;
}

>>> .unit-name{
  background-color: gainsboro;
  font-size: 2rem;
  display: inline-flex;
}

.unit-name-info {
  font-size: 2rem;
}
.unit-score-info {
  font-size: 4rem;
}
.unit-round-score-info {
  font-size: 2.5rem;
}

.unit0-main-score {
  margin-right: 10%;
}
.unit1-main-score {
  margin-left: 10%;
}

#qwq {
  margin: auto;
  max-width: 100%;
}

.unit0-color {
  color: darkred;
}
.unit1-color {
  color: darkblue;
}

.right-direct {
  text-align: right;
}
.left-direct {
  text-align: left;
}

#center-symbol {
  margin: 0 20px 0 20px;
  color: dimgrey;
}

li {
  list-style-type: none;
}

#record-content >>> p {
 text-align: left;
}

>>> #delete-icon {
  vertical-align: 0.1em;
}

#logs {
  padding-top: 20px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}

#round-score {
  max-height: 200px;
  overflow-y: scroll;
  margin: 10px;
}

#timeline {
  max-height: 200px;
  overflow-y: scroll;
  margin: 10px;
}

.score-change-form {
  margin: 20px;
}

.invisible-tip {
  color: transparent;
  margin-top: 10px;
}
.visible-tip {
  margin-top: 10px;
}

#end-button {
  margin: 10px;
}

.link-button {
  text-decoration: none;
  margin-right: 20px;
}

#whole {
  flex-direction: row-reverse;
}

@media screen and (max-width: 960px) {
  #divider {
    display: none;
  }

  #whole {
    flex-direction: column;
  }

  #photo-and-comment {
    width: 95%;
    margin: 0 20px 20px 20px;
  }

  #records {
    width: 95%;
    float: top;
  }

  #logs {
    padding-top: 20px;
  }

}

@media screen and (max-width: 720px){
 #logs {
   display: block;
 }
  /*重新设计卡片样式*/
}

</style>
