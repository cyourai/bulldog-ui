<template>
  <div class="container"
       v-loading="loading"
       :is-select-model="isSelectModel"
       :init-tree-url="initTreeUrl"
       :select-row="selectRow"
       @selection-change>
    <div class="content">
      <div class="job-container">
        <el-container>
          <!--左 工作组树-->
          <el-aside width="350px"
                    class="left-panel">
            <vue-tree id="jobTree"
                      :is-edit="!isSelectModel"
                      :style-class="treeClass"
                      :init-tree-url="initTreeUrl"
                      :update-tree-url="tree.updateTreeUrl"
                      :del-tree-url="tree.delTreeUrl"
                      :insert-tree-url="tree.insertTreeUrl"
                      :height="height"
                      @click-node="treeClickNodeHandler"
                      @checked-nodes="selectionChange">
            </vue-tree>
          </el-aside>
          <!--右 工作-->
          <el-container class="right-panel is-vertical">
            <table-header ref="tableHeader"
                          :tree-level="treeLevel"
                          :search-url="searchUrl"
                          @list="showSearchList">
              <div class="options"
                   slot="option-slot">
                <el-button type="success"
                           v-if="!isSelectModel"
                           icon="el-icon-plus"
                           @click="openJobClickHandler(false)"> 新增工作
                </el-button>
              </div>
            </table-header>
            <!--工作table-->
            <el-main class="right-panel-main">
              <table-grid ref="tableJob"
                          :is-show-border='false'
                          :is-show-footer='false'
                          :is-show-checkbox='isSelectModel'
                          :is-show-stripe='false'
                          :height='height'
                          :query-param='param'
                          :table-list='list'
                          :select-url='selectUrl'
                          :headers='headers'
                          @selection-change="handleSelectionChange"
                          @current-change='handleCurrentChange'>
                <!--追加检查结果列-->
                <el-table-column label="检查结果"
                                 min-width="100"
                                 align="center"
                                 slot="option-slot">
                  <template slot-scope="scope">
                    <el-progress :stroke-width="18"
                                 :show-text="false"
                                 :percentage="scope.row.percentage"
                                 v-loading="scope.row.progressLoading"
                                 element-loading-text="执行中"
                                 element-loading-spinner="el-icon-loading"
                                 v-show="!scope.row.executeLoading"></el-progress>
                    <el-tag class="showTag"
                            v-if="scope.row.flag"
                            v-show="scope.row.executeLoading"
                            type="success">正常
                    </el-tag>
                    <el-tag class="showTag"
                            v-show="scope.row.executeLoading"
                            v-else
                            type="danger">异常
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="预估时间"
                                 width="150"
                                 align="center"
                                 slot="option-slot">
                  <template slot-scope="scope">
                    <div @click="timeRow(scope.row)">
                      <time-picker class="time-picker"
                                   element-loading-spinner="el-icon-loading"
                                   :propMinute="parseInt(scope.row.expectTimeLength/ 60).toString()"
                                   :propSecond="(scope.row.expectTimeLength % 60).toString()"
                                   @timeSubmit="timeSubmit"></time-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 min-width="150">
                  <template slot-scope="scope">
                    <a href="javascript:void(0)"
                       class="a"
                       v-show="scope.row.executeLoading"
                       @click="showResult(scope.row)">显示检查结果</a>
                  </template>
                </el-table-column>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 v-if="!isSelectModel"
                                 label="操作"
                                 min-width="280"
                                 align="center">
                  <template slot-scope="scope">
                    <div class="buttons">
                      <el-tooltip content="编辑"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-edit"
                                   size="mini"
                                   type="primary"
                                   @click="openJobClickHandler(true, scope.row)"></el-button>
                      </el-tooltip>
                      <el-tooltip content="删除"
                                  placement="top">
                        <el-button plain
                                   icon="el-icon-delete"
                                   size="mini"
                                   type="danger"
                                   @click="del(scope.row)"></el-button>
                      </el-tooltip>
                      <el-tooltip content="执行"
                                  placement="right">
                        <el-button plain
                                   icon="el-icon-caret-right"
                                   size="mini"
                                   type="success"
                                   :disabled="scope.row.execLoading"
                                   @click="execute(scope.row)"></el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <!--追加排序列-->
                <el-table-column min-width="100"
                                 label="排序"
                                 align="center"
                                 prop="jobSort"
                                 sortable="custom"
                                 fixed="left"
                                 slot="option-slot">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit"
                          @click="scope.row.edit = !scope.row.edit"
                          class="inline-edit">
                      {{scope.row.jobSort}}
                      <svg-icon icon-class="pen" />
                    </span>
                    <el-input v-show="scope.row.edit"
                              v-model="scope.row.jobSort"
                              id="keywords"
                              @keyup.enter.native="sortEdit(scope.row)"></el-input>
                    <el-button class="buttonSort"
                               v-show="scope.row.edit"
                               size="mini"
                               type="success"
                               @click="sortEdit(scope.row)">确定</el-button>
                  </template>
                </el-table-column>
              </table-grid>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </div>

    <!--新增工作弹窗-->
    <el-dialog :title="dialogTitle + '工作'"
               :visible.sync="dialogVisible">
      <el-form ref="jobForm"
               :model="form"
               :rules="formRules"
               label-width="80px">
        <el-form-item label="工作类型"
                      prop="jobType">
          <el-select v-model="form.jobType"
                     placeholder="请选择工作类型">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作名称"
                      prop="jobName">
          <el-input v-model="form.jobName"
                    placeholder="请输入工作名称"></el-input>
        </el-form-item>
        <el-form-item label="排序"
                      prop="jobSort">
          <el-input-number v-model="form.jobSort"
                           :step="10"
                           controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="工作备注"
                      prop="jobRemark">
          <el-input type="textarea"
                    :autosize="{ minRows: 8, maxRows: 10}"
                    placeholder="请输入内容"
                    v-model="form.jobRemark">
          </el-input>
        </el-form-item>
        <p>
          <el-button plain
                     icon="el-icon-circle-plus-outline"
                     size="mini"
                     type="warning"
                     :disabled="bindButtionDisabled(form.jobType)"
                     @click="bindScript(form.jobCode)">绑定脚本
          </el-button>
          <el-tag v-for="label in labelScript"
                  :key="label">{{label}}</el-tag>
        </p>
        <p>
          <el-button plain
                     icon="el-icon-circle-plus-outline"
                     size="mini"
                     type="warning"
                     :disabled="bindButtionDisabled(form.jobType)"
                     @click="bindServer(form.jobCode)">绑定服务器
          </el-button>
          <el-tag v-for="label in labelServer"
                  :key="label">{{label}}</el-tag>
        </p>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitJobForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--返回结果弹窗-->
    <el-dialog title="返回结果"
               :visible.sync="showResultDialogVisible"
               width="60%">
      <div v-html="showResultContent"
           class="dialog"></div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="showResultDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--穿梭框保存绑定-->
    <dialog-transfer ref="dialogTransfer"
                     :init-url="initUrl"
                     :titles="titles"
                     :filterPlaceholder="filterPlaceholder"
                     @submit="dialogSave">
    </dialog-transfer>
  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import { select } from '@/api/components/component'
