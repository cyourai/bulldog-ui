<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content"
         v-loading="loading">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">流程部署</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="流程名称："
                            prop="name">
                <el-input v-model="filterFormData.name"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入流程名"></el-input>
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
                       @click="openInsertDialog">新建流程
            </el-button>
          </component-filter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>流程列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">

              <!-- table-grid组件 -->
              <table-grid ref="processTable"
                          :query-param='queryParam'
                          :select-url='selectUrl'
                          :select-child-url='selectChildUrl'
                          :headers='headers'
                          :is-has-child="isHasChild"
                          v-loading="loading"
                          @selection-change="handleSelectionChange">
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 label="部署结果"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tag type="danger"
                            v-if="typeof scope.row.deploymentId !== 'string'">未部署</el-tag>
                    <el-tag type="success"
                            v-else>已部署</el-tag>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 label="操作"
                                 width="400px"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-edit"
                                 size="mini"
                                 type="primary"
                                 @click="edit(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="top">
                      <el-button plain
                                 icon="el-icon-delete"
                                 size="mini"
                                 type="danger"
                                 @click="del(scope.row)"></el-button>
                    </el-tooltip>
                    <el-button plain
                               size="mini"
                               type="warning"
                               @click="deploy(scope.row)">部署
                    </el-button>
                    <el-button plain
                               size="mini"
                               type="success"
                               @click="startModel(scope.row)">启动
                    </el-button>
                  </template>
                </el-table-column>
                <!--批量操作-->
                <div slot="batch-slot">
                  <el-select v-model="batchFilterData"
                             placeholder="批量操作">
                    <el-option label="批量删除"
                               key="delete"
                               value="delete">
                    </el-option>
                  </el-select>
                  <el-button type="primary"
                             plain
                             class="table-content-page-search"
                             @click="batchExecute()">确定
                  </el-button>
                </div>
              </table-grid>
            </div>
          </div>

          <!-- 新建流程表单 -->
          <el-dialog title="新建流程"
                     :visible.sync="insertFormVisible">
            <el-form :model="insertForm"
                     :rules="insertRules"
                     ref="insertForm">
              <el-form-item label="流程名称"
                            label-width="120px"
                            prop="name">
                <el-input v-model="insertForm.name"
                          placeholder="避免与已有流程名称重复"
                          @keyup.enter.native="insert()"></el-input>
              </el-form-item>
              <el-form-item label="请选择"
                            label-width="120px">
                <div>
                  <el-radio-group v-model="insertForm.isSub">
                    <el-radio v-model="radio"
                              label="0">主流程
                    </el-radio>
                    <el-radio v-model="radio"
                              label="1">子流程
                    </el-radio>
                  </el-radio-group>
                </div>
                <div>
                  <el-radio-group v-model="insertForm.exerciseType">
                    <el-radio v-model="radio"
                              v-if="insertForm.isSub==0"
                              label="0">真实演练
                    </el-radio>
                    <el-radio v-model="radio"
                              v-if="insertForm.isSub==0"
                              label="1">模拟演练
                    </el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="insertFormVisible = false">取 消</el-button>
              <el-button type="primary"
                         @click="insert()">确 定
              </el-button>
            </div>
          </el-dialog>

          <!-- 启动流程表单 -->
          <el-dialog title="启动流程"
                     :visible.sync="startFormVisible">
            <el-form :model="startForm"
                     :rules="startRules"
                     ref="startForm">
              <el-form-item label="演练流程名称"
                            label-width="120px"
                            prop="businessKey">
                <el-input v-model="startForm.businessKey"
                          placeholder="避免与已有演练名称重复"
                          @keyup.enter.native="start()"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="startFormVisible = false">取 消</el-button>
              <el-button type="primary"
                         @click="start()">确 定
              </el-button>
            </div>
          </el-dialog>

          <!-- 启动流程表单 -->
          <el-dialog title="启动流程"
                     :visible.sync="startFormVisible">
            <el-form :model="startForm"
                     :rules="startRules"
                     ref="startForm">
              <el-form-item label="演练流程名称"
                            label-width="120px"
                            prop="businessKey">
                <el-input v-model="startForm.businessKey"
                          placeholder="避免与已有演练名称重复"
                          @keyup.enter.native="start()"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="startFormVisible = false">取 消</el-button>
              <el-button type="primary"
                         @click="start()">确 定
              </el-button>
            </div>
          </el-dialog>

          <!--部署结果弹窗-->
          <el-dialog title="部署结果"
                     :visible.sync="dialogVisible"
                     width="60%">
            <div v-html="deployResult"
                 class="dialog"></div>
            <span slot="footer"
                  class="dialog-footer">
              <el-button type="primary"
                         @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </div>
    </div v-loading="loading">
  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import {
  deleteByCode,
  batchExecute,
  insertProcessModel
} from '@/api/process/process'
import { request, isEmpty } from '@/utils'
import { TableGrid } from 'cyourai-vue-dialog'

