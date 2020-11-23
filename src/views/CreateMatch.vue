<template>
  <div>
  <Navigation></Navigation>
  <a-form-model id="entire-form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="赛事名称" required="true">
      <a-input v-model="form.name" placeholder=""/>
    </a-form-model-item>
    <!--<a-form-model-item label="赛事地点" required="true">
      <a-select v-model="form.region" placeholder="请选择赛事地点">
        <a-select-option value="zicao">
          紫操
        </a-select-option>
        <a-select-option value="dongcao">
          东操
        </a-select-option>
        <a-select-option value="xicao">
          西操
        </a-select-option>
        <a-select-option value="beicao">
          北操
        </a-select-option>
      </a-select>
    </a-form-model-item>-->
    <a-form-model-item label="赛事开始时间">
      <a-date-picker
          v-model="form.startDate"
          show-time
          type="date"
          placeholder="选择赛事开始时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="赛事结束时间">
      <a-date-picker
          v-model="form.endDate"
          show-time
          type="date"
          placeholder="选择赛事结束时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="面向人群" required="true">
      <a-input v-model="form.targetGroup" placeholder="请描述你服务的客户，内部客户直接 @姓名 / 工号"/>
    </a-form-model-item>
    <a-form-model-item label="赛事类型" required="true">
      <a-select v-model="form.matchtypeId" placeholder="请选择赛事类型">
        <a-select-option value="basketball">
          篮球
        </a-select-option>
        <a-select-option value="soccerball">
          足球
        </a-select-option>
        <a-select-option value="tennis">
          网球
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="赛事简介">
      <a-input v-model="form.description" placeholder="输入赛事描述" type="textarea" />
    </a-form-model-item>
    <a-form-model-item label="赛事开放限制" required="true">
      <a-radio-group :options="options" :default-value="0" v-model="publicRestriction" />
    </a-form-model-item>
    <!--<a-form-model-item label="允许赛事公开" required="true">
      <a-radio-group v-model="form.public">
        <a-radio value="true">
          是
        </a-radio>
        <a-radio value="false">
          否
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="允许自由报名" required="true">
      <a-radio-group v-model="form.publicSignUp">
        <a-radio value="1">
          是
        </a-radio>
        <a-radio value="0">
          否
        </a-radio>
      </a-radio-group>
    </a-form-model-item>-->

    <a-form-model-item label="上传赛事照片">
      <a-upload-dragger
          name="file"
          :multiple="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          点击或拖拽图片文件到此处上传
        </p>
      </a-upload-dragger>
    </a-form-model-item>
    <a-form-model-item>
      <a-button style="float:right">
        取消
      </a-button>
      <a-button id="submit-button" type="primary" @click="createMatch" style="float:right">
        提交
      </a-button>
    </a-form-model-item>
  </a-form-model>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import Navigation from "@/components/Navigation.vue";

@Component({
  components:{
    Navigation
  }
})

export default class CreateMatch extends Vue {
  labelCol = { span: 4 }
  wrapperCol = { span: 10 }
  publicRestriction = 0
  form = {
    name: '',
    // region: '',
    startDate: undefined,
    endDate: undefined,
    targetGroup: '',
    matchtypeId: '',
    description: '',
    publicSignUp: false,
    publicShow: false
  }

  options = [
    { label: '赛事公开，允许自由报名', value: 0 },
    { label: '赛事不公开，允许自由报名', value: 1 },
    { label: '赛事不公开，不允许自由报名', value: 2 },
  ];

  async createMatch() {
    if(this.publicRestriction === 0)
    {
      this.form.publicSignUp = true
      this.form.publicShow = true
    }
    else if(this.publicRestriction === 1)
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
          "name": this.form.name,
          //"startTime":this.form.startDate,
          //"endTime":this.form.endDate,
          "description": this.form.description,
          "targetGroup": this.form.targetGroup,
          "matchTypeId": this.form.matchtypeId,
          //"publicShow": this.form.publicShow,
          "publicSignUp": this.form.publicSignUp
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

}
</script>


<style scoped>
#entire-form {
  margin-top: 2%;
  width: 80%;
  margin-left: 20%;
}

#submit-button {
  margin-right: 5%;
}

</style>