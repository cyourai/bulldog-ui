<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">

      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">我的站内信</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     id="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="主题："
                            prop="messageTitle">
                <el-input v-model="filterFormData.messageTitle"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入主题："></el-input>
              </el-form-item>
              <el-form-item label="是否已读："
                            prop="messageIsReceived">
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
                       @click="refreshTable">查询
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-plus"
                       size="mini"
                       type="success"
                       plain
                       @click="insert">写信
            </el-button>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>信件列表</span>
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
                <el-table-column label="主题"
                                 align="center"
                                 prop="messageTitle"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="信件内容"
                                 align="center"
                                 prop="messageContent1"
                                 sortable="custom">
                  <!--<template slot-scope="scope">-->
                    <!--<div v-html="scope.row.messageContent"-->
                         <!--&gt;</div>-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column label="发件人"
                                 align="center"
                                 prop="messageSendeUser"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="发件时间"
                                 align="center"
                                 prop="messageSendTime"
                                 sortable="custom">
                </el-table-column>

                <el-table-column width="120"
                                 label="是否已读"
                                 align="center"
                                 sortable="custom">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.messageIsReceived === 0"
                            size="medium"
                            type="danger">未读</el-tag>
                    <el-tag v-else="scope.row.messageIsReceived === 1"
                            size="medium"
                            type="success">已读</el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作"
                                 fixed="right"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="阅读"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-view"
                                 size="mini"
                                 type="primary"
                                 @click="read(scope.row)"></el-button>
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
                             :page-size="tableData.pageSize"
                             :total="tableData.total">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>

      <el-dialog :title="title"
                 :visible.sync="dialogVisible"
                 @close="close"
                 width="60%">
        <span id="messageContent"
              :loading="readLoading"
              v-if="!readLoading"
              ref="messageContent"></span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import ComponentSelect from '@/components/ComponentSelect'
import {
  selectMessageListByReceiver,
  getByMessageCode,
  update,
  batctExecute
} from '@/api/mail/message'
import { TinymceGallery } from 'cyourai-vue-dialog'
import { clearParam } from '@/utils'

export default {
  name: 'mail',
  components: {
    ComponentFilter,
    ComponentSelect,
    TinymceGallery
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'messageIsReceived', 'order':'asc' },{ 'prop': 'messageReceivedTime', 'order': 'asc'}]",
      // 数据
      tableData: {},
      // 筛选
      filterFormData: {},
      // 批量操作筛选
      batchFilterData: '',
      // loading
      tableDataLoading: false,
      // 显示选择库弹窗
      dialogVisible: false,
      // 选项发生改变
      multipleSelection: [],
      // 阅读信件内容
      messageContent: '',
      // 信件主题
      title: '',
      // 加载阅读内容
      readLoading: false,
      // 更新阅读状态
      updateIsReadParams: {},
      // 阅读内容前，是否已读
      isRead: false
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
      selectMessageListByReceiver(this)
        .then(result => {
          this.tableData = result.data.tableData
          for (var i in this.tableData.list) {
            var currMessageContent = this.tableData.list[i].messageContent
            var transMessageContent = currMessageContent.replace(/<\/?.+?>/g, '')
            var afterMessageContent = transMessageContent.replace(/ /g, '')
            this.tableData.list[i].messageContent1 = afterMessageContent
          }
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
      // 排序
      this.tableData.sort = JSON.stringify({
        prop: column.prop,
        order: column.order
      })
      if (JSON.parse(this.tableData.sort).prop === null) {
        this.tableData.sort = JSON.stringify({
          prop: 'messageTitle',
          order: 'asc'
        })
      }
      this.refreshTable()
    },
    handleParamsChange(messageIsReceived) {
      // 筛选查询
      this.filterFormData.messageIsReceived = messageIsReceived
      this.refreshTable()
    },
    batctExecute() {
      // 批量操作
      batctExecute(this)
    },
    insert() {
      // 新增
      clearParam('messageCode')
      this.$router.push({
        path: '/mail/outbox',
        name: 'outbox'
      })
    },
    del(row) {
      // 删除（实质为：更新messageIsHidden = 0）
      const params = {
        messageCode: row.messageCode,
        messageIsHidden: 0,
        messageIsReceived: row.messageIsReceived
      }
      update(params).then(result => {
        this.refreshTable()
      })
    },
    read(row) {
      // 阅读
      this.dialogVisible = true
      this.title = row.messageTitle
      getByMessageCode(row.messageCode)
        .then(result => {
          console.log(row.messageContent)
          document.getElementById('messageContent').innerHTML =
            row.messageContent
          // 阅读框里的图片不超过阅读框宽度
          var imgs = document.getElementsByTagName('img')
          console.log(imgs)
          for (var i in imgs) {
            console.log(typeof imgs[i])
            if (typeof imgs[i] === 'object') {
              imgs[i].style.maxWidth = '100%'
            }
          }
          // 阅读框里的文字换行
          var ps = document.getElementsByTagName('p')
          for (var j in ps) {
            if (typeof ps[j] === 'object') {
              ps[j].style.wordWrap = 'break-word'
              ps[j].style.wordBreak = 'break-all'
            }
          }
        })
        .finally(() => {
          this.readLoading = false
        })

      // 根据是否“首次阅读”，决定是否更新列表
      this.isRead = row.messageIsReceived
      // 参数
      this.updateIsReadParams = {
        messageCode: row.messageCode,
        messageIsHidden: 1,
        messageIsReceived: 1
      }
      // 更新已读状态
      if (this.isRead === 0) {
        update(this.updateIsReadParams).then(result => {
          this.refreshTable()
        })
      }
    },
    close() {
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
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
.el-dialog /deep/ {
  .el-dialog__body {
    overflow-x: scroll;
  }
}
</style>
