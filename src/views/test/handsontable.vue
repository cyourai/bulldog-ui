<template>
  <div class="container">
    <el-button @click="saveExcel">保存</el-button>
    <el-button @click="exportExcel">导出</el-button>
    <upload-excel-component @on-selected-file='uploadExcel'
                            class="upload-component"></upload-excel-component>
    <div id="hot-preview">
      <HotTable :settings="settings"
                ref="hotable"></HotTable>
    </div>
  </div>
</template>

<script>
import HotTable from '@handsontable/vue'
import { parseTime } from '@/utils'
import UploadExcelComponent from '@/components/ComponentExcel/upload2'

export default {
  name: 'handsontable',
  components: {
    HotTable,
    UploadExcelComponent
  },
  data() {
    return {
      settings: {
        data: [
          ['20080101', 'BMW', 11, 12, 13, true],
          ['20080101', 'BMW', 11, 12, 13, true],
          ['20080101', 'BMW', 11, 12, 13, true],
          ['20080101', 'BMW', 11, 12, 13, true]
        ],
        colHeaders: ['时间', '品牌', '价格', '数量', '品质', '有效'], // 自定义列表头or 布尔值
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
      tableHeader: []
    }
  },
  methods: {
    saveExcel() {
      // 更新表格
      var excel = this.$refs.hotable.table.getData()
      // console.log(excel)
      this.excelList = this.settings.data = excel
      console.log(this.excelList)
    },
    exportExcel() {
      console.log('1')
      // 下载表格
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.settings.colHeaders
        const filterVal = this.settings.colHeaders
        // 数据格式转化
        var newAry = []
        var arr = this.settings.colHeaders
        for (const i in this.excelList) {
          var newObj = {}
          for (var j in arr) {
            newObj[arr[j]] = this.excelList[i][j]
          }
          newAry[i] = newObj
        }
        console.log(newAry)
        const data = this.formatJson(filterVal, newAry)
        excel.export_json_to_excel(tHeader, data, 'MyFile')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    uploadExcel(data) {
      // 确定表头
      this.settings.colHeaders = data.header
      // this.settings.columns.length = data.header.length
      // 表内容：二维数组
      this.tableData = data.results
      var newAry = []
      for (const i in this.tableData) {
        // 内层数组
        const newAryIn = []
        for (const j in this.tableData[i]) {
          // console.log(this.tableData[i][j])
          newAryIn.push(this.tableData[i][j])
        }
        newAry[i] = newAryIn
      }
      // console.log(newAry)
      this.excelList = this.settings.data = newAry
    }
  }
}
</script>

<style src="./handsontable.full.css"></style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
#hot-preview {
  width: 50%;
  height: 300px;
  // height: auto;
  overflow: hidden;
  margin-top: 20px;
}
#hot-preview /deep/ #hot-display-license-info {
  display: none;
}
.upload-component /deep/ {
  height: 32px;
  display: inline-block;
  margin-left: 10px;
  .el-button {
    height: 32px;
    line-height: 12px;
  }
}
</style>
