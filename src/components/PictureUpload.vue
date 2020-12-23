<template>
  <div class="clearfix">
    <a-upload
        action="https://upload-z1.qiniup.com"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
        :before-upload="beforeUpload"
        :data="uploadParamObj"
    >
      <div v-if="!fileList.length">
        <div v-if="pictureType === 'MATCH_PREVIEW'">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            点击上传图片
          </div>
        </div>
        <div v-if="pictureType === 'AVATAR'">
          <img id="avatar" v-if="imageUrl" :src="imageUrl" alt="qwq">
          <div v-else>
            <a-icon type="plus" />
            <div class="ant-upload-text">
              点击上传图片
            </div>
          </div>
        </div>
      </div>

    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  components:{
  }
})



export default class PictureUpload extends Vue{
  @Prop({type:String, default:function (){return ""}})pictureType
  @Prop({type:String, default:function (){return ""}})imageUrl

  fileList = []
  previewVisible = false
  previewImage = ''


  uploadParamObj: {token?: string, key?: string} = {}
  async beforeUpload(file) {
    try {
      let index = file.name.lastIndexOf('.')
      if (index === -1 || index === file.name.length - 1)
      {
        // 上传的不是图片 处理报错信息
        this.$message.error("File type is not picture")
        return
      }
      let suffix = file.name.substr(index + 1)
      if (suffix !== 'jpg' && suffix !== 'png' && suffix !== 'bmp' && suffix !== 'jpeg'
        && suffix !== 'gif' && suffix !== 'webp')
      {
        // 上传的不是图片 处理报错信息
        this.$message.error("File type is not picture")
        return
      }
      let response = await axios({
        method: 'post',
        url: '/api/v1/upload',
        params: {
          uploadType: this.pictureType
        },
        data: {
          suffix: suffix,
          uploadType: this.pictureType
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
      this.uploadParamObj = {
        token: response.data.uploadToken,
        key: response.data.key
      }
      console.log(this.getBase64(file))
      if(this.pictureType === 'MATCH_PREVIEW')
      {
        this.$emit('event', this.uploadParamObj)
      }
      else if(this.pictureType === 'AVATAR')
      {
        await this.uploadAvatar()
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
      this.$message.error('图片上传出现问题，请删除后再试')
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

  async uploadAvatar(){
    axios.defaults.headers.common["Authorization"] = window.localStorage.getItem('jwt')
    try {
      let response = await axios({
        method: 'post',
        url: `/api/v1/user/info`,
        data: {
          avatar: this.uploadParamObj.key
        }
      })
      // 对response做处理
      if (response.status !== 200) {
        throw {response}
      }
    } catch (e) {
      this.$message.error(JSON.stringify(e.response.data.message))
    }
  }



}
</script>

<style scoped>
#avatar {
  width: 86px;
  height: 86px;
}
</style>
