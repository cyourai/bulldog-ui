<template>
  <!--
   通用审批页面组件: 具有填写意见, 关闭页面, 同意, 拒绝
   参数:
   taskId(必填): 任务id
   approveParam(非必填): 父组件可传参到本组件作为审批时的参数, 同名时父组件参数优先
  -->
  <div class="approve-container"
       :task-id="taskId"
       :is-show-close="isShowClose"
       :is-show-ok="isShowOK"
       :is-show-next="isShowNext"
       :is-show-reject="isShowReject"
       :is-show-remark="isShowRemark"
       :close-text="closeText"
       :ok-text="okText"
       :next-text="nextText"
       :reject-text="rejectText"
       :close-url="closeUrl"
       :approve-param="approveParam"
       v-loading="loading">
    <el-form slot="form"
             :model="formData"
             ref="formData"
             label-width="80px"
             label-position="right">
      <el-row v-show="isShowRemark">
        <el-col>
          <div class="remark">
            <el-form-item label="审批意见"
                          class="remark-label"
                          prop="remark">
              <tinymce-gallery id="remark"
                               v-model="formData.remark"
                               type='PhotoGallery'
                               @keyup="tinymceEventKeyUpHandler"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="form-submit">
          <el-form-item>
            <el-button type="warning"
                       v-show="isShowClose"
                       icon="el-icon-close"
                       @click="closeHandler"> {{closeText}}
            </el-button>
            <el-button type="info"
                       v-show="isShowNext"
                       icon="el-icon-check"
                       @click="nextHandler"> {{nextText}}
            </el-button>
            <el-button type="success"
                       v-show="isShowOK"
                       icon="el-icon-tickets"
                       @click="okHandler"> {{okText}}
            </el-button>
            <el-button type="primary"
                       icon="el-icon-edit"
                       v-show="isShowReject"
                       @click="rejectHandler"> {{rejectText}}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>
  import { TinymceGallery } from 'cyourai-vue-dialog'
  import { isEmpty, objectMerge } from '@/utils'
  import { agreeTaskWithVariable, rejectTaskWithVariable, nextTaskWithVariable } from '@/api/approve/approve'

  export default {
    name: 'approveContainer',
    components: {
      TinymceGallery
    },
    props: {
      // 当然审批的环节id
      taskId: {
        String,
        default: '',
        required: true
      },
      // 是否显示关闭按钮
      isShowClose: {
        Boolean,
        default: true,
        required: false
      },
      // 是否显示同意按钮
      isShowOK: {
        Boolean,
        default: true,
        required: false
      },
      // 是否显示下一步按钮
      isShowNext: {
        Boolean,
        default: true,
        required: false
      },
      // 显示不同意按钮
      isShowReject: {
        Boolean,
        default: true,
        required: false
      },
      // 显示审批意见
      isShowRemark: {
        Boolean,
        default: true,
        required: false
      },
      // 关闭按钮文字描述
      closeText: {
        String,
        default: '关 闭',
        required: false
      },
      // 同意按钮文字描述
      okText: {
        String,
        default: '同 意',
        required: false
      },
      // 下一步按钮文字描述
      nextText: {
        String,
        default: '下一步',
        required: false
      },
      // 拒绝按钮文字描述
      rejectText: {
        String,
        default: '拒 绝',
        required: false
      },
      // 关闭按钮回退地址
      closeUrl: {
        String,
        default: '',
        required: false
      },
      // 审批时的附加参数
      approveParam: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    data() {
      return {
        loading: false,
        formData: {
          // 审批意见
          remark: ''
        }
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
      },
      tinymceEventKeyUpHandler(event) {
        this.formData.remark = event
      },
      closeHandler() {
        if (!isEmpty(this.closeUrl)) {
          this.$router.push({
            path: this.closeUrl
          })
        }
      },
      nextHandler() {
        // 下一步
        return nextTaskWithVariable(this, this.taskId, this.updateParam())
      },
      okHandler() {
        // 同意
        return agreeTaskWithVariable(this, this.taskId, this.updateParam())
      },
      rejectHandler() {
        // 拒绝
        return rejectTaskWithVariable(this, this.taskId, this.updateParam())
      },
      // 合并审批参数
      updateParam() {
        const params = objectMerge({
          taskId: this.taskId,
          remark: this.formData.remark
        }, this.approveParam)
        return params
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
