import {
  request
} from '@/utils'

export function insert(data) {
  return request({
    message: '',
    url: '/human/insert',
    method: 'post',
    data
  })
}
