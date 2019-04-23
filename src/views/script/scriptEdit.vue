<template>
  <div class="container"
       v-loading="loading"
       v-if="!loading">

    <ComponentTable :tableShow="false"
                    :tableContentShow="false"
                    :tableTitle="tableTitle">
      <!-- 面板 -->
      <el-collapse slot="content"
                   v-model="activeNames"
                   @change="handleChange">

        <!-- 第一步 -->
        <el-collapse-item name="1">
          <template slot="title">
            第一步：替换变量，生成表头
          </template>
          <!-- 动态Tabs -->
          <AddTags style="margin-top:10px"></AddTags>
          <!-- 动态excel -->
          <Hansontable @handleExcel="handleExcel"
                       @rowSelectChange="rowSelectChange"
                       v-show="isShowHansontable"></Hansontable>
        </el-collapse-item>

        <!-- 第二步 -->
        <el-collapse-item name="2"
                          style="position:relative">
          <template slot="title">
            第二步：根据动态数据，生成脚本
          </template>
          <!-- 左侧编辑器 -->
          <div style="width:46%;display:inline-block;height:727px"
               ref="leftOutline">
            <transition name="el-zoom-in-top">
              <CodeMirrorEmpty v-if="isShowCodeMirror"
                               @handleEditor="handleEditor"
                               @scriptUpdate="scriptUpdate"
                               @scriptInsert="scriptInsert"
                               @handleRadio="handleRadio"
                               :tableContent="'脚本编辑'"
                               :scriptParamsHeaders="scriptParamsHeaders"></CodeMirrorEmpty>
              <!-- :scriptFormData="scriptFormData" -->
            </transition>
          </div>

          <!-- 右侧模板 -->
          <div style="width:46%;float:right;height:727px"
               ref="leftOutline">
            <transition name="el-zoom-in-top">
              <CodeMirror v-if="isShowCodeMirror"
                          @handleEditor="handleEditor"
                          @templateUpdate="templateUpdate"
                          @templateInsert="templateInsert"
                          @handleRadio="handleRadio"
                          @templatePreview="templatePreview"
                          :tableContent="'脚本模板'"
                          :options="templateOptions"></CodeMirror>
              <!-- :scriptTemplateCode="scriptTemplateCode" -->
            </transition>
          </div>
        </el-collapse-item>

        <!-- 第三步 -->
        <el-collapse-item name="3">
          <template slot="title">
            第三步：绑定测试服务器
          </template>
          <!-- dialogTransfer -->
          <el-button type="success"
                     @click="dialogShowServer">绑定服务器</el-button>
          <el-tag v-for="label in labelServer"
                  :key="label">{{label}}</el-tag>
          <dialog-transfer ref="dialogTransfer"
                           :queryParam='queryParam'
                           :initUrl="initUrl"
                           :titles="titles"
                           :type="type"
                           :filterPlaceholder="filterPlaceholder"
                           @sendSelectedChild="sendSelectedChild"
                           @submit="dialogSubmit"
                           @change="changeHandler">
          </dialog-transfer>
        </el-collapse-item>

        <!-- 第四步 -->
        <el-collapse-item name="4">
          <template slot="title">
            第四步：测试脚本
          </template>
          <!-- 脚本筛选 -->
          <ScriptFilter @scriptResultUpdate="scriptResultUpdate"
                        @scriptResultInsert="scriptResultInsert"
                        @scriptCompile="scriptCompile"
                        :resultOptions="resultOptions"
                        :scriptResultCheckCode="scriptResultCheckCode"
                        :conclusion="conclusion"
                        :execMsg="execMsg"
                        :executeTime="executeTime"
                        :executeShow="executeShow"
                        :bindingScriptCode="bindingScriptCode"
                        :divLoading="divLoading"></ScriptFilter>
        </el-collapse-item>

      </el-collapse>
    </ComponentTable>

    <!-- dialog -->
    <el-dialog title="脚本批量预览"
               :visible.sync="visible">
      <codemirror :value="previewEditor"
                  :options="editorOption"
                  ref="previewEditor">
      </codemirror>
    </el-dialog>

  </div>
