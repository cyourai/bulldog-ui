<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content" v-loading="loading">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{title}}</p>
        <div class="content-spe-element">
          <!-- 追加：收件人 -->
          <div class="table-content"
               v-if="!isMsg">
            <div class="table-content-header">
              <i class="el-icon-message"
                 style="font-size:16px"></i>
              <span>邮箱设置</span>
            </div>
            <div class="table-content-spe spe-mail"
                 style="border:1px solid #e6e6e6 ; padding:20px 20px 0 20px">
              <el-form ref="mailForm"
                       :model="mailForm"
                       label-width="120px">
                <el-row :gutter="20">
                  <el-col :span="8"
                          :offset="4">
                    <el-form-item label="收件人">
                      <el-input v-model="mailForm.smtpTo" placeholder="多个收件人用分号';'分隔"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发件人">
                      <el-input v-model="mailForm.smtpFrom"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8"
                          :offset="4">
                    <el-form-item label="服务器地址">
                      <el-input v-model="mailForm.smtpHost"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务器端口">
                      <el-input v-model="mailForm.smtpPort"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8"
                          :offset="4">
                    <el-form-item label="用户名">
                      <el-input v-model="mailForm.smtpUserName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="密码">
                      <el-input v-model="mailForm.smtpPassword"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8"
                          :offset="4">
                    <el-form-item label="是否通过ssl 加密">
                      <el-switch v-model="mailForm.isSSL"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>
            </div>
          </div>

          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="80px"
                     label-position="left">
              <el-form-item label="模板名称："
                            prop="templateName">
                <el-input v-model="filterFormData.templateName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入模板名称"></el-input>
              </el-form-item>
            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-plus"
                       size="mini"
                       type="success"
                       plain
                       @click="openClickHandler(null)">新增
            </el-button>
          </component-filter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"></i>
              <span>数据列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">
              <table-grid ref="tableGrid"
                          :query-param='filterFormData'
                          :headers='headers'
                          :select-url='selectUrl'
                          @selection-change="handleSelectionChange">
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 min-width="260"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="发送"
                                v-show="!isMsg"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-message"
                                 size="mini"
                                 type="success"
                                 @click="sendMail(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑"
                                :placement="isMsg ? 'left': 'top'">
                      <el-button plain
                                 icon="el-icon-edit"
                                 size="mini"
                                 type="primary"
                                 @click="openClickHandler(scope.row.templateCode)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="right">
                      <el-button plain
                                 icon="el-icon-delete"
                                 size="mini"
                                 type="danger"
                                 @click="del(scope.row)"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </table-grid>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import ComponentFilter from '@/components/ComponentFilter'
  import { deleteByCode, batctExecute } from '@/api/template'
  import { selectSettingByKey } from '@/api/settings/settings'
  import { sendMail } from '@/api/mail/message'
  import { TableGrid } from 'cyourai-vue-dialog'
  import { clearParam } from '@/utils'

  export default {
    name: 'templateionary',
    components: {
      ComponentFilter, TableGrid
    },
    watch: {
      $route(to, from) {
        this.init()
        this.refreshTable()
      }
    },
    data() {
      return {
        loading: false,
        // 标题
        title: '',
        // 筛选
        filterFormData: {
          // 模板名称
          templateName: '',
          // 模板类型 msg:短信模板 mail:邮件模板
          templateType: 'msg',
          // 默认排序
          defaultSort: "[{'prop':'templateId', 'order': 'desc'}]"
        },
        // 表单规则
        formRules: {
          smtpTo: [
            { required: true, message: '收件人不能为空', trigger: 'blur' }
          ]
        },
        // 发邮件表单
        mailForm: {
          // 邮件服务器地址
          smtpHost: '',
          // 邮件服务器端口
          smtpPort: '',
          // 邮件服务器用户名
          smtpUserName: '',
          // 邮件服务器用户名密码
          smtpPassword: '',
          // 邮件服务器是否ssl加密
          isSSL: true,
          // 邮件服务器发件人
          smtpFrom: '',
          // 邮件服务器收件人
          smtpTo: '',
          // 邮件标题
          smtpTitle: '',
          // 邮件内容
          smtpContent: ''
        },
        // 表头
        headers: [
          { prop: 'templateName', label: '模板名称', minWidth: '100', sortable: 'custom' },
          { prop: 'templateKey', label: '模板索引键', minWidth: '100', sortable: 'custom' },
          { prop: 'templateValue', label: '模板值', minWidth: '200', sortable: 'custom' }
        ],
        // 分页查询所有验证条件列表
        selectUrl:
                '/center/template/page',
        // 批量操作标记位
        batchFilterData:
                '',
        // 模板类型：true->短信模板 false->邮件模板
        isMsg: false
      }
    },
    created() {
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        this.isMsg = this.$route.meta.type === 'msg'
        this.filterFormData.templateType = this.isMsg ? 'msg' : 'mail'
        if (!this.isMsg) {
          this.loading = true
          selectSettingByKey('mail').then((result) => {
            // console.debug(result.data.data)
            this.mailForm = JSON.parse(result.data.settingValue)
          }).finally(() => {
            this.loading = false
          })
        }
      },
      refreshTable() {
        this.$refs.tableGrid.refreshTable()
      },
      openClickHandler(templateCode) {
        if (templateCode === null) {
          // 新增
          clearParam('templateCode')
          this.$router.push({
            path: '/settings/templateEdit',
            name: 'template-edit',
            params: {
              templateCode: null,
              templateType: this.filterFormData.templateType
            }
          })
        } else {
          this.$router.push({
            path: '/settings/templateEdit',
            name: 'template-edit',
            params: {
              templateCode: templateCode,
              templateType: this.filterFormData.templateType
            }
          })
        }
      },
      del(row) {
        // 删除
        deleteByCode(row.templateCode, this)
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 发送邮件
      sendMail(row) {
        this.$refs['mailForm'].validate(valid => {
          if (valid) {
            this.loading = true
            this.mailForm.smtpTitle = row.templateName
            this.mailForm.smtpContent = row.templateValue
            sendMail(this.mailForm).finally(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .container /deep/ {
    .spe-mail {
      .el-input {
        width: 100%;

        input {
          text-align: left;
        }
      }
    }
  }
</style>

