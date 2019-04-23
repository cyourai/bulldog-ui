<template>
  <div class="container">
    <div class="content">
      <div class="modeler-container" v-loading="loading">
      <bpmn-js :model-id="modelId"
               :is-view="isView">
      </bpmn-js>
      </div>
    </div>
  </div>
</template>

<script>
  import BpmnJs from './bpmn-js'

  export default {
    name: 'Process',
    components: {
      BpmnJs
    },
    data() {
      return {
        loading: false,
        modelId: '',
        isView: true
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
      this.modelId = this.$route.params.modelId
    },
    mounted() {
      // this.$parent.hideHeader()
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
</style>
