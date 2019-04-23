<template>
  <div class="container plan-search-container">
    <!-- 页内容 -->
    <div class="content" >
      <!-- 表格 -->
      <div class="content-spe">
        <p class="content-spe-title"></p>
        <div class="content-spe-container">
          <el-input :placeholder="'请输入' + placeholder + '内容或选择' + placeholder + '名'" v-model="form.keyWord" class="input-with-select" @keyup.enter.native="searchClickHandler">
            <el-select v-model="form.type" slot="prepend" placeholder="标题">
              <el-option label="标题" value="fileName"></el-option>
              <el-option label="内容" value="context"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchClickHandler"></el-button>
          </el-input>
        </div>
        <div class="content-spe-result" v-loading="loading">
          <ul>
            <li v-for="(item, index) in list" :key="index">
              <a href="javascipt:void(0)" @click="downloadClickHandler(item.code)"><<{{item.fileName}}>></a>
              <span class="upload-user">上传用户: {{item.properties.updateUser}}</span>
              <div v-html="item.context"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { request } from '@/utils'
  import { downloadFile } from '@/api/upload'

  export default {
    name: 'planSearch',
    components: {
    },
    data() {
      return {
        loading: false,
        form: {
          type: 'context',
          keyWord: '',
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        list: [],
        formRules: [],
        // 文档检索/知识检索 true:文档检索
        isPlan: false,
        placeholder: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.isPlan = this.$route.meta.type === 'plan'
        this.title = this.isPlan ? this.$t('route.planSearch') : this.$t('route.repositorySearch')
        this.placeholder = this.isPlan ? '预案文档' : '知识库文档'
      },
      searchClickHandler() {
        this.loading = true
        request({
          url: '/general/lucene/page',
          method: 'get',
          params: this.form
        }).then((result) => {
          this.list = result.data.list
          for (const i in this.list) {
            const item = this.list[i]
            if (item.hasOwnProperty('properties')) {
              this.$set(this.list[i], 'properties', JSON.parse(item.properties))
            } else {
              this.$set(this.list[i], 'properties', { updateUser: '' })
            }
          }
        }).finally(() => {
          this.loading = false
        })
      },
      downloadClickHandler(uploadCode) {
        downloadFile(uploadCode)
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
  @import '~@/styles/smart-ui/planSearch.scss';
</style>
