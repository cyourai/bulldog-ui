<template>
    <div class="container">
        <!-- 页内容 -->
        <div class="content">
            <!-- 表格 -->
            <div class="content-spe" style="min-height: 1100px; !important;">
                <p class="content-spe-title">资源发现</p>
                <div class="content-spe-element">
                    <!-- 表格筛选 -->
                    <component-filter>
                        <el-form slot="filterForm"
                                 :model="filterFormData"
                                 ref="filterFormData"
                                 label-width="70px"
                                 label-position="left">
                            <el-form-item label="资源名称："
                                          prop="serverValue">
                                <!--<el-input v-model="filterFormData.serverValue"-->
                                <el-input v-model="value"
                                          @keyup.enter.native="refreshTable"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="IP范围："
                                          prop="serverKey">
                                <el-input v-model="key"
                                          @keyup.enter.native="refreshTable"
                                          placeholder="请输入内容"></el-input>
                                <span> ---</span>
                                <el-input v-model="maxKey"
                                          @keyup.enter.native="refreshTable"
                                          placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-form>

                        <el-button slot="refreshTable"
                                   icon="el-icon-search"
                                   size="mini"
                                   type="primary"
                                   plain
                                   @click="refreshTable">资源搜索
                        </el-button>
                        <el-button slot="refreshTable"
                                   icon="el-icon-search"
                                   size="mini"
                                   type="primary"
                                   plain
                                   @click="serverSave">资源保存
                        </el-button>
                    </component-filter>
                    <!-- 表格内容 -->
                    <div class="table-content">
                        <div class="table-content-header">
                            <i class="el-icon-d-arrow-right"
                               style="font-size:16px"></i>
                            <span>资源列表</span>
                            <div class="table-content-header-search">
                            </div>
                        </div>
                        <div class="table-content-spe">
                            <el-table stripe
                                      fit
                                      border
                                      ref="multipleTable"
                                      tooltip-effect="dark"
                                      :data="tableData"

                                      v-loading="tableDataLoading"
                                      element-loading-text="数据加载中"
                                      element-loading-spinner="el-icon-loading">
                                <el-table-column min-width="150"
                                                 label="IP地址"
                                                 sortable
                                                 align="center"
                                                 prop="serverKey">
                                </el-table-column>
                                <el-table-column min-width="150"
                                                 label="资源名称"
                                                 sortable
                                                 align="center"
                                                 prop="serverValue">
                                </el-table-column>
                                <el-table-column min-width="150"
                                                 label="待定义1"
                                                 align="center"
                                                 prop="info1">
                                </el-table-column>
                                <el-table-column min-width="150"
                                                 label="待定义2"
                                                 align="center"
                                                 prop="info2">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table-content-page">
                            <!--批量操作-->
                            <!--
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
                            -->
                            <!--分页-->
                            <!--              <el-pagination @size-change="handleSizeChange"
                                                         @current-change="handlePageChange"
                                                         layout="total, sizes, prev, pager, next, jumper"
                                                         :page-sizes="[10, 20, 30, 40, 50, 100]"
                                                         :page-size="10"
                                                         :total="tableData.total">
                                          </el-pagination>-->
                        </div>
                    </div>
                    <!-- 保存列表 -->
                    <div class="table-content">
                        <div class="table-content-header">
                            <i class="el-icon-d-arrow-right"
                               style="font-size:16px"></i>
                            <span>保存列表</span>
                            <div class="table-content-header-search">
                            </div>
                        </div>
                        <div class="table-content-spe">
                            <el-table stripe
                                      fit
                                      border
                                      ref="multipleTable"
                                      tooltip-effect="dark"
                                      :data="saveData"
                                      v-loading="tableDataLoading"
                                      element-loading-text="数据加载中"
                                      element-loading-spinner="el-icon-loading"
                                      @selection-change="handleSelectionChange">
                                <el-table-column min-width="40"
                                                 type="selection"
                                                 align="center">
                                </el-table-column>
                                <el-table-column min-width="150"
                                                 label="标签名称"
                                                 align="center"
                                                 prop="tabName"
                                                 sortable>
                                </el-table-column>
                                <el-table-column min-width="200"
                                                 label="操作"
                                                 align="center">
                                    <template slot-scope="scope">
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
                            <el-button size="mini"
                                       type="primary"
                                       plain
                                       class="table-content-page-search"
                                       @click="compareExecute()">对比
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
                    <!-- 对比列表 -->
                    <div class="table-content">
                        <div style="float:left;width: 49%;">
                            <div class="table-content-header">
                                <i class="el-icon-d-arrow-right"
                                   style="font-size:16px"></i>
                                <span>标签1</span>
                                <div class="table-content-header-search">
                                </div>
                            </div>
                            <div class="table-content-spe">
                                <el-table stripe
                                          fit
                                          border
                                          ref="multipleTable"
                                          tooltip-effect="dark"
                                          :data="compareData1"
                                          v-loading="tableDataLoading"
                                          element-loading-text="数据加载中"
                                          element-loading-spinner="el-icon-loading"
                                          id="compareTable1"
                                >
                                    <el-table-column min-width="150"
                                                     label="IP地址"
                                                     align="center"
                                                     prop="serverKey"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="资源名称"
                                                     align="center"
                                                     prop="serverValue"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="待定义1"
                                                     align="center"
                                                     prop="info1"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="待定义2"
                                                     align="center"
                                                     prop="info2"
                                                     sortable>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div style="width: 49%;margin-left: 51%;">
                            <div class="table-content-header">
                                <i class="el-icon-d-arrow-right"
                                   style="font-size:16px"></i>
                                <span>标签2</span>
                                <div class="table-content-header-search">
                                </div>
                            </div>
                            <div class="table-content-spe">
                                <el-table stripe
                                          fit
                                          border
                                          ref="multipleTable"
                                          tooltip-effect="dark"
                                          :data="compareData2"
                                          v-loading="tableDataLoading"
                                          element-loading-text="数据加载中"
                                          element-loading-spinner="el-icon-loading">
                                    <el-table-column min-width="150"
                                                     label="IP地址"
                                                     align="center"
                                                     prop="serverKey"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="资源名称"
                                                     align="center"
                                                     prop="serverValue"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="待定义1"
                                                     align="center"
                                                     prop="info1"
                                                     sortable>
                                    </el-table-column>
                                    <el-table-column min-width="150"
                                                     label="待定义2"
                                                     align="center"
                                                     prop="info2"
                                                     sortable>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="请填写资源保存标签" :visible.sync="dialogVisible">
            <el-form ref="planForm"
                     label-width="80px">
                <el-form-item label="标签名称" prop="eventResponseRemark">
                    <el-input
                            placeholder="请输入内容"
                            v-model="tabName">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitServerInfo">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ComponentSelect from '@/components/ComponentSelect'
    import ComponentFilter from '@/components/ComponentFilter'
    // import { select } from '@/api/components/component'
    import { update } from '@/api/settings/dict'
    // import { clearParam, showToast } from '@/utils'

    export default {
      name: 'serverFind',
      components: {
        ComponentSelect,
        ComponentFilter
      },
      data() {
        return {
          // 默认排序
          defaultSort:
                    "[{'prop':'dictGroup', 'order':'descending' },{ 'prop': 'dictSort', 'order': 'asc'}]",
          dialogVisible: false,
          // 数据
          serverInfo: [],
          tableData: [],
          // 筛选
          filterFormData: {},
          // 批量操作筛选
          batchFilterData: '',
          statusOptions: [],
          // loading
          tableDataLoading: false,
          tabName: '',
          value: '',
          key: '',
          maxKey: '',
          saveData: [],
          compareData1: [],
          compareData2: []
        }
      },
      created() {
        // 页面初始化
        this.getData()
        this.init()
      },
      methods: {
        init() {
          // 表格数据初始化
          // this.refreshTable()
        },
        refreshTable() {
          this.tableDataLoading = false
          console.info(this.serverInfo)
          this.updateInfo(this.value, this.key)
        },

        updateInfo(value, key) {
          this.tableData = []
          for (let i = 0; i < this.serverInfo.length; i++) {
            const serverValue = this.serverInfo[i].serverValue
            const serverKey = this.serverInfo[i].serverKey
            if ((value === '' || serverValue === value) && (key === '' || serverKey === key)) {
              this.tableData.push(this.serverInfo[i])
            }
          }
        },

        compareExecute() {
          console.info(this.saveData[0].detailData)
          this.compareData1 = this.saveData[0].detailData
          this.compareData2 = this.saveData[1].detailData
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
        handleSelectionChange(value) {
          this.multipleSelection = value
        },
        updateData(row) {
          // 行内更新状态
          update(row)
        },
        handleSwitchChange(row) {
          // 开关-改变行内状态
          this.updateData(row)
        },
        sortEdit(row) {
          // 行内编辑
          this.updateData(row)
          row.edit = !row.edit
        },
        del(row) {
          // 删除
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.info(row.id)
            // deleteByCode(row.tabName, this)
            this.saveData.splice(row.id, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        edit(row) {
          // 编辑
          this.$router.push({
            path: '/settings/dict-edit',
            name: 'dict-edit',
            params: {
              dictCode: row.dictCode
            }
          })
        },
        serverSave() {
          // 确认完成
          this.tabName = ''
          this.dialogVisible = true
        },
        submitServerInfo() {
          if (this.tabName === '') { // 显示错误信息
            this.$message.info('请输入标签名称')
            // showToast('error', '请输入标签名称')
            return
          }
          console.info(this.tabName)
          const arr = []
          arr[0] = { id: this.saveData.length, tabName: this.tabName, detailData: this.tableData }
          this.saveData.push(arr[0])
          console.log(this.saveData)
          this.dialogVisible = false
        },
        getData() {
          this.serverInfo = [
            {
              serverValue: 'Kelly',
              serverKey: '192.9.100.1',
              info1: '',
              info2: '',
              status: 1
            },
            {
              serverValue: 'Mike',
              serverKey: '192.9.100.2',
              info1: '',
              info2: '',
              status: 1
            },
            {
              serverValue: 'John',
              serverKey: '192.9.100.3',
              info1: '',
              info2: '',
              status: 1
            },
            {
              serverValue: 'Nancy',
              serverKey: '192.9.100.4',
              info1: '',
              info2: '',
              status: 1
            },
            {
              serverValue: 'Micky',
              serverKey: '192.9.100.5',
              info1: '',
              info2: '',
              status: 1
            }
          ]
        },
        batctExecute() {
          // 批量操作
          this.saveData = []
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

    .el-table .warning-row {
        background-color: red;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
