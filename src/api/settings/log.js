import {
  request
} from '@/utils'

// 查询日志列表
export function getLogList() {
  return request({
    url: '/center/log/list',
    method: 'get'
  })
}

// 根据row获取日志内容
export function selectLogContent(data) {
  return request({
    url: '/center/log/selectLogContent',
    method: 'post',
    data
  })
}
