<template>
  <div>
  <Navigation :username="user.username"></Navigation>
  <div id="container">
  <a-form-model id="entire-form"
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
  >
    <a-form-model-item prop="name" label="赛事名称">
      <a-input v-model="form.name"/>
    </a-form-model-item>
    <a-form-model-item prop="startDate" label="赛事开始时间">
      <a-date-picker
          v-model="form.startDate"
          show-time
          type="date"
          placeholder="选择赛事开始时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item prop="endDate" label="赛事结束时间">
      <a-date-picker
          v-model="form.endDate"
          show-time
          type="date"
          placeholder="选择赛事结束时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item prop="targetGroup" label="面向人群">
      <a-input v-model="form.targetGroup"
      />
    </a-form-model-item>
    <a-form-model-item default-value="basketball" prop="matchtypeId" label="赛事类型">
      <a-select v-model="form.matchtypeId" placeholder="请选择赛事类型">
        <a-select-option value="basketball">
          篮球
        </a-select-option>
        <!--<a-select-option value="soccerball">
          足球
        </a-select-option>-->
        <a-select-option value="tennis">
          网球
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item prop="description" label="赛事简介">
      <a-input v-model="form.description"
               placeholder="输入赛事描述"
               type="textarea"
      />
    </a-form-model-item>
    <a-form-model-item prop="publicRestriction" label="赛事开放限制">
      <a-radio-group :options="options" :default-value="0" v-model="form.publicRestriction" />
    </a-form-model-item>
    <a-form-model-item prop="matchRuleType" label="赛制">
      <a-radio-group :options="[{ label: '个人赛', value: 0 },{ label: '团体赛', value: 1 },]"
                     :default-value="0" v-model="form.matchRuleType" />
    </a-form-model-item>
    <a-form-model-item v-if="form.matchRuleType" prop="minTeamMember" label="队伍最小人数">
      <a-input-number :min="1" :precision="0" v-model="form.minTeamMember"/>
    </a-form-model-item>
    <a-form-model-item v-if="form.matchRuleType" prop="maxTeamMember" label="队伍最大人数">
      <a-input-number :min="form.minTeamMember" :precision="0" v-model="form.maxTeamMember"/>
    </a-form-model-item>
    <a-form-model-item label="上传赛事照片">
      <PictureUpload @event="updateFile"></PictureUpload>
    </a-form-model-item>
    <a-form-model-item>
      <a-button style="float:right">
        取消
      </a-button>
      <a-button id="submit-button" type="primary" @click="onSubmit" style="float:right">
        提交
      </a-button>
    </a-form-model-item>
  </a-form-model>
  </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";
import PictureUpload from "@/components/PictureUpload.vue";

@Component({
  components:{
    Navigation, PictureUpload
  }
})

export default class CreateMatch extends Vue {
  uploadParamObj: {token?: string, key?: string} = {}

  updateFile(item){
    this.uploadParamObj = item
  }

  labelCol = { span: 4 }
  wrapperCol = { span: 20 }

  user = {
    username: ''
  }

  form = {
    name: '',
    // region: '',
    startDate: undefined,
    endDate: undefined,
    targetGroup: '',
    matchtypeId: '',
    matchRuleType: 0,
    description: '',
    publicRestriction: 0,
    publicSignUp: false,
    publicShow: false,
    maxTeamMember: 1,
    minTeamMember: 1,
  }

  options = [
    { label: '赛事公开，允许自由报名', value: 0 },
    { label: '赛事不公开，允许自由报名', value: 1 },
    { label: '赛事不公开，不允许自由报名', value: 2 },
  ];

  rules = {
    name: [
      { required: true, message: 'Please input Activity name'},
      { min: 3, max: 30, message: 'Length should be 3 to 30'},
    ],
    targetGroup: [
      { required: true, message: 'Please input TargetGroup'},
      { min: 1, max: 100, message: 'Length should be 1 to 100'},
    ],
    description: [
      { required: true, message: 'Please input Match description'},
      { min: 1, max: 500, message: 'Length should be 1 to 500'},
    ],
    matchtypeId: [
      {
        required: true,
      },
    ],
    publicRestriction: [
      {
        required: true,
      },
    ],
    matchRuleType: [
      {
        required: true,
      },
    ],
    maxTeamMember: [
      {
        required: true,
      },
    ],
    minTeamMember: [
      {
        required: true,
      },
    ],
  }

  onSubmit() {
    //@ts-ignore
    this.$refs.ruleForm.validate(valid => {
      console.log(valid);
      if (valid) {
        this.createMatch();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  async createMatch() {
    if(this.form.publicRestriction === 0)
    {
      this.form.publicSignUp = true
      this.form.publicShow = true
    }
    else if(this.form.publicRestriction === 1)
    {
      this.form.publicSignUp = true
      this.form.publicShow = false
    }
    else
    {
      this.form.publicSignUp = false
      this.form.publicShow = false
    }

    try {
      axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
      let response = await axios({
        method: 'post',
        url: '/api/v1/match',
        data: {
          name: this.form.name,
          //"startTime":this.form.startDate,
          //"endTime":this.form.endDate,
          description: this.form.description,
          targetGroup: this.form.targetGroup,
          matchTypeId: this.form.matchtypeId,
          publicShowUp: this.form.publicShow,
          publicSignUp: this.form.publicSignUp,
          minUnitMember: this.form.minTeamMember,
          maxUnitMember: this.form.maxTeamMember,
          previewLarge: this.uploadParamObj.key,
        }
      })
      // 对response做处理
      if (response.status === 200) {
        this.$message.success('create match success!')
        this.$router.push('/home')
        // 在此处弹出提示 注册成功
      }
      else
      {
        // 输出错误提示
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
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
    this.getUserInfo()
  }

}
</script>


<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#entire-form {
  margin-top: 16px;
  max-width: 960px;
  box-sizing: border-box;
  margin-left: 16px;
  margin-right: 16px;
}

#submit-button {
  margin-right: 5%;
}

</style>