<template>
  <div class="checkApp-container" v-loading="loading">
    <!-- 巡检内容区 -->
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
          @success="onSuccessHandler"
          size="normal">
        </uploaders>
        <datetime required v-model="formData.checkAppTime" format="YYYY-MM-DD HH:mm" title="巡检时间"></datetime>
        <popup-picker ref="checkUserPicker"
                      title="巡检人"
                      :data="optionsUser"
                      :value="user"
                      value-text-align="right"
                      @on-change="optionsUserChangeHandler">
        </popup-picker>
        <popup-picker title="巡检结果" :data="optionsResult" v-model="result" value-text-align="right"></popup-picker>
        <x-textarea title="解决方案" v-model="formData.checkAppSolution" name="checkAppSolution" :max="100"></x-textarea>
        <x-textarea title="备注" v-model="formData.checkAppRemark" name="checkAppRemark" :max="100"></x-textarea>
        <x-button @click.native="handlerSubmit" type="primary" :disabled="disable">提交巡检结果</x-button>
        <x-button @click.native="imageHandler" type="primary" :disabled="disable" v-if="false">保存截图</x-button>
      </group>
    </div>
  </div>
</template>

<script>
  import { XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule, XDialog } from 'vux'
  import { selectUserListByOrgName } from '@/api/user'
  import { insert, isNotEmpty, getTodayTime } from '@/utils'
  import Uploaders from 'vux-uploads'

  export default {
    name: 'checkApp',
    components: {
      XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule, XDialog,
      Uploaders
    },
    data() {
      return {
        loading: true,
        disable: false,
        isDialogShow: false,
        title: '上传巡检截图（最多3张）',
        result: ['正常'],
        optionsResult: [['正常', '异常']],
        user: ['张磊'],
        optionsUser: [[{ value: 'zhanglei', name: '张磊' }]],
        // 表单数据
        formData: {
          // 序号
          checkAppId: null,
          // 巡检编号
          checkAppCode: null,
          checkAppEvidence1: null,
          checkAppEvidence2: null,
          checkAppEvidence3: null,
          // 巡检结果
          checkAppResult: 1,
          // 巡检人
          checkAppUser: 'zhanglei',
          // 巡检时间
          checkAppTime: getTodayTime(),
          // 解决方案
          checkAppSolution: '',
          // 备注
          checkAppRemark: ''
        },
        checkAppInsert: '/maintenance/checkApp/insert',
        images: [],
        uploadUrl: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX + '/general/upload/uploadImgToNginx'
      }
    },
    created() {
      this.init()
    },
    watch: {
      images(images) {
        if (isNotEmpty(images[0])) this.formData.checkAppEvidence1 = images[0].id
        if (isNotEmpty(images[1])) this.formData.checkAppEvidence2 = images[1].id
        if (isNotEmpty(images[2])) this.formData.checkAppEvidence3 = images[2].id
      }
    },
    methods: {
      init() {
        selectUserListByOrgName('运维组')
          .then(result => {
            const userArray = []
            for (const i in result.data) {
              userArray[i] = { name: result.data[i].userNickName, value: result.data[i].userName }
            }
            this.optionsUser = [userArray]
          }).finally(() => {
            this.loading = false
          })
      },
      handlerSubmit() {
        this.formData.checkAppResult = this.result[0] === '正常' ? 1 : 0
        // 新增
        this.disable = true
        insert(this.checkAppInsert, this.formData)
          .then(result => {
            const checkApp = result.data.checkApp
            if (result.data.status.toString().indexOf('2000') === 0) {
              this.imageHandler(checkApp.checkAppCode)
            } else {
              AlertModule.show({
                content: result.data.message
              })
            }
          })
          .catch((e) => {
            // console.error(e)
            AlertModule.show({
              content: '巡检单保存失败'
            })
          }).finally(() => {
            this.disable = false
          })
      },
      imageHandler(checkAppCode) {
        this.$router.push({
          path: `/checkAppPicture/${checkAppCode}`
        })
      },
      optionsUserChangeHandler(value) {
        const name = this.$refs.checkUserPicker.getNameValues(value)
        if (name !== '') {
          this.user[0] = name
          this.formData.checkAppUser = value[0]
        }
      },
      onSuccessHandler() {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .checkApp-container /deep/ {
    padding: 1px;
    .weui-cells {
      margin: 0px !important;
      font-weight: bold !important;
    }
    .weui-btn_primary {
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      width: 96%;
    }
    .screen-shot {
      margin-top: 20%;
      img {width: 300px; height: 150px}
    }
  }
</style>
