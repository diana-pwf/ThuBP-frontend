<template>
  <ul id="result-card-list">
    <li v-for="(item,index) in matchLists" :key="index">
      <SearchResultCard class="card">
        <img
            alt="example"
            src="background.png"
            slot="card-img"
        />
        <h2 slot="card-title"> {{item.name}}  </h2>
        <p slot="card-content"> {{item.description}} </p>
      </SearchResultCard>
    </li>
  </ul>

</template>

<script lang="ts">
import { Component, Vue,Prop } from 'vue-property-decorator';
import SearchResultCard from "./SearchResultCard.vue";

@Component({
  components:{SearchResultCard}
})

export default class ResultCardList extends Vue {
  @Prop({type:Array,default:function (){return []}})matchLists
}
</script>

<style scoped>
ul, li {
  list-style-type: none;
}

img {
  max-width: 100%;
  max-height: 100%;
  margin: 0
}
.card{
  margin-bottom: 1%;
}
</style>
