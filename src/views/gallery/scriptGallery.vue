<template>
  <div class="container">
    <el-button type="text"
               @click='visible=true'>脚本库</el-button>
    <vue-dialog :visible="visible"
                :title='"脚本库"'
                :type='"Script"'
                :width='"80%"'
                @closeHandler="visible=false">
    </vue-dialog>
  </div>
</template>

<script>
import VueDialog from 'cyourai-vue-dialog'

export default {
  name: 'ScriptGallery',
  components: { VueDialog },
  mounted() {},
  data() {
    return {
      // 显示选择库弹窗
      visible: true
    }
  },
  created() {},
  methods: {
    confirmHandler(params) {
      // 确认按钮回调
      this.visible = false
      console.debug('confirmHandler: %s', params.galleryList.length)
      console.debug('confirmHandler: %s', params.galleryList.join(','))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
