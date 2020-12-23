<template>
  <div @mouseleave="hideList" >
    <div id="searchBar">
      <a-select id="select" default-value="matchName"  @change="handleChange">
        <a-select-option value="matchName">
          赛事名称
        </a-select-option>
        <a-select-option value="organizerName">
          组织者名称
        </a-select-option>
      </a-select>
      <a-input-search class="search" @change="onChange"
                      v-model="searchKey"  placeholder="输入赛事名称或组织者昵称以搜索比赛" enter-button @search="onSearch"
      />
    </div>
    <ul id="list" class="wrapper" v-if="showList">
      <li class="list" v-for="(item,index) in  searchList ">
        <b-card @click="goMatchDetail(item)" no-body class="overflow-hidden" style="max-height: 100px">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img id="img" src="background.png" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="6">
              <b-card-body :title="item.name">
                <b-card-text>
                  {{item.description}}
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {getMatchesList} from "../../myQuery";
import ResultCardList from "@/components/ResultCardList.vue" ;

@Component({components:{ResultCardList}})
export default class SearchInput extends Vue {
  searchKey=""
  showList=false
  matchesList=[]
  searchMode=0
  list=[]
  async getMatchesList(){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{
        typeIds:[],
        pageSize:9999
      }
    });
    this.matchesList=res.data.findMatchesByType.list
  }
  onSearch(value: string)
  {
    this.$emit("search",this.list)
    console.log(value, encodeURIComponent(value))
    if(this.$router.currentRoute.path!=`/search/${encodeURIComponent(value)}/${this.searchMode}`)
    {
      this.$router.push({path:`/search/${encodeURIComponent(value)}/${this.searchMode}`})
    }
  }
  onChange(value:string){
    this.showList=true
  }
  hideList(){
    this.showList=false
  }
  get searchList(){
    if(this.searchMode===0){
    this.list = this.matchesList.filter((matches)=>{return matches.name.match(this.searchKey) })}
    else if(this.searchMode === 1){
      this.list = this.matchesList.filter((matches)=>{return matches.organizerUser.username.match(this.searchKey)})
    }
    if(this.list.length>=5){
      return this.list.slice(0,5)
    }
    return this.list
  }
  goMatchDetail(item){
    this.$router.push(`/matchDetail/${item.matchId}`)
  }
  handleChange(value){
    if(value==="matchName"){
      this.searchMode=0
    }
    else if(value === 'organizerName'){
      this.searchMode=1
    }
  }
  mounted(){
    this.getMatchesList()
  }
}
</script>

<style scoped>
.search {
  max-width: 600px;
}
div{
  margin: auto;
  position: relative;
}
#list{
  padding-left: 0;
  padding-right: 8%;
  position: absolute;
  z-index: 3;
}
#img{
  width: 30%;
  height: 30%;
}
li{
  list-style-type: none;
}
#searchBar{
  display: grid;
  grid-template-columns: 20% 80%;
  grid-column-gap: 5px;
}

</style>
