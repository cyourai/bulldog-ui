<template>
    <div class="container">
        <!-- 页内容 -->
        <div class="content">
            <!-- 表格 -->
            <div class="content-spe">
                <p class="content-spe-title">快速部署</p>
                <div class="content-spe-element">
                    <!-- 表格筛选 -->
                    <div>
                        <el-button slot="insert"
                                   icon="el-icon-plus"
                                   size="mini"
                                   type="success"
                                   plain
                                   @click="insert">新增</el-button>
                        <el-button slot="opendialog"
                                   icon="el-icon-refresh"
                                   size="mini"
                                   type="primary"
                                   plain
                                   @click="opendialog">重新排序</el-button>
                        <el-dialog title="部署脚本" :visible.sync="dialogFormVisible" :append-to-body="true">
                                <div class="dndList-list" :style="100">
                            <draggable :list="list1" class="dragArea" :options="{group:'article'}">
                                <div class="list-complete-item" v-for="element in list1" :key='element.rapidKey'>
                                    <div class="list-complete-item-handle"><i class="el-icon-tickets"></i>[{{element.rapidKey}}] {{element.rapidName}}</div>
                                </div>
                            </draggable>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-button slot="refreshTable"
                                   icon="el-icon-setting"
                                   size="mini"
                                   type="nativeType"
                                   plain
                                   @click="refreshTable">自动部署</el-button>
                    </div>
                    <!-- 表格内容 -->
                    <div class="table-content">
                        <div class="table-content-header">
                            <i class="el-icon-d-arrow-right"
                               style="font-size:16px"></i>
                            <span>部署脚本</span>
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
                                      element-loading-spinner="el-icon-loading"
                                      @selection-change="handleSelectionChange"
                                      @sort-change="handleSortChange">

                                <el-table-column min-width="100"
                                                 label="部署步骤"
                                                 align="left"
                                                 prop="rapidName" >
                                </el-table-column>
                                <el-table-column min-width="250" style="word-wrap：break-word"
                                                 label="部署参数"
                                                 align="left"
                                                  >
                                    <template slot-scope="scope">
                                        <p v-html='scope.row.rapidValue'></p>
                                    </template>

                                </el-table-column>
                                <el-table-column min-width="100"
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
                                        <el-tooltip content="禁用"
                                                    placement="right">
                                            <el-button plain
                                                       icon="el-icon-setting"
                                                       size="mini"
                                                       type="primary"
                                                       @click="changeCurr(scope)"></el-button>
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

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { select } from '@/api/components/component'
    // import {
    //   deleteByCode,
    //   update
    // } from '@/api/settings/rapid'
    import { clearParam } from '@/utils'
    import draggable from 'vuedraggable'
    export default {
      name: 'dictionary',
      components: {
        draggable
      },
      data() {
        return {
          tableData: [{
            rapidKey: '1',
            rapidName: '1.Topic部署',
            rapidValue: 'Maven <br/> Path to POM: smart-topic/smart-topic-server/pom.xml <br/>  Goals: docker:build -P%profile% -DskipTests <br/>  Execute: If all previous steps finished successfully'

          }, {
            rapidKey: '2',
            rapidName: '2.Auth部署',
            rapidValue: 'Maven <br/>Path to POM: smart-auth/smart-auth-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests <br/>   Execute: If all previous steps finished successfully'
          }, {
            rapidKey: '3',
            rapidName: '3.Process部署',
            rapidValue: 'Maven <br/>Path to POM: smart-process/smart-process-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests <br/>    Execute: If all previous steps finished successfully'
          }, {
            rapidKey: '4',
            rapidName: '4.Process部署',
            rapidValue: 'Maven <br/>Path to POM: smart-process/smart-process-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests <br/>    Execute: If all previous steps finished successfully'
          }, {
            rapidKey: '5',
            rapidName: '5.Topic部署',
            rapidValue: 'Maven <br/>Path to POM: smart-process/smart-process-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests<br/>  Execute: If all previous steps finished successfully'
          }, {
            rapidKey: '6',
            rapidName: '6.Center部署',
            rapidValue: 'Maven <br/>Path to POM: smart-center/smart-center-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests <br/>  Execute: If all previous steps finished successfully\n'
          }, {
            rapidKey: '7',
            rapidName: '7.Maintenance部署',
            rapidValue: 'Maven <br/>Path to POM: smart-maintenance/smart-maintenance-server/pom.xml<br/>Goals: docker:build -P%profile% -DskipTests <br/> Execute: If all previous steps finished successfully\n'
          }],
          // 默认排序
          defaultSort:
                    "[{'prop':'dictGroup', 'order':'descending' },{ 'prop': 'dictSort', 'order': 'asc'}]",

          // 筛选
          filterFormData: {},
          // 批量操作筛选
          batchFilterData: '',
          statusOptions: [],
          // loading
          tableDataLoading: false,
          // 行内编辑
          inputData: '',
          dialogFormVisible: false, // 模态框是否显示
          list1: []
        }
      },
      created() {
        // 页面初始化
        this.init()
        this.getdndlist()
      },
      methods: {
        init() {
          select('enable', '', true).then(result => {
            this.statusOptions = result.data.options
          })
          // 表格数据初始化
          this.refreshTable()
        },
        getdndlist() {
          this.listLoading = true
          this.list1 = this.tableData
        },
        opendialog: function() { // 代开模态框
          this.dialogFormVisible = true
        },
        refreshTable() {
          // this.tableDataLoading = true

        },

        handleParamsChange(dictStatus) {
          // 筛选查询
          this.filterFormData.dictStatus = dictStatus
          //  this.refreshTable()
        },
        handleSelectionChange(value) {
          this.multipleSelection = value
        },
        updateData(row) {
          // 行内更新状态
          // update(row)
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
        changeCurr(e) {
          // e.target.style.backgroundColor =  "#"+Math.floor(Math.random()*0xffffff).toString(16);;
          //  debugger
          const nodeList = document.querySelectorAll('.el-table__row')
          for (var i = 0; i < nodeList.length; i++) {
            if (i === e.$index) {
              // nodeList[i].outerHTML.replace(/<td /, "<td style='color:#bbbbbb !important;' ");
              nodeList[i].style = 'color:#bbbbbb !important;'
            }
          }
        },
        del(row) {
          // 删除
          // deleteByCode(row.dictCode, this)
        },
        insert() {
          // 新增
          clearParam('dictCode')
          this.$router.push({
            path: '/rapid/rapid-edit',
            name: 'rapid-edit'
          })
        },
        edit(row) {
          // 编辑
          this.$router.push({
            path: '/rapid/rapid-edit',
            name: 'rapid-edit',
            params: {
              dictCode: row.rapidKey
            }
          })
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
    .el-table .cell {
        white-space: pre-line;
    }
    .dndList {
        background: #fff;
        padding-bottom: 40px;
        &:after {
            content: "";
            display: table;
            clear: both;
        }
        .dndList-list {
            float: left;
            padding-bottom: 30px;
            &:first-of-type {
                margin-right: 2%;
            }
            .dragArea {
                margin-top: 15px;
                min-height: 50px;
                padding-bottom: 30px;
            }
        }
    }

    .list-complete-item {
        cursor: pointer;
        position: relative;
        font-size: 14px;
        padding: 5px 12px;
        margin-top: 4px;
        border: 1px solid #bfcbd9;
        transition: all 1s;
    }

    .list-complete-item-handle {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 50px;
    }

    .list-complete-item-handle2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
    }

    .list-complete-item.sortable-chosen {
        background: #4AB7BD;
    }

    .list-complete-item.sortable-ghost {
        background: #30B08F;
    }

    .list-complete-enter,
    .list-complete-leave-active {
        opacity: 0;
    }

</style>
