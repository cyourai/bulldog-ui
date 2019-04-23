<template>
  <div class="container" v-loading="loading" v-if="!loading">
    <el-tabs type="border-card"
             v-model="activeTabName"
             @tab-click="tabClickHandler">
      <el-tab-pane label="第一步:编辑刊例基本属性" name="first">
        <first
          :media-seller-type="mediaSellerType"
          :published-code="this.publishedCode">
        </first>
      </el-tab-pane>
      <el-tab-pane name="second"
                   label="第二步:编辑刊例规格"
                   :disabled="this.isSecondDisable">
        <second
          :media-seller-type="mediaSellerType"
          :published-code="publishedCode">
        </second>
        <!--<div slot="second"></div>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import first from './components/first'
  import second from './components/second'
  import { params } from '@/utils'
  import Bus from '@/utils/bus'

  export default {
    name: 'publishedEdit',
    components: {
      first,
      second
    },
    data() {
      return {
        // 媒体类型
        mediaSellerType: 'radio',
        // title字段
        pageTitle: '刊例',
        // 表单数据
        loading: false,
        itemDialogVisible: false,
        isSecondDisable: true,
        // 表单主键
        publishedCode: '',
        // 默认激活tab
        activeTabName: 'first'
      }
    },
    created() {
      this.publishedCode = params(this, 'publishedCode')
      this.mediaSellerType = params(this, 'mediaSellerType')
      this.loading = false
      this.isSecondDisable = !this.isEdit()
    },
    mounted() {
      // 接收跳转标签参数
      Bus.$on('receiveTabName', (params) => {
        this.activeTabName = params.tabName
        this.publishedCode = params.publishedCode
        this.isSecondDisable = false
      })
    },
    methods: {
      init() {
      },
      isEdit() {
        return this.publishedCode != null
      },
      tabClickHandler(value) {
        if (this.isEdit()) {
          // jumpUrl(this.$route.path, this.code, value.name)
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
