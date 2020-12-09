<template>
  <div>
    <Navigation></Navigation>
    <div id="main">
      <b-card border-variant="light" class="card" img-src="https://placekitten.com/300/300" img-alt="Card image" img-right>
        <b-card-body :title="team.name">
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
          :fixed="true"
          id="table"
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

      <b-button class="button" v-if="isCreator"
                variant="outline-primary"
                v-b-modal.addUser
                >添加队员
      </b-button>
      <b-button class="button" v-if="isCreator" variant="outline-success">转让队长</b-button>
      <b-button class="button" v-if="isCreator" variant="outline-danger">解散队伍</b-button>

      <b-modal id="addUser" hide-footer >
        <div class="d-block text-center">
          <p class="h2 mb-2"><b-icon icon="person-plus-fill"></b-icon></p>
          <span style="font-size: large">邀请用户成为<strong>{{team.name}}</strong>裁判</span>
          <!--                      <b-input-group>-->
          <!--                        <b-form-input @change="selectRefereeChange"   v-model="refereeSearchKey" placeholder="Search by username"></b-form-input>-->
          <!--                      </b-input-group>-->
          <b-form-tags   no-outer-focus v-model="selectedUserList">

            <template v-slot="{ tags, inputAttrs, inputHandlers, tagVariant, addTag, removeTag }">
              <a-input-search class="search" @change="selectUserChange"  v-model="userSearchKey"  placeholder="Search by username"   />
              <b-form-tag
                  v-for="tag in tags"
                  @remove="removeTag(tag)"
                  :key="tag"
                  :title="tag"
                  :variant="tagVariant"
                  class="mr-1"
              >{{getSelectedUserName(tag)}}</b-form-tag>
            </template>
          </b-form-tags>
          <b-list-group  id="list" class="wrapper" v-if="showUserList">
            <b-list-group-item @click="chooseUser(item)" class="d-flex align-items-center" v-for="(item,index) in  userSearchList ">
              <!--                          <span>{{item.username}}</span>-->
              <b-avatar variant="info" class="mr-3"></b-avatar>
              <span class="mr-auto">{{item.username}}</span>
            </b-list-group-item>
          </b-list-group>

          <b-button block :disabled="!selectedUserList.length" variant="success"
                    @click="inviteUser">邀请加入</b-button>

        </div>
      </b-modal>


    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import {getUnitDetail, findUserByName} from "../../myQuery";
import index from "@/store";

@Component({
  components:{
    Navigation
  }
})

export default class TeamDetail extends Vue{
  team = {}
  items = []
  currentUserId = ""
  isCreator = false

  showUserList = false
  userSearchKey = ""
  selectedUserList = []
  userSearchList=[]
  // removeReferee(tag){
  //   let index=this.selectedRefereeList.indexOf(tag)
  //   this.selectedRefereeList.slice(index,1)
  // }
  // get selectedRefereeName(){
  //   return this.selectedRefereeList.map(x=>{return x.username})
  // }

  selectUserChange(value:string){
    console.log("change")
    this.showUserList=true
    this.getUserList()
  }

  chooseUser(item){
    this.selectedUserList.push([item.username,item.userId])
  }

  getSelectedUserName(tag){
    let index_left = tag.indexOf('"')
    let index_right = tag.slice(index_left + 1).indexOf('"')
    return tag.substr(index_left + 1, index_right)
  }

  // 添加队员时拿到用户列表
  async getUserList(){
    let res = await this.$apollo.query({
      query: findUserByName,
      variables:{username:this.userSearchKey}
    });
    this.userSearchList=res.data.findUserByFuzzy
  }

  async getTeamDetail()
  {
    try {
      let res = await this.$apollo.query({
        query: getUnitDetail,
        variables:{unitId:this.$route.params.unitId}
      });
      this.team = res.data.findUnitById
      this.items.push({
            // @ts-ignore
            name: this.team.creator.username,
            // @ts-ignore
            id: this.team.creator.userId,
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
        this.currentUserId = response.data.userId
        //@ts-ignore
        if (this.currentUserId === this.team.creator.userId)
        {
          this.isCreator = true
        }
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  async inviteUser()
  {
    console.log(this.selectedUserList)
  }

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
