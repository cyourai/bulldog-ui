<template>
    <div class="view-container">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="pie">
                    预案分类
                    <ve-pie :data="pie.chartData" :settings="pie.chartSettings"></ve-pie>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid">
                    <el-table
                            :data="pie.chartData.rows"
                            style="width: 100%">
                        <el-table-column
                                prop="group"
                                label="预案分类"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="planCount"
                                label="预案数量"
                                width="120">
                        </el-table-column>
                    </el-table>
                 </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="radius">
                    用户提交
                    <ve-pie :data="radius.chartData" :settings="radius.chartSettings"></ve-pie>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid">
                    <el-table :data="radius.chartData.rows">
                        <el-table-column
                                prop="user"
                                label="预案作者"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="count"
                                label="预案数量"
                                width="120">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { planPieView, planRadiusView } from '@/api/emergency/plan'

    export default {
      data() {
        return {
          pie: {
            chartSettings: {
            },
            chartData: {
              columns: ['group', 'planCount'],
              rows: [
              ]
            }
          },
          radius: {
            chartSettings: {
              roseType: 'radius'
            },
            chartData: {
              columns: ['user', 'count'],
              rows: [
              ]
            }
          }

        }
      },
      created() {
        this.initRaidus()
      },
      methods: {
        initRaidus() {
          // 预案-预案分类
          planPieView().then((result) => {
            this.pie.chartData.rows = result.data.rows
          })
          // 作者统计
          planRadiusView().then((result) => {
            this.radius.chartData.rows = result.data.rows
          })
        }

      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '~@/styles/smart-ui/smart-ui.scss';

    .view-container /deep/ {
        display: inline;
        .pie {
            margin-top: 10px;
            margin-left: 10px;
        }
        .radius {
            margin-top: 10px;
            margin-left: 10px;
        }
    }
</style>
