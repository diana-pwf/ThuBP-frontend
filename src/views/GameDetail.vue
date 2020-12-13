<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="content">
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
              :data-source="data"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-comment :author="item.author" :avatar="item.avatar">
                <template slot="actions">
                  <span v-for="action in item.actions">{{ action }}</span>
                </template>
                <p slot="content">
                  {{ item.content }}
                </p>
                <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                  <span>{{ item.datetime.fromNow() }}</span>
                </a-tooltip>
              </a-comment>

            </a-list-item>
          </a-list>
        </div>
        <div id="my-comment">
          <h3><b-badge pill variant="primary">我也说一句</b-badge></h3>
          <a-textarea placeholder="写下我的想法" :autosize="{minRows:4}" />
          <a-button class="button" type="primary">发布</a-button>
        </div>
      </div>
      <a-divider type="vertical" id="divider"/>
      <div id="records">
        <b-card id="card" no-body class="text-center">
          <div id="time-and-place">
          <p id="date">2020/12/12</P>
          <p>紫荆操场</p>
          </div>
          <div id="qwq">
            <div id="unit-info">
              <div>
                <b-badge id="unit0-name" class="unit-name-info unit-name" pill variant="light">
                可怜程序员队
                </b-badge>
                <div class="unit-score-info" id="unit0-score">0</div>
                <div id="score-change">
                  <span>本队分数增加（扣分为负）：</span>
                  <a-input-number :precision="0" v-model="unit0ScoreDelta"/>
                  <a-button>提交</a-button>
                </div>
              </div>
              <div id="center-symbol">
                <div class="unit-name-info">VS</div>
                <div class="unit-score-info">-</div>
              </div>
              <div>
                <b-badge id="unit1-name" class="unit-name-info unit-name" pill variant="light">
                  凶残bug队
                </b-badge>
                <div class="unit-score-info" id="unit1-score">3</div>
                <span>本队分数增加（扣分为负）：</span>
                <a-input-number :precision="0" v-model="unit1ScoreDelta"/>
                <a-button>提交</a-button>
              </div>
            </div>
          </div>
        </b-card>
        <div id="details">
          <h3><b-badge pill variant="warning">比赛动态</b-badge></h3>
          <a-timeline mode="alternate">
            <a-timeline-item :color="getColor(item.team)" :position="getDirection(item.team)" v-for="(item,index) in recordList" :key="index">
              {{item.team}}:{{item.description}}
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
          <div>
            <h3><b-badge pill variant="primary">增加记录</b-badge></h3>
            <a-form-model ref="ruleForm"
                          :model="form"
                          :rules="rules"
                          :label-col="{span: 4}"
                          :wrapper-col="{span: 20}"
            >
              <a-form-model-item prop="name" label="选择队伍">
                <a-radio-group :options="[{ label: 'unit0', value: 0 },{ label: 'unit1', value: 1 },]"
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
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import moment from 'moment';

@Component({
  components:{
    Navigation
  }
})

export default class GameDetail extends Vue {

  data = [
    {
      actions: ['Reply to'],
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: moment().subtract(1, 'days')
    },
    {
      actions: ['Reply to'],
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
          'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: moment().subtract(2, 'days')
    },
  ]

  recordList = [
    {
      id: '0',
      team: 'unit0',
      description:'球出界'
    },
    {
      id: '1',
      team: 'unit1',
      description:'球出界'
    },
    {
      id: '2',
      team: 'unit0',
      description:'球出界'
    },
    {
      id: '3',
      team: 'unit0',
      description:'球出界'
    },
  ]

  getDirection(teamname){
    if(teamname === 'unit0')
    {
      return 'left'
    }
    else
    {
      return 'right'
    }
  }

  getColor(teamname){
    if(teamname === 'unit0')
    {
      return 'blue'
    }
    else
    {
      return 'green'
    }
  }

  deleteRecord(id) {
    this.$message.success('delete record success!')
  }


  form = {
    name: '',
    description: ''
  }

  unit0ScoreDelta = 0
  unit1ScoreDelta = 0

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

  createRecord(){

  }
}
</script>


<style scoped>
>>> #divider {
  height: auto;
  width: 3px;
}

#content {
  display: flex;
}

#photo {
  margin: auto;
  margin-bottom: 10px;
  max-width: 75%;
}

#photo-and-comment {
  width: 50%;
  height: 100%;
  margin: 0 20px 20px 20px;
}

#records {
  width: 50%;
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

#time-and-place {
  display: flex;
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

#unit-info {
  display: flex;
}

#qwq {
  margin: auto;
}

#unit0-score {
  text-align: right;
  color: darkred;
}

#unit1-score {
  text-align: left;
  color: darkblue;
}

#unit0-name {
  color: darkred;
}

#unit1-name {
  color: darkblue;
}

#center-symbol {
  margin: 0 20px 0 20px;
  color: dimgrey;
}

#score-change {
  margin-bottom: 20px;
}

#details {
  min-height: 50%;
  max-height: 70%;
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

</style>
