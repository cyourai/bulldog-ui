<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">审批-用户注册</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="80px"
                     label-position="left">
              <el-form-item label="发起人："
                            prop="startUser">
                <el-input v-model="filterFormData.startUser"
                          @keyup.enter.native="refreshTable"
                          placeholder="发起人："></el-input>
              </el-form-item>
              <el-form-item label="流程参数："
                            prop="variable">
                <el-input v-model="filterFormData.variable"
                          @keyup.enter.native="refreshTable"
                          placeholder="流程参数"></el-input>
              </el-form-item>
            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询
            </el-button>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>数据列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">
              <div>
                <slot name="register">
                  <el-table stripe
                            fit
                            border
                            ref="multipleTable"
                            tooltip-effect="dark"
                            :data="tableData.list"
                            v-loading="tableDataLoading"
                            element-loading-text="数据加载中"
                            element-loading-spinner="el-icon-loading"
                            @selection-change="handleSelectionChange"
                            @sort-change="handleSortChange">
                    <el-table-column min-width="40"
                                     type="selection"
                                     align="center">
                    </el-table-column>
                    <el-table-column min-width="80"
                                     label="任务编号"
                                     align="center"
                                     prop="procInstId">
                    </el-table-column>
                    <el-table-column min-width="120"
                                     label="发起人"
                                     align="center">
                      <template slot-scope="scope">
                        {{scope.row.variableMap['发起人']}}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="170"
                                     label="提交时间"
                                     align="center"
                                     prop="startTime">
                    </el-table-column>
                    <el-table-column min-width="100"
                                     label="当前环节"
                                     align="center">
                      <template slot-scope="scope">
                        {{scope.row.task.name}}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="300"
                                     label="注册参数"
                                     align="left">
                      <template slot-scope="scope">
                        {{scope.row.variableMap}}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                                     label="操作"
                                     fixed="right"
                                     align="center">
                      <template slot-scope="scope">
                        <el-tooltip content="审批"
                                    placement="left">
                          <el-button plain
                                     icon="el-icon-edit"
                                     size="mini"
                                     type="primary"
                                     @click="edit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看流程"
                                    placement="bottom">
                          <el-button plain
                                     icon="el-icon-news"
                                     size="mini"
                                     type="success"
                                     @click="process(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- <el-tooltip content="同意"
                                      placement="top">
                            <el-button plain
                                       icon="el-icon-check"
                                       size="mini"
                                       type="success"
                                       @click="agreeTask(scope.row)"></el-button>
                          </el-tooltip> -->
                        <el-tooltip content="删除"
                                    placement="right">
                          <el-button plain
                                     icon="el-icon-delete"
                                     size="mini"
                                     type="danger"
                                     @click="delTask(scope.row)"></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </slot>
              </div>
            </div>
            <div class="table-content-page">
              <!--批量操作-->
              <el-select v-model="batchFilterData"
                         placeholder="批量操作">
                <!-- <el-option label="批量同意"
                           key="agree"
                           value="agree">
                </el-option> -->
                <el-option label="批量删除"
                           key="delete"
                           value="delete">
                </el-option>
              </el-select>
              <el-button size="mini"
                         type="primary"
                         plain
                         class="table-content-page-search"
                         @click="batctExecute()">确定
              </el-button>

              <!--分页-->
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handlePageChange"
                             layout="total, sizes, prev, pager, next, jumper"
                             :page-size="tableData.pageSize"
                             :total="tableData.total">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentFilter from '@/components/ComponentFilter'
  import { debug } from '@/utils'
  import {
    selectByPage,
    agreeTask,
    delTask,
    batctExecute
  } from '@/api/approve/approve'

  export default {
    name: 'eventApprove',
    components: {
      ComponentSelect,
      ComponentFilter
    },
    data() {
      return {
        // 默认排序
        defaultSort: '[]',
        // 数据
        tableData: {},
        // 筛选
        filterFormData: {
          // 流程环节为待管理员审批
          taskDefineKey: 'waitApprove',
          // 流程定义
          processDefineKey: 'identificationProcess',
          // 流程发起人
          startUser: '',
          // 流程参数
          variable: ''
        },
        // 批量操作筛选
        batchFilterData: '',
        // loading
        tableDataLoading: false
      }
    },
    created() {
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 表格数据初始化
        this.refreshTable()
      },
      refreshTable() {
        // 分页查询
        selectByPage(this)
      },
      handleSizeChange(pageSize) {
        // 分页-改变页显示数
        this.tableData.pageSize = pageSize
        this.refreshTable()
      },
      handlePageChange(pageNum) {
        // 分页-跳页
        this.tableData.pageNum = pageNum
        this.refreshTable()
      },
      handleSortChange(column, prop, order) {
        // 排序
        this.tableData.sort = JSON.stringify({
          prop: column.prop,
          order: column.order
        })
        if (JSON.parse(this.tableData.sort).prop === null) {
          this.tableData.sort = JSON.stringify({
            prop: 'procInstId',
            order: 'asc'
          })
        }
        this.refreshTable()
      },
      handleParamsChange() {
        // 筛选查询
        this.refreshTable()
      },
      handleSelectionChange(value) {
        // 选项发生改变
        this.multipleSelection = value
      },
      delTask(row) {
        // 删除
        delTask(this, row.procInstId)
      },
      edit(row) {
        // console.debug(row)
        debug('edit:', row)
        // 用户注册-审批
        const params = {
          userName: row.businessKey,
          taskId: row.task.id,
          t: +new Date()
        }
        this.$router.push({
          path: '/approve/approveRegisterInfo',
          name: 'approveRegisterInfo',
          params: params
        })
      },
      process(row) {
        // 查看流程
        window.open(
          process.env.BASE_API +
          process.env.PREFIX +
          '/process/front/permit/selectProcessBmp/' +
          row.procInstId
        )
      },
      agreeTask(row) {
        agreeTask(this, row)
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
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
</style>
