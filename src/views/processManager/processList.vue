<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">流程模型</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="流程名："
                            prop="name">
                <el-input v-model="filterFormData.name"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入流程名"></el-input>
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
                       @click="insert">新建流程
            </el-button>
          </component-filter>

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
                <el-table-column label="流程名"
                                 align="center"
                                 prop="name"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="流程key"
                                 align="center"
                                 prop="key"
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
                         @click="batchExecute()">确定</el-button>
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
    </div>

  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import { select } from '@/api/components/component'
import {
  selectModelListByPage,
  deleteByCode,
  batchExecute
} from '@/api/process/process'
import { clearParam } from '@/utils'

export default {
  name: 'process',
  components: {
    ComponentSelect,
    ComponentFilter
  },
  data() {
    return {
      // 默认排序
      defaultSort: "[{'prop':'name', 'order':'asc' }]",
      // 数据
      tableData: {
        pageNum: 1,
        pageSize: 10
      },
      // 筛选
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      // 下拉列表选项
      statusOptions: [],
      // loading
      tableDataLoading: false,
      // 选项发生改变
      multipleSelection: []
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
      // console.log(this.filterFormData)
      selectModelListByPage(this)
        .then(result => {
          this.tableData = result.data.tableData
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
      if (JSON.parse(this.tableData.sort).prop === null) {
        this.tableData.sort = JSON.stringify({
          prop: 'name',
          order: 'asc'
        })
      }
      this.refreshTable()
    },
    handleParamsChange(userStatus) {
      // 筛选查询
      this.filterFormData.userStatus = userStatus
      this.refreshTable()
    },
    handleSwitchChange(row) {
      // 开关-改变行内状态
      this.updateData(row)
    },
    del(row) {
      // 删除
      var array = []
      array.push(row.id)
      // console.log(array)
      deleteByCode(this, array)
    },
    insert() {
      // 新增
      clearParam('id')
      this.$router.push({
        path: '/processManager/process-edit',
        name: 'process-edit'
      })
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/processManager/process-edit',
        name: 'process-edit',
        params: {
          id: row.id
        }
      })
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
    },
    batchExecute() {
      // 批量操作
      const delCodes = []
      for (const select of this.multipleSelection) {
        delCodes.push(select.id)
      }
      batchExecute(this)
    }
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
</style>
