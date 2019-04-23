import { request } from '@/utils/request'
import {
  objectMerge
} from '@/utils/index'
import {
  debug,
  error
} from '@/utils/log'

// 所有角色
export function getRoleAll() {
  return request({
    url: '/user/role/select',
    method: 'get'
  })
}

// 分页角色
export function selectByPage(_this) {
  _this.tableDataLoading = true
  const params = objectMerge({
    pageSize: _this.tableData.pageSize,
    pageNum: _this.tableData.pageNum,
    sort: _this.tableData.sort,
    defaultSort: _this.defaultSort
  })
  return request({
    url: '/user/role/page',
    method: 'get',
    params: params
  }).then(result => {
    _this.tableDataLoading = false
    _this.tableData = result.data.tableData
    debug(_this.tableData)
  }).catch(e => {
    error(e)
    _this.tableDataLoading = false
  }).finally(() => {
    _this.tableDataLoading = false
  })
}

// 查询角色
export function getRoleByCode(code) {
  return request({
    url: '/user/role/' + code,
    method: 'get'
  })
}

// 删除一个角色
export function deleteByCode(code, object) {
  object
    .$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      object.tableDataLoading = true
      return request({
        url: '/user/role/' + code,
        method: 'delete'
      }).then(res => {
        object.refreshTable()
        object.tableDataLoading = false
      })
    })
    .catch(() => {})
}

// 添加角色
export function insert(data) {
  return request({
    url: '/user/role/insert',
    method: 'post',
    data
  })
}

// 更新角色
export function update(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data
  })
}
