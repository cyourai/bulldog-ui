<template>
  <div :published-code="publishedCode"
       :media-seller-type="mediaSellerType"
       v-if="!loading">
    <el-form :model="secondFormData"
             :rules="secondOptionsRules"
             ref="secondFormData"
             label-width="200px"
             label-position="right"
             v-loading="loading">
      <div class="form-filter-header">
        <svg-icon icon-class="edit" />
        <span>编辑刊例规格</span>
      </div>
      <el-row>
        <el-col :span="20"
                :offset="3">
          <el-form-item label="刊例类型"
                        prop="publishedTypeCode">
            <el-radio-group v-model="secondFormData.publishedTypeCode">
              <el-radio label="common" v-if="mediaSellerType === 'radio'">常规刊例</el-radio>
              <el-radio label="special">特殊/套播刊例</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="secondFormData.publishedTypeCode == 'common' && !loading">
        <el-row>
          <el-col :span="20"
                  :offset="3">
            <el-form-item label="刊例规格名称(表头)"
                          prop="publishedTitle">
              <el-input v-model="secondFormData.publishedTitle"
                        placeholder="插出类别/播出形式/播出点/播出次数"></el-input>
              <p class="tip">名称内容有多个时，用半角"/"或","或" "分隔 如: 段位/播出时长 或 插出类别/播出形式/播出点/播出次数</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="3">
            <el-form-item label="添加规格，价格"
                          prop="publishedItems">
              <el-button @click="this.addItemClickHandler"
                         class="largBtn">新增规格项
              </el-button>
              <el-button @click="this.previewClickHandler"
                         type="warning"
                         class="largBtn">重新生成预览
              </el-button>
              <p class="tip">规格内容多个时，用“换行”不要用半角"/"或","或" "分隔 且 规格内容的数量应该和表头一致，没有内容也要换行</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="5">
            <el-row>
              <el-col :span="10"
                      :pull="1">
                刊例规格
              </el-col>
              <el-col :span="10"
                      :pull="5">
                播出时间
              </el-col>
              <el-col :span="1"
                      :pull="8">
                价格
              </el-col>
              <el-col :span="3"
                      :pull="6">
                说明
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"
                  :pull="2">
            <el-form-item v-for="(item, index) in this.secondFormData.publishedItems"
                          :label="'No.' + (index + 1)"
                          :key="item.index"
                          :prop="'publishedItems.' + index + '.label'">
              <el-row>
                <el-col :span="8">
                  <el-form-item :key="item.index"
                                :prop="'publishedItems.' + index + '.option'"
                                :rules="{required: true, message: '规格不能为空', trigger: 'blur'}">
                    <el-input v-model="item.option"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="规格">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :key="item.index"
                                :prop="'publishedItems.' + index + '.timePoint'"
                                :rules="{required: true, message: '播出时间不能为空', trigger: 'blur'}">
                    <el-input v-model="item.timePoint"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="播出时间">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item :key="item.index"
                                :prop="'publishedItems.' + index + '.price'"
                                :rules="{required: true, message: '价格不能为空', trigger: 'blur'}">
                    <el-input v-model="item.price"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="价格">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="item.remark"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6}"
                            placeholder="说明">
                  </el-input>
                </el-col>
                <el-col :span="2"
                        :push="1">
                  <el-button @click.prevent="removeItemClickHandler(item)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row v-if="this.isPreview">
          <el-col :span="20">
            <sku :titles="this.skuGetTitle()"
                 :options="this.secondFormData.publishedOptions"
                 :keys="this.secondFormData.publishedKeys"
                 :paths="this.secondFormData.publishedPaths"
                 :timeSlot="this.secondFormData.publishedTimeSlot"
                 :timePoints="this.secondFormData.publishedTimePoint"
                 :isCommon="true"
                 :checkList=[]>
            </sku>
          </el-col>
        </el-row>
        <el-row class="form-content-submit">
          <el-col :span="20"
                  :offset="3"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-back"
                         class=""
                         @click="this.beforeTabClickHandler"> 上一步
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         class="largeBtn"
                         @click="this.submitSecondForm"> 保存
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="secondFormData.publishedTypeCode == 'special' && !loading">
        <el-row>
          <el-col :span="20"
                  :offset="3">
            <el-form-item label="刊例规格名称(表头)"
                          prop="publishedTitle">
              <el-input v-model="secondFormData.publishedTitle"
                        placeholder="插出类别/播出形式/播出点/播出次数"></el-input>
              <p class="tip">名称内容有多个时，用半角"/"或","或" "分隔 如: 插出类别,播出形式,播出点,播出次数 或 插出类别/播出形式/播出点/播出次数</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="3">
            <el-form-item label="添加规格，价格"
                          prop="publishedItems">
              <el-button @click="this.addItemClickHandler"
                         class="largBtn">新增规格项
              </el-button>
              <el-button @click="this.previewClickHandler"
                         type="warning"
                         class="largBtn">重新生成预览
              </el-button>
            </el-form-item>
            <p class="tip">规格内容多个时，用“换行”不要用半角"/"或","或" "分隔 且 规格内容的数量应该和表头一致，没有内容也要换行</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="5">
            <el-row>
              <el-col :span="12"
                      :push="5">
                刊例规格
              </el-col>
              <el-col :span="4"
                      :pull="1">
                价格
              </el-col>
              <el-col :span="5"
                      :pull="1">
                说明
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="3">
            <el-form-item v-for="(item, index) in this.secondFormData.publishedItems"
                          :label="'No.' + (index + 1)"
                          :key="item.index"
                          :prop="'publishedItems.' + index + '.label'">
              <el-row>
                <el-col :span="10">
                  <el-form-item :key="item.index"
                                :prop="'publishedItems.' + index + '.option'"
                                :rules="{required: true, message: '规格不能为空', trigger: 'blur'}">
                    <el-input v-model="item.option"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="规格">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :key="item.index"
                                :prop="'publishedItems.' + index + '.price'"
                                :rules="{required: true, message: '价格不能为空', trigger: 'blur'}">
                    <el-input v-model="item.price"
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 6}"
                              placeholder="价格">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="item.remark"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6}"
                            placeholder="说明">
                  </el-input>
                </el-col>
                <el-col :span="5"
                        :push="2">
                  <el-button @click.prevent="removeItemClickHandler(item)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row v-if="this.isPreview">
          <el-col :span="20">
            <sku :titles="this.skuGetTitle()"
                 :options="this.secondFormData.publishedOptions"
                 :keys="this.secondFormData.publishedKeys"
                 :paths="this.secondFormData.publishedPaths"
                 :timeSlot=[]
                 :timePoints=[]>
            </sku>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"
                  :offset="3"
                  class="form-submit">
            <el-form-item>
              <el-button type="warning"
                         icon="el-icon-back"
                         class=""
                         @click="this.beforeTabClickHandler"> 上一步
              </el-button>
              <el-button type="success"
                         icon="el-icon-tickets"
                         v-show="this.isEdit()"
                         class="largeBtn"
                         @click="this.submitSecondForm"> 保存
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import sku from 'cyourai-vue-sku'
import Bus from '@/utils/bus'
import { params, debug } from '@/utils'
import {
  getByCode,
  replaceSing,
  preview,
  initSecondEditForm,
  updateSecondForm
} from '@/api/published/published'

