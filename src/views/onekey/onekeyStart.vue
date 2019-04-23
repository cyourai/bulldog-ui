<template>
  <OnekeyStart :title="title"
               :animateTitle="animateTitle"
               :left="left"
               :right="right"></OnekeyStart>
</template>

<script>
import { OnekeyStart } from 'ctsi-vue-dialog'

export default {
  name: 'onekey-start',
  components: {
    OnekeyStart
  },
  data() {
    return {
      title: '测试演练',
      animateTitle: '业务连续性',
      left: [
        {
          title: '数据统计',
          list: [
            { text: '共有4个切换环节' },
            { text: '3个脚本数' },
            { text: '4个演练环节' }
          ]
        },
        { title: '查看详细', imgUrl: '' },
        {
          title: '待添加...',
          data: {
            title: '今日流量(Kb)',
            kb: '388,615',
            list: [
              {
                title: 'ECS',
                count: 28
              },
              {
                title: 'RDS',
                count: 21
              },
              {
                title: 'SLB',
                count: 11
              }
            ]
          }
        }
      ],
      right: [
        { title: '查看演练进度' },
        { title: '演练流程监控' },
        {
          title: '待添加...',
          data: {
            title: '今日流量(Kb)',
            kb: '263,710',
            list: [
              {
                title: 'ECS',
                count: 6
              },
              {
                title: 'RDS',
                count: 2
              },
              {
                title: 'SLB',
                count: 3
              }
            ]
          }
        }
      ]
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        const screenWidth = document.body.clientWidth
        const screenHeight = document.getElementById('app').offsetHeight
        this.$nextTick(() => {
          if (screenWidth <= 1920 && screenWidth >= 750) {
            document.getElementsByClassName('container')[0].style.height = screenHeight + 'px'
          } else if (screenWidth <= 750) {
            document.getElementsByClassName('container')[0].style.height = '1470px'
            document.getElementsByClassName('main-clouds left')[0].style.float = 'none'
            document.getElementsByClassName('main-clouds right')[0].style.float = 'none'
          }
        })
      })()
    }
  },
  created() {
    this.$nextTick(() => {
      return (() => {
        const screenWidth = document.body.clientWidth
        const screenHeight = document.getElementById('app').offsetHeight
        if (screenWidth <= 1920 && screenWidth >= 750) {
          document.getElementsByClassName('container')[0].style.height = screenHeight + 'px'
        } else if (screenWidth <= 750) {
          document.getElementsByClassName('container')[0].style.height = '1470px'
          document.getElementsByClassName('main-clouds left')[0].style.float = 'none'
          document.getElementsByClassName('main-clouds right')[0].style.float = 'none'
        }
      })()
    })
  }
}
</script>

<style scoped>
</style>
