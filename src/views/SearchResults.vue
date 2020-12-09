<template>
  <div>
  <Navigation :username="user.username"></Navigation>
  <search-input @search="getSearchResult" class="search"></search-input>
    <div class="list">
    <ResultCardList  :match-lists="searchList"></ResultCardList>
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
    username: ''
  }

  matchesList=[]
  searchList=[]
  path=""
   getSearchResult(list){
     this.searchList=list
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

  mounted() {
    this.getUserInfo()
    this.init()
  }
}
</script>


<style scoped>
.list{
  margin: 2% 10%;
  width:80%;
}
.search{
  margin-left: 30%;
  margin-right: 20%;
  width: 60%;
  margin-top: 2%;
}
</style>
