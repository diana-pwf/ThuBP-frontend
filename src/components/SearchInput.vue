<template>
  <div @mouseleave="hideList" >
  <a-input-search class="search" @change="onChange"   v-model="searchKey"  placeholder="输入赛事名称或组织者昵称以搜索比赛" enter-button @search="onSearch" />
    <ul id="list" class="wrapper" v-if="showList">
      <li class="list" v-for="(item,index) in  searchList ">
        <b-card @click="goMatchDetail" no-body class="overflow-hidden" style="max-height: 100px">
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
  async getMatchesList(){
    let res = await this.$apollo.query({
      query: getMatchesList,
      variables:{typeIds:[]}
    });
    this.matchesList=res.data.findMatchesByType
  }
  onSearch(value: string) {
    this.$router.push('/search')
  }
  onChange(value:string){
    this.showList=true
  }
  hideList(){
    this.showList=false
  }
  get searchList(){
    let list = this.matchesList.filter((matches)=>{return matches.name.match(this.searchKey) })
    if(list.length>=5){
      list=list.slice(0,5)
    }
    return list
  }
  goMatchDetail(){
    this.$router.push('/matchDetail')
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
</style>
