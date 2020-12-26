<template>
<div>
  <b-alert :show="alertShow" variant="warning">这支队伍已在选择列表中。</b-alert>
  <b-form-group  id="input-group-2" :label="label[type]" label-for="input-2">
    <b-form-input
        class="input-2"
        v-model="teamSearchKey"
        @input="onChange"
        placeholder="请输入查找的队伍名"
    ></b-form-input>
    <b-list-group  id="list" class="wrapper" v-if="showTeamList">
      <b-list-group-item @click="chooseTeam(item)" class="d-flex align-items-center" v-for="(item,index) in  searchTeamList ">
        <b-avatar variant="success" icon="people-fill" class="mr-3"></b-avatar>
        <span class="mr-auto">{{item.name}}</span>
        <b-badge variant="info">{{item.unitId}}</b-badge>
      </b-list-group-item>
    </b-list-group>
  </b-form-group>
  <h4><b-badge style="margin-top: 20px" variant="success">选择队伍列表</b-badge></h4>
  <b-table  class="table" hover :items="teamItems" :fields="teamFields">
    <template #cell(name)="row">
      <a class="teamDetail" @click="gotoTeamDetail(row)">{{ row.item.name }}</a>
    </template>
    <template #cell(action)="row">
      <b-button @click="removeTeam(row)" variant="danger" size="sm">remove</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class SearchTeam extends Vue{
  @Prop({type:String,default:function (){return ''}})type
  @Prop({type:Array, default:function (){return []}})teamsList
  @Prop({type:Array,default:function (){return []}})teamItems
  teamFields = ['name', 'creator', 'description','action']
  teamSearchKey=''
  showTeamList=false
  alertShow=false
  label={'normal':"添加参加本轮次比赛的队伍",'modal':"从已选择的列表中进一步选择两支队伍"}

  onChange(){
    this.showTeamList=true
  }

  hideList(){
    this.showTeamList=false
  }

  gotoTeamDetail(row){
    window.open(`/#/teamDetail/${row.item.id}`, '_blank');
  }

  chooseTeam(item){
    let team={}
    let id = ''
    if(this.type==="normal"){
      id = item.unitId
    }
    else if(this.type==="modal"){
      id = item.id
    }
    for( let x of this.teamItems){
      if(x.id===item.unitId){
        this.alertShow=true
        this.hideList()
        return;
      }
    }
    this.alertShow=false
    team['id']=item.id
    team['name']=item.name
    team['creator']=item.creator
    team['description']=item.description
    this.teamItems.push(team)
    this.hideList()
  }

  removeTeam(row){
    let index = this.teamItems.findIndex(x=>x.id===row.item.id)
    this.teamItems.splice(index,1)
    this.$emit("changeSelectedTeams",this.teamItems)
  }

  get searchTeamList(){
    let list = this.teamsList.filter((teams) => {
      return teams.name.match(this.teamSearchKey)
    })
    if(list.length>5){
      return list.slice(0,5)
    }
    return list
  }
}
</script>

<style scoped>

</style>
