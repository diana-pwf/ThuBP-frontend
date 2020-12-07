<template>
  <div>
    <Navigation></Navigation>
    <div id="main">
      <b-card border-variant="light" class="card" img-src="https://placekitten.com/300/300" img-alt="Card image" img-right>
        <b-card-body title="Always the best team">
          <b-card-text>
            make the best of the best effort , welcome to us
          </b-card-text>
        </b-card-body>
      </b-card>

      <b-table
          show-empty
          small
          stacked="md"
          :items="items"
          :fields="fields"
          :hover="true"
      >
        <template #cell(avatar)="row">
          <b-avatar badge-variant="info" src="https://placekitten.com/300/300">
            <template #badge><b-icon icon="star-fill"></b-icon></template>
          </b-avatar>
        </template>
        <template #cell(name)="row">
          {{ row.value }}
        </template>
        <template #cell(actions)="row">
          <b-button v-if="!row.value" size="sm" variant="outline-danger" @click="row.removePerson()">
            移除
          </b-button>
        </template>
        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <b-button variant="outline-primary">添加队员</b-button>
      <b-button>转让队长</b-button>
      <b-button variant="outline-danger">解散队伍</b-button>

      <b-button variant="outline-danger">退出队伍</b-button>

      <!--<b-button variant="outline-success">加入我们</b-button>-->
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";

@Component({
  components:{
    Navigation
  }
})

export default class TeamDetail extends Vue{
  items = [
    { name: 'Dickerson', _rowVariant: 'success', actions: true},
    { name: 'Larsen'},
    { name: 'Mini'},
    { name: 'Geneva' },
    { name: 'Jami'},
    { name: 'Essie'},
    { name: 'Thor' },
    { name: 'Larsen'},
  ]

  fields = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'name', label: 'Name', },
    { key: 'description', label: 'Description'},
    { key: 'actions', label: 'Actions' },
  ]

  removePerson()
  {

  }

}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

.card {
  margin-top: 5%;
  margin-bottom: 5%;
}
table>>>thead{
  display: none;
}
</style>