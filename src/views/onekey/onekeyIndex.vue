<template>
  <OnekeyIndex :title1="title1"
               :title2="title2"
               :list="list"
               :containerStyle="containerStyle"></OnekeyIndex>
</template>

<script>
import { OnekeyIndex } from 'cyourai-vue-dialog'

export default {
  name: 'onekey-index',
  components: {
    OnekeyIndex
  },
  data() {
    return {
      title1: '',
      title2: '管理系统',
      containerStyle: {
        backgroundImage: 'url(' + require('../../assets/2.jpg') + ')'
      },
      list: [
        {
          text: '系统管理',
          bcColor: '#F29500',
          icon: 'fa fa-cog',
          url: 'userManager/user'
        },
        {
          text: '预案管理',
          bcColor: '#C23916',
          icon: 'fa fa-clipboard',
          url: 'emergency/plan'
        },
        {
          text: '切换管理',
          bcColor: '#3C7780',
          icon: 'fa fa-arrows-h',
          url: 'jobsManager/jobs'
        },
        {
          text: '演练管理',
          bcColor: '#6FA014',
          icon: 'fa fa-youtube-play',
          url: 'processManager/process-deploy'
        },
        {
          text: '应急管理',
          bcColor: '#0097AA',
          icon: 'fa fa-unlock-alt',
          url: 'emergency/team'
        },
        {
          text: '运维管理',
          bcColor: '#BE213E',
          icon: 'fa fa-file-o',
          url: 'operationsManagement/reportCharts'
        },
        {
          text: '知识管理',
          bcColor: '#3C7780',
          icon: 'fa fa-book',
          url: 'repository/repositorySearch'
        },
        {
          text: '安全管理',
          bcColor: '#94C849',
          icon: 'fa fa-plus-square',
          url: 'userManager/role'
        },
        {
          text: '多视图管理',
          bcColor: '#0097AA',
          icon: 'fa fa-bars',
          url: 'processManager/drill-real'
        },
        {
          text: '脚本效率分析',
          bcColor: '#3C7780',
          icon: 'fa fa-bar-chart',
          url: 'onekey/onekey-index'
        },
        {
          text: '扫一扫有惊喜',
          bcColor: '#F29500',
          icon: 'fa fa-qrcode',
          url: 'onekey/onekey-index'
        },
        {
          text: '关于我们',
          bcColor: '#94C849',
          icon: 'fa fa-weixin',
          url: 'onekey/onekey-index'
        },
        {
          bcColor: '#0097AA',
          icon: 'fa fa-facebook-square',
          url: 'onekey/onekey-index'
        },
        {
          bcColor: '#0097AA',
          icon: 'fa fa-facebook-square',
          url: 'onekey/onekey-index'
        },
        {
          bcColor: '#0097AA',
          icon: 'fa fa-facebook-square',
          url: 'onekey/onekey-index'
        },
        {
          bcColor: '#0097AA',
          icon: 'fa fa-facebook-square',
          url: 'onekey/onekey-index'
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      return (() => {
        const screenHeight = document.getElementById('app').offsetHeight
        document.getElementsByClassName('container')[0].style.height =
          screenHeight + 'px'
      })()
    })
  }
}
</script>

<style scoped>
</style>
