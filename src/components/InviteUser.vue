<template>
  <b-modal  :id="id" hide-footer >
    <div class="d-block text-center">
      <p class="h2 mb-2"><b-icon icon="person-plus-fill"></b-icon></p>
      <span style="font-size: large">邀请用户成为<strong>{{unit.name}}</strong>{{type==="InviteReferee"?"裁判":type==='addWatch'?'参与者':'队员'}}</span>
      <b-form-tags   no-outer-focus v-model="selectedUserList">
        <template v-slot="{ tags, inputAttrs, inputHandlers, tagVariant, addTag, removeTag }">
          <a-input-search class="search" @change="selectUserChange"   v-model="userSearchKey"  placeholder="Search by username"   />
          <b-form-tag
              v-for="tag in tags"
              @remove="removeTag(tag)"
              :key="tag"
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
      <b-button block @click="inviteUser" v-if="selectedUserList.length!==0" variant="success">确认邀请</b-button>
    </div>
  </b-modal>
</template>

<script>
import axios from "axios";
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {findUserByName} from "../../myQuery";

@Component
export default class InviteUser extends Vue{
  @Prop({type:String, default:function (){return ""}})type
  @Prop({type:Object, default:function (){return {}}})unit
  // @Prop({type:Boolean,default:function(){return false}})showModal
  @Prop({type:String, default:function (){return ""}})id
  selectedUserList=[]
  showUserList = false
  userSearchKey = ""
  userSearchList=[]


  selectUserChange(){
    this.showUserList=true
    this.getUserList()
  }

  async getUserList(){
    let res = await this.$apollo.query({
      query: findUserByName,
      variables:{username:this.userSearchKey}
    });
    this.userSearchList=res.data.findUserByFuzzy.list
  }

  getSelectedUserName(tag){
    let index_left = tag.indexOf('"')
    let index_right = tag.slice(index_left + 1).indexOf('"')
    return tag.substr(index_left + 1, index_right)
  }

  chooseUser(item){
    this.selectedUserList.push(JSON.stringify([item.username,item.userId]))
  }

  async inviteUser(){
    //this.getRefereeToken()
    let list = []
    for(let x of this.selectedUserList){
      let array=x.split('\"')
      if(list.find(x=>x===array[3])===undefined){
        list.push(array[3])
      }
    }
    console.log(list)
    console.log(this.type)
    let url = ""
    let method = ""
    if(this.type === "InviteReferee"){
      url = `/api/v1/match/invite-referees/${this.unit['id']}`
      method = "post"
    }
    else  if(this.type==="InviteTeamMember"){
      url = `/api/v1/match/assign-unit-token/${this.unit['id']}`
      method = "put"
    }
    else if(this.type==='addWatch'){
      url=`/api/v1/match/invite-match/${this.unit['id']}`
      method='post'
    }
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: method,
        url: url,
        data: {
          userIds:list
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('invite success!')
        this.selectedUserList = []
        this.showUserList = false
        this.userSearchKey = ""
        this.userSearchList=[]
        console.log(this.unit)
      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
    this.$bvModal.hide(this.id)
  }

  // mounted(){
  //   console.log(this.id)
  // }
}
</script>

<style scoped>

</style>
