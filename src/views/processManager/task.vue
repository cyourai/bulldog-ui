<template>
  <div class="container task-container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{title}}</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="150px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="演练名称："
                            prop="processInstanceName">
                <el-input v-model="filterFormData.processInstanceName"
                          class="task-query"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入演练名称"></el-input>
              </el-form-item>
              <el-form-item label="任务名称："
                            prop="taskName">
                <el-input v-model="filterFormData.taskName"
                          class="task-query"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入任务名称"></el-input>
              </el-form-item>
            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询
            </el-button>
          </component-filter>
          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"></i>
              <span>演练列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe"
                 v-loading="tableDataLoading">
              <table-grid ref="taskTable"
                          :query-param="filterFormData"
                          :headers="headers"
                          :select-url="filterFormData.selectUrl"
                          :is-show-checkbox="isShowCheckbox">
                <el-table-column slot="option-slot"
                                 :min-width="isAll ? 150 : 200"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button plain
                               size="mini"
                               type="warning"
                               v-show="!isAll"
                               @click="execute(scope.row)">执行任务
                    </el-button>
                    <!-- 远近景视图按钮 -->
                    <ShowModel :modelId="scope.row.modelId"
                               :taskId="scope.row.taskDefKey"></ShowModel>
                    <!-- <el-button plain
                               icon="el-icon-search"
                               size="mini"
                               type="default"
                               @click="process(scope.row)">查看流程
                    </el-button> -->
                    <el-button plain
                               icon="el-icon-tickets"
                               size="mini"
                               type="primary"
                               @click="historyHandler(scope.row)">
                      审批记录
                    </el-button>
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
import { TableGrid } from 'cyourai-vue-dialog'
import { isNotEmpty } from '@/utils'
import ShowModel from '@/components/ComponentButton/showModel'

export default {
  name: 'task',
  components: {
    ComponentFilter,
    TableGrid,
    ShowModel
  },
  data() {
    return {
      loading: false,
      tableDataLoading: false,
      isShowCheckbox: false,
      // 筛选项
      filterFormData: {
        // 演练名称
        name: '',
        // 查询运行中的任务列表
        selectUrl: ''
      },
      // 表头
      headers: [
        { prop: 'taskId', label: '任务id', sortKey: 'ID_', sortable: 'custom' },
        { prop: 'taskDefKey', label: '任务编号', sortKey: 'TASK_DEF_KEY_', sortable: 'custom' },
        { prop: 'taskName', label: '任务名称', sortKey: 'NAME_', sortable: 'custom' },
        { prop: 'execution.name', label: '演练名称', sortKey: 'execution.NAME_', sortable: 'custom' },
        { prop: 'orgNames', label: '负责团队' },
        { prop: 'userNames', label: '特定负责人', minWdith: '150' }
      ],
      // 标题
      title: '演练',
      // 是否显示全部任务 true:全部 false:我的任务
      isAll: false
    }
  },
  watch: {
    $route(to, from) {
      this.init()
      this.refreshTable()
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    // 页面初始化
    init() {
      this.isAll = this.$route.meta.type === 'all'
      this.title = this.isAll ? this.$t('route.allTask') : this.$t('route.myTask')
      this.filterFormData.selectUrl = this.isAll ? '/process/task/selectTaskPage' : '/process/task/selectMyTaskPage'
      // console.debug(this.isAll)
      // console.debug(this.filterFormData.selectUrl)
    },
    // 表格数据初始化
    refreshTable() {
      this.queryParam = this.filterFormData
      this.$refs.taskTable.refreshTable()
    },
    // 执行任务
    execute(row) {
      this.$router.push({
        path: '/processManager/execute',
        name: 'execute',
        params: {
          taskId: row.taskId,
          jobsCode: row.jobsCode
        }
      })
    },
    // 查看流程
    process(row) {
      window.open(
        process.env.BASE_API +
        process.env.PREFIX +
        `/process/model/front/permit/selectProcessBmpByTaskId/${row.taskId}`
      )
    },
    // 查看审批记录
    historyHandler(row) {
      if (isNotEmpty(row.execution) && isNotEmpty(row.execution.name)) {
        this.$router.push({
          path: '/approve/history/approveHistory',
          name: 'approveHistory',
          params: {
            businessKey: row.execution.name,
            closeUrl: '/processManager/task'
          }
        })
      } else {
        this.$alert('无法根据演练名称找到审批记录')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.task-container /deep/ {
  .task-query {
    margin-right: 150px;
    input {
      width: 250px !important;
    }
    .qrCode {
      width: 150px;
    }
  }
}
</style>
