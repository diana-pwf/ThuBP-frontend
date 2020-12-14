<template>
  <div class="clearfix">
    <a-upload-dragger
        action="https://upload-z1.qiniup.com"
        list-type="picture-card"
        :multiple="false"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
        :before-upload="beforeUpload"
        :data="uploadParamObj"
    >
      <div v-if="!fileList.length">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          点击或拖拽上传图片
        </div>
      </div>
    </a-upload-dragger>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';

@Component({
  components:{
  }
})

export default class PictureUpload extends Vue{
  fileList = []
  previewVisible = false
  previewImage = ''

  uploadParamObj: {token?: string, key?: string} = {}

  async beforeUpload(file) {
    try {
      console.log("qwq")
      console.log(file)
      let response = await axios({
        method: 'post',
        url: '/api/v1/upload',
        params: {
          uploadType: "MATCH_PREVIEW"
        },
        data: {
          // 后缀暂时先写死
          suffix: "jpg",
          uploadType: "MATCH_PREVIEW"
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      console.log('qwq')
      console.log(response.data)
      this.uploadParamObj = {
        token: response.data.uploadToken,
        key: response.data.key
      }
      this.$emit('event', this.uploadParamObj)
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.error))
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async handlePreview(file){
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  handleChange({ fileList }){
    this.fileList = fileList
  }

  handleCancel(){
    this.previewVisible = false;
  }

}
</script>

<style scoped>

</style>