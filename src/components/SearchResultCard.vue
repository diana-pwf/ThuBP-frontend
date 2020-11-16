<template>
  <a-card @click="goMatchDetail" class="card" hoverable="">
    <div class="mycard">
      <div class="card-img">
        <slot name="card-img"></slot>
      </div>
      <div class="card-text">
        <slot name="card-title"></slot>
        <slot name="card-content"></slot>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SearchResultCard extends Vue {
goMatchDetail(){
  this.$router.push('/matchDetail')
}
}
</script>

<style scoped>
/*.card {*/
/*  height: 25%;*/
/*}*/

.mycard {
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 5%;
}

.card-img {
  height: 100%;
}

.card-text {
  text-align: left;
}
</style>
