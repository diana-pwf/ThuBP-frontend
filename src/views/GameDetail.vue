<template>
  <div id="personalMenu">
    <Navigation></Navigation>
    <div id="content">
      <div id="photo-and-comment">
        <img
            id="game-picture"
            alt="game-picture"
            src="background.png"
        />
        <div id="photo-description">
          <span>xxx次观看</span>
        </div>
        <div id="comment-list">
          <h6>评论</h6>
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
          <h6>我的评论</h6>
          <a-textarea placeholder="写下我的想法" :autosize="{minRows:4}" />
          <a-button id="button" type="primary">发布</a-button>
        </div>
      </div>

      <a-divider dashed type="vertical" id="divider"/>

      <div id="records">
        <div id="game-info">
          <h1>第1轮小组赛</h1>
          <h1>可怜程序员队 vs 凶残bug队</h1>
        </div>

        <div id="game-score">
          <h6>比分</h6>
          <h1>0:1</h1>
        </div>

        <div id="game-detail">
          <h6>违规/换人记录</h6>
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
          </ul>
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
#content {
  display: flex;
}

#photo-and-comment {
  width: 60%;
  height: 100%;
  margin: 0 5% 5% 5%;
}

#records {
  width: 40%;
  height: 100%;
  margin: 0 5% 5% 5%;
}

#divider {
  height: 100%;
}

#game-picture {
  max-width: 30%;
  max-height: 20%;
  padding: 0;
}

#photo-description {
  height: 8%;
}

#comment-list {
  height: 30%;
}

#my-comment {
  height: 12%;
  position: relative;
}

h6 {
  text-align: left;
  font-size: 20px;
}

#button {
  float: right;
  margin: 1%;
}

#game-info {
  text-align: left;
  font-size: 18px;
}

#game-score {
  margin: 5%;
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
