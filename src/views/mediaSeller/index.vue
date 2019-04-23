<template>
  <div>
    <media-seller
      ref="mediaSeller"
      :media-seller-type="mediaSellerType">
    </media-seller>
  </div>

</template>

<script>
  import MediaSeller from './mediaSeller'

  export default {
    name: 'mediaSellerIndex',
    data() {
      return {
        // 业务类型
        mediaSellerType: 'radio'
      }
    },
    components: {
      MediaSeller
    },
    watch: {
      $route(to, from) {
        this.mediaSellerType = to.meta.mediaSellerType
        this.$refs.mediaSeller.page(this.mediaSellerType)
      }
    },
    created() {
      this.mediaSellerType = this.$route.meta.mediaSellerType
      // console.debug('mediaSeller/index-mediaSellerType:', this.mediaSellerType)
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
