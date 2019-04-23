<template>
  <div class="container">
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
                     label-width="100px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="演练流程名称："
                            prop="name">
                <el-input v-model="filterFormData.name"
                          class="drill-query"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入演练流程名称"></el-input>
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
              <table-grid ref="drillTable"
                          :query-param='filterFormData'
                          :is-show-checkbox="isShowCheckbox"
                          :headers='headers'
                          :table-list="list"
                          select-url=''>
                <!--末尾追加评分列-->
                <el-table-column slot="option-slot"
                                 width="150"
                                 label="评分"
                                 align="center">
                  <template slot-scope="scope">
                    <el-rate v-model="scope.row.score"
                             disabled
                             :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                    </el-rate>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 min-width="150"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button plain
                               icon="el-icon-tickets"
                               size="mini"
                               type="primary"
                               @click="historyHandler(scope.row)">
                      审批记录
                    </el-button>
                    <el-button plain
                               size="mini"
                               type="warning"
                               @click="showResult(scope.row)">查看报表
                    </el-button>
                    <el-button plain
                               size="mini"
                               type="success"
                               @click="showScore(scope.row)">查看评价
                    </el-button>
                  </template>
                </el-table-column>
              </table-grid>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--演练报表-->
    <!-- :title="processName" -->
    <el-dialog :visible.sync="resultDialogVisible">
      <div class='chart-container'>
        <chart :processInstanceId="processInstanceId"
               :processName="processName"
               height='100%'
               width='100%'></chart>
      </div>
    </el-dialog>

    <!--评估-->
    <el-dialog :title="processName"
               :visible.sync="scoreDialogVisible">
      <el-form :model="scoreForm"
               ref="scoreForm">
        <el-form-item label="评分"
                      prop="score"
                      class="rate-item">
          <el-rate v-model="scoreForm.score"
                   :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </el-form-item>
        <el-form-item label="评估"
                      prop="dec"
                      class="dec-item">
          <el-input v-model="scoreForm.scoreDescribed"
                    type="textarea"
                    :autosize="{ minRows: 6, maxRows: 10}"
                    placeholder="请输入评价"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="scoreDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm()">评 分</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import { TableGrid } from 'ctsi-vue-dialog'
import { request, isNotEmpty } from '@/utils'
import Chart from './resultChart/mixChart'
import { updateScore } from '@/api/process/process'

export default {
  name: 'result-list',
  components: {
    ComponentFilter,
    TableGrid,
    Chart
  },
  data() {
    return {
      loading: false,
      tableDataLoading: false,
      resultDialogVisible: false,
      scoreDialogVisible: false,
      isShowCheckbox: false,
      // 筛选项
      filterFormData: {
        // 演练名称
        name: '',
        // 流程环节名称
        taskName: '',
        // 查询已完成的演练(流程实例)
        selectUrl: '/process/selectHistoryProcessInstance',
        // 演练类型 0:真实演练 1:模拟演练
        exerciseType: 0
      },
      // 表头
      headers: [
        { prop: 'name', sortKey: 'NAME_', label: '演练名称', sortable: 'custom' },
        // { prop: 'score', sortKey: 'act_score_score', label: '评分', sortable: 'custom' },
        { prop: 'scoreDescribed', sortKey: 'scoreDescribed', label: '评估', sortable: 'custom' }
      ],
      // 标题
      title: '历史查询',
      // 表格内容
      list: [],
      // 被选中的id
      processInstanceId: '',
      // 被选中的name
      processName: '',
      // 评估相关
      scoreForm: {
        id: '',
        score: null,
        scoreDescribed: ''
      },
      scoreUpdateForm: {}
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
  methods: {
    // 页面初始化
    init() {
      request({
        url: this.filterFormData.selectUrl,
        method: 'get',
        params: this.filterFormData
      }).then(result => {
        // console.log(result)
        this.list = result.data.tableData.list
      })
    },
    // 表格数据初始化
    refreshTable() {
      this.init()
      this.$refs.drillTable.refreshTable()
    },
    // 查看报表
    showResult(row) {
      this.resultDialogVisible = true
      this.processInstanceId = row.id
      this.processName = row.name ? row.name : '查看报表'
    },
    // 审批记录
    historyHandler(row) {
      // console.debug(row)
      if (isNotEmpty(row.businessKey) && isNotEmpty(row.businessKey)) {
        this.$router.push({
          path: '/approve/history/approveHistory',
          name: 'approveHistory',
          params: {
            businessKey: row.businessKey,
            closeUrl: '/processManager/task'
          }
        })
      } else {
        this.$alert('无法根据演练名称找到审批记录')
      }
    },
    // 查看评分
    showScore(row) {
      this.scoreDialogVisible = true
      this.processInstanceId = row.id
      this.processName = row.name ? row.name : '查看评分'
      this.scoreForm = {
        id: row.id,
        score: row.score,
        scoreDescribed: row.scoreDescribed
      }
    },
    // 提交评分
    submitForm() {
      this.$refs['scoreForm'].validate(valid => {
        if (valid) {
          this.scoreUpdateForm = {
            actScoreProcessInstanceId: this.scoreForm.id,
            actScoreDescribe: this.scoreForm.scoreDescribed,
            actScoreScore: this.scoreForm.score
          }
          // console.log(this.scoreUpdateForm)
          updateScore(this.scoreUpdateForm).then(result => {
            if (result.data === 'POST_OK') {
              this.$message({
                message: '评估成功',
                type: 'success'
              })
              this.refreshTable()
            } else {
              this.$message.error('评估失败')
            }
          })
        }
      })
      this.scoreDialogVisible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.drill-query {
  width: 180px !important;
}
.chart-container {
  position: relative;
  padding: 0 20px 20px 20px;
  // width: 100%;
  height: 60vh;
}
.container /deep/ {
  .el-table .cell {
    // overflow: hidden;
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.el-form /deep/ {
  .rate-item {
    .el-form-item__content {
      height: 36px;
      padding: 8px 0;
    }
  }
  .dec-item {
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>
