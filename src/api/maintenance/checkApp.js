import { request } from '@/utils'

export function insert(data) {
  return request({
    params: {
      isShowMsg: false
    },
    url: '/maintenance/checkApp/insert',
    method: 'post',
    data
  })
}
