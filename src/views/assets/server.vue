<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">

      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">服务器列表</p>
        <div class="content-spe-element"
             v-loading="loading">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="服务器："
                            prop="serverName">
                <el-input v-model="filterFormData.serverName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入服务器："></el-input>
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
            <!--由于adhoc访问时需要密码，暂时隐藏清除密码功能-->
            <!--<el-button slot="insert"-->
                       <!--class="buttonNewTableData"-->
                       <!--icon="el-icon-circle-close-outline"-->
                       <!--size="mini"-->
                       <!--type="success"-->
                       <!--plain-->
                       <!--@click="remove">清除密码-->
            <!--</el-button>-->
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-caret-right"
                       size="mini"
                       type="success"
                       plain
                       @click="test">批量测试
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-document"
                       size="mini"
                       type="success"
                       plain
                       @click="ssh">批量推送公钥
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-download"
                       size="mini"
                       type="warning"
                       plain
                       @click="exportExcel">导出
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-upload2"
                       size="mini"
                       type="warning"
                       plain
                       @click="importExcel">导入
            </el-button>
            <!--<el-button slot="insert"-->
            <!--class="buttonNewTableData"-->
            <!--icon="el-icon-sold-out"-->
            <!--size="mini"-->
            <!--type="warning"-->
            <!--plain-->
            <!--@click="downloadTemplate">下载模板-->
            <!--</el-button>-->
            <router-link to="/dashboard">回首页</router-link>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>服务器列表</span>
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
                <el-table-column label="服务器名称"
                                 align="center"
                                 prop="serverName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="服务器IP地址"
                                 width="130"
                                 align="center"
                                 prop="serverIp"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="服务器登录用户名"
                                 width="160"
                                 align="center"
                                 prop="serverUserName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="服务器类型"
                                 align="center"
                                 prop="serverType"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="更新人"
                                 align="center"
                                 prop="updateUser"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="测试结果"
                                 width="120"
                                 align="center">
                  <template slot-scope="scope">
                    <el-progress :stroke-width="18"
                                 :show-text="false"
                                 :percentage="scope.row.percentage"
                                 v-loading="scope.row.loading"
                                 element-loading-text="测试中"
                                 element-loading-spinner="el-icon-loading"
                                 v-show="!scope.row.testLoading"></el-progress>
                    <el-tag class="showTag"
                            v-if="scope.row.pingFlag === 'true'"
                            v-show="scope.row.testLoading"
                            type="success">正常
                    </el-tag>
                    <el-tag class="showTag"
                            v-show="scope.row.testLoading"
                            v-else
                            type="danger">异常
                    </el-tag>
                    <el-button type="text"
                               @click="showResult(scope.row)">显示返回结果</el-button>
                    <!--:disable-transitions="true"-->
                  </template>
                  <a href="www.baidu.com">
                    1615665
                  </a>
                </el-table-column>
                <el-table-column min-width="120"
                                 label="操作"
                                 fixed="right"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="测试"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-caret-right"
                                 size="mini"
                                 type="success"
                                 @click="testPing(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑"
                                placement="top">
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
                             :page-sizes="[10, 20, 30, 40, 50, 100]"
                             :page-size="10"
                             :total="tableData.total">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>

      <vue-dialog :visible="visible"
                  :loading="excelLoading"
                  :uploadResult="uploadResult"
                  :title='"上传Excel"'
                  :type='"UploadExcel"'
                  @closeHandler="visible=false"
                  @confirmHandler="visible=false"
                  @httpRequestHandler="this.httpRequestHandler">
      </vue-dialog>

      <el-dialog title="返回结果"
                 :visible.sync="dialogVisible"
                 width="60%">
        <span id="testContent"
              :loading="testResultLoading"
              v-if="!testResultLoading"
              ref="testContent"></span>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </div>

  </div>

</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import VueDialog from 'ctsi-vue-dialog'
import { select } from '@/api/components/component'
import { clearParam } from '@/utils'
import { request } from '@/utils/request'
import {
  selectServerByPage,
  deleteByCode,
  batctExecute,
  testPing,
  test,
  ssh,
  remove,
  getByServerCode
} from '@/api/assets/assets'

