<template>
  <div class="container">
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
            <el-form-item label="角色"
                          prop="roleKey">
              <el-input v-model="formData.roleKey"
                        placeholder="角色"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="描述"
                          prop="roleName">
              <el-input v-model="formData.roleName"
                        placeholder="描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="状态"
                          prop="roleStatus">
              <el-switch v-model="formData.roleStatus"
                         :active-value=1
                         :inactive-value=0>
              </el-switch>
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
import { getRoleByCode, update, insert } from '@/api/role/role'
import { params } from '@/utils/params'

export default {
  name: 'roleEdit',
  components: {
    ComponentForm
  },
  data() {
    return {
      // title字段
      pageTitle: '权限',
      // 表单数据
      formData: {
        // 默认状态
        roleStatus: 1
      },
      // 表单规则
      formRules: {
        roleKey: [{ required: true, message: '请输入角色', trigger: 'blur' }],
        roleName: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        roleStatus: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      // 表单主键
      code: ''
    }
  },
  created() {
    this.code = params(this, 'roleCode')
    // 页面初始化
    this.init()
  },
  methods: {
    isEdit() {
      // 是否接收到code
      return this.code !== null
    },
    init() {
      // 渲染编辑数据
      if (this.isEdit()) {
        getRoleByCode(this.code).then(result => {
          this.formData = result.data
        })
      }
    },
    close() {
      // 关闭
      this.$router.push({
        path: '/userManager/role'
      })
    },
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid && this.isEdit()) {
          // 更新
          update(this.formData)
        } else if (valid && !this.isEdit()) {
          // 新增
          insert(this.formData)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
