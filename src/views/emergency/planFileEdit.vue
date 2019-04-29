<template>
  <div class="container">
    <ComponentTable :tableShow="false"
                    :tableContentShow="false"
                    :tableTitle="tableTitle">
      <div slot="content">
        <el-table fit
                  :data="tableData"
                  style="width: 100%"
                  v-loading="tableDataLoading">
          <el-table-column prop="planName"
                           label="预案名称"
                           width="400">
          </el-table-column>
          <el-table-column prop="planRemark"
                           label="预案描述"
                           width="800">
          </el-table-column>
          <el-table-column prop="createUser"
                           label="作者">
          </el-table-column>
        </el-table>
      </div>

      <div slot="content"
           style="padding-bottom:20px;margin-top: 20px;">
        <el-row>
          <!-- 文档列表 -->
          <div class="file">
            <ul class="file-list">
              <li v-for="(item,i) in list" :key="item.key">
                  <a @click="ShowFileContent(item)">{{item.uploadName}}</a>
                <!--<a @click="ShowFileContent(item)">{{item.uploadName}}（{{item.uploadCode}}）</a>-->
                <el-tooltip content="查看"
                            placement="left">
                  <el-button plain
                             icon="el-icon-search"
                             size="mini"
                             type="info"
                             @click="viewContent(item)"></el-button>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </el-row>
        <el-row>
          <el-form label-width="20px">
              <el-form-item>
                  预案版本信息：
                  <el-input v-model="planVersion"
                            placeholder="请输入预案版本信息" style="width: 500px"></el-input>
              </el-form-item>
              <el-form-item>
                  <div style="width: 95%">
                      <!-- 富文本 & 图片库 -->
                      <tinymce-markdown id="markdown"
                                        v-model="content"
                                        :type='"PhotoGallery"'
                                        @keyup="tinymceHandler"></tinymce-markdown>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button type="success"
                             style="margin-top:10px;"
                             icon="el-icon-tickets"
                             @click="saveEdit"> 保存
                  </el-button>
              </el-form-item>
          </el-form>
        </el-row>
      </div>

    </ComponentTable>

    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="60%">
      <div v-html="fileContent" v-if="!viewLoading"></div>
    </el-dialog>
  </div>
</template>

<script>
  import ComponentTable from '@/components/ComponentTable'
  import ComponentForm from '@/components/ComponentForm'
  import { request, params } from '@/utils'
  import { TinymceMarkdown } from 'cyourai-vue-dialog'

  export default {
    name: 'planFileEdit',
    components: {
      ComponentTable,
      ComponentForm,
      TinymceMarkdown
    },
    data() {
      return {
        // 页名
        tableTitle: '预案文档编辑',
        // 文档列表
        list: [],
        // 是否显示富文本框
        fileShow: false,
        // 文件内容
        fileContent: '',
        // 预案编号
        planCode: '',
        tableData: [{
          planName: '',
          planRemark: '',
          createUser: ''
        }],
        // 表格loading
        tableDataLoading: false,
        // 基路径
        baseURL: '',
        // 是否显示dialog
        dialogVisible: false,
        // 文件名称
        title: '',
        // 加载文件内容
        viewLoading: false,
        // 文件内容
        content: '111222333444555666777888',
        // 富文本规格
        tinyOpt: {
          height: 600
        },
        // 预案版本信息
        planVersion: ''
      }
    },
    created() {
      this.planCode = params(this, 'planCode')
      this.init()
    },
    methods: {
      // 页面初始化-获取预案下的所有文档
      init() {
        this.refreshTable()
        const params = {}
        params.planCode = this.planCode
        request({
          url: '/topic/plan/selectPlanProcessFileList',
          method: 'get',
          params
        }).then(result => {
          this.list = result.data.uploadList
        })
      },
      refreshTable() {
        request({
          url: '/topic/plan/' + this.planCode,
          method: 'get',
          planCode: this.planCode
        }).then(result => {
          console.log(result.data)
          this.tableData[0].planName = result.data.planName
          this.tableData[0].planRemark = result.data.planRemark
          this.tableData[0].createUser = result.data.createUser
          this.planVersion = result.data.planVersion
          this.content = result.data.planContent
        })
      },
      // 点击下载
      ShowFileContent(item) {
        this.baseURL = `${process.env.BASE_API + process.env.PREFIX}`
        const url = this.baseURL + '/general/download/downloadFile/' + item.uploadCode
        window.open(url, '_self')
      },
      // 查看预案内容
      viewContent(item) {
        this.dialogVisible = true
        this.title = item.uploadName
        this.viewLoading = true
        const data = {
          uploadCode: item.uploadCode
        }
        request({
          url: '/general/upload/read',
          method: 'post',
          data
        }).then(result => {
          this.fileContent = result.data.content
        }).finally(() => {
          this.viewLoading = false
        })
      },
      tinymceHandler(content) {
        this.content = content
      },
      saveEdit() {
        // 保存修改
        const data = {
          planCode: this.planCode,
          planContent: this.content,
          planVersion: this.planVersion
        }
        request({
          url: '/topic/plan',
          method: 'put',
          data
        }).then(result => {
          this.refreshTable()
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .file {
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
