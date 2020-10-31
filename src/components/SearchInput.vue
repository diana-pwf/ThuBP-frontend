<template>
  <div>
    <a-input-search class="search" placeholder="输入赛事名称或组织者昵称以搜索比赛" enter-button @search="onSearch" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SearchInput extends Vue {
  onSearch(value: string) {
    this.$router.push('/search')
  }
}
</script>

<style scoped>
.search {
  width: 600px;
}
</style>