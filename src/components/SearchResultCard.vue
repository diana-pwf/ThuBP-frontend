<template>
  <a-card class="card" hoverable="" style="width:1000px">
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

}
</script>

<style scoped>
.card {
  height: 268px;
}

.mycard {
  height: 220px;
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 20px;
}

.card-img {
  height: 220px;
}

.card-text {
  text-align: left;
}
</style>
