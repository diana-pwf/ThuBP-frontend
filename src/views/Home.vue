<template>
  <div class="home">
    <Navigation></Navigation>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navigation from '@/components/Navigation.vue'

@Component({
  components: { Navigation
  },
})
export default class Home extends Vue {}
</script>
