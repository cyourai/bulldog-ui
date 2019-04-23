<template>
  <div class="container">
    <el-button type="text"
               @click='visible=true'>图片库</el-button>
    <vue-dialog :visible="visible"
                :title='"图片库"'
                :type='"PhotoGallery"'
                :width='"80%"'
                @closeHandler="visible=false"
                @confirmHandler="confirmHandler"></vue-dialog>
  </div>
</template>

<script>
import VueDialog from 'ctsi-vue-dialog'

export default {
  name: 'TestPhotoGallery',
  components: { VueDialog },
  mounted() {},
  data() {
    return {
      // 显示选择库弹窗
      visible: false
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
