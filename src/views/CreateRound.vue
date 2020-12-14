<template>
  <div>
    <Navigation :username="user.username"></Navigation>
  <div id="container">
    <b-form class="form">
      <b-form-group
          id="input-group-1"
          label='轮次名称'
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="roundName"
            type="email"
            required
            placeholder="请输入轮次名称"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="赛制" label-for="input-3">
        <b-form-select
            id="input-3"
            v-model="roundStrategy"
            :options="strategyOptionNames"
            required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-2" label="添加参加本轮次比赛的队伍" label-for="input-2">
        <b-form-input
            id="input-2"
            v-model="teamSearchKey"
            required
            placeholder="请输入查找的队伍名"
        ></b-form-input>
      </b-form-group>
      <h4><b-badge style="margin-top: 20px" variant="success">选择队伍列表</b-badge></h4>
      <b-table class="table" striped hover :items="teamItems" :fields="teamFields">
        <template #cell(action)="row">
          <b-button variant="danger" size="sm">remove</b-button>
        </template>
      </b-table>
      <b-button id="arrangeButton" block variant="outline-warning">自动编排</b-button>
      <h4><b-badge style="margin-top: 20px" variant="info">比赛列表</b-badge></h4>
      <b-table class="table" striped hover :items="gameItems" :fields="gameFields">
        <template #cell(time)="row">
          <b-input v-if="row.item.edit"></b-input>
          <template v-else>{{row.item.time}}</template>
        </template>
        <template #cell(edit)="row">
          <template v-if="row.item.edit">
          <b-button style="margin-right: 5px" variant="success" @click="onSave(row)"  size="sm">save</b-button>
          <b-button  @click="onCancel(row)" size="sm">cancel</b-button>
          </template>
          <b-button variant="info" v-else @click="onEdit(row)" size="sm">edit</b-button>
        </template>
        <template #cell(remove)="row">
          <b-button variant="danger" size="sm">remove</b-button>
        </template>
      </b-table>
      <b-button block variant="outline-warning">自定义添加比赛</b-button>
      <div id="submit-button">
      <b-button variant="success" size="lg" >提交轮次信息</b-button>
      </div>
    </b-form>
  </div>
  </div>
</template>


<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {concat} from "apollo-link";
import {getRoundStrategyTypes} from "../../myQuery";
import Navigation from "@/components/Navigation.vue";

@Component({components:{Navigation}})

export default class CreateRound extends Vue{
  teamFields = ['name', 'organiser', 'description','action']
  teamItems=[
    {
      name:'yuki_team',organiser:'yuki',description:'qwq'
    },
    {
      name:'yuki_team',organiser:'yuki',description:'qwq'
    }
  ]
  gameFields=['unit0','unit1','time','location','edit','remove']
  gameItems=[
    {
      unit0:'qwq',unit1:'qwqqq',time:'1888',location:'qwqqqq',edit:false
    }
  ]

  onEdit(row){
    row.item.edit=true
  }

  onSave(row){
    row.item.edit=false
  }

  onCancel(row){
    row.item.edit=false
  }

  user={
    username: ''
  }
  roundName=''
  teamSearchKey=''
  roundRule=''
  roundStrategy=''
  strategyOptions=[]
  strategyOptionNames=[]
  async getRoundStrategyOptions(){
    try {
      let res = await this.$apollo.query({
        query: getRoundStrategyTypes
      });
      console.log(res)
      this.strategyOptions=res.data.listRoundGameStrategyTypes
      this.strategyOptionNames=this.strategyOptions.map(x=>{return x.strategyName})
  }
  catch (e){
      console.log(e.errorMessage)
  }
  }
  async getUserInfo()
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
        this.user.username = response.data.username
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  mounted(){
    this.getRoundStrategyOptions()
    this.getUserInfo()
  }



}
</script>

<style scoped>

#container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form{
   width: 60%;
  margin-top: 20px;
}
.table{
  margin-top:10px
}

#submit-button{
  margin-top: 30px;
  float: right;
}

</style>
