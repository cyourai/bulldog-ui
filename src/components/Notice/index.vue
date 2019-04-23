<template>
  <div v-if="noticeList.length!==0"
       class="nav-container">
    <div class="title">公告：</div>
    <slider ref="slider"
            :options="options">
      <slideritem v-for="(item,index) in noticeList"
                  :key="index">
        <div @click="showNotice(index)"
             v-html="item.noticeContent"></div>
      </slideritem>
      <div slot="loading">暂无公告</div>
      <!-- <div slot="loading">loading...</div> -->
    </slider>

    <el-dialog title="公告"
               :visible.sync="visible"
               width="60%">
      <div v-html="noticeContent"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getNoticeList } from '@/api/settings/notice'
import {
  slider,
  slideritem
} from 'vue-concise-slider'

export default {
  name: 'Notice',
  components: {
    slider,
    slideritem
  },
  data() {
    return {
      // noticeContent: '告内容:<br>北京时间2018-12-20日1月13日，微软发布了安全公告，修补了我们发现的漏洞。我们于2018年10月17日向Microsoft报告了该漏洞。微软确认了该漏洞，其ID为CVE-2018-8589。2018年10月，我们的自动漏洞防护（AEP）系统检测到试图利用Microsoft Windows操作系统中的漏洞。进一步分析显示win32k.sys中存在0 day漏洞。漏洞利用程序由恶意软件安装程序的第一阶段执行，以获取维持受害者系统持久性的必要特权。到目前为止，我们已经检测到利用此漏洞的攻击次数非常有限。受害者位于中东。sdfsdf'
      // 公告列表
      noticeList: [],
      // 初始化参数
      options: {
        pagination: false, // 底部小圆点是否隐藏（true显示，false隐藏）
        currentPage: 0, // 当前页码
        thresholdDistance: 500, // 滑动判定距离
        thresholdTime: 100, // 滑动判定时间
        autoplay: 2000, // 自动滚动[ms]
        loop: true, // 是否循环滚动
        direction: 'vertical', // 滚动方向
        infinite: 1, // 无限滚动前后遍历数
        slidesToScroll: 1, // 滚动行数
        timingFunction: 'ease',
        duration: 300
      },
      // 公告内容
      noticeContent: '',
      // 是否显示dialog
      visible: false
    }
  },
  mounted() {
    this.init()
    // 3分钟刷新一次
    window.setInterval(() => {
      this.init()
    }, 1000 * 60 * 3)
  },
  methods: {
    init() {
      getNoticeList().then(result => {
        // if (result.data.list.length === 0) {
        //   result.data.list.push({ noticeContent: '暂无新公告' })
        //   this.options.autoplay = 0
        //   this.options.loop = false
        // }
        this.noticeList = result.data.list
        this.$emit('noticeList', this.noticeList)
      })
    },
    showNotice(index) {
      this.visible = true
      // alert(index)
      this.noticeContent = this.noticeList[index].noticeContent
    }
  },
  watch: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nav-container /deep/ {
  display: inline;
  .title {
    margin-top: 4px;
    float: left;
  }
  .slider-item {
    color: #4d4d4d;
    text-align: left !important;
    justify-content: left !important;
    font-size: 10px !important;
    margin: 5px 0px 1px 0px;
    div {
      height: 40px;
    }
  }
  .slider-container {
    width: 450px;
  }
}
</style>
