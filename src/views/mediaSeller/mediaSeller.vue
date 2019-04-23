<template>
  <div class="container" :media-seller-type="mediaSellerType">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">媒体主</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="130px"
                     label-position="left">
              <el-form-item label="媒体主名称/简称："
                            prop="mediaSellerName">
                <el-input v-model="filterFormData.mediaSellerName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="媒体主状态："
                            prop="mediaSellerStatus">
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
                                 label="媒体主名称"
                                 align="center"
                                 prop="mediaSellerName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="180"
                                 label="简称"
                                 fixed
                                 align="center"
                                 prop="mediaSellerShortName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="180"
                                 label="类别"
                                 align="center"
                                 prop="mediaType.mediaTypeName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="180"
                                 label="投放区域"
                                 align="center"
                                 prop="mediaSellerArea"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="180"
                                 label="媒体状态"
                                 align="center"
                                 prop="mediaSellerStatus"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.mediaSellerStatus"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column min-width="180"
                                 label="Logo"
                                 align="center"
                                 prop="mediaSellerLogo"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <img :src="scope.row.mediaSellerLogo" v-if="scope.row.mediaSellerLogo !== ''"
                         style="width:50px;height:50px;">
                  </template>
                </el-table-column>
                <el-table-column min-width="180"
                                 label="地区权重"
                                 align="center"
                                 prop="mediaSellerAreaWeight"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.editArea"
                          @click="toggle(scope.row, 'editArea')"
                          class="inline-edit">
                      {{scope.row.mediaSellerAreaWeight}}
                      <svg-icon icon-class="pen"/>
                    </span>
                    <el-button class="buttonSort"
                               v-show="scope.row.editArea"
                               size="mini"
                               type="success"
                               @click="rowEdit(scope.row,'editArea')">确定
                    </el-button>
                    <el-input v-show="scope.row.editArea"
                              v-model="scope.row.mediaSellerAreaWeight"
                              v-focus="focusState"
                              id="keywords"></el-input>
                  </template>
                </el-table-column>
                <el-table-column min-width="180"
                                 label="平台权重"
                                 align="center"
                                 prop="mediaSellerPlatformWeight"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <span v-show="!scope.row.editPlat"
                          @click="toggle(scope.row, 'editPlat')"
                          class="inline-edit">
                      {{scope.row.mediaSellerPlatformWeight}}
                      <svg-icon icon-class="pen"/>
                    </span>
                    <el-button class="buttonSort"
                               v-show="scope.row.editPlat"
                               size="mini"
                               type="success"
                               @click="rowEdit(scope.row,'editPlat')">确定
                    </el-button>
                    <el-input v-show="scope.row.editPlat"
                              v-model="scope.row.mediaSellerPlatformWeight"
                              v-focus="focusState">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column min-width="200"
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
                         @click="batctExecute()">确定
              </el-button>
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
  import { clearParam } from '@/utils'
  import {
    selectByPage,
    deleteByCode,
    batctExecute,
    update
  } from '@/api/mediaSeller/mediaSeller'
  import { select } from '@/api/components/component'

  export default {
    name: 'MediaSeller',
    props: {
      mediaSellerType: {
        String,
        default: 'radio'
      }
    },
    data() {
      return {
        // 业务类型
        type: 'radio',
        // 默认排序
        defaultSort: "[{'prop':'mediaSellerName', 'order':'descending' }]",
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
      // 业务类型本地化
      this.type = this.mediaSellerType
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
      page(mediaSellerType) {
        // 判断是否点击切换连接
        this.type = mediaSellerType
        this.refreshTable()
      },
      refreshTable() {
        this.tableDataLoading = true
        selectByPage(this)
          .then(result => {
            this.tableDataLoading = false
            this.tableData = result.data.tableData
            // 追加编辑平台地区操作
            this.tableData.list = result.data.tableData.list.map(row => {
              this.$set(row, 'editPlat', false)
              this.$set(row, 'editArea', false)
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
        this.tableData.sort = JSON.stringify({
          prop: column.prop,
          order: column.order
        })
        if (JSON.parse(this.tableData.sort).prop === null) {
          this.tableData.sort = JSON.stringify({
            prop: 'mediaSellerName',
            order: 'descending'
          })
        }
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
        update(row)
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
        deleteByCode(row.mediaSellerCode, this)
      },
      insert() {
        // 新增
        clearParam('mediaSellerCode')
        clearParam('mediaSellerTypeCode')
        this.$router.push({
          path: '/settings/mediaSeller-edit',
          name: 'mediaSeller-edit',
          params: {
            mediaSellerTypeCode: this.type
          }
        })
      },
      edit(row) {
        // 编辑
        this.$router.push({
          path: '/settings/mediaSeller-edit',
          name: 'mediaSeller-edit',
          params: {
            mediaSellerCode: row.mediaSellerCode,
            mediaSellerTypeCode: this.type
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
