<template>
  <div class="container"
       v-loading="loading">
    <!-- 页内容 -->
    <div class="content">
      <!-- 用户编辑 -->
      <div class="content-spe">
        <p class="content-spe-title"></p>
        <div class="content-spe-element">
          <!-- 表单 -->
          <div class="form-filter">

            <!-- 表单-header-->
            <div class="form-filter-header">
              <div>
                <svg-icon icon-class="edit" />
                <span>注册审核记录</span>
              </div>
            </div>

            <!-- 表单-form -->
            <div class="form-content">
              <div class="container"
                   v-if="!loading">
                <el-form slot="form"
                         :model="formData"
                         ref="formData"
                         label-width="200px"
                         label-position="center">
                  <el-row v-for="item in this.formData.list"
                          :key="item.value">
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="执行人:"
                                    prop="assignee">
                        {{item.assignee}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="执行环节:"
                                    prop="name">
                        {{item.name}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="执行环节标识:"
                                    prop="taskDefinitionKey">
                        {{item.taskDefKey}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="开始时间:"
                                    prop="startTime">
                        {{item.startTime}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="结束时间:"
                                    prop="endTime">
                        <span v-if="item.endTime">{{item.endTime}}</span>
                        <span v-else>待审批</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20"
                            :offset="1">
                      ========================================================================
                    </el-col>
                  </el-row>
                  <el-row class="form-content-submit">
                    <el-col :span="2"
                            :offset="1"
                            class="form-submit">
                      <el-form-item>
                        <el-button type="warning"
                                   icon="el-icon-tickets"
                                   @click="close()"> 关 闭
                        </el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10"
                            :offset="2"
                            class="form-submit">
                      <el-form-item>
                        <el-button type="success"
                                   icon="el-icon-edit"
                                   class="largeBtn"
                                   @click="refresh()"> 刷新
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/utils/request'
import { params, debug, error } from '@/utils'

export default {
  name: 'approveRegisterHistoryInfo',
  data() {
    return {
      loading: false,
      // title字段
      pageTitle: '用户注册审批',
      // 表单数据
      formData: {},
      // 任务id
      processInstanceId: ''
    }
  },
  created() {
    // 页面初始化
    this.processInstanceId = params(this, 'processInstanceId')
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      this.refresh()
    },
    refresh() {
      this.loading = true
      // console.debug(this.tableData.sort)
      return request({
        url: '/process/processHistoryInfo/' + this.processInstanceId,
        method: 'get'
      })
        .then(result => {
          this.formData = result.data
          debug(this.formData)
        })
        .catch(e => {
          error(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    close() {
      this.$router.push({
        path: '/approve/history/approveRegisterHistory'
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
