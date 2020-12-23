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
        <b-button v-if="!row.value" size="sm" variant="outline-danger" @click="onRemoveMember(row)">
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

    <b-button class="button" v-if="isCreator"
              variant="outline-primary"
              v-b-modal.addUserInviteTeamMember
    >添加队员
    </b-button>
    <!--      <b-button class="button" v-if="isCreator" variant="outline-success">转让队长</b-button>-->
<!--    <b-button class="button" v-if="isCreator" variant="outline-danger">解散队伍</b-button>-->

    <InviteUser id="addUserInviteTeamMember" :type="'InviteTeamMember'" :unit="team"></InviteUser>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import axios from "axios";
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import InviteUser from "@/components/InviteUser.vue";
import {getUnitDetail, findUserByName} from "../../myQuery";
import index from "@/store";

@Component({
  components:{
    InviteUser
  }
})

export default class Teamdetail extends Vue {
  // @Prop({type:String, default:function (){return ""}})unitId

  @Prop({type:Object, default:function (){return {}}})team
  @Prop({type:Array, default:function (){return []}})items
  @Prop({type:Boolean, default:function (){return []}})isCreator

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

  //TODO：后端移除队员/解散队伍可能还存在问题
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
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('删除队员成功！')
        // setTimeout(() => window.location.reload(), 1000);
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

  // items = []
  //isCreator = false
  // async getTeamDetail()
  // {
  //   try {
  //     let res = await this.$apollo.query({
  //       query: getUnitDetail,
  //       variables:{unitId:this.unitId}
  //     });
  //     this.team = res.data.findUnitById
  //     this.team['id'] = res.data.findUnitById.unitId
  //     this.items.push({
  //       // @ts-ignore
  //       name: this.team.creator.username,
  //       // @ts-ignore
  //       id: this.team.creator.userId,
  //       // @ts-ignore
  //       description: this.team.creator.description,
  //       // @ts-ignore
  //       avatar: this.team.creator.avatar,
  //       _rowVariant: 'success',
  //       actions: true
  //     })
  //     // @ts-ignore
  //     for (let person of this.team.members)
  //     {
  //       // @ts-ignore
  //       if (this.team.creator.userId !== person.userId) {
  //         this.items.push(
  //             {
  //               // @ts-ignore
  //               name: person.username,
  //               // @ts-ignore
  //               id: person.userId,
  //               // @ts-ignore
  //               description: person.description,
  //               // @ts-ignore
  //               avatar: person.avatar,
  //             }
  //         )
  //       }
  //     }
  //     this.getCurrentUserRole()
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }
  //
  // async getCurrentUserRole()
  // {
  //   try {
  //     axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
  //     let response = await axios({
  //       method: 'get',
  //       url: '/api/v1/user/info',
  //       params: { }
  //     })
  //     // 对response做处理
  //     if (response.status === 200) {
  //       this.$message.success('get userInfo success!')
  //       this.user.userId = response.data.userId
  //       this.user.username = response.data.username
  //       this.user.avatar = response.data.avatar
  //       //@ts-ignore
  //       if (this.user.userId === this.team.creator.userId)
  //       {
  //         this.isCreator = true
  //       }
  //     }
  //     else
  //     {
  //       // 输出错误提示
  //     }
  //   } catch (e) {
  //     this.$message.error(JSON.stringify(e.response.data.error))
  //   }
  // }
  //
  // async inviteUser()
  // {
  //   console.log(this.selectedUserList)
  // }

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
