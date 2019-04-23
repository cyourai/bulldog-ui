<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">订单管理</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="110px"
                     label-position="left">
              <el-form-item label="下单用户："
                            prop="orderUserName">
                <el-input v-model="filterFormData.orderUserName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="订单状态："
                            prop="orderStatus">
                <component-select type="orderStatus"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="handleParamsChange"></component-select>
              </el-form-item>
            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询</el-button>
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
                <el-table-column min-width="100"
                                 label="下单用户"
                                 align="center"
                                 prop="orderUserName"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span @click="getUser(scope.row)"
                          class="inline-edit">
                      {{scope.row.orderUserName}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label=订单号
                                 fixed
                                 align="center"
                                 prop="orderNum"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="250"
                                 label=刊例名
                                 fixed
                                 align="center"
                                 prop="orderPublishedName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="100"
                                 label="广告资源数量"
                                 align="center"
                                 prop="orderPublishedCount"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="100"
                                 label="媒体数量"
                                 align="center"
                                 prop="orderMediaCount"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="100"
                                 label="订单状态"
                                 align="center"
                                 prop="orderStatus"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderStatus === 'orderCreate'">
                      广告主下单
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitAccepted'">
                      平台接单
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitContract'">
                      三方签订合同
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitPay'">
                      广告主支付
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitCheck'">
                      平台上传播出证明
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitConfirm'">
                      三方验收
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'end'">
                      <p class="success">已结束</p>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'refuse'">
                      <p class="red">已拒绝</p>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column min-width="100"
                                 label="订单总金额(刊例价)"
                                 align="center"
                                 prop="orderTotalPrice"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="100"
                                 label="合同金额"
                                 align="center"
                                 prop="orderFinallyTotalPrice"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderStatus === 'orderCreate'">
                      待确认金额
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitAccepted'">
                      待确认金额
                    </span>
                    <span v-else>
                      {{scope.row.orderFinallyTotalPrice}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column min-width="200"
                                 label="操作"
                                 fixed="right"
                                 align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderStatus === 'orderCreate'">
                      <el-tooltip content="确认订单"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-edit"
                                   size="mini"
                                   type="primary"
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitAccepted'">
                      <el-tooltip content="确认订单"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-edit"
                                   size="mini"
                                   type="primary"
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitContract'">
                      <el-tooltip content="三方签订合同"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-edit-outline"
                                   size="mini"
                                   type=""
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitPay'">
                      <el-tooltip content="广告主支付"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-phone-outline"
                                   size="mini"
                                   type="warning"
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitCheck'">
                      <el-tooltip content="平台上传播出证明"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-printer"
                                   size="mini"
                                   type="warning"
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'orderWaitConfirm'">
                      <el-tooltip content="三方验收"
                                  placement="left">
                        <el-button plain
                                   icon="el-icon-success"
                                   size="mini"
                                   type="warning"
                                   @click="edit(scope.row)"></el-button>
                      </el-tooltip>
                    </span>
                    <span v-else-if="scope.row.orderStatus === 'refuse'">
                    </span>
                    <el-tooltip content="查看流程"
                                placement="bottom">
                      <el-button plain
                                 icon="el-icon-news"
                                 size="mini"
                                 type="success"
                                 @click="process(scope.row)"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-content-page">
              <!--批量操作-->
              <!--<el-select v-model="batchFilterData"
                         placeholder="批量操作">
                <el-option label="批量删除"
                           key="delete"
                           value="delete">
                </el-option>
              </el-select>-->
              <el-button size="mini"
                         type="primary"
                         v-show="false"
                         plain
                         class="table-content-page-search"
                         @click="batctExecute()">确定</el-button>
              <!--分页-->
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handlePageChange"
                             layout="total, sizes, prev, pager, next, jumper"
                             :page-size="tableData.size"
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
import ComponentFilterAdvanced from '@/components/ComponentFilterAdvanced'
import ComponentMask from '@/components/ComponentMask'
import ComponentInlineEdit from '@/components/ComponentInlineEdit'
import {
  selectByPage,
  deleteByCode,
  batctExecute,
  getTaskId,
  update
} from '@/api/order/order'
import { select } from '@/api/components/component'
export default {
  name: 'mediaSeller',
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'orderId', 'order':'descending' }, {'prop':'orderStatus', 'order':'ascending' }]",
      // 数据
      tableData: {
        // 表头
        columns: [],
        // 数据
        list: []
      },
      // 筛选
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      statusOptions: [],
      // loading
      tableDataLoading: false,
      focusState: false,
      // 行内编辑
      inputData: ''
    }
  },
  components: {
    ComponentSelect,
    ComponentFilter,
    ComponentFilterAdvanced,
    ComponentMask,
    ComponentInlineEdit
  },
  created() {
    // 页面初始化
    this.init()
  },
  methods: {
    init() {
      select('enable', '', true).then(result => {
        this.statusOptions = result.data.options
      })
      // 表格数据初始化
      this.refreshTable()
    },
    refreshTable() {
      this.tableDataLoading = true
      selectByPage(this)
        .then(result => {
          this.tableDataLoading = false
          this.tableData = result.data.tableData
        })
        .catch(() => {
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
      this.tableData.sort = JSON.stringify({
        prop: column.prop,
        order: column.order
      })
      if (JSON.parse(this.tableData.sort).prop === null) {
        this.tableData.sort = JSON.stringify({
          prop: 'orderId',
          order: 'descending'
        })
      }
      this.refreshTable()
    },
    handleParamsChange(orderStatus) {
      // 筛选查询
      this.filterFormData.orderStatus = orderStatus
      this.refreshTable()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    update(row) {
      // 行内更新状态
      update(row)
    },
    getUser(row) {
      this.$router.push({
        path: '/settings/user-edit',
        name: 'user-edit',
        params: {
          userName: row.userName
        }
      })
    },
    handleSwitchChange(row) {
      // 开关-改变行内状态
      this.update(row)
    },
    focusclick(row) {
      this.$nextTick(function() {
        // this.focusState = true
        document.getElementById('keywords').focus()
      })
    },
    rowEdit(row, item) {
      // 行内编辑
      // console.log(row)
      this.update(row)
      this.toggle(row, item)
    },
    toggle(row, item) {
      row[item] = !row[item]
    },
    editCallBack(inputData) {
      // 接收子组件input传值
      this.inputData = inputData
      // this.filterFormData.orderStatus = orderStatus
    },
    inputDataChange(row) {
      // 更新当前行内容
      this.update(row)
      this.refreshTable()
    },
    del(row) {
      // 删除
      deleteByCode(row.mediaSellerCode, this)
    },
    edit(row) {
      // 生成排期单
      if (row.orderStatus === 'orderWaitAccepted') {
        this.$router.push({
          path: '/order/order-schedule',
          name: 'order-schedule',
          params: {
            orderCode: row.orderCode,
            orderStatus: row.orderStatus,
            nextStatus: 'orderWaitContract'
          }
        })
      }
      // 三方签订合同
      if (row.orderStatus === 'orderWaitContract') {
        this.$router.push({
          path: '/order/order-schedule',
          name: 'order-schedule',
          params: {
            orderCode: row.orderCode,
            orderStatus: row.orderStatus,
            nextStatus: 'orderWaitPay'
          }
        })
      }
      // 广告主支付
      if (row.orderStatus === 'orderWaitPay') {
        this.$router.push({
          path: '/order/order-schedule',
          name: 'order-schedule',
          params: {
            orderCode: row.orderCode,
            orderStatus: row.orderStatus,
            nextStatus: 'orderWaitCheck'
          }
        })
      }
      // 平台上传播出证明
      if (row.orderStatus === 'orderWaitCheck') {
        this.$router.push({
          path: '/order/order-schedule',
          name: 'order-schedule',
          params: {
            orderCode: row.orderCode,
            orderStatus: row.orderStatus,
            nextStatus: 'orderWaitConfirm'
          }
        })
      }
      // 平台确认
      if (row.orderStatus === 'orderWaitConfirm') {
        this.$router.push({
          path: '/order/order-schedule',
          name: 'order-schedule',
          params: {
            orderCode: row.orderCode,
            orderStatus: row.orderStatus,
            nextStatus: 'end'
          }
        })
      }
    },
    process(row) {
      getTaskId(row.orderCode, true).then(result => {
        const taskId = result.data.taskId
        // 查看流程
        window.open(
          process.env.BASE_API +
            process.env.PREFIX +
            '/process/model/front/permit/selectProcessBmpByTaskId/' +
            taskId
        )
      })
    },
    batctExecute() {
      // 批量操作
      batctExecute(this)
    }
  },
  watch: {
    $route(to, from) {
      // this.fetchData()
    }
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.table-content-page {
  height: 50px;
}
.red {
  color: #c03639;
}
.success {
  color: #30b08f;
}
</style>
