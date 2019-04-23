<template>
  <div v-loading="loading"
       :class="className"
       :id="id"
       :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { request } from '@/utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    // 接受被选中的id
    processInstanceId: {
      type: String
    },
    // 接受被选中的name
    processName: {
      type: String
    }
  },
  watch: {
    // 监听父组件processInstanceId变化
    processInstanceId(newValue, oldValue) {
      this.processInstanceId = newValue
      this.initId()
    },
    // 监听父组件processName变化
    processName(newValue, oldValue) {
      this.processName = newValue
      this.initId()
    }
  },
  data() {
    return {
      chart: null,
      loading: false,
      selectHistoryUrl: '/process/selectHistoryProcessInstanceForChartsByProcessInstanceId/',
      // X轴数据
      xAxisData: [],
      // 左上角坐标数据
      legendData: [],
      // chart内容数据
      seriesData: []
    }
  },
  mounted() {
    this.initId()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 数据初始化
    initId() {
      this.loading = true
      request({
        url: this.selectHistoryUrl + this.processInstanceId,
        method: 'get'
      }).then(result => {
        // console.log(result)
        this.xAxisData = result.data.xAxisData
        this.legendData = ['显示柱状', '显示折线']
        // 清空chart内容数据后，再塞入数据
        this.seriesData = []
        this.seriesData.push(
          {
            name: '显示柱状',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 70,
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: result.data.data[0].columnarData
          },
          {
            name: '显示折线',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: result.data.data[0].columnarData
          }
        )
        this.initChart()
        this.loading = false
      })
    },
    // chart初始化
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        // 背景色
        backgroundColor: '#344b58',
        // 标题
        title: {
          // text: 'statistics',
          text: this.processName,
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        // 提示框
        tooltip: {
          trigger: 'axis',
          // 坐标轴指示器
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        // 网格
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        // 左上角图例
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: this.legendData
        },
        // 默认打开可计算特性
        calculable: true,
        // X轴属性
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          // x轴坐标值
          data: this.xAxisData
        }],
        // Y轴属性
        yAxis: [{
          type: 'value',
          // 距离起始点
          boundaryGap: [0, 0],
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            formatter: `{value}s`
          },
          splitArea: {
            show: false
          }
        }],
        // 数据
        series: this.seriesData
      })
    }
  }
}
</script>
