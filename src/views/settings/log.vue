<template>
  <div class="container">
    <ComponentTable :tableShow="false"
                    :tableContentShow="false"
                    :tableTitle="tableTitle">
      <div slot="content"
           style="padding-bottom:20px">
        <!-- logList -->
        <div class="log">
          <div class="log-list"
               v-for="(item,i) in list"
               :key="item.key"
               @click="logShowContent(i)">
            {{item.name}}（{{item.dec}}）
          </div>
        </div>

        <!-- codemirror -->
        <codemirror v-if="logShow"
                    v-loading="loading"
                    :value="previewEditor"
                    :options="editorOption"
                    ref="previewEditor">
        </codemirror>
      </div>
    </ComponentTable>
  </div>

</template>

<script>
import ComponentTable from '@/components/ComponentTable'
import { codemirror } from 'vue-codemirror-lite'
import {
  getLogList, selectLogContent
} from '@/api/settings/log'

export default {
  name: 'log',
  components: {
    ComponentTable, codemirror
  },
  data() {
    return {
      loading: false,
      logShow: false,
      // title字段
      tableTitle: '日志管理',
      // 弹窗库codeMirror数据
      previewEditor: '',
      // 日志列表
      list: [],
      // 编辑器选项
      editorOption: {
        mode: 'application/json',
        theme: 'rubyblue',
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        autoCloseBrackets: true,
        autofocus: true,
        styleActiveLine: true,
        // lineNumbers: true,
        line: true,
        lineWrapping: 'wrap',
        cursorHeight: 0.85,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
          // 'CodeMirror-lint-markers'
        ],
        // lint: true,
        autoRefresh: true
        // scrollbarStyle: null,
        // readOnly: 'nocursor'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      getLogList().then(result => {
        this.list = result.data.list
      })
    },
    // 点击对应的log
    logShowContent(i) {
      this.logShow = true
      this.loading = true
      const logName = {
        logName: this.list[i].name
      }
      selectLogContent(logName).then(result => {
        this.previewEditor = result.data.data
        // this.previewEditor = 'abc\nabc'
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.log {
  float: left;
  margin: 0 20px 10px 0;
  &-list {
    margin-bottom: 5px;
    font-size: 18px;
    text-decoration: underline;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
