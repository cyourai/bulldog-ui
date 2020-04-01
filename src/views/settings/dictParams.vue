<template>
  <div class="container">
    <ComponentForm :name="this.pageTitle"
                   :isEdit="this.isEdit()">
      <el-form slot="form"
               :model="formData"
               ref="formData">
        <!-- 循环lebal -->
        <el-row v-for="(add, index) in formData.list"
                :key="add.key"
                :gutter="10">
          <el-col :span="3"
                  :offset="4">
            <el-form-item :prop="'list.' + index + '.settingKey'"
                          :rules="[{ required: true, message: '请输入主键', trigger: 'blur' }]">
              <el-input placeholder="标签："
                        v-model="add.settingKey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="'list.' + index + '.settingValue'"
                          :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
              <el-input type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        placeholder="内容："
                        v-model="add.settingValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="'list.' + index + '.settingRemark'"
                          :rules="[{ required: true, message: '请输入备注', trigger: 'blur' }]">
              <el-input type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        placeholder="备注："
                        v-model="add.settingRemark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click.prevent="removeDomain(add)"
                         type="danger"
                         icon="el-icon-close">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 操作 -->
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="4">
            <el-form-item>
              <el-button type="primary"
                         @click="submitForm()"
                         icon="el-icon-edit">提交</el-button>
              <el-button type="success"
                         @click="addDomain"
                         icon="el-icon-tickets">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </ComponentForm>
  </div>

</template>

<script>
import ComponentForm from '@/components/ComponentForm'
import { getParamsAll, upDateParams } from '@/api/settings/dictParams'

export default {
  name: 'dict-params',
  components: {
    ComponentForm
  },
  data() {
    return {
      // title字段
      pageTitle: '平台参数',
      // 表单数据
      formData: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    isEdit() {
      return typeof this.code !== 'undefined'
    },
    init() {
      getParamsAll().then(result => {
        this.formData = result.data
      })
    },
    submitForm(formData) {
      // 提交
      this.$refs['formData'].validate(valid => {
        if (valid) {
          upDateParams(this.formData.list).then(() => {
            this.init()
          })
        } else {
          return false
        }
      })
    },
    addDomain() {
      // 新增1项
      this.formData.list.push({})
    },
    removeDomain(item) {
      // 删除1项
      var index = this.formData.list.indexOf(item)
      if (index !== -1) {
        this.formData.list.splice(index, 1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
