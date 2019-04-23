<template>
  <div class="container team-container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.communication')}}</p>
        <pic-magnify class="qrcode" picUrl="/static/images/wechat_qrcode.png"></pic-magnify>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="70px"
                     label-position="left">
              <el-form-item label="群组名称："
                            prop="teamValue">
                <el-input v-model="filterFormData.teamName"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入群组名称"></el-input>
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
            <el-button slot="insert"
                       class="buttonNewTableData"
                       icon="el-icon-service"
                       size="mini"
                       type="warning"
                       plain
                       @click="enterChatClickHandler">进入应急响应群组
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
            <div class="table-content-spe" v-loading="tableDataLoading">
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
                    <el-button plain
                               icon="el-icon-refresh"
                               size="mini"
                               type="success"
                               @click="synchronizedClickHandler(scope.row)">同步应急人员
                    </el-button>
                    <el-tooltip content="编辑"
                                placement="top">
                      <el-button plain
                                 icon="el-icon-edit"
                                 size="mini"
                                 type="primary"
                                 @click="openClickHandler(scope.row.teamCode)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="right">
                      <el-button plain
                                 icon="el-icon-delete"
                                 size="mini"
                                 type="danger"
                                 @click="del(scope.row.tid)"></el-button>
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
        </div>
      </div>
    </div>
    <el-dialog
        title="同步结果"
        :lock-scroll=false
        :visible.sync="dialogVisible">
        <div v-html="sysMsg" class="dialog"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import ComponentFilter from '@/components/ComponentFilter'
  import { TableGrid, PicMagnify } from 'ctsi-vue-dialog'
  import { deleteByCode, batctExecute, synchronizedUser } from '@/api/emergency/team'
  import { clearParam } from '@/utils'

  export default {
    name: 'team',
    components: {
      ComponentFilter,
      TableGrid,
      PicMagnify
    },
    watch: {
      $route(to, from) {
        this.refreshTable()
      }
    },
    data() {
      return {
        dialogVisible: false,
        tableDataLoading: false,
        loading: false,
        // 查询参数
        filterFormData: {
          teamName: ''
        },
        // 表头
        headers: [
          { prop: 'tname', label: '群组名称', minWidth: '100', sortable: 'custom', sortKey: 'team_tname' },
          { prop: 'owner', label: '群主', minWidth: '100', sortable: 'custom', sortKey: 'team_owner' },
          { prop: 'createTime', label: '创建时间', minWidth: '100' }
        ],
        // 分页查询所有事件列表
        selectUrl: '/center/im/page',
        // 批量操作标记位
        batchFilterData: '',
        // 当前行
        row: {},
        // 多选选中行
        multipleSelection: [],
        // 事件编号
        teamId: '',
        // 同步结果
        sysMsg: ''
      }
    },
    created() {
    },
    methods: {
      refreshTable() {
        this.$refs.tableGrid.refreshTable()
      },
      openClickHandler(teamId) {
        if (teamId == null) {
          // 新增
          clearParam('teamCode')
          this.$router.push({
            path: '/center/im/team-edit',
            name: 'team-edit',
            params: {
              teamCode: null
            }
          })
        } else {
          this.$router.push({
            path: '/center/im/team-edit',
            name: 'team-edit',
            params: {
              teamCode: teamId
            }
          })
        }
      },
      del(tid) {
        // 删除
        deleteByCode(tid, this)
      },
      batctExecute() {
        // 批量操作
        batctExecute(this)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      enterChatClickHandler() {
        // 进入应急响应群组
        window.open(`${process.env.IM_SERVER}`)
      },
      synchronizedClickHandler(team) {
        // 同步应急用户
        this.tableDataLoading = true
        synchronizedUser(team).then((result) => {
          this.sysMsg = `成功同步应急人员[${result.data.count}]人:<br> ${result.data.user}`
          this.dialogVisible = true
        }).finally(() => {
          this.tableDataLoading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .team-container /deep/ {
    .dialog {
      overflow: auto;
    }
    .qrcode {
      margin-left: 20px;
      width: 270px;
      height: 63px;
      .gallery-list-bigMask {
        img {
          width: 850px;
          height: 300px;
        }
      }
    }
  }
</style>
