import { request } from '@/utils/request'

export function insert(data) {
  return request({
    url: '/topic/event/insert',
    method: 'post',
    message: '新增事件成功',
    data
  })
}

export function update(data) {
  return request({
    url: '/topic/event',
    method: 'put',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/topic/event/updateStatus',
    method: 'put',
    data
  })
}

// 删除一行主键
export function deleteByCode(code, _this) {
  _this.$confirm('确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return request({
      url: '/topic/event/' + code,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
    }).finally(() => {
    })
  })
}

export function getByCode(code) {
  return request({
    url: '/topic/event/' + code,
    method: 'get'
  })
}

// 批量操作
export function batctExecute(_this) {
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
          codes.push(row.eventCode)
        })
        _this.tableDataLoading = true
        return request({
          url: '/topic/event/codes/' + codes,
          method: 'delete'
        }).then(res => {
          if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
        }).finally(() => {
          _this.tableDataLoading = false
        })
      })
  }
}
