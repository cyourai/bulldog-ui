<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">数据字典</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="字典内容："
                            prop="dictValue">
                <el-input v-model="filterFormData.dictValue"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="字典分组："
                            prop="dictGroup">
                <el-input v-model="filterFormData.dictGroup"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入分组"></el-input>
              </el-form-item>
              <el-form-item label="字典状态："
                            prop="dictStatus">
                <component-select type="enable"
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
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-plus"
                       size="mini"
                       type="success"
                       plain
                       @click="insert">新增</el-button>
          </component-filter>
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
                <el-table-column min-width="150"
                                 label="字典编号"
                                 align="center"
                                 prop="dictKey"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="字典值"
                                 align="center"
                                 prop="dictValue"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="分组"
                                 align="center"
                                 prop="dictGroup"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="有效"
                                 align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.dictStatus"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label="排序"
                                 align="center"
                                 prop="dictSort"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.edit"
                          @click="scope.row.edit=!scope.row.edit"
                          class="inline-edit">
                      {{scope.row.dictSort}}
                      <svg-icon icon-class="pen" />
                    </span>
                    <el-button class="buttonSort"
                               v-show="scope.row.edit"
                               size="mini"
                               type="success"
                               @click="sortEdit(scope.row)">确定</el-button>
                    <el-input v-show="scope.row.edit"
                              v-model="scope.row.dictSort"
                              id="keywords"
                              @keyup.enter.native="sortEdit(scope.row)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column min-width="200"
                                 label="操作"
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
    </div>
  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import { select } from '@/api/components/component'
import {
  selectByPage,
  deleteByCode,
  batctExecute,
  update
} from '@/api/settings/dict'
import { clearParam } from '@/utils'

export default {
  name: 'dictionary',
  components: {
    ComponentSelect,
    ComponentFilter
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'dictGroup', 'order':'descending' },{ 'prop': 'dictSort', 'order': 'asc'}]",
      // 数据
      tableData: {
        // 表头
        columns: []
      },
      // 筛选
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      statusOptions: [],
      // loading
      tableDataLoading: false,
      // 行内编辑
      inputData: ''
    }
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
          // console.log(result)
          this.tableDataLoading = false
          this.tableData = result.data.tableData
          // 追加编辑字典排序操作
          this.tableData.list = result.data.tableData.list.map(row => {
            this.$set(row, 'edit', false)
            return row
          })
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
      // console.log(JSON.parse(this.tableData.sort))
      if (JSON.parse(this.tableData.sort).prop === null) {
        this.tableData.sort = JSON.stringify({
          prop: 'dictGroup',
          order: 'descending'
        })
      }
      this.refreshTable()
    },
    handleParamsChange(dictStatus) {
      // 筛选查询
      this.filterFormData.dictStatus = dictStatus
      this.refreshTable()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    updateData(row) {
      // 行内更新状态
      update(row)
    },
    handleSwitchChange(row) {
      // 开关-改变行内状态
      this.updateData(row)
    },
    sortEdit(row) {
      // 行内编辑
      this.updateData(row)
      row.edit = !row.edit
    },
    del(row) {
      // 删除
      deleteByCode(row.dictCode, this)
    },
    insert() {
      // 新增
      clearParam('dictCode')
      this.$router.push({
        path: '/settings/dict-edit',
        name: 'dict-edit'
      })
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/settings/dict-edit',
        name: 'dict-edit',
        params: {
          dictCode: row.dictCode
        }
      })
    },
    batctExecute() {
      // 批量操作
      batctExecute(this)
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
