<template>
  <div class="container config-container">
    <!-- 页内容 -->
    <div class="content" v-loading="loading">
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title">{{$t('route.config')}}</p>
        <div class="content-spe-element">
          <el-button type="success" icon="el-icon-edit" @click="reindexClickHandler">重建知识库文档索引</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="重建索引"
      :lock-scroll=false
      :visible.sync="dialogVisible">
      <div v-html="msg" class="dialog"></div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import { request } from '@/utils'
  export default {
    name: 'config',
    components: {
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        // 重建索引结果
        msg: ''
      }
    },
    created() {
    },
    methods: {
      reindexClickHandler() {
        this.loading = true
        request({
          url: `/general/lucene/reIndex`,
          method: 'get'
        }).then((result) => {
          this.dialogVisible = true
          this.msg = result.data.data
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .config-container /deep/ {
    .dialog {
      height: 455px;
      overflow: auto;
    }
  }
</style>
