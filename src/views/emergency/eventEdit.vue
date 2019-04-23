<template>
  <div class="event-edit-container" v-loading="loading">
    <component-form :name="$t('route.event')"
                    :isEdit="isEdit">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="80px"
               label-position="right">
        <el-row v-if=false>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="事件编号"
                          prop="eventCode">
              <el-input v-model="code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件名称"
                          prop="eventName">
              <el-input v-model="formData.eventName"
                        :disabled="isApprove"
                        placeholder="请输入事件名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件等级"
                          prop="eventLevel">
              <component-select type="eventLevel"
                                model="center"
                                :disabled="isApprove"
                                :defaultSelected="formData.eventLevelCode"
                                @selectChangeCallBack="eventLevelChangeHandler"></component-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件场景"
                          prop="eventScene">
              <component-select type="eventScene"
                                model="center"
                                :disabled="isApprove"
                                :defaultSelected="formData.eventSceneCode"
                                @selectChangeCallBack="eventSceneChangeHandler"></component-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件类型"
                          prop="eventType">
              <component-select type="eventType"
                                model="center"
                                :disabled="isApprove"
                                :defaultSelected="formData.eventTypeCode"
                                @selectChangeCallBack="eventTypeChangeHandler"></component-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件类型">
              <el-button type="success" @click="visable=true">{{selectPlanBtnTxt}}</el-button>
              <div class="plan-name">{{planName}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="场景描述"
                          prop="eventSceneRemark">
              <tinymce-gallery id="eventSceneRemark"
                               :disabled="isApprove"
                               v-model="formData.eventSceneRemark"
                               type='PhotoGallery'
                               @keyup="tinymceSceneKeyUpHandler"></tinymce-gallery>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="事件描述"
                          prop="eventRemark">
              <tinymce-gallery id="eventRemark"
                               :disabled="isApprove"
                                v-model="formData.eventRemark"
                                type='PhotoGallery'
                                @keyup="tinymceEventKeyUpHandler"></tinymce-gallery>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row v-show="isApprove">
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="审批意见"
                          prop="remark">
              <el-input v-model="formData.remark"
                        v-show="isApprove"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入审批意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit" v-if="!isInfo">
          <el-col :span="18"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="close"> 关 闭
              </el-button>
                <el-button type="success"
                           icon="el-icon-tickets"
                           v-show="!isEdit && !isApprove"
                           @click="submitForm()"> 新 增
                </el-button>
                <el-button type="primary"
                           icon="el-icon-edit"
                           v-show="isEdit && !isApprove"
                           @click="submitForm()"> 更 新
                </el-button>
                <el-button type="success"
                           icon="el-icon-tickets"
                           v-show="isApprove"
                           @click="submitApprove('ok')"> 同 意
                </el-button>
                <el-button type="primary"
                           icon="el-icon-edit"
                           v-show="isApprove"
                           @click="submitApprove('ng')"> 拒 绝
                </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </component-form>
    <el-dialog title=""
               :visible.sync="visable"
               width="85%"
               ref="elDialog">
      <div class="transfer-panel">
        <plan :is-select-model="true"
              :select-plan-code="formData.planCode"
              @selection-change="selectionChange">
        </plan>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  import ComponentSelect from '@/components/ComponentSelect'
  import ComponentForm from '@/components/ComponentForm'
  import Plan from './plan'
  import { TinymceGallery } from 'ctsi-vue-dialog'
  import { params, isEmpty } from '@/utils'
  import { agree, reject } from '@/api/approve/approve'
  import { update, insert, getByCode, updateStatus } from '@/api/emergency/event'

  export default {
    name: 'eventEdit',
    components: {
      ComponentForm, TinymceGallery, ComponentSelect, Plan
    },
    data() {
      return {
        loading: false,
        // 是否编辑模式
        isEdit: false,
        // 是否审批模式
        isApprove: false,
        // 是否查看模式
        isInfo: false,
        // 弹窗
        visable: false,
        // 标题
        title: '',
        // 表单主键
        code: '',
        // 流程ID
        taskId: '',
        // 表单数据
        formData: {
          // 事件名称
          eventName: '',
          // 事件等级
          eventLevelCode: 'onelevel',
          // 事件类型
          eventTypeCode: 'operation',
          // 事件场景
          eventSceneCode: 'information',
          // 事件状态
          eventStatusCode: 'wait',
          // 事件说明
          eventRemark: '',
          // 场景描述
          eventSceneRemark: '',
          // 预案编号
          planCodeList: [],
          // 预案
          planList: [],
          // 审批意见
          remark: ''
        },
        selectPlanBtnTxt: '查看应急预案',
        // 表单规则
        formRules: {
          eventName: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
          eventLevelCode: [{ required: true, message: '请选择事件等级', trigger: 'change' }],
          eventTypeCode: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
          eventSceneCode: [{ required: true, message: '请选择事件场景', trigger: 'change' }]
        },
        // 临时选中的预案变量
        selection: [],
        // 页面显示用预案名
        planName: ''
      }
    },
    created() {
      this.code = params(this, 'eventCode')
      this.taskId = params(this, 'taskId')
      this.isApprove = params(this, 'isApprove') && true
      this.isInfo = params(this, 'isInfo') && true
      // 根据code判断：编辑/新增
      this.isEdit = this.code !== null
      this.selectPlanBtnTxt = this.isApprove ? '查看预案' : '选择预案'
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 渲染编辑数据
        if (this.isEdit) {
          getByCode(this.code).then(result => {
            this.formData = result.data
            const planNameArray = []
            if (this.formData.planList.length > 0) {
              this.formData.planCodeList = []
              for (let i = 0; i < this.formData.planList.length; i++) {
                this.formData.planCodeList.push(this.formData.planList[i].planCode)
                planNameArray.push(this.formData.planList[i].planName)
              }
              this.planName = planNameArray.join(',')
            }
          })
        }
      },
      close() {
        // 关闭
        const url = this.isApprove ? '/emergency/event-approve' : '/emergency/event'
        this.$router.push({
          path: url
        })
      },
      tinymceEventKeyUpHandler(event) {
        this.formData.eventRemark = event
      },
      tinymceSceneKeyUpHandler(scene) {
        this.formData.eventSceneRemark = scene
      },
      eventLevelChangeHandler(eventLevelCode) {
        this.formData.eventLevelCode = eventLevelCode
      },
      eventTypeChangeHandler(eventTypeCode) {
        this.formData.eventTypeCode = eventTypeCode
      },
      eventSceneChangeHandler(eventSceneCode) {
        this.formData.eventSceneCode = eventSceneCode
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          this.loading = true
          if (valid && this.isEdit) {
            // 更新
            update(this.formData).finally(() => { this.loading = false })
          } else if (valid && !this.isEdit) {
            // 新增
            // console.debug(this.formData)
            insert(this.formData).finally(() => { this.loading = false })
          }
        })
      },
      updateStatus() {
        const data = {}
        data.eventCode = this.code
        updateStatus(data)
        this.close()
      },
      submitApprove(type) {
        // 提交审批
        // console.debug(this.taskId)
        if (type === 'ok') {
          agree(this, this.taskId, this.updateStatus)
        } else {
          if (isEmpty(this.formData.remark)) {
            this.$alert('请输入审批意见')
          } else {
            reject(this, this.taskId, this.updateStatus)
          }
        }
      },
      submitDialog() {
        this.visable = false
        const planNameArray = []
        if (this.selection.length > 0 && !this.isApprove) {
          this.formData.planCodeList = []
          for (let i = 0; i < this.selection.length; i++) {
            this.formData.planCodeList.push(this.selection[i].planCode)
            planNameArray.push(this.selection[i].planName)
          }
          this.planName = planNameArray.join(',')
        }
      },
      selectionChange(selection) {
        this.selection = selection.selection
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .event-edit-container/deep/ {
    .el-select {
      width: 100%;
    }
    .el-table {
      text-align: center;
    }
    .plan-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
