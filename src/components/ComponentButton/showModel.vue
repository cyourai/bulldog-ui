<template id="item-template">
  <el-button @click="showModel()"
             icon="el-icon-search"
             plain
             size="mini"
             type="default">查看远/近景</el-button>
</template>

<script>
import { request } from '@/utils'

export default {
  name: 'show-model',
  props: {
    modelId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bpmnModelId: ''
    }
  },
  created() {
  },
  methods: {
    // 显示全/近景
    showModel() {
      if (this.modelId !== '') {
        this.bpmnModelId = this.modelId
        this.$router.push({
          path: '/processManager/processModeler',
          name: 'process-modeler',
          params: {
            modelId: this.bpmnModelId
          }
        })
      } else {
        request({
          url: `process/model/front/permit/taskIdToModelId/${this.taskId}`,
          method: 'get'
        }).then(result => {
          this.bpmnModelId = result.data.modelId
          this.$router.push({
            path: '/processManager/processModeler',
            name: 'process-modeler',
            params: {
              modelId: this.bpmnModelId
            }
          })
        }).catch(error => {
          console.error(error)
        }).finally(() => { })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
