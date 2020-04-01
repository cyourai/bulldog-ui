import { request } from '@/utils/request'

/**
 * 从后端获取数据生成select控件
 * @param {String} type 根据类型生成控件内容具体跟后端协调
 * @param {String} model 后台模块分类 media/center
 */
export function select(type, model) {
  if (model === '' || typeof model === 'undefined') {
    model = 'media'
  } else if (model === 'user') {
    model = 'user'
  } else {
    model = 'center'
  }
  // model = model === '' || typeof model === 'undefined' ? 'media' : 'center'
  return request({
    message: '',
    url: '/' + model + '/component/select/' + type,
    method: 'get'
  })
}

/**
 * 从后端获取数据生成cascader控件
 * @param {String} model 后台模块分类 media/center
 */
export function cascader(type, model) {
  model = model === '' || typeof model === 'undefined' ? 'center' : model
  return request({
    message: '',
    url: '/' + model + '/component/cascader/' + type,
    method: 'get'
  })
}

/**
 * 从后端获取数据生成cascader控件
 * @param {String} model 后台模块分类 media/center
 */
export function cascaderByKeyWord(type, model, keyWord) {
  model = model === '' || typeof model === 'undefined' ? 'center' : model
  return request({
    message: '',
    url: '/' + model + '/component/cascader/' + type + '/' + keyWord,
    method: 'get'
  })
}
