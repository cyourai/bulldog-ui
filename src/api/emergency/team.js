import { request } from '@/utils/request'

export function insert(data) {
  return request({
    url: '/center/im/creatTeamTalk',
    method: 'post',
    message: '新增群组成功',
    data
  })
}

export function update(data) {
  return request({
    url: '/center/im',
    method: 'put',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/center/im/updateStatus',
    method: 'put',
    data
  })
}

// 删除一行主键
export function deleteByCode(tid, _this) {
  _this.$confirm('确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return request({
      url: `/center/im/removeTeamTalk/${tid}`,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
    }).finally(() => {
    })
  })
}

export function getByCode(code) {
  return request({
    url: `/center/im/${code}`,
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
        _this.multipleSelection.selection.forEach(row => {
          return request({
            url: `/center/im/removeTeamTalk/${row.tid}`,
            method: 'delete'
          }).then(() => {
            if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
          })
        })
      })
  }
}

// 同步用户
export function synchronizedUser(row) {
  return request({
    url: `/center/im/synchronizedUser/`,
    method: 'post',
    data: row
  })
}
