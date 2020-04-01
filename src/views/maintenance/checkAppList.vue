<template>
  <div class="container check-app-container">

    <!-- 页内容 -->
    <div class="content">

      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('maintenance.checkApp')}}</p>
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
                          placeholder="巡检人/巡检时间"></el-input>
              </el-form-item>

            </el-form>
            <el-button slot="refreshTable"
                       icon="el-icon-search"
                       size="mini"
                       type="primary"
                       plain
                       @click="refreshTable">查询
            </el-button>
            <el-button slot="other"
                       icon="el-icon-mobile-phone"
                       size="mini"
                       type="success"
                       plain
                       @click="createQrcodeHandler">巡检二维码
            </el-button>
          </component-filter>
          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>{{$t('maintenance.checkAppList')}}</span>
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
                          :is-show-last=true>
                <!--首列追加操作列-->
                <el-table-column slot="option-slot"
                                 label="巡检结果"
                                 width="100"
                                 align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.checkAppResult === '0'" class="error">异常</span>
                    <span v-else class="ok">正常</span>
                  </template>
                </el-table-column>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 label="截图"
                                 width="250"
                                 align="center">
                  <template slot-scope="scope">
                    <pic-magnify :pic-url="scope.row.checkAppEvidence1"></pic-magnify>
                    <pic-magnify :pic-url="scope.row.checkAppEvidence2"></pic-magnify>
                    <pic-magnify :pic-url="scope.row.checkAppEvidence3"></pic-magnify>
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
                                 @click="openClickHandler(scope.row.checkAppCode)"></el-button>
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
          <!--弹出巡检二维码-->
          <el-dialog
            title="巡检二维码"
            :visible.sync="dialogVisible"
            width="60%">
            <div style="text-align: center">
              <vue-qr :text="qrcodeData.url" :margin="30" colorDark="#000000" colorLight="#fff"
                      :logoSrc="qrcodeData.icon" :logoScale="0.2" :size="450"></vue-qr>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import ComponentFilter from '@/components/ComponentFilter'
  import ComponentSelect from '@/components/ComponentSelect'
  import { TableGrid, PicMagnify } from 'cyourai-vue-dialog'
  import { deleteByCode } from '@/api/human'
  import { clearParam } from '@/utils'
  import vueQr from 'vue-qr'

  export default {
    name: 'checkAppList',
    components: {
      ComponentFilter,
      ComponentSelect,
      TableGrid,
      PicMagnify,
      vueQr
    },
    data() {
      return {
        isShowIndex: false,
        dialogVisible: false,
        // 分页查询所有事件列表
        selectUrl: '/maintenance/checkApp/page',
        // 默认排序
        defaultSort:
          "[{'prop':'checkAppTime', 'order':'asc' }]",
        // 二维码地址
        qrCodeUrl: '',
        // 数据
        query: '',
        tableData: {
          // 表头
          columns: [],
          // 数据
          list: []
        },
        qrcodeData: {
          url: `${document.location.protocol}//${window.location.host}/#/checkApp`,
          icon: `/static/images/ppp/ppp_logo.png`
        },
        // 筛选
        filterFormData: {
          // 巡检结果
          checkAppUser: '',
          // 巡检时间
          checkAppTime: ''
        },
        // 表头
        headers: [
          { prop: 'user.userNickName', label: '巡检人', minWidth: '60', sortable: 'custom' },
          { prop: 'checkAppTime', label: '巡检时间', minWidth: '80', sortable: 'custom' }
        ]
      }
    },
    watch: {
      query(old, newVal) {
        this.filterFormData.checkAppUser = newVal
        this.filterFormData.checkAppTime = newVal
      },
      $route(to, from) {
        this.refreshTable()
      }
    },
    created() {
    },
    methods: {
      refreshTable() {
        this.$refs.tableGrid.refreshTable()
      },
      openClickHandler(checkAppCode) {
        clearParam('checkAppCode')
        clearParam('info')
        this.$router.push({
          path: '/maintenance/checkAppEdit',
          name: 'checkAppEdit',
          params: {
            checkAppCode: checkAppCode,
            info: 0
          }
        })
      },
      createQrcodeHandler() {
        this.dialogVisible = true
      },
      del(row) {
        // 删除
        deleteByCode(row.checkAppCode, this)
      },
      close() {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  @import '~@/styles/variables.scss';
  .check-app-container /deep/ {
    .cell {
      img {
      }
    }
  }
</style>
