<template>
  <div>
  <Navigation></Navigation>
  <a-form-model id="entire-form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="赛事名称" required="true">
      <a-input v-model="form.name" placeholder=""/>
    </a-form-model-item>
    <a-form-model-item label="赛事地点" required="true">
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
    </a-form-model-item>
    <a-form-model-item label="赛事开始时间" required="true">
      <a-date-picker
          v-model="form.startDate"
          show-time
          type="date"
          placeholder="选择赛事开始时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="赛事结束时间" required="true">
      <a-date-picker
          v-model="form.endDate"
          show-time
          type="date"
          placeholder="选择赛事结束时间"
          style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="面向人群" required="true">
      <a-input v-model="form.crowd" placeholder="请描述你服务的客户，内部客户直接 @姓名 / 工号"/>
    </a-form-model-item>
    <a-form-model-item label="赛事类型" required="true">
      <a-select v-model="form.type" placeholder="请选择赛事类型">
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
    <a-form-model-item label="允许自由报名" required="true">
      <a-radio-group v-model="form.freeSignUp">
        <a-radio value="1">
          是
        </a-radio>
        <a-radio value="0">
          否
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="允许比赛公开" required="true">
      <a-radio-group v-model="form.public">
        <a-radio value="1">
          是
        </a-radio>
        <a-radio value="0">
          否
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
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
      <a-button id="submit-button" type="primary" @click="onSubmit" style="float:right">
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
  form = {
    name: '',
    region: '',
    startDate: undefined,
    endDate: undefined,
    crowd: '',
    type: '',
    description: '',
    freeSignUp: false,
    public: false
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