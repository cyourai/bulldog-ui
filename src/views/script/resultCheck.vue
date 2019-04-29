<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">

      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">检查结果列表</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="检查结果："
                            prop="scriptResultCheckName">
                <el-input v-model="filterFormData.scriptResultCheckName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入脚本名："></el-input>
              </el-form-item>
              <!-- <el-form-item label="脚本状态："
                            prop="userStatus">
                <component-select type="enable"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="handleParamsChange"></component-select>
              </el-form-item> -->
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
                       @click="insert">新增
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-upload2"
                       size="mini"
                       type="warning"
                       plain
                       @click="visible=true">导入
            </el-button>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>用户列表</span>
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
                <el-table-column width="50"
                                 type="selection"
                                 align="center">
                </el-table-column>
                <el-table-column label="结果检查名称"
                                 align="center"
                                 prop="scriptResultCheckName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="结果检查表达式"
                                 align="center"
                                 prop="scriptResultCheckCondition"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="更新人"
                                 align="center"
                                 prop="updateUser"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="120"
                                 label="操作"
                                 fixed="right"
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
                                placement="right">
                      <el-button plain
                                 icon="el-icon-delete"
                                 size="mini"
                                 type="danger"
                                 @click="del(scope.row)"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-content-page">
              <!--批量操作-->
              <el-select v-model="batchFilterData"
                         placeholder="批量操作">
                <el-option label="批量删除"
                           key="delete"
                           value="delete">
                </el-option>
              </el-select>
              <el-button size="mini"
                         type="primary"
                         plain
                         class="table-content-page-search"
                         @click="batctExecute()">确定</el-button>
              <!--分页-->
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handlePageChange"
                             layout="total, sizes, prev, pager, next, jumper"
                             :page-sizes="[10, 20, 30, 40, 50, 100]"
                             :page-size="10"
                             :total="tableData.total">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>

      <!-- dialog -->
      <vue-dialog :visible="visible"
                  :title='"脚本库"'
                  :type='"Script"'
                  :width='"80%"'
                  @closeHandler="visible=false">
      </vue-dialog>

    </div>

  </div>

</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import VueDialog from 'cyourai-vue-dialog'
import { select } from '@/api/components/component'
import { scriptResultCheckByPage } from '@/api/script/script'
import { clearParam } from '@/utils'

export default {
  name: 'resultCheck',
  components: {
    ComponentFilter,
    VueDialog
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'scriptResultCheckName', 'order':'asc' },{ 'prop': 'scriptResultCheckName', 'order': 'asc'}]",
      // 数据
      tableData: {},
      // 筛选
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      // 下拉列表选项
      statusOptions: [],
      // loading
      tableDataLoading: false,
      // 选项发生改变
      multipleSelection: [],
      // 显示选择库弹窗
      visible: false
    }
  },
  created() {
    // 页面初始化
    this.init()
  },
  methods: {
    init() {
      // 下拉列表选项
      select('enable', '', true).then(result => {
        this.statusOptions = result.data.options
      })
      // 表格数据初始化
      this.refreshTable()
    },
    refreshTable() {
      scriptResultCheckByPage(this)
        .then(result => {
          this.tableData = result.data.tableData
          // console.log(this.tableData)
          this.tableDataLoading = false
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
      // 排序
      this.tableData.sort = JSON.stringify({
        prop: column.prop,
        order: column.order
      })
      this.refreshTable()
    },
    // handleParamsChange(userStatus) {
    //   // 筛选查询
    //   this.filterFormData.userStatus = userStatus
    //   this.refreshTable()
    // },
    // del(row) {
    //   // 删除
    //   deleteByCode(row.scriptCode, this)
    // },
    insert() {
      // 新增
      clearParam('scriptResultCheckCode')
      this.$router.push({
        path: '/script/resultCheckEdit',
        name: 'resultCheckEdit'
      })
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/script/resultCheckEdit',
        name: 'resultCheckEdit',
        params: {
          scriptResultCheckCode: row.scriptResultCheckCode
        }
      })
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
    }
    // batctExecute() {
    //   // 批量操作
    //   const delCodes = []
    //   for (const select of this.multipleSelection) {
    //     delCodes.push(select.userCode)
    //   }
    //   deleteArrayCode(delCodes, this)
    // }
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.el-table /deep/ {
  td div {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
