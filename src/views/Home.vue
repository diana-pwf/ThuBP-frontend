<template>
  <div class="home">
    <Navigation></Navigation>
    <div id="div">
      <div class="container">
        <div class="make-center">
          <search-input ></search-input>
        </div>
        <a-tabs class="tab" default-active-key="1" :tabBarStyle="{'text-align': 'center'}">
          <a-tab-pane key="1" tab="综合">
            <Carousel></Carousel>
            <ul class="wrapper">
              <li class="list" v-for="(item,index) in new Array(30).fill(1)" :key="index">
                <a-card style="width: 240px; text-align: center;">
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
.pagination{
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>
