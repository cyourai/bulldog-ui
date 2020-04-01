import { request } from '@/utils/request'

export function insert(data) {
  return request({
    url: '/topic/plan/insert',
    method: 'post',
    message: '新增预案成功',
    data
  })
}

export function update(data) {
  return request({
    url: '/topic/plan',
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
      url: '/topic/plan/' + code,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
    }).finally(() => {
    })
  })
}

// 预案分类饼图
export function planPieView() {
  return request({
    url: '/topic/plan/planPieView',
    method: 'get'
  })
}
// 作者统计
export function planRadiusView() {
  return request({
    url: '/topic/plan/planRadiusView',
    method: 'get'
  })
}
