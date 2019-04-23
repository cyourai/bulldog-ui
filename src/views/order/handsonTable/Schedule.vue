<template>
  <div class="container">
    <!-- <el-button @click="uploadExcel">导入</el-button> -->
    <div id="hot-preview">
      <hot-table :root="name" :settings="settings" :ref="name"></hot-table>
    </div>
  </div>
</template>

<script>
  import HotTable from '@handsontable/vue'
  import XLSX from 'xlsx'
  // import XLSX_SAVE from 'file-saver'
  import { parseTime, debug } from '@/utils'

  export default {
    name: 'Schedule',
    components: {
      HotTable
    },
    props: {
      isReadOnly: {
        Boolean,
        default: false
      },
      name: {
        String
      },
      columns: {
        Array
      },
      headers: {
        Array
      },
      data: {
        Array
      }
    },
    data() {
      return {
        // 全部执行时间
        allDateRangeList: [],
        // 最小执行时间
        minDate: '',
        // 最大执行时间
        maxDate: '',
        // 间隔天数
        dateCount: 0,
        // handsonTable设定
        settings: {
          // colHeaders: this.headers, // 自定义列表头or 布尔值
          colHeaders: [],
          data: this.data,
          columns: this.columns, // 添加每一列的数据类型和一些配置
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
              // borders: {
              //   name: '表格线'
              // },
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
          maxRows: 2000, // 最大行列
          maxCols: 2000, // 最大列
          currentRowClassName: 'currentRow', // 为选中行添加类名，可以更改样式
          currentColClassName: 'currentCol', // 为选中列添加类名
          autoWrapRow: true, // 自动换行
          fillHandle: true, // 选中拖拽复制 possible values: true, false, "horizontal", "vertical"
          undo: true,
          redo: true,
          manualColumnFreeze: true, // 手动固定列
          manualColumnMove: true, // 手动移动列
          manualRowMove: true, // 手动移动行
          manualColumnResize: true, // 手工更改列距
          manualRowResize: true, // 手动更改行距
          comments: true, // 添加注释
          columnSorting: true, // 排序
          autoColumnSize: true, // 自适应列宽
          observeChanges: true,
          renderAllRows: true,
          stretchH: 'all' // 根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
        },
        // 要下载的表格项
        excelList: [],
        // 上传的表格项
        tableData: [],
        tableHeader: []
      }
    },
    created() {
      this.settings.columns = this.columns
      for (let i = 0; i < this.columns.length; i++) {
        this.settings.columns[i].readOnly = this.isReadOnly
        let html = ''
        if (this.settings.columns[i].class === 'red') {
          html = "<strong><span class='red'>" + this.settings.columns[i].name + '</span></strong>'
        } else {
          html = "<strong><span class=''>" + this.settings.columns[i].name + '</span></strong>'
        }
        this.settings.colHeaders.push(html)
      }
      debug('schedule/created/this.settings.columns:', this.settings.columns)
      debug('schedule/created/this.settings.colHeaders:', this.settings.colHeaders)
    },
    watch: {
      data(curVal, oldVal) {
        this.settings.data = curVal
        debug('schedule/watch/data:', curVal)
        debug('schedule/watch/data:', this.settings.data)
      },
      columns(curVal, oldVal) {
        this.settings.columns = curVal
        for (let i = 0; i < this.settings.columns.length; i++) {
          this.settings.columns[i].readOnly = this.isReadOnly
        }
        debug('schedule/watch/columns:', curVal)
        debug('schedule/watch/columns:', this.settings.columns)
      },
      headers(curVal, oldVal) {
        this.settings.colHeaders = curVal
        debug('schedule/watch/headers:', curVal)
        debug('schedule/watch/headers:', this.settings.colHeaders)
      }
    },
    methods: {
      init() {
      },
      exportData() {
        return {
          data: this.$refs[this.name].table.getData(),
          columns: this.settings.columns,
          headers: this.$refs[this.name].table.getColHeader()
        }
      },
      createCellPos(numm) {
        const stringArray = []
        const numToStringAction = function(nnum) {
          const num = nnum - 1
          const a = parseInt(num / 26)
          const b = num % 26
          stringArray.push(String.fromCharCode(64 + parseInt(b + 1)))
          if (a > 0) {
            numToStringAction(a)
          }
        }
        numToStringAction(numm)
        return stringArray.reverse().join('')
      },
      exportScheduleExcel() {
        // 表头 不带样式数组
        const headers = this.headers
        // 带样式表头
        // 数据 数组
        const data = this.$refs[this.name].table.getData()
        // json型数据
        const jsonHeaders = headers
        // 为 _headers 添加对应的单元格位置
        // [ { v: 'id', position: 'A1' },
        //   { v: 'name', position: 'B1' },
        //   { v: 'age', position: 'C1' },
        //   { v: 'country', position: 'D1' },
        //   { v: 'remark', position: 'E1' } ]
          .map((v, i) => Object.assign({}, { v: v, position: this.createCellPos(i + 1) + 1 }))
          // 转换成 worksheet 需要的结构
          // { A1: { v: 'id' },
          //   B1: { v: 'name' },
          //   C1: { v: 'age' },
          //   D1: { v: 'country' },
          //   E1: { v: 'remark' } }
          .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v }}), {})
        const jsonData = data
        // 匹配 headers 的位置，生成对应的单元格数据
        // [ [ { v: '1', position: 'A2' },
        //     { v: 'test1', position: 'B2' },
        //     { v: '30', position: 'C2' },
        //     { v: 'China', position: 'D2' },
        //     { v: 'hello', position: 'E2' } ],
        //   [ { v: '2', position: 'A3' },
        //     { v: 'test2', position: 'B3' },
        //     { v: '20', position: 'C3' },
        //     { v: 'America', position: 'D3' },
        //     { v: 'world', position: 'E3' } ],
        //   [ { v: '3', position: 'A4' },
        //     { v: 'test3', position: 'B4' },
        //     { v: '18', position: 'C4' },
        //     { v: 'Unkonw', position: 'D4' },
        //     { v: '???', position: 'E4' } ] ]
          .map((v, i) => headers.map((k, j) => Object.assign({}, {
            v: v[j], position: this.createCellPos(j + 1) + (i +
              2)
          })))
          // 对刚才的结果进行降维处理（二维数组变成一维数组）
          // [ { v: '1', position: 'A2' },
          //   { v: 'test1', position: 'B2' },
          //   { v: '30', position: 'C2' },
          //   { v: 'China', position: 'D2' },
          //   { v: 'hello', position: 'E2' },
          //   { v: '2', position: 'A3' },
          //   { v: 'test2', position: 'B3' },
          //   { v: '20', position: 'C3' },
          //   { v: 'America', position: 'D3' },
          //   { v: 'world', position: 'E3' },
          //   { v: '3', position: 'A4' },
          //   { v: 'test3', position: 'B4' },
          //   { v: '18', position: 'C4' },
          //   { v: 'Unkonw', position: 'D4' },
          //   { v: '???', position: 'E4' } ]
          .reduce((prev, next) => prev.concat(next))
          // 转换成 worksheet 需要的结构
          //   { A2: { v: '1' },
          //     B2: { v: 'test1' },
          //     C2: { v: '30' },
          //     D2: { v: 'China' },
          //     E2: { v: 'hello' },
          //     A3: { v: '2' },
          //     B3: { v: 'test2' },
          //     C3: { v: '20' },
          //     D3: { v: 'America' },
          //     E3: { v: 'world' },
          //     A4: { v: '3' },
          //     B4: { v: 'test3' },
          //     C4: { v: '18' },
          //     D4: { v: 'Unkonw' },
          //     E4: { v: '???' } }
          .reduce((prev, next) => Object.assign({}, prev, {
            [next.position]: {
              v: next.v
            }
          }), {})
        // 带样式表头
        // for (const index in styleHeaders) {
        //   const style = styleHeaders[index]
        //   if (style.class === 'red') {
        //     jsonHeaders[index].s = { font: { sz: 20, bold: true, color: { rgb: '#B3001B' }}}
        //   } else {
        //     jsonHeaders[index].s = { font: { sz: 20, bold: true, color: { rgb: '#B3001B' }}}
        //   }
        // }
        // 取标色
        const titleHeaders = {}
        for (const i in jsonHeaders) {
          console.debug(jsonHeaders[i])
          let item = jsonHeaders[i]['v'].replace("<strong><span class=''>", '')
          item = item.replace("<strong><span class='red'>", '')
          item = item.replace('</span></strong>', '')
          titleHeaders[i] = { v: item }
        }
        // 合并 headers 和 data
        const output = Object.assign({}, titleHeaders, jsonData)
        // 获取所有单元格的位置
        const outputPos = Object.keys(output)
        // 计算出范围
        const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
        // 构建 workbook 对象
        const wb = {
          SheetNames: ['预览排期单'],
          Sheets: {
            '预览排期单': Object.assign({}, output, { '!ref': ref })
          }
        }
        const timeStamp = parseTime(new Date().getTime(), '{y}{m}{d}_{h}{i}{s}')
        // 导出 Excel
        XLSX.writeFile(wb, '预览排期单_' + timeStamp + '.xlsx')
      }
      // 简单js-xlsx方式
      // 表格数据
      // const data = this.$refs.hot.table.getData()
      // 出力数据
      // const exportData = headers.concat(data)

      // covert json to sheet
      // const ws = XLSX.utils.aoa_to_sheet(this.$refs.hot.table.getData())
      // let ws = XLSX.utils.sheet_to_json()
      // const wb = XLSX.utils.book_new()
      // XLSX.utils.book_append_sheet(wb, ws, '预览排期单')
      // // save
      // const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' })
      // const timeStamp = parseTime(new Date().getTime(), '{y}{m}{d}_{h}{i}{s}')
      // XLSX_SAVE.saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), '预览排期单_' + timeStamp +'.xlsx')

      // 直接导出表格方式
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = this.settings.styleHeaders
      //   const filterVal = this.settings.styleHeaders
      //   console.debug(tHeader)
      //   this.excelList = this.$refs.hot.table.getData()
      //   // 数据格式转化
      //   let newObj = {}
      //   let newAry = []
      //   for (const i in this.excelList) {
      //     for (const j in tHeader) {
      //       newObj[tHeader[j]] = this.excelList[i][j]
      //     }
      //     newAry[i] = newObj
      //   }
      //   const data = this.formatJson(filterVal, newAry)
      //   const timeStamp = parseTime(new Date().getTime(), '{y}{m}{d}_{h}{i}{s}')
      //   excel.export_json_to_excel(tHeader, data, '预览排期单' + '_' + timeStamp)
      // })
    }
  }
</script>

<style src="./handsontable.full.css"></style>
<style rel="stylesheet/scss" lang="scss" scoped>
  #hot-preview {
    width: 99%;
    height: 500px;
    // height: auto;
    overflow: hidden;
  }
  #hot-preview /deep/ #hot-display-license-info {
    display: none;
  }
  .handsontable {
    height: 30px !important;
  }
</style>
