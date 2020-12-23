<template>
  <div v-if="isCenter" id="card-center">
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
  </div>
  <div v-else id="card">
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
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class SearchResultCard extends Vue {
  @Prop({type:String, default:function (){return ""}})matchId
  @Prop({type:Boolean, default:function (){return false}})isCenter

  goMatchDetail(){
    this.$router.push(`/matchdetail/${this.matchId}`)
  }
}
</script>

<style scoped>

#card {
  width: 100%;
}

#card-center {
  width: 75%;
  margin: auto;
}

.mycard {
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 5%;
}

.card-img {
  height: 100%;
}

#text1, #text2 {
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
