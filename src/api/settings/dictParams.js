import { request } from '@/utils/request'

// 获取所有配置项
export function getParamsAll() {
  return request({
    url: '/center/setting/selectAll',
    method: 'get'
  })
}

// 更新配置项
export function upDateParams(data) {
  return request({
    url: '/center/setting/installAll',
    method: 'post',
    data
  })
}
