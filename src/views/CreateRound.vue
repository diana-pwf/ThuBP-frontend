<template>
  <div>
    <Navigation :username="user.username"></Navigation>
  <div id="container">
    <b-form @submit="autoArrange" class="form">
      <b-form-group
          id="input-group-1"
          label='轮次名称'
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="roundName"
            required
            placeholder="请输入轮次名称"
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-5"
          label='轮次简介'
          label-for="input-5"
      >
        <b-form-input
            id="input-5"
            v-model="roundDescription"
            placeholder="请输入轮次简介"
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

      <SearchTeam :team-items="teamItems" :teams-list="teamsList"></SearchTeam>
<!--      <b-form-group  id="input-group-2" label="添加参加本轮次比赛的队伍" label-for="input-2">-->
<!--        <b-form-input-->
<!--            id="input-2"-->
<!--            v-model="teamSearchKey"-->
<!--            @input="onChange"-->
<!--            placeholder="请输入查找的队伍名"-->
<!--        ></b-form-input>-->
<!--        <b-list-group  id="list" class="wrapper" v-if="showTeamList">-->
<!--          <b-list-group-item @click="chooseTeam(item)" class="d-flex align-items-center" v-for="(item,index) in  searchTeamList ">-->
<!--            &lt;!&ndash;                          <span>{{item.username}}</span>&ndash;&gt;-->
<!--            <b-avatar variant="success" icon="people-fill" class="mr-3"></b-avatar>-->
<!--            <span class="mr-auto">{{item.name}}</span>-->
<!--            <b-badge variant="info">{{item.unitId}}</b-badge>-->
<!--          </b-list-group-item>-->
<!--        </b-list-group>-->
<!--      </b-form-group>-->
<!--      <h4><b-badge style="margin-top: 20px" variant="success">选择队伍列表</b-badge></h4>-->
<!--      <b-table  class="table" hover :items="teamItems" :fields="teamFields">-->
<!--        <template #cell(name)="row">-->
<!--          &lt;!&ndash; `data.value` is the value after formatted by the Formatter &ndash;&gt;-->
<!--          <a class="teamDetail" @click="gotoTeamDetail(row)">{{ row.item.name }}</a>-->
<!--        </template>-->
<!--        <template #cell(action)="row">-->
<!--          <b-button @click="removeTeam(row)" variant="danger" size="sm">remove</b-button>-->
<!--        </template>-->
<!--      </b-table>-->
      <b-button  type="submit" :disabled="this.teamItems.length<2" id="arrangeButton" block variant="outline-warning">自动编排</b-button>
      <h4><b-badge style="margin-top: 20px" variant="info">比赛列表</b-badge></h4>
      <b-table class="table" striped hover :items="gameItems" :fields="gameFields">
        <template #cell(time)="row">
          <b-form-datepicker v-if="row.item.edit" v-model="selectedTime" class="mb-2"></b-form-datepicker>
          <template v-else>{{row.item.time}}</template>
        </template>
        <template #cell(location)="row">
          <b-form-input  v-if="row.item.edit" v-model="selectedLocation" ></b-form-input>
          <template v-else>{{row.item.location}}</template>
        </template>
        <template #cell(edit)="row">
          <template v-if="row.item.edit">
          <b-button style="margin-right: 5px" variant="success" @click="onSave(row)"  size="sm">save</b-button>
          <b-button  @click="onCancel(row)" size="sm">cancel</b-button>
          </template>
          <b-button variant="info" v-else @click="onEdit(row)" size="sm">edit</b-button>
        </template>
        <template #cell(remove)="row">
          <b-button @click="removeGame(row)" variant="danger" size="sm">remove</b-button>
        </template>
      </b-table>
      <b-button block v-b-modal.custom-create-game variant="outline-warning">自定义添加比赛</b-button>
      <b-modal hide-footer id="custom-create-game">
        <template #modal-title>
          自定义添加比赛
        </template>
        <SearchTeam :team-items="modalTeamItems" :teams-list="teamsList"></SearchTeam>
        <b-button @click="customCreateGame" variant="outline-info" :disabled="modalTeamItems.length!=2" id="custom-create-game-button">创建比赛</b-button>
      </b-modal>
      <div id="submit-button">
      <b-button  variant="success" size="lg" >提交轮次信息</b-button>
      </div>
    </b-form>
  </div>
  </div>
</template>


<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {getMatchRelatedTeams, getRoundStrategyTypes} from "../../myQuery";
import Navigation from "@/components/Navigation.vue";
import SearchTeam from "@/components/SearchTeam.vue"

@Component({components:{SearchTeam, Navigation}})

