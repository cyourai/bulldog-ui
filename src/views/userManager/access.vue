<template>
  <div class="container">
    <!-- 页内容 -->
    <div class="content" >
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.access')}}</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="权限分组："
                            prop="accessGroupCode">
                <component-select type="accessGroup"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="accessGroupHandleChange"></component-select>
              </el-form-item>
              <el-form-item label="权限状态："
                            prop="accessRoleIsAuthority">
                <component-select type="enable"
                                  defaultSelected=""
                                  isAll=true
                                  model="center"
                                  @selectChangeCallBack="accessStatusHandleChange"></component-select>
              </el-form-item>
              <el-form-item label="角色："
                            prop="accessRoleRoleKey">
                <component-select type="role"
                                  defaultSelected=""
                                  isAll=true
                                  model="user"
                                  @selectChangeCallBack="accessUserHandleChange"></component-select>
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
                       @click="openClickHandler(2, false)">新增权限
            </el-button>
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-plus"
                       size="mini"
                       type="success"
                       plain
                       @click="openClickHandler(1, false)">新增分组
            </el-button>
          </component-filter>
          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"></i>
              <span>权限列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe">
              <table-grid ref="tableGrid"
                          :query-param='filterFormData'
                          :headers='headers'
                          :select-url='selectUrl'
                          @selection-change="handleSelectionChange">
                <!--追加是否有权列-->
                <el-table-column slot="option-slot"
                                 min-width="150"
                                 label="是否有权"
                                 align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.roleStatus.accessRoleIsAuthority"
                               :active-value="1"
                               :inactive-value="0"
                               @change="handleSwitchChange(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 min-width="260"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                placement="top">
                      <el-button plain
                                 icon="el-icon-edit"
                                 size="mini"
                                 type="primary"
                                 @click="openClickHandler(scope.row.accessCode, true)"></el-button>
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
                             @click="batctExecute()">确定
                  </el-button>
                </div>
              </table-grid>
            </div>
          </div>
          <!-- 新增权限表单 -->
          <el-dialog :title="dialogTitle + '权限'"
                     :visible.sync="insertFormVisible">
            <el-form :model="insertForm"
                     :rules="insertRules"
                     ref="insertForm">
              <el-form-item label="权限分组"
                            label-width="120px"
                            prop="accessGroupCode">
                <el-select v-model="insertForm.accessGroupCode"
                           placeholder="权限分组">
                  <el-option v-for="item in accessGroupOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="功能名称"
                            label-width="120px"
                            prop="accessFunction">
                <el-input v-model="insertForm.accessFunction"
                          placeholder="请不要与已有功能名称重复"></el-input>
              </el-form-item>
              <el-form-item label="是否有权"
                            label-width="120px"
                            prop="accessRoleIsAuthority">
                <el-switch v-model="insertForm.accessRoleIsAuthority"
                           :active-value=1
                           :inactive-value=0>
                </el-switch>
              </el-form-item>
              <el-form-item label="角色"
                            label-width="120px"
                            prop="accessRoleRoleKey">
                <el-select v-model="insertForm.accessRoleRoleKey"
                           placeholder="角色">
                  <el-option v-for="item in accessRoleRoleKeyOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请求地址"
                            label-width="120px"
                            prop="url">
                <el-input v-model="insertForm.accessUrl"
                          placeholder="请输入访问地址"
                          @keyup.enter.native="submitAccessForm"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="insertFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitAccessForm">确 定
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
  import { select } from '@/api/components/component'
  import { TableGrid } from 'cyourai-vue-dialog'
  import { insert, getByCode, update, deleteByCode, batctExecute } from '@/api/user/access'
  import { clearParam/*, request*/ } from '@/utils'

  export default {
    name: 'event',
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
        // 查询参数
        filterFormData: {
          accessGroupCode: '',
          accessRoleIsAuthority: '',
          accessRoleRoleKey: ''
        },
        // 表头
        headers: [
          { prop: 'accessGroup.dictValue', label: '权限分组', minWidth: '200', sortable: 'custom' },
          { prop: 'accessFunction', label: '功能名称', minWidth: '200', sortable: 'custom' },
          { prop: 'roleKey.accessRoleRoleKey', label: '角色', minWidth: '200', sortable: 'custom' },
          { prop: 'accessUrl', label: '请求地址', minWidth: '300', sortable: 'custom' }
        ],
        // 分页查询所有权限列表
        selectUrl: '/user/access/page',
        // 批量操作标记位
        batchFilterData: '',
        // 当前行
        row: {},
        // 多选选中行
        multipleSelection: [],
        // 权限编号
        accessCode: '',
        // 是否为更新状态
        isEdit: false,
        // 新增权限dialog是否可见
        insertFormVisible: false,
        // 新增权限表单
        insertForm: {
          accessCode: '',
          accessGroupCode: '',
          accessFunction: '',
          accessRoleIsAuthority: 0,
          accessRoleRoleKey: '',
          accessUrl: ''
        },
        // select控件-权限分组
        accessGroupOptions: [],
        // select控件-角色
        accessRoleRoleKeyOptions: [],
        // 权限弹框title
        dialogTitle: '',
        // 新增权限规则
        insertRules: {
          accessGroupCode: [
            { required: true, message: '请选择权限分组', trigger: 'blur' }
          ],
          accessFunction: [
            { required: true, message: '请输入功能名称', trigger: 'blur' }
          ],
          accessRoleIsAuthority: [
            { required: true, message: '请选择是否有权', trigger: 'blur' }
          ],
          accessRoleRoleKey: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        // select控件
        select('accessGroup', true).then(result => {
          this.accessGroupOptions = result.data.options
        })
        select('role', 'user').then(result => {
          this.accessRoleRoleKeyOptions = result.data.options
        })
      },
      refreshTable() {
        this.$refs.tableGrid.refreshTable()
      },
      handleSwitchChange(row) {
        // 开关-改变行内状态
        const data = {
          accessCode: row.accessCode,
          accessRoleIsAuthority: row.roleStatus.accessRoleIsAuthority,
          accessRoleRoleKey: row.roleKey.accessRoleRoleKey
        }
        update(data).then(result => {
          this.refreshTable()
        })
      },
      accessUserHandleChange(accessRoleRoleKey) {
        // 筛选查询-状态
        this.filterFormData.accessRoleRoleKey = accessRoleRoleKey
        this.refreshTable()
      },
      accessGroupHandleChange(accessGroupCode) {
        // 筛选查询-权限分组
        this.filterFormData.accessGroupCode = accessGroupCode
        this.refreshTable()
      },
      accessStatusHandleChange(accessRoleIsAuthority) {
        // 筛选查询-状态
        this.filterFormData.accessRoleIsAuthority = accessRoleIsAuthority
        this.refreshTable()
      },
      openClickHandler(param, isEdit) {
        this.dialogTitle = isEdit ? '更新' : '新增'
        this.isEdit = isEdit
        // 新增分组
        if (param === 1) {
          // 新增
          clearParam('dictCode')
          this.$router.push({
            path: '/userManager/access-edit',
            name: 'access-edit'
          })
        } else if (param === 2) {
          // 新增权限
          this.insertFormVisible = true
          this.insertForm.accessCode = null
          this.insertForm.accessGroupCode = ''
          this.insertForm.accessFunction = ''
          this.insertForm.accessRoleIsAuthority = 0
          this.insertForm.accessRoleRoleKey = ''
          this.insertForm.accessUrl = ''
        } else {
          // 编辑
          getByCode(param).then(result => {
            this.insertFormVisible = true
            this.insertForm.accessCode = result.data.accessCode
            this.insertForm.accessGroupCode = result.data.accessGroupCode
            this.insertForm.accessFunction = result.data.accessFunction
            this.insertForm.accessRoleIsAuthority = result.data.roleStatus.accessRoleIsAuthority
            this.insertForm.accessRoleRoleKey = result.data.roleKey.accessRoleRoleKey
            this.insertForm.accessUrl = result.data.accessUrl
          })
        }
      },
      submitAccessForm() {
        // 新增
        this.$refs.insertForm.validate((valid) => {
          if (valid && !this.isEdit) {
            // 新增权限
            this.insertFormVisible = false
            insert(this.insertForm).then(result => {
              this.refreshTable()
            })
          } else if (valid && this.isEdit) {
            // 更新权限
            update(this.insertForm).then(result => {
              this.refreshTable()
              this.insertFormVisible = false
            })
          } else {
            return false
          }
        })
      },
      del(row) {
        // 删除
        deleteByCode(row.accessCode, this)
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .table-footer-container /deep/ {
    padding-bottom: 12px !important;
    height: 55px !important;
  }
</style>
