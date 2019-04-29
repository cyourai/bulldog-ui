<template>
  <div class="container">

    <!-- left -->
    <div style="width:49%;display:inline-block;transition:all ease 0.4s;position:relative"
         ref="leftOutline">
      <!-- 收缩icon -->
      <el-button style="position:absolute;right:10px;top:10px"
                 type="primary"
                 icon="el-icon-circle-plus-outline"
                 @click="show=!show;closeOutline()">展开
      </el-button>
      <CodeMirror @handleEditor="handleEditor"></CodeMirror>
    </div>

    <!-- right -->
    <transition name="el-zoom-in-center">
      <div v-show="show"
           style="width:49%;float:right;transition:all ease 0.4s"
           ref="rightOutline">
        <ComponentTable tableTitle="替换变量"
                        tableContent="替换变量"
                        :isEdit="this.isEdit()"
                        :filterShow="false">
          <!-- 动态表单项 -->
          <el-form slot="tableIn"
                   :model="formData"
                   ref="formData"
                   style="border:1px solid #e4e4e4">
            <div class="form-content-expand">
              <!-- 循环lebal -->
              <el-row v-for="(add, index) in formData.list"
                      :key="add.key"
                      :gutter="10">
                <el-col :span="2"
                        :offset="6"
                        style="height:35px;line-height:35px">col{{index+1}}：</el-col>
                <el-col :span="8">
                  <el-form-item :prop="'list.' + index + '.settingKey'"
                                :rules="[{ required: true, message: '请输入表头', trigger: 'blur' }]">
                    <el-input placeholder="表头："
                              v-model="add.settingKey"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button @click.prevent="removeDomain(add)"
                               type="danger"
                               icon="el-icon-close"
                               style="width:100%;padding:0"></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 操作 -->
            <el-row class="form-content-submit">
              <el-col :span="18"
                      :offset="6">
                <el-form-item>
                  <el-button type="primary"
                             @click="submitForm()"
                             icon="el-icon-edit">提交</el-button>
                  <el-button type="success"
                             @click="addDomain"
                             icon="el-icon-tickets">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </ComponentTable>
        <!-- 动态excel -->
        <ComponentTable tableTitle="动态参数"
                        :isEdit="this.isEdit()"
                        :filterShow="false"
                        :tableContentShow="false">
          <div slot="tableOut"
               id="hot-preview">
            <div class="hot-preview">
              <HotTable :settings="settings"
                        ref="hotable"></HotTable>
            </div>
          </div>
          <!-- 按钮 -->
          <el-row slot="buttons"
                  class="form-content-submit"
                  style="margin-top:20px">
            <el-col :span="18"
                    :offset="6">
              <el-button class="tree-transfer"
                         type="warning"
                         icon="el-icon-document"
                         style="height:40px"
                         @click="createCode;visible=true">生成脚本
              </el-button>
            </el-col>
          </el-row>
        </ComponentTable>
      </div>
    </transition>

    <!-- 收缩icon -->
    <el-button type="primary"
               icon="el-icon-remove-outline"
               class="iconOpen"
               @click="show=!show;closeOutline()"
               v-show="show">收起
    </el-button>
    <el-button type="primary"
               icon="el-icon-circle-plus-outline"
               class="iconOpen"
               @click="show=!show;openOutline()"
               v-show="!show">展开
    </el-button>

    <!-- dialog -->
    <vue-dialog :visible="visible"
                :title='"脚本生成器"'
                :type='"ScriptCreate"'
                :width='"60%"'
                @closeHandler="visible=false">
    </vue-dialog>
  </div>
</template>

<script>
import ComponentForm from '@/components/ComponentForm'
import ComponentTable from '@/components/ComponentTable'
import CodeMirror from '@/components/CodeMirror'
import { getParamsAll } from '@/api/settings/dictParams'
import HotTable from '@handsontable/vue'
import VueDialog from 'cyourai-vue-dialog'

