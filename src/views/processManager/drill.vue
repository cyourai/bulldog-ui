<template>
  <div class="container drill-container">
    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{title}}</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <component-filter>
            <el-form slot="filterForm"
                     :model="filterFormData"
                     ref="filterFormData"
                     label-width="120px"
                     label-position="left"
                     @submit.native.prevent>
              <el-form-item label="演练流程名称："
                            prop="name">
                <el-input v-model="filterFormData.processInstanceName"
                          class="drill-query"
                          @keyup.enter.native="refreshTable"
                          placeholder="请输入演练流程名称"></el-input>
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
              <i class="el-icon-d-arrow-right"></i>
              <span>演练列表</span>
              <div class="table-content-header-search">
              </div>
            </div>
            <div class="table-content-spe"
                 v-loading="tableDataLoading">
              <table-grid ref="drillTable"
                          :query-param='filterFormData'
                          :is-show-checkbox="isShowCheckbox"
                          :headers='headers'
                          :table-list="list"
                          select-url=''>
                <!--末尾追加操作列-->
                <el-table-column slot="option-slot"
                                 width="250"
                                 label="扫码进演练"
                                 align="center">
                  <template slot-scope="scope">
                    <pic-magnify class="qrCode"
                                 :picUrl="scope.row.qrCode"></pic-magnify>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 width="250"
                                 label="扫码签到"
                                 align="center">
                  <template slot-scope="scope">
                    <pic-magnify class="qrCode"
                                 :picUrl="scope.row.signQrCode"></pic-magnify>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 width="250"
                                 label="演练地址"
                                 align="center">
                  <template slot-scope="scope">
                    <!-- 图片地址栏处理：获取最后1个斜杠后面 -->
                    <span v-if="scope.row.drillUrl===undefined && !scope.row.isEditDrill">
                      {{scope.row.exhibitUrl}}
                    </span>
                    <span v-if="scope.row.drillUrl!==undefined && !scope.row.isEditDrill">
                      {{scope.row.drillUrl}}
                    </span>
                    <el-input v-if="scope.row.drillUrl===undefined && scope.row.isEditDrill"
                              type="textarea"
                              :autosize="{ minRows: 5 }"
                              style="display:block"
                              v-model="scope.row.exhibitUrl">
                    </el-input>
                    <el-input v-if="scope.row.drillUrl!==undefined && scope.row.isEditDrill"
                              type="textarea"
                              :autosize="{ minRows: 5 }"
                              style="display:block"
                              v-model="scope.row.drillUrl">
                    </el-input>
                    <el-button v-if="!scope.row.isEditDrill"
                               type="primary"
                               icon="el-icon-edit"
                               style="width:30px;height:30px;padding:0"
                               @click="scope.row.isEditDrill=!scope.row.isEditDrill"></el-button>
                    <el-button v-if="scope.row.isEditDrill"
                               type="success"
                               icon="el-icon-check"
                               style="width:30px;height:30px;padding:0"
                               @click="exhibitUrlUpdate(scope.row)"></el-button>
                    <el-button v-if="scope.row.isEditDrill"
                               type="warning"
                               icon="el-icon-close"
                               style="width:30px;height:30px;padding:0"
                               @click="scope.row.isEditDrill=!scope.row.isEditDrill"></el-button>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 width="250"
                                 label="签到地址"
                                 align="center">
                  <template slot-scope="scope">
                    <!-- 图片地址栏处理：获取最后1个斜杠后面 -->
                    <span v-if="scope.row.signUrl===undefined && !scope.row.isEditSign">
                      {{scope.row.signInUrl}}
                    </span>
                    <span v-if="scope.row.signUrl!==undefined && !scope.row.isEditSign">
                      {{scope.row.signUrl}}
                    </span>
                    <el-input v-if="scope.row.signUrl===undefined && scope.row.isEditSign"
                              type="textarea"
                              :autosize="{ minRows: 5 }"
                              style="display:block"
                              v-model="scope.row.signInUrl">
                    </el-input>
                    <el-input v-if="scope.row.signUrl!==undefined && scope.row.isEditSign"
                              type="textarea"
                              :autosize="{ minRows: 5 }"
                              style="display:block"
                              v-model="scope.row.signUrl">
                    </el-input>
                    <el-button v-if="!scope.row.isEditSign"
                               type="primary"
                               icon="el-icon-edit"
                               style="width:30px;height:30px;padding:0"
                               @click="scope.row.isEditSign=!scope.row.isEditSign"></el-button>
                    <el-button v-if="scope.row.isEditSign"
                               type="success"
                               icon="el-icon-check"
                               style="width:30px;height:30px;padding:0"
                               @click="signUrlUpdate(scope.row)"></el-button>
                    <el-button v-if="scope.row.isEditSign"
                               type="warning"
                               icon="el-icon-close"
                               style="width:30px;height:30px;padding:0"
                               @click="scope.row.isEditSign=!scope.row.isEditSign"></el-button>
                  </template>
                </el-table-column>
                <el-table-column slot="option-slot"
                                 min-width="500"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button plain
                               icon="el-icon-delete"
                               size="mini"
                               type="danger"
                               @click="del(scope.row)"></el-button>
                    <el-button plain
                               size="mini"
                               type="primary"
                               @click="drill(scope.row)">进入演练
                    </el-button>
                    <el-button plain
                               size="mini"
                               type="warning"
                               @click="qrcode(scope.row)">生成演练二维码
                    </el-button>
                    <el-button plain
                               size="mini"
                               type="warning"
                               @click="signQrCode(scope.row)">生成签到二维码
                    </el-button>
                  </template>
                </el-table-column><br>
                <el-table-column slot="option-slot"
                                 min-width="250"
                                 label="流程"
                                 align="center">
                  <template slot-scope="scope">
                    <!-- <el-button plain
                               size="mini"
                               type="default"
                               @click="process(scope.row)">查看流程
                    </el-button> -->
                    <!-- 远近景视图按钮 -->
                    <show-model :modelId="scope.row.modelId"
                                :taskId="scope.row.taskId"></show-model>
                    <el-button plain
                               size="mini"
                               type="success"
                               @click="historyHandler(scope.row)">审批记录
                    </el-button>
                  </template>
                </el-table-column>
              </table-grid>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--停止演练-->
    <el-dialog title="请填写停止演练原因"
               :visible.sync="dialogVisible">
      <el-form ref="planForm"
               label-width="80px">
        <el-form-item label="停止原因"
                      prop="remark">
          <el-input type="textarea"
                    :autosize="{ minRows: 8, maxRows: 10}"
                    placeholder="请输入内容"
                    v-model="stopFormData.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitDelProcess">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComponentFilter from '@/components/ComponentFilter'
