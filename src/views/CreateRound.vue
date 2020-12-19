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

      <b-form-group v-if="mode==='Create'" id="input-group-3" label="赛制" label-for="input-3">
        <b-form-select
            id="input-3"
            v-model="roundStrategy"
            :options="strategyOptionNames"
            required
        ></b-form-select>
      </b-form-group>

      <SearchTeam type="normal"  :team-items="teamItems" :teams-list="teamsList"></SearchTeam>
      <b-button v-if="mode==='Create'" type="submit" :disabled="this.teamItems.length<2" id="arrangeButton" block variant="outline-warning">自动编排</b-button>
      <div>
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
      </div>
      <b-button block :disabled="this.teamItems.length<2" v-b-modal.custom-create-game variant="outline-warning">自定义添加比赛</b-button>
      <b-modal hide-footer id="custom-create-game">
        <template #modal-title>
          自定义添加比赛
        </template>
        <SearchTeam   type="modal" :team-items="modalTeamItems" :teams-list="teamItems"></SearchTeam>
        <b-button @click="customCreateGame" variant="outline-info" :disabled="modalTeamItems.length!=2" id="custom-create-game-button">创建比赛</b-button>
      </b-modal>
      <div id="submit-button">
      <b-button @click="createRound" v-if="roundName" :disabled="gameItems.length<1" variant="success" size="lg" >提交轮次信息</b-button>
      </div>
    </b-form>
  </div>
  </div>
</template>


<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {findUserByName, getMatchRelatedTeams, getRoundStrategyTypes,getRoundInfo} from "../../myQuery";
import Navigation from "@/components/Navigation.vue";
import SearchTeam from "@/components/SearchTeam.vue"


@Component({components:{SearchTeam, Navigation}})

export default class CreateRound extends Vue{
  teamFields = ['name', 'creator', 'description','action']
  teamItems=[]
  modalTeamItems=[]
  gameFields=['unit0-name','unit1-name','time','location','edit','remove']
  gameItems=[]

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

  mode=''

  // onModalChangeSelectedTeams(teamProp){
  //   this.modalTeamItems=teamProp
  // }
  //
  // onChangeSelectedTeams(teamProp){
  //   this.teamItems=teamProp
  // }

  customCreateGame(){
    let game={}
    game['id']=this.gameItems.length
    game['unit0']=this.modalTeamItems[0].id
    game['unit1']=this.modalTeamItems[1].id
    game['unit0-name']=this.modalTeamItems[0].name
    game['unit1-name']=this.modalTeamItems[1].name
    game['time']='null'
    game['location']='null'
    game['edit']=false
    this.gameItems.push(game)
    this.$bvModal.hide("custom-create-game")
  }


  async autoArrange(event){
    event.preventDefault()
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

  removeGame(row){
    let index = this.gameItems.findIndex(x=>x.id===row.item.id)
    this.gameItems.splice(index,1)
  }


  onCancel(row){
    row.item.edit=false
  }

  async getTeamsList(){
    try {
      let res = await this.$apollo.query({
        query: getMatchRelatedTeams,
        variables:{matchId:this.$route.params.matchId}
      })
      let list = res.data.findMatchById.units
      for(let x of list){
        x['creator']=x['creator'].username
        x['id']=x.unitId
      }
      this.teamsList=list
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

  async getRoundInfo(){
    let res = await this.$apollo.query({
      query: getRoundInfo,
      variables:{roundId:this.$route.params.roundId}
    });
    this.roundName=res.data.findRoundById.name
    this.roundDescription=res.data.findRoundById.description
    for(let unit of res.data.findRoundById.units){
      let team={}
      team['id']=unit.unitId
      team['name']=unit.name
      team['creator']=unit.creator.username
      team['description']='description to be implemented'
      this.teamItems.push(team)
    }
    for(let game of res.data.findRoundById.games){
      let temp={}
      temp['unit0']=game.unit0.unitId
      temp['unit1']=game.unit1.unitId
      temp['unit0-name']=game.unit0.name
      temp['unit1-name']=game.unit1.name
      temp['edit']=false
      temp['time']=game.startTime
      temp['location']=game.location
      this.gameItems.push(temp)
    }
  }

  async createRound(){
    // let strategy=this.strategyOptions.find(x=>x.strategyName===this.roundStrategy)
    let unitList=[]
    for(let x of this.teamItems){
      unitList.push(x.id)
    }
    let gameList=[]
    for(let x of this.gameItems){
      if(x.time==="null")
      {
        gameList.push({'unit0':x.unit0,'unit1':x.unit1,'location':x.location})
      }
      else {
        let time = new Date(x.time).toISOString()
        gameList.push({'unit0':x.unit0,'unit1':x.unit1,'startTime':time,'location':x.location})
      }
    }
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: `/api/v1/match/${this.$route.params.matchId}/round`,
        data: {
          // autoStrategy:strategy.strategyId,
          description:this.roundDescription,
          name:this.roundName,
          units:unitList,
          games:gameList
        }
      })
      // 对response做处理
      if (response.status === 200) {
        if(this.mode==='Edit'){
          await this.deleteRound()
        }
        this.$bvModal.msgBoxOk('创建轮次成功！', {
          title: 'Confirmation',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
            .then(value => {
              if(value===true){
                this.$router.push(`/matchDetail/${this.$route.params.matchId}`)
              }
            })
            .catch(err => {
              // An error occurred
            })


      }
      else
      {
        this.$message.error(JSON.stringify(response))
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data))
    }
  }

  async deleteRound(){
    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'delete',
        url: `/api/v1/match/${this.$route.params.matchId}/round/${(this.$route.params.roundId)}`
      })
      // 对response做处理
      if (response.status === 200) {

      }
      else
      {
        this.$message.error(response.data)
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }


  async mounted(){
    if('roundId' in this.$route.params){
      this.mode='Edit'
    }
    else{
      this.mode='Create'
    }
    await this.getRoundStrategyOptions()
    await this.getUserInfo()
    await this.getTeamsList()
    if(this.mode==='Edit'){
      await this.getRoundInfo()
    }
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
