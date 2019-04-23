<template>
  <div class="container"
       v-loading="loading"
       v-if="!loading">
    <!-- 编辑用户 -->
    <component-form :name="this.pageTitle"
                    :isEdit="this.isEdit()">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="150px"
               label-position="right">
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户名"
                          prop="userName">
              <el-input v-model="formData.userName"
                        placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户密码"
                          prop="userPassword">
              <el-input v-model="formData.userPassword"
                        type="password"
                        placeholder="用户密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户邮箱"
                          prop="userEmail">
              <el-input v-model="formData.userEmail"
                        placeholder="用户邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户手机"
                          prop="userMobile">
              <el-input v-model="formData.userMobile"
                        placeholder="用户手机"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="微信号"
                          prop="userWechat">
              <el-input v-model="formData.userWechat"
                        placeholder="微信号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="QQ号码"
                          prop="userQq">
              <el-input v-model="formData.userQq"
                        placeholder="QQ号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="是否有效"
                          prop="userStatus">
              <el-switch v-model="formData.userStatus"
                         :active-value=1
                         :inactive-value=0>
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户ID"
                          prop="userId">
              <el-input-number v-model="formData.userId"
                               :step="10"
                               controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户权限"
                          prop="roles">
              <el-select v-model="SelectRoles"
                         multiple
                         placeholder="用户权限"
                         @change="handleRoleChange">
                <el-option v-for="item in roles"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="用户头像"
                          prop="userAvatar">
              <el-upload class="avatar-uploader"
                         drag
                         ref="upload"
                         action=''
                         :http-request="this.httpRequestHandler"
                         :show-file-list='false'
                         accept=".jpg,.png,.bmp,jpge"
                         :before-upload="beforeUpload">
                <img v-if="formData.userAvatar && formData.userAvatar!=='' || this.imageUrl!==''"
                     :src="this.imageUrl"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip"
                     class="avatar-uploader-tip">图片仅限格式：jpg/png/bmp/jpge
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="18"
                  :offset="5">
            <el-form-item label="备注"
                          prop="remark">
              <div>
                <!-- 富文本 & 图片库 -->
                <tinymce-gallery id="userTiny"
                                 v-model="formData.remark"
                                 type="PhotoGallery"
                                 @keyup="remarkKeyupHandler" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="6"
                  class="text-center">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="this.close"> 关 闭
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!this.isEdit()"
                         @click="submitForm()"> 新 增
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="this.isEdit()"
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
import { getByUserName, update, insert, uploadAvatar } from '@/api/user/user'
import { getRoleAll } from '@/api/role/role'
import { TinymceGallery } from 'ctsi-vue-dialog'
import { params } from '@/utils/params'
import Bus from '@/utils/bus.js'

export default {
  name: 'emergencyEdit',
  components: {
    ComponentForm,
    TinymceGallery
  },
  data() {
    return {
      loading: false,
      // title字段
      pageTitle: '用户',
      // 表单主键
      name: '',
      // 表单数据
      formData: {
        // 默认状态
        userStatus: 1
      },
      // select控件
      roles: [],
      SelectRoles: [],
      // 头像地址
      imageUrl: '',
      // 表单规则
      formRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        userMobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' }
        ],
        userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        roles: [{ required: true, message: '请选择用户权限', trigger: 'blur' }]
      },
      // 富文本规格
      tinyOpt: {
        height: 300
      }
    }
  },
  watch: {
    $route(to, from) {
      this.init()
      alert()
    }
  },
  created() {
    // 接收用户参数 & 页面初始化
    this.name = params(this, 'userName')
    this.init()
  },
  methods: {
    isEdit() {
      // 是否接受到name -> 页面为 “编辑用户” 或 “更新用户”
      return this.name !== null
    },
    init() {
      // console.log(this.name)
      // 渲染编辑数据
      if (this.isEdit()) {
        this.loading = true
        getByUserName(this.name)
          .then(result => {
            this.formData = result.data
            // this.formData.userPassword = ''
            // 解析roles
            const SelectRoles = []
            for (const role of this.formData.roles) {
              SelectRoles.push(role.roleKey)
            }
            this.SelectRoles = SelectRoles
            // 显示图片
            this.imageUrl = this.formData.userAvatar
          })
          .finally(() => {
            this.loading = false
          })
      }
      // 渲染select控件
      getRoleAll().then(result => {
        this.roles = result.data.options
      })
    },
    handleRoleChange(roles) {
      // 权限选项变化
      const array = []
      for (const i in roles) {
        array.push({ roleKey: roles[i] })
      }
      // console.log(array)
      this.formData.roles = array
    },
    beforeUpload(file) {
      // 头像上传
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('非图片格式！')
        return false
      }
      const fd = new FormData()
      fd.append('file', file)
      uploadAvatar(fd).then(res => {
        this.imageUrl = res.data.userAvatar
        this.formData.userAvatar = this.imageUrl
        // console.log(this.formData)
      })
      return true
    },
    httpRequestHandler() {
      // 覆盖默认上传行为
    },
    remarkKeyupHandler(value) {
      this.formData.remark = value
    },
    submitForm() {
      // 提交表单
      this.$refs['formData'].validate(valid => {
        if (valid && this.isEdit()) {
          // 保存富文本内容
          // 更新
          update(this.formData)
          // 传递bus事件更换用户头像
          Bus.$emit('userAvatar', this.formData.userAvatar)
        } else if (valid && !this.isEdit()) {
          // 新增
          insert(this.formData)
        } else {
          return false
        }
      })
    },
    close() {
      // 关闭
      this.$router.push({
        path: '/userManager/user'
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/dictionary.scss';
</style>
