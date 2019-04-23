import { request } from '@/utils/request'
import { objectMerge } from '@/utils/index'

export function selectByPage(_this) {
  _this.tableDataLoading = true
  // console.debug(_this.tableData.sort)
  const params = objectMerge(
    {
      pageSize: _this.tableData.pageSize,
      pageNum: _this.tableData.pageNum,
      sort: _this.tableData.sort,
      defaultSort: _this.defaultSort,
      mediaSellerTypeCode: _this.type
    },
    _this.filterFormData
  )
  // console.debug(params)
  return request({
    url: '/media/mediaSeller/page',
    method: 'get',
    params: params
  })
}

export function selectMediaPlanList(_this) {
  _this.tableDataLoading = true
  // console.debug(_this.tableData.sort)
  const params = objectMerge(
    {
      pageSize: _this.tableData.pageSize,
      pageNum: _this.tableData.pageNum,
      sort: _this.tableData.sort,
      defaultSort: _this.defaultSort
    },
    _this.filterFormData
  )
  // console.debug(params)
  return request({
    url: '/media/mediaSeller/selectMediaPlanList',
    method: 'get',
    params: params
  })
}

export function getByCode(code) {
  return request({
    url: '/media/mediaSeller/' + code,
    method: 'get'
  })
}

// 删除一行主键
export function deleteByCode(code, _this) {
  _this
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.tableDataLoading = true
      return request({
        url: '/media/mediaSeller/' + code,
        method: 'delete'
      }).then(res => {
        _this.refreshTable()
        _this.tableDataLoading = false
      })
    })
}

// 删除多行主键
export function deleteCodes(codes, _this) {
  return request({
    url: '/media/mediaSeller/codes/' + codes,
    method: 'delete'
  }).then(() => {
    _this.refreshTable()
  })
}

// 批量操作
export function batctExecute(_this) {
  if (typeof _this.multipleSelection === 'undefined') {
    _this.$message({
      type: 'warning',
      message: '请选择数据!'
    })
    return
  }
  if (_this.batchFilterData === '') {
    _this.$message({
      type: 'warning',
      message: '请选择批处理操作!'
    })
    return
  }
  if (_this.batchFilterData === 'delete') {
    _this
      .$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        const codes = []
        _this.multipleSelection.forEach(row => {
          codes.push(row.mediaSellerCode)
        })
        deleteCodes(codes, _this)
      })
  }
}

export function insert(data) {
  return request({
    url: '/media/mediaSeller/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/media/mediaSeller',
    method: 'put',
    data
  })
}