export default class CreateRound extends Vue{
  // TODO:剩下最后的提交轮次接口
  teamFields = ['name', 'creator', 'description','action']
  teamItems=[]
  modalTeamItems=[]
  gameFields=['unit0-name','unit1-name','time','location','edit','remove']
  gameItems=[]
  // gameItems=[
  //   {
  //     id:1,unit0:'qwq',unit1:'qwqqq',time:'1888',location:'qwqqqq',edit:false
  //   },
  //   {
  //     id:2,unit0:'qwq',unit1:'qwqqq',time:'1888',location:'qwqqqq',edit:false
  //   }
  // ]

  selectedTime=""
  selectedLocation=''
  showTeamList=false
  roundDescription=''
  user={
    username: ''
  }
  roundName=''
  teamSearchKey=''
  roundRule=''
  roundStrategy=''
  strategyOptions=[]
  strategyOptionNames=[]
  teamsList=[]

  customCreateGame(){
    let game={}
    game['id']=this.gameItems.length
    game['unit0']=this.modalTeamItems[0].unitId
    game['unit1']=this.modalTeamItems[1].unitId
    game['unit0-name']=this.modalTeamItems[0].name
    game['unit1-name']=this.modalTeamItems[1].name
    game['time']='null'
    game['location']='null'
    game['edit']=false
    this.gameItems.push(game)
    this.$bvModal.hide("custom-create-game")
  }

  // gotoTeamDetail(row){
  //   window.open(`/#/teamDetail/${row.item.id}`, '_blank');
  // }

  async autoArrange(){
    let strategy=this.strategyOptions.find(x=>x.strategyName===this.roundStrategy)
    let list=[]
    for(let x of this.teamItems){
      list.push(x.id)
    }
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/generate-games`,
        data: {
          strategy:strategy.strategyId,
          units:list
        }
      })
      // 对response做处理
      if (response.status === 200) {
        let list=response.data.arrangement
        for(let x of list){
          x['edit']=false
          x['time']='null'
          x['location']='null'
          x['unit0-name']=this.teamsList.find(team=>team['unitId']===x['unit0']).name
          x['unit1-name']=this.teamsList.find(team=>team['unitId']===x['unit1']).name
        }
        this.gameItems = list
      }
      else
      {
        this.$message.error(JSON.stringify(response))
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data))
    }
  }

  onEdit(row){
    row.item.edit=true
    this.selectedTime=row.item.time
    this.selectedLocation=row.item.location
  }

  onSave(row){
    row.item.edit=false
    row.item.time=this.selectedTime
    row.item.location=this.selectedLocation
  }

  // chooseTeam(item){
  //   let team={}
  //   for( let x of this.teamItems){
  //     if(x.id===item.unitId){
  //       this.$message.warning('这支队伍已在选择列表中。')
  //       this.hideList()
  //       return;
  //     }
  //   }
  //   team['id']=item.unitId
  //   team['name']=item.name
  //   team['creator']=item.creator.username
  //   team['description']='description to be implemented'
  //   this.teamItems.push(team)
  //   this.hideList()
  // }

  // removeTeam(row){
  //   let index = this.teamItems.findIndex(x=>x.id===row.item.id)
  //   this.teamItems.splice(index,1)
  // }

  removeGame(row){
    let index = this.gameItems.findIndex(x=>x.id===row.item.id)
    this.gameItems.splice(index,1)
  }

  // get searchTeamList(){
  //   let list = this.teamsList.filter((teams) => {
  //     return teams.name.match(this.teamSearchKey)
  //   })
  //   if(list.length>5){
  //     return list.slice(0,5)
  //   }
  //   return list
  // }

  onCancel(row){
    row.item.edit=false
  }
  //
  // onChange(){
  //   this.showTeamList=true
  // }
  //
  // hideList(){
  //   this.showTeamList=false
  // }

  async getTeamsList(){
    try {
      let res = await this.$apollo.query({
        query: getMatchRelatedTeams,
        variables:{matchId:this.$route.params.matchId}
      })
      this.teamsList = res.data.findMatchById.units
    }
    catch (e){
        console.log(e.data)
      }
  }



  async getRoundStrategyOptions(){
    try {
      let res = await this.$apollo.query({
        query: getRoundStrategyTypes,
      });
      this.strategyOptions=res.data.listRoundGameStrategyTypes
      this.strategyOptionNames=this.strategyOptions.map(x=>{return x.strategyName})
  }
  catch (e){
      console.log(e.data)
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
    this.getTeamsList()
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
  margin-bottom: 30px;
  float: right;
}

#teamDetail{
  color: dodgerblue;
  text-decoration: underline;
}

#custom-create-game-button{
  float: right;
}
</style>
