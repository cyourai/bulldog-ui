<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">

      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('human.sign')}}</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     id="filterFormData"
                     label-width="70px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="查询条件："
                            prop="query">
                <el-input v-model="query"
                          style="width: 200px"
                          @keyup.enter.native="refreshTable"
                          placeholder="应聘人员姓名/手机/邮箱"></el-input>
              </el-form-item>
              <el-form-item label="求职意向："
                            prop="query">
                <el-input v-model="filterFormData.humanIntension"
                          @keyup.enter.native="refreshTable"
                          placeholder="求职意向"></el-input>
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
          </component-filter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>{{$t('human.signList')}}</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">
              <table-grid ref="tableGrid"
                          :query-param='filterFormData'
                          :select-url='selectUrl'
                          :headers='headers'
                          :is-show-checkbox=false
                          :is-show-index=false
                          @selection-change="handleSelectionChange">
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">

                  </template>
                </el-table-column>
              </table-grid>
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
import { TableGrid } from 'cyourai-vue-dialog'
import { TinymceGallery } from 'cyourai-vue-dialog'

export default {
  name: 'signList',
  components: {
    ComponentFilter,
    ComponentSelect,
    TinymceGallery,
    TableGrid
  },
  data() {
    return {
      isShowIndex: false,
      // 分页查询所有事件列表
      selectUrl: '/human/page',
      // 默认排序
      defaultSort:
        "[{'prop':'humanName', 'order':'asc' }]",
      // 数据
      query: '',
      tableData: {
        // 表头
        columns: [],
        // 数据
        list: []
      },
      // 筛选
      filterFormData: {
        // 姓名
        humanName: '',
        // 邮件
        humanEmail: '',
        // 手机
        humanMobile: '',
        // 求职意向
        humanIntension: ''
      },
      // 表头
      headers: [
        { prop: 'humanAvatar', label: '头像', minWidth: '100', sortable: 'custom' },
        { prop: 'humanName', label: '用户名', minWidth: '100', sortable: 'custom' },
        { prop: 'humanSexual', label: '性别', minWidth: '100', sortable: 'custom' },
        { prop: 'humanMobile', label: '手机', minWidth: '100', sortable: 'custom' },
        { prop: 'humanSchool', label: '毕业学校', minWidth: '100', sortable: 'custom' },
        { prop: 'humanIntension', label: '求职意向', minWidth: '100', sortable: 'custom' },
        { prop: 'humanStatus', label: '签约状态', minWidth: '100', sortable: 'custom' }
      ]
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleParamsChange(messageIsReceived) {
      // 筛选查询
      this.filterFormData.messageIsReceived = messageIsReceived
      this.refreshTable()
    },
    del(row) {
    },
    close() {
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
