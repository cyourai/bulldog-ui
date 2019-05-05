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
              <el-form-item label="签约状态："
                            prop="humanStatus">
                <component-select type="humanStatus"
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
                          :is-show-first=true
                          :is-show-last=true
                          @selection-change="handleSelectionChange">
                <!--首列追加操作列-->
                <el-table-column slot="first-slot"
                                 label="头像"
                                 align="center">
                  <template slot-scope="scope">
                    <img v-if="scope.row.humanAvatar!=='' && scope.row.humanAvatar!==undefined"
                         :src="scope.row.humanAvatar"
                         width="50"
                         height="50">
                  </template>
                </el-table-column>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 label="签约状态"
                                 align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.humanStatus === 0" class="blue">待定</span>
                    <span v-if="scope.row.humanStatus === 1" class="ok">已签约</span>
                    <span v-if="scope.row.humanStatus === 2" class="error">不符合</span>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                placement="left">
                      <el-button plain
                                 icon="el-icon-edit"
                                 size="mini"
                                 type="primary"
                                 @click="openClickHandler(scope.row.humanCode)"></el-button>
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

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import ComponentSelect from '@/components/ComponentSelect'
import { TableGrid } from 'cyourai-vue-dialog'
import { deleteByCode } from '@/api/human'

export default {
  name: 'signList',
  components: {
    ComponentFilter,
    ComponentSelect,
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
        { prop: 'humanName', label: '用户名', minWidth: '100', sortable: 'custom' },
        { prop: 'humanSexual', label: '性别', minWidth: '100', sortable: 'custom' },
        { prop: 'humanMobile', label: '手机', minWidth: '100', sortable: 'custom' },
        { prop: 'humanSchool', label: '毕业学校', minWidth: '100', sortable: 'custom' },
        { prop: 'humanIntension', label: '求职意向', minWidth: '100', sortable: 'custom' }
      ]
    }
  },
  created() {
  },
  watch: {
    query(old, newVal) {
      this.filterFormData.humanName = newVal
      this.filterFormData.humanEmail = newVal
      this.filterFormData.humanMobile = newVal
    },
    $route(to, from) {
      this.init()
      this.refreshTable()
    }
  },
  methods: {
    refreshTable() {
      this.$refs.tableGrid.refreshTable()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleParamsChange(humanStatus) {
      // 筛选查询
      this.filterFormData.humanStatus = humanStatus
      this.refreshTable()
    },
    openClickHandler(humanCode) {
      this.$router.push({
        path: '/human/signEdit',
        name: 'signEdit',
        params: {
          humanCode: humanCode
        }
      })
    },
    del(row) {
      // 删除
      deleteByCode(row.humanCode, this)
    },
    close() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/variables.scss';
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
