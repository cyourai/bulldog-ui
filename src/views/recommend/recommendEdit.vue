<template>
  <div class="container" v-loading="loading">
      <el-transfer
        filterable
        :filter-method="filterMethodA"
        filter-placeholder="请输入媒体主名称"
        v-model="valueA"
        @change="changeAHandle"
        :titles="['媒体主', '计划A']"
        :data="dataA">
      </el-transfer>按地区权重由小 -> 大排序<br><br>
      <el-col :span="12">
        <el-transfer
          filterable
          :filter-method="filterMethodB"
          filter-placeholder="请输入媒体主名称"
          v-model="valueB"
          @change="changeBHandle"
          :titles="['媒体主', '计划B']"
          :data="dataB">
        </el-transfer>按平台权重由小 -> 大排序
      </el-col>
  </div>
</template>
<script>
  import { selectMediaSellerNameAndCode, selectMediaSellerByPlanGroup, insertPlan, del } from '@/api/recommend/recommend'

  export default {
    data() {
      return {
        loading: false,
        dataA: [],
        dataB: [],
        valueA: [],
        valueB: [],
        filterMethodA(query, item) {
          return item.label.indexOf(query) > -1
        },
        filterMethodB(query, item) {
          return item.label.indexOf(query) > -1
        }
      }
    },
    created() {
      this.generateData()
    },
    methods: {
      changeAHandle(value, direction, movedKeys) {
        console.debug(value, direction, movedKeys)
        if (direction === 'right') {
          for (let i = 0; i < value.length; i++) {
            insertPlan({
              planMediaSellerCode: value[i],
              planGroup: 0
            })
          }
        } else {
          del(movedKeys.join(','), 0)
        }
      },
      changeBHandle(value, direction, movedKeys) {
        console.debug(value, direction, movedKeys)
        if (direction === 'right') {
          for (let i = 0; i < value.length; i++) {
            insertPlan({
              planMediaSellerCode: value[i],
              planGroup: 1
            })
          }
        } else {
          del(movedKeys.join(','), 1)
        }
      },
      generateData() {
        this.loading = true
        new Promise((resolve, reject) => {
          selectMediaSellerNameAndCode().then((result) => {
            const data = []
            for (const i in result.data.list) {
              const mediaSeller = result.data.list[i]
              data.push({
                key: mediaSeller.mediaSellerCode,
                label: mediaSeller.mediaSellerName
              })
            }
            this.dataA = data
            this.dataB = data
            resolve(result)
          }).catch((res) => {
            reject(res)
          }).finally(() => { this.loading = false })
        }).then(() => {
          selectMediaSellerByPlanGroup().then((result) => {
            const dataA = []
            const dataB = []
            for (const i in result.data.listA) {
              const mediaSeller = result.data.listA[i]
              dataA.push(mediaSeller.mediaSellerCode)
            }
            for (const i in result.data.listB) {
              const mediaSeller = result.data.listB[i]
              dataB.push(mediaSeller.mediaSellerCode)
            }
            this.valueA = dataA
            this.valueB = dataB
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import '~@/styles/smart-ui/smart-ui.scss';
  .container{
    height: 768px;
  }
  .el-transfer{
    width: 1024px;
    margin-left: 10px;
  }
  .el-transfer-panel{
    width: 350px;
  }
  .el-transfer__buttons{
    .el-button {
      margin-bottom: 0px !important;
    }
  }

</style>
