<template>
  <div class="container">

    <!-- 页内容 -->
    <div class="content">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.organization')}}</p>
        <div class="content-spe-element">
          <organization-user></organization-user>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import { OrganizationUser } from 'cyourai-vue-dialog'

  export default {
    name: 'organization',
    components: {
      OrganizationUser
    },
    data() {
      return {
      }
    },
    created() {
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
