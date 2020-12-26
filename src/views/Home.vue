<template>
  <div class="home">
    <Navigation :nav-keys="['1']" :username="user.username" :avatar-key="user.avatar"></Navigation>
    <div id="div">
      <div class="container">
        <div class="make-center">
          <search-input id="search"></search-input>
        </div>
        <a-tabs class="tab" default-active-key="1" :tabBarStyle="{'text-align': 'center'}"  @change="callback">
          <a-tab-pane key="1" tab="综合">
            <div id="all" v-if="onShowMatchesList.length">
            <Carousel id="carousel"></Carousel>
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in this.onShowMatchesList">
                <a-card @click="goMatchDetail(item)" style="width: 240px; text-align: center;">
                  <img
                          slot="cover"
                          alt="example"
                          :src="item.previewLarge"
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
          <a-tab-pane v-for="(item, index) in matchTypeList"
                      :key="item.matchTypeId" :tab="item.matchTypeName" force-render>
            <div id="PC-matchList" v-if="onShowMatchesList.length">
              <ResultCardList class="matchLists" :match-lists="onShowMatchesList" :isCenter="true"></ResultCardList>
              <a-pagination class="pagination" :default-current="1" :total="matchesList.length" :page-size="3"
                            @change="onMatchesPageChange"
              />
            </div>
            <div id="mobile-matchList" v-if="onShowMatchesList.length">
              <ul class="wrapper">
                <li class="list" v-for="(item,index) in onShowMatchesList">
                  <a-card @click="goMatchDetail(item)" style=" text-align: center;">
                    <img
                        slot="cover"
                        alt="example"
                        :src="item.previewLarge"
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
              <a-empty :description="'暂无相关赛事'"/>
            </div>
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
import {getMatchesList, getMatchTypeList} from "../../myQuery";
import axios from "axios";

@Component({
  components: { Navigation,SearchInput,Carousel,ResultCardList},
})
export default class Home extends Vue {
  user = {
    username: '',
    avatar: ''
  }

  matchesList=[]
  onShowMatchesList=[]
  totalMatches=0

  async getMatchesList(type){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{
        typeIds:type,
        page:0,
        pageSize:9999
      }
    });
    this.matchesList=res.data.findMatchesByType.list
    this.totalMatches=res.data.findMatchesByType.totalSize
    if (!type.length)
    {
      this.onMatchesPageChange(1, 8)
    }
    else
    {
      this.onMatchesPageChange(1, 3)
    }
  }

  onMatchesPageChange(page, pageSize)
  {
    let total = this.matchesList.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowMatchesList = this.matchesList.slice(left, right)
  }

  callback(key){
    if(key === '1'){
      this.getMatchesList([])
    }
    else {
      this.getMatchesList([key])
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

        this.user.username = response.data.username
        this.user.avatar = response.data.avatar
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

  matchTypeList = []
  async getMatchTypes(){
    try {
      let res = await this.$apollo.query({
        query: getMatchTypeList,
      });
      this.matchTypeList = res.data.listMatchTypes
    }
    catch (e) {
      console.log(e);
    }
  }

  preFunc(){
    this.getMatchTypes()
    this.getUserInfo()
    this.getMatchesList([])
  }

  mounted(){
    this.preFunc()
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
  margin-top:20px;
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
  grid-column-gap: 16px;
  padding: 0;
}
.matchLists{
  margin: auto;
}

#search{
  margin: auto;
  width: 50%;
}

#carousel{
  width: 80%;
  margin:auto;
}

#all{

}

img{
  width: 200px;
  height: 180px;
  margin: 20px auto 0 auto;
  object-fit: cover;
}

#mobile-matchList{
  display: none;
}

@media screen and (max-width: 1000px){
  #PC-matchList{
    display: none;
  }
  #mobile-matchList{
    display: block;
    width: 90%;
  }
  #search{
    width: 100%;
  }
}
</style>
