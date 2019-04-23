<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">用户审批</p>
        <div class="content-spe-element">

          <!-- 表格筛选 -->
          <ComponentFilter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="用户名："
                            prop="userName">
                <el-input v-model="filterFormData.userName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="用户手机："
                            prop="userMobile">
                <el-input v-model="filterFormData.userMobile"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="审批状态："
                            prop="userStatus">
                <component-select type="userApprove"
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
          </ComponentFilter>

          <!-- 高级筛选 -->
          <ComponentFilterAdvanced></ComponentFilterAdvanced>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>用户列表</span>
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
                <el-table-column label="用户名"
                                 align="center"
                                 prop="userName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="中文名"
                                 align="center"
                                 prop="userNickName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="手机"
                                 align="center"
                                 prop="userMobile"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="审批状态"
                                 align="center">
                </el-table-column>
                <el-table-column min-width="150"
                                 label="用户角色"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.roles"
                            :key="item.value"
                            size="medium">{{item.roleName}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column width="80"
                                 label="头像"
                                 align="center">
                  <template slot-scope="scope">
                    <img v-if="scope.row.userAvatar!=='' && scope.row.userAvatar!==undefined"
                         :src="scope.row.userAvatar"
                         width="50"
                         height="50">
                  </template>
                </el-table-column>
                <el-table-column min-width="80"
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
import ComponentFilterAdvanced from '@/components/ComponentFilterAdvanced'
import {
  selectByPage
} from '@/api/user/userApprove'
import { select } from '@/api/components/component'

export default {
  name: 'users',

  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'userName', 'order':'asc' },{ 'prop': 'userMobile', 'order': 'asc'}]",
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
      focusState: false,
      // 行内编辑
      inputData: ''
    }
  },
  components: {
    ComponentSelect,
    ComponentFilter,
    ComponentFilterAdvanced
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
          // console.log(this.tableData)
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
      this.tableData.sort = JSON.stringify({
        prop: column.prop,
        order: column.order
      })
      this.refreshTable()
    },
    handleParamsChange(userStatus) {
      // 筛选查询
      this.filterFormData.userStatus = userStatus
      this.refreshTable()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/settings/user-edit',
        name: 'user-edit',
        query: {
          userName: row.userName
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
