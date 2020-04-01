<template>
  <div class="container">
    <ComponentForm :name="this.pageTitle"
                   :isEdit="this.isEdit()">
      <el-form slot="form"
               :model="formData"
               ref="formData"
               v-loading="loading">
        <!-- 循环lebal -->
        <el-row v-for="(add, index) in formData.list"
                :key="add.key"
                :gutter="10">
          <el-col :span="3"
                  :offset="4">
            <el-form-item :prop="'list.' + index + '.settingKey'"
                          :rules="[{ required: true, message: '请输入编号', trigger: 'blur' }]">
              <el-input placeholder="标签："
                        type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        v-model="add.settingKey"
                        @blur="saveSetting(index)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="'list.' + index + '.settingValue'"
                          :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
              <el-input type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        placeholder="内容："
                        v-model="add.settingValue"
                        @blur="saveSetting(index)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="'list.' + index + '.settingGroup'"
                          :rules="[{ required: true, message: '请输入分组', trigger: 'blur' }]">
              <el-input type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        placeholder="内容："
                        v-model="add.settingGroup"
                        @blur="saveSetting(index)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="'list.' + index + '.settingRemark'">
              <el-input type="textarea"
                        :autosize="{  minRows: 2, maxRows: 2 }"
                        placeholder="备注："
                        v-model="add.settingRemark"
                        @blur="saveSetting(index)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click="deleteRow(index)"
                         type="danger"
                         icon="el-icon-close">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 操作 -->
        <el-row class="form-content-submit">
          <el-col :span="11"
                  :offset="4">
            <el-form-item>
              <el-button type="success"
                         @click="addRow"
                         icon="el-icon-tickets">新增一行</el-button>
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
  update,
  insert,
  selectSettingByGroup,
  deleteByCode
} from '@/api/settings/settings'
import { isEmpty, isNotEmpty } from '@/utils'

export default {
  name: 'setting',
  components: {
    ComponentForm
  },
  data() {
    return {
      loading: false,
      // title字段
      pageTitle: '首页参数',
      // 表单数据
      formData: {
        list: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    isEdit() {
      return typeof this.code !== 'undefined'
    },
    init() {
      selectSettingByGroup('').then(result => {
        this.formData.list = result.data.settingList
      })
    },
    addRow() {
      // 新增1项
      this.formData.list.push({
        settingKey: '',
        settingValue: '',
        settingGroup: ''
      })
    },
    saveSetting(index) {
      const param = this.formData.list[index]
      this.loading = true
      if (
        isNotEmpty(param.settingKey) &&
        isNotEmpty(param.settingValue) &&
        isNotEmpty(param.settingGroup)
      ) {
        if (isEmpty(param.settingCode)) {
          insert(param)
            .then(result => {
              this.loading = false
              if (
                result.data.hasOwnProperty('settingCode') &&
                isNotEmpty(result.data.settingCode)
              ) {
                this.formData.list[index].settingCode = result.data.settingCode
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          update(param).finally(() => {
            this.loading = false
          })
        }
      } else {
        this.loading = false
      }
    },
    deleteRow(index) {
      const param = this.formData.list[index]
      if (isNotEmpty(param.settingCode)) {
        deleteByCode(param.settingCode, this)
      } else {
        this.formData.list.splice(index, 1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
