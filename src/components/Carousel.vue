<template>
  <b-carousel
      id="carousel"
      v-model="slide"
      :interval="3000"
      controls
      indicators
      background="#ababab"
      img-height="300"
      img-width="1024"
      style="text-shadow: 1px 1px 2px #333;"
  >
    <b-carousel-slide v-for="(item, index) in matches">
      <template #img>
        <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            :src="item.previewLarge"
            alt="image slot"
            @click="gotoMatchDetail(item.matchId)"
        >
      </template>
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import {getCarouselMatches} from "../../myQuery";

@Component
export default class Carousel extends Vue{
  slide = 0

  matches = []

  async getCarouselContent(){
    try {
      let res = await this.$apollo.query({
        query: getCarouselMatches,
      })
      console.log(res.data)
      this.matches = res.data.getBulletin

    }
    catch (e) {
      console.log(e);
    }
  }

  gotoMatchDetail(id){
    this.$router.push(`/matchDetail/${id}`)
  }

  mounted(){
    this.getCarouselContent()
  }

}
</script>

<style scoped>
#carousel {
  height: 300px;
}

#carousel >>> .img-fluid {
  height: 300px !important;
  object-fit: cover;
}

</style>
