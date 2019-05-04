<template>
  <el-container class="el-info">
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .el-info /deep/ {
    margin: 30px 30px 30px 30px;
    height: 250px;
    border: 2px  #bbb;
  }
</style>
