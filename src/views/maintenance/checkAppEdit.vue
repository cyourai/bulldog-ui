<template>
  <div class="check-app-edit-container"
       v-loading="loading"
       v-if="!loading">
    <!-- 编辑用户 -->
    <component-form :name="pageTitle"
                    :isEdit="isEdit()">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="100px"
               label-position="right">
        <el-row v-if="false">
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="巡检单编号"
                          prop="checkAppCode">
              <el-input v-model="formData.checkAppCode"
                        placeholder="巡检单编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5" v-if="isShowUser">
            <el-form-item label="巡检人"
                          prop="checkAppUser">
              <el-select v-model="formData.checkAppUser" placeholder="请选择">
                <el-option
                  v-for="item in optionsUser"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="巡检时间"
                          prop="checkAppTime">
              <el-input v-model="formData.checkAppTime"
                        placeholder="巡检时间"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="巡检结果是否正常"
                          prop="checkAppResult">
              <el-switch v-model="formData.checkAppResult"
                         :active-value=1
                         :inactive-value=0>
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="解决方法"
                          prop="checkAppSolution">
              <el-input v-model="formData.checkAppSolution"
                        placeholder="解决方法"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="巡检截图 jpg/png/bmp"
                          prop="checkAppEvidence">
              <el-upload class="img-uploader"
                         drag
                         ref="upload1"
                         action=''
                         :http-request="uploadHandler"
                         :show-file-list=false
                         :data="{index: 1}"
                         accept=".jpg,.png,.bmp,jpge">
                <img v-if="formData.checkAppEvidence1 && formData.checkAppEvidence1!=='' || imageUrl1!==''"
                     :src="formData.checkAppEvidence1"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-upload class="img-uploader"
                         drag
                         ref="upload2"
                         action=''
                         :http-request="uploadHandler"
                         :show-file-list=false
                         :data="{index: 2}"
                         accept=".jpg,.png,.bmp,jpge">
                <img v-if="formData.checkAppEvidence2 && formData.checkAppEvidence2!=='' || imageUrl2!==''"
                     :src="formData.checkAppEvidence2"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-upload class="img-uploader"
                         drag
                         ref="upload3"
                         action=''
                         :http-request="uploadHandler"
                         :show-file-list=false
                         :data="{index: 3}"
                         accept=".jpg,.png,.bmp,jpge">
                <img v-if="formData.checkAppEvidence3 && formData.checkAppEvidence3!=='' || imageUrl3!==''"
                     :src="formData.checkAppEvidence3"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="备注"
                          prop="remark">
              <div>
                <!-- 富文本 & 图片库 -->
                <tinymce-gallery :id="'userTiny'"
                                 :value="formData.checkAppRemark"
                                 type="PhotoGallery"
                                 @keyup="remarkKeyupHandler" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="info !== 1">
          <el-col :span="10"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="close"> 关 闭
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!isEdit()"
                         @click="submitForm()"> 新 增
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="isEdit()"
                         @click="submitForm()"> 更 新
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </component-form>
  </div>

</template>
<script>
  import ComponentForm from '@/components/ComponentForm'
  import { selectUserListByOrgName } from '@/api/user'
  import { params, getByCode, uploadImg, update, insert } from '@/utils'
  import { TinymceGallery } from 'cyourai-vue-dialog'

  export default {
    components: {
      ComponentForm, TinymceGallery
    },
    data() {
      return {
        loading: false,
        isShowUser: false,
        uploadIndex: 1,
        // title字段
        pageTitle: '应用巡检单',
        // 巡检截图
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        // 是否关闭编辑
        info: 0,
        // 表单数据
        formData: {
          // 巡检单编号
          checkAppCode: '',
          // 巡检人
          checkAppUser: '',
          // 巡检时间
          checkAppTime: '',
          // 巡检结果 0:异常 1:正常
          checkAppResult: 1,
          // 解决方法
          checkAppSolution: '',
          // 截图
          checkAppEvidence1: '',
          checkAppEvidence2: '',
          checkAppEvidence3: '',
          // 备注
          checkAppRemark: ''
        },
        // 表单规则
        formRules: {
          checkAppId:
            [
              { required: true, message: '请输入序号', trigger: 'blur' }
            ],
          checkAppCode:
            [
              { required: true, message: '请输入巡检单编号', trigger: 'blur' }
            ],
          checkAppUser:
            [
              { required: true, message: '请输入巡检人', trigger: 'blur' }
            ],
          checkAppTime:
            [
              { required: true, message: '请输入巡检时间', trigger: 'blur' }
            ]

        },
        // 运维组
        optionUsers: [],
        // 根据编号查询实体
        queryUrl: '/maintenance/checkApp'
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      // 接收用户参数 & 页面初始化
      this.formData.checkAppCode = params(this, 'checkAppCode')
      this.info = params(this, 'info') * 1
      this.init()
    },
    methods: {
      isEdit() {
        return this.formData.checkAppCode !== null
      },
      init() {
        // 渲染编辑数据
        if (this.isEdit()) {
          this.loading = true
          selectUserListByOrgName('运维组')
            .then(result => {
              this.optionsUser = []
              for (const i in result.data) {
                this.optionsUser.push({ label: result.data[i].userNickName, value: result.data[i].userName })
              }
            }).finally(() => {
              this.isShowUser = true
            })
          getByCode(this.queryUrl, this.formData.checkAppCode)
            .then(result => {
              this.formData = result.data
            })
            .finally(() => {
              this.loading = false
            })
        }
      },
      remarkKeyupHandler(value) {
        this.formData.checkAppRemark = value
      },
      uploadHandler(param) {
        const file = param.file
        const index = param.data.index
        // 头像上传
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('非图片格式！')
          return false
        }
        const fd = new FormData()
        fd.append('file', file)
        uploadImg(fd).then(result => {
          if (index === 1) {
            this.imageUrl1 = result.data
            this.formData.checkAppEvidence1 = result.data
          } else if (index === 2) {
            this.imageUrl2 = result.data
            this.formData.checkAppEvidence2 = result.data
          } else {
            this.imageUrl3 = result.data
            this.formData.checkAppEvidence3 = result.data
          }
        })
        return true
      },
      submitForm() {
        // 提交表单
        this.$refs['formData'].validate(valid => {
          if (valid && this.isEdit()) {
            // 更新
            update('/maintenance/checkApp', this.formData)
          } else if (valid && !this.isEdit()) {
            // 新增
            insert('/maintenance/checkApp/insert', this.formData)
          } else {
            return false
          }
        })
      },
      close() {
        // 关闭
        this.$router.push({
          path: '/maintenance/checkAppList'
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .check-app-edit-container /deep/ {
    .el-switch {
      margin-top: 20px;
    }
  }

</style>
