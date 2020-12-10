<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="content">
      <div id="photo-and-comment">
        <div id="photo">
          <b-container fluid class="p-3">
            <b-img thumbnail fluid src="background.png" alt="Image 3"></b-img>
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
          <a-button id="button" type="primary">发布</a-button>
        </div>
      </div>
      <a-divider type="vertical" id="divider"/>
      <div id="records">
        <h1><b-badge variant="warning">第1轮小组赛</b-badge></h1>
        <div id="team-info">
          <span id="unit0-name">可怜程序员队</span>
          <span>VS</span>
          <span id="unit1-name">凶残bug队</span>
        </div>
        <div id="game-info">
          <span id="unit0-score" class="gameScore">10</span>
          <span class="gameScore">:</span>
          <span id="unit1-score" class="gameScore">12</span>
        </div>
        <div id="game-detail">
          <!--<h6>违规/换人记录</h6>
          <a-button>添加</a-button>
          <ul>
            <li>
              <a-comment id="record-content">
                <a slot="author">这是一支队伍名称</a>
                <a-avatar
                    slot="avatar"
                    shape="square"
                    size="large"
                    :style="{ backgroundColor:'#f56a00', verticalAlign: 'left' }">
                  Record
                </a-avatar>
                <p slot="content">
                  这是一段简短的对比赛队伍的描述。
                </p>
              </a-comment>
            </li>
          </ul>-->
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
    }
]

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
  max-width: 60%;
}

#photo-and-comment {
  width: 40%;
  height: 100%;
  margin: 0 20px 20px 20px;
}

#records {
  width: 60%;
  max-height: 100%;
  margin: 1% 20px 20px 20px;
}

#comment-list {
  height: 30%;
}

#my-comment {
  height: 12%;
  position: relative;
}

#button {
  float: right;
  margin: 1%;
}

#team-info {
  margin: auto;
  margin-top: 3%;
  font-size: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  justify-items: center;
}

#game-info {
  margin: auto;
  font-size: 6rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
}

#unit0-name {
  color: red;
}

#unit1-name {
  color: blue;
}

#unit0-score {
  color: red;
  grid-column-start: 2;
}

#unit1-score {
  color: blue;
}

#game-detail {
  margin: 5%;
}

li {
  list-style-type: none;
}

#record-content >>> p {
 text-align: left;
}

</style>
