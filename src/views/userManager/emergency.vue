<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">应急通讯录</p>
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
              <el-form-item label="用户状态："
                            prop="userStatus">
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
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-download"
                       size="mini"
                       type="success"
                       plain
                       @click="exportFile">导出文本
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-download"
                       size="mini"
                       type="success"
                       plain
                       @click="exportExcel">导出Excel
            </el-button>
          </ComponentFilter>

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>通讯录列表</span>
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
                <el-table-column label="邮箱"
                                 align="center"
                                 prop="userEmail"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="微信号"
                                 align="center"
                                 prop="userWechat"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="QQ号码"
                                 align="center"
                                 prop="userQq"
                                 sortable="custom">
                </el-table-column>
                <el-table-column width="100"
                                 label="用户状态（有效用户/黑名单）"
                                 align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.userStatus"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column min-width="150"
                                 label="权限"
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
                <el-table-column min-width="120"
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
                    <el-tooltip content="查看相关资质"
                                placement="bottom">
                      <el-button plain
                                 icon="el-icon-search"
                                 size="mini"
                                 type="success"
                                 @click="audit(scope.row)"></el-button>
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
import { select } from '@/api/components/component'
import {
  selectByPage,
  deleteByCode,
  deleteArrayCode,
  update
} from '@/api/user/user'
import { clearParam } from '@/utils'
import store from '@/store'

export default {
  name: 'emergency',
  components: {
    ComponentSelect,
    ComponentFilter
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'userName', 'order':'asc' },{ 'prop': 'userMobile', 'order': 'asc'}]",
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
      // 下载文件基路径
      baseURL: `${process.env.BASE_API + process.env.PREFIX}`
    }
  },
  watch: {
    $route(to, from) {
      this.init()
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
      selectByPage(this)
        .then(result => {
          this.tableData = result.data.tableData
          // console.log(this.tableData)
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
          prop: 'userName',
          order: 'asc'
        })
      }
      this.refreshTable()
    },
    handleParamsChange(userStatus) {
      // 筛选查询
      this.filterFormData.userStatus = userStatus
      this.refreshTable()
    },
    updateData(row) {
      // 行内更新状态
      update(row)
    },
    handleSwitchChange(row) {
      // 开关-改变行内状态
      this.updateData(row)
    },
    del(row) {
      // 删除
      deleteByCode(row.userCode, this)
    },
    insert() {
      if (store.state.user.roles.indexOf('admin') >= 0) {
        // 新增
        clearParam('userName')
        this.$router.push({
          path: '/settings/emergency-edit',
          name: 'emergency-edit'
        })
      } else {
        this.$alert('只有管理员可新增人员相关信息')
      }
    },
    exportFile() {
      // 导出文本
      window.open(this.baseURL + '/user/front/permit/exportEmergencyUser', '_self')
    },
    exportExcel() {
      // 导出Excel
      window.open(this.baseURL + '/user/front/permit/exportExcel', '_self')
    },
    edit(row) {
      if (store.state.user.roles.indexOf('admin') >= 0 || store.state.user === row.userName) {
        this.$router.push({
          path: '/settings/emergency-edit',
          name: 'emergency-edit',
          params: {
            userName: row.userName
          }
        })
      } else {
        this.$alert('只有管理员或本人可编辑此项目')
      }
    },
    audit(row) {
      this.$router.push({
        path: '/settings/user-audit',
        name: 'user-audit',
        params: {
          userName: row.userName
        }
      })
    },
    handleSelectionChange(value) {
      // 选项发生变化
      this.multipleSelection = value
    },
    batctExecute() {
      // 批量操作
      const delCodes = []
      for (const select of this.multipleSelection) {
        delCodes.push(select.userCode)
      }
      deleteArrayCode(delCodes, this)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
