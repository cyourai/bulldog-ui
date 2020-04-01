<!--<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">注册用户 </div>
          {{singUserCount}}
          <count-to class="card-panel-num" :startVal="0" :endVal="singUserCount" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未读消息 </div>
          {{unReadMessageCount}}
          <count-to class="card-panel-num" :startVal="0" :endVal="unReadMessageCount" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">成交总金额 </div>
          {{allMoney}}
          <count-to class="card-panel-num" :startVal="0" :endVal="allMoney" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单总数 </div>
          {{orderCount}}
          <count-to class="card-panel-num" :startVal="0" :endVal="orderCount" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>-->

<template class="panel-container">
  <div v-if="type === 'new'">
    <el-table :data="tableData"
              border>
      <el-table-column prop="module"
                       label="模块"
                       width="150"></el-table-column>
      <el-table-column prop="function"
                       label="功能点"></el-table-column>
      <!-- width="1098" -->
      <el-table-column label="操作"
                       fixed="right"
                       align="center"
                       width="150">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="enter(scope.row)">点我进入</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-else-if="type === 'old'">
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">注册用户 </div>
            {{singUserCount}}
            <!--<count-to class="card-panel-num" :startVal="0" :endVal="singUserCount" :duration="3000"></count-to>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">未读消息 </div>
            {{unReadMessageCount}}
            <!--<count-to class="card-panel-num" :startVal="0" :endVal="unReadMessageCount" :duration="3000"></count-to>-->
          </div>
        </div>
      </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="roles.indexOf('yqadmin') >=0">
              <div class="card-panel" @click="handleSetLineChartData('purchases')">
                <div class="card-panel-icon-wrapper icon-money">
                  <svg-icon icon-class="money" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">成交总金额 </div>
                  {{allMoney}}
                  <!--<count-to class="card-panel-num" :startVal="0" :endVal="allMoney" :duration="3000"></count-to>-->
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col"  v-if="roles.indexOf('yqadmin') >=0">
              <div class="card-panel" @click="handleSetLineChartData('shoppings')">
                <div class="card-panel-icon-wrapper icon-shoppingCard">
                  <svg-icon icon-class="shoppingCard" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">订单总数 </div>
                  {{orderCount}}
                  <!--<count-to class="card-panel-num" :startVal="0" :endVal="orderCount" :duration="3600"></count-to>-->
                </div>
              </div>
            </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { selectAllUserCount } from '@/api/user/user'
import { getUnReadMessageCount } from '@/api/mail/message'
import store from '@/store'
// import { selectCountSumOfMoney, selecOrdertCount } from '@/api/order/order'

