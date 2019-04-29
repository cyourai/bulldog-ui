<template>
  <div class="container" v-loading="loading">
    <ComponentForm :name="'抢购刊例标的'" :isEdit="true">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="180px"
               label-position="right">
        <el-row>
          <el-col :span="20"
                  :offset="5">
            <el-form-item label="加入抢购刊例"
                          prop="flashSalePublishedCode">
              <el-select v-model="formData.flashSalePublishedCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入刊例名称并选择"
                         :remote-method="publishedChangeHandler"
                         :loading="selectLoading">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="5">
            <el-form-item label="抢购计划名称"
                          prop="flashSalePublishedName">
              <el-input v-model="formData.flashSalePublishedName"
                        placeholder="此名称与刊例名可以不同,显示在商城页面供用户查看"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="抢购开始-结束时间"
                          prop="publishedDateRange">
              <el-date-picker v-model="dateRange"
                              size="small"
                              type="datetimerange"
                              format="yyyy-MM-dd hh:mm:ss"
                              value-format="yyyy-MM-dd hh:mm:ss"
                              :default-time="['12:00:00', '12:00:00']"
                              range-separator="至"
                              start-placeholder="抢购开始日期"
                              end-placeholder="抢购结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="editor-container">
          <el-col :span="18"
                  :offset="5">
            <el-form-item label="抢购说明"
                          prop="remark">
                <tinymce-gallery v-model="formData.flashSaleInfo" :type='"PhotoGallery"' @keyup="flashSaleInfoKeyupHandler"></tinymce-gallery>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         class="largeBtn"
                         @click="close"> 关 闭
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         class="largeBtn"
                         @click="submitForm"> 新 增
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </ComponentForm>
  </div>

</template>
<script>
  import ComponentForm from '@/components/ComponentForm'
  import ComponentSelect from '@/components/ComponentSelect'
  import { Message } from 'element-ui'
  import { TinymceGallery } from 'cyourai-vue-dialog'
  import { request, isEmpty } from '@/utils'

  export default {
    name: 'mediaSellerForm',
    data() {
      return {
        loading: false,
        selectLoading: false,
        dateRange: [],
        // 表单数据
        formData: {
          flashSalePublishedCode: '',
          flashSalePublishedName: '',
          flashSaleInfo: '',
          flashSaleDateRange: ''
        },
        options: [],
        // 表单规则
        formRules: {
          flashSalePublishedCode: [
            { required: true, message: '请选择刊例', trigger: 'blur' }
          ],
          flashSalePublishedName: [
            { required: true, message: '抢购计划名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: { ComponentSelect, ComponentForm, TinymceGallery, Message },
    created() {
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
      },
      isEdit() {
        return this.code !== null
      },
      close() {
        // 关闭
        this.$router.push({
          path: '/flashSale/flashSale'
        })
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          if (isEmpty(this.formData.flashSalePublishedCode)) {
            Message({
              message: '请选择刊例',
              type: 'warning',
              duration: 5 * 1000
            })
            return
          }
          if (new Date(this.dateRange[0]).getTime() < new Date().getTime()) {
            Message({
              message: '抢购时间不能小于当前时间',
              type: 'warning',
              duration: 5 * 1000
            })
            return
          }
          if (valid) {
            this.$confirm('请确认填写信息无误,新增抢购信息后无法编辑,只能删除后重新添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true
              this.formData.flashSaleDateRange = [this.dateRange[0], this.dateRange[1]].join(',')
              const data = this.formData
              return request({
                url: '/media/flashSale/insertFlashSale',
                method: 'post',
                message: '新增抢购计划成功',
                data
              }).then(() => {
                this.close()
              }).finally(() => {
                this.loading = false
              })
            })
          } else {
            return false
          }
        })
      },
      publishedChangeHandler(keyword) {
        // 选择刊例
        this.selectLoading = true
        return request({
          url: '/media/published/select/' + keyword,
          method: 'get'
        }).then(result => {
          this.options = result.data.options
        }).finally(() => {
          this.selectLoading = false
        })
      },
      flashSaleInfoKeyupHandler(value) {
        this.formData.flashSaleInfo = value
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .el-select{
    width: 400px
  }
  .el-input{
    width: 400px
  }
</style>
