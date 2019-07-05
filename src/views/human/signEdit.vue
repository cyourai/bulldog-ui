<template>
  <div>
  <el-container class="el-info" v-loading="loading">
    <el-aside v-show="!loading">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <img v-if="formData.humanAvatar!=='' && formData.humanAvatar!==undefined"
                 :src="formData.humanAvatar">
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <span class="mobile black">{{formData.humanMobile}}</span>
          </div>
        </el-col>
      </el-row>
      <el-radio-group v-model="formData.humanStatus" @change="statusChange">
        <el-radio-button :label="0">待定</el-radio-button>
        <el-radio-button :label="1">已签约</el-radio-button>
        <el-radio-button :label="2">不符合</el-radio-button>
      </el-radio-group>
    </el-aside>
    <el-main>
      <table class="table">
        <tr class="tr">
          <td class="first-col">用户ID</td>
          <td class="second-col">{{formData.humanId}}</td>
          <td class="third-col">毕业院校</td>
          <td class="fourth-col">{{formData.humanSchool}}</td>
        </tr>
        <tr class="tr">
          <td class="first-col">姓名</td>
          <td class="second-col">{{formData.humanName}}</td>
          <td class="third-col">专业</td>
          <td class="fourth-col">{{formData.humanMajor}}</td>
        </tr>
        <tr class="tr">
          <td class="first-col">性别</td>
          <td class="second-col">{{sexual[0]}}</td>
          <td class="third-col">求职意向</td>
          <td class="fourth-col">{{formData.humanIntension}}</td>
        </tr>
        <tr class="tr">
          <td class="first-col">出生日期</td>
          <td class="second-col">{{formData.humanBirthday}}</td>
          <td class="third-col">投递简历时间</td>
          <td class="fourth-col">{{formData.createTime}}</td>
        <tr>
          <td class="first-col">户口所在城市</td>
          <td class="second-col">{{formData.humanResidence}}</td>
          <td class="third-col">用户来源</td>
          <td class="fourth-col">{{come[0]}}</td>
        </tr>
      </table>
    </el-main>
  </el-container>

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
               is-type="china-name" text-="left"></x-input>
      <popup-picker title="性别" :data="optionsSexual" v-model="sexual" value-text-align="right"></popup-picker>
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
      <popup-picker title="用户来源" :data="optionsCome" v-model="come" value-text-align="right">{{come[0]}}</popup-picker>

      <x-textarea title="备注" v-model="formData.remark" name="remark" :max="100"></x-textarea>

      <el-row class="form-content-submit" style="margin-bottom: 22px;">
        <el-col :span="18"
                :offset="5"
                class="form-submit">
            <el-button type="warning"
                       icon="el-icon-close"
                       @click="close"> 关 闭
            </el-button>
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="handlerSubmit"> 更 新
            </el-button>
        </el-col>
      </el-row>
    </group>
  </div>
  </div>
</template>

<script>
  import { getByCode } from '@/api/human'
  import { params, isEmpty, isNotEmpty } from '@/utils'
  import { update } from '@/api/human/signin'
  import { XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule } from 'vux'
  import Uploaders from 'vux-uploads'
  export default {
    components: {
      XHeader, XInput, Group, XButton, Cell, PopupPicker, Datetime, XTextarea, AlertModule,
      Uploaders
    },
    data() {
      return {
        code: '',
        loading: false,
        disable: false,
        sexual: ['男'],
        optionsSexual: [['男', '女']],
        come: ['校招'],
        optionsCome: [['校招', '社招', '其他']],
        images: [],
        uploadUrl: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX + '/general/upload/uploadImgToNginx',
        title: '如需修改应聘人员头像或用户信息，上传完毕点击更新后生效',
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
          humanBirthday: null,
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
          remark: '',
          createTime: null,
          humanCome: null
        }
      }
    },
    created() {
      // 页面初始化
      this.code = params(this, 'humanCode')
      this.init()
    },
    methods: {
      init() {
        this.loading = true
        getByCode(this.code).then(result => {
          this.formData = result.data
          if (this.formData.humanSexual === 1) this.sexual[0] = '女'
          if (isNotEmpty(this.formData.humanCome)) this.come[0] = this.formData.humanCome
          this.loading = false
        }).catch((e) => {
        }).finally(() => {
          this.loading = false
        })
      },
      close() {
        // 关闭
        this.$router.push({
          path: '/human/signList'
        })
      },
      statusChange(val) {
        const data = {}
        data.humanCode = this.code
        data.humanStatus = val
        this.formData.humanStatus = val
        update(data)
          .then(result => {
            if (result.data.status === 20002) {
              AlertModule.show({
                content: '应聘人员状态更新成功'
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
              content: '更新失败'
            })
          }).finally(() => {
            this.disable = false
          })
      },
      handlerSubmit() {
        if (this.images != null && this.images.length === 1 && isNotEmpty(this.images[0].id)) {
          this.formData.humanAvatar = this.images[0].id
        }
        this.formData.humanSexual = this.sexual[0] === '男' ? 0 : 1
        this.formData.humanCome = this.come[0]
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
        this.disable = true
        update(this.formData)
          .then(result => {
            if (result.data.status === 20000) {
              AlertModule.show({
                content: '简历更新成功'
              })
              window.location.reload()
            } else {
              AlertModule.show({
                content: result.data.message
              })
            }
          })
          .catch((e) => {
            console.error(e)
            AlertModule.show({
              content: '更新失败'
            })
          }).finally(() => {
            this.disable = false
          })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  @import '~@/styles/variables.scss';
  .el-info /deep/ {
    margin: 20px 30px 30px 30px;
    height: 250px;
    border: 1px solid #bbb;

    .el-aside {
      overflow: hidden;
      width: 40%;
      border-right: 1px solid #bbb;
      padding: 20px 20px 0px 20px;
      img {
        width: 120px !important;
        height: 120px!important;
        margin-left: 65px;
      }
      .mobile {
        margin-left: 60px;
      }
      .el-row {
        margin-bottom: 20px;
      }
      .mobile {
        font-size: 20px;
      }
      .status {
        margin-left: 30px
      }
    }

    .el-main {
      overflow: hidden;
      padding: 0px;
      .table {
        width: 100%;
        height: 100%;
        border-collapse:collapse;
        border:none;
      }
      .table {
        .first-col {
          width: 15%;
          border-bottom:solid #bbb 1px;
          border-right:solid #bbb 1px;
          padding-right: 20px;
          text-align: right;
        }
        .second-col {
          width: 35%;
          border-bottom:solid #bbb 1px;
          border-right:solid #bbb 1px;
          padding-left: 20px;
          text-align: left;
          background: #ffffff;
        }
        .third-col {
          width: 15%;
          border-bottom:solid #bbb 1px;
          border-right:solid #bbb 1px;
          padding-right: 20px;
          text-align: right;
        }
        .fourth-col {
          width: 35%;
          border-bottom:solid #bbb 1px;
          padding-left: 20px;
          text-align: left;
          background: #ffffff;
        }
      }

    }
  }
  .human-body /deep/ {
    .weui-btn_primary {
      background-color:#35495e !important;
    }
  }
</style>
