<template>
  <div class="container">
    <div class="content">
      <div class="modeler-container" v-loading="loading">
        <!-- 流程编辑器 -->
        <bpmn-js></bpmn-js>
      </div>
    </div>
  </div>
</template>

<script>
  import BpmnJs from './bpmn-js'

  export default {
    name: 'modeler',
    components: {
      BpmnJs
    },
    data() {
      return {
        loading: false
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    mounted() {
    },
    methods: {
      // 页面初始化
      init() {
      },
      // 刷新页面
      refresh() {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  @import '~@/styles/smart-ui/modeler.scss';
</style>
