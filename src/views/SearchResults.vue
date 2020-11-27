<template>
  <div>
  <Navigation></Navigation>
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

  mounted() {
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
