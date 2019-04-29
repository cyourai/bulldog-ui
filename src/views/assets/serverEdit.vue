<template>
  <div class="container"
       v-loading="loading">
    <!-- 编辑用户 -->
    <ComponentForm :name="this.pageTitle"
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
            <el-form-item label="服务器名称"
                          prop="serverName">
              <el-input v-model="formData.serverName"
                        placeholder="服务器名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="服务器IP地址"
                          prop="serverIp">
              <el-input v-model="formData.serverIp"
                        placeholder="服务器IP地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="服务器登录用户名"
                          prop="serverUserName">
              <el-input v-model="formData.serverUserName"
                        placeholder="服务器登录用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="服务器登录用户密码"
                          prop="serverUserPassword">
              <el-input v-model="formData.serverUserPassword"
                        placeholder="服务器登录用户密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="服务器类型"
                          prop="serverType">
              <el-select v-model="formData.serverType"
                         placeholder="服务器类型">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="18"
                  :offset="5">
            <el-form-item label="备注"
                          prop="serverRemark">
              <!-- 富文本 & 图片库 -->
              <tinymce-gallery v-model="formData.serverRemark"
                               :type='"PhotoGallery"'
                               @keyup="remarkKeyupHandler"></tinymce-gallery>
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
                         @click="this.close"> 关 闭 </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!this.isEdit()"
                         @click="submitForm()"> 新 增</el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="this.isEdit()"
                         @click="submitForm()"> 更 新 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </ComponentForm>
  </div>

</template>
<script>
import ComponentForm from '@/components/ComponentForm'
import {
  getByServerCode,
  updateServer,
  insertServer
} from '@/api/assets/assets'
import { select } from '@/api/components/component'
import { TinymceGallery } from 'cyourai-vue-dialog'
import { params } from '@/utils/params'
import { validateIP } from '@/utils/validate'

export default {
  name: 'userEdit',
  components: {
    ComponentForm,
    TinymceGallery
  },
  data() {
    return {
      loading: false,
      // title字段
      pageTitle: '服务器',
      // 表单主键
      name: '',
      // 表单数据
      formData: {},
      // select控件
      options: [],
      // 头像地址
      imageUrl: '',
      // 表单规则
      formRules: {
        serverName: [
          { required: true, message: '请输入服务器名称', trigger: 'blur' }
        ],
        serverIp: [
          { required: true, message: '请输入服务器IP地址', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (!validateIP(value)) {
                callback(new Error('ip地址格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        serverType: [
          { required: true, message: '请选择服务器类型', trigger: 'blur' }
        ],
        serverUserName: [
          { required: true, message: '请输入服务器登录用户名', trigger: 'blur' }
        ],
        serverUserPassword: [
          { required: true, message: '请输入服务器登录用户密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 接收用户参数 & 页面初始化
    this.serverCode = params(this, 'serverCode')
    this.init()
  },
  methods: {
    isEdit() {
      // 是否接受到name -> 页面为 “编辑用户” 或 “更新用户”
      return this.serverCode !== null
    },
    init() {
      // select控件
      select('sysType', true).then(result => {
        this.options = result.data.options
      })
      // 渲染编辑数据
      if (this.isEdit()) {
        this.loading = true
        getByServerCode(this.serverCode)
          .then(result => {
            this.formData = result.data
            // console.log(this.formData.serverRemark)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // 提交表单
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid && this.isEdit()) {
          // 更新
          updateServer(this.formData)
        } else if (valid && !this.isEdit()) {
          // 新增
          insertServer(this.formData)
            .then(
              this.close()
            )
        } else {
          return false
        }
      })
    },
    remarkKeyupHandler(value) {
      this.formData.serverRemark = value
    },
    close() {
      // 关闭
      this.$router.push({
        path: '/assets/server'
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/dictionary.scss';
</style>
