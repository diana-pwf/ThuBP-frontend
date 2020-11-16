<template>
  <div>
  <Navigation></Navigation>
  <search-input class="search"></search-input>
    <div class="list">
    <ResultCardList  :match-lists="new Array(10).fill(1)"></ResultCardList>
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

@Component({
  components:{SearchInput,Navigation,ResultCardList}
})
export default class SearchResults extends Vue {


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
