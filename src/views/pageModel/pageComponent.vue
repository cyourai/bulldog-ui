<template>
  <div class="container">
    <!-- 页介绍 -->
    <div class="intro">
      <p class="intro-big">Page Title</p>
      <p>Page Content</p>
    </div>
    <!-- 页内容 -->
    <div class="content">

      <!-- 表格范例 -->
      <div class="content-spe">
        <p class="content-spe-title">这里是表格</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->
          <div class="table-filter">
            <div class="table-filter-header">
              <i class="el-icon-search"
                 style="font-size:16px"></i>
              <span>查询部分</span>
              <div class="table-filter-header-search">
                <span>功能栏</span>
                <span>功能栏</span>
              </div>
            </div>
            <div class="table-filter-content">
              <span>输入搜索：
                <el-input v-model="input"
                          placeholder="请输入内容"></el-input>
              </span>
              <span>按分类搜索1：
                <el-select v-model="value"
                           placeholder="请选择">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </span>
              <span>按分类搜索2：
                <el-select v-model="value"
                           placeholder="请选择">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </span>
            </div>
          </div>
          <!-- 表格内容 -->
          <div class="table-content">
            <div class="table-content-header">
              <i class="el-icon-d-arrow-right"
                 style="font-size:16px"></i>
              <span>内容部分</span>
              <div class="table-content-header-search">
                <span>功能栏</span>
                <span>功能栏</span>
                <el-select v-model="value2"
                           placeholder="排序方式">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="table-content-spe">
              <el-table stripe
                        fit
                        border
                        ref="multipleTable"
                        tooltip-effect="dark">
                <el-table-column type="selection"
                                 width="40"
                                 align="center"></el-table-column>
                <el-table-column min-width="100px"
                                 label="用户名"
                                 align="center"></el-table-column>
                <el-table-column width="100px"
                                 label="密码"
                                 align="center"></el-table-column>
                <el-table-column width="100px"
                                 label="电话"
                                 align="center"></el-table-column>
                <el-table-column min-width="150px"
                                 label="邮箱"
                                 align="center"></el-table-column>
                <el-table-column min-width="200px"
                                 label="地址"
                                 align="center"></el-table-column>
                <el-table-column label="操作"
                                 width="300"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button size="mini">编辑</el-button>
                    <el-button size="mini"
                               type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-content-page">
              <el-select v-model="value3"
                         placeholder="批量操作">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <span class="table-content-page-search">确定</span>
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handlePageChange"
                             :page-sizes="[10, 20, 30, 50]"
                             :page-size="10"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="100"></el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑范例 -->
      <div class="content-spe">
        <p class="content-spe-title">这里是编辑</p>
        <div class="content-spe-element">
          <!-- 表格筛选 -->

        </div>
      </div>

    </div>
  </div>
</template><script>
export default {
  name: 'pageComponent',
  data() {
    return {
      input: '',
      value: '',
      options: '',
      value2: '',
      value3: ''
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$message({
        type: 'success',
        message: '每页显示更改为' + val + '条'
      })
    },
    handlePageChange(val) {
      this.$message({
        type: 'success',
        message: '跳转到第' + val + '页'
      })
    }
  },
  created() {}
}
</script><style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/smart-ui/smart-ui.scss';
</style>
