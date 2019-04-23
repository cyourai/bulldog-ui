<template>
  <div>{{ message }}</div>
</template>
<script>

import { request } from '@/utils'

export default {
  name: 'sign-in',
  data() {
    return {
      message: ''
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
      const data = {
        signInProcessInstanceId: this.$route.params.id
      }
      request({
        url: '/process/actsignin/front/permit/signInByProcessInstanceId',
        method: 'post',
        data
      }).then(result => {
        console.log(result)
        this.message = result.data.message
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
