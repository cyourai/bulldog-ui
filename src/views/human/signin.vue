<template>
  <div class="human-container">
    <x-header :left-options="{showBack: false}" :title="$t('human.signInTitle')"></x-header>
    <div class="human-body">
      <group label-width="5em" label-margin-right="2em" label-align="right">
        <uploaders
          :max=1
          :images="images"
          :show-header="true"
          :readonly="false"
          :title="title"
          :upload-url="uploadUrl"
          name="humanAvatar"
          :handle-click="false"
          :autoUpload="true"
          size="small">
        </uploaders>
        <x-input required title="姓名" v-model="formData.humanName" name="humanName" placeholder="请输入姓名"
                 is-type="china-name"
                 text-="left"></x-input>
        <popup-picker title="性别" :data="optionsSexual" v-model="sexual"
                      value-text-align="right"></popup-picker>
        <x-input required title="手机号码" v-model="formData.humanMobile" name="humanMobile" placeholder="请输入手机号码"
                 keyboard="number"
                 is-type="china-mobile" text-align="left"></x-input>
        <x-input required title="邮箱" v-model="formData.humanEmail" name="humanEmail" placeholder="请输入邮箱地址" is-type="email"
                 text-align="left"></x-input>
        <datetime required v-model="formData.humanBirthday" title="生日"></datetime>
        <x-input required title="户口所在地" v-model="formData.humanResidence" name="humanResidence"
                 placeholder="请输入您户口所在地" text-align="left"></x-input>
        <x-input required title="毕业学校" v-model="formData.humanSchool" name="humanSchool"
                 placeholder="请输入您的毕业学校" text-align="left"></x-input>
        <x-input required title="专业" v-model="formData.humanMajor" name="humanMajor"
                 placeholder="请输入您的专业" text-align="left"></x-input>
        <x-input required title="求职意向" v-model="formData.humanIntension" name="humanIntension"
                 placeholder="请填写您的求职意向" text-align="left"></x-input>
        <x-input title="职称" v-model="formData.humanTitle" name="humanTitle"
                 placeholder="请填写您的职称" text-align="left"></x-input>
        <x-input title="医院" v-model="formData.humanHospital" name="humanHospital"
                 placeholder="请填写您所在的医院" text-align="left"></x-input>
        <x-textarea title="备注" v-model="formData.remark" name="remark" :max="100"></x-textarea>
        <x-button @click.native="handlerSubmit" type="primary" :disabled="disable">投递简历</x-button>
      </group>
    </div>
  </div>
</template>

<script>
import { XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule } from 'vux'
import { insert } from '@/api/human/signin'
import { isNotEmpty, isEmpty } from '@/utils'
import Uploaders from 'vux-uploads'

export default {
  components: {
    XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule,
    Uploaders
  },
  data() {
    return {
      disable: false,
      // 表单数据
      formData: {
        // 序号
        humanId: null,
        // 用户编号
        humanCode: null,
        // 姓名
        humanName: null,
        // 邮件
        humanEmail: null,
        // 生日
        humanBirthday: this.getToday(),
        // 头像路径
        humanAvatar: null,
        // 手机
        humanMobile: null,
        // qq
        humanQq: null,
        // 微信号
        humanWechat: null,
        // 户口所在地
        humanResidence: null,
        // 毕业学校
        humanSchool: null,
        // 专业
        humanMajor: null,
        // 求职意向
        humanIntension: null,
        // 职称
        humanTitle: null,
        // 医院
        humanHospital: null,
        // 性别
        humanSexual: null,
        // 状态 0:待定 1:已签约 2:不符合
        humanStatus: 0,
        // 备注
        remark: ''
      },
      sexual: ['男'],
      optionsSexual: [['男', '女']],
      title: '上传头像',
      images: [],
      uploadUrl: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX + '/general/upload/uploadImgToNginx',
      // alert content
      content: ''
    }
  },
  methods: {
    getToday() {
      const now = new Date()
      let cmonth = now.getMonth() + 1
      let day = now.getDate()
      if (cmonth < 10) cmonth = '0' + cmonth
      if (day < 10) day = '0' + day
      return now.getFullYear() + '-' + cmonth + '-' + day
    },
    handlerSubmit() {
      if (this.images != null && this.images.length === 1 && isNotEmpty(this.images[0].id)) {
        this.formData.humanAvatar = this.images[0].id
      }
      this.formData.humanSexual = this.sexual[0] === '男' ? 0 : 1
      if (isEmpty(this.formData.humanName)) {
        AlertModule.show({
          content: '请填写姓名'
        })
        document.getElementsByName('humanName')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanEmail)) {
        AlertModule.show({
          content: '请填写邮件'
        })
        document.getElementsByName('humanEmail')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanMobile)) {
        AlertModule.show({
          content: '请填写手机'
        })
        document.getElementsByName('humanMobile')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanResidence)) {
        AlertModule.show({
          content: '请填写户口'
        })
        document.getElementsByName('humanResidence')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanSchool)) {
        AlertModule.show({
          content: '请填写毕业学校'
        })
        document.getElementsByName('humanSchool')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanMajor)) {
        AlertModule.show({
          content: '请填写专业名称'
        })
        document.getElementsByName('humanMajor')[0].focus()
        return
      }
      if (isEmpty(this.formData.humanIntension)) {
        AlertModule.show({
          content: '请填写应聘岗位'
        })
        document.getElementsByName('humanIntension')[0].focus()
        return
      }

      // 新增
      this.disable = true
      insert(this.formData)
        .then(result => {
          if (result.data.status === 20000) {
            AlertModule.show({
              content: '职位投递成功'
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
            content: '投递失败'
          })
        }).finally(() => {
          this.disable = false
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .human-body /deep/ {
    .weui-btn_primary {
      background-color:#35495e !important;
    }
  }
</style>
