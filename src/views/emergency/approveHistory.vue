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
                <svg-icon icon-class="edit"/>
                <span>{{$t('route.eventApprove')}}</span>
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
                  <el-row v-for="item in formData.list"
                          :key="item.value"
                          v-if="formData.list.length > 0">
                    <el-col :span="20"
                            :offset="1">
                      <el-form-item label="执行人:"
                                    prop="assignee"
                                    v-if="item.assignee != null && item.assignee != ''">
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
                  <el-row v-else>没有找到审批记录</el-row>
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
  import { params } from '@/utils'

  export default {
    name: 'approveHistory',
    data() {
      return {
        loading: false,
        // 表单数据
        formData: {},
        // 业务关联Key
        businessKey: ''
      }
    },
    created() {
      // 页面初始化
      this.businessKey = params(this, 'eventCode')
      this.init()
    },
    mounted() {
    },
    methods: {
      init() {
        this.refresh()
      },
      refresh() {
        this.loading = true
        // console.debug(this.tableData.sort)
        return request({
          url: '/process/selectProcessHistoryByBusinessKey/' + this.businessKey,
          method: 'get'
        }).then(result => {
          this.formData = result.data
          // debugger
        }).finally(() => {
          this.loading = false
        })
      },
      close() {
        this.$router.push({
          path: '/emergency/event'
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
