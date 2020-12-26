<template>
  <div>
  <Navigation :username="user.username" :avatar-key="user.avatar"></Navigation>
  <search-input @search="getSearchResult" class="search"></search-input>
    <div v-if="searchList.length">
    <div class="list" >
      <ResultCardList id="matchesList" :match-lists="onShowSearchList" :is-center="true"></ResultCardList>
    </div>
      <div id="mobile-matchList" >
        <ul style="padding: 0" class="wrapper">
          <li style="margin-top: 10px"  v-for="(item,index) in onShowSearchList">
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
      </div>
      <a-pagination class="pagination" :default-current="1" :total="searchList.length" :page-size="3"
                    @change="onMatchesPageChange"
      />
    </div>

    <div v-else class="list">
      <a-empty :description="'暂无搜索结果'"/>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import SearchInput from "@/components/SearchInput.vue";
import Navigation from "@/components/Navigation.vue";
import ResultCardList from "@/components/ResultCardList.vue";
import {getMatchesList} from "../../myQuery";

@Component({
  components:{SearchInput,Navigation,ResultCardList}
})
export default class SearchResults extends Vue {
  user = {
    username: '',
    avatar: ''
  }

  matchesList=[]
  searchList=[]
  onShowSearchList=[]

  path=""

  getSearchResult(list){
    this.searchList = list
    this.onMatchesPageChange(1, 3)
  }

  onMatchesPageChange(page, pageSize) {
    let total = this.searchList.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowSearchList = this.searchList.slice(left, right)
  }

  async init(){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{typeIds:[]}
    });
    this.matchesList=res.data.findMatchesByType.list
    if(this.$route.params.mode==='0'){
      console.log(this.matchesList)
      this.searchList = this.matchesList.filter((matches)=>{return matches.name.match(this.$route.params.value) })}
    else if( this.$route.params.mode === '1'){
      this.searchList = this.matchesList.filter((matches)=>{return matches.organizerUser.username.match(this.$route.params.value)})
    }
    this.onMatchesPageChange(1, 3)
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

  goMatchDetail(item){
    this.$router.push(`/matchDetail/${item.matchId}`)
  }


  async mounted() {
    this.getUserInfo()
    await this.init()
  }
}
</script>


<style scoped>
.list{
  margin:20px auto;
  width:80%;
}

#matchesList {
  margin: auto;
}

.search{
  margin: 16px auto 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 10px auto auto;
}

li{
  list-style-type: none;
}

#mobile-matchList{
  display: none;
}

@media screen and (max-width: 1000px){
  #matchesList{
    display: none;
  }
  #mobile-matchList{
    display: block;
    margin: auto;
  }
  .list{
    margin:20px auto auto;
    width:90%;
  }
}

</style>
