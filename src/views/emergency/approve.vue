<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content" v-loading="loading">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.eventApprove')}}</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="事件名称："
                            prop="eventValue">
                <el-input v-model="filterFormData.eventName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入事件名称"></el-input>
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
                                 min-width="200"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                      <el-button plain
                                 icon="el-icon-news"
                                 size="mini"
                                 type="warning"
                                 :disabled="scope.row.eventStatusCode != 'approval'"
                                 @click="optionClickApprove(scope.row)">审批</el-button>
                    <el-button plain
                               :disabled="scope.row.eventStatusCode != 'handing'"
                               icon="el-icon-success"
                               size="mini"
                               type="success"
                               @click="optionClickEnd(scope.row)">
                      确认完成
                    </el-button>
                  </template>
                </el-table-column>
                <!--批量操作-->
                <div slot="batch-slot">
                  <el-select v-model="batchFilterData"
                             placeholder="批量操作">
                  </el-select>
                  <el-button type="primary"
                             plain
                             class="table-content-page-search"
                             @click="batctExecute()">确定
                  </el-button>
                </div>
              </table-grid>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--对应描述-->
    <el-dialog title="请填写事件处理结果" :visible.sync="dialogVisible">
      <el-form ref="planForm"
               label-width="80px">
        <el-form-item label="对应描述" prop="eventResponseRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder="请输入内容"
            v-model="eventResponseRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitResponseRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentFilter from '@/components/ComponentFilter'
  import { TableGrid, DialogTransfer } from 'cyourai-vue-dialog'
  import { next } from '@/api/approve/approve'
  import { updateStatus } from '@/api/emergency/event'
  import store from '@/store'

  export default {
    name: 'eventApprove',
    components: {
      ComponentSelect,
      ComponentFilter,
      TableGrid,
      DialogTransfer
    },
    watch: {
      $route(to, from) {
        this.refreshTable()
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        // 查询参数
        filterFormData: {
          eventName: ''
        },
        // 表头
        headers: [
          { prop: 'eventName', label: '事件名称', minWidth: '100', sortable: 'custom' },
          { prop: 'createUser', label: '事件发起人', minWidth: '100', sortable: 'custom' },
          { prop: 'task.taskName', label: '当前环节', minWidth: '100', sortable: 'custom' },
          { prop: 'approveUser.userName', label: '审批人', minWidth: '100', sortable: 'custom' }
        ],
        // 分页查询所有事件列表
        selectUrl: '/topic/event/taskPage',
        // 批量操作标记位
        batchFilterData: '',
        // 当前行
        row: {},
        // 多选选中行
        multipleSelection: [],
        // 事件编号
        eventCode: '',
        // 任务编号
        taskId: '',
        // 对应描述
        eventResponseRemark: ''
      }
    },
    created() {
    },
    methods: {
      refreshTable() {
        this.$refs.tableGrid.refreshTable()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      optionClickApprove(row) {
        // 审批
        if ([row.approveUser.userName, 'admin'].indexOf(store.state.user.userName) < 0) {
          this.$alert('您没有审批权限')
          return
        } else {
          this.$router.push({
            path: '/plan/event/event-edit',
            name: 'event-edit',
            params: {
              eventCode: row.eventCode,
              taskId: row.task.taskId,
              isApprove: true
            }
          })
        }
      },
      updateRemark() {
        const data = {}
        data.eventCode = this.eventCode
        data.eventResponseRemark = this.eventResponseRemark
        updateStatus(data)
        this.refreshTable()
      },
      optionClickEnd(row) {
        // 确认完成
        this.eventCode = row.eventCode
        this.taskId = row.task.taskId
        this.dialogVisible = true
      },
      submitResponseRemark() {
        this.dialogVisible = false
        next(this, this.taskId, this.updateRemark)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .table-footer-container /deep/ {
    padding-bottom: 12px !important;
    height: 55px !important;
  }
</style>