</template>

<script>
import ComponentTable from '@/components/ComponentTable'
import AddTags from '@/components/AddTags'
import CodeMirror from '@/components/CodeMirror'
import Hansontable from '@/components/Hansontable'
import CodeMirrorEmpty from '@/components/CodeMirror/empty'
import ScriptFilter from '@/components/ComponentFilter/scriptFilter'
import HotTable from '@handsontable/vue'
import Bus from '@/utils/bus.js'
import { DialogTransfer } from 'ctsi-vue-dialog'
import {
  // 脚本
  getByScriptCode,
  updateScript,
  updateScriptByCode,
  execute,
  selectScriptByName,
  insertScript,
  scriptCreate,
  // 模板
  getTemplateAll,
  updateTemplate,
  insertTemplate,
  // 脚本结果检查
  getResultCheckAll,
  updateResultCheck,
  insertResultCheck
} from '@/api/script/script'
import keysGetLabels from '@/api/jobsManager/keysGetLabels'
// import VueDialog from 'ctsi-vue-dialog'
import { codemirror } from 'vue-codemirror-lite'
import { params } from '@/utils/params'
import { request, isEmpty } from '@/utils'
import '@/components/CodeMirror/import.js'

export default {
  name: 'scriptEdit',
  components: {
    ComponentTable,
    AddTags,
    CodeMirror,
    Hansontable,
    CodeMirrorEmpty,
    ScriptFilter,
    HotTable,
    // VueDialog
    codemirror,
    DialogTransfer
  },
  data() {
    return {
      loading: false,
      // 标题
      tableTitle: '',
      // 表单主键
      scriptCode: '',
      scriptName: '',
      scriptRemark: '',
      isShowHansontable: true,
      isShowCodeMirror: false,
      // 默认展开的面板
      activeNames: '1',
      // 全部excel
      settings: {},
      // 部分excel
      rowData: [],
      // 执行操作的表格
      excelList: [],
      // 是否已选择替换变量
      selectList: false,
      // 父组件脚本数据
      scriptFormData: {},
      // 父组件scriptTemplateCode
      scriptTemplateCode: '',
      // 父组件scriptResultCheckCode
      scriptResultCheckCode: '',
      // 父组件scriptParamsHeaders
      scriptParamsHeaders: '',
      // 模板下拉列表
      templateOptions: [],
      // 结果检查下拉列表
      resultOptions: [],
      // 上传的表格项
      tableData: [],
      // tab默认选择：JSON
      radio: 'Json',
      // 显示选择库弹窗
      visible: false,
      // 脚本模板数据
      editData: '',
      previewData: '',
      // 弹窗库codeMirror数据
      previewEditor: '',
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
          'CodeMirror-foldgutter'
          // 'CodeMirror-lint-markers'
        ],
        // lint: true,
        autoRefresh: true
        // scrollbarStyle: null,
        // readOnly: 'nocursor'
      },
      // dialog类型
      type: 'server',
      // 穿梭框初始化
      initUrl: '/maintenance/server/selectScriptServerTransfer/',
      // 提示文字
      filterPlaceholder: '选择绑定服务器',
      // 绑定相关
      queryParam: {},
      // 标题
      titles: ['可绑定', '已绑定'],
      // 是否多选
      isMultiple: false,
      // 全部子流程
      wholeServer: [],
      // 被选中的服务器(key)
      selectedServer: [],
      // 要回显的value(服务器)
      labelServer: [],
      // 父组件conclusion
      conclusion: '',
      // 编译结果
      getConclusionList: [],
      // 执行结果报文
      execMsg: '',
      // 绑定的脚本编号
      bindingScriptCode: '',
      // 执行结果loading
      divLoading: false,
      // 执行结果时间
      executeTime: 0,
      // 执行结果显示与否
      executeShow: false
    }
  },
  created() {
    // 接收用户参数 & 页面初始化
    this.scriptCode = params(this, 'scriptCode')
    this.scriptTemplateCode = params(this, 'scriptTemplateCode')
    this.scriptResultCheckCode = params(this, 'scriptResultCheckCode')
    this.init()
  },
  methods: {
    // 点击手风琴
    handleChange() {
      this.$nextTick(() => {
        this.isShowHansontable = true
        this.isShowCodeMirror = true
      })
    },
    // 根据scriptCode值判断：编辑 or 新增
    isEdit() {
      return this.scriptCode !== null
    },
    // 页面初始化
    init() {
      // console.log(this.scriptTemplateCode)
      if (this.isEdit()) {
        this.loading = true
        this.tableTitle = '脚本编辑'
        // 给子组件传值：scriptFormData
        getByScriptCode(this.scriptCode)
          .then(result => {
            // console.log(result)
            this.scriptFormData = result.data.data
            this.scriptParamsHeaders = result.data.data.scriptParamsHeaders
          })
          .finally(() => {
            this.loading = false
          })
        request({
          url: `/maintenance/server/selectScriptServerTransfer/${this.scriptCode}`,
          method: 'get'
        }).then(result => {
          // console.log(result.data.right[0])
          this.bindingScriptCode = result.data.right[0]
          this.labelServer = keysGetLabels(
            result.data.left,
            result.data.right
          )
        })
      } else {
        this.scriptName = params(this, 'scriptName')
        this.scriptRemark = params(this, 'scriptRemark')
        // console.log(this.scriptName)
        this.tableTitle = '新增脚本'
      }
      this.getTemplateAll()
      this.getResultCheckAll()
    },
    // 接收子组件传递过来的表单数据（部分）
    rowSelectChange(data) {
      this.excelList = data
      // console.log(data)
      this.selectList = true
      // 脚本模板格式转换：[[],[],[]] -> [{},{},{}]
      // 表头
      var arr = this.settings.colHeaders
      // 表内容
      var newAry = []
      for (const i in this.excelList) {
        var newObj = {}
        for (var j in arr) {
          newObj[arr[j]] = this.excelList[i][j]
        }
        newAry[i] = newObj
      }
      // console.log(newAry)
      var scriptTemplateParams = JSON.stringify(newAry)
      scriptTemplateParams = scriptTemplateParams.replace(/null/g, ' ')
      this.previewData = scriptTemplateParams
      // console.log(this.previewData)
    },
    // 接受子组件传递过来的表单设置（全部）
    handleExcel(settings) {
      this.settings = settings
      this.excelList = this.settings.data
      // console.log(this.settings)
    },
    // 通过脚本模板生成脚本
    handleEditor(data) {
      // console.log(data)
      // 1、接受子组件传递过来的编辑器数据
      this.editData = data
      // 2、脚本模板格式转换：[[],[],[]] -> [{},{},{}]
      // 表头
      var arr = this.settings.colHeaders
      if (arr === undefined || this.selectList === false) {
        this.$message.error('请选择1条变量数据')
        return
      } else if (this.excelList.length !== 1) {
        this.$message.error('多条数据请点击 “批量预览” ')
        this.excelList = []
        return
      } else {
        // 表内容
        var newAry = []
        for (const i in this.excelList) {
          var newObj = {}
          for (var j in arr) {
            newObj[arr[j]] = this.excelList[i][j]
          }
          newAry[i] = newObj
        }
        // console.log(newAry)
        // 3、脚本模板生成脚本代码
        var scriptTemplateParams = JSON.stringify(newAry)
        scriptTemplateParams = scriptTemplateParams.replace(/null/g, ' ')
        const scriptTemplateContent = this.editData
        const obj = {
          scriptTemplateContent: scriptTemplateContent,
          scriptTemplateParams: scriptTemplateParams
        }
        scriptCreate(obj).then(result => {
          if (result.data.status.toString().indexOf('200') !== 0) {
            this.$message.error('替换变量与脚本模板不匹配！')
            return
          } else {
            // console.log(result.data.list)
            Bus.$emit('editResult', result.data.list)
            this.selectList = false
          }
        })
      }
    },
    // 获取全部模板select
    getTemplateAll() {
      getTemplateAll().then(result => {
        this.templateOptions = result.data.options
      })
    },
    // 获取全部结果检查select
    getResultCheckAll() {
      getResultCheckAll().then(result => {
        this.resultOptions = result.data.options
      })
    },
    // 脚本更新
    scriptUpdate(data) {
      // console.log(this.scriptName)
      // console.log(data.scriptName)
      if (isEmpty(this.scriptName)) {
        this.scriptFormData.scriptName = data.scriptName
      } else {
        this.scriptFormData.scriptName = this.scriptName
        this.scriptFormData.scriptRemark = this.scriptRemark
      }
      this.scriptFormData.scriptContent = data.scriptContent
      this.scriptFormData.scriptTemplateCode = data.scriptTemplateCode
      this.scriptFormData.scriptResultCheckCode = data.scriptResultCheckCode
      this.scriptFormData.scriptParamsHeaders = data.scriptParamsHeaders
      this.scriptFormData.scriptParams = data.scriptParams
      // console.log(this.scriptFormData)
      updateScript(this.scriptFormData)
        .then(result => {
          selectScriptByName(this.scriptFormData.scriptName).then(result => {
            this.scriptCode = result.data.scriptCode
          })
        })
    },
    // 新建脚本
    scriptInsert(data) {
      insertScript(data)
    },
    // 模板更新
    templateUpdate(data) {
      updateTemplate(data).then(result => {
        // console.log(result)
        this.getTemplateAll()
      })
    },
    // 新建模板
    templateInsert(data) {
      insertTemplate(data).then(result => {
        this.getTemplateAll()
      })
    },
    // 预览模板
    templatePreview(data) {
      // 1、接受子组件传递过来的编辑器数据
      const editData = data.previewData
      // 2、生成脚本预览
      // 表头
      var arr = this.settings.colHeaders
      if (arr === undefined || this.selectList === false) {
        this.$message.error('请选择至少1条变量数据')
        return
      } else {
        // 表内容
        const scriptTemplateParams = this.previewData
        const scriptTemplateContent = editData
        const obj = {
          scriptTemplateContent: scriptTemplateContent,
          scriptTemplateParams: scriptTemplateParams
        }
        scriptCreate(obj).then(result => {
          if (result.data.status.toString().indexOf('200') !== 0) {
            this.$message.error('替换变量与脚本模板不匹配！')
            return
          } else {
            this.visible = data.visible
            // console.log(result.data.list)
            const previewEditor = result.data.list
            var str = ''
            for (var i in previewEditor) {
              str +=
                previewEditor[i] +
                '\n' +
                '--------------------------------' +
                '\n'
            }
            str = str.substring(0, str.length - 34)
            // console.log(str)
            this.previewEditor = str
            this.selectList = false
          }
        })
      }
    },
    // 接受子组件传递过来的类型选择 -> 传回给编辑器
    handleRadio(radio) {
      Bus.$emit('radio', radio)
    },
    // 更新结果检查表达式
    scriptResultUpdate(data) {
      // console.log(data)
      updateResultCheck(data).then(result => {
        this.getResultCheckAll()
      })
    },
    // 新增结果检查表达式
    scriptResultInsert(data) {
      const scriptResultInsert = {
        scriptResultCheckName: data.scriptResultCheckName,
        scriptResultCheckCondition: data.scriptResultCheckCondition,
        scriptResultCheckReturn: data.scriptResultCheckReturn
      }
      insertResultCheck(scriptResultInsert).then(result => {
        this.getResultCheckAll()
      })
    },
    // 执行脚本
    scriptCompile(data) {
      // console.log(this.scriptCode)
      this.divLoading = true
      const updateScriptForm = {
        scriptCode: this.scriptCode,
        scriptResultCheckCode: data.scriptResultCheckCode
      }
      updateScriptByCode(updateScriptForm)
      const executeForm = {
        scriptCode: this.scriptCode,
        scriptResultCheckCode: data.scriptResultCheckCode,
        checkType: data.checkType
      }
      this.executeShow = false
      execute(executeForm).then(result => {
        // console.log(result)
        this.executeTime = result.data.executeTime
        this.executeShow = true
        var execFlag = result.data.conclusion[0].execFlag
        this.execMsg = result.data.resultMsg
        if (execFlag === true) {
          this.conclusion = '正常'
        } else {
          this.conclusion = '异常'
        }
      }).finally(() => {
        this.divLoading = false
      })
    },
    // 控制dialog显示与否 -> server
    dialogShowServer() {
      this.type = 'server'
      this.titles = ['全部服务器', '已绑定服务器']
      this.filterPlaceholder = '选择绑定服务器'
      // this.isMultiple = true
      this.initUrl = this.isEdit()
        ? '/maintenance/server/selectScriptServerTransfer/' + this.scriptCode
        : '/maintenance/server/selectScriptServerTransfer'
      this.$refs.dialogTransfer.showDialog()
    },
    // 接收子组件传来的selectedServer -> 赋给selectedServer
    sendSelectedChild(data) {
      this.wholeServer = data.left
      this.selectedServer = data.right
    },
    // 提交列表（绑定服务器）
    dialogSubmit(params) {
      // console.debug(params)
      if (!this.isMultiple && params.value.length > 1) {
        // 单选检查
        this.$alert('只允许选择一条数据')
      } else {
        const data = {
          scriptCode: this.scriptCode,
          serverCodeList: this.selectedServer
        }
        request({
          url: '/maintenance/server/saveServerToScript',
          method: 'post',
          data
        }).then(() => {
          request({
            url: `/maintenance/server/selectScriptServerTransfer/${this.scriptCode}`,
            method: 'get'
          }).then(result => {
            this.bindingScriptCode = result.data.right[0]
            this.labelServer = keysGetLabels(
              result.data.left,
              result.data.right
            )
          })
        })
        this.$refs.dialogTransfer.closeDialog()
      }
    },
    // 列表元素变化
    changeHandler(params) {
      if (params.direction === 'right') {
        // 如果是右移添加项
        this.selectedServer = this.selectedServer.concat(
          params.movedKeys
        )
      } else {
        // 如果是左移减少项
        var a = this.selectedServer
        var b = params.movedKeys
        for (var i = 0; i < b.length; i++) {
          for (var j = 0; j < a.length; j++) {
            if (a[j] === b[i]) {
              a.splice(j, 1)
              j = j - 1
            }
          }
        }
        this.selectedServer = a
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';

// 折叠面板
.el-collapse {
  .el-collapse-item /deep/ {
    .el-collapse-item__header {
      font-size: 20px;
      font-weight: bold;
    }
    // 自适应dialog(配合组件样式)
    .el-dialog__body {
      box-sizing: content-box;
    }
    .el-transfer__buttons {
      max-width: fit-content !important;
      padding: 5%;
    }
  }
}

// 在线编辑表格
#hot-preview {
  width: 100%;
  height: 158px;
  overflow: auto;
  // overflow-x: hidden;
  margin: 20px 0;
  .handsontable {
    height: 100%;
    /deep/ .ht_master {
      height: 100%;
      .wtHolder {
        height: 100% !important;
      }
    }
  }
}
#hot-preview /deep/ #hot-display-license-info {
  display: none;
}

// 表单相关
.upload-component /deep/ {
  height: 32px;
  display: inline-block;
  margin-left: 10px;
  .el-button {
    height: 32px;
    line-height: 12px;
  }
}
.form-content-expand {
  max-height: 160px;
  overflow: auto;
  overflow-x: hidden;
  margin-bottom: 30px;
}

// 滚动条样式
.form-content-expand::-webkit-scrollbar-track,
.table-content-spe::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}
.form-content-expand::-webkit-scrollbar-thumb,
.table-content-spe::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.5);
  outline: 1px solid slategrey;
  border-radius: 5px;
}
.form-content-expand::-webkit-scrollbar,
.table-content-spe::-webkit-scrollbar {
  width: 10px;
}
</style>
