<template>
  <div class="container">
    <component-form :name="pageTitle"
                    :isEdit="isEdit">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="120px"
               label-position="right">
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="模板名称"
                          prop="templateName">
              <el-input v-model="formData.templateName"
                        placeholder="中文模板名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="模板索引键值"
                          prop="templateKey">
              <el-input v-model="formData.templateKey"
                        placeholder="英文下划线编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="模板内容"
                          prop="templateValue">
              <el-input v-model="formData.templateValue"
                        type="textarea"
                        :autosize="{ minRows: 6, maxRows: 12}"
                        placeholder="模板内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="备注"
                          prop="templateRemark">
              <el-input v-model="formData.templateRemark"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6}"
                        placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="close"> 关 闭
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!this.isEdit"
                         @click="submitForm()"> 新 增
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="this.isEdit"
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
  import { getByCode, update, insert } from '@/api/template'
  import { params, isNotEmpty } from '@/utils'

  export default {
    name: 'templateEdit',
    components: {
      ComponentForm
    },
    data() {
      return {
        loading: false,
        isEdit: false,
        // title字段
        pageTitle: '模板',
        // 表单数据
        formData: {
        },
        // 表单规则
        formRules: {
          templateName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          templateKey: [
            { required: true, message: '请输入模板索引键值', trigger: 'blur' }
          ],
          templateValue: [
            { required: true, message: '请输入模板内容', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.formData.templateCode = params(this, 'templateCode')
      this.formData.templateType = params(this, 'templateType')
      this.pageTitle = this.formData.templateType === 'msg' ? '短信模板' : '邮件模板'
      this.isEdit = isNotEmpty(this.formData.templateCode)
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 渲染编辑数据
        if (this.isEdit) {
          this.loading = true
          getByCode(this.formData.templateCode).then(result => {
            this.formData = result.data
            // console.debug(result.data)
          }).finally(() => {
            this.loading = false
          })
        }
      },
      close() {
        // 关闭
        this.$router.push({
          path: `/settings/template-${this.formData.templateType}`
        })
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          if (valid && this.isEdit) {
            // 更新
            update(this.formData)
          } else if (valid && !this.isEdit) {
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
