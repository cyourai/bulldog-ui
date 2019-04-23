<template>
  <div class="container">
    <ComponentTable :tableShow="false"
                    :tableContentShow="false"
                    :tableTitle="tableTitle">
      <div slot="content"
           style="padding-bottom:20px">
        <el-button slot="content"
                   type="primary"
                   @click="showChart()">预案分析</el-button>
        <el-dialog :title="dialogTitle"
                   :visible.sync="dialogVisible">
          <pie :chartData="chartData"
               :chartSettings="chartSettings"></pie>
        </el-dialog>
      </div>
    </ComponentTable>
  </div>

</template>

<script>
import ComponentTable from '@/components/ComponentTable'
import Pie from '@/components/Charts/pie'

export default {
  name: 'analysis',
  components: {
    ComponentTable, Pie
  },
  data() {
    return {
      loading: false,
      // title字段
      tableTitle: '预案分析',
      chartSettings: {
        dimension: '日期',
        metrics: '访问用户',
        radius: 150
        // offsetY: 500
      },
      chartData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '1/1', '访问用户': '1393' },
          { '日期': '1/2', '访问用户': '3530' },
          { '日期': '1/3', '访问用户': '2923' },
          { '日期': '1/4', '访问用户': '1723' },
          { '日期': '1/5', '访问用户': '3792' },
          { '日期': '1/6', '访问用户': '4593' }
        ]
      },
      dialogVisible: false,
      dialogTitle: '预案分析'
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
    },
    // 显示图表
    showChart() {
      this.dialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
