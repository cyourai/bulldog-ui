<template>
  <div :published-code="publishedCode"
       :media-seller-type="mediaSellerType"
       class="first-contain"
       v-if="!loading"
       v-loading="loading">
    <el-form :model="firstFormData"
             :rules="firstOptionsRules"
             ref="firstFormData"
             label-width="120px"
             label-position="right">
      <div class="form-filter-header">
        <div v-if="this.isEdit()">
          <svg-icon icon-class="edit"/>
          <span>编辑刊例</span>
        </div>
        <div v-else>
          <svg-icon icon-class="add"/>
          <span>新增刊例</span>
        </div>
      </div>
      <div class="">
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="刊例名称"
                          prop="publishedName">
              <el-input v-model="firstFormData.publishedName"
                        placeholder="刊例名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="刊例的媒体主"
                          prop="publishedSellerCode">
              {{$t('route.' + mediaSellerType)}} 类媒体主
              <el-select v-model="firstFormData.publishedSellerCode"
                         size="medium"
                         filterable
                         remote
                         reserve-keyword
                         no-data-text="..."
                         placeholder="请输入媒体主名称/简称并选择"
                         :remote-method="getMediaSellerSelect"
                         :loading="loading">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button
                v-if="firstFormData.publishedSellerCode !== ''"
                @click="clickEditMediaSellerHandler(firstFormData.publishedSellerCode)">编辑媒体主
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10"
                  :offset="5">
            <el-form-item label="执行时间"
                          prop="publishedDateRange">
              <el-date-picker v-model="firstFormData.publishedDateRange"
                              size="small"
                              type="daterange"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="价格单位"
                          prop="publishedPriceUnit">
              <el-input v-model="firstFormData.publishedPriceUnit"
                        placeholder="价格单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="是否上架"
                          prop="publishedStatus">
              <el-switch v-model="firstFormData.publishedStatus"
                         :active-value=1
                         :inactive-value=0>
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="展示图片1"
                          prop="publishedImg1">
              <el-input v-model="firstFormData.publishedImg1"
                        placeholder="展示图片1"
                        ref="publishedImg1"
                        @focus="activePicDialogHandler('publishedImg1')"></el-input>
              <pic-magnify :picUrl="firstFormData.publishedImg1"></pic-magnify>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="展示图片2"
                          prop="publishedImg2">
              <el-input v-model="firstFormData.publishedImg2"
                        placeholder="展示图片2"
                        ref="publishedImg2"
                        @focus="activePicDialogHandler('publishedImg2')"></el-input>
              <pic-magnify :picUrl="firstFormData.publishedImg2"></pic-magnify>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="展示图片3"
                          prop="publishedImg3">
              <el-input v-model="firstFormData.publishedImg3"
                        placeholder="展示图片3"
                        ref="publishedImg3"
                        @focus="activePicDialogHandler('publishedImg3')"></el-input>
              <pic-magnify :picUrl="firstFormData.publishedImg3"></pic-magnify>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <el-form-item label="备注"
                          prop="publishedRemark">
              <el-input v-model="firstFormData.publishedRemark"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 6}"
                        placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"
                  :offset="5">
            <div class="mce">
              <el-form-item label="刊例详情"
                            prop="publishedInfo">
                <tinymce-gallery v-model="firstFormData.publishedInfo" :type='"PhotoGallery"'
                                 @keyup="publihedInfoKeyupHandler"></tinymce-gallery>
                <p class="tip">在商城刊例详情处显示</p>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="20"
                  :offset="1"
                  class="text-center">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-close"
                         @click="close()"> 关 闭
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="!this.isEdit()"
                         class="largeBtn"
                         @click="submitForm()"> 保存, 下一步
              </el-button>
              <el-button type="primary"
                         icon="el-icon-edit"
                         v-show="this.isEdit()"
                         class="largeBtn"
                         @click="submitForm()"> 更新, 下一步
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <vue-dialog :visible="visible"
                  :title='"图片库"'
                  :type='"PhotoGallery"'
                  :width='"80%"'
                  @closeHandler="visible=false"
                  @confirmHandler="confirmHandler"></vue-dialog>
    </el-form>
  </div>
