<template>
  <div class="container"
       v-loading="loading">
    <!-- 页内容 -->
    <!-- 表单-form -->
    <div class="form-content">
      <div class="container">
        <el-form slot="form"
                 :model="formData"
                 :rules="formRules"
                 ref="formData"
                 label-width="250px"
                 label-position="right">
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="用户名"
                            prop="auditUserName">
                <el-tag type="default">{{formData.auditUserName}}</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="名称"
                            prop="auditName">
                <el-input v-model="formData.auditName"
                          placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="联系人姓名"
                            prop="auditContactName">
                <el-input v-model="formData.auditContactName"
                          placeholder="联系人姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="联系电话"
                            prop="auditContactPhone">
                <el-input v-model="formData.auditContactPhone"
                          placeholder="联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="联系地址"
                            prop="auditAddress">
                <el-input v-model="formData.auditAddress"
                          placeholder="联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="注册类型（媒体主/广告主/代理商）"
                            prop="auditRegisterType">
                <span v-if="formData.auditRegisterType=='mediaSeller'">
                  <el-tag>媒体主</el-tag>
                </span>
                <span v-if="formData.auditRegisterType=='bull'">
                  <el-tag>广告主</el-tag>
                </span>
                <span v-if="formData.auditRegisterType=='agent'">
                  <el-tag>代理商</el-tag>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="企业类型（单位/个人）"
                            prop="auditEnterpriseType">
                <span v-if="formData.auditEnterpriseType=='unit'">
                  <el-tag type="success">单位</el-tag>
                </span>
                <span v-if="formData.auditEnterpriseType=='personal'">
                  <el-tag type="success">个人</el-tag>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="营业执照"
                            prop="auditBusinessLicense">
                <el-input v-model="formData.auditBusinessLicense"
                          placeholder="营业执照"
                          @focus="activePicDialogHandler('auditBusinessLicense')"></el-input>
                <pic-magnify :picUrl="formData.auditBusinessLicense"></pic-magnify>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="授权证明/所有证明"
                            prop="auditAuthCertificate">
                <el-input v-model="formData.auditAuthCertificate"
                          placeholder="授权证明/所有证明片"
                          @focus="activePicDialogHandler('auditAuthCertificate')"></el-input>
                <pic-magnify :picUrl="formData.auditAuthCertificate"></pic-magnify>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="身份证正面"
                            prop="auditIdCardFront">
                <el-input v-model="formData.auditIdCardFront"
                          placeholder="身份证正面"
                          @focus="activePicDialogHandler('auditIdCardFront')"></el-input>
                <pic-magnify :picUrl="formData.auditIdCardFront"></pic-magnify>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="身份证反面"
                            prop="auditIdCardReverse">
                <el-input v-model="formData.auditIdCardReverse"
                          placeholder="身份证反面"
                          @focus="activePicDialogHandler('auditIdCardReverse')"></el-input>
                <pic-magnify :picUrl="formData.auditIdCardReverse"></pic-magnify>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="发票附件"
                            prop="auditInvoiceAttachement">
                <el-input v-model="formData.auditInvoiceAttachement"
                          placeholder="发票附件"
                          @focus="activePicDialogHandler('auditInvoiceAttachement')"></el-input>
                <pic-magnify :picUrl="formData.auditInvoiceAttachement"></pic-magnify>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="11">
            <el-button type="success"
                       icon="el-icon-tickets"
                       class="largeBtn"
                       @click="saveAudit"> 更新资质信息
            </el-button>
            </el-col>
          </el-row>
          <el-row>
            <hr>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="发票名称"
                            prop="invoiceName">
                <el-input v-model="formData.invoice.invoiceName"
                          placeholder="发票名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="信用代码"
                            prop="invoiceCreditCode">
                <el-input v-model="formData.invoice.invoiceCreditCode"
                          placeholder="信用代码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="注册地址"
                            prop="invoiceRegisterAddress">
                <el-input v-model="formData.invoice.invoiceRegisterAddress"
                          placeholder="注册地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="注册电话"
                            prop="invoiceRegisterPhone">
                <el-input v-model="formData.invoice.invoiceRegisterPhone"
                          placeholder="注册电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="开户银行"
                            prop="invoiceBankName">
                <el-input v-model="formData.invoice.invoiceBankName"
                          placeholder="开户银行"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="银行账户"
                            prop="invoiceBankAccount">
                <el-input v-model="formData.invoice.invoiceBankAccount"
                          placeholder="银行账户"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="邮寄地址"
                            prop="invoicePostAddress">
                <el-input v-model="formData.invoice.invoicePostAddress"
                          placeholder="邮寄地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="11">
              <el-button type="success"
                         icon="el-icon-tickets"
                         class="largeBtn"
                         @click="saveInvoice"> 更新发票信息
              </el-button>
            </el-col>
          </el-row>
          <el-row>
          <hr>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5">
              <el-form-item label="广告主所属的行业"
                            prop="industry"
                            v-if="formData.auditRegisterType=='bull'">
                <component-cascader type="industry"
                                    model="media"
                                    v-if="(formData.industryUser.industryUserIndeustryKey !== undefined)"
                                    :defaultSelected="formData.industryUser.industryUserIndeustryKey"
                                    @cascaderChangeCallBack="cascaderIndustryChangeCallBack">
                </component-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="11">
              <el-button type="success"
                         icon="el-icon-tickets"
                         class="largeBtn"
                         @click="saveOption"> 更新行业信息
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11"
                    :offset="5"
                    class="form-submit">
              <el-form-item>
                <el-button type="warning"
                           icon="el-icon-tickets"
                           class="largeBtn"
                           @click="close()"> 关 闭
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <vue-dialog :visible="visible"
                :title='"图片库"'
                :type='"PhotoGallery"'
                :width='"80%"'
                @closeHandler="visible=false"
                @confirmHandler="confirmHandler"></vue-dialog>
  </div>
