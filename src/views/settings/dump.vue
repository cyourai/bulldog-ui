<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">数据备份</p>
        <div class="content-spe-element" v-loading="loading">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     id="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="文件名："
                            prop="dumpName">
                <el-input v-model="filterFormData.dumpName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入文件名："></el-input>
              </el-form-item>
            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询
            </el-button>
            <el-upload class="buttonNewTableData"
                       ref="upload"
                       slot="insert"
                       action=''
                       multiple
                       :http-request="uploadHandler"
                       :show-file-list='false'
                       accept=".sql">
              <el-button style="margin-left: 10px"
                         icon="el-icon-upload"
                         plain
                         size="mini"
                         type="info">上传备份文件
              </el-button>
            </el-upload>
            <el-button class="buttonNewTableData"
                       icon="el-icon-download"
                       slot="insert"
                       size="mini"
                       type="success"
                       plain
                       @click="insertDump">备份
            </el-button>
          </ComponentFilter>
          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>文件列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">
              <el-table fit
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
                <el-table-column label="文件名"
                                 align="center"
                                 prop="dumpName"
                                 width="300"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="文件大小"
                                 align="center"
                                 prop="dumpSize"
                                 width="150"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="备份人"
                                 align="center"
                                 prop="updateUser"
                                 width="150"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="备份时间"
                                 align="center"
                                 prop="createTime"
                                 sortable="custom">
                </el-table-column>

                <el-table-column label="操作"
                                 fixed="right"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="还原"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-upload2"
                                 size="mini"
                                 type="primary"
                                 @click="dbRestore(scope.row)"></el-button>
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
  import ComponentFilter from '@/components/ComponentFilter'
  import ComponentSelect from '@/components/ComponentSelect'
  import { request } from '@/utils'
  import {
    selectByPage,
    insertDump,
    dbRestore,
    deleteByCode,
    batctExecute
  } from '@/api/settings/dump'

  export default {
    name: 'dump',
    components: {
      ComponentFilter,
      ComponentSelect
    },
    data() {
      return {
        // 上传loading
        loading: false,
        // 默认排序
        defaultSort:
          '[{ \'prop\': \'createTime\', \'order\': \'desc\'}]',
        // 数据
        tableData: {},
        // 筛选
        filterFormData: {},
        // 批量操作筛选
        batchFilterData: '',
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
        // 表格数据初始化
        this.refreshTable()
      },
      refreshTable() {
        this.tableDataLoading = true
        selectByPage(this)
          .then(result => {
            this.tableData = result.data.tableData
            // console.log(this.tableData)
          })
          .finally(() => {
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
      insertDump() {
        // 新增备份文件
        this.loading = true
        insertDump().then(result => {
          this.refreshTable()
        }).finally(() => {
          this.loading = false
        })
      },
      uploadHandler(param) {
        this.loading = true
        var form = new FormData()
        form.append('file', param.file, param.file['filename'])
        request({
          // zuul/api 前置zuul对应上传中文问题
          baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
          url: '/center/dump/uploadFile',
          method: 'post',
          data: form,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data;boundary=boundary'
            }
          }
        }).then(() => {
          this.refreshTable()
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          this.fileList = []
          this.loading = false
        })
      },
      dbRestore(row) {
        // 根据备份文件还原数据库
        dbRestore(row).then(result => {
          this.refreshTable()
        })
      },
      del(row) {
        // 删除
        // console.log(row.dumpCode)
        deleteByCode(row.dumpCode, this)
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .uploader {
    margin-left: 10px;
    float: right;
  }
</style>

