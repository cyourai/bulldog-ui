<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content"
         v-loading="loading">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">公告栏</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="公告名称："
                            prop="name">
                <el-input v-model="filterFormData.noticeName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入公告名"></el-input>
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
                       @click="openInsertDialog">新建公告
            </el-button>
          </component-filter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>公告列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">

              <!-- table-grid组件 -->
              <table-grid ref="processTable"
                          :query-param='queryParam'
                          :select-url='selectUrl'
                          :headers='headers'
                          :is-has-child="isHasChild"
                          v-loading="loading"
                          @selection-change="handleSelectionChange">
                <!--追加是否有权列-->
                <el-table-column slot="option-slot"
                                 min-width="150"
                                 label="状态"
                                 align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.noticeIsEnable"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 label="操作"
                                 width="400px"
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
              </table-grid>
            </div>
          </div>

          <!-- 公告表单 -->
          <el-dialog :title="title"
                     :visible.sync="noticeFormVisible">
            <el-form :model="noticeForm"
                     :rules="insertRules"
                     ref="noticeForm">
              <el-form-item label="公告名称"
                            label-width="120px"
                            prop="noticeName">
                <el-input v-model="noticeForm.noticeName"
                          placeholder="请填写公告名称"></el-input>
              </el-form-item>
              <el-form-item label="公告内容"
                            label-width="120px"
                            prop="noticeContent">
                <el-input v-model="noticeForm.noticeContent"
                          placeholder="请填写公告内容"
                          type="textarea"
                          :autosize="{ minRows: 6, maxRows: 10}"
                          @keyup.enter.native="insert()"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="noticeFormVisible = false">取 消</el-button>
              <el-button v-if="type==='insert'"
                         type="primary"
                         @click="insert()">确 定
              </el-button>
              <el-button v-else
                         type="primary"
                         @click="update()">确 定
              </el-button>
            </div>
          </el-dialog>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentSelect from '@/components/ComponentSelect'
import ComponentFilter from '@/components/ComponentFilter'
import { TableGrid } from 'cyourai-vue-dialog'
import { insert, update, deleteByCode } from '@/api/settings/notice'

export default {
  name: 'notice',
  components: {
    ComponentSelect,
    ComponentFilter,
    TableGrid
  },
  data() {
    return {
      // table加载
      loading: false,
      // 筛选项
      filterFormData: {
        noticeName: '',
        // 默认排序
        defaultSort: "[{'prop':'noticeId', 'order':'desc' }]"
      },
      // 表头
      headers: [
        { prop: 'noticeName', sortKey: 'NOTICE_NAME_', label: '公告名称', minWidth: '200', sortable: 'custom' },
        { prop: 'noticeContent', sortKey: 'NOTICE_CONTENT_', label: '公告内容', minWidth: '500', sortable: 'custom' }
      ],
      // 是否显示子行
      isHasChild: false,
      // 多选选中行
      multipleSelection: [],
      // 分页查询所有公告列表
      selectUrl: '/center/notice/page',
      queryParam: {},
      // 批量操作标记位
      batchFilterData: '',
      // 新建流程对话框
      noticeFormVisible: false,
      // 公告表单
      noticeForm: {
        noticeCode: '',
        noticeName: '',
        noticeContent: ''
      },
      // 新增流程规则
      insertRules: {
        noticeName: [
          { required: true, message: '请输入公告名称', trigger: 'blur' }
        ],
        noticeContent: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      },
      // 公告标题
      title: '',
      type: 'insert'
    }
  },
  created() {
    // 页面初始化
    this.init()
  },
  methods: {
    init() {
    },
    refreshTable() {
      this.queryParam = this.filterFormData
      // console.log(this.filterFormData)
      // 表格数据初始化
      this.$refs.processTable.refreshTable()
    },
    // 新增公告按钮
    openInsertDialog() {
      this.title = '新建公告'
      this.noticeFormVisible = true
      this.type = 'insert'
      this.noticeForm = {
        noticeName: '',
        noticeContent: ''
      }
    },
    // 新增
    insert() {
      this.$refs.noticeForm.validate((valid) => {
        if (valid) {
          insert(this.noticeForm).then(result => {
            this.noticeFormVisible = false
            this.refreshTable()
          })
        }
      })
    },
    // 编辑
    edit(row) {
      this.noticeFormVisible = true
      this.title = row.noticeName
      this.type = 'update'
      this.noticeForm.noticeCode = row.noticeCode
      this.noticeForm.noticeName = row.noticeName
      this.noticeForm.noticeContent = row.noticeContent
    },
    // 更新
    update() {
      this.$refs.noticeForm.validate((valid) => {
        // console.log(this.noticeForm)
        if (valid) {
          update(this.noticeForm).then(result => {
            this.noticeFormVisible = false
            this.refreshTable()
          })
        }
      })
    },
    // 删除
    del(row) {
      deleteByCode(row.noticeCode, this)
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
    },
    handleSwitchChange(row) {
      // 开关-改变行内状态
      const data = {
        noticeCode: row.noticeCode,
        noticeIsEnable: row.noticeIsEnable
      }
      update(data).then(result => {
        this.refreshTable()
      })
    }
  },
  watch: {
    $route(to, from) {
      this.refreshTable()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';

.file-table /deep/ {
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
}

.table-grid-contain /deep/ {
  .table-content-page {
    height: 56px !important;
  }
}
</style>