export default {
  name: 'second',
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
  data() {
    return {
      // title字段
      pageTitle: '刊例规格',
      // 表单数据
      secondFormData: {
        publishedCode: this.publishedCode,
        // 刊例类型
        publishedTypeCode: 'special',
        // 刊例规格名称
        publishedTitle: '',
        // 刊例规格
        publishedItems: [],
        publishedOptions: [],
        publishedTimeSlot: [],
        publishedTimePoint: {},
        publishedKeys: {},
        publishedPaths: {}
      },
      // 表单规则
      secondOptionsRules: {
        publishedTitle: [
          { required: true, message: '请输入规格名称', trigger: 'blur' }
        ],
        publishedItem: [
          { required: true, message: '请输入规格名称', trigger: 'blur' }
        ]
      },
      // 是否显示预览
      isPreview: false,
      loading: false,
      // 表单主键
      code: '',
      // 富文本表单
      postForm: {}
    }
  },
  components: { sku },
  created() {
    this.publishedCode = params(this, 'publishedCode')
    // 页面初始化
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      debug('second/init:', this.publishedCode)
      // 渲染编辑数据
      if (this.isEdit()) {
        this.loading = true
        getByCode(this.publishedCode)
          .then(result => {
            debug('second/init/getByCode:', result.data)
            initSecondEditForm(result, this.secondFormData)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    isEdit() {
      return this.publishedCode != null
    },
    beforeTabClickHandler() {
      // 上一步
      Bus.$emit('receiveTabName', {
        tabName: 'first',
        publishedCode: this.publishedCode
      })
    },
    submitSecondForm() {
      this.$refs['secondFormData'].validate(valid => {
        if (valid) {
          if (this.isEdit()) {
            this.secondFormData.publishedCode = this.publishedCode
            updateSecondForm(this.secondFormData).then(result => {
              if (result.data.status.toString().indexOf('200') === 0) {
                this.isPreview = true
              }
            })
          }
        } else {
          return false
        }
      })
    },
    skuGetTitle() {
      // 预览Title
      return replaceSing(this.secondFormData.publishedTitle).split(',')
    },
    addItemClickHandler() {
      // 添加规格项目
      if (this.secondFormData.publishedTypeCode === 'common') {
        this.secondFormData.publishedItems.push({
          index: this.secondFormData.publishedItems.length + 1,
          option: '',
          remark: '',
          price: '',
          timePoint: ''
        })
      } else if (this.secondFormData.publishedTypeCode === 'special') {
        this.secondFormData.publishedItems.push({
          index: this.secondFormData.publishedItems.length + 1,
          option: '',
          remark: '',
          price: ''
        })
      }
    },
    previewClickHandler() {
      // 预览
      preview(this.secondFormData).then(result => {
        debug('previewClickHandler:', result.data)
        initSecondEditForm(result, this.secondFormData)
        this.isPreview = true
      })
    },
    removeItemClickHandler(item) {
      // 删除规格项目
      // console.debug(this.secondFormData.publishedItems)
      const index = this.secondFormData.publishedItems.indexOf(item)
      if (index !== -1) {
        this.secondFormData.publishedItems.splice(index, 1)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';

.sku {
  width: 900px !important;
}
</style>

