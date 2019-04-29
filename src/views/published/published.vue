<template>
  <div class="container" :media-seller-type="mediaSellerType">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">媒体刊例</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="媒体主："
                            prop="mediaSellerName">
                <el-input v-model="filterFormData.mediaSellerName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入媒体主名称"></el-input>
              </el-form-item>
              <el-form-item label="刊例名："
                            prop="publishedGroup">
                <el-input v-model="filterFormData.publishedName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入刊例名"></el-input>
              </el-form-item>
              <el-form-item label="是否上架："
                            prop="published">
                <component-select type="publishedStatus"
                                  model="center"
                                  defaultSelected=""
                                  isAll=true
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
                <el-button slot="insert"
                           class=""
                           icon="el-icon-sold-out"
                           size="mini"
                           type="warning"
                           plain
                           @click="uploadExcelHandler('common')"
                           v-if="type === 'radio'"
                >导入常规刊例
                </el-button>
                <el-button slot="insert"
                           class=""
                           icon="el-icon-news"
                           size="mini"
                           type="danger"
                           plain
                           @click="uploadExcelHandler('special')">导入特约/套播刊例
                </el-button>
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
                                 label="媒体主"
                                 align="center"
                                 prop="mediaSeller.mediaSellerName"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.hasOwnProperty('mediaSeller')">
                      {{scope.row.mediaSeller.mediaSellerName}}
                    </div>
                    <div v-else>
                      <a href="javascript:void(0)"
                         class="inline-edit"
                         @click="edit(scope.row)">没有关联媒体主</a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label="刊例名称"
                                 align="center"
                                 prop="publishedName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="刊例类型"
                                 align="center"
                                 prop="dict.dictValue"
                                 sortable="custom">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="是否上架"
                                 align="center"
                                 prop="publishedStatus">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.publishedStatus"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label="加收/折扣设置"
                                 align="center"
                                 prop="publishedAdd">
                  <template slot-scope="scope">
                    <span class="inline-edit"
                          @click="addtionalEdit(scope.row)">
                      <p v-if="scope.row.hasOwnProperty('publishedAdd')"
                         class="ok">已设置加收:编辑</p>
                      <p v-else
                         class="error">未设置加收:去设置</p>
                    </span>
                    <span class="inline-edit"
                          @click="discountEdit(scope.row)">
                      <p v-if="scope.row.hasOwnProperty('publishedDiscount')"
                         class="ok-1">已设置折扣:编辑</p>
                      <p v-else
                         class="error-1">未设置折扣:去设置</p>
                    </span>
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
    <vue-dialog :visible="visible"
                :loading="loading"
                :uploadResult="uploadResult"
                :title='"上传Excel"'
                :type='"UploadExcel"'
                @closeHandler="visible=false"
                @confirmHandler="visible=false"
                @httpRequestHandler="httpRequestHandler"></vue-dialog>
  </div>

</template>

<script>
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentFilter from '@/components/ComponentFilter'
  import ComponentFilterAdvanced from '@/components/ComponentFilterAdvanced'
  import ComponentInlineEdit from '@/components/ComponentInlineEdit'
  import VueDialog from 'cyourai-vue-dialog'
  import { request, clearParam } from '@/utils'

  import {
    selectByPage,
    deleteByCode,
    batctExecute,
    update
  } from '@/api/published/published'
  import { select } from '@/api/components/component'

  export default {
    name: 'Published',
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
        defaultSort:
          "[{'prop':'publishedCode', 'order':'descending' },{ 'prop': 'publishedStatus', 'order': 'asc'}]",
        // 数据
        tableData: {
          // 表头
          columns: [],
          // 数据
          list: []
        },
        // 默认不显示Dialog : false
        visible: false,
        // loading
        loading: false,
        // 导入结果
        uploadResult: '',
        // 上传刊例类型
        publishedType: '',
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
      ComponentInlineEdit,
      VueDialog
    },
    created() {
      // 业务类型本地化
      this.type = this.mediaSellerType
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
            // console.log(result)
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
            prop: 'publishedCode',
            order: 'descending'
          })
        }
        this.refreshTable()
      },
      handleParamsChange(publishedStatus) {
        // 筛选查询
        this.filterFormData.publishedStatus = publishedStatus
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
        row.edit = !row.edit
      },
      editCallBack(inputData) {
        // 接收子组件input传值
        console.log(inputData)
        this.inputData = inputData
        // this.filterFormData.publishedStatus = publishedStatus
      },
      inputDataChange(row) {
        // 更新当前行内容
        this.updateData(row)
        this.refreshTable()
      },
      del(row) {
        // 删除
        deleteByCode(row.publishedCode, this)
      },
      insert(row) {
        // 新增
        clearParam('publishedCode')
        clearParam('mediaSellerType')
        this.$router.push({
          path: '/published/published-edit',
          name: 'published-edit',
          params: {
            publishedCode: row.publishedCode,
            mediaSellerType: this.mediaSellerType
          }
        })
      },
      edit(row) {
        // 编辑
        this.$router.push({
          path: '/published/published-edit',
          name: 'published-edit',
          params: {
            publishedCode: row.publishedCode,
            mediaSellerType: this.mediaSellerType,
            publishedTypeCode: row.publishedTypeCode
          }
        })
      },
      addtionalEdit(row) {
        this.$router.push({
          path: '/published/published-addtional',
          name: 'published-addtional',
          params: {
            publishedCode: row.publishedCode,
            publishedTypeCode: row.publishedTypeCode,
            publishedTimeSlot: row.publishedTimeSlot,
            publishedPaths: row.publishedPaths
          }
        })
      },
      discountEdit(row) {
        this.$router.push({
          path: '/published/published-discount',
          name: 'published-discount',
          params: {
            publishedCode: row.publishedCode,
            publishedName: row.publishedName,
            mediaSellerName: row.mediaSeller.mediaSellerName
          }
        })
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
      },
      uploadExcelHandler(publishedType) {
        this.visible = true
        this.publishedType = publishedType
      },
      httpRequestHandler(params) {
        // console.debug('httpRequestHandler: %s', param)
        this.loading = true
        var form = new FormData()
        form.append('file', params.param.file, params.param.file['filename'])
        form.append('publishedType', this.publishedType)
        return request({
          baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
          url: '/media/published/uploadExcel',
          method: 'post',
          data: form,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data;boundary=boundary'
            }
          }
        })
          .then(result => {
            // console.log(result)
            this.uploadResult =
              this.uploadResult +
              '------------------------------------------------------------------------\r\n' +
              result.data.messageList.title
            this.loading = false
            params.uploadExcel.clearFiles()
          })
          .catch(error => {
            console.error(error)
            this.loading = false
          })
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    }
    // directives: {
    //   focus: {
    //     inserted: function(el, { value }) {
    //       if (value) {
    //         el.focus()
    //       }
    //     }
    //   }
    // },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
