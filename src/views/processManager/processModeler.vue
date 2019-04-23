<template>
  <div class="container">
    <div class="content">
      <div class="modeler-container" v-loading="loading">
        <!-- 流程编辑器 -->
        <bpmn-js :model-id="modelId"
                 :is-view="isView"></bpmn-js>
      </div>
    </div>
  </div>
</template>

<script>
  import BpmnJs from './bpmn-js'
  import { params } from '@/utils/params'

  export default {
    name: 'process-modeler',
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
    },
    created() {
      this.modelId = params(this, 'modelId')
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
