<template>
  <div class="container">
    <ComponentForm :name="'检查结果'">
      <el-container slot="form"
                    class="filter-container filter">
        <el-form v-model="scriptResultFormData"
                 ref="scriptResultFormData">
          <!-- 服务器器名称 -->
          <el-form-item label="服务器："
                        prop="server"
                        class="filter-container-name"
                        label-position="left"
                        label-width="90px">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="检查结果："
                        prop="scriptResultCheckName"
                        class="filter-container-name"
                        label-position="left"
                        label-width="90px"
                        style="display:inline-block">
            <el-select @change="resultCheckChange"
                       v-model="scriptResultFormData.scriptResultCheckName"
                       filterable>
              <el-option v-for="item in resultOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 按钮 -->
          <div style="width:250px;display:inline-block;vertical-align:top">
            <el-button type="success"
                       style="display:inline-block;width:auto;padding:7px 15px;height:36px;margin-left:5px"
                       @click="resultCheckUpdate">保存检查条件</el-button>
            <el-button type="warning"
                       style="display:inline-block;width:auto;padding:7px 15px;height:36px;margin-left:5px"
                       @click="resultCheckInsert">新增检查条件</el-button>
          </div>

          <!-- 执行条件 -->
          <div class="filter-container-title">执行条件</div>
          <el-row>
            <el-radio v-model="checkType"
                      label="0">满足以下所有条件</el-radio>
            <el-radio v-model="checkType"
                      label="1">满足以下任一条件</el-radio>
            <el-radio v-model="checkType"
                      label="2">无条件限制</el-radio>
          </el-row>

          <!-- 接收结果 -->
          <div class="filter-container-title">接收结果</div>
          <el-row v-for="(add, index) in receiveResultFormData.list"
                  :key="add.key"
                  :gutter="10">
            <el-col :span="6">
              <el-form-item :prop="'list.' + index + '.receiveResult'">
                <el-select placeholder="接收结果"
                           v-model="receiveResultFormData.list[index].receiveResult">
                  <el-option label="接收结果"
                             value="receiveResult">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :prop="'list.' + index + '.include'">
                <el-select placeholder="包含"
                           v-model="receiveResultFormData.list[index].include">
                  <el-option label="包含"
                             value="include">
                  </el-option>
                  <el-option label="不包含"
                             value="exclude">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :prop="'list.' + index + '.content'">
                <el-input placeholder="内容："
                          v-model="receiveResultFormData.list[index].content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button type="success"
                           @click.prevent="addDomain"
                           icon="el-icon-plus"
                           size="mini"></el-button>
                <el-button type="danger"
                           @click.prevent="removeDomain(add)"
                           icon="el-icon-minus"
                           size="mini"></el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 执行结果 -->
          <div class="filter-container-title">执行结果</div>
          <el-row v-for="(add, index) in operateResultFormData.list"
                  :key="add.key"
                  :gutter="10">
            <el-col :span="6">
              <el-form-item :prop="'list.' + index + '.operateResult'">
                <el-select placeholder="执行结果"
                           v-model="operateResultFormData.list[index].operateResult">
                  <el-option label="执行结果"
                             value="operateResult">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :prop="'list.' + index + '.normal'">
                <el-select placeholder="正常"
                           v-model="operateResultFormData.list[index].normal">
                  <el-option label="正常"
                             value="normal">
                  </el-option>
                  <el-option label="异常"
                             value="abnormal">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10"
                  style="padding-top:20px;border-top:1px solid #d6d6db">
            <el-col :span="2"
                    :offset="22">
              <el-button type="primary"
                         style="width:auto;padding:7px 15px;height:40px">执行脚本</el-button>
            </el-col>
          </el-row>

        </el-form>
      </el-container>
    </ComponentForm>

  </div>
</template>

<script>
import ComponentForm from '@/components/ComponentForm'
import {
  getResultCheckAll,
  getByResultCheckCode,
  updateResultCheck,
  insertResultCheck
} from '@/api/script/script'
import { params } from '@/utils/params'

