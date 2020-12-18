<template>
  <div id="personalMenu">
    <Navigation :username="user.username"></Navigation>
    <div class="flex-box">
      <div id="photo-and-comment">
        <div id="photo">
          <b-container fluid class="p-3">
            <b-img thumbnail fluid src="sweet.jpg" alt="Image 3"></b-img>
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
                <a-button size="small" type="link" v-if="item.authorId === user.userId"
                          @click="deleteComment(item.id)"
                          >删除</a-button>
                <a-collapse>
                  <a-collapse-panel :showArrow="false">
                    <a-textarea placeholder="写下我的想法" :autoSize="{minRows:4}" v-model="replyComment"/>
                    <a-button class="button" type="primary" @click="createReply(item.id)">发送</a-button>
                    <a-button id="reply-button" slot="extra"
                              size="small" type="link"
                              @click="changeButtonText"
                              >{{buttonText}}</a-button>
                  </a-collapse-panel>
                </a-collapse>
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
      <a-divider type="vertical" id="divider"/>
      <div id="records">
        <b-card id="card" no-body class="text-center">
          <div class="flex-box">
            <p id="date">2020/12/12</P>
            <p>紫荆操场</p>
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
                  {{roundScoreList[roundScoreList.length - 1].score0}}
                </div>
                <div class="score-change-form">{{unit[0].name}}分数增加（扣分为负）：</div>
                <a-input-number :precision="0" v-model="unit0ScoreDelta"/>
                <a-button @click="changeScore(0)">提交</a-button>
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
                  {{roundScoreList[roundScoreList.length - 1].score1}}
                </div>
                <div class="score-change-form">{{unit[1].name}}分数增加（扣分为负）：</div>
                <a-input-number :precision="0" v-model="unit1ScoreDelta"/>
                <a-button @click="changeScore(1)">提交</a-button>
              </div>
            </div>
          </div>
          <b-button id="end-button" variant="outline-info" @click="startNewRound">结束当前轮次</b-button>
        </b-card>
        <h3><b-badge pill variant="warning">比赛动态</b-badge></h3>
        <div id="logs">
          <b-table
              show-empty
              small
              stacked="md"
              :items="roundScoreList"
              :fields="fields"
              :hover="true"
              :fixed="true"
              id="table"
          >
          </b-table>
          <a-timeline id="timeline" mode="alternate">
            <a-timeline-item :color="getColor(item.id)" :position="getDirection(item.id)"
                             v-for="(item,index) in recordList" :key="index">
            {{item.name}}:{{item.description}}
            <a-popover>
              <template slot="content">
                <span>Click to delete it</span>
              </template>
              <a-icon id="delete-icon" type="close-circle"
                      theme="twoTone" two-tone-color="red"
                      @click="deleteRecord(item.id)"
                      title="click to delete"/>
            </a-popover>
          </a-timeline-item>
          </a-timeline>
        </div>
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
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import moment from 'moment';
import {getGameComments, getGameScoreAndRecord} from "../../myQuery";

@Component({
  components:{
    Navigation
  }
})

export default class GameDetail extends Vue {
  comments = []
  onShowComments = []

  onCommentsPageChange(page, pageSize){
    let total = this.comments.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowComments = this.comments.slice(left, right)
  }

  async getComments(){
    this.comments = []
    let res = await this.$apollo.query({
      query: getGameComments,
      variables:{gameId:this.$route.params.gameId}
    });
    for(let item of res.data.findGameById.comments){
      let comment = {
        id: item.commentId,
        authorName: item.issuer.username,
        authorId: item.issuer.userId,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: item.content,
        replyUser: null
      }
      if (item.reply !== null) {
        comment.replyUser = item.reply.issuer.username
      }
      this.comments.push(comment)
    }
    this.onCommentsPageChange(1, 3)
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
      this.$message.error(JSON.stringify(e.response.data.error))
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
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  buttonText = '写下回复'

  changeButtonText()
  {
    if(this.buttonText === '写下回复')
    {
      this.buttonText = '收起回复'
    }
    else
    {
      this.buttonText = '写下回复'
    }
  }

  replyComment = ''

  async createReply(id){
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/comment/game/${this.$route.params.gameId}`,
        data: {
          replyId: id,
          content: `${this.replyComment}`
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      await this.getComments()
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }

  }

  unit = [
    {
      id: 0,
      name: '可怜程序员队',
      score: 0,
    },
    {
      id: 1,
      name: '凶残bug队',
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
  fields = [
    { key: 'score0', label: `${this.unit[0].name}得分`},
    { key: 'score1', label: `${this.unit[1].name}得分`}
  ]

  async getGameScore(){
    let res = await this.$apollo.query({
      query: getGameScoreAndRecord,
      variables:{gameId:this.$route.params.gameId}
    })
    if (res.data.findGameById.result && res.data.findGameById.result.result)
    {
      if(res.data.findGameById.result.rounds.length)
      {
        this.roundScoreList = []
        for (let item of res.data.findGameById.result.rounds)
        {
          let roundScoreItem = {
            score0: item.score0,
            score1: item.score1
          }
          this.roundScoreList.push(roundScoreItem)
        }
      }
      this.unit[0].score = res.data.findGameById.result.result.output0
      this.unit[1].score = res.data.findGameById.result.result.output1
    }
    if (res.data.findGameById.extra)
    {
      this.recordList = res.data.findGameById.extra
    }
    console.log(this.recordList)
  }

  async changeScore(id) {
    let len = this.roundScoreList.length
    if (!id) {
      this.roundScoreList[len - 1].score0 += this.unit0ScoreDelta
      this.unit[0].score += this.unit0ScoreDelta
    } else if (id === 1) {
      this.roundScoreList[len - 1].score1 += this.unit1ScoreDelta
      this.unit[1].score += this.unit1ScoreDelta
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
              output0: this.unit[0].score,
              output1: this.unit[1].score
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
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  startNewRound(){
    this.roundScoreList.push(
      {
        score0: 0,
        score1: 0
      }
    )
  }

  recordList = []

  deleteRecord(id) {
    this.$message.success('delete record success!')
  }

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
      console.log(valid);
      if (valid) {
        this.createRecord();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  async createRecord(){
    this.recordList.push(
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
            extra: this.recordList
          }
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      this.unit0ScoreDelta = 0
      this.unit1ScoreDelta = 0
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  user = {
    userId: '',
    username: ''
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
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  // 轮询
  // created(){
  //   window.setInterval(() => {setTimeout(this.getGameScore.bind(), 0);}, 3000);
  // }

  mounted() {
    this.getUserInfo()

    this.getComments()
    this.getGameScore()

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

#timeline {

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
  display: grid;
  grid-template-columns: 2fr 3fr;
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
</style>
