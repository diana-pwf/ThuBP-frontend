<template>
  <ul id="result-card-list">
    <li v-for="(item,index) in matchLists" :key="index">
      <SearchResultCard class="card" :matchId="item.matchId" :isCenter="isCenter">
        <img
            id="card-img"
            alt="example"
            :src="item.previewLarge"
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
  @Prop({type:Boolean, default:function (){return false}})isCenter
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

#card-img {
  height: 160px;
  object-fit: cover;
}

.card{
  margin-bottom: 1%;
}
</style>
