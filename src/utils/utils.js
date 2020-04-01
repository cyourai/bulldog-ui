import {
  request
} from '@/utils'

export function getByCode(url, code) {
  return request({
    url: url + '/' + code,
    method: 'get'
  })
}

export function insert(url, data) {
  return request({
    method: 'post',
    url,
    data
  })
}

export function update(url, data) {
  return request({
    method: 'put',
    url,
    data
  })
}

export function uploadImg(data) {
  return request({
    baseURL: process.env.BASE_API + process.env.ZUUL + process.env.PREFIX,
    url: '/general/upload/uploadImgToNginx',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// data:{url: 'http://{0}/#/maintenance'}
export function createQrcode(data) {
  return request({
    url: '/general/qrcode/create',
    method: 'post',
    data
  })
}
