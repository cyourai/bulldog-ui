import { request } from '@/utils'

export function insert(data) {
  return request({
    url: '/center/notice/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/center/notice',
    method: 'put',
    data
  })
}

export function getNoticeList(data) {
  return request({
    url: '/center/notice/list',
    method: 'get'
  })
}

// 删除一行主键
export function deleteByCode(code, _this) {
  _this
    .$confirm('确定删除公告?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      _this.tableDataLoading = true
      return request({
        url: '/center/notice/' + code,
        method: 'delete'
      }).then(res => {
        if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
      })
    })
    .catch(() => {})
}
