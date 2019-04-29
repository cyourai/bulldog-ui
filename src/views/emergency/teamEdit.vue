<template>
  <div class="team-edit-container" v-loading="loading">
    <component-form :name="$t('route.teamCommunication')"
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
            <el-form-item label="群组编号"
                          prop="teamCode">
              <el-input v-model="formData.teamCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="群组名称"
                          prop="tname">
              <el-input v-model="formData.tname"
                        placeholder="请输入群名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="群主"
                          prop="owner">
              <el-input v-model="formData.owner"
                        :disabled=true></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="群公告"
                          prop="announcement">
              <el-input v-model="formData.announcement"
                        placeholder="请输入应急响应群公告"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="群描述"
                          prop="intro">
              <el-input v-model="formData.intro"
                        placeholder="请输入应急响应群描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="邀请文字"
                          prop="msg">
              <el-input v-model="formData.msg"
                        placeholder="请输入邀请的文字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label="群头像"
                          prop="icon">
                <el-input v-model="formData.icon"
                          placeholder="群头像"
                          ref="icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="select-pic-btn">
            <el-button type="primary" @click="visible=true" plain>图片库</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15"
                  :offset="5">
            <el-form-item label=""
                          prop="picIcon">
              <pic-magnify :picUrl="formData.icon"></pic-magnify>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
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
                         v-show="!isEdit"
                         class="largeBtn"
                         @click="submitForm()"> 新 增
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="isEdit"
                         class="largeBtn"
                         @click="submitForm()"> 更 新
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </component-form>
    <vue-dialog :visible="visible"
                :title='"图片库"'
                :type='"PhotoGallery"'
                :width='"80%"'
                @closeHandler="visible=false"
                @confirmHandler="confirmHandler"></vue-dialog>
  </div>

</template>
<script>
  import ComponentForm from '@/components/ComponentForm'
  import { VueDialog, PicMagnify } from 'cyourai-vue-dialog'
  import { params } from '@/utils'
  import { update, insert, getByCode } from '@/api/emergency/team'

  export default {
    name: 'teamEdit',
    components: {
      ComponentForm, VueDialog, PicMagnify
    },
    data() {
      return {
        visible: false,
        loading: false,
        // 是否编辑模式
        isEdit: false,
        // 表单数据
        formData: {
          // 群组编号
          teamCode: null,
          // 群组名称
          tname: 'XXXX应急响应群',
          // 群主
          owner: 'ctsidr',
          // 群公告
          announcement: '公告:XXXX应急响应群',
          // 群描述
          intro: '对应XXXX应急响应群',
          // 邀请发送的文字
          msg: 'XXXX应急响应邀请您加入群组',
          // 群头像
          icon: 'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1542702772709_logo.png'
        },
        selectPlanBtnTxt: '查看应急预案',
        // 表单规则
        formRules: {
          teamName: [{ required: true, message: '请输入群名称', trigger: 'blur' }]
        },
        // 临时选中的预案变量
        selection: [],
        // 页面显示用预案名
        planName: ''
      }
    },
    created() {
      this.formData.teamCode = params(this, 'teamCode')
      // 根据code判断：编辑/新增
      this.isEdit = this.formData.teamCode !== null
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 渲染编辑数据
        if (this.isEdit) {
          this.loading = true
          getByCode(this.formData.teamCode).then(result => {
            this.formData = result.data
          }).finally(() => {
            this.loading = false
          })
        }
      },
      close() {
        // 关闭
        this.$router.push({
          path: '/emergency/team'
        })
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          this.loading = true
          if (valid && this.isEdit) {
            // 更新
            update(this.formData).finally(() => {
              this.loading = false
            })
          } else if (valid && !this.isEdit) {
            // 新增
            // console.debug(this.formData)
            insert(this.formData).finally(() => {
              this.loading = false
            })
          }
        })
      },
      confirmHandler(params) {
        this.visible = false
        this.loading = true
        if (Array.isArray(params.galleryList) && params.galleryList.length > 0) {
          this.formData.icon = params.galleryList[0]
        }
        this.loading = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .team-edit-container /deep/ {
    .select-pic-btn {
      margin-left: 10px;
      margin-top: 3px;
    }
  }
</style>
