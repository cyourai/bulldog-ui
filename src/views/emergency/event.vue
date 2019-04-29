<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.eventManager')}}</p>
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
              <el-form-item label="事件状态："
                            prop="eventStatus">
                <component-select type="eventStatus"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="eventStatusHandleChange"></component-select>
              </el-form-item>
              <el-form-item label="事件场景："
                            prop="eventScene">
                <component-select type="eventScene"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="eventScencHandleChange"></component-select>
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
                    <el-button plain
                               :disabled="scope.row.eventStatusCode != 'wait'"
                               icon="el-icon-bell"
                               size="mini"
                               type="warning"
                               @click="openDialog(scope.row.eventCode)">
                      启动应急流程
                    </el-button>
                    <el-button plain
                               icon="el-icon-tickets"
                               size="mini"
                               type="primary"
                               @click="historyClickHandler(scope.row.eventCode)">
                      审批记录
                    </el-button>
                    <el-tooltip content="查看"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-search"
                                 size="mini"
                                 type="info"
                                 @click="info(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑"
                                placement="top">
                      <el-button plain
                                 icon="el-icon-edit"
                                 :disabled="scope.row.eventStatusCode != 'wait'"
                                 size="mini"
                                 type="primary"
                                 @click="openClickHandler(scope.row.eventCode)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="right">
                      <el-button plain
                                 icon="el-icon-delete"
                                 :disabled="scope.row.eventStatusCode != 'wait'"
                                 size="mini"
                                 type="danger"
                                 @click="del(scope.row)"></el-button>
                    </el-tooltip>
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
                             @click="batctExecute()">确定
                  </el-button>
                </div>
              </table-grid>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--绑定主流程-->
    <dialog-transfer ref="dialogTransfer"
                     :init-url="dialog.initUrl"
                     :titles="dialog.titles"
                     :btn-text="dialog.btnText"
                     :filter-placeholder="dialog.placeholder"
                     @submit="dialogSubmit">
    </dialog-transfer>
  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import { TableGrid, DialogTransfer } from 'cyourai-vue-dialog'
import { deleteByCode, batctExecute } from '@/api/emergency/event'
import { clearParam, request } from '@/utils'

export default {
  name: 'event',
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
      // 绑定审批人
      dialog: {
        initUrl: '',
        titles: ['选择审批人', '上级审批人'],
        placeholder: '选择审批人',
        btnText: '提交审批',
        isMultiple: false
      },
      // 查询参数
      filterFormData: {
        eventNameCode: '',
        eventStatusCode: '',
        eventSceneCode: ''
      },
      // 表头
      headers: [
        { prop: 'eventName', label: '事件名称', minWidth: '100', sortable: 'custom' },
        { prop: 'eventScene.dictValue', label: '事件场景', minWidth: '100', sortable: 'custom' },
        { prop: 'eventLevel.dictValue', label: '事件等级', minWidth: '100', sortable: 'custom' },
        { prop: 'eventStatus.dictValue', label: '事件状态', minWidth: '100', sortable: 'custom' }
      ],
      // 分页查询所有事件列表
      selectUrl: '/topic/event/page',
      // 批量操作标记位
      batchFilterData: '',
      // 当前行
      row: {},
      // 多选选中行
      multipleSelection: [],
      // 事件编号
      eventCode: ''
    }
  },
  created() {
  },
  methods: {
    refreshTable() {
      this.$refs.tableGrid.refreshTable()
    },
    eventStatusHandleChange(eventStatus) {
      // 筛选查询-状态
      this.filterFormData.eventStatusCode = eventStatus
      this.refreshTable()
    },
    eventScencHandleChange(eventScene) {
      // 筛选查询-场景
      this.filterFormData.eventSceneCode = eventScene
      this.refreshTable()
    },
    openClickHandler(eventCode) {
      this.dialog.initUrl = ''
      if (eventCode == null) {
        // 新增
        clearParam('eventCode')
        clearParam('taskId')
        clearParam('isApprove')
        clearParam('isInfo')
        this.$router.push({
          path: '/plan/event/event-edit',
          name: 'event-edit',
          params: {
            isApprove: false,
            isInfo: false
          }
        })
      } else {
        this.$router.push({
          path: '/plan/event/event-edit',
          name: 'event-edit',
          params: {
            eventCode: eventCode,
            isApprove: false,
            isInfo: false
          }
        })
      }
    },
    historyClickHandler(eventCode) {
      this.dialog.initUrl = ''
      this.$router.push({
        path: '/plan/event/history',
        name: 'event-history',
        params: {
          eventCode: eventCode
        }
      })
    },
    del(row) {
      // 删除
      deleteByCode(row.eventCode, this)
    },
    info(row) {
      // 查看
      clearParam('eventCode')
      clearParam('taskId')
      clearParam('isApprove')
      clearParam('isInfo')
      this.$router.push({
        path: '/plan/event/event-edit',
        name: 'event-edit',
        params: {
          eventCode: row.eventCode,
          isApprove: false,
          isInfo: true
        }
      })
    },
    batctExecute() {
      // 批量操作
      batctExecute(this)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDialog(eventCode) {
      // 绑定上级审批人提交流程
      this.eventCode = eventCode
      this.dialog.initUrl = `/topic/event/selectEventUserTransfer/${this.eventCode}`
      this.$refs.dialogTransfer.showDialog()
    },
    dialogSubmit(params) {
      // 提交流程审批
      if ((!this.dialog.isMultiple && params.value.length !== 1)) {
        // 单选检查
        this.$alert('请选择一位审批人')
      } else {
        this.$refs.dialogTransfer.showLoading(true)
        const data = {}
        data.codeUserCode = this.eventCode
        data.userNameList = params.value
        request({
          url: `/topic/event/startProcess`,
          method: 'post',
          data
        }).then(() => {
          this.refreshTable()
        }).finally(() => {
          this.$refs.dialogTransfer.showLoading(false)
          this.$refs.dialogTransfer.closeDialog()
        })
      }
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