</template>
<script>
  import { request } from '@/utils/request'
  import { Message } from 'element-ui'
  import { debug, error } from '@/utils/log'
  import { closeView } from '@/utils/close'
  import { PicMagnify, VueDialog } from 'ctsi-vue-dialog'
  import { params } from '@/utils/params'
  import ComponentCascader from '@/components/ComponentCascader'

  export default {
    name: 'userAudit',
    data() {
      return {
        loading: false,
        // title字段
        pageTitle: '用户注册审批',
        // 表单数据
        formData: {
          // 广告主用户行业编号
          industryUser: {},
          // 发票信息
          invoice: {}
        },
        // 表单规则
        formRules: {},
        // 流程业务Key
        businessKey: '',
        // 任务id
        taskId: '',
        viewName: 'user-audit',
        // 图片库
        visible: false,
        // 图片库对应的form字段
        activeField: ''
      }
    },
    components: { PicMagnify, Message, ComponentCascader, VueDialog },
    created() {
      // 页面初始化
      this.userName = params(this, 'userName')
      this.init()
    },
    mounted() {
    },
    computed: {},
    methods: {
      init() {
        this.loading = true
        return request({
          url: '/media/audit/findAuditInvoiceByUserName/' + this.userName,
          method: 'get'
        }).then(result => {
          this.formData = result.data
          debug('init:', this.formData)
          if (this.formData === null || this.formData === '') {
            Message({
              message: '用户未提交证明材料',
              type: 'warning',
              duration: 5 * 1000
            })
          }
        }).catch(e => {
          error(e)
        }).finally(() => {
          this.loading = false
        })
      },
      cascaderIndustryChangeCallBack(value) {
        this.formData.industryUser.industryUserIndeustryKey = value.join(',')
      },
      close() {
        closeView(this, this.viewName)
      },
      activePicDialogHandler(formField) {
        this.visible = true
        this.activeField = formField
        // console.debug('activePicDialogHandler: %s' + formField)
      },
      confirmHandler(params) {
        // 图片库确认按钮回调
        this.visible = false
        if (Array.isArray(params.galleryList) && params.galleryList.length > 0) {
          this.formData[this.activeField] = params.galleryList[0]
          // console.debug('confirmHandler: %s' + this.formData.mediaSellerLogo)
        }
      },
      saveAudit() {
        this.loading = true
        request({
          url: '/media/audit',
          method: 'put',
          data: this.formData
        }).finally(() => {
          this.loading = false
        })
      },
      saveInvoice() {
        this.loading = true
        request({
          url: '/media/invoice',
          method: 'put',
          data: this.formData.invoice
        }).finally(() => {
          this.loading = false
        })
      },
      saveOption() {
        this.loading = true
        request({
          url: '/media/industryUser',
          method: 'put',
          data: this.formData.industryUser
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .el-cascader {
    width: 100%;
  }
</style>
