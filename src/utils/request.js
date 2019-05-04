import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  getToken
} from '@/utils/auth'
import {
  customMessage,
  commonMessage,
  errorGetDataMessage,
  errorTokenMessage,
  errorConnectMessage,
  errorOperateMessage
} from '@/utils/message'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API + process.env.PREFIX, // api的base_url
  timeout: 50000, // request timeout
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token-header'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

/**
 * 回文拦截：
 * response.status = 200 请求到达 根据response.data.status 判断 success/waring
 * 其他为error
 */

service.interceptors.response.use(
  // response -> 业务正确
  response => {
    // response.status === 200 -> 服务器连接成功
    // console.debug(response)
    let isShowMsg = true
    if (response.config.isShowMsg != null && response.config.isShowMsg === false) isShowMsg = false
    if (response.status === 200) {
      // 200开头 -> 数据获取成功
      if (response.config.message && response.config.message !== '' && response.data.status &&
        response.data.status.toString().indexOf('200') >= 0) {
        // 如果前端有传回文且执行正确 -> 用前端回文response.config.message
        if (isShowMsg) customMessage(response)
      } else if (
        response.data.status &&
        response.data.status.toString().indexOf('200') === 0
      ) {
        // 如果前端未传回文 -> 用通用回文response.data.message
        if (response.data.message && response.data.message !== '') {
          if (isShowMsg) commonMessage(response)
        }
        // 300开头 -> 数据获取失败
        if (response.data.status.toString().indexOf('300') === 0) {
          if (isShowMsg) errorGetDataMessage(response)
        }
        // 900开头 -> token错误或过期 -> 跳转到登录页 todo 910前端错频
        if (response.data.status.toString().indexOf('900') === 0) {
          if (isShowMsg) errorTokenMessage(response)
          window.location.href = '/#/logout'
        }
      } else if (response.data.status &&
        response.data.status.toString().indexOf('400') === 0) {
        // 400开头 -> 操作结果失败
        if (isShowMsg) errorOperateMessage(response)
      }
    } else if (response.status !== 200) {
      // response.status !== 200 -> 服务器连接失败
      if (isShowMsg) errorConnectMessage(response)
    }
    return Promise.resolve(response)
  },
  // error -> 业务报错
  error => {
    console.error('err' + error)
    const response = error.response
    let message = error.message
    if (response.data && response.data.message) {
      message = response.data.message
    }
    if (response.config.hasOwnProperty('message') && response.config.message === '') {
      // 前端指定message为空 出错也不打印message
    } else {
      if (message === 'GENERAL') {
        message = '网络连接失败'
      }
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      console.error(message)
      return Promise.reject(error)
    }
  }
)

export {
  service as request
}
