<template>
  <div class="validate-edit-container" v-loading="loading">
    <component-form :name="$t('route.validate')"
                    :isEdit="isEdit">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="120px"
               label-position="right">
        <el-row v-if=false>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="验证编号"
                          prop="validateCode">
              <el-input v-model="code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="验证条件名称"
                          prop="validateName">
              <el-input v-model="formData.validateName"
                        placeholder="请输入验证条件名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="业务访问入口"
                          prop="validateUrl">
              <el-input v-model="formData.validateUrl"
                        placeholder="请输入业务访问入口"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="业务验证属性"
                          prop="validate">
              <component-select type="validate"
                                model="center"
                                :defaultSelected="formData.validateProperty"
                                @selectChangeCallBack="validatePropertyChangeHandler"></component-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="业务验证元素"
                          prop="validateItem">
              <el-input v-model="formData.validateItem"
                        placeholder="请输入业务验证元素"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <hr>

        <el-row class="form-content-submit" v-if="!isInfo">
          <el-col :span="18"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="close"> 关 闭
              </el-button>
                <el-button type="success"
                           icon="el-icon-tickets"
                           v-show="!isEdit"
                           @click="submitForm()"> 新 增
                </el-button>
                <el-button type="primary"
                           icon="el-icon-edit"
                           v-show="isEdit"
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
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentForm from '@/components/ComponentForm'
  import { TinymceGallery } from 'cyourai-vue-dialog'
  import { params, isNotEmpty } from '@/utils'
  import { update, insert, getByCode } from '@/api/process/validate'

  export default {
    name: 'validateEdit',
    components: {
      ComponentForm, TinymceGallery, ComponentSelect
    },
    data() {
      return {
        loading: false,
        // 是否编辑模式
        isEdit: false,
        // 是否查看模式
        isInfo: false,
        // 标题
        title: '',

        // 表单数据
        formData: {
          validateCode: '',
          // 验证条件名称
          validateName: '',
          // 业务访问入口
          validateUrl: '',
          // 业务验证属性
          validateProperty: 'id',
          // 业务验证元素
          validateItem: ''
        },
        // 表单规则
        formRules: {
          validateName: [{ required: true, message: '请输入验证条件名称', trigger: 'blur' }],
          validateUrl: [{ required: true, message: '请输入业务访问入口', trigger: 'blur' }],
          validateProperty: [{ required: true, message: '请选择业务验证属性', trigger: 'change' }],
          validateItem: [{ required: true, message: '请输入业务验证元素', trigger: 'blur' }]
        }
      }
    },
    created() {
      // 根据code判断：编辑/新增

      this.formData.validateCode = params(this, 'validateCode')
      this.isEdit = isNotEmpty(this.formData.validateCode)
      this.isInfo = params(this, 'isInfo') && true
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        if (this.isEdit) {
          getByCode(this.formData.validateCode).then(result => {
            this.formData = result.data
          })
        }
      },
      close() {
        // 关闭
        const url = '/processManager/validate'
        this.$router.push({
          path: url
        })
      },
      validatePropertyChangeHandler(validateProperty) {
        this.formData.validateProperty = validateProperty
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          this.loading = true
          if (valid && this.isEdit) {
            // 更新
            update(this.formData).finally(() => { this.loading = false })
          } else if (valid && !this.isEdit) {
            // 新增
            insert(this.formData).finally(() => { this.loading = false })
          } else {
            this.loading = false
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .validate-edit-container/deep/ {
    .el-select {
      width: 100%;
    }
    .el-table {
      text-align: center;
    }
    .plan-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
