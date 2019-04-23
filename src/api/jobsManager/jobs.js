import { request } from '@/utils/request'

export function insert(data) {
  return request({
    url: '/maintenance/job/insert',
    method: 'post',
    message: '新增工作成功',
    data
  })
}

export function update(data) {
  return request({
    url: '/maintenance/job',
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
      url: '/maintenance/job/' + code,
      method: 'delete'
    }).then(() => {
      if (_this.hasOwnProperty('refreshTable')) _this.refreshTable()
    }).finally(() => {
    })
  })
}

// 执行工作
export function executeJob(data) {
  return request({
    url: '/maintenance/job/executeJob',
    method: 'post',
    message: '执行完成',
    data
  })
}

// 根据工作组获得工作
export function getJobByJobsCode(code) {
  return request({
    url: `/maintenance/job/selectJobListByTreeCode/${code}`,
    method: 'get'
  })
}

// 根据工作组编号执行工作组
export function executeByJobsCode(code) {
  return request({
    url: `/maintenance/job/selectJobListByTreeCode/${code}`,
    method: 'get'
  })
}
