<template>
  <ul id="result-card-list">
    <li v-for="item in matchLists" :key="item.id">
      <SearchResultCard>
        <img
            alt="example"
            :src=item.imgSrc
            slot="card-img"
        />
        <h2 slot="card-title">{{item.name}}</h2>
        <p slot="card-content">{{item.content}}</p>
      </SearchResultCard>
    </li>
  </ul>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResultCard from "./SearchResultCard.vue";

@Component({
  components:{SearchResultCard}
})

export default class ResultCardList extends Vue {
  matchCardInfo1 = {
    id:1,
    imgSrc:"background.png",
    name:"Europe Street beat",
    content:"www.instagram.com"
  }

  matchCardInfo2 = {
    id:2,
    imgSrc:"background.png",
    name:"Europe Street beat",
    content:"www.instagram.com"
  }

  matchLists = [this.matchCardInfo1, this.matchCardInfo2]
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
</style>