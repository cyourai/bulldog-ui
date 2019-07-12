<template>
  <div class="checkApp-container">
    <x-header :left-options="{showBack: false}" :title="$t('maintenance.checkApp')"></x-header>
    <div class="checkApp-body">
      <group label-width="5em" label-margin-right="2em" label-align="left">
        <uploaders
          :max=3
          :images="images"
          :show-header="true"
          :readonly="false"
          :title="title"
          :upload-url="uploadUrl"
          name="checkAppAvatar"
          :handle-click="false"
          :autoUpload="true"
          size="normal">
        </uploaders>
        <datetime required v-model="formData.checkAppTime" format="YYYY-MM-DD HH:mm" title="巡检时间"></datetime>
        <popup-picker title="巡检人" :data="optionsUser" v-model="user" value-text-align="right"></popup-picker>
        <popup-picker title="巡检结果" :data="optionsResult" v-model="result" value-text-align="right"></popup-picker>
        <x-textarea title="解决方案" v-model="formData.checkAppSolution" name="checkAppSolution" :max="100"></x-textarea>
        <x-textarea title="备注" v-model="formData.checkAppRemark" name="checkAppRemark" :max="100"></x-textarea>
        <x-button @click.native="handlerSubmit" type="primary" :disabled="disable">提交巡检结果</x-button>
      </group>
    </div>
  </div>
</template>

<script>
  import { XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule } from 'vux'
  import { insert } from '@/api/human/signin'
  import { isNotEmpty, getTodayTime } from '@/utils'
  import Uploaders from 'vux-uploads'

  export default {
    components: {
      XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule,
      Uploaders
    },
    data() {
      return {
        disable: false,
        title: '上传巡检截图（最多3张）',
        result: ['正常'],
        optionsResult: [['正常', '异常']],
        user: ['张磊'],
        optionsUser: [['张磊', '唐亮', '张力山', '高铖']],
        // 表单数据
        formData: {
          // 序号
          checkAppId: null,
          // 巡检编号
          checkAppCode: null,
          // 巡检结果
          checkAppResult: 1,
          // 巡检人
          checkAppUser: null,
          // 巡检时间
          checkAppTime: getTodayTime(),
          // 解决方案
          checkAppSolution: '',
          // 备注
          checkAppRemark: ''
        },
        images: [],
        uploadUrl: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX + '/general/upload/uploadImgToNginx',
        // alert content
        content: ''
      }
    },
    methods: {
      handlerSubmit() {
        if (this.images != null && this.images.length === 1 && isNotEmpty(this.images[0].id)) {
          this.formData.checkAppAvatar = this.images[0].id
        }
        this.formData.checkAppResult = this.result[0] === '正常' ? 1 : 0
        // 新增
        this.disable = true
        insert(this.formData)
          .then(result => {
            if (result.data.status === 20000) {
              AlertModule.show({
                content: '巡检单保存成功'
              })
            } else {
              AlertModule.show({
                content: result.data.message
              })
            }
          })
          .catch((e) => {
            console.error(e)
            AlertModule.show({
              content: '巡检单保存失败'
            })
          }).finally(() => {
            this.disable = false
          })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .checkApp-container /deep/ {
    padding: 1px;
    .weui-cells {
      margin: 0px !important;
    }
    .weui-btn_primary {
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      width: 96%;
    }

  }
</style>
