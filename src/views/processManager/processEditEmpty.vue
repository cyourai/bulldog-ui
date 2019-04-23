<template>
  <div class="container"
       v-loading="loading">
    <bpmn-js :model-id="modelId"></bpmn-js>
  </div>
</template>

<script>
import { params } from '@/utils'
import BpmnJs from './bpmn-js'

export default {
  name: 'processEdit',
  components: {
    BpmnJs
  },
  data() {
    return {
      loading: false,
      // xml字符串
      xmlStr: '',
      // 流程模型id
      modelId: ''
    }
  },
  created() {
    // 接收流程参数 & 页面初始化
    this.modelId = params(this, 'modelId')
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      // console.log(this.id)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/modeler.scss';
</style>
