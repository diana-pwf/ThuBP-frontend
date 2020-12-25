<template>
  <div id="main">
    <p>队伍名称：{{team.name}}</p>
    <p>队伍简介：{{team.description}}</p>
    <b-table
        show-empty
        small
        stacked="md"
        :items="items"
        :fields="fields"
        :hover="true"
        :fixed="true"
        id="table"
    >
      <template #cell(avatar)="row">
        <b-avatar v-if="row.value" badge-variant="info" :src="row.value">
          <template #badge><b-icon icon="star-fill"></b-icon></template>
        </b-avatar>
        <b-avatar v-else badge-variant="info">
          <template #badge><b-icon icon="star-fill"></b-icon></template>
        </b-avatar>
      </template>
      <template #cell(name)="row">
        {{ row.value }}
      </template>
      <template #cell(description)="row">
        {{ row.value }}
      </template>
      <template #cell(actions)="row">
        <b-button v-if="!row.value && !start" size="sm" variant="outline-danger" @click="onRemoveMember(row)">
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
    <b-button class="button" v-if="isCreator && !start"
              variant="outline-primary"
              v-b-modal.addUserInviteTeamMember
    >添加队员
    </b-button>
    <InviteUser id="addUserInviteTeamMember" :type="'InviteTeamMember'" :unit="team"></InviteUser>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import axios from "axios";
import InviteUser from "@/components/InviteUser.vue";

@Component({
  components:{InviteUser}
})

export default class Teamdetail extends Vue {
  @Prop({type:Object, default:function (){return {}}})team
  @Prop({type:Array, default:function (){return []}})items
  @Prop({type:Boolean, default:function (){return []}})start
  @Prop({type:Boolean, default:function (){return false}})isCreator

  onRemoveMember(row){
    this.$bvModal.msgBoxConfirm(`确认要删除${row.item.name}吗？`, {
      title: '删除队员',
      size: 'sm',
      buttonSize: 'sm',
      okVariant: 'danger',
      okTitle: 'YES',
      cancelTitle: 'NO',
      footerClass: 'p-2',
      hideHeaderClose: false,
      centered: true
    })
      .then(value => {
        if(value===true){
          this.removeMember(row.item.id)
        }
      })
      .catch(err => {
        this.$message.error(err)
      })
  }

  async removeMember(id){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'delete',
        url: `/api/v1/match/${this.$route.params.matchId}/unit/${this.team.id}/member`,
        data:{
          members:[id]
        }
      })
      if (response.status === 200) {
        this.$message.success('删除队员成功！')
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
       this.$message.error(JSON.stringify(e.response.data.message))
      if(e.response.data.status===401){
        setTimeout(() => this.$router.push("/urlClickResult/fail"), 1000);
      }
    }
  }

  fields = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'name', label: 'Name', },
    { key: 'description', label: 'Description'},
    { key: 'actions', label: 'Actions' },
  ]

}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

table>>>thead{
  display: none;
}
.button{
  margin-right: 10px;
}
</style>
