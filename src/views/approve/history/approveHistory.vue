<template>
  <!--
   通用审批历史记录组件:
   调用方式:
      this.$router.push({
        path: '/approve/history/approveHistory',
        name: 'approveHistory',
        params: {
          businessKey: businessKey,
          closeUrl: '/processManager/task'
        }
      })
  -->
  <div class="container"
       :business-key="businessKey"
       :close-url="closeUrl"
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
                <span>{{$t('route.approveHistory')}}</span>
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
                        <span v-else></span>
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
  import { isNotEmpty, params } from '@/utils'
  import { selectHistoryByBusinessKey } from '@/api/process/process'

  export default {
    name: 'approveHistory',
    props: {
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    data() {
      return {
        loading: false,
        // 业务key
        businessKey: '',
        // 关闭按钮回退地址
        closeUrl: '',
        // 表单数据
        formData: {}
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
        this.businessKey = params(this, 'businessKey')
        this.closeUrl = params(this, 'closeUrl')
        this.refresh()
      },
      refresh() {
        this.loading = true
        selectHistoryByBusinessKey(this.businessKey).then(result => {
          this.formData = result.data
        }).finally(() => {
          this.loading = false
        })
      },
      close() {
        if (isNotEmpty(this.closeUrl)) {
          this.$router.push({
            path: this.closeUrl
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/smart-ui/smart-ui.scss';
</style>
