<template>
  <div class="home">
    <Navigation :username="user.username"></Navigation>
    <div id="div">
      <div class="container">
        <div class="make-center">
          <search-input id="search"></search-input>
        </div>
        <a-tabs class="tab" default-active-key="1" :tabBarStyle="{'text-align': 'center'}"  @change="callback">
          <a-tab-pane key="1" tab="综合">
            <div v-if="onShowMatchesList.length">
            <Carousel></Carousel>
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in this.onShowMatchesList ">
                <a-card @click="goMatchDetail(item)" style="width: 240px; text-align: center;">
                  <img
                          slot="cover"
                          alt="example"
                          src="background.png"
                  />
                  <a-card-meta :title="item.name">
                    <template slot="description">
                      {{ item.description }}
                    </template>
                  </a-card-meta>
                </a-card>
              </li>
            </ul>
            <a-pagination class="pagination" :default-current="1" :total="matchesList.length" :page-size="8"
                          @change="onMatchesPageChange"
            />
            </div>
            <div v-else>
              <a-empty :description="'暂无任何球类赛事'"/>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="篮球" force-render>
            <div v-if="onShowMatchesList.length">
              <ResultCardList class="matchLists" :match-lists="this.onShowMatchesList" :isCenter="true"></ResultCardList>
              <a-pagination class="pagination" :default-current="1" :total="matchesList.length" :page-size="3"
                            @change="onMatchesPageChange"
              />
            </div>
            <div v-else>
              <a-empty :description="'暂无篮球赛事'"/>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="网球">
            <div v-if="onShowMatchesList.length">
              <ResultCardList class="matchLists" :match-lists="this.onShowMatchesList" :isCenter="true"></ResultCardList>
              <a-pagination class="pagination" :default-current="1" :total="matchesList.length" :page-size="3"
                            @change="onMatchesPageChange"
              />
            </div>
            <div v-else>
              <a-empty :description="'暂无网球赛事'"/>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="羽毛球">
            <a-empty :description="'暂无羽毛球赛事'"/>
          </a-tab-pane>
          <a-tab-pane key="5" tab="足球">
            <a-empty :description="'暂无足球赛事'"/>
          </a-tab-pane>
          <a-tab-pane key="6" tab="乒乓球">
            <a-empty :description="'暂无乒乓球赛事'"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navigation from '@/components/Navigation.vue'
import SearchInput from "@/components/SearchInput.vue";
import Carousel from "@/components/Carousel.vue";
import ResultCardList from "@/components/ResultCardList.vue" ;
import Pagination from '@/components/Pagination.vue'
import {getMatchesList} from "../../myQuery";
import axios from "axios";

@Component({
  components: { Navigation,SearchInput,Carousel,ResultCardList,Pagination
  },
})
export default class Home extends Vue {
  user = {
    username: ''
  }

  matchesList=[]
  onShowMatchesList=[]

  async getMatchesList(type){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{typeIds:type}
    });
    this.matchesList=res.data.findMatchesByType
    if (!type.length)
    {
      this.onMatchesPageChange(1, 8)
    }
    else
    {
      this.onMatchesPageChange(1, 3)
    }
    // console.log(this.matchesList)
  }

  onMatchesPageChange(page, pageSize)
  {
    let total = this.matchesList.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowMatchesList = this.matchesList.slice(left, right)
  }

  callback(key){
    if(key==1){
      this.getMatchesList([])
    }
    else if(key==2){
      this.getMatchesList(['basketball'])
    }
    else if(key==3){
      this.getMatchesList(['tennis'])
    }
  }

  goMatchDetail(item){
    this.$router.push(`/matchDetail/${item.matchId}`)
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

  preFunc(){
    this.getUserInfo()
    this.getMatchesList([])
  }

  mounted(){
    this.preFunc()
    // TODO：增加赛事后重新进入主页面，赛事列表未更新
  }
}
</script>


<style scoped>
.make-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}
.pagination {
  margin: auto;
  display: flex;
  justify-content: center;
}
.container {
  max-width: 1200px;
}
.list{
  list-style-type: none;
  display: flex;
  align-items: center;
  position: relative;
}
.wrapper{
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  row-gap: 16px;
  column-gap: 16px;
  padding: 0;
}
.matchLists{
  margin: auto;
}

#search{
  margin: auto;
  width: 50%;
}

</style>
