<template>
    <div class="container config-container">
        <div class="content">
            <el-button type="primary" @click="reportButton">告警模拟</el-button>
            <el-button type="success" @click="resetButton">监控恢复</el-button>
            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="chart" id="chart" style="height: 300px;width:100%;"></div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                        <div class="gauge" id="gauge" style="height: 300px;width:100%;"></div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="pie" id="pie" style="height: 300px;width:100%;"></div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">
                        <div class="bar" id="bar" style="height: 300px;width:100%;"></div>
                    </div>
                </el-col>
            </el-row>


        </div>

    </div>
</template>
<script>
    import { insert } from '@/api/settings/notice'
    import echarts from 'echarts'

    let timer = null // 计时器
    // const interval = 1000 // 计时间隔
    let now = +new Date(1997, 9, 3)
    const oneDay = 24 * 3600 * 1000
    let value = Math.random() * 100
    export default {
      data() {
        return {
          chart: null,
          gauge: null,
          bar: null,
          pie: null,
          screenHeight: window.innerHeight
        }
      },
      mounted() {
        this.init()
        // const that = this
        window.onresize = () => {
          return (() => {
            window.screenHeight = window.innerHeight
            this.screenHeight = window.screenHeight
          })()
        }
      },
      watch: {
        screenHeight(val) {
          this.screenHeight = val
          this.chart.resize()
          this.bar.resize()
          this.pie.resize()
          this.gauge.resize()
        }
      },
      methods: {
        init() {
          this.initPie()
          this.initBar()
          this.initGauge()
          this.initChart()
          this.resetTimer()
        },
        reportButton() {
          const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '')
          const option = this.chart.getOption()
          var data1 = option.series[0].data
          data1.shift()
          data1.push(95)

          option.xAxis[0].data.shift()
          option.xAxis[0].data.push(axisData)

          this.chart.setOption(option)

          const gaugeOption = this.gauge.getOption()
          gaugeOption.series[0].data[0].value = 96
          this.gauge.setOption(gaugeOption, true)
          clearInterval(timer)
          const data =
            {
              noticeName: 'cpu告警;  ',
              noticeContent: '发现虚拟主机cpu占用率过过'
            }
          insert(data)
        },
        resetButton() {
          this.init()
        },
        randomData() {
          now = new Date(+now + oneDay)
          value = value + Math.random()
          return {
            name: now.toString(),
            value: [
              [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
              Math.round(value)
            ]
          }
        },
        setData() {
          const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '')
          const option = this.chart.getOption()
          var data1 = option.series[0].data
          data1.shift()
          data1.push(Math.ceil(Math.random() * 10) + 50)

          option.xAxis[0].data.shift()
          option.xAxis[0].data.push(axisData)

          this.chart.setOption(option)

          const barData = (new Date()).toLocaleTimeString().replace(/^\D*/, '')
          const barOption = this.bar.getOption()
          var data3 = barOption.series[0].data
          data3.shift()
          data3.push(Math.ceil(Math.random() * 10) + 50)

          barOption.xAxis[0].data.shift()
          barOption.xAxis[0].data.push(barData)

          this.bar.setOption(barOption)

          const pieOption = this.pie.getOption()
          const pieMath = Math.ceil(Math.random() * 10)
          pieOption.series[0].data[0].value = pieOption.series[0].data[0].value + pieMath
          pieOption.series[0].data[1].value = 100000 - pieOption.series[0].data[0].value
          this.pie.setOption(pieOption, true)

          const gaugeOption = this.gauge.getOption()
          gaugeOption.series[0].data[0].value = Math.ceil(Math.random() * 10) + 50
          this.gauge.setOption(gaugeOption, true)
        },
        resetTimer() {
          clearInterval(timer)
          timer = setInterval(this.setData, 1000)
        },
        initGauge() {
          this.gauge = echarts.init(document.getElementById('gauge'))
          this.gauge.setOption({
            title: {
              text: '温度'
            },
            tooltip: {
              formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
              {
                name: '温度',
                type: 'gauge',
                detail: { formatter: '{value}℃' },
                data: [{ value: 0, name: '' }]
              }
            ]
          })
        },
        initPie() {
          this.pie = echarts.init(document.getElementById('pie'))
          this.pie.setOption({
            title: {
              text: '硬盘剩余'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b} :  {d}%'
            },
            series: [
              {
                name: '硬盘剩余',
                type: 'pie',
                radius: '75%',
                center: ['50%', '60%'],
                data: [
                  { value: 30000, name: '硬盘使用' },
                  { value: 70000, name: '硬盘剩余' }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        },
        initBar() {
          this.bar = echarts.init(document.getElementById('bar'))
          this.bar.setOption({
            title: {
              text: '内存'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            xAxis: {
              type: 'category',
              inverse: true,
              interval: 1,
              splitLine: {
                show: false
              },
              data: (function() {
                let now = new Date()
                const res = []
                let len = 60
                while (len--) {
                  res.unshift('')
                  now = new Date(now + 1000)
                }
                return res
              })()
            },
            yAxis: {
              min: 0,
              max: 100,
              type: 'value',
              boundaryGap: [0, '100%'],
              splitLine: {
                show: false
              }
            },
            series: [{
              name: '内存',
              type: 'bar',
              showSymbol: false,
              hoverAnimation: false,
              data: (function() {
                var res = []
                var len = 0
                while (len < 60) {
                  res.push(null)
                  len++
                }
                return res
              })()
            }]
          })
        },
        initChart() {
          this.chart = echarts.init(document.getElementById('chart'))
          this.chart.setOption({
            title: {
              text: 'CPU'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            xAxis: {
              type: 'category',
              inverse: true,
              interval: 1,
              splitLine: {
                show: false
              },
              data: (function() {
                let now = new Date()
                const res = []
                let len = 60
                while (len--) {
                  res.unshift('')
                  now = new Date(now + 1000)
                }
                return res
              })()
            },
            yAxis: {
              min: 0,
              max: 100,
              type: 'value',
              boundaryGap: [0, '100%'],
              splitLine: {
                show: false
              }
            },
            series: [{
              name: 'CPU',
              type: 'line',
              step: 'start',
              showSymbol: false,
              hoverAnimation: false,
              data: (function() {
                var res = []
                var len = 0
                while (len < 60) {
                  res.push(null)
                  len++
                }
                return res
              })()
            }]
          })
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import '~@/styles/smart-ui/smart-ui.scss';
</style>