export default {
  name: 'scriptcreate',
  components: {
    ComponentForm,
    ComponentTable,
    CodeMirror,
    HotTable,
    VueDialog
  },
  data() {
    return {
      // 表单数据
      formData: {},
      // 动态excel
      settings: {
        data: [
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ],
        colHeaders: ['col1', 'col2', 'col3', 'col4', 'col5'], // 自定义列表头or 布尔值
        contextMenu: {
          // 自定义右键菜单，可汉化，默认布尔值
          items: {
            row_above: {
              name: '上方插入一行'
            },
            row_below: {
              name: '下方插入一行'
            },
            col_left: {
              name: '左方插入列'
            },
            col_right: {
              name: '右方插入列'
            },
            hsep1: '---------', // 提供分隔线
            remove_row: {
              name: '删除行'
            },
            remove_col: {
              name: '删除列'
            },
            hsep2: '---------', // 提供分隔线
            make_read_only: {
              name: '只读'
            },
            borders: {
              name: '表格线'
            },
            commentsAddEdit: {
              name: '添加备注'
            },
            commentsRemove: {
              name: '取消备注'
            },
            freeze_column: {
              name: '固定列'
            },
            unfreeze_column: {
              name: '取消列固定'
            }
          }
        }, // 右键效果
        className: 'htMiddle htCenter', // 居中显示
        rowHeaders: true, // 行表头
        minSpareCols: 0, // 列留白
        minSpareRows: 0, // 行留白
        // startRows: 11, // 行列范围
        // startCols: 6,
        // maxRows: 20, // 最大行列
        // maxCols: 20,
        currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
        currentColClassName: 'currentCol', // 为选中列添加类名
        autoWrapRow: true, // 自动换行
        fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        manualColumnFreeze: true, // 手动固定列
        manualColumnMove: true, // 手动移动列
        manualRowMove: true, // 手动移动行
        manualColumnResize: true, // 手工更改列距
        manualRowResize: true, // 手动更改行距
        comments: true, // 添加注释
        columnSorting: true, // 排序
        stretchH: 'all' // 根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
      },
      // 下载的表格项
      excelList: [],
      // 上传的表格项
      tableData: [],
      tableHeader: [],
      radio: 'Json',
      // 右侧内容展开
      show: true,
      // 显示选择库弹窗
      visible: false
    }
  },
  props: {
    // 编辑器内容
    myEditor: ''
  },
  created() {
    this.init()
  },
  methods: {
    isEdit() {
      return typeof this.code !== 'undefined'
    },
    init() {
      getParamsAll().then(result => {
        this.formData = result.data
      })
    },
    submitForm(formData) {
      // 提交 -> 生成表头
      this.$refs['formData'].validate(valid => {
        if (valid) {
          // 设置表头 和 空内容
          const colHeaders = []
          const data = []
          const dataAry = []
          for (var i of this.formData.list) {
            colHeaders.push(i.settingKey)
            data.push('')
          }
          this.settings.colHeaders = colHeaders
          for (var j = 0; j < 6; j++) {
            dataAry.push(data)
          }
          this.settings.data = dataAry
        } else {
          return false
        }
      })
    },
    addDomain() {
      // 新增1项
      this.formData.list.push({})
    },
    removeDomain(item) {
      // 删除1项
      var index = this.formData.list.indexOf(item)
      if (index !== -1) {
        this.formData.list.splice(index, 1)
      }
    },
    closeOutline() {
      // 右侧收起
      const leftOutline = this.$refs.leftOutline
      leftOutline.style.width = '100%'
    },
    openOutline() {
      // 右侧展开
      const leftOutline = this.$refs.leftOutline
      leftOutline.style.width = '49%'
    },
    createCode() {
      // 生成代码
      var excel = this.$refs.hotable.table.getData()
      this.excelList = this.settings.data = excel
      // console.log(this.excelList)

      // const jsonData =
      //   '[{ "时间": "20080101", "品牌": "BMW" },{ "时间": "20080101", "品牌": "BMW" }]'
      // this.value = JSON.parse(jsonData)
      // console.log(this.value)
    },
    handleEditor(data) {
      // 接受子组件传递过来的编辑器数据 & 提交给数据库
      console.log(data)
    }
  }
}
</script>

<style src="./handsontable.full.css"></style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';

// 在线编辑表格
#hot-preview {
  width: 100%;
}
#hot-preview /deep/ #hot-display-license-info {
  display: none;
}
.hot-preview {
  max-height: 200px;
  overflow: auto;
  overflow-x: hidden;
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
  margin: 30px 0;
}
.iconOpen {
  position: absolute;
  top: 40px;
  right: 60px;
}

// 滚动条样式
.form-content-expand::-webkit-scrollbar-track,
.table-content-spe::-webkit-scrollbar-track,
.hot-preview::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}
.form-content-expand::-webkit-scrollbar-thumb,
.table-content-spe::-webkit-scrollbar-thumb,
.hot-preview::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.5);
  outline: 1px solid slategrey;
  border-radius: 5px;
}
.form-content-expand::-webkit-scrollbar,
.table-content-spe::-webkit-scrollbar,
.hot-preview::-webkit-scrollbar {
  width: 10px;
}
</style>

