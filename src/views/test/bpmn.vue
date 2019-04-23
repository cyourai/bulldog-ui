<template>
  <div class="container">
    <div class="containers"
         ref="content">
      <!-- 画布 -->
      <div class="canvas"
           ref="canvas">
        <div class="buttons">
          <a ref="saveDiagram"
             href="javascript:;"
             title="请先“保存流程”">下载bpmn</a>
          <a ref="saveSvg"
             href="javascript:;"
             title="请先“保存流程”">下载svg</a>
          <!-- <a ref="saveSvg"
             href="javascript:;"
             title="请先“保存流程”">下载json</a> -->
          <el-button size="mini"
                     type="success"
                     @click="save"
                     :disabled="loading === true">保存流程</el-button>
          <!-- <el-button size="mini"
                     type="primary"
                     @click="insert">导入流程</el-button> -->
          <el-button size="mini"
                     type="danger"
                     @click="reset">重置流程</el-button>
          <el-select style="margin-left:10px"
                     placeholder="100%"
                     v-model="displaySize"
                     @change="displaySizeChange">
            <el-option label="200%"
                       value="200%">
            </el-option>
            <el-option label="150%"
                       value="150%">
            </el-option>
            <el-option label="100%"
                       value="100%">
            </el-option>
            <el-option label="75%"
                       value="75%">
            </el-option>
            <el-option label="50%"
                       value="50%">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 原属性面盘：隐藏 -->
      <div id="js-properties-panel"
           class="panel">
      </div>
      <!-- 属性面盘 -->
      <el-form ref="form"
               :model="form"
               label-position="top"
               label-width="80px">
        <!-- 流程 -->
        <div class="el-form-block">
          <span class="el-form-title first">流程</span>
          <el-form-item label="流程名称：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="流程id：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <!-- 节点 -->
        <div class="el-form-block">
          <span class="el-form-title">节点</span>
          <el-form-item label="节点名称：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="节点id：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <!-- 网关 -->
        <div v-if="elementType.indexOf('Gateway')>-1"
             class="el-form-block">
          <span class="el-form-title">网关</span>
          <el-form-item label="选择网关：">
            <el-select v-model="form.region"
                       placeholder="请选择">
              <el-option label="并行"
                         value="parallel"></el-option>
              <el-option label="顺行"
                         value="inclusive"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 网关细节 -->
        <div v-if="SequenceFlowFromGateway"
             class="el-form-block">
          <span class="el-form-title">网关细节</span>
          <el-form-item label="网关细节：">
            <el-select v-model="form.region"
                       placeholder="请选择">
              <el-option label="expression"
                         value="expression"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="expression：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <!-- 任务 -->
        <div v-if="elementType.indexOf('Task')>-1 || elementType.indexOf('CallActivity')>-1"
             class="el-form-block">
          <span class="el-form-title">任务</span>
          <el-form-item label="选择任务：">
            <el-select v-model="form.region"
                       placeholder="请选择">
              <el-option label="call activity"
                         value="call activity"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 任务细节 -->
        <div v-if="elementType.indexOf('Task')>-1 || elementType.indexOf('CallActivity')>-1"
             class="el-form-block">
          <span class="el-form-title">任务细节</span>
          <el-form-item label="任务细节：">
            <el-select v-model="form.region"
                       placeholder="请选择">
              <el-option label="bpmn"
                         value="bpmn"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="bpmn：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item>
          <el-button type="primary">确定</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>


<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'