export default {
  components: {
    CountTo
  },
  mounted() {
  },
  created() {
    selectAllUserCount().then(result => {
      this.singUserCount = result.data
    }).catch(() => { this.singUserCount = 0 })
    getUnReadMessageCount().then(result => {
      this.unReadMessageCount = result.data.messageCount
    }).catch(() => { this.unReadMessageCount = 0 })
    // selectCountSumOfMoney().then(result => {
    //   this.allMoney = result.data.allMoney
    // }).catch(() => { this.allMoney = 0 })
    // selecOrdertCount().then(result => {
    //   this.orderCount = result.data.data
    // }).catch(() => { this.orderCount = 0 })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    enter(row) {
      // console.log(row.module)
      const address =
        row.module === '预案管理'
          ? '/emergency/plan'
          : row.module === '脚本管理'
            ? '/script/scriptList'
            : row.module === '流程管理'
              ? '/processManager/process-deploy'
              : row.module === '执行管理'
                ? '/processManager/my-task'
                : row.module === '模拟演练'
                  ? '/processManager/dril-simulation'
                  : row.module === '实战演练'
                    ? '/processManager/drill-real'
                    : '/processManager/drill-real'
      this.$router.push({
        path: address
      })
    }
  },
  data() {
    return {
      roles: store.state.user.roles,
      /* type='old'时，展示系统自带主页；type='new'时，展示广州测试主页
      *  需同时修改 views/dashboard/admin/index.vue中type字段值 */
      type: 'old',
      singUserCountLoading: false,
      // 注册用户数
      singUserCount: 0,
      // 未读消息数
      unReadMessageCount: 0,
      // 总金额
      allMoney: 0,
      // 订单数
      orderCount: 0,
      tableData: [
        {
          module: '预案管理',
          function: '1. 支持将WORD\\EXCEL格式的非结构化预案转换成程序可以解析的自动化模型；\n' +
            '2. 系统内置多种场景预案模板，支持复用和修改，支持预案特征检索，场景管理支持预案存储、在线浏览、导入、导出、修改、上传；\n' +
            '3. 预案需与流程、知识库关联，需与报表集成，进行相关预案统计分析\n' +
            '4. 系统定义了各组件切换的先后顺序，并可根据实际的需求定义切换的步骤'
        },
        {
          module: '脚本管理',
          function: ' 1. 支持统一管理命令脚本，并与预设流程绑定，支持脚本的增、删、改、查、导入、导出等功能；\n' +
            ' 2. 支持展示脚本所在服务器、脚本描述、脚本名称、超时时间等'
        },
        {
          module: '流程管理',
          function: ' 1. 支持用户自定义预案流程，基于activiti图形编辑器，采用拖拽方式进行流程设计，支持顺序、并行、选择、嵌套等多种流程逻辑，支持流程增删改查，支持流程环节绑定脚本、检验标准、参与人员等各方面因素\n' +
            ' 2. 在流程设计中系统支持支持顺序、并行、嵌套等各种逻辑，从而支持灾备事件发生后各个环节执行的各种逻辑顺序\n' +
            ' 3. 流程可视化：支持通过PC 、手机、PAD多种终端设备以WEB访问方式监控和管理演练过程，支持展示系统切换整体进度和每个环节进度、每个环节切换结果和状态\n' +
            ' 4. 流程信息管理：支持查看已部署的流程、运行中的流程和已结束的流程，可对已部署流程、运行中的流程和已结束的流程进行查看和删除操作'
        },
        {
          module: '执行管理',
          function: '支持执行预案功能，包括：预案启动、任务分发、任务执行、故障回退、任务查询、历史任务结果保存等'
        },
        {
          module: '模拟演练',
          function: ' 1. 支持获取OGG目标端数据的副本，且可读写；\n' +
            ' 2. 支持脚本录入（shell、bat、perl、python多种语言），可以通过手工在线编辑、脚本克隆、本地上传三种方式录入系统；\n' +
            ' 3. 模板定义：支持流程图环节绑定脚本，支持配置执行的操作的账户、认证方式、超时时间等参数；\n' +
            ' 4. 模板绑定：支持将模板与目标设备或设备组进行绑定；\n' +
            ' 5. 任务流转：模拟演练支持对脚本执行结果进行验证和保存'
        },
        {
          module: '实战演练',
          function: '事件上报->灾难宣告->指挥调度->自动化切换->数据验证->业务回切->演练监控->数据统计->历史查询'
        },
        {
          module: '多视图管理',
          function: ' 1. 预案视图：支持展示所有预案，记录创建时间、修改时间、版本号等信息，并支持预览流程，对预案进行修改和保存；\n' +
            ' 2. 进度视图：支持展示演练环节的整体、环节进度，支持流程全景图并进行实时监控，支持Web页面展实时信息（按先后顺序），且需采用不同色标展示每个步骤的运行状态；\n' +
            ' 3. 流程视图：支持全景/近景、不同层次监控，支持全周期、多层次、可伸缩的过程监控，支持通过pc/手机/PAD/WEB方式监控和管理演练过程\n' +
            ' 4. 日志视图：提供系统设备、应用程序的日志浏览、过滤、检索'
        }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table /deep/ {
  .cell {
    white-space: pre-line;
  }
}
.panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