import { TableGrid, TableHeader, VueTree, DialogTransfer, TimePicker } from 'ctsi-vue-dialog'
import { isNotEmpty, request } from '@/utils'
import { insert, deleteByCode, update, executeJob } from '@/api/jobsManager/jobs'
import { selectExpectTime, insertMainExpectTime, updateMainExpectTime } from '@/api/process/expectTime'
import keysGetLabels from '@/api/jobsManager/keysGetLabels'

export default {
  name: 'Jobs',
  components: {
    ComponentSelect,
    ComponentFilter,
    TableGrid,
    TableHeader,
    DialogTransfer,
    VueTree,
    TimePicker
  },
  watch: {
    $route(to, from) {
      this.refreshTable()
    },
    initTreeUrl: function(curVal) {
      this.initTreeUrl = curVal
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
    },
    // 初始化树形连接地址
    initTreeUrl: {
      type: String,
      required: false,
      default: '/general/tree/selectTreeListByRootCode/treeJobsRoot'
    }
  },
  created() {
    this.init()
  },
  data() {
    return {
      border: false,
      dialogVisible: false,
      loading: false,
      bindLoading: false,
      // 排序编辑标识
      editFlag: false,
      // 行内编辑
      inputData: '',
      // 预案弹出框title
      dialogTitle: '新增工作',
      tree: {
        // 左侧树形预案分类
        delTreeUrl: '/general/tree/',
        updateTreeUrl: '/general/tree/',
        insertTreeUrl: '/general/tree/insert'
      },
      // 查询工作
      selectUrl: '',
      // 初始化时查询工作
      selectFormUrl: '',
      // 穿梭框
      initUrl: '',
      // 树形样式
      treeClass: 'width:450px',
      // 树形层级
      treeLevel: '',
      // 高度
      height: '350',
      // 表头
      headers: [
        { prop: 'jobName', label: '工作名称', sortable: 'custom', minWidth: '180' },
        { prop: 'jobRemark', label: '工作描述', minWidth: '250' },
        { prop: 'jobType', label: '工作类型', minWidth: '130' },
        { prop: 'createUser', label: '作者', sortable: 'custom', minWidth: '180' }
      ],
      // 查询参数(当前活的的节点)
      param: {
        treeCode: '',
        treeType: 'root',
        jobName: ''
      },
      // 工作表单表格数据
      list: [],
      // 工作表单
      form: {
        treeCode: '',
        jobCode: '',
        jobName: '',
        jobRemark: '',
        jobType: '',
        jobSort: 10
      },
      // 工作编号
      jobCode: '',
      // select控件
      options: [],
      titles: ['可绑定', '已绑定'],
      // dialog类型
      type: '',
      // 提示文字
      filterPlaceholder: '',
      // 是否多选
      isMultiple: false,
      // 绑定按钮是否禁用
      buttionDisabled: true,
      // 绑定脚本列表
      scriptCodeList: [],
      // 绑定服务器列表
      serverCodeList: [],
      // 是否为更新状态
      isEdit: true,
      // 进度条执行中
      progressLoading: false,
      // 执行loading
      executeLoading: false,
      // 执行按钮loading
      execLoading: false,
      // 绑定的脚本编码
      bindScriptCode: '',
      // 回显绑定的脚本
      labelScript: [],
      // 回显绑定的服务器
      labelServer: [],
      // 检查结果dialog是否显示
      showResultDialogVisible: false,
      // 返回结果
      showResultContent: '',
      // 执行结果回文(每行)
      showResultContentArray: '',
      // 返回结果集合
      showResultList: [],
      // 执行工作的脚本编号
      showResultScriptCode: '',
      // 表单规则
      formRules: {
        jobName: [
          { required: true, message: '请输入工作名称', trigger: 'blur' }
        ],
        jobType: [
          { required: true, message: '请选择工作类型', trigger: 'blur' }
        ],
        jobSort: [
          { required: true, message: '请输入工作排序', trigger: 'blur' }
        ]
      },
      // 搜索请求路径
      searchUrl: '/maintenance/job/selectJobListByJobName',
      // 预计时间：分
      propMinute: '00',
      // 预计时间：秒
      propSecond: '00',
      // 预期时间：新增 or 更新
      expectTime: 'insert',
      // 预估时间接口主键
      expectTimeCode: '',
      // 要更新预估时间的行
      expectTimeRow: {}
    }
  },
  methods: {
    init() {
      // select控件
      select('jobType', true).then(result => {
        this.options = result.data.options
      })
    },
    refreshTable() {
      // 表格数据初始化
      this.selectUrl = this.selectFormUrl
      this.$refs.tableJob.refreshTable()
    },
    sortEdit(row) {
      this.form.jobName = row.jobName
      this.form.jobRemark = row.jobRemark
      this.form.jobCode = row.jobCode
      this.form.jobType = row.jobType
      this.form.jobSort = row.jobSort
      console.log(this.form.jobSort)
      // 行内编辑
      update(this.form).then(() => {
        this.refreshTable()
      }).finally(() => {
        row.edit = !row.edit
      })
    },
    treeClickNodeHandler(param) {
      // 点击节点
      this.treeLevel = isNotEmpty(param.treeLevel) ? param.treeLevel.join(' / ') : ''
      this.param.treeCode = param.treeCode
      this.param.treeType = param.treeType
      this.form.treeCode = param.treeCode
      this.param.jobName = ''
      this.param.jobRemark = ''
      this.param.jobType = ''
      this.param.jobCode = ''
      if (param.treeType === 'root') {
        this.param.treeCode = ''
      } else {
        // 查询对应表格
        this.selectFormUrl = `/maintenance/job/selectJobListByTreeCode/${param.treeCode}`
        request({
          url: this.selectFormUrl,
          method: 'get',
          params: this.params
        }).then(result => {
          this.list = result.data.tableData
          // 追加是否展开显示默认显示
          this.list = result.data.tableData.list.map(row => {
            this.$set(row, 'edit', false)
            return row
          })
        })
      }
    },
    openJobClickHandler(isEdit, row) {
      this.dialogTitle = isEdit ? '更新' : '新增'
      this.isEdit = isEdit
      // 打开工作编辑窗口
      if (this.param.treeType === 'root') {
        this.$alert('请选择左侧分组')
      } else {
        this.dialogVisible = true
        if (this.isEdit) {
          // 更新
          this.form.jobName = row.jobName
          this.form.jobRemark = row.jobRemark
          this.form.jobCode = row.jobCode
          this.form.jobType = row.jobType
          this.form.jobSort = row.jobSort
          request({
            url: `/maintenance/script/selectJobScriptTransfer/${row.jobCode}`,
            method: 'get'
          }).then(result => {
            this.labelScript = keysGetLabels(
              result.data.left,
              result.data.right
            )
          })
          request({
            url: `/maintenance/server/selectJobServerTransfer/${row.jobCode}`,
            method: 'get'
          }).then(result => {
            this.labelServer = keysGetLabels(
              result.data.left,
              result.data.right
            )
          })
        } else {
          // 新增
          this.form.jobName = ''
          this.form.jobRemark = ''
          this.form.jobType = ''
          this.form.jobCode = null
          this.form.jobSort = 10
          this.labelServer = []
          this.labelScript = []
        }
      }
    },
    bindButtionDisabled(jobType) {
      // console.log(jobType)
      if (jobType === 'shell') {
        this.buttionDisabled = false
      } else {
        this.buttionDisabled = true
      }
      return this.buttionDisabled
    },
    submitJobForm() {
      // 提交工作
      this.$refs.jobForm.validate(valid => {
        if (valid && this.isEdit) {
          // 更新
          update(this.form).then(() => {
            this.refreshTable()
            this.dialogVisible = false
            this.scriptDialogSubmit()
            this.serverDialogSubmit()
          })
        } else if (valid && !this.isEdit) {
          // 新增
          insert(this.form).then(result => {
            this.refreshTable()
            this.dialogVisible = false
            this.form.jobCode = result.data.jobCode
            // console.log(this.jobCode)
            this.scriptDialogSubmit()
            this.serverDialogSubmit()
          })
        }
      })
    },
    del(row) {
      // 删除工作
      deleteByCode(row.jobCode, this)
      this.refreshTable()
    },
    initProgress(row) {
      this.$set(row, 'percentage', 0)
      this.$set(row, 'flag', 0)
      this.$set(row, 'progressLoading', 0)
      this.$set(row, 'executeLoading', 0)
      return row
    },
    execute(row) {
      this.initProgress(row)
      row.executeLoading = false
      row.execLoading = true
      row.percentage = 0
      const interval = window.setInterval(() => {
        if (row.percentage++ >= 100) {
          row.percentage = 100
          row.progressLoading = true
          window.clearInterval(interval)
        }
      }, 8)
      // 执行工作
      const data = {
        jobCode: row.jobCode,
        jobType: row.jobType
      }
      executeJob(data).then(result => {
        row.progressLoading = false
        row.execLoading = false
        row.executeLoading = true
        row.flag = result.data.list[1][0].flag
        this.showResultScriptCode = result.data.list[0][0].scriptCode
        this.showResultContentArray = result.data.list[0][0].result
        const m = new Map()
        m.set(this.showResultScriptCode, this.showResultContentArray)
        // console.log(m)
        this.showResultList.push(m)
      })
    },
    showResult(row) {
      this.showResultContent = ''
      this.showResultDialogVisible = true
      request({
        url: `/maintenance/script/selectJobScriptTransfer/${row.jobCode}`,
        method: 'get'
      }).then(result => {
        this.bindScriptCode = result.data.right[0]
        for (let i = 0; i < this.showResultList.length; i++) {
          const item = this.showResultList[i]
          if (item.has(this.bindScriptCode)) {
            this.showResultContent = item.get(this.bindScriptCode)
            // console.log(this.showResultContent)
          } else {
            this.showResultContent = ''
          }
        }
      })
    },
    bindScript(jobCode) {
      this.type = 'script'
      this.titles = ['全部脚本', '已绑定脚本']
      this.filterPlaceholder = '选择绑定脚本'
      this.isMultiple = false
      // console.log(jobCode)
      // 绑定脚本
      this.initUrl = `/maintenance/script/selectJobScriptTransfer/${jobCode}`
      this.$refs.dialogTransfer.showDialog()
    },
    bindServer(jobCode) {
      this.type = 'server'
      this.titles = ['全部服务器', '已绑定服务器']
      this.filterPlaceholder = '选择绑定服务器'
      this.isMultiple = true
      // 绑定服务器
      this.initUrl = `/maintenance/server/selectJobServerTransfer/${jobCode}`
      this.$refs.dialogTransfer.showDialog()
    },
    handleCurrentChange(selection) {
      // 选中一行
      if (selection.row != null) {
        this.param.jobName = selection.row.jobName
        this.param.jobCode = selection.row.jobCode
      }
      // console.debug(selection.row.jobName)
    },
    scriptDialogSubmit() {
      this.loading = true
      // console.log(this.jobCode)
      const data = {}
      data.jobCode = this.form.jobCode
      data.scriptCodeList = this.scriptCodeList
      request({
        url: '/maintenance/script/saveJobScript',
        method: 'post',
        data
      }).finally(() => {
        this.loading = false
      })
    },
    serverDialogSubmit() {
      this.loading = true
      // console.log(this.form.jobCode)
      const data = {}
      data.jobCode = this.form.jobCode
      data.serverCodeList = this.serverCodeList
      request({
        url: '/maintenance/server/saveServerToJob',
        method: 'post',
        data
      }).finally(() => {
        this.loading = false
      })
    },
    dialogSave(params) {
      if (!this.isMultiple && params.value.length > 1) {
        // 单选检查
        this.$alert('只允许选择一条数据')
      } else {
        if (this.type === 'script') {
          this.scriptCodeList = params.value
          // console.log(this.scriptCodeList)
        } else if (this.type === 'server') {
          this.serverCodeList = params.value
          // console.log(this.serverCodeList)
        }
        this.$refs.dialogTransfer.closeDialog()
      }
    },
    handleSelectionChange(selection) {
      this.$emit('selection-change', {
        selection: selection.selection
      })
    },
    // 获取多选
    selectionChange(params) {
      this.$emit('tree-selection-change', {
        checkedNodes: params
      })
    },
    showSearchList(data) {
      this.list = data
    },
    // 提交预计时间
    timeSubmit(time) {
      // console.log(time)
      this.expectTimeRow.expectTimeLength = time
      if (this.expectTime === 'insert') {
        insertMainExpectTime(this.expectTimeRow)
      } else {
        updateMainExpectTime(this.expectTimeRow)
      }
    },
    timeRow(row) {
      selectExpectTime({ expectTimeBusinessCode: row.jobCode }).then(result => {
        this.expectTime = result.data.expectTimeList.length === 0 ? 'insert' : 'update'
        // console.log(this.expectTime)
      })
      this.expectTimeRow = {
        expectTimeBusinessCode: row.jobCode,
        expectTimeLength: '',
        expectTimeIsActive: 1
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/jobs.scss';
.container /deep/ {
  .time-picker {
    width: 116px;
    margin-left: 8px;
    &-container {
      z-index: 100;
      position: absolute;
      left: 18px;
    }
  }
}
</style>