</template>
<script>
  import { TinymceGallery, VueDialog, PicMagnify } from 'ctsi-vue-dialog'
  import { debug } from '@/utils'
  import Bus from '@/utils/bus'
  import {
    initFirstEditForm,
    getByCode,
    update,
    insert,
    getMediaSellerSelect
  } from '@/api/published/published'

  export default {
    name: 'first',
    props: {
      publishedCode: {
        String,
        default: ''
      },
      mediaSellerType: {
        String,
        default: 'radio'
      }
    },
    components: {
      TinymceGallery,
      VueDialog,
      PicMagnify
    },
    data() {
      return {
        // title字段
        pageTitle: '刊例规格',
        // 表单数据
        firstFormData: {
          publishedSellerCode: '',
          publishedName: '',
          publishedPriceUnit: '元',
          publishedItem: [{}],
          publishedTimePoint: {},
          publishedDateRange: ['2018-01-01', '2018-12-31'],
          publishedStatus: 0,
          publishedTypeCode: 'common',
          publishedTitle: ['段位', '时长'],
          publishedImg1: '',
          publishedImg2: '',
          publishedImg3: '',
          publishedInfo: ''
        },
        options: [],
        // 表单规则
        firstOptionsRules: {
          publishedName: [
            { required: true, message: '请输入刊例名称', trigger: 'blur' }
          ]
        },
        loading: false,
        itemDialogVisible: false,
        // 富文本表单
        postForm: {},
        // 图片库
        visible: false,
        // 图片库对应的form字段
        activeField: ''
      }
    },
    created() {
      // 页面初始化
      this.init()
    },
    mounted() {
    },
    methods: {
      init() {
        // 渲染编辑数据
        // debug('first/init:', this.publishedCode)
        if (this.isEdit()) {
          this.loading = true
          getByCode(this.publishedCode).then(result => {
            debug('first/init/getByCode', result.data)
            initFirstEditForm(result, this.firstFormData, this)
          }).finally(() => {
            this.loading = false
          })
        }
      },
      isEdit() {
        return this.publishedCode != null
      },
      close() {
        // 关闭
        this.$router.push({
          path: `/published/${this.mediaSellerType}`,
          name: `published` + this.mediaSellerType.slice(0, 1).toUpperCase() + this.mediaSellerType.slice(1),
          meta: {
            mediaSellerType: this.mediaSellerType
          }
        })
      },
      getMediaSellerSelect(keyWord) {
        // 远程搜索媒体主
        getMediaSellerSelect(keyWord, this.mediaSellerType).then(result => {
          this.options = result.data.options
        })
      },
      submitForm() {
        this.$refs['firstFormData'].validate(valid => {
          if (valid) {
            if (this.isEdit()) {
              // 更新
              update(this.firstFormData).then(result => {
                if (result.data.status.toString().indexOf('200') === 0) {
                  Bus.$emit('receiveTabName', {
                    tabName: 'second',
                    publishedCode: result.data.publishedCode
                  })
                }
              })
            } else {
              insert(this.firstFormData).then(result => {
                // 第一页新增,成功跳转第二Tab
                if (result.data.status.toString().indexOf('200') === 0) {
                  // jumpUrl(this.$route.path, result.data.publishedCode, 'second')
                  debug('first/submit:' + result.data)
                  Bus.$emit('receiveTabName', {
                    tabName: 'second',
                    publishedCode: result.data.publishedCode
                  })
                }
              })
            }
          } else {
            return false
          }
        })
      },
      confirmHandler(params) {
        // 图片库确认按钮回调
        this.visible = false
        if (Array.isArray(params.galleryList) && params.galleryList.length > 0) {
          this.firstFormData[this.activeField] = params.galleryList[0]
          // console.debug('confirmHandler: %s' + firstFormData.mediaSellerLogo)
        }
      },
      activePicDialogHandler(formField) {
        this.visible = true
        this.activeField = formField
        // console.debug('activePicDialogHandler: %s' + formField)
      },
      publihedInfoKeyupHandler(value) {
        this.firstFormData.publishedInfo = value
      },
      clickEditMediaSellerHandler(mediaSellerCode) {
        this.$router.push({
          path: '/settings/mediaSeller-edit',
          name: 'mediaSeller-edit',
          params: {
            mediaSellerCode: mediaSellerCode
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
  .first-contain /deep/ {
    .el-select {
      width: 100% !important;
    }

    .el-range-editor {
      width: 125% !important;
    }

    .mce {
      width: 140% !important;
    }

    .button-new-tag{
      padding-top: 0px;
    }
  }
</style>

