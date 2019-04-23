import { request } from '@/utils/request'

// 所有媒体主
export function selectMediaSellerNameAndCode() {
  return request({
    url: '/media/mediaSeller/selectMediaSellerNameAndCode',
    message: '',
    method: 'get'
  })
}

// 所选媒体主
export function selectMediaSellerByPlanGroup(group) {
  return request({
    url: '/media/mediaSeller/selectMediaSellerByPlanGroup',
    message: '',
    method: 'get'
  })
}

// 追加媒体主
export function insertPlan(param) {
  return request({
    url: '/media/plan/insertPlan',
    message: '',
    method: 'post',
    data: param
  })
}

// 删除媒体主
export function del(mediaSellerCode, group) {
  return request({
    message: '',
    url: '/media/plan/delMediaSellerCodes',
    method: 'delete',
    data: {
      codes: mediaSellerCode,
      group: group
    }
  })
}
