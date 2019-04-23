<template>
  <div class="container">
    <ComponentForm :name="this.pageTitle"
                   :isEdit="this.isEdit()">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="80px"
               label-position="right">
        <el-row v-if="false">
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="编号"
                          prop="dictCode">
              <el-input v-model="formData.rapidKey"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="运行名称"
                          prop="rapidName">
              <el-input v-model="formData.rapidName"
                        placeholder="英文运行key"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="18"
                  :offset="5">
            <el-form-item label="步骤参数"
                          prop="rapidValue">
              <div>
                <el-input v-model="formData.rapidValue"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 6}"
                          placeholder="备注"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="18"
                  :offset="5"
                  class="form-submit">
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
// import { getByCode, update, insert } from '@/api/settings/dict'
import { params } from '@/utils'

export default {
  name: 'dictForm',
  components: {
    ComponentForm
  },
  data() {
    return {
      // title字段
      pageTitle: '快速部署',
      // 表单数据
      formData: {
        dictKey: '',
        // 默认状态
        dictStatus: 1,
        // 默认排序
        dictSort: 10,
        // 默认富文本
        dictRemark: ''
      },
      // 表单规则
      formRules: {
        rapidKey: [
          { required: true, message: '请输入步骤索引', trigger: 'blur' }
        ],
        rapidValue: [
          { required: true, message: '请输入步骤参数', trigger: 'blur' }
        ],
        rapidName: [
          { required: true, message: '请输入运行名称', trigger: 'blur' }
        ]
      },
      // 表单主键
      code: ''
    }
  },
  created() {
    this.code = params(this, 'dictCode')
    // 页面初始化
    this.init()
  },
  methods: {
    isEdit() {
      // 根据code判断：编辑/新增
      return this.code !== null
    },
    init() {
      // 渲染编辑数据
      if (this.isEdit()) {
        /* getByCode(this.code).then(result => {
          this.formData = result.data
          // console.log(this.formData)
        })*/
      }
    },
    close() {
      // 关闭
      this.$router.push({
        path: '/operationsManagement/rapid-deploy'
      })
    },
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid && this.isEdit()) {
          // 更新
          // update(this.formData)
        } else if (valid && !this.isEdit()) {
          // 新增
          // this.$emit('test', formData)
          //  this.tableData.unshift(formData)
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
