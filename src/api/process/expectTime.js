import {
  request
} from '@/utils'

// 根据expectTimeBusinessCode查询预期时间
export function selectExpectTime(data) {
  return request({
    url: `/process/expecttime/getExpectTimeByBusinessCode`,
    method: 'post',
    data
  })
}

// 新增预估时间
export function insertExpectTime(data) {
  return request({
    url: `/process/expecttime/insert`,
    method: 'post',
    data
  })
}

// 更新预估时间
export function updateExpectTime(data) {
  return request({
    url: `/process/expecttime`,
    method: 'put',
    data
  })
}

// 新增工作期望时间
export function insertMainExpectTime(data) {
  return request({
    message: '保存成功',
    url: `/maintenance/job/insertExpectTime`,
    method: 'post',
    data
  })
}

// 更新工作期望时间
export function updateMainExpectTime(data) {
  return request({
    message: '保存成功',
    url: `/maintenance/job/updateExpectTime`,
    method: 'put',
    data
  })
}
