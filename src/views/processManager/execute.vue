<template>
  <div class="container execute-container">
    <el-row :gutter="12">
      <el-col :span="8"
              :offset="0">
        <!--任务信息-->
        <el-card v-loading="infoLoading">
          <div slot="header"
               class="clearfix">
            <span>演练名称: &nbsp;&nbsp;&nbsp;{{processName}}</span>
          </div>
          <div>
            <ul class="task-list">
              <li>任务id: {{taskData.taskId}}</li>
              <li>当前任务: {{taskData.taskName}}</li>
              <li>任务创建时间: {{taskData.createTime}}</li>
              <li>当前时间: {{currentDate}}</li>
              <li>负责团队: {{taskData.orgNames}}</li>
              <li>特定负责人: {{taskData.userNames}}</li>
            </ul>
            <div class="bottom clearfix">
            </div>
          </div>
        </el-card>
        <!--执行结果-->
        <el-card class="result-container">
          <div slot="header"
               class="clearfix">
            <span>执行结果</span>
          </div>
          <div>
            <div class="operate-result">
              <div class="operate-result-content"
                   v-html="resultMsg">
              </div>
            </div>
            <div class="bottom clearfix">
              <el-button type="text"
                         class="button"
                         v-clipboard:copy='resultMsg'
                         v-clipboard:success='clipboardSuccess'>复制结果</el-button>
              <el-button type="text"
                         class="button"
                         @click="cleanResult">清空</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--待执行工作-->
      <el-col :span="14"
              :offset="1">
        <el-card v-loading="jobLoading"
                 r>
          <div slot="header"
               class="clearfix">
            <span class="title">待执行工作: &nbsp;&nbsp;&nbsp;{{jobList.length}} 个</span>
          </div>
          <div>
            <table-grid ref="tableJob"
                        :is-show-border='false'
                        :is-show-footer='false'
                        :is-show-checkbox='false'
                        :is-show-stripe='false'
                        select-url=''
                        :table-list="jobList"
                        :headers='headers'>
              <!--追加检查结果列-->
              <el-table-column label="检查结果"
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
                  <el-tag class="tag"
                          :type="scope.row.flag ? 'success' : 'danger'"
                          v-show="scope.row.executeLoading">
                    {{scope.row.flag ? '正常': '异常'}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="查看结果"
                               align="center"
                               width="130"
                               slot="option-slot">
                <template slot-scope="scope">
                  <el-button type="text"
                             @click="showResult(scope.row)">查看</el-button>
                </template>
              </el-table-column>
              <!--末尾追加操作列-->
              <el-table-column slot="option-slot"
                               label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button plain
                             icon="el-icon-caret-right"
                             size="mini"
                             type="success"
                             :disabled="scope.row.execLoading"
                             @click="executeJob(scope.row)"></el-button>
                </template>
              </el-table-column>
            </table-grid>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text"
                         class="button"
                         @click="executeJobsGroup">批量执行</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

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

    <el-row :gutter="12">
      <!--审批-->
      <approve-container close-url="/processManager/my-task"
                         :approve-param="approveParam"
                         :taskId="taskId"
                         v-loading="infoLoading || jobLoading">
      </approve-container>
    </el-row>
  </div>

</template>

<script>
  import { params, parseTime, isNotEmpty, request } from '@/utils'
  import { getTaskById } from '@/api/process/process'
  import { getJobByJobsCode, executeJob } from '@/api/jobsManager/jobs'
  import { TableGrid } from 'ctsi-vue-dialog'
  import approveContainer from '@/views/approve/approveContainer'

  export default {
    name: 'execute',
    components: {
      TableGrid,
      approveContainer
    },
    data() {
      return {
        loading: false,
        infoLoading: false,
        jobLoading: false,
        currentDate: new Date(),
        // 当前流程环节编号
        taskId: '',
        // 流程名称
        processName: '',
        // 流程环节对应的工作组编号
        jobsCode: '',
        // 检查结果dialog是否显示
        showResultDialogVisible: false,
        // 执行工作的脚本编号
        showResultScriptCode: '',
        // 绑定的脚本编码
        bindScriptCode: '',
        // 返回结果
        showResultContent: '',
        // 执行结果回文(每行)
        showResultContentArray: '',
        // 返回结果集合
        showResultList: [],
        // 执行结果(每行)
        resultDiv: '',
        // 当前任务
        taskData: {
          // 任务名
          name: '',
          // 负责团队
          orgNames: '',
          // 特定负责人
          userNames: '',
          // 流程实例信息
          execution: {
            name: ''
          }
        },
        // 表头
        headers: [
          { prop: 'jobName', label: '工作名称', minWidth: '100' },
          { prop: 'jobRemark', label: '工作描述', minWidth: '150' },
          { prop: 'jobType', label: '类型', minWidth: '50' }
        ],
        // 查询工作
        selectUrl: '',
        // 待执行工作
        jobList: [],
        // 执行结果全文
        resultMsg: '',
        // 审批时的附加参数
        approveParam: {
        }
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.taskId = params(this, 'taskId')
        this.jobsCode = params(this, 'jobsCode')
        this.currentDate = parseTime(new Date())
        this.getTask()
        this.getJobList()
        this.cleanResult()
      },
      // 获取环节点
      getTask() {
        this.infoLoading = true
        if (isNotEmpty(this.taskId)) {
          getTaskById(this.taskId).then(result => {
            this.taskData = result.data.task
            if (isNotEmpty(this.taskData.execution)) {
              this.processName = this.taskData.execution !== null && isNotEmpty(this.taskData.execution.name) ? this.taskData.execution.name : ''
            }
          }).finally(_ => {
            this.infoLoading = false
          })
        }
      },
      // 获取工作组
      getJobList() {
        this.jobLoading = true
        if (isNotEmpty(this.jobsCode)) {
          // 根据任务信息中的工作组获得工作列表
          getJobByJobsCode(this.jobsCode).then(result => {
            this.jobList = result.data.tableData.list
          }).finally(_ => {
            this.jobLoading = false
          })
        } else {
          this.jobLoading = false
        }
      },
      // 初始化进度条
      initProgress(row) {
        this.$set(row, 'percentage', 0)
        this.$set(row, 'flag', 0)
        this.$set(row, 'progressLoading', 0)
        this.$set(row, 'executeLoading', 0)
        return row
      },
      // 执行工作
      executeJob(row) {
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
          // console.log(result.data.list)
          if (isNotEmpty(result.data.list[1][0])) {
            row.flag = result.data.list[1][0].flag
            this.showResultScriptCode = result.data.list[0][0].scriptCode
            this.showResultContentArray = result.data.list[0][0].result
            const m = new Map()
            m.set(this.showResultScriptCode, this.showResultContentArray)
            // console.log(m)
            this.showResultList.push(m)
            this.resultDiv = this.showResultContentArray +
              '\n ============================================= \n'
            this.resultMsg = this.resultMsg + this.resultDiv
          } else {
            row.flag = false
          }
        })
      },
      loopPromiseExecute(i) {
        // console.log(i)
        new Promise((resolve, reject) => {
          this.executeJob(this.jobList[i])
          resolve(true)
        }).then(() => {
          setTimeout(() => {
            // console.log(this.jobList[i].flag)
            if (this.jobList[i].flag === false) {
              i = this.jobList.length
            }
            i++
            if (i < this.jobList.length) {
              this.loopPromiseExecute(i)
            }
          }, 15000)
        })
      },
      executeJobsGroup() {
        // debugger
        this.loopPromiseExecute(0)
      },
      // 显示单条工作执行结果
      showResult(row) {
        this.showResultContent = ''
        this.showResultDialogVisible = true
        request({
          url: `/maintenance/script/selectJobScriptTransfer/${row.jobCode}`,
          method: 'get'
        }).then(result => {
          // debugger
          // console.log(this.showResultList)
          this.bindScriptCode = result.data.right[0]
          for (let i = 0; i < this.showResultList.length; i++) {
            const item = this.showResultList[i]
            if (item.has(this.bindScriptCode)) {
              this.showResultContent = item.get(this.bindScriptCode)
              // console.log(this.showResultContent)
            }
          }
        })
      },
      // 复制成功
      clipboardSuccess() {
        this.$message({
          message: '已将结果复制到粘帖板',
          type: 'success'
        })
      },
      // 清空
      cleanResult() {
        this.resultMsg = ''
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/execute.scss';
</style>
