<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">限时抢购</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="80px"
                     label-position="left">
              <el-form-item label="抢购计划名称"
                            prop="flashSalePublishedName">
                <el-input v-model="filterFormData.flashSalePublishedName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="刊例名称"
                            prop="publishedName">
                <el-input v-model="filterFormData.publishedName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
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
                       @click="addFlashSaleClickHandler">添加抢购</el-button>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>数据列表</span>
              <div class="table-content-header-search">
                <!-- <span>修改基本信息</span>
                                <span>修改商品详情</span>
                                <el-select v-model="value2"
                                           placeholder="排序方式">
                                  <el-option v-for="item in options"
                                             :key="item.value"
                                             :label="item.label"
                                             :value="item.value">
                                  </el-option>
                                </el-select> -->
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
                                 label="抢购计划名称"
                                 align="center"
                                 prop="flashSalePublishedName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="180"
                                 label="刊例名称"
                                 align="center"
                                 prop="published.publishedName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="120"
                                 label="抢购状态"
                                 align="center"
                                 prop="flashSaleDateRange"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-if="scope.row.flashSaleStatus === 0">已结束</span>
                    <span v-if="scope.row.flashSaleStatus === 1">未开始</span>
                    <span v-if="scope.row.flashSaleStatus === 2">抢购中</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="200"
                                 label="抢购开始-结束时间"
                                 align="center"
                                 prop="flashSaleDateRange"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="50"
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
  } from '@/api/flashSale/flashSale'
  import { select } from '@/api/components/component'
  export default {
    name: 'recommend',
    data() {
      return {
        // 默认排序
        defaultSort: '[]',
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
      handleSelectionChange(value) {
        this.multipleSelection = value
      },
      update(row) {
        // 行内更新状态
        update(row)
      },
      toggle(row, item) {
        row[item] = !row[item]
      },
      inputDataChange(row) {
        // 更新当前行内容
        this.update(row)
        this.refreshTable()
      },
      del(row) {
        // 删除
        deleteByCode(row.flashSaleCode, this)
      },
      addFlashSaleClickHandler() {
        // 新增限时抢购
        this.$router.push({
          path: '/flashSale/flashSaleEdit-edit',
          name: 'flashSale-edit'
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
</style>
