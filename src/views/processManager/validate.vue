<template>
    <div class="container validate-container">
        <!-- 页内容 -->
        <div class="content" v-loading="loading">
            <!-- 表格 -->
            <div class="content-spe">
                <p class="content-spe-title">{{$t('route.validate')}}</p>
                <div class="content-spe-element">
                    <!-- 表格筛选 -->
                    <component-filter>
                        <el-form slot="filterForm"
                                 :model="filterFormData"
                                 ref="filterFormData"
                                 label-width="140px"
                                 label-position="left">
                            <el-form-item label="验证条件名称："
                                          prop="validateValue">
                                <el-input v-model="filterFormData.validateName"
                                          @keyup.enter.native="refreshTable"
                                          placeholder="请输入验证条件名称"></el-input>
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
                                   @click="openClickHandler(null)">新增
                        </el-button>
                    </component-filter>
                    <!-- 表格内容 -->
                    <div class="table-content">
                        <div class="table-content-header">
                            <i class="el-icon-d-arrow-right"></i>
                            <span>数据列表</span>
                            <div class="table-content-header-search">
                            </div>
                        </div>
                        <div class="table-content-spe">
                            <table-grid ref="tableGrid"
                                        :query-param='filterFormData'
                                        :headers='headers'
                                        :select-url='selectUrl'
                                        @selection-change="handleSelectionChange">
                                <!--末尾追加操作列-->
                                <el-table-column slot="option-slot"
                                                 min-width="260"
                                                 label="操作"
                                                 align="center">
                                    <template slot-scope="scope">
                                        <el-tooltip content="编辑"
                                                    placement="left">
                                            <el-button plain
                                                       icon="el-icon-edit"
                                                       size="mini"
                                                       type="primary"
                                                       @click="openClickHandler(scope.row.validateCode)"></el-button>
                                        </el-tooltip>
                                        <el-tooltip content="删除"
                                                    placement="right">
                                            <el-button plain
                                                       icon="el-icon-delete"
                                                       size="mini"
                                                       type="danger"
                                                       @click="del(scope.row)"></el-button>
                                        </el-tooltip>
                                        <el-button plain
                                                   size="mini"
                                                   type="success"
                                                   @click="open(scope.row.validateUrl)">访问系统
                                        </el-button>
                                        <el-button plain
                                                   size="mini"
                                                   type="warning"
                                                   @click="validate(scope.row.validateCode)">验证系统
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <!--批量操作-->
                                <div slot="batch-slot">
                                    <el-select v-model="batchFilterData"
                                               placeholder="批量操作">
                                        <el-option label="批量删除"
                                                   key="delete"
                                                   value="delete">
                                        </el-option>
                                    </el-select>
                                    <el-button type="primary"
                                               plain
                                               class="table-content-page-search"
                                               @click="batchExecute()">确定
                                    </el-button>
                                </div>
                            </table-grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="验证结果"
                   :visible.sync="visible"
                   width="70%">
            <div v-html="result"></div><br>
            {{start}}
            <div v-html="content"></div>
            {{end}}
        </el-dialog>
    </div>
</template>

<script>
    import ComponentSelect from '@/components/ComponentSelect'
    import ComponentFilter from '@/components/ComponentFilter'
    import { TableGrid } from 'ctsi-vue-dialog'
    import { deleteByCode, batchExecute, validateGet } from '@/api/process/validate'
    import { clearParam } from '@/utils'

    export default {
      name: 'validate',
      components: {
        ComponentSelect,
        ComponentFilter,
        TableGrid
      },
      watch: {
        $route(to, from) {
          this.refreshTable()
        }
      },
      data() {
        return {
          loading: false,
          visible: false,
          // 验证结果
          start: '',
          content: '',
          end: '',
          result: '',
          // 查询参数
          filterFormData: {
            validateName: '',
            // 默认排序
            defaultSort: "[{'prop':'validateId', 'order':'desc' }]"
          },
          // 表头
          headers: [
            { prop: 'validateName', label: '验证条件名称', minWidth: '100', sortable: 'custom' },
            { prop: 'validateUrl', label: '验证系统访问地址', minWidth: '200', sortable: 'custom' },
            // { prop: 'validateProperty', label: '验证属性', minWidth: '100', sortable: 'custom' },
            { prop: 'validateItem', label: '验证元素', minWidth: '100', sortable: 'custom' }
          ],
          // 分页查询所有验证条件列表
          selectUrl: '/process/validate/page',
          // 批量操作标记位
          batchFilterData: '',
          // 当前行
          row: {},
          // 拨测条件编号
          validateCode: ''
        }
      },
      created() {
      },
      methods: {
        refreshTable() {
          this.$refs.tableGrid.refreshTable()
        },
        openClickHandler(validateCode) {
          if (validateCode == null) {
            // 新增
            clearParam('validateCode')
            this.$router.push({
              path: '/proces/validate/validate-edit',
              name: 'validate-edit'
            })
          } else {
            this.$router.push({
              path: '/process/validate/validate-edit',
              name: 'validate-edit',
              params: {
                validateCode: validateCode
              }
            })
          }
        },
        del(row) {
          // 删除
          deleteByCode(row.validateCode, this)
        },
        batchExecute() {
          // 批量操作
          batchExecute(this)
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        open(url) {
          window.open(url)
        },
        validate(validateCode) {
          this.loading = true
          validateGet(validateCode).then((result) => {
            // console.debug(result.data.content)
            this.visible = true
            this.start = result.data.start
            this.content = result.data.content
            this.end = result.data.end
            this.result = result.data.result
          }).finally(() => {
            this.loading = false
          })
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '~@/styles/smart-ui/smart-ui.scss';

    .el-input {
        width: 180px !important;
    }
    .red {
        color: #bd362f !important;
    }
</style>