export default {
  name: 'resultCheck',
  components: { ComponentForm },
  data() {
    return {
      checkType: '0',
      // 检查结果code
      scriptResultCheckCode: '',
      // 结果检查下拉列表
      resultOptions: [],
      // resultCheckValue: '',
      scriptResultFormData: {},
      // 接收结果
      receiveResult: 'receiveResult',
      include: 'include',
      content: '',
      // 执行结果
      operateResult: 'operateResult',
      normal: 'normal',
      // 接受结果表
      receiveResultFormData: {
        list: [{}, {}]
      },
      // 执行结果表
      operateResultFormData: {
        list: [{}]
      }
    }
  },
  props: {},
  created() {
    // 接收参数 & 页面初始化
    this.scriptResultCheckCode = params(this, 'scriptResultCheckCode')
    this.init()
  },
  methods: {
    // 是否接受到name -> 页面为 “编辑模板” 或 “更新模板”
    isEdit() {
      return this.scriptResultCheckCode !== null
    },
    // 页面加载
    init() {
      this.getResultCheckAll()
      if (this.isEdit()) {
        this.loading = true
        this.getByResultCheckCode(this.scriptResultCheckCode)
      }
    },
    // 获取全部结果检查select
    getResultCheckAll() {
      getResultCheckAll().then(result => {
        this.resultOptions = result.data.options
      })
    },
    // 根据getByResultCheckCode查询对应详情
    getByResultCheckCode(value) {
      getByResultCheckCode(value)
        .then(result => {
          this.scriptResultFormData = result.data
          this.receiveResultFormData.list = JSON.parse(
            this.scriptResultFormData.scriptResultCheckCondition
          )
          this.operateResultFormData.list = JSON.parse(
            this.scriptResultFormData.scriptResultCheckReturn
          )
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 执行条件发生改变
    resultCheckChange(value) {
      const scriptResultCheckCode = value
      for (var i in this.resultOptions) {
        if (this.resultOptions[i].value.indexOf(value) === 0) {
          this.getByResultCheckCode(scriptResultCheckCode)
          return
        }
      }
    },
    // 更新结果检查
    resultCheckUpdate() {
      this.loading = true
      // 接收结果表
      var receiveResultFormData = []
      for (var i in this.receiveResultFormData.list) {
        receiveResultFormData.push({
          receiveResult: this.receiveResultFormData.list[i].receiveResult,
          include: this.receiveResultFormData.list[i].include,
          content: this.receiveResultFormData.list[i].content
        })
      }
      this.receiveResultFormData.list = receiveResultFormData
      // 执行结果表
      var operateResultFormData = []
      for (var j in this.operateResultFormData.list) {
        operateResultFormData.push({
          operateResult: this.operateResultFormData.list[j].operateResult,
          normal: this.operateResultFormData.list[j].normal
        })
      }
      this.operateResultFormData.list = operateResultFormData
      // 提交总表
      this.scriptResultFormData.scriptResultCheckCondition = JSON.stringify(
        this.receiveResultFormData.list
      )
      this.scriptResultFormData.scriptResultCheckReturn = JSON.stringify(
        this.operateResultFormData.list
      )
      updateResultCheck(this.scriptResultFormData).then(result => {
        this.getResultCheckAll()
        this.loading = false
      })
    },
    // 新增结果检查
    resultCheckInsert() {
      this.$prompt('请输入检查表达式名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(data => {
          if (data.value !== null) {
            // 接收结果表
            var receiveResultFormData = []
            for (var i in this.receiveResultFormData.list) {
              receiveResultFormData.push({
                receiveResult: this.receiveResultFormData.list[i].receiveResult,
                include: this.receiveResultFormData.list[i].include,
                content: this.receiveResultFormData.list[i].content
              })
            }
            this.receiveResultFormData.list = receiveResultFormData
            // 执行结果表
            var operateResultFormData = []
            for (var j in this.operateResultFormData.list) {
              operateResultFormData.push({
                operateResult: this.operateResultFormData.list[j].operateResult,
                normal: this.operateResultFormData.list[j].normal
              })
            }
            this.operateResultFormData.list = operateResultFormData
            // 提交总表
            this.scriptResultFormData = {
              scriptResultCheckName: data.value,
              scriptResultCheckCondition: JSON.stringify(
                this.receiveResultFormData.list
              ),
              scriptResultCheckReturn: JSON.stringify(
                this.operateResultFormData.list
              )
            }
            // this.scriptResultFormData.scriptResultCheckCondition = JSON.stringify(
            //   this.receiveResultFormData.list
            // )
            // this.scriptResultFormData.scriptResultCheckReturn = JSON.stringify(
            //   this.operateResultFormData.list
            // )
            insertResultCheck(this.scriptResultFormData).then(result => {
              this.getResultCheckAll()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 新增1项接收结果
    addDomain() {
      this.receiveResultFormData.list.push({})
    },
    // 删除1项接收结果
    removeDomain(item) {
      var index = this.receiveResultFormData.list.indexOf(item)
      if (index !== -1) {
        this.receiveResultFormData.list.splice(index, 1)
      }
    },
    // 新增1项执行结果
    addDomain2() {
      this.operateResultFormData.list.push({})
    },
    // 删除1项执行结果
    removeDomain2(item) {
      var index = this.operateResultFormData.list.indexOf(item)
      if (index !== -1) {
        this.operateResultFormData.list.splice(index, 1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
.container /deep/ {
  .form-content {
    margin-top: 10px;
  }
}
</style>
