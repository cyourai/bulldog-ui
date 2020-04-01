<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">权限管理</p>
        <div class="content-spe-element">

          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>权限列表</span>
              <div class="table-content-header-search">
                <el-button slot="insert"
                           class="buttoninsert"
                           icon="el-icon-plus"
                           size="mini"
                           type="success"
                           @click="insert">新增</el-button>
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
                        @sort-change="handleSortChange">
                <el-table-column label="序号"
                                 align="center"
                                 prop="roleId"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="角色"
                                 align="center"
                                 prop="roleKey"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="描述"
                                 align="center"
                                 prop="roleName"
                                 sortable="custom">
                </el-table-column>
                <el-table-column label="状态"
                                 align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.roleStatus"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="权限"
                                 align="center"
                                 prop="remark">
                </el-table-column>
                <el-table-column label="操作"
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
              <!--分页-->
              <el-pagination @current-change="handlePageChange"
                             layout="total, prev, pager, next, jumper"
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
import { selectByPage, deleteByCode, update } from '@/api/role/role'
import { clearParam } from '@/utils'

export default {
  name: 'roles',
  components: {
    ComponentSelect
  },
  data() {
    return {
      // 默认排序
      defaultSort:
        "[{'prop':'roleId', 'order':'asc' },{ 'prop': 'roleKey', 'order': 'asc'}]",
      // 数据
      tableData: {},
      // loading
      tableDataLoading: false
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
      selectByPage(this)
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
          prop: 'roleId',
          order: 'asc'
        })
      }
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
      deleteByCode(row.roleCode, this)
    },
    insert() {
      // 新增
      clearParam('roleCode')
      this.$router.push({
        path: '/roleManage/role-edit',
        name: 'role-edit'
      })
    },
    edit(row) {
      // 编辑
      this.$router.push({
        path: '/roleManage/role-edit',
        name: 'role-edit',
        params: {
          roleCode: row.roleCode
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/role.scss';
</style>