export default {
  name: 'process-deploy',
  components: {
    ComponentSelect,
    ComponentFilter,
    TableGrid
  },
  data() {
    return {
      // table加载
      loading: false,
      // 筛选项
      filterFormData: {
        name: ''
      },
      // 表头
      headers: [
        { prop: 'name', sortKey: 'NAME_', label: '流程名称', sortable: 'custom' },
        { prop: 'lastUpdateTime', sortKey: 'LAST_UPDATE_TIME_', label: '最后更新时间', sortable: 'custom', minWidth: '200' }
      ],
      // 是否显示子行
      isHasChild: true,
      // 多选选中行
      multipleSelection: [],
      // 分页查询所有主流程列表
      selectUrl: '/process/actremodel/selectModelListForMain',
      // 查询模型的所有的子流程及子子流程-不分页
      selectChildUrl: '/process/actremodel/selectChildModelByModelId/',
      // 部署流程
      deployProcess: '/process/createDeploy/',
      // 启动流程
      startProcess: '/process/startProcessByDeploymentId',
      queryParam: {},
      // 批量操作标记位
      batchFilterData: '',
      // 新建流程对话框
      insertFormVisible: false,
      // 启动流程对话框
      startFormVisible: false,
      // 新建流程表单
      insertForm: {
        id: '',
        name: '',
        key: 'key',
        description: 'des',
        modelxml: '',
        imgstr: '',
        isSub: '0',
        exerciseType: '0'
      },
      // 启动流程表单
      startForm: {
        businessKey: '',
        processInstanceName: '',
        deploymentId: ''
      },
      // 部署dialog是否显示
      dialogVisible: false,
      // 部署结果
      deployResult: '',
      // 新增流程默认选项
      radio: '0',
      // 新增流程规则
      insertRules: {
        name: [
          { required: true, message: '请输入流程定义名称', trigger: 'blur' }
        ]
      },
      // 启动流程规则
      startRules: {
        businessKey: [
          { required: true, message: '请输入演练名称/工作名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 页面初始化
    this.init()
  },
  methods: {
    init() {
    },
    selectionChange(selection) {
      // console.debug(selection)
    },
    refreshTable() {
      this.queryParam = this.filterFormData
      // console.log(this.filterFormData)
      // 表格数据初始化
      this.$refs.processTable.refreshTable()
    },
    openInsertDialog() {
      this.insertForm.name = ''
      this.insertForm.isSub = '0'
      this.insertForm.exerciseType = '0'
      this.insertFormVisible = true
    },
    insert() {
      // 新增
      this.$refs.insertForm.validate((valid) => {
        if (valid) {
          this.insertFormVisible = false
          insertProcessModel(this.insertForm).then(result => {
            // console.debug(result.data)
            if (result.data.status === 20000) {
              this.$router.push({
                path: '/processManager/process-edit',
                name: 'process-edit',
                params: {
                  modelId: result.data.modelId
                }
              })
            }
          })
        }
      })
    },
    del(row) {
      // 删除
      var array = []
      array.push(row.id)
      // console.log(array)
      deleteByCode(this, array)
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/processManager/process-edit',
        name: 'process-edit',
        params: {
          modelId: row.id
        }
      })
    },
    // 部署流程
    deploy(row) {
      this.loading = true
      request({
        url: this.deployProcess + +row.id,
        method: 'get'
      }).then(result => {
        this.dialogVisible = true
        this.deployResult = result.data.data
      }).finally(() => {
        this.loading = false
        this.refreshTable()
      })
    },
    // 启动流程
    start() {
      this.$refs.startForm.validate((valid) => {
        if (valid) {
          this.startFormVisible = false
          this.loading = true
          this.startForm.processInstanceName = this.startForm.businessKey
          this.loading = true
          request({
            url: this.startProcess,
            method: 'post',
            params: this.startForm
          }).finally(() => {
            this.loading = false
            this.refreshTable()
          })
        }
      })
    },
    // 启动流程
    startModel(row) {
      // console.log(row)
      if (isEmpty(row.deploymentId)) {
        this.$alert('请先部署流程')
        return
      }
      this.startForm.deploymentId = row.deploymentId
      this.startFormVisible = true
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
    },
    batchExecute() {
      // 批量操作
      batchExecute(this)
    }
  },
  watch: {
    $route(to, from) {
      this.refreshTable()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';

.file-table /deep/ {
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
}

.table-grid-contain /deep/ {
  .table-content-page {
    height: 56px !important;
  }
}
</style>
