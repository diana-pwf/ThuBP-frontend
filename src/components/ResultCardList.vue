<template>
 <SearchResultCard>
     <img
         alt="example"
         src="background.png"
         slot="card-img"
     />
     <h2 slot="card-title">Europe Street beat</h2>
     <p slot="card-content">www.instagram.com</p>
 </SearchResultCard>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResultCard from "./SearchResultCard.vue";

@Component({
  components:{SearchResultCard}
})
export default class ResultCardList extends Vue {

}
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  margin: 0
}
</style>