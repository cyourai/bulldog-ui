import { request } from '@/utils'

export function insert(data) {
  return request({
    url: '/process/validate/insert',
    method: 'post',
    message: '新增拨测条件成功',
    data
  })
}

export function update(data) {
  return request({
    url: '/process/validate',
    method: 'put',
    data
  })
}

// 单行删除
export function deleteByCode(code, _this) {
  _this
    .$confirm('确定删除验证条件?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.loading = true
      request({
        url: `/process/validate/${code}`,
        method: 'delete'
      }).then(() => {
        if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
      }).finally(() => {
        _this.loading = false
      })
    }).catch(() => {})
}

export function getByCode(code) {
  return request({
    url: '/process/validate/' + code,
    method: 'get'
  })
}

// 批量操作
export function batchExecute(_this) {
  if (_this.batchFilterData === '') {
    _this.$message({
      type: 'warning',
      message: '请选择批处理操作！'
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
        _this.multipleSelection.selection.forEach(row => {
          codes.push(row.id)
        })
        _this.loading = true
        return request({
          url: `/process/validate/codes/${codes}`,
          method: 'delete'
        }).then(res => {
          if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
        }).finally(() => {
          _this.loading = false
        })
      })
  }
}

// 验证
export function validateGet(code) {
  return request({
    url: `/process/validate/validateGet/${code}`,
    method: 'get'
  })
}
