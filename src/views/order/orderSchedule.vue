<template>
  <div class="container"
       v-loading="loading">
    <div class="order-container">
      <el-collapse v-model="activeNames"
                   @change="handleChange">
        <el-collapse-item title="用户订单"
                          name="1"
                          class="header">
          <p class="title">订单号:{{orderNum}}</p>
          <div class="list">
            <ul>
              <li class="item clearfix"
                  v-for="(cart,index) in cartList"
                  :key="index">
                <!--常规刊例-->
                <section v-if="cart.cartPublishedTypeCode === 'common'"
                         class="item-wrap">
                  <section class="title">
                  </section>
                  <div class="content clearfix">
                    <div class="top">
                      <el-row :gutter="10">
                        <el-col :span="8">
                          <div class="title">{{cart.cartPublishedName}}</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="title">广告时长：{{cart.cartSelectedTimeLength}}</div>
                        </el-col>
                        <el-col :span="7">
                          <div class="title">执行时间：{{cart.cartSelectedDateRange.replace(/,/g, " ~ ")}}</div>
                        </el-col>
                        <el-col :span="3"
                                v-show="cart.isSkipWeekend">
                          <div class="title">跳播周六、日</div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="cart-detail-1">
                      <div class="time-select-checkbox-group clearfix">
                        <span class="group clearfix">
                          <ul>
                            <div v-for="(time, i) in cartSelectedTimePointPrice[index]"
                                 :key="i"
                                 class="time">
                              <li class="clearfix"
                                  v-if="time.timePoint.length > 0">
                                <el-row :gutter="20">
                                  <el-col :span="2"
                                          class="time-title">{{time.title}}</el-col>
                                  <el-col :span="12">
                                    <span class="label2 fl clearfix time-point"
                                          v-for="(item,timePointIndex) in time.timePoint"
                                          :key="timePointIndex">{{item}}</span>
                                  </el-col>
                                  <el-col :span="4">
                                    <div class="count">单价：
                                      <label class="li-price">{{time.price}}</label>
                                    </div>
                                  </el-col>
                                  <el-col :span="4">
                                    <div class="count">数量：{{time.timePoint.length}}</div>
                                  </el-col>
                                </el-row>
                              </li>
                            </div>
                          </ul>
                        </span>
                      </div>
                    </div>
                    <div class="foot-content clearfix">
                      <span class="vm">
                        <span class="li-price-label">小计：</span>
                        <span class="li-price">{{cart.cartSelectedTotalPrice}}元</span>
                      </span>
                    </div>
                  </div>
                </section>
                <!--特殊刊例-->
                <section v-else
                         class="item-wrap">
                  <section class="title">
                  </section>
                  <div class="content clearfix">
                    <div class="top">
                      <el-row :gutter="10">
                        <el-col :span="8">
                          <div class="title">{{cart.cartPublishedName}}</div>
                        </el-col>
                        <el-col :span="7">
                          <div class="title">执行时间：{{cart.cartSelectedDateRange.replace(/,/g, " ~ ")}}</div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="cart-detail-1">
                      <div class="time-select-checkbox-group clearfix">
                        <span class="group clearfix">
                          <ul>
                            <div v-for="(option, i) in cartSelectedTimePointPrice[index]"
                                 :key="i"
                                 class="time">
                              <li class="clearfix">
                                <div class="count">{{option.title}}: {{option.option}}</div>
                              </li>
                            </div>
                            <li>
                              <div class="count">数量: {{cart.cartSelectedCount}}</div>
                            </li>
                            <li>
                              <div class="count">备注: {{cart.cartSelectedRemark}}</div>
                            </li>
                          </ul>
                        </span>
                      </div>
                    </div>
                    <div class="foot-content clearfix">
                      <span class="vm">
                        <span class="li-price-label">小计：</span>
                        <span class="li-price">{{cart.cartSelectedTotalPrice}}元</span>
                      </span>
                    </div>
                  </div>
                </section>
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item title="用户意向订单 (用户排期单)"
                          name="2">
          <schedule :columns="columns"
                    :headers="headers"
                    :data="data"
                    v-if="isShowIntent"
                    :isReadOnly=true
                    ref="intentSchedule"
                    :name="'intentSchedule'">

          </schedule>
          <el-button type="warning"
                     @click="intentExcelClickHandler"> 导出EXCEL
            <svg-icon icon-class="excel"/>
          </el-button>
        </el-collapse-item>
        <el-collapse-item title="实际订单 (最终合同用排期单)"
                          name="3"
                          class="header">
          <schedule :columns="finallyColumns"
                    :headers="finallyHeaders"
                    :data="finallyData"
                    v-if="isShowFinally"
                    :isReadOnly=false
                    ref="finallySchedule"
                    :name="'finallySchedule'"></schedule>
          <br>
          <el-row :gutter="20">
            <el-col :span="4">
              <label class="title">广告主信息: </label>
            </el-col>
            <el-col :span="20"
                    class="user-info">
              <span>下单用户:{{user.industryUserUserName}}</span>
              <span>所属行业:{{user.industryUserIndeustryKey.replace(",","/")}}</span>
              <span>手机号:{{user.userMobile}}</span>
              <span>邮箱:{{user.userEmail}}</span>
              <span @click="gotoAudit(user.industryUserUserName)"
                    class="inline-edit">查看用户信息</span>
            </el-col>
          </el-row>
          <br><br>
          <el-row :gutter="20">
            <el-col :span="4">
              <label class="title">所选刊例: </label>
            </el-col>
            <el-col :span="20"
                    class="">
              <div v-for="(publishedName, index) in publishedNames"
                   :key="index">
                <p>
                  <span class="inline-edit"
                        @click="gotoPublished(publishedCodes[index])">{{publishedName}}</span><br>
                  <span class="editor ok"
                        v-if="publisheds.length == publishedCodes.length && publisheds[index].hasOwnProperty('publishedAdd')"
                        @click="gotoAddtional(publishedCodes[index])">已设置加收:编辑<br></span>
                  <span v-else
                        class="editor error"
                        @click="gotoAddtional(publishedCodes[index])">未设置加收:去设置<br></span>
                  <span class="editor ok"
                        v-if="publisheds.length == publishedCodes.length && publisheds[index].hasOwnProperty('publishedDiscount')"
                        @click="gotoDiscount(publishedCodes[index])">已设置折扣:编辑<br></span>
                  <span v-else
                        class="editor error"
                        @click="gotoDiscount(publishedCodes[index])">未设置折扣:去设置<br></span>
                </p>
              </div>
            </el-col>
          </el-row>
          <br><br>
          <el-row :gutter="20">
            <el-col :span="4">
              <label class="title">排期单日期范围: </label>
            </el-col>
            <el-col :span="20">
              <el-date-picker v-model="orderRangeDate"
                              type="daterange"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              range-separator=" ～ "
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
              <el-button type=""
                         @click="finallyDateClickHandler"> 重置排期单日期
                <svg-icon icon-class="pen"/>
              </el-button>
            </el-col>
          </el-row>
          <br><br>
          <el-row :gutter="20">
            <el-col :span="4">
              <label class="title">最终总价: </label>
            </el-col>
            <el-col :span="10">
              <el-input-number controls-position="right"
                               :step="10000"
                               v-model="orderFinallyTotalPrice">
              </el-input-number>
              (需要用户支付的总价)
            </el-col>
          </el-row>
          <br><br>
          <el-row :gutter="20"
                  v-if="nowStepIndex == 4">
            <el-col :span="4">
              <label class="title">赠送积分: </label>
            </el-col>
            <el-col :span="10">
              <el-input-number controls-position="right"
                               :step="1000"
                               v-model="scoreValue">
              </el-input-number>
            </el-col>
          </el-row>
          <br><br>
          <span>
            <el-button type="warning"
                       @click="finallyAddClickHandler"> 计算加收
              <svg-icon icon-class="addprice"/>
            </el-button>
            <el-button type="success"
                       @click="finallyDiscountClickHandler"> 计算折扣价
              <svg-icon icon-class="discount"/>
            </el-button>
            <el-button type="primary" v-if="nowStepIndex == 4"
                       @click="scoreClickHandler"> 更新积分
              <svg-icon icon-class="pen"/>
            </el-button>
            <p class="tip">完成计算后点击[保存排期单]保存计算后的结果</p>
            <p class="tip">请确认用户支付后,更新积分</p>
          </span>
          <br><br>
          <span>
            <el-button type="warning"
                       @click="finallyExcelClickHandler"> 导出EXCEL
              <svg-icon icon-class="excel"/>
            </el-button>
            <el-button type="success"
                       @click="finallyCopyClickHandler"> 复制用户排期单
              <svg-icon icon-class="double_arrow_down"/>
            </el-button>
            <el-button type="primary"
                       @click="finallySaveClickHandler"> 保存排期单
              <svg-icon icon-class="documentation"/>
            </el-button>
            <p class="tip">保存后广告主可以看到最终的排期单</p>
          </span>
        </el-collapse-item>
        <el-collapse-item title="审批,控制订单流转"
                          name="4">
          <hr>
          <el-steps :active="nowStepIndex"
                    align-center
                    class="step">
            <el-step title="广告主下单"
                     description=""></el-step>
            <el-step title="平台接单"
                     description="与媒体主确认OK,准备签订合同"></el-step>
            <el-step title="三方签订合同"
                     description="三方签订线下合同"></el-step>
            <el-step title="广告主支付"
                     description="广告主已经支付,确认后执行下一步"></el-step>
            <el-step title="平台上传播出证明"
                     description="平台上传播出相关证明材料"></el-step>
            <el-step title="三方验收"
                     description="三方确认播出正常,平台结束流程"></el-step>
          </el-steps>
          <hr>
          <div class="upload-area" v-show="nowStepIndex === 4 || nowStepIndex === 5 || nowStepIndex === 6">
            播出证明:
            <el-upload class="avatar-uploader"
                       drag
                       ref="upload"
                       action=''
                       :http-request="uploadHandler"
                       :show-file-list='false'
                       :data="{name: 'orderEvidence'}"
                       accept="*.*">
              <img v-if="orderEvidenceUrl" :src="orderEvidenceUrl" class="avatar" :error="errorUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="default" class="upload-download" @click="getUploadUrl('orderEvidence')">查看播出证明</el-button>
            <br>
            物料:
            <el-upload class="avatar-uploader"
                       drag
                       ref="upload"
                       action=''
                       :http-request="uploadHandler"
                       :data="{name: 'orderMateriel'}"
                       :show-file-list='false'
                       accept="*.*">
              <img v-if="orderMaterielUrl" :src="orderMaterielUrl" class="avatar" :error="errorUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="default" class="upload-download" @click="getUploadUrl('orderMateriel')">查看播出物料</el-button><br>
            合同:
            <el-upload class="avatar-uploader"
                       drag
                       ref="upload"
                       action=''
                       :http-request="uploadHandler"
                       :data="{name: 'orderContract'}"
                       :show-file-list='false'
                       accept="*.*">
              <img v-if="orderContractUrl" :src="orderContractUrl" class="avatar" :error="errorUrl">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="default" class="upload-download" @click="getUploadUrl('orderContract')">查看合同</el-button><br>
          </div>
          <span class="close-context">
            <el-button type="warning"
                       icon="el-icon-close"
                       class="largeBtn"
                       @click="closeClickHandler"> 关 闭
            </el-button>
            <el-button type="success"
                       icon="el-icon-tickets"
                       class="largeBtn"
                       v-show="status === 'orderWaitAccepted'"
                       @click="agreeHandler"> 下一步, {{nextStepZh}}
            </el-button>
            <el-button type="success"
                       icon="el-icon-tickets"
                       class="largeBtn"
                       v-show="status != 'orderWaitAccepted'"
                       @click="nextHandler"> 下一步, {{nextStepZh}}
            </el-button>
            <el-button type="danger"
                       icon="el-icon-edit"
                       class="largeBtn"
                       v-show="status === 'orderWaitAccepted'"
                       @click="rejectHandler"> 拒 绝
            </el-button>
          </span>
          <br>
          <span class="close-context">
            <tinymce-gallery v-model="orderRemark"
                             :type='"PhotoGallery"'
                             @keyup="remarkKeyupHandler"></tinymce-gallery>
            <p class="tip">拒绝时需填写拒绝理由</p>
          </span>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
  import ComponentForm from '@/components/ComponentForm'
  import ComponentCascader from '@/components/ComponentCascader'
  import { TinymceGallery, VueDialog } from 'ctsi-vue-dialog'
  import {
    getByCode,
    update,
    getTaskId,
    getIndustryByUserName,
    getPublishedByCode
  } from '@/api/order/order'
  import {
    params,
    debug,
    error,
    deepClone,
    isEmpty,
    request,
    isNum
  } from '@/utils'
  import { Message } from 'element-ui'
  import Schedule from './handsonTable/Schedule'
  // import store from '@/store'

  export default {
    name: 'orderSchedule',
    data() {
      return {
        loading: false,
        isShowIntent: false,
        isShowFinally: false,
        isSave: false,
        activeNames: ['1'],
        cartList: [],
        taskId: '',
        // 所有环节
        allStatus: [
          'start',
          'orderCreate',
          'orderWaitAccepted',
          'orderWaitContract',
          'orderWaitPay',
          'orderWaitCheck',
          'orderWaitConfirm',
          'end'
        ],
        allZhStatus: [
          '开始',
          '创建订单',
          '生成排期单',
          '三方签订合同',
          '广告主支付',
          '平台上传播出证明',
          '三方验收',
          '结束'
        ],
        // 当前环节
        status: '',
        // 当前环节索引
        nowStepIndex: 1,
        // 当前节中文
        nowStepZh: '',
        // 下一环节中文
        nextStepZh: '',
        // 下一环节
        nextStatus: '',
        // 备注
        orderRemark: '',
        // 下单用户
        user: {
          // 行业
          industryUserIndeustryKey: '',
          // 下单用户名
          industryUserUserName: '',
          userMobile: '',
          userEmail: ''
        },
        // 用户选中的规格
        cartSelectedTimePointPrice: [],
        // 订单号
        orderNum: '',
        // 下单用户
        orderUserName: '',
        // 最终价格
        orderFinallyTotalPrice: '',
        // 积分
        scoreValue: 0,
        // 意向排期单
        orderScheduleIntent: {},
        // 实际排期单
        orderScheduleActual: {},
        // 所选日期最小,最大刊例日期
        orderRangeDate: '',
        addTitle: [
          '满档加收',
          '节假日 加收',
          '跳播加收',
          '固定加收',
          '指定加收',
          '不足起播加收',
          '不足金额加收',
          '特殊加收',
          '其他加收'
        ],
        // 表头前部
        headerFront: [
          '市场',
          '电台/频道',
          '位置/播出方式',
          '节目名称/套播形式',
          '时段',
          '广告时长',
          '刊例价',
          '折扣Off',
          '满档加收',
          '节假日加收',
          '跳播加收',
          '固定加收',
          '指定加收',
          '不足起播要求加收',
          '不足金额加收',
          '特殊加收',
          '其他加收',
          '加收条件',
          '净价RMB'
        ],
        // 表头时间部分
        headerDate: [],
        // 表头后部
        headerEnd: ['总次数', ' 净价合计 RMB ', '备注'],
        // 加收开始
        startAddCol: 8,
        // 加收结束
        endAddCol: 17,
        // 刊例价
        publishedPriceCol: 6,
        // 折扣列
        discountCol: 7,
        // 净价
        priceCol: 18,
        // 订单对应的刊例
        publishedNames: [],
        // 订单对应的刊例-编号
        publishedCodes: [],
        // 刊例
        publisheds: [
          {
            // 加收
            publishedAdd: '',
            // 折扣
            publishedDiscount: ''
          }
        ],
        columns: [],
        headers: [],
        data: [],
        finallyColumns: [],
        finallyHeaders: [],
        finallyData: [],
        fileList: [],
        orderMaterielUrl: '',
        orderEvidenceUrl: '',
        orderContractUrl: '',
        errorUrl: 'this.src="/static/images/file.jpg"'
      }
    },
    components: {
      Schedule,
      ComponentForm,
      ComponentCascader,
      TinymceGallery,
      VueDialog
    },
    created() {
      this.code = params(this, 'orderCode')
      this.status = params(this, 'orderStatus')
      this.nextStatus = params(this, 'nextStatus')
      this.nowStepIndex = this.allStatus.indexOf(this.status)
      this.nowStepZh = this.allZhStatus[this.nowStepIndex]
      if (this.nowStepIndex + 1 <= this.allZhStatus.length) {
        this.nextStepZh = this.allZhStatus[this.nowStepIndex + 1]
      }
      // 页面初始化
      this.init()
    },
    methods: {
      init() {
        // 渲染编辑数据
        if (this.isEdit()) {
          this.loading = true
          new Promise((resolve, reject) => {
            getByCode(this.code).then(result => {
              this.cartList = JSON.parse(result.data.orderCart)
              this.orderNum = result.data.orderNum
              this.orderUserName = result.data.orderUserName
              this.orderEvidenceUrl = result.data.orderEvidence
              this.orderMaterielUrl = result.data.orderMateriel
              this.orderContractUrl = result.data.orderContract
              // console.debug(this.cartList)
              for (let i = 0; i < this.cartList.length; i++) {
                const timePointPrices = JSON.parse(
                  this.cartList[i].cartSelectedTimePointPrice
                )
                this.$set(this.cartSelectedTimePointPrice, i, timePointPrices)
              }
              this.orderScheduleIntent = JSON.parse(
                result.data.orderScheduleIntent
              )
              if (result.data.orderScheduleActual) {
                this.orderScheduleActual = JSON.parse(
                  result.data.orderScheduleActual
                )
              } else {
                this.orderScheduleActual = deepClone(this.orderScheduleIntent)
              }
              // 最终价格
              if (result.data.orderFinallyTotalPrice) {
                this.orderFinallyTotalPrice = result.data.orderFinallyTotalPrice
                this.scoreValue = this.orderFinallyTotalPrice / 10
              } else {
                this.orderFinallyTotalPrice = result.data.orderTotalPrice
              }
              // 选择日期
              this.orderRangeDate = result.data.orderRangeDate.split(',')
              // 刊例名称
              this.publishedNames = result.data.orderPublishedName.split(',')
              this.publishedCodes = result.data.orderPublishedCode.split(',')
              debug('orderSchedule/init-result', result.data)
              resolve(result)
              // debug('cartList:init', this.cartList)
              // debug('orderScheduleIntent:init', this.orderScheduleIntent)
              // debug('cartSelectedTimePointPrice:init', this.cartSelectedTimePointPrice)
              // debug('orderScheduleActual:init', this.orderScheduleActual)
            })
          })
            .then(result => {
              getIndustryByUserName(result.data.orderUserName).then(result => {
                this.user = result.data.industryUser
                this.user.userMobile = this.user.userMap.userMobile
                this.user.userEmail = this.user.userMap.userEmail
              })
              getTaskId(this.code, false).then(result => {
                this.taskId = result.data.taskId
              })
            })
            .then(() => {
              this.publisheds = []
              for (const i in this.publishedCodes) {
                getPublishedByCode(this.publishedCodes[i]).then(result => {
                  this.publisheds[i] = result.data
                  this.loading = false
                })
              }
            })
            .catch(() => {
              this.loading = false
            })
            .finally(() => {
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
          path: '/order/order'
        })
      },
      remarkKeyupHandler(value) {
        this.orderRemark = value
      },
      handleChange(val) {
        if (val.indexOf('2') >= 0) {
          this.$nextTick(() => {
            this.columns = this.orderScheduleIntent.columns
            this.headers = this.orderScheduleIntent.headers
            this.data = this.orderScheduleIntent.data
            this.isShowIntent = true
          })
        }
        if (val.indexOf('3') >= 0 && this.orderScheduleActual) {
          this.$nextTick(() => {
            if (this.orderScheduleActual.hasOwnProperty('columns')) {
              this.finallyColumns = this.orderScheduleActual.columns
            }
            if (this.orderScheduleActual.hasOwnProperty('headers')) {
              this.finallyHeaders = this.orderScheduleActual.headers
            }
            if (this.orderScheduleActual.hasOwnProperty('data')) {
              this.finallyData = this.orderScheduleActual.data
            }
            this.isShowFinally = true
          })
        }
      },
      chkAdd(mediaSellerName, timeSlot) {
        for (const i in this.publisheds) {
          const publishedMediaSellerName = this.publisheds[i].mediaSeller
            .mediaSellerName
          if (mediaSellerName === publishedMediaSellerName) {
            let publishedAdd = []
            try {
              if (typeof this.publisheds[i]['publishedAdd'] !== 'undefined') {
                publishedAdd = JSON.parse(this.publisheds[i]['publishedAdd'])
              }
            } catch (error) {
              publishedAdd = []
            }
            if (publishedAdd === []) {
              return false
            }
            if (publishedAdd.list.hasOwnProperty(timeSlot)) {
              return publishedAdd.list[timeSlot]
            } else {
              return false
            }
          }
        }
      },
      closeClickHandler() {
        this.$router.push({
          path: '/order/order'
        })
      },
      intentExcelClickHandler() {
        this.$refs.intentSchedule.exportScheduleExcel()
      },
      finallyExcelClickHandler() {
        this.$refs.finallySchedule.exportScheduleExcel()
      },
      finallyAddClickHandler() {
        // 确认加收
        for (let i = 0; i < this.finallyData.length; i++) {
          const row = this.finallyData[i]
          const mediaSellerName = row[1]
          const timeSlot = row[2]
          const chgFlg = this.chkAdd(mediaSellerName, timeSlot)
          if (chgFlg) {
            const rowCondition = []
            for (let col = this.startAddCol; col < this.endAddCol; col++) {
              const titleIndex = col - this.startAddCol
              if (chgFlg[titleIndex]) {
                row[col] = this.addTitle[titleIndex]
                rowCondition.push(this.addTitle[titleIndex])
              } else {
                row[col] = ''
              }
            }
            if (rowCondition !== []) {
              row[this.endAddCol] = rowCondition.join(',')
            }
          } else {
            for (let col = this.startAddCol; col < this.endAddCol; col++) {
              row[col] = ''
            }
          }
          this.$message({
            type: 'success',
            message: '加收状态更新完毕!'
          })
        }
      },
      finallyDiscountClickHandler() {
        // 计算折扣
        const subMsg = []
        for (let i = 0; i < this.finallyData.length; i++) {
          if (!isEmpty(this.user.industryUserIndeustryKey)) {
            for (const j in this.publisheds) {
              const row = this.finallyData[i]
              const publishedMediaSellerName = this.publisheds[j].mediaSeller
                .mediaSellerName
              const mediaSellerName = row[1]
              if (mediaSellerName === publishedMediaSellerName) {
                let publishedDiscount = {}
                try {
                  if (
                    typeof this.publisheds[j]['publishedDiscount'] !== 'undefined'
                  ) {
                    publishedDiscount = JSON.parse(
                      this.publisheds[j]['publishedDiscount']
                    )
                  }
                } catch (error) {
                  publishedDiscount = {}
                }
                if (publishedDiscount === {}) {
                  this.finallyData[i][this.discountCol] = ''
                }
                // console.debug(this.user.industryUserIndeustryKey)
                // console.debug(publishedDiscount[this.user.industryUserIndeustryKey])
                const key =
                  this.user.industryUserIndeustryKey.indexOf(',') > 0
                    ? this.user.industryUserIndeustryKey.split(',')[1]
                    : this.user.industryUserIndeustryKey
                if (publishedDiscount.hasOwnProperty(key)) {
                  this.finallyData[i][this.discountCol] = publishedDiscount[key]
                  break
                } else {
                  this.finallyData[i][this.discountCol] = ''
                  subMsg.push(mediaSellerName)
                }
              } else {
                this.finallyData[i][this.discountCol] = ''
              }
            }
          } else {
            this.finallyData[i][this.discountCol] = ''
          }
        }
        // 计算总价
        for (let i = 0; i < this.finallyData.length; i++) {
          // 计算净价
          const row = this.finallyData[i]
          const publishedPrice = row[this.publishedPriceCol]
          const publishedDiscount = row[this.discountCol]
          let price = publishedPrice
          console.debug(price)
          if (isNum(publishedPrice) && isNum(publishedDiscount)) {
            // 计算折扣
            price = publishedPrice * (publishedDiscount / 100)
          }
          this.finallyData[i][this.priceCol] = price
          // 次数
          const count = row[row.length - 3]
          // 总净价
          this.finallyData[i][row.length - 2] = count * price
        }
        this.$message({
          type: 'success',
          message:
            '折扣更新完毕!' +
            subMsg.join('\r\n') +
            '没有维护对应的折扣信息,不计算折扣'
        })
      },
      finallyCopyClickHandler() {
        // 复制排期单
        this.$confirm(
          '复制用户排期单将用意向订单替换当前实际订单全部内容?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.orderScheduleActual = deepClone(this.orderScheduleIntent)
          this.finallyColumns = this.orderScheduleActual.columns
          this.finallyHeaders = this.orderScheduleActual.headers
          this.finallyData = this.orderScheduleActual.data
          debug('orderSchedule/finallyCopyClickHandler', this.finallyColumns)
        })
      },
      finallySaveClickHandler() {
        this.loading = true
        const param = this.$refs.finallySchedule.exportData()
        update({
          orderCode: this.code,
          orderFinallyTotalPrice: this.orderFinallyTotalPrice,
          orderScheduleActual: JSON.stringify(param)
        }).finally(() => {
          this.isSave = true
          this.loading = false
        })
      },
      finallyDateClickHandler() {
        // 重置播出时间
        this.$confirm(
          '重置排期单日期会引起价格和合同内容变化请注意修改价格和排期单内容',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const startDate = new Date(this.orderRangeDate[0]).getTime()
          const endDate = new Date(this.orderRangeDate[1]).getTime()
          const dateDiff = endDate - startDate
          this.finallyHeaders = []
          this.finallyColumns = []
          this.finallyData = []
          for (let i = 0; i < this.headerFront.length; i++) {
            this.finallyColumns.push({
              name: this.headerFront[i],
              class: '',
              readOnly: ''
            })
          }
          for (let j = 0; j <= dateDiff; j += 86400000) {
            const dateDay = new Date(startDate + j)
            if (dateDay.getDay() === 6 || dateDay.getDay() === 0) {
              this.finallyColumns.push({
                name: dateDay.getMonth() + 1 + '-' + dateDay.getDate(),
                class: 'red',
                readOnly: ''
              })
            } else {
              this.finallyColumns.push({
                name: dateDay.getMonth() + 1 + '-' + dateDay.getDate(),
                class: '',
                readOnly: ''
              })
            }
          }
          for (let k = 0; k < this.headerEnd.length; k++) {
            this.finallyColumns.push({
              name: this.headerEnd[k],
              class: '',
              readOnly: ''
            })
          }
          // console.debug('orderSchedule/finallyDateClickHandler-finallyColumns:', this.finallyColumns)
          // 重绘表头
          for (let i = 0; i < this.finallyColumns.length; i++) {
            let html = ''
            if (this.finallyColumns[i].class === 'red') {
              html =
                "<strong><span class='red'>" +
                this.finallyColumns[i].name +
                '</span></strong>'
            } else {
              html =
                "<strong><span class=''>" +
                this.finallyColumns[i].name +
                '</span></strong>'
            }
            this.finallyHeaders.push(html)
          }
          // 填充数据
          const originDataLen = this.orderScheduleActual.data.length
          for (let i = 0; i < originDataLen; i++) {
            const row = []
            for (let j = 0; j <= this.headerFront.length; j++) {
              row[j] = this.orderScheduleActual.data[i][j]
            }
            for (let k = 0; k < dateDiff; k += 86400000) {
              row.push('1')
            }
            row.push(this.orderScheduleActual.data[i][originDataLen - 3])
            row.push(this.orderScheduleActual.data[i][originDataLen - 2])
            row.push(this.orderScheduleActual.data[i][originDataLen - 1])
            this.finallyData[i] = row
          }
        })
      },
      scoreClickHandler() {
        request({
          message: '积分已更新',
          url: '/media/score/update',
          method: 'post',
          data: {
            scoreOrderCode: this.code, // 订单编号
            scoreValue: this.scoreValue, // 积分
            scoreUserName: this.orderUserName,
            scoreType: 'add',
            scoreAchieve: 'buy'
          }
        })
          .then(_ => {
            this.loading = false
          })
          .finally(() => {
            this.loading = false
          })
      },
      agreeHandler() {
        if (!this.isSave) {
          Message({
            message: '请保存排期单后,再进行下一步',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        this.loading = true
        request({
          message: '排期单已保存,下一环节-签署三方合同',
          url: '/media/order/agree',
          method: 'post',
          data: {
            taskId: this.taskId, // 任务编号
            orderCode: this.code, // 订单编号
            status: 'orderWaitContract', // 下一环节
            remark: this.orderRemark // 拒绝原因
          }
        }).then(() => {
          this.close()
        }).finally(() => {
          this.loading = false
        })
      },
      nextHandler() {
        this.loading = true
        request({
          message: '订单状态更新成功',
          url: '/media/order/next',
          method: 'post',
          data: {
            taskId: this.taskId, // 任务编号
            orderCode: this.code, // 订单编号
            status: this.nextStatus, // 下一环节
            remark: this.orderRemark // 拒绝原因
          }
        })
          .then(() => {
            this.loading = false
            this.close()
          })
          .finally(() => {
            this.loading = false
          })
      },
      rejectHandler() {
        if (isEmpty(this.orderRemark)) {
          Message({
            message: '拒绝时需填写拒绝原因',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        if (isEmpty(this.taskId)) {
          Message({
            message: '无法取得相关任务编号',
            type: 'warning',
            duration: 5 * 1000
          })
          return
        }
        this.loading = true
        this.$confirm('确定拒绝此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return request({
              message: '已拒绝',
              url: '/media/order/reject',
              method: 'post',
              data: {
                taskId: this.taskId, // 任务编号
                orderCode: this.code, // 订单编号
                remark: this.orderRemark, // 拒绝原因
                isForce: true
              }
            }).then(() => {
              this.loading = false
            })
          })
          .catch(e => {
            error(e)
          })
          .finally(() => {
            this.loading = false
          })
      },
      gotoAudit(userName) {
        // 人员信息
        this.$router.push({
          path: '/settings/user-audit',
          name: 'user-audit',
          params: {
            userName: userName
          }
        })
      },
      gotoPublished(publishedCode) {
        // 刊例详情
        this.$router.push({
          path: '/published/published-edit',
          name: 'published-edit',
          params: {
            publishedCode: publishedCode
          }
        })
      },
      gotoAddtional(publishedCode) {
        this.$router.push({
          path: '/published/published-addtional',
          name: 'published-addtional',
          params: {
            publishedCode: publishedCode
          }
        })
      },
      gotoDiscount(publishedCode) {
        this.$router.push({
          path: '/published/published-discount',
          name: 'published-discount',
          params: {
            publishedCode: publishedCode
          }
        })
      },
      getUploadUrl(type) {
        if (type === 'orderEvidence') {
          if (isEmpty(this.orderEvidenceUrl)) {
            this.$alert('请先上传播出证明')
          } else {
            window.open(this.orderEvidenceUrl)
          }
        }
        if (type === 'orderMateriel') {
          if (isEmpty(this.orderMaterielUrl)) {
            this.$alert('请先上传物料')
          } else {
            window.open(this.orderMaterielUrl)
          }
        }
        if (type === 'orderContract') {
          if (isEmpty(this.orderContractUrl)) {
            this.$alert('请先上传合同')
          } else {
            window.open(this.orderContractUrl)
          }
        }
      },
      uploadHandler(param) {
        this.loading = true
        var form = new FormData()
        form.append('file', param.file, param.file['filename'])
        request({
          // zuul/api 前置zuul对应上传中文问题
          baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
          url: '/media/audit/handleFileUpload',
          method: 'post',
          data: form,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data;boundary=boundary'
            },
            field: param.data.name
          }
        }).then(result => {
          // 更新查看链接
          if (result.config.config.field === 'orderEvidence') {
            this.orderEvidenceUrl = result.data.uploadOssUrl
            update({
              orderCode: this.code,
              orderEvidence: this.orderEvidenceUrl
            })
          } else if (result.config.config.field === 'orderMateriel') {
            this.orderMaterielUrl = result.data.uploadOssUrl
            update({
              orderCode: this.code,
              orderMateriel: this.orderMaterielUrl
            })
          } else if (result.config.config.field === 'orderContract') {
            this.contractUrl = result.data.uploadOssUrl
            update({
              orderCode: this.code,
              orderContract: this.contractUrl
            })
          }
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          this.fileList = []
          this.loading = false
        })
      }
    }
  }
</script>
<style lang="scss">
  .red {
    color: #ed0a2b;
  }

  .el-upload-dragger {
    width: 180px !important;
    margin-left: 40px;
  }

  .upload-download {
    margin-left: 40px;
    margin-bottom: 40px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~@/styles/cart.scss';
  @import '~@/styles/order-schedule.scss';
</style>