import { TableGrid, PicMagnify } from 'ctsi-vue-dialog'
import { request, isNotEmpty } from '@/utils'
import { delProcessInstance, createQrcode, updateVariables } from '@/api/process/process'
import ShowModel from '@/components/ComponentButton/showModel'

export default {
  name: 'drill',
  components: {
    ComponentFilter,
    TableGrid,
    PicMagnify,
    ShowModel
  },
  data() {
    return {
      loading: false,
      tableDataLoading: false,
      dialogVisible: false,
      isShowCheckbox: false,
      // 筛选项
      filterFormData: {
        // 演练名称
        processInstanceName: '',
        // 流程环节名称
        taskName: '',
        // 查询已启动的演练(流程实例)
        selectUrl: '/process/mainProcessPage',
        // 演练类型 0:真实演练 1:模拟演练
        exerciseType: 0
      },
      // 停止流程
      stopFormData: {
        processInstanceId: '',
        remark: ''
      },
      // 表头
      headers: [
        { prop: 'procInstId', sortKey: 'PROC_INST_ID_', label: '演练流程/流程实例编号', sortable: 'custom', width: 100 },
        { prop: 'name', sortKey: 'NAME_', label: '演练名称', sortable: 'custom', width: 150 }
      ],
      // 标题
      title: '演练',
      // 是否真实演练 true:真实演练
      isReal: false,
      // smart-exhibit项目演练
      EXH_SERVER: process.env.EXH_SERVER,
      // 签到基路径
      SIGN_SERVER: process.env.SIGN_SERVER,
      list: []
    }
  },
  watch: {
    $route(to, from) {
      this.init()
      this.refreshTable()
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    // 页面初始化
    init() {
      request({
        url: this.filterFormData.selectUrl,
        method: 'get',
        params: this.filterFormData
      }).then(result => {
        // 添加isEdit:false项
        this.list = result.data.tableData.list.map(row => {
          this.$set(row, 'isEditDrill', false)
          this.$set(row, 'isEditSign', false)
          return row
        })
        // 添加imgDrillUrl项（图片地址或exhibit）
        this.list = result.data.tableData.list.map(row => {
          this.$set(row, 'imgDrillUrl', isNotEmpty(row.qrCode)
            ? row.qrCode.substring(row.qrCode.lastIndexOf('\/') + 1, row.qrCode.length) : 'exhibit')
          return row
        })
        // 添加imgSignUrl项（图片地址或sign）
        this.list = result.data.tableData.list.map(row => {
          this.$set(row, 'imgSignUrl', isNotEmpty(row.signQrCode)
            ? row.signQrCode.substring(row.signQrCode.lastIndexOf('\/') + 1, row.signQrCode.length) : 'sign')
          return row
        })
        // 添加exhibitUrl项
        this.list = result.data.tableData.list.map(row => {
          const url = `${this.EXH_SERVER}/pid/${row.procInstId}/title/${row.name}/qrCode/${row.imgDrillUrl}`
          this.$set(row, 'exhibitUrl', url)
          return row
        })
        // 添加signInUrl项
        this.list = result.data.tableData.list.map(row => {
          const url = `${this.SIGN_SERVER}/processManager/sign-in/${row.imgSignUrl}/${row.procInstId}`
          this.$set(row, 'signInUrl', url)
          return row
        })
        // console.log(this.list)
      })
      this.isReal = this.$route.meta.type === 'real'
      this.title = this.isReal ? this.$t('route.drillReal') : this.$t('route.drillSimulation')
      this.filterFormData.exerciseType = this.isReal ? 0 : 1
    },
    // 删除流程
    del(row) {
      this.dialogVisible = true
      this.stopFormData.processInstanceId = row.procInstId
    },
    // 确定删除
    submitDelProcess() {
      this.loading = true
      delProcessInstance(this, this.stopFormData).then(res => {
        this.refreshTable()
        this.dialogVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    // 表格数据初始化
    refreshTable() {
      this.init()
      this.$refs.drillTable.refreshTable()
    },
    // 演练
    drill(row) {
      // const url = `${process.env.EXH_SERVER}/pid/${row.procInstId}/title/${row.name}`
      const url = row.drillUrl !== undefined ? row.drillUrl : row.exhibitUrl
      window.open(url)
    },
    // 点击“生成演练二维码”按钮
    qrcode(row) {
      // 调用生成二维码接口
      const url = isNotEmpty(row.qrCode) ? `${row.exhibitUrl}`
        : `${process.env.EXH_SERVER}/pid/${row.procInstId}/title/${row.name}`
      const data = {
        executionId: row.id,
        qrCode: url,
        type: 'drill'
      }
      createQrcode(this, data).then(() => {
        // 调用更新流程实例参数接口
        const data = {
          executionId: row.id,
          drillUrl: row.exhibitUrl
        }
        updateVariables(this, data)
      })
    },
    // 点击“生成签到二维码”按钮
    signQrCode(row) {
      // 调用生成二维码接口
      const url = isNotEmpty(row.signQrCode) ? `${row.signInUrl}`
        : `${process.env.EXH_SERVER}/pid/${row.procInstId}/title/${row.name}`
      const data = {
        executionId: row.id,
        signQrCode: url,
        type: 'sign'
      }
      createQrcode(this, data).then(() => {
        // 调用更新流程实例参数接口
        const data = {
          executionId: row.id,
          signUrl: row.signInUrl
        }
        updateVariables(this, data)
      })
    },
    // 演练地址更新
    exhibitUrlUpdate(row) {
      // 调用生成二维码接口
      const data = {
        executionId: row.id,
        qrCode: isNotEmpty(row.drillUrl) ? row.drillUrl : row.exhibitUrl,
        type: 'drill'
      }
      createQrcode(this, data).then(() => {
        // 调用更新流程实例参数接口
        var data = {
          executionId: row.id,
          drillUrl: isNotEmpty(row.drillUrl) ? row.drillUrl : row.exhibitUrl
        }
        updateVariables(this, data)
      })
      row.isEditDrill = !row.isEditDrill
    },
    // 签到地址更新
    signUrlUpdate(row) {
      // 调用生成二维码接口
      const data = {
        executionId: row.id,
        signQrCode: isNotEmpty(row.signUrl) ? row.signUrl : row.signInUrl,
        type: 'sign'
      }
      createQrcode(this, data).then(() => {
        // 调用更新流程实例参数接口
        var data = {
          executionId: row.id,
          signUrl: isNotEmpty(row.signUrl) ? row.signUrl : row.signInUrl
        }
        updateVariables(this, data)
      })
      row.isEditSign = !row.isEditSign
    },
    // 查看流程
    process(row) {
      window.open(
        process.env.BASE_API +
        process.env.PREFIX +
        `/process/model/front/permit/selectProcessBmp/${row.procInstId}`
      )
    },
    // 查看审批记录
    historyHandler(row) {
      if (isNotEmpty(row.name)) {
        const closeUrl = this.isReal ? '/processManager/drill-real' : '/processManager/dril-simulation'

        this.$router.push({
          path: '/approve/history/approveHistory',
          name: 'approveHistory',
          params: {
            businessKey: row.name,
            closeUrl: closeUrl
          }
        })
      } else {
        this.$alert('无法根据演练名称找到审批记录')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.drill-container /deep/ {
  .drill-query {
    margin-right: 60px;
    input {
      width: 200px !important;
    }
    .qrCode {
      width: 150px;
    }
  }
}
</style>
