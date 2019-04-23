<template>
  <div class="container" v-loading="loading" v-if="!loading">
    <ComponentForm :name="this.pageTitle"
                   :isEdit="this.isEdit()">
      <el-form slot="form"
               :model="formData"
               :rules="formRules"
               ref="formData"
               label-width="100px"
               label-position="right">
        <el-row v-if="false">
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="主键"
                          prop="mediaSellerCode">
              <el-input v-model="formData.mediaSellerCode"
                        placeholder="主键"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="媒体主名称"
                          prop="mediaSellerName">
              <el-input v-model="formData.mediaSellerName"
                        placeholder="媒体主名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="简称"
                          prop="mediaSellerShortName">
              <el-input v-model="formData.mediaSellerShortName"
                        placeholder="简称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="类别"
                          prop="mediaSellerTypeCode">
              <component-cascader v-if="(formData.mediaSellerTypeCode !== undefined && this.isEdit()) || !this.isEdit()"
                                  :defaultSelected="formData.mediaSellerTypeCode"
                                  :keyWord="type"
                                  module="media"
                                  type="mediatype"
                                  @cascaderChangeCallBack="cascaderTypeChangeCallBack">
              </component-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="投放区域"
                          prop="mediaSellerArea">
              <component-cascader type="area"
                                  v-if="(formData.mediaSellerArea !== undefined && this.isEdit()) || !this.isEdit()"
                                  :defaultSelected="formData.mediaSellerArea"
                                  module="media"
                                  @cascaderChangeCallBack="cascaderAreaChangeCallBack">
              </component-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="级别"
                          prop="mediaSellerLevel">
              <el-input v-model="formData.mediaSellerLevel"
                        placeholder="级别"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="媒体状态"
                          prop="mediaSellerStatus">
              <el-switch v-model="formData.mediaSellerStatus"
                         :active-value=1
                         :inactive-value=0>
              </el-switch>
              <p class="tip">是否跟平台还继续合作,不合作的平台刊例不在商城页面显示</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="Logo"
                          prop="mediaSellerLogo">
              <el-input v-model="formData.mediaSellerLogo"
                        ref="mediaSellerLogo"
                        placeholder="Logo"
                        @focus="activePicDialogHandler('mediaSellerLogo')"></el-input>
              <img :src="this.formData.mediaSellerLogo"
                   onerror="this.style.display='none'"
                   v-show='formData.mediaSellerLogo!==""'
                   width="200px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="刊例图片"
                          prop="mediaSellerPublished">
              <el-input v-model="formData.mediaSellerPublished"
                        placeholder="刊例图片"
                        @focus="activePicDialogHandler('mediaSellerPublished')"></el-input>
              <p class="tip">对于不便于电子化上架的刊例,此处可直接上传刊例图片</p>
              <img :src="this.formData.mediaSellerPublished"
                   onerror="this.style.display='none'"
                   v-show='formData.mediaSellerPublished!==""'
                   width="200px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="展示图片一"
                          prop="mediaSellerImg1">
              <el-input v-model="formData.mediaSellerImg1"
                        placeholder="展示图片一"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="展示图片二"
                          prop="mediaSellerImg2">
              <el-input v-model="formData.mediaSellerImg2"
                        placeholder="展示图片二"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="展示图片三"
                          prop="mediaSellerImg3">
              <el-input v-model="formData.mediaSellerImg3"
                        placeholder="展示图片三"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="地区权重"
                          prop="mediaSellerAreaWeight">
              <el-input-number v-model="formData.mediaSellerAreaWeight"
                               :step="10"
                               controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="平台权重"
                          prop="mediaSellerPlatformWeight">
              <el-input-number v-model="formData.mediaSellerPlatformWeight"
                               :step="10"
                               controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="附加属性"
                          prop="mediaSellerTags">
              <el-tag
                :key="tag"
                v-for="tag in mediaSellerTagList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input v-model="inputTagValue" class="input-new-tag"
                        v-if="isTagsVisible" prop="mediaSellerTags"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        placeholder="附加属性"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新属性</el-button>
              <p class="tip">输入后回车或点击空白处添加新属性</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <el-form-item label="备注"
                          prop="mediaSellerRemark">
              <el-input v-model="formData.mediaSellerRemark"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 6}"
                        placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"
                  :offset="5">
            <div class="mce">
              <el-form-item label="媒体介绍"
                            prop="mediaSellerInfo">
                <tinymce-gallery
                  v-model="formData.mediaSellerInfo"
                  :type='"PhotoGallery"'
                  @keyup="mediaSellerInfoKeyupHandler"></tinymce-gallery>
                <p class="tip">在商城媒体详情处显示</p>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11"
                  :offset="5"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         class="bigBtn"
                         @click="close"> 关 闭
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!isEdit()"
                         class="largeBtn"
                         @click="submitForm()"> 新 增
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="isEdit()"
                         class="largeBtn"
                         @click="submitForm()"> 更 新
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </ComponentForm>
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
  import ComponentCascader from '@/components/ComponentCascader'
  import { TinymceGallery, VueDialog } from 'ctsi-vue-dialog'
  import { getByCode, update, insert } from '@/api/mediaSeller/mediaSeller'
  import { params, isNotEmpty } from '@/utils'

  export default {
    name: 'mediaSellerForm',
    data() {
      return {
        // title字段
        pageTitle: '数据',
        // 表单数据
        formData: {
          mediaSellerAreaWeight: 10,
          mediaSellerPlatformWeight: 10,
          mediaSellerInfo: '',
          mediaSellerStatus: 1,
          mediaSellerLogo: '',
          mediaSellerTags: ''
        },
        mediaSellerTagList: [],
        loading: false,
        isTagsVisible: false, // 附加属性输入文本框默认不显示
        inputTagValue: '',
        // 表单规则
        formRules: {
          mediaSellerId: [
            { required: true, message: '请输入序号', trigger: 'blur' }
          ],
          mediaSellerCode: [
            { required: true, message: '请输入主键', trigger: 'blur' }
          ],
          mediaSellerName: [
            { required: true, message: '请输入媒体主名称', trigger: 'blur' }
          ],
          mediaSellerShortName: [
            { required: true, message: '请输入简称', trigger: 'blur' }
          ],
          mediaSellerTypeCode: [
            { required: true, message: '请输入类别', trigger: 'blur' }
          ]
        },
        // 表单主键
        code: '',
        // 业务类型
        type: '',
        // 富文本表单
        postForm: {},
        // 图片库
        visible: false,
        // 图片库对应的form字段
        activeField: ''
      }
    },
    components: {
      ComponentForm,
      ComponentCascader,
      TinymceGallery,
      VueDialog
    },
    created() {
      this.code = params(this, 'mediaSellerCode')
      this.type = params(this, 'mediaSellerTypeCode')
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 渲染编辑数据
        if (this.isEdit()) {
          this.loading = true
          getByCode(this.code).then(result => {
            this.formData = result.data
            if (this.formData.mediaSellerTags && isNotEmpty(this.formData.mediaSellerTags)) {
              this.mediaSellerTagList = result.data.mediaSellerTags.split(',')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      },
      isEdit() {
        return this.code !== null
      },
      close() {
        // 关闭
        this.$router.push({
          path: `/mediaSeller/${this.type}`,
          name: `mediaSeller` + this.type.slice(0, 1).toUpperCase() + this.type.slice(1),
          meta: {
            mediaSellerType: this.type
          }
        })
      },
      cascaderTypeChangeCallBack(value) {
        this.formData.mediaSellerTypeCode = value.join(',')
      },
      cascaderAreaChangeCallBack(value) {
        this.formData.mediaSellerArea = value.join(',')
      },
      mediaSellerInfoKeyupHandler(value) {
        this.formData.mediaSellerInfo = value
      },
      submitForm() {
        this.$refs['formData'].validate(valid => {
          if (this.mediaSellerTagList != null) {
            this.formData.mediaSellerTags = this.mediaSellerTagList.join(',')
          }
          if (valid && this.isEdit()) {
            // 更新
            update(this.formData)
          } else if (valid && !this.isEdit()) {
            // 新增
            insert(this.formData)
          } else {
            return false
          }
        })
      },
      confirmHandler(params) {
        // 图片库确认按钮回调
        this.visible = false
        if (Array.isArray(params.galleryList) && params.galleryList.length > 0) {
          this.formData[this.activeField] = params.galleryList[0]
          // console.debug('confirmHandler: %s' + this.formData.mediaSellerLogo)
        }
      },
      activePicDialogHandler(formField) {
        this.visible = true
        this.activeField = formField
        // console.debug('activePicDialogHandler: %s' + formField)
      },
      handleClose(tag) {
        this.mediaSellerTagList.splice(this.mediaSellerTagList.indexOf(tag), 1)
      },
      showInput() {
        this.isTagsVisible = true
      },
      handleInputConfirm() {
        const inputTagValue = this.inputTagValue
        if (inputTagValue) {
          this.mediaSellerTagList.push(inputTagValue)
        }
        this.isTagsVisible = false
        this.inputTagValue = ''
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';

  .mce {
    width: 150% !important;
  }

  .el-cascader {
    width: 100% !important;
  }

  .button-new-tag {
    padding-top: 0px;
  }

  .el-tag {
    margin-right: 15px;
  }

</style>
