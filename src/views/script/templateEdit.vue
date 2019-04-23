<template>
  <div class="container"
       v-loading="loading">
    <ComponentTable :tableTitle="tableTitle"
                    :tableContent="tableContent"
                    :filterShow="false">
      <!-- 按钮 -->
      <div slot="content"
           style="margin-bottom:20px;padding:0 20px;text-align:right">
        <!-- 脚本模板信息 -->
        <el-form style="width:0%;display:inline-block;float:left;height:32px"
                 :model="templateFormData"
                 ref="templateFormData"
                 @submit.native.prevent>
        </el-form>
        <!-- 模板select控件 -->
        <el-select style="width:40%;float:left"
                   v-model="templateFormData.templateName"
                   size="medium"
                   filterable
                   placeholder="模板名称"
                   :loading="loading"
                   @change="templateChange">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-button style="margin-left:10px"
                   type="success"
                   @click="templateUpdate">更新模板</el-button>
        <el-button style="margin-left:10px"
                   type="warning"
                   @click="templateInsert">另存为新模板</el-button>
      </div>
      <!-- 选项卡 -->
      <div slot="radios"
           class="table-content-header-radios">
        <el-radio-group v-model="radio"
                        size="small"
                        @change="handleChange">
          <el-radio-button label="Json"></el-radio-button>
          <el-radio-button label="Javascript"></el-radio-button>
          <el-radio-button label="Python"></el-radio-button>
          <el-radio-button label="Perl"></el-radio-button>
          <el-radio-button label="Yaml"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 编辑器 -->
      <div slot="tableIn"
           class="table-content-spe"
           style="max-height:1000px;overflow:auto">
        <codemirror :value="codeMirror"
                    :options="editorOption"
                    ref="myEditor">
        </codemirror>
      </div>
    </ComponentTable>
  </div>

</template>

<script>
import ComponentTable from '@/components/ComponentTable'
import { codemirror } from 'vue-codemirror-lite'
import {
  getTemplateAll,
  getByTemplateCode,
  updateTemplate,
  insertTemplate
} from '@/api/script/script'
import { params } from '@/utils/params'
import '@/components/CodeMirror/import.js'

export default {
  name: 'templateEdit',
  components: {
    ComponentTable,
    codemirror
  },
  data() {
    return {
      loading: false,
      // 模板下拉列表
      options: [],
      // 模板代码
      codeMirror: '',
      // 模板已选分类
      templateValue: '',
      // 模板code
      templateCode: '',
      // 编辑器选项
      editorOption: {
        mode: 'application/json',
        theme: 'rubyblue',
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        autoCloseBrackets: true,
        autofocus: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lineWrapping: 'wrap',
        cursorHeight: 0.85,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ],
        lint: true
      },
      radio: 'Json',
      // 脚本模板信息
      templateFormData: {}
    }
  },
  props: {
    tableTitle: {
      type: String,
      default: '模板编辑'
    },
    tableContent: {
      type: String,
      default: '模板编辑'
    }
  },
  created() {
    // 接收参数 & 页面初始化
    this.templateCode = params(this, 'templateCode')
    this.init()
  },
  methods: {
    // 是否接受到name -> 页面为 “编辑模板” 或 “更新模板”
    isEdit() {
      return this.templateCode !== null
    },
    // 页面加载
    init() {
      this.getTemplateAll()
      // 渲染编辑数据
      if (this.isEdit()) {
        this.loading = true
        this.getByTemplateCode(this.templateCode)
      }
    },
    // 获取全部模板select
    getTemplateAll() {
      getTemplateAll().then(result => {
        this.options = result.data.options
      })
    },
    // 根据templateCode查询对应详情
    getByTemplateCode(value) {
      getByTemplateCode(value)
        .then(result => {
          this.templateFormData = result.data
          // console.log(this.teplateFormData)
          this.$refs.myEditor.editor.setValue(result.data.templateValue)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 模板选项改变
    templateChange(value) {
      this.loading = true
      this.getByTemplateCode(value)
    },
    // 更新模板
    templateUpdate() {
      this.loading = true
      this.templateFormData.templateValue = this.$refs.myEditor.editor.getValue()
      updateTemplate(this.templateFormData).then(result => {
        // console.log(result)
        this.getTemplateAll()
        this.loading = false
      })
    },
    // 新建模板
    templateInsert() {
      this.$prompt('请输入模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(data => {
          if (data.value !== null) {
            this.loading = true
            this.templateFormData = {
              templateName: data.value,
              templateKey: 'shell',
              templateValue: this.$refs.myEditor.editor.getValue()
            }
            insertTemplate(this.templateFormData).then(result => {
              this.getTemplateAll().then(result => {
                this.loading = false
              })
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 切换radio
    radioChange(radio) {
      this.loading = true
      // 获取元素并改变其class
      const CodeMirrorWrap = document.getElementsByClassName('CodeMirror-wrap')
      // console.log(CodeMirrorWrap)
      // console.log(CodeMirrorWrap[0].attributes[0].nodeValue)
      CodeMirrorWrap[0].attributes[0].nodeValue = 'CodeMirror CodeMirror-wrap '
      // 切换radio -> 切换主题
      switch (radio) {
        case 'Json':
          this.editorOption.mode = 'application/json'
          this.editorOption.theme = 'rubyblue'
          CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-rubyblue'
          this.loading = false
          break
        case 'Javascript':
          this.editorOption.mode = 'text/javascript'
          this.editorOption.theme = 'monokai'
          CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-monokai'
          this.loading = false
          break
        case 'Python':
          this.editorOption.mode = 'text/x-python'
          this.editorOption.theme = 'Ambiance'
          CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-ambiance'
          this.loading = false
          break
        case 'Perl':
          this.editorOption.mode = 'text/perl'
          this.editorOption.theme = 'Cobalt'
          CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-cobalt'
          this.loading = false
          break
        case 'Yaml':
          this.editorOption.mode = 'text/yaml'
          this.editorOption.theme = 'Mbo'
          CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-mbo'
          this.loading = false
          break
      }
      // console.log(radio)
    },
    // 触发切换radio事件
    handleChange(radio) {
      this.radioChange(radio)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
@import '~@/styles/smart-ui/dictionary.scss';
</style>
