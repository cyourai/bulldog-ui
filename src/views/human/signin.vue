<template>
  <div class="human-edit-container">
    <!-- <div class="container"> -->
    <!-- 页内容 -->
    <div class="content">
      <!-- 用户编辑 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('human.signInTitle')}}</p>
        <div class="content-spe-element">
          <!-- 表单 -->
          <div class="form-filter">

            <!-- 表单-header-->
            <div class="form-filter-header">
              <svg-icon icon-class="edit" />
            </div>

            <!-- 表单-form -->
            <el-collapse-transition>
              <div class="form-content">
                <el-form slot="form"
                         :model="formData"
                         :rules="formRules"
                         ref="formData"
                         label-width="80px"
                         label-position="right">
                  <el-row v-if=false>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="用户编号"
                                    prop="humanCode">
                        <el-input v-model="formData.humanCode"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label=""
                                    prop="humanAvatar">
                        <el-upload class="avatar-uploader"
                                   ref="upload"
                                   action=''
                                   :http-request="uploadHandler"
                                   :show-file-list='false'
                                   accept=".jpg,.png,.bmp">
                          <img v-if="formData.humanAvatar && formData.humanAvatar!==''"
                               :src="formData.humanAvatar"
                               class="avatar">
                          <i v-else
                             class="el-icon-plus avatar-uploader-icon"></i>
                          <div slot="tip"
                               class="avatar-uploader-tip">上传头像<br>图片仅限格式：jpg/png/bmp
                          </div>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="姓名"
                                    prop="humanName">
                        <el-input v-model="formData.humanName"
                                  placeholder="请填写您的称呼"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="17"
                            :offset="1">
                      <el-form-item label="性别"
                                    prop="humanSexual">
                        <el-radio v-model="formData.humanSexual" label="0">男</el-radio>
                        <el-radio v-model="formData.humanSexual" label="1">女</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="邮件"
                                    prop="humanEmail">
                        <el-input v-model="formData.humanEmail"
                                  placeholder="请填写您的邮件地址"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="生日"
                                    prop="humanBirthday">
                        <el-date-picker
                          v-model="formData.humanBirthday"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="手机"
                                    prop="humanMobile">
                        <el-input v-model="formData.humanMobile"
                                  placeholder="请填写您的手机"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="qq"
                                    prop="humanQq">
                        <el-input v-model="formData.humanQq"
                                  placeholder="请填写您的qq"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="微信号"
                                    prop="humanWechat">
                        <el-input v-model="formData.humanWechat"
                                  placeholder="请填写您的微信号"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>-->
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="户口地"
                                    prop="humanResidence">
                        <el-input v-model="formData.humanResidence"
                                  placeholder="请填写您户口所在地"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="毕业学校"
                                    prop="humanSchool">
                        <el-input v-model="formData.humanSchool"
                                  placeholder="请填写您的毕业学校"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="专业"
                                    prop="humanMajor">
                        <el-input v-model="formData.humanMajor"
                                  placeholder="请填写您所在的专业"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="求职意向"
                                    prop="humanIntension">
                        <el-input v-model="formData.humanIntension"
                                  placeholder="请填写您的求职意向"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="职称"
                                    prop="humanTitle">
                        <el-input v-model="formData.humanTitle"
                                  placeholder="请填写您职称"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16"
                            :offset="1">
                      <el-form-item label="医院"
                                    prop="humanHospital">
                        <el-input v-model="formData.humanHospital"
                                  placeholder="请填写您医院"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="22"
                            :offset="1">
                      <el-form-item label="备注"
                                    prop="remark">
                        <el-input v-model="formData.remark"
                                  type="textarea"
                                  :autosize="{ minRows: 5, maxRows: 10}"
                                  placeholder="备注"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="form-content-submit">
                    <el-col :span="18"
                            :offset="1"
                            class="form-submit">
                      <el-form-item>
                        <el-button type="primary"
                                   icon="el-icon-tickets"
                                   class="largeBtn"
                                   :disabled="disable"
                                   @click="submitForm()"> 投递职位
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-transition>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import ComponentForm from '@/components/ComponentForm'
  import { VueDialog, PicMagnify } from 'cyourai-vue-dialog'
  import { params } from '@/utils'
  import { insert } from '@/api/human'
  import { request } from '@/utils'
  export default {
    name: 'humanSignIn',
    components: {
      ComponentForm, VueDialog, PicMagnify
    },
    data() {
      return {
        visible: false,
        disable: false,
        // 是否编辑模式
        isEdit: false,
        // 表单数据
        formData: {
          // 序号
          humanId: '',
          // 用户编号
          humanCode: '',
          // 姓名
          humanName: '',
          // 邮件
          humanEmail: '',
          // 生日
          humanBirthday: '',
          // 头像路径
          humanAvatar: '',
          // 手机
          humanMobile: '',
          // qq
          humanQq: '',
          // 微信号
          humanWechat: '',
          // 户口所在地
          humanResidence: '',
          // 毕业学校
          humanSchool: '',
          // 专业
          humanMajor: '',
          // 求职意向
          humanIntension: '',
          // 职称
          humanTitle: '',
          // 医院
          humanHospital: '',
          // 性别 0:男 1:女
          humanSexual: '0',
          // 状态 0:待定 1:已签约 2:不符合
          humanStatus: 0,
          // 备注
          remark: ''
        },
        selectPlanBtnTxt: '查看应急预案',
        // 表单规则
        formRules: {
          humanId:
            [
              { required: true, message: '请输入序号', trigger: 'blur' }
            ],
          humanName:
            [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
          humanEmail:
            [
              { required: true, message: '请输入邮件', trigger: 'blur' },
              { type: 'email', message: '邮箱地址不正确', trigger: 'blur' }
            ],
          humanMobile:
            [
              { required: true, message: '请输入手机', trigger: 'blur' }
            ],
          humanBirthday:
            [
              { required: true, message: '请输入生日', trigger: 'blur' }
            ],
          humanResidence:
            [
              { required: true, message: '请输入户口所在地', trigger: 'blur' }
            ],
          humanSchool:
            [
              { required: true, message: '请输入毕业学校', trigger: 'blur' }
            ],
          humanMajor:
            [
              { required: true, message: '请输入专业', trigger: 'blur' }
            ],
          humanIntension:
            [
              { required: true, message: '请输入求职意向', trigger: 'blur' }
            ]
        },
        // 临时选中的预案变量
        selection: [],
        // 页面显示用预案名
        planName: ''
      }
    },
    created() {
      this.formData.teamCode = params(this, 'teamCode')
      // 根据code判断：编辑/新增
      this.isEdit = this.formData.teamCode !== null
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            this.disable = true
            insert(this.formData).then(response => {
              alert(response.data.message)
            }).finally(() => {
              this.disable = false
            })
          }
        })
      },
      uploadHandler(param) {
        // console.debug('uploadHandler: %s', param)
        this.loading = true
        var form = new FormData()
        form.append('file', param.file, param.file['filename'])
        request({
          // zuul/api 前置zuul对应上传中文问题
          baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
          url: '/general/upload/uploadFile',
          method: 'post',
          data: form,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data;boundary=boundary'
            },
            field: param.file.name
          }
        }).then(result => {
          console.debug(result)
          this.userFormData.userAvatar = result.data.uploadOssUrl
        }).catch((e) => {
          console.error(e)
        }).finally(() => {
          this.fileList = []
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .human-edit-container /deep/ {
    .select-pic-btn {
      margin-left: 10px;
      margin-top: 3px;
    }
    .el-input__inner {
      width: 170px;
    }
    .largeBtn {
      width: 90%;
    }
    .content-spe-element {
      padding-left: 0px!important;
      padding-right: 0px!important;
      width: 100%!important;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;

      &-uploader {
        & /deep/ img {
          border-radius: 0;
          margin: 0;
        }

        & /deep/ .el-upload-dragger {
          width: 180px;
          height: 180px;
        }

        .el-upload {
          border: 1px dashed unquote('#d9d9d9');
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: unquote('#409eff');
          }
        }

        &-icon {
          font-size: 28px;
          color: unquote('#8c939d');
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }

        &-tip {
          font-size: 12px;
          color: unquote('#909399');
        }
      }
    }
  }
</style>
