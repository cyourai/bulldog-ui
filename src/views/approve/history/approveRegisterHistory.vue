<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">审批记录-用户注册</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="80px"
                     label-position="left">
              <el-form-item label="注册参数："
                            prop="vaiable">
                <el-input v-model="filterFormData.vaiable"
                          @keyup.enter.native="refreshTable"
                          placeholder="注册参数"></el-input>
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
                    <el-table-column min-width="150"
                                     label="任务编号"
                                     align="center"
                                     prop="procInstId">
                    </el-table-column>
                    <el-table-column min-width="150"
                                     label="流程状态"
                                     align="center"
                                     prop="endActId">
                      <template slot-scope="scope">
                        {{scope.row.endActId}}
                        <span v-if="scope.row.endActId === 'agree'">同意结束</span>
                        <span v-else>流程运行中</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="350"
                                     label="注册信息"
                                     align="left"
                                     prop="vaiableJson">
                    </el-table-column>
                    <el-table-column min-width="200"
                                     label="查看详细"
                                     fixed="right"
                                     align="center">
                      <template slot-scope="scope">
                        <el-tooltip content="查看审批记录"
                                    placement="left">
                          <el-button plain
                                     icon="el-icon-search"
                                     size="mini"
                                     type="primary"
                                     @click="edit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看流程"
                                    placement="right">
                          <el-button plain
                                     icon="el-icon-news"
                                     size="mini"
                                     type="success"
                                     @click="process(scope.row)"></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </slot>
              </div>
            </div>
            <div class="table-content-page"
                 style="height:63px">
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
import { objectMerge, request } from '@/utils'

export default {
  name: 'approveRegisterHistory',
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
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      // loading
      tableDataLoading: false,
      // 流程定义
      processDefineKey: 'identificationProcess'
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
      this.tableDataLoading = true
      // console.debug(this.tableData.sort)
      const params = objectMerge(
        {
          taskDefineKey: 'waitApprove',
          processDefineKey: this.processDefineKey,
          pageSize: this.tableData.pageSize,
          pageNum: this.tableData.pageNum,
          sort: this.tableData.sort,
          defaultSort: this.defaultSort
        },
        this.filterFormData
      )
      return request({
        url: '/process/processHistoryPage',
        method: 'get',
        params: params
      })
        .finally(() => {
          this.tableDataLoading = false
        })
        .then(result => {
          this.tableDataLoading = false
          this.tableData = result.data.tableData
          // console.log(this.tableData.pageSize)
        })
        .catch(error => {
          console.log(error)
          this.tableDataLoading = false
        })
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
      this.refreshTable()
    },
    handleParamsChange() {
      // 筛选查询
      this.refreshTable()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    edit(row) {
      // console.debug(row)
      // 用户注册-审批
      this.$router.push({
        path: '/approve/history/approveRegisterHistoryInfo',
        name: 'approveRegisterHistoryInfo',
        params: {
          processInstanceId: row.procInstId,
          t: +new Date()
        }
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
