<template>
  <div class="container" v-loading="loading"
       :is-select-model="isSelectModel"
       :select-row="selectRow">
    <div class="content">
      <div class="plan-container">
        <el-container>
          <!--左 预案树-->
          <el-aside width="350px" class="left-panel">
            <vue-tree
              id="planTree"
              :is-edit="!isSelectModel"
              :style-class="treeClass"
              :init-tree-url="initTreeUrl"
              :update-tree-url="updateTreeUrl"
              :del-tree-url="delTreeUrl"
              :insert-tree-url="insertTreeUrl"
              :height="height"
              @click-node="treeClickNodeHandler">
            </vue-tree>
          </el-aside>
          <!--右 预案-->
          <el-container class="right-panel is-vertical">
            <table-header ref="tableHeader"
                          :tree-level="treeLevel"
                          :search-url="searchUrl"
                          @list="showSearchList">
              <div class="options" slot="option-slot">
                <el-button plain
                           icon="el-icon-picture"
                           size="mini"
                           type="primary"
                           @click="showReports()">预案视图
                </el-button>
                <el-button type="success"
                           v-if="!isSelectModel"
                           icon="el-icon-plus"
                           @click="openPlanClickHandler(false)"> 新增预案
                </el-button>
              </div>
            </table-header>
            <!--预案table-->
            <el-main class="right-panel-main">
              <table-grid ref="tablePlan"
                          :is-show-border='false'
                          :is-show-footer='false'
                          :is-show-checkbox='isSelectModel'
                          :is-show-stripe='false'
                          :height='height'
                          :query-param='param'
                          :select-url='selectUrl'
                          :table-list='list'
                          :headers='headers'
                          @selection-change="handleSelectionChange"
                          @current-change='handleCurrentChange'>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot" v-if="!isSelectModel"
                                 label="操作"
                                 min-width="900"
                                 align="center">
                  <template slot-scope="scope">
                    <div class="buttons">
                      <el-tooltip content="编辑"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-edit"
                                   size="mini"
                                   type="primary"
                                   @click="openPlanClickHandler(true, scope.row)"></el-button>
                      </el-tooltip>
                      <el-tooltip content="删除"
                                  placement="right">
                        <el-button plain
                                   icon="el-icon-delete"
                                   size="mini"
                                   type="danger"
                                   @click="del(scope.row)"></el-button>
                      </el-tooltip>
                      <el-button plain
                                 icon="el-icon-circle-plus-outline"
                                 size="mini"
                                 type="warning"
                                 @click="bindProcess(scope.row)">绑定应急流程
                      </el-button>
                      <el-button plain
                                 icon="el-icon-edit-outline"
                                 size="mini"
                                 type="primary"
                                 @click="editFile(scope.row)">预案文档编辑
                      </el-button>
                      <el-button class="uploaderRepository"
                                 plain
                                 icon="el-icon-news"
                                 size="mini"
                                 type="success"
                                 @click="uploadFromRepository(scope.row)">从知识库选取
                      </el-button>
                      <el-upload class="uploader"
                                 ref="upload"
                                 action=''
                                 multiple
                                 :http-request="uploadHandler"
                                 :show-file-list='false'
                                 :data="{relateCode: scope.row.planCode, uploadType: 'doc'}"
                                 accept=".doc,.docx,.xls,.xlsx,ppt,pptp,pdf,txt">
                        <el-button plain
                                   icon="el-icon-upload"
                                   size="mini"
                                   type="info">上传应急文档
                        </el-button>
                      </el-upload>
                    </div>
                  </template>
                </el-table-column>
              </table-grid>
            </el-main>
            <!--绑定窗口-->
            <el-footer class="right-panel-footer">
              <div class="right-panel-footer-header">
                <span class="title" v-if="param.planName !== ''">预案 [{{param.planName}}] 应急文档 / 应急流程</span>
              </div>
              <div class="right-panel-footer-main" v-loading="bindLoading">
                <div class="file-container">
                  <ul v-if="uploadList.length > 0">
                    <li v-for="(item, index) in uploadList" :key="index">
                      <el-row :gutter="2">
                        <el-col :span="20">
                          <a href="javascript:void(0)" @click="downloadFile(item.uploadCode)"
                                             class="download-link">{{item.uploadRealName}}</a>
                            <el-button plain
                                       icon="el-icon-search"
                                       size="mini"
                                       type="info"
                                       @click="viewDoc(item.uploadCode, item.uploadRealName)"></el-button>
                        </el-col>
                        <el-col :span="4"><span @click="delFile(item.uploadCode, param.planCode)"><svg-icon
                          icon-class="delete" class="del-btn"/></span></el-col>
                      </el-row>
                    </li>
                  </ul>
                </div>
                <div class="process-container">
                  <ul v-if="actReModelList.length > 0">
                    <li v-for="(item, index) in actReModelList" :key="index">
                      <a href="javascript:void(0)" class="download-link">{{item.name}}</a>
                      <!-- 远近景视图按钮 -->
                      <show-model :modelId="item.id"
                                  :taskId="item.taskId"></show-model>
                    </li>
                  </ul>
                </div>
              </div>
            </el-footer>
          </el-container>
        </el-container>
      </div>
    </div>
    <el-dialog :title="dialogTitle + '预案'" :visible.sync="dialogVisible">
      <el-form ref="planForm"
               :model="form"
               :rules="formRules"
               label-width="80px">
        <el-form-item label="预案名称" prop="planName">
          <el-input style="margin-left: 0px" v-model="form.planName"  placeholder="请输入预案名称"></el-input>
        </el-form-item>
        <el-form-item label="预案描述" prop="planRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder="请输入内容"
            v-model="form.planRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPlanForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--绑定主流程-->
    <dialog-transfer ref="dialogTransfer"
                     :init-url="initUrl"
                     :titles="titles"
                     filterPlaceholder="流程名称"
                     @submit="dialogSubmit">
    </dialog-transfer>

    <el-dialog title=""
               :visible.sync="visable"
               width="85%"
               ref="repositoryDialog">
      <div class="transfer-panel">
        <repositoryUpload :is-select-model="true"
                          :select-upload-code="formData.planCode"
                          @selection-change="selectionChange">
        </repositoryUpload>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="title"
               :visible.sync="dialogDocVisible"
               width="60%">
      <div v-html="fileContent" v-if="!viewLoading"></div>
    </el-dialog>
  </div>
