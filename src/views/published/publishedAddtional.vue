<template>
  <div class="" v-loading="loading">
    <p class="tip">改变选中状态自动保存</p>
    <p class="name">刊例名称:{{publishedName}}</p>
    <p class="name">媒体主:{{mediaSellerName}}</p>
    <div class="add-container" v-if="(!loading && publishedTypeCode === 'common')">
     <el-row>
        <el-col :span="15" class="fist-row fist-cell">
          {{publishedTitle.join('/')}}
        </el-col>
        <el-col :span="1" class="fist-row" v-for="(item, index) in title" :key="index">
          <el-checkbox-group v-model="titleCheckGroup" size="small">
            <el-checkbox :label="item"></el-checkbox>
            <br>
          </el-checkbox-group>
          {{item}}
        </el-col>
      </el-row>
     <el-row v-for="(timeSlot, rowIndex) in publishedTimeSlot" :key="rowIndex">
        <el-col class="" :span="15">
          <el-tooltip placement="top" effect="light">
            <div slot="content">{{timeSlot}}<br>{{publishedTimePoint[timeSlot].join("/")}}</div>
            <p class="tl">{{timeSlot}} {{publishedTimePoint[timeSlot].join("/")}}</p>
          </el-tooltip>
        </el-col>
        <el-col :span="1" v-for="(item, colIndex) in title" :key="colIndex">
         <el-checkbox-group v-model="dataChkGroup[rowIndex][colIndex]" size="small">
           <el-checkbox class="hide"></el-checkbox>
         </el-checkbox-group>
       </el-col>
      </el-row>
    </div>
    <div class="add-container" v-if="(!loading && publishedTypeCode === 'special')">
      <el-row>
        <el-col :span="15" class="fist-row fist-cell">
          {{publishedTitle.join('/')}}
        </el-col>
        <el-col :span="1" class="fist-row" v-for="(item, index) in title" :key="index">
          <el-checkbox-group v-model="titleCheckGroup" size="small">
            <el-checkbox :label="item"></el-checkbox>
            <br>
          </el-checkbox-group>
          {{item}}
        </el-col>
      </el-row>
      <el-row v-for="(item, rowIndex) in publishedItems" :key="rowIndex">
        <el-col class="" :span="15">
            <p class="tl">{{item.option}}</p>
        </el-col>
        <el-col :span="1" v-for="(item, colIndex) in title" :key="colIndex">
          <el-checkbox-group v-model="dataChkGroup[rowIndex][colIndex]" size="small">
            <el-checkbox class="hide"></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { params, debug, isEmpty } from '@/utils'
  import { getByCode, updateAdd } from '@/api/published/published'

  export default {
    name: 'publishedAddtional',
    components: {},
    props: [],
    data() {
      return {
        loading: false,
        activeTitleIndex: -1,
        title: ['满档加收', '节假日 加收', '跳播加收', '固定加收', '指定加收', '不足起播加收', '不足金额加收', '特殊加收', '其他加收'],
        titleCheckGroup: [],
        mediaSellerName: '',
        publishedName: '',
        publishedCode: '',
        publishedTypeCode: '',
        publishedTimeSlot: [],
        dataChkGroup: [],
        publishedTimePoint: {},
        publishedAdd: {},
        publishedKeys: {},
        publishedTitle: [],
        publishedItems: [],
        publishedPaths: '',
        multipleSelection: []
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
      dataChkGroup(curVal, oldVal) {
        // debug('dataChkGrouptional/watch/dataChkGroup:', curVal)
        if (!this.loading) {
          this.chkCheckAll()
          updateAdd(JSON.stringify(this.publishedAdd), this.publishedCode)
        }
      },
      titleCheckGroup(curVal, oldVal) {
        // debug('dataChkGrouptional/watch/titleCheckGroup/curVal:', curVal)
        // debug('dataChkGrouptional/watch/titleCheckGroup/oldVal:', oldVal)
        // 选中/取消列的index
        const selectFlg = curVal.length >= oldVal.length
        if (selectFlg) {
          for (const i in curVal) {
            if (oldVal.indexOf(curVal[i]) >= 0) {
              continue
            } else {
              this.activeIndex = this.title.indexOf(curVal[i])
              break
            }
          }
        } else {
          for (const i in oldVal) {
            if (curVal.indexOf(oldVal[i]) >= 0) {
              continue
            } else {
              this.activeIndex = this.title.indexOf(oldVal[i])
              break
            }
          }
        }
        // 点击表头全选/取消
        this.publishedAdd = {}
        if (this.publishedTypeCode === 'common') {
          for (const i in this.publishedTimeSlot) {
            this.dataChkGroup[i][this.activeIndex] = selectFlg
          }
          const params = {}
          for (const rowIndex in this.publishedTimeSlot) {
            params[this.publishedTimeSlot[rowIndex]] = this.dataChkGroup[rowIndex]
          }
          this.publishedAdd.list = params
          this.publishedAdd.data = this.dataChkGroup
        } else {
          for (const i in this.publishedItems) {
            this.dataChkGroup[i][this.activeIndex] = selectFlg
          }
          const params = {}
          for (const rowIndex in this.publishedItems) {
            // console.debug(this.publishedItems[rowIndex])
            params[this.publishedItems[rowIndex].option] = this.dataChkGroup[rowIndex]
          }
          this.publishedAdd.list = params
          this.publishedAdd.data = this.dataChkGroup
        }
        updateAdd(JSON.stringify(this.publishedAdd), this.publishedCode)
        // console.debug(this.publishedAdd)
        // console.debug(JSON.stringify(this.publishedAdd))
        // debug('dataChkGrouptional/watch/publishedAdd:', this.dataChkGroup)
        // debug('dataChkGrouptional/watch/titleAndData:', this.publishedAdd.titleAndData)
      }
    },
    methods: {
      init() {
        this.loading = true
        getByCode(this.publishedCode).then(result => {
          this.publishedTypeCode = result.data.publishedTypeCode
          this.publishedName = result.data.publishedName
          this.mediaSellerName = result.data.mediaSeller.mediaSellerName
          this.publishedTimeSlot = this.chgJson('publishedTimeSlot', result)
          this.publishedTimePoint = this.chgJson('publishedTimePoint', result)
          this.publishedTitle = this.chgJson('publishedTitle', result)
          this.publishedItems = this.chgJson('publishedItems', result)
          this.publishedPaths = this.chgJson('publishedPaths', result)
          this.publishedKeys = this.chgJson('publishedKeys', result)
          this.publishedAdd = this.chgJson('publishedAdd', result)
          this.dataChkGroup = this.publishedAdd.data
          debug('dataChkGrouptional/init/getByCode', result.data)
          //   debug('dataChkGrouptional/created-publishedTitle:', this.publishedTitle)
          //   debug('dataChkGrouptional/created-publishedTimeSlot:', this.publishedTimeSlot)
          //   debug('dataChkGrouptional/created-publishedTimePoint:', this.publishedTimePoint)
          //   debug('dataChkGrouptional/created-dataChkGroup:', this.dataChkGroup)
          this.dataChkGroup = []
          const params = []
          let paramCount = 0
          if (this.publishedTypeCode === 'common') {
            if (isEmpty(this.publishedAdd) || this.publishedAdd.length === 0) {
              for (const i in this.publishedTimeSlot) {
                for (const j in this.title) {
                  params[j] = false
                }
                this.$set(this.dataChkGroup, i, params)
                debug('dataChkGrouptional/created-dataChkGroup:', this.dataChkGroup)
              }
            } else {
              for (let i = 0; i < this.publishedTimeSlot.length; i++) {
                const item = this.publishedTimeSlot[i]
                if (this.publishedAdd.list.hasOwnProperty(item)) {
                  this.$set(this.dataChkGroup, paramCount++, this.publishedAdd.list[item])
                }
              }
              debug('dataChkGrouptional/created-dataChkGroup:', this.dataChkGroup)
            }
          } else {
            if (isEmpty(this.publishedAdd) || this.publishedAdd.length === 0) {
              for (const i in this.publishedItems) {
                for (const j in this.title) {
                  params[j] = false
                }
                this.$set(this.dataChkGroup, i, params)
              }
            } else {
              for (let i = 0; i < this.publishedItems.length; i++) {
                const item = this.publishedItems[i].option
                if (this.publishedAdd.list.hasOwnProperty(item)) {
                  this.$set(this.dataChkGroup, paramCount++, this.publishedAdd.list[item])
                }
              }
            }
          }
          this.$set(this.titleCheckGroup, [])
          debug('dataChkGrouptional/created/dataChkGroup:', this.dataChkGroup)
        }).finally(() => {
          this.loading = false
          this.chkCheckAll()
        })
      },
      chkCheckAll() {
        for (const colIndex in this.title) {
          let checkCount = 0
          for (let rowIndex = 0; rowIndex < this.dataChkGroup.length; rowIndex++) {
            if (this.dataChkGroup[rowIndex][colIndex] === false) {
              const titleIndex = this.titleCheckGroup.indexOf(this.title[colIndex])
              if (titleIndex >= 0) {
                this.titleCheckGroup.splice(titleIndex, 1)
              }
              continue
            } else {
              checkCount = checkCount + 1
            }
          }
          if (checkCount === this.dataChkGroup.length) {
            const titleIndex = this.titleCheckGroup.indexOf(this.title[colIndex])
            if (titleIndex < 0) {
              this.titleCheckGroup.push(this.title[colIndex])
            }
          }
        }
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .add-container {
    padding: 20px 20px 20px 20px;
    text-align: center;
    font-size: 8px;
  }

  .el-checkbox__label {
    display: none !important;
  }

  .el-row {
    border-left: 1px solid;
    border-right: 1px solid;
    border-bottom: 1px solid;
    .el-col {
      border-right: 1px solid;
      height: 50px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      padding: 10px 5px 10px 10px;
    }
    .tl {
      text-align: left;
      margin: 0 0 0 0;
    }
  }

  .fist-row {
    border-top: 1px solid;
    height: 50px !important;
    padding: 0px 0px 0px 0px !important;
    display: inline-block !important;
    word-break: break-all !important;
  }

  .fist-cell {
    line-height: 50px !important;
  }

  .tip {
    margin-left: 20px;
    margin-bottom: 0px;
    color: #30B08F;
  }
  .name {
    margin-left: 20px;
    margin-bottom: 10px;
  }
</style>
