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
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="用户名"
                            prop="auditUserName">
                <el-input v-model="formData.auditUserName"
                          placeholder="用户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="名称"
                            prop="auditName">
                <el-input v-model="formData.auditName"
                          placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="联系人姓名"
                            prop="auditContactName">
                <el-input v-model="formData.auditContactName"
                          placeholder="联系人姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="联系电话"
                            prop="auditContactPhone">
                <el-input v-model="formData.auditContactPhone"
                          placeholder="联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="联系地址"
                            prop="auditAddress">
                <el-input v-model="formData.auditAddress"
                          placeholder="联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
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
            <el-col :span="18"
                    :offset="3">
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
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="营业执照"
                            prop="auditBusinessLicense">
                <span v-if="this.formData.auditBusinessLicense === ''">未提交</span>
                <span v-else>
                  <pic-magnify :picUrl="formData.auditBusinessLicense"></pic-magnify>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="授权证明/所有证明"
                            prop="auditAuthCertificate">
                <span v-if="this.formData.auditAuthCertificate === ''">未提交</span>
                <span v-else>
                  <pic-magnify :picUrl="formData.auditAuthCertificate"></pic-magnify>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="身份证正面"
                            prop="auditIdCardFront">
                <span v-if="this.formData.auditIdCardFront === ''">未提交</span>
                <span v-else>
                  <pic-magnify :picUrl="formData.auditIdCardFront"></pic-magnify>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="身份证反面"
                            prop="auditIdCardReverse">
                <span v-if="this.formData.auditIdCardReverse === ''">未提交</span>
                <span v-else>
                  <pic-magnify :picUrl="formData.auditIdCardReverse"></pic-magnify>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="发票附件"
                            prop="auditInvoiceAttachement">
                <span v-if="this.formData.auditInvoiceAttachement === ''">未提交</span>
                <span v-else>
                  <a :href="this.formData.auditInvoiceAttachement">发票附件下载</a>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <hr>
          </el-row>
          <div v-if="formData.invoice!==''">
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="发票名称"
                              prop="invoiceName">
                  <el-input v-model="formData.invoice.invoiceName"
                            placeholder="发票名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="信用代码"
                              prop="invoiceCreditCode">
                  <el-input v-model="formData.invoice.invoiceCreditCode"
                            placeholder="信用代码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="注册地址"
                              prop="invoiceRegisterAddress">
                  <el-input v-model="formData.invoice.invoiceRegisterAddress"
                            placeholder="注册地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="注册电话"
                              prop="invoiceRegisterPhone">
                  <el-input v-model="formData.invoice.invoiceRegisterPhone"
                            placeholder="注册电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="开户银行"
                              prop="invoiceBankName">
                  <el-input v-model="formData.invoice.invoiceBankName"
                            placeholder="开户银行"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="银行账户"
                              prop="invoiceBankAccount">
                  <el-input v-model="formData.invoice.invoiceBankAccount"
                            placeholder="银行账户"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18"
                      :offset="3">
                <el-form-item label="邮寄地址"
                              prop="invoicePostAddress">
                  <el-input v-model="formData.invoice.invoicePostAddress"
                            placeholder="邮寄地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="备注"
                            prop="remark">
                <el-input type="textarea"
                          v-model="formData.remark"
                          :autosize="{ minRows: 2, maxRows: 20}"
                          placeholder="拒绝时需要填写拒绝原因">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <hr>
          <el-row>
            <el-col :span="18"
                    :offset="3">
              <el-form-item label="用户对应的媒体主"
                            prop="mediaSellerCode"
                            v-if="formData.auditRegisterType!='bull'">
                <el-select v-model="formData.mediaSellerCode"
                           size="medium"
                           filterable
                           remote
                           reserve-keyword
                           no-data-text="..."
                           placeholder="请输入媒体主名称/简称并选择"
                           :remote-method="getMediaSellerSelect"
                           :loading="loading">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="广告主所属的行业"
                            prop="industry"
                            v-if="formData.auditRegisterType=='bull'">
                <component-cascader type="industry"
                                    model="media"
                                    defaultSelected=""
                                    @cascaderChangeCallBack="cascaderIndustryChangeCallBack"></component-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="form-content-submit">
            <el-col :span="18"
                    :offset="1"
                    class="text-center">
              <el-form-item>
                <el-button type="warning"
                           icon="el-icon-tickets"
                           @click="close()"> 关 闭
                </el-button>
                <el-button type="danger"
                           icon="el-icon-close"
                           @click="reject()"> 拒 绝
                </el-button>
                <el-button type="success"
                           class="largeBtn"
                           icon="el-icon-check"
                           @click="agree()"> 同 意
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { request } from '@/utils/request'
  import { PicMagnify } from 'cyourai-vue-dialog'
  import store from '@/store'
  import { Message, errorMsg } from 'element-ui'
  import { params, closeView, isEmpty, debug, error } from '@/utils'
  import { getMediaSellerSelect } from '@/api/published/published'
  import ComponentCascader from '@/components/ComponentCascader'

  export default {
    name: 'approveRegisterInfo',
    components: { PicMagnify, Message, ComponentCascader },
    data() {
      return {
        loading: false,
        // title字段
        pageTitle: '用户注册审批',
        // 表单数据
        formData: {
          // 媒体主编号
          mediaSellerCode: '',
          // 注册用户类型
          auditRegisterType: '',
          // 广告主用户行业编号
          industryUserIndeustryKey: '',
          // 广告主用户名
          industryUserUserName: '',
          remark: ''
        },
        options: [],
        // 表单规则
        formRules: {},
        // 流程业务Key
        businessKey: '',
        // 任务id
        viewName: 'approveRegisterInfo',
        // 接收用户参数
        taskId: '',
        userName: ''
      }
    },
    created() {
      // 页面初始化
      this.userName = params(this, 'userName')
      this.taskId = params(this, 'taskId')
      this.init()
    },
    mounted() {
    },
    computed: {},
    methods: {
      init() {
        this.loading = true
        // console.debug(this.tableData.sort)
        return request({
          url: '/media/audit/findAuditInvoiceByUserName/' + this.userName,
          method: 'get'
        })
          .then(result => {
            this.formData = result.data
            debug('init:', this.formData)
            if (this.formData === null || this.formData === '') {
              Message({
                message: '用户未提交证明材料',
                type: 'warning',
                duration: 5 * 1000
              })
            }
          })
          .catch(e => {
            error(e)
            errorMsg('无法找到该用户提交的资料')
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      },
      close() {
        closeView(this, this.viewName)
      },
      getMediaSellerSelect(keyWord) {
        // 远程搜索媒体主
        getMediaSellerSelect(keyWord).then(result => {
          this.options = result.data.options
        })
      },
      agree() {
        if (isEmpty(this.formData.mediaSellerCode) && this.formData.auditRegisterType !== 'bull') {
          Message({
            message: '媒体主/代理商需要绑定对应的媒体信息',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        if (isEmpty(this.formData.industryUserIndeustryKey) && this.formData.auditRegisterType === 'bull') {
          Message({
            message: '请指定广告主所属的行业,以便计算刊例的折扣',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        this.$confirm('确定同意?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.loading = true
          return request({
            message: '已通过审核',
            url: '/media/audit/agree/',
            method: 'post',
            data: {
              auditUserName: this.userName, // 被审批用户
              taskId: this.taskId, // 任务编号
              currentUserName: store.state.user.userName, // 审批人
              // 媒体主编号
              mediaSellerCode: this.formData.mediaSellerCode,
              // 注册用户类型
              auditRegisterType: this.formData.auditRegisterType,
              // 广告主用户行业编号
              industryUserIndeustryKey: this.formData.industryUserIndeustryKey,
              // 广告主用户名
              industryUserUserName: this.userName,
              remark: this.formData.remark
            }
          }).then(() => {
            this.loading = false
            this.close()
          })
            .catch(() => {
            })
        }).catch(e => {
          error(e)
          this.loading = false
        })
          .finally(() => {
            this.loading = false
          })
      },
      reject() {
        debug('reject:', this.formData.remark)
        if (isEmpty(this.formData.remark)) {
          Message({
            message: '拒绝时需填写拒绝原因',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        this.loading = true
        this.$confirm('确定拒绝?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return request({
              message: '已拒绝',
              url: '/media/audit/reject/',
              method: 'post',
              data: {
                auditUserName: this.userName, // 被审批用户
                taskId: this.taskId, // 任务编号
                remark: this.formData.remark, // 拒绝原因
                currentUserName: store.state.user.userName // 审批人
              }
            }).then(() => {
              this.close()
              this.loading = false
            })
          })
          .catch(e => {
            error(e)
          })
          .finally(() => {
            this.loading = false
          })
      },
      cascaderIndustryChangeCallBack(value) {
        this.formData.industryUserIndeustryKey = value.join(',')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .el-select {
    width: 100% !important;
  }

  .el-cascader {
    width: 100% !important;
  }
</style>