</template>

<script>
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentFilter from '@/components/ComponentFilter'
  import { TableGrid, TableHeader, VueTree, DialogTransfer } from 'cyourai-vue-dialog'
  import { isNotEmpty, request } from '@/utils'
  import { insert, deleteByCode, update } from '@/api/emergency/plan'
  import { downloadFile, delFile } from '@/api/upload'
  import RepositoryUpload from '../repository/repositoryUpload'
  import ShowModel from '@/components/ComponentButton/showModel'

  export default {
    name: 'plan',
    components: {
      ComponentSelect,
      ComponentFilter,
      TableGrid,
      TableHeader,
      DialogTransfer,
      VueTree,
      RepositoryUpload,
      ShowModel
    },
    watch: {
      $route(to, from) {
        this.refreshTable()
      }
    },
    props: {
      isSelectModel: {
        type: Boolean,
        required: false,
        default: false
      },
      selectRow: {
        type: Array,
        required: false,
        default: function() {
          return []
        }
      }
    },
    created() {
    },
    data() {
      return {
        border: false,
        dialogVisible: false,
        dialogDocVisible: false,
        loading: false,
        bindLoading: false,
        viewLoading: false,
        // 预案弹出框title
        dialogTitle: '新增预案',
        // 左侧树形预案分类
        initTreeUrl: '/general/tree/selectTreeListByRootCode/treePlanRoot',
        delTreeUrl: '/general/tree/',
        updateTreeUrl: '/general/tree/',
        insertTreeUrl: '/general/tree/insert',
        // 查询预案
        selectUrl: '',
        // 主流程穿梭框
        initUrl: '',
        // 树形样式
        treeClass: 'width:450px',
        // 树形层级
        treeLevel: '',
        // 预案表格高度
        height: '350',
        // 预案预案内容
        fileContent: '',
        // 表头
        headers: [
          { prop: 'planName', label: '预案名称', sortable: 'custom', minWidth: '180' },
          { prop: 'planRemark', label: '预案描述', minWidth: '250' },
          { prop: 'planVersion', label: '预案版本信息', minWidth: '250' },
          { prop: 'createUser', label: '作者', sortable: 'custom', minWidth: '100' }
        ],
        // 查询参数(当前活的的节点)
        param: {
          treeCode: '',
          treeType: 'root',
          planName: ''
        },
        // 预案表单
        form: {
          planName: '',
          planRemark: '',
          planCode: '',
          treeCode: ''
        },
        // 绑定上传列表
        uploadList: [],
        // 绑定流程列表
        actReModelList: [],
        // 是否为更新状态
        isEdit: true,
        // 表单规则
        formRules: {
          planName: [
            { required: true, message: '请输入预案名称', trigger: 'blur' }
          ]
        },
        titles: ['应急流程', '已选的流程'],
        // 是否显示dialog
        visable: false,
        // 表单数据
        formData: {
          uploadCodeList: []
        },
        // 上传关联编号
        uploadRelate: '',
        // 预案文档标题
        title: '',
        // 搜索请求路径
        searchUrl: '/topic/plan/selectPlanProcessFileListByPlanName',
        // 搜索结果list
        list: []
      }
    },
    methods: {
      refreshTable() {
        // 表格数据初始化
        this.$refs.tablePlan.refreshTable()
      },
      refreshUploadResultList() {
        // 刷新绑定列表
        this.bindLoading = true
        const params = {}
        params.planCode = this.param.planCode
        request({
          url: '/topic/plan/selectPlanProcessFileList',
          method: 'get',
          params
        }).then(result => {
          this.uploadList = result.data.uploadList
          this.actReModelList = result.data.actReModelList
          if (this.selectRow.length > 0) {
            this.selectRow.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          }
        }).finally(() => {
          this.bindLoading = false
        })
      },
      clearBindList() {
        this.uploadList = []
        this.actReModelList = []
      },
      treeClickNodeHandler(param) {
        // 点击节点
        this.treeLevel = isNotEmpty(param.treeLevel) ? param.treeLevel.join(' / ') : ''
        this.param.treeCode = param.treeCode
        this.param.treeType = param.treeType
        this.form.treeCode = param.treeCode
        this.param.planName = ''
        this.param.planRemark = ''
        this.param.planCode = ''
        if (param.treeType === 'root') {
          this.param.treeCode = ''
        } else {
          // 查询对应表格
          this.selectUrl = `/topic/plan/selectPlanProcessFileListByTreeCode/${param.treeCode}`
        }
      },
      openPlanClickHandler(isEdit, row) {
        this.dialogTitle = isEdit ? '更新' : '新增'
        this.isEdit = isEdit
        // 打开预案编辑窗口
        if (this.param.treeType === 'root') {
          this.$alert('请选择左侧分组')
        } else {
          this.dialogVisible = true
          if (this.isEdit) {
            // 更新
            this.form.planName = row.planName
            this.form.planRemark = row.planRemark
            this.form.planCode = row.planCode
          } else {
            // 新增
            this.form.planName = ''
            this.form.planRemark = ''
            this.form.planCode = null
          }
        }
      },
      submitPlanForm() {
        // 提交预案
        this.$refs.planForm.validate(valid => {
          if (valid && this.isEdit) {
            // 更新
            update(this.form).then(() => {
              this.refreshTable()
              this.dialogVisible = false
            })
          } else if (valid && !this.isEdit) {
            // 新增
            insert(this.form).then(() => {
              this.refreshTable()
              this.dialogVisible = false
            })
          } else {
            return false
          }
        })
      },
      del(row) {
        // 删除预案
        deleteByCode(row.planCode, this)
      },
      bindProcess(row) {
        // 绑定主流程
        this.initUrl = `/topic/plan/selectPlanProcessTransfer/${row.planCode}`
        this.$refs.dialogTransfer.showDialog()
      },
      handleCurrentChange(selection) {
        // 选中一行
        if (selection.row != null) {
          this.param.planName = selection.row.planName
          this.param.planCode = selection.row.planCode
          this.refreshUploadResultList()
        } else {
          this.clearBindList()
        }
        // console.debug(selection.row.planName)
      },
      uploadHandler(param) {
        // console.debug('uploadHandler: %s', param)
        this.loading = true
        var form = new FormData()
        form.append('file', param.file, param.file['filename'])
        form.append('relateCode', param.data.relateCode)
        form.append('uploadType', param.data.uploadType)
        request({
          // zuul/api 前置zuul对应上传中文问题
          baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
          url: '/general/upload/uploadFile',
          method: 'post',
          data: form,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data;boundary=boundary'
            }
          }
        }).then(() => {
          this.refreshUploadResultList()
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          this.fileList = []
          this.loading = false
        })
      },
      downloadFile(uploadCode) {
        downloadFile(uploadCode)
      },
      delFile(uploadCode) {
        delFile(uploadCode, this)
      },
      dialogSubmit(params) {
        this.loading = true
        const data = {}
        data.planCode = this.param.planCode
        data.selectedProcessIdList = params.value
        request({
          url: `/topic/plan/savePlanProcess`,
          method: 'post',
          data
        }).then(() => {
          this.refreshUploadResultList()
        }).finally(() => {
          this.loading = false
          this.$refs.dialogTransfer.closeDialog()
        })
      },
      handleSelectionChange(selection) {
        this.$emit('selection-change', {
          selection: selection.selection
        })
      },
      selectionChange(selection) {
        this.selection = selection.selection
      },
      uploadFromRepository(row) {
        // 从知识库选取上传
        this.visable = true
        // console.log(row.planCode)
        this.uploadRelate = row.planCode
      },
      submitDialog() {
        this.visable = false
        this.loading = true
        if (this.selection.length > 0) {
          this.formData.uploadCodeList = []
          for (let i = 0; i < this.selection.length; i++) {
            this.formData.uploadCodeList.push(this.selection[i].uploadCode)
          }
          // console.log(this.formData.uploadCodeList)
          const data = {
            uploadRelate: this.uploadRelate,
            transferUploadCodes: this.formData.uploadCodeList
          }
          request({
            url: '/general/upload/cloneFile',
            method: 'post',
            data
          }).then(() => {
            this.refreshUploadResultList()
          }).finally(() => {
            this.loading = false
          })
        }
      },
      editFile(row) {
        // 编辑预案文档
        this.$router.push({
          path: '/emergency/plan-file-edit',
          name: 'plan-file-edit',
          params: {
            planCode: row.planCode
          }
        })
      },
      showReports() {
        // 报表展示
        const url = '#/view/viewPlan'
        window.open(url, '_self')
      },
      // 查看预案文档
      viewDoc(uploadCode, uploadName) {
        this.dialogDocVisible = true
        this.title = uploadName
        this.viewLoading = true
        const data = {
          uploadCode: uploadCode
        }
        request({
          url: '/general/upload/read',
          method: 'post',
          data
        }).then(result => {
          this.fileContent = result.data.content
        }).finally(() => {
          this.viewLoading = false
        })
      },
      showSearchList(data) {
        this.list = data
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  @import '~@/styles/smart-ui/plan.scss';
  .el-input {
    margin-left: 280px;
  }
</style>
