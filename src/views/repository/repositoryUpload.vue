<template>
    <div class="container" v-loading="loading"
         :is-select-model="isSelectModel"
         :init-tree-url="initTreeUrl"
         :select-row="selectRow"
         @selection-change>
        <div class="content">
            <div class="job-container">
                <el-container>
                    <!--左 上传目录树-->
                    <el-aside width="350px" class="left-panel">
                        <vue-tree
                            id="repositoryTree"
                            :is-edit="!isSelectModel"
                            :style-class="treeClass"
                            :init-tree-url="initTreeUrl"
                            :update-tree-url="tree.updateTreeUrl"
                            :del-tree-url="tree.delTreeUrl"
                            :insert-tree-url="tree.insertTreeUrl"
                            :height="height"
                            @click-node="treeClickNodeHandler"
                            @checked-nodes="selectionChange">
                        </vue-tree>
                    </el-aside>
                    <!--右 工作-->
                    <el-container class="right-panel is-vertical">
                        <table-header ref="tableHeader"
                                      :tree-level="treeLevel"
                                      :search-url="searchUrl"
                                      @list="showSearchList">
                          <div class="options" slot="option-slot">
                            <el-upload class="uploader"
                                       ref="upload"
                                       action=''
                                       multiple
                                       :http-request="uploadHandler"
                                       :show-file-list='false'
                                       :data="{relateCode: param.treeCode, uploadType: 'repository'}"
                                       accept=".doc,.docx,.xls,.xlsx,ppt,pptp,pdf,txt">
                              <el-button type="success"
                                         icon="el-icon-plus"
                                         size="mini">上传文档
                              </el-button>
                            </el-upload>
                          </div>
                        </table-header>
                        <!--上传文件列表-->
                        <el-main class="right-panel-main">
                            <table-grid ref="tableRepository"
                                        :is-show-border='false'
                                        :is-show-footer='false'
                                        :is-show-checkbox='isSelectModel'
                                        :is-show-stripe='false'
                                        :height='height'
                                        :query-param='param'
                                        :table-list='list'
                                        :select-url='selectUrl'
                                        :headers='headers'
                                        @selection-change="handleSelectionChange">
                                <!--末尾追加操作列-->
                                <el-table-column slot="option-slot"
                                                 v-if="!isSelectModel"
                                                 label="操作"
                                                 min-width="280"
                                                 align="center">
                                    <template slot-scope="scope">
                                        <div class="buttons">
                                            <el-tooltip content="重命名"
                                                        placement="left">
                                                <el-button plain
                                                           icon="el-icon-edit"
                                                           size="mini"
                                                           type="primary"
                                                           @click="rename(scope.row)"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="下载"
                                                        placement="top">
                                                <el-button plain
                                                           icon="el-icon-download"
                                                           size="mini"
                                                           type="success"
                                                           @click="download(scope.row.uploadCode)"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="删除"
                                                        placement="right">
                                                <el-button plain
                                                           icon="el-icon-delete"
                                                           size="mini"
                                                           type="danger"
                                                           @click="del(scope.row)"></el-button>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                            </table-grid>

                        </el-main>
                    </el-container>
                </el-container>
            </div>
        </div>

        <!--重命名-->
        <el-dialog :visible.sync="dialogVisible">
            <el-form v-model="form">
                <el-form-item label="文件名："
                              prop="uploadName"
                              class="filter-container-name"
                              label-position="left"
                              label-width="90px">
                    <el-input style="margin-left: 0px" v-model="form.uploadName"  placeholder="请输入文件名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm(form)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import { isNotEmpty, request } from '@/utils'
  import { TableGrid, TableHeader, VueTree, TableFile } from 'ctsi-vue-dialog'

  export default {
    name: 'repositoryUpload',
    components: {
      TableFile,
      TableGrid,
      TableHeader,
      VueTree
    },
    watch: {
      initTreeUrl: function(curVal) {
        this.initTreeUrl = curVal
      }
    },
    props: {
      isSelectModel: {
        type: Boolean,
        required: false,
        default: false
      },
      // 初始化树形连接地址
      initTreeUrl: {
        type: String,
        required: false,
        default: '/general/tree/selectTreeListByRootCode/treeRoot'
      },
      selectRow: {
        type: Array,
        required: false,
        default: function() {
          return []
        }
      }
    },
    created() {
      this.baseURL = `${process.env.BASE_API + process.env.PREFIX}`
    },
    data() {
      return {
        // 页面loading
        loading: false,
        // 树形样式
        treeClass: 'width:450px',
        // 树结构增/删/改url
        tree: {
          // 左侧树形预案分类
          delTreeUrl: '/general/tree/',
          updateTreeUrl: '/general/tree/',
          insertTreeUrl: '/general/tree/insert'
        },
        // 高度
        height: '350',
        // 树形层级
        treeLevel: '',
        // 显示上传列表
        isShowUpload: true,
        // 切换按钮
        switchOptions: {
          true: '去资源管理',
          false: '去上传管理'
        },
        // 查询参数(当前活的的节点)
        param: {
          treeCode: '',
          treeType: 'root'
        },
        // 文件list
        list: [],
        // 树节点绑定文件loading
        bindLoading: false,
        // 初始化右侧文件列表
        selectFormUrl: '',
        // 查询文件
        selectUrl: '',
        // 表头
        headers: [
          { prop: 'uploadName', label: '文件名', sortable: 'custom', minWidth: '180' },
          { prop: 'uploadSize', label: '大小', minWidth: '250' },
          { prop: 'updateUser', label: '上传用户', minWidth: '130' },
          { prop: 'createTime', label: '上传时间', sortable: 'custom', minWidth: '180' }
        ],
        // 下载url
        downloadUrl: '',
        // 删除url
        deleteUrl: '',
        // 更新url
        updateUrl: '',
        // 基路径
        baseUrl: '',
        // 弹窗是否显示
        dialogVisible: false,
        // 重命名form
        form: {
          uploadRelate: '',
          uploadCode: '',
          uploadName: '',
          uploadRealName: ''
        },
        // 搜索请求路径
        searchUrl: '/general/upload/selectUploadListByUploadName'
      }
    },
    methods: {
      treeClickNodeHandler(param) {
        // 点击节点
        this.treeLevel = isNotEmpty(param.treeLevel) ? param.treeLevel.join(' / ') : ''
        this.param.treeCode = param.treeCode
        this.param.treeType = param.treeType
        // this.form.treeCode = param.treeCode
        if (param.treeType === 'root') {
          this.param.treeCode = ''
        } else {
          // console.log(param.treeCode)
          this.getFileListByTreeCode(param.treeCode)
        }
      },
      getFileListByTreeCode(code) {
        // 查询对应表格
        this.selectFormUrl = '/general/upload/selectFileListByRelateCode/' + code
        request({
          url: this.selectFormUrl,
          method: 'get',
          relateCode: code
        }).then(result => {
          // console.log(result)
          this.list = result.data.list
        })
      },
      // 获取多选
      selectionChange(params) {
        this.$emit('tree-selection-change', {
          checkedNodes: params
        })
      },
      uploadHandler(param) {
        if (this.param.treeType === 'root') {
          this.$alert('请选择左侧分组')
        } else {
          //
          this.loading = true
          var form = new FormData()
          form.append('file', param.file, param.file['filename'])
          form.append('relateCode', param.data.relateCode)
          form.append('uploadType', param.data.uploadType)
          request({
            // zuul/api 前置zuul对应上传中文问题
            baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
            url: '/general/upload/uploadFile',
            method: 'post',
            data: form,
            config: {
              headers: {
                'Content-Type': 'multipart/form-data;boundary=boundary'
              }
            }
          }).then(() => {
            // console.log(param.data.relateCode)
            this.getFileListByTreeCode(param.data.relateCode)
          }).catch(error => {
            console.error(error)
          }).finally(() => {
            this.loading = false
          })
        }
      },
      refreshTable() {
        // 表格数据初始化
        this.selectUrl = this.selectFormUrl
        this.$refs.tableRepository.refreshTable()
      },
      handleSelectionChange(selection) {
        this.$emit('selection-change', {
          selection: selection.selection
        })
      },
      rename(row) {
        this.dialogVisible = true
        this.form.uploadCode = row.uploadCode
        this.form.uploadRelate = row.uploadRelate
        this.form.uploadName = row.uploadName
      },
      download(code) {
        // 下载
        this.baseURL = `${process.env.BASE_API + process.env.PREFIX}`
        const url = this.baseURL + '/general/download/downloadFile/' + code
        window.open(url, '_self')
      },
      del(row) {
        // console.log(row)
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUrl = '/general/upload/deleteUpload/' + row.uploadCode
          request({
            url: this.deleteUrl,
            method: 'delete'
          }).then(() => {
            this.getFileListByTreeCode(row.uploadRelate)
          })
        })
      },
      submitForm(form) {
        // 保存重命名
        this.updateUrl = '/general/upload'
        this.form.uploadRealName = this.form.uploadName
        request({
          url: this.updateUrl,
          method: 'put',
          data: form
        }).then(reult => {
          this.dialogVisible = false
          this.getFileListByTreeCode(form.uploadRelate)
        })
      },
      showSearchList(data) {
        this.list = data
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  @import '~@/styles/smart-ui/jobs.scss';
  .ah {
      float: right;
      margin-right: 20px;
      color: blue;
      text-decoration : underline;
  }
  .el-input {
    margin-left: 280px;
  }
</style>
