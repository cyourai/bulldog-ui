<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">客户需求</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="130px"
                     label-position="left">
              <el-form-item label="客户手机："
                            prop="customServiceContactPhone">
                <el-input v-model="filterFormData.customServiceContactPhone"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="是否已读："
                            prop="customServiceStatus">
                <component-select type="isRead"
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
                <el-table-column min-width="180"
                                 label="公司名"
                                 align="center"
                                 prop="customServiceCompanyName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="80"
                                 label="联系人姓名"
                                 align="center"
                                 prop="customServiceContactName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="100"
                                 label="联系电话"
                                 align="center"
                                 prop="customServiceContactPhone"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="120"
                                 label="邮箱"
                                 align="center"
                                 prop="customServiceContactEmail"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="355"
                                 label="需求"
                                 align="center"
                                 prop="customServiceRemark"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="120"
                                 label="是否已确认"
                                 align="center"
                                 prop="customServiceStatus"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-if="scope.row.customServiceStatus == 1">已读</span>
                    <span v-else>未读&nbsp;&nbsp;&nbsp;<el-button type="warning" @click="update(scope.row)">确认</el-button></span>
                  </template>
                </el-table-column>
                <el-table-column min-width="100"
                                 label="操作"
                                 fixed="right"
                                 align="center">
                  <template slot-scope="scope">
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
  update
} from '@/api/customService'
import { select } from '@/api/components/component'
export default {
  name: 'customService',
  data() {
    return {
      // 默认排序
      defaultSort: "[{'prop':'customServiceStatus', 'order':'asc' },{ 'prop': 'createTime', 'order': 'descending'}]",
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
      this.refreshTable()
    },
    handleParamsChange(mediaSellerStatus) {
      // 筛选查询
      this.filterFormData.mediaSellerStatus = mediaSellerStatus
      this.refreshTable()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    update(row) {
      // 行内更新状态
      update(row).then(() => {
        // 表格数据初始化
        this.refreshTable()
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
      // this.filterFormData.mediaSellerStatus = mediaSellerStatus
    },
    inputDataChange(row) {
      // 更新当前行内容
      this.update(row)
      this.refreshTable()
    },
    del(row) {
      // 删除
      deleteByCode(row.customServiceCode, this)
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
</style>
