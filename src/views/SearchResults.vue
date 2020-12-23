<template>
  <div>
  <Navigation :username="user.username" :avatar-key="user.avatar"></Navigation>
  <search-input @search="getSearchResult" class="search"></search-input>
    <div class="list" v-if="onShowSearchList.length">
      <ResultCardList id="matchesList" :match-lists="onShowSearchList" :is-center="true"></ResultCardList>
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
   this.searchList=list
  }

  onMatchesPageChange(page, pageSize) {
    let total = this.matchesList.length
    let left = (page - 1) * pageSize
    let right = (page * pageSize > total) ? total : page * pageSize
    this.onShowSearchList = this.searchList.slice(left, right)
  }

  async init(){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{typeIds:[]}
    });
    this.matchesList=res.data.findMatchesByType

    if(this.$route.params.mode==='0'){
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
    }
  }

  mounted() {
    this.getUserInfo()
    this.init()
  }
}
</script>


<style scoped>
.list{
  margin: 2% 10% auto 10%;
  width:60%;
}

#matchesList {
  margin: auto;
}

.search{
  margin-left: 30%;
  margin-right: 20%;
  width: 60%;
  margin-top: 2%;
}

.pagination {
  margin: auto;
  display: flex;
  justify-content: center;
}
</style>
