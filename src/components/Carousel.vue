<template>
<!--  <a-carousel id="cantainer" autoplay arrows>-->
<!--    <div-->
<!--        slot="prevArrow"-->
<!--        slot-scope="props"-->
<!--        class="custom-slick-arrow"-->
<!--        style="left: 10px;zIndex: 1"-->
<!--    >-->
<!--      <a-icon type="left-circle" />-->
<!--    </div>-->
<!--    <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">-->
<!--      <a-icon type="right-circle" />-->
<!--    </div>-->
<!--    <div id="img" v-for="(item,index) in this.matches">-->
<!--      <img :src="item.previewLarge"/>-->
<!--    </div>-->
<!--  </a-carousel>-->
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
/*.ant-carousel >>> .slick-slide {*/
/*  text-align: center;*/
/*  line-height: 250px;*/
/*  background: #364d79;*/
/*  overflow: hidden;*/
/*}*/

/*.ant-carousel >>> .custom-slick-arrow {*/
/*  width: 25px;*/
/*  height: 25px;*/
/*  font-size: 25px;*/
/*  color: #fff;*/
/*  background-color: rgba(31, 45, 61, 0.11);*/
/*  opacity: 0.3;*/
/*}*/
/*.ant-carousel >>> .custom-slick-arrow:before {*/
/*  display: none;*/
/*}*/
/*.ant-carousel >>> .custom-slick-arrow:hover {*/
/*  opacity: 0.5;*/
/*}*/

/*.ant-carousel >>> .slick-slide h3 {*/
/*  color: #fff;*/
/*}*/

/*#img {*/
/*  background-size: cover;*/
/*  width: 200px;*/
/*  height: 50px;*/
/*}*/

#carousel {
  height: 300px;
}

#carousel >>> .img-fluid {
  height: 300px !important;
}

</style>
