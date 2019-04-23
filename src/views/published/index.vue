<template>
  <div>
    <published
      ref="published"
      :media-seller-type="mediaSellerType">
    </published>
  </div>

</template>

<script>
  import Published from './published'

  export default {
    name: 'mediaSellerIndex',
    data() {
      return {
        // 业务类型
        mediaSellerType: 'radio'
      }
    },
    components: {
      Published
    },
    watch: {
      $route(to, from) {
        this.mediaSellerType = to.meta.mediaSellerType
        this.$refs.published.page(this.mediaSellerType)
      }
    },
    created() {
      this.mediaSellerType = this.$route.meta.mediaSellerType
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
