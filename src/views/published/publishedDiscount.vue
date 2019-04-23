<template>
  <div class="" v-loading="loading">
    <p class="tip">改变折扣比例自动保存</p>
    <p class="name">刊例名称:{{publishedName}}</p>
    <p class="name">媒体主:{{mediaSellerName}}</p>
    <div class="container">
      <el-collapse v-model="activeNames" @change="handleChange">
        <div v-for="(item,index) in industryList" :key="index">
          <el-collapse-item :title="item.industryKey" :name="index">
            <el-row v-for="(child, childIndex) in item.children" :key="childIndex">
              <el-col :span="10" class="">
                {{child.industryKey}}
              </el-col>
              <el-col :span="5" class="fist-row fist-cell">
                <el-input v-model="publishedDiscount[child.industryKey]" placeholder="折扣比例0~100%"
                          :value="publishedDiscount[child.industryKey]"
                          :min="0"
                          :max="100"
                          :minlength="1"
                          :maxlength="3"
                          type="number"
                          step="10"
                          @change="publishedDiscountChange"
                >{{publishedDiscount[child.industryKey]}}
                  <template slot="append">%</template>
                </el-input>
              </el-col>
            </el-row>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import { params, debug, request } from '@/utils'
  import { updateDiscount, getByCode } from '@/api/published/published'

  export default {
    name: 'publishedDiscount',
    components: {},
    props: [],
    data() {
      return {
        loading: false,
        publishedName: '',
        mediaSellerName: '',
        activeNames: ['0'],
        industryList: [],
        publishedDiscount: {}
      }
    },
    created() {
      this.publishedCode = params(this, 'publishedCode')
      this.init()
    },
    destroyed() {
    },
    mounted() {
    },
    watch: {
      publishedDiscount(curVal, oldVal) {
        debug('publishedDiscount/watch/publishedDiscount:', curVal)
      }
    },
    methods: {
      init() {
        this.loading = true
        new Promise((resolve, reject) => {
          getByCode(this.publishedCode).then(result => {
            this.publishedDiscount = this.chgJson('publishedDiscount', result)
            this.publishedName = result.data.publishedName
            this.mediaSellerName = result.data.mediaSeller.mediaSellerName
            resolve(result)
          })
        }).then(() => {
          request({
            url: '/media/industry/selectIndustryList',
            method: 'get',
            params: params
          }).then(result => {
            this.industryList = result.data.industryList
            for (const i in this.industryList) {
              const item = this.industryList[i]
              for (const j in item.children) {
                const key = item.children[j].industryKey
                if (this.publishedDiscount.hasOwnProperty(key)) {
                  this.$set(this.publishedDiscount, key, this.publishedDiscount[key])
                } else {
                  this.$set(this.publishedDiscount, key, 100)
                }
              }
            }
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      },
      handleChange(val) {
      },
      publishedDiscountChange(val) {
        this.loading = true
        const params = {}
        for (const key in this.publishedDiscount) {
          params[key] = this.publishedDiscount[key]
        }
        const json = JSON.stringify(params)
        // debug('publishedDiscount/publishedDiscountChange:', this.publishedDiscount)
        // debug('publishedDiscount/publishedDiscountChange/json:', json)
        updateDiscount(json, this.publishedCode).finally(() => {
          this.loading = false
        })
      },
      chgJson(key, result) {
        try {
          if (typeof result.data[key] !== 'undefined') {
            return JSON.parse(result.data[key])
          } else {
            return []
          }
        } catch (error) {
          return []
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .container {
    padding: 20px 20px 20px 20px;
    .el-collapse-item {
      margin-bottom: 0px;
    }
    .el-collapse-item__header {
      font-size: 18px;
      padding-left: 10px !important;
    }

    .el-collapse-item__content {
      font-size: 15px;
      padding-left: 20px !important;
    }
  }

  .name {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .tip {
    margin-left: 20px;
    margin-bottom: 0px;
    color: #30B08F;
  }
</style>