export default {
  name: 'bpmn',
  components: {},
  data() {
    return {
      // 主键
      id: '',
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      // 流程图名称
      processName: '流程测试',
      // 点击节点获取的数据
      nodeCode: '',
      nodeName: '',
      // 显示大小
      displaySize: '100%',
      // 被点击元素的属性
      elementType: '',
      // 网关节点后的SequenceFlow
      SequenceFlowFromGateway: false,
      // 页面loading
      loading: false,
      // 属性表单
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted() {
    /*
      引入流程图
    */
    // 1、引入相关的依赖
    const propertiesPanelModule = require('bpmn-js-properties-panel')
    const propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda')
    const camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda')
    // 2、分别获取到属性ref为“content”和“canvas”的dom节点
    this.container = this.$refs.content
    const canvas = this.$refs.canvas
    // 3、建模配置
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      // 控制板
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    })
    // 4、获取图的内容
    this.createNewDiagram()

    /*
      缩放流程图
    */
    // const viewPort = document.getElementsByClassName('viewport')
    // console.log(viewPort[0])
    // const st = window.getComputedStyle(viewPort[0], null)
    // console.log(st)
    // const tr =
    //   st.getPropertyValue('-webkit-transform') ||
    //   st.getPropertyValue('-moz-transform') ||
    //   st.getPropertyValue('-ms-transform') ||
    //   st.getPropertyValue('-o-transform') ||
    //   st.getPropertyValue('transform-origin')
    // ;('FAIL')
    // console.log(st.getPropertyValue('transform'))
    // console.log(st.getPropertyValue('transform-origin'))
    // // With rotate(30deg)...
    // // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    // console.log('Matrix: ' + tr)
  },
  created() {
    // this.save()
  },
  methods: {
    // 定义模型
    createNewDiagram() {
      this.$nextTick(() => {
        const newDiagramXML =
          '<?xml version="1.0" encoding="UTF-8"?>\r\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\r\n  <bpmn2:process id="Process_1" name="' +
          this.processName +
          '" isExecutable="true">\r\n    <bpmn2:startEvent id="StartEvent_1"/>\r\n  </bpmn2:process>\r\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\r\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\r\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\r\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\r\n      </bpmndi:BPMNShape>\r\n    </bpmndi:BPMNPlane>\r\n  </bpmndi:BPMNDiagram>\r\n</bpmn2:definitions>'
        this.xmlStr = newDiagramXML
        const that = this
        this.bpmnModeler.importXML(this.xmlStr, function(err) {
          if (err) {
            console.error(err)
          } else {
            // 字符串转换成图成功后执行的函数
            that.success()
          }
          // 流程图自适应画布
          var canvas = that.bpmnModeler.get('canvas')
          canvas.zoom('fit-viewport')
        })
      })
    },
    // 保存流程（解锁下载按钮）
    save() {
      this.loading = true
      const _this = this
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      const fileName = this.processName
      downloadLink.title = ''
      downloadSvgLink.title = ''

      // 绑定事件（图发生改变才会触发）
      // this.bpmnModeler.on('commandStack.changed', function() {})

      // 绑定事件，页面加载触发
      _this.saveSVG(function(err, svg) {
        _this.setEncoded(downloadSvgLink, fileName + '.svg', err ? null : svg)
      })
      _this.saveDiagram(function(err, xml) {
        _this.setEncoded(downloadLink, fileName + '.bpmn', err ? null : xml)
      })
      this.loading = false
    },
    saveJSON(done) {},
    // 下载流程：SVG文件
    saveSVG(done) {
      this.bpmnModeler.saveSVG(done)
    },
    // 下载流程：bpmn文件
    saveDiagram(done) {
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    },
    // 流程图转码
    setEncoded(link, name, data) {
      // console.log(data)
      // 重新编码：xml -> URI
      var encodedData = encodeURIComponent(data)
      // console.log(encodedData)
      this.xmlStr = data
      // 改变a的属性：className令a标签可点击，href令能下载，download是下载的文件的名字
      link.className = 'active'
      link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
      link.download = name
    },
    // 重置流程
    reset() {
      this.$confirm('未保存的流程将被清空！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const newDiagramXML =
            '<?xml version="1.0" encoding="UTF-8"?>\r\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\r\n  <bpmn2:process id="Process_1" name="' +
            this.processName +
            '" isExecutable="true">\r\n    <bpmn2:startEvent id="StartEvent_1"/>\r\n  </bpmn2:process>\r\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\r\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\r\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\r\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\r\n      </bpmndi:BPMNShape>\r\n    </bpmndi:BPMNPlane>\r\n  </bpmndi:BPMNDiagram>\r\n</bpmn2:definitions>'
          this.bpmnModeler.importXML(newDiagramXML, function(err) {
            if (err) {
              console.error(err)
            }
          })
        })
        .catch(() => {})
    },
    // 导入流程
    insert() {
      this.$confirm('未保存的流程将被清空！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //
        })
        .catch(() => {})
    },
    // 缩放流程图
    displaySizeChange(value) {
      const layerBase = document.getElementsByClassName('viewport')
      console.log(layerBase[0])
    },
    // 增加事件监听器在Modeling里
    success() {
      const bpmnjs = this.bpmnModeler
      const eventBus = bpmnjs.get('eventBus')
      const elementFactory = bpmnjs.get('elementFactory')
      const modeling = new Modeling(eventBus, elementFactory)
      this.addBpmnListener(this, modeling)
    },
    addBpmnListener(_self, modeling) {
      const bpmnjs = this.bpmnModeler
      const eventBus = bpmnjs.get('eventBus')
      const events = ['element.click', 'element.dblclick']
      events.forEach(event => {
        eventBus.on(event, e => {
          // 重置流程线节点为false
          this.SequenceFlowFromGateway = false
          this.elementType = e.element.type
          console.log(this.elementType)
          if (
            e.element.type === 'bpmn:Process' ||
            e.element.type === 'bpmn:Lane'
          ) {
            return
          }
          var elementRegistry = bpmnjs.get('elementRegistry')
          var shape = elementRegistry.get(e.element.id)
          console.log(shape)
          // 判断流程线节点是否紧跟网关节点
          if (shape.source !== undefined) {
            if (shape.source.type.indexOf('Gateway') > -1) {
              this.SequenceFlowFromGateway = true
            }
          }
          // 获取节点具体信息
          _self.nodeCode = shape.businessObject.id
          _self.nodeName = shape.businessObject.name
          // console.log(_self.nodeCode)
          // console.log(_self.nodeName)
        })
      })
    }
  }
}
</script>

<style src="./bpmn/bpmn-js-properties-panel.css"></style>
<style src="./bpmn/diagram-js.css"></style>
<style src="./bpmn/app.css"></style>
<style src="./bpmn/font-css/bpmn-embedded.css"></style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.containers /deep/ {
  position: relative;
  background-color: #ffffff;
  height: 800px;
  #js-properties-panel {
    // display: none;
  }
  .el-form {
    display: none;
    background: #f8f8f8;
    padding: 10px;
    width: 320px;
    position: absolute;
    right: 0;
    top: 0;
    &-block:not(:first-child) {
      margin-top: 20px;
    }
    &-title {
      font-size: 18px;
      font-weight: bold;
      color: #606266;
      display: block;
      padding: 20px 0 10px 0;
      border-top: 1px dotted #606266;
    }
    .first {
      padding-top: 0;
      border: 0;
    }
    &-item {
      margin-bottom: 0;
      label {
        font-size: 12px;
        font-weight: normal;
        padding: 0;
      }
    }
  }
  .bjs-powered-by img {
    display: none;
  }
  .buttons {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    height: 32px;
    a {
      background: #e6a23c;
      color: #fff;
      display: inline-block;
      padding: 0 15px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      margin-right: 10px;
    }
  }
  .canvas {
    width: 100%;
    height: 100%;
    .djs-palette {
      top: 70px;
    }
  }
  .panel {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }
}
</style>
