<template>
  <search-input></search-input>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import SearchInput from "@/components/SearchInput.vue";

@Component({
  components:{SearchInput}
})
export default class SearchResults extends Vue {


}
</script>


<style scoped>

</style>