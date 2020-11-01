<template>
  <div class="home">
    <Navigation></Navigation>
    <search-input ></search-input>
    <div id="div">
      <a-tabs class="tab" default-active-key="1">
        <a-tab-pane  key="1" tab="综合">
          <Carousel></Carousel>
          <ul class="wrapper">
            <li class="list" v-for="(item,index) in new Array(30).fill(1)" :key="index">
            <a-card style="width: 240px">
              <img
                  slot="cover"
                  alt="example"
                  src="background.png"
              />
              <a-card-meta title="Match Title">
                <template slot="description">
                  decription
                </template>
              </a-card-meta>
            </a-card>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane  key="2" tab="篮球" force-render>
          <ResultCardList class="matchLists" :match-lists="new Array(20).fill('1')"></ResultCardList>
          <Pagination class="pagination" :total="30"></Pagination>
        </a-tab-pane>
        <a-tab-pane key="3" tab="足球">
          Content of Tab Pane 3
        </a-tab-pane>
        <a-tab-pane key="4" tab="羽毛球">
          Content of Tab Pane 3
        </a-tab-pane>
        <a-tab-pane key="5" tab="网球">
          Content of Tab Pane 3
        </a-tab-pane>
        <a-tab-pane key="6" tab="乒乓球">
          Content of Tab Pane 3
        </a-tab-pane>
      </a-tabs>
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

@Component({
  components: { Navigation,SearchInput,Carousel,ResultCardList,Pagination
  },
})
export default class Home extends Vue {

}
</script>


<style scoped>
#div{
  margin-top:1%;
  margin-left: 10%;
  margin-right: 10%;
}
.list{
  list-style-type: none;
  margin-bottom: 3%;
}
.wrapper{
  margin-top:2%;
  display: grid;
  grid-template-columns: repeat(auto-fill,33%);
}
.matchLists{
  margin:auto;
  width: 90%;
}
.pagination{
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>
