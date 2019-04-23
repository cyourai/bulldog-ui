<template>
  <div class="container">
    <ComponentForm :name="this.pageTitle">
      <el-form slot="form"
               :model="formData"
               ref="formData">
        <!-- 循环lebal -->
        <el-row v-for="(domain, index) in formData.list"
                :label="'域名' + index"
                :key="domain.key"
                :gutter="10">
          <el-col :span="3"
                  :offset="3">
            <el-form-item :prop="'list.' + index + '.settingKey'"
                          :rules="{required: true, message: '请输入主键', trigger: 'blur'}">
              <el-input placeholder="标签："
                        v-model="domain.settingKey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :prop="'list.' + index + '.settingValue'"
                          :rules="{required: true, message: '请输入内容', trigger: 'blur'}">
              <el-input placeholder="内容："
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 3}"
                        v-model="domain.settingValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :prop="'list.' + index + '.settingRemark'"
                          :rules="{required: true, message: '请输入备注', trigger: 'blur'}">
              <el-input placeholder="备注："
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 3}"
                        v-model="domain.settingRemark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click.prevent="removeDomain(domain)"
                         size="mini"
                         type="danger"
                         icon="el-icon-close"></el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作 -->
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="5">
            <el-form-item class="form-content-submit">
              <el-button type="primary"
                         @click="submitForm('formData')">提交</el-button>
              <el-button @click="addDomain">新增域名</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </ComponentForm>
  </div>
</template>

<script>
import ComponentForm from '@/components/ComponentForm'
import {
  getParamsAll
  // upDateParams
} from '@/api/settings/dictParams'

export default {
  name: 'form-add',
  components: {
    ComponentForm
  },
  data() {
    return {
      // title字段
      pageTitle: '平台参数',
      formData: {
        // list: [
        //   {
        //     settingKey: 'defaultImg0',
        //     settingValue:
        //       'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1529135934771default.jpg',
        //     settingRemark: '默认图片,当找不到图片时用此图片'
        //   },
        //   {
        //     settingKey: 'defaultImg1',
        //     settingValue:
        //       'http://yaqun-smart.oss-cn-beijing.aliyuncs.com/1529135934771default.jpg',
        //     settingRemark: '默认图片,当找不到图片时用此图片'
        //   }
        // ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 数据初始化
      getParamsAll().then(result => {
        this.formData = result.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeDomain(item) {
      var index = this.formData.list.indexOf(item)
      if (index !== -1) {
        this.formData.list.splice(index, 1)
      }
    },
    addDomain() {
      this.formData.list.push({
        settingKey: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
