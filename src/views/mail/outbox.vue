<template>
  <div class="container">
    <!-- v-loading="loading" -->
    <!-- v-if="!loading" -->
    <!-- 编辑站内信 -->
    <ComponentForm :name="this.pageTitle">
      <!-- :isEdit="this.isEdit()" -->
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="80px"
               label-position="right">
        <el-row>
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="收件人"
                          prop="messageReceiverUser">
              <el-select v-model="valueSelect"
                         multiple
                         filterable
                         remote
                         reserve-keyword
                         placeholder="收件人"
                         :remote-method="remoteMethod"
                         :selectLoading="selectLoading"
                         @change="handleSelectChange">
                <el-option v-for="(item,index) in usersSelect"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="主题"
                          prop="messageTitle">
              <el-input v-model="formData.messageTitle"
                        placeholder="主题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="正文"
                          prop="messageContent">
              <div>
                <!-- 富文本 & 图片库 -->
                <tinymce-gallery v-model="formData.messageContent"
                                 :type='"PhotoGallery"'
                                 @keyup="messageContentKeyupHandler"></tinymce-gallery>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="1">
            <el-form-item>
              <el-button type="success"
                         icon="el-icon-tickets"
                         @click="submitForm()"> 发 送</el-button>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="this.close"> 关 闭 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </ComponentForm>
  </div>

</template>
<script>
import ComponentForm from '@/components/ComponentForm'
import { getUserAll } from '@/api/user/user'
import { insertMessage } from '@/api/mail/message'
import { TinymceGallery } from 'ctsi-vue-dialog'
import { params } from '@/utils/params'

export default {
  name: 'userEdit',
  components: {
    ComponentForm,
    TinymceGallery
  },
  data() {
    return {
      // loading: false,
      // title字段
      pageTitle: '站内信',
      // 表单主键
      messageCode: '',
      // 表单数据
      formData: {},
      // 表单规则
      formRules: {
        messageReceiverUser: [
          { required: true, message: '收件人不能为空', trigger: 'blur' }
        ],
        messageTitle: [
          { required: true, message: '主题不能为空', trigger: 'blur' }
        ],
        messageContent: [
          { required: true, message: '正文不能为空', trigger: 'blur' }
        ]
      },
      // 远程搜搜相关
      users: [],
      usersSelect: [],
      valueSelect: [],
      selectLoading: false,
      // 富文本规格
      tinyOpt: {
        height: 300
      }
    }
  },
  created() {
    // 接收message参数 & 页面初始化
    this.messageCode = params(this, 'messageCode')
    // console.log(this.messageCode)
    this.init()
  },
  methods: {
    init() {
      // 渲染select控件
      getUserAll().then(result => {
        this.users = result.data.options
        // console.log(this.users)
      })
      // console.log(this.formData.messageSendeUser)
    },
    messageContentKeyupHandler(value) {
      this.formData.messageContent = value
    },
    remoteMethod(value) {
      // 远程搜索
      this.usersSelect = [{ label: '发给全部', value: 'sendToAll' }]
      if (value !== '') {
        this.selectLoading = true
        setTimeout(() => {
          this.selectLoading = false
          for (var i in this.users) {
            if (this.users[i].label.indexOf(value.toLowerCase()) > -1) {
              this.usersSelect.push(this.users[i])
            }
          }
        }, 200)
      } else {
        this.usersSelect = [{ label: '发给全部', value: 'sendToAll' }]
      }
    },
    handleSelectChange(users) {
      // 收件人选项变化
      // console.log(users)
      var str = ''
      for (const i in users) {
        str += users[i] + ','
      }
      str = str.substr(0, str.length - 1)
      // 如果选择了“全部”
      if (str === 'sendToAll') {
        str = ''
        for (const j in this.users) {
          str += this.users[j].value + ','
        }
        str = str.substr(0, str.length - 1)
      }
      // console.log(str)
      this.formData.messageReceiverUser = str
    },
    submitForm() {
      // 提交表单
      this.$refs['formData'].validate(valid => {
        if (valid) {
          // 新增
          insertMessage(this.formData)
            .then(
              this.$router.push({
                path: '/mail/inbox'
              })
            )
        } else {
          return false
        }
      })
    },
    close() {
      // 关闭
      this.$router.push({
        path: '/mail/inbox'
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/dictionary.scss';
</style>
