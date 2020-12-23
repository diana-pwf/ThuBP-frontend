<template>
  <div>
    <Navigation :username="user.username" :avatar-key="user.avatar"></Navigation>
    <div id="main">
      <b-card border-variant="light" class="card" img-src="https://placekitten.com/300/300" img-alt="Card image" img-right>
        <b-card-body :title="team.name">
          <b-card-text>
            {{team.description}}
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

      <b-button class="button" v-if="isCreator"
                variant="outline-primary"
                v-b-modal.addUser
                >添加队员
      </b-button>
<!--      <b-button class="button" v-if="isCreator" variant="outline-success">转让队长</b-button>-->
      <b-button class="button" v-if="isCreator" variant="outline-danger">解散队伍</b-button>

      <InviteUser type="InviteTeamMember" :unit="team"></InviteUser>

    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import InviteUser from "@/components/InviteUser.vue";
import {getUnitDetail, findUserByName} from "../../myQuery";
import index from "@/store";

@Component({
  components:{
    Navigation,InviteUser
  }
})

export default class TeamDetail extends Vue{
  team = {}
  items = []
  user = {
    userId: '',
    username: '',
    avatar: ''
  }
  currentUserId = ""
  isCreator = false

  async getTeamDetail()
  {
    try {
      let res = await this.$apollo.query({
        query: getUnitDetail,
        variables:{unitId:this.$route.params.unitId}
      });
      this.team = res.data.findUnitById
      this.team['id'] = res.data.findUnitById.unitId
      this.items.push({
            // @ts-ignore
            name: this.team.creator.username,
            // @ts-ignore
            id: this.team.creator.userId,
            // @ts-ignore
            description: this.team.creator.description,
            // @ts-ignore
            avatar: this.team.creator.avatar,
            _rowVariant: 'success',
            actions: true
          })
      // @ts-ignore
      for (let person of this.team.members)
      {
        // @ts-ignore
        if (this.team.creator.userId !== person.userId) {
          this.items.push(
              {
                // @ts-ignore
                name: person.username,
                // @ts-ignore
                id: person.userId,
                // @ts-ignore
                description: person.description,
                // @ts-ignore
                avatar: person.avatar,
              }
          )
        }
      }
      this.getCurrentUserRole()
    }
    catch (e) {
      console.log(e);
    }
  }

  async getCurrentUserRole()
  {
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'get',
        url: '/api/v1/user/info',
        params: { }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('get userInfo success!')
        this.user.userId = response.data.userId
        this.user.username = response.data.username
        this.user.avatar = response.data.avatar
        //@ts-ignore
        if (this.user.userId === this.team.creator.userId)
        {
          this.isCreator = true
        }
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }
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

  mounted()
  {
    this.getTeamDetail()
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
.button{
  margin-right: 10px;
}
</style>
