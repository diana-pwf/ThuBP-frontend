<template>
  <div> <a-pagination
      v-model="page"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      show-quick-jumper
      :page-size="size"
      @showSizeChange="SizeChange"
      @change="PageChange"
  ></a-pagination></div>
</template>

<script>
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
@Component
export default class Pagination extends Vue {
  @Prop({type:Number})total
  name = 'Pagination'
  page=1
  size=10
  pageSizeOptions=['10','20','30','40']
  SizeChange(current, size) {
    this.page=current
    this.size = size
    this.$emit('size-change',{current,size})
  }

  PageChange(current, size) {
    this.page=current
    this.size=size
    this.$emit('page-change',{current,size})
  }
}
</script>

<style scoped>

</style>