export default {
  name: 'scriptServer',
  components: {
    ComponentFilter,
    VueDialog
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'serverName', 'order':'asc' },{ 'prop': 'serverName', 'order': 'asc'}]",
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
      visible: false,
      // 测试中
      loading: false,
      // 服务器编号
      serverCodes: '',
      // excel加载
      excelLoading: false,
      // 导入结果
      uploadResult: '',
      // dialog是否显示
      dialogVisible: false,
      // dialog的loading
      testLoading: false,
      // 执行结果回文(每行)
      testContent: '',
      // 执行结果回文(整体)
      testContentArray: '',
      // 批量测试flag回文
      resultArray: '',
      // 显示结果loading
      testResultLoading: false
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
      selectServerByPage(this)
        .then(result => {
          this.tableData = result.data.tableData
          // 添加percentage属性
          this.tableData.list = result.data.tableData.list.map(row => {
            this.$set(row, 'percentage', 0)
            // v.originalTitle = v.title
            return row
          })
          // 添加pingFlag属性
          this.tableData.list = result.data.tableData.list.map(row => {
            this.$set(row, 'pingFlag', 0)
            // v.originalTitle = v.title
            return row
          })
          // 添加loading属性
          this.tableData.list = result.data.tableData.list.map(row => {
            this.$set(row, 'loading', 0)
            // v.originalTitle = v.title
            return row
          })
          // 添加testLoading属性
          this.tableData.list = result.data.tableData.list.map(row => {
            this.$set(row, 'testLoading', 0)
            // v.originalTitle = v.title
            return row
          })
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
          prop: 'serverName',
          order: 'asc'
        })
      }
      this.refreshTable()
    },
    // 删除
    del(row) {
      deleteByCode(row.serverCode, this)
    },
    insert() {
      // 新增
      clearParam('serverCode')
      this.$router.push({
        path: '/assets/serverEdit',
        name: 'serverEdit'
      })
    },
    test() {
      if (this.multipleSelection.length === 0) {
        this.$alert('请先选择服务器')
        return
      }
      this.loading = true
      // 批量测试
      test(this, this.serverCodes).then(result => {
        this.testContentArray = result.data.response
        this.resultArray = result.data.result
        console.log(result)
        // console.log(this.testContentArray)
      }).finally(() => {
        this.loading = false
      })
    },
    // 分别显示返回结果
    showResult(row) {
      this.dialogVisible = true
      getByServerCode(row.serverCode)
        .then(result => {
          // 初始化
          document.getElementById('testContent').innerHTML = ''
          // 如果测试结果列表不为空
          if (this.testContentArray !== '') {
            const testContentArray = JSON.parse(this.testContentArray)
            for (var i in testContentArray) {
              // console.log(i)
              if (i === row.serverIp) {
                this.testContent = testContentArray[i]
                document.getElementById(
                  'testContent'
                ).innerHTML = this.testContent
                return
              }
            }
          }
        })
        .finally(() => {
          this.testResultLoading = false
        })
    },
    ssh() {
      if (this.multipleSelection.length === 0) {
        this.$alert('请先选择服务器')
        return
      }
      this.loading = true
      // 批量推送公钥
      ssh(this, this.serverCodes).then(result => {
        this.testContentArray = result.data.response
        // console.log(result)
      }).finally(() => {
        this.loading = false
      })
    },
    remove() {
      // 清除密码（可批量）
      remove(this.serverCodes, this).then(result => {
        console.log(result)
      })
    },
    // downloadTemplate() {
    //   // 下载模板
    //   // window.open("")
    // },
    importExcel() {
      this.visible = true
    },
    httpRequestHandler(params) {
      this.excelLoading = true
      var form = new FormData()
      form.append('file', params.param.file, params.param.file['filename'])
      // 上传Excel
      return request({
        url: '/maintenance/server/importExcel',
        method: 'post',
        data: form,
        config: {
          headers: {
            'Content-Type': 'multipart/form-data;boundary=boundary'
          }
        }
      })
        .then(result => {
          console.log(result)
          this.uploadResult =
            this.uploadResult +
            '------------------------------------------------------------------------\r\n' +
            result.data.messageList.title
          this.excelLoading = false
          params.uploadExcel.clearFiles()
          this.refreshTable()
        })
        .catch(error => {
          console.error(error)
          this.excelLoading = false
        })
    },
    exportExcel() {
      // 导出服务器列表
      this.baseURL = `${process.env.BASE_API + process.env.PREFIX}`
      const url = this.baseURL + '/maintenance/server/front/permit/exportExcel'
      window.open(url)
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/assets/serverEdit',
        name: 'serverEdit',
        params: {
          serverCode: row.serverCode
        }
      })
    },
    testPing(row) {
      row.testLoading = false
      row.percentage = 0
      const interval = window.setInterval(() => {
        if (row.percentage++ >= 100) {
          row.percentage = 100
          row.loading = true
          window.clearInterval(interval)
          // this.testLoading = false
        }
      }, 8)
      // 执行ping操作
      testPing(row, this).then(result => {
        row.pingFlag = result.data.flag
        row.loading = false
        row.testLoading = true
        console.log(result)
        // console.log(result.data.message)
      })
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
      var str = ''
      for (const i in this.multipleSelection) {
        str += this.multipleSelection[i].serverCode + ','
      }
      str = str.substr(0, str.length - 1)
      this.serverCodes = str
      // console.log(str)
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
