import {
  request
} from '@/utils'

export function insert(data) {
  return request({
    isShowMsg: false,
    message: '',
    url: '/human/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    isShowMsg: false,
    url: '/human',
    method: 'put',
    data
  })
}

export function deleteByCode(code, _this) {
  _this.$confirm('确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return request({
      url: '/human/' + code,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
    }).finally(() => {
    })
  })
}

export function getByCode(code, _this) {
  return request({
    url: '/human/' + code,
    method: 'get'
  })
}
